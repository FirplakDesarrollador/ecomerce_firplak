"""Publica la escena v4 del Mix & Match desde el registro del catálogo.

python scripts/mix-match/publicar-capas-v4.py

Fuente de verdad: scripts/mix-match/catalogo-mix-match.json (ambientes, acabados, muebles, lavamanos,
cruces con fuente y no ofrecidos). Entradas de imagen (assets-fuente/generativo-63x48/ambientes-v4):
placas aprobadas, encuadre-v4.json y capas/ de render-capas-v4.py. Salidas: WebP con huella en
public/images/muebles/capas-63x48/, manifest.json versión 3 (varios ambientes, cada uno con su placa y
sus sombras por mueble) y, en ambientes-v4/revision/, composiciones de cada cruce en cada ambiente y
validacion-capas-v4.json.

Controles (assert): el registro es coherente (cada cruce con fuente, piezas existentes, ninguno en
no_ofrecidos, todas sus capas renderizadas); WebP sin pérdida donde se ve; fuera de producto y sombra el
ambiente es idéntico; cambiar lavamanos no altera nada fuera de los lavamanos; contorno de capas
compuestas = producto renderizado dentro del cuarto (casos `publicacion.casos_contorno`).
"""
import datetime
import hashlib
import io
import json
import math
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[2]
RUTA_CATALOGO = ROOT / 'scripts/mix-match/catalogo-mix-match.json'
CATALOGO = json.loads(RUTA_CATALOGO.read_text(encoding='utf-8'))
V4 = ROOT / CATALOGO['escena']['carpeta']
CAPAS = V4 / 'capas'
REV = V4 / 'revision'
REV.mkdir(exist_ok=True)
PUBLIC = ROOT / 'public/images/muebles/capas-63x48'
MANIFEST = PUBLIC / 'manifest.json'
URL = '/images/muebles/capas-63x48/'
AMBIENTES = CATALOGO['ambientes']
MUEBLES = {m['id']: m for m in CATALOGO['muebles']}
LAVAMANOS = {l['id']: l for l in CATALOGO['lavamanos']}
ACABADOS = CATALOGO['acabados']
GRUPO = next(iter(CATALOGO['grupos_corte'].values()))
W, H = 1800, 1200
SOMBRA_K = CATALOGO['publicacion']['sombra_k']  # densidad de sombra respecto a la pasada de luz directa


# ---- Coherencia del registro ---------------------------------------------------------------------
cruces = CATALOGO['cruces']
claves = [(c['mueble'], c['lavamanos'], c['acabado'], c['estado']) for c in cruces]
assert len(claves) == len(set(claves)), 'cruces repetidos en el registro'
no_ofrecidos = {(n['mueble'], n['lavamanos']) for n in CATALOGO['no_ofrecidos']}
for c in cruces:
    assert c['mueble'] in MUEBLES and c['lavamanos'] in LAVAMANOS, c
    assert c['acabado'] in MUEBLES[c['mueble']]['acabados'] and c['estado'] in MUEBLES[c['mueble']]['estados'], c
    assert c.get('fuente', '').strip(), f'cruce sin fuente: {c}'
    assert (c['mueble'], c['lavamanos']) not in no_ofrecidos, f'cruce marcado como no ofrecido: {c}'
assert CATALOGO['ambiente_por_defecto'] in {a['id'] for a in AMBIENTES}
pares = sorted({(c['mueble'], c['lavamanos'], c['acabado']) for c in cruces})


def publicar(imagen, nombre, sin_perdida=True):
    buf = io.BytesIO()
    imagen.save(buf, 'WEBP', lossless=sin_perdida, quality=94 if sin_perdida else 90, method=6)
    data = buf.getvalue()
    destino = PUBLIC / f'{nombre}.{hashlib.sha256(data).hexdigest()[:12]}.webp'
    if not destino.exists():
        destino.write_bytes(data)
    return URL + destino.name


def local(src):
    return PUBLIC / src.removeprefix(URL)


def comprobar_sin_perdida(src, original):
    servido, orig = np.asarray(Image.open(local(src)).convert('RGBA')), np.asarray(original.convert('RGBA'))
    assert (servido[..., 3] == orig[..., 3]).all(), src
    assert (servido == orig)[orig[..., 3] > 0].all(), src


def abrir_capa(nombre):
    ruta = CAPAS / nombre
    assert ruta.exists(), f'falta {nombre}: correr render-capas-v4.py (modo faltantes)'
    return Image.open(ruta)


enc = json.loads((V4 / CATALOGO['escena']['encuadre']).read_text(encoding='utf-8'))
x0, y0, x1, y1 = enc['product_crop_in_background']
lado = x1 - x0
marco = {'x': x0, 'y': y0, 'width': lado, 'height': lado, 'resolution': 1600}
escala = 1600 / lado


def al_lienzo(capa):
    """Proyecta una capa de producto 1600x1600 a su recorte exacto en el lienzo 1800x1200."""
    return capa.transform((W, H), Image.Transform.AFFINE, (escala, 0, -x0 * escala, 0, escala, -y0 * escala),
                          resample=Image.Resampling.BICUBIC)


manifest = {
    'version': 3,
    'catalog': {'path': RUTA_CATALOGO.relative_to(ROOT).as_posix(),
                'sha256': hashlib.sha256(RUTA_CATALOGO.read_bytes()).hexdigest()[:12],
                'scene': CATALOGO['escena']['id']},
    'default_environment': CATALOGO['ambiente_por_defecto'],
    'camera': {k: enc[k] for k in ['camera_position', 'camera_rotation', 'environment_lens_mm', 'environment_shift',
                                   'product_lens_mm', 'product_shift', 'product_crop_in_background']},
    'environments': [],
    'product_frame': marco,
    'shadow_frame': {'x': 0, 'y': 0, 'width': W, 'height': H},
    'basins': {}, 'cabinets': {},
    'cabinet_info': {mid: {'nombre': m['nombre'], 'descripcion': m['descripcion'], 'medida': m['medida']}
                     for mid, m in MUEBLES.items()},
    'finishes': {aid: {'nombre': a['nombre']} for aid, a in ACABADOS.items()},
    'verified_combinations': [{k: c[k] for k in ('mueble', 'lavamanos', 'acabado', 'estado', 'fuente')} for c in cruces],
    'not_offered': CATALOGO['no_ofrecidos'],
    'compatibility_source': CATALOGO['compatibilidad_resumen'],
}

capas = {}
for lid, l in LAVAMANOS.items():
    capa = abrir_capa(f'lavamanos-{lid}.png').convert('RGBA')
    assert capa.size == (1600, 1600), lid
    src = publicar(capa, f'v4-lavamanos-{lid}')
    comprobar_sin_perdida(src, capa)
    capas[lid] = capa
    manifest['basins'][lid] = {'src': src, 'nombre': l['nombre'], 'forma': l['forma'],
                               'faucet': CATALOGO['griferia']['acabado'], 'bounds': list(capa.getchannel('A').getbbox())}
for mid, m in MUEBLES.items():
    manifest['cabinets'][mid] = {}
    for acabado in m['acabados']:
        manifest['cabinets'][mid][acabado] = {}
        for estado in m['estados']:
            capa = abrir_capa(f'{mid}-{acabado}-{estado}.png').convert('RGBA')
            assert capa.size == (1600, 1600), (mid, acabado, estado)
            src = publicar(capa, f'v4-{mid}-{acabado}-{estado}')
            comprobar_sin_perdida(src, capa)
            capas[f'{mid}:{acabado}'] = capa
            manifest['cabinets'][mid][acabado][estado] = {'src': src, 'bounds': list(capa.getchannel('A').getbbox())}

sombras, placas = {}, {}
for amb in AMBIENTES:
    placa = Image.open(V4 / amb['placa']).convert('RGB')
    assert placa.size == (W, H), amb['id']
    placas[amb['id']] = placa
    vacio = np.asarray(abrir_capa(f"sombra-{amb['id']}-vacio.png").getchannel('A'), np.float32) / 255
    entrada = {'id': amb['id'], 'nombre': amb['nombre'], 'descripcion': amb['descripcion'],
               'src': publicar(placa, f"v4-ambiente-{amb['id']}", False), 'width': W, 'height': H,
               'thumb': publicar(placa.resize((240, 160), Image.Resampling.LANCZOS), f"v4-ambiente-{amb['id']}-mini", False),
               'shadows': {}}
    for mid in MUEBLES:
        a = np.asarray(abrir_capa(f"sombra-{amb['id']}-{mid}.png").getchannel('A'), np.float32) / 255
        # Solo la contribución del mueble: la placa generada ya trae la luz del cuarto.
        inc = np.where(vacio < .995, np.clip((a - vacio) / np.maximum(1 - vacio, .005), 0, 1), 0)
        # Pasada de sombra con luz directa: la iluminación global da 0,56-0,63 x este valor dentro de la
        # sombra del sol (medido 2026-11-27, cálido GI vs moderno directo) más ~4 % global ya presente en la placa.
        inc *= SOMBRA_K
        inc[inc < 2 / 255] = 0  # ruido de muestreo lejos del mueble
        s = Image.new('RGBA', (W, H), (0, 0, 0, 0))
        s.putalpha(Image.fromarray(np.uint8(inc * 255 + .5)))
        sombras[amb['id'], mid] = s
        entrada['shadows'][mid] = publicar(s, f"v4-sombra-{amb['id']}-{mid}")
        comprobar_sin_perdida(entrada['shadows'][mid], s)
    manifest['environments'].append(entrada)

# ---- Composiciones y controles de independencia ------------------------------------------------
informe = {'fecha': datetime.date.today().isoformat(),
           'catalogo': manifest['catalog'],
           'fuente': 'render PBR (render-capas-v4.py); sin IA ni pulido en producto',
           'pulido_ia': 'NO APLICA (capas 100 % render CAD/GLB/STL)', 'creditos_producto': 0,
           'cruces': len(pares), 'ambientes': [a['id'] for a in AMBIENTES],
           'ambiente_igual_fuera_de_producto_y_sombra': {}, 'cambio_lavamanos_fuera_de_lavamanos': {},
           'bandas_sombra': {}, 'contorno_escena': {}}
lienzo = {k: al_lienzo(v) for k, v in capas.items()}
alfa = {k: np.asarray(v.getchannel('A')) > 0 for k, v in lienzo.items()}
compuestos = {}
for amb in (a['id'] for a in AMBIENTES):
    base = np.asarray(placas[amb], int)
    for mueble, lid, acabado in pares:
        cab = f'{mueble}:{acabado}'
        c = placas[amb].convert('RGBA')
        for capa in [sombras[amb, mueble], lienzo[cab], lienzo[lid]]:
            c.alpha_composite(capa)
        rgb = np.asarray(c.convert('RGB'), int)
        compuestos[amb, mueble, lid, acabado] = c.convert('RGB')
        ocupado = alfa[cab] | alfa[lid] | (np.asarray(sombras[amb, mueble].getchannel('A')) > 0)
        dif = int(np.abs(rgb - base)[~ocupado].max())
        assert dif == 0, (amb, mueble, lid, acabado, dif)
        informe['ambiente_igual_fuera_de_producto_y_sombra'][f'{amb}:{mueble}-{acabado}-{lid}'] = dif
    for mueble, m in MUEBLES.items():
        for acabado in m['acabados']:
            suyos = [l for mu, l, ac in pares if mu == mueble and ac == acabado]
            if len(suyos) < 2:
                continue
            union = np.logical_or.reduce([alfa[l] for l in suyos])
            for i, a in enumerate(suyos):
                for b in suyos[i + 1:]:
                    dif = int(np.abs(np.asarray(compuestos[amb, mueble, a, acabado], int)
                                     - np.asarray(compuestos[amb, mueble, b, acabado], int))[~union].max())
                    assert dif == 0, (amb, mueble, a, b, dif)
                    informe['cambio_lavamanos_fuera_de_lavamanos'][f'{amb}:{mueble}-{acabado}:{a}->{b}'] = dif
        # Bandas: un recorte deja un borde recto con alfa alto. Arriba/izquierda/derecha deben ser 0;
        # abajo puede continuar la sombra del piso fuera de cuadro (no es un corte del render).
        s = np.asarray(sombras[amb, mueble].getchannel('A'))
        lejos = cv2.dilate((s > 2).astype(np.uint8), np.ones((5, 5), np.uint8)) == 0
        saltos = np.abs(np.diff(s.astype(int), axis=0)).max(), np.abs(np.diff(s.astype(int), axis=1)).max()
        informe['bandas_sombra'][f'{amb}:{mueble}'] = {
            'marco': list(sombras[amb, mueble].size),
            'alfa_max_borde_sup_izq_der': int(max(s[0].max(), s[:, 0].max(), s[:, -1].max())),
            'alfa_max_borde_inferior_piso': int(s[-1].max()),
            'fraccion_lienzo_sin_sombra': round(float(lejos.mean()), 4),
            'salto_max_entre_pixeles_vecinos': int(max(saltos)),
            'bbox': list(sombras[amb, mueble].getchannel('A').getbbox() or [])}
        assert informe['bandas_sombra'][f'{amb}:{mueble}']['alfa_max_borde_sup_izq_der'] == 0, (amb, mueble)

# ---- Contorno: capas compuestas vs producto renderizado dentro del cuarto ---------------------
for mueble, lid in CATALOGO['publicacion']['casos_contorno']:
    cab = f"{mueble}:{MUEBLES[mueble]['acabados'][0]}"
    escena = np.asarray(abrir_capa(f'escena-{mueble}-{lid}.png').getchannel('A'), np.float32) / 255
    a_m = np.asarray(lienzo[cab].getchannel('A'), np.float32) / 255
    a_l = np.asarray(lienzo[lid].getchannel('A'), np.float32) / 255
    comp = 1 - (1 - a_m) * (1 - a_l)
    m1, m2 = escena > .5, comp > .5
    iou = float((m1 & m2).sum() / (m1 | m2).sum())
    b1 = m1 ^ cv2.erode(m1.astype(np.uint8), np.ones((3, 3), np.uint8)).astype(bool)
    b2 = m2 ^ cv2.erode(m2.astype(np.uint8), np.ones((3, 3), np.uint8)).astype(bool)
    d = cv2.distanceTransform((~b1).astype(np.uint8), cv2.DIST_L2, 5)[b2]
    informe['contorno_escena'][f'{mueble}-{lid}'] = {
        'iou': round(iou, 5), 'distancia_contorno_media_px': round(float(d.mean()), 3),
        'p95_px': round(float(np.percentile(d, 95)), 3), 'max_px': round(float(d.max()), 3),
        'alfa_dif_media': round(float(np.abs(escena - comp).mean()), 5),
        'estado': 'APROBADO' if np.percentile(d, 95) <= 1.0 and iou >= .99 else 'FALLÓ'}
    assert informe['contorno_escena'][f'{mueble}-{lid}']['estado'] == 'APROBADO', (mueble, lid, informe['contorno_escena'][f'{mueble}-{lid}'])

# ---- Alineación por contacto de todos los lavamanos contra el mueble de corte -------------------
fuente_lav = json.loads((CAPAS / 'fuente-lavamanos-v4.json').read_text(encoding='utf-8'))
informe['contacto_lavamanos'] = {}
corte = GRUPO['mueble_corte']
b_corte = manifest['cabinets'][corte][MUEBLES[corte]['acabados'][0]]['cerrado']['bounds']
for lid in LAVAMANOS:
    c = fuente_lav[lid]['contacto_mueble']
    assert abs(c['cx_mm']) <= 0.1 and abs(c['atras_mm']) <= 0.1 and abs(c['apoyo_mm'] - 480.0) <= 0.1, (lid, c)
    b_lav = manifest['basins'][lid]['bounds']
    # En cámara frontal-3/4 izquierda, el lavamanos (630 mm) sobresale levemente o empata con el mueble (624 mm).
    assert abs(b_lav[0] - b_corte[0]) <= 8 and abs(b_lav[2] - b_corte[2]) <= 12, (lid, b_lav, b_corte)
    informe['contacto_lavamanos'][lid] = {'contacto_mm': c, 'bounds_1600': b_lav, 'grifo_xy_mm': fuente_lav[lid]['grifo_xy_mm'],
                                          'grifo_deck_z_mm': fuente_lav[lid]['grifo_deck_z_mm']}

# ---- Hojas de revisión -------------------------------------------------------------------------
fuente = ImageFont.truetype('C:/Windows/Fonts/arial.ttf', 22)
columnas = 5
for amb in AMBIENTES:
    filas = math.ceil(len(pares) / columnas)
    hoja = Image.new('RGB', (columnas * 540, filas * 400), '#f3eee8')
    d = ImageDraw.Draw(hoja)
    for i, (mueble, lid, acabado) in enumerate(pares):
        im = compuestos[amb['id'], mueble, lid, acabado].resize((540, 360), Image.Resampling.LANCZOS)
        x, y = (i % columnas) * 540, (i // columnas) * 400
        hoja.paste(im, (x, y + 40))
        etiqueta = f"{amb['nombre']}: {MUEBLES[mueble]['nombre']} {ACABADOS[acabado]['nombre']} + {LAVAMANOS[lid]['nombre']}"
        d.text((x + 10, y + 8), etiqueta, font=fuente, fill='#324354')
    hoja.save(REV / f"cruces-{amb['id']}.png")
    for mueble, lid in CATALOGO['publicacion']['casos_contorno']:
        acabado = MUEBLES[mueble]['acabados'][0]
        if (amb['id'], mueble, lid, acabado) in compuestos:
            compuestos[amb['id'], mueble, lid, acabado].save(REV / f"compuesto-{amb['id']}-{mueble}-{lid}.png")

# Archivos v4 publicados antes y que ya no referencia el manifiesto (lotes repetidos generan huellas nuevas).
texto_manifest = json.dumps(manifest)
huerfanos = [f for f in PUBLIC.glob('v4-*.webp') if f.name not in texto_manifest]
for viejo in huerfanos:
    viejo.unlink()
informe['huerfanos_borrados'] = [f.name for f in huerfanos]

MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding='utf-8')
(REV / 'validacion-capas-v4.json').write_text(json.dumps(informe, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps(informe['contorno_escena'], ensure_ascii=False, indent=1))
print(json.dumps(informe['bandas_sombra'], ensure_ascii=False))
print('HUERFANOS', informe['huerfanos_borrados'])
print('PUBLICADO', len(pares), 'cruces x', len(AMBIENTES), 'ambientes')
