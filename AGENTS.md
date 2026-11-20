# DAYMARSV · Tienda en línea · Guía para agentes

Esta es la **tienda en línea pública** de DAYMARSV (joyería, bisutería y accesorios, El Salvador).
Usa los mismos datos (Supabase) que el sistema interno.

**Antes de cambiar algo, lee la guía completa del sistema:**
`industriastobias/daymarsv.com.sv.sistemas` → archivo `AGENTS.md`
(reglas del dueño, forma de trabajar, diseño, pendientes).

Resumen rápido:
- Responde al dueño en **español**, corto y claro.
- Páginas estáticas + JS sin framework (`index.html`, `tienda.js`, `sistema.js`, `estilos.css`…), publicadas con GitHub Pages.
- `sistema.js` muestra el seguimiento de pedidos («Mi pedido») con los estados del sistema: incluye «Por pagar» (pago pendiente) y «Entregado · pago pendiente».
- Después de cambiar JS o CSS, sube el número de versión (`?v=`) en los HTML y avisa al dueño que cierre y abra la página.
- Prueba en celular (390 px) y computadora antes de subir. No inventes productos, reseñas ni datos.
