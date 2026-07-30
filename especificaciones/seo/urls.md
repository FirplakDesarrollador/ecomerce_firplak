# Estructura de URLs - Ecommerce Firplak

Una estructura de URLs lógica, limpia y predecible ayuda tanto a los usuarios como a los motores de búsqueda a entender la organización del catálogo y la jerarquía de contenidos.

---

## 1. Reglas de Diseño de URLs

* **[MUST]** Usar **exclusivamente minúsculas** en todas las rutas y nombres de archivo de páginas de Next.js. Las mayúsculas confunden a los usuarios y pueden generar errores de páginas duplicadas o 404 en servidores Linux.
* **[MUST]** Separar las palabras exclusivamente mediante **guiones medios (`-`)**. Está prohibido el uso de espacios en blanco, guiones bajos (`_`) o caracteres especiales codificados (como `%20`).
* **[MUST]** Eliminar tildes, diéresis, la letra "ñ" (reemplazar por "n") y caracteres especiales del alfabeto español al generar dinámicamente slugs de productos desde Supabase/SAP (ej. `/categoria/banos` en lugar de `/categoria/baños`).
* **[MUST]** Evitar que las URLs contengan parámetros dinámicos de identificación crudos en rutas clave (ej. evitar `/producto/182746` y preferir `/productos/mueble-milan-60cm`).

---

## 2. Jerarquía de Direcciones

Para el ecommerce de Firplak, se define la siguiente taxonomía de carpetas físicas y lógicas dentro del App Router:

### Páginas de Categoría (PLPs)
* **[MUST]** Estructura: `/categoria/[nombre-categoria]`
  - Ej: `/categoria/banos`
  - Ej: `/categoria/cocinas`
* **[MUST]** Subcategoría: `/categoria/[nombre-categoria]/[nombre-subcategoria]`
  - Ej: `/categoria/banos/muebles`
  - Ej: `/categoria/banos/lavamanos`

### Páginas de Producto (PDPs)
* **[MUST]** Estructura: `/productos/[slug-producto]`
  - Ej: `/productos/mueble-milan-60cm`
  - Ej: `/productos/banera-hidromasaje-asturias`

### Artículos del Blog
* **[MUST]** Estructura: `/blog/[slug-articulo]`
  - Ej: `/blog/consejos-para-remodelar-tu-bano`

### Páginas Corporativas e Institucionales
* **[MUST]** Estructura limpia directa: `/[nombre-pagina]`
  - Ej: `/quienes-somos`
  - Ej: `/contacto`

---

## 3. Función de Slugificación (Slugify)

Para guardar y validar los slugs de productos y categorías insertados en Supabase o importados de SAP, se debe implementar una función de limpieza en TypeScript.

```typescript
// Ejemplo de utilidad para generar slugs limpios
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD') // Separar acentos de las letras
    .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
    .replace(/ñ/g, 'n')
    .replace(/[^a-z0-9 -]/g, '') // Eliminar caracteres no deseados
    .trim()
    .replace(/\s+/g, '-') // Reemplazar espacios por guiones
    .replace(/-+/g, '-'); // Evitar guiones seguidos
}
```
