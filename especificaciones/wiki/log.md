# Registro de Cambios (Log)

> [!IMPORTANT]
> **Estrategia Condensada del Segmento**:
> Mantener un registro histórico inmutable y auditable de cada decisión técnica, ingesta de requerimientos y ajuste arquitectónico en el wiki, garantizando trazabilidad completa para el equipo de desarrollo y agentes autónomos.

Registro de auditorías, ingestas y consultas realizadas en el wiki de especificaciones.

## [2026-09-04] update | Redefinición Estratégica de Carpintería de Obra (Showcase B2B sin Precios ni SAP)
- Redefinición de [carpinteria_obra.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/carpinteria_obra.md): se elimina la integración transaccional con SAP y listas de precios públicas.
- Se redefine como una galería de casos de éxito y proyectos emblemáticos que expone los features clave de ingeniería y manufactura a escala para constructores y arquitectos.
- Establecimiento del embudo hacia un formulario consultivo de intención de contacto y carga de planos para concursar y licitar proyectos.

## [2026-09-03] update | Integración del FIRPLAK Experience Stack (R3F, GSAP, Blender y Higgsfield REAL)
- Definición de la arquitectura visual sobre Next.js: GSAP 3 + ScrollTrigger + React Three Fiber + Drei + KTX2/Draco + Higgsfield REAL para cinematografía lifestyle.
- Adopción del modelo de 3 Tiers de producto (Tier 1 Hero 3D, Tier 2 Core GSAP+Fotos, Tier 3 Long Tail ágil) y 5 templates maestros (`StoryLavamanos`, `StoryMuebleBaño`, `StoryCocina`, `StoryHidromasaje`, `StoryOutdoor`).
- Modelado de datos en Supabase para storytelling parametrizable: entidades `PRODUCT_STORY` y `PRODUCT_STORY_SCENE` con control de progreso (`start_progress`, `end_progress`) en [arquitectura_datos.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/arquitectura_datos.md).
- Estandarización de la PDP en 8 fases narrativas (Contexto Higgsfield, Aislamiento, Giro CAD 3D, Callouts Físicos, Color Swap, Instalación, Mix & Match y Comercio) en [pagina_producto.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/pagina_producto.md).
- Inclusión del Hero Cinematográfico Nivel A con transiciones de atmósfera en [pagina_inicio.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/pagina_inicio.md).
- Formulación de la "Regla de Oro de Higgsfield" (atmósfera lifestyle sí, geometría física no) y reglas de separación SEO/SSR vs. WebGL en [sistema_diseno.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/sistema_diseno.md).

## [2026-09-03] update | Estandarización de Motor de Animación por Scroll (GSAP + Canvas Frame Scrubbing + Lenis)
- Definición de la técnica oficial de scrollytelling de alta fidelidad estilo Apple: **HTML5 `<canvas>` 2D + GSAP 3 + ScrollTrigger + Lenis Smooth Scroll**.
- Inclusión del presupuesto de carga de fotogramas WebP (60-120 frames, <40 KB c/u), buffering progresivo y fallback accesible con `prefers-reduced-motion` en [sistema_diseno.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/sistema_diseno.md).
- Especificación del componente `<ProductScrollCanvas />` en [pagina_producto.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/pagina_producto.md) y conmutación de secuencias de frames según versiones (Básica/Plus/Spa/Empotrada) en [hidromasajes.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/hidromasajes.md).
- Actualización de la entidad `PRODUCT` con el campo `frame_sequence_manifest_url` y la tabla comparativa de stack en [arquitectura_datos.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/arquitectura_datos.md).

## [2026-09-03] lint | Auditoría General de Consistencia y Coherencia Cruzada en el Wiki
- Auditoría integral de los 20 documentos del wiki (`especificaciones/wiki/`).
- Sincronización estricta de políticas transversales: promesa estándar de fabricación de **15 días hábiles** (con excepción técnica de 15-20 días para pruebas hidrostáticas de spas de exterior), entregas en **Primer Piso (Nivel 0)** y plazo perentorio de **3 días hábiles** para reporte de averías/daños estéticos tras la entrega (conforme a los 5 días de retracto de la Ley 1480).
- Unificación de matriz de garantías por materialidad: Mármol sintético, Quartzstone y tinas (5 años), muebles RH (1 a 3 años estándar, hasta 5 años premium), griferías (5 años cuerpo/cartucho, 1 año acabado/plomería), equipos electromecánicos (1 año) y asadores acero 304 (3 años).
- Vinculación bidireccional de referencias cruzadas entre categorías, complementos, PDP, sistema de diseño, pasarelas y el configurador Mix & Match.

## [2026-09-03] update | Inclusión de Micro Resúmenes de Estrategia Condensada en todos los MD
- Incorporación de bloques de alerta obligatorios (`> [!IMPORTANT]`) en la cabecera de cada uno de los archivos `.md` de `especificaciones/wiki/`.
- Cada bloque sintetiza la estrategia comercial, técnica y de UX/UI correspondiente a cada segmento.

## [2026-09-03] ingest | Especificaciones de Categorías Faltantes: Labores, Cocinas, Carpintería, Servicios, Accesorios y Outdoor
- Creación de especificación técnica y comercial para Zona de Labores en [zona_labores.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/zona_labores.md).
- Creación de especificación técnica y de ergonomía para Cocinas Integrales en [cocinas.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/cocinas.md).
- Creación de especificación B2B e Institucional para [carpinteria_obra.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/carpinteria_obra.md) integrada con SAP Service Layer y Supabase.
- Creación de especificación para Servicios Técnicos, Pre-inspección y Postventa en [servicios.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/servicios.md).
- Creación de especificación de Accesorios con separación obligatoria entre Grifería/Plomería y Confort en [accesorios.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/accesorios.md) y su anexo técnico [griferia_plomeria.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/griferia_plomeria.md).
- Creación de especificación de exteriores y spas multipersonales en [zona_outdoor.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/zona_outdoor.md).
- Actualización y reorganización del índice en [index.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/index.md).

## [2026-09-03] ingest | Análisis Comparativo firplak.com vs Wiki y Especificación de Home Page
- Análisis exhaustivo de `firplak.com` en producción (navegación, megamenú multinivel, ofertas flash con cálculo de ahorro COP, lead magnets de catálogos PDF, showrooms físicos y marco regulatorio colombiano).
- Creación de la especificación técnica y de UI/UX de la Página de Inicio en [pagina_inicio.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/pagina_inicio.md).
- Enriquecimiento del árbol de categorías, subcategorías y flags comerciales (`is_fast_shipping`, `is_clearance`, `is_on_sale`) en [conceptos_catalogo.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/conceptos_catalogo.md).
- Actualización del catálogo general en [index.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/index.md).

## [2026-08-14] revert | Reversión de Estructura de Carpetas
- Reversión de carpetas temáticas al nivel raíz plano en `wiki/` según solicitud del usuario.
- Actualización de enlaces en [index.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/index.md) y [README.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/README.md).

## [2026-08-12] ingest | Especificaciones de Hidromasajes, PDP (Scroll Animado) y Sistema de Diseño UI
- Creación de especificación comercial y técnica de Spas e Hidromasajes en [hidromasajes.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/hidromasajes.md).
- Creación de especificación UI/UX, Scroll Animado por categoría y SEO para la PDP en [pagina_producto.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/pagina_producto.md).
- Creación de especificación del sistema de diseño, tokens CSS, paleta de colores, fuentes, degradados y animaciones en [sistema_diseno.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/sistema_diseno.md).
- Actualización de índice en [index.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/index.md).

## [2026-07-08] update | Refinamiento de Arquitectura de Datos de Catálogo
- Auditoría de especificaciones de catálogo de Firplak (RETIE, materiales Mármol Sintético/Quartzstone, tolerancias físicas de fabricación).
- Refinamiento de la entidad `PRODUCT_VARIATION` con soporte para atributos JSONB indexados y descargables PDF en [arquitectura_datos.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/arquitectura_datos.md).

## [2026-07-08] ingest | Requerimiento de Cliente 02: Servicios, Seguimiento de Pedidos y OAuth de Supabase
- Registro del requerimiento original en [requerimiento_cliente_02.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/raw/requerimiento_cliente_02.md).
- Compilación de la especificación técnica de federación y OAuth en [integracion_servicios_pedidos.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/integracion_servicios_pedidos.md).
- Actualización del índice general en [index.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/index.md).

## [2026-07-08] ingest | Auditoría y Profundización del Sitio Oficial Firplak.com
- Registro detallado del stack tecnológico, motor de pagos y políticas en [analisis_sitio_firplak.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/raw/analisis_sitio_firplak.md).
- Compilación exhaustiva del árbol de categorías, materiales y políticas logísticas en [conceptos_catalogo.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/conceptos_catalogo.md).
- Creación de la especificación para pasarelas en [pagos_e_integraciones.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/pagos_e_integraciones.md).
- Ampliación comparativa de la transición tecnológica en [arquitectura_datos.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/arquitectura_datos.md).
- Actualización del índice general en [index.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/index.md).

## [2026-07-08] ingest | Requerimiento de Cliente 01: Arquitectura de SKUs, Supabase, SAP y Mix & Match
- Registro del requerimiento original en [requerimiento_cliente_01.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/raw/requerimiento_cliente_01.md).
- Compilación de la especificación técnica en [arquitectura_datos.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/arquitectura_datos.md).
- Compilación de la especificación funcional de la interfaz en [mix_and_match.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/mix_and_match.md).
- Actualización del catálogo general en [index.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/index.md).

## [2026-07-08] setup | Inicialización del Wiki
- Creación de la estructura base del wiki siguiendo el patrón LLM Wiki de Andrej Karpathy.
- Creación del [README.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/README.md).
- Creación del [index.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/index.md).
