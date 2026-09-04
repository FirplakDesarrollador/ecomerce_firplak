# Especificaciones UI/UX: Página de Inicio (Home Page) y Navegación Global

> [!IMPORTANT]
> **Estrategia Condensada del Segmento**:
> Equilibrar el impacto aspiracional de lujo y bienestar arquitectónico con la conversión comercial inmediata. La Home organiza una secuencia estratégica que conduce al usuario desde la inspiración (Hero y novedades) hasta la acción directa mediante ofertas flash con ahorro explícito en COP, atajos de *Envío Rápido* (<48h), descarga de catálogos para captación de leads y redirección omnicanal a los showrooms físicos de Bogotá, Medellín y Cali.

Este documento establece la arquitectura de información, layout, componentes interactivos y requisitos de conversión para la **Página de Inicio (Home)** y el **Sistema de Navegación Global** de Firplak E-commerce, contrastando el sitio actual en producción (`firplak.com`) con la visión tecnológica moderna en Next.js y Supabase.

---

## 1. Arquitectura General y Secuencia de Secciones de la Home

La nueva página de inicio debe equilibrar la inspiración aspiracional (lujo, bienestar, diseño arquitectónico) con la conversión comercial rápida (ofertas flash, envíos rápidos, descarga de catálogos y acceso omnicanal):

```
+-----------------------------------------------------------------------+
|  ANNOUNCEMENT BAR (Ticker de envíos rápidos / ofertas activas)         |
+-----------------------------------------------------------------------+
|  TOP BAR: Teléfonos Ventas PBX/WhatsApp | Servicio al Cliente | B2B   |
+-----------------------------------------------------------------------+
|  MAIN NAVBAR & MEGAMENU (Categorías, Envíos Rápidos, Saldos, Servicios)|
+-----------------------------------------------------------------------+
|                                                                       |
|  SECCIÓN 1: HERO SLIDER INMERSIVO                                     |
|  - Colecciones destacadas, fotografía premium de ambiente             |
|  - CTAs duales: [Comprar Ahora] y [Descargar Catálogos]               |
|                                                                       |
|  SECCIÓN 2: GRID CIRCULAR DE CATEGORÍAS (Acceso Rápido Visual)        |
|  - Hidromasajes, Baños, Zona de Ropas, Cocinas, Accesorios, Outdoor   |
|                                                                       |
|  SECCIÓN 3: OFERTAS ESPECIALES & LIQUIDACIÓN (Flash Sales)            |
|  - Descuentos del 10% al 65%, ahorro explícito en COP                 |
|  - Botón Quick Add to Cart o selector modal de variante               |
|                                                                       |
|  SECCIÓN 4: BANNERS EDITORIALES DE NOVEDADES                          |
|  - Destacados de lanzamientos (ej. Barras de cocina, Hidros Premium)  |
|                                                                       |
|  SECCIÓN 5: FILTROS DIRECTOS "ENVÍO RÁPIDO" Y "SALDOS"                |
|  - Acceso prioritario para clientes con entrega inmediata (<48h)      |
|                                                                       |
|  SECCIÓN 6: LEAD MAGNET - DESCARGA DE CATÁLOGOS PDF                   |
|  - Catálogos segmentados por unidad de negocio para clientes y B2B   |
|                                                                       |
|  SECCIÓN 7: PRUEBA SOCIAL & TESTIMONIOS                               |
|  - Reseñas de clientes residenciales y constructores verificados      |
|                                                                       |
|  SECCIÓN 8: OMNICANALIDAD & RED DE TIENDAS FÍSICAS (SHOWROOMS)        |
|  - Bogotá, Medellín IDEO, Medellín Fábrica, Cali IDEO                 |
|  - Enlaces directos a Google Maps y contacto telefónico por sede      |
|                                                                       |
|  SECCIÓN 9: PROPUESTAS DE VALOR (Trust Grid)                          |
|  - Cobertura nacional, 5 años garantía, asesoría, técnicos oficiales  |
|                                                                       |
|  SECCIÓN 10: CAPTACIÓN DE LEADS (Newsletter & Cotizaciones B2B)       |
|  - Formulario de cotización de proyectos + Habeas Data Ley 1581       |
+-----------------------------------------------------------------------+
|  FOOTER CORPORATIVO & REGULATORIO (SIC, términos, sedes, conmutador)  |
+-----------------------------------------------------------------------+
```

---

## 2. Header y Sistema de Navegación Global

### A. Barra de Anuncios Superior (Announcement Bar)
- Ticker o carrusel de texto animado con mensajes de urgencia comercial:
  - *"Envío rápido en lavamanos con mueble | [Ver todo]"*
  - *"Envíos gratis en hidromasajes seleccionados | Aplican T&C"*
  - *"Financia tu compra hasta en 24 cuotas con ADDI"*

### B. Barra Superior de Contacto & Enlaces Corporativos (Top Bar)
- **Ventas WhatsApp / PBX:** Líneas directas visibles (+57 315 817 3390, +57 317 665 0987).
- **Servicio al Cliente:** +604 444 1771 Opción 2.
- **Selector Corporativo / B2B:**
  - Enlace a *Carpintería de Obra* (soluciones para constructores).
  - *Atención a Constructor / Distribuidor*.
  - Enlace a *Solicitud de Servicios* (redirección o módulo de agendamiento técnico).
  - Acceso internacional: *USA Website* (`cabinetry.cema.firplak.com`).

### C. Megamenú Dinámico por Categorías
A diferencia del sitio actual en WordPress donde los menús son lentos y pesados, el nuevo frontend Next.js debe implementar un **Megamenú desplegable con prefetching instantáneo**:

1. **Hidromasajes**:
   - Subcategorías: 1 Persona, 2 Personas, Freestanding (Exentas), Multipersonales, Tinas, Accesorios tinas.
   - Tag destacado: ⚡ *Envío Rápido Hidromasajes*.
2. **Baños**:
   - Subcategorías: Combos lavamanos con mueble, Lavamanos tipo vanity, Lavamanos tipo vessel, Mesones para lavamanos, Muebles para lavamanos, Muebles complementarios, Línea Godai, Espejos, Grifería / Plomería baños.
   - Tags destacados: ⚡ *Envío Rápido*, 🏷️ *Saldos / Oportunidades*.
3. **Zona de Ropas (Labores)**:
   - Subcategorías: Combos lavaderos, Lavaderos Pro, Lavaderos Aqua, Lavaderos Eco, Muebles zona de ropas, Llaves / Plomería ropas.
   - Tags: *Envío rápido*, *Saldos*.
4. **Cocinas**:
   - Subcategorías: Cocinas integrales, Muebles solos para cocinas, Mesones para cocina, Lavaplatos, Grifería / Plomería cocinas.
   - Tags: *Envío rápido*, *Saldos*.
5. **Accesorios**:
   - Subcategorías: Accesorios tinas, Accesorios baños, Llaves / Plomería ropas, Accesorios cocina.
6. **Zona Outdoor**:
   - Subcategorías: Asadores, Multipersonales Spa, Saunas, Mantenimiento de agua, Cubiertas Spa.

---

## 3. Componentes Específicos de la Home

### A. Hero Cinematográfico y Transición de Ambientes (Nivel A - Experiencia Higgsfield)
En la nueva Home, el Hero se transforma de un slider estático tradicional en una secuencia cinematográfica de alto impacto (*"Tu hogar espera algo nuevo"*):
- **Narrativa Atmosférica (Clips de 3 a 6 segundos)**:
  1. *Entrada*: Baño contemporáneo minimalista en penumbra con iluminación volumétrica progresiva.
  2. *Protagonista*: Emerge un lavamanos o tina Firplak con destellos y flujo de agua cristalina atravesando la escena.
  3. *Transición Cinematográfica*: La cámara viaja mediante corte fluido hacia una cocina con mesón en Quartzstone y lavaplatos integrado.
  4. *Cierre Outdoor*: Transición a una terraza abierta con spa multipersonal bajo la luz del atardecer.
- **Implementación Técnica**:
  - Clips generados en **Higgsfield REAL** a partir de renders exactos de estudio (Render Masters de Blender).
  - Streaming optimizado vía CDN en formatos WebM/MP4 ligeros (<2 MB por clip).
  - En móviles o conexiones lentas: Fotograma estático en WebP servido por `next/image` con LCP prioritario (<1.2s), reproduciendo el video únicamente tras el primer input del usuario.

### B. Módulo de Ofertas Especiales y Liquidación (Flash Sales)
En `firplak.com`, este módulo es el principal motor de conversión. Para la nueva versión:
- **Cálculo de Ahorro Dinámico**: Mostrar el porcentaje de ahorro (ej. `-60%`) y el valor exacto en COP:
  `Ahorras: $ 454.140 (60%)`.
- **Precios Tachados**: Precio original formateado con `$ Original price was: ...` junto al precio actual de oferta.
- **Acción Rápida de Compra**:
  - Si el producto es simple: Botón `Comprar` con micro-animación de loading y feedback inmediato en el minicart.
  - Si el producto tiene variantes: Botón `Ver opciones` que abre un Drawer/Modal rápido para elegir color/medida sin salir de la Home.

### B. Hub de Descarga de Catálogos (B2B & Consumidor Final)
Módulo visual con portadas de los catálogos en PDF listos para descarga directa:
1. *Catálogo Hidromasajes y Tinas*
2. *Catálogo Baños y Mobiliario*
3. *Catálogo Zona de Labores*
4. *Catálogo Cocinas Integrales*
5. *Catálogo Carpintería de Obra (Institucional)*
- **Captura opcional de Lead**: Modal ligero para solicitar Nombre y Correo antes de descargar, enviando el prospecto al CRM/Supabase.

### C. Omnicanalidad y Módulo de Showrooms (Tiendas Físicas)
Dada la naturaleza de alto valor y gran formato de los productos (jacuzzis, cocinas), muchos clientes compran online tras visitar una tienda:
- **Tienda Bogotá**: Cra. 19 #104-52 | +57 324 266 1789.
- **Tienda Medellín**: C.C. IDEO, Local 218, Autopista Sur #75-83, Itagüí | +57 316 224 5115.
- **Tienda Cali**: C.C. IDEO, Local 174, Calle 1 #62-80 | +57 315 457 3304.
- **Sede Fabril / Showroom Itagüí**: Calle 29 #41-15, Itagüí.
- Cada tarjeta debe incluir enlace directo a la ubicación en **Google Maps** y botón directo de llamada / WhatsApp.

### D. Formulario de Cotización de Proyectos Especiales
Banner intercalado para clientes que requieren medidas especiales, compras al por mayor o carpintería institucional:
- Campo de tipo de proyecto (Residencial, Hotelero, Constructor).
- Selector de categoría de interés.
- Checkbox obligatorio de autorización para tratamiento de datos personales (Ley 1581).

---

## 4. Requisitos Regulatorios y Footer Oficial (Colombia)

El footer de la nueva versión debe cumplir con la normativa colombiana de comercio electrónico y protección al consumidor:
- **Vínculo a la SIC**: Enlace directo a la sede electrónica de la Superintendencia de Industria y Comercio (`https://sedeelectronica.sic.gov.co/`).
- **Política de Envío Gratis – Hidromasajes**: Términos de cobertura geográfica y exclusiones.
- **Términos de Garantía y Devoluciones**: Documento de políticas de retracto (5 días hábiles, Ley 1480) y plazo de reporte de averías (3 días hábiles).
- **Protección de Datos Personales / Habeas Data**: Política de privacidad y autorización expresa.
- **Línea Ética y Notificaciones Judiciales**: Enlaces a los documentos corporativos y buzón judicial.
- **Conmutador General**: +604 444 1771 con horarios de atención (L-V 7:00 am - 5:00 pm).
