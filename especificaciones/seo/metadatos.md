# Metadatos y Redes Sociales - Ecommerce Firplak

Los metadatos suministran información clave sobre las páginas del sitio directamente en el encabezado HTML. Estos datos determinan cómo se muestra la página en los resultados de búsqueda (SERP) y al compartirse en redes sociales (Open Graph y Twitter Cards).

---

## 1. Metadata API de Next.js

* **[MUST]** Usar exclusivamente el objeto estático `metadata` o la función dinámica `generateMetadata` de Next.js en los archivos `layout.tsx` y `page.tsx` para inyectar los metadatos. No usar etiquetas `<head>` manuales ni paquetes externos de React.

### Ejemplo de Configuración Estática (`layout.tsx` o `page.tsx`)
```typescript
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Muebles de Baño Modernos y Bañeras de Hidromasaje | Firplak',
  description: 'Descubre en Firplak la mejor variedad de muebles de baño, lavamanos, bañeras de hidromasaje y accesorios de alta calidad para remodelar tus espacios.',
  openGraph: {
    title: 'Firplak | Especialistas en Baños y Cocinas',
    description: 'Diseños modernos, funcionales y de alta resistencia para tu hogar.',
    url: 'https://www.firplak.com',
    siteName: 'Firplak',
    images: [
      {
        url: 'https://www.firplak.com/images/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'Diseño de baños y cocinas Firplak',
      },
    ],
    locale: 'es_CO',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Firplak | Especialistas en Baños y Cocinas',
    description: 'Diseños modernos y funcionales.',
    images: ['https://www.firplak.com/images/og-default.jpg'],
  },
};
```

### Ejemplo de Configuración Dinámica (`page.tsx` de Producto)
```typescript
import { Metadata, ResolvingMetadata } from 'next';
import { createClient } from '@/lib/supabase/server';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from('products')
    .select('name, description, slug, image_url')
    .eq('id', id)
    .single();

  if (!product) {
    return {
      title: 'Producto no encontrado | Firplak',
    };
  }

  return {
    title: `${product.name} | Baños Firplak`,
    description: product.description,
    openGraph: {
      title: `${product.name} | Firplak`,
      description: product.description,
      url: `https://www.firplak.com/productos/${product.slug}`,
      images: [
        {
          url: product.image_url || 'https://www.firplak.com/images/og-default.jpg',
          alt: product.name,
        },
      ],
    },
  };
}
```

---

## 2. Reglas de Contenido para Metadatos

### Meta Título (Meta Title)
* **[MUST]** La longitud del título debe estar entre **50 y 60 caracteres** (para evitar recortes en la SERP de Google).
* **[MUST]** El título debe ser único en todo el sitio web.
* **[SHOULD]** Estructura recomendada: **[Palabra Clave Principal] - [Palabra Clave Secundaria] | [Nombre de Marca]** (Ej: `Muebles de Baño Suspendidos - Diseños Modernos | Firplak`).

### Meta Descripción (Meta Description)
* **[MUST]** La longitud debe situarse entre **120 y 155 caracteres**.
* **[MUST]** Debe contener una llamada a la acción implícita o explícita (ej. "¡Compra online con envío a toda Colombia!", "Conoce nuestro catálogo aquí").
* **[SHOULD]** Incluir palabras clave relacionadas de forma fluida y persuasiva.
