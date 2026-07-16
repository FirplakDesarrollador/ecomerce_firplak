# URLs Canónicas - Ecommerce Firplak

La etiqueta canónica (`rel="canonical"`) le indica a los motores de búsqueda cuál es la versión autorizada y preferida de una página cuando existen múltiples URLs con contenido idéntico o muy similar (ej. navegación facetada o variaciones de producto).

---

## 1. Implementación de la Etiqueta Canónica en Next.js

* **[MUST]** Configurar la URL canónica de forma dinámica en cada layout o página del App Router usando la metadata nativa de Next.js en lugar de inyectar etiquetas `<link>` de forma manual.
* **[MUST]** Utilizar siempre la URL absoluta completa (incluyendo `https://` y el dominio oficial de producción `www.firplak.com`).
* **[MUST]** Eliminar los query parameters interactivos o de rastreo (ej. `?utm_source=...`, `?gclid=...`, `?page=1`) de la URL canónica final.

### Ejemplo de Configuración en Next.js
```typescript
import { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://www.firplak.com/categoria/banos',
  },
};
```

### Generación Dinámica en Server Components
```typescript
import { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const baseUrl = 'https://www.firplak.com';

  return {
    alternates: {
      canonical: `${baseUrl}/productos/${slug}`,
    },
  };
}
```

---

## 2. Gestión de Parámetros y Duplicados

### Filtros en PLPs (Categorías)
* **[MUST]** Si un usuario filtra la categoría de muebles de baño por color o precio (ej. `/categoria/banos?color=gris&precio=high`), la etiqueta canónica de esa página **debe apuntar siempre a la categoría base** `/categoria/banos`. Esto consolida toda la autoridad de posicionamiento en la página principal de la categoría.

### Paginación en PLPs
* **[MUST]** Para las páginas de categorías paginadas (ej. `/categoria/banos?page=2`):
  - La URL canónica **debe incluir el parámetro de la página** (ej. canónica: `https://www.firplak.com/categoria/banos?page=2`), permitiendo a Google indexar y entender la existencia de las siguientes páginas de productos independientes sin considerarlas duplicados de la página 1.
  - Está prohibido apuntar el canonical de la página 2 a la página 1.

### Variaciones en PDPs (Productos)
* **[MUST]** En páginas de productos complejos que muestran variaciones de color o tamaño mediante query parameters (ej. `/productos/mueble-milan?color=azul`), la etiqueta canónica debe apuntar a la URL del producto base sin parámetros: `https://www.firplak.com/productos/mueble-milan`.
* **[SHOULD]** Si una variación específica debe indexarse por separado debido a su alto volumen de búsqueda individual, se le debe asignar su propia página estática limpia y un canonical único (ej. `https://www.firplak.com/productos/mueble-milan-azul`).
