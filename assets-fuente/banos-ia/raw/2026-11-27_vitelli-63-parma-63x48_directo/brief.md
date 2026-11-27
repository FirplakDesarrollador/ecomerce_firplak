# Brief · Vitelli 63 + Parma 63x48 (origen directo)

## a1 — Selección del producto (2026-11-27)
- Origen: "Directa por chat".
- Producto: "Kit mueble + lavamanos" → "Parma 63x48 con Vitelli 63".
- Grifería: "Genérica de base" (monocomando modelado, no SKU Firplak).
- Regla: el mueble se exporta de Fusion por piezas excluyendo el lavamanos que trae su ensamble (el GLB de Vitelli incluye Oslo); el Parma sale de su propio documento.

## a2 — Render base y validación (2026-11-27)
- Fusion no respondió (búsqueda "Vitelli" expiró; servidor no disponible). Mueble tomado del GLB del configurador `modelos-3d/kits/vitelli-63-oslo.glb`: Carcasa, Puerta, CajonSuperior, CajonInferior. Excluidos: lavamanos del GLB (Génova, Oslo, Parma, Siena), su grifería, bisagras (atraviesan la puerta) y sifón (oculto).
- Parma: `lavamanos/parma-63x48.stl` (Fusion, "LVM Parma"), anclado con la regla del piloto. Control vs Parma del GLB: diferencia 0,0 mm.
- Perforación de grifería detectada en y = −37 mm (desde la trasera); grifería genérica negra de base.
- Render neutro: `trabajo/<sesión>/base/vitelli-parma-base_hoja.jpg`. Pendiente: confirmación del usuario (puerta de a2).
- Puerta a2: usuario "Confirmo" (2026-11-27) → producto confirmado. Sigue a3 (ambiente) y a4 (montaje).

## a3/a4 — Ambiente y montaje (2026-11-27)
- Referencias del usuario (sin texto): `01-ambiente/ref-bano-salvia-234cm.webp` (800×1200, baño salvia, ancho 234 cm anotado) y `02-montaje/ref-acabado-madera.jpg` (1505×2000).
- Reemplazo: "Solo mueble, vessel y grifería" → se conserva la decoración (planta, pampa, accesorios: se acomodan sobre el Parma) y el canasto (debajo del Vitelli).
- Escala: "Escala real, centrado bajo el espejo".
- Acabado: "Soder".
- Créditos Parte 1: "Hasta 10".
- Defaults asumidos (sin objeción): Parma blanco brillante, grifería genérica negra mate de base, mueble colgado con cubierta a 0,86 m, cámara de la referencia, vertical 2:3, conservar iluminación.
- Plan: (1) placa vacía editando la referencia (quitar mueble, vessel, grifería, y temporalmente decoración/canasto y la anotación "234cm"); (2) montar render real calibrado; (3) devolver decoración y canasto alrededor del producto sin tocar el producto.

## a5 — Propuesta ronda 0 (2026-11-27)
- Placa: edición GPT Image 2.6 de la referencia (quita mueble, vessel, grifería, deco, canasto y anotación "234cm"); 2/2 pasan control; elegida gpt26-a.
- Cámara resuelta: VP (714, 976), altura 1,10 m (sanitario: asiento 0,45, tanque 0,76), pared izquierda a 0,82 m, f≈1300 px. La anotación "234cm" no es coherente con la imagen (daría techo de 3,6 m) → no se usó.
- Montaje: Vitelli colgado en la pared izquierda, centrado en profundidad bajo el espejo, cubierta 0,86 m; frente (cajones) hacia el centro del baño, costado hacia la cámara (geometría real).
- Soder calibrado: hue 0,498 · sat 1,0 · val 0,58 → ΔE76 1,2 (costado del mueble vs muestra).
- Decoración devuelta con IA (planta, pampa, accesorios en la esquina de la cubierta; canasto bajo el mueble), integrada solo en zonas de decoración; el producto sigue siendo render real (4.492 px del producto quedan tapados por la deco).
- Créditos: 7 de 10.
- Archivo: `trabajo/<sesión>/parte-1/ronda-0/propuesta-r0.png`; comparación `ref-vs-propuesta-r0.jpg`.

## a6 — Ronda 0: "Más ajustes" (2026-11-27)
- Usuario (literal): "corrije el ángulo para que se vea un poco más el mueble y cometiste un error, no sé en qué parte eliminaste la puerta izquierda del mueble."
- Causa de la puerta: al borrar los grupos (empties) del GLB, la puerta perdió la transformación de su grupo y se desplazó. Corregido: se fija la matriz mundial antes de borrar los grupos.
- Ángulo: con la placa fija, se acerca el mueble a la cámara a lo largo de la pared (centro 2,13 → 1,75 m): el frente se ve ~2× más y sigue bajo el espejo. 1,49 m (posición del mueble original) descartada: corta el mueble y la grifería en el borde.
- Ronda 1: Soder ΔE 1,76; decoración regenerada (1,75 cr). Créditos 8,75 de 10.
- Archivo: `trabajo/<sesión>/parte-1/ronda-1/propuesta-r1.png`.

## Puerta a6 — Aprobación Parte 1 (2026-11-27)
- Usuario: "Apruebo" → `ronda-1/propuesta-r1.png` aprobada (2 rondas: r0 ajustes, r1 aprobada). Créditos Parte 1: 8,75/10. Sigue a7 (formato y resolución).

## a7–a9 — Formato, final y entrega (2026-11-27)
- Formato: "Solo JPG"; resolución "2:3 · 1360×2048 nativa"; "1 imagen, e-commerce".
- Final: render 768 muestras + composición + decoración aprobada. 0 créditos en Parte 2.
- Entregable: `entregables/<sesión>/firplak-vitelli-63-soder-parma-63x48-bano-salvia_1360x2048.jpg` + `manifiesto.json`.
