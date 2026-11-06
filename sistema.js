/* Conexión de la tienda con el sistema DAYMARSV (stock en vivo y pedidos).
   Si el sistema no responde, la tienda funciona igual con products.js. */
(function () {
  'use strict';
  var SYS = { url: 'https://itafqiemoulcztmhfqah.supabase.co', key: 'sb_publishable_gkdG2OvACj7eGxaa5JSsLw_wO7w0bEB' };
  var user = null, lastSent = { sig: '', t: 0 };
  var AL = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789', CODK = 'daymar_cod_actual', MISK = 'daymar_mis_pedidos';
  function nuevoCodigo() {
    var r = '', a = new Uint8Array(8);
    try { crypto.getRandomValues(a); } catch (e) { for (var k = 0; k < 8; k++) a[k] = Math.floor(Math.random() * 256); }
    for (var i = 0; i < 8; i++) r += AL.charAt(a[i] % AL.length);
    return 'DM-' + r.slice(0, 4) + '-' + r.slice(4);
  }
  function codigoActual() {
    try { var c = sessionStorage.getItem(CODK); if (c) return c; c = nuevoCodigo(); sessionStorage.setItem(CODK, c); return c; } catch (e) { return nuevoCodigo(); }
  }
  function misPedidos() { try { var l = JSON.parse(localStorage.getItem(MISK) || '[]'); return Array.isArray(l) ? l : []; } catch (e) { return []; } }
  function guardarPedido(c, total) {
    try { var l = misPedidos().filter(function (x) { return x.c !== c; }); l.unshift({ c: c, t: Date.now(), total: total }); localStorage.setItem(MISK, JSON.stringify(l.slice(0, 8))); } catch (e) {}
  }

  function rpc(fn, body, opts) {
    return fetch(SYS.url + '/rest/v1/rpc/' + fn, Object.assign({
      method: 'POST',
      headers: { 'apikey': SYS.key, 'Authorization': 'Bearer ' + SYS.key, 'Content-Type': 'application/json' },
      body: JSON.stringify(body || {})
    }, opts || {}));
  }

  /* 1) Catálogo y stock desde el sistema (espera máximo 4 s; nunca bloquea la tienda).
        Si el sistema no responde, se usa la última copia guardada o, si no hay, la lista de products.js. */
  var CK = 'daymar_catalogo_v1', FRESCO = 2 * 60 * 1000;
  function leerCache() { try { var c = JSON.parse(localStorage.getItem(CK) || 'null'); return c && Array.isArray(c.p) ? c : null; } catch (e) { return null; } }
  function guardarCache(p) { try { localStorage.setItem(CK, JSON.stringify({ t: Date.now(), p: p })); } catch (e) {} }
  function aplicarCatalogo(lista) {
    if (typeof products === 'undefined' || !Array.isArray(products) || !Array.isArray(lista)) return false;
    var nuevos = lista.filter(function (x) { return x && x.barcode && x.name; }).map(function (x) {
      var o = { name: String(x.name), price: Number(x.price) || 0, stock: Math.max(0, Number(x.stock) || 0), barcode: String(x.barcode), category: x.category || 'Otros', _sistema: true, discount: Math.max(0, Math.min(90, Number(x.discount) || 0)) };
      if (x.description) o.description = String(x.description);
      if (Array.isArray(x.images) && x.images.length) o.images = x.images.map(String);
      if (Array.isArray(x.thumbs) && x.thumbs.length) o.thumbs = x.thumbs.map(String);
      return o;
    });
    products.length = 0;
    nuevos.forEach(function (o) { products.push(o); });
    window.DAYMAR_SYS_STATS = { enSistema: nuevos.length, total: nuevos.length, catalogo: true };
    return true;
  }
  function stockSolo() {
    /* respaldo: la lista fija de la tienda, con el stock en vivo del sistema */
    return rpc('tienda_stock').then(function (r) { return r.ok ? r.json() : []; }).then(function (rows) {
      var map = {};
      (rows || []).forEach(function (x) { if (x && x.codigo) map[String(x.codigo).trim().toLowerCase()] = x; });
      if (typeof products !== 'undefined' && Array.isArray(products) && Object.keys(map).length) {
        var found = 0;
        products.forEach(function (p) {
          if (!p || typeof p !== 'object') return;
          var s = map[String(p.sys || p.barcode || '').trim().toLowerCase()];
          if (s) { p.stock = Number(s.stock) || 0; p._sistema = true; found++; }
        });
        window.DAYMAR_SYS_STATS = { enSistema: found, total: products.length };
      }
    });
  }
  var ready = new Promise(function (done) {
    var cerrado = false, timer = setTimeout(function () { cerrado = true; done(); }, 4000), cache = leerCache();
    if (cache && Date.now() - cache.t < FRESCO && aplicarCatalogo(cache.p)) { clearTimeout(timer); done(); return; }
    rpc('tienda_catalogo').then(function (r) { return r.ok ? r.json() : null; }).then(function (lista) {
      if (Array.isArray(lista)) { guardarCache(lista); if (!cerrado) aplicarCatalogo(lista); return; }
      if (cerrado) return;
      if (cache && aplicarCatalogo(cache.p)) return;
      return stockSolo();
    }).catch(function () {
      if (cerrado) return;
      if (cache && aplicarCatalogo(cache.p)) return;
      return stockSolo().catch(function () {});
    }).then(function () { clearTimeout(timer); done(); });
  });

  /* 2) Pedido hacia el sistema al tocar el botón de WhatsApp (no cambia lo que ya hace) */
  function enviarPedido() {
    try {
      if (typeof AppState === 'undefined' || !AppState.cart || !AppState.cart.length) return;
      var items = [];
      AppState.cart.forEach(function (it) {
        var live = products.find(function (p) { return String(p.barcode) === String(it.barcode); });
        if (!live || !(Number(live.stock) > 0)) return;
        items.push({
          codigo: String(it.barcode), sys: live.sys ? String(live.sys) : null, nombre: live.name || it.name,
          cantidad: Math.max(1, Math.min(99, Number(it.quantity) || 1)), precio: Number(getProductPrice(live)) || 0,
          imagen: ''
        });
      });
      if (!items.length) return;
      var sig = JSON.stringify(items), now = Date.now();
      if (sig === lastSent.sig && now - lastSent.t < 60000) return;
      lastSent = { sig: sig, t: now };
      var d = datos();
      var cliente = {
        nombre: d.nombre || (user && user.displayName) || '', correo: d.correo || (user && user.email) || '', telefono: d.telefono, direccion: d.direccion,
        envio: (AppState.shippingEnabled ? CONFIG.shippingCost : 0), metodo: 'Efectivo', nota: 'Pedido desde la tienda en línea'
      };
      var cod = codigoActual(), tot = items.reduce(function (a, x) { return a + x.precio * x.cantidad; }, 0) + (Number(cliente.envio) || 0);
      rpc('tienda_pedido', { p_cliente: cliente, p_items: items, p_codigo: cod }, { keepalive: true })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (c) {
          var real = typeof c === 'string' && c ? c : null;
          if (!real) return;
          try { sessionStorage.removeItem(CODK); } catch (e) {}
          guardarPedido(real, tot); try { aplicarAlEnlace(); } catch (e) {} mostrarNumero(real);
        }).catch(function () {});
    } catch (e) { /* nunca debe afectar la compra por WhatsApp */ }
  }
  document.addEventListener('click', function (ev) {
    var b = ev.target && ev.target.closest && ev.target.closest('#whatsappBtn');
    if (b && b.style.display !== 'none') { try { aplicarAlEnlace(); } catch (e) {} enviarPedido(); }
  }, true);


  /* 3) Datos de entrega opcionales: el cliente puede llenarlos en la tienda y se agregan al mensaje de WhatsApp y al pedido */
  var CAMPOS = [['nombre', 'Nombre', 'text', 'name'], ['telefono', 'Teléfono', 'tel', 'tel'], ['correo', 'Correo (para tu garantía)', 'email', 'email'], ['direccion', 'Dirección de entrega', 'text', 'street-address']];
  var KEY = 'daymar_datos_entrega', applying = false;
  function leer() { try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { return {}; } }
  function guardar(o) { try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {} }
  function limpio(v, n) { return String(v == null ? '' : v).replace(/[\r\n]+/g, ' ').trim().slice(0, n || 120); }
  function datos() {
    var o = leer(), r = {};
    CAMPOS.forEach(function (c) { var el = document.getElementById('dmEnt_' + c[0]); r[c[0]] = limpio(el ? el.value : o[c[0]], c[0] === 'direccion' ? 300 : 120); });
    return r;
  }
  function aplicarAlEnlace() {
    var b = document.getElementById('whatsappBtn');
    if (!b || !b.href || b.href.indexOf('wa.me') < 0) return;
    try {
      var m = b.href.match(/^([^?]*\?text=)([^&]*)(.*)$/); if (!m) return;
      var t = decodeURIComponent(m[2].replace(/\+/g, ' '));
      var i = t.indexOf('\n\n*Pedido:'); if (i < 0) i = t.indexOf('\n\n*Datos de entrega*'); if (i >= 0) t = t.slice(0, i);
      t += '\n\n*Pedido: ' + codigoActual() + '*';
      var d = datos();
      if (d.nombre || d.telefono || d.correo || d.direccion) t += '\n\n*Datos de entrega*\nYa llené mis datos en la tienda. ¿Me confirmas si están correctos?';
      var nuevo = m[1] + encodeURIComponent(t) + m[3];
      if (nuevo !== b.href) { applying = true; b.href = nuevo; applying = false; }
    } catch (e) { applying = false; }
  }
  function montarForm() {
    var foot = document.querySelector('.dm-cart-footer'), b = document.getElementById('whatsappBtn');
    if (!foot || !b || document.getElementById('dmEntrega')) return;
    var o = leer(), det = document.createElement('details');
    det.id = 'dmEntrega'; det.style.cssText = 'margin:10px 0;border:1px solid var(--line);border-radius:10px;padding:8px 12px;background:transparent';
    det.innerHTML = '<summary style="cursor:pointer;font-size:12.5px;font-weight:600;color:var(--wine)">Dirección de envío</summary>' +
      '<p style="margin:8px 0 6px;font-size:11.5px;color:var(--muted)">Así no tenemos que pedírtelos por WhatsApp. Se guardan solo en tu navegador.</p>' +
      CAMPOS.map(function (c) {
        return '<input id="dmEnt_' + c[0] + '" type="' + c[2] + '" autocomplete="' + c[3] + '" placeholder="' + c[1] + '" maxlength="' + (c[0] === 'direccion' ? 300 : 120) + '" style="width:100%;box-sizing:border-box;margin:0 0 6px;padding:9px 10px;font:inherit;font-size:13px;border:1px solid var(--line);border-radius:8px;background:transparent;color:inherit">';
      }).join('');
    var desc = document.getElementById('cartShippingDescription');
    if (desc && desc.parentNode) desc.parentNode.insertBefore(det, desc.nextSibling); else foot.insertBefore(det, foot.querySelector('.payment-note') || b);
    CAMPOS.forEach(function (c) {
      var el = document.getElementById('dmEnt_' + c[0]);
      el.value = o[c[0]] || (c[0] === 'nombre' && user && user.displayName) || (c[0] === 'correo' && user && user.email) || '';
      el.addEventListener('input', function () { var d = datos(); guardar(d); aplicarAlEnlace(); });
    });
    new MutationObserver(function () { if (!applying) aplicarAlEnlace(); }).observe(b, { attributes: true, attributeFilter: ['href'] });
    aplicarAlEnlace();
  }
  function rellenarUsuario() {
    CAMPOS.forEach(function (c) {
      var el = document.getElementById('dmEnt_' + c[0]);
      if (el && !el.value) el.value = (c[0] === 'nombre' && user && user.displayName) || (c[0] === 'correo' && user && user.email) || '';
    });
    aplicarAlEnlace();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', montarForm); else montarForm();
  window.addEventListener('load', montarForm);


  /* 4) Número de pedido y consulta del estado */
  var ESTADOS = {
    recibido: ['Recibido', 'Lo estamos revisando. Te confirmamos por WhatsApp.'],
    aceptado: ['Aceptado', 'Tu pedido fue confirmado.'],
    preparacion: ['En preparación', 'Estamos alistando tu pedido.'],
    listo: ['Listo para retirar', 'Tu pedido está listo. Escríbenos por WhatsApp para coordinar.'],
    envio: ['En camino', 'Tu pedido va en camino hacia ti.'],
    entregado: ['Entregado', '¡Gracias por tu compra!'],
    rechazado: ['No se pudo atender', 'Escríbenos por WhatsApp y lo resolvemos.'],
    vencido: ['Venció sin confirmarse', 'Pasaron más de 12 horas. Escríbenos por WhatsApp si todavía lo quieres.'],
    cancelado: ['Cancelado', 'Si fue un error, escríbenos por WhatsApp.']
  };
  var WA = 'https://wa.me/50366711569';
  function h(t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function usd(n) { return '$' + (Number(n) || 0).toFixed(2); }
  function cerrarDlg() { var o = document.getElementById('dmPedOv'); if (o) o.remove(); document.documentElement.style.overflow = ''; }
  function abrirDlg(titulo, html, completa) {
    cerrarDlg();
    var o = document.createElement('div'); o.id = 'dmPedOv'; o.setAttribute('role', 'dialog'); o.setAttribute('aria-modal', 'true'); o.setAttribute('aria-label', titulo);
    o.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(20,10,14,.55);display:flex;align-items:flex-end;justify-content:center;padding:0;font-family:inherit';
    o.innerHTML = '<div style="background:var(--surface,#fff);color:var(--ink,#2a1a1f);width:100%;max-width:460px;max-height:90vh;overflow:auto;border-radius:20px 20px 0 0;padding:20px 18px 24px;box-shadow:0 -8px 30px rgba(0,0,0,.25);overscroll-behavior:contain">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:12px"><h2 style="margin:0;font-size:19px">' + h(titulo) + '</h2><button type="button" id="dmPedX" aria-label="Cerrar" style="border:0;background:transparent;font-size:26px;line-height:1;cursor:pointer;color:inherit;padding:4px 8px">×</button></div>' + html + '</div>';
    if (completa && window.matchMedia && window.matchMedia('(max-width:700px)').matches) {
      o.style.alignItems = 'stretch';
      var sh = o.firstChild; sh.style.maxWidth = 'none'; sh.style.maxHeight = 'none'; sh.style.height = '100%'; sh.style.borderRadius = '0';
      sh.style.boxSizing = 'border-box'; sh.style.paddingTop = 'calc(20px + env(safe-area-inset-top,0px))'; sh.style.paddingBottom = 'calc(24px + env(safe-area-inset-bottom,0px))';
    }
    o.addEventListener('click', function (e) { if (e.target === o) cerrarDlg(); });
    document.body.appendChild(o); document.documentElement.style.overflow = 'hidden';
    document.getElementById('dmPedX').onclick = cerrarDlg;
    return o;
  }
  var BTN = 'display:inline-block;border:0;border-radius:12px;padding:12px 16px;font-weight:700;font-size:15px;cursor:pointer;text-decoration:none;text-align:center;';
  function mostrarNumero(c) {
    var o = abrirDlg('Tu número de pedido',
      '<p style="margin:0 0 10px;font-size:14px">Guárdalo para consultar el estado de tu pedido cuando quieras.</p>' +
      '<div style="font:700 28px/1.2 monospace;letter-spacing:.04em;text-align:center;padding:14px;border:2px dashed var(--wine,#6b2d3e);border-radius:14px;margin-bottom:12px;user-select:all">' + h(c) + '</div>' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap"><button type="button" id="dmPedCp" style="' + BTN + 'flex:1;background:var(--wine,#6b2d3e);color:#fff">Copiar número</button><button type="button" id="dmPedCons" style="' + BTN + 'flex:1;background:transparent;color:var(--wine,#6b2d3e);border:1.5px solid var(--wine,#6b2d3e)">Ver estado</button></div>');
    o.querySelector('#dmPedCp').onclick = function () { var b = this; try { navigator.clipboard.writeText(c).then(function () { b.textContent = '¡Copiado!'; }); } catch (e) { b.textContent = c; } };
    o.querySelector('#dmPedCons').onclick = function () { abrirConsulta(c); };
  }
  function pintarEstado(box, r, cod) {
    if (!r) { box.innerHTML = '<p style="color:#a33;margin:0">No encontramos ese número. Revisa que esté bien escrito (por ejemplo DM-7K4P-2QX9).</p>'; return; }
    var e = ESTADOS[r.estado] || [r.estado, ''], items = Array.isArray(r.items) ? r.items : [];
    var sub = items.reduce(function (a, x) { return a + (Number(x.precio) || 0) * (Number(x.cantidad) || 0); }, 0);
    box.innerHTML = '<div style="border:1px solid var(--line,#ddd);border-radius:14px;padding:14px">' +
      '<div style="font:700 13px monospace;color:var(--muted,#777)">' + h(r.codigo) + ' · ' + h(new Date(r.creado).toLocaleString('es-SV', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })) + '</div>' +
      '<div style="font-size:20px;font-weight:800;margin:6px 0 2px">' + h(e[0]) + '</div><div style="font-size:14px;margin-bottom:10px">' + h(e[1]) + '</div>' +
      items.map(function (x) { return '<div style="display:flex;justify-content:space-between;gap:10px;font-size:14px;padding:3px 0"><span>' + h(x.cantidad) + ' × ' + h(x.nombre) + '</span><span>' + usd(x.precio * x.cantidad) + '</span></div>'; }).join('') +
      (Number(r.envio) ? '<div style="display:flex;justify-content:space-between;font-size:14px;padding:3px 0"><span>Envío</span><span>' + usd(r.envio) + '</span></div>' : '') +
      '<div style="display:flex;justify-content:space-between;font-weight:800;border-top:1px solid var(--line,#ddd);margin-top:6px;padding-top:8px"><span>Total</span><span>' + usd(r.total) + '</span></div></div>' +
      '<a href="' + WA + '?text=' + encodeURIComponent('Hola DAYMAR, consulto mi pedido ' + r.codigo) + '" target="_blank" rel="noopener" style="' + BTN + 'display:block;margin-top:12px;background:#25d366;color:#fff">Escribir por WhatsApp</a>';
  }
  function abrirConsulta(pref) {
    var mis = misPedidos();
    var o = abrirDlg('Consultar mi pedido',
      '<p style="margin:0 0 10px;font-size:14px">Escribe el número que te dimos al hacer tu pedido.</p>' +
      '<div style="display:flex;gap:8px"><input id="dmPedIn" type="text" inputmode="text" autocapitalize="characters" autocomplete="off" placeholder="DM-XXXX-XXXX" maxlength="14" style="flex:1;min-width:0;box-sizing:border-box;padding:12px;border:1.5px solid var(--line,#ccc);border-radius:12px;font:600 16px monospace;text-transform:uppercase"><button type="button" id="dmPedGo" style="' + BTN + 'background:var(--wine,#6b2d3e);color:#fff">Ver</button></div>' +
      (mis.length ? '<div style="margin:12px 0 4px;font-size:12.5px;color:var(--muted,#777)">Tus pedidos en este dispositivo:</div><div style="display:flex;gap:6px;flex-wrap:wrap">' + mis.map(function (x) { return '<button type="button" data-c="' + h(x.c) + '" style="border:1px solid var(--line,#ccc);background:transparent;color:inherit;border-radius:999px;padding:7px 12px;font:600 13px monospace;cursor:pointer">' + h(x.c) + '</button>'; }).join('') + '</div>' : '') +
      '<div id="dmPedRes" style="margin-top:14px" aria-live="polite"></div>', true);
    var inp = o.querySelector('#dmPedIn'), res = o.querySelector('#dmPedRes');
    function ir() {
      var v = inp.value.trim(); if (!v) { inp.focus(); return; }
      res.innerHTML = '<p style="margin:0;color:var(--muted,#777)">Buscando…</p>';
      rpc('tienda_pedido_estado', { p_codigo: v }).then(function (r) { return r.ok ? r.json() : null; }).then(function (r) { pintarEstado(res, r, v); })
        .catch(function () { res.innerHTML = '<p style="color:#a33;margin:0">No pudimos consultar ahora. Intenta de nuevo en un momento.</p>'; });
    }
    o.querySelector('#dmPedGo').onclick = ir;
    inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') ir(); });
    o.querySelectorAll('[data-c]').forEach(function (b) { b.onclick = function () { inp.value = b.dataset.c; ir(); }; });
    if (pref) { inp.value = pref; ir(); } else if (mis.length) { inp.value = mis[0].c; }
  }
  function montarConsulta() {
    ['dmConsHdr', 'dmConsNav'].forEach(function (id) { var hb = document.getElementById(id); if (hb && !hb.dataset.ok) { hb.dataset.ok = '1'; hb.onclick = function () { abrirConsulta(); }; } });
    var tag = document.querySelector('.dm-footer-tagline');
    if (tag && !document.getElementById('dmConsFt')) {
      var b = document.createElement('button'); b.type = 'button'; b.id = 'dmConsFt'; b.textContent = 'Consultar mi pedido';
      b.style.cssText = 'margin:10px 0 0;background:transparent;border:1.5px solid currentColor;color:inherit;border-radius:999px;padding:9px 16px;font-weight:700;font-size:13.5px;cursor:pointer';
      b.onclick = function () { abrirConsulta(); }; tag.parentNode.insertBefore(b, tag.nextSibling);
    }
    var pn = document.querySelector('.dm-cart-footer .payment-note');
    if (pn && !document.getElementById('dmConsCart')) {
      var a = document.createElement('button'); a.type = 'button'; a.id = 'dmConsCart'; a.textContent = '¿Ya hiciste un pedido? Consultar estado';
      a.style.cssText = 'display:block;margin:8px auto 0;background:none;border:0;color:var(--wine,#6b2d3e);text-decoration:underline;font-size:12.5px;font-weight:600;cursor:pointer;padding:4px';
      a.onclick = function () { abrirConsulta(); }; pn.parentNode.insertBefore(a, pn.nextSibling);
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', montarConsulta); else montarConsulta();
  window.addEventListener('load', montarConsulta);

  window.DaymarSistema = { ready: ready, setUser: function (u) { user = u || null; rellenarUsuario(); } };
})();
