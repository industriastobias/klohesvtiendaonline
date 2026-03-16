const products = [
  // ============================================================
  // RELOJES (en stock primero, ordenados por precio descendente)
  // ============================================================
  // Precio 30.00
  { name: "RELOJ", price: 30.00, stock: 1, barcode: "20202", category: "Relojes", description: "resistente a salpicaduras de agua, Reloj de acero inoxidable" },
  { name: "RELOJ BLANCO CLASICO", price: 30.00, stock: 1, barcode: "2026012", category: "Relojes", description: "" },
  // Precio 25.75
  { name: "RELOJ", price: 25.75, stock: 1, barcode: "03336", category: "Relojes", description: "Relojes de acero inoxidable" },
  { name: "RELOJ", price: 25.75, stock: 1, barcode: "03338", category: "Relojes", description: "Relojes de acero inoxidable" },
  // Precio 23.50
  { name: "RELOJ CLASICO DORADO", price: 23.50, stock: 1, barcode: "202610", category: "Relojes", description: "Reloj de cuarzo de acero inoxidable con rosa de té en miniatura para mujeres con correa de malla, reloj de pulsera femenino" },
  { name: "RELOJ CLASICO PLATEADO", price: 23.50, stock: 1, barcode: "202007", category: "Relojes", description: "Reloj De Cuarzo Para Mujer SUNLIFEX Con Pulsera De Acero Inoxidable Y Escala Elíptica Diseño Sencillo Y Elegante Con" },
  // Precio 23.00
  { name: "RELOJ FLOR BLANCA", price: 23.00, stock: 1, barcode: "202504", category: "Relojes", description: "Reloj de cuarzo de acero inoxidable con rosa de té en miniatura para mujeres con correa de malla, reloj de pulsera femenino" },
  // Precio 22.99
  { name: "RELOJ DE FLOR ROJA", price: 22.99, stock: 1, barcode: "202606", category: "Relojes", description: "RELOJ DORADO DE ACERO INOXIDABLE" },
  // Precio 22.50
  { name: "RELOJ ELEGANTE BLANCO", price: 22.50, stock: 1, barcode: "202623", category: "Relojes", description: "Reloj De Pulsera Cuadrado Para Mujer GoGoey Con Correa De Ultra-sintética Y Cristal Ordinary Movimiento De Cuarzo Moda" },
  { name: "RELOJ ELEGANTE ROJO", price: 22.50, stock: 1, barcode: "202624", category: "Relojes", description: "Reloj De Pulsera Cuadrado Para Mujer GoGoey Con Correa De Ultra-sintética Y Cristal Ordinary Movimiento De Cuarzo Moda" },
  { name: "RELOJ OLD MONEY PLATEADO", price: 22.50, stock: 1, barcode: "202504", category: "Relojes", description: "" },
  { name: "RELOJ ROMANO BLANCO", price: 22.50, stock: 1, barcode: "202501", category: "Relojes", description: "" },
  { name: "RELOJ ROMANO NEGRO", price: 22.50, stock: 1, barcode: "202529", category: "Relojes", description: "" },
  { name: "RELOJ ROMANO ROJO", price: 22.50, stock: 1, barcode: "202528", category: "Relojes", description: "" },
  // Precio 20.75
  { name: "RELOJ AURELIA", price: 20.75, stock: 1, barcode: "202507", category: "Relojes", description: "" },
  { name: "RELOJ CASTELLO", price: 20.75, stock: 1, barcode: "2025021", category: "Relojes", description: "" },
  { name: "RELOJ CLASICO", price: 20.75, stock: 1, barcode: "202506", category: "Relojes", description: "" },
  { name: "RELOJ CROWNBRIDGE", price: 20.75, stock: 1, barcode: "202513", category: "Relojes", description: "" },
  { name: "RELOJ HARTWELL", price: 20.75, stock: 1, barcode: "202514", category: "Relojes", description: "" },
  { name: "RELOJ MONTCLAIR", price: 20.75, stock: 1, barcode: "202508", category: "Relojes", description: "" },
  // Precio 20.50
  { name: "RELOJ Estilo Clásico Color Sólido", price: 20.50, stock: 3, barcode: "202601", category: "Relojes", description: "Estilo Clásico Color Sólido" },
  // Precio 19.99
  { name: "RELOJ DE LUJO", price: 19.99, stock: 1, barcode: "2026013", category: "Relojes", description: "" },
  // Precio 19.75
  { name: "RELOJ PLATEADO", price: 19.75, stock: 1, barcode: "202626", category: "Relojes", description: "Negocio Serpiente Hebilla De Herradura Electrónico Reloj Relojes de mujer" },
  // Precio 18.99
  { name: "RELOJ ESFERA AZUL", price: 18.99, stock: 2, barcode: "022026", category: "Relojes", description: "Serpiente Hebilla De Herradura Electrónico Reloj Relojes de mujer" },
  { name: "RELOJ LANGFORD", price: 18.99, stock: 1, barcode: "202527", category: "Relojes", description: "" },
  { name: "RELOJ STERLING", price: 18.99, stock: 1, barcode: "202511", category: "Relojes", description: "" },
  { name: "RELOJ VALERO", price: 18.99, stock: 1, barcode: "202526", category: "Relojes", description: "" },
  { name: "RELOJ VALMONT", price: 18.99, stock: 1, barcode: "202509", category: "Relojes", description: "" },
  { name: "RELOJ VERANO", price: 18.99, stock: 1, barcode: "202524", category: "Relojes", description: "" },
  { name: "RELOJ WHITMORE DORADO", price: 18.99, stock: 1, barcode: "202502", category: "Relojes", description: "" },
  { name: "RELOJ WHITMORE ROJO", price: 18.99, stock: 1, barcode: "202503", category: "Relojes", description: "" },
  // Precio 18.75
  { name: "RELOJ NEGRO CON DORADO", price: 18.75, stock: 1, barcode: "2026018", category: "Relojes", description: "" },
  // Precio 18.50
  { name: "RELOJ", price: 18.50, stock: 2, barcode: "202603", category: "Relojes", description: "Serpiente Hebilla De Herradura Electrónico Reloj Relojes de mujer" },
  // Precio 18.00
  { name: "RELOJ", price: 18.00, stock: 1, barcode: "20203", category: "Relojes", description: " resistente a salpicaduras de agua, Reloj de acero inoxidable, " },
  { name: "RELOJ CLASICO CAFE", price: 18.00, stock: 1, barcode: "202625", category: "Relojes", description: "" },
  // Precio 17.99
  { name: "RELOJ CAFE CLASICO", price: 17.99, stock: 1, barcode: "202609", category: "Relojes", description: "RELOJ CLASICO CAFE" },
  { name: "RELOJ MODERNO", price: 17.99, stock: 1, barcode: "2026016", category: "Relojes", description: "" },
  { name: "RELOJ UNIFORME", price: 17.99, stock: 1, barcode: "2026015", category: "Relojes", description: "" },
  // Precio 17.75
  { name: "RELOJ OVALADO CLASICO", price: 17.75, stock: 1, barcode: "202627", category: "Relojes", description: "RELOJ CLASICO" },
  { name: "RELOJ PULSERA", price: 17.75, stock: 1, barcode: "202608", category: "Relojes", description: "Reloj de cuarzo de acero inoxidable con números romanos, diseño de nicho, esfera hexagonal, reloj de pulsera para mujeres con ..." },
  { name: "RELOJ PULSERA", price: 17.75, stock: 1, barcode: "202628", category: "Relojes", description: "RELOJ PULSERA ITALIANA ACERO INOXIDABLE" },
  // Precio 17.50
  { name: "RELOJ CLASICO BLANCO", price: 17.50, stock: 1, barcode: "2026017", category: "Relojes", description: "" },
  // Precio 16.75
  { name: "RELOJ CLASICO NEGRO", price: 16.75, stock: 1, barcode: "2026019", category: "Relojes", description: "Retro Color Sólido Hebilla Cuarzo Reloj Relojes de mujer" },
  { name: "RELOJ CLASICO NEGROFONDO BLANCO", price: 16.75, stock: 1, barcode: "202620", category: "Relojes", description: "Retro Color Sólido Hebilla Cuarzo Reloj Relojes de mujer" },
  { name: "RELOJ ROJO", price: 16.75, stock: 1, barcode: "01119", category: "Relojes", description: "Relojes de acero inoxidable" },
  // Precio 16.50
  { name: "RELOJ NEGRO", price: 16.50, stock: 1, barcode: "2026011", category: "Relojes", description: "Negro con marco de oro y superficie negra" },
  // Precio 15.75
  { name: "RELOJ", price: 15.75, stock: 1, barcode: "033345", category: "Relojes", description: "Relojes de acero inoxidable" },
  { name: "RELOJ BELLGRAVE", price: 15.75, stock: 1, barcode: "202507", category: "Relojes", description: "" },
  { name: "RELOJ MONTEBELLO NEGRO", price: 15.75, stock: 2, barcode: "202523", category: "Relojes", description: "" },
  { name: "RELOJ MONTEBELLO ROSA", price: 15.75, stock: 2, barcode: "202522", category: "Relojes", description: "" },
  { name: "RELOJ PLATEADO", price: 15.75, stock: 1, barcode: "202624", category: "Relojes", description: "" },
  // Precio 15.00
  { name: "RELOJ", price: 15.00, stock: 1, barcode: "2026014", category: "Relojes", description: "" },
  // Precio 5.00
  { name: "RELOJ", price: 5.00, stock: 1, barcode: "01111", category: "Relojes", description: "Relojes de acero inoxidable" },
  { name: "RELOJ BLANCO", price: 5.00, stock: 1, barcode: "011144", category: "Relojes", description: "Relojes de acero inoxidable" },
  { name: "RELOJ NEGRO", price: 5.00, stock: 1, barcode: "01113", category: "Relojes", description: "Relojes de acero inoxidable" },

  // ------------------------------------------------------------
  // RELOJES agotados (stock 0) al final de la categoría
  // ------------------------------------------------------------
  { name: "RELOJ", price: 40.00, stock: 0, barcode: "01112", category: "Relojes", description: "Relojes de acero inoxidable" },
  { name: "RELOJ", price: 30.75, stock: 0, barcode: "033347", category: "Relojes", description: "Relojes de acero inoxidable" },
  { name: "RELOJ", price: 30.75, stock: 0, barcode: "033348", category: "Relojes", description: "Relojes de acero inoxidable" },
  { name: "RELOJ", price: 25.75, stock: 0, barcode: "03334", category: "Relojes", description: "Relojes de acero inoxidable" },
  { name: "RELOJ", price: 25.75, stock: 0, barcode: "03337", category: "Relojes", description: "Relojes de acero inoxidable" },
  { name: "RELOJ", price: 20.75, stock: 0, barcode: "01125", category: "Relojes", description: "Relojes de acero inoxidable" },
  { name: "RELOJ", price: 20.75, stock: 0, barcode: "03339", category: "Relojes", description: "Relojes de acero inoxidable" },
  { name: "RELOJ", price: 20.75, stock: 0, barcode: "033344", category: "Relojes", description: "Relojes de acero inoxidable" },
  { name: "RELOJ", price: 20.75, stock: 0, barcode: "033349", category: "Relojes", description: "Relojes de acero inoxidable" },
  { name: "RELOJ", price: 20.75, stock: 0, barcode: "01122", category: "Relojes", description: "Relojes de acero inoxidable" },
  { name: "RELOJ", price: 18.75, stock: 0, barcode: "033350", category: "Relojes", description: "Relojes de acero inoxidable" },
  { name: "RELOJ", price: 18.50, stock: 0, barcode: "033346", category: "Relojes", description: "Relojes de acero inoxidable" },
  { name: "RELOJ", price: 18.00, stock: 0, barcode: "20204", category: "Relojes", description: "resistente a salpicaduras de agua, Reloj de acero inoxidable, " },
  { name: "RELOJ", price: 16.75, stock: 0, barcode: "03333", category: "Relojes", description: "Relojes de acero inoxidable" },
  { name: "RELOJ", price: 16.75, stock: 0, barcode: "03335", category: "Relojes", description: "Relojes de acero inoxidable" },
  { name: "RELOJ", price: 16.75, stock: 0, barcode: "033342", category: "Relojes", description: "Relojes de acero inoxidable" },
  { name: "RELOJ", price: 16.75, stock: 0, barcode: "01121", category: "Relojes", description: "Relojes de acero inoxidable" },
  { name: "RELOJ", price: 15.75, stock: 0, barcode: "033340", category: "Relojes", description: "Relojes de acero inoxidable" },
  { name: "RELOJ", price: 15.75, stock: 0, barcode: "033341", category: "Relojes", description: "Relojes de acero inoxidable" },
  { name: "RELOJ", price: 15.75, stock: 0, barcode: "033343", category: "Relojes", description: "Relojes de acero inoxidable" },
  { name: "RELOJ", price: 15.75, stock: 0, barcode: "01123", category: "Relojes", description: "Relojes de acero inoxidable" },
  { name: "RELOJ", price: 15.75, stock: 0, barcode: "01124", category: "Relojes", description: "Relojes de acero inoxidable" },
  { name: "RELOJ DE ACERO INOXIDABLE", price: 15.00, stock: 0, barcode: "01117", category: "Relojes", description: "Relojes de acero inoxidable" },
  { name: "SEET DE RELOJ Y PULSERA", price: 14.75, stock: 0, barcode: "01115", category: "Relojes", description: "Reloj de acero fino" },

  // ============================================================
  // COLLARES (en stock primero, ordenados por precio descendente)
  // ============================================================
  // Precio 18.50
  { name: "SET", price: 18.50, stock: 1, barcode: "142", category: "Collares", description: "Collares de acero inoxidable con laminado en oro de 18K resistentes a salpicaduras waterproof" },
  // Precio 15.00
  { name: "COLLAR", price: 15.00, stock: 1, barcode: "034", category: "Collares", description: "Collares de acero inoxidable con laminado en oro de 18K resistentes a salpicaduras waterproof" },
  { name: "COLLAR", price: 15.00, stock: 1, barcode: "104", category: "Collares", description: "Collares de acero inoxidable con laminado en oro de 18K resistentes a salpicaduras waterproof" },
  { name: "COLLAR", price: 15.00, stock: 1, barcode: "135", category: "Collares", description: "Collares de acero inoxidable con laminado en oro de 18K resistentes a salpicaduras waterproof" },
  { name: "COLLAR", price: 15.00, stock: 1, barcode: "136", category: "Collares", description: "Collares de acero inoxidable con laminado en oro de 18K resistentes a salpicaduras waterproof" },
  { name: "COLLAR", price: 15.00, stock: 1, barcode: "172", category: "Collares", description: "Collares de acero inoxidable con laminado en oro de 18K resistentes a salpicaduras waterproof" },
  { name: "COLLAR DOBLE", price: 15.00, stock: 1, barcode: "027", category: "Collares", description: "Collares de acero inoxidable con laminado en oro de 18K resistentes a salpicaduras waterproof" },
  // Precio 14.99
  { name: "COLLAR", price: 14.99, stock: 1, barcode: "111", category: "Collares", description: "Collares de acero inoxidable con laminado en oro de 18K resistentes a salpicaduras waterproof" },
  // Precio 14.00
  { name: "COLLAR DOBLE DE CORAZON", price: 14.00, stock: 0, barcode: "067", category: "Collares", description: "Collares de acero inoxidable con laminado en oro de 18K resistentes a salpicaduras waterproof" },
  // Precio 13.99
  { name: "COLLAR", price: 13.99, stock: 1, barcode: "110", category: "Collares", description: "Collares de acero inoxidable con laminado en oro de 18K resistentes a salpicaduras waterproof" },
  // Precio 13.50
  { name: "COLLAR", price: 13.50, stock: 1, barcode: "077", category: "Collares", description: "Collares de acero inoxidable con laminado en oro de 18K resistentes a salpicaduras waterproof" },
  { name: "SET DE COLLAR", price: 13.50, stock: 1, barcode: "078", category: "Collares", description: "Collares de acero inoxidable con laminado en oro de 18K resistentes a salpicaduras waterproof" },
  // Precio 13.00
  { name: "COLLAR", price: 13.00, stock: 1, barcode: "084", category: "Collares", description: "Collares de acero inoxidable con laminado en oro de 18K resistentes a salpicaduras waterproof" },
  // Precio 12.99
  { name: "COLLAR", price: 12.99, stock: 1, barcode: "145", category: "Collares", description: "Collares de acero inoxidable con laminado en oro de 18K resistentes a salpicaduras waterproof" },
  // Precio 12.75
  { name: "COLLA DE PLAYA", price: 12.75, stock: 1, barcode: "066", category: "Collares", description: "Collares de acero inoxidable con laminado en oro de 18K resistentes a salpicaduras waterproof" },
  // Precio 12.50
  { name: "COLLAR", price: 12.50, stock: 1, barcode: "090", category: "Collares", description: "Collares de acero inoxidable con laminado en oro de 18K resistentes a salpicaduras waterproof" },
  // Precio 12.00
  { name: "COLLAR", price: 12.00, stock: 3, barcode: "028", category: "Collares", description: "Collares de acero inoxidable con laminado en oro de 18K resistentes a salpicaduras waterproof" },
  { name: "COLLAR", price: 12.00, stock: 1, barcode: "025", category: "Collares", description: "Collares de acero inoxidable con laminado en oro de 18K resistentes a salpicaduras waterproof" },
  { name: "COLLAR", price: 12.00, stock: 1, barcode: "070", category: "Collares", description: "Collares de acero inoxidable con laminado en oro de 18K resistentes a salpicaduras waterproof" },
  { name: "COLLAR", price: 12.00, stock: 1, barcode: "091", category: "Collares", description: "Collares de acero inoxidable con laminado en oro de 18K resistentes a salpicaduras waterproof" },
  { name: "COLLAR", price: 12.00, stock: 1, barcode: "093", category: "Collares", description: "Collares de acero inoxidable con laminado en oro de 18K resistentes a salpicaduras waterproof" },
  { name: "COLLAR", price: 12.00, stock: 1, barcode: "126", category: "Collares", description: "Collares de acero inoxidable con laminado en oro de 18K resistentes a salpicaduras waterproof" },
  { name: "COLLAR", price: 12.00, stock: 2, barcode: "134", category: "Collares", description: "Collares de acero inoxidable con laminado en oro de 18K resistentes a salpicaduras waterproof" },
  { name: "COLLAR", price: 12.00, stock: 1, barcode: "163", category: "Collares", description: "Collares de acero inoxidable con laminado en oro de 18K resistentes a salpicaduras waterproof" },
  { name: "COLLAR", price: 12.00, stock: 1, barcode: "164", category: "Collares", description: "Collares de acero inoxidable con laminado en oro de 18K resistentes a salpicaduras waterproof" },
  { name: "COLLAR", price: 12.00, stock: 1, barcode: "165", category: "Collares", description: "Collares de acero inoxidable con laminado en oro de 18K resistentes a salpicaduras waterproof" },
  { name: "COLLAR", price: 12.00, stock: 1, barcode: "173", category: "Collares", description: "Collares de acero inoxidable con laminado en oro de 18K resistentes a salpicaduras waterproof" },
  { name: "COLLAR", price: 12.00, stock: 3, barcode: "175", category: "Collares", description: "Collares de acero inoxidable con laminado en oro de 18K resistentes a salpicaduras waterproof" },
  { name: "COLLAR DE CRUZ REDONDO", price: 12.00, stock: 1, barcode: "016", category: "Collares", description: "Collares de acero inoxidable con laminado en oro de 18K resistentes a salpicaduras waterproof" },
  // Precio 11.50
  { name: "COLLAR", price: 11.50, stock: 1, barcode: "039", category: "Collares", description: "Collares de acero inoxidable con laminado en oro de 18K resistentes a salpicaduras waterproof" },
  { name: "COLLAR", price: 11.50, stock: 1, barcode: "072", category: "Collares", description: "Collares de acero inoxidable con laminado en oro de 18K resistentes a salpicaduras waterproof" },
  { name: "COLLAR DE FLOR", price: 11.50, stock: 1, barcode: "065", category: "Collares", description: "Collares de acero inoxidable con laminado en oro de 18K resistentes a salpicaduras waterproof" },
  // Precio 11.00
  { name: "collar de sol", price: 11.00, stock: 0, barcode: "89009", category: "Collares", description: "Collares de acero inoxidable con laminado en oro de 18K resistentes a salpicaduras waterproof" },
  // Precio 10.50
  { name: "COLLAR DE FLOR", price: 10.50, stock: 1, barcode: "055", category: "Collares", description: "Collares de acero inoxidable con laminado en oro de 18K resistentes a salpicaduras waterproof" },
  // Precio 10.00
  { name: "Collar", price: 10.00, stock: 1, barcode: "17801", category: "Collares", description: "Collares de acero inoxidable con laminado en oro de 18K resistentes a salpicaduras waterproof" },
  { name: "COLLAR", price: 10.00, stock: 1, barcode: "133", category: "Collares", description: "Collares de acero inoxidable con laminado en oro de 18K resistentes a salpicaduras waterproof" },
  { name: "COLLAR", price: 10.00, stock: 1, barcode: "139", category: "Collares", description: "Collares de acero inoxidable con laminado en oro de 18K resistentes a salpicaduras waterproof" },
  { name: "COLLAR", price: 10.00, stock: 1, barcode: "141", category: "Collares", description: "Collares de acero inoxidable con laminado en oro de 18K resistentes a salpicaduras waterproof" },
  { name: "COLLAR", price: 10.00, stock: 1, barcode: "155", category: "Collares", description: "Collares de acero inoxidable con laminado en oro de 18K resistentes a salpicaduras waterproof" },
  { name: "COLLAR", price: 10.00, stock: 1, barcode: "183", category: "Collares", description: "Collares de acero inoxidable con laminado en oro de 18K resistentes a salpicaduras waterproof" },
  { name: "COLLAR", price: 10.00, stock: 1, barcode: "184", category: "Collares", description: "Collares de acero inoxidable con laminado en oro de 18K resistentes a salpicaduras waterproof" },
  { name: "COLLAR", price: 10.00, stock: 1, barcode: "1200", category: "Collares", description: "Collares de acero inoxidable con laminado en oro de 18K resistentes a salpicaduras waterproof" },
  { name: "COLLAR CLASICO", price: 10.00, stock: 2, barcode: "020", category: "Collares", description: "Collares de acero inoxidable con laminado en oro de 18K resistentes a salpicaduras waterproof" },
  { name: "COLLAR DE CORAZON NEGRO", price: 10.00, stock: 1, barcode: "062", category: "Collares", description: "Collares de acero inoxidable con laminado en oro de 18K resistentes a salpicaduras waterproof" },
  // Precio 9.50
  { name: "Collar", price: 9.50, stock: 1, barcode: "10199191", category: "Collares", description: "Collares de acero inoxidable con laminado en oro de 18K resistentes a salpicaduras waterproof" },
  // Precio 8.00
  { name: "COLLAR", price: 8.00, stock: 3, barcode: "028", category: "Collares", description: "Collares de acero inoxidable con laminado en oro de 18K resistentes a salpicaduras waterproof" },
  // Precio 5.50
  { name: "Aritos", price: 5.50, stock: 0, barcode: "029", category: "Collares", description: "Collares de acero inoxidable con laminado en oro de 18K resistentes a salpicaduras waterproof" },
  // Precio 0.00
  { name: "COLLAR", price: 0.00, stock: 0, barcode: "083", category: "Collares", description: "Collares de acero inoxidable con laminado en oro de 18K resistentes a salpicaduras waterproof" },
  // Agotados adicionales
  { name: "COLLAR", price: 12.00, stock: 0, barcode: "024", category: "Collares", description: "Collares de acero inoxidable con laminado en oro de 18K resistentes a salpicaduras waterproof" },
  { name: "COLLAR", price: 12.00, stock: 0, barcode: "094", category: "Collares", description: "Collares de acero inoxidable con laminado en oro de 18K resistentes a salpicaduras waterproof" },
  { name: "COLLAR", price: 12.00, stock: 0, barcode: "095", category: "Collares", description: "Collares de acero inoxidable con laminado en oro de 18K resistentes a salpicaduras waterproof" },
  { name: "COLLAR", price: 12.00, stock: 0, barcode: "113", category: "Collares", description: "Collares de acero inoxidable con laminado en oro de 18K resistentes a salpicaduras waterproof" },
  { name: "COLLAR", price: 12.00, stock: 0, barcode: "171", category: "Collares", description: "Collares de acero inoxidable con laminado en oro de 18K resistentes a salpicaduras waterproof" },
  { name: "COLLAR", price: 12.00, stock: 0, barcode: "01116", category: "Collares", description: "Collares de acero inoxidable con laminado en oro de 18K resistentes a salpicaduras waterproof" },
  { name: "COLLAR", price: 11.00, stock: 0, barcode: "109", category: "Collares", description: "Collares de acero inoxidable con laminado en oro de 18K resistentes a salpicaduras waterproof" },
  { name: "COLLAR", price: 10.00, stock: 0, barcode: "040", category: "Collares", description: "Collares de acero inoxidable con laminado en oro de 18K resistentes a salpicaduras waterproof" },
  { name: "COLLAR", price: 10.00, stock: 0, barcode: "01127", category: "Collares", description: "Collares de acero inoxidable con laminado en oro de 18K resistentes a salpicaduras waterproof" },
  { name: "COLLAR", price: 10.00, stock: 0, barcode: "01129", category: "Collares", description: "Collares de acero inoxidable con laminado en oro de 18K resistentes a salpicaduras waterproof" },
  { name: "COLLAR DE PERLAS", price: 13.50, stock: 0, barcode: "048", category: "Collares", description: "Collares de acero inoxidable con laminado en oro de 18K resistentes a salpicaduras waterproof" },
  { name: "Collar mariposa", price: 10.00, stock: 0, barcode: "200", category: "Collares", description: "Collares de acero inoxidable con laminado en oro de 18K resistentes a salpicaduras waterproof" },
  { name: "COLLAR DOBLE", price: 15.00, stock: 0, barcode: "010", category: "Collares", description: "Collares de acero inoxidable con laminado en oro de 18K resistentes a salpicaduras waterproof" },

  // ============================================================
  // PULSERAS (en stock primero, ordenadas por precio descendente)
  // ============================================================
  // Precio 14.00
  { name: "PULSERA DE CORAZONES", price: 14.00, stock: 1, barcode: "40206", category: "Pulseras", description: "Pulsera elegante de acero inoxidable 304 chapada en oro con circones" },
  // Precio 13.00
  { name: "PULSERA", price: 13.00, stock: 3, barcode: "159", category: "Pulseras", description: "" },
  // Precio 12.99
  { name: "PULSERA", price: 12.99, stock: 1, barcode: "105", category: "Pulseras", description: "" },
  // Precio 12.00
  { name: "PULSERA DE ZIRCONIA CORAZÓN", price: 12.00, stock: 1, barcode: "40207", category: "Pulseras", description: "Pulsera elegante de acero inoxidable 304 chapada en oro con zirconia" },
  { name: "PULSERA DE LUJO", price: 12.00, stock: 1, barcode: "030101", category: "Pulseras", description: "Brazalete de acero titanio elegante estilo clásico, resistente al agua y al deslustre" },
  { name: "PULSERA ESFERA ROMANOS", price: 12.00, stock: 1, barcode: "40106", category: "Pulseras", description: "Pulsera chapada en oro auténtico 18K, acero inoxidable 304, resistente al agua y deslustre" },
  { name: "CARTIER PLATEADA", price: 12.00, stock: 1, barcode: "40108", category: "Pulseras", description: "Brazalete chapado en oro 18K con circones" },
  { name: "ESTRELLA DE MAR CORAZÓN FRESA", price: 12.00, stock: 1, barcode: "40101", category: "Pulseras", description: "Pulsera de acero inoxidable 304 con dijes de estrella de mar, corazón y fresa" },
  { name: "PULSERA DE CORAZÓN ROSADO", price: 12.00, stock: 1, barcode: "40208", category: "Pulseras", description: "Pulsera minimalista de acero inoxidable 201 en forma de corazón" },
  { name: "PULSERA", price: 12.00, stock: 1, barcode: "146", category: "Pulseras", description: "" },
  { name: "PULSERA", price: 12.00, stock: 1, barcode: "03331", category: "Pulseras", description: "" },
  { name: "PULSERA", price: 12.00, stock: 1, barcode: "03332", category: "Pulseras", description: "" },
  { name: "PULSERA DE TREBOL", price: 12.00, stock: 2, barcode: "01118", category: "Pulseras", description: "" },
  // Precio 11.00
  { name: "PULSERA CARTIER", price: 11.00, stock: 0, barcode: "031", category: "Pulseras", description: "" },
  // Precio 10.50
  { name: "PULSERA", price: 10.50, stock: 1, barcode: "02221", category: "Pulseras", description: "" },
  // Precio 10.00
  { name: "BRAZALETE PARA MUJER", price: 10.00, stock: 1, barcode: "40209", category: "Pulseras", description: "Brazalete de acero inoxidable 304 bañado en oro, resistente al agua y deslustre con patrón de corazón" },
  { name: "PERLAS ORO BOLAS DOBLE CADENA", price: 10.00, stock: 1, barcode: "40107", category: "Pulseras", description: "Pulsera de corazón acero titanio básico, estilo simple, resistente al agua y deslustre" },
  { name: "PULSERA CEREZA FRESA", price: 10.00, stock: 1, barcode: "40201", category: "Pulseras", description: "Pulsera de acero inoxidable chapada en oro ajustable, estilo europeo y americano, diseño pulido de cereza y fresa" },
  { name: "PULSERA", price: 10.00, stock: 1, barcode: "044", category: "Pulseras", description: "" },
  { name: "PULSERA", price: 10.00, stock: 0, barcode: "038", category: "Pulseras", description: "" },
  { name: "PULSERA", price: 10.00, stock: 0, barcode: "106", category: "Pulseras", description: "" },
  { name: "PULSERA", price: 10.00, stock: 0, barcode: "112", category: "Pulseras", description: "" },
  { name: "PULSERA", price: 10.00, stock: 0, barcode: "160", category: "Pulseras", description: "" },
  { name: "PULSERA", price: 10.00, stock: 0, barcode: "198", category: "Pulseras", description: "" },
  { name: "PULSERA", price: 10.00, stock: 0, barcode: "01126", category: "Pulseras", description: "" },
  { name: "PULSERA", price: 10.00, stock: 0, barcode: "02223", category: "Pulseras", description: "" },
  { name: "PULSERA", price: 10.00, stock: 0, barcode: "2001", category: "Pulseras", description: "" },
  { name: "PULSERA AJUSTABLE", price: 10.00, stock: 0, barcode: "018", category: "Pulseras", description: "" },
  { name: "PULSERA cartier", price: 10.00, stock: 0, barcode: "032", category: "Pulseras", description: "" },
  // Precio 9.00
  { name: "PULSERA", price: 9.00, stock: 0, barcode: "161", category: "Pulseras", description: "" },
  // Precio 8.00
  { name: "PULSERA", price: 8.00, stock: 1, barcode: "9789", category: "Pulseras", description: "" },
  // Precio 7.00
  { name: "PULSERA", price: 7.00, stock: 2, barcode: "043", category: "Pulseras", description: "" },
  { name: "PULSERA", price: 7.00, stock: 1, barcode: "8967", category: "Pulseras", description: "" },
  { name: "BRACELET", price: 7.00, stock: 0, barcode: "041", category: "Pulseras", description: "" },
  // Precio 6.00
  { name: "PULSERA BASICA", price: 6.00, stock: 1, barcode: "030", category: "Pulseras", description: "" },
  { name: "PULSERA", price: 6.00, stock: 0, barcode: "064", category: "Pulseras", description: "" },
  // Precio 5.50
  { name: "PULSERA", price: 5.50, stock: 0, barcode: "1250", category: "Pulseras", description: "" },
  // Precio 5.00
  { name: "PULSERA VINTAGE PERLAS", price: 5.00, stock: 1, barcode: "40203", category: "Pulseras", description: "Pulsera vintage de perlas con piedra preciosa, estilo francés, sensación única de alta gama, material de aleación" },
  { name: "PULSERA", price: 5.00, stock: 1, barcode: "042", category: "Pulseras", description: "" },
  // Agotados adicionales
  { name: "PULSERA", price: 12.00, stock: 0, barcode: "103", category: "Pulseras", description: "" },
  { name: "PULSERA", price: 12.00, stock: 0, barcode: "167", category: "Pulseras", description: "" },
  { name: "VAN CLEEF", price: 12.00, stock: 0, barcode: "050", category: "Pulseras", description: "" },

  // ============================================================
  // ARITOS (en stock primero, ordenados por precio descendente)
  // ============================================================
  // Precio 8.99
  { name: "ARITOS", price: 8.99, stock: 1, barcode: "157", category: "Aritos", description: "Aritos de acero inoxidable con laminado de oro de 14K resistentes a salpicaduras de agua, waterproof" },
  { name: "ARITOS", price: 8.99, stock: 1, barcode: "158", category: "Aritos", description: "Aritos de acero inoxidable con laminado de oro de 14K resistentes a salpicaduras de agua, waterproof" },
  // Precio 8.50
  { name: "ARITOSS", price: 8.50, stock: 1, barcode: "174", category: "Aritos", description: "Aritos de acero inoxidable con laminado de oro de 14K resistentes a salpicaduras de agua, waterproof" },
  { name: "ARITOS", price: 8.50, stock: 1, barcode: "178", category: "Aritos", description: "Aritos de acero inoxidable con laminado de oro de 14K resistentes a salpicaduras de agua, waterproof" },
  { name: "ARITOS", price: 8.50, stock: 1, barcode: "177", category: "Aritos", description: "Aritos de acero inoxidable con laminado de oro de 14K resistentes a salpicaduras de agua, waterproof" },
  // Precio 8.00
  { name: "ARITOS", price: 8.00, stock: 1, barcode: "085", category: "Aritos", description: "Aritos de acero inoxidable con laminado de oro de 14K resistentes a salpicaduras de agua, waterproof" },
  { name: "ARITOS", price: 8.00, stock: 1, barcode: "107", category: "Aritos", description: "Aritos de acero inoxidable con laminado de oro de 14K resistentes a salpicaduras de agua, waterproof" },
  { name: "ARITOS", price: 8.00, stock: 1, barcode: "118", category: "Aritos", description: "Aritos de acero inoxidable con laminado de oro de 14K resistentes a salpicaduras de agua, waterproof" },
  // Precio 7.99
  { name: "ARITOS", price: 7.99, stock: 0, barcode: "108", category: "Aritos", description: "Aritos de acero inoxidable con laminado de oro de 14K resistentes a salpicaduras de agua, waterproof" },
  // Precio 7.50
  { name: "ARITOS", price: 7.50, stock: 0, barcode: "179", category: "Aritos", description: "Aritos de acero inoxidable con laminado de oro de 14K resistentes a salpicaduras de agua, waterproof" },
  { name: "ARITOS", price: 7.50, stock: 1, barcode: "117", category: "Aritos", description: "Aritos de acero inoxidable con laminado de oro de 14K resistentes a salpicaduras de agua, waterproof" },
  { name: "ARITOS", price: 7.50, stock: 1, barcode: "156", category: "Aritos", description: "Aritos de acero inoxidable con laminado de oro de 14K resistentes a salpicaduras de agua, waterproof" },
  { name: "ARITOS", price: 7.50, stock: 1, barcode: "170", category: "Aritos", description: "Aritos de acero inoxidable con laminado de oro de 14K resistentes a salpicaduras de agua, waterproof" },
  // Precio 7.00
  { name: "ARITOS", price: 7.00, stock: 1, barcode: "060", category: "Aritos", description: "Aritos de acero inoxidable con laminado de oro de 14K resistentes a salpicaduras de agua, waterproof" },
  { name: "ARITOS", price: 7.00, stock: 1, barcode: "09", category: "Aritos", description: "Aritos de acero inoxidable con laminado de oro de 14K resistentes a salpicaduras de agua, waterproof" },
  { name: "ARITOS", price: 7.00, stock: 1, barcode: "013", category: "Aritos", description: "Aritos de acero inoxidable con laminado de oro de 14K resistentes a salpicaduras de agua, waterproof" },
  { name: "ARITOS", price: 7.00, stock: 3, barcode: "166", category: "Aritos", description: "Aritos de acero inoxidable con laminado de oro de 14K resistentes a salpicaduras de agua, waterproof" },
  { name: "ARITOS", price: 7.00, stock: 1, barcode: "190012", category: "Aritos", description: "Aritos de acero inoxidable con laminado de oro de 14K resistentes a salpicaduras de agua, waterproof" },
  { name: "ARITOS", price: 7.00, stock: 0, barcode: "06", category: "Aritos", description: "Aritos de acero inoxidable con laminado de oro de 14K resistentes a salpicaduras de agua, waterproof" },
  { name: "ARITOS", price: 7.00, stock: 0, barcode: "011", category: "Aritos", description: "Aritos de acero inoxidable con laminado de oro de 14K resistentes a salpicaduras de agua, waterproof" },
  // Precio 6.99
  { name: "ARITOS", price: 6.99, stock: 0, barcode: "115", category: "Aritos", description: "Aritos de acero inoxidable con laminado de oro de 14K resistentes a salpicaduras de agua, waterproof" },
  // Precio 6.50
  { name: "ARITOS", price: 6.50, stock: 0, barcode: "082", category: "Aritos", description: "Aritos de acero inoxidable con laminado de oro de 14K resistentes a salpicaduras de agua, waterproof" },
  { name: "ARITOS", price: 6.50, stock: 1, barcode: "116", category: "Aritos", description: "Aritos de acero inoxidable con laminado de oro de 14K resistentes a salpicaduras de agua, waterproof" },
  { name: "ARITOS", price: 6.50, stock: 0, barcode: "169", category: "Aritos", description: "Aritos de acero inoxidable con laminado de oro de 14K resistentes a salpicaduras de agua, waterproof" },
  { name: "ARITOS", price: 6.50, stock: 1, barcode: "176", category: "Aritos", description: "Aritos de acero inoxidable con laminado de oro de 14K resistentes a salpicaduras de agua, waterproof" },
  // Precio 6.00
  { name: "PENDIENTES ROJOS", price: 6.00, stock: 1, barcode: "40109", category: "Aritos", description: "Pendientes con aguja de plata S925, color vino rojo otoño" },
  { name: "PERLAS DE AGUA DULCE", price: 6.00, stock: 1, barcode: "40103", category: "Aritos", description: "Aritos de perlas de agua dulce con aguja de plata" },
  { name: "ARITOS", price: 6.00, stock: 0, barcode: "028393992", category: "Aritos", description: "Aritos de acero inoxidable con laminado de oro de 14K resistentes a salpicaduras de agua, waterproof" },
  { name: "ARITOS", price: 6.00, stock: 0, barcode: "081", category: "Aritos", description: "Aritos de acero inoxidable con laminado de oro de 14K resistentes a salpicaduras de agua, waterproof" },
  { name: "ARITOS", price: 6.00, stock: 0, barcode: "119", category: "Aritos", description: "Aritos de acero inoxidable con laminado de oro de 14K resistentes a salpicaduras de agua, waterproof" },
  // Precio 5.50
  { name: "ARITOS", price: 5.50, stock: 1, barcode: "101", category: "Aritos", description: "Aritos de acero inoxidable con laminado de oro de 14K resistentes a salpicaduras de agua, waterproof" },
  { name: "ARITOS", price: 5.50, stock: 0, barcode: "140", category: "Aritos", description: "Aritos de acero inoxidable con laminado de oro de 14K resistentes a salpicaduras de agua, waterproof" },
  { name: "ARITOS", price: 5.50, stock: 1, barcode: "168", category: "Aritos", description: "Aritos de acero inoxidable con laminado de oro de 14K resistentes a salpicaduras de agua, waterproof" },
  // Precio 5.00
  { name: "ARITOS", price: 5.00, stock: 0, barcode: "07", category: "Aritos", description: "Aritos de acero inoxidable con laminado de oro de 14K resistentes a salpicaduras de agua, waterproof" },
  { name: "ARITOS", price: 5.00, stock: 0, barcode: "079", category: "Aritos", description: "Aritos de acero inoxidable con laminado de oro de 14K resistentes a salpicaduras de agua, waterproof" },
  { name: "ARITOS", price: 5.00, stock: 0, barcode: "100", category: "Aritos", description: "Aritos de acero inoxidable con laminado de oro de 14K resistentes a salpicaduras de agua, waterproof" },
  { name: "ARITOS", price: 5.00, stock: 0, barcode: "102", category: "Aritos", description: "Aritos de acero inoxidable con laminado de oro de 14K resistentes a salpicaduras de agua, waterproof" },
  { name: "ARITOS", price: 5.00, stock: 1, barcode: "19009", category: "Aritos", description: "Aritos de acero inoxidable con laminado de oro de 14K resistentes a salpicaduras de agua, waterproof" },
  { name: "ARITOS DE ALEACION", price: 5.00, stock: 0, barcode: "02222", category: "Aritos", description: "ARITOS DE ALTA GAMA" },
  { name: "AGUJA PLATA", price: 5.00, stock: 0, barcode: "02224", category: "Aritos", description: "AGUJA DE PLATA con BAÑADOS de oro de 14K RECOMENDACION NO MOJARLOS" },
  { name: "AGUJA PLATA", price: 5.00, stock: 0, barcode: "02226", category: "Aritos", description: "AGUJA DE PLATA con BAÑADOS de oro de 14K RECOMENDACION NO MOJARLOS" },
  { name: "AGUJA PLATA", price: 5.00, stock: 1, barcode: "02227", category: "Aritos", description: "AGUJA DE PLATA con BAÑADOS de oro de 14K RECOMENDACION NO MOJARLOS" },
  { name: "AGUJA PLATA", price: 5.00, stock: 0, barcode: "02228", category: "Aritos", description: "AGUJA DE PLATA con BAÑADOS de oro de 14K RECOMENDACION NO MOJARLOS" },
  // Precio 4.50
  { name: "ARITOS DE CORAZON", price: 4.50, stock: 0, barcode: "056", category: "Aritos", description: "Aritos de acero inoxidable con laminado de oro de 14K resistentes a salpicaduras de agua, waterproof" },
  // Precio 4.00
  { name: "PENDIENTES DE COBRE", price: 4.00, stock: 1, barcode: "40204", category: "Aritos", description: "Pendientes de cobre con perla" },
  { name: "ARITOS", price: 4.00, stock: 0, barcode: "080", category: "Aritos", description: "Aritos de acero inoxidable con laminado de oro de 14K resistentes a salpicaduras de agua, waterproof" },
  { name: "ARITOS", price: 4.00, stock: 7, barcode: "124", category: "Aritos", description: "Aritos de acero inoxidable con laminado de oro de 14K resistentes a salpicaduras de agua, waterproof" },
  // Precio 3.50
  { name: "ARITOS", price: 3.50, stock: 1, barcode: "046", category: "Aritos", description: "Aritos de acero inoxidable con laminado de oro de 14K resistentes a salpicaduras de agua, waterproof" },
  { name: "ARITOS", price: 3.50, stock: 0, barcode: "036", category: "Aritos", description: "Aritos de acero inoxidable con laminado de oro de 14K resistentes a salpicaduras de agua, waterproof" },
  { name: "ARITOS", price: 3.50, stock: 0, barcode: "092", category: "Aritos", description: "Aritos de acero inoxidable con laminado de oro de 14K resistentes a salpicaduras de agua, waterproof" },
  // Precio 3.00
  { name: "ARITOS DE ESTRELLA", price: 3.00, stock: 0, barcode: "019", category: "Aritos", description: "Aritos de acero inoxidable con laminado de oro de 14K resistentes a salpicaduras de agua, waterproof" },
  // Precio 2.00
  { name: "Aritos", price: 2.00, stock: 1, barcode: "1991919", category: "Aritos", description: "Aritos de acero inoxidable con laminado de oro de 14K resistentes a salpicaduras de agua, waterproof" },

  // ============================================================
  // CARTERAS (en stock primero, ordenadas por precio descendente)
  // ============================================================
  // Precio 24.00
  { name: "CARTERA", price: 24.00, stock: 1, barcode: "098", category: "Carteras" },
  // Precio 20.00
  { name: "CARTERA CLASICA", price: 20.00, stock: 0, barcode: "051", category: "Carteras" },
  // Precio 18.50
  { name: "CARTERA", price: 18.50, stock: 1, barcode: "086", category: "Carteras" },
  { name: "CARTERA", price: 18.50, stock: 1, barcode: "087", category: "Carteras" },
  // Precio 18.00
  { name: "CARTERA VINO", price: 18.00, stock: 0, barcode: "053", category: "Carteras" },
  // Precio 17.75
  { name: "CARTERA CAFE", price: 17.75, stock: 0, barcode: "899", category: "Carteras" },
  // Precio 16.50
  { name: "CARTERA", price: 16.50, stock: 0, barcode: "035", category: "Carteras" },
  // Precio 15.99
  { name: "CARTERA", price: 15.99, stock: 1, barcode: "149", category: "Carteras" },
  { name: "CARTERA", price: 15.99, stock: 1, barcode: "150", category: "Carteras" },
  // Precio 15.00
  { name: "CARTERA", price: 15.00, stock: 0, barcode: "071", category: "Carteras" },
  { name: "CARTERA", price: 15.00, stock: 0, barcode: "130", category: "Carteras" },
  // Precio 14.99
  { name: "CARTERA", price: 14.99, stock: 0, barcode: "089", category: "Carteras" },
  { name: "CARTERA", price: 14.99, stock: 1, barcode: "096", category: "Carteras" },
  { name: "CARTERA", price: 14.99, stock: 1, barcode: "097", category: "Carteras" },
  { name: "CARTERA", price: 14.99, stock: 0, barcode: "099", category: "Carteras" },
  { name: "CARTERA", price: 14.99, stock: 0, barcode: "114", category: "Carteras" },
  { name: "CARTERA", price: 14.99, stock: 1, barcode: "147", category: "Carteras" },
  // Precio 14.00
  { name: "CARTERA", price: 14.00, stock: 0, barcode: "132", category: "Carteras" },
  { name: "CARTERA", price: 14.00, stock: 1, barcode: "148", category: "Carteras" },
  { name: "CARTERA", price: 14.00, stock: 1, barcode: "152", category: "Carteras" },
  { name: "CARTERA", price: 14.00, stock: 0, barcode: "153", category: "Carteras" },
  // Precio 13.99
  { name: "CARTERA", price: 13.99, stock: 1, barcode: "128", category: "Carteras" },
  { name: "CARTERA", price: 13.99, stock: 1, barcode: "129", category: "Carteras" },
  // Precio 13.50
  { name: "CARTERA", price: 13.50, stock: 0, barcode: "077", category: "Carteras" },
  { name: "CARTERA", price: 13.50, stock: 0, barcode: "151", category: "Carteras" },
  { name: "CARTERA BLANCA", price: 13.50, stock: 0, barcode: "075", category: "Carteras" },
  { name: "CARTERA ROJA", price: 13.50, stock: 0, barcode: "074", category: "Carteras" },
  // Precio 13.00
  { name: "CARTERA BLANCA", price: 13.00, stock: 0, barcode: "022", category: "Carteras" },
  // Precio 12.50
  { name: "CARTERA", price: 12.50, stock: 1, barcode: "03", category: "Carteras" },
  { name: "CARTERA CLASICA", price: 12.50, stock: 0, barcode: "061", category: "Carteras" },
  // Precio 12.00
  { name: "CARTERA", price: 12.00, stock: 0, barcode: "014", category: "Carteras" },
  { name: "CARTERA", price: 12.00, stock: 0, barcode: "127", category: "Carteras" },
  // Precio 10.99
  { name: "CARTERA", price: 10.99, stock: 1, barcode: "033", category: "Carteras" },
  { name: "CARTERA BLANCA", price: 10.99, stock: 0, barcode: "049", category: "Carteras" },
  { name: "CARTERA BLANCA", price: 10.99, stock: 0, barcode: "058", category: "Carteras" },
  { name: "Cartera blanca", price: 10.99, stock: 0, barcode: "190", category: "Carteras" },
  { name: "CARTERA MORADA", price: 10.99, stock: 0, barcode: "054", category: "Carteras" },
  { name: "CARTERA NEGRA", price: 10.99, stock: 1, barcode: "047", category: "Carteras" },
  // Precio 10.50
  { name: "CARTERA BEIG", price: 10.50, stock: 1, barcode: "068", category: "Carteras" },
  { name: "CARTERA BLANCA", price: 10.50, stock: 0, barcode: "063", category: "Carteras" },
  // Precio 10.00
  { name: "BILLETERA", price: 10.00, stock: 0, barcode: "076", category: "Carteras" },
  { name: "BOLSO DE MANO", price: 10.00, stock: 1, barcode: "088", category: "Carteras" },
  { name: "CARTERA", price: 10.00, stock: 1, barcode: "073", category: "Carteras" },
  { name: "Carteras", price: 10.00, stock: 1, barcode: "181", category: "Carteras" },
  // Precio 9.50
  { name: "CARTERA ROSADA", price: 9.50, stock: 0, barcode: "023", category: "Carteras" },

  // ============================================================
  // LENTES DE SOL (en stock primero, ordenados por precio descendente)
  // ============================================================
  { name: "LENTES", price: 7.50, stock: 1, barcode: "015", category: "Lentes de sol" },
  { name: "LENTES NEGROS", price: 5.75, stock: 1, barcode: "037", category: "Lentes de sol" },

  // ============================================================
  // ANILLOS (todos en stock, mismo precio)
  // ============================================================
  { name: "ANILLO", price: 10.00, stock: 1, barcode: "02", category: "Anillos" },
  { name: "ANILLO", price: 10.00, stock: 1, barcode: "04", category: "Anillos" },
  { name: "ANILLO", price: 10.00, stock: 1, barcode: "08", category: "Anillos" },
  { name: "ANILLO", price: 10.00, stock: 1, barcode: "017", category: "Anillos" },
  { name: "ANILLO", price: 10.00, stock: 1, barcode: "021", category: "Anillos" },
  { name: "ANILLO", price: 10.00, stock: 1, barcode: "045", category: "Anillos" },
  { name: "ANILLO", price: 10.00, stock: 1, barcode: "057", category: "Anillos" },
  { name: "ANILO", price: 10.00, stock: 1, barcode: "059", category: "Anillos" },

  // ============================================================
  // OTROS (en stock primero)
  // ============================================================
  { name: "ACCESORIOS", price: 0.25, stock: 20, barcode: "137", category: "Accesorios para el cabello" },
  { name: "CEREZA", price: 5.25, stock: 3, barcode: "122", category: "Otros" },
  { name: "TARJETAS NAVIDEÑAS", price: 0.00, stock: 121, barcode: "154", category: "Otros" }
];
