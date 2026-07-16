# Conceptos del Catálogo: Productos, Materiales y Variaciones

Este documento define la taxonomía de productos, materiales, variables de configuración comerciales e implicaciones operativas de Firplak.

---

## 1. Clasificación y Árbol de Categorías

El catálogo comercial del e-commerce debe replicar y optimizar las siguientes categorías y subcategorías:

### 1. Baños
*   **Lavamanos:** Vanity (empotrar), Vessel (sobreponer) y mesones integrales.
*   **Muebles de Baño:** Muebles elevados (flotantes), muebles a piso, botiquines y espejos.
*   **Griferías y Accesorios:** Griferías de pared, de mesa, desagües y sifones.
*   **Otros:** Sanitarios, duchas, cabinas, bañeras y combos preconfigurados de mueble + lavamanos.

### 2. Cocinas
*   Mesones completos, lavaplatos independientes, campanas, cubiertas y combos de cocina.

### 3. Zona de Labores (Ropas)
*   Lavaderos en mármol sintético, muebles organizadores y combos de lavadero + mueble.

### 4. Spas e Hidromasajes (Bienestar)
*   Jacuzzis (tinas, spas para 1 o 2 personas, multipersonales), tinas empotrables o exentas (freestanding) y saunas.

### 5. Zona Outdoor
*   Asadores empotrables y modulares para exteriores.

### 6. Institucional / Proyectos
*   Lavamanos colectivos, orinales, tinas de aseo y soluciones especiales para constructoras.

---

## 2. Compatibilidades e Implicaciones Técnicas del Visualizador

La elección de materiales influye en los atributos visuales (colores y texturas) definidos en la base de datos de Supabase:

*   **Mármol Sintético:** Utilizado en lavamanos, mesones, tinas y lavaderos. Tiene acabados brillantes o mate, y colores sólidos (Blanco, Hueso, etc.).
*   **Quartzstone:** Superficies de alta especificación para mesones. Presenta variaciones granuladas y colores premium.
*   **Madera Aglomerada RH (Resistente a la Humedad):** Usada en la estructura de los muebles. Sus variaciones de color/textura corresponden a las gamas melamínicas del catálogo (ej. maderas claras, oscuras, colores sólidos mate como grafito o blanco).

---

## 3. Lógica Comercial: Combos vs. Mix & Match

El e-commerce admite dos modalidades de venta para estas categorías:

1.  **Venta en Combo (Preconfigurada):** Una única referencia (SKU Combo) vincula internamente el lavamanos y el mueble. Facilita la carga y facturación directa en SAP.
2.  **Venta Mix & Match (Configurable):** El usuario arma su conjunto. El carrito de compra recibe múltiples SKUs individuales (SKU Lavamanos + SKU Mueble). El frontend debe validar la compatibilidad en tiempo real mediante la tabla de compatibilidades en Supabase.

---

## 4. Políticas de Negocio con Impacto en UX/UI

Estas directrices deben estar integradas en el flujo de checkout, carrito de compras y fichas de producto:

### A. Promesa y Tiempos de Entrega
*   **Tiempo de despacho:** El sistema debe notificar al cliente una promesa estándar de **15 días hábiles** de entrega a partir de la confirmación del pago.
*   **Restricción de Alturas:** En el checkout y en las políticas de envío, debe advertirse al cliente: *"La entrega se realiza estrictamente en el primer nivel (primer piso) del domicilio. La transportadora no sube productos a pisos superiores"*.

### B. Gestión de Garantías y Averías Físicas
*   **Alerta de Inspección Inmediata (3 Días):** El frontend debe mostrar un banner o correo post-venta informando que el cliente tiene un plazo máximo de **3 días hábiles** tras la entrega para reportar daños físicos (piezas rotas, fisuras, rayones). A partir del 4to día, Firplak no asume responsabilidad por daños estéticos.
*   **Duraciones de Garantía (Fichas de Producto):**
    *   Mármol Sintético y Fibra de Vidrio (Bañeras/Hidromasajes): **5 años** de garantía estructural.
    *   Sistemas eléctricos y motores de hidromasajes: **1 año**.
    *   Muebles de Madera RH: **1 a 5 años** (según línea de producto).

