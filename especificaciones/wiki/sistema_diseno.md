# Sistema de Diseño y Estilo Gráfico (Design System & UI Tokens)

> [!IMPORTANT]
> **Estrategia Condensada del Segmento**:
> Construir una identidad visual de nivel ultra-premium (estilo Apple / Kohler / Laufen) que transmita agua, piedra y bienestar arquitectónico. Establece tokens CSS globales, tipografía distintiva (Outfit para titulares y números de impacto, Inter para precisión técnica), degradados de firma (Hydro Glow), elevación con glassmorphism y micro-animaciones fluidas para posicionar a Firplak como una marca de lujo accesible.

Este documento define la especificación del sistema de diseño, tokens gráficos, tipografía, paleta de colores, componentes de interfaz y guías de animación para la experiencia visual premium de Firplak E-commerce.

---

## 1. Intención de Diseño y Filosofía Visual

La plataforma debe transmitir **elegancia arquitectónica, agua/bienestar premium y sofisticación técnica**:

- **Estética Ultra-Premium**: Sensación de catálogo interactivo de lujo (estilo Apple / Kohler / Laufen).
- **Sensación Orgánica y Fluida**: Uso de degradados profundos inspirados en agua, piedra y madera noble (Mármol Sintético, Quartzstone, maderas RH).
- **Glassmorphism & Elevación Sutil**: Paneles semi-transparentes con desenfoque de fondo (`backdrop-filter: blur()`) para menús flotantes, filtros y la barra CTA.
- **Claridad de Datos**: Tipografía técnica limpia y números destacados para datos clave (litros, potencia, garantía, dimensiones).

---

## 2. Paleta de Colores y Tokens CSS

El sistema utiliza variables CSS globales para facilitar el mantenimiento y soportar modos claro/oscuro:

```css
:root {
  /* Marca Principal - Azul Firplak & Agua Premium */
  --color-primary-50:  #eef7ff;
  --color-primary-100: #d8edff;
  --color-primary-500: #0077c8; /* Azul Firplak Oficial */
  --color-primary-700: #004b87;
  --color-primary-900: #00264d;

  /* Tonos de Bienestar & Hidro (Accent & Spas) */
  --color-hydro-cyan:   #00d2d3;
  --color-hydro-teal:   #01a3a4;
  --color-hydro-purple: #5f27cd; /* Cromoterapia LED */

  /* Materiales & Piedra Noble (Mármol / Quartzstone / RH) */
  --color-stone-marble:  #f8f9fa;
  --color-stone-quartz:  #e9ecef;
  --color-wood-rh:        #4a3728;
  --color-wood-light:     #d4a373;

  /* Neutrales & Estructura */
  --color-surface-bg:    #ffffff;
  --color-surface-card:  #f4f6f8;
  --color-text-main:     #0f172a;
  --color-text-muted:    #64748b;
  --color-border-subtle: #e2e8f0;

  /* Funcionales & Estado */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-danger:  #ef4444;

  /* Sombras y Elevación */
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.04);
  --shadow-md: 0 8px 16px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 16px 32px rgba(0, 0, 0, 0.12);
  --shadow-floating-cta: 0 12px 28px rgba(0, 119, 200, 0.25);
}
```

---

## 3. Tipografía y Jerarquía Textual

Se especifica el uso de **Outfit** (titulares, datos destacados y números) e **Inter** (cuerpo de texto, fichas técnicas y tablas).

```html
<!-- Importación Google Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### Reglas de Aplicación Tipográfica

| Elemento | Font Family | Peso | Caso de Uso |
| :--- | :--- | :--- | :--- |
| **H1 (Titles PDP)** | `Outfit` | 700 / Bold | Nombres de productos y titulares Hero |
| **H2 (Secciones)** | `Outfit` | 600 / Semi-Bold | Titulares de pasos del Scroll Animado |
| **H3 (Subsecciones)**| `Outfit` | 500 / Medium | Nombres de kits y variaciones |
| **Metrics / Num** | `Outfit` | 700 / Bold | Cifras de garantía, dimensiones y litros |
| **Body (Cuerpo)** | `Inter` | 400 / Regular | Textos descriptivos y párrafos |
| **Labels & Badges** | `Inter` | 600 / Semi-Bold | Promesas de entrega, trust badges y tags |

---

## 4. Degradados, Cristales y Capas Visuales

### A. Degradados de Firma (Signature Gradients)
- **Hydro Glow (Jacuzzis & Spas)**: `linear-gradient(135deg, #0077c8 0%, #00d2d3 100%)`
- **Stone Luxury (Mármol & Quartz)**: `linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%)`
- **Dark Premium Overlay**: `linear-gradient(180deg, rgba(0, 38, 77, 0.85) 0%, rgba(15, 23, 42, 0.95) 100%)`

### B. Glassmorphism UI (Tarjetas & CTA Flotante)
```css
.glass-panel {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: var(--shadow-lg);
}
```

---

## 5. Componentes Gráficos e Interacción UI

### A. Barra CTA Flotante (Floating Buy Bar)
- **Comportamiento**: Aparece suavemente (`fade-in-slide-up`) cuando el usuario supera el Hero del producto.
- **Diseño**: Fondo blanco translucido con *Glassmorphism*, sombra intensa en `--color-primary-500` para el botón principal.

### B. Swatches de Color y Materiales (Swatches con Textura Real)
- **Mármol Sintético / Quartzstone**: Círculos o rectángulos redondeados con textura fotográfica micro-optimizada.
- **Estado Seleccionado**: Anillo exterior doble con animación de escala (`transform: scale(1.1)`) y sombra de foco.

### C. Trust Badges e Iconografía
- Iconos minimalistas tipo **Lucide Icons** o SVG inline (Línea fina 1.5px stroke):
  - 🚚 *Camión de despacho primer piso*
  - 🛡️ *Escudo de garantía de 5 años*
  - ⚡ *Rayo para checkout rápido / ADDI*

---

## 6. Animaciones y Transiciones (FIRPLAK Experience Stack)

Para lograr una experiencia visual cinematográfica y de producto inmersiva estilo Apple / Laufen sin sacrificar rendimiento móvil ni Core Web Vitals, se define el siguiente stack oficial de experiencia visual:

### A. Stack Tecnológico de Experiencia
- **GSAP 3 + ScrollTrigger**: Librería núcleo para el anclaje de secciones (*pinning*), sincronización precisa fotograma a fotograma (*scrub*), transiciones de cámara y timelines narrativos.
- **Lenis Smooth Scroll (`@studio-freight/lenis`)**: Motor de desplazamiento inercial suave que unifica la sensación de scroll en mouse, trackpad y touch.
- **Three.js + React Three Fiber + Drei (Tier 1 Hero Products)**: Renderizado WebGL de modelos CAD reales para rotación interactiva al scroll, explosión de partes y transmutación de materiales PBR.
- **Compresión 3D**: Modelos exportados en **GLB / glTF** con compresión de geometría **Draco / Meshopt** y texturas GPU comprimidas en **KTX2** (<2.5 MB).
- **Canvas Frame Scrubbing Engine (Secuencias 2D)**: Alternativa ligera para despieces de producto pre-renderizados en Blender exportados a fotogramas WebP/AVIF (<40 KB c/u).
- **Higgsfield REAL (Cinematografía Lifestyle)**: Motor de generación de clips cortos de video (3 a 6 segundos) para fondos ambientales, iluminación arquitectónica y movimiento de agua/vapor.

### B. La Regla de Oro de Higgsfield (Atmósfera vs. Realidad de Producto)
*   ✅ **Higgsfield define el mundo alrededor del producto**: Baños contemporáneos, iluminación cenital, caídas de agua, vapor, destellos de luz, transiciones entre espacios y lifestyle.
*   ❌ **Higgsfield NUNCA define el producto**: Medidas, geometría física, ubicación del desagüe, orificios de grifería, color comercial exacto, espesores ni compatibilidades técnicas. Para el producto se utiliza estrictamente el modelo CAD industrial de Firplak o fotografía de estudio.

### C. Estrategia de Prototipado y Despliegue Escalonado
No se construye una web tipo Awwwards personalizada para cada SKU (lo que sería inmantenible). Se implementa:
1. **Fase 1 (Prototipo Inicial)**: Validación exhaustiva de la experiencia en **un solo producto representativo (ej. Lavamanos Koa)** con narrativa de 8 pasos.
2. **Fase 2 (Templates de Categoría)**: Parametrización en 5 templates maestros (`StoryLavamanos`, `StoryMuebleBaño`, `StoryCocina`, `StoryHidromasaje`, `StoryOutdoor`).
3. **Fase 3 (Tiers Comerciales)**: Despliegue según criticidad (Tier 1 Hero con 3D R3F, Tier 2 Core con fotografía y GSAP, Tier 3 Long Tail ágil).

### D. Curvas de Tiempo (Easing Curves)
- **Smooth Premium**: `cubic-bezier(0.16, 1, 0.3, 1)` (para modales, menús y transiciones in-scroll).
- **Hover Micro-interaction**: `cubic-bezier(0.34, 1.56, 0.64, 1)` (efecto elástico sutil al presionar botones).

### E. Scroll-Driven Animations y Separación de Capas
- **Capa Base SSR (HTML/SEO)**: Texto, encabezados, precios base y tablas técnicas renderizadas en servidor para indexación inmediata de motores de búsqueda.
- **Capa de Experiencia (Client Overlay)**: Canvas 2D / Canvas WebGL superpuesto que responde al scroll sin ocultar el contenido a los rastreadores web.

---

## 7. Responsive Layout & Breakpoints

```css
/* Puntos de interrupción responsivos */
--breakpoint-sm: 640px;  /* Mobile */
--breakpoint-md: 768px;  /* Tablets */
--breakpoint-lg: 1024px; /* Desktop / Laptops */
--breakpoint-xl: 1280px; /* Pantallas grandes & Monitores */
```
- **Mobile First**: En dispositivos móviles, la barra flotante CTA se ubica fija en la parte inferior (*Sticky Bottom*), y los selectores de variantes se despliegan en un drawer/bottom sheet interactivo.
