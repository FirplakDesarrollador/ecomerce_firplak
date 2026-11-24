"""Blender: STL de ingeniería (Fusion, mm) -> capa RGBA de lavamanos con la cámara del piloto Mix & Match.

blender -b --python scripts/modelos-3d/render-lavamanos-stl-capas.py -- \
    --piloto <raiz-con-assets-fuente> --modelos <carpeta-stl> --salida <carpeta> oslo bari siena trentino \
    [--muestras 96] [--prueba]

- Misma escena, cámara (100 mm, 1600 px), luz y fondo proyectado que render-vitelli-capas.py.
- Anclaje calibrado con el Oslo del GLB Vitelli: centro X, borde trasero y plano de apoyo sobre el mueble.
  Con "oslo" sale calibracion-oslo-stl.png; el IoU contra la capa aprobada se mide fuera de Blender
  (validar-capas-lavamanos-stl.py), porque el Python de Blender no trae PIL.
- El mueble es oclusor (holdout): la capa solo contiene lavamanos + grifería negra, nunca el mueble.
- No genera geometría ni llama servicios de IA; la geometría sale tal cual del STL.
"""
import ast
import json
import sys
from pathlib import Path

import bpy
import bmesh
import numpy as np
from mathutils import Vector

args = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []


def opcion(nombre, defecto=None):
    return args[args.index(nombre) + 1] if nombre in args else defecto


RAIZ_PILOTO = Path(opcion('--piloto'))
MODELOS = Path(opcion('--modelos'))
OUT = Path(opcion('--salida'))
muestras = int(opcion('--muestras', 96))
prueba = '--prueba' in args
valores = {opcion(n) for n in ('--piloto', '--modelos', '--salida', '--muestras')}
ids = [a for a in args if not a.startswith('--') and a not in valores]

CAPAS = RAIZ_PILOTO / 'assets-fuente/generativo-63x48/piloto-capas'
PILOT = CAPAS.parent / 'piloto-ventana-calida-34'
SOURCE = RAIZ_PILOTO / 'scripts/modelos-3d/render-en-ambiente.py'
tree = ast.parse(SOURCE.read_text(encoding='utf-8-sig'))
tree.body = [n for n in tree.body if not (
    isinstance(n, ast.Expr) and isinstance(n.value, ast.Call)
    and getattr(n.value.func, 'id', None) == 'main')]
lib = {'__file__': str(SOURCE), '__name__': 'render_library'}
exec(compile(tree, str(SOURCE), 'exec'), lib)

# Ejes de exportación verificados en validacion.json de los STL.
ARRIBA = {'siena': 'Z'}
BORDE = 0.003  # m desde el borde lateral para medir el faldón


def kind(o):
    if o.name.startswith(('Lavamanos_', 'Grifo_')):
        return 'lavamanos'
    if o.name.startswith(('Carcasa_', 'Puerta_', 'CajonSuperior_', 'CajonInferior_', 'Bisagras_')):
        return 'mueble'
    return 'otro'


def vertices(objs):
    pts = []
    for o in objs:
        m = np.array([list(r) for r in o.matrix_world])
        v = np.empty(len(o.data.vertices) * 3)
        o.data.vertices.foreach_get('co', v)
        pts.append(v.reshape(-1, 3) @ m[:3, :3].T + m[:3, 3])
    return np.concatenate(pts)


def anclas(pts):
    """Centro X, borde trasero (+Y), apoyo y cubierta.

    apoyo: borde inferior del faldón lateral, que descansa sobre la tapa del mueble (0,48 m).
    La profundidad del faldón cambia por modelo (Oslo 60 mm, Bari 50, Siena 54, Trentino 30,
    Génova 80), por eso no se alinea por la cara superior.
    cubierta: punto más alto (estos lavamanos no tienen salpicadero); ahí se apoya el grifo.
    """
    mn, mx = pts.min(0), pts.max(0)
    cx = (mn[0] + mx[0]) / 2
    lateral = np.abs(pts[:, 0] - cx) > (mx[0] - mn[0]) / 2 - BORDE
    return {'cx': float(cx), 'atras': float(mx[1]), 'apoyo': float(pts[lateral, 2].min()),
            'cubierta': float(mx[2]), 'dims_mm': [round(float(d) * 1000, 1) for d in mx - mn]}


def setup():
    bpy.ops.wm.open_mainfile(filepath=str(PILOT / 'referencia-ambiente-34-v3-completo.blend'))
    pref = bpy.context.preferences.addons['cycles'].preferences
    pref.compute_device_type = 'HIP'
    pref.refresh_devices()
    for d in pref.devices:
        d.use = d.type != 'CPU'
    s = bpy.context.scene
    s.cycles.device = 'GPU'
    s.cycles.samples = 16 if prueba else muestras
    s.render.film_transparent = True
    s.render.image_settings.color_mode = 'RGBA'
    objects = lib['cargar_producto']('oslo', str(RAIZ_PILOTO / 'public/images/muebles/vitelli-63/acabados/soder.webp'))
    projector = s.camera.copy()
    projector.data = s.camera.data.copy()
    s.collection.objects.link(projector)
    lib['proyectar_fondo'](str(PILOT / 'fondo-A-placa.png'), projector, .8)
    s.camera.data.lens = 100
    s.camera.data.shift_x = s.camera.data.shift_y = 0
    s.render.resolution_x = s.render.resolution_y = 1600
    if prueba:
        s.render.resolution_percentage = 50
    for o in bpy.data.objects:
        if lib['es_greybox'](o):
            o.visible_camera = False
            o.visible_shadow = False
    return s, objects


def importar(lid):
    antes = set(bpy.data.objects)
    up = ARRIBA.get(lid, 'Y')
    bpy.ops.wm.stl_import(filepath=str(MODELOS / f'{lid}-63x48.stl'), global_scale=0.001,
                          up_axis=up, forward_axis='Y' if up == 'Z' else 'NEGATIVE_Z')
    nuevos = [o for o in bpy.data.objects if o not in antes and o.type == 'MESH']
    for o in nuevos:
        bm = bmesh.new()
        bm.from_mesh(o.data)
        bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
        bm.to_mesh(o.data)
        bm.free()
        bpy.ops.object.select_all(action='DESELECT')
        bpy.context.view_layer.objects.active = o
        o.select_set(True)
        bpy.ops.object.shade_auto_smooth(angle=0.5236)
    return nuevos


s, objects = setup()
oslo_glb = [o for o in objects if o.name.startswith('Lavamanos_') and 'oslo' in o.name.lower() and not o.hide_render]
grifo = [o for o in objects if o.name.startswith('Grifo_') and not o.hide_render]
mueble = [o for o in objects if kind(o) == 'mueble' and not o.hide_render]
ref = anclas(vertices(oslo_glb))
print('REFERENCIA_OSLO_GLB', ref, 'grifo', vertices(grifo).mean(0).round(3).tolist(),
      [o.name for o in grifo], flush=True)

esmalte = lib['principled']('LavamanosEsmalteSTL', (0.91, 0.91, 0.91), 0.04, capa=1.0)
for o in oslo_glb:
    o.hide_render = True
for o in mueble:
    o.is_holdout = True
base_grifo = {o.name: o.location.copy() for o in grifo}

informe = {'referencia_glb_oslo': ref, 'lavamanos': {}}
for lid in ids:
    stl = importar(lid)
    a = anclas(vertices(stl))
    delta = Vector((ref['cx'] - a['cx'], ref['atras'] - a['atras'], ref['apoyo'] - a['apoyo']))
    for o in stl:
        o.location += delta
        o.data.materials.clear()
        o.data.materials.append(esmalte)
    bpy.context.view_layer.update()
    a2 = anclas(vertices(stl))
    dz = a2['cubierta'] - ref['cubierta']  # la grifería se apoya en la cubierta trasera
    for o in grifo:
        o.location = base_grifo[o.name] + Vector((0, 0, dz))
    nombre = f'calibracion-{lid}-stl.png' if lid == 'oslo' else f'lavamanos-{lid}-negro.png'
    destino = OUT / (f'prueba-{lid}-stl.png' if prueba else nombre)
    s.render.filepath = str(destino)
    bpy.ops.render.render(write_still=True)
    datos = {'archivo': f'{lid}-63x48.stl', 'dims_mm': a['dims_mm'],
             'traslacion_m': [round(float(d), 5) for d in delta], 'grifo_dz_mm': round(dz * 1000, 2),
             'capa': destino.name}
    informe['lavamanos'][lid] = datos
    print('CAPA', lid, json.dumps(datos), flush=True)
    for o in stl:
        bpy.data.objects.remove(o, do_unlink=True)

if not prueba:
    informe.update({'fuente': 'STL binario mm exportado de Autodesk Fusion (validacion.json)',
                    'geometry_modified': False, 'ai_generation': False, 'camera_changed': False,
                    'griferia': 'Grifo negro del GLB Vitelli, trasladado solo en altura'})
    previo = OUT / "fuente-lavamanos-stl.json"
    if previo.exists():
        informe["lavamanos"] = {**json.loads(previo.read_text(encoding="utf-8"))["lavamanos"], **informe["lavamanos"]}
    (OUT / "fuente-lavamanos-stl.json").write_text(json.dumps(informe, indent=2, ensure_ascii=False), encoding='utf-8')
print('LAVAMANOS_STL_COMPLETO', flush=True)
