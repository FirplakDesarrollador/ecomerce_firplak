# Especificaciones UI/UX: Página de Detalle de Producto (PDP) y Scrollytelling

> [!IMPORTANT]
> **Estrategia Condensada del Segmento**:
> Convertir la PDP en un motor cinematográfico parametrizable por familia de producto (5 templates maestros) clasificado en 3 Tiers (Hero 3D, Core interactivo, Long Tail ágil). La narrativa de 8 pasos orquestada por GSAP y React Three Fiber guía al usuario desde la atmósfera inicial (clips Higgsfield) y el giro del modelo CAD real hasta la configuración física de color, instalación y ensamble Mix & Match, cerrando con una conversión comercial convencional impulsada por precios en tiempo real de SAP y pasarelas ePayco/ADDI. El SEO semántico vive estrictamente en el SSR, nunca dentro del canvas.

Este documento establece la arquitectura de información, la narrativa de scrollytelling en 8 fases, los componentes interactivos, las reglas de tiers y los requisitos de SEO para la PDP de Firplak E-commerce.

---

## 1. Arquitectura de Layout: Narrativa Scrollytelling en 8 Fases

La PDP de productos insignia (Tier 1) adopta una estructura de **8 fases progresivas sincronizadas al scroll** mediante GSAP ScrollTrigger y React Three Fiber, antes de desembocar en el flujo transaccional:

```
[ SCROLL PROGRESS ]
0%  ────► 15% : FASE 1 - CONTEXTO & ATMÓSFERA (Clip Higgsfield: producto integrado en ambiente real de lujo)
15% ────► 30% : FASE 2 - AISLAMIENTO DEL PRODUCTO (El entorno desaparece; foco absoluto en el diseño Firplak)
30% ────► 45% : FASE 3 - GIRO 3D CAD REAL (Three.js rota geometría exacta: 0° -> 45° -> 90° -> vista inferior)
45% ────► 60% : FASE 4 - DEMOSTRACIÓN FÍSICA (Callouts dinámicos: Mármol Sintético / Quartzstone, 5 años garantía)
60% ────► 70% : FASE 5 - COLOR SWAP INSTANTÁNEO (El modelo 3D estático transmuta entre acabados comerciales)
70% ────► 80% : FASE 6 - INGENIERÍA DE INSTALACIÓN (Demostración visual: Sobreponer vs. Submontar en el mesón)
80% ────► 90% : FASE 7 - MIX & MATCH INTERACTIVO (El lavamanos desciende sobre el mueble y entra el configurador)
90% ────► 100%: FASE 8 - COMERCIO & CHECKOUT (Resumen, precio real SAP B1, botón de compra, ePayco y ADDI)
+---------------------------------------------------------------------------------------------------------+
| [STICKY / FLOATING CTA BAR] (Activa desde fase 2)                                                       |
| Nombre Producto | Acabado Seleccionado | Precio Dinámico | [Agregar al Carrito] [Comprar Ahora con ADDI]|
+---------------------------------------------------------------------------------------------------------+
```

---

## 2. Componentes Clave de la PDP

### A. Vista por Scroll Animado Multipaso (Canvas Frame Scrubbing Engine)
- **Tecnología Oficial**: Implementada mediante **HTML5 `<canvas>` 2D**, **GSAP 3 + ScrollTrigger** y **Lenis Smooth Scroll**.
- **Mecánica de Scrollytelling**:
  - Al entrar al contenedor de animación, la sección se fija a la pantalla (`pin: true`).
  - El desplazamiento del usuario avanza progresivamente la secuencia fotográfica pre-renderizada en 3D (`scrub: 0.5`).
  - No se utiliza WebGL pesado en tiempo real; se dibuja una secuencia de fotogramas WebP optimizados (<40 KB c/u), asegurando **60 a 120 FPS sin lag de GPU** en cualquier dispositivo móvil o de escritorio.
- **Graficación Dinámica de Datos**: Overlays flotantes con información clave (Capacidad en Litros, Potencia de Bomba 2 HP, Voltaje 110V/220V, Grado de Garantía) que entran y salen en momentos exactos de la secuencia animada.

### A. Los Tres Niveles de Experiencia por Producto (Product Tiers)
No todos los SKUs justifican 3D o scrollytelling complejo. Se define una estrategia escalable en 3 niveles:
*   **Tier 1 — Hero Products (Lanzamientos e Insignias)**:
    - Productos de alto impacto (ej. colecciones insignia, lavamanos diferenciados tipo Koa, hidromasajes de lujo, cocinas modulares completas).
    - Incluyen **3D real en React Three Fiber (geometría CAD)** + **clips Higgsfield lifestyle** + **GSAP ScrollTrigger avanzado** + **Mix & Match interactivo**.
*   **Tier 2 — Core Products (Catálogo Principal)**:
    - Fotografías de estudio de alta resolución + GSAP suave + parallax + switch de acabados/colores + Mix & Match (sin Three.js).
*   **Tier 3 — Long Tail (Accesorios y Piezas Simples)**:
    - PDP convencional ultra-optimizada + microanimaciones CSS + galería fotográfica + ficha técnica + carrito rápido.

### B. Los 5 Templates Maestros de Storytelling
Para evitar programar 300 páginas individuales, el sistema opera con 5 plantillas parametrizadas en Supabase (`PRODUCT_STORY`):
1. **`StoryLavamanos`**: Foco en pureza geométrica, asepsia de mármol sintético, orificios de grifería, instalación sobreponer/submontar y ensamble con mueble.
2. **`StoryMuebleBaño`**: Foco en tableros melamínicos RH, cierre suave de herrajes, capacidad de almacenamiento y compatibilidad de lavamanos.
3. **`StoryCocina`**: Foco en ergonomía del triángulo de trabajo, resistencia térmica de mesón Quartzstone y orientación de poceta (L/R).
4. **`StoryHidromasaje`**: Foco en hidroterapia, potencia de motobomba (2 HP), acometida eléctrica GFCI y selector in-scroll de versiones (Plus/Spa).
5. **`StoryOutdoor`**: Foco en resistencia a intemperie, acero 304, cálculo de carga en terrazas (kg/m²) y aislamiento térmico.

### C. Reglas de Adaptación Responsive (Desktop vs. Mobile)
*   **En Desktop**:
    - Se habilita WebGL completo (React Three Fiber) con escenas ancladas (`pin: true`), control milimétrico de cámara 3D (`camera.position`, `camera.target`) y scrubbing continuo.
*   **En Mobile**:
    - Por consumo de batería y memoria, Three.js se carga de forma diferida (`next/dynamic` con `ssr: false`).
    - Las transiciones complejas se sustituyen por clips de video ultracortos (3 a 6s) o secuencias de imágenes WebP ligeras con anclajes mínimos para garantizar fluidez táctil natural.

### D. Regla de Oro: Separación Estricta entre SEO y Experiencia Visual
*   **El SEO NUNCA vive dentro del Canvas/WebGL**:
    - Los motores de búsqueda (Googlebot, SearchGPT, Perplexity) deben recibir el contenido semántico completo desde el servidor mediante SSR/ISR en Next.js (`<h1>`, `<h2>`, tablas de especificaciones, Schema.org JSON-LD).
    - La capa de experiencia (Three.js / GSAP) se monta **encima del HTML semántico** en el cliente sin ocultar ni reemplazar el texto base.
*   **Presupuesto de Rendimiento (Performance First)**:
    - El primer viewport siempre se renderiza con HTML + imagen estática optimizada (`next/image`), logrando un LCP < 1.5s.
    - Los módulos pesados de Three.js y GSAP solo se inicializan cuando el usuario comienza el desplazamiento hacia la sección interactiva.

### E. Barra CTA Flotante Persistente (Floating Buy Bar)
- **Visibilidad Permanente**: Se activa suavemente al avanzar más allá del Hero.
- **Acciones Directas**: Muestra la variante activa, precio dinámico sincronizado con SAP B1 y botones directos:
  - 🛒 *Agregar al Carrito*
  - ⚡ *Comprar Ahora con ADDI* (cálculo de cuotas en vivo)

### F. Banners Informativos de Confianza (Trust Badges)
Ubicados tanto en la cabecera como en la barra flotante:
- 🚚 **Promesa de Despacho**: "Despacho estimado en **15 días hábiles**".
- 📦 **Política de Entrega**: "Entrega estricta en **primer piso**".
- 🛡️ **Garantía Directa**: "Hasta **5 años** de garantía de fábrica".
- 💳 **Financiación ADDI / ePayco**: Integración transparente de crédito inmediato.

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

- **Accesorios Imprescindibles**: Si el usuario ve un lavamanos o tina, la PDP debe sugerir el desagüe/sifón y la grifería compatible (especificados en [accesorios.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/accesorios.md) y [griferia_plomeria.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/griferia_plomeria.md)).
- **Arma tu Mueble / Mix & Match**: Botón alternativo "Ver en Visualizador Mix & Match" para combinar el producto con muebles o mesones (ver [mix_and_match.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/mix_and_match.md)).
- **Servicios Técnicos e Instalación**: Checkbox interactivo para añadir el paquete de instalación oficial (ver [servicios.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/servicios.md)).
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
