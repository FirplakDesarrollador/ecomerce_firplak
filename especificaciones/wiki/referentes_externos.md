# Referentes Externos de Diseño y UX

> [!IMPORTANT]
> **Estrategia Condensada del Segmento**:
> Banco de referentes externos (Awwwards y benchmarks de UX) curado para inspirar decisiones concretas de diseño en el catálogo Firplak — configuradores de producto, PDP narrativa, navegación por ambiente/colección y presentación de materiales. Cada entrada trae una nota al pie explicando **qué patrón específico es aplicable** al proyecto, no solo por qué el sitio es bonito.

## 🛁 Baños, cocinas y materiales

- [Palet — Bespoke Ceramic Tiles](https://palet.shop)[^1]
- [Material Kitchen](https://materialkitchen.com)[^2]
- [European Cabinets & Design Studios](https://www.europeancabinets.com)[^3]
- [Provider Store](https://www.providerstore.com.au)[^4]
- [Arteriors Home](https://www.arteriorshome.com)[^5]

## 📄 Página de producto (PDP) y storytelling

- [Insta360 — Luna Ultra](https://www.insta360.com/product/insta360-luna-ultra)[^6]

## 🍬 Ecommerce lúdico / experiencial

- [Bombon — Royal Swedish Candy](https://bombon.rs)[^7]

## 📚 Investigación UX (fuente académica, no comercial)

- [Nielsen Norman Group — Ecommerce Product Pages](https://www.nngroup.com/articles/ecommerce-product-pages/)[^8]

## 🎬 Dirección de arte y scroll-scrubbing

- [Pear](https://pear.no)[^9]

---

### Notas al pie

[^1]: Configurador de baldosas 3D en tiempo real bajo el flujo "crea tu propia muestra" vs. "recibe un set curado" — reduce la fatiga de decisión ofreciendo dos rutas según el perfil del usuario (profesional vs. hogar). El mínimo de pedido (1 m²) y el plazo de fabricación (desde 8 semanas) se muestran en el hero, no en el FAQ. Aplicable directo al configurador de [mix_and_match.md](mix_and_match.md): mostrar mínimo de pedido y plazo de fabricación desde el primer scroll, igual que ya se exige para hidromasajes en [hidromasajes.md](hidromasajes.md).

[^2]: Mega-menú jerárquico por tipo de producto (Prepware, Knives, Sets, Tools, Tabletop...) con swatch de color visible directamente en la miniatura de la grilla (ej. "Cool Neutral"), sin esperar al PDP. La garantía ("guaranteed for life") se comunica como propuesta de valor en el hero, no como letra chica. Aplicable a cocinas: exponer acabado/material como filtro visual en la grilla de [cocinas.md](cocinas.md), no solo como atributo de ficha técnica.

[^3]: Navegación por ambiente (Cocinas, Baños, Puertas, Closets) en lugar de por tipo de mueble — el visitante entra por "para qué cuarto" antes que por "qué producto". Galería de proyectos filtrable por tipo de espacio y CTA de videollamada de 30 min con diseñador como puerta de entrada de bajo compromiso al funnel institucional. Referencia directa para el showcase B2B de [carpinteria_obra.md](carpinteria_obra.md), que ya define un embudo consultivo similar sin precios públicos.

[^4]: Combina "Shop by Collection" y "Shop by Brand" para navegar 151 productos en 13+ categorías sin saturar. El umbral de envío gratis se repite desde el carrito vacío con mensaje de reaseguro, en vez de aparecer recién en el checkout. Aplicable a la política de envíos documentada en [recomendaciones_pagos_y_productos.md](recomendaciones_pagos_y_productos.md): repetir el umbral/condición de envío en más puntos del recorrido, no solo en el paso final.

[^5]: Cada producto muestra 4+ ángulos (foto general, detalle, swatch de color) junto con specs dimensionales inmediatas (ej. "Dia: 52 in H: 28.5 in") y el SKU, directamente en la tarjeta de producto — reduce devoluciones por expectativa equivocada de tamaño/acabado, exactamente el riesgo que documenta la nota [^8] de NN/g. Badges de "Ships Free" y devolución a 30 días también viven en la tarjeta, no solo en el PDP.

[^6]: PDP construida 100% como scrollytelling por bloques temáticos (imagen superior, retratos, color, versatilidad, casos de uso) en vez de una ficha técnica plana. Es la referencia más cercana al patrón de "fases narrativas" ya definido para hidromasajes en [pagina_producto.md](pagina_producto.md) — útil para calibrar ritmo, cuánto texto por bloque y cómo intercalar specs duras (zoom, sensor, peso) dentro del relato visual sin romper el scroll.

[^7]: Organiza el catálogo por "colecciones-mundo" temáticas (Sugar Rush, Sour Power, Cocoa Bliss, Licorizz) en lugar de categorías de producto, con tags escaneables de atributos (sin gluten, ácido, chocolate) debajo de cada nombre. Patrón trasladable a variantes técnicas de grifería/hidromasaje — mostrar atributos como "ahorro hídrico", "cartucho cerámico" o "apto exterior" como tags rápidos en la grilla de [griferia_plomeria.md](griferia_plomeria.md) y [zona_outdoor.md](zona_outdoor.md), no solo en la tabla de especificaciones.

[^8]: Fuente de investigación, no un sitio comercial. Con estudios de usuarios reales confirma que: (a) las fotos en contexto/detalle pesan más que la descripción textual al decidir una compra — un participante eligió un producto solo por las fotos del interior, sin leer texto; (b) la información de envío/garantía debe repetirse en el PDP, no solo en el checkout (compara el caso de Casper, que la muestra arriba, contra un competidor que la enterró); (c) la confirmación visual al añadir al carrito evita pedidos duplicados y carritos abandonados. Respalda con evidencia externa varias decisiones ya tomadas en [pagina_producto.md](pagina_producto.md) y [recomendaciones_pagos_y_productos.md](recomendaciones_pagos_y_productos.md).

[^9]: Sitio de la growth studio noruega Pear (Honorable Mention en Awwwards, nota jurado hasta 9.9/10): describe su propia estética como "un prospecto en letterpress" — tipografía ornamental "mal registrada" (efecto halftone desalineado a propósito) sobre pinturas neoclásicas, con una **pieza de video renacentista scroll-scrubbed** (el scroll controla el playback frame a frame, no autoplay). Es la validación externa más directa de la técnica que [sistema_diseno.md](sistema_diseno.md) ya define como motor oficial de scroll-scrubbing (GSAP + Canvas 2D + Lenis): confirma que el mismo patrón funciona igual de bien con video real que con secuencias de frames renderizadas, y que la tipografía puede cargar tanto peso narrativo como la imagen. Además, la home resuelve las objeciones de venta ("¿cuánto cuesta?", "¿por qué este modelo?") antes que las features — un orden de información trasladable al embudo consultivo de [carpinteria_obra.md](carpinteria_obra.md), que hoy abre con el proyecto y no con la objeción de precio/plazo.
