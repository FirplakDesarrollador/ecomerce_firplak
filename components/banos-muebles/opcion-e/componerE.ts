/**
 * Opción E · composición en el navegador: pinta el cuerpo (mueble con su acabado) y la tapa
 * (lavamanos con su color y la grifería con su acabado) en lienzos del tamaño de los renders.
 */
import { cargarImagen, cargarTextura } from '../opcion-b/compositor';
import {
  ACABADOS_E,
  ACABADOS_GRIFO_E,
  COLORES_LAVAMANOS_E,
  GRIFOS_E,
  rutaCuerpoE,
  rutaTapaE,
  type EstadoE,
  type IdAcabadoE,
  type IdAcabadoGrifoE,
  type IdColorLavamanosE,
  type IdGrifoE,
  type IdLavamanosE,
  type IdMuebleE,
} from './catalogoOpcionE';
import { LIENZO_E, ORIENTACION_E } from './rendersOpcionE';
import { aplicarColorLavamanos, aplicarGrifoE, aplicarMadera, prepararCuerpo, prepararTapa, type CapaCuerpoE, type CapaTapaE } from './pixelesE';

export const ANCHO_E = LIENZO_E.ancho;
export const ALTO_E = LIENZO_E.alto;
/** El frente del Tucano mide 749 px para 63 cm. */
const PX_POR_CM = 749 / 63;
const VETA = { ...ORIENTACION_E, pxPorCm: PX_POR_CM };

function pixeles(img: HTMLImageElement): ImageData {
  const c = document.createElement('canvas');
  c.width = ANCHO_E;
  c.height = ALTO_E;
  const ctx = c.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Canvas 2D no disponible');
  ctx.drawImage(img, 0, 0, ANCHO_E, ALTO_E);
  return ctx.getImageData(0, 0, ANCHO_E, ALTO_E);
}

/** Caché con límite: lo más usado se queda, lo viejo se suelta. */
function cache<V>(limite: number) {
  const m = new Map<string, V>();
  return (clave: string, crear: () => V): V => {
    const v = m.get(clave);
    if (v !== undefined) {
      m.delete(clave);
      m.set(clave, v);
      return v;
    }
    const nuevo = crear();
    m.set(clave, nuevo);
    if (m.size > limite) m.delete(m.keys().next().value as string);
    return nuevo;
  };
}

interface CuerpoCargado { foto: ImageData; capa: CapaCuerpoE }
interface TapaCargada { foto: ImageData; capa: CapaTapaE }

const cuerpos = cache<Promise<CuerpoCargado>>(10);
const tapas = cache<Promise<TapaCargada>>(8);

export function cargarCuerpo(mueble: IdMuebleE, pieza: IdLavamanosE | 'solo', estado: EstadoE): Promise<CuerpoCargado> {
  return cuerpos(`${mueble}|${pieza}|${estado}`, () => {
    const r = rutaCuerpoE(mueble, pieza, estado);
    return Promise.all([cargarImagen(r.foto), cargarImagen(r.capa), cargarImagen(r.luz)]).then(([f, c, l]) => ({
      foto: pixeles(f),
      capa: prepararCuerpo(pixeles(c), pixeles(l)),
    }));
  });
}

export function cargarTapa(lavamanos: IdLavamanosE, grifo: IdGrifoE): Promise<TapaCargada> {
  return tapas(`${lavamanos}|${grifo}`, () => {
    const r = rutaTapaE(lavamanos, grifo);
    return Promise.all([cargarImagen(r.foto), cargarImagen(r.capa)]).then(([f, c]) => {
      const foto = pixeles(f);
      return { foto, capa: prepararTapa(foto, pixeles(c)) };
    });
  });
}

const lienzos = cache<Promise<HTMLCanvasElement>>(8);
/** Tapa pintada, solo la grifería y la caja de la grifería (x0, y0, x1, y1) en el render. */
export interface TapaPintadaE { tapa: HTMLCanvasElement; grifo: HTMLCanvasElement; cajaGrifo: [number, number, number, number] }
const lienzosTapa = cache<Promise<TapaPintadaE>>(6);

const nuevoLienzo = () => {
  const c = document.createElement('canvas');
  c.width = ANCHO_E;
  c.height = ALTO_E;
  return c;
};

/** Cuerpo pintado con el acabado (en caché; dos pedidos iguales comparten el mismo trabajo). */
export function cuerpoPintado(mueble: IdMuebleE, pieza: IdLavamanosE | 'solo', estado: EstadoE, acabado: IdAcabadoE): Promise<HTMLCanvasElement> {
  return lienzos(`${mueble}|${pieza}|${estado}|${acabado}`, async () => {
    const a = ACABADOS_E.find((x) => x.id === acabado) ?? ACABADOS_E[0];
    const [c, tex] = await Promise.all([cargarCuerpo(mueble, pieza, estado), a.textura ? cargarTextura(a.textura) : Promise.resolve(undefined)]);
    const img = new ImageData(new Uint8ClampedArray(c.foto.data), ANCHO_E, ALTO_E);
    aplicarMadera(img.data, c.capa, { plano: a.plano, textura: tex, cmTextura: a.cmTextura }, VETA);
    const lienzo = nuevoLienzo();
    lienzo.getContext('2d')?.putImageData(img, 0, 0);
    return lienzo;
  });
}

/** Tapa pintada (lavamanos teñido y grifería) y, aparte, solo la grifería para poder resaltarla. */
export function tapaPintada(
  lavamanos: IdLavamanosE,
  grifo: IdGrifoE,
  color: IdColorLavamanosE,
  acabadoGrifo: IdAcabadoGrifoE,
): Promise<TapaPintadaE> {
  return lienzosTapa(`${lavamanos}|${grifo}|${color}|${acabadoGrifo}`, () => pintarTapa(lavamanos, grifo, color, acabadoGrifo));
}

async function pintarTapa(lavamanos: IdLavamanosE, grifo: IdGrifoE, color: IdColorLavamanosE, acabadoGrifo: IdAcabadoGrifoE): Promise<TapaPintadaE> {
  const par: TapaPintadaE = { tapa: nuevoLienzo(), grifo: nuevoLienzo(), cajaGrifo: [0, 0, ANCHO_E, ALTO_E] };
  const t = await cargarTapa(lavamanos, grifo);
  const img = new ImageData(new Uint8ClampedArray(t.foto.data), ANCHO_E, ALTO_E);
  const col = COLORES_LAVAMANOS_E.find((x) => x.id === color)?.color;
  if (col) aplicarColorLavamanos(img.data, t.capa, col);
  const ag = ACABADOS_GRIFO_E.find((x) => x.id === acabadoGrifo) ?? ACABADOS_GRIFO_E[0];
  const base = GRIFOS_E.find((g) => g.id === grifo)?.base;
  const tono = base === 'niquel' ? ag.tonoDesdeNiquel : ag.tonoDesdeNegro;
  if (tono) aplicarGrifoE(img.data, t.capa, tono);
  par.tapa.getContext('2d')?.putImageData(img, 0, 0);
  // Solo la grifería: mismos píxeles con el alfa de su máscara.
  const g = new ImageData(ANCHO_E, ALTO_E);
  const { grifo: idx, mGrifo } = t.capa;
  let x0: number = ANCHO_E, x1 = 0;
  for (let k = 0; k < idx.length; k++) {
    const q = idx[k] * 4;
    const x = idx[k] % ANCHO_E;
    if (mGrifo[k] > 128) { if (x < x0) x0 = x; if (x > x1) x1 = x; }
    g.data[q] = img.data[q];
    g.data[q + 1] = img.data[q + 1];
    g.data[q + 2] = img.data[q + 2];
    g.data[q + 3] = Math.round((img.data[q + 3] * mGrifo[k]) / 255);
  }
  par.grifo.getContext('2d')?.putImageData(g, 0, 0);
  if (x1 > x0) par.cajaGrifo = [x0, t.capa.grifoY0, x1, t.capa.grifoY1];
  return par;
}

/** Descarga por adelantado lo necesario para otra combinación (sin pintarla). */
export function precargarE(mueble: IdMuebleE, lavamanos: IdLavamanosE, grifo: IdGrifoE, acabado: IdAcabadoE) {
  void cargarCuerpo(mueble, lavamanos, 'cerrado').catch(() => {});
  void cargarTapa(lavamanos, grifo).catch(() => {});
  const a = ACABADOS_E.find((x) => x.id === acabado);
  if (a?.textura) void cargarTextura(a.textura).catch(() => {});
}
