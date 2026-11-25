"""Agrega lavamanos 63x48 renderizados desde STL al manifiesto del piloto, sin tocar lo aprobado.

python scripts/mix-match/publicar-capas-lavamanos-nuevos.py

No re-ejecuta publicar-capas-piloto.py: ese script vuelve a codificar ambiente, muebles
y sombras y podría cambiar sus huellas. Aquí solo se publican las capas nuevas (WebP
sin pérdida con huella de contenido) y se agregan los cruces confirmados en firplak.com.
Es idempotente: si una capa ya está publicada con la misma huella, no cambia nada.
Controles: cambiar el lavamanos no altera ningún píxel fuera de los lavamanos, y el
ambiente queda idéntico fuera de producto y sombra, para cada cruce publicado.
"""
import hashlib
import io
import json
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / 'assets-fuente/generativo-63x48/piloto-capas'
PUBLIC = ROOT / 'public/images/muebles/capas-63x48'
MANIFEST = PUBLIC / 'manifest.json'
URL = '/images/muebles/capas-63x48/'

FUENTE_MATRIZ = 'Matriz de compatibilidad BAÑOS 2025, páginas 1 y 3'
NUEVOS = ['bari', 'siena', 'trentino', 'quadratto']
# Solo cruces publicados en firplak.com 63x48. Tiziano+Quadratto lo aprobó el usuario el
# 2026-11-24 (VIBEWORKFLOW lo marcaba no ofrecible); Vitelli+Quadratto y Tiziano+Bari no se ofrecen.
CRUCES = [('vitelli', 'bari'), ('vitelli', 'siena'), ('vitelli', 'trentino'),
          ('tiziano', 'siena'), ('tiziano', 'trentino'), ('tiziano', 'quadratto')]
PROHIBIDOS = {('vitelli', 'quadratto'), ('tiziano', 'bari')}
CONSULTA = {('tiziano', 'quadratto'): '2026-11-24'}
NOMBRES = {'vitelli': 'VITELLI', 'tiziano': 'TIZIANO', 'bari': 'BARI', 'siena': 'SIENA',
           'trentino': 'TRENTINO', 'quadratto': 'QUADRATTO'}


def fuente_web(mueble, lavamanos):
    return (f'firplak.com, LAVAMANOS {NOMBRES[lavamanos]} + MUEBLE {NOMBRES[mueble]} 63X48, '
            f'consultado {CONSULTA.get((mueble, lavamanos), "2026-11-23")}')


def publish(image, name):
    buffer = io.BytesIO()
    image.save(buffer, 'WEBP', lossless=True, quality=94, method=6)
    data = buffer.getvalue()
    digest = hashlib.sha256(data).hexdigest()[:12]
    destination = PUBLIC / f'{name}.{digest}.webp'
    if not destination.exists():
        destination.write_bytes(data)
    return URL + destination.name


def local(src):
    return PUBLIC / src.removeprefix(URL)


manifest = json.loads(MANIFEST.read_text(encoding='utf-8'))
antes = json.dumps({k: manifest[k] for k in ['environment', 'cabinets', 'product_frame', 'shadow_frame']},
                   sort_keys=True)
basins_antes = {k: dict(v) for k, v in manifest['basins'].items() if k not in NUEVOS}

for basin in NUEVOS:
    layer = Image.open(SOURCE / f'lavamanos-{basin}-negro.png').convert('RGBA')
    assert layer.size == (1600, 1600)
    src = publish(layer, 'lavamanos-' + basin)
    # Sin pérdida: alfa idéntico y color idéntico donde se ve (el WebP descarta el RGB bajo alfa 0).
    served, original = np.asarray(Image.open(local(src)).convert('RGBA')), np.asarray(layer)
    assert (served[..., 3] == original[..., 3]).all()
    assert (served == original)[original[..., 3] > 0].all()
    manifest['basins'][basin] = {'src': src, 'faucet': 'Negro', 'bounds': list(layer.getchannel('A').getbbox())}

for combo in manifest['verified_combinations']:
    combo.setdefault('fuente', FUENTE_MATRIZ)
existentes = {(c['mueble'], c['lavamanos']) for c in manifest['verified_combinations']}
for mueble, lavamanos in CRUCES:
    if (mueble, lavamanos) not in existentes:
        manifest['verified_combinations'].append({'mueble': mueble, 'lavamanos': lavamanos, 'acabado': 'soder',
                                                  'estado': 'cerrado', 'fuente': fuente_web(mueble, lavamanos)})
manifest['compatibility_source'] = FUENTE_MATRIZ + '; Bari, Siena, Trentino y Quadratto: firplak.com (ver fuente por cruce)'

pares = {(c['mueble'], c['lavamanos']) for c in manifest['verified_combinations']}
assert not pares & PROHIBIDOS, pares & PROHIBIDOS
assert len(pares) == 10, sorted(pares)
assert antes == json.dumps({k: manifest[k] for k in ['environment', 'cabinets', 'product_frame', 'shadow_frame']},
                           sort_keys=True)
for basin, valor in basins_antes.items():
    assert manifest['basins'][basin] == valor, basin

# Controles de independencia con los archivos realmente servidos.
frame = manifest['product_frame']
box = (frame['x'], frame['y'], frame['x'] + frame['width'], frame['y'] + frame['height'])
empty = Image.open(SOURCE / 'ambiente-vacio.png').convert('RGBA')
empty_rgb = np.asarray(empty.convert('RGB'), dtype=int)
sinks = {b: Image.open(local(v['src'])).convert('RGBA') for b, v in manifest['basins'].items()}
report = {'source': 'Capas STL de Autodesk Fusion renderizadas en la escena aprobada (fuente-lavamanos-stl.json)',
          'new_basins': NUEVOS, 'verified_pairs': len(pares), 'new_generation_credits': 0,
          'approved_assets_unchanged': True, 'pairs': {},
          'sink_swap_change_outside_sink': {}, 'background_change_outside_product_and_shadow': {}}
for mueble, piezas in manifest['cabinets'].items():
    capa = piezas['soder']['cerrado']
    cabinet = Image.open(local(capa['src'])).convert('RGBA')
    shadow = Image.open(local(capa['shadow'])).convert('RGBA').resize((1600, 1600), Image.Resampling.LANCZOS, box=box)
    cabinet_alpha = np.asarray(cabinet.getchannel('A'))
    shadow_alpha = np.asarray(shadow.getchannel('A'))
    suyos = [l for (m, l) in sorted(pares) if m == mueble]
    composites = {}
    for basin in suyos:
        composite = empty.copy()
        for layer in [shadow, cabinet, sinks[basin]]:
            composite.alpha_composite(layer)
        composites[basin] = np.asarray(composite.convert('RGB'), dtype=int)
        occupied = (cabinet_alpha > 0) | (shadow_alpha > 0) | (np.asarray(sinks[basin].getchannel('A')) > 0)
        difference = int(np.abs(composites[basin] - empty_rgb)[~occupied].max())
        assert difference == 0, (mueble, basin, difference)
        report['background_change_outside_product_and_shadow'][f'{mueble}-{basin}'] = difference
        report['pairs'][f'{mueble}-{basin}'] = next(c['fuente'] for c in manifest['verified_combinations']
                                                    if (c['mueble'], c['lavamanos']) == (mueble, basin))
    union = np.logical_or.reduce([np.asarray(sinks[b].getchannel('A')) > 0 for b in suyos])
    for a in suyos:
        for b in suyos:
            if a < b:
                difference = int(np.abs(composites[a] - composites[b])[~union].max())
                assert difference == 0, (mueble, a, b, difference)
                report['sink_swap_change_outside_sink'][f'{mueble}:{a}->{b}'] = difference

MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding='utf-8')
(SOURCE / 'validacion-cruces-stl.json').write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps(report, ensure_ascii=False, indent=2))
