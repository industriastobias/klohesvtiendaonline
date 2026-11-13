/* DAYMAR · Instalar la tienda como app */
(function () {
  'use strict';

  var css = document.createElement('style');
  css.textContent =
    '.dm-inst{background:none;border:0;padding:0;margin:12px 0 0;font:inherit;font-size:12.5px;color:inherit;opacity:.9;text-decoration:underline;text-underline-offset:3px;cursor:pointer;display:inline-flex;gap:8px;align-items:center}' +
    '.dm-inst-ov{position:fixed;inset:0;z-index:99999;background:rgba(30,18,24,.55);display:flex;align-items:flex-end;justify-content:center;padding:16px}' +
    '.dm-inst-box{background:#fff;border-radius:22px;padding:22px 22px 18px;max-width:380px;width:100%;color:#3b2c33;font-size:14px;line-height:1.55}.dm-inst-box h3{margin:0 0 10px;font-family:var(--font-display,serif);font-weight:500;font-size:24px;color:var(--wine,#662D42)}' +
    '.dm-inst-box ol{margin:0 0 14px;padding-left:20px}.dm-inst-box li{margin-bottom:6px}.dm-inst-box button{width:100%;border:0;border-radius:99px;padding:13px;background:var(--wine,#662D42);color:#fff;font-weight:700;letter-spacing:.1em;font-size:12px;text-transform:uppercase}';
  document.head.appendChild(css);

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
  try { localStorage.removeItem('daymar_resenas'); } catch (e) {}
  function listo() { botonInstalar(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', listo); else listo();
})();
