"""Publica la escena v4 del Mix & Match: dos ambientes, cámara de dos puntos de fuga, capas PBR.

python scripts/mix-match/publicar-capas-v4.py

Entradas (assets-fuente/generativo-63x48/ambientes-v4): placa-<amb>.png aprobadas, encuadre-v4.json y
capas/ de render-capas-v4.py. Salidas: WebP con huella en public/images/muebles/capas-63x48/,
manifest.json versión 3 (varios ambientes, cada uno con su placa y sus sombras por mueble) y, en
ambientes-v4/revision/, composiciones de los 10 cruces x 2 ambientes y validacion-capas-v4.json.

Conserva los 10 cruces verificados y sus fuentes del manifiesto anterior.
Controles (assert): WebP sin pérdida donde se ve; fuera de producto y sombra el ambiente es idéntico;
cambiar lavamanos no altera nada fuera de los lavamanos; contorno de capas compuestas = producto
renderizado dentro del cuarto con la cámara del ambiente (render-capas-v4.py escena).
"""
import hashlib
import io
import json
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[2]
V4 = ROOT / 'assets-fuente/generativo-63x48/ambientes-v4'
CAPAS = V4 / 'capas'
REV = V4 / 'revision'
REV.mkdir(exist_ok=True)
PUBLIC = ROOT / 'public/images/muebles/capas-63x48'
MANIFEST = PUBLIC / 'manifest.json'
URL = '/images/muebles/capas-63x48/'
AMBIENTES = [('moderno', 'Moderno', 'Microcemento gris cálido, LED y repisa'),
             ('calido', 'Cálido', 'Microcemento arena y piedra clara')]
MUEBLES = ['vitelli', 'tiziano']
LAVAMANOS = ['oslo', 'genova', 'bari', 'siena', 'trentino', 'quadratto']
W, H = 1800, 1200
SOMBRA_K = 0.62  # densidad de sombra respecto a la pasada de luz directa


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


anterior = json.loads(MANIFEST.read_text(encoding='utf-8'))
cruces = anterior['verified_combinations']
pares = {(c['mueble'], c['lavamanos']) for c in cruces}
assert len(pares) == 10 and not pares & {('vitelli', 'quadratto'), ('tiziano', 'bari')}, sorted(pares)

enc = json.loads((V4 / 'encuadre-v4.json').read_text(encoding='utf-8'))
x0, y0, x1, y1 = enc['product_crop_in_background']
lado = x1 - x0
marco = {'x': x0, 'y': y0, 'width': lado, 'height': lado, 'resolution': 1600}
escala = 1600 / lado


def al_lienzo(capa):
    """Proyecta una capa de producto 1600x1600 a su recorte exacto en el lienzo 1800x1200."""
    return capa.transform((W, H), Image.Transform.AFFINE, (escala, 0, -x0 * escala, 0, escala, -y0 * escala),
                          resample=Image.Resampling.BICUBIC)


def al_producto(capa_lienzo):
    """Recorte del lienzo al marco de producto (para revisar a 1600 px)."""
    return capa_lienzo.resize((1600, 1600), Image.Resampling.LANCZOS, box=(x0, y0, x1, y1))


manifest = {
    'version': 3,
    'default_environment': AMBIENTES[0][0],
    'camera': {k: enc[k] for k in ['camera_position', 'camera_rotation', 'environment_lens_mm', 'environment_shift',
                                   'product_lens_mm', 'product_shift', 'product_crop_in_background']},
    'environments': [],
    'product_frame': marco,
    'shadow_frame': {'x': 0, 'y': 0, 'width': W, 'height': H},
    'basins': {}, 'cabinets': {},
    'verified_combinations': cruces,
    'compatibility_source': anterior['compatibility_source'],
}

capas = {}
for lid in LAVAMANOS:
    capa = Image.open(CAPAS / f'lavamanos-{lid}.png').convert('RGBA')
    assert capa.size == (1600, 1600), lid
    src = publicar(capa, f'v4-lavamanos-{lid}')
    comprobar_sin_perdida(src, capa)
    capas[lid] = capa
    manifest['basins'][lid] = {'src': src, 'faucet': 'Negro', 'bounds': list(capa.getchannel('A').getbbox())}
for mueble in MUEBLES:
    capa = Image.open(CAPAS / f'{mueble}-soder-cerrado.png').convert('RGBA')
    assert capa.size == (1600, 1600), mueble
    src = publicar(capa, f'v4-{mueble}-soder-cerrado')
    comprobar_sin_perdida(src, capa)
    capas[mueble] = capa
    manifest['cabinets'][mueble] = {'soder': {'cerrado': {'src': src, 'bounds': list(capa.getchannel('A').getbbox())}}}

sombras, placas = {}, {}
for amb, nombre, descripcion in AMBIENTES:
    placa = Image.open(V4 / f'placa-{amb}.png').convert('RGB')
    assert placa.size == (W, H), amb
    placas[amb] = placa
    vacio = np.asarray(Image.open(CAPAS / f'sombra-{amb}-vacio.png').getchannel('A'), np.float32) / 255
    entrada = {'id': amb, 'nombre': nombre, 'descripcion': descripcion,
               'src': publicar(placa, f'v4-ambiente-{amb}', False), 'width': W, 'height': H,
               'thumb': publicar(placa.resize((240, 160), Image.Resampling.LANCZOS), f'v4-ambiente-{amb}-mini', False),
               'shadows': {}}
    for mueble in MUEBLES:
        a = np.asarray(Image.open(CAPAS / f'sombra-{amb}-{mueble}.png').getchannel('A'), np.float32) / 255
        # Solo la contribución del mueble: la placa generada ya trae la luz del cuarto.
        inc = np.where(vacio < .995, np.clip((a - vacio) / np.maximum(1 - vacio, .005), 0, 1), 0)
        # Pasada de sombra con luz directa: la iluminación global da 0,56-0,63 x este valor dentro de la
        # sombra del sol (medido 2026-11-27, cálido GI vs moderno directo) más ~4 % global ya presente en la placa.
        inc *= SOMBRA_K
        inc[inc < 2 / 255] = 0  # ruido de muestreo lejos del mueble
        s = Image.new('RGBA', (W, H), (0, 0, 0, 0))
        s.putalpha(Image.fromarray(np.uint8(inc * 255 + .5)))
        sombras[amb, mueble] = s
        entrada['shadows'][mueble] = publicar(s, f'v4-sombra-{amb}-{mueble}')
        comprobar_sin_perdida(entrada['shadows'][mueble], s)
    manifest['environments'].append(entrada)

# ---- Composiciones y controles de independencia ------------------------------------------------
informe = {'fecha': '2026-11-27', 'fuente': 'render PBR (render-capas-v4.py); sin IA ni pulido en producto',
           'pulido_ia': 'NO APLICA (capas 100 % render CAD/GLB/STL)', 'creditos_producto': 0,
           'cruces': len(pares), 'ambientes': [a for a, _, _ in AMBIENTES],
           'ambiente_igual_fuera_de_producto_y_sombra': {}, 'cambio_lavamanos_fuera_de_lavamanos': {},
           'bandas_sombra': {}, 'contorno_escena': {}}
lienzo = {k: al_lienzo(v) for k, v in capas.items()}
alfa = {k: np.asarray(v.getchannel('A')) > 0 for k, v in lienzo.items()}
compuestos = {}
for amb, _, _ in AMBIENTES:
    base = np.asarray(placas[amb], int)
    for mueble, lid in sorted(pares):
        c = placas[amb].convert('RGBA')
        for capa in [sombras[amb, mueble], lienzo[mueble], lienzo[lid]]:
            c.alpha_composite(capa)
        rgb = np.asarray(c.convert('RGB'), int)
        compuestos[amb, mueble, lid] = c.convert('RGB')
        ocupado = alfa[mueble] | alfa[lid] | (np.asarray(sombras[amb, mueble].getchannel('A')) > 0)
        dif = int(np.abs(rgb - base)[~ocupado].max())
        assert dif == 0, (amb, mueble, lid, dif)
        informe['ambiente_igual_fuera_de_producto_y_sombra'][f'{amb}:{mueble}-{lid}'] = dif
    for mueble in MUEBLES:
        suyos = [l for m, l in sorted(pares) if m == mueble]
        union = np.logical_or.reduce([alfa[l] for l in suyos])
        for i, a in enumerate(suyos):
            for b in suyos[i + 1:]:
                dif = int(np.abs(np.asarray(compuestos[amb, mueble, a], int) - np.asarray(compuestos[amb, mueble, b], int))[~union].max())
                assert dif == 0, (amb, mueble, a, b, dif)
                informe['cambio_lavamanos_fuera_de_lavamanos'][f'{amb}:{mueble}:{a}->{b}'] = dif
        # Bandas: la sombra no puede terminar en un borde recto con alfa > 0 en el límite del lienzo.
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

# ---- Contorno: capas compuestas vs producto renderizado dentro del cuarto ---------------------
for mueble, lid in [('vitelli', 'oslo'), ('vitelli', 'genova'), ('tiziano', 'genova'),
                    ('tiziano', 'quadratto'), ('vitelli', 'siena')]:
    escena = np.asarray(Image.open(CAPAS / f'escena-{mueble}-{lid}.png').getchannel('A'), np.float32) / 255
    a_m = np.asarray(lienzo[mueble].getchannel('A'), np.float32) / 255
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

# ---- Alineación por contacto de todos los lavamanos contra los muebles ------------------------
fuente_lav = json.loads((CAPAS / 'fuente-lavamanos-v4.json').read_text(encoding='utf-8'))
informe['contacto_lavamanos'] = {}
for lid in LAVAMANOS:
    c = fuente_lav[lid]['contacto_mueble']
    assert abs(c['cx_mm']) <= 0.1 and abs(c['atras_mm']) <= 0.1 and abs(c['apoyo_mm'] - 480.0) <= 0.1, (lid, c)
    b_lav = manifest['basins'][lid]['bounds']
    b_vit = manifest['cabinets']['vitelli']['soder']['cerrado']['bounds']
    # En cámara frontal-3/4 izquierda, el lavamanos (630 mm) sobresale levemente o empata con Vitelli (624 mm).
    assert abs(b_lav[0] - b_vit[0]) <= 8 and abs(b_lav[2] - b_vit[2]) <= 12, (lid, b_lav, b_vit)
    informe['contacto_lavamanos'][lid] = {'contacto_mm': c, 'bounds_1600': b_lav, 'grifo_xy_mm': fuente_lav[lid]['grifo_xy_mm'],
                                          'grifo_deck_z_mm': fuente_lav[lid]['grifo_deck_z_mm']}

# ---- Hojas de revisión -------------------------------------------------------------------------
fuente = ImageFont.truetype('C:/Windows/Fonts/arial.ttf', 22)
orden = sorted(pares)
for amb, nombre, _ in AMBIENTES:
    hoja = Image.new('RGB', (5 * 540, 2 * 400), '#f3eee8')
    d = ImageDraw.Draw(hoja)
    for i, (mueble, lid) in enumerate(orden):
        im = compuestos[amb, mueble, lid].resize((540, 360), Image.Resampling.LANCZOS)
        x, y = (i % 5) * 540, (i // 5) * 400
        hoja.paste(im, (x, y + 40))
        d.text((x + 10, y + 8), f'{nombre}: {mueble.title()} + {lid.title()}', font=fuente, fill='#324354')
    hoja.save(REV / f'cruces-{amb}.png')
    compuestos[amb, 'vitelli', 'oslo'].save(REV / f'compuesto-{amb}-vitelli-oslo.png')
    compuestos[amb, 'tiziano', 'quadratto'].save(REV / f'compuesto-{amb}-tiziano-quadratto.png')

referenciados = {local(v['src']).name for v in manifest['basins'].values()}
for viejo in PUBLIC.glob('v4-lavamanos-*.webp'):
    if viejo.name not in referenciados:
        viejo.unlink()

MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding='utf-8')
(REV / 'validacion-capas-v4.json').write_text(json.dumps(informe, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps(informe['contorno_escena'], ensure_ascii=False, indent=1))
print(json.dumps(informe['bandas_sombra'], ensure_ascii=False))
print('PUBLICADO', len(pares), 'cruces x', len(AMBIENTES), 'ambientes')
