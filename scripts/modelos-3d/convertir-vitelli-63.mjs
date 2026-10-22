// Convierte el FBX del mueble Vitelli 63 (mix & match) en un GLB para la web.
//
// 1. Chromium headless carga convertir-vitelli-63.html, que reorganiza el FBX
//    con three.js y lo exporta a GLB (ver comentarios alli).
// 2. optimizar-glb.mjs (proceso aparte) lo optimiza: simplificacion de
//    herrajes ocultos, cuantizacion y compresion meshopt.
// 3. Escribe el GLB, las miniaturas de los lavamanos y los metadatos de la
//    escena (pivote de puerta, recorrido de cajones, ajustes por lavamanos).
//
// Uso: node scripts/modelos-3d/convertir-vitelli-63.mjs [ruta.fbx]
import http from 'http';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { execFileSync } from 'child_process';
import sharp from 'sharp';
import { chromium } from 'playwright';

const FBX = process.argv[2] ?? 'C:/Users/Rik/OneDrive/Escritorio/Vitelli con micx and macht.fbx';
const RAIZ = process.cwd();
const GLB_SALIDA = 'public/models/muebles/vitelli-63.glb';
const MINIATURAS = 'public/images/muebles/vitelli-63/lavamanos';
const RIG_SALIDA = 'components/banos-muebles/opcion-a/vitelliRig.ts';

// Piezas que casi no se ven (dentro del mueble): se simplifican fuerte.
const SIMPLIFICAR = [
  { patron: '_bisagra_', ratio: 0.2 },
  { patron: '_riel_', ratio: 0.5 },
  { patron: '_sifon_', ratio: 0.25 },
];

const TIPOS = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript' };
const servidor = http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  const archivo = url === '/modelo.fbx' ? FBX : path.join(RAIZ, url);
  fs.readFile(archivo, (err, data) => {
    if (err) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'Content-Type': TIPOS[path.extname(archivo)] ?? 'application/octet-stream' });
    res.end(data);
  });
}).listen(0);

const navegador = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const pagina = await navegador.newPage();
pagina.on('pageerror', (e) => console.error('pagina:', e.message));
await pagina.goto(`http://localhost:${servidor.address().port}/scripts/modelos-3d/convertir-vitelli-63.html`);
await pagina.waitForFunction(() => window.listo === true);
const { glb, meta } = await pagina.evaluate(() => window.convertir('/modelo.fbx'));
const minis = await pagina.evaluate(() => window.miniaturas());
await navegador.close();
servidor.close();

// Optimizacion en proceso aparte (ver optimizar-glb.mjs).
const crudo = path.join(os.tmpdir(), 'vitelli-63-crudo.glb');
fs.writeFileSync(crudo, Buffer.from(glb, 'base64'));
console.log(execFileSync(process.execPath, [
  'scripts/modelos-3d/optimizar-glb.mjs', crudo, GLB_SALIDA, JSON.stringify(SIMPLIFICAR),
], { encoding: 'utf8' }).trim());
fs.rmSync(crudo);

fs.mkdirSync(MINIATURAS, { recursive: true });
for (const [id, dataUrl] of Object.entries(minis)) {
  const png = Buffer.from(dataUrl.split(',')[1], 'base64');
  await sharp(png).trim({ threshold: 1 }).resize(480, 320, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ quality: 88 }).toFile(path.join(MINIATURAS, `${id}.webp`));
}

const rig = `// GENERADO por scripts/modelos-3d/convertir-vitelli-63.mjs a partir del FBX
// "Vitelli mix & match". No editar a mano: volver a correr el script.
// Unidades en metros; origen en la pared, base del mueble y centro del ancho.

export const VITELLI_RIG = ${JSON.stringify(meta, null, 2)} as const;
`;
fs.mkdirSync(path.dirname(RIG_SALIDA), { recursive: true });
fs.writeFileSync(RIG_SALIDA, rig);

console.log('Miniaturas:', Object.keys(minis).join(', '));
console.log(JSON.stringify(meta, null, 2));
