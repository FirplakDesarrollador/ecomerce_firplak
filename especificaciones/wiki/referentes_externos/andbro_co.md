# Referente GUI: Andbro Co (Works Portfolio)

> [!IMPORTANT]
> **Estrategia Condensada del Segmento**:
> Aplicación de retícula editorial minimalista, tipografía suiza sobria y distribución con amplio espacio negativo para la sección de Proyectos Institucionales, Carpintería de Obra B2B y Showroom de Arquitectura de Firplak.

---

## 🔗 Datos de la Fuente
- **Marca / Referente**: Andbro Co
- **URL**: `https://www.andbro.co/works`
- **Categoría GUI**: Editorial Portfolio & High-End B2B Grid Architecture.

---

## 🎨 Principios Visuales y UI Destacados

1. **Retícula Asimétrica y Espacio Negativo (Whitespace)**:
   - Uso generoso de márgenes y espaciado pasivo que otorga un carácter exclusivo, limpio y altamente profesional.
   - Distribución irregular pero armónica de tarjetas de proyectos, evitando el aspecto cuadriculado rígido de las tiendas tradicionales.
2. **Hover State & Image Reveal Sofisticado**:
   - Cursor personalizado interactivo que muestra vistas previas o etiquetas informativas (ej. *Ver Proyecto*, *Materiales Usados*) al pasar sobre cada proyecto.
3. **Tipografía Sans-serif de Alta Densidad Visual**:
   - Uso de tipografías geométricas o neo-grotescas en pesos contrastantes (Ultra Light vs Medium) que comunican precisión arquitectónica.
4. **Filtros Categorizados con Transiciones Sutiles**:
   - Menú de filtrado minimalista por categoría de obra/proyecto sin recargas de página ni saltos bruscos de diseño.

---

## 🛠️ Aplicación en el Sitio Web de Firplak

| Componente Andbro Co | Módulo Firplak | Aplicación Concreta en Firplak |
| :--- | :--- | :--- |
| Portfolio Grid Asimétrico | `carpinteria_obra.md` | Galería de casos de éxito B2B: Proyectos para constructoras (Amarilo, Marval, Bolívar) mostrando cocinas, lavaderos y baños instalados a gran escala. |
| Hover Image Reveal & Cursor | `pagina_inicio.md` (Sección Showrooms & Inspiración) | Tarjetas interactivas en la Home donde al pasar el cursor se revela el render 3D o foto real de un espacio amueblado con Firplak. |
| Filtros Minimalistas de Categoría | `carpinteria_obra.md` / `conceptos_catalogo.md` | Selector de segmento de proyectos (Residencial, Hoteles, Institucional, Hospitalario) con filtrado instantáneo. |

---

## 📐 Especificación Técnica para Desarrollo

- **Layout Grid**: CSS Grid con columnas flexibles y espaciado dinámico (`gap: clamp(1.5rem, 4vw, 4rem)`).
- **Efectos Micro-interacción**: CSS Transitions optimizadas con GPU (`transform: translate3d(...)`) e hidratación progresiva en React.
