/* Panel de búsqueda más compacto: buscador arriba; "Ordenar" y "Precio" en una sola fila; precio y disponibilidad se despliegan solo al tocar. */
(function () {
  'use strict';
  function listo(fn) { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn); else fn(); }
  listo(function () {
    var tb = document.querySelector('.catalog-search-toolbar'), extra = document.getElementById('catalogExtraFilters');
    if (!tb || !extra) return;
    var css = document.createElement('style');
    css.textContent = '.catalog-search-toolbar{display:grid!important;grid-template-columns:1fr 1fr;gap:10px!important;align-items:stretch}' +
      '.catalog-search-toolbar .catalog-search-field{grid-column:1/-1}' +
      '.catalog-search-toolbar .catalog-sort-field{display:block;margin:0;min-width:0}' +
      '.catalog-sort-field>span{display:none!important}' +
      '.catalog-sort-field .catalog-sort-trigger{width:100%;min-height:0!important;height:100%;padding:13px 14px!important;font-size:14.5px!important;border-radius:14px}' +
      '.dm-precio{display:flex;align-items:center;justify-content:space-between;gap:8px;border:1px solid #e4d9c2;border-radius:14px;background:#fff;color:#3a1624;font:600 14.5px var(--font-ui,inherit);padding:13px 14px;cursor:pointer;text-align:left}' +
      '.dm-precio i{color:#6b2d3e}.dm-precio[aria-expanded=true]{border-color:#6b2d3e}' +
      '#catalogExtraFilters.dm-oculto{display:none!important}';
    document.head.appendChild(css);
    var bt = document.createElement('button'); bt.type = 'button'; bt.className = 'dm-precio'; bt.setAttribute('aria-expanded', 'false');
    bt.innerHTML = '<span>Precio</span><i class="fas fa-sliders-h" aria-hidden="true"></i>';
    tb.appendChild(bt);
    extra.classList.add('dm-oculto');
    bt.onclick = function () { var o = extra.classList.toggle('dm-oculto'); bt.setAttribute('aria-expanded', String(!o)); };
  });
})();
