# Lleva la imagen pulida por IA al montaje sin costuras ni cambio de acabado.
#
#  1. Pega SOLO el producto (alfa del render de Blender, borde de 1-2 px), no
#     la pared que la IA repinto: el fondo es el del montaje (fondo generado x
#     sombra de Blender), identico en todas las combinaciones.
#  2. Normaliza el color por material: debajo de la costura (mueble) y encima
#     (lavamanos + grifo) se igualan media y desviacion de cada canal en Lab a
#     las del render de Blender. Se conserva la textura, los reflejos y las
#     sombras finas de la IA; el tono del acabado vuelve a ser el real.
#
# Uso: python scripts/modelos-3d/ajustar-pulido.py <carpeta> <costura_fraccion> <pulida.png> ...
#   costura_fraccion: fila donde empieza el mueble (rendersOpcionC.ts, p. ej. 0.395).
import os
import sys

import numpy as np
from PIL import Image, ImageFilter


def a_lab(rgb):
    c = rgb / 255.0
    c = np.where(c > 0.04045, ((c + 0.055) / 1.055) ** 2.4, c / 12.92)
    M = np.array([[0.4124, 0.3576, 0.1805], [0.2126, 0.7152, 0.0722], [0.0193, 0.1192, 0.9505]])
    xyz = c @ M.T / np.array([0.9505, 1.0, 1.089])
    f = np.where(xyz > 0.008856, np.cbrt(xyz), 7.787 * xyz + 16 / 116)
    return np.stack([116 * f[..., 1] - 16, 500 * (f[..., 0] - f[..., 1]), 200 * (f[..., 1] - f[..., 2])], -1)


def de_lab(lab):
    fy = (lab[..., 0] + 16) / 116
    fx, fz = fy + lab[..., 1] / 500, fy - lab[..., 2] / 200
    inv = lambda t: np.where(t ** 3 > 0.008856, t ** 3, (t - 16 / 116) / 7.787)
    xyz = np.stack([inv(fx), inv(fy), inv(fz)], -1) * np.array([0.9505, 1.0, 1.089])
    M = np.linalg.inv(np.array([[0.4124, 0.3576, 0.1805], [0.2126, 0.7152, 0.0722], [0.0193, 0.1192, 0.9505]]))
    c = np.clip(xyz @ M.T, 0, 1)
    c = np.where(c > 0.0031308, 1.055 * c ** (1 / 2.4) - 0.055, 12.92 * c)
    return c * 255


def a_lineal(rgb):
    c = rgb / 255.0
    return np.where(c > 0.04045, ((c + 0.055) / 1.055) ** 2.4, c / 12.92)


def a_srgb(lin):
    c = np.clip(lin, 0, 1)
    return np.where(c > 0.0031308, 1.055 * c ** (1 / 2.4) - 0.055, 12.92 * c) * 255


def desenfocar(x, r, veces=3):
    """Desenfoque gaussiano aproximado (cajas separables) para mapas float."""
    for _ in range(veces):
        for eje in (0, 1):
            pad = [(0, 0)] * x.ndim
            pad[eje] = (r + 1, r)
            c = np.cumsum(np.pad(x, pad, mode='edge'), axis=eje)
            x = (np.take(c, range(2 * r + 1, c.shape[eje]), axis=eje) - np.take(c, range(0, c.shape[eje] - 2 * r - 1), axis=eje)) / (2 * r + 1)
    return x


def sombra_contacto(ia, fondo, alfa):
    """Sombra que el producto proyecta en la imagen de la IA, aislada de su re-iluminacion.

    ratio = luminancia IA / luminancia del fondo fijo. Su variacion lenta (la IA
    repinto la pared mas calida o mas fria, manchas de luz lejanas) se quita
    dividiendo por su version muy desenfocada, calculada sin el producto. Queda
    el oscurecimiento local, que se limita a una franja alrededor del mueble."""
    Y = lambda rgb: a_lineal(rgb) @ np.array([0.2126, 0.7152, 0.0722])
    ratio = (Y(ia) + 0.01) / (Y(fondo) + 0.01)
    fuera = (alfa < 0.02).astype(np.float64)
    fuera = np.asarray(Image.fromarray((fuera * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(7)), dtype=np.float64) / 255
    lento = desenfocar(ratio * fuera, 160) / np.maximum(desenfocar(fuera, 160), 1e-3)
    local = ratio / np.maximum(lento, 1e-3)
    s = np.clip(1 - local, 0, 0.85)
    # Solo cerca del producto (debajo y detras del mueble flotante), con caida suave.
    cerca = np.asarray(Image.fromarray(((alfa > 0.5) * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(241)), dtype=np.float64) / 255
    cerca = desenfocar(cerca, 25)
    s = desenfocar(s, 4, 2) * cerca * fuera
    return s


SOMBRA_IA = '--sin-sombra-ia' not in sys.argv
sys.argv = [a for a in sys.argv if a != '--sin-sombra-ia']


def main():
    carpeta, costura = sys.argv[1], float(sys.argv[2])
    prod = Image.open(os.path.join(carpeta, 'producto.png')).convert('RGBA')
    n = prod.size[0]
    alfa = np.asarray(prod, dtype=np.float32)[..., 3] / 255
    base = np.asarray(Image.open(os.path.join(carpeta, 'compuesto.png')).convert('RGB'), dtype=np.float32)
    # Fondo del montaje sin producto: fondo x sombra (se reconstruye quitando el producto).
    fondo_sombra = np.clip((base - np.asarray(prod, dtype=np.float32)[..., :3] * alfa[..., None]) / np.maximum(1 - alfa[..., None], 1e-3), 0, 255)
    nucleo = np.asarray(Image.fromarray((alfa > 0.5).astype(np.uint8) * 255).filter(ImageFilter.MinFilter(5))) > 127
    filas = np.arange(n)[:, None] * np.ones((1, n))
    regiones = [nucleo & (filas >= costura * n), nucleo & (filas < costura * n)]
    lab_ref = a_lab(base)
    borde = np.asarray(Image.fromarray((alfa * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2)), dtype=np.float32)[..., None] / 255
    for ruta in sys.argv[3:]:
        im = np.asarray(Image.open(ruta).convert('RGB').resize((n, n), Image.LANCZOS), dtype=np.float32)
        lab = a_lab(im)
        out_lab = lab.copy()
        for r in regiones:
            mu_g, sd_g = lab[r].mean(0), lab[r].std(0) + 1e-3
            mu_r, sd_r = lab_ref[r].mean(0), lab_ref[r].std(0)
            # Media completa al render (tono del acabado real); contraste: mitad IA, mitad render.
            esc = 0.5 + 0.5 * sd_r / sd_g
            # Se aplica a toda la mitad (arriba/abajo) para no dejar saltos en el borde del nucleo.
            zona = (filas >= costura * n) if r is regiones[0] else (filas < costura * n)
            out_lab[zona] = (lab[zona] - mu_g) * esc + mu_r
        rgb = de_lab(out_lab)
        fondo = fondo_sombra
        if SOMBRA_IA:
            s = sombra_contacto(im, fondo_sombra, alfa)
            fondo = a_srgb(a_lineal(fondo_sombra) * (1 - s[..., None]))
            Image.fromarray((np.clip(s, 0, 1) * 255).astype(np.uint8)).save(
                os.path.join(os.path.dirname(ruta), f'{os.path.splitext(os.path.basename(ruta))[0]}-sombra-ia.png'))
        out = rgb * borde + fondo * (1 - borde)
        nombre = os.path.splitext(os.path.basename(ruta))[0]
        destino = os.path.join(os.path.dirname(ruta), f'{nombre}-ajustado.png')
        Image.fromarray(np.clip(out + 0.5, 0, 255).astype(np.uint8)).save(destino)
        d = [np.linalg.norm(a_lab(out)[r].mean(0) - lab_ref[r].mean(0)) for r in regiones]
        print(f'{nombre:10s} dE mueble {d[0]:.1f}  dE lavamanos {d[1]:.1f}  -> {destino}')


main()
