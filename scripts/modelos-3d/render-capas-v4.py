"""Capas v4 del Mix & Match (Opción D) con la cámara de dos puntos de fuga.

blender -b -P scripts/modelos-3d/render-capas-v4.py -- <fase> [--muestras 128] [--prueba]
  muebles     vitelli-soder-cerrado.png, tiziano-soder-cerrado.png (1600 px, cámara de producto)
  lavamanos   lavamanos-<id>.png: los 6 STL Fusion (oslo/genova/bari/siena/trentino/quadratto)
              anclados por contacto geométrico sobre la tapa del mueble, con grifería asentada
  sombras     sombra-<amb>-<mueble>.png y sombra-<amb>-vacio.png en el lienzo completo 1800x1200
              (solo luz directa; --solo <amb>:<mueble> repite una pasada)
  escena      escena-<mueble>-<lavamanos>.png: producto renderizado DENTRO del cuarto con la cámara
              del ambiente (alfa), para comprobar al píxel el contorno de las capas compuestas

Todo sale de render PBR desde CAD/GLB/STL: sin IA, sin pulido, sin alterar geometría.
- Escena: greybox-moderno.blend aprobado (ambientes-v4). Las capas de producto se renderizan UNA vez
  y sirven a los dos ambientes: comparten cuarto, ventana, sol y cielo. Se apagan la decoración y
  las luces de acento (LED y apliques) para que el producto no dependa del ambiente. Para reflejos y
  rebote, el cuarto lleva la placa aprobada del ambiente moderno proyectada desde la cámara.
- Cámara de producto: misma posición y rotación que el ambiente, lente/shift de encuadre-v4.json.
- Sombras: shadow catcher sobre las superficies del cuarto de CADA ambiente, en el lienzo completo,
  con pasada sin producto (vacio) para aislar la contribución del mueble.
"""
import json
import sys
from pathlib import Path

import bpy
import bmesh
import numpy as np
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[2]
V4 = ROOT / 'assets-fuente/generativo-63x48/ambientes-v4'
OUT = V4 / 'capas'
OUT.mkdir(parents=True, exist_ok=True)
STL = ROOT / 'assets-fuente/banos-ia/modelos-3d/lavamanos'
TIZIANO_OBJ = ROOT / 'assets-fuente/generativo-63x48/piloto-capas/modelos/tiziano-63x48.obj'
SODER = str(ROOT / 'public/images/muebles/vitelli-63/acabados/soder.webp')

_src = ROOT / 'scripts/modelos-3d/escena-v4.py'
esc = {'__file__': str(_src), '__name__': 'escena_v4'}
exec(compile(_src.read_text(encoding='utf-8-sig'), str(_src), 'exec'), esc)
lib = esc['lib']

args = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
fase = args[0] if args else 'muebles'
muestras = int(args[args.index('--muestras') + 1]) if '--muestras' in args else 128
prueba = '--prueba' in args
ENC = esc['leer_encuadre']()

# Anclaje unificado de lavamanos STL por geometrías reales de contacto (mueble <-> lavamanos <-> grifo).
ARRIBA = {'siena': 'Z'}
BORDE = 0.003
GRIFO_Y_SIN_PERFORACION = -0.036
BASIN_IDS = ['oslo', 'genova', 'bari', 'siena', 'trentino', 'quadratto']
# Límites de carcasa en planta donde ambos muebles (Vitelli y Tiziano) alojan la poceta sin fugas.
POCETA_LIMITES_M = {'x_min': -0.312, 'x_max': 0.312, 'y_min': -0.472, 'y_max': 0.0}


def kind(o):
    if o.name.startswith(('Lavamanos_', 'Grifo_')):
        return 'lavamanos'
    if o.name.startswith(('Carcasa_', 'Puerta_', 'CajonSuperior_', 'CajonInferior_', 'Bisagras_')):
        return 'mueble'
    return 'otro'


def abrir(ambiente):
    bpy.ops.wm.open_mainfile(filepath=str(V4 / f'greybox-{ambiente}.blend'))
    s = bpy.context.scene
    pref = bpy.context.preferences.addons['cycles'].preferences
    pref.compute_device_type = 'HIP'
    pref.refresh_devices()
    for d in pref.devices:
        d.use = d.type != 'CPU'
    s.cycles.device = 'GPU'
    s.cycles.samples = 16 if prueba else muestras
    s.render.film_transparent = True
    s.render.image_settings.color_mode = 'RGBA'
    s.render.resolution_percentage = 50 if prueba else 100
    esc['acentos'](False)
    for o in bpy.data.objects:
        if o.get('decoracion') or o.get('junta_piso'):
            o.hide_render = True
    return s


def preparar_producto():
    """Escena de capas de producto: cuarto proyectado (invisible a cámara) y cámara de producto."""
    s = abrir('moderno')
    esc['camara_ambiente'](s)
    proy = s.camera.copy()
    proy.data = s.camera.data.copy()
    s.collection.objects.link(proy)
    lib['proyectar_fondo'](str(V4 / 'placa-moderno.png'), proy, .8)
    for o in bpy.data.objects:
        if o.type == 'MESH':
            o.visible_camera = False  # cuarto, ventana: solo luz, reflejo y rebote
    esc['camara_producto'](s, ENC)
    return s


def cargar(lavamanos='oslo'):
    objs = lib['cargar_producto'](lavamanos, SODER)
    for o in objs:
        o.visible_camera = True
    return objs


def render(s, nombre):
    s.render.filepath = str(OUT / nombre)
    bpy.ops.render.render(write_still=True)
    print('CAPA', nombre, flush=True)


def vertices(objs):
    pts = []
    for o in objs:
        m = np.array([list(r) for r in o.matrix_world])
        v = np.empty(len(o.data.vertices) * 3)
        o.data.vertices.foreach_get('co', v)
        pts.append(v.reshape(-1, 3) @ m[:3, :3].T + m[:3, 3])
    return np.concatenate(pts)


def anclas(pts):
    mn, mx = pts.min(0), pts.max(0)
    cx = (mn[0] + mx[0]) / 2
    lateral = np.abs(pts[:, 0] - cx) > (mx[0] - mn[0]) / 2 - BORDE
    borde_izq = pts[pts[:, 0] < mn[0] + BORDE, 2].min()
    borde_der = pts[pts[:, 0] > mx[0] - BORDE, 2].min()
    borde_atr = pts[pts[:, 1] > mx[1] - BORDE, 2].min()
    borde_fre = pts[pts[:, 1] < mn[1] + BORDE, 2].min()
    return {
        'cx': float(cx), 'atras': float(mx[1]), 'apoyo': float(pts[lateral, 2].min()),
        'cubierta': float(mx[2]), 'dims_mm': [round(float(d) * 1000, 1) for d in mx - mn],
        'faldon_z_lados': [float(borde_izq), float(borde_der), float(borde_atr), float(borde_fre)],
    }


def importar_stl(lid):
    antes = set(bpy.data.objects)
    up = ARRIBA.get(lid, 'Y')
    bpy.ops.wm.stl_import(filepath=str(STL / f'{lid}-63x48.stl'), global_scale=0.001,
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


def importar_tiziano():
    """OBJ de ingeniería en cm, Z arriba; misma transformación que render-tiziano-capas.py."""
    vertices_, groups, group = [], {}, None
    for line in TIZIANO_OBJ.read_text().splitlines():
        if line.startswith('v '):
            x, y, z = map(float, line.split()[1:4])
            vertices_.append(((x - 31.289298) * .01, (y - 39.55) * .01, (z + 37.139298) * .01 + .48))
        elif line.startswith(('g ', 'o ')):
            group = line[2:]
            groups.setdefault(group, [])
        elif line.startswith('f '):
            groups[group].append(tuple(int(v.split('/')[0]) - 1 for v in line.split()[1:]))
    material = lib['material_acabado'](SODER)
    objects = []
    for name, faces in groups.items():
        if not faces:
            continue
        used = sorted({i for f in faces for i in f})
        remap = {v: i for i, v in enumerate(used)}
        mesh = bpy.data.meshes.new(name)
        mesh.from_pydata([vertices_[i] for i in used], [], [tuple(remap[i] for i in f) for f in faces])
        mesh.update()
        bm = bmesh.new()
        bm.from_mesh(mesh)
        bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
        bm.to_mesh(mesh)
        bm.free()
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


def marco_contacto_mueble(objs):
    """Mide el plano superior real de contacto de la carcasa del mueble (cx, atras, tope)."""
    carcasa = [o for o in objs if o.name.startswith('Carcasa_') and not o.hide_render]
    pts = vertices(carcasa)
    mn, mx = pts.min(0), pts.max(0)
    return {'cx': float((mn[0] + mx[0]) / 2), 'atras': float(mx[1]), 'tope': float(mx[2])}


def _raycast_z(objs, x, y):
    zs = []
    for o in objs:
        inv = o.matrix_world.inverted()
        hit, loc, _, _ = o.ray_cast(inv @ Vector((float(x), float(y), 1.0)),
                                    inv.to_3x3() @ Vector((0.0, 0.0, -1.0)))
        if hit:
            zs.append(float((o.matrix_world @ loc).z))
    return max(zs) if zs else None


def detectar_perforacion_grifo(stl_objs, cx_ref):
    """Detecta por raycast vertical si el lavamanos tiene perforación de grifería y devuelve su centro."""
    misses = []
    for x in np.arange(cx_ref - 0.035, cx_ref + 0.036, 0.001):
        for y in np.arange(-0.105, -0.015, 0.001):
            if _raycast_z(stl_objs, x, y) is None:
                misses.append((float(x), float(y)))
    if not (100 <= len(misses) <= 1500):
        return None
    m = np.array(misses)
    hx = float((m[:, 0].min() + m[:, 0].max()) / 2)
    hy = float((m[:, 1].min() + m[:, 1].max()) / 2)
    # Confirmar que hay cubierta sólida delante y detrás del hueco (no es el borde abierto del frente).
    if _raycast_z(stl_objs, hx, m[:, 1].min() - 0.005) is None or _raycast_z(stl_objs, hx, m[:, 1].max() + 0.005) is None:
        return None
    return {'cx': hx, 'cy': hy, 'diametro_mm': round(float(max(m[:, 0].max() - m[:, 0].min(), m[:, 1].max() - m[:, 1].min())) * 1000, 1)}


def asentar_grifo(grifo, stl_objs, cx_ref):
    """Centra la grifería en la perforación (o repisa trasera) y la asienta a ras de la cubierta."""
    g_pts = vertices(grifo)
    g_z0 = float(g_pts[:, 2].min())
    g_base = g_pts[g_pts[:, 2] < g_z0 + 0.002]
    g_cx = float((g_base[:, 0].min() + g_base[:, 0].max()) / 2)
    g_cy = float((g_base[:, 1].min() + g_base[:, 1].max()) / 2)
    g_r = float((g_base[:, 0].max() - g_base[:, 0].min()) / 2)

    hole = detectar_perforacion_grifo(stl_objs, cx_ref)
    target_cx = hole['cx'] if hole else cx_ref
    target_cy = hole['cy'] if hole else GRIFO_Y_SIN_PERFORACION

    anillo_zs = []
    for ang in np.linspace(0, 2 * np.pi, 16, endpoint=False):
        for frac in (0.85, 1.0):
            z = _raycast_z(stl_objs, target_cx + np.cos(ang) * g_r * frac, target_cy + np.sin(ang) * g_r * frac)
            if z is not None:
                anillo_zs.append(z)
    assert len(anillo_zs) >= 24, f'Base del grifo sin apoyo completo en cubierta ({len(anillo_zs)}/32)'
    deck_z = float(np.median(anillo_zs))

    delta_g = Vector((target_cx - g_cx, target_cy - g_cy, deck_z - g_z0))
    for o in grifo:
        o.location += delta_g
    bpy.context.view_layer.update()
    return {
        'grifo_xy_mm': [round(target_cx * 1000, 2), round(target_cy * 1000, 2)],
        'grifo_deck_z_mm': round(deck_z * 1000, 2),
        'grifo_dz_mm': round(float(delta_g.z) * 1000, 2),
        'grifo_dy_mm': round(float(delta_g.y) * 1000, 2),
        'perforacion': hole,
    }


def lavamanos_stl(objs, lid, ref_cab=None):
    """Importa el STL de ingeniería, lo ancla al plano de contacto del mueble y asienta el grifo."""
    oslo = [o for o in objs if o.name.startswith('Lavamanos_') and 'oslo' in o.name.lower() and not o.hide_render]
    grifo = [o for o in objs if o.name.startswith('Grifo_') and not o.hide_render]
    if ref_cab is None:
        ref_cab = marco_contacto_mueble(objs)
    for o in oslo:
        o.hide_render = True
    esmalte = lib['principled']('LavamanosEsmalteSTL', (0.91, 0.91, 0.91), 0.04, capa=1.0)
    stl = importar_stl(lid)
    a = anclas(vertices(stl))
    assert max(a['faldon_z_lados']) - min(a['faldon_z_lados']) <= 0.0005, (lid, a['faldon_z_lados'])
    delta = Vector((ref_cab['cx'] - a['cx'], ref_cab['atras'] - a['atras'], ref_cab['tope'] - a['apoyo']))
    for o in stl:
        o.location += delta
        o.data.materials.clear()
        o.data.materials.append(esmalte)
    bpy.context.view_layer.update()
    pts_anclados = vertices(stl)
    a2 = anclas(pts_anclados)
    assert abs(a2['cx'] - ref_cab['cx']) < 1e-4, (lid, a2['cx'], ref_cab['cx'])
    assert abs(a2['atras'] - ref_cab['atras']) < 1e-4, (lid, a2['atras'], ref_cab['atras'])
    assert abs(a2['apoyo'] - ref_cab['tope']) < 1e-4, (lid, a2['apoyo'], ref_cab['tope'])
    poceta = pts_anclados[pts_anclados[:, 2] < ref_cab['tope'] - 0.0005]
    if len(poceta):
        assert poceta[:, 0].min() >= POCETA_LIMITES_M['x_min'] and poceta[:, 0].max() <= POCETA_LIMITES_M['x_max'], lid
        assert poceta[:, 1].min() >= POCETA_LIMITES_M['y_min'] and poceta[:, 1].max() <= POCETA_LIMITES_M['y_max'], lid
    info_grifo = asentar_grifo(grifo, stl, ref_cab['cx'])
    return stl, {
        'archivo': f'{lid}-63x48.stl',
        'dims_mm': a['dims_mm'],
        'traslacion_m': [round(float(d), 5) for d in delta],
        'contacto_mueble': {'cx_mm': round(a2['cx'] * 1000, 2), 'atras_mm': round(a2['atras'] * 1000, 2),
                            'apoyo_mm': round(a2['apoyo'] * 1000, 2)},
        **info_grifo,
    }


def fase_muebles():
    s = preparar_producto()
    objs = cargar('oslo')
    for o in objs:
        if kind(o) != 'mueble':
            o.hide_render = True
    render(s, 'vitelli-soder-cerrado.png')
    for o in objs:
        o.hide_render = True
    importar_tiziano()
    render(s, 'tiziano-soder-cerrado.png')


def fase_lavamanos():
    info = {}
    # Verificar que Vitelli y Tiziano comparten el mismo plano superior de contacto.
    preparar_producto()
    objs_v = cargar('oslo')
    marco_v = marco_contacto_mueble(objs_v)
    tiz = importar_tiziano()
    t_pts = vertices(tiz)
    marco_t = {'cx': float((t_pts[:, 0].min() + t_pts[:, 0].max()) / 2),
               'atras': float(t_pts[:, 1].max()), 'tope': float(t_pts[:, 2].max())}
    assert abs(marco_v['cx'] - marco_t['cx']) <= 0.0005, (marco_v, marco_t)
    assert abs(marco_v['atras'] - marco_t['atras']) <= 0.0005, (marco_v, marco_t)
    assert abs(marco_v['tope'] - marco_t['tope']) <= 0.0005, (marco_v, marco_t)

    for lid in BASIN_IDS:
        s = preparar_producto()
        objs = cargar('oslo')
        for o in objs:
            if kind(o) == 'mueble':
                o.is_holdout = True  # el mueble tapa la parte del lavamanos que queda dentro
        _, info[lid] = lavamanos_stl(objs, lid)
        render(s, f'lavamanos-{lid}.png')
    (OUT / 'fuente-lavamanos-v4.json').write_text(json.dumps(info, indent=2, ensure_ascii=False), encoding='utf-8')


def fase_sombras():
    # --solo calido:vacio limita a una pasada (para repetir una sola sin rehacer las demás)
    solo = args[args.index('--solo') + 1] if '--solo' in args else None
    for amb in esc['AMBIENTES']:
        for mueble in ['vitelli', 'tiziano', 'vacio']:
            if solo and solo != f'{amb}:{mueble}':
                continue
            s = abrir(amb)
            esc['camara_ambiente'](s)
            if mueble == 'vitelli':
                objs = cargar('oslo')
                for o in objs:
                    if kind(o) != 'mueble':
                        o.hide_render = True
            elif mueble == 'tiziano':
                objs = importar_tiziano()
            else:
                objs = []
            receptor = lib['principled']('ReceptorSombraV4', (.8, .8, .8), .9)
            for o in bpy.data.objects:
                if esc['es_cuarto'](o):
                    o.data.materials.clear()
                    o.data.materials.append(receptor)
                    o.visible_camera = o.visible_shadow = True
                    o.is_shadow_catcher = True
                elif o.type == 'MESH':
                    o.visible_camera = False
            s.cycles.samples = 16 if prueba else 256
            # Solo luz directa (sol y cielo por las ventanas): en el cuarto cerrado el mueble también
            # bloquea luz rebotada y el catcher oscurecía ~12 % TODO el lienzo; eso ya está en la placa.
            s.cycles.max_bounces = 0
            render(s, f'sombra-{amb}-{mueble}.png')


def fase_escena():
    """Producto completo dentro del cuarto, cámara de AMBIENTE (1800x1200), solo alfa del producto."""
    casos = [('vitelli', 'oslo'), ('vitelli', 'genova'), ('tiziano', 'genova'),
             ('tiziano', 'quadratto'), ('vitelli', 'siena')]
    for mueble, lid in casos:
        s = preparar_producto()
        esc['camara_ambiente'](s)
        objs = cargar('oslo')
        lavamanos_stl(objs, lid)
        if mueble == 'tiziano':
            for o in objs:
                if kind(o) == 'mueble':
                    o.hide_render = True
            importar_tiziano()
        render(s, f'escena-{mueble}-{lid}.png')


{'muebles': fase_muebles, 'lavamanos': fase_lavamanos, 'sombras': fase_sombras, 'escena': fase_escena}[fase]()
print('CAPAS_V4_OK', fase, flush=True)
