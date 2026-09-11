# Sistema de Diseño, Arquitectura UI/UX y Estilo Gráfico (Master Design System)

> [!IMPORTANT]
> **Fuente Única de Verdad (Master Document)**:
> Compilación exhaustiva y canónica que unifica la identidad visual, tokens CSS, psicología cognitiva, lineamientos de experiencia cinematográfica (Scrollytelling en 8 fases / Mix & Match), requisitos técnicos de pre-instalación y políticas comerciales de Firplak E-commerce:
> - **Brand Book AIR 2026**: Slogan oficial *"inspiring homes"* (*inspirando hogares*), Isotipo **Λ** modular.
> - **Paleta Oficial**: *Dutch Boy 2025 Captivate Palette* (Azul Base `#324354`, Slate Green `#7B8E90`, Negro `#000000`, Lino Cálido `#F6F3EE`).
> - **Tipografía Oficial**: `Orborn Medium` (titulares / display) y `Montserrat` (cuerpo / UI).
> - **Marco Psicológico**: Rigurosamente alineado con las **26 Leyes de UX (Jon Yablonski / lawsofux.com)**.
> - **Rendimiento y Ergonomía**: Fitts ($\ge 44$px), Doherty ($< 400$ms), Miller (chunking 3-5), overlays translúcidos sobre video y separación estricta SEO vs. Canvas.

---

## 1. Fundamentos Psicológicos y Leyes de UX del Sistema

El sistema de diseño de Firplak opera bajo las **4 Dimensiones Psicológicas de UX**:

```
+----------------------------------------------------------------------------------------------------+
| 1. COGNICIÓN & DECISIÓN   | Hick (≤5 opciones concurrentes), Miller (chunking 5-7), Tesler, Ockham |
+----------------------------------------------------------------------------------------------------+
| 2. PERCEPCIÓN & GESTALT   | Proximidad (gap semántico), Región Común (cards), Von Restorff (CTA)   |
+----------------------------------------------------------------------------------------------------+
| 3. ERGONOMÍA & RENDIMIENTO| Fitts (targets ≥44px, sticky bottom), Doherty (<400ms), Jakob (patrones)|
+----------------------------------------------------------------------------------------------------+
| 4. EMOCIÓN & MEMORIA      | Aesthetic-Usability Effect, Peak-End Rule, Goal-Gradient, Zeigarnik    |
+----------------------------------------------------------------------------------------------------+
```

### Aplicación Directa de Principios Heurísticos en Firplak:
1. **Aesthetic-Usability Effect (Efecto Estético-Usabilidad)**:
   - La combinación del Azul Base `#324354`, el Lino Cálido `#F6F3EE`, el acento Slate Green `#7B8E90`, el cristal translúcido y la fotografía de alta hegemonía generan una percepción inmediata de sofisticación y durabilidad, incrementando la paciencia y tolerancia emocional en compras de ticket elevado ($1.000.000 a $25.000.000 COP).
2. **Fitts’s Law (Ley de Fitts)**:
   - Todo botón primario, selector de swatch o disparador táctil tiene un área mínima de interacción de **$44 \times 44$ px**. En mobile, la acción principal de compra permanece adherida a la zona ergonómica del pulgar mediante una *Sticky Bottom Bar*.
3. **Doherty Threshold (Umbral de Doherty)**:
   - Toda interacción (cambio de variante, apertura de drawer, cálculo de cuotas ADDI o añadido al carrito) proporciona feedback visual en **$< 150$ ms** y completa su respuesta en **$< 400$ ms**. Los estados asíncronos muestran skeletons animados inmediatos para preservar el estado de flujo.
4. **Hick’s Law & Choice Overload (Ley de Hick y Sobrecarga de Elección)**:
   - La parametrización de medidas y colores se divide en pasos secuenciales o selectores de máximo 4 a 6 variantes visibles simultáneas, evitando la parálisis por análisis.
5. **Von Restorff Effect (Efecto de Aislamiento)**:
   - El CTA de conversión principal (`[Añadir al Carrito]` / `[Comprar Ahora]`) porta el contraste cromático de alta visibilidad con resplandor focal (`--shadow-floating-cta`), desmarcándose con nitidez de la paleta neutra y arquitectónica.
6. **Gestalt: Proximity & Common Region**:
   - Espaciados matemáticos jerárquicos: la distancia entre un label y su input es 4 veces menor que la separación respecto al siguiente grupo de datos. Cada SKU o combo se auto-contiene en tarjetas con límites perceptuales definidos sobre fondo Lino `#F6F3EE`.
7. **Postel’s Law (Ley de Robustez)**:
   - Entradas flexibles en buscadores, campos de cotización y checkout: formateo automático de cédula/NIT, teléfonos celulares y tolerancia a faltas ortográficas o sinónimos en el catálogo ("tina", "jacuzzi", "hidromasaje").

---

## 2. Identidad de Marca, Isotipo "Λ" y Arquitectura Gráfica (Brand Book AIR 2026)

### A. Filosofía y Propósito Institucional
> *"Diseñamos confianza, innovación y hogar. Con modernidad, versatilidad, y un enfoque centrado en ti, transformamos espacios inspiradores. FIRPLAK es solidez con alma, donde la funcionalidad y el ingenio se encuentran."*
>
> — **Brand Book FIRPLAK AIR 2026**

- **Claim / Slogan Oficial**: `inspiring homes` (variante institucional: `inspirando hogares`). Puede usarse con o sin slogan dependiendo de la escala del soporte.
- **Carácter de Marca**: Versátil, sólida, contemporánea y enfocada en renovar los hogares con diseño y bienestar.

### B. El Isotipo "Λ" (Iconografía de Marca)
El isotipo oficial se construye a partir de la transformación formal de la letra **A** en la silueta de un tejado/hogar contemporáneo con proporciones modulares en grilla:
- **Conceptos representados**: Hogar, calidad, trabajo en equipo, innovación, ambiental, bienestar, diferenciación y solidez.
- **Uso en Interfaces Digitales**:
  - **Favicon & Web App Icon**: El isotipo **Λ** en color `#324354` sobre fondo `#F6F3EE` o blanco.
  - **Loaders y Feedback de Estado**: Animación sutil de trazado o pulso sobre la letra **Λ** durante cargas asíncronas ($<400$ms).
  - **Sellos de Garantía y Fichas Técnicas**: Emblema de calidad oficial Firplak junto a los atributos de producto.
  - **Props y Elementos 3D**: Integración como bajorrelieve en piezas CAD o modelados digitales.

### C. Reglas de Contraste y Aplicación de Logo
1. **Sobre Fondo Claro (`#FFFFFF` o Lino Cálido `#F6F3EE`)**:
   - Logotipo completo o isotipo en **Azul Base `#324354`** (uso principal) o **Negro Puro `#000000`**.
2. **Sobre Fondo Oscuro (`#324354` o `#000000`)**:
   - Logotipo completo o isotipo en **Lino Cálido `#F6F3EE`** o **Blanco Puro `#FFFFFF`**.
3. **Área de Reserva y Legibilidad**:
   - Se debe preservar un margen de seguridad equivalente a la altura de la letra "P" del logotipo en todos sus costados para evitar contaminación visual.

---

## 3. Paleta de Colores y Tokens CSS Globales

La paleta se deriva de la colección **Dutch Boy 2025 ("Captivate Palette")** oficial del Brand Book, concebida para decoración de interiores y balance perfecto con metales (cromo, negro mate, oro cepillado), mármol sintético, cuarzo y maderas RH. Garantiza contraste **WCAG 2.1 AA / AAA**:

```
+------------------------------------------------------------------------------------------------+
| CÓDIGO HEX | NOMBRE / ROL                    | CMYK                  | RGB                     |
+------------------------------------------------------------------------------------------------+
| #324354    | Azul Oscuro Base (Marca Ppal)   | C:88 M:63 Y:44 K:41   | R:50  G:67  B:84        |
| #7B8E90    | Slate Green (Acento Neutro)     | C:43 M:4  Y:100 K:0   | R:123 G:142 B:144       |
| #000000    | Negro Puro (Contraste Máximo)   | C:0  M:0  Y:0   K:100 | R:0   G:0   B:0         |
| #F6F3EE    | Lino Cálido (Superficie Noble)  | C:2  M:3  Y:6   K:0   | R:246 G:243 B:238       |
+------------------------------------------------------------------------------------------------+
```

### Tokens CSS Oficiales (`:root`)

```css
:root {
  /* Marca Principal - Azul Oscuro Base (Dutch Boy 2025 / Brand Book AIR 2026) */
  --color-brand-primary:      #324354; /* Azul Firplak Oficial */
  --color-primary-50:         #f0f3f6;
  --color-primary-100:        #dce3eb;
  --color-primary-200:        #b9c7d6;
  --color-primary-300:        #8da4bc;
  --color-primary-400:        #5c7b9c;
  --color-primary-500:        #324354; /* Base Institucional */
  --color-primary-600:        #273543; /* Hover primario */
  --color-primary-700:        #1d2732; /* Active primario */
  --color-primary-800:        #141b23;
  --color-primary-900:        #0c1117; /* Contraste profundo */

  /* Acento Neutro & Bienestar - Slate Green (Dutch Boy 2025) */
  --color-brand-accent:       #7b8e90; /* Verde Salvia / Pizarra suave */
  --color-accent-light:       #9db0b2;
  --color-accent-base:        #7b8e90;
  --color-accent-dark:        #58696b;
  --color-hydro-flow:         #688285; /* Hidroterapia & Spas */

  /* Contraste Puro & Tipografía */
  --color-brand-black:        #000000; /* Tipografía H1 y títulos de impacto */
  --color-text-main:          #000000; /* Ratio > 13:1 */
  --color-text-body:          #324354; /* Lectura confortable / párrafos */
  --color-text-muted:         #58696b; /* Subtítulos y datos secundarios (WCAG AA) */

  /* Superficies Orgánicas & Fondos Nobles (Lino Cálido & Marfil) */
  --color-brand-linen:        #f6f3ee; /* Fondo orgánico oficial */
  --color-surface-bg:         #ffffff; /* Fondo principal e-commerce */
  --color-surface-card:       #f6f3ee; /* Tarjetas de producto y contenedores */
  --color-surface-muted:      #ece8e0;
  --color-border-subtle:      #e5e0d8;
  --color-border-strong:      #7b8e90;

  /* Materiales & Piedra Noble (Mármol Sintético / Quartzstone / RH) */
  --color-stone-marble:       #fbfbfa;
  --color-stone-quartz:       #f0ede6;
  --color-wood-rh:            #4a3728; /* Nogal resistente a la humedad */
  --color-wood-light:         #d4a373; /* Roble Nórdico */

  /* Funcionales & Estado (Cognición Clara) */
  --color-success:            #10b981;
  --color-warning:            #f59e0b;
  --color-danger:             #ef4444;
  --color-addi:               #00c389; /* Color oficial pasarela ADDI */

  /* Ergonomía & Targets Táctiles (Ley de Fitts) */
  --touch-target-min:         44px;
  --touch-target-lg:          52px;

  /* Tiempos de Respuesta y Fluidez (Umbral de Doherty & Física Apple) */
  --timing-instant:           120ms; /* Feedback táctil/hover */
  --timing-fast:              240ms; /* Transición de modales/drawers */
  --timing-smooth:            400ms; /* Límite perceptual de continuidad */
  --ease-spring:              cubic-bezier(0.16, 1, 0.3, 1);
  --ease-bounce:              cubic-bezier(0.34, 1.56, 0.64, 1);

  /* Sombras y Elevación (Ley de Prägnanz & Jerarquía Espacial) */
  --shadow-sm:                0 2px 4px rgba(50, 67, 84, 0.05);
  --shadow-md:                0 8px 16px rgba(50, 67, 84, 0.08);
  --shadow-lg:                0 16px 32px rgba(50, 67, 84, 0.12);
  --shadow-floating-cta:      0 12px 28px rgba(50, 67, 84, 0.32); /* Von Restorff */
}
```

---

## 4. Tipografía Oficial, Jerarquía Textual y Miller's Law

El Brand Book AIR 2026 estipula dos familias tipográficas oficiales:

1. **Tipografía Primaria**: `Orborn Medium`
   - Familia geométrica moderna con carácter arquitectónico distintivo.
   - **Uso**: Logotipo, titulares principales (H1), nombres de colección, monogramas y cifras destacadas de impacto.
2. **Tipografía Secundaria**: `Montserrat`
   - Familia sans-serif de legibilidad superior y balance neutral.
   - **Uso**: Subtítulos (H2, H3), cuerpo de texto, botones transaccionales, tablas de especificaciones técnicas y micro-copy.

### Configuración Web y Fallbacks

```html
<!-- Tipografía Secundaria Oficial: Montserrat (Google Fonts) -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap" rel="stylesheet">
```

```css
/* Tipografía Primaria Oficial: Orborn Medium */
@font-face {
  font-family: 'Orborn';
  src: url('/fonts/Orborn-Medium.woff2') format('woff2'),
       url('/fonts/Orborn-Medium.woff') format('woff');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

:root {
  --font-display: 'Orborn', 'Montserrat', -apple-system, sans-serif;
  --font-body:    'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
```

### Reglas de Aplicación y Chunking Cognitivo (Miller's Law)

Para respetar la **Ley de Miller ($7 \pm 2$ unidades de información)** y la **Ley de Prägnanz**, las fichas técnicas y textos extensos nunca se presentan en bloques planos; se agrupan en módulos semánticos de 3 a 5 especificaciones:

| Nivel | Tipografía | Peso | Tamaño / Leading | Regla Heurística / Caso de Uso |
| :--- | :--- | :--- | :--- | :--- |
| **H1 (Hero / PDP)** | `Orborn` | Medium (500) | 32-44px / 1.15 | **Foco Primario**: Nombre del producto y propuesta de valor única. |
| **H2 (Secciones)** | `Orborn` | Medium (500) | 24-32px / 1.25 | **Estructura Escaneable**: Títulos de fases scrollytelling y colecciones. |
| **H3 (Subtítulos)**| `Montserrat` | 600 (Semi-Bold)| 18-22px / 1.30 | **Chunking**: Grupos de atributos (Dimensiones, Material, Eléctrico). |
| **Metrics / Num** | `Orborn` | Medium (500) | 28-36px / 1.00 | **Von Restorff**: Cifras de garantía (5 Años), Litros (350L) y Potencia (2 HP). |
| **Price Active** | `Montserrat` | 700 (Bold) | 24-30px / 1.10 | **Claridad Comercial**: Precio en COP con separador de miles claro. |
| **Body (Cuerpo)** | `Montserrat` | 400 (Regular) | 15-16px / 1.60 | **Legibilidad Óptima**: Párrafos explicativos (máx. 65-75 caracteres por línea). |
| **Technical Data**| `Montserrat` | 500 (Medium) | 13-14px / 1.45 | **Precisión**: Datos tabulares de instalación, voltajes y pesos. |
| **Badges / Tags** | `Montserrat` | 600 (Semi-Bold)| 11-12px / 1.00 | **Escaneo Rápido**: *Envío Rápido <48h*, *Ahorras 25%*, *5 Años Garantía*. |

---

## 5. Overlays con Opacidad sobre Video y Fotografía, Cuadros de Texto y Elementos Gráficos

### A. Principio Rector: Protagonismo Absoluto de los Assets Visuales (Foto & Video)
En la experiencia Firplak, **el asset visual (video cinemático renderizado o fotografía de alta resolución) es el protagonista supremo de la escena**. La arquitectura, la materialidad noble (Mármol, Quartzstone, maderas RH), el flujo del agua y la iluminación zen deben respirar sin interferencias.

Los elementos de interfaz gráfica (UI) actúan como **capas de soporte etéreas y respetuosas**, nunca como muros opacos que compitan o tapen el producto.

---

### B. Superficies Translúcidas y Efecto Glassmorphism sobre Video
El sistema adopta como patrón canónico el uso de **cajas translúcidas con desenfoque de fondo (`backdrop-filter`) y opacidad calibrada**, garantizando legibilidad tipográfica bajo contraste WCAG sin cegar el video que corre en segundo plano:

1. **Dark Slate Glass (Uso Principal sobre Video / Fotografía Diurna)**:
   - **Fondo con Opacidad Calibrada**: `rgba(50, 67, 84, 0.60)` a `rgba(20, 27, 35, 0.70)` (o `bg-black/60` con base en `--color-brand-primary`). Permite apreciar la textura, agua o ambiente que transcurre detrás.
   - **Desenfoque Óptico**: `backdrop-filter: blur(12px)` a `blur(16px)` (`backdrop-blur-md`).
   - **Borde de Tensión Sutil**: `1px solid rgba(255, 255, 255, 0.20)`. Delimita el volumen sin generar un corte duro.
   - **Sombra Espacial**: `box-shadow: 0 20px 40px rgba(0, 0, 0, 0.35)`.
   - **Tipografía**: Titular en blanco puro `#FFFFFF`, cuerpo en blanco al 75% (`rgba(255, 255, 255, 0.75)` / `#F6F3EE`), acentos de tag en cian/salvia.

2. **Light Linen Glass (Uso Secundario sobre Escenas Nocturnas o Fondos Oscuros)**:
   - **Fondo con Opacidad**: `rgba(246, 243, 238, 0.80)`.
   - **Desenfoque**: `backdrop-filter: blur(16px)`.
   - **Borde**: `1px solid rgba(255, 255, 255, 0.60)`.
   - **Tipografía**: `#000000` y `#324354`.

```css
/* Token CSS Canónico para Paneles sobre Video (Loomere / PDP Scrollytelling) */
.glass-overlay-card {
  background-color: rgba(50, 67, 84, 0.65);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.20);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.35);
}
```

---

### C. Posicionamiento Espacial de los Cuadros de Texto (Text Panels / Callout Cards)
Para evitar la fatiga visual y preservar el área de interés del video (el producto, la grifería, la motobomba o la caída del agua):

```
+-----------------------------------------------------------------------------+
| [Viewport de Video / Hero Cinemático 100vw x 100vh]                         |
|                                                                             |
|      [ZONA LIBRE / ÁREA PROTAGÓNICA DEL PRODUCTO Y MOVIMIENTO]              |
|                                                                             |
| +-------------------------+                                                 |
| | CUADRO DE TEXTO CANÓNICO|  <-- Ubicación por defecto: Cuadrante inferior  |
| | • Tag en píldora        |      izquierdo (p-6 a p-12 de margen).          |
| | • H2 Titular            |      Nunca invade el centro focal del video.    |
| | • Párrafo resumido      |                                                 |
| | [ CTA Píldora ]         |                                                 |
| +-------------------------+                                                 |
+-----------------------------------------------------------------------------+
```

1. **Ubicación Canónica Desktop (Cuadrante Inferior Izquierdo)**:
   - Posicionamiento: `justify-end items-start` con márgenes perimetrales amplios (`p-6 sm:p-10 md:p-12`).
   - Justificación UX: La mirada del usuario occidental inicia en el ángulo superior izquierdo y desciende; anclar el panel en la base izquierda permite que el ojo recorra el producto en el centro/derecha antes de leer el llamado a la acción.
2. **Ubicación Alternativa (Cuadrante Inferior Derecho)**:
   - Exclusivo para tomas donde el producto físico esté encuadrado a la izquierda, liberando el lado opuesto.
3. **Ubicación en Mobile (Bottom-Anchor / Hoja Inferior)**:
   - Anclado al borde inferior (`bottom: 0` o margen de 16px), con ancho casi completo (`calc(100% - 32px)`). Permite que el 60-65% superior de la pantalla vertical muestre libremente la acción del video.
4. **ZONA PROHIBIDA**:
   - **Terminantemente prohibido centrar cuadros de texto sobre el tercio medio de la pantalla**. Ningún contenedor opaco o semitransparente debe ocultar el centro geométrico ni la silueta del producto en exhibición.

---

### D. Redondeos (Border-Radius) y Proporciones Geométricas
El sistema geométrico se basa en una escala jerárquica que equilibra ángulos limpios de arquitectura con suavidad táctil:

| Elemento UI | Clase Tailwind | Radio (px) | Justificación y Proporción |
| :--- | :--- | :--- | :--- |
| **Cuadros de Texto sobre Video** | `rounded-2xl` | **16px a 20px** | Geometría arquitectónica contemporánea; suaviza el impacto visual sobre el video sin caer en curvas orgánicas exageradas. |
| **Chips, Badges y Botones CTA** | `rounded-full` | **9999px (Pill)** | Contraste morfológico directo contra el cuadro `rounded-2xl`. Facilita el clic y refuerza la ergonomía táctil de Fitts ($\ge 44$px). |
| **Drawers y Bottom Sheets Móviles** | `rounded-t-3xl` | **24px a 32px** | Esquinas superiores marcadamente redondeadas para sugerir que la hoja emerge desde abajo. |
| **Swatches de Materiales / Thumbnails** | `rounded-xl` / `rounded-full` | **12px** / **Círculo** | Muestra fiel del grano de mármol o cuarzo sin esquinas duras. |
| **Price Tags Flotantes del Cursor** | `rounded-full` | **9999px (Pill)** | Micro-cápsula aerodinámica que sigue suavemente el movimiento sin bloquear el producto. |

#### Proporciones de los Cuadros de Texto:
- **Ancho Máximo en Desktop**: `max-w-md` a `max-w-lg` (**448px a 512px**). Representa aproximadamente entre el 28% y el 35% del ancho del viewport; el 65-72% restante permanece como visual pura.
- **Altura Relativa**: La altura del cuadro nunca debe exceder el **40% de la altura de la pantalla**.
- **Padding Interno**: `p-6 sm:p-7` (**24px a 28px** de respiro interno).
- **Ritmo Vertical Interno**: `space-y-3` a `space-y-3.5` (**12px a 14px** entre tag, titular, descripción y botón).

---

### E. Catálogo de Elementos Gráficos Autorizados
Para mantener una **sensación de pureza arquitectónica**, se restringen estrictamente los elementos gráficos permitidos sobre o junto a los videos y fotografías:

1. **El Isotipo "Λ" Firplak**:
   - Micro-marca de agua con opacidad del 20-30%, o sello formal de 16x16px integrado en sellos de garantía (5 Años) o badges técnicos. Nunca en escalas invasivas sobre el centro de la escena.
2. **Chips / Tag Pills Translúcidos**:
   - Píldoras compactas (`rounded-full`) con fondo `rgba(255, 255, 255, 0.10)` o color acento suave (`#7B8E90`), tipografía mayúscula con espaciado amplio (`text-[10px]` o `text-xs`, `tracking-[0.2em]`). Comunican categoría o fase scrollytelling sin saturar.
3. **Líneas Divisorias de Tensión Mínima**:
   - Trazos ultrafinos de **1px** con opacidad reducida (`border-white/10` o `border-white/15`) para separar el cuerpo de texto del botón de acción sin generar una ruptura visual violenta.
4. **Micro-Iconos de Línea Fina (Lucide trazo 1.5px)**:
   - Iconos geométricos lineales de trazo delgado: flechas direccionales (`ArrowRight` de 14x14px), lupa de zoom, o icono discreto de play/pausa.
5. **Cursor / Price Tag Flotante (Hover Tag)**:
   - Cápsula translúcida interactiva (`rounded-full`, `bg-black/60`, `backdrop-blur-md`, `border-white/20`) con etiqueta de precio o nombre de componente que flota sutilmente al pasar sobre puntos interactivos del producto.
6. **Indicadores de Progreso Lineales Ultrafinos**:
   - Barra de avance continuo de 2px de grosor ubicada al borde superior o inferior, o micro-dots circulares de 6px con halos translúcidos para denotar la fase del video/escena.

---

### F. Elementos Gráficos Excluidos (Anti-Patrones de Saturación)
Queda formalmente vetado cualquier elemento gráfico que genere contaminación visual:
- ❌ **Prohibido**: Stickers, ilustraciones vectoriales decorativas, iconos rellenos o doodles.
- ❌ **Prohibido**: Fondos sólidos y 100% opacos en cuadros flotantes sobre video (rompen la inmersión del usuario).
- ❌ **Prohibido**: Sombras difusas coloreadas con tonos saturados fuera de la escala Dutch Boy 2025.
- ❌ **Prohibido**: Múltiples botones o llamadas a la acción dentro del mismo cuadro flotante (aplica Hick's Law: 1 solo botón principal por cuadro).

---

### G. Degradados de Firma Oficiales
- **Deep Slate (Base Firplak)**: `linear-gradient(135deg, #324354 0%, #171f28 100%)` -> Solidez, arquitectura y confianza de marca.
- **Sage Hydro Flow (Hidro & Bienestar)**: `linear-gradient(135deg, #324354 0%, #7b8e90 100%)` -> Transición serena entre la base estructural y el agua en calma.
- **Linen Serenity (Mármol & Superficies)**: `linear-gradient(180deg, #ffffff 0%, #f6f3ee 100%)` -> Pureza mineral, textura noble y calidez de hogar.
- **Dark Cinematic Overlay**: `linear-gradient(180deg, rgba(50, 67, 84, 0.88) 0%, rgba(14, 19, 25, 0.96) 100%)` -> Contraste para textos superpuestos en transiciones de video.

---

## 6. Componentes de Interfaz Canónicos Validados por Leyes de UX

### A. Barra CTA Flotante (Floating Buy Bar)
*Fundamentada en **Fitts’s Law**, **Von Restorff Effect** y **Jakob’s Law**.*

- **Comportamiento**: Emerge suavemente con animación física (`translateY(0)` + `opacity: 1` en 240ms) cuando el usuario desplaza la pantalla superando el Hero inicial.
- **Contenido Ergonómico**:
  - Resumen visual en miniatura ($48 \times 48$ px).
  - Nombre del SKU y variante de acabado seleccionada.
  - Precio activo sincronizado con SAP Business One.
  - Botón primario de compra de mínimo $48$ px de altura en `--color-brand-primary` (`#324354`) con resplandor focal (`--shadow-floating-cta`).
  - Acceso directo a cuotas de financiación ADDI.
- **Adaptación Mobile**: Fijo al borde inferior (*Sticky Bottom*), garantizando interacción sin esfuerzo en la zona natural del pulgar.

### B. Swatches de Materiales y Variantes (Mix & Match)
*Fundamentada en **Hick’s Law**, **Doherty Threshold** y **Law of Similarity**.*

- **Diseño**: Círculos o rectángulos con textura fotográfica real (Mármol Sintético Blanco, Quartzstone Blanco Estelar, Maderas RH Rovere/Nogal).
- **Dimensiones**: Área táctil de $44 \times 44$ px (núcleo visual de $32$ px con padding transparente de $6$ px para Fitts).
- **Respuesta Reactiva**: Al hacer clic, el cambio de material en el modelo o imagen se efectúa en $< 150$ ms con un anillo de selección doble (`ring-2 ring-primary-500 ring-offset-2`).

### C. Trust Badges y Alertas Técnicas con Isotipo Firplak
*Fundamentada en **Selective Attention** y **Cognitive Load**.*

Los iconos minimalistas (estilo Lucide de trazo 1.5px) complementados por el isotipo **Λ** se sitúan estratégicamente para desarmar objeciones de compra:
- 🚚 **Despacho Primer Piso**: Alerta preventiva en tono Slate Green (`#7B8E90`) para evitar disputas postventa.
- 🛡️ **Garantía de Fábrica (5 Años)**: Emblema sellado con el isotipo **Λ** que refuerza el *Aesthetic-Usability Effect*.
- ⚡ **Envío Rápido (<48h)**: Destacado únicamente cuando hay inventario físico verificado.
- 🔧 **Servicio Técnico Certificado**: Conexión directa a formulario de instalación y pre-inspección.

---

## 7. Arquitectura UI y Flujos de Experiencia por Módulo

### A. Página de Inicio (Home Page)
*Detalle extendido en [pagina_inicio.md](pagina_inicio.md).*

1. **Announcement Bar & Goal-Gradient Effect**:
   - Ticker rotativo con incentivos claros: *"¡Envío Gratis por compras superiores a $X!"* o cuotas ADDI calculadas al instante.
2. **Top Bar Corporativo (Mental Model)**:
   - Iconografía canónica (teléfono, WhatsApp, usuario) para atención inmediata y B2B.
3. **Megamenú & Serial Position Effect**:
   - Posicionamiento estratégico: categorías de mayor conversión y ticket (*Hidromasajes* y *Baños*) al inicio, y *Zona Outdoor / Saldos* al final.
4. **Hero Cinematográfico (Aesthetic-Usability Effect)**:
   - Video continuo con descansos en loop de 3-4s generado con Higgsfield REAL + modelo CAD real. Carga inicial optimizada con imagen WebP estática servida por CDN (LCP < 1.2s, Doherty compliant).
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

### B. Ficha de Detalle de Producto (PDP) y Scrollytelling en 8 Fases
*Detalle extendido en [pagina_producto.md](pagina_producto.md).*

Cada fase del scrollytelling en productos Tier 1 responde a un principio psicológico específico:

```
[ PROGRESO DE SCROLL ]
0%  ────► 15% : FASE 1 - Atmósfera & Contexto       [Aesthetic-Usability Effect] (Video lifestyle continuo Higgsfield)
15% ────► 30% : FASE 2 - Aislamiento del Producto   [Selective Attention / Prägnanz] (Fondo neutro, foco en la pieza)
30% ────► 45% : FASE 3 - Giro 3D CAD Real           [Mental Model / Paradox of Active User] (Rotación interactiva al scroll)
45% ────► 60% : FASE 4 - Demostración de Material   [Miller's Law] (Callouts Mármol Sintético / 5 años garantía)
60% ────► 70% : FASE 5 - Color Swap Instantáneo     [Doherty Threshold <150ms] (Transmutación reactiva de acabados)
70% ────► 80% : FASE 6 - Ingeniería de Instalación  [Tesler's Law] (Puntos hidráulicos y escotilla 40x40 simplificados)
80% ────► 90% : FASE 7 - Mix & Match Interactivo    [Law of Common Region] (Ensamblaje de componentes compatibles)
90% ────► 100%: FASE 8 - Conversión y Cierre         [Von Restorff & Peak-End Rule] (Resumen, CTA dominante, ePayco/ADDI)
```

---

### C. Módulo Visualizador Mix & Match
*Detalle extendido en [mix_and_match.md](mix_and_match.md).*

1. **Prevención de Sobrecarga (Choice Overload & Hick)**:
   - Selección independiente en dos niveles (arriba: lavamanos, abajo: mueble) con deslizamiento horizontal suave.
2. **Absorción de Complejidad en Base de Datos (Tesler’s Law)**:
   - El usuario no debe descifrar medidas técnicas: Supabase valida en tiempo real la compatibilidad dimensional y el orificio de grifería entre la pieza superior y la inferior, deshabilitando combinaciones incompatibles.
3. **Ley de Región Común y Conectividad Uniforme**:
   - Los assets WebP transparentes comparten caja delimitadora idéntica, proyectando la ilusión física de un mueble íntegro instalado.
4. **Venta Cruzada Orientada al Objetivo (Goal-Gradient Effect)**:
   - Selección guiada de complementos (grifería compatible alta/baja, desagüe push y espejo LED) sumando el paquete con descuento visible.

---

## 8. Condiciones Técnicas y Requisitos de Pre-Instalación

*Detalle extendido en [hidromasajes.md](hidromasajes.md), [cocinas.md](cocinas.md), [zona_labores.md](zona_labores.md) y [zona_outdoor.md](zona_outdoor.md).*

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

## 9. Políticas Comerciales Inquebrantables y Comunicación Asertiva

*Detalle extendido en [conceptos_catalogo.md](conceptos_catalogo.md) y [recomendaciones_pagos_y_productos.md](recomendaciones_pagos_y_productos.md).*

Para evitar fricción post-venta sin asustar al comprador en el embudo (*Cognitive Load & Selective Attention*):

1. **Promesa de Despacho Estándar de 15 Días Hábiles**:
   - Fabricación personalizada bajo pedido. El flag ⚡ **Envío Rápido** se reserva exclusivamente para inventario con despacho en **<48h**.
2. **Restricción Estricta de Entrega en Primer Piso**:
   - Banner visible en PDP y checkout: *"La entrega de productos voluminosos se efectúa en el primer piso del domicilio. La transportadora no realiza maniobras por fachadas o escaleras"*.
3. **Plazo de 3 Días Hábiles para Reporte de Averías Estéticas**:
   - Banner preventivo en confirmación de orden y correo post-venta informando que reclamaciones por desportillados o rayones deben reportarse dentro de los primeros 3 días hábiles.
4. **Esquema Integral de Garantías de Fábrica**:
   - **5 años**: Estructuras en Mármol Sintético, Quartzstone y cascos de hidromasaje.
   - **1 a 5 años**: Muebles en aglomerado RH.
   - **5 años**: Cuerpo de grifería y mecanismos cerámicos (**1 año** en mangueras y acabados).
   - **1 año**: Componentes electromecánicos (motobombas, sopladores, luces LED).
   - **3 años**: Asadores en acero inoxidable AISI 304.

---

## 10. Stack Tecnológico, Animaciones y Separación SEO vs. Canvas

### A. Stack de Animación e Interacción
- **Lenis Smooth Scroll**: Desplazamiento inercial normalizado a 60-120 FPS.
- **GSAP 3 + ScrollTrigger**: Anclaje milimétrico de secciones (`pin: true`) con enlace directo a la posición del scroll (`scrub: 0.5`).
- **React Three Fiber + Drei (Tier 1 Hero)**: Renderizado WebGL de modelos CAD reales para rotación e inspección 360°.
- **Canvas 2D Frame Engine (Tier 2 Core)**: Secuencias pre-renderizadas en WebP/AVIF (<40 KB) para navegación fluida en dispositivos móviles de gama media.
- **Higgsfield REAL**: Video ambiental cinematográfico continuo con bucles de descanso de 3-4s para lifestyle y atmósfera exterior.

> [!CAUTION]
> **La Regla de Oro de Higgsfield**:
> - ✅ **Higgsfield define el mundo exterior**: Vapor de agua, iluminación zen, arquitectura circundante, vegetación.
> - ❌ **Higgsfield NUNCA define el producto**: Las cotas milimétricas, ubicación del desagüe y geometría se rigen al 100% por los planos CAD oficiales de Firplak.

### B. Curvas de Movimiento y Elasticidad (Física Apple)
- **Apertura de Menús / Modales**: `cubic-bezier(0.16, 1, 0.3, 1)` (Desaceleración física elegante).
- **Pulsación de Botones (Tap Feedback)**: `transform: scale(0.97)` instantáneo en 80ms, regresando a `scale(1)` con resorte elástico `cubic-bezier(0.34, 1.56, 0.64, 1)`.

### C. Separación Estricta entre SEO y Rendimiento
- **El SEO NUNCA vive dentro del Canvas o WebGL**:
  - Todo encabezado `<h1>`, `<h2>`, tabla técnica y esquema estructurado de Schema.org (`Product`, `Offer`, `AggregateRating`) se genera en el servidor (SSR/ISR) mediante HTML semántico.
  - El Canvas WebGL/2D actúa como un **overlay interactivo** en el cliente.
- **Presupuesto de Rendimiento**:
  - **LCP < 1.5s**: Primer viewport carga imagen WebP estática antes de scripts pesados.
  - Carga diferida (`next/dynamic` con `ssr: false`) en móviles para componentes WebGL.

---

## 11. Responsive Layout, Breakpoints y Ergonomía Móvil

```css
/* Puntos de interrupción responsivos */
--breakpoint-sm: 640px;  /* Mobile Vertical */
--breakpoint-md: 768px;  /* Tablets / Mobile Horizontal */
--breakpoint-lg: 1024px; /* Laptops / Desktop */
--breakpoint-xl: 1280px; /* Monitores Grandes */
--breakpoint-2xl: 1536px; /* Pantallas Ultra-Wide */
```

### Reglas Ergonómicas para Dispositivos Móviles:
1. **Regla del Pulgar (Thumb Zone)**: Los elementos de navegación secundaria se colocan en el tercio superior; los elementos transaccionales primarios (`Añadir al Carrito`, `Ver Carrito`, `Filtrar`) se sitúan invariablemente en el tercio inferior.
2. **Bottom Sheets en lugar de Modales Centrados**: Los selectores complejos (guía de medidas, cotizaciones de envío, especificaciones de pre-instalación) se abren como cajones inferiores sobre superficie Lino Cálido (`#F6F3EE`), naturales al gesto táctil.
3. **Prevención de Zoom Accidental**: Tamaños de fuente en `input`, `select` y `textarea` fijados en un mínimo de **16px** en mobile para impedir el zoom involuntario en navegadores iOS Safari / WebKit.

---

## 12. Checklist Heurístico y de Identidad Integral

Todo nuevo componente, pantalla o flujo nuevo en el e-commerce de Firplak debe validar el siguiente checklist antes de su publicación:

- [ ] **Paleta Oficial Dutch Boy 2025**: ¿Se respeta la base Azul Oscuro `#324354`, el Slate Green `#7B8E90`, el Negro `#000000` y el Lino Cálido `#F6F3EE`?
- [ ] **Tipografía Oficial**: ¿Se emplea `Orborn Medium` para titulares de impacto/H1 y `Montserrat` para cuerpos de texto y UI?
- [ ] **Isotipo "Λ" y Contraste**: ¿El isotipo y logotipo respetan los ratios de contraste sobre fondo claro (`#324354` o `#000000`) y sobre fondo oscuro (`#F6F3EE` o blanco)?
- [ ] **Opacidad y Glassmorphism sobre Video**: ¿Los paneles flotantes aplican fondo con opacidad calibrada (60-70% en dark slate o 80% en light linen), `backdrop-filter: blur(12-16px)` y borde translúcido de 1px?
- [ ] **Protagonismo del Asset Visual**: ¿El cuadro de texto se sitúa en el cuadrante inferior (izq/der) sin obstruir el centro de la escena ni el producto físico?
- [ ] **Redondeos y Proporciones Geométricas**: ¿El cuadro de texto respeta `rounded-2xl` (16-20px), ancho `max-w-md`/`max-w-lg` y botones o chips en `rounded-full`?
- [ ] **Catálogo Gráfico Autorizado**: ¿Se eliminaron decoraciones superfluas, limitándose estrictamente a los 6 elementos autorizados (isotipo "Λ", tag pills, líneas 1px al 10%, micro-iconos 1.5px, price tag y barra de progreso)?
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

## 13. Mapeo de Enlaces Cruzados del Wiki

- [Índice General del Wiki](index.md)
- [Página de Inicio y Navegación Global](pagina_inicio.md)
- [Página de Detalle de Producto (PDP) y Scrollytelling](pagina_producto.md)
- [Módulo Visualizador Mix & Match](mix_and_match.md)
- [Conceptos del Catálogo y Políticas Comerciales](conceptos_catalogo.md)
- [Spas e Hidromasajes](hidromasajes.md)
- [Cocinas Integrales y Superficies](cocinas.md)
- [Zona de Labores y Lavaderos](zona_labores.md)
- [Zona Outdoor y Asadores BBQ](zona_outdoor.md)
- [Accesorios y Mobiliario Complementario](accesorios.md)
- [Grifería y Plomería Técnica](griferia_plomeria.md)
- [Carpintería de Obra Institucional](carpinteria_obra.md)
- [Servicios Técnicos e Instalación Certificada](servicios.md)
- [Arquitectura de Datos y Supabase](arquitectura_datos.md)
- [Pagos, ePayco y Crédito ADDI](pagos_e_integraciones.md)
- [Especificaciones SEO y Search AI](seo.md)
- [Banco de Referentes Externos y Benchmarks UX](referentes_externos.md)
