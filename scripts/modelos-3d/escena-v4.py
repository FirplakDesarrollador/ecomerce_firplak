"""Escena v4 del Mix & Match (Opción D): cámara nivelada de dos puntos de fuga y dos ambientes.

Biblioteca + CLI de Blender. Parte de referencia-ambiente-34-v3-completo.blend (mismo cuarto,
mismo sol y mismo cielo del piloto) y solo cambia:
  - la cámara (variante A aprobada: rotación X 90°, Z -29°, ojos a 1,40 m, 3,0 m al mueble);
  - los elementos MODELADOS en 3D de cada ambiente, para que sombras, reflejos y geometría sean reales.

Ambientes (comparten cuarto, ventana, cámara y luz; solo cambian elementos y materiales):
  moderno  microcemento gris cálido, piso gran formato con juntas, espejo con LED perimetral,
           repisa con objetos, planta (proxy), dos apliques de acento.
  calido   el aprobado del piloto (microcemento arena / piedra clara): espejo simple, sin decoración.
Ambos llevan la misma ventana visible en la pared del fondo. El sol del piloto sigue entrando por
la ventana de la pared izquierda, que con esta cámara queda fuera de cuadro (la cámara está junto
a esa pared); la ventana visible no cambia la dirección del sol.

Los apliques y el LED son luz de acento: se apagan al renderizar productos para que las capas de
producto sean idénticas en los dos ambientes.

CLI:
  blender -b -P scripts/modelos-3d/escena-v4.py -- revision [--muestras 64] [--pct 100]
      -> ambientes-v4/greybox-<amb>-con-producto.png, greybox-<amb>-vacio.png, greybox-<amb>.blend,
         ambientes-v4/encuadre-v4.json
No genera geometría de producto ni llama servicios de IA.
"""
import ast
import json
import math
import random
import sys
from pathlib import Path

import bpy
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[2]
PILOT = ROOT / 'assets-fuente/generativo-63x48/piloto-ventana-calida-34'
OUT = ROOT / 'assets-fuente/generativo-63x48/ambientes-v4'
BASE_BLEND = PILOT / 'referencia-ambiente-34-v3-completo.blend'
# Ambientes desde el registro del catálogo (id + función constructora de este archivo).
CATALOGO = json.loads((ROOT / 'scripts/mix-match/catalogo-mix-match.json').read_text(encoding='utf-8'))
AMBIENTES = tuple(a['id'] for a in CATALOGO['ambientes'])
CONSTRUCTORES = {a['id']: a['constructor'] for a in CATALOGO['ambientes']}

# ---- Cámara aprobada (variante A) -------------------------------------------------------------
PISO_Z = -0.29
CENTRO_MUEBLE = (0.0, -0.24)
YAW = math.radians(-29)
DIST = 3.0
ALTURA_OJOS = 1.40
CAM_LOC = (CENTRO_MUEBLE[0] + math.sin(YAW) * DIST, CENTRO_MUEBLE[1] - math.cos(YAW) * DIST, PISO_Z + ALTURA_OJOS)
CAM_ROT = (math.radians(90), 0.0, YAW)
AMB_RES = (1800, 1200)
AMB_LENTE = 35.0
AMB_SHIFT_Y = float(next((a.split('=')[1] for a in sys.argv if a.startswith('--shift_y=')), -0.117))
PROD_RES = 1600
PROD_LENTE = 100.0

# ---- Biblioteca de producto del piloto (GLB Vitelli + materiales) ----------------------------
_src = ROOT / 'scripts/modelos-3d/render-en-ambiente.py'
_tree = ast.parse(_src.read_text(encoding='utf-8-sig'))
_tree.body = [n for n in _tree.body if not (isinstance(n, ast.Expr) and isinstance(n.value, ast.Call)
                                             and getattr(n.value.func, 'id', None) == 'main')]
lib = {'__file__': str(_src), '__name__': 'escena_v4_lib'}
exec(compile(_tree, str(_src), 'exec'), lib)


def es_cuarto(o):
    """Superficies del cuarto: reciben proyección del fondo y sombras (shadow catcher)."""
    return o.type == 'MESH' and bool(o.get('cuarto'))


# proyectar_fondo() de la biblioteca usa es_greybox(): se redirige al cuarto v4.
lib['es_greybox'] = es_cuarto


def mat(nombre, color, rug=0.8, metal=0.0, emision=None, fuerza=0.0, transmision=0.0):
    m = bpy.data.materials.get(nombre)
    if m:
        return m
    m = bpy.data.materials.new(nombre)
    m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*color, 1)
    b.inputs['Roughness'].default_value = rug
    b.inputs['Metallic'].default_value = metal
    if transmision:
        b.inputs['Transmission Weight'].default_value = transmision
        b.inputs['IOR'].default_value = 1.45
    if emision:
        b.inputs['Emission Color'].default_value = (*emision, 1)
        b.inputs['Emission Strength'].default_value = fuerza
    return m


def _props(o, props):
    for k, v in props.items():
        o[k] = v
    return o


def caja(nombre, cx, cy, cz, sx, sy, sz, material, **props):
    bpy.ops.mesh.primitive_cube_add(size=1, location=(cx, cy, cz))
    o = bpy.context.active_object
    o.name = nombre
    o.scale = (sx, sy, sz)
    bpy.ops.object.transform_apply(scale=True)
    o.data.materials.append(material)
    return _props(o, props)


def cilindro(nombre, cx, cy, cz, r, h, material, verts=48, **props):
    bpy.ops.mesh.primitive_cylinder_add(vertices=verts, radius=r, depth=h, location=(cx, cy, cz))
    o = bpy.context.active_object
    o.name = nombre
    o.data.materials.append(material)
    bpy.ops.object.shade_smooth()
    return _props(o, props)


def torno(nombre, perfil, cx, cy, z0, material, pasos=48, **props):
    """Sólido de revolución a partir de (radio, altura) para jarrones y macetas."""
    import bmesh
    me = bpy.data.meshes.new(nombre)
    bm = bmesh.new()
    anillos = []
    for r, h in perfil:
        r = max(r, 1e-4)
        anillos.append([bm.verts.new((cx + r * math.cos(2 * math.pi * i / pasos),
                                      cy + r * math.sin(2 * math.pi * i / pasos), z0 + h))
                        for i in range(pasos)])
    for a, b in zip(anillos, anillos[1:]):
        for i in range(pasos):
            j = (i + 1) % pasos
            bm.faces.new((a[i], a[j], b[j], b[i]))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(me)
    bm.free()
    o = bpy.data.objects.new(nombre, me)
    bpy.context.collection.objects.link(o)
    for p in me.polygons:
        p.use_smooth = True
    me.materials.append(material)
    return _props(o, props)


# ---- Cuarto ----------------------------------------------------------------------------------
VENTANA = {'x0': -1.30, 'x1': -0.80, 'z0': 0.48, 'z1': 1.76}  # pared del fondo, a la izquierda


def preparar_cuarto():
    """Marca el cuarto del piloto y abre la ventana visible en la pared del fondo."""
    arcilla = bpy.data.materials['Arcilla']
    fondo = bpy.data.objects['Fondo']  # x -1.7..1.7, y 0..0.1, z -0.29..2.16
    bpy.data.objects.remove(fondo, do_unlink=True)
    v = VENTANA
    zt, zb = 2.16, -0.29
    piezas = [
        ('Fondo-izq', (-1.7 + v['x0']) / 2, (v['x0'] + 1.7), zb, zt),
        ('Fondo-der', (v['x1'] + 1.7) / 2, (1.7 - v['x1']), zb, zt),
        ('Fondo-bajo', (v['x0'] + v['x1']) / 2, v['x1'] - v['x0'], zb, v['z0']),
        ('Fondo-alto', (v['x0'] + v['x1']) / 2, v['x1'] - v['x0'], v['z1'], zt),
    ]
    for nombre, cx, sx, z0, z1 in piezas:
        caja(nombre, cx, 0.05, (z0 + z1) / 2, sx, 0.1, z1 - z0, arcilla, cuarto=True)
    for o in bpy.data.objects:
        if o.type == 'MESH' and (o.name in {'Piso', 'Techo'} or o.name.startswith('Lateral')):
            o['cuarto'] = True
    marco = mat('MarcoNegro', (0.03, 0.03, 0.03), 0.35, 0.6)
    e, p = 0.035, 0.06
    cx = (v['x0'] + v['x1']) / 2
    w, h = v['x1'] - v['x0'], v['z1'] - v['z0']
    zc = (v['z0'] + v['z1']) / 2
    caja('Ventana-marco-izq', v['x0'] + e / 2, 0.03, zc, e, p, h, marco, ventana=True)
    caja('Ventana-marco-der', v['x1'] - e / 2, 0.03, zc, e, p, h, marco, ventana=True)
    caja('Ventana-marco-bajo', cx, 0.03, v['z0'] + e / 2, w, p, e, marco, ventana=True)
    caja('Ventana-marco-alto', cx, 0.03, v['z1'] - e / 2, w, p, e, marco, ventana=True)
    caja('Ventana-travesano', cx, 0.03, v['z0'] + 0.62 * h, w, p, 0.025, marco, ventana=True)
    vidrio = mat('Vidrio', (0.95, 0.97, 1.0), 0.02, transmision=1.0)
    g = caja('Ventana-vidrio', cx, 0.04, zc, w - 2 * e, 0.006, h - 2 * e, vidrio, ventana=True)
    g.visible_shadow = False
    caja('Ventana-alfeizar', cx, -0.02, v['z0'] - 0.012, w + 0.04, 0.06, 0.024, arcilla, ventana=True)


def espejo_simple():
    """Espejo del piloto (0,60 x 0,80 m) tal cual."""
    bpy.data.objects['Espejo']['cuarto'] = True


def ambiente_moderno():
    bpy.data.objects.remove(bpy.data.objects['Espejo'], do_unlink=True)
    vidrio_espejo = mat('EspejoArcilla4', (0.30, 0.31, 0.33), 0.25)
    # Mismo tamaño y altura del espejo del piloto; canto fino, separado 2,5 cm de la pared.
    caja('Espejo', 0.0, -0.035, 1.25, 0.60, 0.02, 0.80, vidrio_espejo, cuarto=True)
    # LED perimetral: tira emisora detrás del espejo, retranqueada 3 cm (halo sobre la pared).
    led = mat('LED', (1, 1, 1), emision=(1.0, 0.80, 0.58), fuerza=6.0)
    t = 0.012
    for nombre, cx, cz, sx, sz in [('LED-alto', 0, 1.25 + 0.37, 0.54, t), ('LED-bajo', 0, 1.25 - 0.37, 0.54, t),
                                   ('LED-izq', -0.27, 1.25, t, 0.74), ('LED-der', 0.27, 1.25, t, 0.74)]:
        o = caja(nombre, cx, -0.018, cz, sx, 0.008, sz, led, decoracion=True, acento=True)
        o.visible_camera = False
    # Apliques de acento a cada lado del espejo: cilindro opalino + luz cálida débil arriba/abajo.
    laton = mat('Laton', (0.80, 0.62, 0.36), 0.3, 1.0)
    opal = mat('Opal', (0.95, 0.93, 0.90), 0.5, emision=(1.0, 0.78, 0.55), fuerza=4.0)
    for lado, x in (('izq', -0.50), ('der', 0.50)):
        caja(f'Aplique-{lado}-base', x, -0.006, 1.42, 0.06, 0.012, 0.10, laton, decoracion=True)
        caja(f'Aplique-{lado}-brazo', x, -0.04, 1.42, 0.014, 0.07, 0.014, laton, decoracion=True)
        cilindro(f'Aplique-{lado}-pantalla', x, -0.085, 1.42, 0.035, 0.20, opal, decoracion=True, acento=True)
        for dz, nom in ((0.16, 'arriba'), (-0.16, 'abajo')):
            bpy.ops.object.light_add(type='SPOT', location=(x, -0.085, 1.42 + dz * 0.7))
            L = bpy.context.active_object
            L.name = f'Aplique-{lado}-{nom}'
            L.rotation_euler = (math.pi, 0, 0) if dz > 0 else (0, 0, 0)  # spot apunta a -Z
            L.data.energy = 6.0
            L.data.color = (1.0, 0.76, 0.52)
            L.data.spot_size = math.radians(70)
            L.data.spot_blend = 0.6
            L.data.shadow_soft_size = 0.02
            _props(L, {'decoracion': True, 'acento': True})
    # Repisa flotante a la derecha del espejo, con objetos.
    madera = mat('RepisaRoble', (0.55, 0.42, 0.30), 0.6)
    caja('Repisa', 0.92, -0.10, 1.02, 0.60, 0.20, 0.04, madera, decoracion=True)
    ceramica = mat('CeramicaMate', (0.82, 0.80, 0.76), 0.7)
    oscura = mat('CeramicaOscura', (0.18, 0.17, 0.16), 0.6)
    libros = [mat(f'Libro{i}', c, 0.7) for i, c in enumerate([(0.75, 0.70, 0.62), (0.35, 0.38, 0.33), (0.85, 0.83, 0.80)])]
    z = 1.04
    for i, (alto, ancho) in enumerate([(0.035, 0.24), (0.03, 0.22), (0.025, 0.20)]):
        caja(f'Libro-{i}', 0.76, -0.10, z + alto / 2, ancho, 0.16, alto, libros[i], decoracion=True)
        z += alto
    torno('Vela', [(0.0, 0), (0.035, 0), (0.035, 0.07), (0.0, 0.07)], 0.76, -0.10, z, ceramica, decoracion=True)
    torno('Jarron', [(0.0, 0), (0.05, 0), (0.07, 0.06), (0.065, 0.14), (0.035, 0.20), (0.03, 0.24), (0.0, 0.24)],
          1.00, -0.10, 1.04, oscura, decoracion=True)
    tallo = mat('Rama', (0.30, 0.25, 0.18), 0.8)
    for i, (dx, inc) in enumerate([(0.0, 0.15), (0.02, -0.25), (-0.02, 0.35)]):
        bpy.ops.mesh.primitive_cylinder_add(vertices=8, radius=0.003, depth=0.30,
                                            location=(1.0 + dx, -0.10, 1.04 + 0.24 + 0.14))
        o = bpy.context.active_object
        o.name = f'Rama-{i}'
        o.rotation_euler = (0, inc, 0)
        o.data.materials.append(tallo)
        o['decoracion'] = True
    torno('Cuenco', [(0.0, 0), (0.04, 0), (0.06, 0.035), (0.0, 0.035)], 1.15, -0.10, 1.04, ceramica, decoracion=True)
    # Planta de piso (proxy) en la esquina derecha: maceta + hojas elipsoidales con tallos.
    torno('Maceta', [(0.0, 0), (0.13, 0), (0.17, 0.42), (0.0, 0.42)], 1.30, -0.42, PISO_Z, ceramica, decoracion=True)
    hoja = mat('Hoja', (0.16, 0.26, 0.12), 0.55)
    rnd = random.Random(7)
    base = Vector((1.30, -0.42, PISO_Z + 0.40))
    for i in range(22):
        ang = rnd.uniform(0, 2 * math.pi)
        alto = rnd.uniform(0.45, 1.0)
        rad = rnd.uniform(0.05, 0.28) * (alto / 1.0)
        punta = Vector((1.30 + rad * math.cos(ang), -0.42 + rad * math.sin(ang), PISO_Z + 0.42 + alto))
        bpy.ops.mesh.primitive_uv_sphere_add(segments=16, ring_count=8, radius=1, location=punta)
        o = bpy.context.active_object
        o.name = f'Hoja-{i}'
        o.scale = (0.06, 0.012, 0.16)
        o.rotation_euler = (rnd.uniform(-0.6, 0.6), rnd.uniform(-0.7, 0.7), ang)
        o.data.materials.append(hoja)
        bpy.ops.object.shade_smooth()
        o['decoracion'] = True
        d = punta - base
        bpy.ops.mesh.primitive_cylinder_add(vertices=6, radius=0.004, depth=d.length, location=base + d / 2)
        tt = bpy.context.active_object
        tt.name = f'Tallo-{i}'
        tt.rotation_euler = d.to_track_quat('Z', 'Y').to_euler()
        tt.data.materials.append(tallo)
        tt['decoracion'] = True
    # Piso gran formato 120 x 60 cm: juntas modeladas (3 mm, 0,6 mm de relieve).
    junta = mat('Junta', (0.38, 0.37, 0.35), 0.9)
    for i in range(-2, 3):
        caja(f'Junta-x{i}', i * 0.60, -2.75, PISO_Z + 0.0003, 0.003, 5.5, 0.0006, junta, junta_piso=True)
    for j in range(1, 5):
        caja(f'Junta-y{j}', 0, -j * 1.20, PISO_Z + 0.0003, 3.2, 0.003, 0.0006, junta, junta_piso=True)


def abrir(ambiente):
    bpy.ops.wm.open_mainfile(filepath=str(BASE_BLEND))
    s = bpy.context.scene
    preparar_cuarto()
    globals()[CONSTRUCTORES[ambiente]]()  # p. ej., ambiente_moderno o espejo_simple
    c = s.camera
    c.location = CAM_LOC
    c.rotation_euler = CAM_ROT
    camara_ambiente(s)
    s.render.resolution_percentage = 100
    pref = bpy.context.preferences.addons['cycles'].preferences
    pref.compute_device_type = 'HIP'
    pref.refresh_devices()
    for d in pref.devices:
        d.use = d.type != 'CPU'
    s.cycles.device = 'GPU'
    ims = s.render.image_settings
    if hasattr(ims, 'media_type'):
        ims.media_type = 'IMAGE'
    ims.file_format = 'PNG'
    return s


def acentos(encendidos):
    for o in bpy.data.objects:
        if o.get('acento'):
            o.hide_render = not encendidos


def proyectar(s, x, y, z):
    """Proyección de un punto del mundo al píxel del lienzo actual (resolución al 100 %)."""
    from bpy_extras.object_utils import world_to_camera_view
    v = world_to_camera_view(s, s.camera, Vector((x, y, z)))
    return v.x * s.render.resolution_x, (1 - v.y) * s.render.resolution_y


def bbox_px(s, objetos):
    pts = [proyectar(s, *(o.matrix_world @ v.co)) for o in objetos for v in o.data.vertices]
    xs, ys = [p[0] for p in pts], [p[1] for p in pts]
    return [min(xs), min(ys), max(xs), max(ys)]


def encuadre_producto(s, objetos):
    """Lente/shift de la cámara de producto: misma posición y rotación, recorte cuadrado en el ambiente.

    Con sensor_fit AUTO (36 mm sobre el lado mayor), la focal del ambiente en píxeles es
    f = lente/36*1800 y el producto (1600 px, lente PROD_LENTE) cubre un cuadrado de lado
    f*36/PROD_LENTE en el lienzo del ambiente. Su centro = punto principal + shift*lado.
    """
    W, H = AMB_RES
    f_amb = AMB_LENTE / 36.0 * W
    lado = f_amb * 36.0 / PROD_LENTE
    x0, y0, x1, y1 = bbox_px(s, objetos)
    ppx = W / 2 - s.camera.data.shift_x * max(W, H)
    ppy = H / 2 + s.camera.data.shift_y * max(W, H)
    psx = round(((x0 + x1) / 2 - ppx) / lado, 5)
    psy = round(-((y0 + y1) / 2 - ppy) / lado, 5)
    cx, cy = ppx + psx * lado, ppy - psy * lado
    recorte = [cx - lado / 2, cy - lado / 2, cx + lado / 2, cy + lado / 2]
    holgura = min(x0 - recorte[0], y0 - recorte[1], recorte[2] - x1, recorte[3] - y1) / lado
    return {'product_lens_mm': PROD_LENTE, 'product_shift': [psx, psy], 'product_resolution': [PROD_RES, PROD_RES],
            'product_crop_in_background': recorte, 'product_bbox_vitelli_oslo_px': [x0, y0, x1, y1],
            'margin_fraction_min': round(holgura, 4),
            'verified_full_product_crop_inside_background':
                recorte[0] >= 0 and recorte[1] >= 0 and recorte[2] <= W and recorte[3] <= H}


def camara_producto(s, enc):
    c = s.camera
    c.data.lens = enc['product_lens_mm']
    c.data.shift_x, c.data.shift_y = enc['product_shift']
    s.render.resolution_x = s.render.resolution_y = PROD_RES


def camara_ambiente(s):
    c = s.camera
    c.data.lens = AMB_LENTE
    c.data.shift_x, c.data.shift_y = 0.0, AMB_SHIFT_Y
    s.render.resolution_x, s.render.resolution_y = AMB_RES


def leer_encuadre():
    return json.loads((OUT / 'encuadre-v4.json').read_text(encoding='utf-8'))


def revision(muestras, pct):
    OUT.mkdir(parents=True, exist_ok=True)
    enc, extra = None, {}
    for amb in AMBIENTES:
        s = abrir(amb)
        s.cycles.samples = muestras
        s.render.film_transparent = False
        acentos(True)
        bpy.ops.wm.save_as_mainfile(filepath=str(OUT / f'greybox-{amb}.blend'))
        s.render.resolution_percentage = pct
        s.render.filepath = str(OUT / f'greybox-{amb}-vacio.png')
        bpy.ops.render.render(write_still=True)
        s.render.resolution_percentage = 100
        prod = lib['cargar_producto']('oslo', str(ROOT / 'public/images/muebles/vitelli-63/acabados/soder.webp'))
        visibles = [o for o in prod if not o.hide_render]
        if enc is None:
            enc = encuadre_producto(s, visibles)
            esp = bpy.data.objects['Espejo']
            extra['mirror_bbox_px'] = bbox_px(s, [esp])
        s.render.resolution_percentage = pct
        s.render.filepath = str(OUT / f'greybox-{amb}-con-producto.png')
        bpy.ops.render.render(write_still=True)
    datos = {
        'version': 4,
        'source_resolution': list(AMB_RES),
        'camera_position': [round(v, 7) for v in CAM_LOC],
        'camera_rotation': [round(v, 9) for v in CAM_ROT],
        'camera_note': 'Variante A aprobada: nivelada (dos puntos de fuga), ojos a 1,40 m, 3,0 m al centro del mueble (0,-0,24)',
        'environment_lens_mm': AMB_LENTE,
        'environment_shift': [0.0, AMB_SHIFT_Y],
        **enc, **extra,
        'base_scene': BASE_BLEND.name,
        'lights': 'Sol y cielo del piloto sin cambios; apliques y LED solo de acento (apagados en capas de producto)',
    }
    (OUT / 'encuadre-v4.json').write_text(json.dumps(datos, indent=2, ensure_ascii=False), encoding='utf-8')
    print('ENCUADRE_V4', json.dumps(datos), flush=True)


if __name__ == '__main__' and '--' in sys.argv:
    a = sys.argv[sys.argv.index('--') + 1:]
    if a and a[0] == 'revision':
        m = int(a[a.index('--muestras') + 1]) if '--muestras' in a else 64
        p = int(a[a.index('--pct') + 1]) if '--pct' in a else 100
        revision(m, p)
