"""Parte 1: Vitelli 63 (Soder) + Parma 63x48 + griferia generica de base, montado en la placa gpt26-a.

blender -b --python escena-parte1.py -- [--prueba] [--hue=0.5] [--sat=1] [--val=1] [--f=1300] [--sal=nombre]

Camara resuelta desde la placa (1360x2048):
- Punto de fuga (714, 976) por lineas de juntas de la ducha; camara horizontal mirando +Y (profundidad del cuarto).
- Altura 1,10 m y pared izquierda a 0,82 m: pendientes piso-pared (1,34 izq / 1,385 der) + escala del sanitario
  (asiento 0,45 m, tanque 0,76 m). La anotacion "234cm" de la referencia no es coherente con la imagen y no se usa.
- Focal ~1300 px (espejo de la pared izquierda aproximadamente redondo; tapete coherente).
Montaje: mueble colgado en la pared izquierda (X=-0,82), frente hacia +X, centrado en profundidad bajo el espejo
(Y~2,13 m), cubierta del Parma a 0,86 m.
Salidas: <sal>.png (capa RGBA con shadow catcher en pared izquierda y piso) y <sal>.json.
"""
import json
import math
import sys
from pathlib import Path

import bpy
import numpy as np
from mathutils import Vector

AQUI = Path(__file__).resolve().parent
SES = AQUI.parent
BANOS = SES.parents[1]
RAW = BANOS / 'raw' / SES.name
args = dict(a[2:].split('=', 1) for a in sys.argv if a.startswith('--') and '=' in a)
prueba = '--prueba' in sys.argv

W, H = 1360, 2048
U0, V0 = 714.0, 976.0
F_PX = float(args.get('f', 1300))
CAM_H = 1.10
PARED_X = -0.82
Y_CENTRO = float(args.get('ycentro', 0.0)) or None   # profundidad del centro del mueble (m); por defecto bajo el espejo
CUBIERTA = 0.86
BASE = CUBIERTA - 0.500          # el Parma sobresale 500 mm sobre la base del Vitelli
HUECO_Y_LOCAL = -0.0371          # perforacion de griferia del Parma (coords locales del kit)
EXCLUIR = ('Lavamanos', 'Grifo', 'Bisagras', 'Sifon')


def pts(objs):
    bpy.context.view_layer.update()
    out = []
    for o in objs:
        m = np.array([list(r) for r in o.matrix_world])
        v = np.empty(len(o.data.vertices) * 3)
        o.data.vertices.foreach_get('co', v)
        out.append(v.reshape(-1, 3) @ m[:3, :3].T + m[:3, 3])
    return np.concatenate(out)


def mat(nombre, color, rough, coat=0.0, emision=None, metal=0.0):
    m = bpy.data.materials.new(nombre)
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*color, 1)
    b.inputs['Roughness'].default_value = rough
    b.inputs['Coat Weight'].default_value = coat
    b.inputs['Metallic'].default_value = metal
    if emision:
        b.inputs['Emission Color'].default_value = (*emision[0], 1)
        b.inputs['Emission Strength'].default_value = emision[1]
    return m


def soder():
    m = bpy.data.materials.new('Soder')
    nt = m.node_tree
    b = nt.nodes['Principled BSDF']
    tex = nt.nodes.new('ShaderNodeTexImage')
    tex.image = bpy.data.images.load(str(RAW / '02-montaje/ref-acabado-madera.jpg'))
    tex.projection = 'BOX'
    tex.projection_blend = 0.15
    geo = nt.nodes.new('ShaderNodeNewGeometry')
    mp = nt.nodes.new('ShaderNodeMapping')
    mp.inputs['Scale'].default_value = (1 / 0.60, 1 / 0.60, 1 / 0.80)  # muestra 1505x2000 px ~ 0,60 x 0,80 m
    nt.links.new(geo.outputs['Position'], mp.inputs['Vector'])
    nt.links.new(mp.outputs['Vector'], tex.inputs['Vector'])
    hs = nt.nodes.new('ShaderNodeHueSaturation')
    for k, d in (('Hue', 'hue'), ('Saturation', 'sat'), ('Value', 'val')):
        hs.inputs[k].default_value = float(args.get(d, {'hue': 0.5, 'sat': 1.0, 'val': 1.0}[d]))
    nt.links.new(tex.outputs['Color'], hs.inputs['Color'])
    nt.links.new(hs.outputs['Color'], b.inputs['Base Color'])
    b.inputs['Roughness'].default_value = 0.55
    b.inputs['Coat Weight'].default_value = 0.1
    return m


def cil(nombre, c, r, h, m, rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_cylinder_add(radius=r, depth=h, location=c, rotation=rot, vertices=48)
    o = bpy.context.object
    o.name = nombre
    o.data.materials.append(m)
    bpy.ops.object.shade_smooth()
    return o


def caja(nombre, c, dims, m):
    bpy.ops.mesh.primitive_cube_add(size=1, location=c)
    o = bpy.context.object
    o.name = nombre
    o.scale = dims
    o.data.materials.append(m)
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
s.cycles.samples = 48 if prueba else int(args.get('muestras', 384))
s.cycles.use_denoising = True
s.render.resolution_x, s.render.resolution_y = W, H
s.render.resolution_percentage = 50 if prueba else 100
s.view_settings.view_transform = 'AgX'
s.view_settings.exposure = -0.6

m_soder = soder()
m_negro = mat('NegroMate', (0.006, 0.006, 0.006), 0.6)
m_negro.node_tree.nodes['Principled BSDF'].inputs['Specular IOR Level'].default_value = 0.15
m_esmalte = mat('Esmalte', (0.92, 0.92, 0.91), 0.06, coat=1.0)
m_alu = mat('Aluminio', (0.7, 0.7, 0.7), 0.3, metal=1.0)

# ---------- kit en coordenadas locales (trasera y=0, frente -Y, Z arriba) ----------
bpy.ops.import_scene.gltf(filepath=str(BANOS / 'modelos-3d/kits/vitelli-63-oslo.glb'))
bpy.context.view_layer.update()


def raiz(o):
    while o.parent and o.parent.name not in ('Mueble', 'Vitelli63', 'Lavamanos'):
        o = o.parent
    return o


kit = []
for o in list(bpy.data.objects):
    if o.type != 'MESH':
        continue
    if raiz(o).name.startswith(EXCLUIR):
        bpy.data.objects.remove(o, do_unlink=True)
        continue
    mats = [m.name for m in o.data.materials]
    o.data.materials.clear()
    o.data.materials.append(m_alu if 'Cromo' in mats or 'Aluminio' in mats else m_soder)
    kit.append(o)
# soltar las mallas de sus grupos conservando la matriz mundial (si no, la puerta pierde su transformación)
bpy.context.view_layer.update()
for o in kit:
    mw = o.matrix_world.copy()
    o.parent = None
    o.matrix_world = mw
for o in list(bpy.data.objects):
    if o.type == 'EMPTY':
        bpy.data.objects.remove(o, do_unlink=True)
pm = pts(kit)
tapa = float(pm[:, 2].max())

antes = set(bpy.data.objects)
bpy.ops.wm.stl_import(filepath=str(BANOS / 'modelos-3d/lavamanos/parma-63x48.stl'), global_scale=0.001, up_axis='Y', forward_axis='NEGATIVE_Z')
parma = [o for o in bpy.data.objects if o not in antes]
p = pts(parma)
mn, mx = p.min(0), p.max(0)
cx = (mn[0] + mx[0]) / 2
lat = np.abs(p[:, 0] - cx) > (mx[0] - mn[0]) / 2 - 0.004
d = Vector((0 - cx, 0.0 - mx[1], tapa - p[lat, 2].min()))
for o in parma:
    o.location += d
    o.name = 'parma-63x48'
    o.data.materials.clear()
    o.data.materials.append(m_esmalte)
    bpy.context.view_layer.objects.active = o
    o.select_set(True)
    bpy.ops.object.shade_auto_smooth(angle=0.5236)
cub = float(pts(parma)[:, 2].max())
hy = HUECO_Y_LOCAL
g = [cil('grifo-base', (0, hy, cub + 0.004), 0.026, 0.008, m_negro),
     cil('grifo-cuerpo', (0, hy, cub + 0.008 + 0.085), 0.022, 0.17, m_negro)]
alto = cub + 0.008 + 0.17
g.append(cil('grifo-cano', (0, hy - 0.06, alto - 0.018), 0.014, 0.13, m_negro, rot=(math.radians(90), 0, 0)))
g.append(cil('grifo-boquilla', (0, hy - 0.12, alto - 0.035), 0.012, 0.03, m_negro))
g.append(caja('grifo-palanca', (0, hy + 0.035, alto + 0.01), (0.012, 0.07, 0.008), m_negro))
producto = kit + parma + g

# ---------- colocar el kit: pared izquierda, frente hacia +X ----------
y_espejo = None
bpy.ops.object.empty_add(location=(0, 0, 0))
pivote = bpy.context.object
for o in producto:
    o.parent = pivote
    o.matrix_parent_inverse = pivote.matrix_world.inverted()

# profundidad del centro del espejo: bordes del espejo en la placa (u=91 y u=296) sobre la pared X=PARED_X
z1, z2 = F_PX * -PARED_X / (U0 - 91), F_PX * -PARED_X / (U0 - 296)
y_espejo = (z1 + z2) / 2
yc = Y_CENTRO or y_espejo
pivote.rotation_euler = (0, 0, math.radians(90))      # frente (-Y local) -> +X mundo
pivote.location = (PARED_X, yc, BASE)
bpy.context.view_layer.update()
# hornear la transformacion en las mallas: coordenadas de objeto = mundo (la proyeccion BOX usa normales de objeto)
for o in producto:
    mw = o.matrix_world.copy()
    o.parent = None
    o.data.transform(mw)
    o.matrix_world.identity()
bpy.context.view_layer.update()

# ---------- greybox del bano (sombra y rebote) ----------
m_salvia = mat('ParedSalvia', (0.50, 0.58, 0.48), 0.6)
m_piso = mat('PisoTerrazo', (0.76, 0.72, 0.66), 0.5)
m_blanco = mat('ParedBlanca', (0.85, 0.85, 0.83), 0.5)
amb = []
ANCHO_DER = 0.79
PROF = 4.6
amb.append(caja('pared-izq', (PARED_X - 0.05, 1.45, 1.25), (0.1, 3.0, 2.5), m_salvia))  # hasta y=2,95 (antes de la ducha)
amb.append(caja('piso', (0, PROF / 2, -0.05), (3, PROF + 1, 0.1), m_piso))
amb.append(caja('pared-der', (ANCHO_DER + 0.05, PROF / 2, 1.25), (0.1, PROF + 1, 2.5), m_blanco))
amb.append(caja('pared-fondo', (0, PROF + 0.05, 1.25), (3, 0.1, 2.5), m_salvia))
amb.append(caja('techo', (0, PROF / 2, 2.55), (3, PROF + 1, 0.1), m_blanco))
amb.append(caja('pared-camara', (0, -0.6, 1.25), (3, 0.1, 2.5), m_blanco))
# halo LED del espejo (redondo, ~0,8 m) en la pared izquierda
bpy.ops.mesh.primitive_cylinder_add(radius=0.42, depth=0.01, location=(PARED_X + 0.012, y_espejo, 1.52), rotation=(0, math.radians(90), 0))
led = bpy.context.object
led.name = 'led-espejo'
led.data.materials.append(mat('LED', (1, 1, 1), 0.5, emision=((1.0, 0.75, 0.45), 6)))
amb.append(led)
# luz suave como la placa: plafones de area grandes (sombras difusas)
for (x, y) in [(0.0, 1.4), (0.0, 3.2)]:
    bpy.ops.object.light_add(type='AREA', location=(x, y, 2.48))
    l = bpy.context.object
    l.data.energy, l.data.size = 160, 0.9
    l.data.color = (1.0, 0.82, 0.62)
w = bpy.data.worlds.new('W')
s.world = w
w.node_tree.nodes['Background'].inputs['Strength'].default_value = 0.08

# ---------- camara ----------
bpy.ops.object.camera_add(location=(0, 0, CAM_H), rotation=(math.radians(90), 0, 0))
cam = bpy.context.object
s.camera = cam
cam.data.sensor_fit = 'VERTICAL'
cam.data.sensor_height = 36
cam.data.lens = F_PX * 36 / H
cam.data.shift_x = (U0 - W / 2) / max(W, H)
cam.data.shift_y = (H / 2 - V0) / max(W, H)
cam.data.clip_start = 0.05
for o in amb:
    if o.name == 'pared-camara':
        o.visible_camera = False

# ---------- capa del producto con sombra ----------
for o in amb:
    o.is_shadow_catcher = o.name in ('pared-izq', 'piso')
    o.visible_camera = o.name in ('pared-izq', 'piso')
    if not o.is_shadow_catcher:
        o.visible_shadow = False   # el greybox no debe sombrear la placa: solo el producto proyecta sombra
s.render.film_transparent = True
nombre = args.get('sal', 'prueba' if prueba else 'producto')
s.render.filepath = str(AQUI / f'{nombre}.png')
bpy.ops.render.render(write_still=True)
info = {'f_px': F_PX, 'lente_mm': round(cam.data.lens, 2), 'vp': [U0, V0], 'cam_h_m': CAM_H, 'pared_izq_x_m': PARED_X,
        'y_espejo_m': round(y_espejo, 3), 'y_centro_kit_m': round(yc, 3), 'base_mueble_m': BASE, 'cubierta_m': round(cub - tapa + 0.48 + BASE, 3),
        'calibracion': {k: float(args.get(k, d)) for k, d in (('hue', 0.5), ('sat', 1.0), ('val', 1.0))}}
(AQUI / f'{nombre}.json').write_text(json.dumps(info, indent=2), encoding='utf-8')
print('INFO', json.dumps(info))
