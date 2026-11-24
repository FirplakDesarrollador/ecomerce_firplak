# Greybox del baño para los ambientes de Mix & Match (Opcion C).
#
# Arma un baño en bruto (pared, piso, paredes laterales, espejo y el hueco del
# mueble vacio) con la MISMA camara de la Opcion C, calibrada contra
# public/images/muebles/opcion-c/vitelli__oslo__cerrado.webp (la silueta del
# Vitelli + Oslo cae a <1 % de los pixeles del render original).
#
# La perspectiva depende solo de la posicion de la camara: aqui se mantiene la
# posicion y se abre el lente para ver el ambiente completo. El encuadre de la
# Opcion C es un recorte exacto de este (ver encuadre_opcion_c en el JSON).
#
# Cada esquema de luz se renderiza en arcilla. Ese render se usa como
# referencia de estructura para generar el ambiente en Higgsfield; las mismas
# luces se reutilizan despues para renderizar los productos de ese ambiente.
#
# Uso: blender -b -P scripts/modelos-3d/greybox-bano.py -- <carpeta-salida> [luz ...]
# Coordenadas: metros, Z arriba, pared del fondo en y=0, el mueble Vitelli 63
# cuelga con su base en z=0 y su frente hacia -Y (como en vitelli-63.glb).
import bpy
import json
import math
import os
import sys

from mathutils import Vector

# Camara calibrada (fit de silueta contra la Opcion C, 1600 px).
CAMARA = {
    'posicion': (0.0, -4.5275, 1.5766),
    'rot_x_grados': 74.0,          # 16 grados hacia abajo
    'lente_opcion_c_mm': 150.0,
    'shift_opcion_c': (0.00452, -0.04544),
}
LENTE_AMBIENTE_MM = 45.0
RESOLUCION = (2400, 1600)          # 3:2

PISO_Z = -0.29                     # tapa del lavamanos (0.56) a 0.85 m del piso
TECHO_Z = PISO_Z + 2.45
MEDIO_ANCHO = 1.6                  # baño de 3.2 m de ancho
FONDO_Y = -5.5                     # el cuarto sigue detras de la camara

LUCES = {
    # Ventana a la izquierda, sol de tarde suave y calido.
    'ventana-calida': {
        'ventana_x': -1, 'sol': {'color': (1.0, 0.82, 0.62), 'fuerza': 3.2, 'azimut': -70, 'elevacion': 32},
        'cielo': {'color': (0.75, 0.82, 1.0), 'fuerza': 0.6}, 'espejo_led': None, 'cenital': None,
    },
    # Spa: penumbra, LED calido detras del espejo y un cenital suave.
    'spa-led': {
        'ventana_x': 0, 'sol': None, 'cielo': {'color': (0.6, 0.65, 0.75), 'fuerza': 0.04},
        'espejo_led': {'color': (1.0, 0.72, 0.45), 'fuerza': 60.0},
        'cenital': {'color': (1.0, 0.86, 0.7), 'fuerza': 70.0},
    },
    # Dia nublado por una ventana grande a la derecha: luz difusa y neutra.
    'dia-difuso': {
        'ventana_x': 1, 'sol': None, 'cielo': {'color': (0.92, 0.96, 1.0), 'fuerza': 1.6},
        'espejo_led': None, 'cenital': None,
    },
}


def material(nombre, color, rugosidad=0.8, emision=None):
    m = bpy.data.materials.new(nombre)
    m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*color, 1)
    b.inputs['Roughness'].default_value = rugosidad
    if emision:
        b.inputs['Emission Color'].default_value = (*emision[0], 1)
        b.inputs['Emission Strength'].default_value = emision[1]
    return m


def caja(nombre, centro, medidas, mat):
    bpy.ops.mesh.primitive_cube_add(size=1, location=centro)
    o = bpy.context.active_object
    o.name = nombre
    o.scale = medidas
    o.data.materials.append(mat)
    return o


def construir(cfg):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    esc = bpy.context.scene
    r = esc.render
    r.engine = 'CYCLES'
    r.resolution_x, r.resolution_y = RESOLUCION
    esc.cycles.samples = 96
    esc.cycles.use_denoising = True
    try:
        prefs = bpy.context.preferences.addons['cycles'].preferences
        prefs.compute_device_type = 'HIP'
        prefs.refresh_devices()
        for d in prefs.devices:
            d.use = d.type != 'CPU'
        esc.cycles.device = 'GPU'
    except Exception:
        pass
    esc.view_settings.view_transform = 'AgX'
    ims = r.image_settings
    if hasattr(ims, 'media_type'):
        ims.media_type = 'IMAGE'
    ims.file_format = 'PNG'

    arcilla = material('Arcilla', (0.72, 0.72, 0.70))
    piso_m = material('ArcillaPiso', (0.55, 0.55, 0.53))
    espejo_m = material('EspejoArcilla', (0.30, 0.31, 0.33), rugosidad=0.25)
    t = 0.1
    alto = TECHO_Z - PISO_Z
    largo = -FONDO_Y
    caja('Fondo', (0, t / 2, PISO_Z + alto / 2), (MEDIO_ANCHO * 2 + 2 * t, t, alto), arcilla)
    caja('Piso', (0, FONDO_Y / 2, PISO_Z - t / 2), (MEDIO_ANCHO * 2 + 2 * t, largo, t), piso_m)
    caja('Techo', (0, FONDO_Y / 2, TECHO_Z + t / 2), (MEDIO_ANCHO * 2 + 2 * t, largo, t), arcilla)
    for lado in (-1, 1):
        x = lado * (MEDIO_ANCHO + t / 2)
        if cfg['ventana_x'] == lado:
            # Pared con un vano de ventana (fuera de cuadro) por donde entra la luz.
            y0, y1, z0, z1 = -2.6, -0.8, PISO_Z + 0.9, PISO_Z + 2.2
            caja(f'Lateral{lado}a', (x, (y0 + FONDO_Y) / 2, PISO_Z + alto / 2), (t, y0 - FONDO_Y, alto), arcilla)
            caja(f'Lateral{lado}b', (x, y1 / 2, PISO_Z + alto / 2), (t, -y1, alto), arcilla)
            caja(f'Lateral{lado}c', (x, (y0 + y1) / 2, (PISO_Z + z0) / 2), (t, y1 - y0, z0 - PISO_Z), arcilla)
            caja(f'Lateral{lado}d', (x, (y0 + y1) / 2, (z1 + TECHO_Z) / 2), (t, y1 - y0, TECHO_Z - z1), arcilla)
        else:
            caja(f'Lateral{lado}', (x, FONDO_Y / 2, PISO_Z + alto / 2), (t, largo, alto), arcilla)
    # Espejo sobre el hueco del mueble (el mueble se compone despues).
    caja('Espejo', (0, -0.05, 1.25), (0.60, 0.024, 0.80), espejo_m)  # separado de la pared: deja ver el halo LED

    mundo = bpy.data.worlds.new('Cielo')
    mundo.use_nodes = True
    bg = mundo.node_tree.nodes['Background']
    c = cfg['cielo']
    bg.inputs['Color'].default_value = (*c['color'], 1)
    bg.inputs['Strength'].default_value = c['fuerza']
    esc.world = mundo

    if cfg['sol']:
        s = cfg['sol']
        sol = bpy.data.objects.new('Sol', bpy.data.lights.new('Sol', 'SUN'))
        sol.data.energy = s['fuerza']
        sol.data.color = s['color']
        sol.data.angle = math.radians(4)
        az, el = math.radians(s['azimut']), math.radians(s['elevacion'])
        d = Vector((math.cos(el) * math.sin(az), -math.cos(el) * math.cos(az), math.sin(el)))
        sol.rotation_euler = (-d).to_track_quat('-Z', 'Y').to_euler()
        esc.collection.objects.link(sol)
    if cfg['espejo_led']:
        led = bpy.data.objects.new('LedEspejo', bpy.data.lights.new('LedEspejo', 'AREA'))
        led.data.shape = 'RECTANGLE'
        led.data.size, led.data.size_y = 0.56, 0.76
        led.data.energy = cfg['espejo_led']['fuerza']
        led.data.color = cfg['espejo_led']['color']
        led.location = (0, -0.032, 1.25)
        led.rotation_euler = (math.radians(-90), 0, 0)  # mira hacia la pared: halo
        esc.collection.objects.link(led)
    if cfg['cenital']:
        cen = bpy.data.objects.new('Cenital', bpy.data.lights.new('Cenital', 'SPOT'))
        cen.data.energy = cfg['cenital']['fuerza']
        cen.data.color = cfg['cenital']['color']
        cen.data.spot_size = math.radians(70)
        cen.data.spot_blend = 0.6
        cen.location = (0, -0.6, TECHO_Z - 0.05)
        esc.collection.objects.link(cen)

    cam = bpy.data.objects.new('Camara', bpy.data.cameras.new('Camara'))
    cam.data.sensor_width = 36
    cam.data.lens = LENTE_AMBIENTE_MM
    cam.location = CAMARA['posicion']
    cam.rotation_euler = (math.radians(CAMARA['rot_x_grados']), 0, 0)
    # Subir el cuadro para que entren piso y espejo, sin inclinar la camara
    # (shift conserva la perspectiva y las verticales).
    cam.data.shift_y = 0.07
    esc.collection.objects.link(cam)
    esc.camera = cam
    return esc, cam


def encuadre_opcion_c(cam):
    """Recorte del ambiente que equivale al cuadro 1600x1600 de la Opcion C."""
    w, h = RESOLUCION
    f_amb = cam.data.lens / 36 * w            # px por unidad de plano focal (ajuste horizontal)
    f_c = CAMARA['lente_opcion_c_mm'] / 36 * 1600
    lado = 1600 * f_amb / f_c
    sx, sy = CAMARA['shift_opcion_c']
    # Centro del cuadro C en coordenadas del ambiente.
    cx = w / 2 + (sx * 1600 * f_amb / f_c) - cam.data.shift_x * w
    cy = h / 2 - (sy * 1600 * f_amb / f_c) + cam.data.shift_y * w
    return [round(cx - lado / 2, 1), round(cy - lado / 2, 1), round(cx + lado / 2, 1), round(cy + lado / 2, 1)]


def main():
    args = sys.argv[sys.argv.index('--') + 1:]
    salida = os.path.abspath(args[0])
    nombres = args[1:] or list(LUCES)
    os.makedirs(salida, exist_ok=True)
    meta = {}
    for n in nombres:
        esc, cam = construir(LUCES[n])
        esc.render.filepath = os.path.join(salida, f'greybox-{n}.png')
        bpy.ops.render.render(write_still=True)
        bpy.ops.wm.save_as_mainfile(filepath=os.path.join(salida, f'greybox-{n}.blend'))
        meta[n] = {'render': f'greybox-{n}.png', 'encuadre_opcion_c': encuadre_opcion_c(cam)}
        print('[greybox]', n, '->', esc.render.filepath)
    with open(os.path.join(salida, 'greybox.json'), 'w', encoding='utf-8') as f:
        json.dump({'camara': CAMARA, 'lente_ambiente_mm': LENTE_AMBIENTE_MM, 'resolucion': RESOLUCION,
                   'piso_z': PISO_Z, 'ambientes': meta}, f, indent=2)


main()
