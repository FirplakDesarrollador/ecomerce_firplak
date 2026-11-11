# Sesión Lavamanos & Muebles · Opción C: Estudio Mix & Match (propuesta Ricardo)

> [!IMPORTANT]
> **Estrategia Condensada del Segmento**:
> La **Opción C** es un estudio 2D sobre renders fotorrealistas de la misma cámara frontal: el cliente elige **lavamanos**, **mueble**, **acabado** y **grifería**, lo **abre** para verlo por dentro y lo mira **por partes** (solo el lavamanos o solo el mueble). Todo se arma con imágenes del 3D, sin cargar three.js. Convive con la [Opción A](banos_muebles_opcion_a.md) y la [Opción B](banos_muebles_opcion_b.md) en la misma ruta, y es la que abre el menú del landing **Ricardo**.

## 1. Dónde vive

| Pieza | Ruta |
|---|---|
| Página | `/categoria-producto/banos/combos-lavamanos-con-mueble?opcion=c` |
| Selector | `components/banos-muebles/SelectorOpcion.tsx` ("Opción C · Ricardo") |
| Entrada desde el landing | `FirplakLivingSpacesExperience` pasa `urlLavamanosMuebles` a `LoomereNavbar`; los landings de Alejandro e Isabel/Gabriel no cambian |
| Experiencia | `components/banos-muebles/opcion-c/` (`EstudioC.tsx` panel y página, `EscenarioC.tsx` escenario, `componerC.ts` composición, `pixelesC.ts` operaciones de píxel, `catalogoOpcionC.ts`, `opcionCLogica.ts`) |
| Datos de renders | `components/banos-muebles/opcion-c/rendersOpcionC.ts` (generado) |
| Imágenes | `public/images/muebles/opcion-c/` (~2,7 MB en total; se descargan por demanda) |
| Script | `scripts/mix-match/preparar-opcion-c.mjs <carpeta-de-renders>` |
| Pruebas | `pruebas-unitarias/opcionC.test.ts` |

## 2. Catálogo actual

Nombres y medidas tomados del catálogo de firplak.com (`scripts/mix-match/resultados-firplak.json`): todas las piezas son de **63 × 48 cm**, por eso el mensaje "todo combina con todo".

- **Lavamanos (4):** Oslo, Génova, Parma (poceta a la izquierda), Siena.
- **Muebles:** *Vitelli 63* (elevado, puerta y dos cajones), con la serie completa. *Gola Curva* (nombre provisional, no aparece en el catálogo) se muestra como **Pronto**, con su foto de referencia y cotización directa.
- **Acabados (5):** los tableros compartidos (`ACABADOS_TABLERO`). Los renders vienen en **Soder**: con Soder se muestra el render tal cual.
- **Grifería (4):** Negro (la del render), y Cromo, Oro cepillado y Níquel cepillado como **vista previa** recoloreada sobre el mismo grifo.
- **Combinaciones visibles hoy:** 4 × 1 × 5 × 4 = **80**.

## 3. Experiencia

| Momento | Qué pasa |
|---|---|
| Entrada | Las piezas llegan separadas con su nombre, se ensamblan y el mueble se abre un instante: enseña que se mezcla y que se abre. |
| Conjunto / Lavamanos / Mueble | Control en el escenario. "Lavamanos" baja el mueble y acerca el lavamanos solo; "Mueble" levanta el lavamanos y deja el mueble sin él (caja abierta arriba). |
| Abrir | Botón o toque sobre el mueble: puerta y cajones abiertos, con sifón y herrajes reales del render. |
| Cambiar lavamanos | Flechas, deslizar sobre el lavamanos, teclado (← →) o las tarjetas. El anterior sube y el nuevo baja. |
| Cambiar mueble | Flechas a la altura del mueble y tarjetas del paso 2. Hoy llevan al Gola Curva (Pronto). |
| Acabado | La madera nueva barre el mueble con un filo de luz (también en la vista "Mueble"). |
| Grifería | Fundido sobre el grifo; el pie de foto marca "(vista previa)" si es simulada. |
| Sorpréndeme | Cambia lavamanos, acabado y grifería a la vez. |
| Por dentro | Sección con la vista 3/4 del render y tres detalles numerados; "Ábrelo en el estudio" vuelve arriba con el mueble abierto. |
| Cotizar / compartir | WhatsApp con lavamanos, medida, mueble, acabado, grifería y enlace; la URL guarda la combinación (`lavamanos`, `mueble`, `acabado`, `griferia`). |
| Móvil | El escenario queda pegado bajo la cabecera mientras se baja por los pasos; la barra de cotizar acompaña solo dentro del estudio. |

Mismo esqueleto que A y B (migas, escenario a la izquierda, pasos numerados a la derecha), según la regla de UI unificada.

## 4. Cómo se arma la imagen

`preparar-opcion-c.mjs` genera, por vista, el render a 1600 px y una **capa** (`-capa.webp`):

- **R** máscara del mueble. Cerrado: todo lo opaco bajo la tapa (corte recto en la unión con el lavamanos). Abierto: por color (deja fuera bisagras, rieles y sifón); lo que no se mueve al abrir conserva la máscara del cerrado.
- **G** luz sin veta (mediana 9). Las juntas entre puerta y cajones y los cantos con brillo se toman del render para que se lean con cualquier acabado. Sobre el grifo, G guarda su luminancia limpia.
- **B** máscara del grifo (la columna opaca sobre la cubierta y lo oscuro delante de ella).

El estado **abierto** usa el lavamanos y el grifo del render cerrado, y su exposición se iguala a la del cerrado: al abrir no salta nada. En el navegador, `componerC.ts` multiplica la textura del tablero por la luz y recolorea el grifo (`tonoMetal`); con Soder y grifería negra dibuja el render sin tocar.

## 5. Para sumar piezas

Convención de entrega (PNG 2000 × 2000 con alfa, **misma cámara** que el Vitelli):

| Archivo | Para qué |
|---|---|
| `<mueble>__<lavamanos>__cerrado.png` | Conjunto cerrado |
| `<mueble>__<lavamanos>__abierto.png` | El mismo conjunto abierto |
| `<mueble>__solo__cerrado.png` y `__abierto.png` | Vista "Mueble" |
| `<mueble>__iso.png` (opcional) | Sección "Por dentro" |
| `<mueble>__<lavamanos>__referencia.png` (opcional) | Foto suelta de un mueble que aún no tiene la serie |

1. Dejar los PNG en una carpeta y correr `node scripts/mix-match/preparar-opcion-c.mjs <carpeta>`.
2. Añadir el id en `MUEBLES`/`LAVAMANOS` del script y en `catalogoOpcionC.ts` (`disponible: true`).
3. Un acabado nuevo: solo su textura en `ACABADOS_TABLERO`. Una grifería con render propio: reemplaza el tono simulado.

**Para que el Gola Curva entre al estudio:** sus renders con la cámara del Vitelli (los 4 lavamanos cerrado y abierto, y el mueble solo cerrado y abierto). La foto actual (`curva__siena__referencia`) tiene otra altura de cámara y no se puede mezclar.

## 6. Pendientes

- [ ] Renders del Gola Curva con la cámara del estudio (y su nombre comercial).
- [ ] Grifería renderizada como capa propia (modelos y acabados reales) para reemplazar la vista previa.
- [ ] Confirmar si el Parma del render es la versión "izquierdo" del catálogo.
- [ ] Precios y SKU por combinación.
