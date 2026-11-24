# Render en bulk de modelos 3D (OBJ, STL, GLB/GLTF, FBX, PLY) con estudio fijo.
#
# Todos los modelos de una carpeta salen con la MISMA camara (lente, angulo,
# distancia), la MISMA iluminacion, el MISMO material y el MISMO fondo, para que
# el catalogo se vea coherente. Cada modelo se centra, se apoya en el piso y
# (en modo "ajustar") se escala para ocupar el mismo espacio en cuadro.
#
# Uso (Blender sin interfaz):
#   blender -b -P scripts/modelos-3d/render-bulk.py -- <carpeta-entrada> <carpeta-salida> [config.json] [--forzar]
#
# - Sin config usa scripts/modelos-3d/render-bulk.config.json (si existe).
# - Salida: <carpeta-salida>/<modelo>_<vista>.png
# - Si un render ya existe se salta; --forzar los rehace todos.
#
# Regla del proyecto (bug 016): el producto siempre sale de este render real.
# Si luego se usa IA (Higgsfield) para ambientar, se compone sobre el render,
# nunca se publica un producto redibujado por IA.
import bpy
import json
import math
import os
import sys
import time

from mathutils import Vector

FORMATOS = {'.obj', '.stl', '.glb', '.gltf', '.fbx', '.ply'}

CONFIG_BASE = {
    # "ajustar": cada modelo se escala para llenar el cuadro igual (catalogo).
    # "escala_real": se respetan los tamanos reales; camara fija en metros.
    'encuadre': 'ajustar',
    'margen': 1.08,                 # >1 deja aire alrededor del modelo
    'distancia_camara_m': 4.0,      # solo escala_real
    'altura_objetivo_m': 0.5,       # solo escala_real: a que altura mira la camara
    'resolucion': [2000, 2000],
    'lente_mm': 70,                 # tele suave: poca deformacion de perspectiva
    'vistas': [
        {'nombre': '34', 'azimut': -35, 'elevacion': 18},
        {'nombre': 'frente', 'azimut': 0, 'elevacion': 8},
        {'nombre': 'lado', 'azimut': -90, 'elevacion': 8},
    ],
    # Unidades de origen -> metros, y ejes de cada formato.
    'importacion': {
        'stl': {'escala': 0.001, 'arriba': 'Z', 'adelante': 'Y'},
        'obj': {'escala': 1.0, 'arriba': 'Y', 'adelante': 'NEGATIVE_Z'},
        'ply': {'escala': 1.0, 'arriba': 'Z', 'adelante': 'Y'},
        'fbx': {'escala': 1.0},
        'gltf': {'escala': 1.0},
    },
    # "uniforme" reemplaza todos los materiales; "original" respeta .mtl/GLB.
    'material_modo': 'uniforme',
    # capa = esmalte transparente encima (ceramica: 1.0, rugosidad baja).
    'material': {'color': '#f2f0ec', 'rugosidad': 0.35, 'metalico': 0.0, 'capa': 0.0, 'capa_rugosidad': 0.03},
    # Look del perfil de color, p. ej. "AgX - Punchy" para mas contraste. "None" = neutro.
    'look': 'None',
    'suavizado_angulo': 30,         # grados; 0 = sin suavizar (facetado)
    # "transparente" o un color hex (p. ej. "#ffffff").
    'fondo': '#ffffff',
    'sombra_piso': True,
    'rebote_piso': True,
    'ambiente_degradado': False,  # true: ambiente tipo estudio para reflejos en materiales brillantes  # solo si sombra_piso es false: piso invisible que rebota luz
    'luces': {'principal': 1.0, 'relleno': 0.25, 'contra': 0.6, 'ambiente': 0.12, 'reflejo': 0.0},
    'exposicion': 0.0,
    # "AgX": luces suaves, aclara colores saturados. "Standard": color fiel al hex.
    'perfil_color': 'AgX',
    'motor': {'muestras': 128, 'gpu': True},
    # Ajustes por archivo (nombre sin extension): rotacion en grados y/o material.
    # {"lavamanos-x": {"rotacion": [0, 0, 90], "material": {"color": "#222222"}}}
    'por_archivo': {},
}


def log(*a):
    print('[render-bulk]', *a, flush=True)


def fusionar(base, extra):
    out = dict(base)
    for k, v in extra.items():
        out[k] = fusionar(base[k], v) if isinstance(v, dict) and isinstance(base.get(k), dict) else v
    return out


def hex_a_srgb(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))


def srgb_a_lineal(c):
    return tuple(x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c)


# ---------------------------------------------------------------- estudio fijo

def preparar_estudio(cfg):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    escena = bpy.context.scene
    r = escena.render
    r.engine = 'CYCLES'
    r.resolution_x, r.resolution_y = cfg['resolucion']
    r.resolution_percentage = 100
    r.film_transparent = True  # el fondo se compone despues (ver componer_fondo)
    ims = r.image_settings
    if hasattr(ims, 'media_type'):
        ims.media_type = 'IMAGE'
    ims.file_format = 'PNG'
    ims.color_mode = 'RGBA'
    ims.color_depth = '8'

    cy = escena.cycles
    cy.samples = cfg['motor']['muestras']
    cy.use_denoising = True
    cy.device = 'CPU'
    if cfg['motor']['gpu']:
        try:
            prefs = bpy.context.preferences.addons['cycles'].preferences
            for tipo in ('OPTIX', 'CUDA', 'HIP', 'ONEAPI', 'METAL'):
                try:
                    prefs.compute_device_type = tipo
                    prefs.refresh_devices()
                    gpus = [d for d in prefs.get_devices_for_type(tipo) if d.type != 'CPU']
                    if gpus:
                        for d in prefs.devices:
                            d.use = d in gpus
                        cy.device = 'GPU'
                        log('GPU:', tipo, ', '.join(d.name for d in gpus))
                        break
                except TypeError:
                    continue
        except Exception as e:  # sin GPU compatible: CPU
            log('GPU no disponible, se usa CPU:', e)

    vs = escena.view_settings
    try:
        vs.view_transform = cfg['perfil_color']
    except TypeError:
        log('perfil_color desconocido, se usa Standard:', cfg['perfil_color'])
        vs.view_transform = 'Standard'
    try:
        vs.look = cfg['look']
    except TypeError:
        log('look desconocido, se usa None:', cfg['look'])
        vs.look = 'None'
    # Las luces estan calibradas para AgX, que comprime las altas luces.
    # Standard recorta en 1.0: se compensa -2 EV (medido) para no quemar blancos.
    vs.exposure = cfg['exposicion'] + (-2.0 if vs.view_transform == 'Standard' else 0.0)

    # Ambiente uniforme: relleno suave, identico para todos los modelos.
    mundo = bpy.data.worlds.new('Estudio')
    mundo.use_nodes = True
    fondo = mundo.node_tree.nodes['Background']
    fondo.inputs['Color'].default_value = (1, 1, 1, 1)
    fondo.inputs['Strength'].default_value = cfg['luces']['ambiente']
    if cfg['ambiente_degradado']:
        # Cielo claro arriba y gris oscuro en el horizonte: es lo que reflejan
        # las superficies brillantes, y da degradados de reflejo en vez de un
        # brillo plano. No se ve en la imagen (el fondo se compone aparte).
        nt = mundo.node_tree
        coord = nt.nodes.new('ShaderNodeTexCoord')
        sep = nt.nodes.new('ShaderNodeSeparateXYZ')
        rampa = nt.nodes.new('ShaderNodeValToRGB')
        r = rampa.color_ramp
        r.elements[0].position, r.elements[0].color = 0.0, (0.03, 0.03, 0.03, 1)
        r.elements[1].position, r.elements[1].color = 0.6, (1, 1, 1, 1)
        nt.links.new(coord.outputs['Generated'], sep.inputs[0])
        nt.links.new(sep.outputs['Z'], rampa.inputs['Fac'])
        nt.links.new(rampa.outputs['Color'], fondo.inputs['Color'])
    escena.world = mundo

    # Rig que gira con cada vista: la luz cae igual sobre el modelo en todas.
    rig = bpy.data.objects.new('Rig', None)
    escena.collection.objects.link(rig)
    objetivo = bpy.data.objects.new('Objetivo', None)
    escena.collection.objects.link(objetivo)

    cam_data = bpy.data.cameras.new('Camara')
    cam_data.lens = cfg['lente_mm']
    cam_data.sensor_width = 36
    cam_data.clip_start = 0.01
    cam_data.clip_end = 1000
    cam = bpy.data.objects.new('Camara', cam_data)
    escena.collection.objects.link(cam)
    escena.camera = cam
    seguir = cam.constraints.new('TRACK_TO')
    seguir.target = objetivo
    seguir.track_axis = 'TRACK_NEGATIVE_Z'
    seguir.up_axis = 'UP_Y'

    luces = []
    # (nombre, azimut relativo a la camara, elevacion, potencia relativa, tamano)
    # elevacion None = la de la vista: la tarjeta de reflejo queda en el angulo
    # espejo de la camara y se refleja en las superficies planas.
    for nombre, az, el, pot, tam in (
        ('principal', -50, 55, cfg['luces']['principal'], 1.6),
        ('relleno', 65, 20, cfg['luces']['relleno'], 2.5),
        ('contra', 165, 55, cfg['luces']['contra'], 1.2),
        ('reflejo', 180, None, cfg['luces']['reflejo'], 3.0),
    ):
        if pot <= 0:
            continue
        ld = bpy.data.lights.new(nombre, 'AREA')
        ld.shape = 'DISK'
        # Solo la principal proyecta sombra: una sola sombra limpia en el piso.
        ld.use_shadow = nombre == 'principal'
        luz = bpy.data.objects.new(nombre, ld)
        if nombre == 'reflejo':
            # Softbox ancho que solo aparece en reflejos (no ilumina difuso).
            ld.shape = 'RECTANGLE'
            luz.visible_diffuse = False
            luz.visible_transmission = False
            luz.visible_volume_scatter = False
        escena.collection.objects.link(luz)
        luz.parent = rig
        c = luz.constraints.new('TRACK_TO')
        c.target = objetivo
        c.track_axis = 'TRACK_NEGATIVE_Z'
        c.up_axis = 'UP_Y'
        luces.append((luz, az, el, pot, tam))

    piso = None
    if cfg['sombra_piso']:
        bpy.ops.mesh.primitive_plane_add(size=1)
        piso = bpy.context.active_object
        piso.name = 'Piso'
        piso.is_shadow_catcher = True
    elif cfg['rebote_piso']:
        # Sin sombra visible, pero un piso blanco invisible a la camara sigue
        # rebotando luz: evita que las caras de abajo salgan casi negras.
        bpy.ops.mesh.primitive_plane_add(size=1)
        piso = bpy.context.active_object
        piso.name = 'Piso'
        piso.visible_camera = False
        piso.visible_shadow = False
        mat = bpy.data.materials.new('Rebote')
        mat.use_nodes = True
        bsdf = mat.node_tree.nodes['Principled BSDF']
        bsdf.inputs['Base Color'].default_value = (0.85, 0.85, 0.85, 1)
        bsdf.inputs['Roughness'].default_value = 1.0
        piso.data.materials.append(mat)

    return {'escena': escena, 'rig': rig, 'objetivo': objetivo, 'cam': cam, 'luces': luces, 'piso': piso}


def colocar_estudio(est, cfg, radio, centro_z, vista):
    """Camara y luces segun la vista. Con radio fijo, posiciones identicas."""
    w, h = cfg['resolucion']
    medio = math.atan(18 / cfg['lente_mm']) * (min(w, h) / max(w, h))
    if cfg['encuadre'] == 'ajustar':
        dist = radio * cfg['margen'] / math.sin(medio)
    else:
        dist = cfg['distancia_camara_m']
        centro_z = cfg['altura_objetivo_m']

    est['objetivo'].location = (0, 0, centro_z)
    az, el = math.radians(vista['azimut']), math.radians(vista['elevacion'])
    est['cam'].location = (dist * math.cos(el) * math.sin(az), -dist * math.cos(el) * math.cos(az),
                           centro_z + dist * math.sin(el))
    est['cam'].data.clip_end = dist * 20

    d_luz = dist * 0.9
    for luz, laz, lel, pot, tam in est['luces']:
        a, e = az + math.radians(laz), (el if lel is None else math.radians(lel))
        luz.location = (d_luz * math.cos(e) * math.sin(a), -d_luz * math.cos(e) * math.cos(a),
                        centro_z + d_luz * math.sin(e))
        luz.data.size = tam * dist * 0.35
        if luz.data.shape == 'RECTANGLE':
            luz.data.size_y = luz.data.size * 0.35
        # Potencia ~ distancia^2: misma luz percibida en cualquier escala.
        luz.data.energy = 40 * pot * d_luz ** 2

    if est['piso']:
        est['piso'].scale = (dist * 6, dist * 6, 1)


# ------------------------------------------------------------------- modelos

def importar(ruta, cfg, ajuste):
    ext = os.path.splitext(ruta)[1].lower()
    # Un archivo puede traer otros ejes que el resto (p. ej. Fusion mezcla Y y Z arriba).
    extra = ajuste.get('importacion', {})
    imp = {k: fusionar(v, extra) for k, v in cfg['importacion'].items()}
    antes = set(bpy.data.objects)
    if ext == '.obj':
        o = imp['obj']
        bpy.ops.wm.obj_import(filepath=ruta, global_scale=o['escala'], up_axis=o['arriba'],
                              forward_axis=o['adelante'])
    elif ext == '.stl':
        o = imp['stl']
        bpy.ops.wm.stl_import(filepath=ruta, global_scale=o['escala'], up_axis=o['arriba'],
                              forward_axis=o['adelante'])
    elif ext == '.ply':
        o = imp['ply']
        bpy.ops.wm.ply_import(filepath=ruta, global_scale=o['escala'], up_axis=o['arriba'],
                              forward_axis=o['adelante'])
    elif ext == '.fbx':
        bpy.ops.import_scene.fbx(filepath=ruta, global_scale=imp['fbx']['escala'])
    else:
        bpy.ops.import_scene.gltf(filepath=ruta)
        if imp['gltf']['escala'] != 1.0:
            for ob in set(bpy.data.objects) - antes:
                if ob.parent is None:
                    ob.scale = [s * imp['gltf']['escala'] for s in ob.scale]
    nuevos = [ob for ob in bpy.data.objects if ob not in antes]
    mallas = [ob for ob in nuevos if ob.type == 'MESH']
    # Camaras y luces que vengan dentro del archivo romperian la coherencia.
    for ob in nuevos:
        if ob.type in ('CAMERA', 'LIGHT'):
            bpy.data.objects.remove(ob, do_unlink=True)
    return [ob for ob in nuevos if ob.name in bpy.data.objects], mallas


def caja_mundo(mallas):
    bpy.context.view_layer.update()
    pts = [ob.matrix_world @ Vector(c) for ob in mallas for c in ob.bound_box]
    mn = Vector((min(p.x for p in pts), min(p.y for p in pts), min(p.z for p in pts)))
    mx = Vector((max(p.x for p in pts), max(p.y for p in pts), max(p.z for p in pts)))
    return mn, mx


def normalizar(objetos, mallas, cfg, ajuste):
    """Agrupa bajo un Empty, aplica rotacion del archivo, centra y apoya en z=0."""
    raiz = bpy.data.objects.new('Modelo', None)
    bpy.context.scene.collection.objects.link(raiz)
    for ob in objetos:
        if ob.parent is None:
            ob.parent = raiz
    rot = ajuste.get('rotacion')
    if rot:
        raiz.rotation_euler = [math.radians(g) for g in rot]

    mn, mx = caja_mundo(mallas)
    radio = (mx - mn).length / 2
    if cfg['encuadre'] == 'ajustar' and radio > 0:
        f = 1.0 / radio  # radio de la esfera envolvente = 1 m
        raiz.scale = (f, f, f)
        mn, mx = caja_mundo(mallas)
        radio = 1.0
    centro = (mn + mx) / 2
    raiz.location = (raiz.location.x - centro.x, raiz.location.y - centro.y, raiz.location.z - mn.z)
    alto = mx.z - mn.z
    return raiz, radio, alto / 2, (mx - mn)


def material_uniforme(nombre, m):
    mat = bpy.data.materials.new(nombre)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes['Principled BSDF']
    bsdf.inputs['Base Color'].default_value = (*srgb_a_lineal(hex_a_srgb(m['color'])), 1)
    bsdf.inputs['Roughness'].default_value = m['rugosidad']
    bsdf.inputs['Metallic'].default_value = m['metalico']
    if m.get('capa'):
        bsdf.inputs['Coat Weight'].default_value = m['capa']
        bsdf.inputs['Coat Roughness'].default_value = m.get('capa_rugosidad', 0.03)
    return mat


def aplicar_materiales(mallas, cfg, ajuste):
    m_archivo = ajuste.get('material')
    if cfg['material_modo'] == 'uniforme' or m_archivo:
        mat = material_uniforme('Uniforme', fusionar(cfg['material'], m_archivo or {}))
        for ob in mallas:
            ob.data.materials.clear()
            ob.data.materials.append(mat)
    else:
        sin = None
        for ob in mallas:
            if not ob.data.materials or all(s is None for s in ob.data.materials):
                sin = sin or material_uniforme('SinMaterial', cfg['material'])
                ob.data.materials.clear()
                ob.data.materials.append(sin)


def suavizar(mallas, angulo):
    if not angulo:
        return
    bpy.ops.object.select_all(action='DESELECT')
    for ob in mallas:
        ob.select_set(True)
    bpy.context.view_layer.objects.active = mallas[0]
    try:
        bpy.ops.object.shade_auto_smooth(angle=math.radians(angulo))
    except Exception:
        try:
            bpy.ops.object.shade_smooth_by_angle(angle=math.radians(angulo))
        except Exception as e:
            log('  no se pudo suavizar:', e)


def limpiar_modelo(raiz):
    hijos = list(raiz.children_recursive) + [raiz]
    for ob in hijos:
        bpy.data.objects.remove(ob, do_unlink=True)
    bpy.data.orphans_purge(do_local_ids=True, do_linked_ids=True, do_recursive=True)


# --------------------------------------------------------------------- salida

def componer_fondo(ruta, fondo_hex):
    """PNG transparente (con sombra) -> PNG sobre color solido."""
    import numpy as np
    img = bpy.data.images.load(ruta)
    px = np.empty(len(img.pixels), dtype=np.float32)
    img.pixels.foreach_get(px)
    px = px.reshape(-1, 4)
    a = px[:, 3:4]
    fondo = np.array(hex_a_srgb(fondo_hex), dtype=np.float32)
    px[:, :3] = px[:, :3] * a + fondo * (1 - a)
    px[:, 3] = 1.0
    img.pixels.foreach_set(px.ravel())
    img.filepath_raw = ruta
    img.file_format = 'PNG'
    img.save()
    bpy.data.images.remove(img)


def main():
    args = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
    forzar = '--forzar' in args
    args = [a for a in args if a != '--forzar']
    if len(args) < 2:
        log('Uso: blender -b -P render-bulk.py -- <entrada> <salida> [config.json] [--forzar]')
        sys.exit(1)
    entrada, salida = os.path.abspath(args[0]), os.path.abspath(args[1])
    ruta_cfg = args[2] if len(args) > 2 else os.path.join(os.path.dirname(os.path.abspath(__file__)),
                                                         'render-bulk.config.json')
    cfg = CONFIG_BASE
    if os.path.exists(ruta_cfg):
        with open(ruta_cfg, encoding='utf-8') as f:
            cfg = fusionar(CONFIG_BASE, json.load(f))
        log('config:', ruta_cfg)
    os.makedirs(salida, exist_ok=True)

    archivos = sorted(f for f in os.listdir(entrada) if os.path.splitext(f)[1].lower() in FORMATOS)
    if not archivos:
        log('No hay modelos en', entrada)
        sys.exit(1)
    log(f'{len(archivos)} modelos, {len(cfg["vistas"])} vistas, encuadre {cfg["encuadre"]}')

    est = preparar_estudio(cfg)
    resumen, fallos = [], []
    t0 = time.time()
    for i, archivo in enumerate(archivos, 1):
        base = os.path.splitext(archivo)[0]
        destinos = {v['nombre']: os.path.join(salida, f'{base}_{v["nombre"]}.png') for v in cfg['vistas']}
        if not forzar and all(os.path.exists(p) for p in destinos.values()):
            log(f'[{i}/{len(archivos)}] {archivo}: ya renderizado, se salta')
            continue
        log(f'[{i}/{len(archivos)}] {archivo}')
        raiz = None
        try:
            ajuste = cfg['por_archivo'].get(base, {})
            objetos, mallas = importar(os.path.join(entrada, archivo), cfg, ajuste)
            if not mallas:
                raise RuntimeError('el archivo no trae mallas')
            raiz, radio, centro_z, dims = normalizar(objetos, mallas, cfg, ajuste)
            aplicar_materiales(mallas, cfg, ajuste)
            suavizar(mallas, cfg['suavizado_angulo'])
            for v in cfg['vistas']:
                colocar_estudio(est, cfg, radio, centro_z, v)
                est['escena'].render.filepath = destinos[v['nombre']]
                bpy.ops.render.render(write_still=True)
                if cfg['fondo'] != 'transparente':
                    componer_fondo(destinos[v['nombre']], cfg['fondo'])
                log('  ->', destinos[v['nombre']])
            resumen.append({'archivo': archivo, 'caja': [round(d, 4) for d in dims]})
        except Exception as e:
            log('  ERROR:', e)
            fallos.append({'archivo': archivo, 'error': str(e)})
        finally:
            if raiz:
                limpiar_modelo(raiz)
            else:
                for ob in [o for o in bpy.data.objects if o.name not in
                           ('Rig', 'Objetivo', 'Camara', 'Piso') and o.parent is None
                           and o.type not in ('LIGHT',)]:
                    bpy.data.objects.remove(ob, do_unlink=True)

    with open(os.path.join(salida, 'render-bulk.log.json'), 'w', encoding='utf-8') as f:
        json.dump({'config': cfg, 'renderizados': resumen, 'fallos': fallos}, f, indent=2, ensure_ascii=False)
    log(f'Listo en {time.time() - t0:.0f} s: {len(resumen)} ok, {len(fallos)} con error')
    if fallos:
        sys.exit(2)


main()
