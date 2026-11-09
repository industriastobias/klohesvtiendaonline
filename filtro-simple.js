/* Filtro simplificado: una sola lista de categorías en una ventana y los filtros de precio ocultos hasta que se necesitan. */
(function () {
  'use strict';
  function listo(fn) { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn); else fn(); }
  listo(function () {
    var rail = document.querySelector('.atelier-category-rail');
    if (!rail) return;
    var botones = Array.prototype.slice.call(rail.querySelectorAll('button'));
    if (!botones.length) return;
    var css = document.createElement('style');
    css.textContent = '.atelier-category-rail{display:none!important}' +
      '.dm-catsel{display:flex;align-items:center;gap:10px;width:100%;max-width:420px;margin:4px 0 20px;padding:13px 16px;border:1px solid rgba(201,151,63,.55);border-radius:14px;background:#fff;color:#3a1624;font:700 15px var(--font-ui,inherit);cursor:pointer;text-align:left;box-shadow:0 4px 14px rgba(58,22,36,.06)}' +
      '.dm-catsel small{font-weight:600;color:#8a7a80;font-size:12px}.dm-catsel b{flex:1}.dm-catsel i{color:#c9973f}' +
      '.dm-catdlg{border:0;padding:0;border-radius:22px 22px 0 0;width:min(520px,100%);max-width:100%;margin:auto auto 0;background:#fbf6ee;color:#3a1624;max-height:82vh;overflow:auto}.dm-catdlg::backdrop{background:rgba(30,10,18,.5)}' +
      '.dm-catdlg h3{margin:0;padding:20px 22px 8px;font:italic 600 26px var(--font-display,Georgia,serif)}' +
      '.dm-catdlg button.dm-row{display:flex;align-items:center;width:100%;border:0;border-top:1px solid #eadfd8;background:transparent;padding:16px 22px;font:600 16px var(--font-ui,inherit);color:#3a1624;cursor:pointer;text-align:left}.dm-catdlg button.dm-row i{margin-left:auto;color:#c9973f;visibility:hidden}.dm-catdlg button.dm-row.on{font-weight:800;background:#fff}.dm-catdlg button.dm-row.on i{visibility:visible}' +
      '.dm-masfil{display:inline-flex;align-items:center;gap:7px;margin-top:10px;border:0;background:none;color:#a9792a;font:700 13.5px var(--font-ui,inherit);cursor:pointer;padding:6px 0}' +
      '#catalogExtraFilters.dm-oculto{display:none!important}';
    document.head.appendChild(css);

    var trig = document.createElement('button');
    trig.type = 'button'; trig.className = 'dm-catsel'; trig.setAttribute('aria-haspopup', 'dialog');
    trig.innerHTML = '<i class="fas fa-layer-group" aria-hidden="true"></i><span><small>Categoría</small><br><b id="dmCatName">Todas</b></span><i class="fas fa-chevron-down" aria-hidden="true" style="margin-left:auto"></i>';
    rail.parentNode.insertBefore(trig, rail);

    var dlg = document.createElement('dialog'); dlg.className = 'dm-catdlg'; dlg.setAttribute('aria-label', 'Elegir categoría');
    dlg.innerHTML = '<h3>Categorías</h3>' + botones.map(function (b, i) {
      return '<button type="button" class="dm-row" data-i="' + i + '"><span>' + b.textContent.trim() + '</span><i class="fas fa-check" aria-hidden="true"></i></button>';
    }).join('');
    document.body.appendChild(dlg);

    function nombre() { var a = botones.filter(function (b) { return b.classList.contains('active'); })[0] || botones[0]; return { n: a.textContent.trim(), i: botones.indexOf(a) }; }
    function pintar() {
      var a = nombre(); trig.querySelector('#dmCatName').textContent = a.n;
      Array.prototype.forEach.call(dlg.querySelectorAll('.dm-row'), function (r) { r.classList.toggle('on', +r.dataset.i === a.i); });
    }
    pintar();
    new MutationObserver(pintar).observe(rail, { attributes: true, subtree: true, attributeFilter: ['class'] });
    trig.onclick = function () { pintar(); if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', ''); };
    dlg.addEventListener('click', function (e) {
      var r = e.target.closest('.dm-row');
      if (r) { botones[+r.dataset.i].click(); dlg.close(); return; }
      if (e.target === dlg) dlg.close();
    });

    var extra = document.getElementById('catalogExtraFilters');
    if (extra) {
      var tg = document.createElement('button'); tg.type = 'button'; tg.className = 'dm-masfil'; tg.setAttribute('aria-expanded', 'false');
      tg.innerHTML = '<i class="fas fa-sliders-h" aria-hidden="true"></i> Precio y disponibilidad <i class="fas fa-chevron-down" aria-hidden="true"></i>';
      extra.classList.add('dm-oculto'); extra.parentNode.insertBefore(tg, extra);
      tg.onclick = function () { var o = extra.classList.toggle('dm-oculto'); tg.setAttribute('aria-expanded', String(!o)); };
    }
  });
})();
