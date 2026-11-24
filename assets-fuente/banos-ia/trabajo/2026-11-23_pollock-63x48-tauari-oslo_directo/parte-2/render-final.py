"""Parte 2: render final del producto (capa RGBA + sombras) con la cámara de la placa aprobada r1-gpt26-a.

blender -b --python render-final.py -- [--prueba] [--hue=0.5] [--sat=1] [--val=1] [--sal=nombre]

- Reutiliza la escena de parte-1/escena-parte1.py (producto, greybox, luces).
- Calibra el Tauari con un nodo Hue/Saturation/Value entre la textura y el BSDF (objetivo ΔE76 ≤ 2 vs muestra).
- Cámara calculada igual que parte-1/componer-placas.py para la placa aprobada.
"""
import json
import sys
from pathlib import Path

import bpy
from mathutils import Vector

AQUI = Path(__file__).resolve().parent
P1 = AQUI.parent / 'parte-1'
args = dict(a[2:].split('=', 1) for a in sys.argv if a.startswith('--') and '=' in a)
prueba = '--prueba' in sys.argv
codigo = (P1 / 'escena-parte1.py').read_text(encoding='utf-8')
g = {'__file__': str(P1 / 'escena-parte1.py'), '__name__': 'escena'}
exec(compile(codigo.split('# 1) greybox sin producto')[0], 'escena-parte1.py', 'exec'), g)
s, cam, amb, PARED_Y = g['s'], g['cam'], g['amb'], g['PARED_Y']

# calibración del Tauari
nt = bpy.data.materials['Tauari'].node_tree
tex = next(n for n in nt.nodes if n.type == 'TEX_IMAGE')
hs = nt.nodes.new('ShaderNodeHueSaturation')
cal = {k: float(args.get(k, d)) for k, d in (('hue', 0.5), ('sat', 1.0), ('val', 1.0))}
hs.inputs['Hue'].default_value = cal['hue']
hs.inputs['Saturation'].default_value = cal['sat']
hs.inputs['Value'].default_value = cal['val']
nt.links.new(tex.outputs['Color'], hs.inputs['Color'])
nt.links.new(hs.outputs['Color'], nt.nodes['Principled BSDF'].inputs['Base Color'])

# cámara de la placa aprobada (misma fórmula que componer-placas.py)
p = {'W': 1360, 'H': 2048, 'esp_x': (514, 763), 'esp_y': (527, 933), 'piso': 1520, 'cam_h': 1.0}
W, H = p['W'], p['H']
escala = (p['esp_x'][1] - p['esp_x'][0]) / 0.50
cx = sum(p['esp_x']) / 2
f_px = 35.0 / 36.0 * H
d = f_px / escala
fila_horizonte = p['piso'] - p['cam_h'] * escala
cam.data.lens, cam.data.sensor_fit, cam.data.sensor_height = 35.0, 'VERTICAL', 36
cam.location = Vector(((W / 2 - cx) / escala, PARED_Y - d, p['cam_h']))
cam.rotation_euler = (1.5707963, 0, 0)
cam.data.shift_x, cam.data.shift_y = 0, -(H / 2 - fila_horizonte) / max(W, H)
z_espejo = (p['piso'] - sum(p['esp_y']) / 2) / escala
for o in amb:
    if o.name in ('led-espejo', 'marco-espejo', 'espejo'):
        o.location.z = z_espejo
    o.is_shadow_catcher = o.name in ('pared-fondo', 'piso')
    o.visible_camera = o.name in ('pared-fondo', 'piso')
s.render.film_transparent = True
s.render.resolution_x, s.render.resolution_y = W, H
s.render.resolution_percentage = 50 if prueba else 100
s.cycles.samples = 48 if prueba else 512
nombre = args.get('sal', 'prueba' if prueba else 'producto-final')
s.render.filepath = str(AQUI / f'{nombre}.png')
bpy.ops.render.render(write_still=True)
(AQUI / f'{nombre}.json').write_text(json.dumps({'calibracion_tauari': cal, 'px_por_m': escala, 'muestras': s.cycles.samples}, indent=2), encoding='utf-8')
print('INFO', json.dumps(cal))
