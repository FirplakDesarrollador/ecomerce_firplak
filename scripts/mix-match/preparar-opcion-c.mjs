// Prepara los renders de la Opcion C (estudio Mix & Match) para la web.
//
// Entrada: una carpeta con PNG con alfa, misma camara frontal en todos:
//   <mueble>__<lavamanos>__cerrado.png   conjunto con puertas y cajones cerrados
//   <mueble>__<lavamanos>__abierto.png   el mismo conjunto abierto
//   <mueble>__solo__cerrado.png          el mueble sin lavamanos
//   <mueble>__solo__abierto.png
//   <mueble>__iso.png                    (opcional) vista 3/4 para "Por dentro"
//   <mueble>__<lavamanos>__referencia.png (opcional) foto suelta de un mueble que
//                                         aun no tiene la serie completa
//
// Por cada vista escribe <id>.webp (render a 1600 px) y <id>-capa.webp:
//   R = mascara del mueble (madera; sin bisagras, rieles ni sifon)
//   G = luz sin veta del mueble (x128) y, sobre el grifo, su luminancia limpia
//   B = mascara del grifo
// La web multiplica cualquier tablero por la luz (acabado nuevo = una textura)
// y recolorea el grifo (griferia de vista previa) sin renders nuevos.
//
// El lavamanos y el grifo del estado "abierto" se toman del render cerrado y la
// exposicion del abierto se iguala a la del cerrado: al abrir no salta nada.
//
// Uso: node scripts/mix-match/preparar-opcion-c.mjs <carpeta-renders>
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const FUENTE = process.argv[2];
if (!FUENTE) {
  console.error('Uso: preparar-opcion-c.mjs <carpeta con mueble__lavamanos__estado.png>');
  process.exit(1);
}
const SALIDA = 'public/images/muebles/opcion-c';
const META = 'components/banos-muebles/opcion-c/rendersOpcionC.ts';
const N = 1600;
const MUEBLES = ['vitelli'];
const LAVAMANOS = ['oslo', 'genova', 'parma', 'siena'];
const ESTADOS = ['cerrado', 'abierto'];
/** Una textura de tablero cubre ~70 cm; el mueble mide 63 cm de ancho. */
const CM_TEXTURA = 70;
const CM_MUEBLE = 63;

const suave = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
function hsv(r, g, b) {
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
  const v = mx / 255, s = mx ? (mx - mn) / mx : 0;
  let h = 0;
  if (mx !== mn) {
    if (mx === r) h = ((g - b) / (mx - mn)) % 6;
    else if (mx === g) h = (b - r) / (mx - mn) + 2;
    else h = (r - g) / (mx - mn) + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return [h, s, v];
}

const cargar = (archivo, lado = N) =>
  sharp(path.join(FUENTE, archivo))
    .resize(lado, lado, { kernel: 'lanczos3' })
    .ensureAlpha()
    .toColourspace('srgb')
    .raw({ depth: 'uchar' })
    .toBuffer();

const existe = (archivo) => fs.existsSync(path.join(FUENTE, archivo));
const lumDe = (px, i) => 0.2126 * px[i * 4] + 0.7152 * px[i * 4 + 1] + 0.0722 * px[i * 4 + 2];

// Madera: tonos calidos saturados (cubierta gris neutra, grifo y sifon negros,
// bisagras y rieles metalicos casi sin color).
function madera(px, i) {
  const [h, s, v] = hsv(px[i * 4], px[i * 4 + 1], px[i * 4 + 2]);
  return (px[i * 4 + 3] / 255) * suave(8, 16, h) * (1 - suave(52, 64, h)) * suave(0.06, 0.12, s) * suave(0.03, 0.08, v);
}

/** Primera fila (desde arriba) donde la madera cubre buena parte del ancho: la tapa del mueble. */
function costura(px) {
  for (let y = Math.round(N * 0.15); y < N; y++) {
    let w = 0;
    for (let x = Math.round(N * 0.33); x < Math.round(N * 0.83); x++) if (madera(px, y * N + x) > 0.5) w++;
    if (w > N * 0.25) return y;
  }
  throw new Error('No se encontro la tapa del mueble');
}

/** Caja de lo opaco, en fracciones del lado. */
function caja(px, y0 = 0, y1 = N) {
  let a = N, b = N, c = -1, d = -1;
  for (let y = y0; y < y1; y++)
    for (let x = 0; x < N; x++)
      if (px[(y * N + x) * 4 + 3] > 24) {
        if (x < a) a = x;
        if (x > c) c = x;
        if (y < b) b = y;
        if (y > d) d = y;
      }
  return [a / N, b / N, (c + 1) / N, (d + 1) / N].map((v) => Math.round(v * 10000) / 10000);
}

/** Luminancia media opaca de una franja: sirve para igualar exposiciones. */
function lumFranja(px, y0, y1) {
  let s = 0, n = 0;
  for (let y = y0; y < y1; y++)
    for (let x = Math.round(N * 0.25); x < Math.round(N * 0.75); x++) {
      const i = y * N + x;
      if (px[i * 4 + 3] > 250) { s += lumDe(px, i); n++; }
    }
  return s / n;
}

function igualarExposicion(px, factor, desde) {
  const o = Buffer.from(px);
  for (let i = desde * N; i < N * N; i++)
    for (let k = 0; k < 3; k++) o[i * 4 + k] = Math.min(255, Math.round(px[i * 4 + k] * factor));
  return o;
}

/** Arriba (lavamanos y grifo) de un render, abajo (mueble) de otro. */
const unir = (arriba, abajo, corte) => Buffer.concat([arriba.subarray(0, corte * N * 4), abajo.subarray(corte * N * 4)]);

// Cerrado: todo lo opaco bajo la tapa es mueble. La union con el lavamanos es
// una recta horizontal (camara frontal): corte limpio en esa fila; la linea de
// sombra de la junta queda del render.
function mascaraCerrado(px, corte) {
  const m = new Float32Array(N * N);
  for (let i = corte * N; i < N * N; i++) m[i] = px[i * 4 + 3] / 255;
  return m;
}

// Abierto: se ven bisagras, rieles y el sifon; decide el color (sobre una copia
// suavizada para que el grano del render no deje puntos). Lo que no se mueve al
// abrir (tapa, costados) conserva la mascara del cerrado: sus brillos de canto,
// poco saturados, no deben quedar fuera.
async function mascaraAbierto(px, corte, cerrado, mCerrado) {
  const suavizado = await sharp(px, { raw: { width: N, height: N, channels: 4 } }).blur(1.1).raw().toBuffer();
  const m = new Uint8Array(N * N);
  for (let i = corte * N; i < N * N; i++) {
    const v = madera(suavizado, i);
    m[i] = Math.round(Math.min(1, v * (px[i * 4 + 3] / 255 > 0.02 ? 1 : 0)) * 255);
  }
  // Mediana: borra puntos sueltos sin comerse los bordes de los tableros.
  const limpia = await sharp(m, { raw: { width: N, height: N, channels: 1 } }).median(5).extractChannel(0).raw().toBuffer();
  if (limpia.length !== N * N) throw new Error('mediana con canales de mas (bug 013)');
  const out = new Float32Array(N * N);
  for (let i = 0; i < N * N; i++) {
    out[i] = Math.min(limpia[i] / 255, px[i * 4 + 3] / 255);
    if (mCerrado[i] > 0.5 && px[i * 4 + 3] > 250 && cerrado[i * 4 + 3] > 250) {
      const d = Math.abs(px[i * 4] - cerrado[i * 4]) + Math.abs(px[i * 4 + 1] - cerrado[i * 4 + 1]) + Math.abs(px[i * 4 + 2] - cerrado[i * 4 + 2]);
      if (d < 24) out[i] = Math.max(out[i], mCerrado[i]);
    }
  }
  return out;
}

/**
 * Grifo: sobre la cubierta es lo unico opaco (una columna angosta); delante de
 * ella sigue esa columna mientras haya pixeles oscuros y neutros, y se detiene
 * donde termina la base. Asi no entran sombras ni bordes de la poceta.
 */
function mascaraGrifo(px, corte) {
  const opacos = (y) => {
    let w = 0;
    for (let x = 0; x < N; x++) if (px[(y * N + x) * 4 + 3] > 128) w++;
    return w;
  };
  let cubierta = -1;
  for (let y = 0; y < corte && cubierta < 0; y++) if (opacos(y) > N * 0.2) cubierta = y;
  let x0 = N, x1 = -1, y0 = N;
  for (let y = 0; y < cubierta - 2; y++) {
    const w = opacos(y);
    if (w === 0 || w > N * 0.08) continue;
    for (let x = 0; x < N; x++)
      if (px[(y * N + x) * 4 + 3] > 24) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
      }
  }
  if (x1 < 0) throw new Error('No se encontro el grifo');
  const m = new Float32Array(N * N);
  let y1 = y0, vacias = 0;
  for (let y = y0; y < corte && vacias < 4; y++) {
    let fila = 0;
    for (let x = x0 - 3; x <= x1 + 3; x++) {
      const i = y * N + x;
      const a = px[i * 4 + 3] / 255;
      if (a < 0.02) continue;
      if (y < cubierta) { m[i] = 1; fila++; continue; }
      const [, s, v] = hsv(px[i * 4], px[i * 4 + 1], px[i * 4 + 2]);
      const g = (1 - suave(0.3, 0.46, v)) * (1 - suave(0.22, 0.36, s));
      if (g > 0.05) { m[i] = g; fila++; }
    }
    if (fila > 0) { y1 = y; vacias = 0; } else vacias++;
  }
  return { m, caja: [x0 / N, y0 / N, (x1 + 1) / N, (y1 + 1) / N].map((v) => Math.round(v * 10000) / 10000) };
}

async function medianaLum(px, radio) {
  const lum = Buffer.alloc(N * N);
  for (let i = 0; i < N * N; i++) lum[i] = Math.round(lumDe(px, i));
  const med = await sharp(lum, { raw: { width: N, height: N, channels: 1 } }).median(radio).extractChannel(0).raw().toBuffer();
  if (med.length !== N * N) throw new Error('mediana con canales de mas (bug 013)');
  return med;
}

/** Referencia de luz: mediana de la madera iluminada del mueble solo cerrado. */
async function referenciaLuz(px, mask) {
  const med = await medianaLum(px, 9);
  const vals = [];
  for (let i = 0; i < N * N; i++) if (mask[i] > 0.9) vals.push(med[i]);
  vals.sort((a, b) => a - b);
  return vals[Math.floor(vals.length * 0.55)];
}

async function escribir(id, px, mask, ref, grifo) {
  // La mediana borra la veta; las juntas entre puertas y cajones (lineas mucho
  // mas oscuras que su entorno) y los cantos con brillo se toman del render.
  const med = await medianaLum(px, 9);
  const fina = grifo ? await medianaLum(px, 3) : null;
  const capa = Buffer.alloc(N * N * 3);
  for (let i = 0; i < N * N; i++) {
    capa[i * 3] = Math.round(mask[i] * 255);
    if (grifo && grifo.m[i] > 0) {
      capa[i * 3 + 1] = fina[i];
      capa[i * 3 + 2] = Math.round(grifo.m[i] * 255);
    } else {
      const l = lumDe(px, i);
      const r = med[i] > 0 ? l / med[i] : 1;
      const w = Math.max(1 - suave(0.55, 0.82, r), suave(1.18, 1.4, r));
      capa[i * 3 + 1] = Math.min(255, Math.round(((med[i] * (1 - w) + l * w) / ref) * 128));
    }
  }
  await sharp(px, { raw: { width: N, height: N, channels: 4 } }).webp({ quality: 90, alphaQuality: 100, effort: 6 }).toFile(path.join(SALIDA, `${id}.webp`));
  await sharp(capa, { raw: { width: N, height: N, channels: 3 } }).webp({ lossless: true, effort: 6 }).toFile(path.join(SALIDA, `${id}-capa.webp`));
}

fs.mkdirSync(SALIDA, { recursive: true });
const vistas = {};
let textura = null;

for (const mueble of MUEBLES) {
  // Mueble solo: da la referencia de luz y el encuadre de la textura.
  const soloC = await cargar(`${mueble}__solo__cerrado.png`);
  const soloA0 = await cargar(`${mueble}__solo__abierto.png`);
  const mSoloC = new Float32Array(N * N);
  for (let i = 0; i < N * N; i++) mSoloC[i] = soloC[i * 4 + 3] / 255;
  const ref = await referenciaLuz(soloC, mSoloC);

  const cortes = [];
  for (const l of LAVAMANOS) {
    const id = `${mueble}__${l}`;
    if (!existe(`${id}__cerrado.png`)) { console.warn('Falta', `${id}__cerrado.png`); continue; }
    const cerrado = await cargar(`${id}__cerrado.png`);
    const corte = costura(cerrado);
    cortes.push(corte);
    const grifo = mascaraGrifo(cerrado, corte);

    const mCerrado = mascaraCerrado(cerrado, corte);
    await escribir(`${id}__cerrado`, cerrado, mCerrado, ref, grifo);
    vistas[`${id}__cerrado`] = { costura: corte / N, caja: caja(cerrado), grifo: grifo.caja };

    if (existe(`${id}__abierto.png`)) {
      const abierto0 = await cargar(`${id}__abierto.png`);
      const franja = [corte + Math.round(N * 0.012), corte + Math.round(N * 0.06)];
      const factor = lumFranja(cerrado, ...franja) / lumFranja(abierto0, ...franja);
      const abierto = unir(cerrado, igualarExposicion(abierto0, factor, corte), corte);
      await escribir(`${id}__abierto`, abierto, await mascaraAbierto(abierto, corte, cerrado, mCerrado), ref, grifo);
      vistas[`${id}__abierto`] = { costura: corte / N, caja: caja(abierto), grifo: grifo.caja };
      console.log(`${id}: costura ${corte}, exposicion del abierto x${factor.toFixed(3)}`);
    }

    // Miniatura del lavamanos: la pieza de arriba del render cerrado.
    const [, gy0] = grifo.caja;
    const top = Math.max(0, Math.round(gy0 * N) - 10);
    await sharp(cerrado, { raw: { width: N, height: N, channels: 4 } })
      .extract({ left: Math.round(N * 0.16), top, width: Math.round(N * 0.68), height: corte - 2 - top })
      .resize(560, null)
      .webp({ quality: 88, alphaQuality: 100 })
      .toFile(path.join(SALIDA, `lavamanos-${l}.webp`));
  }

  // Igual que en los conjuntos: la franja de la tapa iguala la exposicion del abierto.
  const corteMedio = cortes.sort((a, b) => a - b)[Math.floor(cortes.length / 2)];
  const franja = [corteMedio + Math.round(N * 0.012), corteMedio + Math.round(N * 0.06)];
  const soloA = igualarExposicion(soloA0, lumFranja(soloC, ...franja) / lumFranja(soloA0, ...franja), 0);
  await escribir(`${mueble}__solo__cerrado`, soloC, mSoloC, ref, null);
  await escribir(`${mueble}__solo__abierto`, soloA, await mascaraAbierto(soloA, 0, soloC, mSoloC), ref, null);
  vistas[`${mueble}__solo__cerrado`] = { costura: corteMedio / N, caja: caja(soloC), grifo: null };
  vistas[`${mueble}__solo__abierto`] = { costura: corteMedio / N, caja: caja(soloA), grifo: null };

  // Encuadre de la textura: el frente del mueble (bajo la tapa) mide CM_MUEBLE.
  const [fx0, , fx1] = caja(soloC, corteMedio + 40, N);
  textura = { x0: fx0, ancho: Math.round(((fx1 - fx0) * CM_TEXTURA * 10000) / CM_MUEBLE) / 10000 };

  if (existe(`${mueble}__iso.png`)) {
    await sharp(path.join(FUENTE, `${mueble}__iso.png`)).trim({ threshold: 1 }).resize(1400, 1400, { fit: 'inside' })
      .webp({ quality: 88, alphaQuality: 100 }).toFile(path.join(SALIDA, `${mueble}-iso.webp`));
  }
}

// Fotos de referencia: muebles que aun no tienen la serie completa.
for (const f of fs.readdirSync(FUENTE).filter((x) => x.endsWith('__referencia.png'))) {
  const id = f.replace('.png', '');
  const px = await cargar(f);
  await sharp(px, { raw: { width: N, height: N, channels: 4 } }).trim({ threshold: 1 }).resize(1400, 1400, { fit: 'inside' })
    .webp({ quality: 88, alphaQuality: 100 }).toFile(path.join(SALIDA, `${id}.webp`));
  // Miniatura: solo el mueble, de la tapa hacia abajo.
  const corte = costura(px);
  const [x0, , x1, y1] = caja(px);
  await sharp(px, { raw: { width: N, height: N, channels: 4 } })
    .extract({ left: Math.round(x0 * N), top: corte, width: Math.round((x1 - x0) * N), height: Math.round(y1 * N) - corte })
    .resize(560, null).webp({ quality: 88, alphaQuality: 100 }).toFile(path.join(SALIDA, `${id.split('__')[0]}-miniatura.webp`));
}

const ts = `// GENERADO por scripts/mix-match/preparar-opcion-c.mjs. No editar a mano.
// Fracciones del lado del render (${N} px):
//   costura  fila donde empieza la tapa del mueble (separa lavamanos y mueble)
//   caja     [x0, y0, x1, y1] de lo opaco; encuadra las vistas "solo"
//   grifo    [x0, y0, x1, y1] del grifo; null si la vista no tiene grifo

export const LADO_RENDER_C = ${N};

/** Encuadre del tablero: x donde empieza el frente y ancho que cubre una textura (~${CM_TEXTURA} cm). */
export const TEXTURA_C = ${JSON.stringify(textura)};

export interface VistaRenderC {
  costura: number;
  caja: number[];
  grifo: number[] | null;
}

export const RENDERS_C: Record<string, VistaRenderC> = ${JSON.stringify(vistas, null, 2)};
`;
fs.mkdirSync(path.dirname(META), { recursive: true });
fs.writeFileSync(META, ts);

const kb = (f) => (fs.statSync(path.join(SALIDA, f)).size / 1024).toFixed(0);
for (const id of Object.keys(vistas)) console.log(id.padEnd(26), 'render', kb(`${id}.webp`), 'KB · capa', kb(`${id}-capa.webp`), 'KB');
