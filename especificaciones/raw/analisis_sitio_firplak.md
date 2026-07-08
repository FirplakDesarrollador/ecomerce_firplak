# Análisis en Detalle de Firplak.com (Auditoría Tecnológica y Comercial)

**Fecha:** 2026-07-08  
**Origen:** Auditoría de cabeceras, recursos HTML y análisis comercial del sitio web oficial [firplak.com](https://www.firplak.com/)

---

## 1. Arquitectura y Stack Tecnológico del Sitio Actual

El sitio web actual de Firplak está estructurado sobre un sistema de gestión de contenidos tradicional y modular altamente optimizado para catálogo:

*   **Core CMS:** **WordPress** (Versión PHP activa en servidor, estructura en directorios `/wp-content/`).
*   **Motor E-commerce:** **WooCommerce** (Maneja el catálogo, carrito y checkout).
*   **Plantilla / Tema Base:** **Kadence Theme** (Tema de alto rendimiento enfocado en velocidad y optimización SEO).
*   **Constructor Visual (Page Builder):** **Kadence Blocks** (Extensión del editor Gutenberg de WordPress que evita la sobrecarga de código de builders pesados como Elementor o Divi).
*   **Plugin SEO:** **Rank Math WordPress SEO** (Manejo de esquemas JSON-LD, metadatos y sitemaps).
*   **Visualización y Carruseles:**
    *   **Splide CSS** (`kadence-kb-splide-css`): Utilizado para la renderización rápida y táctil de carruseles de imágenes de productos.
    *   **Owl Carousel** (Plugin `wt-woocommerce-related-products`): Usado en secciones de productos recomendados y relaciones cruzadas.
*   **Scripts de Tracking y Píxeles:**
    *   **PixelYourSite Free (v11.2.0.7):** Implementado para inyectar scripts de seguimiento de Facebook Pixel, Google Tag Manager y conversiones en WooCommerce.
    *   **Prefetching de DNS:** Enlaces directos a `ecommerce.bancodebogota.com.co` (integración/alianza con Banco de Bogotá) y recursos de `s3.amazonaws.com` para optimizar carga.

---

## 2. Motor de Pagos y Financiamiento

El checkout de Firplak procesa las transacciones a través de soluciones colombianas populares:

*   **Pasarela de Pago Principal (Gateway):** **ePayco**
    *   Soporte de pagos con Tarjetas de Crédito y Débito locales e internacionales: Visa, Mastercard, Diners Club, American Express.
    *   Botón de **PSE** (Pagos Seguros en Línea) para débito directo de cuentas corrientes/ahorros.
*   **Financiación a Plazos:** **ADDI**
    *   Plugin oficial de Addi integrado en la visualización de precios del producto y en el flujo del carrito de compras, lo cual permite al cliente comprar a cuotas con tasas de interés dinámicas según su perfil.

---

## 3. Árbol de Categorías de Producto

El catálogo comercial de Firplak está compuesto por 6 unidades de negocio principales:

1.  **Baños:**
    *   *Lavamanos:* Vanity (empotrados), Vessel (sobreponer) y mesones integrales.
    *   *Muebles de Baño:* Muebles elevados (flotantes), muebles a piso, botiquines, espejos y columnas organizadoras.
    *   *Griferías y Accesorios:* Griferías de pared, de mesa, desagües, sifones y toalleros.
    *   *Otros:* Sanitarios, duchas, cabinas, bañeras y combos preconfigurados de mueble + lavamanos.
2.  **Cocinas:**
    *   Mesones completos para cocina, lavaplatos independientes (submontar/sobreponer), campanas extractoras, cubiertas y combos de cocina.
3.  **Zona de Labores / Ropas:**
    *   Lavaderos en mármol sintético, muebles organizadores para lavaderos y combos de lavadero + mueble.
4.  **Spas e Hidromasajes (Bienestar):**
    *   Jacuzzis (hidromasajes para 1 o 2 personas, multipersonales), tinas empotrables o exentas (freestanding), saunas y consumibles de mantenimiento de agua.
5.  **Zona Outdoor:**
    *   Asadores empotrables y modulares para exteriores.
6.  **Institucional / Proyectos:**
    *   Lavamanos colectivos, orinales, tinas de aseo y soluciones especiales para constructoras (canal institucional).

---

## 4. Políticas de Negocio y Operación del E-commerce

*   **Tiempos de Entrega:** La promesa de entrega general es de **15 días hábiles** tras la confirmación de la orden de compra y el pago respectivo. Los productos que requieren fabricación a medida se rigen estrictamente por este tiempo de espera.
*   **Logística y Despacho:** Los productos se entregan únicamente en el **primer nivel (primer piso)** de la dirección del cliente. La transportadora no sube productos a pisos superiores.
*   **Garantías y Reportes:**
    *   **Daños Estéticos/Físicos (Faltantes, Rayones, Fisuras):** Plazo perentorio de máximo **3 días hábiles** tras recibir el producto para radicar el reporte. Transcurrido el cuarto día, no se asume responsabilidad por estos daños físicos.
    *   **Mármol Sintético y Fibra de Vidrio:** Garantía de **5 años** contra defectos de fabricación o fallas estructurales (por ejemplo, ampollas en la resina o fugas de agua).
    *   **Sistemas Eléctricos y Motores de Jacuzzis:** Garantía de **1 año**.
    *   **Muebles (Línea Essential, Life, Class):** Garantías variables según la línea de madera RH utilizada.
*   **Políticas de Retracto:** Sujetas al Estatuto del Consumidor de Colombia (Ley 1480 de 2011), otorgando 5 días hábiles tras recibir el producto para solicitar la devolución en perfectas condiciones y embalaje original.
