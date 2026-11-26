// Opción E · Mix & Match isométrico: prepara los renders iso para la web.
// Uso: node scripts/mix-match/preparar-opcion-e.mjs <carpeta-renders-iso> <carpeta-tableros>
//
// Cada render se separa en:
//   cuerpo  (mueble, por debajo del lavamanos)          <mueble>__<lavamanos|solo>__<estado>.webp
//   tapa    (lavamanos + grifería + lo que hay encima)  tapa__<lavamanos>__<grifo>.webp
// Así cualquier lavamanos con cualquiera de las dos griferías va sobre cualquier mueble.
// Capas (webp sin pérdida, RGB):
//   cuerpo: R madera, G plano (0 frente con veta horizontal, 255 costado con veta vertical); luz aparte (gris, x128)
//   tapa:   R lavamanos (gelcoat), G grifería, B 0
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';

const require = createRequire(path.resolve('package.json'));
const sharp = require('sharp');

const [FUENTE, TABLEROS] = process.argv.slice(2);
if (!FUENTE || !TABLEROS) {
  console.error('Uso: node scripts/mix-match/preparar-opcion-e.mjs <carpeta-renders-iso> <carpeta-tableros>');
  process.exit(1);
}
const SALIDA = path.resolve('public/images/muebles/opcion-e');
const N = 2000;
const MUEBLES = { vitelli: 'Vitelli', tucano: 'Tucano' };
const LAVAMANOS = { oslo: 'Oslo', genova: 'Genova', parma: 'Parma', siena: 'Siena' };
const ESTADOS = ['cerrado', 'abierto'];
/** Cada mueble trae renderizado un modelo de grifería: el Vitelli el bajo (níquel), el Tucano el alto (negro). */
const GRIFO_DE = { vitelli: 'bajo', tucano: 'alto' };
const ACABADOS = {
  'blanco-nevado': 'blanco nevado.jpg',
  tauari: 'Tauari.jpg',
  mali: 'Mali.jpg',
  nola: 'Nola.jpg',
  tambo: 'tambo o mitte.jpg',
  candelaria: 'candelaria blanco.jpg',
};

// Geometría medida sobre los renders de 2000 px (perfiles de borde; ver especificaciones/wiki/banos_muebles_opcion_e.md).
/** Arista vertical frente/costado del mueble y pendientes de las aristas horizontales. */
const ESQUINA_X = 1352;
const PENDIENTE_FRENTE = 0.197;
const PENDIENTE_COSTADO = -0.343;
const CAJONES = {
  tucano: [
    { frente: [[590, 758], [1339, 905.5], [1339, 1254.5], [590, 1107]], mueve: [-125.5, 48], escala: 1.008, centro: [964.5, 1004] },
    { frente: [[594, 1120], [1336, 1266], [1336, 1633], [594, 1487]], mueve: [-215.5, 100], escala: 1.009, centro: [965, 1380] },
  ],
  vitelli: [
    { frente: [[1011, 987], [1358, 1055], [1358, 1347], [1011, 1279]], mueve: [-117.5, 51], escala: 1.009, centro: [1184.5, 1170] },
    { frente: [[1011, 1303], [1355, 1371], [1355, 1648], [1011, 1580]], mueve: [-172.5, 80], escala: 1.009, centro: [1183, 1479] },
  ],
};
/** Puerta del Vitelli: bisagra (H) y canto libre (F), arriba y abajo, cerrada y abierta. */
const PUERTA = {
  cerrada: { ha: [566, 898], hb: [566, 1472], fa: [1008, 985], fb: [1008, 1559] },
  abierta: { ha: [605, 911], hb: [605, 1470], fa: [226, 1046], fb: [226, 1626] },
};
/** Zona de la grifería (para buscar sus píxeles). */
const ZONA_GRIFO = [1000, 300, 1620, 760];

const cargar = (f) => sharp(path.join(FUENTE, f)).ensureAlpha().toColourspace('srgb').raw({ depth: 'uchar' }).toBuffer();
const archivoCombo = (m, l, e) => `${LAVAMANOS[l]} iso - ${MUEBLES[m]} ${e} iso.png`;
const archivoSolo = (m, e) => `${MUEBLES[m]} ${e} iso.png`;

function hsv(r, g, b) {
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
  const v = mx / 255, s = mx ? (mx - mn) / mx : 0;
  let h = 0;
  if (mx !== mn) { if (mx === r) h = ((g - b) / (mx - mn)) % 6; else if (mx === g) h = (b - r) / (mx - mn) + 2; else h = (r - g) / (mx - mn) + 4; h *= 60; if (h < 0) h += 360; }
  return [h, s, v];
}
const suave = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const lum = (px, i) => 0.2126 * px[i * 4] + 0.7152 * px[i * 4 + 1] + 0.0722 * px[i * 4 + 2];
/** Madera: tonos cálidos saturados (los rieles, bisagras y la grifería son grises). Para encontrar el mueble. */
function madera(px, i) {
  const [h, s, v] = hsv(px[i * 4], px[i * 4 + 1], px[i * 4 + 2]);
  return (px[i * 4 + 3] / 255) * suave(8, 16, h) * (1 - suave(52, 64, h)) * suave(0.06, 0.12, s) * suave(0.03, 0.08, v);
}
/**
 * Madera del cuerpo: los frentes muy iluminados casi pierden la saturación, así que basta un tono
 * cálido leve; el metal (rieles, bisagras) es gris neutro o frío y el sifón es negro.
 */
function maderaCuerpo(px, i) {
  const [h, s, v] = hsv(px[i * 4], px[i * 4 + 1], px[i * 4 + 2]);
  return (px[i * 4 + 3] / 255) * suave(6, 14, h) * (1 - suave(58, 70, h)) * suave(0.028, 0.05, s) * suave(0.06, 0.12, v);
}

// 1. Encuadre común (alfa de todos los renders) y escala de salida 1:1.
let bx0 = N, by0 = N, bx1 = 0, by1 = 0;
const archivos = [];
for (const m of Object.keys(MUEBLES)) for (const e of ESTADOS) { archivos.push(archivoSolo(m, e)); for (const l of Object.keys(LAVAMANOS)) archivos.push(archivoCombo(m, l, e)); }
for (const f of archivos) {
  const px = await cargar(f);
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (px[(y * N + x) * 4 + 3] > 8) { if (x < bx0) bx0 = x; if (x > bx1) bx1 = x; if (y < by0) by0 = y; if (y > by1) by1 = y; }
}
const M = 12;
const CX = bx0 - M, CY = by0 - M, W = bx1 - bx0 + 1 + 2 * M, H = by1 - by0 + 1 + 2 * M;
const recortar = (px) => {
  const o = Buffer.alloc(W * H * 4);
  for (let y = 0; y < H; y++) px.copy(o, y * W * 4, ((y + CY) * N + CX) * 4, ((y + CY) * N + CX + W) * 4);
  return o;
};
const enRecorte = ([x, y]) => [+(x - CX).toFixed(1), +(y - CY).toFixed(1)];
console.log('encuadre', { CX, CY, W, H });

fs.mkdirSync(SALIDA, { recursive: true });
const guardarRGBA = (px, f, q = 88) => sharp(px, { raw: { width: W, height: H, channels: 4 } }).webp({ quality: q, alphaQuality: 100, effort: 6 }).toFile(path.join(SALIDA, f));
const guardarCapa = (c, f) => sharp(c, { raw: { width: W, height: H, channels: 3 } }).webp({ lossless: true, effort: 6 }).toFile(path.join(SALIDA, f));

async function medianaLum(px, radio) {
  const l = Buffer.alloc(W * H);
  for (let i = 0; i < W * H; i++) l[i] = Math.round(lum(px, i));
  const med = await sharp(l, { raw: { width: W, height: H, channels: 1 } }).median(radio).extractChannel(0).raw().toBuffer();
  if (med.length !== W * H) throw new Error('mediana con canales de más (bug 013)');
  return med;
}

// 2. Tapas: lavamanos + grifería de cada modelo, cortadas sobre el borde inferior del lavamanos.
const salidas = {};
const ALTO_LAVAMANOS = 650 - CY; // la madera del mueble siempre empieza por debajo de esta fila
const cortes = {};
for (const l of Object.keys(LAVAMANOS)) {
  const V = recortar(await cargar(archivoCombo('vitelli', l, 'cerrado')));
  const T = recortar(await cargar(archivoCombo('tucano', l, 'cerrado')));
  const corte = new Int32Array(W);
  for (let x = 0; x < W; x++) {
    let yw = -1, ultimo = -1, racha = 0;
    for (let y = 0; y < H; y++) {
      const i = y * W + x;
      if (V[i * 4 + 3] > 8 || T[i * 4 + 3] > 8) ultimo = y;
      if (yw < 0 && y >= ALTO_LAVAMANOS) {
        racha = madera(V, i) > 0.5 || madera(T, i) > 0.5 ? racha + 1 : 0;
        if (racha >= 4) yw = y - 3;
      }
    }
    corte[x] = yw >= 0 ? yw - 2 : ultimo >= 0 && ultimo < ALTO_LAVAMANOS + 260 ? ultimo + 1 : 0;
  }
  // Una columna suelta (canto del mueble sin madera detectada) no puede bajar el corte: mediana entre vecinas.
  const crudo = Int32Array.from(corte);
  for (let x = 0; x < W; x++) {
    if (crudo[x] === 0) continue;
    const v = [];
    for (let k = -7; k <= 7; k++) { const c = crudo[x + k]; if (c > 0) v.push(c); }
    v.sort((a, b) => a - b);
    corte[x] = Math.min(crudo[x], v[v.length >> 1]);
  }
  // El borde inferior del lavamanos son dos rectas (frente y costado). En los frentes muy claros la
  // madera no se detecta en grupos de columnas y el corte baja hasta media puerta (Génova): se
  // ajusta cada recta con las columnas buenas y ninguna columna puede quedar por debajo de ellas.
  const esquinaC = ESQUINA_X - CX;
  let xa = W, xb = -1;
  for (let x = 0; x < W; x++) if (corte[x] > 0) { if (x < xa) xa = x; if (x > xb) xb = x; }
  const recta = (x0, x1, pendiente) => {
    const cols = [];
    for (let x = x0; x <= x1; x++) if (corte[x] > 0) cols.push([x, corte[x]]);
    const r = cols.map(([x, y]) => y - pendiente * x).sort((a, b) => a - b);
    let a = r[Math.floor(r.length * 0.35)], b = pendiente;
    for (let it = 0; it < 3; it++) {
      const dentroR = cols.filter(([x, y]) => Math.abs(y - (a + b * x)) <= 3);
      const n = dentroR.length, sx = dentroR.reduce((s, [x]) => s + x, 0), sy = dentroR.reduce((s, [, y]) => s + y, 0);
      const sxx = dentroR.reduce((s, [x]) => s + x * x, 0), sxy = dentroR.reduce((s, [x, y]) => s + x * y, 0);
      b = (n * sxy - sx * sy) / (n * sxx - sx * sx);
      a = (sy - b * sx) / n;
    }
    return (x) => a + b * x;
  };
  const frenteR = recta(xa + 10, esquinaC - 15, PENDIENTE_FRENTE);
  const costadoR = recta(esquinaC + 15, xb - 10, PENDIENTE_COSTADO);
  let corregidas = 0;
  for (let x = 0; x < W; x++) {
    if (corte[x] <= 0) continue;
    const tope = Math.round(Math.min(frenteR(x), costadoR(x))) + 2;
    if (corte[x] > tope) { corte[x] = tope; corregidas++; }
  }
  console.log(`corte ${l}: ${corregidas} columnas ajustadas a las aristas`);
  cortes[l] = corte;

  // Grifería: el modelo alto es negro (Tucano); el bajo es lo que cambia entre los dos renders y no es lavamanos.
  const gx0 = ZONA_GRIFO[0] - CX, gy0 = ZONA_GRIFO[1] - CY, gx1 = ZONA_GRIFO[2] - CX, gy1 = ZONA_GRIFO[3] - CY;
  const mAlto = new Uint8Array(W * H), mBajo = new Uint8Array(W * H);
  for (let y = Math.max(0, gy0); y < gy1; y++) for (let x = gx0; x < gx1; x++) {
    const i = y * W + x;
    if (y >= corte[x]) continue;
    const lv = lum(V, i) * (V[i * 4 + 3] / 255), lt = lum(T, i) * (T[i * 4 + 3] / 255);
    // Negro mate: neutro y oscuro, también su canto iluminado (gris medio).
    const [, st] = hsv(T[i * 4], T[i * 4 + 1], T[i * 4 + 2]);
    const negroT = T[i * 4 + 3] > 120 && lt < 95;
    if (negroT || (T[i * 4 + 3] > 120 && lt < 150 && st < 0.12)) mAlto[i] = 1;
    const [, sv] = hsv(V[i * 4], V[i * 4 + 1], V[i * 4 + 2]);
    const lavamanosEnV = lv > 205 && sv < 0.06;
    const difiere = Math.abs(lv - lt) > 18 && !(lt < 95 && lv > 175) && (sv > 0.05 || V[i * 4 + 3] < 250 || lv < 150);
    // Donde los dos grifos se cruzan la diferencia es pequeña (níquel oscuro sobre negro): ahí es
    // grifo bajo todo lo que no sea gelcoat claro.
    const cruce = negroT && lv < 190;
    // Contra el fondo vacío del otro render todo lo que haya es grifo (también sus cantos oscuros).
    const fondoEnT = T[i * 4 + 3] < 60;
    if (V[i * 4 + 3] > 120 && (fondoEnT || (!lavamanosEnV && (difiere || cruce)))) mBajo[i] = 1;
  }
  const limpiar = async (m) => {
    // Cierre morfológico y relleno de huecos (los brillos del metal no son lavamanos).
    const img = Buffer.from(m.map((v) => v * 255));
    const c = await sharp(img, { raw: { width: W, height: H, channels: 1 } }).blur(1.2).threshold(90).extractChannel(0).raw().toBuffer();
    const fuera = new Uint8Array(W * H), pila = [];
    for (let x = gx0; x < gx1; x++) pila.push(Math.max(0, gy0) * W + x, (gy1 - 1) * W + x);
    for (let y = Math.max(0, gy0); y < gy1; y++) pila.push(y * W + gx0, y * W + gx1 - 1);
    while (pila.length) {
      const i = pila.pop(), x = i % W, y = (i / W) | 0;
      if (x < gx0 || x >= gx1 || y < Math.max(0, gy0) || y >= gy1 || fuera[i] || c[i] > 128) continue;
      fuera[i] = 1;
      pila.push(i + 1, i - 1, i + W, i - W);
    }
    for (let y = Math.max(0, gy0); y < gy1; y++) for (let x = gx0; x < gx1; x++) { const i = y * W + x; if (!fuera[i]) c[i] = 255; }
    return sharp(c, { raw: { width: W, height: H, channels: 1 } }).blur(0.7).extractChannel(0).raw().toBuffer();
  };
  const gAlto = await limpiar(mAlto), gBajo = await limpiar(mBajo);
  const salida = (g) => {
    let mx = W, sel = [];
    for (let i = 0; i < W * H; i++) if (g[i] > 128) { const x = i % W; if (x < mx) mx = x; }
    for (let i = 0; i < W * H; i++) if (g[i] > 128 && i % W < mx + 14) sel.push(i);
    const sx = sel.reduce((a, i) => a + (i % W), 0) / sel.length, sy = Math.max(...sel.map((i) => (i / W) | 0));
    return [+sx.toFixed(1), sy + 1];
  };
  for (const [modelo, src, g] of [['bajo', V, gBajo], ['alto', T, gAlto]]) {
    const tapa = Buffer.alloc(W * H * 4), capa = Buffer.alloc(W * H * 3);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      if (y >= corte[x]) continue;
      const i = y * W + x;
      src.copy(tapa, i * 4, i * 4, i * 4 + 4);
      const a = src[i * 4 + 3];
      capa[i * 3 + 1] = g[i];
      capa[i * 3] = a > 8 ? Math.round((a / 255) * (255 - g[i])) : 0;
    }
    await guardarRGBA(tapa, `tapa__${l}__${modelo}.webp`, 90);
    await guardarCapa(capa, `tapa__${l}__${modelo}-capa.webp`);
    (salidas[l] ??= {})[modelo] = salida(g);
  }
}

// 3. Cuerpos: mueble por debajo del lavamanos, con su capa de madera, luz y plano.
const ref = {};
const cajonesRecorte = {};
for (const m of Object.keys(MUEBLES)) {
  cajonesRecorte[m] = CAJONES[m].map((c) => ({ frente: c.frente.map(enRecorte), mueve: c.mueve, escala: c.escala, centro: enRecorte(c.centro) }));
  // referencia de luz: madera iluminada del mueble solo cerrado
  const soloC = recortar(await cargar(archivoSolo(m, 'cerrado')));
  const med = await medianaLum(soloC, 9);
  const vals = [];
  for (let i = 0; i < W * H; i++) if (maderaCuerpo(soloC, i) > 0.9) vals.push(med[i]);
  vals.sort((a, b) => a - b);
  ref[m] = vals[Math.floor(vals.length * 0.55)];
}

/** Dentro de un polígono (lista de [x, y] en coordenadas del recorte). */
function dentro(p, x, y) {
  let r = false;
  for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
    const [xi, yi] = p[i], [xj, yj] = p[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) r = !r;
  }
  return r;
}
/** Barrido de un frente abierto hacia el interior del mueble: el volumen visible del cajón. */
function barrido(c) {
  const abierto = c.frente.map(([x, y]) => [c.centro[0] + (x - c.centro[0]) * c.escala + c.mueve[0], c.centro[1] + (y - c.centro[1]) * c.escala + c.mueve[1]]);
  const atras = abierto.map(([x, y]) => [x - c.mueve[0], y - c.mueve[1]]);
  return { abierto, puntos: [...abierto, ...atras] };
}
function envolvente(pts) {
  const p = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cruz = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo = [], hi = [];
  for (const q of p) { while (lo.length >= 2 && cruz(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
  for (const q of p.reverse()) { while (hi.length >= 2 && cruz(hi[hi.length - 2], hi[hi.length - 1], q) <= 0) hi.pop(); hi.push(q); }
  return [...lo.slice(0, -1), ...hi.slice(0, -1)];
}

async function cuerpo(m, l, e) {
  const px = recortar(await cargar(l ? archivoCombo(m, l, e) : archivoSolo(m, e)));
  if (l) {
    const corte = cortes[l];
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (y < corte[x]) px.fill(0, (y * W + x) * 4, (y * W + x) * 4 + 4);
  }
  const med = await medianaLum(px, 9);
  const esquina = ESQUINA_X - CX;
  const cajasAbiertas = e === 'abierto' ? cajonesRecorte[m].map((c) => { const b = barrido(c); return { caja: envolvente(b.puntos), frente: b.abierto }; }) : [];
  const puertaAbierta = m === 'vitelli' && e === 'abierto' ? [PUERTA.abierta.ha, PUERTA.abierta.fa, PUERTA.abierta.fb, PUERTA.abierta.hb].map(enRecorte) : null;
  const capa = Buffer.alloc(W * H * 3), luz = Buffer.alloc(W * H);
  const peso = new Float32Array(W * H), plano = new Uint8Array(W * H);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = y * W + x;
    const mm = maderaCuerpo(px, i);
    if (mm <= 0) continue;
    capa[i * 3] = Math.round(mm * 15) * 17; // 16 niveles: borde suave, interior plano (comprime mucho mejor)
    const lv = lum(px, i), r = med[i] > 0 ? lv / med[i] : 1;
    // Las juntas (mucho más oscuras que su entorno) y los cantos con brillo se toman del render.
    peso[i] = Math.max(1 - suave(0.55, 0.82, r), suave(1.18, 1.4, r));
    const costado = x > esquina || (puertaAbierta && dentro(puertaAbierta, x, y)) || cajasAbiertas.some((c) => dentro(c.caja, x, y) && !dentro(c.frente, x, y));
    capa[i * 3 + 1] = costado ? 255 : 0;
    plano[i] = costado ? 2 : 1;
  }
  // Luz de cada cara: filtro recursivo que respeta bordes (transformada de dominio, Gastal y Oliveira).
  // Alisa la veta del roble renderizado (el blanco es un color plano) y se detiene en los cambios
  // fuertes de luz, en las juntas y entre planos, así no mezcla un frente iluminado con el interior.
  const guia = new Float32Array(W * H), lisa = new Float32Array(W * H);
  for (let i = 0; i < W * H; i++) { guia[i] = med[i]; lisa[i] = med[i]; }
  const corta = (i, j) => plano[i] !== plano[j] || !plano[i] || peso[i] >= 0.5 || peso[j] >= 0.5;
  const SIGMA_R = 14;
  for (let it = 0; it < 3; it++) {
    const sigmaS = 60 * Math.sqrt(3) * Math.pow(2, 2 - it) / Math.sqrt(Math.pow(4, 3) - 1);
    const a = Math.exp(-Math.SQRT2 / sigmaS);
    const paso = (i, j) => (corta(i, j) ? 0 : Math.pow(a, 1 + (sigmaS / SIGMA_R) * Math.abs(guia[i] - guia[j])));
    for (let y = 0; y < H; y++) {
      for (let x = 1; x < W; x++) { const i = y * W + x, w = paso(i, i - 1); lisa[i] += w * (lisa[i - 1] - lisa[i]); }
      for (let x = W - 2; x >= 0; x--) { const i = y * W + x, w = paso(i, i + 1); lisa[i] += w * (lisa[i + 1] - lisa[i]); }
    }
    for (let x = 0; x < W; x++) {
      for (let y = 1; y < H; y++) { const i = y * W + x, w = paso(i, i - W); lisa[i] += w * (lisa[i - W] - lisa[i]); }
      for (let y = H - 2; y >= 0; y--) { const i = y * W + x, w = paso(i, i + W); lisa[i] += w * (lisa[i + W] - lisa[i]); }
    }
  }
  for (let i = 0; i < W * H; i++) {
    if (!plano[i]) continue;
    const lv = lum(px, i);
    luz[i] = Math.min(255, Math.round(((lisa[i] * (1 - peso[i]) + lv * peso[i]) / ref[m]) * 128));
  }
  const id = `${m}__${l ?? 'solo'}__${e}`;
  await guardarRGBA(px, `${id}.webp`);
  await guardarCapa(capa, `${id}-capa.webp`);
  await sharp(luz, { raw: { width: W, height: H, channels: 1 } }).webp({ quality: 92, effort: 6 }).toFile(path.join(SALIDA, `${id}-luz.webp`));
}
for (const m of Object.keys(MUEBLES)) for (const e of ESTADOS) {
  await cuerpo(m, null, e);
  for (const l of Object.keys(LAVAMANOS)) await cuerpo(m, l, e);
}

// 4. Acabados del mueble: cuadrado central a 1024 px (la veta de los escaneos es vertical).
const muestras = {};
for (const [id, f] of Object.entries(ACABADOS)) {
  const img = sharp(path.join(TABLEROS, f), { limitInputPixels: false });
  const meta = await img.metadata();
  const lado = Math.min(meta.width, meta.height);
  const base = img.extract({ left: Math.floor((meta.width - lado) / 2), top: Math.floor((meta.height - lado) / 2), width: lado, height: lado });
  await base.clone().resize(1024, 1024).webp({ quality: 86 }).toFile(path.join(SALIDA, `acabado-${id}.webp`));
  await base.clone().resize(96, 96).webp({ quality: 80 }).toFile(path.join(SALIDA, `acabado-${id}-muestra.webp`));
  const { data } = await base.clone().resize(32, 32).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const s = [0, 0, 0];
  for (let i = 0; i < data.length; i += 3) { s[0] += data[i]; s[1] += data[i + 1]; s[2] += data[i + 2]; }
  muestras[id] = '#' + s.map((v) => Math.round(v / (data.length / 3)).toString(16).padStart(2, '0')).join('');
}

// 5. Datos para el navegador.
const ts = `// Generado por scripts/mix-match/preparar-opcion-e.mjs: no editar a mano.
// Coordenadas en píxeles de las imágenes de la Opción E (${W} × ${H}).
export const LIENZO_E = { ancho: ${W}, alto: ${H} } as const;
/** Arista frente/costado y pendientes de las aristas horizontales (para orientar la veta). */
export const ORIENTACION_E = { esquinaX: ${ESQUINA_X - CX}, pendienteFrente: ${PENDIENTE_FRENTE}, pendienteCostado: ${PENDIENTE_COSTADO} } as const;
export interface CajonE { frente: [number, number][]; mueve: [number, number]; escala: number; centro: [number, number] }
export const CAJONES_E: Record<'vitelli' | 'tucano', CajonE[]> = ${JSON.stringify(cajonesRecorte)};
export const PUERTA_E = ${JSON.stringify({ cerrada: Object.fromEntries(Object.entries(PUERTA.cerrada).map(([k, v]) => [k, enRecorte(v)])), abierta: Object.fromEntries(Object.entries(PUERTA.abierta).map(([k, v]) => [k, enRecorte(v)])) })} as const;
/** Boca de cada grifería (aireador) sobre cada lavamanos. */
export const SALIDA_GRIFO_E: Record<'oslo' | 'genova' | 'parma' | 'siena', Record<'bajo' | 'alto', [number, number]>> = ${JSON.stringify(salidas)};
export const GRIFO_RENDER_E = ${JSON.stringify(GRIFO_DE)} as const;
export const COLOR_ACABADO_E: Record<string, string> = ${JSON.stringify(muestras)};
`;
fs.writeFileSync(path.resolve('components/banos-muebles/opcion-e/rendersOpcionE.ts'), ts);
const total = fs.readdirSync(SALIDA).reduce((a, f) => a + fs.statSync(path.join(SALIDA, f)).size, 0);
console.log('listo', fs.readdirSync(SALIDA).length, 'archivos,', (total / 1024 / 1024).toFixed(1), 'MB', { salidas, muestras });
