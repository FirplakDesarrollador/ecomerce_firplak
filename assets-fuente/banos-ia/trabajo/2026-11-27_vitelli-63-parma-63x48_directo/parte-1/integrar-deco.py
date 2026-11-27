"""Integra la decoración generada por IA sin tocar el producto ni el resto de la placa.
python integrar-deco.py <montaje.png> <deco-ia.png> <salida.png> ['{"cubierta":[x0,y0,x1,y1],"canasto":[...]}']
Solo se toman píxeles de la IA dentro de las zonas de decoración y donde difieren del montaje (objetos y sus sombras).
Fuera de esas zonas la imagen es el montaje (placa + render real)."""
import json
import sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageFilter

AQUI = Path(__file__).resolve().parent
ZONAS = json.loads(sys.argv[4]) if len(sys.argv) > 4 else {'cubierta': (180, 860, 440, 1235), 'canasto': (75, 1590, 340, 1845)}  # ronda 0
base = np.asarray(Image.open(sys.argv[1]).convert('RGB')).astype(float)
ia = np.asarray(Image.open(sys.argv[2]).convert('RGB').resize((base.shape[1], base.shape[0]), Image.LANCZOS)).astype(float)
dif = np.abs(ia - base).max(2)
zona = np.zeros(dif.shape, bool)
for x0, y0, x1, y1 in ZONAS.values():
    zona[y0:y1, x0:x1] = True
lum_b, lum_i = base.mean(2), ia.mean(2)
cro_b, cro_i = base.max(2) - base.min(2), ia.max(2) - ia.min(2)
sel = (dif > 18) & zona
# en el canasto solo el objeto (fibra saturada o toallas blancas) y su sombra de contacto inmediata;
# no se acepta que la IA aclare el piso (borraría la sombra real del mueble)
x0, y0, x1, y1 = ZONAS['canasto']
can = np.zeros_like(zona)
can[y0:y1, x0:x1] = True
objeto = (cro_i > cro_b + 12) | ((lum_i > lum_b + 20) & (lum_i > 200))
contacto = (lum_i < lum_b - 10)
sel = np.where(can, (dif > 18) & (objeto | contacto), sel)
m = sel.astype(np.uint8) * 255
m = Image.fromarray(m).filter(ImageFilter.MaxFilter(9)).filter(ImageFilter.MinFilter(5)).filter(ImageFilter.GaussianBlur(3))
m = np.asarray(m).astype(float)[..., None] / 255 * zona[..., None]
out = base * (1 - m) + ia * m
Image.fromarray(out.clip(0, 255).astype(np.uint8)).save(sys.argv[3])
prod = np.asarray(Image.open(AQUI / 'mascara-producto.png')).astype(float) / 255
print('INFO', json.dumps({'px_tomados_de_ia': int((m[..., 0] > 0.5).sum()),
                         'px_producto_ocultos_por_deco': int(((m[..., 0] > 0.5) & (prod > 0.5)).sum()),
                         'px_producto_total': int((prod > 0.5).sum())}))
