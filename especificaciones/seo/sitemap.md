# Sitemap XML - Ecommerce Firplak

El mapa del sitio (Sitemap XML) es un listado estructurado de todas las URLs públicas e indexables del ecommerce. Ayuda a que los bots de rastreo encuentren todo el catálogo de forma inmediata.

---

## 1. Generación Dinámica en Next.js

Debido a que los productos y categorías se actualizan e integran en tiempo real desde Supabase/SAP, el sitemap no debe ser un archivo estático. Debe generarse dinámicamente en cada solicitud o mediante ISR en Next.js.

* **[MUST]** Utilizar la característica nativa de generación dinámica de sitemaps de Next.js creando archivos `sitemap.ts` en las rutas del App Router (`app/sitemap.ts` o `app/sitemap.xml/route.ts`).
* **[MUST]** Excluir del sitemap todas las URLs que tengan etiqueta `noindex`, redirecciones activas (301/302) o que respondan con códigos de error HTTP (404/500).
* **[MUST]** Usar el protocolo HTTPS obligatorio para todas las URLs incluidas.

---

## 2. Estructura y Segmentación de Sitemaps

Para optimizar el presupuesto de rastreo de Google (Crawl Budget) en un catálogo de gran volumen, debemos segmentar los mapas de sitio.

* **[SHOULD]** Configurar un **Sitemap Index** (Sitemap principal) que apunte a los sitemaps especializados:
  * `/sitemaps/pages.xml`: Páginas corporativas principales (Home, Contacto, Quiénes Somos).
  * `/sitemaps/categories.xml`: Listados de categorías de productos (PLPs) dinámicos.
  * `/sitemaps/products.xml`: URLs de todos los productos del catálogo (PDPs).
  * `/sitemaps/blog.xml`: Artículos del blog publicados y actualizados.
* **[MUST]** Mantener cada sitemap individual por debajo del límite técnico de **50,000 URLs** o **50 MB** de tamaño de archivo descomprimido.

```typescript
// Ejemplo de implementación de un generador de sitemap en Next.js (app/sitemap.ts)
import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();
  const baseUrl = 'https://www.firplak.com';

  // 1. Obtener productos de Supabase
  const { data: products } = await supabase
    .from('products')
    .select('slug, updated_at')
    .eq('active', true);

  const productUrls = (products || []).map((product) => ({
    url: `${baseUrl}/productos/${product.slug}`,
    lastModified: new Date(product.updated_at),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  // 2. Páginas base
  const staticUrls = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/categoria/banos`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
  ];

  return [...staticUrls, ...productUrls];
}
```

---

## 3. Envío y Registro

* **[MUST]** Añadir el enlace directo al Sitemap Index al final del archivo `robots.txt` del sitio.
* **[MUST]** Registrar y validar el Sitemap Index en el panel de **Google Search Console** para monitorear el estado de indexación y posibles errores de cobertura en las URLs enviadas.
