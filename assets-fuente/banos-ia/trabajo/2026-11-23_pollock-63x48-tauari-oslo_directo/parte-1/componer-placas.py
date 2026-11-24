"""Parte 1: render real del producto con la cámara de cada placa generada + composición.

blender -b --python componer-placas.py -- [--prueba]

Reutiliza la escena de escena-parte1.py (producto, luces, greybox) y, por placa:
- calcula la cámara desde medidas de la placa: escala en la pared (ancho del espejo = 0,50 m),
  centro del espejo (el producto va centrado bajo el espejo) y línea piso-pared;
- cámara horizontal a 1,30 m, lente 35 mm (sensor vertical 36 mm), desplazamiento vertical para el horizonte;
- renderiza el producto RGBA con sombras sobre pared/piso (shadow catcher) a la resolución de la placa;
- compone sobre la placa sin modificarla fuera del producto y su sombra.
"""
import json
import sys
from pathlib import Path

import bpy
from mathutils import Vector

AQUI = Path(__file__).resolve().parent
codigo = (AQUI / 'escena-parte1.py').read_text(encoding='utf-8')
sys.argv = [a for a in sys.argv if a != '--prueba'] + (['--prueba'] if '--prueba' in sys.argv else [])
g = {'__file__': str(AQUI / 'escena-parte1.py'), '__name__': 'escena'}
exec(compile(codigo.split('# 1) greybox sin producto')[0], 'escena-parte1.py', 'exec'), g)
s, cam, amb, producto, PARED_Y = g['s'], g['cam'], g['amb'], g['producto'], g['PARED_Y']

# medidas tomadas de cada placa (px): espejo x0,x1 / y0,y1 y fila de la unión piso-pared
PLACAS = {
    'gpt26-a': {'W': 688, 'H': 1024, 'esp_x': (260, 391), 'esp_y': (262, 470), 'piso': 776},
    'gpt26-b': {'W': 688, 'H': 1024, 'esp_x': (259, 387), 'esp_y': (263, 467), 'piso': 764},
    'flux3-a': {'W': 832, 'H': 1248, 'esp_x': (314, 515), 'esp_y': (236, 564), 'piso': 981},
    # ronda 1: edición fiel de la referencia; horizonte medido por fuga de piso/paredes (cámara ~1,0 m)
    'r1-gpt26-a': {'W': 1360, 'H': 2048, 'esp_x': (514, 763), 'esp_y': (527, 933), 'piso': 1520, 'cam_h': 1.0, 'dir': 'ronda-1'},
}
solo = [a.split('=', 1)[1] for a in sys.argv if a.startswith('--solo=')]
if solo:
    PLACAS = {k: v for k, v in PLACAS.items() if k in solo}
CAM_H = 1.30
LENTE = 35.0

for o in amb:
    o.is_shadow_catcher = o.name in ('pared-fondo', 'piso')
    o.visible_camera = o.name in ('pared-fondo', 'piso')
s.render.film_transparent = True
s.render.resolution_percentage = 100
informe = {}
for nombre, p in PLACAS.items():
    W, H = p['W'], p['H']
    escala = (p['esp_x'][1] - p['esp_x'][0]) / 0.50          # px por metro en el plano de la pared
    cx = sum(p['esp_x']) / 2
    f_px = LENTE / 36.0 * H
    d = f_px / escala                                         # distancia cámara-pared
    cam_h = p.get('cam_h', CAM_H)
    fila_horizonte = p['piso'] - cam_h * escala
    s.render.resolution_x, s.render.resolution_y = W, H
    cam.data.lens = LENTE
    cam.data.sensor_fit = 'VERTICAL'
    cam.data.sensor_height = 36
    cam.location = Vector(((W / 2 - cx) / escala, PARED_Y - d, cam_h))
    cam.rotation_euler = (1.5707963, 0, 0)
    cam.data.shift_x = 0
    cam.data.shift_y = -(H / 2 - fila_horizonte) / max(W, H)
    # la luz LED del espejo a la altura del espejo de la placa
    z_espejo = (p['piso'] - sum(p['esp_y']) / 2) / escala
    for o in amb:
        if o.name in ('led-espejo', 'marco-espejo', 'espejo'):
            o.location.z = z_espejo
    s.render.filepath = str(AQUI / p.get('dir', 'composiciones') / f'producto-{nombre}.png')
    bpy.ops.render.render(write_still=True)
    informe[nombre] = {'px_por_m': round(escala, 1), 'dist_camara_m': round(d, 3), 'cam_x_m': round(cam.location.x, 4),
                       'shift_y': round(cam.data.shift_y, 4), 'altura_espejo_centro_m': round(z_espejo, 3)}
(AQUI / 'composiciones' / f"camaras{'-' + '-'.join(solo) if solo else ''}.json").write_text(json.dumps(informe, indent=2), encoding='utf-8')
print('INFO', json.dumps(informe))
