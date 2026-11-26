// Analiza un clip "vivo" de cámara fija antes de componerlo: ¿la cámara quedó quieta (desplazamiento
// contra el keyframe)? ¿qué se mueve (mapa de movimiento)? Deja una hoja con cuadros y el mapa.
// Uso: node scripts/inception/analizar-placa.mjs <clip.mp4> <keyframe.png> <prefijo_salida>
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { mkdirSync, readdirSync } from 'node:fs';
const require = createRequire(new URL('../../package.json', import.meta.url));
const sharp = require('sharp');

const [clip, key, pref] = process.argv.slice(2);
const dir = `${pref}_cuadros`;
mkdirSync(dir, { recursive: true });
execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', clip, '-vf', 'fps=3,scale=512:512', `${dir}/f_%03d.png`]);
const archivos = readdirSync(dir).filter((f) => f.startsWith('f_')).sort();
const N = 512;
const leer = async (f) => sharp(f).resize(N, N).removeAlpha().raw().toBuffer();
const ref = await leer(key);
const cuadros = await Promise.all(archivos.map((f) => leer(`${dir}/${f}`)));

function dif(a, b, dx = 0, dy = 0) {
  let e = 0, n = 0;
  for (let y = 40; y < N - 40; y += 2) for (let x = 40; x < N - 40; x += 2) {
    const i = (y * N + x) * 3, j = ((y + dy) * N + (x + dx)) * 3;
    e += Math.abs(a[i] - b[j]) + Math.abs(a[i + 1] - b[j + 1]) + Math.abs(a[i + 2] - b[j + 2]); n++;
  }
  return e / n / 3;
}
const informe = [];
for (let k = 0; k < cuadros.length; k += Math.max(1, Math.floor(cuadros.length / 8))) {
  let mejor = { e: 1e9, dx: 0, dy: 0 };
  for (let dy = -6; dy <= 6; dy += 2) for (let dx = -6; dx <= 6; dx += 2) { const e = dif(ref, cuadros[k], dx, dy); if (e < mejor.e) mejor = { e, dx, dy }; }
  informe.push(`t=${(k / 3).toFixed(1)}s dif=${dif(ref, cuadros[k]).toFixed(1)} mejorDesp=(${mejor.dx},${mejor.dy})->${mejor.e.toFixed(1)}`);
}
console.log(informe.join('\n'));

const mov = Buffer.alloc(N * N);
for (let p = 0; p < N * N; p++) {
  let s = 0, s2 = 0;
  for (const c of cuadros) { const l = 0.3 * c[p * 3] + 0.59 * c[p * 3 + 1] + 0.11 * c[p * 3 + 2]; s += l; s2 += l * l; }
  const m = s / cuadros.length; mov[p] = Math.min(255, Math.sqrt(Math.max(0, s2 / cuadros.length - m * m)) * 8);
}
await sharp(mov, { raw: { width: N, height: N, channels: 1 } }).png().toFile(`${pref}_movimiento.png`);

const elegidos = [0, Math.floor(cuadros.length / 3), Math.floor((2 * cuadros.length) / 3), cuadros.length - 1];
const tiles = [await sharp(key).resize(380, 380).toBuffer(), ...(await Promise.all(elegidos.map((k) => sharp(`${dir}/${archivos[k]}`).resize(380, 380).toBuffer()))), await sharp(`${pref}_movimiento.png`).resize(380, 380).toBuffer()];
await sharp({ create: { width: 380 * 3 + 40, height: 380 * 2 + 30, channels: 3, background: '#222' } })
  .composite(tiles.map((input, i) => ({ input, left: 10 + (i % 3) * 390, top: 10 + Math.floor(i / 3) * 390 })))
  .jpeg({ quality: 85 }).toFile(`${pref}_hoja.jpg`);
console.log('hoja lista');
