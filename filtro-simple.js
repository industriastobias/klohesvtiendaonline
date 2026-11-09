/* Panel de búsqueda más compacto: buscador arriba; "Ordenar" y "Precio" en una sola fila; precio y disponibilidad se despliegan solo al tocar. */
(function () {
  'use strict';
  function listo(fn) { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn); else fn(); }
  listo(function () {
    var tb = document.querySelector('.catalog-search-toolbar'), extra = document.getElementById('catalogExtraFilters');
    if (!tb || !extra) return;
    var css = document.createElement('style');
    css.textContent = '.catalog-search-toolbar{display:block!important}.catalog-sort-field{display:none!important}' +
      '.catalog-search-toolbar .catalog-search-field{grid-column:1/-1}' +
      '.catalog-search-toolbar .catalog-sort-field{display:block;margin:0;min-width:0}' +
      '.catalog-sort-field>span{display:none!important}' +
      '.catalog-sort-field .catalog-sort-trigger{width:100%;min-height:0!important;height:100%;padding:13px 14px!important;font-size:14.5px!important;border-radius:14px}' +
      '.dm-precio{display:inline-flex;align-items:center;gap:8px;border:0;background:none;color:#6b2d3e;font:700 13.5px var(--font-ui,inherit);padding:12px 0 4px;cursor:pointer;text-align:left}' +
      '.dm-precio[aria-expanded=true]{text-decoration:underline}' +
      '#catalogExtraFilters.dm-oculto{display:none!important}';
    document.head.appendChild(css);
    var bt = document.createElement('button'); bt.type = 'button'; bt.className = 'dm-precio'; bt.setAttribute('aria-expanded', 'false');
    bt.innerHTML = '<i class="fas fa-sliders-h" aria-hidden="true"></i><span>Filtrar por precio</span>';
    tb.parentNode.insertBefore(bt, extra);
    extra.classList.add('dm-oculto');
    bt.onclick = function () { var o = extra.classList.toggle('dm-oculto'); bt.setAttribute('aria-expanded', String(!o)); };
  });
})();
