# Sesión Lavamanos & Muebles · Opción B: Mix & Match fotorrealista

> [!IMPORTANT]
> **Estrategia Condensada del Segmento**:
> La **Opción B** deja combinar libremente **mueble**, **lavamanos** y **acabado** (y más adelante grifería) sobre renders fotorrealistas, con transiciones que hacen evidente que cada pieza es independiente. Cada render trae una **capa de luz** que permite aplicar cualquiera de los 5 tableros en el navegador: un acabado nuevo cuesta una textura, no una tanda de renders. Convive con la [Opción A](banos_muebles_opcion_a.md) (configurador 3D) en la misma ruta.

## 1. Dónde vive

| Pieza | Ruta |
|---|---|
| Página | `/categoria-producto/banos/combos-lavamanos-con-mueble?opcion=b` (`?opcion=a` o sin parámetro: Opción A) |
| Selector A/B | `components/banos-muebles/SelectorOpcion.tsx` (barra "Prototipos en revisión") |
| Experiencia | `components/banos-muebles/opcion-b/` (`MixMatchB.tsx`, `compositor.ts`, `catalogoMixMatch.ts`, `mixMatchLogica.ts`) |
| Datos de renders | `components/banos-muebles/opcion-b/rendersMixMatch.ts` (generado) |
| Imágenes | `public/images/muebles/opcion-b/` (render + capa por combinación, miniaturas de lavamanos) |
| Script | `scripts/mix-match/preparar-opcion-b.mjs <carpeta-de-renders>` |
| Pruebas | `pruebas-unitarias/mixMatchB.test.ts` |

## 2. Catálogo actual

- **Muebles (2):** *Gola Curva* (un cajón con gola curva; nombre provisional) y *Vitelli 63* (puerta y dos cajones).
- **Lavamanos (5):** *Ovalado sobre mesón* (de sobreponer; nombre provisional), Oslo, Genova, Parma, Siena.
- **Acabados (5):** los tableros compartidos con la Opción A (`ACABADOS_TABLERO`): Blanco Madera, Soder, Austral, Gracia, Mitte.
- **Grifería:** hoy la del render (monocontrol negra; alta para el ovalado). La UI ya tiene el paso 4 para sumar opciones.
- **Combinaciones:** 10. Nueve con render propio; *Vitelli + Ovalado* armada por capas (aviso visible en el escenario).

## 3. Experiencia

| Momento | Qué pasa |
|---|---|
| Entrada | Las piezas llegan separadas (lavamanos arriba, mueble abajo, con etiquetas) y se ensamblan: enseña que se mezclan. |
| Flechas y gesto | Cada pieza tiene sus flechas; deslizar sobre el lavamanos o sobre el mueble cambia esa pieza. |
| Cambiar lavamanos | El anterior sube y se va; el nuevo baja y asienta. El mueble no se mueve. |
| Cambiar mueble | El mueble sale de lado y entra el nuevo; el lavamanos se queda idéntico. |
| Cambiar acabado | La madera nueva barre el mueble de izquierda a derecha con un filo de luz. |
| Piezas | Botón para ver lavamanos y mueble separados en cualquier momento. |
| Fondo | Estudio claro u oscuro (los renders tienen fondo transparente). |
| Cotizar / compartir | WhatsApp con mueble, acabado, lavamanos, grifería y enlace; la URL guarda la combinación. |
| Compatibilidad | Si una pareja no tiene render, se ajusta la otra pieza y se avisa (lista para cuando haya combinaciones no válidas). |

Mismo esqueleto visual que la Opción A (migas, escenario a la izquierda, pasos numerados a la derecha, barra de cotizar en móvil), según la regla de UI unificada.

## 4. Cómo se aplica el acabado

`preparar-opcion-b.mjs` genera por combinación un `-capa.webp`: **R** = máscara del mueble (todo lo opaco bajo la tapa, con color solo en la franja de la costura) y **G** = luz del render sin veta (mediana 11). En el navegador, `compositor.ts` multiplica la textura del tablero por esa luz dentro de la máscara; lavamanos, grifo y sombras quedan como en el render.

Cada lavamanos sale de **un solo render de referencia** (prefiere el del Vitelli) y se monta sobre cada mueble, cortado en la tapa: al cambiar de mueble el lavamanos no cambia ni de luz ni de posición.

## 5. Para sumar piezas

1. Renderizar con **la misma cámara**, fondo transparente, PNG con alfa, nombre `<mueble>__<lavamanos>.png`.
2. No hace falta renderizar todas las parejas: basta **un render por mueble y uno por lavamanos**; las faltantes se arman por capas.
3. Añadir el id en `MUEBLES`/`LAVAMANOS` del script y en `catalogoMixMatch.ts`; correr el script.
4. Un acabado nuevo: solo su textura en `ACABADOS_TABLERO`.

## 6. Pendientes

- [ ] Nombres comerciales de *Gola Curva* y del lavamanos *Ovalado sobre mesón*.
- [ ] Render del *Vitelli + Ovalado* (hoy por capas).
- [ ] Opciones de grifería (renders del grifo como capa aparte).
- [ ] Precios y SKU por combinación.
