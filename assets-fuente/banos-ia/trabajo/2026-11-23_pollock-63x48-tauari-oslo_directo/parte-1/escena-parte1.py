"""Parte 1: escena frontal tipo referencia con Pollock Tauari + Oslo + grifería de base.

blender -b --python escena-parte1.py -- [--prueba]

Salidas (en esta carpeta):
- greybox-ambiente.png      estructura del baño SIN producto (referencia de cámara para Higgsfield)
- greybox-con-producto.png  vista previa local (greybox + producto), sin IA
- producto-rgba.png         capa del producto real con sombra de contacto (shadow catcher), fondo transparente
- mascara-producto.png      máscara del producto (mueble + lavamanos + grifería)
- camara.json               cámara, encuadre y posición del producto

Medidas: mueble colgado; tapa del Oslo a 0,86 m del piso. Cámara frontal a 1,30 m, 35 mm, vertical 2:3.
La grifería es un monocomando genérico procedural (no es un producto Firplak) en la perforación del Oslo.
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
MUEBLE = BANOS / 'modelos-3d/muebles/pollock-63x48'
LAV = BANOS / 'modelos-3d/lavamanos'
RAW = BANOS / 'raw' / SES.name
prueba = '--prueba' in sys.argv
ens = json.loads((MUEBLE / 'ensamble.json').read_text(encoding='utf-8'))

ALTURA_CUBIERTA = 0.86          # tapa del lavamanos sobre el piso
BASE = ALTURA_CUBIERTA - 0.540  # el Oslo sobresale 540 mm sobre la base del mueble
PARED_Y = 0.231                 # cara trasera del mueble = pared
HUECO = (0.0, 0.1954)           # perforación de grifería del Oslo (x, y) en coords del mueble, m


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


def mat(nombre, color, rough, coat=0.0, emision=None, alpha=1.0, trans=0.0):
    m = bpy.data.materials.new(nombre)
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*color, 1)
    b.inputs['Roughness'].default_value = rough
    b.inputs['Coat Weight'].default_value = coat
    b.inputs['Transmission Weight'].default_value = trans
    if emision:
        b.inputs['Emission Color'].default_value = (*emision[0], 1)
        b.inputs['Emission Strength'].default_value = emision[1]
    return m


def tauari():
    m = bpy.data.materials.new('Tauari')
    nt = m.node_tree
    b = nt.nodes['Principled BSDF']
    tex = nt.nodes.new('ShaderNodeTexImage')
    tex.image = bpy.data.images.load(str(RAW / '02-montaje/ref-acabado-tauari.jpg'))
    tex.projection = 'BOX'
    tex.projection_blend = 0.15
    coord = nt.nodes.new('ShaderNodeNewGeometry')  # posición en el mundo (los STL quedan con escala de objeto 0,001)
    mp = nt.nodes.new('ShaderNodeMapping')
    mp.inputs['Scale'].default_value = (1 / 0.62, 1 / 0.62, 1 / 0.62)  # muestra 800 px ~ 62 cm
    mp.inputs['Location'].default_value = (0, 0, 0.21)  # costura de la textura en z=0,49 m (línea del entrepaño)
    nt.links.new(coord.outputs['Position'], mp.inputs['Vector'])
    nt.links.new(mp.outputs['Vector'], tex.inputs['Vector'])
    nt.links.new(tex.outputs['Color'], b.inputs['Base Color'])
    b.inputs['Roughness'].default_value = 0.55
    b.inputs['Coat Weight'].default_value = 0.15
    return m


def caja(nombre, centro, dims, material, **kw):
    bpy.ops.mesh.primitive_cube_add(size=1, location=centro)
    o = bpy.context.object
    o.name = nombre
    o.scale = dims
    o.data.materials.append(material)
    for k, v in kw.items():
        setattr(o, k, v)
    return o


def cilindro(nombre, centro, r, h, material, rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_cylinder_add(radius=r, depth=h, location=centro, rotation=rot, vertices=48)
    o = bpy.context.object
    o.name = nombre
    o.data.materials.append(material)
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
s.cycles.samples = 32 if prueba else 192
s.cycles.use_denoising = True
s.render.resolution_x, s.render.resolution_y = 1024, 1536  # 2:3 vertical como la referencia
s.render.resolution_percentage = 50 if prueba else 100
s.view_settings.view_transform = 'AgX'
s.view_settings.exposure = -0.6

# ---------- producto ----------
m_tauari = tauari()
m_negro = mat('NegroMate', (0.006, 0.006, 0.006), 0.6)
m_negro.node_tree.nodes['Principled BSDF'].inputs['Specular IOR Level'].default_value = 0.15
m_esmalte = mat('Esmalte', (0.92, 0.92, 0.91), 0.06, coat=1.0)
producto = []
for nombre, t in ens['traslacion_mm'].items():
    for o in importar(MUEBLE / nombre, 'Z', 'Y'):
        o.location = Vector(t) / 1000 + Vector((0, 0, BASE))
        o.name = nombre.replace('.stl', '')
        o.data.materials.clear()
        o.data.materials.append(m_negro if nombre.startswith('manija') else m_tauari)
        producto.append(o)
oslo = importar(LAV / 'oslo-63x48.stl', 'Y', 'NEGATIVE_Z')
p = pts(oslo)
mn, mx = p.min(0), p.max(0)
cx = (mn[0] + mx[0]) / 2
lat = np.abs(p[:, 0] - cx) > (mx[0] - mn[0]) / 2 - 0.004
d = Vector((0 - cx, PARED_Y - mx[1], 0.480 + BASE - p[lat, 2].min()))
for o in oslo:
    o.location += d
    o.name = 'oslo-63x48'
    o.data.materials.clear()
    o.data.materials.append(m_esmalte)
    bpy.context.view_layer.objects.active = o
    o.select_set(True)
    bpy.ops.object.shade_auto_smooth(angle=0.5236)
producto += oslo
cub = float(pts(oslo)[:, 2].max())

# grifería monocomando de base (genérica), negro mate
hx, hy = HUECO
g = [cilindro('grifo-base', (hx, hy, cub + 0.004), 0.026, 0.008, m_negro),
     cilindro('grifo-cuerpo', (hx, hy, cub + 0.008 + 0.085), 0.022, 0.17, m_negro)]
alto = cub + 0.008 + 0.17
g.append(cilindro('grifo-cano', (hx, hy - 0.06, alto - 0.018), 0.014, 0.13, m_negro, rot=(math.radians(90), 0, 0)))
g.append(cilindro('grifo-boquilla', (hx, hy - 0.12, alto - 0.035), 0.012, 0.03, m_negro))
g.append(caja('grifo-palanca', (hx, hy + 0.035, alto + 0.01), (0.012, 0.07, 0.008), m_negro, rotation_euler=(math.radians(-15), 0, 0)))
producto += g

# ---------- greybox del baño ----------
m_pared = mat('PorcelanatoBeige', (0.78, 0.70, 0.60), 0.45)
m_piso = mat('PisoBeige', (0.76, 0.68, 0.58), 0.5)
m_techo = mat('Techo', (0.85, 0.80, 0.73), 0.8)
m_espejo = mat('Espejo', (0.9, 0.9, 0.9), 0.02)
m_espejo.node_tree.nodes['Principled BSDF'].inputs['Metallic'].default_value = 1.0
m_vidrio = mat('Vidrio', (1, 1, 1), 0.0, trans=1.0)
m_led = mat('LED', (1, 1, 1), 0.5, emision=((1.0, 0.72, 0.42), 10))
m_marco = mat('MarcoNegro', (0.02, 0.02, 0.02), 0.4)
H, A, P = 2.6, 2.2, 2.6  # alto, ancho, profundidad visible del cuarto
amb = []
amb.append(caja('pared-fondo', (0, PARED_Y + 0.05, H / 2), (A, 0.1, H), m_pared))
amb.append(caja('piso', (0, PARED_Y - P / 2, -0.05), (A, P + 0.2, 0.1), m_piso))
amb.append(caja('techo', (0, PARED_Y - P / 2, H + 0.05), (A, P + 0.2, 0.1), m_techo))
amb.append(caja('pared-izq', (-A / 2 - 0.05, PARED_Y - P / 2, H / 2), (0.1, P, H), m_pared))
amb.append(caja('pared-camara', (0, PARED_Y - P - 0.7, H / 2), (A, 0.1, H), m_pared))
amb.append(caja('pared-der', (A / 2 + 0.05, PARED_Y - P / 2, H / 2), (0.1, P, H), m_pared))
# espejo vertical con LED perimetral (como la referencia)
amb.append(caja('led-espejo', (0, PARED_Y - 0.012, 1.55), (0.52, 0.01, 0.82), m_led))
amb.append(caja('marco-espejo', (0, PARED_Y - 0.03, 1.55), (0.50, 0.02, 0.80), m_marco))
amb.append(caja('espejo', (0, PARED_Y - 0.041, 1.55), (0.48, 0.002, 0.78), m_espejo))
# vidrio de ducha a la izquierda y ventana a la derecha
amb.append(caja('vidrio-ducha', (-0.62, PARED_Y - 1.0, 1.0), (0.01, 2.0, 2.0), m_vidrio))
ventana = caja('ventana', (A / 2 + 0.001, PARED_Y - 0.9, 1.55), (0.02, 0.9, 1.0), mat('Cielo', (1, 1, 1), 1, emision=((0.95, 0.97, 1.0), 3)))
amb.append(ventana)
# downlights cálidos
for i, (x, y) in enumerate([(0, PARED_Y - 0.45), (0, PARED_Y - 1.5)]):
    bpy.ops.object.light_add(type='SPOT', location=(x, y, H - 0.02))
    l = bpy.context.object
    l.data.energy, l.data.spot_size, l.data.spot_blend = 120, math.radians(95), 0.6
    l.data.color = (1.0, 0.78, 0.55)
bpy.ops.object.light_add(type='AREA', location=(A / 2 - 0.05, PARED_Y - 0.9, 1.55))
l = bpy.context.object
l.data.energy, l.data.size = 120, 0.9
l.data.color = (0.95, 0.97, 1.0)
l.rotation_euler = (0, math.radians(-90), 0)
w = bpy.data.worlds.new('W')
s.world = w
w.node_tree.nodes['Background'].inputs['Strength'].default_value = 0.05

# ---------- cámara (frontal, altura de ojos, como la referencia) ----------
bpy.ops.object.camera_add(location=(0, PARED_Y - 3.05, 1.30))
cam = bpy.context.object
s.camera = cam
cam.data.lens = 35
cam.data.sensor_fit = 'VERTICAL'
cam.data.sensor_height = 36
cam.rotation_euler = (Vector((0, PARED_Y, 1.0)) - cam.location).to_track_quat('-Z', 'Y').to_euler()


def ocultar(objs, flag):
    for o in objs:
        o.hide_render = flag


def render(nombre):
    s.render.filepath = str(AQUI / f"{'prueba-' if prueba else ''}{nombre}.png")
    bpy.ops.render.render(write_still=True)


# 1) greybox sin producto
ocultar(producto, True)
s.render.film_transparent = False
render('greybox-ambiente')
# 2) vista previa local con producto
ocultar(producto, False)
render('greybox-con-producto')
# 3) capa RGBA del producto con sombra sobre pared/piso (shadow catcher)
for o in amb:
    o.is_shadow_catcher = o.name in ('pared-fondo', 'piso')
    o.visible_camera = o.name in ('pared-fondo', 'piso')
s.render.film_transparent = True
render('producto-rgba')
# 4) máscara del producto
for o in amb:
    o.hide_render = True
mm = mat('Mascara', (1, 1, 1), 1, emision=((1, 1, 1), 1))
guard = {o.name: list(o.data.materials) for o in producto}
for o in producto:
    o.data.materials.clear()
    o.data.materials.append(mm)
s.cycles.samples = 8
s.view_settings.view_transform = 'Standard'
render('mascara-producto')

info = {'camara': {'pos_m': list(cam.location), 'rot_rad': list(cam.rotation_euler), 'lente_mm': 35, 'sensor': 'vertical 36 mm',
                   'resolucion': [1024, 1536]},
        'producto': {'cubierta_lavamanos_m': round(cub, 4), 'base_mueble_m': BASE, 'pared_y_m': PARED_Y,
                     'griferia': 'monocomando genérico procedural, negro mate, en perforación del Oslo'}}
(AQUI / 'camara.json').write_text(json.dumps(info, indent=2), encoding='utf-8')
bpy.ops.wm.save_as_mainfile(filepath=str(AQUI / 'escena-parte1.blend'))
print('INFO', json.dumps(info))
