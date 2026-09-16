---
name: cinematic-experience
description: |
  Guía y estándar para diseñar y construir sitios web y landing pages premium,
  altamente visuales y cinematográficos con narrativa scroll-driven, scrubbing interactivo,
  arquitectura de 6 capítulos y conversión de alto impacto para marcas y productos de lujo.
---

# Cinematic Experience Skill: Diseño y Construcción de Sitios Web Cinematográficos

Este Skill define el marco de trabajo, los principios creativos, las técnicas de ingeniería frontend y la estructura narrativa para crear experiencias web de nivel cinematográfico e interactivo orientadas a producto.

---

## 1. Filosofía y Objetivo

El sitio debe sentirse como una **película interactiva o presentación de producto de alto nivel**, no como una web tradicional o plantilla corporativa.

* **Narrativa continua:** La página no es una sucesión de bloques o tarjetas aisladas, sino un plano secuencia continuo guiado por el desplazamiento del usuario (*scroll*).
* **Scroll-Scrubbing como motor de cámara:** El scroll controla la velocidad y progresión de la escena (rotaciones, despieces, ensambles, iluminación, tipografía y entornos).
* **El producto como protagonista:** Cada transición visual explica características, materialidad, diseño y valor tangible del producto.

---

## 2. Estructura Narrativa de los 6 Capítulos

```
+---------------------------------------------------------------------------------+
| CAPÍTULO 1: IMPACTO       -> Revelación inicial memorable, titular y subtítulo |
+---------------------------------------------------------------------------------+
| CAPÍTULO 2: DISEÑO        -> Zoom de cámara macro, ergonomía, geometría visual  |
+---------------------------------------------------------------------------------+
| CAPÍTULO 3: MATERIAL      -> Metamorfosis de textura, tecnología y composición  |
+---------------------------------------------------------------------------------+
| CAPÍTULO 4: FUNCIONALIDAD -> El producto en acción real y contacto con entorno  |
+---------------------------------------------------------------------------------+
| CAPÍTULO 5: PERSONALIZAR  -> Variantes continuas de color, acabado y accesorios |
+---------------------------------------------------------------------------------+
| CAPÍTULO 6: CONVERSIÓN    -> Composición limpia, precio/cotización y CTA claro  |
+---------------------------------------------------------------------------------+
```

### Detalle de Capítulos:

1. **Capítulo 1 — Impacto (Hero)**
   * Pantalla completa inmersiva. Mínima carga textual: titular potente (`[TITULAR]`) y subtítulo conciso (`[SUBTÍTULO]`).
   * El producto emerge de las sombras, niebla, luz o material líquido al iniciar el scroll.
2. **Capítulo 2 — Diseño**
   * Movimiento de cámara suave hacia primeros planos (*macro views*).
   * Destaca formas, acabados milimétricos, ergonomía e ingeniería de diseño.
   * Tipografía editorial integrada en la escena en capas z-index relativas al modelo/video.
3. **Capítulo 3 — Material**
   * Metamorfosis visual interactiva: muestra la resina, piedra, metal, fibra o capas internas.
   * Explicación visual antes que textual (partículas, cortes transversales, flujo de materiales).
4. **Capítulo 4 — Funcionalidad**
   * El producto en uso dinámico (interacción con agua, vapor, luz, peso o movimiento mecánico).
   * Atmósfera ambiental y espacial coherente.
5. **Capítulo 5 — Personalización y Variantes**
   * Cambio progresivo y suave entre acabados, colores o módulos sin cortes secos.
   * Controles interactivos sutiles (swatches de color, selectores de escala o variantes de modelo).
6. **Capítulo 6 — Conversión**
   * Composición limpia y estática del producto final en su mejor ángulo.
   * Información comercial transparente: precio, ficha técnica resumida o cotizador directo.
   * Botón de acción principal (`[CTA PRINCIPAL]`) y secundario (`[CTA SECUNDARIO]`).

---

## 3. Dirección Artística y Estética Visual

* **Evitar clichés de UI:** No usar tarjetas cuadradas repetitivas, gradientes multicolor genéricos, bordes redondeados excesivos ni iconography estilo SaaS.
* **Tipografía Editorial:** Uso de fuentes refinadas (serif de alta moda, sans neo-grotescas refinadas o monospace de ingeniería de precisión). Escalas de texto contrastantes (titulares monumentales y micro-etiquetas técnicas).
* **Paleta Cromática Calibrada:** Fondos neutros profundos (negros carbón, tiza, piedra o arenas arquitectónicas) con un color de acento único para guiar la atención hacia puntos de interacción clave.
* **Composición Espacial:** Generar profundidad con luces volumétricas, sombras suaves y transiciones de desenfoque de campo (*depth of field*).

---

## 4. Stack y Técnicas de Implementación

### A. Control del Scroll y Scrubbing
* **Scroll Suave:** Utilizar motores de smooth scroll como **Lenis** o física de inercia para evitar tirones.
* **Scroll-Scrubbing de Animación:**
  * **Canvas 2D Frame-Scrubbing:** Secuencias de imágenes optimizadas (WebP/AVIF precargadas) renderizadas en `<canvas>` según `scrollProgress`. Ideal para renderizados fotorrealistas de 360° o despieces de producto.
  * **Video Scrubbing:** Videos cortos con codificación de solo keyframes (`GOP = 1`) manipulados vía `video.currentTime = progress * duration`.
  * **WebGL / Three.js:** Escenas 3D interactivas donde la cámara y morfología de mallas responden a GSAP ScrollTrigger o ScrollTimeline nativo de CSS.
* **Fijado de Escena (*Pinning*):** Bloqueo de la vista (`position: sticky` o `ScrollTrigger pin`) durante la narración del capítulo mientras el contenido interno se transforma.

### B. Microinteracciones Premium
* **Cursor magnético o contextual:** Cambios sutiles de etiqueta según el área inspeccionada ("Drag", "Explorar", "Ver acabado").
* **Transiciones de texto:** Aparición por máscara (`overflow: hidden` con `translateY`), opacidades cinemáticas y tracking tipográfico sutil.
* **Botones y enlaces:** Líneas expansivas, halos de luz suaves, cambios de escala micro (1.02x) con curvas `cubic-bezier(0.16, 1, 0.3, 1)`.

### C. Navegación Flotante Minimalista
* Barra de navegación ultra-liviana y transparente.
* Comportamiento dinámico: se oculta automáticamente durante momentos de alta intensidad cinemática y reaparece ante scroll ascendente o al acercarse a la zona superior.
* Indicador sutil de progreso de capítulos (barra milimétrica o dots discretos).

---

## 5. Responsive y Adaptabilidad Multiplataforma

* **No reducir a escala simple:** Rediseñar las proporciones de cámara y encuadres para relación vertical (9:16) en dispositivos móviles.
* **Optimización Mobile:**
  * Reducir resolución de secuencias (ej. 1080p para desktop, 720p/540p optimizado para mobile).
  * Adaptar gestos táctiles con inercia nativa optimizada.
  * Mantener zonas táctiles cómodas para selectores y botones de conversión.

---

## 6. Rendimiento, SEO y Accesibilidad

1. **Core Web Vitals:**
   * El Hero inicial debe renderizar su primer frame de inmediato (LCP < 1.5s).
   * Precarga progresiva de los frames de capítulos posteriores en background con Web Workers o `requestIdleCallback`.
2. **SEO & Indexación:**
   * La historia y especificaciones del producto deben residir en elementos HTML semánticos (`<h1>`, `<section>`, `<article>`, `<p>`) ocultos o integrados visualmente, asegurando indexación completa por motores de búsqueda.
3. **Reducción de Movimiento:**
   * Respetar `prefers-reduced-motion: reduce`, ofreciendo una versión accesible con scroll convencional y transiciones de opacidad directas.

---

## 7. Plantilla de Brief / Ejecución Rápida

Al aplicar este skill, solicitar o definir los siguientes parámetros del producto:

* **Marca / Producto:** Nombre y propósito central.
* **Dirección Creativa:** Sensación (ej. minimalista arquitectónica, lujo cálido, industrial técnico).
* **Paleta & Fuentes:** Paleta principal, color de acento, tipografías primaria y secundaria.
* **Narrativa de 6 Capítulos:**
  1. Impacto: Titular y subtítulo de entrada.
  2. Diseño: Atributos clave a enfocar en macro.
  3. Material: Proceso o textura a revelar.
  4. Funcionalidad: Demostración en acción.
  5. Personalización: Opciones y acabados a alternar.
  6. Conversión: CTA principal y secundario.
