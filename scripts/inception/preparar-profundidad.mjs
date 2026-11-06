// Prepara los mapas de profundidad (Depth Anything, 1 = cerca) del loop Inception del baño.
// Uso: node scripts/inception/preparar-profundidad.mjs <prof-azul.png> <prof-bano.png>
// Salida: public/images/inception/bano-{azul,bano}-prof.webp y
//         components/landing-inception/profundidadBano.ts (profundidad de enfoque de cada placa).
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const require = createRequire(resolve('package.json'));
const sharp = require('sharp');

const [azul, bano] = process.argv.slice(2);
if (!azul || !bano) {
  console.error('Uso: node scripts/inception/preparar-profundidad.mjs <prof-azul.png> <prof-bano.png>');
  process.exit(1);
}

const LADO = 1024;
// Punto que no se mueve con el paralaje: el punto azul en el primer plano y el centro de la tina en el baño.
const ANCLAS = { azul: { x: 0.5011, y: 0.5016 }, bano: { x: 0.456, y: 0.58 } };

const foco = {};
for (const [id, archivo] of [['azul', azul], ['bano', bano]]) {
  // Un desenfoque leve evita que el paralaje deshilache los bordes de los objetos.
  const base = sharp(archivo).resize(LADO, LADO).greyscale().blur(1.6);
  await base.clone().webp({ quality: 90 }).toFile(resolve(`public/images/inception/bano-${id}-prof.webp`));
  const { data } = await base.clone().raw().toBuffer({ resolveWithObject: true });
  const a = ANCLAS[id];
  let suma = 0, n = 0;
  for (let dy = -6; dy <= 6; dy++) for (let dx = -6; dx <= 6; dx++) {
    const x = Math.round(a.x * LADO) + dx, y = Math.round(a.y * LADO) + dy;
    suma += data[y * LADO + x]; n++;
  }
  foco[id] = +(suma / n / 255).toFixed(3);
}

writeFileSync(
  resolve('components/landing-inception/profundidadBano.ts'),
  `// Generado por scripts/inception/preparar-profundidad.mjs: no editar a mano.\n` +
    `// Profundidad (0 lejos, 1 cerca) del punto que queda quieto en el paralaje de cada placa.\n` +
    `export const FOCO_PROFUNDIDAD = ${JSON.stringify(foco)} as const;\n`,
);
console.log('foco', foco);
