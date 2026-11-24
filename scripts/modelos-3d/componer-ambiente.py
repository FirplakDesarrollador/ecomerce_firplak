# Compone un ambiente: fondo generado x (1 - sombra) + producto renderizado.
#
# Entradas (de render-en-ambiente.py): <carpeta>/producto.png y <carpeta>/sombra.png,
# mas el fondo generado de ese ambiente. Es la misma operacion que haria la web
# con tres capas, para revisar la integracion antes de llevarla al sitio.
#
# Uso: python scripts/modelos-3d/componer-ambiente.py <fondo.png> <carpeta> [--sombra 1.0] [--recorte-c x0,y0,x1,y1]
#   --recorte-c guarda ademas el recorte del cuadro de la Opcion C (greybox.json).
import argparse
import os

import numpy as np
from PIL import Image


def main():
    p = argparse.ArgumentParser()
    p.add_argument('fondo')
    p.add_argument('carpeta')
    p.add_argument('--sombra', type=float, default=1.0, help='intensidad de la sombra (0-1+)')
    p.add_argument('--recorte-c', default=None)
    p.add_argument('--fondo-recorte', default=None,
                   help='x0,y0,x1,y1 en pixeles del ambiente de 2400 px: recorta el fondo antes de componer '
                        '(para renders hechos con --opcion_c)')
    a = p.parse_args()

    prod = Image.open(os.path.join(a.carpeta, 'producto.png')).convert('RGBA')
    sombra = Image.open(os.path.join(a.carpeta, 'sombra.png')).convert('RGBA')
    fondo = Image.open(a.fondo).convert('RGB')
    if a.fondo_recorte:
        k = fondo.size[0] / 2400
        fondo = fondo.crop([round(float(v) * k) for v in a.fondo_recorte.split(',')])
    fondo = fondo.resize(prod.size, Image.LANCZOS)

    f = np.asarray(fondo, dtype=np.float32) / 255
    s = np.asarray(sombra, dtype=np.float32)[..., 3:4] / 255 * a.sombra
    pr = np.asarray(prod, dtype=np.float32) / 255
    base = f * (1 - np.clip(s, 0, 1))
    out = pr[..., :3] * pr[..., 3:4] + base * (1 - pr[..., 3:4])
    img = Image.fromarray(np.clip(out * 255 + 0.5, 0, 255).astype(np.uint8))
    destino = os.path.join(a.carpeta, 'compuesto.png')
    img.save(destino)
    print(destino, img.size)
    if a.recorte_c:
        caja = [round(float(v)) for v in a.recorte_c.split(',')]
        rc = img.crop(caja)
        rc.save(os.path.join(a.carpeta, 'compuesto-opcion-c.png'))
        print('recorte Opcion C', caja, rc.size)


main()
