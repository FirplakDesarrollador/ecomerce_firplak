"""Capas v4 del Mix & Match (Opción D), dirigidas por el registro del catálogo.

blender -b -P scripts/modelos-3d/render-capas-v4.py -- [fase] [--forzar] [--prueba] [--muestras 160] [--solo id]
  faltantes   (por defecto) todas las fases, solo las capas que faltan o cuyas entradas cambiaron
  muebles     <mueble>-<acabado>-<estado>.png por cada mueble × acabado × estado del registro
  lavamanos   lavamanos-<id>.png: STL anclado por contacto geométrico sobre la tapa del grupo de corte,
              con grifería asentada en su perforación
  sombras     sombra-<amb>-<mueble>.png y sombra-<amb>-vacio.png en el lienzo completo, por ambiente
              (solo luz directa)
  escena      escena-<mueble>-<lavamanos>.png: producto DENTRO del cuarto con la cámara del ambiente
              (alfa), casos de `publicacion.casos_contorno`, para el control de contorno al píxel
  --forzar    re-renderiza aunque la huella no haya cambiado
  --prueba    16 muestras al 50 % en capas/prueba/ (no toca capas ni huellas)
  --solo id   limita la fase a un id (mueble, lavamanos, `amb:mueble` en sombras o `mueble-lavamanos`)

Fuente de verdad: scripts/mix-match/catalogo-mix-match.json. Cada capa guarda en capas/huellas.json una
huella de sus entradas (entrada del registro, archivos fuente, escena, placa de reflejos y RENDER_VERSION);
si la huella coincide y el PNG existe, no se vuelve a renderizar.

Todo sale de render PBR desde CAD/GLB/OBJ/STL: sin IA, sin pulido, sin alterar geometría.
- Escena: greybox del ambiente de reflejos (registro `escena.ambiente_reflejos`). Las capas de producto se
  renderizan UNA vez y sirven a todos los ambientes (mismo cuarto, ventana, sol y cielo); decoración y luces
  de acento apagadas; la placa de ese ambiente va proyectada en el cuarto para reflejos y rebote.
- Cámara de producto: misma posición y rotación que el ambiente, lente/shift de encuadre-v4.json.
- Sombras: shadow catcher sobre el cuarto de CADA ambiente, en el lienzo completo, con pasada sin
  producto (vacio) para aislar la contribución del mueble.
"""
import hashlib
import json
import sys
from pathlib import Path

import bpy
import bmesh
import numpy as np
from mathutils import Vector

RENDER_VERSION = 'v4.2-registro'  # subir si cambia la lógica de render: invalida todas las huellas

ROOT = Path(__file__).resolve().parents[2]
CATALOGO = json.loads((ROOT / 'scripts/mix-match/catalogo-mix-match.json').read_text(encoding='utf-8'))
V4 = ROOT / CATALOGO['escena']['carpeta']

_src = ROOT / 'scripts/modelos-3d/escena-v4.py'
esc = {'__file__': str(_src), '__name__': 'escena_v4'}
exec(compile(_src.read_text(encoding='utf-8-sig'), str(_src), 'exec'), esc)
lib = esc['lib']

args = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
fase = args[0] if args and not args[0].startswith('--') else 'faltantes'
muestras = int(args[args.index('--muestras') + 1]) if '--muestras' in args else 160
prueba = '--prueba' in args
forzar = '--forzar' in args
solo = args[args.index('--solo') + 1] if '--solo' in args else None
ENC = esc['leer_encuadre']()

OUT = V4 / 'capas' / ('prueba' if prueba else '')
OUT.mkdir(parents=True, exist_ok=True)
HUELLAS = V4 / 'capas' / 'huellas.json'
huellas = {} if prueba or not HUELLAS.exists() else json.loads(HUELLAS.read_text(encoding='utf-8'))

AMBIENTES = [a['id'] for a in CATALOGO['ambientes']]
AMB_REFLEJOS = CATALOGO['escena']['ambiente_reflejos']
ACABADOS = CATALOGO['acabados']
MUEBLES = {m['id']: m for m in CATALOGO['muebles']}
LAVAMANOS = {l['id']: l for l in CATALOGO['lavamanos']}
GRUPOS = CATALOGO['grupos_corte']
GLB_VITELLI = 'public/models/muebles/vitelli-63.glb'

# Anclaje unificado de lavamanos STL por geometrías reales de contacto (mueble <-> lavamanos <-> grifo).
BORDE = 0.003
GRIFO_Y_SIN_PERFORACION = -0.036
# Límites de carcasa en planta donde los muebles del grupo tapa-48 alojan la poceta sin fugas.
POCETA_LIMITES_M = {'x_min': -0.312, 'x_max': 0.312, 'y_min': -0.472, 'y_max': 0.0}

assert len(GRUPOS) == 1, ('Un segundo grupo de corte exige capas de lavamanos por grupo en el manifiesto '
                          'y en la web; hoy hay un solo grupo.')
GRUPO_ID, GRUPO = next(iter(GRUPOS.items()))
for _m in MUEBLES.values():
    assert _m['grupo_corte'] == GRUPO_ID, _m['id']
    assert _m['estados'] == ['cerrado'], f"{_m['id']}: solo hay capas del estado cerrado"
    for _a in _m['acabados']:
        assert _a in ACABADOS, (_m['id'], _a)


# ---- Huellas: renderizar solo lo que falta o cambió ----------------------------------------------
_sha = {}


def sha_archivo(rel):
    if rel not in _sha:
        _sha[rel] = hashlib.sha256((ROOT / rel).read_bytes()).hexdigest()
    return _sha[rel]


def huella(**partes):
    base = {'render': RENDER_VERSION, 'muestras': 16 if prueba else muestras,
            'encuadre': sha_archivo(f"{CATALOGO['escena']['carpeta']}/{CATALOGO['escena']['encuadre']}"),
            'script_escena': sha_archivo('scripts/modelos-3d/escena-v4.py'), **partes}
    return hashlib.sha256(json.dumps(base, sort_keys=True, ensure_ascii=False).encode()).hexdigest()


def pendiente(nombre, h):
    if prueba or forzar:
        return True
    return huellas.get(nombre) != h or not (OUT / nombre).exists()


def guardar_huella(nombre, h):
    if prueba:
        return
    huellas[nombre] = h
    HUELLAS.write_text(json.dumps(huellas, indent=2, sort_keys=True), encoding='utf-8')


def entradas_mueble(mid, acabado=None):
    m = MUEBLES[mid]
    d = {'mueble': m, 'fuente_sha': sha_archivo(m['fuente']['archivo'])}
    if acabado:
        d['acabado'] = ACABADOS[acabado]
        d['textura_sha'] = sha_archivo(ACABADOS[acabado]['textura'])
    return d


def entradas_producto():
    """Escena de las capas de producto: greybox y placa del ambiente de reflejos."""
    amb = next(a for a in CATALOGO['ambientes'] if a['id'] == AMB_REFLEJOS)
    carpeta = CATALOGO['escena']['carpeta']
    return {'greybox': sha_archivo(f'{carpeta}/greybox-{AMB_REFLEJOS}.blend'),
            'placa': sha_archivo(f"{carpeta}/{amb['placa']}")}


def entradas_lavamanos(lid):
    corte = GRUPO['mueble_corte']
    return {'lavamanos': LAVAMANOS[lid], 'stl_sha': sha_archivo(LAVAMANOS[lid]['fuente']['archivo']),
            'griferia': CATALOGO['griferia'], 'griferia_sha': sha_archivo(CATALOGO['griferia']['fuente']),
            'grupo': GRUPO, 'corte': entradas_mueble(corte)}


# ---- Escena ----------------------------------------------------------------------------------------
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
    s = abrir(AMB_REFLEJOS)
    esc['camara_ambiente'](s)
    proy = s.camera.copy()
    proy.data = s.camera.data.copy()
    s.collection.objects.link(proy)
    amb = next(a for a in CATALOGO['ambientes'] if a['id'] == AMB_REFLEJOS)
    lib['proyectar_fondo'](str(V4 / amb['placa']), proy, .8)
    for o in bpy.data.objects:
        if o.type == 'MESH':
            o.visible_camera = False  # cuarto, ventana: solo luz, reflejo y rebote
    esc['camara_producto'](s, ENC)
    return s


def aplicar_ajuste_acabado(material, acabado):
    """Ajuste PBR opcional por acabado: color lineal (gamma + RGB), mapa de roughness y bump por veta."""
    ajuste = ACABADOS.get(acabado, {}).get('ajuste_color')
    if not ajuste or not material or not material.node_tree:
        return material
    nt = material.node_tree
    bsdf = nt.nodes.get('Principled BSDF')
    tex = next((n for n in nt.nodes if n.type == 'TEX_IMAGE'), None)
    if not bsdf or not tex:
        return material
    prev = tex.outputs['Color']
    if 'gamma' in ajuste:
        g = nt.nodes.new('ShaderNodeGamma')
        g.inputs['Gamma'].default_value = float(ajuste['gamma'])
        nt.links.new(prev, g.inputs['Color'])
        prev = g.outputs['Color']
    if 'rgb_mult' in ajuste:
        mul = nt.nodes.new('ShaderNodeVectorMath')
        mul.operation = 'MULTIPLY'
        mul.inputs[1].default_value = tuple(float(v) for v in ajuste['rgb_mult'])
        nt.links.new(prev, mul.inputs[0])
        prev = mul.outputs['Vector']
    for lk in list(bsdf.inputs['Base Color'].links):
        nt.links.remove(lk)
    nt.links.new(prev, bsdf.inputs['Base Color'])

    if 'roughness_veta' in ajuste or 'bump_fuerza' in ajuste:
        bw = nt.nodes.new('ShaderNodeRGBToBW')
        nt.links.new(tex.outputs['Color'], bw.inputs['Color'])
        if 'roughness_veta' in ajuste:
            r_min, r_max = ajuste['roughness_veta']
            mr = nt.nodes.new('ShaderNodeMapRange')
            mr.clamp = True
            mr.inputs['From Min'].default_value = 0.05
            mr.inputs['From Max'].default_value = 0.30
            mr.inputs['To Min'].default_value = float(r_max)   # poro oscuro = más mate
            mr.inputs['To Max'].default_value = float(r_min)   # veta lisa = más satinada
            nt.links.new(bw.outputs['Val'], mr.inputs['Value'])
            nt.links.new(mr.outputs['Result'], bsdf.inputs['Roughness'])
        if 'bump_fuerza' in ajuste:
            bump = nt.nodes.new('ShaderNodeBump')
            bump.inputs['Strength'].default_value = float(ajuste['bump_fuerza'])
            bump.inputs['Distance'].default_value = 0.0018
            nt.links.new(bw.outputs['Val'], bump.inputs['Height'])
            nt.links.new(bump.outputs['Normal'], bsdf.inputs['Normal'])
    if 'coat' in ajuste:
        bsdf.inputs['Coat Weight'].default_value = float(ajuste['coat'])
        bsdf.inputs['Coat Roughness'].default_value = 0.28
    return material


def cargar_glb(acabado='soder'):
    """GLB del Vitelli: aporta la carcasa del grupo de corte y la grifería."""
    objs = lib['cargar_producto']('oslo', str(ROOT / ACABADOS[acabado]['textura']))
    aplicar_ajuste_acabado(bpy.data.materials.get('AcabadoMadera'), acabado)
    for o in objs:
        o.visible_camera = True
    return objs


def render(s, nombre, h):
    s.render.filepath = str(OUT / nombre)
    bpy.ops.render.render(write_still=True)
    guardar_huella(nombre, h)
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


def importar_stl(fuente, suavizar=True):
    antes = set(bpy.data.objects)
    up = fuente.get('arriba', 'Y')
    bpy.ops.wm.stl_import(filepath=str(ROOT / fuente['archivo']), global_scale=fuente.get('escala', 0.001),
                          up_axis=up, forward_axis='Y' if up == 'Z' else 'NEGATIVE_Z')
    nuevos = [o for o in bpy.data.objects if o not in antes and o.type == 'MESH']
    for o in nuevos:
        bm = bmesh.new()
        bm.from_mesh(o.data)
        bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
        bm.to_mesh(o.data)
        bm.free()
        if suavizar:
            bpy.ops.object.select_all(action='DESELECT')
            bpy.context.view_layer.objects.active = o
            o.select_set(True)
            bpy.ops.object.shade_auto_smooth(angle=0.5236)
    return nuevos


def uv_planas(mesh):
    """UV físicas en metros (repetición de 0,7 m del material), por eje dominante de cada cara."""
    uv = mesh.uv_layers.get('UVMap') or mesh.uv_layers.new(name='UVMap')
    for polygon in mesh.polygons:
        axis = max(range(3), key=lambda i: abs(polygon.normal[i]))
        for i in polygon.loop_indices:
            x, y, z = mesh.vertices[mesh.loops[i].vertex_index].co
            uv.data[i].uv = ((-y if axis == 0 else x), (y if axis == 2 else z))


def importar_obj(m, textura, acabado=None):
    """OBJ de ingeniería (p. ej., Tiziano en cm, Z arriba) con la transformación registrada."""
    f = m['fuente']
    t, esc_, z_extra = f['traslacion_origen'], f['escala'], f.get('z_extra_m', 0)
    vertices_, groups, group = [], {}, None
    for line in (ROOT / f['archivo']).read_text().splitlines():
        if line.startswith('v '):
            x, y, z = map(float, line.split()[1:4])
            vertices_.append(((x + t[0]) * esc_, (y + t[1]) * esc_, (z + t[2]) * esc_ + z_extra))
        elif line.startswith(('g ', 'o ')):
            group = line[2:]
            groups.setdefault(group, [])
        elif line.startswith('f '):
            groups[group].append(tuple(int(v.split('/')[0]) - 1 for v in line.split()[1:]))
    material = aplicar_ajuste_acabado(lib['material_acabado'](textura), acabado)
    objects = []
    for name, faces in groups.items():
        if not faces:
            continue
        used = sorted({i for fc in faces for i in fc})
        remap = {v: i for i, v in enumerate(used)}
        mesh = bpy.data.meshes.new(name)
        mesh.from_pydata([vertices_[i] for i in used], [], [tuple(remap[i] for i in fc) for fc in faces])
        mesh.update()
        bm = bmesh.new()
        bm.from_mesh(mesh)
        bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
        bm.to_mesh(mesh)
        bm.free()
        uv_planas(mesh)
        obj = bpy.data.objects.new(f"{m['id'].title()}_" + name.replace(':', '_'), mesh)
        bpy.context.collection.objects.link(obj)
        mesh.materials.append(material)
        objects.append(obj)
    return objects


def marco_contacto(objs):
    """Plano superior real de contacto de una carcasa (cx, atras, tope)."""
    pts = vertices(objs)
    mn, mx = pts.min(0), pts.max(0)
    return {'cx': float((mn[0] + mx[0]) / 2), 'atras': float(mx[1]), 'tope': float(mx[2])}


def importar_mueble(mid, acabado, glb=None):
    """Objetos visibles del mueble. `glb` son los objetos del GLB ya cargado (grifería y carcasa de corte)."""
    m = MUEBLES[mid]
    tipo = m['fuente']['tipo']
    textura = str(ROOT / ACABADOS[acabado]['textura'])
    if tipo == 'glb_vitelli':
        assert m['fuente']['archivo'] == GLB_VITELLI, 'glb_vitelli solo admite el GLB del Vitelli'
        if glb is None:  # quien llama carga el GLB con el acabado que necesita
            glb = cargar_glb(acabado)
        for o in glb:
            if kind(o) == 'mueble':
                o.hide_render = o.name.startswith('Bisagras') or o.hide_render
        return [o for o in glb if kind(o) == 'mueble' and not o.hide_render]
    if tipo == 'obj':
        return importar_obj(m, textura, acabado)
    if tipo == 'stl':
        # Mueble nuevo en STL (Fusion, mm): se ancla al plano de contacto del grupo de corte
        # (centro X, espalda contra la pared y tapa a la altura del grupo). Sin probar aún con un mueble real.
        corte = [o for o in (glb or cargar_glb()) if o.name.startswith('Carcasa_') and not o.hide_render]
        ref = marco_contacto(corte)
        objs = importar_stl(m['fuente'], suavizar=False)
        pts = vertices(objs)
        mn, mx = pts.min(0), pts.max(0)
        delta = Vector((ref['cx'] - (mn[0] + mx[0]) / 2, ref['atras'] - mx[1], ref['tope'] - mx[2]))
        material = aplicar_ajuste_acabado(lib['material_acabado'](textura), acabado)
        for o in objs:
            o.location += delta
            o.data.materials.clear()
            o.data.materials.append(material)
            uv_planas(o.data)
        bpy.context.view_layer.update()
        return objs
    raise ValueError(f'{mid}: tipo de fuente no soportado: {tipo}')


# ---- Grifería y lavamanos -------------------------------------------------------------------------
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
    oslo_glb = [o for o in objs if o.name.startswith('Lavamanos_') and not o.hide_render]
    grifo = [o for o in objs if o.name.startswith('Grifo_') and not o.hide_render]
    if ref_cab is None:
        ref_cab = marco_contacto([o for o in objs if o.name.startswith('Carcasa_') and not o.hide_render])
    for o in oslo_glb:
        o.hide_render = True  # el lavamanos del GLB no se usa: la geometría sale del STL
    esmalte = lib['principled']('LavamanosEsmalteSTL', (0.91, 0.91, 0.91), 0.04, capa=1.0)
    stl = importar_stl(LAVAMANOS[lid]['fuente'])
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
        'archivo': Path(LAVAMANOS[lid]['fuente']['archivo']).name,
        'dims_mm': a['dims_mm'],
        'traslacion_m': [round(float(d), 5) for d in delta],
        'contacto_mueble': {'cx_mm': round(a2['cx'] * 1000, 2), 'atras_mm': round(a2['atras'] * 1000, 2),
                            'apoyo_mm': round(a2['apoyo'] * 1000, 2)},
        **info_grifo,
    }


def aplica(*ids):
    return solo is None or solo in ids


# ---- Fases ----------------------------------------------------------------------------------------
def fase_muebles():
    for mid, m in MUEBLES.items():
        for acabado in m['acabados']:
            for estado in m['estados']:
                nombre = f'{mid}-{acabado}-{estado}.png'
                h = huella(capa='mueble', estado=estado, producto=entradas_producto(), **entradas_mueble(mid, acabado))
                if not aplica(mid) or not pendiente(nombre, h):
                    continue
                s = preparar_producto()
                glb = cargar_glb(acabado if m['fuente']['tipo'] == 'glb_vitelli' else 'soder')
                visibles = importar_mueble(mid, acabado, glb)
                for o in bpy.data.objects:
                    if o.type == 'MESH' and o.visible_camera and o not in visibles:
                        o.hide_render = True
                render(s, nombre, h)


def comprobar_grupo():
    """Todos los muebles del grupo comparten plano de contacto con el mueble de corte (±0,5 mm)."""
    preparar_producto()
    glb = cargar_glb()
    ref = marco_contacto([o for o in glb if o.name.startswith('Carcasa_') and not o.hide_render])
    marcos = {}
    for mid in MUEBLES:
        if mid == GRUPO['mueble_corte']:
            continue
        objs = importar_mueble(mid, MUEBLES[mid]['acabados'][0], glb)
        marcos[mid] = marco_contacto(objs)
        for k in ('cx', 'atras', 'tope'):
            assert abs(marcos[mid][k] - ref[k]) <= 0.0005, (mid, k, marcos[mid][k], ref[k])
        for o in objs:
            o.hide_render = True
    return ref, marcos


def fase_lavamanos():
    ids = [lid for lid in LAVAMANOS if aplica(lid)]
    todo = {lid: (f'lavamanos-{lid}.png', huella(capa='lavamanos', producto=entradas_producto(),
                                                 **entradas_lavamanos(lid))) for lid in ids}
    faltan = [lid for lid, (n, h) in todo.items() if pendiente(n, h)]
    if not faltan:
        return
    comprobar_grupo()
    ruta_info = V4 / 'capas' / 'fuente-lavamanos-v4.json'
    info = json.loads(ruta_info.read_text(encoding='utf-8')) if ruta_info.exists() and not prueba else {}
    for lid in faltan:
        s = preparar_producto()
        objs = cargar_glb()
        for o in objs:
            if kind(o) == 'mueble':
                o.is_holdout = True  # el mueble de corte tapa la parte del lavamanos que queda dentro
        _, info[lid] = lavamanos_stl(objs, lid)
        render(s, *todo[lid])
    if not prueba:
        info = {lid: info[lid] for lid in LAVAMANOS if lid in info}
        ruta_info.write_text(json.dumps(info, indent=2, ensure_ascii=False), encoding='utf-8')


def fase_sombras():
    for amb in AMBIENTES:
        greybox = sha_archivo(f"{CATALOGO['escena']['carpeta']}/greybox-{amb}.blend")
        for mid in list(MUEBLES) + ['vacio']:
            nombre = f'sombra-{amb}-{mid}.png'
            # La sombra depende de la geometría del mueble, no de su acabado.
            partes = {} if mid == 'vacio' else entradas_mueble(mid)
            h = huella(capa='sombra', ambiente=amb, greybox=greybox, **partes)
            if not aplica(f'{amb}:{mid}') or not pendiente(nombre, h):
                continue
            s = abrir(amb)
            esc['camara_ambiente'](s)
            if mid != 'vacio':
                glb = cargar_glb() if MUEBLES[mid]['fuente']['tipo'] in ('glb_vitelli', 'stl') else None
                visibles = importar_mueble(mid, MUEBLES[mid]['acabados'][0], glb)
                for o in glb or []:
                    if o not in visibles:
                        o.hide_render = True
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
            render(s, nombre, h)


def fase_escena():
    """Producto completo dentro del cuarto, cámara de AMBIENTE (1800x1200), solo alfa del producto."""
    for mid, lid in CATALOGO['publicacion']['casos_contorno']:
        nombre = f'escena-{mid}-{lid}.png'
        acabado = MUEBLES[mid]['acabados'][0]
        h = huella(capa='escena', producto=entradas_producto(), mueble_e=entradas_mueble(mid, acabado),
                   lavamanos_e=entradas_lavamanos(lid))
        if not aplica(f'{mid}-{lid}') or not pendiente(nombre, h):
            continue
        s = preparar_producto()
        esc['camara_ambiente'](s)
        glb = cargar_glb()
        lavamanos_stl(glb, lid)
        if mid != GRUPO['mueble_corte']:
            for o in glb:
                if kind(o) == 'mueble':
                    o.hide_render = True
            importar_mueble(mid, acabado, glb)
        render(s, nombre, h)


FASES = {'muebles': fase_muebles, 'lavamanos': fase_lavamanos, 'sombras': fase_sombras, 'escena': fase_escena}
for nombre_fase in (FASES if fase == 'faltantes' else [fase]):
    FASES[nombre_fase]()
print('CAPAS_V4_OK', fase, flush=True)
