# Especificaciones de SEO - Ecommerce Firplak

> [!IMPORTANT]
> **Estrategia Condensada del Segmento**:
> Posicionar a Firplak como la autoridad orgánica definitiva en Colombia para baños, cocinas y jacuzzis, optimizando tanto para motores de búsqueda tradicionales (Google) como para motores de IA generativa (GEO/AIO como ChatGPT y SearchGPT). Utiliza marcado semántico profundo Schema.org JSON-LD (Product, AggregateOffer, FAQPage), renderizado SSR en Next.js para rastreo instantáneo y arquitectura de silos de contenido.

Este documento contiene la documentación principal y las instrucciones oficiales de SEO para el desarrollo y mantenimiento del ecommerce de Firplak. 

Para facilitar la consulta técnica y mantener los archivos organizados por áreas de especialización, la documentación detallada se encuentra dividida en módulos independientes dentro de la carpeta `/especificaciones/seo/`.

---

## 📌 Índice de Módulos de SEO

### 1. Aspectos Técnicos y Rendimiento
* **[SEO Técnico](../seo/seo_tecnico.md)**: Core Web Vitals (LCP, INP, CLS), optimización de renderizado (React Server Components vs. Client Components), Lazy Loading y tiempos de servidor (TTFB).
* **[SEO On-Page](../seo/seo_onpage.md)**: Estructura jerárquica de encabezados (H1-H4), marcado semántico HTML5 y directrices de enlazado interno.
* **[Optimización de Imágenes](../seo/imagenes.md)**: Implementación de `next/image` en Next.js, atributos alt semánticos, formatos WebP/AVIF y cacheo en CDN.
* **[Estructura de URLs](../seo/urls.md)**: Definición de URLs amigables, slugificación de productos y manejo de caracteres especiales.
* **[Direcciones Canónicas](../seo/canonical.md)**: Implementación de la etiqueta canonical en Next.js App Router para variaciones de productos y filtros.

### 2. Estructura de Contenidos y Catálogo
* **[SEO para Productos (PDPs)](../seo/seo_productos.md)**: Reglas de SEO para variaciones complejas de productos, inventario dinámico sincronizado con SAP e integraciones.
* **[SEO para Categorías (PLPs)](../seo/seo_categorias.md)**: Optimización de listados, filtros de navegación facetada y paginación de productos.
* **[SEO para Blog](../seo/seo_blog.md)**: Estructura de publicaciones, enlazado interno hacia el catálogo y directrices de autoría (E-E-A-T).
* **[SEO Local](../seo/seo_local.md)**: Optimización de páginas para tiendas y showrooms de Firplak, Google Business Profile y marcado local.

### 3. Indexación, Marcado y Redirecciones
* **[Datos Estructurados (Schema.org)](../seo/schema_markup.md)**: Marcado JSON-LD para productos, variaciones (`ProductGroup`), organización, breadcrumbs y FAQs.
* **[Sitemap XML](../seo/sitemap.md)**: Generación dinámica del archivo `sitemap.xml` en Next.js y segmentación del catálogo.
* **[Configuración de Robots.txt](../seo/robots.md)**: Reglas de acceso para motores de búsqueda tradicionales y agentes de Inteligencia Artificial (ChatGPT, Claude, Gemini).
* **[Redirecciones y Estados HTTP](../seo/redirecciones.md)**: Configuración de redirecciones 301, 302 y 410 en Next.js, y ciclo de vida de productos descatalogados.

### 4. Integraciones y Analítica
* **[Google Search Console](../seo/google_search_console.md)**: Configuración de propiedad, validación de URLs y monitoreo de errores de indexación.
* **[Google Merchant Center](../seo/google_merchant.md)**: Generación dinámica de feeds para Google Shopping e integración de variaciones con SAP.
* **[Google Analytics y Consent Mode v2](../seo/analytics.md)**: Implementación de GTM, GA4 y cumplimiento de normativas de cookies con Consent Mode.
* **[Píxeles de Conversión y Eventos](../seo/eventos.md)**: Seguimiento de eventos clave (purchase, add_to_cart) y píxeles de Meta, TikTok y LinkedIn.

### 5. Optimización para Inteligencia Artificial y Autoridad
* **[Optimización para Motores de IA (GEO / AISO)](../seo/llm_optimization.md)**: Directrices para mejorar la visibilidad y citabilidad de Firplak en ChatGPT Search, Perplexity, Claude y Gemini.
* **[Estrategia de Enlaces, Autoridad y Multimedia](../seo/autoridad_enlaces.md)**: Lineamientos de Link Building, creación de White Papers/White Pages y Video SEO en YouTube.

---

## 📋 Lista de Validación Rápida (Checklist)
Antes de publicar cualquier cambio, página o producto, se debe revisar y cumplir con la **[Lista de Chequeo SEO](../seo/checklist.md)**.

