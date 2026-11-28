# Registro del catálogo Mix & Match (Opción D)

`catalogo-mix-match.json` es la única lista de lo que existe en el Mix & Match: ambientes, acabados,
muebles, lavamanos, cruces compatibles (con fuente) y cruces no ofrecidos. De él leen:

| Quién | Qué toma del registro |
|---|---|
| `scripts/modelos-3d/escena-v4.py` | ambientes y su función constructora |
| `scripts/modelos-3d/render-capas-v4.py` | qué capas renderizar y con qué fuente 3D; renderiza solo lo que falta |
| `scripts/mix-match/publicar-capas-v4.py` | manifiesto, cruces, controles y hojas de revisión |
| `pruebas-unitarias/opcionD.test.ts` | expectativas (piezas, cruces, no ofrecidos, conteos) |
| `pruebas-e2e/opcionD.spec.ts` | recorrido de cruces (vía manifiesto) |
| Web (`catalogoOpcionD.ts`) | nombres y orden de muebles y lavamanos (vía manifiesto) |

## Flujo de trabajo

1. Editar `catalogo-mix-match.json` (ver casos abajo).
2. Prueba rápida: `blender -b -P scripts/modelos-3d/render-capas-v4.py -- faltantes --prueba`
   (16 muestras al 50 % en `capas/prueba/`, no toca nada publicado).
3. Lote: `blender -b -P scripts/modelos-3d/render-capas-v4.py -- faltantes`
   Solo renderiza las capas nuevas o cuyas entradas cambiaron (huellas en `capas/huellas.json`).
   `--forzar` re-renderiza todo; `--solo <id>` limita a una pieza.
4. Publicar y controlar: `python scripts/mix-match/publicar-capas-v4.py`
5. Pruebas: `npx vitest run`, `npx tsc --noEmit`, `npx eslint .`,
   `URL_BASE=http://localhost:<puerto> npx playwright test pruebas-e2e/opcionD.spec.ts`.

## Casos

- **Nuevo lavamanos**: agregar en `lavamanos` (STL de Fusion en mm, eje `arriba`) y sus cruces con fuente.
  El render lo ancla por contacto sobre la tapa del grupo de corte y asienta la grifería en su perforación.
- **Nuevo mueble**: agregar en `muebles` con `fuente` (`obj` con su transformación, o `stl` en mm que se
  ancla al plano de contacto del grupo), `grupo_corte`, `acabados`, `estados` y sus cruces. Se renderiza su
  capa y su sombra en cada ambiente. Si su tapa difiere del grupo, el render falla con el motivo: un
  segundo grupo de corte aún no está soportado en manifiesto ni web.
- **Nuevo acabado de mueble**: agregar en `acabados` (textura) y en `acabados` de cada mueble que lo
  ofrece, más los cruces con ese acabado. La muestra del selector debe existir en `ACABADOS_D`.
- **Nuevo ambiente**: diseñar su función en `escena-v4.py`, generar y validar la placa (flujo VIBEWORKFLOW
  87890707) y agregarlo en `ambientes`. Solo se renderizan sus sombras.
- **Cambio de cámara o vista**: no se hace aquí; es el flujo de reset (VIBEWORKFLOW dffb6324), que crea
  una escena nueva.

## Límites conocidos

- Solo estado `cerrado` y un grupo de corte (`tapa-48`); el render lo comprueba y explica si no se cumple.
- Lavamanos con un solo color y grifería negra dentro de su capa: un color nuevo de lavamanos o de
  grifería requiere decidir antes si la grifería pasa a capa propia (cambia manifiesto y UI).
- El tipo de fuente `stl` para muebles está implementado pero aún no se ha probado con un mueble real.
