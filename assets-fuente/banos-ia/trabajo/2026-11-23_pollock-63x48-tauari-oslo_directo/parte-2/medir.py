"""Compone la capa del producto sobre la placa aprobada y mide ΔE76 del Tauari (puertas) vs la muestra.
python medir.py <producto.png> [salida.jpg] [--sombra=1.0]"""
import sys
from pathlib import Path
import numpy as np
from PIL import Image

AQUI = Path(__file__).resolve().parent
RAW = AQUI.parents[2] / 'raw/2026-11-23_pollock-63x48-tauari-oslo_directo'


def lab(rgb):
    c = rgb / 255.0
    c = np.where(c > 0.04045, ((c + 0.055) / 1.055) ** 2.4, c / 12.92)
    xyz = c @ np.array([[0.4124, 0.3576, 0.1805], [0.2126, 0.7152, 0.0722], [0.0193, 0.1192, 0.9505]]).T
    xyz /= np.array([0.95047, 1.0, 1.08883])
    f = np.where(xyz > 0.008856, np.cbrt(xyz), 7.787 * xyz + 16 / 116)
    return np.stack([116 * f[..., 1] - 16, 500 * (f[..., 0] - f[..., 1]), 200 * (f[..., 1] - f[..., 2])], -1)


placa = Image.open(AQUI.parent / 'parte-1/ronda-1/gpt26-a.png').convert('RGBA')
prod = Image.open(sys.argv[1]).convert('RGBA')
if prod.size != placa.size:
    prod = prod.resize(placa.size, Image.LANCZOS)
out = Image.alpha_composite(placa, prod).convert('RGB')
a = np.asarray(out).astype(float)
# puertas: filas 1195-1295, columnas 475-620 y 645-790 (sin manijas ni junta central)
zona = np.concatenate([a[1195:1295, 475:620].reshape(-1, 3), a[1195:1295, 645:790].reshape(-1, 3)])
m = np.asarray(Image.open(RAW / '02-montaje/ref-acabado-tauari.jpg').convert('RGB')).astype(float).reshape(-1, 3)
L1, L2 = lab(zona).mean(0), lab(m).mean(0)
print('render Lab', L1.round(1), 'muestra Lab', L2.round(1), 'dE76', round(float(np.linalg.norm(L1 - L2)), 2))
if len(sys.argv) > 2 and not sys.argv[2].startswith('--'):
    out.save(sys.argv[2], quality=92)
