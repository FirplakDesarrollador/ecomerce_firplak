# Mide cuanto se desvio la geometria del producto en una imagen pulida por IA
# y compone la version con fondo congelado.
#
# Referencia: producto.png (render de Blender, RGBA) de render-en-ambiente.py.
# Para cada imagen pulida:
#   - lineas: % de los bordes del producto (contorno, juntas, poceta) que la
#     imagen pulida conserva a <=3 px y <=8 px (a 1600 px de lado).
#   - desplazamiento: corrimiento global que mejor alinea los bordes.
#   - <nombre>-fondo-fijo.png: solo la zona del producto y su sombra de la
#     imagen pulida, pegada con borde suave sobre el fondo original.
#
# Uso: python scripts/modelos-3d/medir-pulido.py <carpeta> <fondo.png> --fondo-recorte x0,y0,x1,y1 <pulida1.png> ...
import argparse
import os

import numpy as np
from PIL import Image, ImageFilter


def bordes(rgb):
    g = np.asarray(rgb.convert('L'), dtype=np.float32)
    gx = np.zeros_like(g); gy = np.zeros_like(g)
    gx[:, 1:-1] = g[:, 2:] - g[:, :-2]
    gy[1:-1, :] = g[2:, :] - g[:-2, :]
    return np.hypot(gx, gy)


def dilatar(m, r):
    im = Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(2 * r + 1))
    return np.asarray(im) > 127


def main():
    p = argparse.ArgumentParser()
    p.add_argument('carpeta')
    p.add_argument('fondo')
    p.add_argument('--fondo-recorte', required=True)
    p.add_argument('pulidas', nargs='+')
    a = p.parse_args()

    prod = Image.open(os.path.join(a.carpeta, 'producto.png')).convert('RGBA')
    n = prod.size[0]
    alfa = np.asarray(prod)[..., 3] > 128
    sombra = np.asarray(Image.open(os.path.join(a.carpeta, 'sombra.png')).convert('RGBA'))[..., 3] / 255
    base = Image.open(os.path.join(a.carpeta, 'compuesto.png')).convert('RGB')
    fondo = Image.open(a.fondo).convert('RGB')
    k = fondo.size[0] / 2400
    fondo = fondo.crop([round(float(v) * k) for v in a.fondo_recorte.split(',')]).resize((n, n), Image.LANCZOS)

    # Bordes de referencia: los del montaje dentro del producto (sin el borde exterior del fondo).
    eb = bordes(base)
    zona = dilatar(alfa, 2)
    ref = (eb > np.percentile(eb[zona], 80)) & zona

    # Mascara de pegado: producto + margen + sombra visible, con borde suave.
    pegar = dilatar(alfa, 18) | (sombra > 0.08)
    mask = Image.fromarray((pegar * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(10))
    m = np.asarray(mask, dtype=np.float32)[..., None] / 255
    f = np.asarray(fondo, dtype=np.float32)

    for ruta in a.pulidas:
        im = Image.open(ruta).convert('RGB').resize((n, n), Image.LANCZOS)
        eg = bordes(im)
        gen = eg > np.percentile(eg[zona], 80)
        # Mejor desplazamiento global (busqueda gruesa a media resolucion).
        mejor = (0, 0, -1)
        r2 = dilatar(gen, 2)
        for dy in range(-24, 25, 3):
            for dx in range(-24, 25, 3):
                s = (np.roll(r2, (dy, dx), (0, 1)) & ref).sum()
                if s > mejor[2]:
                    mejor = (dx, dy, s)
        tot = ref.sum()
        p3 = (dilatar(gen, 3) & ref).sum() / tot
        p8 = (dilatar(gen, 8) & ref).sum() / tot
        nombre = os.path.splitext(os.path.basename(ruta))[0]
        print(f'{nombre:12s} lineas<=3px {p3:5.1%}  <=8px {p8:5.1%}  desplazamiento ({mejor[0]:+d},{mejor[1]:+d}) px')
        out = np.asarray(im, dtype=np.float32) * m + f * (1 - m)
        Image.fromarray(np.clip(out, 0, 255).astype(np.uint8)).save(os.path.join(os.path.dirname(ruta), f'{nombre}-fondo-fijo.png'))


main()
