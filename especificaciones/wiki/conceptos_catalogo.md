# Conceptos del Catálogo: Productos, Materiales y Variaciones

> [!IMPORTANT]
> **Estrategia Condensada del Segmento**:
> Unificar las reglas maestras de taxonomía comercial, materialidad y políticas logísticas para toda la plataforma. Define la convivencia entre ventas en Combo vs. Mix & Match, los materiales insignia (Mármol sintético, Quartzstone y RH) y establece las directrices inquebrantables de cara al cliente: promesa estándar de 15 días hábiles, entrega obligatoria en primer piso y ventana de 3 días para reporte de averías.

Este documento define la taxonomía de productos, materiales, variables de configuración comerciales e implicaciones operativas de Firplak.

---

## 1. Clasificación y Árbol de Categorías

El catálogo comercial del e-commerce replica la taxonomía viva de Firplak optimizada para navegación multinivel:

### 1. Spas e Hidromasajes (Bienestar) — Ver [hidromasajes.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/hidromasajes.md)
*   **1 Persona y 2 Personas:** Modelos compactos y dobles con hidromasaje.
*   **Freestanding (Exentas):** Bañeras independientes de diseño arquitectónico.
*   **Multipersonales:** Spas de gran formato para terrazas o exteriores.
*   **Tinas y Accesorios:** Tinas sin hidromasaje, almohadillas, mantenedores térmicos y desagües.
*   *Filtro especial:* **Envío Rápido Hidromasajes**.

### 2. Baños — Ver [mix_and_match.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/mix_and_match.md)
*   **Combos Lavamanos con Mueble:** Packs preconfigurados de alta rotación.
*   **Lavamanos:** Vanity (empotrar), Vessel (sobreponer) y mesones integrales.
*   **Muebles:** Muebles bajo lavamanos (elevados o a piso) y muebles complementarios.
*   **Colecciones de Diseño:** Línea Godai y espejos con iluminación o marco.
*   **Grifería y Plomería:** Griferías de lavamanos, desagües tipo push y sifones.
*   *Filtros especiales:* **Envío Rápido Baños** y **Saldos / Oportunidades**.

### 3. Zona de Labores (Ropas) — Ver [zona_labores.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/zona_labores.md)
*   **Combos Lavaderos:** Lavadero en mármol sintético + mueble organizador RH.
*   **Tipologías de Lavaderos:** Líneas Pro, Aqua y Eco.
*   **Mobiliario y Plomería:** Muebles para lavadora, alacenas de aseo y llaves de pared.
*   *Filtros especiales:* **Envío Rápido** y **Saldos**.

### 4. Cocinas — Ver [cocinas.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/cocinas.md)
*   **Cocinas Integrales:** Soluciones completas superiores e inferiores.
*   **Módulos Independientes:** Muebles solos inferiores y superiores, barras auxiliares.
*   **Superficies y Lavaplatos:** Mesones en Quartzstone o mármol sintético y pocetas/lavaplatos de sobreponer/submontar.
*   **Grifería / Plomería:** Mezcladores cuello de ganso y accesorios.
*   *Filtros especiales:* **Envío Rápido** y **Saldos**.

### 5. Accesorios — Ver [accesorios.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/accesorios.md) y [griferia_plomeria.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/griferia_plomeria.md)
*   Accesorios para tinas, organizadores de baño, plomería técnica y complementos de cocina.

### 6. Zona Outdoor — Ver [zona_outdoor.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/zona_outdoor.md)
*   Asadores de empotrar y modulares, Multipersonales Spa exteriores, Saunas secos/húmedos, mantenedores de agua y cubiertas protectoras.

### 7. Segmentos Institucionales y B2B — Ver [carpinteria_obra.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/carpinteria_obra.md)
*   **Carpintería de Obra:** Muebles a medida para proyectos inmobiliarios.
*   **Atención Constructor / Distribuidor:** Canal con condiciones mayoristas y acompañamiento técnico.

---

## 1.1. Flags y Filtros Transversales Comerciales
*   ⚡ **Envío Rápido (`is_fast_shipping`):** Productos con stock físico disponible para despacho inmediato (<48h), contrarrestando la fricción del tiempo estándar de fabricación (15 días hábiles).
*   🏷️ **Saldos / Outlet (`is_clearance`):** Descuentos agresivos (hasta 65%) para liquidar últimas unidades o colecciones salientes.
*   🔥 **Oferta Especial (`is_on_sale`):** Productos con descuento activo y cálculo visible del ahorro en $ COP.

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
*   **Tiempo de despacho:** El sistema debe notificar al cliente una promesa estándar de **15 días hábiles** de entrega a partir de la confirmación del pago (excepción: spas multipersonales de exterior con prueba hidrostática en 15 a 20 días hábiles).
*   **Restricción de Alturas:** En el checkout y en las políticas de envío, debe advertirse al cliente: *"La entrega se realiza estrictamente en el primer nivel (primer piso) del domicilio. La transportadora no sube productos a pisos superiores"*.

### B. Gestión de Garantías y Averías Físicas
*   **Alerta de Inspección Inmediata (3 Días):** El frontend debe mostrar un banner o correo post-venta informando que el cliente tiene un plazo máximo de **3 días hábiles** tras la entrega para reportar daños físicos (piezas rotas, fisuras, rayones). A partir del 4to día, Firplak no asume responsabilidad por daños estéticos (amparado bajo los 5 días de retracto de la Ley 1480).
*   **Duraciones de Garantía (Fichas de Producto):**
    *   **Mármol Sintético, Quartzstone y Fibra de Vidrio (Bañeras/Hidromasajes/Mesones):** **5 años** de garantía estructural.
    *   **Muebles de Madera RH:** **1 a 3 años** (líneas estándar) hasta **5 años** (líneas premium).
    *   **Griferías:** **5 años** en cuerpo y mecanismo cerámico; **1 año** en acabados superficiales y plomería plástica.
    *   **Sistemas eléctricos, motobombas y sopladores (blowers):** **1 año**.
    *   **Asadores en Acero AISI 304:** **3 años** en estructura y quemadores.

