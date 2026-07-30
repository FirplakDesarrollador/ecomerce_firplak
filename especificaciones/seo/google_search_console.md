# Google Search Console - Ecommerce Firplak

Google Search Console es la herramienta oficial para monitorear, mantener y resolver problemas de presencia del sitio web en los resultados de búsqueda de Google.

---

## 1. Configuración y Verificación del Sitio

* **[MUST]** Verificar la propiedad de la web a nivel de **Dominio** (ej. `dns-txt` record en los servidores de nombres del dominio `firplak.com`) en lugar de verificación por prefijo de URL (`https://www.firplak.com`). La verificación de dominio consolida todas las variantes (HTTP, HTTPS, con y sin WWW, y subdominios como `b2b.firplak.com`).
* **[SHOULD]** Integrar las cuentas de Google Search Console con Google Analytics 4 (GA4) para habilitar el cruce de datos de búsqueda orgánica con el comportamiento de conversión de los usuarios dentro de la plataforma.

---

## 2. Gestión de Sitemaps y Cobertura

* **[MUST]** Enviar el Sitemap Index principal (`/sitemap.xml`) en el módulo "Sitemaps" de Search Console inmediatamente después de lanzar a producción.
* **[MUST]** Monitorear semanalmente el reporte de **Indexación de páginas** para identificar y solucionar problemas críticos:
  - URLs con errores 5xx (servidor caído o base de datos Supabase bloqueada).
  - URLs de error 404 enviadas en el sitemap (enlaces rotos que debemos redirigir con 301).
  - Páginas rastreadas pero actualmente no indexadas (evaluar calidad de contenido, EEAT, o problemas de renderizado JS).
  - Páginas descubiertas pero actualmente no indexadas (evaluar problemas de Crawl Budget o bloqueos de red).

---

## 3. Resolución de Problemas de Indexación

Si una página clave del catálogo (ej. una nueva categoría de muebles o un producto de alta demanda) no se indexa, el equipo técnico debe seguir el siguiente flujo de resolución:

1. **Inspeccionar la URL**: Usar la herramienta de inspección de URLs para comprobar si es rastreable y si Googlebot detecta correctamente todo el HTML pre-renderizado del Server Component.
2. **Probar URL en vivo**: Verificar si existen errores de renderizado de JavaScript o bloqueos de recursos estáticos en la versión de prueba en tiempo real.
3. **Comprobar etiquetas Robots**: Asegurarse de que no existan directivas accidentales `noindex` en los encabezados HTTP o metadatos de Next.js de esa URL.
4. **Comprobar Canonical**: Verificar que la URL canónica declarada apunte a sí misma y no a otra página diferente que esté asumiendo su autoridad.
5. **Solicitar indexación**: Si todo es correcto, hacer clic en "Solicitar indexación" para priorizar su rastreo en la cola de Google.
