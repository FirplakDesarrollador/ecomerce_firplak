# Especificaciones de SEO - Ecommerce Firplak

Este documento contiene la documentación principal y las instrucciones oficiales de SEO para el desarrollo y mantenimiento del ecommerce de Firplak. 

Para facilitar la consulta técnica y mantener los archivos organizados por áreas de especialización, la documentación detallada se encuentra dividida en módulos independientes dentro de la carpeta `/especificaciones/seo/`.

---

## 📌 Índice de Módulos de SEO

### 1. Aspectos Técnicos y Rendimiento
* **[SEO Técnico](file:///c:/Users/gabriel.molina/Desktop/ecomerce_firplak/especificaciones/seo/seo_tecnico.md)**: Core Web Vitals (LCP, INP, CLS), optimización de renderizado (React Server Components vs. Client Components), Lazy Loading y tiempos de servidor (TTFB).
* **[SEO On-Page](file:///c:/Users/gabriel.molina/Desktop/ecomerce_firplak/especificaciones/seo/seo_onpage.md)**: Estructura jerárquica de encabezados (H1-H4), marcado semántico HTML5 y directrices de enlazado interno.
* **[Optimización de Imágenes](file:///c:/Users/gabriel.molina/Desktop/ecomerce_firplak/especificaciones/seo/imagenes.md)**: Implementación de `next/image` en Next.js, atributos alt semánticos, formatos WebP/AVIF y cacheo en CDN.
* **[Estructura de URLs](file:///c:/Users/gabriel.molina/Desktop/ecomerce_firplak/especificaciones/seo/urls.md)**: Definición de URLs amigables, slugificación de productos y manejo de caracteres especiales.
* **[Direcciones Canónicas](file:///c:/Users/gabriel.molina/Desktop/ecomerce_firplak/especificaciones/seo/canonical.md)**: Implementación de la etiqueta canonical en Next.js App Router para variaciones de productos y filtros.

### 2. Estructura de Contenidos y Catálogo
* **[SEO para Productos (PDPs)](file:///c:/Users/gabriel.molina/Desktop/ecomerce_firplak/especificaciones/seo/seo_productos.md)**: Reglas de SEO para variaciones complejas de productos, inventario dinámico sincronizado con SAP e integraciones.
* **[SEO para Categorías (PLPs)](file:///c:/Users/gabriel.molina/Desktop/ecomerce_firplak/especificaciones/seo/seo_categorias.md)**: Optimización de listados, filtros de navegación facetada y paginación de productos.
* **[SEO para Blog](file:///c:/Users/gabriel.molina/Desktop/ecomerce_firplak/especificaciones/seo/seo_blog.md)**: Estructura de publicaciones, enlazado interno hacia el catálogo y directrices de autoría (E-E-A-T).
* **[SEO Local](file:///c:/Users/gabriel.molina/Desktop/ecomerce_firplak/especificaciones/seo/seo_local.md)**: Optimización de páginas para tiendas y showrooms de Firplak, Google Business Profile y marcado local.

### 3. Indexación, Marcado y Redirecciones
* **[Datos Estructurados (Schema.org)](file:///c:/Users/gabriel.molina/Desktop/ecomerce_firplak/especificaciones/seo/schema_markup.md)**: Marcado JSON-LD para productos, variaciones (`ProductGroup`), organización, breadcrumbs y FAQs.
* **[Sitemap XML](file:///c:/Users/gabriel.molina/Desktop/ecomerce_firplak/especificaciones/seo/sitemap.md)**: Generación dinámica del archivo `sitemap.xml` en Next.js y segmentación del catálogo.
* **[Configuración de Robots.txt](file:///c:/Users/gabriel.molina/Desktop/ecomerce_firplak/especificaciones/seo/robots.md)**: Reglas de acceso para motores de búsqueda tradicionales y agentes de Inteligencia Artificial (ChatGPT, Claude, Gemini).
* **[Redirecciones y Estados HTTP](file:///c:/Users/gabriel.molina/Desktop/ecomerce_firplak/especificaciones/seo/redirecciones.md)**: Configuración de redirecciones 301, 302 y 410 en Next.js, y ciclo de vida de productos descatalogados.

### 4. Integraciones y Analítica
* **[Google Search Console](file:///c:/Users/gabriel.molina/Desktop/ecomerce_firplak/especificaciones/seo/google_search_console.md)**: Configuración de propiedad, validación de URLs y monitoreo de errores de indexación.
* **[Google Merchant Center](file:///c:/Users/gabriel.molina/Desktop/ecomerce_firplak/especificaciones/seo/google_merchant.md)**: Generación dinámica de feeds para Google Shopping e integración de variaciones con SAP.
* **[Google Analytics y Consent Mode v2](file:///c:/Users/gabriel.molina/Desktop/ecomerce_firplak/especificaciones/seo/analytics.md)**: Implementación de GTM, GA4 y cumplimiento de normativas de cookies con Consent Mode.
* **[Píxeles de Conversión y Eventos](file:///c:/Users/gabriel.molina/Desktop/ecomerce_firplak/especificaciones/seo/eventos.md)**: Seguimiento de eventos clave (purchase, add_to_cart) y píxeles de Meta, TikTok y LinkedIn.

### 5. Optimización para Inteligencia Artificial (GEO / AISO)
* **[Optimización para Motores de IA (GEO / AISO)](file:///c:/Users/gabriel.molina/Desktop/ecomerce_firplak/especificaciones/seo/llm_optimization.md)**: Directrices para mejorar la visibilidad y citabilidad de Firplak en ChatGPT Search, Perplexity, Claude y Gemini.

---

## 📋 Lista de Validación Rápida (Checklist)
Antes de publicar cualquier cambio, página o producto, se debe revisar y cumplir con la **[Lista de Chequeo SEO](file:///c:/Users/gabriel.molina/Desktop/ecomerce_firplak/especificaciones/seo/checklist.md)**.
