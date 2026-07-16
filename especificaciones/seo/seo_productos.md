# SEO para Productos (PDPs) - Ecommerce Firplak

Las páginas de detalle de producto (PDP) de Firplak presentan desafíos específicos debido a la complejidad del catálogo, que cuenta con variaciones configurables (color, dimensiones, materiales) e integración dinámica con SAP para precios e inventario.

---

## 1. Gestión de Variaciones de Producto

Un producto con múltiples colores o tamaños puede generar problemas de contenido duplicado si no se estructura adecuadamente para los buscadores.

* **[MUST]** Mantener una única URL principal (URL Canónica) para el producto base en lugar de indexar una URL individual por cada variación, a menos que la variación cambie sustancialmente el tipo de producto (ej. una variación de material que duplica el precio y cambia la descripción).
* **[MUST]** Si las variaciones se seleccionan mediante parámetros en la URL (ej. `?color=gris&medida=80cm`):
  1. Configurar la etiqueta canónica en la página para que apunte siempre a la URL del producto base sin parámetros (ej. `/productos/mueble-milan`).
  2. Implementar cambios de estado fluidos en el cliente para actualizar las imágenes, la descripción secundaria, el stock y el precio sin recargar la página de manera brusca.
* **[SHOULD]** Si una variación de color o diseño específico tiene una alta demanda de búsqueda individual, se le puede permitir indexación independiente si y solo si:
  - Tiene una descripción textual y fichas técnicas únicas y diferenciadas.
  - Apunta a su propia URL canónica explícita (ej. `/productos/mueble-milan-gris`).

---

## 2. Sincronización SAP e Inventario Dinámico

La información de stock y precio proviene directamente de SAP en tiempo real. La latencia de sincronización no debe perjudicar la indexación.

* **[MUST]** Los precios y la disponibilidad iniciales del producto deben estar renderizados en el HTML del servidor (SSR / RSC) en el momento del rastreo del bot. No retrasar la carga de precios básicos detrás de llamadas API del lado del cliente iniciadas después del montaje del componente.
* **[MUST]** Si el stock de un producto en SAP cae a cero temporalmente (Sin stock / Out of Stock):
  - **No eliminar la página** ni retornar un error 404.
  - Mantener la página activa con el estado `OutOfStock` en el marcado JSON-LD y un indicador visual claro de "Agotado temporalmente".
  - Ofrecer alternativas de productos relacionados para capturar el tráfico y evitar el aumento en la tasa de rebote.
* **[MUST]** Si un producto se descataloga permanentemente del inventario SAP:
  - Implementar una redirección 301 al producto sustituto directo.
  - Si no existe un reemplazo directo, redirigir 301 a la categoría superior inmediata.
  - Si el tráfico es irrelevante, se puede aplicar un código de estado HTTP **410 Gone** para indicarle a los bots que el recurso fue eliminado permanentemente del índice.

---

## 3. Optimización de Contenido en PDPs

* **[MUST]** Cada página de producto debe incluir:
  - Un título `<h1>` único basado en la fórmula: **[Nombre del Producto] + [Categoría/Tipo] + [Medida/Atributo principal]** (Ej: `<h1>Mueble de Baño Milán 60cm con Lavamanos</h1>`).
  - Descripción de producto redactada de forma semántica y persuasiva de al menos 150-200 palabras, evitando descripciones cortas copiadas directamente de fichas técnicas técnicas.
  - Especificaciones técnicas formateadas en tablas HTML semánticas (`<table>`, `<thead>`, `<tbody>`, `<tr>`, `<td>`), en lugar de imágenes con texto incrustado. Esto permite el procesamiento del texto por rastreadores de IA y motores de búsqueda.
* **[SHOULD]** Integrar una sección de valoraciones y reseñas de clientes reales. El contenido generado por el usuario (UGC) enriquece la semántica de la página de forma automática y mejora el factor de confianza (E-E-A-T).
* **[SHOULD]** Incluir un enlace directo de descarga para la ficha técnica o manual de instalación en formato PDF, optimizando los nombres de archivo de dichos PDFs con palabras clave adecuadas (ej. `manual-instalacion-mueble-milan-firplak.pdf`).
