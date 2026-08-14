# Especificaciones UI/UX: Página de Detalle de Producto (PDP)

Este documento establece la arquitectura de información, los componentes interactivos, las reglas de negocio y los requisitos de SEO para la Página de Detalle de Producto (PDP) de Firplak E-commerce.

---

## 1. Arquitectura de Layout: Experiencia Scroll Animado (Scroll-Driven PDP)

La PDP adopta un formato inmersivo de **Scroll Animado (Multi-step Scroll)** donde la información, animaciones, datos técnicos y descargables se descubren progresivamente al desplazar la página, manteniendo siempre el foco en la conversión mediante una barra/botón flotante persistente:

```
+-----------------------------------------------------------------------+
|  [Header / Navigation Bar]                                            |
+-----------------------------------------------------------------------+
|                                                                       |
|  PASO 1: HERO IMPACTO VISUAL                                          |
|  - Imagen / Animación 3D principal del producto                      |
|  - Título, Rating, Precio base, Selección de variante rápida          |
|                                                                       |
|  PASO 2: DESPIECE Y CARACTERÍSTICAS TÉCNICAS (ANIMACIÓN AL SCROLL)    |
|  - Transiciones de componentes clave según avance del scroll           |
|  - Datos técnicos graficados (medidas, capacidad, resistencia)       |
|                                                                       |
|  PASO 3: CONFIGURACIÓN INTERACTIVA IN-SCROLL                          |
|  - Interactividad en vivo: Cambio de color, dimensiones, tipo de     |
|    montaje (ej. para Hidromasajes: Versiones Plus, Spa, Empotradas)   |
|                                                                       |
|  PASO 4: REQUERIMIENTOS, DESCARGABLES & MANUALES                     |
|  - Descarga directa de Fichas Técnicas PDF y Manuales de Instalación |
|                                                                       |
|  PASO 5: CROSS-SELLING, RESEÑAS & FAQS                               |
|                                                                       |
+-----------------------------------------------------------------------+
| [STICKY / FLOATING CTA BAR]                                           |
| Nombre Producto | Precio Dinámico | [Agregar al Carrito] [Comprar Ahora]|
+-----------------------------------------------------------------------+
```

---

## 2. Componentes Clave de la PDP

### A. Vista por Scroll Animado Multipaso (Scroll Animation)
- **Secuencia Narrativa Visual**: Conforme el usuario navega hacia abajo, el producto revela sus características en capas mediante animaciones activadas por scroll (Scroll-Driven Animations / GSAP ScrollTrigger o CSS Scroll-driven Animations).
- **Graficación de Datos Clave**: Indicadores visuales destacados (ej. Capacidad en Litros, Potencia de Motobomba, Resistencia Térmica RH, Grado de Garantía) integrados dinámicamente en la experiencia.

### B. Barra CTA Flotante Persistente (Floating Buy Bar)
- **Visibilidad Permanente**: Al desplazar la vista pasando la sección Hero, se activa una barra flotante (Sticky Bottom/Top Bar en mobile y desktop).
- **Acciones Directas**: Muestra el nombre de la variante seleccionada, el precio dinámico actualizado y dos botones principales:
  - 🛒 *Agregar al Carrito*
  - ⚡ *Comprar Ahora* (Checkout Directo)

### C. Selector e Interactividad Inline In-Scroll
- Permite cambiar atributos del producto sin perder la posición del scroll ni recargar la página:
  - **Variaciones Estéticas**: Colores y texturas (Mármol sintético, Quartzstone, Maderas RH).
  - **Dimensiones y Tipos de Montaje**: Cambio entre versiones empotrables, sobreponer o flotantes.
  - **Configuración de Hidromasajes**: Alternar en tiempo real entre versiones **Básica / Plus / Spa / Empotrada**, actualizando de forma fluida los renders, animaciones y el precio final.

### D. Galería Multimedia de Alta Resolución
- **Imágenes de Ambiente y Producto Aislado**: Fondos limpios y fotos contextuales en ambientes de baño/cocina reales.
- **Plano Técnico / Diagrama Dimensional**: Imagen obligatoria que muestre las medidas exactas (Ancho, Alto, Profundidad, Diámetros de desagüe).
- **Simulaciones 3D Animadas por Scroll**: Secuencias visuales y renders animados 3D impulsados por la navegación de la página (no se utilizan visores 3D de manipulación directa ni AR).

### E. Banners Informativos de Confianza (Trust Badges)
Ubicados en la zona Hero y dentro de la barra flotante:
- 🚚 **Promesa de Despacho**: "Despacho estimado en **15 días hábiles**".
- 📦 **Política de Entrega**: "Entrega estricta en **primer piso**".
- 🛡️ **Garantía Directa**: "Hasta **5 años** de garantía de fábrica".
- 💳 **Financiación ADDI / ePayco**: Cálculo de cuotas en tiempo real (ej. "Llévalo desde \$XX/mes con ADDI").

---

## 3. Pestañas Informativas y Ficha Técnica

La PDP debe incluir tabs estructurados para evitar la saturación visual:

1. **Descripción General**: Storytelling del producto, beneficios del material (resistencia a humedad RH, fácil limpieza, durabilidad).
2. **Especificaciones Técnicas (Tabla)**:
   - Material principal.
   - Peso bruto / neto.
   - Dimensiones exactas (cm).
   - Volumen de agua (litros, para tinas/jacuzzis).
   - Tipo de instalación (Empotrar, Sobreponer, Flotante).
3. **Documentos Descargables (PDF)**:
   - Botón directo a *Ficha Técnica PDF*.
   - Botón a *Manual de Instalación y Uso PDF*.
4. **Requerimientos de Pre-Instalación**: Guía visual rápida de acometidas requeridas.

---

## 4. Estrategia de Venta Cruzada (Cross-Selling / Up-Selling)

- **Accesorios Imprescindibles**: Si el usuario ve un lavamanos, la PDP debe sugerir el desagüe/sifón y la grifería compatible.
- **Arma tu Mueble / Mix & Match**: Botón alternativo "Ver en Visualizador Mix & Match" para combinar el producto con muebles o mesones.
- **Kits de Limpieza y Mantenimiento**: Productos recomendados para el cuidado del Mármol Sintético o Quartzstone.

---

## 5. Requisitos de SEO y Marcado de Datos Estructurados

Para asegurar la máxima visibilidad en buscadores y motores de búsqueda por IA (LLM/SearchGPT):

- **Schema.org Product & Offer**:
  - `name`, `image`, `description`, `sku`, `mpn`, `brand` ("Firplak").
  - `offers`: `price`, `priceCurrency` ("COP"), `availability` ("InStock" / "PreOrder"), `itemCondition`.
  - `aggregateRating`: Calificación promedio y conteo de opiniones.
- **SEO semántico**: H1 para título de producto, H2 para secciones de especificaciones y FAQs.
- **Meta-tags dinámicos**: Meta Title (`[Nombre Producto] | Firplak Colombia`) y Meta Description redactada optimizada para conversión.
- **URLs amigables**: `/categoria/subcategoria/nombre-producto-sku`.

---

## 6. Secciones Temáticas de Scroll Animado por Categoría

### A. Spas e Hidromasajes
1. **Hero de Impacto**: Simulación 3D animada al scroll del jacuzzi en ambiente de relajación con ambientación de luces.
2. **Hidrodinámica & Equipamiento**: Animación interactiva mostrando el flujo de agua/aire de los jets, bomba y cromoterapia.
3. **Selector de Versiones (Empotrada / Plus / Spa)**: Cambio in-scroll que anima la adición de faldones o mampostería.
4. **Pre-instalación & Acometidas**: Despiece técnico animado mostrando voltaje (110V/220V), trampa de olor y registro de 40x40 cm.
5. **Descargables & Garantías**: Botones PDF de planos, manuales y badges de 5 años casco / 1 año motobomba.

### B. Baños (Lavamanos, Muebles y Combos)
1. **Hero & Materialidad**: Producto aislado con swatches interactivos de color y acabados (Blanco Mate, Maderas RH).
2. **Tecnología de Materiales**: Animación demostrando resistencia al agua constante, humedad RH y fácil limpieza.
3. **Simulador de Montaje**: Cambio in-scroll entre montaje flotante, a piso, empotrado o sobreponer.
4. **Acotado Dimensional**: Visualización animada de medidas (ancho, profundidad) y posición del desagüe.
5. **Mix & Match & Descargables**: Botón para probar en configurador de lavamanos+mueble y descarga de ficha técnica PDF.

### C. Cocinas (Mesones, Lavaplatos y Combos)
1. **Hero Cocina Integral**: Mesón/lavaplatos integrado en ambiente de cocina real.
2. **Resistencia Térmica & Manchas**: Demostración visual de durabilidad contra rayones, calor y grasa (Quartzstone / Mármol Sintético).
3. **Configuración de Poceta & Orientación**: Alternancia in-scroll entre poceta izquierda o derecha y tipo de grifería.
4. **Esquema de Perforación e Instalación**: Medidas exactas bajo mesón y distancia de grifería.
5. **Descargables & Venta Cruzada**: Manuales de instalación y recomendación de campanas o accesorios.

### D. Zona de Labores / Ropas (Lavaderos)
1. **Hero Funcional**: Lavadero modular con mueble organizador.
2. **Ergonomía & Capacidad**: Animación del pozo de lavado, restregadero y distribución de almacenamiento en mueble RH.
3. **Resistencia Química**: Demostración de tolerancia a detergentes y blanqueadores.
4. **Esquema Hidrosanitario**: Diagrama animado de acople de desagüe y grifería.
5. **Descargables**: Ficha técnica y guía de ensamblaje.

### E. Zona Outdoor (Asadores y Módulos BBQ)
1. **Hero Terraza**: Asador modular en espacio exterior.
2. **Protección Intemperie**: Animación sobre resistencia a radiación UV, lluvia y altas temperaturas.
3. **Modularidad In-Scroll**: Configuración interactiva sumando módulos de almacenamiento o lavaplatos exterior.
4. **Seguridad & Gas**: Puntos de ventilación y conexiones de gas/carbón.
5. **Descargables**: Manual de uso y mantenimiento exterior.

### F. Institucional / Proyectos
1. **Hero Alto Tráfico**: Lavamanos colectivos u orinales en entornos comerciales/públicos.
2. **Superficie Antibacteriana & Uso Intensivo**: Resistencia al vandalismo y facilidad de sanitización.
3. **Planos BIM / CAD**: Descarga directa de archivos técnicos para arquitectos y constructores.
