# Renderiza un conjunto mueble + lavamanos DENTRO de un ambiente del greybox,
# para componerlo sobre el fondo generado (Higgsfield) de ese ambiente.
#
# Abre greybox-<ambiente>.blend (misma camara calibrada de la Opcion C y las
# luces de ese ambiente) y hace dos pasadas:
#   producto.png  RGBA del producto. Las paredes y el piso del greybox llevan
#                 el fondo generado proyectado desde la camara: no se ven, pero
#                 son lo que el producto refleja y lo que le rebota luz.
#   sombra.png    alfa = sombra del producto sobre pared y piso (shadow catcher).
# componer() junta fondo x (1 - sombra) + producto en <salida>/compuesto.png.
#
# Regla del proyecto (bug 016): el producto sale de este render, nunca de la IA.
#
# Uso: blender -b -P scripts/modelos-3d/render-en-ambiente.py -- <greybox.blend> <fondo.png> <salida>
#      [--lavamanos oslo] [--acabado public/images/muebles/vitelli-63/acabados/soder.webp] [--muestras 128]
import argparse
import math
import os
import sys

import bpy

RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
GLB = os.path.join(RAIZ, 'public', 'models', 'muebles', 'vitelli-63.glb')
GREYBOX = {'Fondo', 'Piso', 'Techo', 'Espejo'}
# El Genova trae dos copias completas del lavamanos desplazadas 1.4 cm; juntas
# se pelean (la cubierta sale negra en Cycles). Se deja la que mejor coincide
# con la silueta de la Opcion C (IoU 0.943 contra 0.940).
PIEZAS_DUPLICADAS = {'Lavamanos_genova_pieza_0'}


def args():
    a = sys.argv[sys.argv.index('--') + 1:]
    p = argparse.ArgumentParser()
    p.add_argument('blend')
    p.add_argument('fondo')
    p.add_argument('salida')
    p.add_argument('--lavamanos', default='oslo')
    p.add_argument('--acabado', default=os.path.join(RAIZ, 'public', 'images', 'muebles', 'vitelli-63', 'acabados', 'soder.webp'))
    p.add_argument('--muestras', type=int, default=128)
    p.add_argument('--fuerza_fondo', type=float, default=0.8)
    p.add_argument('--prueba_proyeccion', action='store_true')
    p.add_argument('--opcion_c', action='store_true', help='renderiza el cuadro de la Opcion C a 1600 px')
    return p.parse_args(a)


def es_greybox(o):
    return o.type == 'MESH' and (o.name in GREYBOX or o.name.startswith('Lateral'))


def principled(nombre, color, rug, metal=0.0, capa=0.0):
    m = bpy.data.materials.new(nombre)
    m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*color, 1)
    b.inputs['Roughness'].default_value = rug
    b.inputs['Metallic'].default_value = metal
    if capa:
        b.inputs['Coat Weight'].default_value = capa
        b.inputs['Coat Roughness'].default_value = 0.02
    return m


def material_acabado(ruta):
    # Igual que la web (materialAcabado.ts): UV en metros, una textura cada 0.7 m, espejada.
    m = principled('AcabadoMadera', (1, 1, 1), 0.58)
    nt = m.node_tree
    tex = nt.nodes.new('ShaderNodeTexImage')
    tex.image = bpy.data.images.load(ruta)
    tex.extension = 'MIRROR'
    uv = nt.nodes.new('ShaderNodeTexCoord')
    mapa = nt.nodes.new('ShaderNodeMapping')
    mapa.inputs['Scale'].default_value = (1 / 0.7, 1 / 0.7, 1)
    nt.links.new(uv.outputs['UV'], mapa.inputs['Vector'])
    nt.links.new(mapa.outputs['Vector'], tex.inputs['Vector'])
    nt.links.new(tex.outputs['Color'], nt.nodes['Principled BSDF'].inputs['Base Color'])
    return m


def cargar_producto(lavamanos, acabado):
    antes = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=GLB)
    nuevos = [o for o in bpy.data.objects if o not in antes]
    for c in bpy.data.objects['Lavamanos'].children:
        if lavamanos not in c.name.lower():
            for o in [c] + list(c.children_recursive):
                o.hide_render = True
    # Con el mueble cerrado las bisagras no se ven, pero en el GLB simplificado
    # asoman por el frente de la puerta.
    for o in nuevos:
        if o.name.startswith('Bisagras') or o.name in PIEZAS_DUPLICADAS:
            o.hide_render = True
    # Algunas piezas de lavamanos traen normales invertidas (la web usa doble
    # cara y no se nota; Cycles las pinta negras con el esmalte): se recalculan.
    import bmesh
    for o in nuevos:
        if o.type == 'MESH' and o.name.startswith('Lavamanos_') and not o.hide_render:
            bm = bmesh.new()
            bm.from_mesh(o.data)
            bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
            bm.to_mesh(o.data)
            bm.free()
    mats = {
        'Acabado': material_acabado(acabado),
        # Lavamanos: el esmalte brillante del preset de catalogo.
        'Marmol': principled('LavamanosEsmalte', (0.91, 0.91, 0.91), 0.04, capa=1.0),
        'TapaBlanca': principled('Tapa', (0.85, 0.85, 0.85), 0.2),
        'GrifoNegro': principled('GrifoNegro', (0.02, 0.02, 0.02), 0.25, metal=1.0),
        'Cromo': principled('Cromo', (0.9, 0.9, 0.9), 0.05, metal=1.0),
        'Aluminio': principled('Aluminio', (0.75, 0.75, 0.75), 0.3, metal=1.0),
        'SifonNegro': principled('Sifon', (0.03, 0.03, 0.03), 0.5),
    }
    for o in nuevos:
        if o.type == 'MESH':
            for i, s in enumerate(o.material_slots):
                base = s.material.name.split('.')[0] if s.material else ''
                if base in mats:
                    o.material_slots[i].material = mats[base]
    return [o for o in nuevos if o.type == 'MESH']


def proyectar_fondo(fondo, cam, fuerza):
    """Pinta pared, piso y laterales con el fondo generado, proyectado desde la camara."""
    img = bpy.data.images.load(fondo)
    m = bpy.data.materials.new('FondoProyectado')
    m.use_nodes = True
    nt = m.node_tree
    for n in list(nt.nodes):
        nt.nodes.remove(n)
    tex = nt.nodes.new('ShaderNodeTexImage')
    tex.image = img
    tex.extension = 'EXTEND'
    uv = nt.nodes.new('ShaderNodeUVMap')
    uv.uv_map = 'Proyeccion'
    em = nt.nodes.new('ShaderNodeEmission')
    em.inputs['Strength'].default_value = fuerza
    out = nt.nodes.new('ShaderNodeOutputMaterial')
    nt.links.new(uv.outputs['UV'], tex.inputs['Vector'])
    nt.links.new(tex.outputs['Color'], em.inputs['Color'])
    nt.links.new(em.outputs['Emission'], out.inputs['Surface'])
    esc = bpy.context.scene
    asp = esc.render.resolution_x / esc.render.resolution_y
    for o in bpy.data.objects:
        if not es_greybox(o):
            continue
        # Subdividir para que la proyeccion por vertice no se deforme en caras grandes.
        bpy.context.view_layer.objects.active = o
        sub = o.modifiers.new('Sub', 'SUBSURF')
        sub.subdivision_type = 'SIMPLE'
        sub.levels = sub.render_levels = 6
        if 'Proyeccion' not in o.data.uv_layers:
            o.data.uv_layers.new(name='Proyeccion')
        p = o.modifiers.new('Proyectar', 'UV_PROJECT')
        p.uv_layer = 'Proyeccion'
        p.projector_count = 1
        p.projectors[0].object = cam
        p.aspect_x, p.aspect_y = asp, 1
        p.scale_x = p.scale_y = 1
        o.data.materials.clear()
        o.data.materials.append(m)


def main():
    a = args()
    # Rutas absolutas antes de abrir el .blend: despues Blender resuelve las
    # relativas desde otra raiz.
    a.salida, a.fondo, a.acabado = (os.path.abspath(p) for p in (a.salida, a.fondo, a.acabado))
    bpy.ops.wm.open_mainfile(filepath=os.path.abspath(a.blend))
    esc = bpy.context.scene
    esc.cycles.samples = a.muestras
    esc.render.film_transparent = True
    ims = esc.render.image_settings
    if hasattr(ims, 'media_type'):
        ims.media_type = 'IMAGE'
    ims.file_format = 'PNG'
    ims.color_mode = 'RGBA'
    os.makedirs(a.salida, exist_ok=True)
    cam = esc.camera
    producto = cargar_producto(a.lavamanos, os.path.abspath(a.acabado))
    # El fondo siempre se proyecta desde la camara del ambiente (su encuadre).
    proyector = cam.copy()
    proyector.data = cam.data.copy()
    esc.collection.objects.link(proyector)
    proyectar_fondo(os.path.abspath(a.fondo), proyector, a.fuerza_fondo)
    if a.opcion_c:
        # Misma posicion, lente y shift calibrados de la Opcion C: el cuadro de
        # la web a resolucion completa (1600 px) en vez del recorte de 720 px.
        cam.data.lens = 150.0
        cam.data.shift_x, cam.data.shift_y = 0.00452, -0.04544
        esc.render.resolution_x = esc.render.resolution_y = 1600
    if a.prueba_proyeccion:
        # Verificacion: el cuarto proyectado visto por la camara debe igualar el fondo.
        for o in producto:
            o.hide_render = True
        esc.render.film_transparent = False
        esc.view_settings.view_transform = 'Standard'
        esc.render.filepath = os.path.join(a.salida, 'prueba-proyeccion.png')
        bpy.ops.render.render(write_still=True)
        return

    # Pasada 1: producto. El cuarto proyectado no se ve, pero refleja y rebota.
    for o in bpy.data.objects:
        if es_greybox(o):
            o.visible_camera = False
            o.visible_shadow = False
    esc.render.filepath = os.path.join(a.salida, 'producto.png')
    bpy.ops.render.render(write_still=True)

    # Pasada 2: sombra del producto (invisible) sobre pared y piso. El shadow
    # catcher necesita un material que RECIBA luz: con la emision del fondo
    # proyectado no hay nada que oscurecer y la sombra sale vacia.
    receptor = principled('ReceptorSombra', (0.8, 0.8, 0.8), 0.9)
    for o in bpy.data.objects:
        if es_greybox(o):
            o.data.materials.clear()
            o.data.materials.append(receptor)
            o.visible_camera = True
            o.is_shadow_catcher = True
            o.visible_shadow = True
    for o in producto:
        o.visible_camera = False
    esc.render.filepath = os.path.join(a.salida, 'sombra.png')
    bpy.ops.render.render(write_still=True)
    print('[ambiente] listo:', a.salida)


main()
