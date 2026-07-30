# Datos Estructurados (Schema.org) - Ecommerce Firplak

Los datos estructurados ayudan a los motores de búsqueda tradicionales e inteligencias artificiales a comprender el contenido del sitio web e indexar elementos de manera inequívoca en fragmentos enriquecidos (Rich Results), Google Shopping, y grafos de conocimiento.

---

## 1. Reglas Generales de Implementación

* **[MUST]** Usar el formato **JSON-LD** inyectado directamente en el encabezado `<head>` o dentro del cuerpo de la página durante el pre-renderizado en el servidor (RSC/SSR).
* **[MUST]** Validar que todas las propiedades obligatorias de Schema.org requeridas por Google estén presentes y no contengan advertencias críticas en el validador oficial.
* **[MUST]** Para los campos de precio, usar siempre la moneda **COP** (Pesos Colombianos) y no incluir símbolos tipográficos (ej. usar `1200000` en lugar de `$1.200.000`).

---

## 2. Esquemas de Datos

### Schema Organization (Home y Global)
* **[MUST]** Insertar este marcado únicamente en la página de inicio (Home) para establecer la identidad del ecommerce de Firplak.

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Firplak",
  "url": "https://www.firplak.com",
  "logo": "https://www.firplak.com/logo.webp",
  "sameAs": [
    "https://www.facebook.com/firplak",
    "https://www.instagram.com/firplak",
    "https://www.linkedin.com/company/firplak"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+57-604-4444444",
    "contactType": "customer service",
    "areaServed": "CO",
    "availableLanguage": "Spanish"
  }
}
```

### Schema Product (PDP)
* **[MUST]** Implementar en todas las páginas de producto. Si existen variaciones del mismo producto, utilizar el tipo `ProductGroup` para agrupar las distintas opciones de compra.

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Mueble de Baño Milán 60cm",
  "image": [
    "https://www.firplak.com/images/mueble-milan-blanco.webp",
    "https://www.firplak.com/images/mueble-milan-gris.webp"
  ],
  "description": "Mueble de baño flotante Milán de 60cm de ancho, fabricado en madera resistente a la humedad y con lavamanos integrado.",
  "sku": "FPK-MILAN-60",
  "mpn": "987654321",
  "brand": {
    "@type": "Brand",
    "name": "Firplak"
  },
  "offers": {
    "@type": "AggregateOffer",
    "priceCurrency": "COP",
    "lowPrice": "850000",
    "highPrice": "920000",
    "offerCount": "2",
    "offers": [
      {
        "@type": "Offer",
        "url": "https://www.firplak.com/productos/mueble-milan?color=blanco",
        "price": "850000",
        "priceCurrency": "COP",
        "itemCondition": "https://schema.org/NewCondition",
        "availability": "https://schema.org/InStock",
        "priceValidUntil": "2027-12-31"
      },
      {
        "@type": "Offer",
        "url": "https://www.firplak.com/productos/mueble-milan?color=gris",
        "price": "920000",
        "priceCurrency": "COP",
        "itemCondition": "https://schema.org/NewCondition",
        "availability": "https://schema.org/InStock",
        "priceValidUntil": "2027-12-31"
      }
    ]
  }
}
```

### Schema BreadcrumbList
* **[MUST]** Implementar en todas las PDPs y PLPs secundarias para indicar el camino de navegación exacto.

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Inicio",
      "item": "https://www.firplak.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Baños",
      "item": "https://www.firplak.com/categoria/banos"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Muebles de Baño",
      "item": "https://www.firplak.com/categoria/banos/muebles"
    }
  ]
}
```

### Schema LocalBusiness (Páginas locales)
* **[MUST]** Usar en las páginas específicas de cada tienda local física de Firplak.

```json
{
  "@context": "https://schema.org",
  "@type": "Store",
  "name": "Firplak Showroom Medellín Poblado",
  "image": "https://www.firplak.com/images/showroom-poblado.webp",
  "@id": "https://www.firplak.com/tiendas/medellin-poblado",
  "url": "https://www.firplak.com/tiendas/medellin-poblado",
  "telephone": "+57-604-1234567",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Carrera 43A # 1-50",
    "addressLocality": "Medellín",
    "addressRegion": "Antioquia",
    "postalCode": "050021",
    "addressCountry": "CO"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 6.2085,
    "longitude": -75.5678
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
      ],
      "opens": "08:00",
      "closes": "18:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Saturday",
      "opens": "09:00",
      "closes": "14:00"
    }
  ]
}
```

### Schema FAQPage (Preguntas frecuentes)
* **[SHOULD]** Añadir este marcado en páginas institucionales de soporte o secciones de FAQ de producto para habilitar los fragmentos enriquecidos de preguntas frecuentes en Google.

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Cuáles son los materiales de fabricación de los muebles de baño?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Nuestros muebles de baño están fabricados con tableros de madera aglomerada recubiertos de resinas melamínicas, con alta resistencia a la humedad ambiental típica del baño."
      }
    }
  ]
}
```
