        // ==========================================
        // CONFIGURACION
        // ==========================================
        const CONFIG = {
            productsPerPage: 20,
            preloadOffset: '200px',
            whatsappVisibleDuration: 10000,
            whatsappHiddenDuration: 180000,
            shippingCost: 4.00,
            phoneNumber: '50366711569'
        };

        // ==========================================
        // VARIABLES GLOBALES
        // ==========================================
        let loadingImages = new Map();
        let scrollObserver = null;
        let imageObserver = null;
        let notificationTimer = null;

        // ==========================================
        // ESTADO DE LA APLICACION
        // ==========================================
        const AppState = {
            currentFilter: localStorage.getItem('daymar_last_category') || 'todos',
            cart: JSON.parse(localStorage.getItem('daymar_cart')) || [],
            favorites: JSON.parse(localStorage.getItem('daymar_favorites')) || [],
            currentPage: 0,
            filteredProducts: [],
            shippingEnabled: false,
            isLoading: false,
            hasMoreProducts: true,
            currentTestimonial: 0,
            searchTerm: '',
            currentStoryImage: null,
            isMobile: false,
            currentSort: 'default',
            viewedProducts: JSON.parse(localStorage.getItem('daymar_viewed_products') || '{}')
        };

        // ==========================================
        // FONDO ANIMADO
        // ==========================================
        function initFloatingHearts() {
            const container = document.getElementById('floatingHearts');
            if (!container) return;
            
            const icons = ['☀️', '✨', '🌊', '🐚', '🌴', '🕶️', '👒', '🩴'];
            
            for (let i = 0; i < 12; i++) {
                const el = document.createElement('div');
                const isCloud = i % 3 === 0;
                el.className = isCloud ? 'floating-cloud' : 'floating-sun';
                el.textContent = icons[Math.floor(Math.random() * icons.length)];
                el.style.top = isCloud ? (Math.random() * 60 + 10) + '%' : 'auto';
                el.style.left = isCloud ? '-10vw' : (Math.random() * 100) + '%';
                el.style.fontSize = (Math.random() * 1.2 + 0.8) + 'rem';
                el.style.animationDuration = (Math.random() * 12 + 8) + 's';
                el.style.animationDelay = (Math.random() * 10) + 's';
                container.appendChild(el);
            }
        }

        // ==========================================
        // OBSERVADOR DE IMAGENES
        // ==========================================
        function initImageObserver() {
            // Las tarjetas usan la carga nativa del navegador (src + loading=lazy).
            // No hacemos una segunda descarga con new Image(), que retrasaba cada foto.
            imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    const img = entry.target;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                });
            }, {
                rootMargin: '300px 0px',
                threshold: 0.01
            });
        }

        function initInfiniteScroll() {
            // La carga de productos ahora se realiza únicamente mediante el botón visible.
            if (scrollObserver) {
                scrollObserver.disconnect();
                scrollObserver = null;
            }
        }

        function debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }

        // ==========================================
        // PRECIOS
        // ==========================================
        function getDiscountRate(product) {
            // Descuento de cada producto, tal como está en el sistema DAYMARSV (0 = precio completo).
            const d = Number(product?.discount) || 0;
            return d > 0 ? Math.min(d, 90) / 100 : 0;
        }
        function getOriginalPrice(product) {
            return Number(product?.price) || 0;
        }
        function roundPrice(value) {
            return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
        }
        function getProductPrice(product) {
            return roundPrice(getOriginalPrice(product) * (1 - getDiscountRate(product)));
        }

        // ==========================================
        // FILTROS Y ORDENAMIENTO
        // ==========================================
        function refreshDaymarPrices() {
            const previousPage = AppState.currentPage;
            sortProducts();
            const container = document.getElementById('productsContainer');
            if (container) {
                container.innerHTML = '';
                for (let page = 0; page <= previousPage; page++) {
                    AppState.currentPage = page;
                    renderProducts();
                }
            }
            AppState.currentPage = previousPage;
            updateFavorites();
            updateCart();
            if (currentPreviewIndex !== null && document.getElementById('previewModal')?.classList.contains('active')) {
                const product = products[currentPreviewIndex];
                if (product) {
                    document.getElementById('previewPrice').textContent = '$' + getProductPrice(product).toFixed(2);
                    const original = document.getElementById('previewPriceOriginal');
                    original.textContent = getDiscountRate(product) > 0 ? '$' + getOriginalPrice(product).toFixed(2) : '';
                    original.style.display = getDiscountRate(product) > 0 ? '' : 'none';
                }
            }
        }

        function applySortFilter(value) {
            const requested = typeof value === 'string' ? value : document.getElementById('sortFilter')?.value;
            AppState.currentSort = ['default', 'price-desc', 'price-asc'].includes(requested) ? requested : 'default';
            syncCatalogSortControl();
            // Reconstruye desde products.js, no desde la lista que ya fue ordenada.
            // Conserva la búsqueda y la categoría, y restaura realmente Recomendados.
            applyCatalogFilters();
        }

        function syncCatalogSortControl() {
            const labels = { default: 'Recomendados', 'price-desc': 'Mayor a menor', 'price-asc': 'Menor a mayor' };
            const input = document.getElementById('sortFilter');
            const text = document.getElementById('catalogSortValue');
            if (input) input.value = AppState.currentSort;
            if (text) text.textContent = labels[AppState.currentSort] || labels.default;
            document.querySelectorAll('#catalogSortDialog [data-sort-value]').forEach(option => {
                option.setAttribute('aria-checked', String(option.dataset.sortValue === AppState.currentSort));
            });
        }

        function initCatalogSortDialog() {
            const dialog = document.getElementById('catalogSortDialog');
            const trigger = document.getElementById('catalogSortTrigger');
            if (!dialog || !trigger) return;
            const options = Array.from(dialog.querySelectorAll('[data-sort-value]'));
            const close = () => { if (dialog.open) dialog.close(); };
            trigger.addEventListener('click', () => {
                if (dialog.open) return;
                syncCatalogSortControl();
                dialog.showModal();
                trigger.setAttribute('aria-expanded', 'true');
                document.documentElement.classList.add('catalog-sort-open');
                (options.find(option => option.getAttribute('aria-checked') === 'true') || options[0])?.focus();
            });
            dialog.querySelector('[data-sort-close]')?.addEventListener('click', close);
            dialog.addEventListener('close', () => {
                trigger.setAttribute('aria-expanded', 'false');
                document.documentElement.classList.remove('catalog-sort-open');
                trigger.focus({ preventScroll: true });
            });
            dialog.addEventListener('cancel', event => { event.preventDefault(); close(); });
            dialog.addEventListener('click', event => {
                const option = event.target.closest('[data-sort-value]');
                if (option) {
                    applySortFilter(option.dataset.sortValue);
                    close();
                } else if (event.target === dialog) {
                    const rect = dialog.getBoundingClientRect();
                    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close();
                }
            });
            dialog.addEventListener('keydown', event => {
                if (event.key === 'Escape') {
                    event.preventDefault();
                    event.stopPropagation();
                    close();
                    return;
                }
                const keys = ['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', 'Home', 'End'];
                if (!keys.includes(event.key)) return;
                const index = options.indexOf(document.activeElement);
                if (index < 0) return;
                event.preventDefault();
                const next = event.key === 'Home' ? 0 : event.key === 'End' ? options.length - 1
                    : (index + (['ArrowDown', 'ArrowRight'].includes(event.key) ? 1 : -1) + options.length) % options.length;
                options[next].focus();
            });
            syncCatalogSortControl();
        }
        
        function sortProducts() {
            const regularProducts = AppState.filteredProducts.filter(product =>
                Number(product?.stock) > 0 && getOriginalPrice(product) > 0
            );
            const zeroPriceProducts = AppState.filteredProducts.filter(product =>
                Number(product?.stock) > 0 && getOriginalPrice(product) <= 0
            );
            const soldOutProducts = AppState.filteredProducts.filter(product =>
                !(Number(product?.stock) > 0)
            );

            if (AppState.currentSort === 'price-desc') {
                regularProducts.sort((a, b) => getProductPrice(b) - getProductPrice(a));
            } else if (AppState.currentSort === 'price-asc') {
                regularProducts.sort((a, b) => getProductPrice(a) - getProductPrice(b));
            }

            AppState.filteredProducts = [...regularProducts, ...zeroPriceProducts, ...soldOutProducts];
        }

        const categoryMap = {
            'todos': null,
            'oro-plata': 'Joyería fina',
            'reloj': 'Relojes',
            'anillo': 'Anillos',
            'aritos': 'Aritos',
            'cartera': 'Carteras',
            'collar': 'Collares',
            'lentes-sol': 'Lentes de sol',
            'accesorios-cabello': 'Accesorios para el cabello',
            'otros': 'Otros',
            'pulsera': 'Pulseras'
        };

        function mixProductsByCategory(productList) {
            const groups = new Map();
            productList.forEach(product => {
                const key = String(product?.category || 'otros').trim().toLocaleLowerCase('es')
                    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') || 'otros';
                if (!groups.has(key)) groups.set(key, []);
                groups.get(key).push(product);
            });
            const mixed = [];
            const queues = Array.from(groups.values());
            while (queues.some(queue => queue.length)) {
                queues.forEach(queue => {
                    if (queue.length) mixed.push(queue.shift());
                });
            }
            return mixed;
        }

        function prepareAllProducts(productList) {
            const inStock = productList.filter(product => Number(product?.stock) > 0);
            const pricedProducts = inStock.filter(product => getOriginalPrice(product) > 0);
            const zeroPriceProducts = inStock.filter(product => getOriginalPrice(product) <= 0);
            return [
                ...mixProductsByCategory(pricedProducts),
                ...mixProductsByCategory(zeroPriceProducts)
            ];
        }

        function placeSoldOutAndZeroPriceLast(productList) {
            return productList
                .map((product, index) => ({ product, index }))
                .sort((a, b) => {
                    const aPriority = Number(a.product?.stock) > 0
                        ? (getOriginalPrice(a.product) > 0 ? 0 : 1)
                        : 2;
                    const bPriority = Number(b.product?.stock) > 0
                        ? (getOriginalPrice(b.product) > 0 ? 0 : 1)
                        : 2;
                    return aPriority - bPriority || a.index - b.index;
                })
                .map(item => item.product);
        }

        function getCategoryProducts(productList, category) {
            const filtered = category === 'oro-plata'
                ? productList.filter(isFineJewelryProduct)
                : productList.filter(product => product.category === categoryMap[category]);
            return placeSoldOutAndZeroPriceLast(filtered);
        }

        const categoryDisplayNames = {
            'todos': 'TODOS',
            'oro-plata': 'ORO Y PLATA',
            'reloj': 'Relojes',
            'anillo': 'Anillos',
            'aritos': 'Aritos',
            'cartera': 'Carteras',
            'collar': 'Collares',
            'lentes-sol': 'Lentes de sol',
            'accesorios-cabello': 'Accesorios para el cabello',
            'otros': 'Indispensables',
            'pulsera': 'Pulseras'
        };

        function restoreLastCategory() {
            const category = AppState.currentFilter;
            const validCategory = category === 'todos' || Object.prototype.hasOwnProperty.call(categoryMap, category);
            AppState.currentFilter = validCategory ? category : 'todos';
            localStorage.setItem('daymar_last_category', AppState.currentFilter);
            document.querySelectorAll('.category-btn, .atelier-category-rail button').forEach(btn => btn.classList.remove('active'));
            const activeButton = Array.from(document.querySelectorAll('.category-btn, .atelier-category-rail button'))
                .find(btn => (btn.getAttribute('onclick') || '').includes(`'${AppState.currentFilter}'`));
            if (activeButton) activeButton.classList.add('active');
            const title = document.getElementById('categoryTitle');
            if (title) title.textContent = categoryDisplayNames[AppState.currentFilter] || 'Todas';
            const categorySelect = document.getElementById('categoryFilter');
            if (categorySelect) categorySelect.value = AppState.currentFilter;
            AppState.filteredProducts = AppState.currentFilter === 'todos'
                ? prepareAllProducts(products)
                : getCategoryProducts(products, AppState.currentFilter);
        }

        function filterProducts(category, btnElement) {
            window.setDaymarMenuOpen(false);
            const searchInput = document.getElementById('searchInput');
            if (searchInput) searchInput.value = '';
            setCatalogCategoryFilter(category, btnElement);
        }

        function setCatalogCategoryFilter(category, btnElement = null) {
            const isValidCategory = category === 'todos' || Object.prototype.hasOwnProperty.call(categoryMap, category);
            AppState.currentFilter = isValidCategory ? category : 'todos';
            localStorage.setItem('daymar_last_category', AppState.currentFilter);

            const categoryButtons = document.querySelectorAll('.category-btn, .atelier-category-rail button');
            categoryButtons.forEach(button => button.classList.remove('active'));
            const activeButton = Array.from(categoryButtons)
                .find(button => (button.getAttribute('onclick') || '').includes(`'${AppState.currentFilter}'`));
            if (activeButton) activeButton.classList.add('active');
            if (btnElement) btnElement.classList.add('active');

            const categorySelect = document.getElementById('categoryFilter');
            if (categorySelect) categorySelect.value = AppState.currentFilter;
            applyCatalogFilters();
        }

        const SEARCH_STOPWORDS = new Set(['a', 'al', 'con', 'de', 'del', 'el', 'en', 'la', 'las', 'los', 'para', 'por', 'un', 'una', 'unas', 'unos', 'y']);
        const SEARCH_SYNONYMS = {
            aro: ['aro', 'aros', 'arito', 'aritos', 'arete', 'aretes', 'pendiente', 'pendientes', 'zarcillo', 'zarcillos'],
            arito: ['aro', 'aros', 'arito', 'aritos', 'arete', 'aretes', 'pendiente', 'pendientes', 'zarcillo', 'zarcillos'],
            arete: ['aro', 'aros', 'arito', 'aritos', 'arete', 'aretes', 'pendiente', 'pendientes', 'zarcillo', 'zarcillos'],
            pendiente: ['aro', 'aros', 'arito', 'aritos', 'arete', 'aretes', 'pendiente', 'pendientes', 'zarcillo', 'zarcillos'],
            zarcillo: ['aro', 'aros', 'arito', 'aritos', 'arete', 'aretes', 'pendiente', 'pendientes', 'zarcillo', 'zarcillos'],
            anillo: ['anillo', 'anillos', 'ring', 'rings'],
            ring: ['anillo', 'anillos', 'ring', 'rings'],
            bolso: ['bolso', 'bolsos', 'cartera', 'carteras', 'monedero', 'monederos'],
            cartera: ['bolso', 'bolsos', 'cartera', 'carteras', 'monedero', 'monederos'],
            collar: ['cadena', 'cadenas', 'collar', 'collares'],
            cadena: ['cadena', 'cadenas', 'collar', 'collares'],
            pulsera: ['brazalete', 'brazaletes', 'pulsera', 'pulseras'],
            brazalete: ['brazalete', 'brazaletes', 'pulsera', 'pulseras'],
            gafa: ['gafa', 'gafas', 'lente', 'lentes'],
            lente: ['gafa', 'gafas', 'lente', 'lentes'],
            reloj: ['reloj', 'relojes', 'watch', 'watches'],
            plata: ['plata', 'silver', 's925', '925'],
            silver: ['plata', 'silver', 's925', '925'],
            oro: ['oro', 'gold', '14k', '18k', '24k', 'au375', 'au750'],
            gold: ['oro', 'gold', '14k', '18k', '24k', 'au375', 'au750'],
            dorado: ['dorado', 'dorada', 'dorados', 'doradas', 'oro', 'gold'],
            plateado: ['plateado', 'plateada', 'plateados', 'plateadas', 'plata', 'silver'],
            joyeria: ['joyeria', 'joya', 'joyas'],
            bano: ['bano', 'banos', 'banado', 'banada', 'banados', 'banadas', 'enchape', 'enchapes', 'enchapado', 'enchapada', 'enchapados', 'enchapadas', 'chapado', 'chapada', 'chapados', 'chapadas', 'laminado', 'laminada', 'laminados', 'laminadas', 'plaque', 'plated', 'filled', 'baño', 'bañado'],
            banado: ['bano', 'banos', 'banado', 'banada', 'banados', 'banadas', 'enchape', 'enchapes', 'enchapado', 'enchapada', 'enchapados', 'enchapadas', 'chapado', 'chapada', 'chapados', 'chapadas', 'laminado', 'laminada', 'laminados', 'laminadas', 'plaque', 'plated', 'filled', 'baño', 'bañado'],
            banada: ['bano', 'banos', 'banado', 'banada', 'banados', 'banadas', 'enchape', 'enchapes', 'enchapado', 'enchapada', 'enchapados', 'enchapadas', 'chapado', 'chapada', 'chapados', 'chapadas', 'laminado', 'laminada', 'laminados', 'laminadas', 'plaque', 'plated', 'filled', 'baño', 'bañado'],
            enchape: ['bano', 'banos', 'banado', 'banada', 'banados', 'banadas', 'enchape', 'enchapes', 'enchapado', 'enchapada', 'enchapados', 'enchapadas', 'chapado', 'chapada', 'chapados', 'chapadas', 'laminado', 'laminada', 'laminados', 'laminadas', 'plaque', 'plated', 'filled', 'baño', 'bañado'],
            enchapado: ['bano', 'banos', 'banado', 'banada', 'banados', 'banadas', 'enchape', 'enchapes', 'enchapado', 'enchapada', 'enchapados', 'enchapadas', 'chapado', 'chapada', 'chapados', 'chapadas', 'laminado', 'laminada', 'laminados', 'laminadas', 'plaque', 'plated', 'filled', 'baño', 'bañado'],
            enchapada: ['bano', 'banos', 'banado', 'banada', 'banados', 'banadas', 'enchape', 'enchapes', 'enchapado', 'enchapada', 'enchapados', 'enchapadas', 'chapado', 'chapada', 'chapados', 'chapadas', 'laminado', 'laminada', 'laminados', 'laminadas', 'plaque', 'plated', 'filled', 'baño', 'bañado'],
            chapado: ['bano', 'banos', 'banado', 'banada', 'banados', 'banadas', 'enchape', 'enchapes', 'enchapado', 'enchapada', 'enchapados', 'enchapadas', 'chapado', 'chapada', 'chapados', 'chapadas', 'laminado', 'laminada', 'laminados', 'laminadas', 'plaque', 'plated', 'filled', 'baño', 'bañado'],
            chapada: ['bano', 'banos', 'banado', 'banada', 'banados', 'banadas', 'enchape', 'enchapes', 'enchapado', 'enchapada', 'enchapados', 'enchapadas', 'chapado', 'chapada', 'chapados', 'chapadas', 'laminado', 'laminada', 'laminados', 'laminadas', 'plaque', 'plated', 'filled', 'baño', 'bañado'],
            laminado: ['bano', 'banos', 'banado', 'banada', 'banados', 'banadas', 'enchape', 'enchapes', 'enchapado', 'enchapada', 'enchapados', 'enchapadas', 'chapado', 'chapada', 'chapados', 'chapadas', 'laminado', 'laminada', 'laminados', 'laminadas', 'plaque', 'plated', 'filled', 'baño', 'bañado'],
            laminada: ['bano', 'banos', 'banado', 'banada', 'banados', 'banadas', 'enchape', 'enchapes', 'enchapado', 'enchapada', 'enchapados', 'enchapadas', 'chapado', 'chapada', 'chapados', 'chapadas', 'laminado', 'laminada', 'laminados', 'laminadas', 'plaque', 'plated', 'filled', 'baño', 'bañado'],
            plaque: ['bano', 'banos', 'banado', 'banada', 'banados', 'banadas', 'enchape', 'enchapes', 'enchapado', 'enchapada', 'enchapados', 'enchapadas', 'chapado', 'chapada', 'chapados', 'chapadas', 'laminado', 'laminada', 'laminados', 'laminadas', 'plaque', 'plated', 'filled', 'baño', 'bañado'],
            plated: ['bano', 'banos', 'banado', 'banada', 'banados', 'banadas', 'enchape', 'enchapes', 'enchapado', 'enchapada', 'enchapados', 'enchapadas', 'chapado', 'chapada', 'chapados', 'chapadas', 'laminado', 'laminada', 'laminados', 'laminadas', 'plaque', 'plated', 'filled', 'baño', 'bañado'],
            filled: ['bano', 'banos', 'banado', 'banada', 'banados', 'banadas', 'enchape', 'enchapes', 'enchapado', 'enchapada', 'enchapados', 'enchapadas', 'chapado', 'chapada', 'chapados', 'chapadas', 'laminado', 'laminada', 'laminados', 'laminadas', 'plaque', 'plated', 'filled', 'baño', 'bañado']
        };

        function normalizeSearchText(value) {
            return String(value || '')
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .toLocaleLowerCase('es')
                .replace(/[^a-z0-9]+/g, ' ')
                .trim()
                .replace(/\s+/g, ' ');
        }

        function getSearchAlternatives(token) {
            if (SEARCH_SYNONYMS[token]) return SEARCH_SYNONYMS[token];
            const singularCandidates = [token.endsWith('s') ? token.slice(0, -1) : '', token.endsWith('es') ? token.slice(0, -2) : ''];
            const synonymKey = singularCandidates.find(candidate => candidate && SEARCH_SYNONYMS[candidate]);
            return synonymKey ? SEARCH_SYNONYMS[synonymKey] : [token];
        }

        function matchesProductSearch(product, query) {
            const tokens = normalizeSearchText(query).split(' ').filter(token => token && !SEARCH_STOPWORDS.has(token));
            if (!tokens.length) return true;

            const searchIndex = normalizeSearchText([
                product?.name,
                product?.category,
                product?.description,
                product?.barcode
            ].filter(Boolean).join(' '));

            return tokens.every(token => {
                const alternatives = getSearchAlternatives(token);
                return alternatives.some(alternative => searchIndex.includes(normalizeSearchText(alternative)));
            });
        }


        /* ---- Búsqueda inteligente: precios en la frase, errores de escritura y orden por parecido ---- */
        function parseSearchPrice(raw) {
            let t = String(raw || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLocaleLowerCase('es').replace(/,/g, '.');
            let min = null, max = null;
            const num = '\\$?\\s*(\\d+(?:\\.\\d+)?)';
            t = t.replace(new RegExp('(?:menos de|menor a|menor que|hasta|maximo|max|bajo|debajo de|no mas de|por menos de)\\s*' + num, 'g'), (m, n) => { max = Number(n); return ' '; });
            t = t.replace(new RegExp('(?:mas de|mayor a|mayor que|desde|minimo|min|arriba de|sobre)\\s*' + num, 'g'), (m, n) => { min = Number(n); return ' '; });
            t = t.replace(new RegExp('entre\\s*' + num + '\\s*y\\s*' + num, 'g'), (m, a, b) => { min = Math.min(+a, +b); max = Math.max(+a, +b); return ' '; });
            t = t.replace(/\b(dolares|dolar|usd|dls)\b|\$/g, ' ');
            return { text: t, min, max };
        }

        function editDistanceWithin(a, b, limit) {
            if (Math.abs(a.length - b.length) > limit) return false;
            let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
            for (let i = 1; i <= a.length; i++) {
                const cur = [i]; let rowMin = i;
                for (let j = 1; j <= b.length; j++) {
                    cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
                    if (cur[j] < rowMin) rowMin = cur[j];
                }
                if (rowMin > limit) return false;
                prev = cur;
            }
            return prev[b.length] <= limit;
        }

        function scoreProductTokens(product, tokens) {
            const name = normalizeSearchText(product?.name), cat = normalizeSearchText(product?.category);
            const desc = normalizeSearchText(product?.description), code = normalizeSearchText(product?.barcode);
            const words = (name + ' ' + cat + ' ' + desc).split(' ').filter(Boolean);
            let total = 0, hits = 0;
            tokens.forEach(token => {
                const alts = getSearchAlternatives(token).map(normalizeSearchText);
                let best = 0;
                alts.forEach(alt => {
                    if (!alt) return;
                    // Palabras cortas (oro, ring, 14k…) solo cuentan como palabra completa, no dentro de otra palabra.
                    const has = (text) => alt.length <= 4 ? (' ' + text + ' ').includes(' ' + alt + ' ') : text.includes(alt);
                    if (has(name)) best = Math.max(best, name.split(' ').includes(alt) ? 5 : 4);
                    else if (has(cat)) best = Math.max(best, 3);
                    else if (code.includes(alt)) best = Math.max(best, 3);
                    else if (has(desc)) best = Math.max(best, 2);
                });
                if (!best && token.length >= 4) {
                    const limit = token.length >= 8 ? 2 : 1;
                    if (words.some(w => w.length >= 3 && editDistanceWithin(token, w, limit))) best = 1;
                }
                if (best) { total += best; hits++; }
            });
            return { total, hits };
        }

        function smartSearch(list, rawQuery) {
            const price = parseSearchPrice(rawQuery);
            let pool = list;
            if (price.min !== null) pool = pool.filter(p => getProductPrice(p) >= price.min);
            if (price.max !== null) pool = pool.filter(p => getProductPrice(p) <= price.max);
            const tokens = normalizeSearchText(price.text).split(' ').filter(t => t && !SEARCH_STOPWORDS.has(t));
            if (!tokens.length) return { items: pool, approx: false };
            const scored = pool.map(p => ({ p, ...scoreProductTokens(p, tokens) }));
            const all = scored.filter(x => x.hits === tokens.length).sort((a, b) => b.total - a.total);
            if (all.length) return { items: all.map(x => x.p), approx: false };
            const some = scored.filter(x => x.hits > 0).sort((a, b) => b.hits - a.hits || b.total - a.total);
            return { items: some.map(x => x.p), approx: some.length > 0 };
        }

        function applyCatalogFilters() {
            const rawSearch = document.getElementById('searchInput')?.value || '';
            const normalizedSearch = normalizeSearchText(rawSearch);
            AppState.searchTerm = normalizedSearch;
            AppState.searchApprox = false;

            // Al buscar, también salen los agotados (con su etiqueta), para que quien busque por código sepa que existe.
            let matchingProducts = AppState.currentFilter === 'todos'
                ? (normalizedSearch ? placeSoldOutAndZeroPriceLast(products) : prepareAllProducts(products))
                : getCategoryProducts(products, AppState.currentFilter);

            if (normalizedSearch) {
                const codeQuery = normalizedSearch.replace(/ /g, '');
                const byCode = /^[0-9]{2,}$/.test(codeQuery)
                    ? (() => {
                        const exact = matchingProducts.filter(product => normalizeSearchText(product.barcode).replace(/ /g, '') === codeQuery);
                        if (exact.length) return exact;
                        const starts = matchingProducts.filter(product => normalizeSearchText(product.barcode).replace(/ /g, '').startsWith(codeQuery));
                        return starts.length ? starts : null;
                    })()
                    : null;
                if (byCode) { matchingProducts = byCode; } else { const r = smartSearch(matchingProducts, rawSearch); matchingProducts = r.items; AppState.searchApprox = r.approx; }
            }

            const minValue = document.getElementById('minPriceFilter')?.value;
            const maxValue = document.getElementById('maxPriceFilter')?.value;
            const minPrice = minValue === '' || minValue == null ? null : Number(minValue);
            const maxPrice = maxValue === '' || maxValue == null ? null : Number(maxValue);
            if (minPrice !== null && Number.isFinite(minPrice)) {
                matchingProducts = matchingProducts.filter(product => getProductPrice(product) >= minPrice);
            }
            if (maxPrice !== null && Number.isFinite(maxPrice)) {
                matchingProducts = matchingProducts.filter(product => getProductPrice(product) <= maxPrice);
            }

            if (document.getElementById('onlyAvailableFilter')?.checked) {
                matchingProducts = matchingProducts.filter(product => Number(product?.stock) > 0);
            }

            AppState.filteredProducts = matchingProducts;
            AppState.currentPage = 0;
            AppState.hasMoreProducts = true;
            if (AppState.currentSort !== 'default') sortProducts();

            const container = document.getElementById('productsContainer');
            if (container) container.innerHTML = '';
            renderProducts();
            updateProductsCount();

            const title = document.getElementById('categoryTitle');
            if (title) {
                title.textContent = normalizedSearch
                    ? `${AppState.searchApprox ? 'Resultados parecidos a' : 'Resultados para'}: "${String(rawSearch).trim()}"`
                    : (categoryDisplayNames[AppState.currentFilter] || 'Todas');
            }
        }

        function clearCatalogFilters() {
            const searchInput = document.getElementById('searchInput');
            const minPriceInput = document.getElementById('minPriceFilter');
            const maxPriceInput = document.getElementById('maxPriceFilter');
            const sortSelect = document.getElementById('sortFilter');
            if (searchInput) searchInput.value = '';
            if (minPriceInput) minPriceInput.value = '';
            if (maxPriceInput) maxPriceInput.value = '';
            const onlyAvail = document.getElementById('onlyAvailableFilter');
            if (onlyAvail) onlyAvail.checked = false;
            if (sortSelect) sortSelect.value = 'default';
            AppState.currentSort = 'default';
            setCatalogCategoryFilter('todos');
        }

        function searchProducts(term) {
            const searchInput = document.getElementById('searchInput');
            if (searchInput && typeof term === 'string' && searchInput.value !== term) searchInput.value = term;
            applyCatalogFilters();
        }

        // ==========================================
        // RENDERIZADO DE PRODUCTOS
        // ==========================================
        function renderSkeletons(count = 8) {
            const container = document.getElementById('productsContainer');
            if (!container) return;
            
            container.innerHTML = '';
            container.setAttribute('aria-busy', 'true');

            const loadingStatus = document.createElement('div');
            loadingStatus.className = 'loading-spinner catalog-loading-status';
            loadingStatus.setAttribute('role', 'status');
            loadingStatus.setAttribute('aria-live', 'polite');
            loadingStatus.innerHTML = '<span class="spinner" aria-hidden="true"></span><span>Cargando productos...</span>';
            container.appendChild(loadingStatus);
            
            for (let i = 0; i < count; i++) {
                const skeletonCard = document.createElement('div');
                skeletonCard.className = 'product-card loading';
                skeletonCard.innerHTML = `
                    <div class="product-image-container">
                        <div class="skeleton" style="width:100%;height:100%;"></div>
                    </div>
                    <div class="product-info">
                        <div class="product-name"><div class="skeleton" style="width:80%;height:1.2em;display:inline-block;"></div></div>
                        <div class="product-description"><div class="skeleton" style="height:2em;width:100%;"></div></div>
                        <div class="product-price"><div class="skeleton" style="width:60%;height:1.2em;display:inline-block;"></div></div>
                    </div>
                `;
                container.appendChild(skeletonCard);
            }
        }

        /* Foto de cada círculo de categoría: la primera foto de un producto de esa categoría (con stock si hay) */
        function updateCategoryPhotos() {
            try {
                const list = (typeof products !== 'undefined' && Array.isArray(products)) ? products : [];
                document.querySelectorAll('.atelier-category-rail button').forEach(btn => {
                    const m = /filterProducts\('([^']+)'/.exec(btn.getAttribute('onclick') || '');
                    const img = btn.querySelector('.dm-cat-photo img');
                    if (!m || !img || m[1] === 'todos') return;
                    const cat = categoryMap[m[1]];
                    const pool = list.filter(p => p.category === cat && Array.isArray(p.images) && /^https?:/i.test(p.images[0] || ''));
                    const pick = pool.find(p => p.stock > 0) || pool[0];
                    if (pick && img.getAttribute('src') !== pick.images[0]) img.src = pick.images[0];
                    img.onerror = function () { this.onerror = null; this.src = 'isotipo.png'; };
                });
            } catch (e) {}
        }

        function renderProducts() {
            const container = document.getElementById('productsContainer');
            if (!container) return;
            
            container.removeAttribute('aria-busy');
            updateCategoryPhotos();
            const start = AppState.currentPage * CONFIG.productsPerPage;
            const end = start + CONFIG.productsPerPage;
            const productsToShow = AppState.filteredProducts.slice(start, end);
            
            if (productsToShow.length === 0 && AppState.currentPage === 0) {
                container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--gris);">No se encontraron productos</div>';
                AppState.hasMoreProducts = false;
                const loadMoreWrap = document.getElementById('loadMoreProductsWrap');
                if (loadMoreWrap) loadMoreWrap.style.display = 'none';
                return;
            }
            
            productsToShow.forEach((product, index) => {
                const card = createProductCard(product, start + index);
                container.appendChild(card);
            });
            
            AppState.hasMoreProducts = end < AppState.filteredProducts.length;
            updateProductsCount();
            
            const loadMoreWrap = document.getElementById('loadMoreProductsWrap');
            const loadMoreBtn = document.getElementById('loadMoreProductsBtn');
            if (loadMoreWrap) loadMoreWrap.style.display = AppState.hasMoreProducts ? 'flex' : 'none';
            if (loadMoreBtn) {
                loadMoreBtn.disabled = false;
                loadMoreBtn.innerHTML = '<i class="fas fa-plus" aria-hidden="true"></i> Cargar más productos';
            }
        }

        function isFineJewelryProduct(product) {
            const category = String(product.category || '').trim().toLowerCase();
            return category === 'joyería fina' || category === 'joyeria fina' || category === 'joyeria-fina';
        }

        // Usa product.images cuando existe y agrega prodimg/ solo para Joyería fina.
        function getProductImages(product) {
            if (!product) return [];

            const sourceImages = Array.isArray(product.images) && product.images.length
                ? product.images
                : [`${product.barcode}.jpg`];

            const resolvedImages = sourceImages.map((image, index) => {
                let imagePath = String(image).trim();
                const isAbsolute = /^(https?:|data:|\/)/i.test(imagePath);

                if (isAbsolute) return imagePath;
                if (!isFineJewelryProduct(product)) {
                    // Las fotos generales viven en generalimg/.
                    return imagePath.includes('/') ? imagePath : `generalimg/${imagePath}`;
                }

                imagePath = imagePath.replace(/^prodimg\//i, '');
                imagePath = imagePath.replace(/_(\d+)(\.[^.]+)$/i, '.$1$2');

                // En prodimg la primera vista se guarda como codigo.1.jpg.
                if (index === 0 && imagePath.toLowerCase() === `${String(product.barcode).toLowerCase()}.jpg`) {
                    imagePath = `${product.barcode}.1.jpg`;
                }

                return `prodimg/${encodeURIComponent(imagePath)}`;
            });

            return [...new Set(resolvedImages)];
        }        function getPrimaryProductImage(product) {
            const image = getProductImages(product)[0] || '';
            if (!image) return '';
            try { return new URL(image, document.baseURI).href; } catch (_) { return image; }
        }
        // Miniatura liviana para las tarjetas del catálogo (si el sistema no la tiene, se usa la imagen normal)
        function getCardProductImage(product) {
            const t = product && Array.isArray(product.thumbs) && product.thumbs[0];
            if (!t) return getPrimaryProductImage(product);
            try { return new URL(t, document.baseURI).href; } catch (_) { return t; }
        }
        // Enlace que se pega en el mensaje de WhatsApp: abre la tienda y WhatsApp muestra solo el logo de la marca (og:image de esta página).
        function getWhatsAppProductImage() {
            return 'https://industriastobias.github.io/klohesvtiendaonline/';
        }

        // Enlace de producto compartido (?cod=090): abre el catálogo filtrado por ese código
        (function () {
            const code = new URLSearchParams(location.search).get('cod');
            if (!code) return;
            let tries = 0;
            const timer = setInterval(() => {
                tries++;
                if (typeof searchProducts === 'function' && typeof products !== 'undefined' && document.getElementById('searchInput')) {
                    clearInterval(timer);
                    searchProducts(code);
                    setTimeout(() => document.getElementById('catalogo')?.scrollIntoView({ behavior: 'instant', block: 'start' }), 400);
                } else if (tries > 80) clearInterval(timer);
            }, 150);
        })();

        // Cambia automáticamente las imágenes de las tarjetas que tienen una galería.
        function initProductCardGallery(card, images) {
            if (!card || !Array.isArray(images) || images.length < 2) return;

            const img = card.querySelector('.product-image');
            if (!img) return;

            let currentIndex = 0;
            let intervalId = null;
            let isPreloading = false;

            const showNextImage = () => {
                if (isPreloading) return;

                const nextIndex = (currentIndex + 1) % images.length;
                const nextSrc = images[nextIndex];
                const preload = new Image();
                isPreloading = true;

                preload.onload = () => {
                    // Primero se desvanece la imagen actual y luego entra la siguiente.
                    img.classList.add('gallery-changing');

                    setTimeout(() => {
                        currentIndex = nextIndex;
                        img.src = nextSrc;
                        img.removeAttribute('data-src');

                        requestAnimationFrame(() => {
                            img.classList.remove('gallery-changing');
                        });
                        isPreloading = false;
                    }, 320);
                };

                preload.onerror = () => {
                    isPreloading = false;
                };

                preload.src = nextSrc;
            };

            const startGallery = () => {
                if (!intervalId) intervalId = setInterval(showNextImage, 4500);
            };

            const stopGallery = () => {
                if (intervalId) {
                    clearInterval(intervalId);
                    intervalId = null;
                }
            };

            if ('IntersectionObserver' in window) {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => entry.isIntersecting ? startGallery() : stopGallery());
                }, { rootMargin: '120px 0px', threshold: 0.01 });
                observer.observe(card);
            } else {
                startGallery();
            }
        }

        let currentPreviewImages = [];
;
        let currentPreviewImageIndex = 0;

        function renderPreviewGallery(product) {
            currentPreviewImages = getProductImages(product);
            currentPreviewImageIndex = 0;

            const controls = document.getElementById('previewGalleryControls');
            const counter = document.getElementById('previewGalleryCounter');
            if (!controls) return;

            const hasGallery = currentPreviewImages.length > 1;
            controls.style.display = hasGallery ? 'flex' : 'none';
            if (counter) {
                counter.style.display = hasGallery ? 'flex' : 'none';
                renderPreviewDots();
            }
        }

        function renderPreviewDots() {
            const box = document.getElementById('previewGalleryCounter');
            if (!box) return;
            const n = currentPreviewImages.length;
            if (n < 2) { box.innerHTML = ''; return; }
            let h = '';
            for (let i = 0; i < n; i++) h += `<i class="${i === currentPreviewImageIndex ? 'on' : ''}"></i>`;
            box.innerHTML = h;
        }

        function changePreviewImage(step) {
            if (currentPreviewImages.length <= 1) return;

            currentPreviewImageIndex = (currentPreviewImageIndex + step + currentPreviewImages.length) % currentPreviewImages.length;
            const nextImage = currentPreviewImages[currentPreviewImageIndex];
            const img = document.getElementById('previewImage');
            const previewContainer = document.querySelector('.preview-image-container');
            if (img) {
                img.classList.add('is-loading');
                if (previewContainer) previewContainer.classList.add('is-loading');
                img.onload = () => {
                    img.classList.remove('is-loading');
                    if (previewContainer) previewContainer.classList.remove('is-loading');
                };
                img.onerror = () => {
                    img.classList.remove('is-loading');
                    if (previewContainer) previewContainer.classList.remove('is-loading');
                };
                img.src = nextImage;
            }

            const lightboxImg = document.getElementById('imageLightboxImg');
            if (lightboxImg) lightboxImg.src = nextImage;

            const counterText = `${currentPreviewImageIndex + 1} / ${currentPreviewImages.length}`;
            const counter = document.getElementById('previewGalleryCounter');
            renderPreviewDots();
            const lightboxCounter = document.getElementById('imageLightboxCounter');
            if (lightboxCounter) lightboxCounter.textContent = counterText;
        }

        function createProductCard(product, index) {
            const card = document.createElement('div');
            const isFineJewelry = isFineJewelryProduct(product);
            card.className = `product-card daymar-structural-card${isFineJewelry ? ' fine-jewelry-card' : ''}`;
            card.style.animationDelay = `${index * 0.05}s`;
            
            const hasStock = Number(product.stock) > 0;            const realIndex = products.indexOf(product);
            const productImages = getProductImages(product);
;
            const initial = product.name.charAt(0).toUpperCase();
            
            const productPrice = getProductPrice(product);
            const productText = `${product.name || ''} ${product.description || ''} ${product.material || ''}`.toLowerCase();
            const fineMaterial = /plata|silver|925/.test(productText)
                ? 'PLATA 925'
                : /oro|gold|au\d/.test(productText)
                    ? 'ORO'
                    : 'ORO Y PLATA';
            const fineMaterialClass = fineMaterial.includes('PLATA') ? 'silver' : fineMaterial === 'ORO' ? 'gold' : 'mixed';

            card.innerHTML = `
                <div class="daymar-card-shell">
                  <div class="daymar-card-media">
                    <div class="product-image-container" role="button" tabindex="0" aria-haspopup="dialog" onclick="openPreview(${realIndex})">
                    <img src="${getCardProductImage(product)}" 
                         alt="${product.name}" 
                         class="product-image"
                         loading="${index < 6 ? 'eager' : 'lazy'}"
                         decoding="async"
                         fetchpriority="${index < 6 ? 'high' : 'low'}"
                         onload="this.classList.add('loaded')">                    <div class="image-placeholder" data-initial="${initial}"></div>
                    ${getDiscountRate(product) > 0 ? `<div class="discount-tag daymar-black-friday-card-tag"><span>OFERTA</span><strong>-${Math.round(getDiscountRate(product) * 100)}%</strong></div>` : ''}
                    </div>
                    <span class="daymar-card-index">${String(index + 1).padStart(2, '0')}</span>
                  </div>
                  <div class="daymar-card-info">
                    <div class="daymar-card-rule"></div>
                    <div class="product-info">
                    ${isFineJewelry ? `<div class="fine-jewelry-meta"><span>PIEZA ESPECIAL</span><span>${fineMaterial}</span></div>` : ''}
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description || ''}</p>
                    <div class="product-price-container">
                        <span class="product-price">$${productPrice.toFixed(2)}</span>
                        ${getDiscountRate(product) > 0 ? `<span class="product-price-original">$${getOriginalPrice(product).toFixed(2)}</span>` : ''}
                    </div>
                    <span class="product-stock ${hasStock ? 'available' : 'out'}">
                        ${hasStock ? `${product.stock} ${Number(product.stock) === 1 ? 'disponible' : 'disponibles'}` : 'Agotado'}
                    </span>
                    <div class="product-card-actions">
                        <button class="product-details-trigger" type="button" aria-haspopup="dialog" onclick="event.stopPropagation(); openPreview(${realIndex})"><span class="daymar-action-full">Ver detalles</span><span class="daymar-action-mobile">Detalles</span></button>
                        <button class="cart-corner-btn ${hasStock ? '' : 'out-of-stock'}" data-barcode="${product.barcode}" onclick="event.stopPropagation(); addToCart(${realIndex}, this)" aria-label="${hasStock ? 'AÑADIR AL CARRITO' : 'Producto agotado'}" title="${hasStock ? 'AÑADIR AL CARRITO' : 'Agotado'}">
                            <i class="fas ${hasStock ? 'fa-shopping-cart' : 'fa-ban'}"></i> <span class="cart-btn-label"><span class="daymar-action-full">${hasStock ? 'AÑADIR AL CARRITO' : 'Agotado'}</span><span class="daymar-action-mobile">${hasStock ? 'Añadir al carrito' : 'Agotado'}</span></span>
                        </button>
                    </div>
                    </div>
                  </div>
                </div>
            `;
            
            const imageAction = card.querySelector('.product-image-container');
            card.addEventListener('click', event => {
                if (event.target.closest('button, a, input, select, textarea')) return;
                const blackFridayTag = card.querySelector('.daymar-black-friday-card-tag');
                if (!blackFridayTag) return;
                blackFridayTag.classList.remove('is-clicking');
                void blackFridayTag.offsetWidth;
                blackFridayTag.classList.add('is-clicking');
                window.setTimeout(() => blackFridayTag.classList.remove('is-clicking'), 760);
            });
            imageAction.setAttribute('aria-label', `Ver descripción de ${product.name}`);
            card.querySelector('.product-details-trigger').setAttribute('aria-label', `Ver detalles de ${product.name}`);
            imageAction.addEventListener('keydown', event => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    openPreview(realIndex);
                }
            });
            const img = card.querySelector('.product-image');
            if (img && imageObserver) imageObserver.observe(img);

            initProductCardGallery(card, productImages);
            
            return card;
;
        }

        function loadMoreProducts() {
            if (AppState.isLoading || !AppState.hasMoreProducts) return;
            
            AppState.isLoading = true;
            const loadMoreBtn = document.getElementById('loadMoreProductsBtn');
            if (loadMoreBtn) {
                loadMoreBtn.disabled = true;
                loadMoreBtn.innerHTML = '<span class="load-more-spinner" aria-hidden="true"></span><span>Cargando productos...</span>';
            }
            
            setTimeout(() => {
                AppState.currentPage++;
                renderProducts();
                AppState.isLoading = false;
            }, 400);
        }

        function updateProductsCount() {
            const shown = Math.min((AppState.currentPage + 1) * CONFIG.productsPerPage, AppState.filteredProducts.length);
            const total = AppState.filteredProducts.length;
            const countEl = document.getElementById('productsCount');
            if (countEl) {
                countEl.textContent = `Mostrando ${shown} de ${total} productos`;
            }
        }

        // ==========================================
        // FAVORITOS
        // ==========================================
        function daymarHaptic(element) {
            if (element) {
                element.classList.remove('daymar-heart-pulse');
                void element.offsetWidth;
                element.classList.add('daymar-heart-pulse');
            }
            // Android permite vibración web en muchos navegadores; iOS simplemente ignora esta llamada.
            if (navigator.vibrate) navigator.vibrate(10);
        }

        function shareFavorites() {
            const favoriteProducts = AppState.favorites
                .map(barcode => products.find(product => product.barcode === barcode))
                .filter(Boolean);
            if (!favoriteProducts.length) {
                showNotification('Agrega productos a favoritos primero', 'error');
                return;
            }
            const lines = favoriteProducts.map((product, index) =>
                `${index + 1}. ${product.name} - $${getProductPrice(product).toFixed(2)} (COD: ${product.barcode})`
            );
            const shareText = `Mis favoritos de DAYMAR:\n\n${lines.join('\n')}\n\nQuiero consultar disponibilidad.`;
            if (navigator.share) {
                navigator.share({ title: 'Mis favoritos de DAYMAR', text: shareText, url: window.location.href }).catch(() => {});
            } else if (navigator.clipboard) {
                navigator.clipboard.writeText(shareText).then(() => showNotification('Favoritos copiados para compartir'))
                    .catch(() => showNotification('No se pudo compartir', 'error'));
            } else {
                window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
            }
        }

        function updateFavorites() {
            const badge = document.getElementById('favoritesBadge');
            const btn = document.getElementById('favoritesBtn');
            const bottomBadge = document.getElementById('bottomFavoritesBadge');
            if (bottomBadge) {
                bottomBadge.textContent = AppState.favorites.length;
                bottomBadge.style.display = AppState.favorites.length > 0 ? 'inline-block' : 'none';
            }
            const list = document.getElementById('favoritesList');
            
            if (badge) {
                badge.textContent = AppState.favorites.length;
                badge.style.display = AppState.favorites.length > 0 ? 'flex' : 'none';
            }
            
            if (btn) {
                btn.classList.toggle('active', AppState.favorites.length > 0);
            }
            
            if (list) {
                if (AppState.favorites.length === 0) {
                    list.innerHTML = '<div class="favorites-empty">No tienes productos favoritos</div>';
                } else {
                    list.innerHTML = '';
                    AppState.favorites.forEach(barcode => {
                        const product = products.find(p => p.barcode === barcode);
                        if (product) {
                            list.innerHTML += `
                                <div class="favorite-item" onclick="openPreview(${products.findIndex(p => p.barcode === product.barcode)})" onkeydown="if(event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openPreview(${products.findIndex(p => p.barcode === product.barcode)}); }" tabindex="0" role="button" aria-label="Ver ${product.name} en grande">
                                    <div class="favorite-item-image">
                                        <img src="${getPrimaryProductImage(product)}" alt="${product.name}" loading="lazy"
                                             onerror="this.style.display='none'">
                                    </div>
                                    <div class="favorite-item-details">
                                        <h4>${product.name}</h4>
                                        <p><span class="favorite-price-current">$${getProductPrice(product).toFixed(2)}</span>${getDiscountRate(product) > 0 ? `<span class="favorite-price-original">$${getOriginalPrice(product).toFixed(2)}</span><span class="favorite-discount">-${Math.round(getDiscountRate(product) * 100)}%</span>` : ''}</p>
                                        <span class="favorite-stock ${Number(product.stock) > 0 ? 'available' : 'out'}">${Number(product.stock) > 0 ? `${product.stock} ${Number(product.stock) === 1 ? 'disponible' : 'disponibles'}` : 'Agotado'}</span>
                                    </div>
                                    <button class="remove-favorite" onclick="event.stopPropagation(); removeFromFavorites('${product.barcode}')" aria-label="Eliminar de favoritos">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            `;
                        }
                    });
                }
            }
        }

        function removeFromFavorites(barcode) {
            AppState.favorites = AppState.favorites.filter(f => f !== barcode);
            localStorage.setItem('daymar_favorites', JSON.stringify(AppState.favorites));
            updateFavorites();
            
            showNotification('Eliminado de favoritos');
        }

        function toggleFavorites() {
            const modal = document.getElementById('favoritesModal');
            const overlay = document.getElementById('overlay');
            
            if (!modal || !overlay) return;
            
            const isActive = modal.classList.contains('active');
            
            if (isActive) {
                modal.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
                document.body.classList.remove('favorites-open');
                const hadFavoritesHistory = modal.dataset.historyPushed === 'true';
                modal.dataset.historyPushed = '';
                if (hadFavoritesHistory && window.matchMedia('(max-width: 800px)').matches) history.back();
            } else {
                const cartModal = document.getElementById('cartModal');
                if (cartModal && cartModal.classList.contains('active')) {
                    cartModal.classList.remove('active');
                }
                
                modal.classList.add('active');
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
                document.body.classList.add('favorites-open');
                if (window.matchMedia('(max-width: 800px)').matches && !modal.dataset.historyPushed) {
                    history.pushState({ daymarFavorites: true }, '', window.location.href);
                    modal.dataset.historyPushed = 'true';
                }
                updateFavorites();
            }
        }

        function initFavoritesMobileGestures() {
            const modal = document.getElementById('favoritesModal');
            const header = modal?.querySelector('.favorites-header');
            if (!modal || !header) return;
            let startY = 0;
            let startX = 0;
            header.addEventListener('touchstart', event => {
                const touch = event.changedTouches[0];
                startY = touch.clientY;
                startX = touch.clientX;
            }, { passive: true });
            header.addEventListener('touchend', event => {
                const touch = event.changedTouches[0];
                const deltaY = touch.clientY - startY;
                const deltaX = Math.abs(touch.clientX - startX);
                if (modal.classList.contains('active') && deltaY > 70 && deltaX < 80) toggleFavorites();
            }, { passive: true });
        }

        window.addEventListener('popstate', () => {
            const modal = document.getElementById('favoritesModal');
            if (modal?.classList.contains('active')) {
                modal.classList.remove('active');
                document.getElementById('overlay')?.classList.remove('active');
                document.body.style.overflow = '';
                document.body.classList.remove('favorites-open');
                modal.dataset.historyPushed = '';
            }
        });

        // ==========================================
        // CARRITO
        // ==========================================
        function setCatalogButtonLabel(button, added) {
            const label = button.querySelector('.cart-btn-label');
            if (!label) return;
            const outOfStock = button.classList.contains('out-of-stock');
            const full = outOfStock ? 'Agotado' : added ? 'AÑADIDO' : 'AÑADIR AL CARRITO';
            const compact = outOfStock ? 'Agotado' : added ? 'Añadido' : 'Añadir al carrito';
            label.innerHTML = `<span class="daymar-action-full">${full}</span><span class="daymar-action-mobile">${compact}</span>`;
        }

        function syncAddButtonStates() {
            const cartBarcodes = new Set(AppState.cart.map(item => String(item.barcode)));
            document.querySelectorAll('.cart-corner-btn[data-barcode], .preview-add-btn[data-barcode]').forEach(button => {
                const added = cartBarcodes.has(String(button.dataset.barcode));
                button.classList.toggle('added', added);
                button.disabled = false;
                if (button.classList.contains('cart-corner-btn')) {
                    const label = button.querySelector('.cart-btn-label');
                    if (label) setCatalogButtonLabel(button, added);
                } else {
                    button.innerHTML = added
                        ? '<i class="fas fa-check" aria-hidden="true"></i><span>AÑADIDO</span>'
                        : '<i class="fas fa-shopping-bag" aria-hidden="true"></i><span>AÑADIR AL CARRITO</span>';
                }
            });
        }
        function showAddedButtonState(button) {
            if (!button) return;
            button.classList.add('added');
            button.disabled = false;
            if (button.classList.contains('cart-corner-btn')) {
                const label = button.querySelector('.cart-btn-label');
                if (label) setCatalogButtonLabel(button, true);
            } else {
                button.innerHTML = '<i class="fas fa-check" aria-hidden="true"></i><span>AÑADIDO</span>';
            }
        }

        function addToCart(index, sourceButton = null) {
            const product = products[index];
            if (!product) return;
            
            if (Number(product.stock) <= 0) {
                showNotification('Agotado', 'error');
                return;
            }

            const existingItem = AppState.cart.find(item => item.barcode === product.barcode);
            
            if (existingItem) {
                if (existingItem.quantity < product.stock) {
                    existingItem.quantity++;
                } else {
                    showNotification('Stock máximo alcanzado', 'error');
                    return;
                }
            } else {
                AppState.cart.push({ ...product, price: getProductPrice(product), originalPrice: getOriginalPrice(product), discountRate: getDiscountRate(product), quantity: 1 });
            }

            updateCart();
            showAddedButtonState(sourceButton);

            showNotification('Añadido al carrito');
        }

        function removeFromCart(barcode) {
            AppState.cart = AppState.cart.filter(item => item.barcode !== barcode);
            updateCart();
        }

        function clearCart() {
            if (!AppState.cart.length) return;
            const confirmOverlay = document.getElementById('cartConfirmOverlay');
            if (!confirmOverlay) return;
            confirmOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            confirmOverlay.querySelector('.cart-confirm-cancel')?.focus();
        }

        function closeClearCartConfirm() {
            const confirmOverlay = document.getElementById('cartConfirmOverlay');
            if (confirmOverlay) confirmOverlay.classList.remove('active');
            const cartModal = document.getElementById('cartModal');
            document.body.style.overflow = cartModal?.classList.contains('active') ? 'hidden' : '';
        }

        function confirmClearCart() {
            AppState.cart = [];
            localStorage.removeItem('daymar_cart');
            closeClearCartConfirm();
            updateCart();
            showNotification('Carrito vaciado');
        }

        function updateCart() {
            const cartItems = document.getElementById('cartItems');
            const cartTotal = document.getElementById('cartTotal');
            const cartSubtotal = document.getElementById('cartSubtotal');
            const cartBadge = document.getElementById('cartBadge');
            const bottomCartBadge = document.getElementById('bottomCartBadge');
            const whatsappBtn = document.getElementById('whatsappBtn');
            const summary = document.getElementById('cartSummary');
            const clearBtn = document.getElementById('clearCartBtn');

            localStorage.setItem('daymar_cart', JSON.stringify(AppState.cart));
            syncAddButtonStates();

            const totalItems = AppState.cart.reduce((sum, item) => sum + item.quantity, 0);
            
            if (cartBadge) {
                cartBadge.textContent = totalItems;
                cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
            }
            if (bottomCartBadge) {
                bottomCartBadge.textContent = totalItems;
                bottomCartBadge.style.display = totalItems > 0 ? 'inline-block' : 'none';
            }

            if (clearBtn) {
                clearBtn.style.display = AppState.cart.length > 0 ? 'block' : 'none';
            }

            if (AppState.cart.length === 0) {
                if (cartItems) { cartItems.innerHTML = '<div class="cart-empty">Tu carrito está vacío</div>'; delete cartItems.dataset.html; }
                if (summary) summary.style.display = 'none';
                if (whatsappBtn) whatsappBtn.style.display = 'none';
                if (cartTotal) cartTotal.textContent = '$0.00';
                document.getElementById('daymarCouponRow').hidden = true;
                if (whatsappBtn) whatsappBtn.dataset.daymarBenefitKind = '';
                window.DaymarPromo?.syncCart(0);
                return;
            }

            if (cartItems) {
                let cartHtml = '';
                let subtotal = 0;
                let regularSubtotal = 0;
                const purchasableCartItems = [];
                AppState.cart.forEach(item => {
                    const liveProduct = products.find(product => String(product.barcode) === String(item.barcode));
                    const isDeleted = !liveProduct;
                    const currentStock = liveProduct ? Number(liveProduct.stock) || 0 : 0;
                    const isOutOfStock = !isDeleted && currentStock <= 0;
                    const isUnavailable = isDeleted || isOutOfStock;
                    const itemOriginalPrice = liveProduct ? getOriginalPrice(liveProduct) : (Number(item.originalPrice) || Number(item.price) || 0);
                    const itemDiscountRate = liveProduct ? getDiscountRate(liveProduct) : (Number(item.discountRate) || 0);
                    const itemPrice = liveProduct ? getProductPrice(liveProduct) : (Number(item.price) || 0);
                    const itemTotal = isUnavailable ? 0 : roundPrice(itemPrice * Number(item.quantity || 0));
                    const itemOriginalTotal = isUnavailable ? 0 : roundPrice(itemOriginalPrice * Number(item.quantity || 0));
                    if (!isUnavailable) {
                        subtotal = roundPrice(subtotal + itemTotal);
                        regularSubtotal = roundPrice(regularSubtotal + itemOriginalTotal);
                        purchasableCartItems.push({ item, liveProduct, itemPrice, itemOriginalPrice, itemDiscountRate });
                    }
                    const statusText = isDeleted ? 'Producto eliminado' : isOutOfStock ? 'Agotado' : `${currentStock} ${currentStock === 1 ? 'disponible' : 'disponibles'}`;
                    const statusClass = isUnavailable ? 'unavailable' : 'available';
                    const itemClass = isUnavailable ? 'cart-item unavailable' : 'cart-item';
                    const displayName = liveProduct?.name || item.name || 'Producto';

                    const itemQuantity = Math.max(1, Math.floor(Number(item.quantity) || 1));
                    cartHtml += `
                        <div class="${itemClass}" aria-label="${displayName}: ${statusText}">
                            <div class="cart-item-image">
                                <img src="${getPrimaryProductImage(liveProduct || item)}" alt="${displayName}" loading="lazy" decoding="async"
                                     onerror="if (!this.dataset.fallback) { this.dataset.fallback='1'; this.src = new URL('generalimg/' + String((liveProduct || item).barcode) + '.jpg', document.baseURI).href; } else { this.removeAttribute('src'); }">
                            </div>
                            <div class="cart-item-details">
                                <h4>${displayName}</h4>
                                <div class="cart-item-price-line">
                                    <p class="cart-item-prices">
                                        <span class="cart-item-discounted-price">$${itemPrice.toFixed(2)}</span>
                                        <span class="cart-item-quantity">× ${itemQuantity}</span>
                                    </p>
                                    <button class="remove-item" type="button" onclick="removeFromCart('${item.barcode}')" aria-label="Eliminar ${displayName}">
                                        <i class="fas fa-trash" aria-hidden="true"></i>
                                    </button>
                                </div>
                                <span class="cart-stock-status ${statusClass}">${statusText}</span>
                            </div>
                        </div>
                    `;
                });
                if (cartItems.dataset.html !== cartHtml) { cartItems.innerHTML = cartHtml; cartItems.dataset.html = cartHtml; }
                window.DaymarPromo?.syncCart(subtotal);
                const baseShippingCost = AppState.shippingEnabled ? CONFIG.shippingCost : 0;
                const benefitQuote = window.DaymarPromo?.quote(subtotal, baseShippingCost) || { coupon:0, shipping:baseShippingCost, total:roundPrice(subtotal + baseShippingCost), kind:'' };
                const shippingCost = benefitQuote.shipping;
                const total = benefitQuote.total;
                document.getElementById('daymarCouponRow').hidden = benefitQuote.coupon <= 0;
                document.getElementById('daymarCouponAmount').textContent = '-$' + benefitQuote.coupon.toFixed(2);
                document.getElementById('daymarCartShippingCost').textContent = '$' + shippingCost.toFixed(2);
                document.getElementById('shippingPrice').textContent = shippingCost === 0 && AppState.shippingEnabled ? 'Envío gratis' : '+$' + CONFIG.shippingCost.toFixed(2);
                whatsappBtn.dataset.daymarBenefitKind = benefitQuote.kind;

                const hasDiscounts = regularSubtotal > subtotal;
                const realPriceRow = document.getElementById('cartRealPriceRow');
                const discountRow = document.getElementById('cartDiscountRow');
                const realPriceEl = document.getElementById('cartRealPrice');
                const discountEl = document.getElementById('cartDiscount');
                if (cartSubtotal) cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
                if (cartTotal) {
                    cartTotal.textContent = `$${total.toFixed(2)}`;
                    const cartTotalRow = cartTotal.closest('.cart-total');
                    if (cartTotalRow) {
                        cartTotalRow.style.display = 'flex';
                        cartTotalRow.style.visibility = 'visible';
                    }
                }
                if (realPriceEl) realPriceEl.textContent = `$${regularSubtotal.toFixed(2)}`;
                if (discountEl) discountEl.textContent = `-$${roundPrice(regularSubtotal - subtotal).toFixed(2)}`;
                if (realPriceRow) realPriceRow.style.display = hasDiscounts ? 'flex' : 'none';
                if (discountRow) discountRow.style.display = hasDiscounts ? 'flex' : 'none';
                if (summary) summary.style.display = 'block';
                
                if (whatsappBtn) {
                    whatsappBtn.style.display = purchasableCartItems.length > 0 ? 'flex' : 'none';
                    const messageLines = purchasableCartItems.map(({ item, liveProduct, itemPrice }, lineIndex) => {
                        const imageUrl = lineIndex === 0 ? getWhatsAppProductImage(liveProduct || item) : '';
                        return `* ${liveProduct?.name || item.name}\n  COD: ${item.barcode}\n  Cantidad: ${item.quantity}\n  Precio: $${itemPrice.toFixed(2)}${imageUrl ? `\n  Tienda: ${imageUrl}` : ''}`;
                    });
                    const shippingText = AppState.shippingEnabled ? `\n\nEnvío nacional: $${shippingCost.toFixed(2)}${benefitQuote.kind === 'shipping' ? ' (beneficio Premium)' : ''}` : '';
                    const benefitText = benefitQuote.coupon > 0 ? `\n\nBeneficio Premium en productos: -$${benefitQuote.coupon.toFixed(2)}` : '';
                    const fullMessage = `*¡Hola! Quiero comprar estos productos de DAYMAR:*\n\n${messageLines.join('\n\n')}${benefitText}${shippingText}\n\n*Total: $${total.toFixed(2)}*\n\n¡Gracias!`;
                    whatsappBtn.href = `https://wa.me/${CONFIG.phoneNumber}?text=${encodeURIComponent(fullMessage)}`;
                }
            }
        }

        function toggleCart() {
            const modal = document.getElementById('cartModal');
            const overlay = document.getElementById('overlay');
            if (!modal || !overlay) return;

            const isActive = modal.classList.contains('active');
            if (isActive) {
                if (modal._closeTimer) clearTimeout(modal._closeTimer);
                overlay.classList.add('is-closing');
                modal.classList.remove('active');
                overlay.classList.remove('active');
                modal._closeTimer = window.setTimeout(() => {
                    overlay.classList.remove('is-closing');
                    modal._closeTimer = null;
                    document.body.style.overflow = '';
                }, 340);
                return;
            }

            if (modal._closeTimer) {
                clearTimeout(modal._closeTimer);
                modal._closeTimer = null;
            }
            modal.classList.remove('is-closing');
            overlay.classList.remove('is-closing');
            const favoritesModal = document.getElementById('favoritesModal');
            if (favoritesModal && favoritesModal.classList.contains('active')) favoritesModal.classList.remove('active');
            modal.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            updateCart();
        }

        function toggleShipping() {
            AppState.shippingEnabled = !AppState.shippingEnabled;
            const toggle = document.getElementById('shippingToggle');
            const price = document.getElementById('shippingPrice');
            const row = document.getElementById('shippingRow');
            
            if (toggle) toggle.classList.toggle('active', AppState.shippingEnabled);
            if (price) price.style.display = AppState.shippingEnabled ? 'block' : 'none';
            if (row) row.style.display = AppState.shippingEnabled ? 'flex' : 'none';
            
            updateCart();
        }

        // ==========================================
        // VISTA PREVIA Y STORY
        // ==========================================
        let currentPreviewIndex = null;

        function openPreview(index) {
            const product = products[index];
            if (!product) return;

            currentPreviewIndex = index;
            const viewedBarcode = String(product.barcode || '');
            if (viewedBarcode) {
                const viewed = AppState.viewedProducts[viewedBarcode] || { count: 0, lastViewed: 0 };
                viewed.count += 1;
                viewed.lastViewed = Date.now();
                AppState.viewedProducts[viewedBarcode] = viewed;
                localStorage.setItem('daymar_viewed_products', JSON.stringify(AppState.viewedProducts));
            }

            const previewModal = document.getElementById('previewModal');
            if (previewModal) {
                previewModal.classList.remove('is-closing');
                if (previewModal._closeTimer) { clearTimeout(previewModal._closeTimer); previewModal._closeTimer = null; }
            }
            const img = document.getElementById('previewImage');
            const previewContainer = document.querySelector('.preview-image-container');
            renderPreviewGallery(product);
            if (img) {
                img.classList.add('is-loading');
                if (previewContainer) previewContainer.classList.add('is-loading');
                img.onload = () => {
                    img.classList.remove('is-loading');
                    if (previewContainer) previewContainer.classList.remove('is-loading');
                };
                img.onerror = () => {
                    img.classList.remove('is-loading');
                    if (previewContainer) previewContainer.classList.remove('is-loading');
                };
                img.src = getPrimaryProductImage(product);
                img.alt = product.name;
                img.classList.toggle('fine-jewelry-preview', isFineJewelryProduct(product));
            }

            const productPrice = getProductPrice(product);

            const previewNameEl = document.getElementById('previewName');
            previewNameEl.textContent = product.name;
            previewNameEl.classList.toggle('long-name', String(product.name || '').length > 18);
            previewNameEl.classList.toggle('very-long-name', String(product.name || '').length > 30);
            document.getElementById('previewBarcode').textContent = `COD: ${product.barcode}`;
            document.getElementById('previewDescription').textContent = product.description || 'No hay descripcion disponible.';
            document.getElementById('previewPrice').textContent = `$${productPrice.toFixed(2)}`;
            const previewOriginalPrice = document.getElementById('previewPriceOriginal');
            previewOriginalPrice.textContent = getDiscountRate(product) > 0 ? `$${getOriginalPrice(product).toFixed(2)}` : '';
            previewOriginalPrice.style.display = getDiscountRate(product) > 0 ? '' : 'none';

            const stockEl = document.getElementById('previewStock');
            if (product.stock > 0) {
                stockEl.textContent = `${product.stock} ${Number(product.stock) === 1 ? 'unidad disponible' : 'unidades disponibles'}`;
                stockEl.classList.remove('out');
            } else {
                stockEl.textContent = 'Agotado';
                stockEl.classList.add('out');
            }

            const favBtn = document.getElementById('previewFavBtn');
            const isFav = AppState.favorites.includes(product.barcode);
            if (favBtn) {
                favBtn.classList.toggle('active', isFav);
                const heartIcon = favBtn.querySelector('i');
                if (heartIcon) {
                    heartIcon.className = isFav ? 'fas fa-heart' : 'far fa-heart';
                }
            }

            const whatsappPreviewBtn = document.getElementById('previewWhatsappBtn');
            if (whatsappPreviewBtn) {
                whatsappPreviewBtn.dataset.barcode = String(product.barcode || '');
                whatsappPreviewBtn.setAttribute('aria-label', `Consultar ${product.name} por WhatsApp`);
            }

            const addBtn = document.getElementById('previewAddBtn');
            if (addBtn) {
                const previewHasStock = Number(product.stock) > 0;
                addBtn.disabled = false;
                addBtn.dataset.barcode = String(product.barcode || '');
                addBtn.classList.toggle('out-of-stock', !previewHasStock);
                addBtn.innerHTML = previewHasStock
                    ? '<i class="fas fa-shopping-bag" style="margin-right: 0.5rem;"></i> AGREGAR AL CARRITO'
                    : '<i class="fas fa-ban" style="margin-right: 0.5rem;"></i> Agotado';
                addBtn.title = previewHasStock ? 'AGREGAR AL CARRITO' : 'Producto agotado';
                addBtn.onclick = () => {
                    if (previewHasStock) {
                        addToCart(index, addBtn);
                    } else {
                        addToCart(index, addBtn);
                    }
                };
            }

            syncAddButtonStates();
            document.getElementById('previewModal').classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function contactProductWhatsApp() {
            if (currentPreviewIndex === null) return;
            const product = products[currentPreviewIndex];
            if (!product) return;
            const price = getProductPrice(product);
            const message = `Hola DAYMAR, quiero consultar disponibilidad de este producto:\n\n*${product.name}*\nCódigo: ${product.barcode}\nPrecio: $${price.toFixed(2)}\n\n¿Me pueden ayudar?`;
            window.open(`https://wa.me/${CONFIG.phoneNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
        }

        function shareProduct() {
            if (currentPreviewIndex === null) return;
            const product = products[currentPreviewIndex];
            if (!product) return;

            const productPrice = getProductPrice(product);
            const shareText = `Mira este producto de DAYMAR: ${product.name} - $${productPrice.toFixed(2)}`;

            if (navigator.share) {
                navigator.share({
                    title: product.name,
                    text: shareText,
                    url: window.location.href
                }).catch(() => {});
            } else {
                navigator.clipboard.writeText(`${shareText} - ${window.location.href}`).then(() => {
                    showNotification('Enlace copiado al portapapeles');
                }).catch(() => {
                    showNotification('No se pudo copiar', 'error');
                });
            }
        }

        function shareWhatsApp() {
            if (currentPreviewIndex === null) return;
            const product = products[currentPreviewIndex];
            if (!product) return;

            const productPrice = getProductPrice(product);
            const shareText = `Mira este producto de DAYMAR: ${product.name} - $${productPrice.toFixed(2)}`;
            const url = `https://wa.me/?text=${encodeURIComponent(shareText + ' - ' + window.location.href)}`;
            window.open(url, '_blank');
        }

        function togglePreviewFavorite() {
            if (currentPreviewIndex === null) return;
            const product = products[currentPreviewIndex];
            if (!product) return;

            const favBtn = document.getElementById('previewFavBtn');
            const heartIcon = favBtn.querySelector('i');
            const isActive = favBtn.classList.contains('active');
            daymarHaptic(favBtn);

            if (!isActive) {
                favBtn.classList.add('active');
                heartIcon.className = 'fas fa-heart';
                if (!AppState.favorites.includes(product.barcode)) {
                    AppState.favorites.push(product.barcode);
                }
                showNotification('Agregado a favoritos');
            } else {
                favBtn.classList.remove('active');
                heartIcon.className = 'far fa-heart';
                AppState.favorites = AppState.favorites.filter(f => f !== product.barcode);
                showNotification('Eliminado de favoritos');
            }

            localStorage.setItem('daymar_favorites', JSON.stringify(AppState.favorites));
            updateFavorites();
        }

        let touchStartX = 0;
        let touchStartY = 0;
        let touchStartTime = 0;

        function openImageLightbox() {
            const previewImage = document.getElementById('previewImage');
            const lightbox = document.getElementById('imageLightbox');
            const lightboxImg = document.getElementById('imageLightboxImg');
            const lightboxCounter = document.getElementById('imageLightboxCounter');
            const previewContainer = document.querySelector('.preview-image-container');
            if (!previewImage || !lightbox || !lightboxImg || !previewImage.src || previewContainer?.dataset.suppressClick === 'true') return;

            lightboxImg.src = currentPreviewImages[currentPreviewImageIndex] || previewImage.src;
            lightboxImg.alt = previewImage.alt || 'Imagen ampliada del producto';
            lightboxCounter.textContent = currentPreviewImages.length > 1
                ? `${currentPreviewImageIndex + 1} / ${currentPreviewImages.length}`
                : '';
            lightbox.classList.add('active');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }

        function closeImageLightbox(e) {
            const lightbox = document.getElementById('imageLightbox');
            if (!lightbox) return;
            if (e && e.target !== e.currentTarget && !e.target.closest('.image-lightbox-close')) return;
            lightbox.classList.remove('active');
            lightbox.setAttribute('aria-hidden', 'true');
            if (document.getElementById('previewModal')?.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        }

        function handleGalleryTouchStart(e) {
            if (!e.touches || e.touches.length !== 1) return;
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            touchStartTime = Date.now();
        }

        function handleGalleryTouchEnd(e) {
            if (!e.changedTouches || e.changedTouches.length !== 1) return;
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const deltaX = endX - touchStartX;
            const deltaY = endY - touchStartY;
            const elapsed = Date.now() - touchStartTime;
            const isHorizontalSwipe = Math.abs(deltaX) >= 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2 && elapsed < 700;

            if (isHorizontalSwipe && currentPreviewImages.length > 1) {
                e.preventDefault();
                const imageContainer = document.querySelector('.preview-image-container');
                if (imageContainer) imageContainer.dataset.suppressClick = 'true';
                changePreviewImage(deltaX < 0 ? 1 : -1);
                window.setTimeout(() => {
                    if (imageContainer) delete imageContainer.dataset.suppressClick;
                }, 350);
            }
        }

        function initGalleryTouchGestures() {
            const previewContainer = document.querySelector('.preview-image-container');
            const lightbox = document.getElementById('imageLightbox');
            [previewContainer, lightbox].filter(Boolean).forEach(target => {
                target.addEventListener('touchstart', handleGalleryTouchStart, { passive: true });
                target.addEventListener('touchend', handleGalleryTouchEnd, { passive: false });
            });
        }

        function closePreview(e) {
            if (e && e.target !== e.currentTarget && !e.target.closest('.close-preview-btn')) return;
            const modal = document.getElementById('previewModal');
            if (!modal || modal.classList.contains('is-closing')) return;
            closeImageLightbox();
            modal.classList.add('is-closing');
            modal._closeTimer = setTimeout(() => {
                modal.classList.remove('active', 'is-closing');
                document.body.style.overflow = '';
                currentPreviewIndex = null;
                currentPreviewImages = [];
                currentPreviewImageIndex = 0;
                modal._closeTimer = null;
            }, 270);
        }
        async function generateStoryImage(platform) {
            if (currentPreviewIndex === null) return;
            
            const product = products[currentPreviewIndex];
            const storyImg = document.getElementById('storyProductImage');
            
            storyImg.src = getPrimaryProductImage(product);
            
            const productPrice = getProductPrice(product);
            
            document.getElementById('storyProductName').textContent = product.name;
            document.getElementById('storyPrice').textContent = `$${productPrice.toFixed(2)}`;
            document.getElementById('storyStock').textContent = product.stock > 0 ? 'Disponible' : 'Agotado';
            document.getElementById('storyCode').textContent = `COD: ${product.barcode}`;
            
            await new Promise(resolve => setTimeout(resolve, 100));
            
            try {
                const element = document.getElementById('storyTemplate');
                
                const canvas = await html2canvas(element, {
                    scale: 1,
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: '#FAFBFC',
                    width: 1080,
                    height: 1920,
                    logging: false
                });
                
                const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
                AppState.currentStoryImage = dataUrl;
                
                document.getElementById('generatedStoryImage').src = dataUrl;
                document.getElementById('storyModal').classList.add('active');
                document.body.style.overflow = 'hidden';
                
            } catch (err) {
                console.error('Error generando imagen:', err);
                showNotification('Error al generar la imagen. Intenta de nuevo.', 'error');
            }
        }

        function closeStoryModal(e) {
            if (e && e.target !== e.currentTarget) return;
            document.getElementById('storyModal').classList.remove('active');
            document.body.style.overflow = '';
        }

        function downloadStory() {
            if (!AppState.currentStoryImage) return;
            
            const link = document.createElement('a');
            link.download = `daymar-${Date.now()}.jpg`;
            link.href = AppState.currentStoryImage;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            showNotification('Imagen descargada');
        }

        async function copyStoryToClipboard() {
            if (!AppState.currentStoryImage) {
                showNotification('Error: No hay imagen para copiar', 'error');
                return;
            }
            
            try {
                const response = await fetch(AppState.currentStoryImage);
                const blob = await response.blob();
                
                await navigator.clipboard.write([
                    new ClipboardItem({ 'image/jpeg': blob })
                ]);
                
                const btn = document.getElementById('copyBtn');
                btn.classList.add('copied');
                btn.innerHTML = '<i class="fas fa-check"></i><span>Copiado!</span>';
                
                showNotification('Imagen copiada al portapapeles');
                
                setTimeout(() => {
                    btn.classList.remove('copied');
                    btn.innerHTML = '<i class="fas fa-copy"></i><span>Copiar imagen</span>';
                }, 3000);
                
            } catch (err) {
                showNotification('No se pudo copiar. Descarga la imagen.', 'error');
            }
        }

        // ==========================================
        // TESTIMONIOS
        // ==========================================
        const testimonials = [
            { name: "Maria F.", text: "Me encanto mi reloj, la calidad es excelente y el envio fue super rapido. Definitivamente volvere a comprar.", date: "Jun 10, 2026", stars: "&#9733;&#9733;&#9733;&#9733;&#9733;" },
            { name: "Carlos M.", text: "Compre varios accesorios para el verano. Precios muy accesibles y la atencion por WhatsApp es excelente.", date: "Jun 8, 2026", stars: "&#9733;&#9733;&#9733;&#9733;&#9733;" },
            { name: "Ana Lucia R.", text: "Los collares son hermosos! Perfectos para el verano. El envio llego en solo 3 dias a Santa Ana.", date: "Jun 5, 2026", stars: "&#9733;&#9733;&#9733;&#9733;&#9733;" }
        ];

        function initTestimonials() {
            const track = document.getElementById('testimonialTrack');
            const dotsContainer = document.getElementById('carouselDots');
            
            if (!track || !dotsContainer) return;
            
            track.innerHTML = testimonials.map(t => `
                <div class="testimonial-slide">
                    <div class="testimonial-card">
                        <div class="testimonial-stars">${t.stars}</div>
                        <p class="testimonial-text">"${t.text}"</p>
                        <div class="testimonial-author">${t.name}</div>
                        <div class="testimonial-date">${t.date}</div>
                    </div>
                </div>
            `).join('');
            
            dotsContainer.innerHTML = testimonials.map((_, i) => 
                `<div class="dot ${i === 0 ? 'active' : ''}" onclick="goToTestimonial(${i})"></div>`
            ).join('');
        }

        function updateCarousel() {
            const track = document.getElementById('testimonialTrack');
            if (!track) return;
            track.style.transform = `translateX(-${AppState.currentTestimonial * 100}%)`;
            
            document.querySelectorAll('.dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === AppState.currentTestimonial);
            });
        }

        function nextTestimonial() {
            AppState.currentTestimonial = (AppState.currentTestimonial + 1) % testimonials.length;
            updateCarousel();
        }

        function prevTestimonial() {
            AppState.currentTestimonial = (AppState.currentTestimonial - 1 + testimonials.length) % testimonials.length;
            updateCarousel();
        }

        function goToTestimonial(index) {
            AppState.currentTestimonial = index;
            updateCarousel();
        }

        // ==========================================
        // UTILIDADES
        // ==========================================
        function focusSearch() {
            const searchInput = document.getElementById('searchInput');
            if (!searchInput) return;

            // En movil conservamos la posicion del cliente para que no pierda
            // de vista los productos que estaba revisando.
            const isMobile = window.matchMedia('(max-width: 768px)').matches;
            try {
                searchInput.focus({ preventScroll: isMobile });
            } catch (error) {
                searchInput.focus();
            }

            // En escritorio si se puede llevar al buscador suavemente.
            if (!isMobile) {
                searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }

        function showNotification(message, type = 'success') {
            const notification = document.getElementById('notification');
            if (!notification) return;

            clearTimeout(notificationTimer);
            notification.classList.remove('show', 'error');
            void notification.offsetWidth;
            notification.textContent = message;
            if (type === 'error') {
                notification.classList.add('error');
            }
            notification.classList.add('show');

            notificationTimer = setTimeout(() => {
                notification.classList.remove('show');
            }, 2000);
        }

        function showNewsletter() {
            window.daymarWelcome?.show();
        }

        function closeNewsletter() {
            window.daymarWelcome?.close();
        }

        function submitComment(e) {
            e.preventDefault();
            showNotification('Gracias por tu comentario');
            e.target.reset();
        }

        function initWhatsAppCyclicAnimation() {
            const float = document.getElementById('whatsappFloat');
            if (!float) return;
            let isVisible = true;
            
            function cycle() {
                if (isVisible) {
                    setTimeout(() => {
                        float.style.opacity = '0';
                        float.style.pointerEvents = 'none';
                        isVisible = false;
                        cycle();
                    }, CONFIG.whatsappVisibleDuration);
                } else {
                    setTimeout(() => {
                        float.style.opacity = '1';
                        float.style.pointerEvents = 'all';
                        isVisible = true;
                        cycle();
                    }, CONFIG.whatsappHiddenDuration);
                }
            }
            cycle();
        }



        function getMostViewedProducts(limit = 6) {
            return Object.entries(AppState.viewedProducts)
                .sort(([, a], [, b]) => (b.count || 0) - (a.count || 0) || (b.lastViewed || 0) - (a.lastViewed || 0))
                .slice(0, limit)
                .map(([barcode, stats]) => ({ product: products.find(item => String(item.barcode) === String(barcode)), ...stats }))
                .filter(item => item.product);
        }

        // ==========================================
        // INICIALIZACION
        // ==========================================
        document.addEventListener('DOMContentLoaded', async function() {
            // La navegación ya está conectada en su controlador independiente.
            console.log('DAYMAR - Iniciando...');
            detectDevicePlatform();
            initFavoritesMobileGestures();
            
            initFloatingHearts();
            initImageObserver();
            initGalleryTouchGestures();
            initWhatsAppCyclicAnimation();

            AppState.isMobile = window.matchMedia('(max-width: 768px)').matches;
            
            initTestimonials();
            renderSkeletons(8);
            try { await (window.DaymarSistema && window.DaymarSistema.ready); } catch (e) {}
            
            if (typeof products !== 'undefined' && Array.isArray(products)) {
                // Ignora registros vacíos o incompletos para que una actualización de
                // products.js no deje el catálogo completo en blanco.
                const validProducts = products.filter(product => product && typeof product === 'object');
                AppState.filteredProducts = prepareAllProducts(validProducts);
                restoreLastCategory();
                
                const validBarcodes = new Set(validProducts.map(p => p.barcode).filter(Boolean));
                AppState.cart = AppState.cart.filter(item => validBarcodes.has(item.barcode));
                AppState.favorites = AppState.favorites.filter(barcode => validBarcodes.has(barcode));
                
                localStorage.setItem('daymar_cart', JSON.stringify(AppState.cart));
                localStorage.setItem('daymar_favorites', JSON.stringify(AppState.favorites));
                
                setTimeout(() => {
                    document.getElementById('productsContainer').innerHTML = '';
                    renderProducts();
                    updateProductsCount();
                    initInfiniteScroll();
                    updateCart();
                    updateFavorites();
                }, 150);
            } else {
                document.getElementById('productsContainer').innerHTML = 
                    '<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--gris);">Error cargando productos</div>';
            }
            
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.addEventListener('input', debounce((e) => {
                    searchProducts(e.target.value);
                }, 180));
            }

            initCatalogSortDialog();

            const categoryFilter = document.getElementById('categoryFilter');
            if (categoryFilter) categoryFilter.addEventListener('change', event => setCatalogCategoryFilter(event.target.value));
            ['minPriceFilter', 'maxPriceFilter'].forEach(id => {
                const priceInput = document.getElementById(id);
                if (priceInput) priceInput.addEventListener('input', debounce(applyCatalogFilters, 180));
            });
            const onlyAvailableInput = document.getElementById('onlyAvailableFilter');
            if (onlyAvailableInput) onlyAvailableInput.addEventListener('change', applyCatalogFilters);

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    if (document.getElementById('cartConfirmOverlay')?.classList.contains('active')) {
                        closeClearCartConfirm();
                        return;
                    }
                    if (document.getElementById('imageLightbox')?.classList.contains('active')) {
                        closeImageLightbox();
                        return;
                    }
                    const modals = ['previewModal', 'storyModal', 'cartModal', 'favoritesModal'];
                    modals.forEach(id => {
                        const el = document.getElementById(id);
                        if (el && (el.classList.contains('active') || getComputedStyle(el).right === '0px')) {
                            if (id === 'cartModal') toggleCart();
                            else if (id === 'favoritesModal') toggleFavorites();
                            else if (id === 'previewModal') {
                                closePreview();
                            } else {
                                el.classList.remove('active');
                                document.body.style.overflow = '';
                            }
                        }
                    });
                    closeNewsletter();
                }
            });

            // La bienvenida se programó de forma independiente con una espera de 2 segundos.
            setInterval(nextTestimonial, 5000);
        });

        // Redimensionar no cierra el menú ni desincroniza aria-expanded.
