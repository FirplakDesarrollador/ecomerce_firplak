# Síntesis Maestra de Diseño: Elementos, Lineamientos y Condiciones UI/UX

> [!IMPORTANT]
> **Estrategia Condensada**:
> Este documento compila y consolida la totalidad de elementos visuales, tokens de diseño, lineamientos de experiencia cinematográfica, directrices de interacción (Mix & Match / Scrollytelling), requerimientos técnicos de pre-instalación y condiciones comerciales inquebrantables documentadas en el [Wiki de Especificaciones](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/index.md) de Firplak E-commerce.

---

## 1. Filosofía Visual e Intención de Diseño

La presencia digital de Firplak se fundamenta en tres pilares conceptuales:

1. **Elegancia Arquitectónica y Bienestar (Estilo Apple / Kohler / Laufen)**:
   - Estética limpia, proporciones amplias y visuales de alta gama que posicionan a Firplak como una marca de lujo accesible.
   - Narrativa de materialidad noble centrada en agua, piedra (Mármol Sintético, Quartzstone) y maderas resistentes a la humedad (Aglomerado RH).
2. **Equilibrio entre Inspiración y Conversión Comercial**:
   - Armonía entre scrollytelling inmersivo en lanzamientos e insignias (Tier 1) y conversión comercial directa mediante ofertas flash, ahorro explícito en COP, atajos de *Envío Rápido* (<48h) y compra asistida por crédito ADDI.
3. **Claridad y Rigor Técnico**:
   - Presentación destacada de métricas críticas (litros de capacidad, potencia de bomba en HP, voltajes 110V/220V, dimensiones milimétricas, años de garantía) para eliminar fricciones pre y post-venta.

---

## 2. Sistema de Diseño, Tokens y Estilo Gráfico

*Detalle extendido en [sistema_diseno.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/sistema_diseno.md).*

### A. Paleta de Colores y Tokens Globales

```css
:root {
  /* Marca Principal */
  --color-primary-50:  #eef7ff;
  --color-primary-100: #d8edff;
  --color-primary-500: #0077c8; /* Azul Oficial Firplak */
  --color-primary-700: #004b87;
  --color-primary-900: #00264d;

  /* Bienestar, Agua & Cromoterapia */
  --color-hydro-cyan:   #00d2d3;
  --color-hydro-teal:   #01a3a4;
  --color-hydro-purple: #5f27cd; /* Acento cromoterapia LED */

  /* Materiales Nobles */
  --color-stone-marble:  #f8f9fa; /* Mármol Sintético */
  --color-stone-quartz:  #e9ecef; /* Quartzstone */
  --color-wood-rh:        #4a3728; /* Madera Nogal / Humedad RH */
  --color-wood-light:     #d4a373; /* Roble Claro */

  /* Neutrales y Superficies */
  --color-surface-bg:    #ffffff;
  --color-surface-card:  #f4f6f8;
  --color-text-main:     #0f172a;
  --color-text-muted:    #64748b;
  --color-border-subtle: #e2e8f0;

  /* Sombras y Elevación */
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.04);
  --shadow-md: 0 8px 16px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 16px 32px rgba(0, 0, 0, 0.12);
  --shadow-floating-cta: 0 12px 28px rgba(0, 119, 200, 0.25);
}
```

### B. Tipografía Oficial y Jerarquía

- **[Outfit](https://fonts.google.com/specimen/Outfit)**: Titulares, H1, H2, Hero banners, precios dinámicos y métricas de impacto (litros, garantía, potencia).
- **[Inter](https://fonts.google.com/specimen/Inter)**: Cuerpo de texto, párrafos descriptivos, tablas de especificaciones técnicas, badges y etiquetas de interfaz.

| Nivel | Tipografía | Peso | Aplicación UI |
| :--- | :--- | :--- | :--- |
| **H1** | `Outfit` | 700 / Bold | Nombres de producto en PDP, titulares del Hero |
| **H2 / H3** | `Outfit` | 600 / Semi-Bold | Títulos de secciones, pasos del scroll y tarjetas de categoría |
| **Metrics** | `Outfit` | 700 / Bold | Litros, caballos de fuerza (HP), medidas y años de garantía |
| **Body** | `Inter` | 400 / Regular | Textos descriptivos, especificaciones y advertencias |
| **Badges / CTAs** | `Inter` | 600 / Semi-Bold | Trust badges, botones de compra y chips de stock |

### C. Efectos Visuales y Glassmorphism

- **Degradado Hydro Glow**: `linear-gradient(135deg, #0077c8 0%, #00d2d3 100%)` para spas, bienestar y llamadas a la acción primarias.
- **Degradado Stone Luxury**: `linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%)` para fondos neutros de producto.
- **Glassmorphism en Paneles Flotantes**:
  ```css
  .glass-panel {
    background: rgba(255, 255, 255, 0.75);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: var(--shadow-lg);
  }
  ```
- **Curvas de Transición (Easings)**:
  - Transiciones de modales y scroll: `cubic-bezier(0.16, 1, 0.3, 1)`.
  - Micro-interacción en botones: `cubic-bezier(0.34, 1.56, 0.64, 1)`.

---

## 3. Arquitectura y Experiencia UI por Módulo

### A. Página de Inicio (Home Page)
*Detalle extendido en [pagina_inicio.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/pagina_inicio.md).*

Secuencia de 10 bloques estratégicos diseñada para guiar al usuario de la inspiración a la transacción:

1. **Announcement Bar**: Ticker rotativo con envíos rápidos (<48h), subsidios de flete y crédito ADDI en cuotas.
2. **Top Bar Corporativo**: Venta telefónica/WhatsApp, Servicio al Cliente, selector B2B (*Carpintería de Obra*) y acceso al portal USA.
3. **Navbar con Megamenú Dinámico**: Prefetching instantáneo en Next.js segmentado en 6 macro-categorías (Hidromasajes, Baños, Zona de Ropas, Cocinas, Accesorios, Zona Outdoor) con tags destacados de *Envío Rápido* y *Saldos*.
4. **Hero Cinematográfico**: Secuencia de 4 micro-escenas de 3 a 6 segundos (Baño minimalista -> Producto protagonista -> Cocina en Quartzstone -> Terraza con spa al atardecer) generadas con **Higgsfield REAL** a partir de modelos CAD reales. Fallback inmediato en WebP estático para LCP < 1.2s.
5. **Grid Circular de Categorías**: Acceso visual rápido e intuitivo a los entornos principales.
6. **Módulo Flash Sales / Liquidación**: Descuentos del 10% al 65% con ahorro explícito en COP (`Ahorras: $ XXX.XXX`), precio tachado y Quick Add to Cart.
7. **Banners Editoriales de Lanzamientos**: Destacados de innovación y diseño.
8. **Hub de Catálogos Descargables (PDF)**: Captura de prospectos/leads para B2C y B2B.
9. **Módulo Omnicanal de Showrooms**: Sedes físicas en Bogotá (Cra 19), Medellín (IDEO e Itagüí Fábrica) y Cali (IDEO) con enlace directo a Google Maps y llamada.
10. **Footer Regulatorio Oficial**: Cumplimiento de la SIC, política de entrega en primer piso, garantías de 5 años y enlace a Habeas Data (Ley 1581).

---

### B. Página de Detalle de Producto (PDP) y Scrollytelling en 8 Fases
*Detalle extendido en [pagina_producto.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/pagina_producto.md).*

#### 1. Narrativa Scrollytelling en 8 Fases (Tier 1 Hero Products)
```
[ PROGRESO DE SCROLL ]
0%  ────► 15% : FASE 1 - Contexto & Atmósfera (Video corto Higgsfield: producto en entorno real)
15% ────► 30% : FASE 2 - Aislamiento de Producto (Desvanecimiento del entorno; foco en la pieza)
30% ────► 45% : FASE 3 - Giro 3D CAD Real (Rotación en Three.js / Canvas: 0° -> 45° -> 90° -> vista inferior)
45% ────► 60% : FASE 4 - Demostración Física (Callouts de Mármol Sintético / Quartzstone / 5 años garantía)
60% ────► 70% : FASE 5 - Color Swap Instantáneo (Transmutación de acabados y texturas comerciales)
70% ────► 80% : FASE 6 - Ingeniería de Instalación (Sobreponer vs. Submontar / Desagües y acometidas)
80% ────► 90% : FASE 7 - Mix & Match Interactivo (Descenso del lavamanos sobre el mueble configurado)
90% ────► 100%: FASE 8 - Conversión & Checkout (Resumen, precio SAP B1, botón de compra, ePayco y ADDI)
```

#### 2. Segmentación de Productos por Tiers
* **Tier 1 (Hero Products)**: Lanzamientos e insignias. 3D WebGL real (React Three Fiber) + clips Higgsfield + GSAP ScrollTrigger + Mix & Match interactivo.
* **Tier 2 (Core Products)**: Catálogo estándar de alta demanda. Renders y fotografías HD de estudio + GSAP suave + selector de acabados + Mix & Match (sin Three.js).
* **Tier 3 (Long Tail)**: Accesorios y piezas simples. PDP convencional optimizada + ficha técnica detallada + compra rápida.

#### 3. Los 5 Templates Maestros de Storytelling
1. **`StoryLavamanos`**: Pureza geométrica, asepsia del mármol sintético, perforaciones para grifería e integración con mueble.
2. **`StoryMuebleBaño`**: Tableros melamínicos RH antihumedad, herrajes de cierre suave y capacidad de almacenaje.
3. **`StoryCocina`**: Ergonomía del triángulo de trabajo, resistencia térmica del Quartzstone y orientación de poceta (izq/der).
4. **`StoryHidromasaje`**: Circuitos de hidromasaje, potencia de motobomba 2 HP, acometidas eléctricas GFCI y selector in-scroll de versiones (Plus/Spa).
5. **`StoryOutdoor`**: Acero inoxidable 304, intemperie UV, peso estructural en terraza (kg/m²) y mantenedores térmicos.

#### 4. Barra Flotante de Compra (Floating Buy Bar)
- Elemento fijo/flotante con *Glassmorphism* que emerge tras superar el Hero.
- Muestra variante activa, precio dinámico sincronizado y CTAs: `[Añadir al Carrito]` y `[Comprar en cuotas con ADDI]`.
- En dispositivos móviles se adapta como *Sticky Bottom Bar*.

---

### C. Módulo Visualizador Mix & Match
*Detalle extendido en [mix_and_match.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/mix_and_match.md).*

1. **Estructura de Doble Nivel Sincronizado**:
   - Fila superior para lavamanos con navegación por deslizamiento horizontal.
   - Fila inferior para muebles bajo lavamanos con desplazamiento independiente.
2. **Superposición Exacta por CSS Overlay**:
   - Assets en formato WebP con fondo transparente, recortados con proporciones idénticas y cajas delimitadoras alineadas para simular la instalación física real del lavamanos sobre el mueble.
3. **Validación de Compatibilidad en Base de Datos**:
   - Supabase valida en vivo la compatibilidad dimensional, posición del desagüe y orificios de grifería entre la pieza superior y la inferior.
4. **Venta Cruzada de Complementos (Add-ons)**:
   - Configuración in-situ de grifería compatible (alta/baja), desagües tipo push, sifones botella y espejos con iluminación.
5. **Inyección Multireferencia al Carrito**:
   - Agrega simultáneamente los SKUs independientes vinculados bajo el mismo bundle con precio consolidado y eventual descuento por paquete.

---

## 4. Stack Tecnológico de Experiencia e Interacción

Para garantizar fluidez ultra-premium (60 a 120 FPS) sin penalizar los Core Web Vitals:

- **Next.js 15 (App Router)**: Renderizado híbrido con SSR semántico para robots de búsqueda y Client Components para interactividad.
- **GSAP 3 + ScrollTrigger**: Control de anclaje de pantalla (`pin: true`) y sincronización temporal con el desplazamiento (`scrub: 0.5`).
- **Lenis Smooth Scroll (`@studio-freight/lenis`)**: Desplazamiento inercial suave unificado entre trackpads, ratón y pantallas táctiles.
- **React Three Fiber + Drei (Tier 1)**: Visualización WebGL de modelos CAD industriales en formato GLB comprimidos con Draco/Meshopt y texturas KTX2 (<2.5 MB).
- **Canvas Frame Scrubbing Engine (Alternativa 2D Ligera)**: 60-120 fotogramas WebP pre-renderizados (<40 KB c/u) que se dibujan en un `<canvas>` HTML5 2D, eliminando sobrecargas en GPUs móviles.
- **Higgsfield REAL**: Generador de video ambiental para atmósferas y lifestyle.

> [!CAUTION]
> **La Regla de Oro de Higgsfield**:
> - **Higgsfield SÍ define**: El entorno, iluminación cenital, caídas de agua, vapor, estética arquitectónica y lifestyle.
> - **Higgsfield NUNCA define**: La geometría del producto, ubicación de orificios, medidas, acabados comerciales exactos ni componentes mecánicos. Para el producto se utiliza estrictamente el modelo CAD industrial o fotografía de estudio de Firplak.

---

## 5. Condiciones Técnicas y Requisitos de Pre-Instalación por Categoría

*Detalle extendido en [hidromasajes.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/hidromasajes.md), [cocinas.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/cocinas.md), [zona_labores.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/zona_labores.md) y [zona_outdoor.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/zona_outdoor.md).*

| Categoría | Requisitos Críticos de Pre-Instalación | Elementos de Diseño / UI |
| :--- | :--- | :--- |
| **Spas e Hidromasajes** | • Voltaje 110V o 220V Bifásico según motobomba (2 HP).<br>• Circuito eléctrico independiente con protección **GFCI**.<br>• Desagüe de 1.5" a 2" con trampa de olor.<br>• **Escotilla de inspección técnica obligatoria de 40x40 cm** para motobomba. | Despiece animado in-scroll, conmutador de versiones (Empotrada, Plus, Spa) y venta cruzada de visita técnica. |
| **Cocinas Integrales** | • Puntos hidrosanitarios para lavaplatos.<br>• Ergonomía del triángulo de trabajo (conservación, lavado, cocción).<br>• Resistencia térmica y antimanchas en mesones Quartzstone / Mármol Sintético. | Selector interactivo de orientación de poceta (Izquierda / Derecha) y griferías cuello de ganso. |
| **Zona de Labores** | • Doble toma de agua y desagüe para lavadora y lavadero.<br>• Muebles en aglomerado RH resistentes al vapor y detergentes.<br>• Líneas Pro (gran capacidad), Aqua y Eco. | Demostración visual de pozo + restregadero, y cotas de ajuste en nichos de lavado. |
| **Zona Outdoor (BBQ & Spas)** | • Asadores en acero inoxidable AISI 304.<br>• Acometida de gas ventilada o soporte para carbón.<br>• **Cálculo de carga estructural en placas/terrazas (kg/m²)** para spas exteriores. | Simulador modular BBQ y visualización de mantenedores térmicos y cubiertas protectoras. |
| **Grifería y Plomería** | • Cartuchos cerámicos antigoteo.<br>• Cumplimiento de ahorro de agua (Resolución MinVivienda).<br>• Desagües tipo push y sifones botella compatibles. | Matriz de compatibilidad en vivo según altura de grifería (baja para empotrar, alta para vessel). |
| **Carpintería de Obra (B2B)** | • Dirigido a firmas constructoras y arquitectos.<br>• Muebles y carpintería arquitectónica seriada. | Formulario exclusivo de licitación/leads y descarga de planos BIM/CAD (sin precios transaccionales directos). |

---

## 6. Políticas Comerciales y Operativas Inquebrantables con Impacto en UX/UI

*Detalle extendido en [conceptos_catalogo.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/conceptos_catalogo.md).*

Toda interfaz de producto, carrito y checkout debe respetar y comunicar sin ambigüedades las siguientes 4 políticas:

1. **Promesa de Despacho Estándar de 15 Días Hábiles**:
   - Fabricación bajo pedido: entrega en **15 días hábiles** (excepto spas multipersonales: 15 a 20 días con prueba hidrostática).
   - El flag comercial `is_fast_shipping` (⚡ **Envío Rápido**) se reserva únicamente para SKUs con stock físico verificado para despacho en **<48h**.
2. **Restricción Estricta de Entrega en Primer Piso**:
   - Alerta visual obligatoria en ficha y checkout: *"La entrega de productos voluminosos (tinas, cocinas, muebles) se realiza exclusivamente en el primer piso del domicilio. La transportadora no sube productos por fachadas, escaleras ni ascensores"*.
3. **Plazo de 3 Días Hábiles para Reporte de Averías Estéticas**:
   - Banner preventivo en confirmación de orden y correo post-venta informando que reclamaciones por roturas, desportillados o rayones deben reportarse dentro de los primeros **3 días hábiles** posteriores a la recepción.
4. **Esquema de Garantías de Fábrica por Componente**:
   - **5 años**: Estructuras en Mármol Sintético, Quartzstone y cascos de hidromasaje/tinas en fibra de vidrio.
   - **1 a 5 años**: Muebles en madera aglomerada RH (según gama).
   - **5 años**: Cuerpo de grifería y mecanismo cerámico (**1 año** en acabado y mangueras plásticas).
   - **1 año**: Equipos electromecánicos (motobombas, blowers, sopladores, calentadores, luces LED).
   - **3 años**: Asadores en acero inoxidable AISI 304.

---

## 7. Rendimiento y Separación Estricta entre SEO y Experiencia Visual

*Detalle extendido en [seo.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/seo.md).*

- **El SEO NUNCA vive dentro del Canvas o WebGL**:
  - Todo el contenido descriptivo, encabezados `<h1>`, `<h2>`, tablas técnicas, fichas descargables y datos estructurados Schema.org (`Product`, `Offer`, `AggregateRating`, `Organization`) se sirven mediante HTML semántico generado en el servidor (SSR/ISR).
  - La capa gráfica interactiva (Three.js / GSAP) se monta como un **overlay en el cliente** sin ocultar ni vaciar el contenido a los rastreadores web (Googlebot, SearchGPT, Perplexity).
- **Presupuesto de Rendimiento (Performance Budget)**:
  - **LCP (Largest Contentful Paint) < 1.5s**: El primer viewport carga una imagen estática optimizada (`next/image`) servida por CDN antes de inicializar scripts pesados.
  - Carga diferida (`next/dynamic` con `ssr: false`) para módulos 3D en dispositivos móviles.

---

## 8. Mapeo de Enlaces Cruzados del Wiki

- [Índice General del Wiki](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/index.md)
- [Sistema de Diseño y Tokens Gráficos](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/sistema_diseno.md)
- [Página de Inicio y Navegación Global](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/pagina_inicio.md)
- [Página de Detalle de Producto (PDP) y Scrollytelling](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/pagina_producto.md)
- [Módulo Visualizador Mix & Match](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/mix_and_match.md)
- [Conceptos del Catálogo y Políticas Comerciales](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/conceptos_catalogo.md)
- [Spas e Hidromasajes](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/hidromasajes.md)
- [Cocinas Integrales y Superficies](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/cocinas.md)
- [Zona de Labores y Lavaderos](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/zona_labores.md)
- [Zona Outdoor y Asadores BBQ](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/zona_outdoor.md)
- [Accesorios y Mobiliario Complementario](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/accesorios.md)
- [Grifería y Plomería Técnica](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/griferia_plomeria.md)
- [Carpintería de Obra Institucional](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/carpinteria_obra.md)
- [Servicios Técnicos e Instalación Certificada](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/servicios.md)
- [Arquitectura de Datos y Supabase](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/arquitectura_datos.md)
- [Pagos, ePayco y Crédito ADDI](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/pagos_e_integraciones.md)
- [Especificaciones SEO y Search AI](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/seo.md)
