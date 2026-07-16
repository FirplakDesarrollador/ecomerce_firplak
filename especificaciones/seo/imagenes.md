# Optimización de Imágenes - Ecommerce Firplak

Las imágenes de producto y de ambiente son esenciales para un ecommerce de diseño de interiores como Firplak. Su peso y formato impactan directamente sobre el Largest Contentful Paint (LCP) y la tasa de rebote del usuario.

---

## 1. Uso del Componente `next/image`

* **[MUST]** Usar obligatoriamente el componente `Image` de `next/image` para todas las imágenes del sitio. Está prohibido el uso de la etiqueta estándar `<img>` de HTML, excepto en casos justificados de integración externa donde no se conozcan las dimensiones y se use como fallback controlado.
* **[MUST]** Para imágenes que se carguen en el primer viewport (Above the Fold) como el slider banner principal o la primera imagen de producto en la PDP:
  - Añadir la propiedad `priority` para forzar la precarga (Preload) inmediata.
  - Asegurar la propiedad `fetchPriority="high"`.
* **[MUST]** Indicar siempre propiedades `width` y `height` precisas para evitar el redimensionamiento o saltos de diseño (CLS).
* **[SHOULD]** Usar la propiedad `sizes` en imágenes adaptables para indicar al navegador qué tamaño exacto de imagen descargar según la resolución del dispositivo del usuario.

```tsx
// Ejemplo de imagen principal optimizada en una PDP con next/image
import Image from 'next/image';

export default function ProductHeroImage({ src, name }: { src: string; name: string }) {
  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
      <Image
        src={src}
        alt={`Fotografía en ambiente de ${name}`}
        fill
        priority
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover object-center"
      />
    </div>
  );
}
```

---

## 2. Atributos ALT Semánticos

* **[MUST]** Todas las imágenes informativas o de producto deben contar con un atributo `alt` descriptivo en español.
* **[MUST]** **No incluir textos genéricos** o de relleno (ej. `alt="imagen"`, `alt="mueble"`, `alt="IMG_4829"`).
* **[MUST]** El alt debe describir lo que se ve en la imagen utilizando las palabras clave semánticas del producto de forma natural (ej. `alt="Mueble de baño Milán de color gris flotante instalado en baño moderno"`).
* **[SHOULD]** Las imágenes puramente decorativas (como iconos de adorno o separadores de diseño) deben tener un atributo `alt=""` vacío para indicar a los lectores de pantalla y buscadores que deben ignorarlas.

---

## 3. Formatos y Servidor de Contenido (CDN)

* **[MUST]** Servir las imágenes en formatos de nueva generación de alta compresión: **WebP** o **AVIF**. Next.js optimiza los formatos automáticamente si la configuración en `next.config.ts` está habilitada.
* **[MUST]** Alojar y servir las imágenes del catálogo dinámico (cargadas desde Supabase) a través de un CDN optimizado (como el storage de Supabase apoyado en Cloudflare, o Vercel Image Optimization) para asegurar bajas latencias de descarga mundial.
* **[SHOULD]** Configurar la cabecera `Cache-Control` en el servidor de imágenes con un tiempo de expiración prolongado (`public, max-age=31536000, immutable`).
* **[SHOULD]** El nombre de archivo físico de la imagen debe ser semántico y estar en minúsculas separado por guiones cortos (ej. `mueble-bano-milan-gris.webp` en lugar de `photo_2026_07_16_ver3.jpg`).
