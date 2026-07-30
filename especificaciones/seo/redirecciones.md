# Redirecciones - Ecommerce Firplak

El manejo correcto de los códigos de estado HTTP y redirecciones conserva la autoridad de posicionamiento acumulada (Link Equity) y evita que los usuarios y bots de búsqueda se encuentren con páginas rotas (errores 404).

---

## 1. Tipos de Redirecciones a Implementar

### Redirección 301 (Movido permanentemente)
* **[MUST]** Usar para cambios definitivos en la estructura de URLs del catálogo, migraciones de directorios, URLs antiguas obsoletas o cuando un producto es reemplazado de por vida por una nueva versión (ej. de `/productos/mueble-milan-v1` a `/productos/mueble-milan-v2`). Transfiere entre el **90% y el 99%** de la fuerza de posicionamiento a la nueva URL.

### Redirección 302 (Encontrado / Movido temporalmente)
* **[MUST]** Usar para campañas promocionales con landing pages temporales o redirecciones de geolocalización de usuarios que no representen un cambio permanente en el índice de búsqueda. No transfiere autoridad de posicionamiento.

### Estado HTTP 410 (Gone / Eliminado permanentemente)
* **[SHOULD]** Usar cuando un producto es descatalogado por completo y no tiene un reemplazo directo en el catálogo, ni pertenece a una categoría activa que justifique una redirección 301. Le indica explícitamente a Googlebot que desindexe la URL inmediatamente y deje de intentar rastrearla.

---

## 2. Redirecciones en Next.js

Para el ecommerce de Firplak, las redirecciones se deben gestionar en dos niveles según su naturaleza:

### A. Redirecciones Estáticas (`next.config.ts`)
Ideal para migraciones de rutas globales, páginas del sitio antiguo o enlaces permanentes que no requieren lógica de base de datos. Se procesan a nivel de servidor de red y son muy rápidas.

```typescript
// Ejemplo de configuración en next.config.ts
import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/productos/mueble-antiguo-bano',
        destination: '/productos/mueble-milan-60cm',
        permanent: true, // true genera código HTTP 301, false genera 302
      },
      {
        source: '/categorias/hidromasajes-antiguo',
        destination: '/categoria/hidromasajes',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
```

### B. Redirecciones Dinámicas (Middleware)
Ideal para verificar condiciones de base de datos o redirecciones con lógica compleja (ej. verificar si el producto tiene stock en Supabase/SAP antes de permitir el acceso).

```typescript
// Ejemplo simplificado en middleware.ts para verificar redirecciones dinámicas
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  // Simulación de control de redirecciones de idiomas o rutas privadas
  if (url.pathname.startsWith('/checkout') && !request.cookies.has('cart_id')) {
    url.pathname = '/carrito';
    return NextResponse.redirect(url, 302); // Redirección temporal a carrito
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/checkout/:path*'],
};
```

---

## 3. Estrategia de Productos Descatalogados (Out of Stock / EOL)

* **[MUST]** Si un producto está agotado temporalmente en SAP:
  - **No aplicar ninguna redirección**. Mantener la página activa (200 OK) para no perder el posicionamiento acumulado de la URL de dicho producto.
* **[MUST]** Si el producto se retira permanentemente del mercado:
  - Redirigir **301** al modelo equivalente más moderno.
  - Si no hay modelo equivalente, redirigir **301** a la subcategoría inmediata (ej. de `/productos/mueble-descatalogado` a `/categoria/banos/muebles`).
  - No redirigir de forma masiva a la Home. Google considera las redirecciones masivas a la Home como errores "Soft 404" y elimina la autoridad de la URL de origen.
