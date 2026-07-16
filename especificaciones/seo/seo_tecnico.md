# SEO Técnico - Ecommerce Firplak

Este documento detalla las directrices de SEO Técnico enfocadas en optimizar el rendimiento, renderizado, y Core Web Vitals en el entorno de Next.js (App Router).

---

## 1. Core Web Vitals

La velocidad de carga y estabilidad visual son factores directos de posicionamiento de Google y motores de búsqueda.

### Largest Contentful Paint (LCP)
* **[MUST]** El LCP debe mantenerse por debajo de **2.5 segundos** en conexiones móviles (simulación 4G lenta).
* **[MUST]** Usar la etiqueta `priority` del componente `next/image` para la imagen principal del viewport en el primer renderizado (ej. el banner hero de la Home o la imagen principal del producto en la PDP).
* **[MUST]** Evitar el bloqueo del renderizado crítico. No incluir fuentes pesadas ni hojas de estilo grandes cargadas de forma síncrona que retrasen la aparición de la pintura inicial.

### Interaction to Next Paint (INP)
* **[MUST]** Mantener el INP por debajo de **200 milisegundos**.
* **[SHOULD]** Delegar las tareas pesadas de JavaScript fuera del hilo principal usando `requestIdleCallback` o Web Workers.
* **[MUST]** Evitar que las interacciones del cliente (como la apertura de menús de filtrado o la adición de variaciones al carrito) bloqueen la UI. Usar transiciones de React (`useTransition`) para actualizar la UI sin congelar la página.

### Cumulative Layout Shift (CLS)
* **[MUST]** Mantener el CLS por debajo de **0.1**.
* **[MUST]** Especificar dimensiones explícitas (`width` y `height`) o usar la propiedad `aspect-ratio` en Tailwind CSS para evitar saltos de diseño cuando se carguen las imágenes.
* **[MUST]** Los esqueletos de carga (Skeletons) para renderizados asíncronos en componentes cliente deben tener la misma altura exacta que el componente final renderizado.
* **[MUST]** Reservar espacio para banners promocionales o dinámicos que se inyectan asíncronamente desde Supabase o scripts externos para evitar desplazamientos de contenido inesperados.

---

## 2. Estrategia de Renderizado (RSC vs. Client Components)

Next.js App Router renderiza todo como React Server Components (RSC) por defecto. Debemos aprovechar esta arquitectura para entregar HTML pre-renderizado óptimo para los motores de búsqueda y rastreadores de IA.

```tsx
// Ejemplo de un Server Component que obtiene datos de Supabase para SEO óptimo
import { createClient } from '@/lib/supabase/server';
import { ProductCard } from '@/components/category-bathroom/ProductCard';

export default async function ProductSection() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .limit(10);

  if (!products) return <p>No hay productos disponibles</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### Directrices de Renderizado
* **[MUST]** Todas las páginas principales, listados de categorías (PLPs), posts de blog y páginas de productos (PDPs) deben cargarse como **React Server Components (RSC)** en su estructura raíz. El HTML resultante debe contener todo el texto semántico, precios y metadatos estructurados.
* **[MUST]** Limitar el uso de la directiva `"use client"` exclusivamente a componentes de interacción (botones de compra, sliders de galería de imágenes, modales, barras de búsqueda con autocompletado y menús desplegables).
* **[SHOULD]** Utilizar **Static Site Generation (SSG)** o **Incremental Static Regeneration (ISR)** con la propiedad `revalidate` para páginas de contenido estático o semiestático (ej. páginas corporativas, políticas, FAQs y artículos de blog) para reducir el Time to First Byte (TTFB).

---

## 3. Carga Diferida (Lazy Loading) y Dynamic Imports

* **[SHOULD]** Cargar componentes pesados de cliente de forma diferida usando `next/dynamic` cuando no estén en la pantalla inicial de carga (ej. el formulario de opiniones de productos, modales de ayuda o mapas locales).
* **[MUST]** No aplicar Dynamic Imports a componentes que forman parte del contenido principal visible sobre el viewport inicial (Fold).

```tsx
// Ejemplo de carga diferida para un componente de opiniones de cliente
import dynamic from 'next/dynamic';

const ReviewSection = dynamic(() => import('@/components/products/ReviewSection'), {
  loading: () => <p className="animate-pulse h-40 bg-gray-200 rounded-lg"></p>,
  ssr: false, // Desactivar SSR si el componente depende exclusivamente de APIs del navegador
});
```

---

## 4. Respuestas HTTP y Tiempos de Servidor (TTFB)

* **[MUST]** El servidor debe responder con un código HTTP de estado **200 OK** para todas las páginas válidas e indexables.
* **[MUST]** Retornar respuestas HTTP **404 Not Found** reales para páginas inexistentes en lugar de redireccionar a la página de inicio o mostrar una página 200 con mensaje de error "Página no encontrada".
* **[SHOULD]** Configurar CDN a nivel de Vercel para cachear páginas estáticas y respuestas de la API de Supabase, manteniendo un TTFB menor a **400ms**.
