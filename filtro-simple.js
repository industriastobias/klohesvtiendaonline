/* Panel de búsqueda minimalista: solo el buscador. Sin ordenar ni filtros de precio. */
(function () {
  'use strict';
  function listo(fn) { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn); else fn(); }
  var css = document.createElement('style');
  css.textContent = '.catalog-sort-field,#catalogExtraFilters{display:none!important}.catalog-search-toolbar{display:block!important}';
  document.head.appendChild(css);
  listo(function () {
    ['minPriceFilter', 'maxPriceFilter'].forEach(function (id) { var e = document.getElementById(id); if (e && e.value) { e.value = ''; e.dispatchEvent(new Event('input', { bubbles: true })); } });
    var c = document.getElementById('onlyAvailableFilter'); if (c && c.checked) { c.checked = false; c.dispatchEvent(new Event('change', { bubbles: true })); }
  });
})();
