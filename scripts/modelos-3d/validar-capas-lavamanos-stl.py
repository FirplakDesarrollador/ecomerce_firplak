"""Valida las capas de lavamanos renderizadas desde STL contra el piloto aprobado.

python scripts/modelos-3d/validar-capas-lavamanos-stl.py <raiz-piloto> <carpeta-capas>

- IoU de calibracion-oslo-stl.png contra mascara-lavamanos-oslo.png (meta del flujo: >= 0,94).
- Cada capa: 1600x1600 RGBA, alfa real, sin píxeles en el borde del cuadro (sin recorte).
- Composición de revisión de los cruces nuevos sobre ambiente + mueble aprobados.
"""
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image

PILOTO = Path(sys.argv[1]) / 'assets-fuente/generativo-63x48/piloto-capas'
CAPAS = Path(sys.argv[2])
NUEVOS = ['bari', 'siena', 'trentino', 'quadratto']
CRUCES = [('vitelli', 'bari'), ('vitelli', 'siena'), ('vitelli', 'trentino'), ('tiziano', 'siena'), ('tiziano', 'trentino'),
          ('tiziano', 'quadratto')]  # Vitelli+Quadratto no se ofrece


def rgba(ruta):
    return np.asarray(Image.open(ruta).convert('RGBA'), dtype=np.float32) / 255


nuevo = rgba(CAPAS / 'calibracion-oslo-stl.png')[:, :, 3] > .5
aprobado = rgba(PILOTO / 'mascara-lavamanos-oslo.png')
aprobado = (aprobado[:, :, :3].mean(2) * aprobado[:, :, 3]) > .5
iou = float(np.logical_and(nuevo, aprobado).sum() / np.logical_or(nuevo, aprobado).sum())
informe = {'iou_oslo_stl_vs_aprobado': round(iou, 4), 'meta_iou': 0.94, 'capas': {}}

for lid in NUEVOS:
    im = Image.open(CAPAS / f'lavamanos-{lid}-negro.png')
    a = np.asarray(im.convert('RGBA'))[:, :, 3]
    borde = int(a[0].max()) + int(a[-1].max()) + int(a[:, 0].max()) + int(a[:, -1].max())
    informe['capas'][lid] = {'tamano': im.size, 'modo': im.mode, 'bounds': Image.fromarray(a).getbbox(),
                             'alfa_parcial': bool(((a > 0) & (a < 255)).any()), 'pixeles_en_borde': borde}
    assert im.size == (1600, 1600) and borde == 0, (lid, informe['capas'][lid])

ambiente = Image.open(PILOTO / 'ambiente-vacio.png').convert('RGBA')
mosaico = []
for mueble, lid in CRUCES:
    c = ambiente.copy()
    c.alpha_composite(Image.open(PILOTO / f'{mueble}-soder-cerrado.png').convert('RGBA'))
    c.alpha_composite(Image.open(CAPAS / f'lavamanos-{lid}-negro.png').convert('RGBA'))
    c.convert('RGB').save(CAPAS / f'revision-{mueble}-{lid}.png')
    mosaico.append(c.crop((150, 100, 1450, 1500)).resize((650, 700)).convert('RGB'))
hoja = Image.new('RGB', (650 * len(mosaico), 700))
for i, t in enumerate(mosaico):
    hoja.paste(t, (i * 650, 0))
hoja.save(CAPAS / 'revision-cruces-nuevos.png')
(CAPAS / 'validacion-capas-stl.json').write_text(json.dumps(informe, indent=2, ensure_ascii=False), encoding='utf-8')
print(json.dumps(informe, indent=2))
assert iou >= .94, f'IoU {iou:.4f} < 0,94'
