"""Compone la capa del producto (render real) sobre la placa aprobada por control, con sombra cálida.
python componer.py <capa.png> <salida.png>  -> además guarda mascara-producto.png"""
import sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageFilter

AQUI = Path(__file__).resolve().parent
placa = np.asarray(Image.open(AQUI / 'placas/gpt26-a.png').convert('RGB')).astype(float) / 255
pr = np.asarray(Image.open(sys.argv[1]).convert('RGBA').resize((placa.shape[1], placa.shape[0]), Image.LANCZOS)).astype(float) / 255
rgb, a = pr[..., :3], pr[..., 3]
prod = (rgb.max(2) > 0.012) | (a > 0.98)
a_prod = np.where(prod, a, 0)
sombra = np.where(prod, 0, a) * 0.85
# leve oclusión de contacto contra la pared izquierda alrededor del mueble
halo = np.asarray(Image.fromarray((a_prod * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(7))
                  .filter(ImageFilter.GaussianBlur(6))).astype(float) / 255 * 0.15
s = 1 - (1 - sombra) * (1 - np.where(prod, 0, halo))
s = s[..., None]
tono = np.array([0.32, 0.30, 0.24])
fondo = placa * (1 - s) + placa * tono * s
out = fondo * (1 - a_prod[..., None]) + rgb * a_prod[..., None]
Image.fromarray((np.clip(out, 0, 1) * 255 + 0.5).astype(np.uint8)).save(sys.argv[2])
Image.fromarray((a_prod * 255).astype(np.uint8)).save(AQUI / 'mascara-producto.png')
print('ok', sys.argv[2])
