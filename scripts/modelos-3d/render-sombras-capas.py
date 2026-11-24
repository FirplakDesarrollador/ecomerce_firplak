"""Sombras de cada mueble en el lienzo COMPLETO del ambiente (sin borde de recorte)."""
import ast
from pathlib import Path
import bpy

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'assets-fuente/generativo-63x48/piloto-capas'
PILOT = OUT.parent / 'piloto-ventana-calida-34'
source = ROOT / 'scripts/modelos-3d/render-en-ambiente.py'
tree = ast.parse(source.read_text(encoding='utf-8-sig'))
tree.body = [n for n in tree.body if not (isinstance(n, ast.Expr) and isinstance(n.value, ast.Call) and getattr(n.value.func, 'id', None) == 'main')]
lib = {'__file__': str(source), '__name__': 'shadow_library'}
exec(compile(tree, str(source), 'exec'), lib)

for cabinet in ['vitelli', 'tiziano', 'vacio']:
    blend = OUT / 'referencia-tiziano-capas.blend' if cabinet != 'vitelli' else PILOT / 'referencia-ambiente-34-v3-completo.blend'
    bpy.ops.wm.open_mainfile(filepath=str(blend))
    prefs = bpy.context.preferences.addons['cycles'].preferences
    prefs.compute_device_type = 'HIP'
    prefs.refresh_devices()
    for device in prefs.devices:
        device.use = device.type != 'CPU'
    scene = bpy.context.scene
    scene.cycles.device = 'GPU'
    scene.cycles.samples = 64
    scene.render.film_transparent = True
    scene.render.image_settings.color_mode = 'RGBA'
    scene.camera.data.lens = 35
    scene.camera.data.shift_x = 0
    scene.camera.data.shift_y = .14012326300144196
    scene.render.resolution_x, scene.render.resolution_y = 1800, 1200
    if cabinet == 'vitelli':
        objects = lib['cargar_producto']('oslo', str(ROOT / 'public/images/muebles/vitelli-63/acabados/soder.webp'))
        for obj in objects:
            if not obj.name.startswith(('Carcasa_', 'Puerta_', 'CajonSuperior_', 'CajonInferior_')):
                obj.hide_render = True
    receiver = lib['principled']('ShadowReceiverFullFrame', (.8, .8, .8), .9)
    for obj in bpy.data.objects:
        if lib['es_greybox'](obj):
            obj.data.materials.clear()
            obj.data.materials.append(receiver)
            obj.visible_camera = obj.visible_shadow = True
            obj.is_shadow_catcher = True
        elif obj.type == 'MESH':
            obj.visible_camera = False
            if cabinet == 'vacio':
                obj.hide_render = True
    scene.render.filepath = str(OUT / f'sombra-ambiente-{cabinet}.png')
    bpy.ops.render.render(write_still=True)
    print('FULL_SHADOW_COMPLETE', cabinet, flush=True)
