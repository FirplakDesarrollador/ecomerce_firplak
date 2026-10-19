// Prepara los renders del Mix & Match (Opcion B) para la web.
//
// Entrada: una carpeta con PNG con alfa nombrados `<mueble>__<lavamanos>.png`,
// todos con la misma camara (frente alto, fondo transparente).
//
// Por cada combinacion escribe:
//   <id>.webp       el render a 1200 px con transparencia
//   <id>-capa.webp  R = mascara de madera, G = luz sin veta (x128)
// La web multiplica cualquier textura de tablero por esa luz: un acabado nuevo
// no necesita renders nuevos.
//
// Las combinaciones que faltan se arman por capas: lavamanos de un render y
// mueble de otro, cortados en la tapa del mueble (misma camara en todos).
//
// Uso: node scripts/mix-match/preparar-opcion-b.mjs <carpeta-renders>
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const FUENTE = process.argv[2];
if (!FUENTE) {
  console.error('Uso: preparar-opcion-b.mjs <carpeta con mueble__lavamanos.png>');
  process.exit(1);
}
const SALIDA = 'public/images/muebles/opcion-b';
const META = 'components/banos-muebles/opcion-b/rendersMixMatch.ts';
const N = 1200;

const MUEBLES = ['curva', 'vitelli'];
const LAVAMANOS = ['ovalado', 'oslo', 'genova', 'parma', 'siena'];

const suave = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
function hsv(r, g, b) {
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
  const v = mx / 255, s = mx ? (mx - mn) / mx : 0;
  let h = 0;
  if (mx !== mn) {
    if (mx === r) h = ((g - b) / (mx - mn)) % 6; else if (mx === g) h = (b - r) / (mx - mn) + 2; else h = (r - g) / (mx - mn) + 4;
    h *= 60; if (h < 0) h += 360;
  }
  return [h, s, v];
}

const cargar = async (archivo) =>
  sharp(path.join(FUENTE, archivo)).resize(N, N, { kernel: 'lanczos3' }).ensureAlpha().toColourspace('srgb').raw().toBuffer();

// Madera: tonos calidos saturados (la cubierta es gris neutro y el grifo negro).
function mascaraMadera(px) {
  const m = new Float32Array(N * N);
  for (let i = 0; i < N * N; i++) {
    const [h, s, v] = hsv(px[i * 4], px[i * 4 + 1], px[i * 4 + 2]);
    const tono = suave(6, 14, h) * (1 - suave(48, 60, h));
    m[i] = (px[i * 4 + 3] / 255) * tono * suave(0.1, 0.2, s) * suave(0.04, 0.1, v);
  }
  return m;
}

// Primera fila (desde arriba) donde la madera cubre la mayor parte del ancho.
function costura(mask) {
  for (let y = 0; y < N; y++) {
    let w = 0;
    for (let x = Math.round(N * 0.33); x < Math.round(N * 0.83); x++) if (mask[y * N + x] > 0.5) w++;
    if (w > N * 0.25) return y;
  }
  throw new Error('No se encontro la tapa del mueble');
}

// Todo lo opaco bajo la tapa es el mueble (frentes, juntas y gola: madera en
// sombra). El color solo decide en la franja de la costura, donde se tocan el
// borde del lavamanos y la tapa; asi las vetas claras y poco saturadas de un
// tablero grisaceo no dejan huecos.
function mascaraMueble(px, corte) {
  const color = mascaraMadera(px);
  const m = new Float32Array(N * N);
  const banda = 8;
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const i = y * N + x;
      const a = px[i * 4 + 3] / 255;
      if (y < corte - banda) m[i] = 0;
      else if (y > corte + banda) m[i] = a;
      else m[i] = color[i];
    }
  }
  return m;
}

async function procesar(id, px) {
  const corte = costura(mascaraMadera(px));
  const mask = mascaraMueble(px, corte);
  const lum = Buffer.alloc(N * N);
  for (let i = 0; i < N * N; i++) lum[i] = Math.round(0.2126 * px[i * 4] + 0.7152 * px[i * 4 + 1] + 0.0722 * px[i * 4 + 2]);
  // La mediana borra la veta del render (lineas finas) y respeta bordes de panel.
  const med = await sharp(lum, { raw: { width: N, height: N, channels: 1 } }).median(11).extractChannel(0).raw().toBuffer();
  if (med.length !== N * N) throw new Error('mediana con canales de mas');
  const vals = [];
  for (let i = 0; i < N * N; i++) if (mask[i] > 0.9) vals.push(med[i]);
  vals.sort((a, b) => a - b);
  const ref = vals[Math.floor(vals.length * 0.55)];
  const capa = Buffer.alloc(N * N * 3);
  for (let i = 0; i < N * N; i++) {
    capa[i * 3] = Math.round(mask[i] * 255);
    capa[i * 3 + 1] = Math.min(255, Math.round((med[i] / ref) * 128));
  }
  await sharp(px, { raw: { width: N, height: N, channels: 4 } }).webp({ quality: 90, alphaQuality: 100 }).toFile(path.join(SALIDA, `${id}.webp`));
  await sharp(capa, { raw: { width: N, height: N, channels: 3 } }).webp({ lossless: true }).toFile(path.join(SALIDA, `${id}-capa.webp`));
  return { costura: corte };
}

fs.mkdirSync(SALIDA, { recursive: true });
const disponibles = new Set(fs.readdirSync(FUENTE).filter((f) => f.endsWith('.png')).map((f) => f.replace('.png', '')));
const pixeles = {};
for (const id of disponibles) pixeles[id] = await cargar(`${id}.png`);

// Cada lavamanos sale de UN solo render de referencia (el primero de esta
// lista que lo tenga) y se monta sobre cada mueble: asi, al cambiar de mueble
// el lavamanos no cambia ni de luz ni de posicion.
const PREFERENCIA_LAVAMANOS = ['vitelli', 'curva'];

const combos = {};
for (const m of MUEBLES) {
  for (const l of LAVAMANOS) {
    const id = `${m}__${l}`;
    const arriba = PREFERENCIA_LAVAMANOS.map((x) => `${x}__${l}`).find((k) => pixeles[k]);
    // Mueble: su propio render si existe; si no, cualquier render con ese mueble.
    const abajo = pixeles[id] ? id : Object.keys(pixeles).find((k) => k.startsWith(`${m}__`));
    if (!arriba || !abajo) { console.warn('Sin piezas para', id); continue; }
    const corte = costura(mascaraMadera(pixeles[abajo]));
    const px = Buffer.concat([pixeles[arriba].subarray(0, corte * N * 4), pixeles[abajo].subarray(corte * N * 4)]);
    const porCapas = !pixeles[id];
    if (porCapas) console.log(`${id}: sin render propio, armado por capas (${arriba} + ${abajo}, corte y=${corte})`);
    const r = await procesar(id, px);
    combos[id] = { ...r, porCapas };
  }
}

// Miniaturas de lavamanos: la parte superior de un render con ese lavamanos.
for (const l of LAVAMANOS) {
  const id = Object.keys(combos).find((k) => k.endsWith(`__${l}`) && !combos[k].porCapas);
  const corte = combos[id].costura;
  await sharp(path.join(SALIDA, `${id}.webp`))
    .extract({ left: Math.round(N * 0.12), top: 0, width: Math.round(N * 0.76), height: corte - 4 })
    .resize(380, null).webp({ quality: 88 }).toFile(path.join(SALIDA, `lavamanos-${l}.webp`));
}

const ts = `// GENERADO por scripts/mix-match/preparar-opcion-b.mjs. No editar a mano.
// costura: fila (px, sobre ${N}) donde empieza la tapa del mueble; separa las
// piezas "lavamanos" y "mueble" en la vista de piezas.

export const LADO_RENDER = ${N};

export const RENDERS_MIX_MATCH: Record<string, { costura: number; porCapas: boolean }> = ${JSON.stringify(combos, null, 2)};
`;
fs.mkdirSync(path.dirname(META), { recursive: true });
fs.writeFileSync(META, ts);

const kb = (f) => (fs.statSync(path.join(SALIDA, f)).size / 1024).toFixed(0);
for (const id of Object.keys(combos)) console.log(id.padEnd(18), 'render', kb(`${id}.webp`), 'KB · capa', kb(`${id}-capa.webp`), 'KB · costura', combos[id].costura);
