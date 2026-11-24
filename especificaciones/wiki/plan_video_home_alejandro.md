# Plan de producción — Video del nuevo Home (versión Alejandro)

> Estado: **plan depurado y aprobado en sus 4 decisiones clave** (ver sección 9).
> Alcance: solo producción de imágenes/videos en Higgsfield (CLI) + notas para la integración de scroll. La UI/navegación del home no se toca.

---

## 1. Concepto

"Un día en casa con Diana": recorrido continuo en primera persona por una casa japandi cálida,
donde cada parada muestra un producto FIRPLAK en uso real (hidromasaje → lavamanos doble →
cocina → lavarropas). En el home, los **loops** se reproducen en reposo y las **transiciones POV**
conectan una escena con la siguiente al hacer scroll.

## 2. Estructura de clips (8 videos)

| # | Tipo | Escena | Producto FIRPLAK | Duración |
|---|------|--------|------------------|----------|
| V1 | Intro | Baño desenfocado tras plantas → foco en Diana en el hidromasaje | Bañera hidromasaje (ref. imagen 1) | 3–5 s |
| V2 | Loop | Diana relajada en burbujas; mano sale del agua, acomoda mechón, vuelve al agua | Bañera hidromasaje | 3–5 s |
| V3 | Transición POV | Del hidromasaje al lavamanos doble; Diana frente al espejo | Lavamanos doble + mueble (ref. imagen 2) | 3–5 s |
| V4 | Loop | Diana se acerca al espejo y vuelve a su posición | Lavamanos doble | 3–5 s |
| V5 | Transición POV | Sale del baño, recorre el pasillo, llega a la cocina; Diana en la barra con copa de vino | Cocina (ref. imagen 3) | 4–6 s |
| V6 | Loop | Diana toma un sorbo de vino y deja la copa en el mesón | Cocina | 3–5 s |
| V7 | Transición POV | Sale por la vidriera al patio; Diana en ropa deportiva se pierde trotando hacia el bosque; la cámara gira, entra por otra vidriera a la zona de labores (invernadero + lavadoras) y **Diana llega del trote y entra a cuadro con sus zapatillas** | Lavarropas (ref. imagen 4) | 8–10 s |
| V8 | Loop | Diana, ya frente al lavarropas con las zapatillas en mano, las pone en la poceta, abre el grifo, las enjuaga, cierra el grifo y vuelve a la pose inicial con las zapatillas en mano | Lavarropas | 3–5 s |

**Nota de continuidad narrativa:** entre V6 (vino en la cocina) y V7 (Diana ya trotando afuera)
hay un salto temporal intencional tipo montaje. Se acepta, pero el vestuario y la luz deben
contarlo (ver sección 5).

## 3. Arquitectura de "frames ancla" (clave de la depuración)

Para que los loops cierren perfecto y las transiciones empalmen sin salto, **todos los clips
comparten un set reducido de fotogramas maestros**:

```
F0 (inicio intro, baño desenfocado)
A  = Diana en hidromasaje        → V1 termina en A; V2 = A→A; V3 inicia en A
B  = Diana frente al lavamanos   → V3 termina en B; V4 = B→B; V5 inicia en B
C  = Diana en barra de cocina    → V5 termina en C; V6 = C→C; V7 inicia en C
D  = Diana frente al lavarropas, zapatillas en mano → V7 termina en D; V8 = D→D
```

- Cada **loop** se genera pasando el mismo frame como `--start-image` y `--end-image`.
- Cada **transición** se genera con `--start-image <ancla origen>` y `--end-image <ancla destino>`.
- Así solo hay **5–6 imágenes ancla** que hay que dejar perfectas; todo lo demás hereda de ellas.
- QA de loop: comparar primer y último frame (diff visual); si no cierran, regenerar antes de aprobar.

## 4. Pipeline de producción en Higgsfield (CLI)

### Fase 0 — Identidad de Diana (set de personaje)
1. Generar el retrato canónico de Diana: mujer 37 años, cabello castaño oscuro, ojos miel claro,
   elegante y delgada. Modelo: **Soul 2.0** o GPT Image 2 (elegir el mejor de 3–4 candidatos).
2. A partir del canónico, generar **character sheet de 10–14 imágenes** con Nano Banana 2 Pro
   (referencia al canónico): 3 ángulos de rostro × 2 luces (cálida día / cálida noche) + cuerpo
   entero + las poses que piden las escenas (en agua hombros afuera, frente a espejo, sentada en
   barra, trotando, agachada ante el lavarropas) + los 3 vestuarios (sección 5).
3. **Entrenar Soul ID** (`higgsfield soul-id create --soul-cinematic`) con las mejores 8–12
   imágenes del sheet → máxima consistencia facial en todos los keyframes. Requiere plan pago
   Basic+ (decisión aprobada).

### Fase 0b — Set de locación (la casa japandi)
Generar 5–6 masters de ambiente consistentes entre sí (misma paleta, misma hora, mismas plantas):
baño con hidromasaje, pared del lavamanos/espejo, pasillo, cocina, patio/vidriera, zona de labores
tipo invernadero. Modelo sugerido: **Soul Location** (especialista en ambientes) o GPT Image 2,
usando las 4 fotos de producto FIRPLAK como referencia de integración.

### Fase 1 — Keyframes ancla (F0, A, B, C, D)
- Componer cada ancla con **Nano Banana 2 Pro / Seedream 4.5** usando 3 referencias por imagen:
  (1) Diana del character sheet, (2) master de locación, (3) **foto real del producto FIRPLAK**.
- La fidelidad del producto es innegociable: checklist por keyframe → grifería, número de
  cajones/puertas, color del mesón, proporciones. Si el modelo deforma el producto, iterar
  solo esa zona (inpaint/edición con referencia) antes de aprobar.
- Aspect ratio: **1:1 (master cuadrado)** — ver sección 4b.

### Fase 1b — Formato y encuadre (estándar del proyecto, tomado de los videos Loomere existentes)

El proyecto ya resolvió móvil + desktop con **un solo master cuadrado por clip** más una variante
móvil (`-m`), recortado en el front con `object-fit: cover` y `object-position` por escena
(`focusDesktop` en `sceneData.ts`). Los videos existentes lo confirman:
`viaje_1_exterior.mp4` 2048×2048 / `viaje_1_exterior-m.mp4` 1080×1080, junto a pares 1920×1080 /
1280×720 en escenas donde el 16:9 bastaba.

Estándar para esta serie:

- **Generación en Higgsfield:** `--aspect_ratio 1:1`, resolución máxima disponible del modelo
  (ideal ≥2K para que el recorte 16:9 conserve ≥1080 líneas de nitidez útil).
- **Entregables por clip:** master `2048×2048` (desktop) + variante `-m` `1080×1080` (móvil,
  GOP denso), siguiendo la convención `diana_<n>_<escena>.mp4` / `diana_<n>_<escena>-m.mp4`.
- **Zona segura de composición:** el recorte 9:16 toma la columna central (~56 % del ancho) y el
  16:9 la banda central (~56 % del alto). Diana + el producto FIRPLAK deben vivir en la
  intersección (región central ~56 % × 56 %); nada narrativo en las esquinas. Esta regla se
  valida desde los keyframes ancla, antes de generar video.
- **Poster:** exportar el frame ancla de cada clip como `.webp` (será `fallbackImage`, que por
  contrato debe coincidir con el primer fotograma).

### Fase 2 — Generación de video
- **Loops (V2, V4, V6, V8):** Kling 3.0 (`--start-image` + `--end-image`, escena de plano único,
  más económico) con fallback a Seedance 2.0 si el movimiento no convence.
- **Intro y transiciones (V1, V3, V5, V7):** **Seedance 2.0** (mejor manejo de cámara en
  movimiento, image-to-video con frame inicial y final, hasta 15 s).
- Duraciones aprobadas: loops 3–5 s; V5 hasta 6 s; **V7 de 8–10 s** (incluye la llegada de Diana
  del trote al final). Sin audio (autoplay silenciado en web).
- Presupuesto de iteración esperado: 2–4 intentos por clip; V7 es el de mayor riesgo
  (coreografía de cámara compleja) → fallback aprobado: partirlo en 2 tramos (7a: cocina→patio→
  Diana se pierde trotando; 7b: giro→entrada a zona de labores→Diana llega) si no sale en ≤4 intentos.

### Fase 3 — QA y post
- Verificar cierre de loops frame a frame.
- Verificar empalme transición→loop (el último frame de V3 debe ser idéntico al frame de V4, etc.).
- Recorte fino y encode web: H.264/H.265 + WebM, `muted`, `playsinline`, poster = frame ancla.
- Si el scroll va a "scrubbear" las transiciones (en vez de solo reproducirlas), encodear las
  transiciones con keyframes densos (GOP corto) — decidir en integración.

### Fase 4 — Integración en el home (fuera de este plan)
Scroll-driven: loop en reposo → al hacer scroll se reproduce la transición → siguiente loop.
Se documentará aparte cuando los clips estén aprobados.

## 5. Biblia de continuidad (luz, vestuario, dirección)

- **Luz:** tarde cálida constante (golden hour suave) en toda la secuencia; interiores con
  luz lateral de ventanales + acentos cálidos. Evita saltos de hora entre escenas.
- **Vestuario de Diana:**
  - Baño y espejo: bata blanca / toalla en el cabello opcional (en la bañera: hombros afuera,
    burbujas cubriendo — mantenerlo elegante y apto para moderación de contenido).
  - Cocina: loungewear beige/lino (japandi).
  - Patio y lavarropas: conjunto deportivo neutro (gris/arena) + zapatillas de correr.
- **Paleta:** maderas claras, blancos cálidos, verde de plantas, negro mate en grifería donde
  aplique (coherente con las fotos de producto).
- **Cámara:** POV flotante tipo gimbal, altura de ojos, movimientos suaves; nunca cortes dentro
  de un clip (todo es plano secuencia).

## 6. Inventario de assets a producir

| Asset | Cantidad | Modelo principal |
|---|---|---|
| Character sheet Diana | 10–14 imágenes | Nano Banana 2 Pro |
| Soul ID "Diana" (cinematic) | 1 entrenamiento | higgsfield soul-id |
| Masters de locación | 5–6 imágenes | Soul Location / GPT Image 2 |
| Keyframes ancla | 5–6 imágenes 1:1 | Nano Banana 2 Pro / Seedream 4.5 |
| Videos | 8 clips master 1:1 2048² + variante `-m` 1080² | Seedance 2.0 + Kling 3.0 |
| Posters | 8 `.webp` (= frame ancla de cada clip) | export del keyframe |

## 7. Orden de ejecución propuesto

1. Fase 0 (Diana) → aprobación tuya del canónico antes de seguir.
2. Fase 0b (locaciones) → aprobación de los masters.
3. Keyframe A completo + V2 (loop bañera) como **piloto end-to-end** → validar calidad/flujo.
4. Resto de keyframes y videos en orden V1→V8.
5. QA de empalmes y entrega de los 8 clips.

## 8. Riesgos principales

| Riesgo | Mitigación |
|---|---|
| Producto FIRPLAK deformado por el modelo | Foto real como referencia en cada keyframe + checklist + inpaint local |
| Loops que no cierran | start=end image + QA de diff; regenerar |
| V7 demasiado complejo para un solo clip | Permitir 6–10 s o partir en 2 clips |
| Deriva de identidad de Diana entre escenas | Character sheet + Soul ID entrenado |
| Moderación de contenido en escena de bañera | Encuadre hombros afuera, burbujas, bata cerca |
| Recorte móvil/desktop corta a Diana o al producto | Zona segura central ~56 %×56 % validada en keyframes + `focusDesktop` por escena |

## 8b. Avance de producción

### Fase 0 — Diana (2026-11-06)
- Retrato canónico: candidata 1 de Soul 2.0 (3:4, 2K), con los ojos corregidos a miel claro usando
  Nano Banana Pro → `assets/diana/diana_canonica.png`.
- Character sheet: 12 tomas dirigidas con Nano Banana Pro y la canónica como referencia
  (`diana_sheet_01…12.png`): frontal en bata, 3/4, perfil, cuerpo entero en loungewear, barra de
  cocina con vino, bañera de burbujas, espejo, trotando, lavarropas con zapatillas, risa, mechón de
  pelo, de espaldas. Además, un contact sheet automático de 9 ángulos (`diana_shots_1.png`, Nano
  Banana 2 Shots). La identidad se mantiene consistente en todas.
- Soul ID "Diana" (soul_cinematic): entrenamiento lanzado con 9 imágenes de rostro (canónica + sheet
  01, 02, 03, 05, 07, 09, 10, 11). ID de referencia: `6acdb008-27af-4bf1-8015-50f3efdaf80d`.
  **Entrenado y verificado**: prueba con `soul_cinematic` (`diana_soul_test.png`) conserva rostro,
  pecas y ojos miel. Lección: el modelo puede inventar personas extra en primer plano → en todos
  los prompts de keyframes incluir "Diana alone, no other people in frame".
- **Corrección de fidelidad de producto (2026-11-06):** las tomas 05, 06, 07 y 09 del sheet se
  generaron inicialmente sin la foto del producto como referencia y el modelo inventó tina,
  lavamanos, cocina y lavarropas genéricos. Se regeneraron pasando la foto real de cada producto
  (`assets/productos/`) más una descripción pieza por pieza, y luego se editó la ubicación de
  Diana en las escenas 07 (frente al espejo) y 09 (del lado correcto del lavarropas, puertas y
  cajón cerrados, sin logos). Pendiente conocido: al combinar cara + producto la identidad de
  Diana se debilita un poco (sobre todo de perfil o de espaldas); en los keyframes ancla se hará
  una pasada de consistencia facial con el Soul ID.

### Fase 0b — Masters de locación (2026-11-06)
Generados con Nano Banana Pro en 1:1 2K, sin personas. El baño se generó primero y se usó como
referencia de estilo para los demás, de modo que todo se vea como una misma casa. Cada master con
producto lleva la foto real del producto como referencia. Se hicieron 2 variantes por locación y
se eligió una (`assets/locaciones/`):

| Archivo | Locación | Por qué esta variante |
|---|---|---|
| `loc_01_bano_hidromasaje.png` | Baño: hidromasaje al frente, lavamanos doble al fondo, plantas en primer plano (sirve para el desenfoque de V1) | Hidromasaje con todos sus detalles; la otra variante tenía un texto tipo logo en la cascada |
| `loc_02_bano_lavamanos.png` | Pared del lavamanos doble + espejo | Distribución de cajones y puertas correcta, espacio libre a la izquierda para Diana |
| `loc_03_pasillo.png` | Pasillo del baño a la cocina | La cocina del fondo es tenue y no contradice la cocina FIRPLAK (la otra mostraba muebles bajos en roble) |
| `loc_04_cocina.png` | Cocina FIRPLAK + puerta corrediza de vidrio al jardín | Campana delgada en nicho y columna de repisas abiertas como en la foto; la otra tenía campana de chimenea |
| `loc_05_patio.png` | Deck, sendero al bosque e invernadero/zona de labores a la derecha | Piso de roble continuo con la casa y geografía clara para el giro de cámara de V7 |
| `loc_06_zona_labores.png` | Zona de labores tipo invernadero con el lavarropas | Grifo de pared como en el producto; la otra tenía grifo de mesón |

Notas: la grifería del lavamanos en los masters es una monocontrol negra genérica, cercana pero no
idéntica al modelo angular de la foto; en el keyframe B se corrige editando con la foto del
producto. En el lavarropas, las puertas y el cajón están cerrados y la lavadora no tiene logos.

### Piloto — V1 intro + keyframe A + loop V2 (rehecho 2026-11-07)
Entregables en `assets/piloto/`: `keyframe_F0_plantas.png`, `keyframe_A_banera.png`,
`diana_01_intro_banera(.mp4 | -m.mp4 | .webp)`, `diana_02_loop_banera(.mp4 | -m.mp4 | .webp)` y
`preview_intro_mas_loop.mp4` (V1 + 2 vueltas de V2, para revisar el empalme).

**Rechazo de la primera versión (feedback de Alejandro):** faltaba V1 y el loop V2 era antinatural:
Diana parecía una foto congelada y solo se movía el brazo. Causa: el prompt pedía "head does not
move" y quietud total al inicio y al final para forzar el cierre. Medido: la cara se mantenía con
SSIM 0.97 contra el frame inicial durante los últimos 2 s.

**Receta del keyframe** (aplicarla a B, C y D):
1. Componer con Nano Banana Pro: master de locación + foto del producto + 3 refs de cara → 3 variantes.
   Elegir la de mejor producto y encuadre.
2. Corregir pose por edición sobre esa variante.
3. Generar a Diana con `soul_cinematic` + Soul ID usando el keyframe como referencia (cara perfecta,
   pero reinventa el producto → solo como fuente de rostro).
4. Transferir solo rostro/cabello del resultado Soul al keyframe con Nano Banana Pro.
5. Recortar para centrar a Diana y validar zona segura 9:16 / 16:9.

**Receta de los loops (Seedance 2.0, 1080p, start = end = keyframe):**
- Pedir vida en todo el clip: respiración visible, cabeza que se asienta e inclina, suspiro,
  párpados, mechones, espuma y sombras en movimiento, cámara casi fija con deriva orgánica mínima.
- **Prohibido** pedir "head still" o "completely still": congela al personaje.
- Describir el gesto en orden (sin tiempos por segundo) y que "se acomode de nuevo en su pose
  original al final"; el end image se encarga del cierre.
- QA obligatoria: (a) cierre primer/último frame SSIM ≥ 0.97; (b) movimiento de la cara: SSIM del
  recorte de la cara cada 0.5 s contra el frame 0 — no debe haber tramos > 0.95 salvo el último
  medio segundo; (c) revisión visual de manos y piel a mitad del gesto.
- Sin end image no cierra (SSIM 0.62): no usarlo para loops.
- Fundido final de 0.25 s al frame inicial para borrar la deriva residual (cierre final 0.985).
- Kling 3.0 pro: descartado en escenas con piel (brazo con tono distinto a la cara).

**Receta de intros/transiciones (Seedance 2.0, start = frame origen, end = keyframe destino):**
- V1: F0 (cámara tras palmas, fondo con bokeh) → keyframe A. Movimiento: dolly lento entre las hojas
  + rack focus a Diana. Elegida la variante con mejor empalme (último frame vs primero del loop:
  SSIM 0.97). Kling 3.0 respeta igual el inicio pero empalmó peor (0.77–0.82).

**Resolución real:** los modelos de video entregan 1440×1440; el master queda en 1440².

### Regla obligatoria de producto (aplica a toda imagen o video donde aparezca un producto FIRPLAK)
1. La foto real del producto (`assets/productos/`) va **siempre** como referencia, nunca solo texto.
2. El prompt describe el producto pieza por pieza (forma, color, material, número y distribución
   de cajones/puertas, grifería, accesorios) e incluye "do not redesign, simplify or restyle".
3. Se generan mínimo 2 variantes y se revisa contra la foto antes de aprobar.
4. Para corregir pose o personas se edita sobre la variante con el producto bien logrado, en vez
   de regenerar desde cero.
5. Sin logos ni marcas de terceros visibles (lavadoras, detergentes).

## 9. Decisiones tomadas (2026-11-06)

| # | Decisión |
|---|---|
| P1 — Loop V8 | La llegada de Diana tras el trote **pasa a V7** (cierra la transición). V8 queda loopeable: Diana ya en el lavarropas, zapatillas en mano → las enjuaga bajo el grifo → vuelve a la pose inicial. |
| P2 — Formatos | Seguir el estándar ya probado en el proyecto: **master cuadrado 1:1** (2048²) + variante móvil `-m` (1080²), recorte responsivo con `object-fit: cover` + `focusDesktop`, zona segura central para Diana y el producto. |
| P3 — Duraciones | Transiciones largas aprobadas: V7 a 8–10 s (y V5 hasta 6 s); loops se mantienen en 3–5 s. |
| P4 — Soul ID | **Sí se entrena** Soul ID "Diana" (variante cinematic) con el character sheet generado. Requiere plan Basic+. |
