# SEO para Categorías (PLPs) - Ecommerce Firplak

Las páginas de listado de productos (PLPs o páginas de categorías) son los pilares de atracción de tráfico con alta intención comercial para términos genéricos del sector (ej. "muebles de baño", "bañeras de hidromasaje").

---

## 1. Paginación y Carga de Productos

* **[MUST]** Si se implementa scroll infinito o carga mediante un botón "Ver más", debe existir una paginación tradicional subyacente accesible mediante enlaces HTML reales (`<Link href="/categoria/banos?page=2">`). Esto garantiza que los motores de búsqueda y bots de IA puedan descubrir y rastrear todos los productos del catálogo paginado.
* **[SHOULD]** No usar la técnica de scroll infinito puro basada en JavaScript que no actualiza la URL del navegador. Se debe utilizar la History API de HTML5 para actualizar dinámicamente la URL (ej. `?page=2`) a medida que el usuario avanza, permitiendo también la indexación limpia.
* **[MUST]** Asegurarse de que el primer lote de productos (generalmente entre 12 y 24 ítems) esté pre-renderizado en el HTML del servidor (RSC/SSR) para evitar una página de categoría vacía en el primer renderizado.

---

## 2. Navegación Facetada y Filtros Dinámicos

La navegación facetada (filtros de color, tamaño, precio, material) puede crear millones de URLs duplicadas o de bajo valor si no se controla adecuadamente.

* **[MUST]** Las URLs generadas por la selección de filtros interactivos de cliente (ej. `/categoria/banos?color=blanco&precio_min=100000`) **deben configurarse con una etiqueta canónica que apunte a la página de categoría limpia** (ej. `<link rel="canonical" href="https://www.firplak.com/categoria/banos" />`), excepto si el filtro corresponde a una subcategoría indexable bien definida.
* **[MUST]** Los parámetros de filtrado puramente interactivos de ordenación (ej. `?sort=price_asc`) y rangos de precio efímeros no deben rastrearse. Configurar las reglas correspondientes en `robots.txt` o utilizar directivas `noindex` dinámicas cuando estos filtros estén presentes y activos.
* **[SHOULD]** Si una combinación específica de filtros tiene volumen de búsqueda semántica (ej. "muebles de baño de madera suspendidos"), se puede crear una subcategoría estática y dedicada con una URL amigable (ej. `/categoria/banos/muebles-madera-suspendidos`) con indexación permitida.

---

## 3. Optimización de Contenido en Categorías

Las PLPs no deben ser únicamente rejillas de productos; requieren valor textual para los buscadores de nueva era.

* **[MUST]** Colocar un título `<h1>` descriptivo al inicio del listado de la categoría (ej. `<h1>Bañeras de Hidromasaje Firplak</h1>`).
* **[SHOULD]** Incluir un texto de introducción de 1 o 2 párrafos antes del listado para contextualizar la categoría con palabras clave secundarias.
* **[SHOULD]** Incorporar un bloque de texto expandido al final de la página (después de la rejilla de productos) con información de interés para el usuario, guías de compra rápidas o FAQs dinámicas del módulo. Esto enriquece semánticamente la página y mejora la indexación de entidades por parte de los LLM de búsqueda.
* **[MUST]** El contenido dinámico de categorías debe estructurarse mediante marcado JSON-LD del tipo `ItemList` indicando las URLs ordenadas de los productos listados en la página actual.
