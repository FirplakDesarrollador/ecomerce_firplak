"""Parte 2: composición final retocada (JPG 1360x2048) sobre la placa aprobada r1-gpt26-a.
python componer-final.py
- Producto = render real calibrado (producto-final.png). Nada del producto se pinta ni se genera con IA.
- Sombras: la del shadow catcher se atenúa al 60 % (el greybox es muy difuso y la corría a la izquierda) y se suma
  una sombra de contacto suave: pared bajo el mueble (oclusión) y piso centrado bajo el mueble, en tono cálido.
- Fuera del producto y su sombra la placa no se toca (se verifica).
"""
import json
from pathlib import Path
import numpy as np
from PIL import Image, ImageFilter, ImageDraw

AQUI = Path(__file__).resolve().parent
placa = np.asarray(Image.open(AQUI.parent / 'parte-1/ronda-1/gpt26-a.png').convert('RGB')).astype(float) / 255
pr = np.asarray(Image.open(AQUI / 'producto-final.png').convert('RGBA')).astype(float) / 255
H, W = placa.shape[:2]
rgb, a = pr[..., :3], pr[..., 3]
prod = (rgb.max(2) > 0.012) | (a > 0.98)                 # píxeles del producto (incluye bordes antialias)
a_prod = np.where(prod, a, 0)
sombra_cat = np.where(prod, 0, a)

ys, xs = np.nonzero(a_prod > 0.98)
x0, x1, yb = xs.min(), xs.max(), ys.max()                  # mueble+lavamanos; yb = borde inferior del mueble
PISO = 1520
y0 = ys.min()
# dentro del hueco del mueble la sombra del render se respeta completa; fuera se atenúa al 60 %
dentro = np.zeros((H, W), bool)
ancho = (a_prod > 0.98).sum(1)
y_cuerpo = int(np.argmax(ancho > 0.8 * (x1 - x0)))   # primera fila a todo el ancho (sin la grifería)
dentro[y_cuerpo:yb + 1, x0:x1 + 1] = True
sombra_cat = np.where(dentro, sombra_cat, sombra_cat * 0.6)
cx = (x0 + x1) / 2


def capa(dibujo, blur):
    im = Image.new('L', (W, H), 0)
    dibujo(ImageDraw.Draw(im))
    return np.asarray(im.filter(ImageFilter.GaussianBlur(blur))).astype(float) / 255


# oclusión en la pared bajo el mueble: más fuerte pegado al fondo, se desvanece hacia el piso
pared = capa(lambda d: d.rectangle([x0 + 6, yb - 10, x1 - 6, yb + 45], fill=255), 22) * 0.55
grad = np.clip(1 - (np.arange(H) - yb) / (PISO - yb), 0.25, 1)[:, None]
pared *= grad
pared[PISO:] = 0
# contorno: halo fino de contacto alrededor del mueble sobre la pared
halo = np.asarray(Image.fromarray((a_prod * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(9))
                  .filter(ImageFilter.GaussianBlur(7))).astype(float) / 255 * 0.18
# piso: elipse suave centrada bajo el mueble, junto al zócalo
piso = capa(lambda d: d.ellipse([x0 + 20, PISO - 8, x1 - 20, PISO + 46], fill=255), 18) * 0.5
piso[:PISO - 12] = 0

s = 1 - (1 - sombra_cat) * (1 - pared) * (1 - halo) * (1 - piso)
s = np.where(prod, 0, s)[..., None]
tono = np.array([0.30, 0.24, 0.19])                        # sombra cálida como la luz de la placa
fondo = placa * (1 - s) + placa * tono * s
out = fondo * (1 - a_prod[..., None]) + rgb * a_prod[..., None]
img = Image.fromarray((np.clip(out, 0, 1) * 255 + 0.5).astype(np.uint8))
dest = AQUI.parents[2] / 'entregables/2026-11-23_pollock-63x48-tauari-oslo_directo'
dest.mkdir(parents=True, exist_ok=True)
nombre = 'firplak-pollock-63x48-tauari-oslo-63x48-bano-beige_1360x2048.jpg'
img.save(dest / nombre, quality=92, subsampling=0, optimize=True)
img.crop((380, 850, 950, 1750)).save(AQUI / 'zoom-final.png')

toc = (s[..., 0] > 0.004) | (a_prod > 0)
diff = np.abs(np.asarray(img).astype(float) / 255 - placa).max(2)
print('INFO', json.dumps({'archivo': str(dest / nombre), 'bbox_producto': [int(x0), int(y0), int(x1), int(yb)],
                         'px_placa_modificados_fuera_de_producto_y_sombra': int(((diff > 2 / 255) & ~toc).sum())}))
