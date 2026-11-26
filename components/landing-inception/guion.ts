// Guion del gran recorrido: un solo scroll infinito que pasa por todos los espacios de la casa.
// La casa vista desde arriba es el punto de encuentro entre capítulos:
//   azul → hidromasaje → casa → lavamanos → grifería → gota → casa → hidromasaje → azul.
// Cocina y zona de ropas se insertan después como capítulos nuevos entre casa y casa.
import { CAPAS, TINA_EN_CASA, camara, centroBano, escena, giroCapitulo1, type Capa, type Punto } from './camaraInception';
import { CAPA_GRIFO, CAPA_LAV, LAV_EN_CASA, TRAMOS_LAV, camaraLav, escenaLav } from './capituloLavamanos';
import type { CamaraVista, CapaMundo } from './proyeccion';

export type IdCapa = 'casa' | 'bano' | 'azul' | 'lav' | 'grifo';

const aMundo = (c: Capa): CapaMundo => ({ cx: c.x + c.lado / 2, cy: c.y + c.lado / 2, lado: c.lado, giro: 0 });
export const CAPAS_MUNDO: Record<IdCapa, CapaMundo> = {
  casa: aMundo(CAPAS.casa),
  bano: aMundo(CAPAS.bano),
  azul: aMundo(CAPAS.azul),
  lav: CAPA_LAV,
  grifo: CAPA_GRIFO,
};

/** Capítulos en orden y la parte del bucle (0-1) que ocupa cada uno. */
export const CAPITULOS = [
  { id: 'ida', desde: 0, hasta: 0.28 },
  { id: 'lavamanos', desde: 0.28, hasta: 0.74 },
  { id: 'vuelta', desde: 0.74, hasta: 1 },
] as const;
type IdCapitulo = (typeof CAPITULOS)[number]['id'];

export interface EstadoCapa { opacidad: number; inclinacion: number; pivote: Punto }
export interface Gota { centro: Punto; radio: number; estira: number; mezcla: number }
export interface Fotograma {
  capitulo: IdCapitulo;
  cam: CamaraVista;
  capas: Record<IdCapa, EstadoCapa>;
  /** Entrada al azul del capítulo 1 (1 = pantalla llena de azul). */
  floracion: number;
  /** Puertas del mueble (0 cerradas, 1 abiertas). */
  puertas: number;
  gota: Gota | null;
  pines: number;
  /** Avance del pliegue del capítulo 1 (paralaje del baño al subir). */
  subidaBano: number;
  textos: Record<string, number>;
}

const capa = (opacidad: number, inclinacion = 0, pivote: Punto = TINA_EN_CASA): EstadoCapa => ({ opacidad, inclinacion, pivote });

/** Capítulo y avance local (0-1) para una posición del bucle. */
export function ubicar(p: number): { capitulo: IdCapitulo; t: number } {
  const v = ((p % 1) + 1) % 1;
  const c = CAPITULOS.find((k) => v < k.hasta) ?? CAPITULOS[CAPITULOS.length - 1];
  return { capitulo: c.id, t: (v - c.desde) / (c.hasta - c.desde) };
}

/** Posición del bucle para un capítulo y un avance local. */
export const enBucle = (id: IdCapitulo, t: number) => {
  const c = CAPITULOS.find((k) => k.id === id)!;
  return c.desde + t * (c.hasta - c.desde);
};

const TEXTOS_VACIOS = { azul: 0, llave: 0, bano: 0, casa: 0, lav: 0, puertas: 0, grifo: 0 };

export function fotograma(p: number, aspecto: number, reducirMovimiento = false): Fotograma {
  const { capitulo, t } = ubicar(p);
  if (capitulo === 'lavamanos') {
    const cam = camaraLav(t, aspecto);
    const e = escenaLav(t, cam, reducirMovimiento);
    return {
      capitulo,
      cam,
      capas: {
        casa: capa(e.opacidadCasa, e.anguloCasa, LAV_EN_CASA),
        bano: capa(0),
        azul: capa(0),
        lav: capa(e.opacidadLav, e.anguloLav, LAV_EN_CASA),
        grifo: capa(e.opacidadGrifo),
      },
      floracion: 0,
      puertas: e.puertas,
      gota: e.gota,
      pines: e.pines,
      subidaBano: 0,
      textos: { ...TEXTOS_VACIOS, ...e.textos },
    };
  }
  // Capítulo 1: de ida sale del azul hasta la casa; de vuelta baja de la casa hasta el azul.
  const ida = capitulo === 'ida';
  const s = ida ? t : 1 - t;
  const c = camara(s, aspecto);
  const cam: CamaraVista = { ...c, giro: reducirMovimiento ? 0 : giroCapitulo1(s, ida) };
  const e = escena(s, c, reducirMovimiento);
  return {
    capitulo,
    cam,
    capas: {
      casa: capa(e.opacidadCasa, e.anguloCasa),
      bano: capa(e.opacidadBano, e.anguloBano),
      azul: capa(e.opacidadAzul),
      lav: capa(0),
      grifo: capa(0),
    },
    floracion: e.floracion,
    puertas: 0,
    gota: null,
    pines: e.pines,
    subidaBano: e.subida,
    textos: { ...TEXTOS_VACIOS, ...e.textos },
  };
}

/** Referencia del paralaje de cada placa (coordenadas de su imagen): el punto que mira la cámara en reposo. */
export const referenciaParalaje = (id: 'azul' | 'bano' | 'lav' | 'grifo', aspecto: number): Punto => {
  if (id === 'bano') {
    const c = centroBano(aspecto);
    return { x: (c.x - CAPAS.bano.x) / CAPAS.bano.lado, y: (c.y - CAPAS.bano.y) / CAPAS.bano.lado };
  }
  if (id === 'lav') return aspecto < 1 ? { x: 0.62, y: 0.47 } : { x: 0.6, y: 0.42 };
  return { x: 0.5, y: 0.5 };
};

/** Paradas del indicador lateral (posición en el bucle). */
export const PARADAS = [
  { id: 'azul', nombre: 'Azul', p: enBucle('ida', 0) },
  { id: 'hidromasaje', nombre: 'Hidromasaje', p: enBucle('ida', 0.485) },
  { id: 'casa', nombre: 'Casa', p: enBucle('lavamanos', 0.02) },
  { id: 'lavamanos', nombre: 'Lavamanos', p: enBucle('lavamanos', (TRAMOS_LAV.mueble[0] + TRAMOS_LAV.mueble[1]) / 2) },
  { id: 'griferia', nombre: 'Grifería', p: enBucle('lavamanos', (TRAMOS_LAV.grifo[0] + TRAMOS_LAV.grifo[1]) / 2) },
] as const;

/** Parada que se está viendo en una posición del bucle (de vuelta, el capítulo 1 se recorre al revés). */
export function paradaActiva(p: number): number {
  const { capitulo, t } = ubicar(p);
  const id =
    capitulo === 'lavamanos'
      ? t < 0.12 || t >= TRAMOS_LAV.portal ? 'casa' : t < 0.62 ? 'lavamanos' : 'griferia'
      : (() => {
          const s = capitulo === 'ida' ? t : 1 - t;
          return s < 0.2 ? 'azul' : s < 0.7 ? 'hidromasaje' : 'casa';
        })();
  return PARADAS.findIndex((par) => par.id === id);
}
