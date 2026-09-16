# Referente GUI: Apple AirPods Pro

> [!IMPORTANT]
> **Estrategia Condensada del Segmento**:
> Implementación del estándar de Scroll Storytelling cinemático, despiece 3D progresivo y animación sincronizada con el scroll (scrubbing canvas) para las páginas de detalle de producto (PDP) de alta gama en Firplak (Spas, Hidromasajes y Tinas de Lujo).

---

## 🔗 Datos de la Fuente
- **Marca / Referente**: Apple Inc.
- **URL**: `https://www.apple.com/airpods-pro/`
- **Categoría GUI**: Scroll-Driven Cinematic Storytelling & Interactive Product Breakdown.

---

## 🎨 Principios Visuales y UI Destacados

1. **Scrubbing Canvas (Secuencia de Fotogramas 3D)**:
   - Avance fotograma a fotograma vinculado al desplazamiento vertical del usuario (`scrollY`).
   - Rotación suave y despiece dinámico del producto (explosionado de componentes).
2. **Tipografía Monumental y Alto Contraste**:
   - Encabezados en gran escala (*display size*) con máxima legibilidad sobre fondo oscuro (`#000000` / `#0B0B0C`).
   - Jerarquía clara entre narrativa inspiracional y detalles técnicos.
3. **Hotspots & Micro-callouts Flotantes**:
   - Tarjetas flotantes fijas (*sticky overlay*) que aparecen y desaparecen con transiciones de opacidad y escala según el rango de scroll.
4. **Sub-bar de Navegación Persistente (Sticky Header Bar)**:
   - Header secundario que se fija en la parte superior con el nombre del modelo, anclas de sección (Características, Especificaciones) y botón CTA "Comprar" siempre visible.

---

## 🛠️ Aplicación en el Sitio Web de Firplak

| Componente Apple | Módulo Firplak | Aplicación Concreta en Firplak |
| :--- | :--- | :--- |
| Despiece del Chip H2 & Drivers | `hidromasajes.md` (PDP Spa/Hidromasaje) | Animación 3D en scroll que despieza el vaso de hidromasaje, mostrando la estructura reforzada en mármol sintético, motobomba silenciosa, jets de hidromasaje y acometida. |
| Demostración de Cancelación de Ruido | `pagina_producto.md` (PDP Tinas & Lavamanos) | Comparativa interactiva deslizable que muestra el acabado superficial *Easy Clean* y la resistencia al rayado/manchas. |
| Sticky Sub-bar con CTA "Buy" | Global PDP (`pagina_producto.md`) | Barra fija superior al hacer scroll que mantiene visible la línea (ej. *Spa Ibiza 5 Personas*), precio actual y botón "Agregar al Carrito" / "Personalizar". |

---

## 📐 Especificación Técnica para Desarrollo

- **Componente Next.js**: `<ProductScrollCanvas />` (especificado en `pagina_producto.md`).
- **Técnica de Renderizado**: HTML5 Canvas 2D / WebGL alimentado por secuencia de frames WebP comprimidos (60-120 frames, <40 KB/frame) cargados mediante buffering progresivo.
- **Accesibilidad & Performance**: Fallback estático mediante imagen PNG fija cuando el navegador detecta `prefers-reduced-motion`.
