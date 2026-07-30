# Analítica y Consent Mode v2 - Ecommerce Firplak

La medición exacta del comportamiento de los usuarios proporciona los datos necesarios para optimizar la conversión, entender el retorno de inversión (ROI) de los canales orgánicos/pagos y cumplir con las regulaciones de privacidad vigentes.

---

## 1. Integración de Google Tag Manager (GTM)

Google Tag Manager centraliza todos los scripts de seguimiento, analítica y marketing.

* **[MUST]** Implementar los scripts de inicialización de GTM directamente en el layout raíz del App Router (`app/layout.tsx`).
* **[MUST]** Para evitar retrasos en el renderizado de la página que perjudiquen el LCP (Largest Contentful Paint), el script principal de GTM debe cargarse con la estrategia de carga diferida no bloqueante usando el componente `Script` de Next.js (`next/script`) con la propiedad `strategy="afterInteractive"` o mediante Workers de terceros si el rendimiento web es crítico.

```tsx
// Ejemplo de inserción de GTM en app/layout.tsx usando next/script
import Script from 'next/script';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-XXXXXXX';

  return (
    <html lang="es">
      <head>
        {/* Google Tag Manager - script de inicialización */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${gtmId}');
            `,
          }}
        />
      </head>
      <body>
        {/* Google Tag Manager (noscript) - Fallback para navegadores sin JS */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}
```

---

## 2. Google Analytics 4 (GA4)

* **[MUST]** Habilitar la medición mejorada de GA4 en la consola para rastrear automáticamente clics de salida, búsquedas en el sitio, descargas de archivos (como PDFs de manuales) e interacciones con vídeos embebidos.
* **[MUST]** Desactivar el envío duplicado de eventos de visualización de página (`page_view`) si se gestionan de forma personalizada mediante la configuración de cambio de rutas en clientes Next.js (App Router).

---

## 3. Consent Mode v2 (Modo de Consentimiento)

El Consent Mode v2 es obligatorio para el tráfico de usuarios a nivel global para poder utilizar las funciones de remarketing y personalización de anuncios en herramientas de Google.

* **[MUST]** Inicializar el estado de consentimiento por defecto en la `dataLayer` de la web **antes** de que se cargue e inicialice el script de GTM. Por defecto, todas las categorías de cookies de seguimiento no esenciales deben estar bloqueadas (`denied`).
* **[MUST]** Configurar la integración con una plataforma de gestión de consentimiento (CMP - Consent Management Platform) que actualice de forma dinámica el estado del consentimiento de Google a `granted` cuando el usuario acepte de forma explícita el aviso de cookies del ecommerce.

```html
<!-- Script de inicialización de Consent Mode v2 por defecto en el HTML superior -->
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('consent', 'default', {
    'ad_storage': 'denied',
    'ad_user_data': 'denied',
    'ad_personalization': 'denied',
    'analytics_storage': 'denied',
    'wait_for_update': 500
  });
</script>
```
