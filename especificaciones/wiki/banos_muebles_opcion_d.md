# Sesión Lavamanos & Muebles · Opción D: Mix & Match isométrico

> [!IMPORTANT]
> **Estrategia Condensada del Segmento**:
> La **Opción D** arma el baño pieza por pieza sobre los renders isométricos del usuario (v3 iso): **mueble** y su acabado, **lavamanos** y su color de gelcoat, **grifería** y su acabado. Se **abre** con el cierre suave real (arranque rápido, final lento) y la cota de los rieles de 35 cm, se **abre el agua** para ver el aireador de aire inducido, y se compra **el conjunto o cada pieza sola** con su precio sugerido. Todo sale de los renders, sin renders nuevos ni 3D en el navegador. Convive con las opciones [A](banos_muebles_opcion_a.md), [B](banos_muebles_opcion_b.md) y [C](banos_muebles_opcion_c.md) en la misma ruta.

## 1. Dónde vive

| Pieza | Ruta |
|---|---|
| Página | `/categoria-producto/banos/combos-lavamanos-con-mueble?opcion=d` |
| Selector | `components/banos-muebles/SelectorOpcion.tsx` ("Opción D · Mix & Match iso") |
| Experiencia | `components/banos-muebles/opcion-d/` (`EstudioD.tsx` página y panel, `EscenarioD.tsx` escenario, `animacionD.ts` movimiento de cajones y puerta, `AguaD.tsx` chorro y aireador, `componerD.ts` composición, `pixelesD.ts` operaciones de píxel, `catalogoOpcionD.ts`, `opcionDLogica.ts`) |
| Datos de renders | `components/banos-muebles/opcion-d/rendersOpcionD.ts` (generado) |
| Imágenes | `public/images/muebles/opcion-d/` (88 archivos, ~4,4 MB; se descargan por demanda) |
| Script | `node scripts/mix-match/preparar-opcion-d.mjs "<carpeta v3 iso>" "<carpeta Nuevos linea>"` |
| Pruebas | `pruebas-unitarias/opcionD.test.ts` |

## 2. Catálogo

- **Muebles (2):** Vitelli (puerta y dos cajones) y Tucano (dos cajones). Rieles de extensión total de 35 cm y cierre suave.
- **Acabados del mueble (6):** Blanco nevado (**unicolor**: color plano, sin veta) y cinco melaminas impresas maderadas: Tauari, Mali, Nola, Tambo y Candelaria, tomadas de las fotos de tablero de *Linea FPK / Nuevos linea*. La veta corre a lo largo de los frentes y en vertical en los costados.
- **Lavamanos (4):** Oslo, Génova, Parma y Siena, todos de 63 × 48 cm. **Gelcoat** en Blanco (el del render), Marfil y Niebla (colores de las muestras del usuario); los reflejos del esmalte se conservan.
- **Grifería (2 modelos × 4 acabados):** monocontrol bajo (renderizado en níquel) y alto (renderizado en negro), cada uno con níquel cepillado, negro mate, cromo y oro cepillado. Solo el acabado renderizado es real; los demás son **vista previa** y así se rotula.
- **Combinaciones:** 2 × 6 × 4 × 3 × 2 × 4 = **1.152**.
- **Precios sugeridos** (COP, provisionales hasta tener los reales): mueble $720.000, lavamanos $320.000, grifería $280.000; el conjunto es la suma ($1.320.000). Siempre se muestran como "precio sugerido".

## 3. Experiencia

| Momento | Qué pasa |
|---|---|
| Entrada | El mueble se abre y se cierra solo una vez: se ve el cierre suave. Un pulso en el aireador invita a abrir el agua. |
| Abrir / cerrar | Botón o toque sobre el mueble. Al abrir, la puerta gira primero y los cajones salen detrás; al cerrar, los cajones entran primero y la puerta después. Cierre con amortiguador: arranca rápido y frena hasta detenerse (`(1 − t)⁴`). |
| Cota de 35 cm | Una cota acompaña al cajón de abajo y cuenta de 0 a 35 cm mientras sale ("extensión total"). |
| Agua | Botón o toque sobre la grifería: un chorro blanco aireado baja desde el aireador y hace espuma en la poceta. Aparece la lupa del aireador (corte: el agua baja por el centro, el aire entra por las ranuras y sale un chorro espumoso). |
| Qué te llevas | Conjunto / Mueble / Lavamanos / Grifería, en el escenario y en el paso 4. Mueble: el lavamanos se levanta y queda el mueble solo. Lavamanos: el mueble queda en gris y la grifería como fantasma ("Grifería no incluida"). Grifería: acercamiento a la grifería con el resto atenuado. El precio del escenario cambia con la elección. |
| Cambios | Acabado: la madera nueva barre el mueble con un filo de luz. Lavamanos: el anterior sube y el nuevo baja. Color, grifería y mueble: fundido. La imagen anterior se mantiene hasta que la nueva está lista (no hay pantallas de espera al navegar). |
| Compartir y cotizar | La combinación vive en la URL (`mueble`, `acabado`, `lavamanos`, `color`, `grifo`, `acabadogrifo`, `compra`). WhatsApp lleva la descripción de lo que se compra y su precio sugerido. |

## 4. Cómo funciona (sin renders nuevos)

1. **Tapa y cuerpo.** El script corta cada render por el borde inferior del lavamanos: arriba la **tapa** (lavamanos + grifería), abajo el **cuerpo** (mueble). El corte se busca columna a columna sobre la madera y se ajusta a las dos aristas rectas del lavamanos (frente y costado): en frentes muy claros la madera no se detecta y el corte bajaría (pasaba en el Génova). Así cualquier grifería va sobre cualquier mueble.
2. **Acabados.** Cada cuerpo trae una capa (madera y plano frente/costado) y una **luz** filtrada que respeta los bordes (transformada de dominio): alisa la veta del render para que el blanco sea plano y se detiene en juntas y cambios de plano para no dejar halos.
3. **Cajones.** Entre el render cerrado y el abierto: el cajón se dibuja recortado al volumen que barre su frente y trasladado a la apertura actual; el hueco muestra el interior del render abierto. Se dibujan de abajo hacia arriba.
4. **Puerta.** Gira sobre la bisagra (ángulo del render abierto, ~91°) como dos triángulos con transformación afín: cara exterior del render cerrado hasta quedar de canto (~50°) y luego la interior con las bisagras del render abierto.
5. **Agua.** SVG en coordenadas del render, desde la salida del aireador (`SALIDA_GRIFO_D`) hasta el fondo de la poceta (`FONDO_POCETA_D`).

## 5. Para sumar piezas

- **Otro mueble:** render iso cerrado y abierto, solo y con cada lavamanos, misma cámara (2000 × 2000 con alfa). Medir los frentes de los cajones (y la puerta) cerrados y su desplazamiento en el abierto (`CAJONES` / `PUERTA` del script) y volver a correr el script.
- **Otro lavamanos:** un render por mueble, cerrado y abierto. La salida de la grifería se detecta sola; el fondo de la poceta se ajusta a ojo en `FONDO_POCETA_D`.
- **Otro acabado:** foto del tablero en la carpeta de tableros y una línea en `ACABADOS` del script y en `ACABADOS_D`.
