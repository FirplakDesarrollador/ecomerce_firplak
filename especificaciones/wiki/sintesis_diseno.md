# Síntesis Maestra de Diseño: Elementos, Lineamientos y Condiciones UI/UX

> [!IMPORTANT]
> **Estrategia Condensada**:
> Este documento compila y consolida la totalidad de elementos visuales, tokens de diseño, lineamientos de experiencia cinematográfica, directrices de interacción (Mix & Match / Scrollytelling), requerimientos técnicos de pre-instalación y condiciones comerciales documentadas en el [Wiki de Especificaciones](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK%20e-commerce/especificaciones/wiki/index.md) de Firplak E-commerce, **rigurosamente alineados con las 26 Leyes de UX (Jon Yablonski / lawsofux.com)**.

---

## 1. Filosofía Visual e Intención Psicológica de Diseño

La presencia digital de Firplak se fundamenta en cuatro pilares conceptuales y psicológicos:

1. **Elegancia Arquitectónica y Bienestar (*Aesthetic-Usability Effect*)**:
   - Estética limpia, proporciones amplias y visuales de alta gama (estilo Apple / Kohler / Laufen) que posicionan a Firplak como una marca de lujo accesible.
   - El acabado pulido, los degradados minerales y la materialidad noble (Mármol Sintético, Quartzstone, aglomerados RH) incrementan la paciencia y credibilidad del usuario ante productos de ticket elevado ($1M a $25M COP).
2. **Decisión Fluida y Cero Fricción Cognitiva (*Hick's Law & Choice Overload*)**:
   - Menús, PDPs y configuradores estructurados para evitar la parálisis por análisis. Se limitan las opciones concurrentes a un máximo de 5 a 6 alternativas, apoyadas por tags de *Más Vendido* y *Envío Rápido*.
3. **Ergonomía Táctil y Respuesta Inmediata (*Fitts's Law & Doherty Threshold*)**:
   - Controles interactivos con touch targets de $\ge 44 \times 44$ px, barras de compra flotantes fijas a la zona del pulgar en mobile (*Sticky Bottom Bar*) y feedback visual de interacción en $< 150$ ms (conclusión en $< 400$ ms).
4. **Claridad Técnica y Absorción de Complejidad (*Tesler's Law & Cognitive Load*)**:
   - El sistema absorbe la complejidad inherente de compatibilidades hidrosanitarias, voltajes (110V/220V) y requerimientos de motobombas. Presenta métricas críticas mediante *chunking* visual (Ley de Miller) sin abrumar al comprador.

---

## 2. Sistema de Diseño, Tokens y Estilo Gráfico

*Detalle extendido en [sistema_diseno.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK%20e-commerce/especificaciones/wiki/sistema_diseno.md).*

### A. Paleta de Colores y Tokens Globales

```css
:root {
  /* Marca Principal - Azul Firplak (Jakob / Consistencia Canónica) */
  --color-primary-50:  #eef7ff;
  --color-primary-100: #d8edff;
  --color-primary-500: #0077c8; /* Azul Oficial Firplak */
  --color-primary-600: #005fa3;
  --color-primary-700: #004b87;
  --color-primary-900: #00264d;

  /* Bienestar, Agua & Cromoterapia */
  --color-hydro-cyan:   #00d2d3;
  --color-hydro-teal:   #01a3a4;
  --color-hydro-purple: #5f27cd; /* Acento cromoterapia LED */

  /* Materiales Nobles & Superficies Minerales */
  --color-stone-marble:  #f8f9fa; /* Mármol Sintético */
  --color-stone-quartz:  #e9ecef; /* Quartzstone */
  --color-wood-rh:        #4a3728; /* Madera Nogal / Humedad RH */
  --color-wood-light:     #d4a373; /* Roble Claro */

  /* Neutrales y Superficies (Gestalt: Región Común) */
  --color-surface-bg:    #ffffff;
  --color-surface-card:  #f8fafc;
  --color-text-main:     #0f172a;
  --color-text-muted:    #64748b;
  --color-border-subtle: #e2e8f0;

  /* Ergonomía y Rendimiento (Fitts & Doherty) */
  --touch-target-min: 44px;
  --timing-feedback: 150ms;
  --timing-doherty: 400ms;

  /* Sombras y Elevación (Von Restorff) */
  --shadow-sm: 0 2px 4px rgba(15, 23, 42, 0.04);
  --shadow-md: 0 8px 16px rgba(15, 23, 42, 0.06);
  --shadow-lg: 0 16px 32px rgba(15, 23, 42, 0.08);
  --shadow-floating-cta: 0 12px 28px rgba(0, 119, 200, 0.28);
}
```

### B. Tipografía Oficial y Miller's Law (Chunking)

- **[Outfit](https://fonts.google.com/specimen/Outfit)**: Titulares, H1, H2, Hero banners, precios y métricas de impacto (litros, garantía, potencia).
- **[Inter](https://fonts.google.com/specimen/Inter)**: Textos descriptivos, tablas de especificaciones técnicas, badges y etiquetas.

| Nivel | Tipografía | Peso | Principio UX Asociado |
| :--- | :--- | :--- | :--- |
| **H1** | `Outfit` | 700 / Bold | **Punto Focal (Prägnanz)**: Nombre de producto y propuesta de valor. |
| **H2 / H3** | `Outfit` | 600 / Semi-Bold | **Chunking (Miller)**: Títulos de fases scrollytelling y grupos de datos. |
| **Metrics** | `Outfit` | 800 / Extra-Bold | **Aislamiento (Von Restorff)**: Litros, potencia (HP) y años de garantía. |
| **Body** | `Inter` | 400 / Regular | **Baja Carga Cognitiva**: Textos legibles con interlineado 1.6x. |
| **Badges / CTAs**| `Inter` | 600 / Semi-Bold | **Target Táctil (Fitts)**: Botones de compra $\ge 44$px con feedback físico. |

---

## 3. Arquitectura y Experiencia UI por Módulo bajo Leyes de UX

### A. Página de Inicio (Home Page)
*Detalle extendido en [pagina_inicio.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK%20e-commerce/especificaciones/wiki/pagina_inicio.md).*

1. **Announcement Bar & Goal-Gradient Effect**:
   - Ticker rotativo con incentivos claros: *"¡Envío Gratis por compras superiores a $X!"* o cuotas ADDI calculadas al instante.
2. **Top Bar Corporativo (Mental Model)**:
   - Iconografía canónica (teléfono, WhatsApp, usuario) para atención inmediata y B2B.
3. **Megamenú & Serial Position Effect**:
   - Posicionamiento estratégico: categorías de mayor conversión y ticket (*Hidromasajes* y *Baños*) al inicio, y *Zona Outdoor / Saldos* al final.
4. **Hero Cinematográfico (Aesthetic-Usability Effect)**:
   - Video lifestyle generado con Higgsfield REAL + modelo CAD real. Carga inicial optimizada con imagen WebP estática servida por CDN (LCP < 1.2s, Doherty compliant).
5. **Grid Circular de Categorías (Hick's Law)**:
   - Acceso visual instantáneo a los 6 entornos clave sin submenús anidados en primera vista.
6. **Módulo Flash Sales (Von Restorff)**:
   - Descuentos con ahorro explícito en COP (`Ahorras: $ XXX.XXX`), botones de compra rápida con estados de carga inmediatos.
7. **Hub de Catálogos (Zeigarnik Effect)**:
   - Acceso para diseñadores y constructores con descarga inmediata en PDF.
8. **Showrooms Omnicanal (Jakob's Law)**:
   - Enlace nativo a Google Maps y llamada directa para los 4 puntos físicos (Bogotá, Medellín e Itagüí, Cali).
9. **Footer Regulatorio (Trust & Assurance)**:
   - Respaldo legal SIC, política de entrega en primer piso y Habeas Data.

---

### B. Ficha de Producto (PDP) y Scrollytelling en 8 Fases

*Detalle extendido en [pagina_producto.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK%20e-commerce/especificaciones/wiki/pagina_producto.md).*

Cada fase del scrollytelling en productos Tier 1 responde a un principio psicológico específico:

```
[ PROGRESO DE SCROLL ]
0%  ────► 15% : FASE 1 - Atmósfera & Contexto       [Aesthetic-Usability Effect] (Video lifestyle Higgsfield)
15% ────► 30% : FASE 2 - Aislamiento del Producto   [Selective Attention / Prägnanz] (Fondo neutro, foco en la pieza)
30% ────► 45% : FASE 3 - Giro 3D CAD Real           [Mental Model / Paradox of Active User] (Rotación interactiva al scroll)
45% ────► 60% : FASE 4 - Demostración de Material   [Miller's Law] (Callouts de Mármol Sintético / 5 años garantía)
60% ────► 70% : FASE 5 - Color Swap Instantáneo     [Doherty Threshold <150ms] (Transmutación reactiva de acabados)
70% ────► 80% : FASE 6 - Ingeniería de Instalación  [Tesler's Law] (Puntos hidráulicos y escotilla 40x40 simplificados)
80% ────► 90% : FASE 7 - Mix & Match Interactivo    [Law of Common Region] (Ensamblaje del lavamanos sobre el mueble)
90% ────► 100%: FASE 8 - Conversión y Cierre         [Von Restorff & Peak-End Rule] (Resumen, CTA dominante, ePayco/ADDI)
```

#### Barra Flotante de Compra (Floating Buy Bar)
* **Fitts's Law**: En desktop flota en la parte superior; en mobile se fija en la parte inferior (*Sticky Bottom*), garantizando alcance en la zona natural del pulgar.
* **Von Restorff**: El botón `[Añadir al Carrito]` destaca en `--color-primary-500` con resplandor focal, superando cualquier distracción del contenido.

---

### C. Módulo Visualizador Mix & Match
*Detalle extendido en [mix_and_match.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK%20e-commerce/especificaciones/wiki/mix_and_match.md).*

1. **Prevención de Sobrecarga (Choice Overload & Hick)**:
   - Selección independiente en dos niveles (arriba: lavamanos, abajo: mueble) con deslizamiento horizontal suave.
2. **Absorción de Complejidad en Base de Datos (Tesler’s Law)**:
   - El usuario no debe descifrar medidas técnicas: Supabase valida en tiempo real la compatibilidad dimensional y el orificio de grifería entre la pieza superior y la inferior, deshabilitando combinaciones incompatibles.
3. **Ley de Región Común y Conectividad Uniforme**:
   - Los assets WebP transparentes comparten caja delimitadora idéntica, proyectando la ilusión física de un mueble íntegro instalado.
4. **Venta Cruzada Orientada al Objetivo (Goal-Gradient Effect)**:
   - Selección guiada de complementos (grifería compatible alta/baja, desagüe push y espejo LED) sumando el paquete con descuento visible.

---

## 4. Stack Tecnológico de Experiencia e Interacción (Performance Budget)

Para cumplir con el **Umbral de Doherty ($< 400$ ms)** y retener al usuario en estado de flujo (*flow*):

- **Next.js 15 App Router**: SSR para SEO inmediato + Client Components con `next/dynamic` para módulos 3D.
- **GSAP 3 + ScrollTrigger**: Anclaje milimétrico (`pin: true`) y scrub suave (`scrub: 0.5`).
- **Lenis Smooth Scroll**: Sensación física continua en ratón, trackpad y touch.
- **React Three Fiber + Drei (Tier 1 Hero)**: Modelos CAD en GLB comprimidos con Draco/Meshopt y texturas KTX2 (<2.5 MB).
- **Canvas 2D Frame Engine (Tier 2 Core)**: Secuencias de 60-120 fotogramas WebP (<40 KB c/u) para dispositivos móviles de gama media.
- **Higgsfield REAL**: Generación de atmósferas sin alterar la morfología CAD del producto.

---

## 5. Condiciones Técnicas y Requisitos de Pre-Instalación

*Detalle extendido en [hidromasajes.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK%20e-commerce/especificaciones/wiki/hidromasajes.md), [cocinas.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK%20e-commerce/especificaciones/wiki/cocinas.md), [zona_labores.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK%20e-commerce/especificaciones/wiki/zona_labores.md) y [zona_outdoor.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK%20e-commerce/especificaciones/wiki/zona_outdoor.md).*

La presentación de datos técnicos se organiza bajo **Miller's Law (Chunking de 3-5 especificaciones por bloque)**:

| Categoría | Requisitos Críticos de Pre-Instalación | Enfoque UX / UI |
| :--- | :--- | :--- |
| **Spas e Hidromasajes** | • Voltaje 110V o 220V Bifásico (Motobomba 2 HP).<br>• Circuito independiente con protección **GFCI**.<br>• Desagüe de 1.5" a 2" con trampa de olores.<br>• **Escotilla de inspección obligatoria de 40x40 cm**. | Despiece animado in-scroll, conmutador de versiones (Plus/Spa) y opción de agendar visita técnica previa. |
| **Cocinas Integrales** | • Puntos hidrosanitarios.<br>• Ergonomía del triángulo de trabajo (conservación, lavado, cocción).<br>• Resistencia térmica y antimanchas en mesones. | Selector interactivo de poceta (Izquierda / Derecha) y griferías de cuello alto. |
| **Zona de Labores** | • Doble toma de agua y desagüe para lavadora y lavadero.<br>• Muebles en aglomerado RH resistentes al vapor y detergentes.<br>• Líneas Pro, Aqua y Eco. | Demostración visual de pozo + restregadero, y cotas de ajuste en nichos. |
| **Zona Outdoor (BBQ & Spas)** | • Asadores en acero inoxidable AISI 304.<br>• Acometida de gas ventilada o soporte de carbón.<br>• **Cálculo de carga estructural en terrazas (kg/m²)**. | Simulador modular BBQ y visualización de cubiertas térmicas protectoras. |
| **Grifería y Plomería** | • Cartuchos cerámicos antigoteo.<br>• Ahorro de agua (Resolución MinVivienda).<br>• Desagües tipo push y sifones compatibles. | Matriz de compatibilidad en vivo según altura de grifería (baja para empotrar, alta para vessel). |
| **Carpintería de Obra (B2B)** | • Para constructoras y firmas de diseño.<br>• Mobiliario seriado para proyectos inmobiliarios. | Formulario exclusivo de licitación/leads con descarga de fichas y modelos BIM. |

---

## 6. Políticas Comerciales Inquebrantables y Comunicación Asertiva

*Detalle extendido en [conceptos_catalogo.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK%20e-commerce/especificaciones/wiki/conceptos_catalogo.md).*

Para evitar fricción post-venta sin asustar al comprador en el embudo (*Cognitive Load & Selective Attention*):

1. **Promesa de Despacho Estándar de 15 Días Hábiles**:
   - Fabricación personalizada bajo pedido. El flag ⚡ **Envío Rápido** se reserva exclusivamente para inventario con despacho en **<48h**.
2. **Restricción Estricta de Entrega en Primer Piso**:
   - Banner visible en PDP y checkout: *"La entrega de productos voluminosos se efectúa en el primer piso del domicilio. La transportadora no realiza maniobras por fachadas o escaleras"*.
3. **Plazo de 3 Días Hábiles para Reporte de Averías Estéticas**:
   - Banner preventivo en confirmación de orden y correo post-venta informando que reclamaciones por desportillados o rayones deben reportarse dentro de los primeros 3 días hábiles.
4. **Esquema de Garantías de Fábrica**:
   - **5 años**: Estructuras en Mármol Sintético, Quartzstone y cascos de hidromasaje.
   - **1 a 5 años**: Muebles en aglomerado RH.
   - **5 años**: Cuerpo de grifería y mecanismos cerámicos (**1 año** en mangueras y acabados).
   - **1 año**: Componentes electromecánicos (motobombas, sopladores, luces LED).
   - **3 años**: Asadores en acero inoxidable AISI 304.

---

## 7. Rendimiento y Separación Estricta entre SEO y Experiencia

- **El SEO NUNCA vive dentro del Canvas o WebGL**:
  - Todo encabezado `<h1>`, `<h2>`, tabla técnica y esquema estructurado de Schema.org (`Product`, `Offer`, `AggregateRating`) se genera en el servidor (SSR/ISR) mediante HTML semántico.
  - El Canvas WebGL/2D actúa como un **overlay interactivo** en el cliente.
- **Presupuesto de Rendimiento**:
  - **LCP < 1.5s**: Primer viewport carga imagen WebP estática antes de scripts pesados.
  - Carga diferida (`next/dynamic` con `ssr: false`) en móviles para componentes WebGL.

---

## 8. Checklist Heurístico Integral de Validación UI/UX

Antes de publicar cualquier componente, pantalla o flujo nuevo en el e-commerce de Firplak:

- [ ] **Decisión Limpia (Hick & Choice Overload)**: ¿Hay un foco visual claro por sección y menos de 6 opciones concurrentes?
- [ ] **Ergonomía Táctil (Fitts)**: ¿Los botones y selectores miden al menos $44 \times 44$ px y están al alcance del pulgar en mobile?
- [ ] **Respuesta Instantánea (Doherty)**: ¿El feedback visual ocurre en $< 150$ ms y la carga asíncrona en $< 400$ ms con skeleton?
- [ ] **Aislamiento del CTA (Von Restorff)**: ¿El botón de compra principal es el elemento más visible de la pantalla?
- [ ] **Chunking Cognitivo (Miller)**: ¿Las listas de atributos y tablas técnicas están agrupadas en bloques de 3 a 5 ítems?
- [ ] **Estructura Gestalt (Proximity & Common Region)**: ¿Los datos afines comparten contenedor y espaciado proporcional?
- [ ] **Familiaridad Canónica (Jakob)**: ¿Se respetan los convenios de comercio electrónico (carrito, búsqueda, checkout)?
- [ ] **Tolerancia en Entradas (Postel)**: ¿Los formularios formatean cédulas, teléfonos y tarjetas sin arrojar errores rígidos?
- [ ] **Cierre Positivo (Peak-End Rule & Goal-Gradient)**: ¿El flujo de compra concluye con una confirmación clara y memorable?

---

## 9. Mapeo de Enlaces Cruzados del Wiki

- [Índice General del Wiki](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK%20e-commerce/especificaciones/wiki/index.md)
- [Sistema de Diseño y Tokens Gráficos](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK%20e-commerce/especificaciones/wiki/sistema_diseno.md)
- [Página de Inicio y Navegación Global](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK%20e-commerce/especificaciones/wiki/pagina_inicio.md)
- [Página de Detalle de Producto (PDP) y Scrollytelling](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK%20e-commerce/especificaciones/wiki/pagina_producto.md)
- [Módulo Visualizador Mix & Match](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK%20e-commerce/especificaciones/wiki/mix_and_match.md)
- [Conceptos del Catálogo y Políticas Comerciales](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK%20e-commerce/especificaciones/wiki/conceptos_catalogo.md)
- [Spas e Hidromasajes](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK%20e-commerce/especificaciones/wiki/hidromasajes.md)
- [Cocinas Integrales y Superficies](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK%20e-commerce/especificaciones/wiki/cocinas.md)
- [Zona de Labores y Lavaderos](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK%20e-commerce/especificaciones/wiki/zona_labores.md)
- [Zona Outdoor y Asadores BBQ](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK%20e-commerce/especificaciones/wiki/zona_outdoor.md)
- [Accesorios y Mobiliario Complementario](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK%20e-commerce/especificaciones/wiki/accesorios.md)
- [Grifería y Plomería Técnica](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK%20e-commerce/especificaciones/wiki/griferia_plomeria.md)
- [Carpintería de Obra Institucional](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK%20e-commerce/especificaciones/wiki/carpinteria_obra.md)
- [Servicios Técnicos e Instalación Certificada](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK%20e-commerce/especificaciones/wiki/servicios.md)
- [Arquitectura de Datos y Supabase](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK%20e-commerce/especificaciones/wiki/arquitectura_datos.md)
- [Pagos, ePayco y Crédito ADDI](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK%20e-commerce/especificaciones/wiki/pagos_e_integraciones.md)
- [Especificaciones SEO y Search AI](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK%20e-commerce/especificaciones/wiki/seo.md)
