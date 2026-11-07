/* Conexión de la tienda con el sistema DAYMARSV (stock en vivo y pedidos).
   Si el sistema no responde, la tienda funciona igual con products.js. */
(function () {
  'use strict';
  var SYS = { url: 'https://itafqiemoulcztmhfqah.supabase.co', key: 'sb_publishable_gkdG2OvACj7eGxaa5JSsLw_wO7w0bEB' };
  var user = null, lastSent = { sig: '', t: 0 };
  var AL = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789', CODK = 'daymar_cod_actual', MISK = 'daymar_mis_pedidos';
  function nuevoCodigo() {
    var n, a = new Uint32Array(1);
    try { crypto.getRandomValues(a); n = a[0] % 1000000; } catch (e) { n = Math.floor(Math.random() * 1000000); }
    return 'DY-' + ('00000' + n).slice(-6);
  }
  function codigoActual() {
    try { var c = sessionStorage.getItem(CODK); if (c) return c; c = nuevoCodigo(); sessionStorage.setItem(CODK, c); return c; } catch (e) { return nuevoCodigo(); }
  }
  /* Lista de pedidos de este dispositivo: máximo 5 y se borran solos a los 30 días */
  var MAXMIS = 5, DIASMIS = 30;
  function misPedidos() {
    try {
      var l = JSON.parse(localStorage.getItem(MISK) || '[]'); if (!Array.isArray(l)) return [];
      var lim = Date.now() - DIASMIS * 864e5, v = l.filter(function (x) { return x && x.c && Number(x.t) > lim; }).slice(0, MAXMIS);
      if (v.length !== l.length) localStorage.setItem(MISK, JSON.stringify(v));
      return v;
    } catch (e) { return []; }
  }
  function guardarPedido(c, total) {
    try { var l = misPedidos().filter(function (x) { return x.c !== c; }); l.unshift({ c: c, t: Date.now(), total: total }); localStorage.setItem(MISK, JSON.stringify(l.slice(0, MAXMIS))); } catch (e) {}
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
  /* Línea de tiempo del pedido: pasos con iconos; si se rechaza, vence o cancela, el recorrido termina ahí */
  var PASOS = [
    ['creada', 'Orden creada', 'fa-receipt'],
    ['aceptada', 'Orden aceptada', 'fa-circle-check'],
    ['preparacion', 'En preparación', 'fa-box-open'],
    ['envio', 'En camino', 'fa-truck-fast'],
    ['entregado', 'Entregado', 'fa-house-circle-check']
  ];
  var NIVEL = { recibido: 0, aceptado: 1, preparacion: 2, listo: 3, envio: 3, entregado: 4 };
  var FIN = {
    rechazado: ['Orden rechazada', 'fa-circle-xmark', 'No se pudo atender tu pedido. Escríbenos por WhatsApp y lo resolvemos.'],
    vencido: ['Orden vencida', 'fa-clock', 'Pasaron más de 12 horas sin confirmarse. Escríbenos por WhatsApp si todavía lo quieres.'],
    cancelado: ['Orden cancelada', 'fa-ban', 'Si fue un error, escríbenos por WhatsApp.']
  };
  var MENSAJE = {
    recibido: 'Recibimos tu orden y la estamos revisando. Te confirmamos por WhatsApp.',
    aceptado: 'Tu orden fue aceptada. Pronto empezamos a prepararla.',
    preparacion: 'Estamos alistando tu pedido con cariño.',
    listo: 'Tu pedido está listo. Escríbenos por WhatsApp para coordinar el retiro.',
    envio: 'Tu pedido va en camino hacia ti.',
    entregado: '¡Gracias por tu compra! Esperamos que lo disfrutes.'
  };
  function fechaCorta(t) { try { return new Date(t).toLocaleString('es-SV', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }); } catch (e) { return ''; } }
  function pintarEstado(box, r, cod) {
    if (!r) { box.innerHTML = '<div style="text-align:center;padding:18px 8px"><div style="font-size:34px;color:#a33"><i class="fas fa-circle-question"></i></div><p style="margin:8px 0 0;color:#a33;font-weight:600">No encontramos ese número.</p><p style="margin:4px 0 0;font-size:13.5px;color:var(--muted,#777)">Revisa que esté bien escrito (por ejemplo DY-482915).</p></div>'; return; }
    var W = 'var(--wine,#6b2d3e)', G = 'var(--gold,#b8963e)', fin = FIN[r.estado], items = Array.isArray(r.items) ? r.items : [];
    var sub = items.reduce(function (a, x) { return a + (Number(x.precio) || 0) * (Number(x.cantidad) || 0); }, 0);
    var nivel = fin ? (r.estado === 'cancelado' ? 1 : 0) : (NIVEL[r.estado] == null ? 0 : NIVEL[r.estado]);
    var pasos = PASOS.map(function (p) { return p.slice(); });
    if (r.estado === 'listo') { pasos[3] = ['listo', 'Listo para retirar', 'fa-store']; }
    var lista = fin ? pasos.slice(0, nivel + 1).concat([['fin', fin[0], fin[1]]]) : pasos;
    var titulo = fin ? fin[0] : pasos[nivel][1], icono = fin ? fin[1] : pasos[nivel][2];
    var msg = fin ? fin[2] : (MENSAJE[r.estado] || ''), color = fin ? '#b3392f' : W;
    var tl = lista.map(function (p, i) {
      var esFin = p[0] === 'fin', hecho = esFin || i <= nivel, actual = esFin || (!fin && i === nivel), col = esFin ? '#b3392f' : W;
      var cuando = i === 0 ? fechaCorta(r.creado) : ((actual || (fin && i === nivel)) && r.actualizado ? fechaCorta(r.actualizado) : '');
      var ultimo = i === lista.length - 1;
      return '<div style="display:flex;gap:12px;align-items:stretch">' +
        '<div style="display:flex;flex-direction:column;align-items:center;width:38px;flex:none">' +
          '<div style="width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:15px;flex:none;' +
            (hecho ? 'background:' + col + ';color:#fff;' : 'background:transparent;color:#b9b0b3;border:2px dashed #d8d0d3;box-sizing:border-box;') +
            (actual ? 'box-shadow:0 0 0 5px ' + (esFin ? 'rgba(179,57,47,.15)' : 'rgba(107,45,62,.15)') + ';' : '') + '"><i class="fas ' + p[2] + '"></i></div>' +
          (ultimo ? '' : '<div style="flex:1;width:3px;min-height:18px;margin:3px 0;border-radius:2px;background:' + (i < nivel && !esFin ? W : (hecho && !esFin ? 'linear-gradient(' + W + ',#e4dcdf)' : '#e4dcdf')) + '"></div>') +
        '</div>' +
        '<div style="padding:7px 0 ' + (ultimo ? '0' : '16px') + ';min-width:0"><div style="font-weight:' + (actual ? '800' : '600') + ';font-size:15px;color:' + (hecho ? 'inherit' : '#a89fa2') + '">' + h(p[1]) + '</div>' +
        (cuando ? '<div style="font-size:12.5px;color:var(--muted,#777);margin-top:1px">' + h(cuando) + '</div>' : '') + '</div></div>';
    }).join('');
    box.innerHTML =
      '<div style="text-align:center;padding:6px 0 16px"><div style="width:64px;height:64px;margin:0 auto 10px;border-radius:50%;background:' + color + ';color:#fff;display:flex;align-items:center;justify-content:center;font-size:27px;box-shadow:0 8px 20px rgba(107,45,62,.22)"><i class="fas ' + icono + '"></i></div>' +
      '<div style="font-size:21px;font-weight:800;color:' + color + '">' + h(titulo) + '</div>' +
      '<div style="font:700 12.5px monospace;letter-spacing:.5px;color:var(--muted,#777);margin-top:4px">' + h(r.codigo) + '</div>' +
      '<div style="font-size:14px;margin:8px auto 0;max-width:320px;line-height:1.4">' + h(msg) + '</div></div>' +
      '<div style="border:1px solid var(--line,#e6dde0);border-radius:16px;padding:16px 14px 14px">' + tl + '</div>' +
      '<div style="border:1px solid var(--line,#e6dde0);border-radius:16px;padding:12px 14px;margin-top:12px"><div style="font-weight:800;font-size:13px;letter-spacing:.06em;text-transform:uppercase;color:' + G + ';margin-bottom:6px">Tu pedido</div>' +
      items.map(function (x) { return '<div style="display:flex;justify-content:space-between;gap:10px;font-size:14px;padding:4px 0"><span>' + h(x.cantidad) + ' × ' + h(x.nombre) + '</span><span style="white-space:nowrap">' + usd(x.precio * x.cantidad) + '</span></div>'; }).join('') +
      (Number(r.envio) ? '<div style="display:flex;justify-content:space-between;font-size:14px;padding:4px 0;color:var(--muted,#777)"><span>Envío</span><span>' + usd(r.envio) + '</span></div>' : '') +
      '<div style="display:flex;justify-content:space-between;font-weight:800;font-size:16px;border-top:1px solid var(--line,#e6dde0);margin-top:6px;padding-top:9px"><span>Total</span><span>' + usd(r.total) + '</span></div></div>' +
      '<a href="' + WA + '?text=' + encodeURIComponent('Hola DAYMAR, consulto mi pedido ' + r.codigo) + '" target="_blank" rel="noopener" style="display:flex;align-items:center;justify-content:center;gap:6px;width:fit-content;margin:14px auto 0;padding:8px 16px;border-radius:999px;background:#25d366;color:#fff;font-weight:700;font-size:13.5px;text-decoration:none"><i class="fab fa-whatsapp" style="font-size:16px"></i>Escribir por WhatsApp</a>';
  }
  function pintarSeguimiento(box, r) {
    var fin = FIN[r.estado], items = Array.isArray(r.items) ? r.items : [], INK = '#3a1624', GOLD = '#c9973f';
    var nivel = fin ? 0 : (NIVEL[r.estado] == null ? 0 : NIVEL[r.estado]);
    var pasos = PASOS.map(function (p) { return p.slice(); });
    if (r.estado === 'listo') pasos[3] = ['listo', 'Listo para retirar', 'fa-store'];
    var corto = ['Recibido', 'Aceptado', 'Preparando', 'En camino', 'Entregado'];
    if (r.estado === 'listo') corto[3] = 'Listo';
    var titulo = fin ? fin[0] : pasos[nivel][1], msg = fin ? fin[2] : (MENSAJE[r.estado] || '');
    var cuando = r.actualizado ? fechaCorta(r.actualizado) : fechaCorta(r.creado);
    var fila = fin ? '' :
      '<div style="display:flex;align-items:flex-start;margin:4px -4px 0">' + pasos.map(function (p, i) {
        var hecho = i < nivel, act = i === nivel, ult = i === pasos.length - 1;
        var bg = act ? GOLD : hecho ? INK : '#fff', col = (act || hecho) ? '#fff' : '#b9aab0';
        return '<div style="flex:1;min-width:0;text-align:center;position:relative">' +
          (ult ? '' : '<div style="position:absolute;top:22px;left:50%;width:100%;height:3px;background:' + (hecho ? INK : '#e6dcd9') + ';z-index:0"></div>') +
          '<div style="position:relative;z-index:1;width:46px;height:46px;margin:0 auto;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;background:' + bg + ';color:' + col + ';' + (act ? '' : (hecho ? '' : 'border:2px solid #e6dcd9;box-sizing:border-box;')) + (act ? 'box-shadow:0 0 0 6px rgba(201,151,63,.25);animation:dmglow 2.4s infinite;' : '') + '"><i class="fas ' + (hecho ? 'fa-check' : p[2]) + '"></i></div>' +
          '<div style="margin-top:8px;font-size:11.5px;font-weight:' + (act ? '800' : '600') + ';color:' + (act ? INK : hecho ? INK : '#a89fa2') + ';line-height:1.2">' + h(corto[i]) + '</div></div>';
      }).join('') + '</div>';
    box.innerHTML =
      '<div style="margin-top:26px">' + fila + '</div>' +
      '<div style="margin-top:22px;border-radius:18px;background:#fff;border:1px solid #eadfd8;border-left:5px solid ' + (fin ? '#b3392f' : GOLD) + ';padding:16px 18px;box-shadow:0 6px 18px rgba(58,22,36,.07)">' +
        '<div style="display:flex;align-items:center;gap:8px;font-size:12.5px;color:#8a7a80"><i class="fas ' + (fin ? fin[1] : 'fa-circle-info') + '" style="color:' + (fin ? '#b3392f' : GOLD) + '"></i><span style="font:700 12px monospace;letter-spacing:.06em">' + h(r.codigo) + '</span><span style="margin-left:auto">' + h(cuando) + '</span></div>' +
        '<div style="margin-top:8px;font-size:21px;font-weight:800;color:' + (fin ? '#b3392f' : INK) + '">' + h(titulo) + '</div>' +
        '<p style="margin:6px 0 0;font-size:14.5px;line-height:1.45;color:#5b4950">' + h(msg) + '</p></div>' +
      '<details style="margin-top:12px;border-radius:16px;background:#fff;border:1px solid #eadfd8;padding:2px 16px"><summary style="cursor:pointer;padding:13px 0;font-weight:700;font-size:14px;color:' + INK + ';list-style:none;display:flex;justify-content:space-between"><span><i class="fas fa-bag-shopping" style="color:' + GOLD + ';margin-right:7px"></i>Ver mi pedido</span><span>' + usd(r.total) + ' ▾</span></summary>' +
        '<div style="padding:0 0 12px;font-size:14px;color:#5b4950">' + items.map(function (x) { return '<div style="display:flex;justify-content:space-between;gap:10px;padding:4px 0"><span>' + h(x.cantidad) + ' × ' + h(x.nombre) + '</span><span>' + usd(x.precio * x.cantidad) + '</span></div>'; }).join('') +
        (Number(r.envio) ? '<div style="display:flex;justify-content:space-between;padding:4px 0;color:#8a7a80"><span>Envío</span><span>' + usd(r.envio) + '</span></div>' : '') + '</div></details>' +
      '<a href="' + WA + '?text=' + encodeURIComponent('Hola DAYMAR, consulto mi pedido ' + r.codigo) + '" target="_blank" rel="noopener" style="display:flex;align-items:center;justify-content:center;gap:6px;width:fit-content;margin:16px auto 0;padding:8px 16px;border-radius:999px;background:#25d366;color:#fff;font-weight:700;font-size:13.5px;text-decoration:none"><i class="fab fa-whatsapp" style="font-size:16px"></i>Escribir por WhatsApp</a>';
  }
  function estilosConsulta() {
    if (document.getElementById('dmConsCss')) return;
    var st = document.createElement('style'); st.id = 'dmConsCss';
    st.textContent = '@keyframes dmshake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-7px)}40%,80%{transform:translateX(7px)}}' +
      '@keyframes dmspin{to{transform:rotate(360deg)}}@keyframes dmpop{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}' +
      '@keyframes dmglow{0%,100%{box-shadow:0 0 0 0 rgba(201,151,63,.55)}50%{box-shadow:0 0 0 12px rgba(201,151,63,0)}}' +
      '#dmPedOv .dm-line{display:flex;align-items:center;gap:12px;border-bottom:2px solid rgba(201,151,63,.45);padding-bottom:10px;transition:border-color .2s}' +
      '#dmPedOv .dm-line:focus-within{border-color:#c9973f}#dmPedOv .dm-line.ok{border-color:#2e9d62}#dmPedOv .dm-line.mal{animation:dmshake .4s;border-color:#d9574a}' +
      '#dmPedOv .dm-cin{flex:1;min-width:0;border:0;outline:0;background:transparent;color:#3a1624;font:700 30px/1.1 monospace;letter-spacing:.1em;text-transform:uppercase;padding:6px 0}#dmPedOv .dm-cin::placeholder{color:rgba(58,22,36,.28)}' +
      '#dmPedOv .dm-arrow{flex:none;width:54px;height:54px;border:0;border-radius:50%;background:#c9973f;color:#fff;font-size:20px;cursor:pointer;display:flex;align-items:center;justify-content:center;animation:dmglow 2.4s infinite;transition:transform .15s}#dmPedOv .dm-arrow:active{transform:scale(.92)}#dmPedOv .dm-arrow:disabled{animation:none;opacity:.8}' +
      '#dmPedOv .dm-chip{border:1px solid rgba(201,151,63,.7);border-radius:999px;background:#fff;color:#3a1624;padding:8px 14px;cursor:pointer;font:700 13.5px monospace;letter-spacing:.05em;transition:background .15s,transform .15s}#dmPedOv .dm-chip:hover,#dmPedOv .dm-chip:active{background:rgba(201,151,63,.2);transform:translateY(-1px)}#dmPedOv .dm-chip small{font:600 11px sans-serif;letter-spacing:0;color:rgba(58,22,36,.6);margin-left:6px}' +
      '#dmPedOv .dm-res{animation:dmpop .35s}@media (prefers-reduced-motion:reduce){#dmPedOv *{animation:none!important}}';
    document.head.appendChild(st);
  }
  function formatoCodigo(v) {
    var t = String(v || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (/^DY/.test(t)) { var d = t.slice(2).replace(/\D/g, '').slice(0, 6); return 'DY' + (d ? '-' + d : ''); }
    if (/^DM/.test(t)) { var r = t.slice(2).slice(0, 8); return 'DM' + (r ? '-' + r.slice(0, 4) + (r.length > 4 ? '-' + r.slice(4) : '') : ''); }
    if (/^\d/.test(t)) return 'DY-' + t.replace(/\D/g, '').slice(0, 6);
    return t.slice(0, 2);
  }
  function codigoValido(v) { return /^DY-\d{6}$/.test(v) || /^DM-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(v); }
  function hace(t) { var d = Math.floor((Date.now() - Number(t)) / 864e5); return d <= 0 ? 'Hoy' : d === 1 ? 'Ayer' : 'Hace ' + d + ' días'; }
  function abrirConsulta(pref) {
    estilosConsulta();
    var mis = misPedidos(), puedePegar = !!(navigator.clipboard && navigator.clipboard.readText), SERIF = "var(--font-display,'Cormorant Garamond',Georgia,serif)";
    var o = abrirDlg('Consultar mi pedido',
      '<div id="dmConsHero" style="padding:8px 2px 0">' +
        '<div style="font:800 11.5px/1 sans-serif;letter-spacing:.3em;color:#c9973f;text-transform:uppercase">✦ Daymar · Seguimiento</div>' +
        '<h3 style="margin:16px 0 8px;font:italic 600 clamp(40px,11vw,52px)/1.02 ' + SERIF + ';color:#3a1624">¿Dónde está<br>mi pedido?</h3>' +
        '<p style="margin:0 0 34px;font-size:14.5px;line-height:1.5;color:rgba(58,22,36,.7);max-width:300px">Escribe el número que te dimos y te contamos en qué va.</p></div>' +
      '<div class="dm-line" id="dmPedLine"><input id="dmPedIn" class="dm-cin" type="text" inputmode="text" autocapitalize="characters" autocomplete="off" autocorrect="off" spellcheck="false" placeholder="DY-000000" maxlength="14" aria-label="Número de pedido">' +
        '<button type="button" id="dmPedGo" class="dm-arrow" aria-label="Ver mi pedido"><i class="fas fa-arrow-right"></i></button></div>' +
      '<div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start;margin-top:9px"><div id="dmPedMsg" style="min-height:18px;font-size:12.5px;color:rgba(58,22,36,.6)">Ejemplo: DY-482915</div>' +
        (puedePegar ? '<button type="button" id="dmPedPaste" style="border:0;background:none;color:#c9973f;font-weight:700;font-size:12.5px;text-decoration:underline;cursor:pointer;padding:0;white-space:nowrap">Pegar</button>' : '') + '</div>' +
      (mis.length ? '<div id="dmConsMis" style="margin-top:34px"><div style="display:flex;justify-content:space-between;align-items:center;font:800 11.5px/1 sans-serif;letter-spacing:.2em;color:rgba(58,22,36,.55);text-transform:uppercase"><span>Tus pedidos</span><button type="button" id="dmPedClr" style="border:0;background:none;color:rgba(58,22,36,.55);text-decoration:underline;font-size:12px;font-weight:600;cursor:pointer;padding:0;letter-spacing:0;text-transform:none">Borrar</button></div>' +
        '<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:12px">' + mis.map(function (x) { return '<button type="button" class="dm-chip" data-c="' + h(x.c) + '">' + h(x.c) + '<small>' + hace(x.t) + '</small></button>'; }).join('') + '</div></div>' : '') +
      '<div id="dmConsAyuda" style="margin-top:44px;font-size:13px;color:rgba(58,22,36,.6)">¿No encuentras tu número? <a href="' + WA + '?text=' + encodeURIComponent('Hola DAYMAR, no encuentro el número de mi pedido') + '" target="_blank" rel="noopener" style="color:#c9973f;font-weight:700">Escríbenos por WhatsApp</a></div>' +
      '<div id="dmPedRes" class="dm-res" style="margin-top:6px" aria-live="polite"></div>', true);
    var sh = o.firstChild, hd = sh.firstChild, ttl = hd.querySelector('h2'), xb = hd.querySelector('#dmPedX');
    var inp = o.querySelector('#dmPedIn'), res = o.querySelector('#dmPedRes'), msg = o.querySelector('#dmPedMsg'), go = o.querySelector('#dmPedGo'), line = o.querySelector('#dmPedLine');
    function tema(oscuro) {
      sh.style.background = oscuro ? 'radial-gradient(ellipse 90% 45% at 50% 0%,rgba(201,151,63,.2),transparent 70%),linear-gradient(180deg,#fbf6ee,#f3e9dc)' : '#fbf6ee';
      sh.style.color = oscuro ? '#3a1624' : '#3a1624';
      if (ttl) ttl.style.display = oscuro ? 'none' : ''; hd.style.justifyContent = oscuro ? 'flex-end' : 'space-between';
      if (xb) xb.style.color = oscuro ? '#3a1624' : '';
    }
    tema(true);
    function bloques(v) { ['dmConsHero', 'dmConsMis', 'dmConsAyuda', 'dmPedLine'].forEach(function (i) { var e = o.querySelector('#' + i); if (e) e.style.display = v ? '' : 'none'; }); msg.parentNode.style.display = v ? '' : 'none'; }
    function estado() {
      var v = inp.value; line.classList.remove('mal'); line.classList.toggle('ok', codigoValido(v));
      msg.style.color = codigoValido(v) ? '#2e9d62' : 'rgba(58,22,36,.6)';
      msg.textContent = codigoValido(v) ? '✓ Listo, toca la flecha' : (v ? 'Sigue escribiendo… ejemplo: DY-482915' : 'Ejemplo: DY-482915');
    }
    function mal(t) { line.classList.remove('ok'); line.classList.remove('mal'); void line.offsetWidth; line.classList.add('mal'); msg.style.color = '#b3392f'; msg.textContent = t; inp.focus(); }
    
    function ir() {
      var v = formatoCodigo(inp.value); inp.value = v;
      if (!v) { mal('Escribe tu número de pedido.'); return; }
      if (!codigoValido(v)) { mal('Está incompleto. Debe verse como DY-482915.'); return; }
      go.disabled = true; go.innerHTML = '<i class="fas fa-circle-notch" style="animation:dmspin .8s linear infinite"></i>';
      function fin() { go.disabled = false; go.innerHTML = '<i class="fas fa-arrow-right"></i>'; }
      rpc('tienda_pedido_estado', { p_codigo: v }).then(function (r) { return r.ok ? r.json() : null; }).then(function (r) {
        fin();
        if (!r) { mal('No encontramos ese número. Revísalo e intenta de nuevo.'); return; }
        ['dmConsHero', 'dmConsMis', 'dmConsAyuda'].forEach(function (i) { var e = o.querySelector('#' + i); if (e) e.style.display = 'none'; }); pintarSeguimiento(res, r);
                
      }).catch(function () { fin(); res.innerHTML = ''; mal('No pudimos consultar ahora. Intenta de nuevo en un momento.'); });
    }
    var clr = o.querySelector('#dmPedClr'); if (clr) clr.onclick = function () { try { localStorage.removeItem(MISK); } catch (e) {} abrirConsulta(); };
    var pg = o.querySelector('#dmPedPaste');
    if (pg) pg.onclick = function () { navigator.clipboard.readText().then(function (t) { inp.value = formatoCodigo(t); estado(); if (codigoValido(inp.value)) ir(); }).catch(function () { inp.focus(); }); };
    go.onclick = ir;
    inp.addEventListener('input', function () { inp.value = formatoCodigo(inp.value); estado(); if (res.innerHTML) { res.innerHTML = ''; ['dmConsHero', 'dmConsMis', 'dmConsAyuda'].forEach(function (i) { var e = o.querySelector('#' + i); if (e) e.style.display = ''; }); } });
    inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') ir(); });
    o.querySelectorAll('[data-c]').forEach(function (b) { b.onclick = function () { inp.value = b.dataset.c; estado(); ir(); }; });
    if (pref) { inp.value = formatoCodigo(pref); estado(); ir(); }
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
