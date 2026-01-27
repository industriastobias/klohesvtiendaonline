const CONFIG = {
    WHATSAPP_NUMBER: '50366711569',
    SHIPPING_COST: 3.75,
    PRODUCTS_PER_PAGE: 20
};

let products = [];
let cart = [];
let currentDiscount = 0;
let shippingSelected = false;
let currentQuickViewId = null;
let currentPage = 0;
let filteredProducts = [];
let displayedProducts = [];

const valentineMessages = [
    "Colección San Valentín",
    "Piezas únicas para momentos inolvidables",
    "Regala amor, regala Klohe",
    "Elegancia en cada detalle"
];

const customerReviews = [
    { name: "María G.", text: "Los aretes son hermosos, excelente calidad", product: "Aritos Corazón", stars: 5 },
    { name: "Carlos M.", text: "Llegó justo a tiempo para el 14 de febrero", product: "Collar Amor", stars: 5 },
    { name: "Ana L.", text: "La pulsera es preciosa, muy delicada", product: "Pulsera Corazón", stars: 5 },
    { name: "Pedro S.", text: "Servicio excelente y envío rápido", product: "Cartera Elegante", stars: 5 },
    { name: "Lucía R.", text: "El reloj es hermoso, justo lo que buscaba", product: "Reloj Corazón", stars: 5 }
];

// Función para determinar el material del producto
function getProductMaterial(name, code, category) {
    if (code === '02222') {
        return null;
    }
    if (name.toLowerCase().includes('plata') || code.startsWith('02224')) {
        return 'Aguja de Plata italiana 925';
    }
    if (['Aritos', 'Collares', 'Pulseras', 'Anillos'].includes(category)) {
        return 'Acero inoxidable resistente a salpicaduras de agua';
    }
    return null;
}

// TODOS LOS 228 PRODUCTOS DEL INVENTARIO
const realProducts = [
    // CARTERAS (45 productos)
    { id: 1, name: "Billetera", code: "076", price: 10.00, stock: 0, category: "Carteras", isNew: false },
    { id: 2, name: "Bolso de Mano", code: "088", price: 10.00, stock: 1, category: "Carteras", isNew: false },
    { id: 3, name: "Cartera", code: "03", price: 12.50, stock: 1, category: "Carteras", isNew: false },
    { id: 4, name: "Cartera", code: "014", price: 12.00, stock: 1, category: "Carteras", isNew: false },
    { id: 5, name: "Cartera", code: "033", price: 10.99, stock: 1, category: "Carteras", isNew: false },
    { id: 6, name: "Cartera", code: "035", price: 16.50, stock: 0, category: "Carteras", isNew: false },
    { id: 7, name: "Cartera", code: "071", price: 15.00, stock: 0, category: "Carteras", isNew: false },
    { id: 8, name: "Cartera", code: "073", price: 10.00, stock: 1, category: "Carteras", isNew: false },
    { id: 9, name: "Cartera", code: "00000", price: 13.50, stock: 0, category: "Carteras", isNew: false },
    { id: 10, name: "Cartera", code: "086", price: 18.50, stock: 1, category: "Carteras", isNew: false },
    { id: 11, name: "Cartera", code: "087", price: 18.50, stock: 1, category: "Carteras", isNew: false },
    { id: 12, name: "Cartera", code: "089", price: 14.99, stock: 1, category: "Carteras", isNew: false },
    { id: 13, name: "Cartera", code: "096", price: 14.99, stock: 1, category: "Carteras", isNew: false },
    { id: 14, name: "Cartera", code: "097", price: 14.99, stock: 1, category: "Carteras", isNew: false },
    { id: 15, name: "Cartera", code: "098", price: 24.00, stock: 1, category: "Carteras", isNew: false },
    { id: 16, name: "Cartera", code: "099", price: 14.99, stock: 1, category: "Carteras", isNew: false },
    { id: 17, name: "Cartera", code: "114", price: 14.99, stock: 0, category: "Carteras", isNew: false },
    { id: 18, name: "Cartera", code: "127", price: 12.00, stock: 1, category: "Carteras", isNew: false },
    { id: 19, name: "Cartera", code: "128", price: 13.99, stock: 1, category: "Carteras", isNew: false },
    { id: 20, name: "Cartera", code: "129", price: 13.99, stock: 1, category: "Carteras", isNew: false },
    { id: 21, name: "Cartera", code: "130", price: 15.00, stock: 0, category: "Carteras", isNew: false },
    { id: 22, name: "Cartera", code: "132", price: 14.00, stock: 2, category: "Carteras", isNew: false },
    { id: 23, name: "Cartera", code: "147", price: 14.99, stock: 1, category: "Carteras", isNew: false },
    { id: 24, name: "Cartera", code: "148", price: 14.00, stock: 1, category: "Carteras", isNew: false },
    { id: 25, name: "Cartera", code: "149", price: 15.99, stock: 1, category: "Carteras", isNew: true },
    { id: 26, name: "Cartera", code: "150", price: 15.99, stock: 1, category: "Carteras", isNew: true },
    { id: 27, name: "Cartera", code: "151", price: 13.50, stock: 0, category: "Carteras", isNew: false },
    { id: 28, name: "Cartera", code: "152", price: 14.00, stock: 1, category: "Carteras", isNew: false },
    { id: 29, name: "Cartera", code: "153", price: 14.00, stock: 0, category: "Carteras", isNew: false },
    { id: 30, name: "Cartera Beige", code: "068", price: 10.50, stock: 1, category: "Carteras", isNew: false },
    { id: 31, name: "Cartera Blanca", code: "022", price: 13.00, stock: 0, category: "Carteras", isNew: false },
    { id: 32, name: "Cartera Blanca", code: "049", price: 10.99, stock: 1, category: "Carteras", isNew: false },
    { id: 33, name: "Cartera Blanca", code: "058", price: 10.99, stock: 0, category: "Carteras", isNew: false },
    { id: 34, name: "Cartera Blanca", code: "063", price: 10.50, stock: 1, category: "Carteras", isNew: false },
    { id: 35, name: "Cartera Blanca", code: "075", price: 13.50, stock: 0, category: "Carteras", isNew: false },
    { id: 36, name: "Cartera Blanca", code: "190", price: 10.99, stock: 0, category: "Carteras", isNew: false },
    { id: 37, name: "Cartera Café", code: "899", price: 17.75, stock: 0, category: "Carteras", isNew: false },
    { id: 38, name: "Cartera Clásica", code: "051", price: 20.00, stock: 0, category: "Carteras", isNew: false },
    { id: 39, name: "Cartera Clásica", code: "061", price: 12.50, stock: 0, category: "Carteras", isNew: false },
    { id: 40, name: "Cartera Morada", code: "054", price: 10.99, stock: 0, category: "Carteras", isNew: false },
    { id: 41, name: "Cartera Negra", code: "047", price: 10.99, stock: 1, category: "Carteras", isNew: false },
    { id: 42, name: "Cartera Roja", code: "074", price: 13.50, stock: 0, category: "Carteras", isNew: false },
    { id: 43, name: "Cartera Rosada", code: "023", price: 9.50, stock: 1, category: "Carteras", isNew: false },
    { id: 44, name: "Cartera Vino", code: "053", price: 18.00, stock: 0, category: "Carteras", isNew: false },
    { id: 45, name: "Carteras", code: "181", price: 10.00, stock: 1, category: "Carteras", isNew: false },
    
    // ARITOS (49 productos)
    { id: 46, name: "Aritos", code: "046", price: 3.50, stock: 1, category: "Aritos", isNew: true },
    { id: 47, name: "Aretas", code: "179", price: 8.50, stock: 1, category: "Aritos", isNew: false },
    { id: 48, name: "Arete", code: "060", price: 7.00, stock: 1, category: "Aritos", isNew: false },
    { id: 49, name: "Aretes", code: "174", price: 8.50, stock: 1, category: "Aritos", isNew: false },
    { id: 50, name: "Aretes de Corazón", code: "056", price: 4.50, stock: 0, category: "Aritos", isNew: true },
    { id: 51, name: "Aritos", code: "028393992", price: 6.00, stock: 0, category: "Aritos", isNew: false },
    { id: 52, name: "Aritos", code: "06", price: 7.00, stock: 0, category: "Aritos", isNew: false },
    { id: 53, name: "Aritos", code: "07", price: 5.00, stock: 0, category: "Aritos", isNew: false },
    { id: 54, name: "Aritos", code: "09", price: 7.00, stock: 1, category: "Aritos", isNew: false },
    { id: 55, name: "Aritos", code: "011", price: 7.00, stock: 0, category: "Aritos", isNew: false },
    { id: 56, name: "Aritos", code: "013", price: 7.00, stock: 1, category: "Aritos", isNew: false },
    { id: 57, name: "Aritos", code: "036", price: 3.50, stock: 0, category: "Aritos", isNew: false },
    { id: 58, name: "Aritos", code: "079", price: 5.00, stock: 0, category: "Aritos", isNew: false },
    { id: 59, name: "Aritos", code: "080", price: 4.00, stock: 0, category: "Aritos", isNew: false },
    { id: 60, name: "Aritos", code: "081", price: 6.00, stock: 0, category: "Aritos", isNew: false },
    { id: 61, name: "Aritos", code: "082", price: 6.50, stock: 0, category: "Aritos", isNew: false },
    { id: 62, name: "Aritos", code: "085", price: 8.00, stock: 1, category: "Aritos", isNew: false },
    { id: 63, name: "Aritos", code: "092", price: 3.50, stock: 0, category: "Aritos", isNew: false },
    { id: 64, name: "Aritos", code: "100", price: 5.00, stock: 0, category: "Aritos", isNew: false },
    { id: 65, name: "Aritos", code: "101", price: 5.50, stock: 1, category: "Aritos", isNew: false },
    { id: 66, name: "Aritos", code: "102", price: 5.00, stock: 0, category: "Aritos", isNew: false },
    { id: 67, name: "Aritos", code: "107", price: 8.00, stock: 1, category: "Aritos", isNew: false },
    { id: 68, name: "Aritos", code: "108", price: 7.99, stock: 0, category: "Aritos", isNew: false },
    { id: 69, name: "Aritos", code: "115", price: 6.99, stock: 1, category: "Aritos", isNew: false },
    { id: 70, name: "Aritos", code: "116", price: 6.50, stock: 1, category: "Aritos", isNew: false },
    { id: 71, name: "Aritos", code: "117", price: 7.50, stock: 1, category: "Aritos", isNew: false },
    { id: 72, name: "Aritos", code: "118", price: 8.00, stock: 1, category: "Aritos", isNew: false },
    { id: 73, name: "Aritos", code: "119", price: 6.00, stock: 0, category: "Aritos", isNew: false },
    { id: 74, name: "Aritos", code: "124", price: 4.00, stock: 7, category: "Aritos", isNew: false },
    { id: 75, name: "Aritos", code: "140", price: 5.50, stock: 0, category: "Aritos", isNew: false },
    { id: 76, name: "Aritos", code: "156", price: 7.50, stock: 1, category: "Aritos", isNew: false },
    { id: 77, name: "Aritos", code: "157", price: 8.99, stock: 1, category: "Aritos", isNew: false },
    { id: 78, name: "Aritos", code: "158", price: 8.99, stock: 1, category: "Aritos", isNew: false },
    { id: 79, name: "Aritos", code: "166", price: 7.00, stock: 3, category: "Aritos", isNew: false },
    { id: 80, name: "Aritos", code: "168", price: 5.50, stock: 1, category: "Aritos", isNew: false },
    { id: 81, name: "Aritos", code: "169", price: 6.50, stock: 0, category: "Aritos", isNew: false },
    { id: 82, name: "Aritos", code: "170", price: 7.50, stock: 2, category: "Aritos", isNew: false },
    { id: 83, name: "Aritos", code: "176", price: 6.50, stock: 1, category: "Aritos", isNew: false },
    { id: 84, name: "Aritos", code: "178", price: 8.50, stock: 1, category: "Aritos", isNew: false },
    { id: 85, name: "Aritos", code: "177", price: 8.50, stock: 1, category: "Aritos", isNew: false },
    { id: 86, name: "Aritos", code: "19009", price: 5.00, stock: 1, category: "Aritos", isNew: false },
    { id: 87, name: "Aritos", code: "190012", price: 7.00, stock: 1, category: "Aritos", isNew: false },
    { id: 88, name: "Aritos", code: "1991919", price: 2.00, stock: 1, category: "Aritos", isNew: false },
    { id: 89, name: "Aritos de Estrella", code: "019", price: 3.00, stock: 0, category: "Aritos", isNew: false },
    { id: 90, name: "Aritos", code: "02222", price: 5.00, stock: 1, category: "Aritos", isNew: true },
    { id: 91, name: "Aritos de Plata", code: "02224", price: 6.00, stock: 1, category: "Aritos", isNew: true },
    { id: 92, name: "Aritos de Plata", code: "02226", price: 6.00, stock: 1, category: "Aritos", isNew: true },
    { id: 93, name: "Aritos de Plata", code: "02227", price: 6.00, stock: 1, category: "Aritos", isNew: true },
    { id: 94, name: "Aritos de Plata", code: "02228", price: 6.00, stock: 1, category: "Aritos", isNew: true },
    
    // COLLARES (60 productos)
    { id: 95, name: "Collar Playa", code: "029", price: 5.50, stock: 0, category: "Collares", isNew: false },
    { id: 96, name: "Collar de Playa", code: "066", price: 12.75, stock: 1, category: "Collares", isNew: false },
    { id: 97, name: "Collar", code: "10199191", price: 9.50, stock: 1, category: "Collares", isNew: false },
    { id: 98, name: "Collar", code: "17801", price: 10.00, stock: 1, category: "Collares", isNew: false },
    { id: 99, name: "Collar", code: "024", price: 12.00, stock: 0, category: "Collares", isNew: false },
    { id: 100, name: "Collar", code: "025", price: 12.00, stock: 1, category: "Collares", isNew: false },
    { id: 101, name: "Collar", code: "028", price: 8.00, stock: 3, category: "Collares", isNew: false },
    { id: 102, name: "Collar", code: "034", price: 15.00, stock: 1, category: "Collares", isNew: false },
    { id: 103, name: "Collar", code: "039", price: 11.50, stock: 1, category: "Collares", isNew: false },
    { id: 104, name: "Collar", code: "040", price: 10.00, stock: 0, category: "Collares", isNew: false },
    { id: 105, name: "Collar", code: "070", price: 12.00, stock: 1, category: "Collares", isNew: false },
    { id: 106, name: "Collar", code: "072", price: 11.50, stock: 1, category: "Collares", isNew: false },
    { id: 107, name: "Collar", code: "077", price: 13.50, stock: 1, category: "Collares", isNew: false },
    { id: 108, name: "Collar", code: "083", price: 0.00, stock: 0, category: "Collares", isNew: false },
    { id: 109, name: "Collar", code: "084", price: 13.00, stock: 1, category: "Collares", isNew: false },
    { id: 110, name: "Collar", code: "090", price: 12.50, stock: 1, category: "Collares", isNew: false },
    { id: 111, name: "Collar", code: "091", price: 12.00, stock: 1, category: "Collares", isNew: false },
    { id: 112, name: "Collar", code: "093", price: 12.00, stock: 1, category: "Collares", isNew: false },
    { id: 113, name: "Collar", code: "094", price: 12.00, stock: 0, category: "Collares", isNew: false },
    { id: 114, name: "Collar", code: "095", price: 12.00, stock: 0, category: "Collares", isNew: false },
    { id: 115, name: "Collar", code: "104", price: 15.00, stock: 1, category: "Collares", isNew: false },
    { id: 116, name: "Collar", code: "109", price: 11.00, stock: 0, category: "Collares", isNew: false },
    { id: 117, name: "Collar", code: "110", price: 13.99, stock: 1, category: "Collares", isNew: false },
    { id: 118, name: "Collar", code: "111", price: 14.99, stock: 1, category: "Collares", isNew: false },
    { id: 119, name: "Collar", code: "113", price: 12.00, stock: 0, category: "Collares", isNew: false },
    { id: 120, name: "Collar", code: "126", price: 12.00, stock: 1, category: "Collares", isNew: false },
    { id: 121, name: "Collar", code: "133", price: 10.00, stock: 1, category: "Collares", isNew: false },
    { id: 122, name: "Collar", code: "134", price: 12.00, stock: 2, category: "Collares", isNew: false },
    { id: 123, name: "Collar", code: "135", price: 15.00, stock: 1, category: "Collares", isNew: false },
    { id: 124, name: "Collar", code: "136", price: 15.00, stock: 1, category: "Collares", isNew: false },
    { id: 125, name: "Collar", code: "139", price: 10.00, stock: 1, category: "Collares", isNew: false },
    { id: 126, name: "Collar", code: "141", price: 10.00, stock: 1, category: "Collares", isNew: false },
    { id: 127, name: "Collar", code: "145", price: 12.99, stock: 1, category: "Collares", isNew: false },
    { id: 128, name: "Collar", code: "155", price: 10.00, stock: 1, category: "Collares", isNew: false },
    { id: 129, name: "Collar", code: "163", price: 12.00, stock: 1, category: "Collares", isNew: false },
    { id: 130, name: "Collar", code: "164", price: 12.00, stock: 1, category: "Collares", isNew: false },
    { id: 131, name: "Collar", code: "165", price: 12.00, stock: 1, category: "Collares", isNew: false },
    { id: 132, name: "Collar", code: "171", price: 12.00, stock: 1, category: "Collares", isNew: false },
    { id: 133, name: "Collar", code: "172", price: 15.00, stock: 1, category: "Collares", isNew: false },
    { id: 134, name: "Collar", code: "173", price: 12.00, stock: 1, category: "Collares", isNew: false },
    { id: 135, name: "Collar", code: "175", price: 12.00, stock: 3, category: "Collares", isNew: false },
    { id: 136, name: "Collar", code: "183", price: 10.00, stock: 1, category: "Collares", isNew: false },
    { id: 137, name: "Collar", code: "184", price: 10.00, stock: 1, category: "Collares", isNew: false },
    { id: 138, name: "Collar", code: "1200", price: 10.00, stock: 1, category: "Collares", isNew: false },
    { id: 139, name: "Collar", code: "01116", price: 12.00, stock: 1, category: "Collares", isNew: false },
    { id: 140, name: "Collar", code: "01127", price: 10.00, stock: 1, category: "Collares", isNew: false },
    { id: 141, name: "Collar", code: "01129", price: 10.00, stock: 1, category: "Collares", isNew: false },
    { id: 142, name: "Collar Clásico", code: "020", price: 10.00, stock: 2, category: "Collares", isNew: false },
    { id: 143, name: "Collar Corazón Negro", code: "062", price: 10.00, stock: 1, category: "Collares", isNew: true },
    { id: 144, name: "Collar Cruz Redondo", code: "016", price: 12.00, stock: 1, category: "Collares", isNew: false },
    { id: 145, name: "Collar Flor", code: "055", price: 10.50, stock: 1, category: "Collares", isNew: false },
    { id: 146, name: "Collar Flor", code: "065", price: 11.50, stock: 1, category: "Collares", isNew: false },
    { id: 147, name: "Collar Perlas", code: "048", price: 13.50, stock: 0, category: "Collares", isNew: false },
    { id: 148, name: "Collar Sol", code: "89009", price: 11.00, stock: 0, category: "Collares", isNew: false },
    { id: 149, name: "Collar Doble", code: "010", price: 15.00, stock: 0, category: "Collares", isNew: false },
    { id: 150, name: "Collar Doble", code: "027", price: 15.00, stock: 1, category: "Collares", isNew: false },
    { id: 151, name: "Collar Doble Corazón", code: "067", price: 14.00, stock: 0, category: "Collares", isNew: true },
    { id: 152, name: "Collar Mariposa", code: "200", price: 10.00, stock: 0, category: "Collares", isNew: false },
    { id: 153, name: "Set Collar", code: "142", price: 18.50, stock: 1, category: "Collares", isNew: false },
    { id: 154, name: "Set de Collar", code: "078", price: 13.50, stock: 1, category: "Collares", isNew: false },
    
    // LENTES (2 productos)
    { id: 155, name: "Lentes de Sol", code: "015", price: 7.50, stock: 1, category: "Lentes de sol", isNew: false },
    { id: 156, name: "Lentes Negros", code: "037", price: 5.75, stock: 1, category: "Lentes de sol", isNew: false },
    
    // PULSERAS (31 productos)
    { id: 157, name: "Bracelet", code: "041", price: 7.00, stock: 0, category: "Pulseras", isNew: false },
    { id: 158, name: "Brasalet", code: "038", price: 10.00, stock: 0, category: "Pulseras", isNew: false },
    { id: 159, name: "Pulsera", code: "042", price: 5.00, stock: 1, category: "Pulseras", isNew: false },
    { id: 160, name: "Pulsera", code: "043", price: 7.00, stock: 2, category: "Pulseras", isNew: false },
    { id: 161, name: "Pulsera", code: "044", price: 10.00, stock: 1, category: "Pulseras", isNew: false },
    { id: 162, name: "Pulsera", code: "064", price: 6.00, stock: 0, category: "Pulseras", isNew: false },
    { id: 163, name: "Pulsera", code: "103", price: 12.00, stock: 0, category: "Pulseras", isNew: false },
    { id: 164, name: "Pulsera", code: "105", price: 12.99, stock: 1, category: "Pulseras", isNew: false },
    { id: 165, name: "Pulsera", code: "106", price: 10.00, stock: 0, category: "Pulseras", isNew: false },
    { id: 166, name: "Pulsera", code: "112", price: 10.00, stock: 0, category: "Pulseras", isNew: false },
    { id: 167, name: "Pulsera", code: "146", price: 12.00, stock: 1, category: "Pulseras", isNew: false },
    { id: 168, name: "Pulsera", code: "159", price: 13.00, stock: 3, category: "Pulseras", isNew: false },
    { id: 169, name: "Pulsera", code: "160", price: 10.00, stock: 0, category: "Pulseras", isNew: false },
    { id: 170, name: "Pulsera", code: "161", price: 9.00, stock: 0, category: "Pulseras", isNew: false },
    { id: 171, name: "Pulsera", code: "167", price: 12.00, stock: 0, category: "Pulseras", isNew: false },
    { id: 172, name: "Pulsera", code: "198", price: 10.00, stock: 0, category: "Pulseras", isNew: false },
    { id: 173, name: "Pulsera", code: "9789", price: 8.00, stock: 1, category: "Pulseras", isNew: false },
    { id: 174, name: "Pulsera", code: "8967", price: 7.00, stock: 1, category: "Pulseras", isNew: false },
    { id: 175, name: "Pulsera", code: "1250", price: 5.50, stock: 0, category: "Pulseras", isNew: false },
    { id: 176, name: "Pulsera", code: "01126", price: 10.00, stock: 2, category: "Pulseras", isNew: false },
    { id: 177, name: "Pulsera", code: "02221", price: 10.50, stock: 3, category: "Pulseras", isNew: false },
    { id: 178, name: "Pulsera", code: "02223", price: 10.00, stock: 1, category: "Pulseras", isNew: false },
    { id: 179, name: "Pulsera", code: "03331", price: 12.00, stock: 1, category: "Pulseras", isNew: false },
    { id: 180, name: "Pulsera", code: "03332", price: 12.00, stock: 1, category: "Pulseras", isNew: false },
    { id: 181, name: "Pulsera", code: "2001", price: 10.00, stock: 0, category: "Pulseras", isNew: false },
    { id: 182, name: "Pulsera Ajustable", code: "018", price: 10.00, stock: 0, category: "Pulseras", isNew: false },
    { id: 183, name: "Pulsera Básica", code: "030", price: 6.00, stock: 1, category: "Pulseras", isNew: false },
    { id: 184, name: "Pulsera Cartier", code: "032", price: 10.00, stock: 0, category: "Pulseras", isNew: false },
    { id: 185, name: "Pulsera Cartier", code: "031", price: 11.00, stock: 0, category: "Pulseras", isNew: false },
    { id: 186, name: "Pulsera Trébol", code: "01118", price: 12.00, stock: 1, category: "Pulseras", isNew: false },
    { id: 187, name: "Van Cleef", code: "050", price: 12.00, stock: 0, category: "Pulseras", isNew: false },
    
    // RELOJES (30 productos)
    { id: 188, name: "Reloj", code: "01111", price: 15.00, stock: 1, category: "Relojes", isNew: false },
    { id: 189, name: "Reloj", code: "01125", price: 20.00, stock: 2, category: "Relojes", isNew: false },
    { id: 190, name: "Reloj", code: "03333", price: 16.00, stock: 1, category: "Relojes", isNew: false },
    { id: 191, name: "Reloj", code: "03334", price: 25.00, stock: 1, category: "Relojes", isNew: false },
    { id: 192, name: "Reloj", code: "03335", price: 16.00, stock: 1, category: "Relojes", isNew: false },
    { id: 193, name: "Reloj", code: "03336", price: 20.00, stock: 1, category: "Relojes", isNew: false },
    { id: 194, name: "Reloj", code: "03337", price: 15.00, stock: 1, category: "Relojes", isNew: false },
    { id: 195, name: "Reloj", code: "03338", price: 20.00, stock: 1, category: "Relojes", isNew: false },
    { id: 196, name: "Reloj", code: "03339", price: 20.00, stock: 1, category: "Relojes", isNew: false },
    { id: 197, name: "Reloj", code: "033340", price: 15.00, stock: 1, category: "Relojes", isNew: false },
    { id: 198, name: "Reloj", code: "033341", price: 15.00, stock: 1, category: "Relojes", isNew: false },
    { id: 199, name: "Reloj", code: "033342", price: 15.00, stock: 1, category: "Relojes", isNew: false },
    { id: 200, name: "Reloj", code: "033343", price: 15.00, stock: 1, category: "Relojes", isNew: false },
    { id: 201, name: "Reloj", code: "033344", price: 20.00, stock: 1, category: "Relojes", isNew: false },
    { id: 202, name: "Reloj", code: "033345", price: 15.00, stock: 1, category: "Relojes", isNew: false },
    { id: 203, name: "Reloj", code: "033346", price: 15.00, stock: 1, category: "Relojes", isNew: false },
    { id: 204, name: "Reloj", code: "033347", price: 25.00, stock: 1, category: "Relojes", isNew: false },
    { id: 205, name: "Reloj", code: "033348", price: 30.00, stock: 1, category: "Relojes", isNew: false },
    { id: 206, name: "Reloj", code: "033349", price: 20.00, stock: 1, category: "Relojes", isNew: false },
    { id: 207, name: "Reloj", code: "033350", price: 18.00, stock: 2, category: "Relojes", isNew: false },
    { id: 208, name: "Reloj Blanco", code: "011144", price: 15.00, stock: 1, category: "Relojes", isNew: false },
    { id: 209, name: "Reloj Acero", code: "01117", price: 15.00, stock: 2, category: "Relojes", isNew: false },
    { id: 210, name: "Reloj Acero", code: "01123", price: 15.00, stock: 1, category: "Relojes", isNew: false },
    { id: 211, name: "Reloj Dorado Waterproof", code: "01122", price: 20.00, stock: 1, category: "Relojes", isNew: false },
    { id: 212, name: "Reloj Negro", code: "01113", price: 15.00, stock: 1, category: "Relojes", isNew: false },
    { id: 213, name: "Reloj Old Money", code: "01124", price: 15.00, stock: 2, category: "Relojes", isNew: false },
    { id: 214, name: "Reloj Rojo", code: "01119", price: 15.00, stock: 1, category: "Relojes", isNew: false },
    { id: 215, name: "Reloj Rojo", code: "01121", price: 15.00, stock: 1, category: "Relojes", isNew: false },
    { id: 216, name: "Set Reloj y Pulsera", code: "01115", price: 14.00, stock: 1, category: "Relojes", isNew: false },
    { id: 217, name: "Set Reloj", code: "01112", price: 40.00, stock: 1, category: "Relojes", isNew: false },
    
    // ANILLOS (8 productos)
    { id: 218, name: "Anillo", code: "02", price: 10.00, stock: 1, category: "Anillos", isNew: false },
    { id: 219, name: "Anillo", code: "04", price: 10.00, stock: 1, category: "Anillos", isNew: false },
    { id: 220, name: "Anillo", code: "08", price: 10.00, stock: 1, category: "Anillos", isNew: false },
    { id: 221, name: "Anillo", code: "017", price: 10.00, stock: 1, category: "Anillos", isNew: false },
    { id: 222, name: "Anillo", code: "021", price: 10.00, stock: 1, category: "Anillos", isNew: false },
    { id: 223, name: "Anillo", code: "045", price: 10.00, stock: 1, category: "Anillos", isNew: false },
    { id: 224, name: "Anillo", code: "057", price: 10.00, stock: 1, category: "Anillos", isNew: false },
    { id: 225, name: "Anillo", code: "059", price: 10.00, stock: 1, category: "Anillos", isNew: false },
    
    // ACCESORIOS CABELLO (1 producto)
    { id: 226, name: "Accesorios Cabello", code: "137", price: 0.25, stock: 20, category: "Accesorios para el cabello", isNew: false },
    
    // OTROS (2 productos)
    { id: 227, name: "Cereza", code: "122", price: 5.25, stock: 4, category: "Otros", isNew: false },
    { id: 228, name: "Tarjetas Navideñas", code: "154", price: 0.00, stock: 121, category: "Otros", isNew: false }
];

document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    products = [...realProducts];
    filteredProducts = [...products];
    sortProducts();
    renderProducts();
    initRotatingMessages();
    initReviews();
    generateInstagramFeed();
    initOfflineDetection();
});

function sortProducts() {
    filteredProducts.sort((a, b) => {
        if (a.stock === 0 && b.stock > 0) return 1;
        if (b.stock === 0 && a.stock > 0) return -1;
        if (a.isNew && !b.isNew) return -1;
        if (!a.isNew && b.isNew) return 1;
        return 0;
    });
}

function initRotatingMessages() {
    const titleEl = document.getElementById('hero-title');
    let index = 0;
    
    setInterval(() => {
        index = (index + 1) % valentineMessages.length;
        titleEl.style.opacity = '0';
        setTimeout(() => {
            titleEl.textContent = valentineMessages[index];
            titleEl.style.opacity = '1';
        }, 300);
    }, 5000);
}

function initReviews() {
    const container = document.getElementById('reviews-container');
    let currentIndex = 0;

    container.innerHTML = customerReviews.map((review, index) => `
        <div class="review-card" id="review-${index}" style="${index === 0 ? 'opacity:1;transform:translateY(0)' : ''}">
            <div class="review-stars">${'★'.repeat(review.stars)}</div>
            <div class="review-text">"${review.text}"</div>
            <div class="review-author">${review.name}</div>
            <div class="review-product">${review.product}</div>
        </div>
    `).join('');

    setInterval(() => {
        document.getElementById(`review-${currentIndex}`).classList.remove('active');
        currentIndex = (currentIndex + 1) % customerReviews.length;
        document.getElementById(`review-${currentIndex}`).classList.add('active');
    }, 6000);
}

function generateInstagramFeed() {
    const grid = document.getElementById('instagram-grid');
    
    const images = [
        'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400',
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400',
        'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400',
        'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=400'
    ];
    
    grid.innerHTML = images.map((img, i) => `
        <div class="social-item" onclick="window.open('https://www.instagram.com/klohesv', '_blank')">
            <img src="${img}" alt="Klohesv" loading="lazy">
            <div class="social-overlay">
                <i class="fab fa-instagram"></i>
            </div>
        </div>
    `).join('');
}

function renderProducts(append = false) {
    const grid = document.getElementById('products-grid');
    const start = currentPage * CONFIG.PRODUCTS_PER_PAGE;
    const end = start + CONFIG.PRODUCTS_PER_PAGE;
    const toShow = filteredProducts.slice(start, end);
    
    if (!append) {
        grid.innerHTML = '';
        displayedProducts = [];
    }
    
    displayedProducts = [...displayedProducts, ...toShow];
    
    const html = toShow.map((p, index) => {
        const isAgotado = p.stock === 0;
        const material = getProductMaterial(p.name, p.code, p.category);
        
        return `
            <div class="product-card ${isAgotado ? 'agotado' : ''}" style="animation-delay: ${index * 0.05}s">
                ${p.isNew ? '<div class="badge-nuevo">Nuevo</div>' : ''}
                
                <div class="product-image-container" onclick="openImageModal('https://industriastobias.github.io/klohesvtiendaonline/${p.code}.jpg')">
                    <img src="https://industriastobias.github.io/klohesvtiendaonline/${p.code}.jpg" 
                         alt="${p.name}" 
                         class="product-image" 
                         loading="lazy"
                         onerror="this.src='https://via.placeholder.com/300x280?text=${p.code}'">
                </div>
                
                <div class="product-info">
                    <h3 class="product-title">${p.name}</h3>
                    ${material ? `<div class="product-material">${material}</div>` : ''}
                    
                    <div class="product-details">
                        <span class="detail-row">
                            <span class="detail-value">Código ${p.code}</span>
                        </span>
                        <span class="detail-row">
                            <span class="detail-value">${p.stock} disponibles</span>
                        </span>
                    </div>
                    
                    <div class="price-row">
                        <div class="product-price">$${p.price.toFixed(2)}</div>
                        <button class="quick-view-btn-inline" onclick="event.stopPropagation(); openQuickView(${p.id})">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                    
                    ${!isAgotado ? `
                        <div class="quantity-selector">
                            <button class="qty-btn" onclick="event.stopPropagation(); updateGridQty(${p.id}, -1)">−</button>
                            <span class="qty-display" id="qty-${p.id}">1</span>
                            <button class="qty-btn" onclick="event.stopPropagation(); updateGridQty(${p.id}, 1)">+</button>
                        </div>
                    ` : ''}
                    
                    <button class="add-to-cart" onclick="addToCart(${p.id})" ${isAgotado ? 'disabled' : ''}>
                        ${isAgotado ? 'Agotado' : 'Agregar'}
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    if (append) {
        grid.innerHTML += html;
    } else {
        grid.innerHTML = html;
    }
    
    updateLoadMoreButton();
}

function updateLoadMoreButton() {
    const btn = document.getElementById('load-more-btn');
    const count = document.getElementById('products-count');
    const remaining = filteredProducts.length - displayedProducts.length;
    
    if (remaining <= 0) {
        btn.style.display = 'none';
    } else {
        btn.style.display = 'inline-block';
        btn.textContent = `Ver más (${remaining})`;
    }
    
    count.textContent = `${displayedProducts.length} de ${filteredProducts.length} productos`;
}

function loadMoreProducts() {
    currentPage++;
    renderProducts(true);
}

function filterProducts() {
    const search = document.getElementById('search-input').value.toLowerCase();
    const category = document.getElementById('category-filter').value;
    const onlyAvailable = document.getElementById('stock-filter').checked;
    
    filteredProducts = products.filter(p => {
        const matchSearch = p.name.toLowerCase().includes(search) || 
                          p.category.toLowerCase().includes(search) ||
                          p.code.includes(search);
        const matchCategory = category === 'all' || p.category === category;
        const matchStock = !onlyAvailable || p.stock > 0;
        
        return matchSearch && matchCategory && matchStock;
    });
    
    sortProducts();
    currentPage = 0;
    renderProducts();
}

function resetFilters() {
    document.getElementById('search-input').value = '';
    document.getElementById('category-filter').value = 'all';
    document.getElementById('stock-filter').checked = false;
    filteredProducts = [...products];
    sortProducts();
    currentPage = 0;
    renderProducts();
}

function updateGridQty(id, change) {
    const display = document.getElementById(`qty-${id}`);
    if (!display) return;
    let val = parseInt(display.textContent) + change;
    if (val < 1) val = 1;
    const product = products.find(p => p.id === id);
    if (val > product.stock) val = product.stock;
    display.textContent = val;
}

function openQuickView(id) {
    const p = products.find(x => x.id === id);
    if (!p) return;
    
    currentQuickViewId = id;
    const material = getProductMaterial(p.name, p.code, p.category);
    
    document.getElementById('quick-view-image').src = `https://industriastobias.github.io/klohesvtiendaonline/${p.code}.jpg`;
    document.getElementById('quick-view-category').textContent = p.category;
    document.getElementById('quick-view-title').textContent = p.name;
    document.getElementById('quick-view-material').textContent = material || '';
    document.getElementById('quick-view-price').textContent = '$' + p.price.toFixed(2);
    document.getElementById('quick-view-description').innerHTML = 
        `<strong>Código:</strong> ${p.code}<br>
         <strong>Stock:</strong> ${p.stock} unidades<br>
         <strong>Categoría:</strong> ${p.category}`;
    
    document.getElementById('quick-view-modal').style.display = 'flex';
    document.body.classList.add('modal-open');
}

function closeQuickView(e) {
    if (!e || e.target.id === 'quick-view-modal') {
        document.getElementById('quick-view-modal').style.display = 'none';
        document.body.classList.remove('modal-open');
    }
}

function addToCartFromQuickView() {
    if (currentQuickViewId) {
        addToCart(currentQuickViewId);
        closeQuickView();
    }
}

function openImageModal(src) {
    document.getElementById('modal-image').src = src;
    document.getElementById('image-modal').style.display = 'flex';
    document.body.classList.add('modal-open');
}

function closeImageModal() {
    document.getElementById('image-modal').style.display = 'none';
    document.body.classList.remove('modal-open');
}

function showStockModal() {
    const modal = document.getElementById('stock-modal-overlay');
    modal.classList.add('active');
    document.body.classList.add('modal-open');
}

function closeStockModal() {
    const modal = document.getElementById('stock-modal-overlay');
    modal.classList.remove('active');
    document.body.classList.remove('modal-open');
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    if (!product || product.stock === 0) return;
    
    const qty = parseInt(document.getElementById(`qty-${id}`)?.textContent || 1);
    const existing = cart.find(item => item.id === id);
    
    if (existing) {
        if (existing.quantity + qty <= product.stock) {
            existing.quantity += qty;
        } else {
            showStockModal();
            return;
        }
    } else {
        cart.push({ ...product, quantity: qty });
    }
    
    saveCart();
    updateCartUI();
    showNotification('Agregado al carrito');
    playSound();
}

function toggleShipping() {
    const checkbox = document.getElementById('shipping-checkbox');
    const option = document.getElementById('shipping-option');
    shippingSelected = checkbox.checked;
    
    if (shippingSelected) {
        option.classList.add('selected');
    } else {
        option.classList.remove('selected');
    }
    
    updateCartTotals();
}

function toggleMiniCart() {
    const cartEl = document.getElementById('mini-cart');
    const overlay = document.getElementById('cart-overlay');
    const isOpen = cartEl.classList.contains('open');
    
    if (isOpen) {
        cartEl.classList.remove('open');
        overlay.classList.remove('active');
        document.body.classList.remove('modal-open');
    } else {
        cartEl.classList.add('open');
        overlay.classList.add('active');
        document.body.classList.add('modal-open');
        updateCartUI();
    }
}

function updateCartUI() {
    const body = document.getElementById('mini-cart-body');
    const count = document.getElementById('cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    count.textContent = totalItems;
    
    if (cart.length === 0) {
        body.innerHTML = `
            <div style="text-align: center; padding: 4rem 2rem; color: var(--texto-claro);">
                <i class="fas fa-shopping-bag" style="font-size: 2rem; margin-bottom: 1rem; display: block; color: var(--rosa-suave);"></i>
                Tu carrito está vacío
            </div>
        `;
    } else {
        body.innerHTML = cart.map(item => `
            <div style="display: flex; align-items: center; gap: 1rem; padding: 1rem 0; border-bottom: 1px solid var(--crema);">
                <img src="https://industriastobias.github.io/klohesvtiendaonline/${item.code}.jpg" 
                     style="width: 60px; height: 60px; object-fit: cover; border: 1px solid var(--rosa-suave);"
                     onerror="this.src='https://via.placeholder.com/60?text=${item.code}'">
                <div style="flex: 1;">
                    <div style="font-weight: 400; font-size: 0.9rem; color: var(--texto); margin-bottom: 0.2rem;">${item.name}</div>
                    <div style="color: var(--rosa-oscuro); font-weight: 400; font-size: 1rem; font-family: 'Cormorant Garamond', serif;">$${(item.price * item.quantity).toFixed(2)}</div>
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-top: 0.5rem;">
                        <button onclick="updateCartQty(${item.id}, -1)" style="width: 24px; height: 24px; border: 1px solid var(--rosa-suave); background: transparent; border-radius: 0; cursor: pointer; font-size: 0.8rem; color: var(--texto);">−</button>
                        <span style="font-weight: 400; min-width: 20px; text-align: center; font-size: 0.9rem;">${item.quantity}</span>
                        <button onclick="updateCartQty(${item.id}, 1)" style="width: 24px; height: 24px; border: 1px solid var(--rosa-suave); background: transparent; border-radius: 0; cursor: pointer; font-size: 0.8rem; color: var(--texto);">+</button>
                    </div>
                </div>
                <button onclick="removeFromCart(${item.id})" style="background: none; border: none; color: var(--texto-claro); cursor: pointer; font-size: 1rem; padding: 0.5rem;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');
    }
    
    updateCartTotals();
}

function updateCartQty(id, change) {
    const item = cart.find(i => i.id === id);
    const product = products.find(p => p.id === id);
    if (!item) return;
    
    const newQty = item.quantity + change;
    if (newQty <= 0) {
        removeFromCart(id);
    } else if (newQty <= product.stock) {
        item.quantity = newQty;
        saveCart();
        updateCartUI();
    } else {
        showStockModal();
    }
}

function removeFromCart(id) {
    cart = cart.filter(i => i.id !== id);
    saveCart();
    updateCartUI();
}

function updateCartTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = subtotal * (currentDiscount / 100);
    const shipping = shippingSelected ? CONFIG.SHIPPING_COST : 0;
    const total = subtotal - discount + shipping;
    
    document.getElementById('cart-subtotal').textContent = subtotal.toFixed(2);
    document.getElementById('cart-shipping').textContent = shipping.toFixed(2);
    document.getElementById('shipping-row').style.display = shipping > 0 ? 'flex' : 'none';
    document.getElementById('cart-discount').textContent = discount.toFixed(2);
    document.getElementById('discount-row').style.display = currentDiscount > 0 ? 'flex' : 'none';
    document.getElementById('cart-total').textContent = total.toFixed(2);
}

function applyDiscount() {
    const code = document.getElementById('discount-input').value.toUpperCase();
    const validCodes = { 'KLOHE10': 10, 'SANVALENTIN': 15, 'AMOR20': 20, 'CORAZON': 25 };
    
    if (validCodes[code]) {
        currentDiscount = validCodes[code];
        showNotification(`Descuento ${currentDiscount}% aplicado`);
        updateCartTotals();
    } else {
        showErrorModal();
    }
}

function showErrorModal() {
    document.getElementById('error-modal').style.display = 'flex';
    document.body.classList.add('modal-open');
}

function closeErrorModal(e) {
    if (!e || e.target.id === 'error-modal') {
        document.getElementById('error-modal').style.display = 'none';
        document.body.classList.remove('modal-open');
    }
}

function saveCart() {
    localStorage.setItem('klohe_cart', JSON.stringify(cart));
}

function loadCart() {
    const saved = localStorage.getItem('klohe_cart');
    if (saved) cart = JSON.parse(saved);
}

function checkout() {
    if (cart.length === 0) return;
    
    let msg = '¡Hola Klohe!\\n\\nQuiero hacer un pedido:\\n\\n';
    cart.forEach(item => {
        msg += `• ${item.name} (Código: ${item.code}) x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}\\n`;
    });
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = subtotal * (currentDiscount / 100);
    const shipping = shippingSelected ? CONFIG.SHIPPING_COST : 0;
    const total = subtotal - discount + shipping;
    
    msg += `\\nSubtotal: $${subtotal.toFixed(2)}`;
    if (currentDiscount > 0) msg += `\\nDescuento: -$${discount.toFixed(2)}`;
    if (shipping > 0) msg += `\\nEnvío: $${shipping.toFixed(2)}`;
    msg += `\\nTotal: $${total.toFixed(2)}`;
    
    window.open(`https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
}

function showNotification(text) {
    const notif = document.getElementById('notification');
    notif.textContent = text;
    notif.style.display = 'block';
    
    setTimeout(() => {
        notif.style.opacity = '0';
        setTimeout(() => {
            notif.style.display = 'none';
            notif.style.opacity = '1';
        }, 300);
    }, 2000);
}

function playSound() {
    const audio = document.getElementById('success-sound');
    audio.currentTime = 0;
    audio.play().catch(e => {});
}

function toggleChat() {
    document.getElementById('chat-window').classList.toggle('active');
}

function handleChatKey(e) {
    if (e.key === 'Enter') sendMessage();
}

function sendMessage() {
    const input = document.getElementById('chat-message');
    const msg = input.value.trim();
    if (!msg) return;
    
    const body = document.getElementById('chat-body');
    body.innerHTML += `<p style="text-align: right; margin-bottom: 0.8rem;"><span style="background: var(--rosa-suave); padding: 0.8rem; display: inline-block; font-size: 0.9rem;">${msg}</span></p>`;
    input.value = '';
    body.scrollTop = body.scrollHeight;
    
    setTimeout(() => {
        body.innerHTML += `<p style="margin-bottom: 0.8rem;"><span style="background: var(--crema); padding: 0.8rem; display: inline-block; font-size: 0.9rem;">Gracias por tu mensaje. Te responderemos pronto.</span></p>`;
        body.scrollTop = body.scrollHeight;
    }, 1000);
}

function toggleFaq(element) {
    const item = element.parentElement;
    const isActive = item.classList.contains('active');
    const icon = element.querySelector('i');
    
    document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('active');
        i.querySelector('i').style.transform = 'rotate(0deg)';
    });
    
    if (!isActive) {
        item.classList.add('active');
        icon.style.transform = 'rotate(180deg)';
    }
}

function subscribeNewsletter(e) {
    e.preventDefault();
    showNotification('Bienvenida al Club Klohe');
    e.target.reset();
}

function initOfflineDetection() {
    window.addEventListener('online', () => {
        document.getElementById('offline-indicator').classList.remove('show');
    });
    window.addEventListener('offline', () => {
        document.getElementById('offline-indicator').classList.add('show');
    });
}

window.onclick = function(e) {
    if (e.target.classList.contains('quick-view-modal')) {
        closeQuickView(e);
    }
}
