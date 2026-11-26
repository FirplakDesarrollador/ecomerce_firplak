// Prepara el capítulo Lavamanos del loop Inception: imágenes para la web, mapas de profundidad
// y la profundidad de enfoque de cada placa.
// Uso: node scripts/inception/preparar-lavamanos.mjs <cerrado.png> <abierto.png> <grifo.png> <prof-cerrado.png> <prof-grifo.png>
//   <grifo.png>: recorte del render cerrado (x 860, y 290, lado 360 sobre 1612 px) ampliado a 2048.
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const require = createRequire(resolve('package.json'));
const sharp = require('sharp');

const [cerrado, abierto, grifo, profCerrado, profGrifo] = process.argv.slice(2);
if (!cerrado || !abierto || !grifo || !profCerrado || !profGrifo) {
  console.error('Uso: node scripts/inception/preparar-lavamanos.mjs <cerrado> <abierto> <grifo> <prof-cerrado> <prof-grifo>');
  process.exit(1);
}

const SALIDA = resolve('public/images/inception');
mkdirSync(SALIDA, { recursive: true });
for (const [id, archivo] of [['cerrado', cerrado], ['abierto', abierto], ['grifo', grifo]]) {
  await sharp(archivo).resize(2048, 2048).webp({ quality: 84 }).toFile(`${SALIDA}/lav-${id}.webp`);
}

// Punto que queda quieto en el paralaje: el lavabo en el mueble y la salida del grifo en el primer plano.
const ANCLAS = { lav: { archivo: profCerrado, x: 0.611, y: 0.323 }, grifo: { archivo: profGrifo, x: 0.412, y: 0.468 } };
const LADO = 1024;
const foco = {};
for (const [id, a] of Object.entries(ANCLAS)) {
  const base = sharp(a.archivo).resize(LADO, LADO).greyscale().blur(1.6);
  await base.clone().webp({ quality: 90 }).toFile(`${SALIDA}/lav-${id}-prof.webp`);
  const { data } = await base.clone().raw().toBuffer({ resolveWithObject: true });
  let suma = 0, n = 0;
  for (let dy = -6; dy <= 6; dy++) for (let dx = -6; dx <= 6; dx++) {
    suma += data[(Math.round(a.y * LADO) + dy) * LADO + Math.round(a.x * LADO) + dx]; n++;
  }
  foco[id] = +(suma / n / 255).toFixed(3);
}

writeFileSync(
  resolve('components/landing-inception/profundidadLavamanos.ts'),
  `// Generado por scripts/inception/preparar-lavamanos.mjs: no editar a mano.\n` +
    `// Profundidad (0 lejos, 1 cerca) del punto que queda quieto en el paralaje de cada placa.\n` +
    `export const FOCO_LAVAMANOS = ${JSON.stringify(foco)} as const;\n`,
);
console.log('foco', foco);
