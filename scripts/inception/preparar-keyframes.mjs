// Prepara los keyframes del loop Inception (baño) para la web y mide la geometría real.
// Uso: node scripts/inception/preparar-keyframes.mjs <azul.png> <bano.png> <casa.png>
// Salida: public/images/inception/bano-{azul,bano,casa}.webp y
//         components/landing-inception/geometriaBano.ts (punto azul medido en el render).
import { createRequire } from 'node:module';
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const require = createRequire(resolve('package.json'));
const sharp = require('sharp');

const [azul, bano, casa] = process.argv.slice(2);
if (!azul || !bano || !casa) {
  console.error('Uso: node scripts/inception/preparar-keyframes.mjs <azul.png> <bano.png> <casa.png>');
  process.exit(1);
}

const SALIDA = resolve('public/images/inception');
mkdirSync(SALIDA, { recursive: true });

for (const [id, archivo] of [['azul', azul], ['bano', bano], ['casa', casa]]) {
  const meta = await sharp(archivo).metadata();
  if (meta.width !== meta.height) throw new Error(`${archivo} no es cuadrado (${meta.width}x${meta.height})`);
  // Un solo master: next/image genera los tamaños de móvil a partir de este.
  await sharp(archivo).resize(2048, 2048).webp({ quality: 84 }).toFile(`${SALIDA}/bano-${id}.webp`);
}

// Punto azul del mando de agua fría: píxeles azules saturados del render real.
const { data, info } = await sharp(azul).resize(2048, 2048).removeAlpha().raw().toBuffer({ resolveWithObject: true });
let sx = 0, sy = 0, n = 0, sr = 0, sg = 0, sb = 0;
for (let y = 0; y < info.height; y++) {
  for (let x = 0; x < info.width; x++) {
    const i = (y * info.width + x) * 3;
    const r = data[i], g = data[i + 1], b = data[i + 2];
    if (b > 110 && b - r > 60 && b - g > 40) {
      sx += x; sy += y; n++; sr += r; sg += g; sb += b;
    }
  }
}
if (n < 200) throw new Error(`No se encontró el punto azul (${n} px)`);
const hex = (v) => Math.round(v / n).toString(16).padStart(2, '0');
const punto = {
  x: +(sx / n / 2048).toFixed(4),
  y: +(sy / n / 2048).toFixed(4),
  radio: +(Math.sqrt(n / Math.PI) / 2048).toFixed(4),
  color: `#${hex(sr)}${hex(sg)}${hex(sb)}`,
};

writeFileSync(
  resolve('components/landing-inception/geometriaBano.ts'),
  `// Generado por scripts/inception/preparar-keyframes.mjs: no editar a mano.\n` +
    `// Coordenadas normalizadas (0-1) sobre la imagen del azul de 2048 px.\n` +
    `export const PUNTO_AZUL = ${JSON.stringify(punto)} as const;\n`,
);
console.log('punto azul', punto);
