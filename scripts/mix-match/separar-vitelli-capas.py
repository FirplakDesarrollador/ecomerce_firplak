"""Reutiliza el pulido aprobado, segmentado con máscaras de la geometría real.

Previo: blender -b --python scripts/modelos-3d/render-vitelli-capas.py
No usa cortes horizontales, elimina el grifo de la capa de mueble y conserva
superficies ocultas de su render CAD para que el mueble pueda reutilizarse.
"""
from pathlib import Path
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'assets-fuente/generativo-63x48/piloto-capas'
PILOT = OUT.parent / 'piloto-ventana-calida-34'


def mask(name):
    rgba = np.asarray(Image.open(OUT / name).convert('RGBA'), dtype=np.float32) / 255
    return np.clip(rgba[:, :, :3].mean(2) * rgba[:, :, 3], 0, 1)


cabinet = np.array(Image.open(OUT / 'mueble-completo-render.png').convert('RGBA'))
approved = np.asarray(Image.open(PILOT / 'entrega/conjunto-oslo.png').convert('RGBA'))
visible = mask('mascara-mueble-visible.png') > .995
cabinet[:, :, :3][visible] = approved[:, :, :3][visible]
assert not cabinet[:300, :, 3].any(), 'Grifería mezclada con el mueble'
Image.fromarray(cabinet).save(OUT / 'vitelli-soder-cerrado.png')
for basin in ['oslo', 'genova']:
    rgba = np.array(Image.open(PILOT / f'entrega/conjunto-{basin}.png').convert('RGBA'))
    rgba[:, :, 3] = np.uint8(mask(f'mascara-lavamanos-{basin}.png') * 255 + .5)
    Image.fromarray(rgba).save(OUT / f'lavamanos-{basin}-negro.png')
Image.open(PILOT / 'fondo-cuadro-producto.png').save(OUT / 'ambiente-vacio.png')
