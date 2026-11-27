"""Valida un fondo generado contra el greybox v4 (única autoridad de geometría/cámara/luz).

python scripts/mix-match/validar-fondo-v4.py <moderno|calido> <fondo-generado.png> [--salida <dir>]

1. Normaliza el fondo a 1800x1200 (registra tamaño original y deformación de aspecto).
2. Para cada rasgo proyectado desde Blender (rasgos-v4.json: espejo, ventana, unión pared-piso,
   esquina, repisa, apliques, planta), toma los bordes Canny del greybox dentro de una banda y busca
   la traslación entera (±25 px) que mejor alinea los bordes del fondo (chamfer medio).
   desvío = |traslación óptima|; también mediana/p90 de distancia sin trasladar.
3. Rechaza si algún rasgo obligatorio tiene desvío > 3 px (meta del flujo) o mediana > 3 px.
Salida: <salida>/validacion-<amb>.json y superposicion-<amb>.png (bordes greybox en rojo, fondo en cian).
"""
import json
import sys
from pathlib import Path

import cv2
import numpy as np

ROOT = Path(__file__).resolve().parents[2]
DIR = ROOT / 'assets-fuente/generativo-63x48/ambientes-v4'
UMBRAL = 3.0
BANDA = 14
amb, fondo = sys.argv[1], Path(sys.argv[2])
salida = Path(sys.argv[sys.argv.index('--salida') + 1]) if '--salida' in sys.argv else DIR
rasgos = json.loads((DIR / 'rasgos-v4.json').read_text())[amb]

img = cv2.imread(str(fondo), cv2.IMREAD_COLOR)
h0, w0 = img.shape[:2]
# Normalización: 'recorte' = recorte central al aspecto 3:2 y escala uniforme (sin deformar);
# 'estirar' = redimensionar directo a 1800x1200.
modo = sys.argv[sys.argv.index('--normalizar') + 1] if '--normalizar' in sys.argv else 'estirar'
if modo == 'recorte':
    wc = min(w0, round(h0 * 1.5))
    hc = min(h0, round(w0 / 1.5))
    x0c, y0c = (w0 - wc) // 2, (h0 - hc) // 2
    img = img[y0c:y0c + hc, x0c:x0c + wc]
norm = cv2.resize(img, (1800, 1200), interpolation=cv2.INTER_AREA)
if '--guardar' in sys.argv:
    cv2.imwrite(sys.argv[sys.argv.index('--guardar') + 1], norm)
grey = cv2.imread(str(DIR / f'greybox-{amb}-vacio.png'), cv2.IMREAD_COLOR)


def bordes(im, lo, hi):
    g = cv2.GaussianBlur(cv2.cvtColor(im, cv2.COLOR_BGR2GRAY), (5, 5), 1.2)
    return cv2.Canny(g, lo, hi) > 0


eg = bordes(grey, 8, 24)
ef = bordes(norm, 30, 90)
dist = cv2.distanceTransform((~ef).astype(np.uint8), cv2.DIST_L2, 5)


def banda(nombre, r):
    """Líneas: franja de ±BANDA. Espejo: contorno ±BANDA. Objetos: rectángulo lleno + BANDA."""
    m = np.zeros((1200, 1800), np.uint8)
    if isinstance(r[0], list):
        cv2.line(m, tuple(int(round(v)) for v in r[0]), tuple(int(round(v)) for v in r[1]), 1, 2 * BANDA)
    else:
        x0, y0, x1, y1 = (int(round(v)) for v in r)
        if nombre == 'espejo':
            cv2.rectangle(m, (x0, y0), (x1, y1), 1, 2 * BANDA)
        else:
            m[max(0, y0 - BANDA):y1 + BANDA, max(0, x0 - BANDA):x1 + BANDA] = 1
    return m > 0


def perfil_linea(im, a, b, n=60, alcance=25):
    """Posición del máximo de gradiente perpendicular a la línea a-b en n muestras visibles."""
    g = cv2.GaussianBlur(cv2.cvtColor(im, cv2.COLOR_BGR2GRAY).astype(np.float32), (7, 7), 2)
    a, b = np.array(a, float), np.array(b, float)
    d = (b - a) / np.linalg.norm(b - a)
    nrm = np.array([-d[1], d[0]])
    off = []
    for t in np.linspace(0, 1, 400):
        p = a + (b - a) * t
        if not (alcance + 5 < p[0] < 1800 - alcance - 5 and alcance + 5 < p[1] < 1200 - alcance - 5):
            continue
        ks = np.arange(-alcance, alcance + 1)
        pts = p[None, :] + ks[:, None] * nrm[None, :]
        v = cv2.remap(g, pts[:, 0].astype(np.float32).reshape(1, -1), pts[:, 1].astype(np.float32).reshape(1, -1),
                      cv2.INTER_LINEAR).ravel()
        grad = np.abs(np.gradient(v))
        off.append(float(ks[int(np.argmax(grad))]) if grad.max() > 0.4 else np.nan)
    off = np.array(off)
    idx = np.linspace(0, len(off) - 1, min(n, len(off))).astype(int) if len(off) else []
    return off[idx] if len(off) else off


res, ok = {}, True
for nombre, r in rasgos.items():
    if isinstance(r[0], list):
        og, of = perfil_linea(grey, *r), perfil_linea(norm, *r)
        v = ~np.isnan(og) & ~np.isnan(of)
        if v.sum() < 8:
            res[nombre] = {'estado': 'NO MEDIDO', 'motivo': f'{int(v.sum())} muestras con borde en ambos'}
            ok = False
            continue
        dif = of[v] - og[v]
        desvio = float(abs(np.median(dif)))
        est = 'APROBADO' if desvio <= UMBRAL else 'FALLÓ'
        ok &= est == 'APROBADO'
        res[nombre] = {'metodo': 'perfil perpendicular (max gradiente)', 'desvio_px': round(desvio, 2),
                       'mediana_dif_px': round(float(np.median(dif)), 2),
                       'p90_abs_px': round(float(np.percentile(np.abs(dif), 90)), 2),
                       'muestras': int(v.sum()), 'estado': est}
        continue
    ys, xs = np.nonzero(eg & banda(nombre, r))
    if len(xs) < 30:
        res[nombre] = {'estado': 'NO MEDIDO', 'motivo': f'{len(xs)} pixeles de borde en el greybox'}
        continue
    mejor = None
    for dy in range(-25, 26):
        for dx in range(-25, 26):
            x, y = xs + dx, ys + dy
            v = (x >= 0) & (x < 1800) & (y >= 0) & (y < 1200)
            c = float(np.mean(np.minimum(dist[y[v], x[v]], 15)))
            if mejor is None or c < mejor[0]:
                mejor = (c, dx, dy)
    d0 = dist[ys, xs]
    desvio = float(np.hypot(mejor[1], mejor[2]))
    est = 'APROBADO' if desvio <= UMBRAL and np.median(d0) <= UMBRAL else 'FALLÓ'
    ok &= est == 'APROBADO'
    res[nombre] = {'desvio_px': round(desvio, 2), 'traslacion_optima': [mejor[1], mejor[2]],
                   'chamfer_medio_optimo': round(mejor[0], 2), 'mediana_px': round(float(np.median(d0)), 2),
                   'p90_px': round(float(np.percentile(d0, 90)), 2),
                   'pct_a_3px': round(100 * float(np.mean(d0 <= 3)), 1), 'puntos': int(len(xs)), 'estado': est}

sup = (norm * 0.55).astype(np.uint8)
sup[ef] = (255, 255, 0)
sup[eg] = (0, 0, 255)
cv2.imwrite(str(salida / f'superposicion-{amb}.png'), sup)
out = {'ambiente': amb, 'fondo': str(fondo.name), 'tamano_original': [w0, h0],
       'normalizacion': modo, 'aspecto_original_vs_3_2_pct': round(100 * ((w0 / h0) / 1.5 - 1), 3), 'meta_px': UMBRAL,
       'rasgos': res, 'resultado': 'APROBADO' if ok else 'FALLÓ'}
(salida / f'validacion-{amb}.json').write_text(json.dumps(out, indent=2, ensure_ascii=False), encoding='utf-8')
print(json.dumps(out, ensure_ascii=False))
