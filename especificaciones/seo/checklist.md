# Checklist de Publicación SEO - Ecommerce Firplak

Esta lista de chequeo (checklist) es obligatoria y debe ser completada por los desarrolladores y el equipo de contenido antes de desplegar cualquier nueva página, producto o categoría en producción en el ecommerce de Firplak.

---

## 1. Rendimiento y SEO Técnico
- [ ] **Core Web Vitals**: La página se ha probado y mantiene un CLS de **0.0** y carga en menos de **2.5 segundos** (LCP).
- [ ] **Optimización de Renderizado**: La página carga como **React Server Component (RSC)** en su nivel raíz para pre-renderizar todo el HTML.
- [ ] **Carga Diferida**: Los componentes no esenciales se importan dinámicamente (`next/dynamic`) y no bloquean el renderizado del primer viewport (fold).

## 2. Contenido On-Page y Semántica
- [ ] **Jerarquía de Encabezados**: Hay **únicamente un H1** en la página. Los subtítulos principales usan H2 y los secundarios H3 de manera jerárquica y ordenada.
- [ ] **Estructura Semántica**: Se han implementado etiquetas HTML5 adecuadas (`<main>`, `<header>`, `<footer>`, `<nav>`, `<section>`).
- [ ] **Enlaces Internos**: Todos los enlaces usan el componente `<Link>` de Next.js. Se han eliminado enlaces vacíos (`href="#"`). Los textos de anclaje son descriptivos.

## 3. Metadatos y Redes Sociales
- [ ] **Meta Título**: Configurado mediante la Metadata API de Next.js, único, con longitud entre **50 y 60 caracteres**.
- [ ] **Meta Descripción**: Configurada con longitud entre **120 y 155 caracteres** y con llamada a la acción.
- [ ] **Open Graph y Twitter Cards**: Imagen de compartir en redes sociales y metadatos de OG/Twitter configurados y probados.

## 4. URLs y Direcciones Canónicas
- [ ] **Estructura de la URL**: URL amigable, escrita completamente en minúsculas, sin caracteres especiales ni tildes, y separada con guiones medios.
- [ ] **Etiqueta Canónica**: El canonical absoluto (`https://www.firplak.com/...`) está declarado y apunta a la versión autorizada (eliminando query parameters interactivos).
- [ ] **Redirecciones**: Si reemplaza a una página anterior, se ha configurado una redirección 301 en `next.config.ts` o en base de datos.

## 5. Imágenes y Recursos Multimedia
- [ ] **next/image**: Todas las imágenes utilizan el componente `Image` de Next.js.
- [ ] **Dimensiones y Atributos**: Cada imagen tiene definidos sus atributos `width` y `height` (o usa la propiedad `fill` con contenedor adecuado) y cuenta con un atributo `alt` semántico y descriptivo.
- [ ] **Formato de Siguiente Generación**: Las imágenes se sirven en formato **WebP** o **AVIF** a través del CDN optimizado.

## 6. Datos Estructurados (Schema.org)
- [ ] **JSON-LD**: Marcado de datos estructurados correspondiente configurado (ej: `Product` para PDPs, `ItemList` para PLPs, `LocalBusiness` para páginas de tienda física).
- [ ] **Moneda y Precios**: Validado en pesos colombianos (**COP**) y sin símbolos de formato extraños.
- [ ] **Validación exitosa**: El JSON-LD no arroja errores críticos en el validador oficial de Schema.org.

## 7. Analítica y Conversión
- [ ] **GTM & GA4**: Google Tag Manager y Google Analytics 4 se ejecutan correctamente sin arrojar errores de consola de JavaScript.
- [ ] **Consent Mode v2**: Las cookies se encuentran en estado bloqueado (`denied`) por defecto hasta que el usuario exprese su consentimiento explícito en el aviso de privacidad.
- [ ] **Eventos de Comercio Electrónico**: Los eventos asociados (`view_item`, `add_to_cart`, `purchase`) empujan los datos correctos a la `dataLayer`.

## 8. Optimización para IA (LLM / GEO)
- [ ] **Datos e Información Técnica**: Las especificaciones técnicas del producto están en tablas de texto HTML semánticas legibles por bots de LLMs.
- [ ] **Preguntas y Respuestas**: Se incorporó una sección de FAQ semántica con formato claro y directo en texto para facilitar la citabilidad por buscadores como ChatGPT Search o Perplexity.
