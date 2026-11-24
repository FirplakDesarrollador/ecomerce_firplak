# Render en bulk de modelos 3D

`render-bulk.py` renderiza todos los OBJ / STL / GLB / FBX / PLY de una carpeta
con un estudio fijo: misma cámara, misma luz, mismo material y mismo fondo. Así
el catálogo sale coherente.

## Requisito

[Blender](https://www.blender.org/download/) 4.2 o superior (gratis). Si
`blender` no está en el PATH, usa la ruta completa, por ejemplo
`"C:\Program Files\Blender Foundation\Blender 5.0\blender.exe"`.

## Uso

1. Copia los modelos a `renders-3d/entrada/`. Esa carpeta está en `.gitignore`.
2. Ejecuta:

```bash
blender -b -P scripts/modelos-3d/render-bulk.py -- renders-3d/entrada renders-3d/salida
```

- Salida: `renders-3d/salida/<modelo>_<vista>.png` y `render-bulk.log.json`
  con la caja (tamaño) de cada modelo y los errores.
- Rendimiento medido con la GPU AMD (HIP) del equipo: unos 10 s por modelo para
  3 vistas a 800 px y 32 muestras. A 2000 px y 128 muestras (config por defecto), cerca de 30 s por vista,
  o sea ~1,5 min por modelo con 3 vistas.
- Lo que ya está renderizado se salta. Agrega `--forzar` para rehacer todo.
- Para usar otra config, pásala como tercer argumento: `... -- entrada salida mi-config.json`.

## Qué se mantiene fijo

| Aspecto | Cómo | Config |
|---|---|---|
| Ángulo | Vistas con azimut y elevación fijos | `vistas` |
| Perspectiva | Lente fija; en `ajustar` cada modelo se escala a la misma esfera envolvente, así la cámara queda en la misma posición para todos | `lente_mm`, `encuadre`, `margen` |
| Iluminación | Tres luces de área más un ambiente uniforme, que giran con la vista | `luces`, `exposicion` |
| Color | Material uniforme y gestión de color AgX | `material_modo`, `material` |
| Fondo | Color sólido con sombra de contacto, o `"transparente"` | `fondo`, `sombra_piso` |

## Ajustes frecuentes

- **El modelo sale acostado o de espaldas.** Cambia los ejes del formato en
  `importacion`, o corrige solo ese archivo con
  `"por_archivo": { "nombre-sin-extension": { "rotacion": [90, 0, 0] } }`.
- **Tamaños reales** (comparar muebles entre sí): usa `"encuadre": "escala_real"`
  con `distancia_camara_m` y `altura_objetivo_m`. Revisa la escala de los STL
  (`0.001` si vienen en mm).
- **Colores originales** de OBJ (.mtl) o GLB: usa `"material_modo": "original"`.
- **Color exacto de un acabado:** usa `"perfil_color": "Standard"`. AgX, que viene
  por defecto, suaviza las luces pero aclara los colores saturados: un rojo sale
  salmón. Con Standard, el script compensa la exposición solo (-2 EV) para no
  quemar los blancos.
- **Más o menos contraste:** sube o baja `luces.relleno` y `luces.ambiente`. Con
  menos relleno, los objetos blancos se leen mejor.
- **Color para un solo modelo:** `"por_archivo": { "x": { "material": { "color": "#222222" } } }`.
- **Prueba rápida:** baja `muestras` a 32 y `resolucion` a `[800, 800]`.

## Preset: lavamanos en cerámica brillante

`render-bulk.lavamanos.json` produce el estilo de catálogo de cerámica:
- **Material:** esmalte brillante (`capa: 1.0`, rugosidad casi 0).
- **Reflejos:**
  - `luces.reflejo` es una tarjeta de reflejo: un softbox ancho detrás del
    producto, en el ángulo espejo de la cámara. Solo aparece como brillo en las
    superficies y no ilumina el difuso.
  - `ambiente_degradado` es un ambiente claro arriba y oscuro en el horizonte,
    que da degradados en las caras verticales.
  - Sin estos dos, el brillo no se nota: una superficie lisa refleja lo que tiene
    delante, y un ambiente plano no tiene nada que reflejar.
- **Contraste:** look `AgX - Punchy`, exposición -0.9 y casi sin relleno.
- **Fondo:** blanco puro y sin sombra. Un piso invisible rebota luz para que la
  parte de abajo de la poceta no salga negra (`rebote_piso`).
- **Vistas:**
  - 3/4 desde la izquierda (azimut -29°, elevación 30°, lente de 100 mm),
    medido sobre la imagen de referencia de Mercadeo.
  - Frente y lado.

```bash
blender -b -P scripts/modelos-3d/render-bulk.py -- renders-3d/entrada renders-3d/salida scripts/modelos-3d/render-bulk.lavamanos.json
```

Las excepciones de ejes de cada archivo se agregan en `por_archivo` (ver abajo).

### Varios productos uno junto al otro

`componer-lado-a-lado.py` recorta todos los renders con la misma caja y los
pone en fila. Cada producto conserva su posición y su escala, así que la
perspectiva es idéntica entre ellos:

```bash
python scripts/modelos-3d/componer-lado-a-lado.py renders-3d/fila.png renders-3d/salida/a_34.png renders-3d/salida/b_34.png renders-3d/salida/c_34.png
```

Con `"encuadre": "ajustar"` cada producto se escala a su propia esfera
envolvente. Entre productos de la misma medida (p. ej. todos de 63x48) la
diferencia es mínima. Si se mezclan medidas y deben verse a escala real, usa
`"encuadre": "escala_real"`.

## Modelos exportados de Fusion 360

- Fusion exporta los STL en mm, pero **no todos los diseños usan los mismos
  ejes**: casi todos vienen con Y arriba y algunos con Z arriba. Para verificar
  que el frente quedó bien, mira la perforación de grifería y el salpicadero:
  deben quedar atrás. Usa
  `"stl": { "escala": 0.001, "arriba": "Y", "adelante": "NEGATIVE_Z" }` y
  corrige las excepciones por archivo con
  `"por_archivo": { "x": { "importacion": { "arriba": "Z", "adelante": "Y" } } }`.
- Algunos diseños (versiones de molde) están modelados boca abajo: se
  corrigen con `"rotacion": [0, 180, 0]`.
- Para lavamanos sirve una vista 3/4 alta (elevación ~32°) para que se vea la
  poceta, con `margen` cerca de 1.0.

## Con IA (Higgsfield)

El módulo 3D de Higgsfield no acepta modelos propios. El render de este script
es la fuente del producto. Si después se ambienta con IA, lo generado se
compone alrededor del render y nunca se publica un producto redibujado (ver
bug 016 en `skills/bugs-knowhow/history.md`).

## Ambientes de baño con pulido en Higgsfield (Mix & Match)

Flujo validado el 2026-11-19 con Vitelli + Oslo y Génova en el ambiente
"Ventana cálida". Blender define cámara, geometría, posición y luz. Higgsfield
pone el ambiente y el realismo. El producto nunca se inventa (bug 016).

| Paso | Script | Qué hace |
|---|---|---|
| 1. Greybox | `greybox-bano.py` | Baño en bruto con la cámara de la Opción C (calibrada contra el render actual, error <1 %) y un esquema de luz por ambiente. |
| 2. Fondo | Higgsfield (`gpt_image_2_6`) | El greybox como referencia de estructura; la zona del mueble queda vacía. Revisar las líneas del greybox sobre el resultado. |
| 3. Montaje | `render-en-ambiente.py --opcion_c` + `componer-ambiente.py --fondo-recorte` | Producto en Blender con la luz del ambiente y el fondo proyectado (reflejos y rebotes), más su sombra, en el cuadro de la Opción C a 1600 px. |
| 4. Pulido | Higgsfield (`gpt_image_2_6`, calidad alta, 2K) | El montaje como referencia, con instrucciones de no mover nada y mejorar solo luz, materiales y sombras. |
| 5. Control | `medir-pulido.py` | % de líneas del producto que siguen en su sitio (≥95 % a ≤3 px; si no, se regenera). |
| 6. Ajuste | `ajustar-pulido.py` | Pega solo el producto sobre el fondo fijo y normaliza el color por material al render (el acabado real, ΔE 0). Transfiere la sombra de contacto de la IA. |
| 7. Mueble fijo | `fijar-mueble.py` | El mueble se pule una vez por ambiente + acabado + estado. De cada lavamanos se toma solo lo que está sobre la costura. |

Resultados de la prueba (`renders-3d/ambientes/pulido/`):
- GPT, FLUX y MiniMax conservan entre 93 % y 98 % de las líneas. Se eligió GPT
  por el realismo de la cerámica.
- Sin el ajuste, el acabado se desvía ΔE 8-16 y la pared repintada deja costura.
- Con el mueble fijo, al cambiar Oslo → Génova solo cambia la zona sobre la
  costura (ver `cambio-oslo-genova.gif`).

Observaciones del GLB `vitelli-63.glb`:
- Las bisagras simplificadas asoman por la puerta: se ocultan con el mueble
  cerrado.
- El Génova trae dos copias completas del lavamanos desplazadas 1.4 cm. Juntas
  se pelean y la cubierta sale negra, así que se oculta `Lavamanos_genova_pieza_0`.

Costo: ~2.75 créditos por imagen de GPT (2K, calidad alta). Cuenta 2 intentos
por pieza.
