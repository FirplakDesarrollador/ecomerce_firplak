# Referente GUI: Kohler

> [!IMPORTANT]
> **Estrategia Condensada del Segmento**:
> Implementación del patrón de arquitectura de información masiva, Megamenú navegable multinivel, segmentación clara entre líneas de productos por ambiente (Baño, Cocina, Zona de Labores, Exterior) e integración de servicios técnicos/instaladores para Firplak.

---

## 🔗 Datos de la Fuente
- **Marca / Referente**: Kohler Co.
- **URL**: `https://www.kohler.com/en`
- **Categoría GUI**: Global Kitchen & Bath E-commerce Navigation & Professional Catalog Hierarchy.

---

## 🎨 Principios Visuales y UI Destacados

1. **Megamenú Multinivel Categorizado**:
   - Menú de navegación principal con jerarquía amplia: Categoría Principal -> Subcategoría -> Tipología de Instalación -> Destacados / Colecciones.
   - Inclusión de miniaturas visuales dentro del mismo menú desplegable para guiado rápido del usuario.
2. **Navegación Dual B2C / B2B**:
   - Accesos directos diferenciados para Propietarios de Hogar, Plomeros/Instaladores y Diseñadores/Especificadores Profesionales.
3. **Módulo de Inspiración "Shop the Look" / Ambientes**:
   - Capacidades de exploración por estilos (Moderno, Industrial, Minimalista, Clásico) con compra directa de todos los elementos del ambiente.
4. **Integración de Servicios Técnicos y Repuestos**:
   - Sección visible para agendamiento de visitas, manuales de instalación, planos CAD/BIM y solicitud de repuestos oficiales.

---

## 🛠️ Aplicación en el Sitio Web de Firplak

| Componente Kohler | Módulo Firplak | Aplicación Concreta en Firplak |
| :--- | :--- | :--- |
| Megamenú Multinivel con Miniaturas | `pagina_inicio.md` | Megamenú global de Firplak dividiendo: *Baños* (Lavamanos, Muebles, Tinas), *Cocinas*, *Zona de Labores*, *Outdoor/Spas* y *Servicios*. |
| Hub de Instaladores y Repuestos | `servicios.md` | Módulo de servicios de Pre-inspección e Instalación Certificada Firplak, agendamiento online y descarga de manuales/planos técnicos. |
| Shop the Look / Espacios Integrados | `pagina_inicio.md` & `mix_and_match.md` | Galería interactiva en la Home donde se puede comprar el combo completo de baño (Mueble + Lavamanos + Grifería + Espejo). |

---

## 📐 Especificación Técnica para Desarrollo

- **Estructura del Megamenú**: Componente Next.js accessible con teclado (`aria-expanded`, `role="menu"`), precarga de categorías y optimización de renderizado para evitar layout shifts (CLS).
- **SEO & Search**: Buscador global integrado con autocompletado y filtros facetados por medidas, material y tipo de grifería.
