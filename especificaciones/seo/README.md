# Documentación Oficial de SEO - Ecommerce Firplak

Esta es la guía técnica oficial y definitiva de SEO para el ecommerce de Firplak. Este documento y las guías asociadas sirven de referencia obligatoria para desarrolladores, creadores de contenido, integradores y herramientas de IA (agentes autónomos, LLMs, extensiones y copilotos).

El sitio web está desarrollado con **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **Supabase** y está integrado con el sistema **SAP**.

---

## Tabla de Contenidos

### 1. Fundamentos Técnicos y Estructura
* [SEO Técnico](file:///c:/Users/gabriel.molina/Desktop/ecomerce_firplak/especificaciones/seo/seo_tecnico.md) - Optimización de rendimiento, renderizado (RSC/RCC) y Core Web Vitals.
* [SEO On-Page](file:///c:/Users/gabriel.molina/Desktop/ecomerce_firplak/especificaciones/seo/seo_onpage.md) - Jerarquía HTML5, etiquetado semántico y enlazado interno.
* [Metadatos y Redes Sociales](file:///c:/Users/gabriel.molina/Desktop/ecomerce_firplak/especificaciones/seo/metadatos.md) - Metadata API en Next.js, Open Graph y Twitter Cards.
* [Estructura de URLs](file:///c:/Users/gabriel.molina/Desktop/ecomerce_firplak/especificaciones/seo/urls.md) - Nombres amigables, slugificación y manejo de caracteres.
* [URLs Canónicas](file:///c:/Users/gabriel.molina/Desktop/ecomerce_firplak/especificaciones/seo/canonical.md) - Canonical tags en Next.js, gestión de query parameters.
* [Optimización de Imágenes](file:///c:/Users/gabriel.molina/Desktop/ecomerce_firplak/especificaciones/seo/imagenes.md) - Componente `next/image`, formatos modernos, CDNs y atributos alt.

### 2. Estructuras de Contenido
* [SEO para Productos (PDPs)](file:///c:/Users/gabriel.molina/Desktop/ecomerce_firplak/especificaciones/seo/seo_productos.md) - Gestión de productos complejos, variaciones e inventario sincronizado con SAP.
* [SEO para Categorías (PLPs)](file:///c:/Users/gabriel.molina/Desktop/ecomerce_firplak/especificaciones/seo/seo_categorias.md) - Páginas de listado, paginación, filtros dinámicos y navegación facetada.
* [SEO para Blog](file:///c:/Users/gabriel.molina/Desktop/ecomerce_firplak/especificaciones/seo/seo_blog.md) - Optimización de artículos de blog, autores y enlazado interno comercial.
* [SEO Local](file:///c:/Users/gabriel.molina/Desktop/ecomerce_firplak/especificaciones/seo/seo_local.md) - Sucursales físicas, Google Business Profile y posicionamiento local.

### 3. Rastreo, Indexación y Datos Estructurados
* [Datos Estructurados (Schema.org)](file:///c:/Users/gabriel.molina/Desktop/ecomerce_firplak/especificaciones/seo/schema_markup.md) - Marcado JSON-LD detallado para productos, grupos de productos, organización y FAQs.
* [Sitemap XML](file:///c:/Users/gabriel.molina/Desktop/ecomerce_firplak/especificaciones/seo/sitemap.md) - Generación dinámica de sitemaps segmentados en Next.js.
* [Configuración de Robots.txt](file:///c:/Users/gabriel.molina/Desktop/ecomerce_firplak/especificaciones/seo/robots.md) - Reglas para buscadores y control de agentes de Inteligencia Artificial.
* [Redirecciones](file:///c:/Users/gabriel.molina/Desktop/ecomerce_firplak/especificaciones/seo/redirecciones.md) - Gestión de códigos 301, 302 y 410 en Next.js, ciclo de vida de productos obsoletos.

### 4. Integraciones, Analítica y Seguimiento
* [Google Search Console](file:///c:/Users/gabriel.molina/Desktop/ecomerce_firplak/especificaciones/seo/google_search_console.md) - Monitoreo de indexación, inspección de URLs y control de errores.
* [Google Merchant Center](file:///c:/Users/gabriel.molina/Desktop/ecomerce_firplak/especificaciones/seo/google_merchant.md) - Feeds dinámicos de producto para Google Shopping y Free Listings.
* [Analytics y Consent Mode v2](file:///c:/Users/gabriel.molina/Desktop/ecomerce_firplak/especificaciones/seo/analytics.md) - Configuración de GA4, GTM y cumplimiento de privacidad.
* [Eventos de Ecommerce y Píxeles](file:///c:/Users/gabriel.molina/Desktop/ecomerce_firplak/especificaciones/seo/eventos.md) - Eventos mejorados (purchase, view_item) y píxeles publicitarios.

### 5. Optimización para Inteligencia Artificial e Indexación de Nueva Era
* [Optimización de Motores de IA (GEO / AISO)](file:///c:/Users/gabriel.molina/Desktop/ecomerce_firplak/especificaciones/seo/llm_optimization.md) - Estrategia para visibilidad y citas en ChatGPT Search, Perplexity, Gemini, Claude y Copilot.

### 6. Control de Calidad
* [Checklist de SEO](file:///c:/Users/gabriel.molina/Desktop/ecomerce_firplak/especificaciones/seo/checklist.md) - Lista de chequeo obligatoria antes del despliegue en producción.

---

## Criterios de Clasificación (Priorización)

En cada uno de los documentos, las directrices e instrucciones de implementación se dividen en las siguientes categorías de prioridad:

* **[MUST]** (Obligatorio): Prácticas críticas que impactan directamente la indexación, penalizaciones, renderizado técnico o el correcto funcionamiento de las integraciones. Su omisión se considera un bug de desarrollo.
* **[SHOULD]** (Recomendado): Prácticas que mejoran de forma notable el posicionamiento, la experiencia de usuario y la tasa de conversión en buscadores tradicionales e IA.
* **[COULD]** (Opcional): Técnicas complementarias para nichos específicos o mejoras de experiencia marginales que se pueden implementar según el tiempo disponible.
