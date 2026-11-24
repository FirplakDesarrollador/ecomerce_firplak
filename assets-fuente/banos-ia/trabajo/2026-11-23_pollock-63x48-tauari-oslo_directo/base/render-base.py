"""Render base neutro del kit Pollock 63x48 + Oslo 63x48 (sesión banos-ia).

blender -b --python render-base.py -- [--prueba]

- Mueble: STL por pieza exportados de Fusion (mm, Z arriba) + traslaciones de ensamble.json.
- Oslo: STL de Fusion (mm, Y arriba), anclado con la regla del piloto Mix & Match:
  centro X, borde trasero, borde inferior del faldón lateral sobre la tapa (z = 480 mm).
- Control del anclaje: la misma regla aplicada al Trentino debe reproducir su posición en el
  documento de Fusion (z mínima 391 mm según el bbox del ensamble).
- Material neutro (sin Tauari todavía): el acabado se define en la Parte 1 (montaje).
"""
import json
import math
import sys
from pathlib import Path

import bpy
import numpy as np
from mathutils import Vector

AQUI = Path(__file__).resolve().parent
BANOS = AQUI.parents[2]
MUEBLE = BANOS / 'modelos-3d/muebles/pollock-63x48'
LAV = BANOS / 'modelos-3d/lavamanos'
prueba = '--prueba' in sys.argv
BORDE = 0.004

ens = json.loads((MUEBLE / 'ensamble.json').read_text(encoding='utf-8'))


def importar(path, up, fwd):
    antes = set(bpy.data.objects)
    bpy.ops.wm.stl_import(filepath=str(path), global_scale=0.001, up_axis=up, forward_axis=fwd)
    return [o for o in bpy.data.objects if o not in antes and o.type == 'MESH']


def pts(objs):
    bpy.context.view_layer.update()
    out = []
    for o in objs:
        m = np.array([list(r) for r in o.matrix_world])
        v = np.empty(len(o.data.vertices) * 3)
        o.data.vertices.foreach_get('co', v)
        out.append(v.reshape(-1, 3) @ m[:3, :3].T + m[:3, 3])
    return np.concatenate(out)


def anclas(p):
    mn, mx = p.min(0), p.max(0)
    cx = (mn[0] + mx[0]) / 2
    lateral = np.abs(p[:, 0] - cx) > (mx[0] - mn[0]) / 2 - BORDE
    return {'cx': float(cx), 'atras': float(mx[1]), 'apoyo': float(p[lateral, 2].min()),
            'zmin': float(mn[2]), 'cubierta': float(mx[2]), 'dims_mm': [round(float(d) * 1000, 1) for d in mx - mn]}


def colocar(objs, a_obj):
    a = anclas(pts(objs))
    d = Vector((a_obj['cx_mm'] / 1000 - a['cx'], a_obj['atras_mm'] / 1000 - a['atras'], a_obj['apoyo_mm'] / 1000 - a['apoyo']))
    for o in objs:
        o.location += d
    return anclas(pts(objs))


def material(nombre, color, rough, coat=0.0):
    m = bpy.data.materials.new(nombre)
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*color, 1)
    b.inputs['Roughness'].default_value = rough
    b.inputs['Coat Weight'].default_value = coat
    return m


bpy.ops.wm.read_factory_settings(use_empty=True)
s = bpy.context.scene
s.render.engine = 'CYCLES'
try:
    pref = bpy.context.preferences.addons['cycles'].preferences
    pref.compute_device_type = 'HIP'
    pref.refresh_devices()
    for dv in pref.devices:
        dv.use = dv.type != 'CPU'
    s.cycles.device = 'GPU'
except Exception as e:  # sin GPU: CPU
    print('GPU no disponible', e)
s.cycles.samples = 24 if prueba else 128
s.cycles.use_denoising = True
s.render.resolution_x = s.render.resolution_y = 1600
s.render.resolution_percentage = 50 if prueba else 100
s.view_settings.view_transform = 'AgX'

neutro = material('MuebleNeutro', (0.62, 0.60, 0.57), 0.55)
negro = material('ManijaNegra', (0.02, 0.02, 0.02), 0.35)
esmalte = material('LavamanosEsmalte', (0.92, 0.92, 0.91), 0.06, coat=1.0)

mueble = []
for nombre, t in ens['traslacion_mm'].items():
    objs = importar(MUEBLE / nombre, 'Z', 'Y')
    for o in objs:
        o.location = Vector(t) / 1000
        o.name = nombre.replace('.stl', '')
        o.data.materials.clear()
        o.data.materials.append(negro if nombre.startswith('manija') else neutro)
    mueble += objs
pm = pts(mueble)
info = {'mueble_bbox_mm': [[round(float(v) * 1000, 1) for v in pm.min(0)], [round(float(v) * 1000, 1) for v in pm.max(0)]]}

# Control de la regla de anclaje con el Trentino del documento de Fusion
tren = importar(LAV / 'trentino-63x48.stl', 'Y', 'NEGATIVE_Z')
info['control_trentino'] = colocar(tren, ens['anclaje_lavamanos'])
info['control_trentino']['zmin_fusion_mm'] = 391
for o in tren:
    bpy.data.objects.remove(o, do_unlink=True)

oslo = importar(LAV / 'oslo-63x48.stl', 'Y', 'NEGATIVE_Z')
for o in oslo:
    o.name = 'oslo-63x48'
    o.data.materials.clear()
    o.data.materials.append(esmalte)
    bpy.context.view_layer.objects.active = o
    o.select_set(True)
    bpy.ops.object.shade_auto_smooth(angle=0.5236)
info['oslo'] = colocar(oslo, ens['anclaje_lavamanos'])

# Estudio: piso + fondo curvo neutro, luz de área + sol suave
bpy.ops.mesh.primitive_plane_add(size=8, location=(0, 0, 0))
piso = bpy.context.object
piso.data.materials.append(material('Piso', (0.85, 0.85, 0.84), 0.8))
w = bpy.data.worlds.new('W')
s.world = w
w.node_tree.nodes['Background'].inputs['Color'].default_value = (0.9, 0.9, 0.9, 1)
w.node_tree.nodes['Background'].inputs['Strength'].default_value = 0.35
bpy.ops.object.light_add(type='AREA', location=(-1.2, -1.6, 2.0))
L = bpy.context.object
L.data.energy, L.data.size = 220, 1.5
L.rotation_euler = (math.radians(50), 0, math.radians(-35))
bpy.ops.object.light_add(type='SUN', location=(1, -1, 3))
bpy.context.object.data.energy = 0.8
bpy.context.object.rotation_euler = (math.radians(40), 0, math.radians(30))

centro = Vector((0, 0, 0.30))
bpy.ops.object.camera_add()
cam = bpy.context.object
s.camera = cam
cam.data.lens = 85
for vista, az, el in [('34', -29, 22), ('frente', 0, 10)]:
    r = 3.2
    a, e = math.radians(az), math.radians(el)
    cam.location = centro + Vector((r * math.sin(a) * math.cos(e), -r * math.cos(a) * math.cos(e), r * math.sin(e)))
    cam.rotation_euler = (centro - cam.location).to_track_quat('-Z', 'Y').to_euler()
    s.render.filepath = str(AQUI / f"{'prueba-' if prueba else ''}pollock-oslo-base_{vista}.png")
    bpy.ops.render.render(write_still=True)

bpy.ops.wm.save_as_mainfile(filepath=str(AQUI / 'pollock-oslo-base.blend'))
(AQUI / 'render-base.json').write_text(json.dumps(info, indent=2), encoding='utf-8')
print('INFO', json.dumps(info))
