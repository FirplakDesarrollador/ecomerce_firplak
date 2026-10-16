// Prepara las 5 texturas de acabado del mueble Vitelli 63 para la web.
//
// Fuente: biblioteca de tableros de Rik (las mismas imagenes que usa el
// configurador Unreal "Vitelli_M_M"). Cada textura se deja con la veta en
// horizontal (eje U), cuadrada a 1024 px y en WebP: el modelo 3D la proyecta
// en metros reales, asi que la orientacion debe ser uniforme entre acabados.
//
// Uso: node scripts/modelos-3d/acabados-vitelli-63.mjs [carpeta-tableros]
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const TABLEROS = process.argv[2] ?? 'C:/Users/Rik/OneDrive/Practimac/Sistema de info/Tableros';
const SALIDA = 'public/images/muebles/vitelli-63/acabados';

// rotar: la fuente trae la veta vertical. recorte: fraccion del lado corto
// que se conserva, para igualar la escala de veta entre escaneos distintos.
const ACABADOS = [
  { id: 'blanco-madera', archivo: 'BLANCO MADERA.tif', rotar: false, recorte: 1 },
  { id: 'soder', archivo: 'SODER.tif', rotar: true, recorte: 1 },
  { id: 'austral', archivo: 'diseño-austral.jpg', rotar: true, recorte: 0.6 },
  { id: 'gracia', archivo: 'diseño-gracia.jpg', rotar: true, recorte: 1 },
  { id: 'mitte', archivo: 'mitte.jpg', rotar: true, recorte: 1 },
];

fs.mkdirSync(SALIDA, { recursive: true });

for (const a of ACABADOS) {
  const fuente = path.join(TABLEROS, a.archivo);
  let img = sharp(fuente, { limitInputPixels: false });
  if (a.rotar) img = img.rotate(90);
  const buf = await img.toBuffer();
  const meta = await sharp(buf).metadata();
  const lado = Math.round(Math.min(meta.width, meta.height) * a.recorte);
  const left = Math.round((meta.width - lado) / 2);
  const top = Math.round((meta.height - lado) / 2);
  const base = sharp(buf).extract({ left, top, width: lado, height: lado });

  const textura = path.join(SALIDA, `${a.id}.webp`);
  await base.clone().resize(1024, 1024, { kernel: 'lanczos3' }).webp({ quality: 84 }).toFile(textura);
  // Muestra pequena para el selector: carga instantanea antes que el 3D.
  const muestra = path.join(SALIDA, `${a.id}-muestra.webp`);
  await base.clone().resize(160, 160).webp({ quality: 80 }).toFile(muestra);

  const kb = (f) => (fs.statSync(f).size / 1024).toFixed(0);
  console.log(`${a.id.padEnd(14)} fuente ${meta.width}x${meta.height} -> ${textura} (${kb(textura)} KB), muestra ${kb(muestra)} KB`);
}
