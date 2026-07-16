# Google Merchant Center - Ecommerce Firplak

Google Merchant Center alimenta los datos de productos para las campañas de Google Shopping, anuncios dinámicos de remarketing y listados de productos gratuitos (Free Listings) en Google Search y Google Images.

---

## 1. Generación de Feeds Dinámicos

Los datos enviados a Google Merchant Center deben ser precisos y estar perfectamente sincronizados con el inventario SAP y los precios del ecommerce.

* **[MUST]** Implementar un endpoint de API en Next.js (ej. `/api/feeds/google-merchant`) que retorne el catálogo de productos en formato **XML (RSS 2.0)** o **JSON** estructurado en tiempo real o mediante caché efímera de máximo 2 horas.
* **[MUST]** Incluir todos los atributos obligatorios exigidos por Google:
  - `id`: Identificador único del producto (usar el código SKU principal o de variación proveniente de SAP).
  - `title`: Título optimizado para Shopping (ej. `Mueble de Baño Milán 60cm Blanco | Firplak`).
  - `description`: Descripción clara que resalte los materiales, dimensiones y beneficios.
  - `link`: URL canónica del producto (ej. `https://www.firplak.com/productos/mueble-milan?color=blanco`).
  - `image_link`: URL absoluta de la imagen principal en alta resolución.
  - `price`: Precio actual de venta, incluyendo la moneda (ej. `850000.00 COP`).
  - `availability`: Estado de stock del producto en SAP (valores admitidos: `in_stock` / `out_of_stock` / `preorder`).
  - `brand`: Marca del producto (especificar siempre `Firplak`).
  - `gtin` o `mpn`: El código de producto del fabricante (MPN) provisto por SAP para una correcta categorización global de Google.

---

## 2. Optimización para Variaciones de Producto

Un producto base con variaciones (como distintos colores o medidas) requiere un tratamiento especial en el feed para evitar discrepancias de precio o stock.

* **[MUST]** Enviar cada variación de producto como un ítem individual en el feed:
  - Usar la etiqueta `item_group_id` para agrupar las variaciones bajo el ID del producto padre.
  - Asegurar que la etiqueta `link` de cada ítem apunte a la URL con el parámetro exacto de la variación correspondiente (ej. `/productos/mueble-milan?color=blanco` y `/productos/mueble-milan?color=gris`).
  - Declarar los atributos específicos de variación: `color`, `size`, `material`.
* **[MUST]** Sincronizar dinámicamente los precios promocionales usando la etiqueta `sale_price` junto a su respectivo rango de fechas `sale_price_effective_date` cuando existan descuentos en el ecommerce de Firplak.

---

## 3. Prevención de Discrepancias y Errores de Cuenta

Google puede suspender la cuenta de Merchant Center si los datos del feed no coinciden con los que ve el usuario final o el robot de Google en la página web.

* **[MUST]** Asegurarse de que el precio y stock declarados en el feed coincidan exactamente con el precio y stock renderizados en el HTML (SSR/RSC) de la PDP y en el marcado JSON-LD de `Product`.
* **[SHOULD]** Configurar las actualizaciones automáticas de artículos en Google Merchant Center. Esto permite a Google rastrear las PDPs y corregir pequeñas discrepancias de precio o stock en tiempo real basándose en los datos estructurados JSON-LD de la web antes de emitir una penalización.
