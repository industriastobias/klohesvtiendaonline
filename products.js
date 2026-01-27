const products = [
  { name: "BOLSO DE MANO", price: 10.00, stock: 1, barcode: "088" },
  { name: "CARTERA", price: 12.50, stock: 1, barcode: "03" },
  { name: "CARTERA", price: 12.00, stock: 1, barcode: "014" },
  { name: "CARTERA", price: 10.99, stock: 1, barcode: "033" },
  { name: "CARTERA", price: 10.00, stock: 1, barcode: "073" },
  { name: "CARTERA", price: 18.50, stock: 1, barcode: "086" },
  { name: "CARTERA", price: 18.50, stock: 1, barcode: "087" },
  { name: "CARTERA", price: 14.99, stock: 1, barcode: "089" },
  { name: "CARTERA", price: 14.99, stock: 1, barcode: "096" },
  { name: "CARTERA", price: 14.99, stock: 1, barcode: "097" },
  { name: "CARTERA", price: 24.00, stock: 1, barcode: "098" },
  { name: "CARTERA", price: 14.99, stock: 1, barcode: "099" },
  { name: "CARTERA", price: 12.00, stock: 1, barcode: "127" },
  { name: "CARTERA", price: 13.99, stock: 1, barcode: "128" },
  { name: "CARTERA", price: 13.99, stock: 1, barcode: "129" },
  { name: "CARTERA", price: 14.00, stock: 2, barcode: "132" },
  { name: "CARTERA", price: 14.99, stock: 1, barcode: "147" },
  { name: "CARTERA", price: 14.00, stock: 1, barcode: "148" },
  { name: "CARTERA", price: 15.99, stock: 1, barcode: "149" },
  { name: "CARTERA", price: 15.99, stock: 1, barcode: "150" },
  { name: "CARTERA", price: 14.00, stock: 1, barcode: "152" },
  { name: "CARTERA BEIG", price: 10.50, stock: 1, barcode: "068" },
  { name: "CARTERA BLANCA", price: 10.99, stock: 1, barcode: "049" },
  { name: "CARTERA BLANCA", price: 10.50, stock: 1, barcode: "063" },
  { name: "CARTERA NEGRA", price: 10.99, stock: 1, barcode: "047" },
  { name: "CARTERA ROSADA", price: 9.50, stock: 1, barcode: "023" },
  { name: "Carteras", price: 10.00, stock: 1, barcode: "181" },
  { name: "01176255048869645", price: 3.50, stock: 1, barcode: "046" },
  { name: "ARETAS", price: 8.50, stock: 1, barcode: "179" },
  { name: "ARETE", price: 7.00, stock: 1, barcode: "060" },
  { name: "ARETES", price: 8.50, stock: 1, barcode: "174" },
  { name: "ARITOS", price: 7.00, stock: 1, barcode: "09" },
  { name: "ARITOS", price: 7.00, stock: 1, barcode: "013" },
  { name: "ARITOS", price: 8.00, stock: 1, barcode: "085" },
  { name: "ARITOS", price: 5.50, stock: 1, barcode: "101" },
  { name: "ARITOS", price: 8.00, stock: 1, barcode: "107" },
  { name: "ARITOS", price: 6.99, stock: 1, barcode: "115" },
  { name: "ARITOS", price: 6.50, stock: 1, barcode: "116" },
  { name: "ARITOS", price: 7.50, stock: 1, barcode: "117" },
  { name: "ARITOS", price: 8.00, stock: 1, barcode: "118" },
  { name: "ARITOS", price: 4.00, stock: 7, barcode: "124" },
  { name: "ARITOS", price: 7.50, stock: 1, barcode: "156" },
  { name: "ARITOS", price: 8.99, stock: 1, barcode: "157" },
  { name: "ARITOS", price: 8.99, stock: 1, barcode: "158" },
  { name: "ARITOS", price: 7.00, stock: 3, barcode: "166" },
  { name: "ARITOS", price: 5.50, stock: 1, barcode: "168" },
  { name: "ARITOS", price: 7.50, stock: 2, barcode: "170" },
  { name: "ARITOS", price: 6.50, stock: 1, barcode: "176" },
  { name: "ARITOS", price: 8.50, stock: 1, barcode: "178" },
  { name: "ARITOS", price: 8.50, stock: 1, barcode: "177" },
  { name: "ARITOS", price: 5.00, stock: 1, barcode: "19009" },
  { name: "ARITOS", price: 7.00, stock: 1, barcode: "190012" },
  { name: "Aritos", price: 2.00, stock: 1, barcode: "1991919" },
  { name: "ARITOS DE PLATA", price: 5.00, stock: 1, barcode: "02222" },
  { name: "ARITOS DE PLATA", price: 5.00, stock: 1, barcode: "02224" },
  { name: "ARITOS DE PLATA", price: 5.00, stock: 1, barcode: "02226" },
  { name: "ARITOS DE PLATA", price: 5.00, stock: 1, barcode: "02227" },
  { name: "ARITOS DE PLATA", price: 5.00, stock: 1, barcode: "02228" },
  { name: "COLLA DE PLAYA", price: 12.75, stock: 1, barcode: "066" },
  { name: "Collar", price: 9.50, stock: 1, barcode: "10199191" },
  { name: "Collar", price: 10.00, stock: 1, barcode: "17801" },
  { name: "COLLAR", price: 12.00, stock: 1, barcode: "025" },
  { name: "COLLAR", price: 8.00, stock: 3, barcode: "028" },
  { name: "COLLAR", price: 15.00, stock: 1, barcode: "034" },
  { name: "COLLAR", price: 11.50, stock: 1, barcode: "039" },
  { name: "COLLAR", price: 12.00, stock: 1, barcode: "070" },
  { name: "COLLAR", price: 11.50, stock: 1, barcode: "072" },
  { name: "COLLAR", price: 13.50, stock: 1, barcode: "077" },
  { name: "COLLAR", price: 13.00, stock: 1, barcode: "084" },
  { name: "COLLAR", price: 12.50, stock: 1, barcode: "090" },
  { name: "COLLAR", price: 12.00, stock: 1, barcode: "091" },
  { name: "COLLAR", price: 12.00, stock: 1, barcode: "093" },
  { name: "COLLAR", price: 15.00, stock: 1, barcode: "104" },
  { name: "COLLAR", price: 13.99, stock: 1, barcode: "110" },
  { name: "COLLAR", price: 14.99, stock: 1, barcode: "111" },
  { name: "COLLAR", price: 12.00, stock: 1, barcode: "126" },
  { name: "COLLAR", price: 10.00, stock: 1, barcode: "133" },
  { name: "COLLAR", price: 12.00, stock: 2, barcode: "134" },
  { name: "COLLAR", price: 15.00, stock: 1, barcode: "135" },
  { name: "COLLAR", price: 15.00, stock: 1, barcode: "136" },
  { name: "COLLAR", price: 10.00, stock: 1, barcode: "139" },
  { name: "COLLAR", price: 10.00, stock: 1, barcode: "141" },
  { name: "COLLAR", price: 12.99, stock: 1, barcode: "145" },
  { name: "COLLAR", price: 10.00, stock: 1, barcode: "155" },
  { name: "COLLAR", price: 12.00, stock: 1, barcode: "163" },
  { name: "COLLAR", price: 12.00, stock: 1, barcode: "164" },
  { name: "COLLAR", price: 12.00, stock: 1, barcode: "165" },
  { name: "COLLAR", price: 12.00, stock: 1, barcode: "171" },
  { name: "COLLAR", price: 15.00, stock: 1, barcode: "172" },
  { name: "COLLAR", price: 12.00, stock: 1, barcode: "173" },
  { name: "COLLAR", price: 12.00, stock: 3, barcode: "175" },
  { name: "COLLAR", price: 10.00, stock: 1, barcode: "183" },
  { name: "COLLAR", price: 10.00, stock: 1, barcode: "184" },
  { name: "COLLAR", price: 10.00, stock: 1, barcode: "1200" },
  { name: "COLLAR", price: 12.00, stock: 1, barcode: "01116" },
  { name: "COLLAR", price: 10.00, stock: 1, barcode: "01127" },
  { name: "COLLAR", price: 10.00, stock: 1, barcode: "01129" },
  { name: "COLLAR CLASICO", price: 10.00, stock: 2, barcode: "020" },
  { name: "COLLAR DE CORAZON NEGRO", price: 10.00, stock: 1, barcode: "062" },
  { name: "COLLAR DE CRUZ REDONDO", price: 12.00, stock: 1, barcode: "016" },
  { name: "COLLAR DE FLOR", price: 10.50, stock: 1, barcode: "055" },
  { name: "COLLAR DE FLOR", price: 11.50, stock: 1, barcode: "065" },
  { name: "COLLAR DOBLE", price: 15.00, stock: 1, barcode: "027" },
  { name: "SET", price: 18.50, stock: 1, barcode: "142" },
  { name: "SET DE COLLAR", price: 13.50, stock: 1, barcode: "078" },
  { name: "LENTES", price: 7.50, stock: 1, barcode: "015" },
  { name: "LENTES NEGROS", price: 5.75, stock: 1, barcode: "037" },
  { name: "PULSERA", price: 5.00, stock: 1, barcode: "042" },
  { name: "PULSERA", price: 7.00, stock: 2, barcode: "043" },
  { name: "PULSERA", price: 10.00, stock: 1, barcode: "044" },
  { name: "PULSERA", price: 12.99, stock: 1, barcode: "105" },
  { name: "PULSERA", price: 12.00, stock: 1, barcode: "146" },
  { name: "PULSERA", price: 13.00, stock: 3, barcode: "159" },
  { name: "PULSERA", price: 8.00, stock: 1, barcode: "9789" },
  { name: "PULSERA", price: 7.00, stock: 1, barcode: "8967" },
  { name: "PULSERA", price: 10.00, stock: 2, barcode: "01126" },
  { name: "PULSERA", price: 10.50, stock: 3, barcode: "02221" },
  { name: "PULSERA", price: 10.00, stock: 1, barcode: "02223" },
  { name: "PULSERA", price: 12.00, stock: 1, barcode: "03331" },
  { name: "PULSERA", price: 12.00, stock: 1, barcode: "03332" },
  { name: "PULSERA BASICA", price: 6.00, stock: 1, barcode: "030" },
  { name: "PULSERA DE TREBOL", price: 12.00, stock: 1, barcode: "01118" },
  { name: "RELOJ", price: 15.00, stock: 1, barcode: "01111" },
  { name: "RELOJ", price: 20.00, stock: 2, barcode: "01125" },
  { name: "RELOJ", price: 16.00, stock: 1, barcode: "03333" },
  { name: "RELOJ", price: 25.00, stock: 1, barcode: "03334" },
  { name: "RELOJ", price: 16.00, stock: 1, barcode: "03335" },
  { name: "RELOJ", price: 20.00, stock: 1, barcode: "03336" },
  { name: "RELOJ", price: 15.00, stock: 1, barcode: "03337" },
  { name: "RELOJ", price: 20.00, stock: 1, barcode: "03338" },
  { name: "RELOJ", price: 20.00, stock: 1, barcode: "03339" },
  { name: "RELOJ", price: 15.00, stock: 1, barcode: "033340" },
  { name: "RELOJ", price: 15.00, stock: 1, barcode: "033341" },
  { name: "RELOJ", price: 15.00, stock: 1, barcode: "033342" },
  { name: "RELOJ", price: 15.00, stock: 1, barcode: "033343" },
  { name: "RELOJ", price: 20.00, stock: 1, barcode: "033344" },
  { name: "RELOJ", price: 15.00, stock: 1, barcode: "033345" },
  { name: "RELOJ", price: 15.00, stock: 1, barcode: "033346" },
  { name: "RELOJ", price: 25.00, stock: 1, barcode: "033347" },
  { name: "RELOJ", price: 30.00, stock: 1, barcode: "033348" },
  { name: "RELOJ", price: 20.00, stock: 1, barcode: "033349" },
  { name: "RELOJ", price: 18.00, stock: 2, barcode: "033350" },
  { name: "RELOJ BLANCO", price: 15.00, stock: 1, barcode: "011144" },
  { name: "RELOJ DE ACERO INOXIDABLE", price: 15.00, stock: 2, barcode: "01117" },
  { name: "RELOJ DE ACERO INOXIDABLE", price: 15.00, stock: 1, barcode: "01123" },
  { name: "RELOJ DORADO WATERPROOF", price: 20.00, stock: 1, barcode: "01122" },
  { name: "RELOJ NEGRO", price: 15.00, stock: 1, barcode: "01113" },
  { name: "RELOJ OLD MOENY", price: 15.00, stock: 2, barcode: "01124" },
  { name: "RELOJ ROJO", price: 15.00, stock: 1, barcode: "01119" },
  { name: "RELOJ ROJO", price: 15.00, stock: 1, barcode: "01121" },
  { name: "SEET DE RELOJ Y PULSERA", price: 14.00, stock: 1, barcode: "01115" },
  { name: "SET", price: 40.00, stock: 1, barcode: "01112" },
  { name: "ANILLO", price: 10.00, stock: 1, barcode: "02" },
  { name: "ANILLO", price: 10.00, stock: 1, barcode: "04" },
  { name: "ANILLO", price: 10.00, stock: 1, barcode: "08" },
  { name: "ANILLO", price: 10.00, stock: 1, barcode: "017" },
  { name: "ANILLO", price: 10.00, stock: 1, barcode: "021" },
  { name: "ANILLO", price: 10.00, stock: 1, barcode: "045" },
  { name: "ANILLO", price: 10.00, stock: 1, barcode: "057" },
  { name: "ANILO", price: 10.00, stock: 1, barcode: "059" },
  { name: "ACCESORIOS", price: 0.25, stock: 20, barcode: "137" },
  { name: "CEREZA", price: 5.25, stock: 4, barcode: "122" },
  { name: "TARJETAS NAVIDEÑAS", price: 0.00, stock: 121, barcode: "154" }
];const cart = [];
const cartList = document.getElementById("cart-list");
const totalEl = document.getElementById("total");
const whatsappBtn = document.getElementById("whatsapp-btn");

function renderProducts() {
  const container = document.getElementById("products");
  products.forEach((prod, index) => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <img src="${prod.barcode}.jpg" alt="${prod.name}" onerror="this.style.display='none'" />
      <h3>${prod.name}</h3>
      <p>Precio: $${prod.price.toFixed(2)}</p>
      <p>Stock: ${prod.stock}</p>
      <button onclick="addToCart(${index})">Agregar</button>
    `;
    container.appendChild(div);
  });
}

function addToCart(index) {
  const product = products[index];
  if (product.stock > 0) {
    cart.push(product);
    product.stock--;
    renderCart();
  }
}

function renderCart() {
  cartList.innerHTML = "";
  let total = 0;
  cart.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.name} - $${item.price.toFixed(2)}`;
    cartList.appendChild(li);
    total += item.price;
  });
  totalEl.textContent = `Total: $${total.toFixed(2)}`;
  whatsappBtn.href = `https://wa.me/66711569?text=Hola, quiero comprar: ${cart.map(p => p.name).join(", ")}. Total: $${total.toFixed(2)}`;
}

renderProducts();
