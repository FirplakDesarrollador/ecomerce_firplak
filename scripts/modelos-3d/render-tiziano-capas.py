"""Blender: OBJ de ingeniería en cm -> capas con la cámara aprobada del piloto.

blender -b -t 8 --python scripts/modelos-3d/render-tiziano-capas.py
No genera geometría ni llama servicios de IA.
"""
import ast
import json
from pathlib import Path

import bpy
import bmesh

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'assets-fuente/generativo-63x48/piloto-capas'
PILOT = OUT.parent / 'piloto-ventana-calida-34'
SOURCE = ROOT / 'scripts/modelos-3d/render-en-ambiente.py'
tree = ast.parse(SOURCE.read_text(encoding='utf-8-sig'))
tree.body = [n for n in tree.body if not (
    isinstance(n, ast.Expr) and isinstance(n.value, ast.Call)
    and getattr(n.value.func, 'id', None) == 'main')]
lib = {'__file__': str(SOURCE), '__name__': 'render_library'}
exec(compile(tree, str(SOURCE), 'exec'), lib)


def import_obj():
    # Preserve the source topology and dimensions; the export is Z-up in cm.
    vertices, groups, group = [], {}, None
    for line in (OUT / 'modelos/tiziano-63x48.obj').read_text().splitlines():
        if line.startswith('v '):
            x, y, z = map(float, line.split()[1:4])
            vertices.append(((x - 31.289298) * .01,
                             (y - 39.55) * .01,
                             (z + 37.139298) * .01 + .48))
        elif line.startswith(('g ', 'o ')):
            group = line[2:]
            groups.setdefault(group, [])
        elif line.startswith('f '):
            groups[group].append(tuple(int(v.split('/')[0]) - 1 for v in line.split()[1:]))
    material = lib['material_acabado'](str(ROOT / 'public/images/muebles/vitelli-63/acabados/soder.webp'))
    objects = []
    for name, faces in groups.items():
        if not faces:
            continue
        used = sorted({i for face in faces for i in face})
        remap = {v: i for i, v in enumerate(used)}
        mesh = bpy.data.meshes.new(name)
        mesh.from_pydata([vertices[i] for i in used], [], [tuple(remap[i] for i in f) for f in faces])
        mesh.update()
        bm = bmesh.new()
        bm.from_mesh(mesh)
        bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
        bm.to_mesh(mesh)
        bm.free()
        # Physical planar UVs, in metres, matching the material's 0.7 m repeat.
        uv = mesh.uv_layers.new(name='UVMap')
        for polygon in mesh.polygons:
            axis = max(range(3), key=lambda i: abs(polygon.normal[i]))
            for i in polygon.loop_indices:
                x, y, z = mesh.vertices[mesh.loops[i].vertex_index].co
                uv.data[i].uv = ((-y if axis == 0 else x), (y if axis == 2 else z))
        obj = bpy.data.objects.new('Tiziano_' + name.replace(':', '_'), mesh)
        bpy.context.collection.objects.link(obj)
        mesh.materials.append(material)
        objects.append(obj)
    return objects


bpy.ops.wm.open_mainfile(filepath=str(PILOT / 'referencia-ambiente-34-v3-completo.blend'))
prefs = bpy.context.preferences.addons['cycles'].preferences
prefs.compute_device_type = 'HIP'
prefs.refresh_devices()
for device in prefs.devices:
    device.use = device.type != 'CPU'
scene = bpy.context.scene
scene.cycles.device = 'GPU'
scene.cycles.samples = 96
scene.render.film_transparent = True
scene.render.image_settings.color_mode = 'RGBA'
old = lib['cargar_producto']('oslo', str(ROOT / 'public/images/muebles/vitelli-63/acabados/soder.webp'))
for obj in old:
    obj.hide_render = True
projector = scene.camera.copy()
projector.data = scene.camera.data.copy()
scene.collection.objects.link(projector)
lib['proyectar_fondo'](str(PILOT / 'fondo-A-placa.png'), projector, .8)
scene.camera.data.lens = 100
scene.camera.data.shift_x = scene.camera.data.shift_y = 0
scene.render.resolution_x = scene.render.resolution_y = 1600
for obj in bpy.data.objects:
    if lib['es_greybox'](obj):
        obj.visible_camera = obj.visible_shadow = False
cabinet = import_obj()
bpy.context.view_layer.update()
scene.render.filepath = str(OUT / 'tiziano-soder-cerrado.png')
bpy.ops.render.render(write_still=True)
bpy.ops.wm.save_as_mainfile(filepath=str(OUT / 'referencia-tiziano-capas.blend'))
receiver = lib['principled']('ShadowReceiver', (.8, .8, .8), .9)
for obj in bpy.data.objects:
    if lib['es_greybox'](obj):
        obj.data.materials.clear()
        obj.data.materials.append(receiver)
        obj.visible_camera = obj.visible_shadow = True
        obj.is_shadow_catcher = True
for obj in cabinet:
    obj.visible_camera = False
scene.render.filepath = str(OUT / 'sombra-tiziano.png')
bpy.ops.render.render(write_still=True)
(OUT / 'fuente-tiziano.json').write_text(json.dumps({
    'source': 'CAMBIO DE RADIOS MBL LVM TIZIANO 63X48.obj',
    'source_units': 'cm', 'up_axis': 'Z', 'source_parts': len(cabinet),
    'metres_scale': .01, 'top_z_metres': .48,
    'finish': 'Soder', 'geometry_modified': False,
    'ai_generation': False, 'camera_changed': False,
}, indent=2), encoding='utf-8')
print('TIZIANO_LAYERS_COMPLETE', flush=True)
