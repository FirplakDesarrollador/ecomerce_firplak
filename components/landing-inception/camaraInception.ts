// Cámara del loop Inception del baño: cada imagen vive dentro de la otra (el azul
// dentro del mando del baño, el baño dentro de la tina de la casa) y el scroll
// mueve una sola cámara por ese mundo: sale del azul hasta la casa y vuelve a entrar.
import { PUNTO_AZUL } from './geometriaBano';

export interface Punto { x: number; y: number }
/** Imagen cuadrada colocada en el mundo: esquina superior izquierda y lado. */
export interface Capa { x: number; y: number; lado: number }
/** Centro de la cámara y lado del mundo que cabe en el cuadro del escenario. */
export interface Camara { x: number; y: number; vista: number }

// Medidas tomadas sobre los keyframes de 2048 px (ver scripts/inception/preparar-keyframes.mjs).
/** Mando azul (centro de su cara frontal) en la imagen del baño. */
const MANDO_EN_BANO: Punto = { x: 0.3784, y: 0.4253 };
/** Ancho de la cara del mando: 27 px en el baño, 238 px en el primer plano. */
const ESCALA_AZUL_EN_BANO = 27 / 238;
/** Centro de la tina en la imagen del baño y en la casa vista desde arriba. */
const TINA_EN_BANO: Punto = { x: 0.456, y: 0.58 };
export const TINA_EN_CASA: Punto = { x: 0.2722, y: 0.2373 };
/** Ancho de la tina: 345 px en la casa, 1294 px en el baño. */
const ESCALA_BANO_EN_CASA = 345 / 1294;

const casa: Capa = { x: 0, y: 0, lado: 1 };
const bano: Capa = {
  x: TINA_EN_CASA.x - TINA_EN_BANO.x * ESCALA_BANO_EN_CASA,
  y: TINA_EN_CASA.y - TINA_EN_BANO.y * ESCALA_BANO_EN_CASA,
  lado: ESCALA_BANO_EN_CASA,
};
const mandoMundo: Punto = { x: bano.x + MANDO_EN_BANO.x * bano.lado, y: bano.y + MANDO_EN_BANO.y * bano.lado };
const ladoAzul = bano.lado * ESCALA_AZUL_EN_BANO;
const azul: Capa = { x: mandoMundo.x - PUNTO_AZUL.x * ladoAzul, y: mandoMundo.y - PUNTO_AZUL.y * ladoAzul, lado: ladoAzul };

export const CAPAS = { casa, bano, azul } as const;
export const PUNTO_MUNDO: Punto & { radio: number } = { ...mandoMundo, radio: PUNTO_AZUL.radio * ladoAzul };

/** Tramos del recorrido de salida (s de 0 a 1); la vuelta los recorre al revés. */
export const TRAMOS = {
  floracion: [0, 0.08],
  llave: [0.08, 0.2],
  haciaBano: [0.2, 0.42],
  bano: [0.42, 0.55],
  pliegue: [0.55, 0.85],
  casa: [0.85, 1],
} as const;

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const suave = (a: number, b: number, v: number) => { const t = clamp01((v - a) / (b - a)); return t * t * (3 - 2 * t); };
const mezcla = (a: number, b: number, t: number) => a + (b - a) * t;

/** Posición dentro del bucle (0-1) para un scroll que se repite cada `largo` px a partir de `largo`. */
export function progresoBucle(scrollY: number, largo: number): number {
  if (largo <= 0) return 0;
  const p = ((scrollY - largo) % largo) / largo;
  return p < 0 ? p + 1 : p;
}

/** Ida y vuelta: la primera mitad del bucle sale del azul a la casa, la segunda regresa. */
export function recorrido(p: number): number {
  return p <= 0.5 ? p * 2 : (1 - p) * 2;
}

interface Parada { s: number; camara: Camara }

const centroDe = (c: Capa, fx = 0.5, fy = 0.5): Punto => ({ x: c.x + c.lado * fx, y: c.y + c.lado * fy });

/**
 * Centro del baño en su parada. El escenario es un cuadrado que cubre la pantalla: en
 * vertical recorta los lados (se centra en ella y en los mandos); en horizontal recorta
 * arriba y abajo (sube para que no se le corte la cara bajo la barra).
 */
export const centroBano = (aspecto: number): Punto =>
  aspecto < 1 ? centroDe(bano, 0.4, 0.5) : centroDe(bano, 0.5, Math.min(0.5, Math.max(0.38, 0.5 / aspecto + 0.005)));

function paradas(aspecto: number): Parada[] {
  const banoCentro = centroBano(aspecto);
  const vistaCasa = aspecto < 1 ? Math.max(1, 1.02 / aspecto) : Math.max(1, aspecto * 1.06);
  const llave = PUNTO_MUNDO;
  // Ninguna parada es quieta: en cada una la cámara sigue alejándose y paneando un poco,
  // sin dejar de cubrir la pantalla con la imagen que está al frente.
  return [
    { s: 0, camara: { ...llave, vista: azul.lado / 6 } },
    { s: TRAMOS.llave[0], camara: { x: llave.x - azul.lado * 0.05, y: llave.y, vista: azul.lado * 0.82 } },
    { s: TRAMOS.llave[1], camara: { x: llave.x + azul.lado * 0.004, y: llave.y, vista: azul.lado * 0.99 } },
    { s: TRAMOS.bano[0], camara: { x: banoCentro.x - bano.lado * 0.05, y: banoCentro.y, vista: bano.lado * 0.86 } },
    { s: TRAMOS.bano[1], camara: { ...banoCentro, vista: bano.lado * 0.99 } },
    { s: TRAMOS.casa[0], camara: { ...centroDe(casa), vista: vistaCasa * 0.97 } },
    { s: 1, camara: { ...centroDe(casa), vista: vistaCasa * 1.02 } },
  ];
}

/** Pendientes de Fritsch-Carlson: curva monótona y continua en velocidad, quieta solo en los extremos. */
function pendientes(xs: number[], ys: number[]): number[] {
  const n = xs.length;
  const d = xs.slice(0, -1).map((x, i) => (ys[i + 1] - ys[i]) / (xs[i + 1] - x));
  const m = xs.map((_, i) => (i === 0 || i === n - 1 ? 0 : d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2));
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) { m[i] = 0; m[i + 1] = 0; continue; }
    const a = m[i] / d[i], b = m[i + 1] / d[i], h = a * a + b * b;
    if (h > 9) { const t = 3 / Math.sqrt(h); m[i] = t * a * d[i]; m[i + 1] = t * b * d[i]; }
  }
  return m;
}

/**
 * Entre dos paradas la cámara se mueve como un zoom real: la vista cambia en escala
 * logarítmica alrededor del punto fijo de la semejanza que lleva un cuadro al otro,
 * así lo que está en pantalla no se desliza. La escala sigue una curva suave a través
 * de todas las paradas, de modo que la velocidad del zoom nunca salta.
 */
export function camara(s: number, aspecto = 1): Camara {
  const lista = paradas(aspecto);
  const xs = lista.map((p) => p.s), ys = lista.map((p) => Math.log(p.camara.vista));
  const m = pendientes(xs, ys);
  const v = clamp01(s);
  let i = 0;
  while (i < lista.length - 2 && v > lista[i + 1].s) i++;
  const a = lista[i], b = lista[i + 1];
  const h = b.s - a.s, t = (v - a.s) / h;
  const t2 = t * t, t3 = t2 * t;
  const lnV = (2 * t3 - 3 * t2 + 1) * ys[i] + (t3 - 2 * t2 + t) * h * m[i] + (-2 * t3 + 3 * t2) * ys[i + 1] + (t3 - t2) * h * m[i + 1];
  const vista = Math.exp(lnV);
  const k = b.camara.vista / a.camara.vista;
  const kt = vista / a.camara.vista;
  if (Math.abs(1 - k) < 1e-6) {
    return { x: mezcla(a.camara.x, b.camara.x, t), y: mezcla(a.camara.y, b.camara.y, t), vista };
  }
  const fx = (b.camara.x - k * a.camara.x) / (1 - k);
  const fy = (b.camara.y - k * a.camara.y) / (1 - k);
  return { x: fx + (a.camara.x - fx) * kt, y: fy + (a.camara.y - fy) * kt, vista };
}

/**
 * Giro de la casa: pasa por cero en la cima del bucle con su máxima velocidad, así la
 * casa sigue girando mientras la cámara da la vuelta (como un trompo) y no hay cuadro quieto.
 */
export function giroCasa(p: number, grados = 7): number {
  return grados * Math.sin(Math.PI * Math.max(-1, Math.min(1, (p - 0.5) / 0.2)));
}

export interface Paralaje { shift: [number, number]; dolly: number }

/**
 * Paralaje dentro de una capa con mapa de profundidad: al panear, lo cercano se desplaza
 * más que lo lejano; al acercarse, lo cercano crece más rápido. `vaiven` (0-1) es un
 * balanceo lento que no depende del scroll, para que la cámara respire en reposo.
 */
export function paralaje(capa: Capa, ref: Punto, cam: Camara, subida: number, vaiven: [number, number]): Paralaje {
  const panX = (cam.x - ref.x) / capa.lado, panY = (cam.y - ref.y) / capa.lado;
  const acerca = Math.log(capa.lado / cam.vista);
  return {
    shift: [-panX * 0.09 + vaiven[0] * 0.006, -panY * 0.09 + subida * 0.05 + vaiven[1] * 0.004],
    dolly: Math.max(-0.05, Math.min(0.12, acerca * 0.07)),
  };
}

export const CENTRO_AZUL: Punto = centroDe(azul);

/** Traslación (px) y escala de una capa para un escenario cuadrado de `lado` px desplazado `off`. */
export function encuadre(capa: Capa, cam: Camara, lado: number, off: Punto) {
  const k = capa.lado / cam.vista;
  return {
    tx: ((capa.x - cam.x) / cam.vista) * lado + lado / 2 + off.x,
    ty: ((capa.y - cam.y) / cam.vista) * lado + lado / 2 + off.y,
    k,
  };
}

/** Punto del mundo en píxeles de pantalla. */
export function aPantalla(p: Punto, cam: Camara, lado: number, off: Punto): Punto {
  return {
    x: ((p.x - cam.x) / cam.vista) * lado + lado / 2 + off.x,
    y: ((p.y - cam.y) / cam.vista) * lado + lado / 2 + off.y,
  };
}

/** Estado visual de cada capa y del texto para un punto del recorrido. */
export function escena(s: number, cam: Camara, reducirMovimiento = false) {
  const giroPliegue = suave(TRAMOS.pliegue[0], TRAMOS.pliegue[1], s);
  const floracion = 1 - suave(TRAMOS.floracion[0], TRAMOS.floracion[1], s);
  const ventana = ([a, b]: readonly [number, number], margen = 0.02) =>
    Math.min(suave(a - margen, a + margen, s), 1 - suave(b - margen, b + margen, s));
  return {
    opacidadAzul: 1 - suave(azul.lado * 1.08, azul.lado * 2.0, cam.vista),
    opacidadBano: 1 - suave(0.1, 0.6, giroPliegue),
    opacidadCasa: suave(0.05, 0.45, giroPliegue),
    // Inclinación de cámara: el baño (pared) se va hacia arriba y la casa (piso) se endereza.
    anguloBano: reducirMovimiento ? 0 : -40 * giroPliegue,
    anguloCasa: reducirMovimiento ? 0 : 55 * (1 - giroPliegue),
    /** Avance del pliegue (0-1): la cámara sube sobre la tina. */
    subida: giroPliegue,
    floracion,
    textos: {
      azul: ventana([TRAMOS.floracion[0] - 0.05, 0.06]),
      llave: ventana([0.09, TRAMOS.llave[1]]),
      bano: ventana([TRAMOS.bano[0] + 0.01, TRAMOS.bano[1]]),
      casa: ventana([TRAMOS.casa[0] + 0.02, 1.05]),
    },
  };
}
