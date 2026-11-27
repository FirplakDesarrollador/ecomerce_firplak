"""Mide ΔE76 del Soder (costado del mueble en la composición) vs la muestra del usuario.
python medir.py <capa.png>"""
import sys
from pathlib import Path
import numpy as np
from PIL import Image

AQUI = Path(__file__).resolve().parent
RAW = AQUI.parents[2] / 'raw' / AQUI.parent.name
ZONA = (60, 1260, 330, 1560)   # x0, y0, x1, y1 del costado del mueble en la placa 1360x2048


def lab(rgb):
    c = rgb / 255.0
    c = np.where(c > 0.04045, ((c + 0.055) / 1.055) ** 2.4, c / 12.92)
    xyz = c @ np.array([[0.4124, 0.3576, 0.1805], [0.2126, 0.7152, 0.0722], [0.0193, 0.1192, 0.9505]]).T
    xyz /= np.array([0.95047, 1.0, 1.08883])
    f = np.where(xyz > 0.008856, np.cbrt(xyz), 7.787 * xyz + 16 / 116)
    return np.stack([116 * f[..., 1] - 16, 500 * (f[..., 0] - f[..., 1]), 200 * (f[..., 1] - f[..., 2])], -1)


placa = Image.open(AQUI / 'placas/gpt26-a.png').convert('RGBA')
capa = Image.open(sys.argv[1]).convert('RGBA').resize(placa.size)
a = np.asarray(Image.alpha_composite(placa, capa).convert('RGB')).astype(float)
x0, y0, x1, y1 = ZONA
z = a[y0:y1, x0:x1].reshape(-1, 3)
m = np.asarray(Image.open(RAW / '02-montaje/ref-acabado-madera.jpg').convert('RGB')).astype(float).reshape(-1, 3)
L1, L2 = lab(z).mean(0), lab(m).mean(0)
print('render', L1.round(1), 'muestra', L2.round(1), 'dE76', round(float(np.linalg.norm(L1 - L2)), 2))
