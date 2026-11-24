# Brief · Pollock 63×48 Tauari + Oslo 63×48 (origen directo)

## 2026-11-23 · Selección de producto (paso 1)
Texto literal del usuario:
> quero hacer la imagen del mueble polock 63x48 en color tauari con el Oslo de 63x48

- Tipo: kit (mueble + lavamanos)
- Mueble: Pollock 63×48, acabado Tauari
- Lavamanos: Oslo 63×48

## 2026-11-23 · Corrección del usuario (paso 1)
> importante: el mueble polock con lavamanos que muestras esta con un lavamanos diferente. debes descargar ambos archivos: el del mueble polock y el del lavamanos oslo de 63x48

- Mueble: exportado de Fusion "RENDER MBL LVM POLOCK 63X48" pieza por pieza, solo puertas cerradas; se excluyó el Trentino del documento.
- Lavamanos: `oslo-63x48.stl` de Fusion "Lavamanos Oslo 63x48 v4".
- Ensamble validado: el Oslo se apoya en la tapa del mueble (z 480 mm), centrado y alineado atrás (control con Trentino: z mínima 391 mm = Fusion).

## 2026-11-23 · Referencias de Parte 1 (ambiente + montaje)
> Te anexo la referencia del baño y el color tauari. Debes conservar la iluminación del ambiente, y Debes instalarle una grifería que esté instalada sobre lavamanos, o sea, una grifería de base, no una grifería de pared.

- `01-ambiente/ref-bano-beige-iluminacion-calida.jpg`: baño beige, porcelanato grande, ducha con vidrio, espejo con luz LED perimetral, downlights, ventana a la derecha, grifería negra mate. **Conservar la iluminación.**
- `02-montaje/ref-acabado-tauari.jpg`: muestra del acabado Tauari (veta vertical, tono miel claro).
- Grifería: **de base, sobre el lavamanos** (no de pared). Se infiere negra mate como el resto de grifería de la referencia (por confirmar).
- Se infiere de la referencia (por confirmar): vista frontal, cámara a la altura de los ojos, formato vertical; mueble colgado de la pared; todo el mueble en Tauari.

## 2026-11-23 · Decisiones de Parte 1 (respuestas del usuario)
- Fondo: **baño nuevo con el estilo de la referencia** (no editar la foto de referencia).
- Créditos Higgsfield autorizados para Parte 1: **hasta 20**.
- Montaje confirmado: vista frontal a la altura de los ojos, vertical 2:3, mueble colgado, todo en Tauari, grifería monocomando negra mate de base.

## 2026-11-23 · Propuestas de Parte 1 (pendiente de aprobación)
- Placas generadas (Higgsfield, 6 créditos reales de 20 autorizados): GPT Image 2.6 ×2, FLUX 3 ×2 (FLUX-b descartada por manchas en la pared y espejo vacío).
- Propuestas: `trabajo/<sesión>/parte-1/composiciones/propuesta-{gpt26-a,gpt26-b,flux3-a}.png`. Producto = render real Blender compuesto encima.
- Color Tauari en puertas: ΔE76 6,9 respecto a la muestra (el render sale menos amarillo, b* 15,9 vs 22,7). Se calibra a ≤2 en la Parte 2.

## 2026-11-23 · Ronda de ajustes 1
> Ajustes

- Propuestas de la ronda 0 no aprobadas. Pendiente: detalle de los ajustes.

Detalle literal de los ajustes:
> Creo que te di demasiadas libertades con el ambiente de fondo. Quiero que vuelvas e intentes replicarlo lo más fiel que puedas al ambiente anterior y ajustes dimensionalmente el mueble para que tenga coherencia. Eliminaste el sanitario y no debiste haber hecho eso. Modificaste el tamaño de la cabina de ducha y ahora no es lógica ni usable. Debemos retroalimentar en el flujo que se mantengan proporciones usables y lógicas de los elementos del ambiente.

> De nuevo, debes ser mucho más apegado a la imagen de referencia. Puedes cambiar detalles, colores y aspectos mínimos de la iluminación, pero no hacer cambios que afecten la lógica y estética base de la imagen de referencia.

- Nuevo enfoque (ronda 1): editar la foto de referencia quitando SOLO mueble, vessel, grifería de pared y objetos de su repisa; conservar sanitario, ducha (mismas proporciones), nicho, espejo, planta, ventana, tapete y luz. Pollock + Oslo a escala real de la escena.

## 2026-11-23 · Propuesta ronda 1 (pendiente de aprobación)
- Placa: edición de la referencia con GPT Image 2.6 (2k). Control de fidelidad: conserva sanitario, ducha (mismo ancho), nicho, espejo, planta, ventana y tapete. Pierde solo el pequeño escalón dentro de la ducha.
- Rechazadas en control: GPT-b (amplió la ducha), FLUX-a (quitó el tapete), FLUX-b (quitó el espejo y amplió la ducha).
- Escala medida: 498 px/m en la pared (espejo 0,50 m; verificado con la altura de la tapa del sanitario ≈ 0,44 m). Cámara ≈ 1,0 m de altura, 4,0 m de la pared.
- Pollock 63×48 a tamaño real (618 mm), centrado bajo el espejo, colgado con la tapa del Oslo a 0,86 m. El mueble original de la referencia medía ≈ 0,75 m.
- Créditos Parte 1: 13,5 de 20 (saldo 2.130,35).
- Archivo: `trabajo/<sesión>/parte-1/ronda-1/propuesta-r1.png`.

## Puerta a6 — Aprobación de Parte 1 (2026-11-23)
- Usuario: "Apruebo" → propuesta `trabajo/.../parte-1/ronda-1/propuesta-r1.png` (placa r1-gpt26-a) aprobada en ronda 1 de ajustes (2 rondas totales: r0 rechazada, r1 aprobada).
- Pasa a Parte 2: primero confirmar formato/resolución (a7).

## a7 — Formato y resolución finales (2026-11-23)
- Formato: solo JPG. Resolución: 2:3 · 1360×2048 (nativa de la placa, sin upscale). Cantidad: 1 imagen, canal e-commerce.
- Plan: retoque local (Blender + composición), sin créditos Higgsfield salvo que haga falta; el producto sale del render real.

## a8–a9 — Final y entrega (2026-11-23)
- Tauari calibrado en el render (HSV hue 0.504, sat 1.23, val 0.78): ΔE76 puertas vs muestra = 0,7 (antes 8,1).
- Sombras: shadow catcher del render + oclusión de contacto en pared y piso (tono cálido), placa intacta fuera del producto/sombra.
- 0 créditos en Parte 2. Entregable: `entregables/<sesión>/firplak-pollock-63x48-tauari-oslo-63x48-bano-beige_1360x2048.jpg` + `manifiesto.json`.

## Cierre (2026-11-23)
- Usuario: "Aprobada" → entregable final aprobado. Sesión cerrada (2 rondas en Parte 1, 13,5 créditos totales).
