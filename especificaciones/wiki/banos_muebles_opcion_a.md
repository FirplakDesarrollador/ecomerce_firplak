# Sesión Lavamanos & Muebles · Opción A: Configurador 3D (Vitelli 63)

> [!IMPORTANT]
> **Estrategia Condensada del Segmento**:
> La sesión "lavamanos & muebles" presenta varios muebles de baño. Cada formato de experiencia se numera (Opción A, B, …) para iterarlo con el equipo sin perder los anteriores. La **Opción A** es un configurador 3D en tiempo real: el cliente elige el **acabado del mueble** (5 tableros) y el **lavamanos** (4 modelos), lo ve armado, por dentro y por fuera, y cotiza la combinación exacta por WhatsApp. Es la versión 3D del concepto [mix_and_match.md](mix_and_match.md).

## 1. Dónde vive

| Pieza | Ruta |
|---|---|
| Página | `/categoria-producto/banos/combos-lavamanos-con-mueble` (destino de "lavamanos & muebles" en el menú de la landing) |
| Catálogo de la sesión | `components/banos-muebles/catalogoMuebles.ts` (`MUEBLES_BANO`, primer mueble: `VITELLI_63`, `opcion: 'A'`) |
| Experiencia | `components/banos-muebles/opcion-a/` (`ConfiguradorVitelliA.tsx`, `EscenarioVitelli3D.tsx`, `materialAcabado.ts`, `configuradorLogica.ts`) |
| Modelo 3D | `public/models/muebles/vitelli-63.glb` (691 KB, meshopt) |
| Acabados | `public/images/muebles/vitelli-63/acabados/*.webp` |
| Miniaturas lavamanos | `public/images/muebles/vitelli-63/lavamanos/*.webp` |
| Pruebas | `pruebas-unitarias/configuradorVitelli.test.ts` |

La página usa el encabezado y pie del sitio (`ConditionalLayout` → `Navbar` + `Footer`); no se modificó ninguna UI existente.

## 2. Producto: Vitelli 63

- **Mueble:** Vitelli flotante, medida comercial **63 × 79 cm** (el modelo 3D mide 62,4 × 48 × 47,6 cm: confirmar con producto qué representa el 79). Puerta a la izquierda y 2 cajones a la derecha con **rieles de cierre lento**, frente sin manijas con canal de agarre.
- **Acabados (5):** Blanco Madera, Soder, Austral, Gracia, Mitte. Texturas fuente: biblioteca de tableros (`OneDrive/Practimac/Sistema de info/Tableros`), las mismas del configurador Unreal `Vitelli_M_M`.
- **Lavamanos (4, 63 × 48 cm):** Oslo (poceta rectangular), Siena (frente curvo), Genova (trapezoidal, desagüe atrás), Parma (poceta ovalada desplazada a la izquierda, con apoyo lateral).
- **Ambientación:** grifo monocontrol negro "Vogue baja" y sifón negro con desagüe click (se muestran como referencia; no se presentan como incluidos).

## 3. Experiencia (Opción A)

| Momento | Qué pasa |
|---|---|
| Entrada | El lavamanos baja y asienta sobre el mueble mientras la cámara entra al encuadre 3/4. Barra de progreso real de descarga. |
| Elegir acabado | La madera nueva **barre el mueble de izquierda a derecha** con un filo de luz. La veta es continua entre puerta y cajones (UV en metros reales). |
| Elegir lavamanos | El anterior sube y se desvanece; el nuevo baja con un leve rebote. Grifo y sifón viajan a la perforación y al desagüe de cada modelo. |
| Comparar acabados | El mueble se parte en dos acabados reales; el cliente arrastra la línea sobre el 3D. "Quedarme con…" adopta el de la derecha. |
| Abrir | Puerta y cajones se abren escalonados con frenado final (cierre lento); aparecen bisagras, rieles y sifón. |
| Medidas | Cotas 3D de ancho, alto y fondo del conjunto, tomadas del modelo. |
| Vistas | 3/4 · Frente · Interior (abre el mueble) · Arriba (para comparar la forma de las pocetas). |
| Puntos de interés | Cajones (abre), lavamanos (vista cenital), grifería. |
| Cotizar | WhatsApp de ventas con el mensaje ya escrito: mueble + acabado + lavamanos + enlace a la combinación. |
| Compartir | La URL refleja la combinación (`?acabado=austral&lavamanos=siena`) y se puede copiar. Valores inválidos caen a Gracia + Oslo. |

**Leyes de UX aplicadas:** 2 pasos numerados (Hick), máx. 5 opciones por grupo, objetivos ≥ 44 px (Fitts), CTA único y dominante en azul institucional `#324354` (Von Restorff), en móvil barra fija "Cotizar" en la zona del pulgar, respuesta inmediata con pantalla de carga (Doherty), `prefers-reduced-motion` acelera todas las animaciones.

**Rendimiento:** three.js/R3F se cargan solo en esta página (`next/dynamic`, sin SSR); el render se pausa fuera de pantalla; sin HDR ni decodificadores de CDN (iluminación con Lightformers locales y decodificador meshopt incluido en three).

## 4. Pipeline del modelo (reutilizable para los próximos muebles)

1. `node scripts/modelos-3d/acabados-vitelli-63.mjs` — texturas de tablero → WebP 1024 px con veta horizontal + muestras de 160 px.
2. `node scripts/modelos-3d/convertir-vitelli-63.mjs [ruta.fbx]` — Chromium headless + three.js:
   - marco en metros (origen: pared, base del mueble, centro del ancho);
   - quita los duplicados abiertos del FBX y deja puerta (pivote deducido, residuo 0) y cajones como grupos animables;
   - alinea los 4 lavamanos sobre el mueble y ubica grifo/sifón por **mapa de alturas cenital** (detecta perforación y desagüe);
   - escribe GLB, miniaturas y `components/banos-muebles/opcion-a/vitelliRig.ts` (generado, no editar).
3. `scripts/modelos-3d/optimizar-glb.mjs` (lo llama el paso 2, proceso aparte) — simplifica herrajes ocultos (118k → 88k triángulos), cuantiza y comprime con meshopt. Conserva nombres de material y UV (ver bugs 010–011).

## 5. Pendientes

- [ ] Precios, SKUs y carrito (Supabase/SAP); hoy se cotiza con asesor.
- [ ] Confirmar la medida comercial 63 × 79 frente al modelo (62,4 × 48 × 47,6 cm).
- [ ] Confirmar si grifo y sifón se venden con el combo.
- [ ] Oslo y Genova no traen perforación de grifo en el FBX: el grifo queda en la posición original del diseñador.
- [ ] Siguientes muebles de la sesión y Opciones B, C… según la retroalimentación.
