# Renders fuente · Mix & Match (visualización Alejandro)

PNG originales (fondo transparente, vista 3/4) del Mix & Match. La web no los usa
directamente: se convierten a `.webp` optimizados en `public/images/muebles/`.
La equivalencia con los nombres originales está en `nombres-originales.csv`.

## Estructura

```
lavamanos/<modelo>[-lado]__[color__]<grifo>.png
muebles/<modelo>/<modelo>__<acabado>__<estado>.png
```

- Todo en minúscula, sin tildes ni espacios; `__` separa las partes.
- `estado`: `cerrado` o `abierto`. En los archivos originales, `-2` = abierto.
- `grifo`: `grifo-cromo`, `grifo-negro` o `sin-grifo`.
- `acabado`: `blanco`, `carbono`, `gracia`, `mitte`, `soder`, `tribeca`.

## Inventario (18-11-2026)

Lavamanos (63 × 48): Bari, Génova, Oslo (2), Parma izquierdo (3) y derecho,
Quadratto blanco y marfil, Siena, Trentino.

| Mueble (63 × 48) | Acabados | Estados |
|---|---|---|
| Básico elevado | los 6 | cerrado + abierto |
| Greco | los 6 | cerrado + abierto |
| Tiziano | los 6 | cerrado + abierto |
| Valdez piso | los 6 | cerrado + abierto |
| Macao | solo tribeca | cerrado + abierto |
| Misus | solo blanco | cerrado + abierto |
| Godai (kit, 4 configuraciones) | solo soder | incompleto |

## Cómo llegan a la web (Opción D)

```bash
node scripts/mix-match/preparar-opcion-d.mjs
```

El script recorta cada pieza, borra sombras y el sifón, mide dónde encaja el
lavamanos sobre la tapa del mueble y escribe `components/banos-muebles/opcion-d/rendersOpcionD.ts`.
Qué lavamanos y muebles entran se define al inicio del script (`LAVAMANOS`, `MUEBLES`).

Quedan fuera por ahora:
- `parma-derecho__grifo-negro`, `parma-izquierdo__grifo-negro` y `parma-izquierdo__sin-grifo`:
  son 4K con **otra cámara** y salen torcidos sobre el mueble. Re-renderizarlos con la cámara de los demás.
- `oslo__blanco__grifo-cromo`: se ve igual al otro Oslo; se usa `oslo__grifo-cromo`.
- Godai: solo `estructura-piso-cubo-cajon` (la única con cerrado y abierto).

## Para agregar más
Misma cámara 3/4 que el resto, fondo transparente, sin sombra de piso.
Respeta el patrón de nombres, súbelos a la carpeta que corresponda y vuelve a correr el script.
