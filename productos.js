CARRITO 


<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#E8D5C4">
    
    <!-- Favicon -->
    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><path fill='%23A67B7B' d='M16 28.8l-1.5-1.4C7.6 20.8 3 16.6 3 11.5 3 7.3 6.3 4 10.5 4c2.4 0 4.7 1.1 6 2.9C17.8 5.1 20.1 4 22.5 4 26.7 4 30 7.3 30 11.5c0 5.1-4.6 9.3-11.5 15.9L16 28.8z'/></svg>">
    
    <title>Klohe - Accesorios | San Valentín</title>
    
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Inter:wght@300;400;500&display=swap" rel="stylesheet">
    <style>
        :root {
            --blanco: #FAF9F6;
            --crema: #F5F1ED;
            --rosa-suave: #E8D5C4;
            --rosa-medio: #D4A5A5;
            --rosa-oscuro: #A67B7B;
            --texto: #2C2C2C;
            --texto-claro: #6B6B6B;
            --acento: #C9B8A8;
            --sombra-suave: rgba(0, 0, 0, 0.04);
            --transicion: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', sans-serif;
            background-color: var(--blanco);
            color: var(--texto);
            line-height: 1.6;
            font-weight: 300;
            letter-spacing: 0.02em;
        }

        body.modal-open {
            overflow: hidden;
        }

        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 1rem;
        }

        @media (min-width: 768px) {
            .container {
                padding: 0 2rem;
            }
        }

        /* Header Compacto */
        header {
            background: var(--blanco);
            padding: 1rem 0;
            position: sticky;
            top: 0;
            z-index: 100;
            border-bottom: 1px solid var(--crema);
            backdrop-filter: blur(10px);
            background-color: rgba(250, 249, 246, 0.95);
        }

        header .container {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .logo {
            font-family: 'Cormorant Garamond', serif;
            font-size: 1.5rem;
            font-weight: 400;
            color: var(--texto);
            letter-spacing: 0.2em;
            text-transform: uppercase;
        }

        .logo span {
            font-weight: 300;
            color: var(--rosa-oscuro);
        }

        .cart-icon {
            position: relative;
            cursor: pointer;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid var(--rosa-suave);
            border-radius: 50%;
            transition: var(--transicion);
            background: transparent;
            color: var(--texto);
        }

        .cart-icon:hover {
            background: var(--rosa-suave);
            border-color: var(--rosa-medio);
        }

        .cart-icon span {
            position: absolute;
            top: -5px;
            right: -5px;
            background: var(--rosa-oscuro);
            color: white;
            border-radius: 50%;
            width: 18px;
            height: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.65rem;
            font-weight: 500;
        }

        /* Hero Compacto */
        .hero {
            text-align: center;
            padding: 3rem 0 2rem;
            background: var(--crema);
            position: relative;
            overflow: hidden;
        }

        .hero h2 {
            font-family: 'Cormorant Garamond', serif;
            font-size: 1.8rem;
            font-weight: 300;
            color: var(--texto);
            margin-bottom: 0.5rem;
            letter-spacing: 0.05em;
        }

        .hero p {
            color: var(--texto-claro);
            font-size: 0.9rem;
            font-weight: 300;
        }

        /* Filtros Compactos */
        .filters-container {
            background: transparent;
            padding: 1rem 0;
            margin: 1rem 0;
            border-bottom: 1px solid var(--crema);
        }

        .filters {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
            justify-content: center;
            align-items: center;
        }

        .search-container {
            position: relative;
            flex: 1;
            min-width: 200px;
            max-width: 300px;
        }

        .search-container input {
            width: 100%;
            padding: 0.7rem 1rem 0.7rem 2.2rem;
            border: 1px solid var(--rosa-suave);
            border-radius: 0;
            font-size: 0.85rem;
            background: transparent;
            color: var(--texto);
            transition: var(--transicion);
            font-family: 'Inter', sans-serif;
        }

        .search-container input:focus {
            outline: none;
            border-color: var(--rosa-oscuro);
        }

        .search-container i {
            position: absolute;
            left: 0.8rem;
            top: 50%;
            transform: translateY(-50%);
            color: var(--texto-claro);
            font-size: 0.85rem;
        }

        .filters select {
            padding: 0.7rem 2rem 0.7rem 1rem;
            border: 1px solid var(--rosa-suave);
            border-radius: 0;
            font-size: 0.85rem;
            background: transparent;
            color: var(--texto);
            cursor: pointer;
            transition: var(--transicion);
            font-family: 'Inter', sans-serif;
            appearance: none;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236B6B6B' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 0.8rem center;
        }

        .filters select:focus {
            border-color: var(--rosa-oscuro);
            outline: none;
        }

        .filter-checkbox {
            display: flex;
            align-items: center;
            gap: 0.4rem;
            cursor: pointer;
            font-size: 0.85rem;
            color: var(--texto-claro);
            font-weight: 400;
        }

        .filter-checkbox input[type="checkbox"] {
            width: 16px;
            height: 16px;
            border: 1px solid var(--rosa-suave);
            accent-color: var(--rosa-oscuro);
            cursor: pointer;
        }

        /* Grid de Productos */
        .products-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
            margin-bottom: 2rem;
        }

        @media (min-width: 480px) {
            .products-grid {
                grid-template-columns: repeat(2, 1fr);
                gap: 1.5rem;
            }
        }

        @media (min-width: 640px) {
            .products-grid {
                grid-template-columns: repeat(3, 1fr);
                gap: 2rem;
            }
        }

        @media (min-width: 1024px) {
            .products-grid {
                grid-template-columns: repeat(4, 1fr);
                gap: 2rem;
            }
        }

        @media (min-width: 1280px) {
            .products-grid {
                grid-template-columns: repeat(5, 1fr);
                gap: 2rem;
            }
        }

        .product-card {
            background: transparent;
            overflow: hidden;
            transition: var(--transicion);
            position: relative;
            border: none;
            box-shadow: none;
            display: flex;
            flex-direction: column;
        }

        .product-card:hover {
            transform: translateY(-3px);
        }

        .product-card.agotado {
            opacity: 0.5;
        }

        .product-card.agotado .product-image-container::after {
            content: 'Agotado';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--texto);
            color: white;
            padding: 0.4rem 1rem;
            font-size: 0.7rem;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            font-weight: 400;
        }

        .badge-nuevo {
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
            background: var(--rosa-oscuro);
            color: white;
            padding: 0.2rem 0.6rem;
            font-size: 0.6rem;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            z-index: 10;
            font-weight: 400;
        }

        .product-image-container {
            position: relative;
            width: 100%;
            aspect-ratio: 1;
            overflow: hidden;
            background: var(--crema);
            cursor: pointer;
            margin-bottom: 0.8rem;
        }

        .product-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.6s ease;
        }

        .product-card:hover .product-image {
            transform: scale(1.05);
        }

        .product-info {
            padding: 0;
            text-align: center;
            flex: 1;
            display: flex;
            flex-direction: column;
        }

        .product-title {
            font-family: 'Cormorant Garamond', serif;
            font-size: 0.95rem;
            margin-bottom: 0.3rem;
            color: var(--texto);
            font-weight: 400;
            line-height: 1.3;
        }

        .product-material {
            font-size: 0.7rem;
            color: var(--rosa-oscuro);
            margin-bottom: 0.3rem;
            font-style: italic;
        }

        .product-details {
            background: transparent;
            border-radius: 0;
            padding: 0;
            margin-bottom: 0.5rem;
            font-size: 0.7rem;
            border: none;
            color: var(--texto-claro);
        }

        .detail-row {
            display: inline;
            margin: 0 0.3rem;
        }

        .detail-value {
            color: var(--texto-claro);
            font-weight: 400;
            font-size: 0.7rem;
            letter-spacing: 0.05em;
        }

        .price-row {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.8rem;
            margin: 0.5rem 0;
        }

        .product-price {
            font-size: 1rem;
            color: var(--rosa-oscuro);
            font-weight: 400;
            font-family: 'Cormorant Garamond', serif;
        }

        .quick-view-btn-inline {
            width: 28px;
            height: 28px;
            border: 1px solid var(--rosa-suave);
            background: transparent;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: var(--transicion);
            color: var(--texto-claro);
            font-size: 0.8rem;
        }

        .quick-view-btn-inline:hover {
            background: var(--rosa-suave);
            color: var(--texto);
        }

        .quantity-selector {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.8rem;
            margin: 0.5rem 0;
        }

        .qty-btn {
            width: 28px;
            height: 28px;
            border: 1px solid var(--rosa-suave);
            background: transparent;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 400;
            font-size: 0.9rem;
            transition: var(--transicion);
            color: var(--texto);
            flex-shrink: 0;
        }

        .qty-btn:hover {
            background: var(--rosa-suave);
        }

        .qty-display {
            min-width: 24px;
            text-align: center;
            font-weight: 400;
            font-size: 0.9rem;
            color: var(--texto);
        }

        .add-to-cart {
            width: 100%;
            padding: 0.7rem;
            background: var(--texto);
            color: white;
            border: none;
            border-radius: 0;
            cursor: pointer;
            font-size: 0.7rem;
            transition: var(--transicion);
            text-transform: uppercase;
            letter-spacing: 0.15em;
            font-weight: 400;
            margin-top: auto;
            min-height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .add-to-cart:hover:not(:disabled) {
            background: var(--rosa-oscuro);
        }

        .add-to-cart:disabled {
            opacity: 0.4;
            cursor: not-allowed;
            background: var(--texto-claro);
        }

        .load-more-container {
            text-align: center;
            padding: 2rem 0;
        }

        .load-more-btn {
            background: transparent;
            color: var(--texto);
            border: 1px solid var(--texto);
            padding: 0.8rem 2rem;
            border-radius: 0;
            font-size: 0.75rem;
            font-weight: 400;
            cursor: pointer;
            transition: var(--transicion);
            text-transform: uppercase;
            letter-spacing: 0.15em;
        }

        .load-more-btn:hover {
            background: var(--texto);
            color: white;
        }

        .load-more-btn:disabled {
            opacity: 0.4;
            cursor: not-allowed;
        }

        .products-count {
            text-align: center;
            color: var(--texto-claro);
            font-size: 0.8rem;
            margin-top: 1rem;
            letter-spacing: 0.05em;
        }

        /* Modal vista rápida */
        .quick-view-modal {
            display: none;
            position: fixed;
            z-index: 2000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background: rgba(250, 249, 246, 0.98);
            justify-content: center;
            align-items: center;
            padding: 1rem;
            backdrop-filter: blur(10px);
        }

        .quick-view-content {
            background: white;
            max-width: 900px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 3rem;
            padding: 2rem;
            position: relative;
            border: 1px solid var(--crema);
            box-shadow: 0 20px 60px var(--sombra-suave);
        }

        @media (max-width: 768px) {
            .quick-view-content {
                grid-template-columns: 1fr;
                padding: 1.5rem;
                gap: 1.5rem;
            }
        }

        .quick-view-image {
            width: 100%;
            aspect-ratio: 1;
            object-fit: cover;
            border: none;
        }

        .quick-view-info h2 {
            font-family: 'Cormorant Garamond', serif;
            color: var(--texto);
            margin-bottom: 0.5rem;
            font-size: 1.8rem;
            font-weight: 300;
        }

        .quick-view-material {
            font-size: 0.85rem;
            color: var(--rosa-oscuro);
            font-style: italic;
            margin-bottom: 1rem;
        }

        .quick-view-price {
            font-size: 1.4rem !important;
            color: var(--rosa-oscuro) !important;
            font-weight: 400;
            margin: 1rem 0;
            font-family: 'Cormorant Garamond', serif;
        }

        .image-modal {
            display: none;
            position: fixed;
            z-index: 2000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background: rgba(250, 249, 246, 0.98);
            justify-content: center;
            align-items: center;
        }

        .image-modal-content {
            max-width: 90%;
            max-height: 90%;
            object-fit: contain;
        }

        .image-modal-close {
            position: absolute;
            top: 1rem;
            right: 1rem;
            color: var(--texto);
            font-size: 1.5rem;
            cursor: pointer;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid var(--rosa-suave);
            border-radius: 50%;
            transition: var(--transicion);
            background: var(--blanco);
        }

        .image-modal-close:hover {
            background: var(--rosa-suave);
        }

        /* MODAL DE STOCK */
        .stock-modal-overlay {
            display: none;
            position: fixed;
            z-index: 5000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background: rgba(250, 249, 246, 0.8);
            backdrop-filter: blur(4px);
            justify-content: center;
            align-items: center;
        }

        .stock-modal-overlay.active {
            display: flex;
        }

        .stock-modal-content {
            background: var(--rosa-suave);
            padding: 2rem;
            border-radius: 0;
            text-align: center;
            max-width: 320px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.15);
            border: 1px solid var(--rosa-medio);
            animation: modalSlideIn 0.3s ease;
        }

        @keyframes modalSlideIn {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .stock-modal-content i {
            font-size: 2.5rem;
            color: var(--rosa-oscuro);
            margin-bottom: 1rem;
        }

        .stock-modal-content h3 {
            color: var(--texto);
            margin-bottom: 0.5rem;
            font-family: 'Cormorant Garamond', serif;
            font-weight: 400;
            font-size: 1.3rem;
        }

        .stock-modal-content p {
            color: var(--texto-claro);
            font-size: 0.9rem;
            margin-bottom: 1.5rem;
        }

        .stock-modal-content button {
            padding: 0.8rem 2rem;
            background: var(--texto);
            color: white;
            border: none;
            border-radius: 0;
            cursor: pointer;
            font-weight: 400;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            font-size: 0.7rem;
            transition: var(--transicion);
        }

        .stock-modal-content button:hover {
            background: var(--rosa-oscuro);
        }

        /* Mini carrito */
        .mini-cart {
            position: fixed;
            top: 0;
            right: -100%;
            width: 100%;
            max-width: 400px;
            height: 100vh;
            background: var(--blanco);
            box-shadow: -10px 0 40px var(--sombra-suave);
            z-index: 1001;
            transition: right 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            flex-direction: column;
            border-left: 1px solid var(--crema);
        }

        .mini-cart.open {
            right: 0;
        }

        .mini-cart-header {
            padding: 1.5rem;
            border-bottom: 1px solid var(--crema);
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: transparent;
        }

        .mini-cart-header h3 {
            font-family: 'Cormorant Garamond', serif;
            color: var(--texto);
            font-size: 1.3rem;
            font-weight: 400;
            letter-spacing: 0.1em;
        }

        .mini-cart-body {
            flex: 1;
            overflow-y: auto;
            padding: 1.5rem;
        }

        .mini-cart-footer {
            padding: 1.5rem;
            border-top: 1px solid var(--crema);
            background: var(--crema);
        }

        .cart-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.2);
            z-index: 1000;
            display: none;
            opacity: 0;
            transition: opacity 0.3s;
        }

        .cart-overlay.active {
            display: block;
            opacity: 1;
        }

        /* Envío */
        .shipping-compact {
            display: flex;
            align-items: center;
            gap: 0.8rem;
            padding: 0.8rem;
            background: var(--blanco);
            border: 1px solid var(--rosa-suave);
            cursor: pointer;
            transition: var(--transicion);
            margin-bottom: 0.8rem;
        }

        .shipping-compact.selected {
            border-color: var(--rosa-oscuro);
            background: var(--rosa-suave);
        }

        .shipping-compact input[type="checkbox"] {
            width: 16px;
            height: 16px;
            accent-color: var(--rosa-oscuro);
            cursor: pointer;
        }

        .shipping-info {
            flex: 1;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .shipping-text {
            font-size: 0.85rem;
            font-weight: 400;
        }

        .shipping-text small {
            display: block;
            font-size: 0.7rem;
            color: var(--texto-claro);
            font-weight: 300;
            margin-top: 0.1rem;
        }

        .shipping-price {
            color: var(--rosa-oscuro);
            font-weight: 400;
            font-size: 0.95rem;
            font-family: 'Cormorant Garamond', serif;
        }

        /* Descuento */
        .discount-compact {
            display: flex;
            gap: 0.5rem;
            margin-bottom: 0.8rem;
        }

        .discount-compact input {
            flex: 1;
            padding: 0.7rem;
            border: 1px solid var(--rosa-suave);
            border-radius: 0;
            font-size: 0.8rem;
            transition: var(--transicion);
            background: var(--blanco);
        }

        .discount-compact input:focus {
            outline: none;
            border-color: var(--rosa-oscuro);
        }

        .discount-compact button {
            background: var(--texto);
            color: white;
            border: none;
            padding: 0.7rem 1.2rem;
            border-radius: 0;
            cursor: pointer;
            font-weight: 400;
            font-size: 0.7rem;
            transition: var(--transicion);
            text-transform: uppercase;
            letter-spacing: 0.1em;
        }

        .discount-compact button:hover {
            background: var(--rosa-oscuro);
        }

        /* Totales */
        .cart-totals-compact {
            background: transparent;
            padding: 0.8rem 0;
            margin-bottom: 0.8rem;
            border-top: 1px solid var(--rosa-suave);
            border-bottom: 1px solid var(--rosa-suave);
        }

        .total-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.4rem;
            font-size: 0.85rem;
            color: var(--texto-claro);
        }

        .total-row.discount {
            color: var(--rosa-oscuro);
        }

        .total-row.final {
            font-size: 1.1rem;
            font-weight: 400;
            color: var(--texto);
            margin-top: 0.6rem;
            padding-top: 0.6rem;
            border-top: 1px solid var(--rosa-suave);
            font-family: 'Cormorant Garamond', serif;
        }

        .checkout-btn {
            width: 100%;
            padding: 1rem;
            background: var(--texto);
            color: white;
            border: none;
            border-radius: 0;
            font-size: 0.75rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.6rem;
            font-weight: 400;
            transition: var(--transicion);
            text-transform: uppercase;
            letter-spacing: 0.15em;
        }

        .checkout-btn:hover {
            background: var(--rosa-oscuro);
        }

        /* Reviews */
        .reviews-section {
            background: var(--crema);
            padding: 3rem 0;
            margin: 2rem 0;
        }

        .reviews-section h3 {
            font-family: 'Cormorant Garamond', serif;
            text-align: center;
            font-size: 1.5rem;
            color: var(--texto);
            margin-bottom: 2rem;
            font-weight: 300;
            letter-spacing: 0.1em;
        }

        .reviews-container {
            max-width: 500px;
            margin: 0 auto;
            position: relative;
            height: 150px;
            overflow: hidden;
        }

        .review-card {
            background: var(--blanco);
            border: 1px solid var(--rosa-suave);
            padding: 1.5rem;
            position: absolute;
            width: 100%;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.6s ease;
            text-align: center;
        }

        .review-card.active {
            opacity: 1;
            transform: translateY(0);
        }

        .review-stars {
            color: var(--rosa-medio);
            margin-bottom: 0.8rem;
            font-size: 0.9rem;
            letter-spacing: 0.2em;
        }

        .review-text {
            font-family: 'Cormorant Garamond', serif;
            font-style: italic;
            color: var(--texto);
            margin-bottom: 0.8rem;
            line-height: 1.6;
            font-size: 1rem;
            font-weight: 400;
        }

        .review-author {
            font-weight: 400;
            color: var(--rosa-oscuro);
            font-size: 0.8rem;
            letter-spacing: 0.1em;
            text-transform: uppercase;
        }

        .review-product {
            font-size: 0.7rem;
            color: var(--texto-claro);
            margin-top: 0.3rem;
        }

        /* Testimonios */
        .testimonials {
            background: var(--blanco);
            padding: 3rem 0;
            margin: 2rem 0;
            text-align: center;
            border-top: 1px solid var(--crema);
            border-bottom: 1px solid var(--crema);
        }

        .testimonial-text {
            font-family: 'Cormorant Garamond', serif;
            font-size: 1.4rem;
            font-style: italic;
            color: var(--texto);
            margin-bottom: 1rem;
            line-height: 1.5;
            font-weight: 300;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
        }

        .testimonial-author {
            color: var(--rosa-oscuro);
            font-weight: 400;
            font-size: 0.8rem;
            letter-spacing: 0.15em;
            text-transform: uppercase;
        }

        /* Social */
        .social-feed {
            padding: 3rem 0;
            text-align: center;
            background: var(--crema);
        }

        .social-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1px;
            margin-top: 2rem;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
            background: var(--rosa-suave);
        }

        @media (min-width: 768px) {
            .social-grid {
                grid-template-columns: repeat(4, 1fr);
            }
        }

        .social-item {
            aspect-ratio: 1;
            background: var(--crema);
            overflow: hidden;
            position: relative;
            cursor: pointer;
            transition: var(--transicion);
        }

        .social-item:hover {
            opacity: 0.8;
        }

        .social-item img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.6s ease;
        }

        .social-item:hover img {
            transform: scale(1.05);
        }

        .social-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(166, 123, 123, 0.9);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s;
            color: white;
        }

        .social-item:hover .social-overlay {
            opacity: 1;
        }

        .social-overlay i {
            font-size: 1.2rem;
        }

        .tiktok-section {
            margin-top: 3rem;
            padding: 2rem;
            background: var(--texto);
            color: white;
            max-width: 500px;
            margin-left: auto;
            margin-right: auto;
        }

        .tiktok-section h3 {
            color: white;
            margin-bottom: 0.5rem;
            font-family: 'Cormorant Garamond', serif;
            font-weight: 300;
            letter-spacing: 0.1em;
            font-size: 1.2rem;
        }

        .tiktok-link {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            background: transparent;
            color: white;
            padding: 0.8rem 1.5rem;
            border: 1px solid white;
            text-decoration: none;
            font-weight: 400;
            transition: var(--transicion);
            margin-top: 1rem;
            text-transform: uppercase;
            letter-spacing: 0.15em;
            font-size: 0.7rem;
        }

        .tiktok-link:hover {
            background: white;
            color: var(--texto);
        }

        /* Newsletter */
        .newsletter {
            background: var(--rosa-oscuro);
            padding: 3rem 0;
            text-align: center;
            margin: 2rem 0;
            color: white;
        }

        .newsletter h3 {
            font-family: 'Cormorant Garamond', serif;
            margin-bottom: 0.3rem;
            font-size: 1.5rem;
            font-weight: 300;
            letter-spacing: 0.1em;
        }

        .newsletter-form {
            display: flex;
            gap: 0;
            max-width: 400px;
            margin: 1.5rem auto 0;
            padding: 0 1rem;
        }

        .newsletter-form input {
            flex: 1;
            padding: 0.8rem 1rem;
            border: none;
            border-radius: 0;
            font-size: 0.85rem;
            background: rgba(255,255,255,0.15);
            color: white;
            font-family: 'Inter', sans-serif;
        }

        .newsletter-form input::placeholder {
            color: rgba(255,255,255,0.6);
        }

        .newsletter-form button {
            background: white;
            color: var(--rosa-oscuro);
            border: none;
            padding: 0.8rem 1.5rem;
            border-radius: 0;
            cursor: pointer;
            font-weight: 400;
            font-size: 0.7rem;
            transition: var(--transicion);
            text-transform: uppercase;
            letter-spacing: 0.1em;
        }

        .newsletter-form button:hover {
            background: var(--crema);
        }

        /* FAQ */
        .faq-section {
            padding: 2rem 0;
            max-width: 600px;
            margin: 0 auto;
        }

        .faq-section h3 {
            font-family: 'Cormorant Garamond', serif;
            text-align: center;
            margin-bottom: 2rem;
            font-size: 1.5rem;
            color: var(--texto);
            font-weight: 300;
            letter-spacing: 0.1em;
        }

        .faq-item {
            background: transparent;
            border-bottom: 1px solid var(--crema);
            margin-bottom: 0;
            overflow: hidden;
        }

        .faq-question {
            padding: 1rem 0;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: 400;
            font-size: 0.9rem;
            color: var(--texto);
            transition: var(--transicion);
        }

        .faq-question:hover {
            color: var(--rosa-oscuro);
        }

        .faq-answer {
            padding: 0;
            max-height: 0;
            overflow: hidden;
            transition: all 0.4s ease;
            font-size: 0.85rem;
            color: var(--texto-claro);
            line-height: 1.6;
            font-weight: 300;
        }

        .faq-item.active .faq-answer {
            padding: 0 0 1rem 0;
            max-height: 200px;
        }

        .faq-item.active .faq-question {
            color: var(--rosa-oscuro);
        }

        /* Chat */
        .chat-widget {
            position: fixed;
            bottom: 1.5rem;
            right: 1.5rem;
            z-index: 999;
        }

        .chat-button {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: var(--texto);
            color: white;
            border: none;
            font-size: 1.2rem;
            cursor: pointer;
            box-shadow: 0 4px 20px var(--sombra-suave);
            transition: var(--transicion);
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .chat-button:hover {
            transform: scale(1.1);
            background: var(--rosa-oscuro);
        }

        .chat-window {
            position: absolute;
            bottom: 60px;
            right: 0;
            width: 300px;
            height: 400px;
            background: var(--blanco);
            border-radius: 0;
            box-shadow: 0 10px 40px var(--sombra-suave);
            display: none;
            flex-direction: column;
            overflow: hidden;
            border: 1px solid var(--crema);
        }

        .chat-window.active {
            display: flex;
        }

        .chat-header {
            background: var(--crema);
            color: var(--texto);
            padding: 1rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.8rem;
            font-weight: 400;
            letter-spacing: 0.1em;
            text-transform: uppercase;
        }

        .chat-body {
            flex: 1;
            padding: 1rem;
            overflow-y: auto;
            background: var(--blanco);
        }

        .chat-input {
            padding: 0.8rem;
            border-top: 1px solid var(--crema);
            display: flex;
            gap: 0.5rem;
            background: var(--blanco);
        }

        .chat-input input {
            flex: 1;
            padding: 0.7rem;
            border: 1px solid var(--rosa-suave);
            border-radius: 0;
            font-size: 0.85rem;
            font-family: 'Inter', sans-serif;
        }

        .chat-input input:focus {
            outline: none;
            border-color: var(--rosa-oscuro);
        }

        .chat-input button {
            background: var(--texto);
            color: white;
            border: none;
            width: 36px;
            height: 36px;
            border-radius: 0;
            cursor: pointer;
            transition: var(--transicion);
        }

        .chat-input button:hover {
            background: var(--rosa-oscuro);
        }

        /* Navegación inferior */
        .bottom-nav {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: var(--blanco);
            border-top: 1px solid var(--crema);
            padding: 0.6rem 1rem;
            display: none;
            justify-content: space-around;
            z-index: 100;
        }

        .bottom-nav-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.2rem;
            color: var(--texto-claro);
            text-decoration: none;
            font-size: 0.65rem;
            transition: var(--transicion);
            font-weight: 400;
            letter-spacing: 0.05em;
        }

        .bottom-nav-item.active {
            color: var(--rosa-oscuro);
        }

        .bottom-nav-item i {
            font-size: 1.1rem;
        }

        @media (max-width: 768px) {
            .bottom-nav {
                display: flex;
            }
            body {
                padding-bottom: 60px;
            }
        }

        /* Notificaciones */
        .notification {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--texto);
            color: white;
            padding: 1rem 2rem;
            border-radius: 0;
            display: none;
            z-index: 1002;
            font-weight: 400;
            font-size: 0.8rem;
            box-shadow: 0 20px 60px rgba(0,0,0,0.2);
            text-align: center;
            min-width: 250px;
            letter-spacing: 0.1em;
            text-transform: uppercase;
        }

        /* Modal error */
        .error-modal {
            display: none;
            position: fixed;
            z-index: 3000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background: rgba(250, 249, 246, 0.95);
            justify-content: center;
            align-items: center;
            padding: 1rem;
        }

        .error-content {
            background: white;
            padding: 2rem;
            border-radius: 0;
            text-align: center;
            max-width: 300px;
            box-shadow: 0 20px 60px var(--sombra-suave);
            border: 1px solid var(--crema);
        }

        .error-content i {
            font-size: 2rem;
            color: var(--rosa-oscuro);
            margin-bottom: 1rem;
        }

        .error-content h3 {
            color: var(--texto);
            margin-bottom: 0.5rem;
            font-family: 'Cormorant Garamond', serif;
            font-weight: 400;
            font-size: 1.3rem;
        }

        .error-content button {
            margin-top: 1.5rem;
            padding: 0.8rem 2rem;
            background: var(--texto);
            color: white;
            border: none;
            border-radius: 0;
            cursor: pointer;
            font-weight: 400;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            font-size: 0.7rem;
            transition: var(--transicion);
        }

        .error-content button:hover {
            background: var(--rosa-oscuro);
        }

        /* Footer */
        footer {
            background: var(--texto);
            color: rgba(255,255,255,0.8);
            text-align: center;
            padding: 2rem;
            margin-top: 2rem;
            font-weight: 300;
            font-size: 0.8rem;
            letter-spacing: 0.05em;
        }

        footer a {
            color: var(--rosa-suave);
            text-decoration: none;
            margin: 0 0.8rem;
            font-weight: 400;
            transition: var(--transicion);
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.1em;
        }

        footer a:hover {
            color: white;
        }

        .offline-indicator {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: var(--texto);
            color: white;
            text-align: center;
            padding: 0.6rem;
            z-index: 10000;
            display: none;
            font-size: 0.75rem;
            font-weight: 400;
            letter-spacing: 0.1em;
            text-transform: uppercase;
        }

        .offline-indicator.show {
            display: block;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .product-card {
            animation: fadeIn 0.5s ease forwards;
        }
    </style>
</head>
<body>
    <div class="offline-indicator" id="offline-indicator">
        Sin conexión
    </div>

    <!-- MODAL DE STOCK INSUFICIENTE -->
    <div class="stock-modal-overlay" id="stock-modal-overlay" onclick="closeStockModal()">
        <div class="stock-modal-content" onclick="event.stopPropagation()">
            <i class="fas fa-exclamation-circle"></i>
            <h3>Stock insuficiente</h3>
            <p>No hay suficiente stock disponible</p>
            <button onclick="closeStockModal()">Entendido</button>
        </div>
    </div>

    <header>
        <div class="container">
            <h1 class="logo">KLO<span>HE</span></h1>
            <div class="cart-icon" onclick="toggleMiniCart()">
                <i class="fas fa-shopping-bag"></i>
                <span id="cart-count">0</span>
            </div>
        </div>
    </header>

    <section class="hero">
        <div class="container">
            <h2 id="hero-title">Colección San Valentín</h2>
            <p id="hero-subtitle">Piezas únicas para momentos inolvidables</p>
        </div>
    </section>

    <main class="container">
        <div class="filters-container">
            <div class="filters">
                <div class="search-container" id="search-container">
                    <i class="fas fa-search"></i>
                    <input type="text" id="search-input" placeholder="Buscar..." onkeyup="filterProducts()">
                </div>
                
                <select id="category-filter" onchange="filterProducts()">
                    <option value="all">Todas las categorías</option>
                    <option value="Carteras">Carteras</option>
                    <option value="Aritos">Aritos</option>
                    <option value="Collares">Collares</option>
                    <option value="Pulseras">Pulseras</option>
                    <option value="Relojes">Relojes</option>
                    <option value="Anillos">Anillos</option>
                    <option value="Lentes de sol">Lentes</option>
                    <option value="Accesorios para el cabello">Cabello</option>
                    <option value="Otros">Otros</option>
                </select>

                <label class="filter-checkbox">
                    <input type="checkbox" id="stock-filter" onchange="filterProducts()">
                    <span>Solo disponibles</span>
                </label>
            </div>
        </div>

        <div id="products-grid" class="products-grid"></div>
        
        <div class="load-more-container" id="load-more-container">
            <button class="load-more-btn" id="load-more-btn" onclick="loadMoreProducts()">
                Ver más productos
            </button>
            <div class="products-count" id="products-count"></div>
        </div>
    </main>

    <section class="reviews-section">
        <div class="container">
            <h3>Opiniones de clientes</h3>
            <div class="reviews-container" id="reviews-container"></div>
        </div>
    </section>

    <section class="social-feed">
        <div class="container">
            <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; color: var(--texto); font-weight: 300; letter-spacing: 0.1em;">
                @Klohesv
            </h3>
            <p style="color: var(--texto-claro); margin-top: 0.5rem; font-size: 0.85rem;">Síguenos en nuestras redes</p>
            <div class="social-grid" id="instagram-grid"></div>
            
            <div class="tiktok-section">
                <h3><i class="fab fa-tiktok"></i> TikTok</h3>
                <p style="font-size: 0.85rem; opacity: 0.8;">Descubre nuestros últimos diseños</p>
                <a href="https://www.tiktok.com/@klohesv" target="_blank" class="tiktok-link">
                    <i class="fab fa-tiktok"></i> @klohesv
                </a>
            </div>
        </div>
    </section>

    <section class="testimonials">
        <div class="container">
            <div class="testimonial-slider" id="testimonial-slider">
                <div class="testimonial-item active">
                    <div class="testimonial-text">"El detalle perfecto para San Valentín"</div>
                    <div class="testimonial-author">— Carlos M.</div>
                </div>
            </div>
        </div>
    </section>

    <section class="newsletter">
        <div class="container">
            <h3>Únete al Club Klohe</h3>
            <p style="font-size: 0.9rem; opacity: 0.9; font-weight: 300;">5% de descuento en tu primera compra</p>
            <form class="newsletter-form" onsubmit="subscribeNewsletter(event)">
                <input type="email" placeholder="Tu correo electrónico" required>
                <button type="submit">Suscribirse</button>
            </form>
        </div>
    </section>

    <section class="faq-section">
        <div class="container">
            <h3>Preguntas Frecuentes</h3>
            <div class="faq-item">
                <div class="faq-question" onclick="toggleFaq(this)">
                    ¿Cuánto tarda el envío?
                    <i class="fas fa-chevron-down" style="font-size: 0.8rem; transition: transform 0.3s;"></i>
                </div>
                <div class="faq-answer">
                    2-5 días hábiles. Envío gratis en compras mayores a $45.
                </div>
            </div>
            <div class="faq-item">
                <div class="faq-question" onclick="toggleFaq(this)">
                    ¿Hacen envíos a todo El Salvador?
                    <i class="fas fa-chevron-down" style="font-size: 0.8rem; transition: transform 0.3s;"></i>
                </div>
                <div class="faq-answer">
                    Sí, realizamos envíos a todo el territorio nacional.
                </div>
            </div>
        </div>
    </section>

    <footer>
        <p>&copy; 2025 Klohe — Hecho con amor en El Salvador</p>
        <p style="margin-top: 1rem;">
            <a href="https://wa.me/50366711569"><i class="fab fa-whatsapp"></i> WhatsApp</a>
            <a href="https://www.instagram.com/klohesv" target="_blank"><i class="fab fa-instagram"></i> Instagram</a>
            <a href="https://www.tiktok.com/@klohesv" target="_blank"><i class="fab fa-tiktok"></i> TikTok</a>
        </p>
    </footer>

    <div class="error-modal" id="error-modal" onclick="closeErrorModal(event)">
        <div class="error-content" onclick="event.stopPropagation()">
            <i class="fas fa-times-circle"></i>
            <h3>Código inválido</h3>
            <button onclick="closeErrorModal()">Aceptar</button>
        </div>
    </div>

    <div class="cart-overlay" id="cart-overlay" onclick="toggleMiniCart()"></div>
    
    <div class="mini-cart" id="mini-cart">
        <div class="mini-cart-header">
            <h3>Tu Carrito</h3>
            <button onclick="toggleMiniCart()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--texto);">&times;</button>
        </div>
        
        <div class="mini-cart-body" id="mini-cart-body"></div>

        <div class="mini-cart-footer">
            <div class="shipping-compact" id="shipping-option" onclick="document.getElementById('shipping-checkbox').click()">
                <input type="checkbox" id="shipping-checkbox" onchange="toggleShipping()" onclick="event.stopPropagation()">
                <div class="shipping-info">
                    <div class="shipping-text">
                        <i class="fas fa-truck" style="color: var(--rosa-oscuro);"></i> Envío a domicilio
                        <small>Gratis en compras +$25</small>
                    </div>
                    <div class="shipping-price">$3.75</div>
                </div>
            </div>

            <div class="discount-compact">
                <input type="text" id="discount-input" placeholder="Código de descuento">
                <button onclick="applyDiscount()">Aplicar</button>
            </div>

            <div class="cart-totals-compact">
                <div class="total-row">
                    <span>Subtotal</span>
                    <strong>$<span id="cart-subtotal">0.00</span></strong>
                </div>
                <div class="total-row" id="shipping-row" style="display: none;">
                    <span>Envío</span>
                    <strong>+$<span id="cart-shipping">0.00</span></strong>
                </div>
                <div class="total-row discount" id="discount-row" style="display: none;">
                    <span>Descuento</span>
                    <strong>-$<span id="cart-discount">0.00</span></strong>
                </div>
                <div class="total-row final">
                    <span>Total</span>
                    <span>$<span id="cart-total">0.00</span></span>
                </div>
            </div>
            
            <button class="checkout-btn" onclick="checkout()">
                <i class="fab fa-whatsapp"></i> Comprar por WhatsApp
            </button>
        </div>
    </div>

    <div id="image-modal" class="image-modal" onclick="closeImageModal()">
        <span class="image-modal-close">&times;</span>
        <img id="modal-image" class="image-modal-content" src="" alt="Producto">
    </div>

    <div id="quick-view-modal" class="quick-view-modal" onclick="closeQuickView(event)">
        <div class="quick-view-content" onclick="event.stopPropagation()">
            <button onclick="closeQuickView()" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--texto); z-index: 10;">&times;</button>
            <img id="quick-view-image" class="quick-view-image" src="" alt="">
            <div class="quick-view-info">
                <span id="quick-view-category" style="color: var(--texto-claro); text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.2em; font-weight: 400;"></span>
                <h2 id="quick-view-title"></h2>
                <div id="quick-view-material" class="quick-view-material"></div>
                <div id="quick-view-price" class="quick-view-price"></div>
                <p id="quick-view-description" style="color: var(--texto-claro); line-height: 1.8; font-size: 0.95rem; font-weight: 300;"></p>
                <button class="checkout-btn" onclick="addToCartFromQuickView()" style="margin-top: 1.5rem;">
                    Agregar al carrito
                </button>
            </div>
        </div>
    </div>

    <div id="notification" class="notification">
        Agregado al carrito
    </div>

    <div class="chat-widget">
        <div class="chat-window" id="chat-window">
            <div class="chat-header">
                <span><i class="fas fa-headset"></i> Klohe</span>
                <button onclick="toggleChat()" style="background: none; border: none; color: var(--texto); cursor: pointer; font-size: 1.2rem;">&times;</button>
            </div>
            <div class="chat-body" id="chat-body">
                <p style="background: var(--crema); padding: 0.8rem; margin-bottom: 0.8rem; font-size: 0.85rem; line-height: 1.5;">¡Hola! ¿En qué podemos ayudarte?</p>
            </div>
            <div class="chat-input">
                <input type="text" id="chat-message" placeholder="Escribe tu mensaje..." onkeypress="handleChatKey(event)">
                <button onclick="sendMessage()"><i class="fas fa-paper-plane"></i></button>
            </div>
        </div>
        <button class="chat-button" onclick="toggleChat()">
            <i class="fas fa-comment-dots"></i>
        </button>
    </div>

    <nav class="bottom-nav">
        <a href="#" class="bottom-nav-item active" onclick="resetFilters(); return false;">
            <i class="fas fa-home"></i>
            Inicio
        </a>
        <a href="#" class="bottom-nav-item" onclick="document.getElementById('search-input').focus(); return false;">
            <i class="fas fa-search"></i>
            Buscar
        </a>
        <a href="#" class="bottom-nav-item" onclick="toggleMiniCart(); return false;">
            <i class="fas fa-shopping-bag"></i>
            Carrito
        </a>
    </nav>

    <audio id="success-sound" preload="auto">
        <source src="https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3" type="audio/mpeg">
    </audio>

    <!-- Aquí enlazas el archivo de productos -->
    <script src="productos.js"></script>
</body>
</html>
