# SEO Local - Ecommerce Firplak

Firplak cuenta con tiendas físicas, salas de exhibición (showrooms) y centros de distribución. El SEO local conecta el tráfico digital con las visitas físicas y las ventas directas.

---

## 1. Landing Pages para Tiendas Físicas

* **[MUST]** Crear una página individual e indexable para cada tienda o showroom físico de Firplak (ej. `/tiendas/medellin-poblado`, `/tiendas/bogota-calle-80`).
* **[MUST]** Cada página de tienda local debe contener información idéntica a la que se muestra en Google Business Profile (NAP: Name, Address, Phone):
  - **Nombre**: Nombre oficial de la tienda (ej. "Firplak Showroom Medellín Poblado").
  - **Dirección física exacta**: Con mapa embebido (Google Maps) accesible y texto legible.
  - **Número de teléfono local directo**: Con formato de marcado `tel:+57...` clickeable.
  - **Horario de atención actualizado**: Incluyendo horarios en festivos o días especiales.
* **[SHOULD]** Mostrar las indicaciones de cómo llegar (rutas de transporte, accesibilidad, parqueaderos disponibles) y fotos reales del establecimiento por dentro y por fuera.

---

## 2. Optimización de Google Business Profile (GBP)

* **[MUST]** Verificar y reclamar el perfil oficial de cada ubicación física en Google Business Profile.
* **[MUST]** Asegurarse de que el enlace al sitio web desde cada ficha de ubicación de GBP apunte directamente a la Landing Page local correspondiente (ej. `/tiendas/bogota-calle-80`) y no a la página de inicio genérica, añadiendo parámetros UTM de rastreo limpios (ej. `?utm_source=google&utm_medium=organic&utm_campaign=gbp-bogota`).
* **[SHOULD]** Mantener activa la sección de novedades, productos destacados y ofertas especiales dentro del panel de Google Business Profile semanalmente.

---

## 3. Posicionamiento Local Semántico

* **[SHOULD]** Incluir palabras clave locales y de geolocalización natural dentro de las meta etiquetas y encabezados de las páginas de destino correspondientes (ej. "Muebles de baño en Medellín", "Bañeras de hidromasaje en Bogotá").
* **[MUST]** Implementar el marcado estructurado de tipo `LocalBusiness` o `Store` en formato JSON-LD dentro del código HTML pre-renderizado de cada landing page local (ver especificaciones detalladas en [Datos Estructurados](file:///c:/Users/gabriel.molina/Desktop/ecomerce_firplak/especificaciones/seo/schema_markup.md)).
