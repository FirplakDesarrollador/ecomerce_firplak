# Eventos de Ecommerce y Píxeles - Ecommerce Firplak

La medición de eventos avanzados permite hacer seguimiento de las ventas, optimizar las conversiones de anuncios pagados y entender el comportamiento de los clientes durante el túnel de compra.

---

## 1. Eventos de Comercio Electrónico de GA4

* **[MUST]** Implementar el esquema de eventos mejorados de comercio electrónico de Google Analytics 4 (GA4) enviándolos directamente a la `dataLayer` de GTM a través de interacciones cliente del ecommerce.

### Evento `view_item` (Visualización de producto)
* **[MUST]** Se dispara en el primer renderizado de la PDP.
```typescript
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  event: 'view_item',
  ecommerce: {
    currency: 'COP',
    value: 850000,
    items: [{
      item_id: 'FPK-MILAN-60',
      item_name: 'Mueble de Baño Milán 60cm',
      index: 0,
      item_brand: 'Firplak',
      item_category: 'Baños',
      item_category2: 'Muebles de Baño',
      price: 850000,
      quantity: 1
    }]
  }
});
```

### Evento `add_to_cart` (Agregar al carrito)
* **[MUST]** Se dispara al hacer clic en el botón de añadir al carrito de compras.
```typescript
window.dataLayer.push({
  event: 'add_to_cart',
  ecommerce: {
    currency: 'COP',
    value: 850000,
    items: [{
      item_id: 'FPK-MILAN-60',
      item_name: 'Mueble de Baño Milán 60cm',
      price: 850000,
      quantity: 1
    }]
  }
});
```

### Evento `purchase` (Transacción completada)
* **[MUST]** Se dispara en la página de éxito de pago tras procesar la orden exitosamente.
```typescript
window.dataLayer.push({
  event: 'purchase',
  ecommerce: {
    transaction_id: 'ORDER-12345',
    value: 850000,
    tax: 135714, // Cálculo de IVA
    shipping: 15000,
    currency: 'COP',
    items: [{
      item_id: 'FPK-MILAN-60',
      item_name: 'Mueble de Baño Milán 60cm',
      price: 850000,
      quantity: 1
    }]
  }
});
```

---

## 2. Configuración de Píxeles de Conversión

* **[MUST]** Los píxeles publicitarios de Meta (Facebook Pixel), TikTok Pixel y LinkedIn Insight Tag se deben configurar a través de etiquetas de activación dinámicas en Google Tag Manager (GTM). Evitar inyectar estos scripts estáticamente en el código fuente para optimizar el rendimiento de la web.
* **[MUST]** Respetar estrictamente el estado del Consent Mode v2 antes de disparar cualquier evento o píxel de conversión publicitario. Si el usuario rechaza las cookies de marketing, los píxeles de conversión de Meta, TikTok y LinkedIn no deben cargarse ni enviar datos personales de navegación.
* **[SHOULD]** Configurar la API de conversiones de Meta (Conversions API - CAPI) del lado del servidor (utilizando Edge Functions de Vercel o peticiones de Supabase) para registrar conversiones de forma directa y segura en el servidor, mitigando la pérdida de datos provocada por bloqueadores de anuncios del navegador de los usuarios.
