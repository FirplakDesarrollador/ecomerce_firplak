# Sistema de Diseño y Estilo Gráfico (Design System & UI Tokens)

> [!IMPORTANT]
> **Estrategia Condensada del Segmento**:
> Construir una identidad visual de nivel ultra-premium (estilo Apple / Kohler / Laufen) fundamentada rigurosamente en las **Leyes de UX (Jon Yablonski / lawsofux.com)**. Establece tokens CSS globales, ergonomía táctil (Fitts $\ge 44$px), feedback en tiempo real (Doherty $< 400$ms), tipografía distintiva (Outfit para titulares de impacto, Inter para precisión técnica), degradados de firma (Hydro Glow), elevación con glassmorphism y micro-animaciones fluidas para posicionar a Firplak como una marca de lujo accesible con cero fricción cognitiva.

Este documento define la especificación del sistema de diseño, tokens gráficos, tipografía, paleta de colores, componentes de interfaz y guías de interacción fundamentados en la psicología cognitiva y principios de interacción humana.

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
   - El acabado ultra-pulido, los degradados inspirados en agua/piedra, el glassmorphism arquitectónico y la fotografía de estudio generan una alta percepción de calidad y tolerancia emocional en compras de ticket elevado ($1.000.000 a $25.000.000 COP).
2. **Fitts’s Law (Ley de Fitts)**:
   - Todo botón primario, selector de swatch o disparador táctil tiene un área mínima de interacción de **$44 \times 44$ px**. En mobile, la acción principal de compra permanece adherida a la zona ergonómica del pulgar mediante una *Sticky Bottom Bar*.
3. **Doherty Threshold (Umbral de Doherty)**:
   - Toda interacción (cambio de variante, apertura de drawer, cálculo de cuotas ADDI o añadido al carrito) proporciona feedback visual en **$< 150$ ms** y completa su respuesta en **$< 400$ ms**. Los estados asíncronos muestran skeletons animados inmediatos para preservar el estado de flujo.
4. **Hick’s Law & Choice Overload (Ley de Hick y Sobrecarga de Elección)**:
   - La parametrización de medidas y colores se divide en pasos secuenciales o selectores de máximo 4 a 6 variantes visibles simultáneas, evitando la parálisis por análisis.
5. **Von Restorff Effect (Efecto de Aislamiento)**:
   - El CTA de conversión principal (`[Añadir al Carrito]` / `[Comprar Ahora]`) es el único elemento en pantalla que porta el contraste cromático de alta energía con resplandor focal (`--shadow-floating-cta`), desmarcándose de la paleta neutra y arquitectónica.
6. **Gestalt: Proximity & Common Region**:
   - Espaciados matemáticos jerárquicos: la distancia entre un label y su input es 4 veces menor que la separación respecto al siguiente grupo de datos. Cada SKU o combo se auto-contiene en tarjetas con límites perceptuales definidos.
7. **Postel’s Law (Ley de Robustez)**:
   - Entradas flexibles en buscadores, campos de cotización y checkout: formateo automático de cédula/NIT, teléfonos celulares y tolerancia a faltas ortográficas o sinónimos en el catálogo ("tina", "jacuzzi", "hidromasaje").

---

## 2. Paleta de Colores y Tokens CSS Globales

El sistema utiliza variables CSS globales para facilitar el mantenimiento y soportar modos claro/oscuro garantizando contraste **WCAG 2.1 AA** ($\ge 4.5:1$ en texto normal, $\ge 3:1$ en textos grandes y UI):

```css
:root {
  /* Marca Principal - Azul Firplak & Agua Premium (Jakob / Reconocimiento de Marca) */
  --color-primary-50:  #eef7ff;
  --color-primary-100: #d8edff;
  --color-primary-500: #0077c8; /* Azul Firplak Oficial - WCAG AA contra blanco */
  --color-primary-600: #005fa3; /* Hover primario */
  --color-primary-700: #004b87; /* Active primario */
  --color-primary-900: #00264d; /* Contraste profundo */

  /* Tonos de Bienestar & Hidro (Accent, Spas & Cromoterapia) */
  --color-hydro-cyan:   #00d2d3;
  --color-hydro-teal:   #01a3a4;
  --color-hydro-purple: #5f27cd; /* Acento cromoterapia LED */

  /* Materiales & Piedra Noble (Mármol Sintético / Quartzstone / RH) */
  --color-stone-marble:  #f8f9fa;
  --color-stone-quartz:  #e9ecef;
  --color-wood-rh:        #4a3728; /* Nogal resistente a la humedad */
  --color-wood-light:     #d4a373; /* Roble Nórdico */

  /* Neutrales & Estructura (Gestalt: Superficies y Fondos) */
  --color-surface-bg:    #ffffff;
  --color-surface-card:  #f8fafc;
  --color-surface-muted: #f1f5f9;
  --color-text-main:     #0f172a; /* Ratio de contraste > 12:1 */
  --color-text-muted:    #64748b; /* Ratio de contraste > 4.6:1 */
  --color-border-subtle: #e2e8f0;
  --color-border-strong: #cbd5e1;

  /* Funcionales & Estado (Cognición Clara) */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-danger:  #ef4444;
  --color-addi:    #00c389; /* Color oficial pasarela ADDI */

  /* Ergonomía & Targets Táctiles (Ley de Fitts) */
  --touch-target-min: 44px;
  --touch-target-lg: 52px;

  /* Tiempos de Respuesta y Fluidez (Umbral de Doherty & Física Apple) */
  --timing-instant: 120ms; /* Feedback táctil/hover */
  --timing-fast:    240ms; /* Transición de modales/drawers */
  --timing-smooth:  400ms; /* Límite perceptual de continuidad */
  --ease-spring:    cubic-bezier(0.16, 1, 0.3, 1);
  --ease-bounce:    cubic-bezier(0.34, 1.56, 0.64, 1);

  /* Sombras y Elevación (Ley de Prägnanz & Jerarquía Espacial) */
  --shadow-sm: 0 2px 4px rgba(15, 23, 42, 0.04);
  --shadow-md: 0 8px 16px rgba(15, 23, 42, 0.06);
  --shadow-lg: 0 16px 32px rgba(15, 23, 42, 0.08);
  --shadow-floating-cta: 0 12px 28px rgba(0, 119, 200, 0.28); /* Von Restorff */
}
```

---

## 3. Tipografía, Jerarquía Textual y Miller's Law

Se especifica el uso de **Outfit** (titulares, branding y métricas de impacto) e **Inter** (cuerpo de texto, fichas técnicas y tablas de compatibilidad).

```html
<!-- Importación Oficial de Google Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

### Reglas de Aplicación y Chunking Cognitivo

Para respetar la **Ley de Miller ($7 \pm 2$ unidades de información)** y la **Ley de Prägnanz**, las fichas técnicas y textos extensos nunca se presentan en bloques planos; se agrupan en módulos semánticos de 3 a 5 especificaciones:

| Nivel | Tipografía | Peso | Tamaño / Leading | Regla Heurística / Caso de Uso |
| :--- | :--- | :--- | :--- | :--- |
| **H1 (Hero / PDP)** | `Outfit` | 700 (Bold) | 32-44px / 1.15 | **Foco Primario**: Nombre del producto y propuesta de valor única. |
| **H2 (Secciones)** | `Outfit` | 600 (Semi-Bold) | 24-32px / 1.25 | **Estructura Escaneable**: Títulos de fases scrollytelling y categorías. |
| **H3 (Subtítulos)**| `Outfit` | 500 (Medium) | 18-22px / 1.30 | **Chunking**: Grupos de atributos (Dimensiones, Material, Eléctrico). |
| **Metrics / Num** | `Outfit` | 800 (Extra-Bold)| 28-36px / 1.00 | **Von Restorff**: Cifras de garantía (5 Años), Litros (350L) y Potencia (2 HP). |
| **Price Active** | `Outfit` | 700 (Bold) | 24-30px / 1.10 | **Claridad Comercial**: Precio en COP con separador de miles claro. |
| **Body (Cuerpo)** | `Inter` | 400 (Regular) | 15-16px / 1.60 | **Legibilidad Óptima**: Párrafos explicativos (máx. 65-75 caracteres por línea). |
| **Technical Data**| `Inter` | 500 (Medium) | 13-14px / 1.45 | **Precisión**: Datos tabulares de instalación, voltajes y pesos. |
| **Badges / Tags** | `Inter` | 600 (Semi-Bold) | 11-12px / 1.00 | **Escaneo Rápido**: *Envío Rápido <48h*, *Ahorras 25%*, *5 Años Garantía*. |

---

## 4. Degradados de Firma, Cristales y Percepción Gestalt

### A. Degradados de Firma (Signature Gradients)
- **Hydro Glow (Jacuzzis & Spas)**: `linear-gradient(135deg, #0077c8 0%, #00d2d3 100%)` -> Transmite agua en movimiento, oxigenación y bienestar.
- **Stone Luxury (Mármol & Quartz)**: `linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%)` -> Pureza mineral y soporte aséptico.
- **Dark Premium Overlay**: `linear-gradient(180deg, rgba(0, 38, 77, 0.88) 0%, rgba(15, 23, 42, 0.96) 100%)` -> Para fondos de video scrollytelling con alto contraste en textos superpuestos.

### B. Glassmorphism UI (Ley de Región Común y Profundidad Espacial)
Permite superponer controles de compra sin ocultar la visual del producto de alta gama:

```css
.glass-panel {
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: var(--shadow-lg);
  border-radius: 16px;
}

/* Modo oscuro sutil para overlay de video */
.glass-panel-dark {
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  color: #ffffff;
}
```

---

## 5. Componentes de Interfaz Validados por Leyes de UX

### A. Barra CTA Flotante (Floating Buy Bar)
*Fundamentada en **Fitts’s Law**, **Von Restorff Effect** y **Jakob’s Law**.*

- **Comportamiento**: Emerge suavemente con animación física (`translateY(0)` + `opacity: 1` en 240ms) cuando el usuario desplaza la pantalla superando el Hero inicial.
- **Contenido Ergonómico**:
  - Resumen visual en miniatura ($48 \times 48$ px).
  - Nombre del SKU y variante seleccionada.
  - Precio activo sincronizado con SAP Business One.
  - Botón primario de compra de mínimo $48$ px de altura con resplandor focal.
  - Acceso directo a cuotas de financiación ADDI.
- **Adaptación Mobile**: Fijo al borde inferior (*Sticky Bottom*), garantizando interacción sin esfuerzo en la zona natural del pulgar.

### B. Swatches de Materiales y Variantes (Mix & Match)
*Fundamentada en **Hick’s Law**, **Doherty Threshold** y **Law of Similarity**.*

- **Diseño**: Círculos o rectángulos con textura fotográfica real (Mármol Sintético Blanco, Quartzstone Blanco Estelar, Maderas RH Rovere/Nogal).
- **Dimensiones**: Área táctil de $44 \times 44$ px (núcleo visual de $32$ px con padding transparente de $6$ px para Fitts).
- **Respuesta Reactiva**: Al hacer clic, el cambio de material en el modelo o imagen se efectúa en $< 150$ ms con un anillo de selección doble (`ring-2 ring-primary-500 ring-offset-2`).

### C. Trust Badges y Alertas Técnicas
*Fundamentada en **Selective Attention** y **Cognitive Load**.*

Los iconos minimalistas (estilo Lucide de trazo 1.5px) se sitúan estratégicamente para desarmar objeciones de compra:
- 🚚 **Despacho Primer Piso**: Alerta preventiva en tono neutro para evitar disputas postventa.
- 🛡️ **Garantía de Fábrica (5 Años)**: Emblema de solidez que refuerza el *Aesthetic-Usability Effect*.
- ⚡ **Envío Rápido (<48h)**: Destacado únicamente cuando hay inventario físico verificado.
- 🔧 **Servicio Técnico Certificado**: Conexión directa a formulario de instalación y pre-inspección.

---

## 6. Animaciones, Scrollytelling y Física Visual (Doherty & Apple Design)

Para lograr una experiencia cinematográfica sin comprometer la fluidez de interacción ni el umbral de Doherty ($< 400$ ms):

### A. Stack de Animación e Interacción
- **Lenis Smooth Scroll**: Desplazamiento inercial normalizado a 60-120 FPS.
- **GSAP 3 + ScrollTrigger**: Anclaje milimétrico de secciones (`pin: true`) con enlace directo a la posición del scroll (`scrub: 0.5`).
- **React Three Fiber + Drei (Tier 1 Hero)**: Renderizado WebGL de modelos CAD reales para rotación e inspección 360°.
- **Canvas 2D Frame Engine (Tier 2 Core)**: Secuencias pre-renderizadas en WebP/AVIF (<40 KB) para navegación fluida en dispositivos móviles de gama media.
- **Higgsfield REAL**: Video ambiental cinematográfico exclusivo para lifestyle y atmósfera exterior.

> [!CAUTION]
> **La Regla de Oro de Higgsfield**:
> - ✅ **Higgsfield define el mundo exterior**: Vapor de agua, iluminación zen, arquitectura circundante, vegetación.
> - ❌ **Higgsfield NUNCA define el producto**: Las cotas milimétricas, ubicación del desagüe y geometría se rigen al 100% por los planos CAD oficiales de Firplak.

### B. Curvas de Movimiento y Elasticidad
- **Apertura de Menús / Modales**: `cubic-bezier(0.16, 1, 0.3, 1)` (Desaceleración física elegante).
- **Pulsación de Botones (Tap Feedback)**: `transform: scale(0.97)` instantáneo en 80ms, regresando a `scale(1)` con resorte elástico `cubic-bezier(0.34, 1.56, 0.64, 1)`.

---

## 7. Responsive Layout, Breakpoints y Ergonomía Móvil

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
2. **Bottom Sheets en lugar de Modales Centrados**: Los selectores complejos (guía de medidas, cotizaciones de envío, especificaciones de pre-instalación) se abren como cajones inferiores deslizables hacia arriba, naturales al gesto táctil.
3. **Prevención de Zoom Accidental**: Tamaños de fuente en `input`, `select` y `textarea` fijados en un mínimo de **16px** en mobile para impedir el zoom involuntario en navegadores iOS Safari / WebKit.

---

## 8. Checklist Heurístico de Aprobación de Componentes UI

Todo nuevo componente o cambio de diseño en Firplak debe validar el siguiente checklist antes de su pase a producción:

- [ ] **Fitts’s Law**: ¿El elemento táctil mide al menos $44 \times 44$ px?
- [ ] **Doherty Threshold**: ¿La interfaz responde con estado activo/hover en $< 150$ ms y completa su carga en $< 400$ ms?
- [ ] **Von Restorff Effect**: ¿El CTA principal sobresale visualmente sobre cualquier acción secundaria circundante?
- [ ] **Hick’s Law**: ¿Se evita saturar al usuario con más de 5 a 6 decisiones simultáneas?
- [ ] **Miller’s Law**: ¿La información técnica está agrupada (*chunking*) en bloques digeribles de 3 a 5 datos?
- [ ] **Gestalt (Proximidad & Región Común)**: ¿Los elementos relacionados comparten contenedor y espaciado consistente?
- [ ] **Jakob’s Law**: ¿Se respetan los convenios canónicos de e-commerce (carrito arriba derecha, búsqueda clara, checkout sin distracciones)?
- [ ] **Postel’s Law**: ¿El componente tolera entradas flexibles de datos sin mostrar bloqueos o errores frustrantes?
