# Pone varios renders de render-bulk.py uno junto al otro en una sola imagen.
#
# Todos se recortan con la MISMA caja (la union de lo que ocupan), asi cada
# producto conserva exactamente su posicion y escala de render: la perspectiva
# sigue siendo identica entre ellos.
#
# Uso: python scripts/modelos-3d/componer-lado-a-lado.py salida.png render1.png render2.png ...
#      [--separacion 80] [--margen 120] [--fondo #ffffff]
# Requiere Pillow (pip install pillow).
import argparse

from PIL import Image, ImageChops


def caja_contenido(im, fondo, umbral=6):
    base = Image.new('RGB', im.size, fondo)
    dif = ImageChops.difference(im, base).convert('L').point(lambda v: 255 if v > umbral else 0)
    return dif.getbbox()


def main():
    p = argparse.ArgumentParser()
    p.add_argument('salida')
    p.add_argument('renders', nargs='+')
    p.add_argument('--separacion', type=int, default=80)
    p.add_argument('--margen', type=int, default=120)
    p.add_argument('--fondo', default='#ffffff')
    a = p.parse_args()
    fondo = tuple(int(a.fondo.lstrip('#')[i:i + 2], 16) for i in (0, 2, 4))

    ims = []
    for r in a.renders:
        im0 = Image.open(r).convert('RGBA')
        im = Image.new('RGB', im0.size, fondo)
        im.paste(im0, mask=im0.split()[3])
        ims.append(im)
    if len({im.size for im in ims}) != 1:
        raise SystemExit('Los renders deben tener la misma resolucion (misma config).')

    cajas = [caja_contenido(im, fondo) for im in ims]
    caja = (min(c[0] for c in cajas), min(c[1] for c in cajas), max(c[2] for c in cajas), max(c[3] for c in cajas))
    recortes = [im.crop(caja) for im in ims]
    w, h = recortes[0].size
    total = Image.new('RGB', (a.margen * 2 + w * len(recortes) + a.separacion * (len(recortes) - 1),
                              a.margen * 2 + h), fondo)
    for i, r in enumerate(recortes):
        total.paste(r, (a.margen + i * (w + a.separacion), a.margen))
    total.save(a.salida)
    print(f'{a.salida}: {total.size[0]}x{total.size[1]} px, {len(recortes)} renders')


main()
