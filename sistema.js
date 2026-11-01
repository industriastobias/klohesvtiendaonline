/* Conexión de la tienda con el sistema DAYMARSV (stock en vivo y pedidos).
   Si el sistema no responde, la tienda funciona igual con products.js. */
(function () {
  'use strict';
  var SYS = { url: 'https://itafqiemoulcztmhfqah.supabase.co', key: 'sb_publishable_gkdG2OvACj7eGxaa5JSsLw_wO7w0bEB' };
  var user = null, lastSent = { sig: '', t: 0 };

  function rpc(fn, body, opts) {
    return fetch(SYS.url + '/rest/v1/rpc/' + fn, Object.assign({
      method: 'POST',
      headers: { 'apikey': SYS.key, 'Authorization': 'Bearer ' + SYS.key, 'Content-Type': 'application/json' },
      body: JSON.stringify(body || {})
    }, opts || {}));
  }

  /* 1) Stock en vivo (espera máximo 2.5 s; nunca bloquea la tienda) */
  var ready = new Promise(function (done) {
    var timer = setTimeout(done, 2500);
    rpc('tienda_stock').then(function (r) { return r.ok ? r.json() : []; }).then(function (rows) {
      var map = {};
      (rows || []).forEach(function (x) { if (x && x.codigo) map[String(x.codigo).trim().toLowerCase()] = x; });
      if (typeof products !== 'undefined' && Array.isArray(products) && Object.keys(map).length) {
        var found = 0;
        products.forEach(function (p) {
          if (!p || typeof p !== 'object') return;
          var key = String(p.sys || p.barcode || '').trim().toLowerCase();
          var s = map[key];
          if (s) { p.stock = Number(s.stock) || 0; p._sistema = true; found++; }
        });
        window.DAYMAR_SYS_STATS = { enSistema: found, total: products.length };
      }
    }).catch(function () {}).then(function () { clearTimeout(timer); done(); });
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
          imagen: (typeof getWhatsAppProductImage === 'function' ? getWhatsAppProductImage(live) : '') || ''
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
      rpc('tienda_pedido', { p_cliente: cliente, p_items: items }, { keepalive: true }).catch(function () {});
    } catch (e) { /* nunca debe afectar la compra por WhatsApp */ }
  }
  document.addEventListener('click', function (ev) {
    var b = ev.target && ev.target.closest && ev.target.closest('#whatsappBtn');
    if (b && b.style.display !== 'none') enviarPedido();
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
      var i = t.indexOf('\n\n*Datos de entrega*'); if (i >= 0) t = t.slice(0, i);
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

  window.DaymarSistema = { ready: ready, setUser: function (u) { user = u || null; rellenarUsuario(); } };
})();
