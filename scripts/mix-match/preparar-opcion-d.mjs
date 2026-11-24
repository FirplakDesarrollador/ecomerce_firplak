// Prepara los renders de la Opcion D (Mix & Match, visualizacion Alejandro).
//
// A diferencia de la Opcion C, aqui no hay renders del conjunto: cada pieza viene
// suelta, en vista 3/4 y con su acabado ya renderizado. La web apila el lavamanos
// sobre el mueble; este script mide donde encajan.
//
// Entrada (assets-fuente/mix-match-alejandro, ver su README):
//   lavamanos/<id>__<detalle>.png
//   muebles/<modelo>/<modelo>__<acabado>__<cerrado|abierto>.png
//
// Anclaje (misma camara en todas las piezas):
//   mueble     esquina frontal izquierda de la tapa (columna mas a la izquierda, fila mas alta)
//   lavamanos  esquina frontal izquierda de la base (columna mas a la izquierda, fila mas baja)
// La escala iguala el ancho del lavamanos al de la tapa del mueble cerrado (ambos 63 x 48).
// El abierto usa el anclaje del cerrado: mismo lienzo y camara, asi al abrir no salta.
//
// Salida: public/images/muebles/opcion-d/** (.webp recortados, con huella de contenido en el
// nombre: si una imagen cambia, cambia su URL y ninguna cache sirve la anterior) y
// components/banos-muebles/opcion-d/rendersOpcionD.ts (cajas en "unidades": 1 = ancho de la tapa).
//
// Uso: node scripts/mix-match/preparar-opcion-d.mjs [carpeta-fuente]
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const FUENTE = process.argv[2] ?? 'assets-fuente/mix-match-alejandro';
const SALIDA = 'public/images/muebles/opcion-d';
const META = 'components/banos-muebles/opcion-d/rendersOpcionD.ts';

/** Archivo fuente de cada lavamanos del estudio. Los Parma 4K usan otra camara: fuera. */
const LAVAMANOS = {
  bari: 'bari__grifo-cromo',
  genova: 'genova__grifo-cromo',
  oslo: 'oslo__grifo-cromo',
  parma: 'parma-izquierdo__grifo-cromo',
  quadratto: 'quadratto__blanco__grifo-cromo',
  'quadratto-marfil': 'quadratto__marfil__grifo-cromo',
  siena: 'siena__grifo-negro',
  trentino: 'trentino__grifo-cromo',
};
/** Mueble del estudio -> prefijo de sus archivos. Godai: solo la configuracion con cerrado y abierto. */
const MUEBLES = {
  'basico-elevado': 'basico-elevado/basico-elevado',
  greco: 'greco/greco',
  tiziano: 'tiziano/tiziano',
  'valdez-piso': 'valdez-piso/valdez-piso',
  macao: 'macao/macao',
  misus: 'misus/misus',
  godai: 'godai/godai-estructura-piso-cubo-cajon',
};
const ACABADOS = ['blanco', 'carbono', 'gracia', 'mitte', 'soder', 'tribeca'];
/** Mueble de donde salen las muestras de acabado (frente liso del cajon). */
const MUESTRA_DE = 'greco';

const OPACO = 200; // alfa para medir geometria (sin sombras ni bordes suaves)
// Alfa minimo que se conserva. Las piezas son casi opacas (> 224); por debajo de
// 160 solo hay sombras de piso y fondos fantasma, que sobre el escenario se ven como manchas.
const VISIBLE = 160;
/** Tramo limpio del extremo derecho del canto frontal (fraccion desde la esquina mas baja hasta la derecha). */
const TRAMO_B = [0.8, 0.94];
/** Margen bajo el canto, en fraccion del ancho: conserva el antialias del borde. */
const TOLERANCIA_BASE = 0.004;
const ANCHO_MAX = 1200;

async function leer(archivo) {
  const { data, info } = await sharp(archivo).ensureAlpha().toColourspace('srgb').raw({ depth: 'uchar' }).toBuffer({ resolveWithObject: true });
  if (info.channels !== 4 || data.length !== info.width * info.height * 4) throw new Error(`Buffer inesperado en ${archivo}`);
  return { px: data, W: info.width, H: info.height };
}

/** Caja [x0, y0, x1, y1] de los pixeles con alfa > umbral. */
function caja({ px, W, H }, umbral) {
  let x0 = W, y0 = H, x1 = -1, y1 = -1;
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++)
      if (px[(y * W + x) * 4 + 3] > umbral) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
  if (x1 < 0) throw new Error('Imagen vacia');
  return [x0, y0, x1, y1];
}

/** Fila mas alta y mas baja de lo opaco en las primeras columnas (borde izquierdo). */
function bordeIzquierdo({ px, W, H }, x0) {
  let arriba = H, abajo = -1;
  for (let x = x0; x < x0 + 6; x++)
    for (let y = 0; y < H; y++)
      if (px[(y * W + x) * 4 + 3] > OPACO) {
        if (y < arriba) arriba = y;
        if (y > abajo) abajo = y;
      }
  return { arriba, abajo };
}

function borrarTenue(img) {
  for (let i = 3; i < img.px.length; i += 4) if (img.px[i] <= VISIBLE) img.px[i] = 0;
}

/**
 * Borra todo lo que queda por debajo de la base del lavamanos (poceta, desague, sifon):
 * en la obra va dentro del mueble, y si se deja tapa su frente.
 *
 * En la vista 3/4 el borde inferior de la base es una "V": un tramo corto desde la
 * esquina izquierda hasta la esquina mas baja y un canto frontal largo hasta la derecha.
 * Lo que cuelga sale siempre bajo el canto largo, asi que ese canto se ajusta como recta
 * con dos tramos limpios de sus extremos (mediana del perfil inferior) y se borra lo que
 * quede por debajo. El tramo corto no se toca.
 */
function recortarBajoBase(img) {
  const { px, W, H } = img;
  const perfil = new Array(W).fill(-1);
  for (let x = 0; x < W; x++)
    for (let y = H - 1; y >= 0; y--)
      if (px[(y * W + x) * 4 + 3] > OPACO) {
        perfil[x] = y;
        break;
      }
  const x0 = perfil.findIndex((y) => y >= 0);
  let x1 = W - 1;
  while (perfil[x1] < 0) x1--;
  const ancho = x1 - x0;
  const med = (v) => [...v].sort((p, q) => p - q)[v.length >> 1];
  // Esquina mas baja: maximo del perfil en la primera mitad, filtrado con una mediana
  // mas ancha que un tubo de desague (si no, el sifon pasa por esquina).
  const radio = Math.round(ancho * 0.05); // el sifon del Quadratto mide ~4,5 % del ancho
  let esquina = x0, fondo = -1;
  for (let x = x0 + radio; x < x0 + ancho * 0.5; x++) {
    const y = med(perfil.slice(x - radio, x + radio + 1));
    if (y > fondo) {
      fondo = y;
      esquina = x;
    }
  }
  const tramo = (desde, hasta) => {
    const xs = [], ys = [];
    for (let x = Math.round(desde); x <= Math.round(hasta); x++) if (perfil[x] >= 0) {
        xs.push(x);
        ys.push(perfil[x]);
      }
    return [med(xs), med(ys)];
  };
  // Punta real de la esquina (la mediana la redondea hacia arriba).
  const fino = Math.round(ancho * 0.01);
  const [desde, hasta] = [esquina - fino, esquina + fino];
  for (let x = desde; x <= hasta; x++) if (perfil[x] > perfil[esquina]) esquina = x;
  const resto = x1 - esquina;
  // La recta va de la punta al tramo limpio del extremo derecho: cerca de la esquina
  // ya puede empezar la poceta (Quadratto), asi que no se usa para ajustar.
  const [ax, ay] = [esquina, perfil[esquina]];
  const [bx, by] = tramo(esquina + resto * TRAMO_B[0], esquina + resto * TRAMO_B[1]);
  const pendiente = (by - ay) / (bx - ax);
  const tolerancia = Math.max(2, Math.round(ancho * TOLERANCIA_BASE));
  let borrados = 0;
  for (let x = esquina; x <= x1; x++) {
    const limite = Math.round(ay + pendiente * (x - ax)) + tolerancia;
    for (let y = Math.max(0, limite + 1); y < H; y++) {
      const i = (y * W + x) * 4 + 3;
      if (px[i]) {
        px[i] = 0;
        borrados++;
      }
    }
  }
  return borrados;
}

/** Archivo publicado de cada imagen: "lavamanos/oslo" -> "lavamanos/oslo.<huella>.webp". */
const archivos = {};
let bytes = 0;

/** Escribe la imagen con su huella de contenido en el nombre. */
function escribir(clave, buffer) {
  const huella = crypto.createHash('sha1').update(buffer).digest('hex').slice(0, 8);
  const relativo = `${clave}.${huella}.webp`;
  fs.mkdirSync(path.dirname(path.join(SALIDA, relativo)), { recursive: true });
  fs.writeFileSync(path.join(SALIDA, relativo), buffer);
  archivos[clave] = relativo;
  bytes += buffer.length;
}

async function guardar(img, [x0, y0, x1, y1], clave) {
  const w = x1 - x0 + 1, h = y1 - y0 + 1;
  const buffer = await sharp(img.px, { raw: { width: img.W, height: img.H, channels: 4 } })
    .extract({ left: x0, top: y0, width: w, height: h })
    .resize({ width: Math.min(w, ANCHO_MAX), withoutEnlargement: true })
    .webp({ quality: 82, alphaQuality: 90, effort: 6 })
    .toBuffer();
  escribir(clave, buffer);
}

const r4 = (n) => Math.round(n * 10000) / 10000;
/** Caja en unidades relativas al anclaje: [x, y, ancho, alto]. */
const enUnidades = ([x0, y0, x1, y1], ax, ay, unidad) => [r4((x0 - ax) / unidad), r4((y0 - ay) / unidad), r4((x1 - x0 + 1) / unidad), r4((y1 - y0 + 1) / unidad)];

const meta = { lavamanos: {}, muebles: {} };
// Se rehace la carpeta completa: no quedan versiones viejas con otra huella.
fs.rmSync(SALIDA, { recursive: true, force: true });

for (const [id, archivo] of Object.entries(LAVAMANOS)) {
  const img = await leer(path.join(FUENTE, 'lavamanos', `${archivo}.png`));
  borrarTenue(img);
  const colgantes = recortarBajoBase(img);
  const [x0, , x1] = caja(img, OPACO);
  const { abajo } = bordeIzquierdo(img, x0);
  const recorte = caja(img, 0);
  await guardar(img, recorte, `lavamanos/${id}`);
  meta.lavamanos[id] = enUnidades(recorte, x0, abajo, x1 - x0);
  console.log(`lavamanos ${id.padEnd(18)} ancho ${x1 - x0}px  bajo la base borrado ${colgantes}px`);
}

for (const [id, prefijo] of Object.entries(MUEBLES)) {
  meta.muebles[id] = {};
  for (const acabado of ACABADOS) {
    const ruta = (estado) => path.join(FUENTE, 'muebles', `${prefijo}__${acabado}__${estado}.png`);
    if (!fs.existsSync(ruta('cerrado'))) continue;
    const cerrado = await leer(ruta('cerrado'));
    borrarTenue(cerrado);
    const [x0, , x1] = caja(cerrado, OPACO);
    const { arriba } = bordeIzquierdo(cerrado, x0);
    const unidad = x1 - x0;
    const vistas = {};
    for (const estado of ['cerrado', 'abierto']) {
      if (!fs.existsSync(ruta(estado))) continue;
      const img = estado === 'cerrado' ? cerrado : await leer(ruta(estado));
      if (img.W !== cerrado.W || img.H !== cerrado.H) throw new Error(`${id} ${acabado}: el abierto no comparte lienzo con el cerrado`);
      if (estado === 'abierto') borrarTenue(img);
      const recorte = caja(img, 0);
      await guardar(img, recorte, `muebles/${id}__${acabado}__${estado}`);
      vistas[estado] = enUnidades(recorte, x0, arriba, unidad);
    }
    meta.muebles[id][acabado] = vistas;
    if (id === MUESTRA_DE) {
      // Muestra redonda: centro del frente del cajon, sin manija.
      const [cx0, cy0, cx1, cy1] = caja(cerrado, OPACO);
      const lado = Math.round((cx1 - cx0) * 0.22);
      const left = Math.round(cx0 + (cx1 - cx0) * 0.3), top = Math.round(cy0 + (cy1 - cy0) * 0.62);
      const muestra = await sharp(cerrado.px, { raw: { width: cerrado.W, height: cerrado.H, channels: 4 } })
        .extract({ left, top, width: lado, height: lado })
        .resize(128, 128)
        .flatten({ background: '#ffffff' })
        .webp({ quality: 85 })
        .toBuffer();
      escribir(`acabados/${acabado}`, muestra);
    }
    console.log(`mueble ${id.padEnd(15)} ${acabado.padEnd(8)} ${Object.keys(vistas).join(' + ')}`);
  }
}

const tipo = `/** [x, y, ancho, alto] en unidades: 1 = ancho de la tapa del mueble; origen en el anclaje. */
export type CajaD = [number, number, number, number];
export interface VistasMuebleD {
  cerrado: CajaD;
  abierto?: CajaD;
}`;
fs.mkdirSync(path.dirname(META), { recursive: true });
fs.writeFileSync(
  META,
  `// GENERADO por scripts/mix-match/preparar-opcion-d.mjs. No editar a mano.
// Origen (0, 0): esquina frontal izquierda de la tapa del mueble = base del lavamanos.

${tipo}

export const LAVAMANOS_RENDER_D: Record<string, CajaD> = ${JSON.stringify(meta.lavamanos, null, 2)};

export const MUEBLES_RENDER_D: Record<string, Record<string, VistasMuebleD>> = ${JSON.stringify(meta.muebles, null, 2)};

/** Archivo publicado (con huella de contenido) de cada imagen, relativo a public/images/muebles/opcion-d. */
export const ARCHIVOS_D: Record<string, string> = ${JSON.stringify(archivos, null, 2)};
`
);
console.log(`\n${META} escrito · ${(bytes / 1024 / 1024).toFixed(1)} MB en ${SALIDA}`);
