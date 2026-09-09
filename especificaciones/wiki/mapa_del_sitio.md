# Mapa del Sitio y Accesos Globales (Sitemap Firplak E-commerce)

> [!IMPORTANT]
> **Estrategia Condensada del Segmento**:
> Mapear de forma exhaustiva toda la arquitectura de información, accesos públicos, navegación global (Top Bar, Megamenú, Footer), taxonomía de catálogo (PLPs/PDPs), portales B2B/servicios, sedes físicas y cumplimiento normativo colombiano basado en la estructura activa de `www.firplak.com`, sirviendo como blueprint para el enrutamiento y las redirecciones 301 en Next.js App Router.

---

## 1. Estructura General de Accesos y Navegación

El ecosistema web de Firplak se organiza en 8 niveles y zonas de acceso fundamentales:

```
                                  [ www.firplak.com ]
                                           │
  ┌─────────────────┬──────────────────────┼─────────────────────┬──────────────────┐
  ▼                 ▼                      ▼                     ▼                  ▼
[Canales &       [Megamenú Catálogo     [B2B, Proyectos &     [Flujo             [Footer Legal,
 Top Bar]         (6 Categorías PLP)]    Servicios Técnicos]   Transaccional]     Omnicanal & Sedes]
  │                 │                      │                     │                  │
  ├─ Contacto       ├─ Hidromasajes        ├─ Carpintería Obra   ├─ Carrito         ├─ Showrooms (4)
  ├─ Catálogos      ├─ Baños               ├─ Constructor/Distr. ├─ Checkout        ├─ Descarga PDFs
  ├─ Quiénes Somos  ├─ Zona de Ropas       ├─ Solicitud Servicio ├─ Pasarelas       ├─ SIC / Habeas Data
  ├─ Dónde Comprar  ├─ Cocinas             ├─ USA Website        ├─ Mi Cuenta       ├─ Garantías / T&C
  └─ Blog           ├─ Accesorios          └─ Trabaja con Nosotros                  └─ Línea Ética
                    └─ Zona Outdoor
```

---

## 2. Mapa Completo de Accesos por Nivel

### A. Barra Superior y Accesos Corporativos (Top Bar & Header)
Accesos institucionales y de contacto rápido ubicados en la cabecera del sitio:

| Acceso / Sección | URL Actual (`firplak.com`) | Propósito / Destino |
| :--- | :--- | :--- |
| **Línea de Ventas PBX / Móvil 1** | `tel:+573158173390` | Llamada directa a asesores comerciales |
| **Línea de Ventas Móvil 2** | `tel:+573176650987` | Línea de apoyo ventas online |
| **Línea de Ventas Móvil 3** | `tel:+573042722991` | Asesoría por WhatsApp / llamada |
| **Servicio al Cliente** | `tel:+6044441771` (Opción 2) | Conmutador y soporte postventa |
| **Contacto** | `/contacto/` | Formulario de contacto general y PQRS |
| **Descarga de Catálogos** | `/descarga-de-catalogos/` | Hub de catálogos comerciales en PDF |
| **Acerca de Firplak** | `/quienes-somos/` | Historia de marca, planta y propósito |
| **¿Dónde comprar?** | `/donde-comprar/` | Directorio de tiendas propias y distribuidores |
| **Trabaja con Nosotros** | Formulario MS Office Forms | Reclutamiento y gestión de talento |
| **Blog ("Tu Spa en Casa")** | `/tu-spa-en-casa-blog/` | Artículos de bienestar, diseño y cuidado de productos |
| **Mi Cuenta / Login** | `/mi-cuenta/` | Portal de usuario, pedidos y direcciones |

---

### B. Taxonomía de Catálogo Comercial (Megamenú & PLPs)

#### 1. Hidromasajes y Spas (`/categoria-producto/jacuzzis-e-hidromasajes/`)
- **1 Persona**: `/categoria-producto/jacuzzis-e-hidromasajes/1-persona/`
- **2 Personas**: `/categoria-producto/jacuzzis-e-hidromasajes/2-personas/`
- **Freestanding (Exentas)**: `/categoria-producto/jacuzzis-e-hidromasajes/freestanding/`
- **Multipersonales**: `/categoria-producto/jacuzzis-e-hidromasajes/multipersonales/`
- **Tinas**: `/categoria-producto/jacuzzis-e-hidromasajes/tinas/`
- **Accesorios tinas**: `/categoria-producto/jacuzzis-e-hidromasajes/accesorios-tinas/`
- **⚡ Envío Rápido Hidromasajes**: `/categoria-producto/jacuzzis-e-hidromasajes/envio-rapido-hidromasajes/`

#### 2. Baños (`/categoria-producto/banos/`)
- **Lavamanos con mueble (Combos)**: `/categoria-producto/banos/combos-lavamanos-con-mueble/`
- **Lavamanos tipo vanity (Empotrados)**: `/categoria-producto/banos/lavamanos-tipo-vanity/`
- **Lavamanos tipo vessel (Sobreponer)**: `/categoria-producto/banos/lavamanos-tipo-vessel/`
- **Mesones para lavamanos**: `/categoria-producto/banos/mesones-para-lavamanos/`
- **Muebles para lavamanos (Solos)**: `/categoria-producto/banos/muebles-para-lavamanos/`
- **Muebles complementarios (Botiquines/Columnas)**: `/categoria-producto/banos/muebles-complementarios/`
- **Línea Godai**: `/categoria-producto/banos/linea-godai/`
- **Espejos**: `/categoria-producto/banos/espejos/`
- **Grifería / Plomería baños**: `/categoria-producto/banos/griferia-plomeria-banos/`
- **⚡ Envío Rápido Baños**: `/categoria-producto/banos/envio-rapido-banos/`
- **🏷️ Saldos Baños**: `/categoria-producto/banos/saldos-banos/`

#### 3. Zona de Ropas / Labores (`/categoria-producto/zona-de-ropas/`)
- **Combos lavaderos (Lavadero + Mueble)**: `/categoria-producto/zona-de-ropas/combos-lavaderos/`
- **Lavaderos Pro**: `/categoria-producto/zona-de-ropas/lavaderos-pro/`
- **Lavaderos Aqua**: `/categoria-producto/zona-de-ropas/lavaderos-aqua/`
- **Lavaderos Eco**: `/categoria-producto/zona-de-ropas/lavaderos-eco/`
- **Muebles zona de labores (Muebles para lavadora/despensa)**: `/categoria-producto/zona-de-ropas/muebles-zona-de-ropas/`
- **Llaves / Plomería zona de ropas**: `/categoria-producto/zona-de-ropas/llaves-plomeria-zona-de-ropas/`
- **⚡ Envío Rápido Zona de Labores**: `/categoria-producto/zona-de-ropas/envio-rapido-zona-de-labores/`
- **🏷️ Saldos Zona de Labores**: `/categoria-producto/zona-de-ropas/saldos-zona-de-labores/`

#### 4. Cocinas (`/categoria-producto/cocinas-integrales/`)
- **Cocinas integrales**: `/categoria-producto/cocinas-integrales/cocinas-integrales-cocinas-integrales/`
- **Muebles solos para cocinas (Superiores e inferiores)**: `/categoria-producto/cocinas-integrales/muebles-solos-cocinas/`
- **Mesones para cocina**: `/categoria-producto/cocinas-integrales/mesones-para-cocina/`
- **Lavaplatos (Submontar y sobreponer)**: `/categoria-producto/cocinas-integrales/lavaplatos/`
- **Grifería / Plomería cocinas**: `/categoria-producto/cocinas-integrales/griferia-plomeria-cocinas/`
- **⚡ Envío Rápido Cocinas**: `/categoria-producto/cocinas-integrales/envio-rapido-cocinas-integrales/`
- **🏷️ Saldos Cocinas**: `/categoria-producto/cocinas-integrales/saldos-cocinas-integrales/`

#### 5. Accesorios (`/categoria-producto/accesorios/`)
- **Accesorios tinas**: `/categoria-producto/jacuzzis-e-hidromasajes/accesorios-tinas/`
- **Accesorios baños**: `/categoria-producto/banos/accesorios-banos/`
- **Llaves / Plomería zona de ropas**: `/categoria-producto/zona-de-ropas/llaves-plomeria-zona-de-ropas/`
- **Accesorios cocina**: `/categoria-producto/cocinas-integrales/griferia-plomeria-cocinas/`

#### 6. Zona Outdoor (`/categoria-producto/zona-outdoor/`)
- **Asadores (Empotrables en acero 304)**: `/categoria-producto/zona-outdoor/asadores/`
- **Multipersonales Spa (Exteriores)**: `/categoria-producto/zona-outdoor/multipersonales-spa/`
- **Saunas (Secos y húmedos)**: `/categoria-producto/zona-outdoor/saunas/`
- **Mantenimiento de agua (Químicos y filtros)**: `/categoria-producto/zona-outdoor/mantenimiento-de-agua/`
- **Cubiertas Spa (Térmicas protectoras)**: `/categoria-producto/zona-outdoor/cubiertas/`

---

### C. Secciones y Filtros Comerciales Transversales
Accesos dinámicos impulsados por campañas y necesidades de conversión:

- **Catálogo Completo / Tienda**: `/tienda/`
- **Filtro de Descuentos / Liquidación**: `/tienda/?filters=descuentos[descuentos]`
- **Filtro Envíos Rápidos (<48h)**: `/categoria-producto/{categoria}/?filters=envio-rapido[...]`
- **Búsquedas de Colecciones Clave**:
  - `/?s=americana+basic&post_type=product` (Colección Americana Basic)
  - `/?s=zacura&post_type=product` (Colección Zacura)
  - `/?s=barra+zafiro&post_type=product` (Barras de cocina Zafiro)
  - `/etiqueta-producto/nueva-cocina-integral/` (Lanzamientos de Cocinas)

---

### D. Canales B2B, Solicitudes Técnicas y Portales Externos

| Acceso / Servicio | Enlace / Dominio | Descripción |
| :--- | :--- | :--- |
| **Carpintería de Obra** | `/carpinteria/` | Showcase institucional y galería de proyectos para constructoras y arquitectos |
| **Atención Constructor / Distribuidor** | `/atencion-a-constructores-y-distribuidores/` | Canal comercial corporativo para compras mayoristas y licitaciones |
| **Solicitud de Servicios Técnicos** | `https://servicios-mu.vercel.app/formulario-cliente` | App de agendamiento para pre-inspección, instalación y mantenimiento |
| **USA Website (Exportación / Cabinetry)** | `https://cabinetry.cema.firplak.com/` | Plataforma internacional para el mercado norteamericano |

---

### E. Flujo Transaccional del E-Commerce (Embudo de Compra)

1. **Página de Detalle de Producto (PDP)**: `/producto/{slug}/` (ej. `/producto/lavamanos-con-mueble-de-piso-de-63x48cm-lm/`)
2. **Minicart / Carrito Lateral o Página de Carrito**: `/carrito/`
3. **Checkout Transaccional**: `/finalizar-comprar/` (o `/checkout`)
   - Pasarela **ePayco**: Tarjetas de crédito/débito y botón **PSE**.
   - Financiación **ADDI**: Compra a cuotas con aprobación en línea.
4. **Página de Confirmación de Pedido (Thank You)**: `/finalizar-comprar/orden-recibida/`
5. **Autenticación y Perfil**: `/mi-cuenta/`
   - `/mi-cuenta/orders/` (Historial de compras)
   - `/mi-cuenta/edit-address/` (Gestión de direcciones de entrega en piso 1)
   - `/mi-cuenta/edit-account/` (Datos personales y contraseña)

---

### F. Red Omnicanal y Showrooms (Tiendas Físicas)

Puntos físicos enlazados en Home y Footer con geolocalización directa:

* **Tienda Bogotá**: Cra. 19 #104-52 | [Google Maps](https://maps.app.goo.gl/LMhUMTSiWs17Rn64A) | Tel: `+57 324 266 1789`
* **Tienda Medellín**: C.C. IDEO, Local 218, Autopista Sur #75-83, Itagüí | [Google Maps](https://maps.app.goo.gl/EZpYNH7LCwD5XGDg9) | Tel: `+57 316 224 5115`
* **Tienda Cali**: C.C. IDEO, Local 174, Calle 1 #62-80 | [Google Maps](https://maps.app.goo.gl/9CFtukW9oWakwmKU9) | Tel: `+57 315 457 3304`
* **Punto de Fábrica / Showroom Itagüí**: Calle 29 #41-15, Itagüí | [Google Maps](https://maps.app.goo.gl/qhF6uobdGEwcVGdC7) | Tel: `+57 316 224 5115`

---

### G. Descargas Oficiales de Catálogos (PDFs)
Accesibles desde la Home y la sección dedicada `/descarga-de-catalogos/`:

1. *Catálogo Hidromasajes y Tinas*
2. *Catálogo Zona de Labores*
3. *Catálogo Baños Firplak*
4. *Catálogo Cocinas Firplak*
5. *Catálogo Carpintería de Obra (Institucional)*

---

### H. Marco Regulatorio, Legal y Footer (Normativa Colombia)

Accesos obligatorios requeridos por la Superintendencia de Industria y Comercio (SIC) y el Estatuto del Consumidor:

| Documento / Enlace | URL en Producción | Exigencia Legal / Operativa |
| :--- | :--- | :--- |
| **Sede Electrónica SIC** | `https://sedeelectronica.sic.gov.co/` | Obligatorio por Ley 1480 (Enlace visible al regulador) |
| **Protección de Datos Personales** | `/proteccion-de-datos/` | Cumplimiento Ley 1581 de 2012 (Habeas Data) |
| **Términos y Condiciones Generales** | `/terminos-y-condiciones/` | T&C contractuales de la tienda virtual |
| **T&C Precios Especiales Hidros** | `/terminos-y-condiciones-precios-especiales-hidros/` | Condiciones de promociones y descuentos en spas |
| **Política de Envío Gratis – Hidros** | `/politica-de-envio-gratis-hidromasajes/` | Cobertura geográfica y restricciones logísticas |
| **Políticas de Devoluciones y Garantía** | `/Documento_Devoluciones_Hidros.pdf` | Derecho de retracto (5 días) y reporte de averías (3 días) |
| **Manual de Línea Ética** | `/MANUAL-DE-LINEA-ETICA-FIRPLAK-SA-2025.pdf` | Protocolos de transparencia y cumplimiento corporativo |
| **Notificaciones Judiciales / PQRS** | Canal opt-in de contacto web | Buzón formal para requerimientos legales y quejas |
| **Suscripción a Newsletter** | Formulario opt-in | Captación con consentimiento expreso de tratamiento de datos |

---

## 3. Matriz de Equivalencia de URLs: WordPress vs. Next.js App Router

Para garantizar la retención de tráfico orgánico y preservar la autoridad SEO al migrar de WordPress a Next.js, se debe implementar una tabla de redirecciones 301 permanentes:

| Tipo de Ruta | Estructura Actual en WordPress | Nueva Ruta en Next.js (App Router) | Redirección 301 |
| :--- | :--- | :--- | :--- |
| **Home** | `/` | `app/page.tsx` (`/`) | Mantener directa |
| **Categoría Padre** | `/categoria-producto/{cat}/` | `app/(catalogo)/[categoria]/page.tsx` | Redirección o alias |
| **Subcategoría** | `/categoria-producto/{cat}/{sub}/` | `app/(catalogo)/[categoria]/[subcategoria]/page.tsx` | Redirección 301 |
| **Ficha de Producto (PDP)** | `/producto/{slug}/` | `app/(catalogo)/producto/[slug]/page.tsx` | Mantener `/producto/[slug]` |
| **Catálogo General** | `/tienda/` | `app/(catalogo)/catalogo/page.tsx` | 301 de `/tienda` a `/catalogo` |
| **Blog Principal** | `/tu-spa-en-casa-blog/` | `app/(marketing)/blog/page.tsx` | 301 de `/tu-spa-en-casa-blog` a `/blog` |
| **Artículos de Blog** | `/{slug-del-post}/` | `app/(marketing)/blog/[slug]/page.tsx` | 301 por patrón de slug |
| **Carrito** | `/carrito/` | `app/(checkout)/carrito/page.tsx` | Mantener `/carrito` |
| **Checkout** | `/finalizar-comprar/` | `app/(checkout)/checkout/page.tsx` | 301 de `/finalizar-comprar` a `/checkout` |
| **Mi Cuenta** | `/mi-cuenta/` | `app/(cuenta)/cuenta/page.tsx` | Mantener alias o 301 |
| **Contacto** | `/contacto/` | `app/(institucional)/contacto/page.tsx` | Mantener `/contacto` |
| **Carpintería Obra** | `/carpinteria/` | `app/(institucional)/carpinteria-obra/page.tsx` | 301 de `/carpinteria` |
