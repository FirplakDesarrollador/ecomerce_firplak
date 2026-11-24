"""Publica capas del piloto, con nombres por contenido y prueba de independencia.

python scripts/mix-match/publicar-capas-piloto.py
Las composiciones de revisión quedan en assets-fuente; nunca se sirven como producto.
"""
import hashlib
import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / 'assets-fuente/generativo-63x48/piloto-capas'
PILOT = SOURCE.parent / 'piloto-ventana-calida-34'
PUBLIC = ROOT / 'public/images/muebles/capas-63x48'
PUBLIC.mkdir(exist_ok=True)


def publish(image, name, lossless=True):
    temporary = PUBLIC / (name + '.webp')
    image.save(temporary, lossless=lossless, quality=94, method=6)
    digest = hashlib.sha256(temporary.read_bytes()).hexdigest()[:12]
    destination = PUBLIC / f'{name}.{digest}.webp'
    temporary.replace(destination)
    return '/images/muebles/capas-63x48/' + destination.name


environment = Image.open(PILOT / 'fondo-A-placa.png').convert('RGB')
manifest = {
    'version': 2,
    'environment': {'id': 'ventana-calida-microcemento', 'src': publish(environment, 'ambiente', False),
                    'width': 1800, 'height': 1200},
    'product_frame': {'x': 585, 'y': 537.2218734025955, 'width': 630, 'height': 630,
                      'resolution': 1600},
    'shadow_frame': {'x': 0, 'y': 0, 'width': 1800, 'height': 1200},
    'basins': {}, 'cabinets': {}, 'verified_combinations': [],
    'compatibility_source': 'Matriz de compatibilidad BAÑOS 2025, páginas 1 y 3',
}
sinks, cabinets, shadows, composites = {}, {}, {}, {}
for basin in ['oslo', 'genova']:
    sinks[basin] = Image.open(SOURCE / f'lavamanos-{basin}-negro.png').convert('RGBA')
    manifest['basins'][basin] = {'src': publish(sinks[basin], 'lavamanos-' + basin), 'faucet': 'Negro',
                                'bounds': sinks[basin].getchannel('A').getbbox()}
baseline = np.asarray(Image.open(SOURCE / 'sombra-ambiente-vacio.png').getchannel('A'), dtype=np.float32) / 255
for cabinet in ['vitelli', 'tiziano']:
    cabinets[cabinet] = Image.open(SOURCE / f'{cabinet}-soder-cerrado.png').convert('RGBA')
    shadows[cabinet] = Image.new('RGBA', (1800, 1200), (0, 0, 0, 0))
    # Remove the greybox's own shadows: the generated empty environment already
    # contains its lighting. Only the cabinet's incremental shadow belongs here.
    alpha = np.asarray(Image.open(SOURCE / f'sombra-ambiente-{cabinet}.png').getchannel('A'), dtype=np.float32) / 255
    incremental = np.where(baseline < .995, np.clip((alpha - baseline) / np.maximum(1 - baseline, .005), 0, 1), 0)
    shadows[cabinet].putalpha(Image.fromarray(np.uint8(incremental * 255 + .5)))
    manifest['cabinets'][cabinet] = {'soder': {'cerrado': {
        'src': publish(cabinets[cabinet], cabinet + '-soder-cerrado'),
        'shadow': publish(shadows[cabinet], 'sombra-' + cabinet),
        'bounds': cabinets[cabinet].getchannel('A').getbbox(),
    }}}
    for basin in sinks:
        manifest['verified_combinations'].append({'mueble': cabinet, 'lavamanos': basin,
                                                  'acabado': 'soder', 'estado': 'cerrado'})
        composite = Image.open(SOURCE / 'ambiente-vacio.png').convert('RGBA')
        frame = manifest['product_frame']
        box = (frame['x'], frame['y'], frame['x'] + frame['width'], frame['y'] + frame['height'])
        review_shadow = shadows[cabinet].resize((1600, 1600), Image.Resampling.LANCZOS, box=box)
        for layer in [review_shadow, cabinets[cabinet], sinks[basin]]:
            composite.alpha_composite(layer)
        composites[cabinet, basin] = composite.convert('RGB')
        composite.convert('RGB').save(SOURCE / f'revision-{cabinet}-{basin}.png')

report = {'source': 'OBJ Tiziano proporcionado por el usuario; GLB Vitelli existente',
          'verified_pairs': len(composites), 'new_generation_credits': 0,
          'background_change_outside_product_and_shadow': {}, 'sink_swap_change_outside_sink': {}}
for cabinet in cabinets:
    a, b = [np.asarray(composites[cabinet, basin], dtype=int) for basin in sinks]
    union = np.logical_or.reduce([np.asarray(s.getchannel('A')) > 0 for s in sinks.values()])
    difference = int(np.abs(a - b)[~union].max())
    assert difference == 0, (cabinet, difference)
    report['sink_swap_change_outside_sink'][cabinet] = difference
    alpha = np.asarray(cabinets[cabinet].getchannel('A'))
    assert (alpha == 0).any() and (alpha == 255).any()
    assert not alpha[:300].any(), 'La capa de mueble contiene la grifería'
    for basin, sink in sinks.items():
        frame = manifest['product_frame']
        box = (frame['x'], frame['y'], frame['x'] + frame['width'], frame['y'] + frame['height'])
        review_shadow = shadows[cabinet].resize((1600, 1600), Image.Resampling.LANCZOS, box=box)
        occupied = (alpha > 0) | (np.asarray(review_shadow.getchannel('A')) > 0) | (np.asarray(sink.getchannel('A')) > 0)
        difference = int(np.abs(np.asarray(composites[cabinet, basin], dtype=int) - np.asarray(Image.open(SOURCE / 'ambiente-vacio.png').convert('RGB'), dtype=int))[~occupied].max())
        assert difference == 0
        report['background_change_outside_product_and_shadow'][cabinet + '-' + basin] = difference

font = ImageFont.truetype('C:/Windows/Fonts/arial.ttf', 24)
sheet = Image.new('RGB', (1440, 1540), '#f3eee8')
draw = ImageDraw.Draw(sheet)
for i, ((cabinet, basin), image) in enumerate(composites.items()):
    x, y = (i % 2) * 720, (i // 2) * 770
    draw.text((x + 20, y + 12), f'{cabinet.title()} Soder + {basin.title()} | 63 x 48', font=font, fill='#324354')
    sheet.paste(image.resize((720, 720), Image.Resampling.LANCZOS), (x, y + 50))
sheet.save(SOURCE / 'revision-cuatro-combinaciones.png')
order = [('vitelli', 'oslo'), ('tiziano', 'oslo'), ('tiziano', 'genova'), ('vitelli', 'genova')]
frames = [composites[key].resize((720, 720), Image.Resampling.LANCZOS) for key in order]
palette_sheet = Image.new('RGB', (len(frames) * 720, 720))
for i, frame in enumerate(frames):
    palette_sheet.paste(frame, (i * 720, 0))
palette = palette_sheet.quantize(colors=256, dither=Image.Dither.NONE)
frames = [frame.quantize(palette=palette, dither=Image.Dither.NONE) for frame in frames]
frames[0].save(SOURCE / 'revision-intercambio-cuatro.gif', save_all=True, append_images=frames[1:], duration=1500, loop=0, disposal=2)
(PUBLIC / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding='utf-8')
(SOURCE / 'validacion-cuatro-combinaciones.json').write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps(report, ensure_ascii=False, indent=2))
