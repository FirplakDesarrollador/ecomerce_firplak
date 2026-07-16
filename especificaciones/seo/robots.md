# Configuración de Robots.txt - Ecommerce Firplak

El archivo `robots.txt` proporciona instrucciones a los rastreadores automáticos (crawlers) sobre qué áreas del sitio web pueden visitar y cuáles deben ignorarse para optimizar el Crawl Budget y salvaguardar zonas privadas del ecommerce.

---

## 1. Configuración Dinámica en Next.js

* **[MUST]** Generar el archivo mediante `app/robots.ts` en Next.js para asegurar que las rutas se configuren dinámicamente según el entorno (producción vs. staging).

```typescript
// Ejemplo de configuración de robots.ts en Next.js
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.firplak.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',           // Rutas API internas
          '/checkout/',      // Proceso de pago
          '/carrito/',       // Carrito de compras
          '/mi-cuenta/',     // Panel de usuario
          '/admin/',         // Panel administrativo
          '/*?*',            // Prevenir indexación de filtros desordenados/query strings interactivos
        ],
      },
      {
        // Bloquear bots de rastreo basura o scrappers agresivos
        userAgent: ['AhrefsBot', 'SemrushBot', 'MJ12bot', 'DotBot'],
        disallow: ['/'],
      },
      {
        // Permitir explícitamente a los bots de búsqueda e indexación de IA autorizados
        userAgent: ['ChatGPT-User', 'GPTBot', 'Google-Extended', 'ClaudeBot', 'Anthropic-AI', 'PerplexityBot'],
        allow: [
          '/',
          '/especificaciones/', // Facilitar la lectura de la wiki técnica para respuestas ricas de IA
        ],
        disallow: [
          '/api/',
          '/checkout/',
          '/carrito/',
        ],
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
```

---

## 2. Directrices Clave de Rastreo

* **[MUST]** Bloquear directorios que procesen datos dinámicos o que requieran autenticación del usuario (ej. `/mi-cuenta/*`, `/checkout/*`, `/carrito/*`).
* **[MUST]** Bloquear peticiones de API internas (`/api/*`) para evitar el desperdicio del presupuesto de rastreo y posibles vulnerabilidades de seguridad expuestas.
* **[SHOULD]** Configurar un listado específico de bots que dañan el rendimiento o realizan scraping sin aportar valor (como `MJ12bot`, `CriteoBot`, etc.) y desautorizar completamente su acceso.
* **[MUST]** **No usar `robots.txt` para ocultar información confidencial del usuario**. Robots.txt solo detiene el rastreo, pero si la URL es enlazada desde fuera, podría indexarse sin el contenido. Para páginas que deban permanecer ocultas del índice de Google, usar la etiqueta `<meta name="robots" content="noindex" />`.
* **[MUST]** Incluir la declaración del Sitemap Index al final del archivo para permitir el descubrimiento rápido por los crawlers.
