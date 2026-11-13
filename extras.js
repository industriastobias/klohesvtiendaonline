/* DAYMAR · Reseñas de clientas + instalar la tienda como app */
(function () {
  'use strict';
  var SYS = { url: 'https://itafqiemoulcztmhfqah.supabase.co', key: 'sb_publishable_gkdG2OvACj7eGxaa5JSsLw_wO7w0bEB' };
  function h(t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  /* ---------- Reseñas ---------- */
  var css = document.createElement('style');
  css.textContent =
    '.dm-res{padding:46px 0 38px;background:var(--cream,#FBF8F5)}.dm-res h2{font-family:var(--font-display,serif);font-weight:500;font-size:clamp(26px,5vw,36px);text-align:center;margin:0 0 4px;color:var(--wine,#662D42)}' +
    '.dm-res .dm-res-sub{text-align:center;font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:#9A8F94;margin:0 0 22px}' +
    '.dm-res-row{display:flex;gap:12px;overflow-x:auto;scroll-snap-type:x mandatory;padding:4px 20px 14px;scrollbar-width:none;-webkit-overflow-scrolling:touch}.dm-res-row::-webkit-scrollbar{display:none}' +
    '.dm-res-card{flex:0 0 min(82%,320px);scroll-snap-align:center;background:#fff;border:1px solid var(--line,#E7DFD9);border-radius:18px;padding:18px 18px 16px;box-shadow:0 4px 14px rgba(58,22,36,.06)}' +
    '.dm-res-st{color:#b8934a;letter-spacing:3px;font-size:14px;margin-bottom:8px}.dm-res-card p{margin:0 0 12px;font-size:14px;line-height:1.55;color:#4a3f44}' +
    '.dm-res-card b{display:block;font-size:11.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--wine,#662D42)}.dm-res-card small{display:block;margin-top:2px;font-size:11px;color:#9A8F94}' +
    '@media(min-width:900px){.dm-res-row{justify-content:center;flex-wrap:wrap;overflow:visible;max-width:1100px;margin:0 auto}.dm-res-card{flex:0 1 320px}}' +
    '.dm-inst{background:none;border:0;padding:0;margin:12px 0 0;font:inherit;font-size:12.5px;color:inherit;opacity:.9;text-decoration:underline;text-underline-offset:3px;cursor:pointer;display:inline-flex;gap:8px;align-items:center}' +
    '.dm-inst-ov{position:fixed;inset:0;z-index:99999;background:rgba(30,18,24,.55);display:flex;align-items:flex-end;justify-content:center;padding:16px}' +
    '.dm-inst-box{background:#fff;border-radius:22px;padding:22px 22px 18px;max-width:380px;width:100%;color:#3b2c33;font-size:14px;line-height:1.55}.dm-inst-box h3{margin:0 0 10px;font-family:var(--font-display,serif);font-weight:500;font-size:24px;color:var(--wine,#662D42)}' +
    '.dm-inst-box ol{margin:0 0 14px;padding-left:20px}.dm-inst-box li{margin-bottom:6px}.dm-inst-box button{width:100%;border:0;border-radius:99px;padding:13px;background:var(--wine,#662D42);color:#fff;font-weight:700;letter-spacing:.1em;font-size:12px;text-transform:uppercase}';
  document.head.appendChild(css);

  function pintarResenas(list) {
    if (!list || !list.length) return;
    var faq = document.getElementById('preguntas-frecuentes'); if (!faq || document.getElementById('dmResenas')) return;
    var s = document.createElement('section'); s.className = 'dm-res'; s.id = 'dmResenas'; s.setAttribute('aria-label', 'Reseñas de clientas');
    s.innerHTML = '<h2>Lo que dicen nuestras clientas</h2><p class="dm-res-sub">Reseñas reales</p><div class="dm-res-row">' +
      list.map(function (r) {
        var n = Math.max(1, Math.min(5, Number(r.e) || 5));
        return '<article class="dm-res-card"><div class="dm-res-st" aria-label="' + n + ' de 5 estrellas">' + '★'.repeat(n) + '☆'.repeat(5 - n) + '</div><p>“' + h(r.t) + '”</p><b>' + h(r.n) + '</b>' + (r.p ? '<small>' + h(r.p) + '</small>' : '') + '</article>';
      }).join('') + '</div>';
    faq.parentNode.insertBefore(s, faq);
  }
  var cached = null; try { cached = JSON.parse(localStorage.getItem('daymar_resenas') || 'null'); } catch (e) {}
  function iniciar() {
    pintarResenas(cached);
    var ctl = new AbortController(), t = setTimeout(function () { ctl.abort(); }, 5000);
    fetch(SYS.url + '/rest/v1/rpc/tienda_resenas', { method: 'POST', signal: ctl.signal, headers: { apikey: SYS.key, Authorization: 'Bearer ' + SYS.key, 'Content-Type': 'application/json' }, body: '{}' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) { clearTimeout(t); if (!Array.isArray(d)) return; try { localStorage.setItem('daymar_resenas', JSON.stringify(d)); } catch (e) {} var old = document.getElementById('dmResenas'); if (old) old.remove(); pintarResenas(d); })
      .catch(function () {});
  }

  /* ---------- Instalar como app ---------- */
  var standalone = (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true;
  var deferred = null;
  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); deferred = e; });
  function guia() {
    var ua = navigator.userAgent || '', ios = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    var pasos = ios
      ? '<li>Toca el botón <b>Compartir</b> (el cuadrito con la flecha hacia arriba).</li><li>Elige <b>Agregar a inicio</b>.</li><li>Toca <b>Agregar</b>. Listo, DAYMAR queda en tu pantalla.</li>'
      : '<li>Toca el menú <b>⋮</b> del navegador.</li><li>Elige <b>Instalar app</b> o <b>Agregar a pantalla de inicio</b>.</li><li>Confirma. Listo, DAYMAR queda en tu pantalla.</li>';
    var ov = document.createElement('div'); ov.className = 'dm-inst-ov';
    ov.innerHTML = '<div class="dm-inst-box" role="dialog" aria-modal="true" aria-label="Instalar DAYMAR"><h3>Lleva DAYMAR en tu celular</h3><ol>' + pasos + '</ol><button type="button">Entendido</button></div>';
    ov.addEventListener('click', function (e) { if (e.target === ov || e.target.tagName === 'BUTTON') ov.remove(); });
    document.body.appendChild(ov);
  }
  function instalar() {
    if (deferred) { deferred.prompt(); deferred.userChoice.then(function () { deferred = null; }).catch(function () {}); return; }
    guia();
  }
  function botonInstalar() {
    if (standalone) return;
    var social = document.querySelector('.dm-footer-social'); if (!social || document.getElementById('dmInstalar')) return;
    var b = document.createElement('button'); b.type = 'button'; b.id = 'dmInstalar'; b.className = 'dm-inst';
    b.innerHTML = '<i class="fas fa-mobile-screen-button" aria-hidden="true"></i><span>Instalar la tienda en tu celular</span>';
    b.onclick = instalar; social.parentNode.insertBefore(b, social.nextSibling);
  }
  function listo() { iniciar(); botonInstalar(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', listo); else listo();
})();
