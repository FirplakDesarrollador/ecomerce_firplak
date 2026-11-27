"""Render base neutro del kit Vitelli 63 + Parma 63x48 (sesion banos-ia 2026-11-27).

blender -b --python render-base.py -- [--prueba]

- Mueble: piezas del GLB del configurador Mix & Match (modelos-3d/kits/vitelli-63-oslo.glb), Z arriba, m, frente -Y,
  trasera en y=0. Se EXCLUYEN los lavamanos alternativos (Genova, Oslo, Parma, Siena) y la griferia del GLB.
  (Fusion no respondio el 2026-11-27; reexportar desde Fusion cuando este disponible si se requiere.)
- Lavamanos: parma-63x48.stl exportado de Fusion (mm, Y arriba), anclado con la regla del piloto:
  centro X, borde trasero contra la pared, borde inferior del faldon lateral sobre la tapa del mueble.
- Control: la regla debe reproducir la posicion del Parma que trae el GLB.
- Griferia generica de base, negra, en la perforacion detectada del Parma.
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
prueba = '--prueba' in sys.argv
BORDE = 0.004
EXCLUIR = ('Lavamanos', 'Grifo', 'Bisagras', 'Sifon')  # bisagras atraviesan la puerta en el GLB; sifón oculto


def pts(objs):
    bpy.context.view_layer.update()
    out = []
    for o in objs:
        m = np.array([list(r) for r in o.matrix_world])
        v = np.empty(len(o.data.vertices) * 3)
        o.data.vertices.foreach_get('co', v)
        out.append(v.reshape(-1, 3) @ m[:3, :3].T + m[:3, 3])
    return np.concatenate(out)


def bbox(p):
    return [[round(float(x) * 1000, 1) for x in p.min(0)], [round(float(x) * 1000, 1) for x in p.max(0)]]


def anclas(p):
    mn, mx = p.min(0), p.max(0)
    cx = (mn[0] + mx[0]) / 2
    lateral = np.abs(p[:, 0] - cx) > (mx[0] - mn[0]) / 2 - BORDE
    return float(cx), float(mx[1]), float(p[lateral, 2].min())


def material(nombre, color, rough, coat=0.0, metal=0.0):
    m = bpy.data.materials.new(nombre)
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*color, 1)
    b.inputs['Roughness'].default_value = rough
    b.inputs['Coat Weight'].default_value = coat
    b.inputs['Metallic'].default_value = metal
    return m


def cil(nombre, c, r, h, mat, rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_cylinder_add(radius=r, depth=h, location=c, rotation=rot, vertices=48)
    o = bpy.context.object
    o.name = nombre
    o.data.materials.append(mat)
    bpy.ops.object.shade_smooth()
    return o


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
except Exception as e:
    print('GPU no disponible', e)
s.cycles.samples = 24 if prueba else 128
s.cycles.use_denoising = True
s.render.resolution_x = s.render.resolution_y = 1600
s.render.resolution_percentage = 50 if prueba else 100
s.view_settings.view_transform = 'AgX'

neutro = material('MuebleNeutro', (0.62, 0.60, 0.57), 0.55)
alu = material('Aluminio', (0.7, 0.7, 0.7), 0.3, metal=1.0)
negro = material('NegroMate', (0.01, 0.01, 0.01), 0.5)
esmalte = material('LavamanosEsmalte', (0.92, 0.92, 0.91), 0.06, coat=1.0)

bpy.ops.import_scene.gltf(filepath=str(BANOS / 'modelos-3d/kits/vitelli-63-oslo.glb'))
bpy.context.view_layer.update()


def raiz(o):
    while o.parent and o.parent.name not in ('Mueble', 'Vitelli63', 'Lavamanos'):
        o = o.parent
    return o


glb_parma = [o for o in bpy.data.objects if o.type == 'MESH' and o.name.startswith('Lavamanos_parma')]
control_glb = bbox(pts(glb_parma))
excluidos, mueble = set(), []
for o in list(bpy.data.objects):
    if o.type != 'MESH':
        continue
    grupo = raiz(o).name
    if grupo.startswith(EXCLUIR):
        excluidos.add(grupo)
        bpy.data.objects.remove(o, do_unlink=True)
        continue
    mats = [m.name for m in o.data.materials]
    o.data.materials.clear()
    o.data.materials.append(alu if 'Aluminio' in mats or 'Cromo' in mats else negro if 'SifonNegro' in mats else neutro)
    mueble.append(o)
pm = pts(mueble)
info = {'mueble_glb_bbox_mm': bbox(pm), 'excluidos_del_glb': sorted(excluidos),
        'piezas_mueble': sorted({raiz(o).name for o in mueble})}
tapa = float(pm[:, 2].max())
# trasera = cara trasera de la carcasa (los rieles de cajón sobresalen hacia atrás en el GLB)
atras = float(pts([o for o in mueble if raiz(o).name == 'Carcasa'])[:, 1].max())
info['tapa_mm'], info['trasera_carcasa_mm'] = round(tapa * 1000, 1), round(atras * 1000, 1)

antes = set(bpy.data.objects)
bpy.ops.wm.stl_import(filepath=str(BANOS / 'modelos-3d/lavamanos/parma-63x48.stl'), global_scale=0.001, up_axis='Y', forward_axis='NEGATIVE_Z')
parma = [o for o in bpy.data.objects if o not in antes]
cx, at, ap = anclas(pts(parma))
d = Vector((0 - cx, atras - at, tapa - ap))
for o in parma:
    o.location += d
    o.name = 'parma-63x48'
    o.data.materials.clear()
    o.data.materials.append(esmalte)
    bpy.context.view_layer.objects.active = o
    o.select_set(True)
    bpy.ops.object.shade_auto_smooth(angle=0.5236)
pp = pts(parma)
info['parma_stl_anclado_bbox_mm'] = bbox(pp)
info['control_parma_glb_bbox_mm'] = control_glb
info['control_dif_max_mm'] = round(float(np.abs(np.array(bbox(pp)) - np.array(control_glb)).max()), 1)

# perforacion de griferia: hueco en la cubierta cerca de x=0
cub = float(pp[:, 2].max())
sup = pp[(pp[:, 2] > cub - 0.004) & (np.abs(pp[:, 0]) < 0.03)]
ys = np.sort(np.unique(np.round(sup[:, 1], 4)))
huecos = np.diff(ys)
cand = [(float(ys[k]), float(ys[k + 1])) for k in np.nonzero((huecos > 0.02) & (huecos < 0.08) & (ys[:-1] > -0.12))[0]]
info['huecos_cubierta_y_m'] = [[round(a, 4), round(b, 4)] for a, b in [(float(ys[k]), float(ys[k + 1])) for k in np.nonzero(huecos > 0.005)[0]]]
hy = (cand[-1][0] + cand[-1][1]) / 2 if cand else atras - 0.06
info['perforacion_griferia_m'] = {'x': 0.0, 'y': round(hy, 4), 'detectada': bool(cand), 'cubierta_z_m': round(cub, 4)}
g = [cil('grifo-base', (0, hy, cub + 0.004), 0.026, 0.008, negro),
     cil('grifo-cuerpo', (0, hy, cub + 0.008 + 0.085), 0.022, 0.17, negro)]
alto = cub + 0.008 + 0.17
g.append(cil('grifo-cano', (0, hy - 0.06, alto - 0.018), 0.014, 0.13, negro, rot=(math.radians(90), 0, 0)))
g.append(cil('grifo-boquilla', (0, hy - 0.12, alto - 0.035), 0.012, 0.03, negro))

bpy.ops.mesh.primitive_plane_add(size=8, location=(0, 0, 0))
bpy.context.object.data.materials.append(material('Piso', (0.85, 0.85, 0.84), 0.8))
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

centro = Vector((0, -0.24, 0.32))
bpy.ops.object.camera_add()
cam = bpy.context.object
s.camera = cam
cam.data.lens = 85
for vista, az, el in [('34', -29, 22), ('frente', 0, 10)]:
    r = 3.2
    a, e = math.radians(az), math.radians(el)
    cam.location = centro + Vector((r * math.sin(a) * math.cos(e), -r * math.cos(a) * math.cos(e), r * math.sin(e)))
    cam.rotation_euler = (centro - cam.location).to_track_quat('-Z', 'Y').to_euler()
    s.render.filepath = str(AQUI / f"{'prueba-' if prueba else ''}vitelli-parma-base_{vista}.png")
    bpy.ops.render.render(write_still=True)

bpy.ops.wm.save_as_mainfile(filepath=str(AQUI / 'vitelli-parma-base.blend'))
(AQUI / 'render-base.json').write_text(json.dumps(info, indent=2, ensure_ascii=False), encoding='utf-8')
print('INFO', json.dumps(info, ensure_ascii=False))
