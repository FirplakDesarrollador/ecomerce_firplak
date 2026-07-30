# SEO On-Page - Ecommerce Firplak

El SEO On-Page abarca la optimización de los elementos visibles dentro del sitio para mejorar su legibilidad frente a los buscadores y optimizar la experiencia de usuario.

---

## 1. Jerarquía de Encabezados (Headings)

Una estructura clara y semántica ayuda tanto a los bots de búsqueda como a los lectores de pantalla a entender la jerarquía del contenido.

* **[MUST]** Debe existir **un único tag `<h1>`** por página. Este debe contener la palabra clave principal de la página (ej. nombre exacto del producto en PDP o nombre de categoría en PLP).
* **[MUST]** Respetar el orden jerárquico secuencial de encabezados. No saltar niveles (ej. no colocar un `<h3>` directamente debajo de un `<h1>` sin pasar por un `<h2>`).
* **[MUST]** Los títulos de los productos dentro de las rejillas de categorías (Category Grids) o carruseles recomendados **deben representarse con etiquetas `<h3>` o `<h4>`**, nunca con `<h2>` ni `<h1>`. Esto reserva los `<h2>` para los encabezados de las secciones temáticas principales de la página.
* **[SHOULD]** Los encabezados `<h2>` y `<h3>` deben incorporar palabras clave secundarias o de cola larga de forma natural.

```html
<!-- Ejemplo de estructura correcta en una página de categoría -->
<h1>Muebles de Baño</h1>

<h2>Categorías Destacadas</h2>
<!-- Subcategorías -->
<h3>Muebles de Baño Suspendidos</h3>
<h3>Muebles de Baño con Lavamanos</h3>

<h2>Nuestras Recomendaciones para Baño</h2>
<!-- Tarjeta de Producto -->
<h4>Mueble de Baño Milán 60cm</h4>
```

---

## 2. Estructura Semántica HTML5

* **[MUST]** Utilizar componentes semánticos HTML5 en lugar de divs genéricos para estructurar las secciones del sitio:
  * `<header>` para la barra de navegación y logo superior.
  * `<nav>` para menús de navegación globales, menús de categorías secundarias y breadcrumbs.
  * `<main>` para englobar el contenido exclusivo de la página. Solo debe haber uno por página.
  * `<section>` para agrupar bloques lógicos relacionados en páginas largas (ej. características, especificaciones técnicas, testimonios). Cada `<section>` debería tener al menos un encabezado (`<h2>`-`<h6>`).
  * `<article>` para publicaciones del blog, reviews de usuarios o noticias independientes.
  * `<aside>` para barras laterales de filtros en páginas de categorías o contenido secundario.
  * `<footer>` para el pie de página de la web con enlaces corporativos y avisos legales.
* **[SHOULD]** Utilizar la etiqueta `<time>` con el atributo `datetime` para representar fechas legibles por buscadores en artículos del blog e información de modificaciones de producto.

---

## 3. Enlazado Interno (Internal Linking)

* **[MUST]** No usar enlaces vacíos (`href="#"` o `href="javascript:void(0)"`) para elementos interactivos que no navegan. En su lugar, usar la etiqueta `<button>`. Los buscadores rastrean y desperdician presupuesto de rastreo en URLs vacías.
* **[MUST]** Implementar siempre enlaces semánticos reales usando el componente `<Link>` de `next/link` en lugar de redirecciones programáticas con `router.push()` de Next.js para navegación regular. Los crawlers de búsqueda no siguen las interacciones de clic de JS puro para rastrear el sitio.
* **[SHOULD]** Implementar migas de pan (**Breadcrumbs**) visibles y enlazadas en todas las PDPs y PLPs secundarias. Esto fortalece la arquitectura semántica del sitio y define la ruta lógica del catálogo.
* **[SHOULD]** Usar textos de anclaje (Anchor Text) descriptivos. Evitar textos genéricos como "Ver más", "Hacer clic aquí" o "Leer artículo". Usar frases con palabras clave como "Descargar ficha técnica de Mueble Milán" o "Ver catálogo de bañeras de hidromasaje".

---

## 4. Densidad y Optimización de Palabras Clave

* **[SHOULD]** Colocar la palabra clave principal dentro del primer párrafo del contenido de la página (dentro de los primeros 100-150 caracteres).
* **[SHOULD]** Mantener una densidad natural de la palabra clave entre el **1% y el 2.5%** del contenido escrito para evitar prácticas de Keyword Stuffing, que son penalizadas.
* **[MUST]** Utilizar sinónimos y variaciones semánticas relacionadas con el producto o sector para facilitar la comprensión contextual de los LLM (AISO/GEO).
