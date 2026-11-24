import { WHATSAPP_VENTAS } from '../opcion-a/configuradorLogica';
import {
  ACABADOS_D,
  INICIAL_D,
  LAVAMANOS_D,
  MUEBLES_D,
  acabadosDe,
  lavamanosDe,
  capaLavamanosD,
  capaMuebleD,
  type CajaD,
  type SeleccionD,
} from './catalogoOpcionD';
import { LAVAMANOS_CAPAS_D } from './capasPilotoD';

export type { CajaD };

/** Si el mueble no tiene el acabado elegido, toma el inicial o, si tampoco lo tiene, el primero de su paleta. */
export function normalizarD(sel: SeleccionD): SeleccionD {
  const mueble = MUEBLES_D.some((m) => m.id === sel.mueble) ? sel.mueble : INICIAL_D.mueble;
  const compatibles = lavamanosDe(mueble);
  const lavamanos = compatibles.some((l) => l.id === sel.lavamanos) ? sel.lavamanos : compatibles[0].id;
  const disponibles = acabadosDe(mueble);
  const tiene = (id: string) => disponibles.some((a) => a.id === id);
  const acabado = tiene(sel.acabado) ? sel.acabado : tiene(INICIAL_D.acabado) ? INICIAL_D.acabado : disponibles[0].id;
  return { lavamanos, mueble, acabado };
}

/** Combinacion compartida por enlace (?lavamanos=&mueble=&acabado=); tolera mayusculas y valores invalidos. */
export function leerSeleccionD(search: string): SeleccionD {
  const p = new URLSearchParams(search);
  const lee = (k: keyof SeleccionD) => p.get(k)?.trim().toLowerCase() ?? INICIAL_D[k];
  return normalizarD({ lavamanos: lee('lavamanos'), mueble: lee('mueble'), acabado: lee('acabado') });
}

export function escribirSeleccionD(search: string, sel: SeleccionD): string {
  const p = new URLSearchParams(search);
  p.set('lavamanos', sel.lavamanos);
  p.set('mueble', sel.mueble);
  p.set('acabado', sel.acabado);
  return `?${p.toString()}`;
}

export function nombresD(sel: SeleccionD) {
  const lavamanos = LAVAMANOS_D.find((l) => l.id === sel.lavamanos) ?? LAVAMANOS_D[0];
  return {
    lavamanos: LAVAMANOS_CAPAS_D[sel.lavamanos] ? { ...lavamanos, griferia: 'Negro' as const } : lavamanos,
    mueble: MUEBLES_D.find((m) => m.id === sel.mueble) ?? MUEBLES_D[0],
    acabado: ACABADOS_D.find((a) => a.id === sel.acabado) ?? ACABADOS_D[0],
  };
}

export function enlaceCotizacionD(sel: SeleccionD, urlCombinacion: string): string {
  const n = nombresD(sel);
  const texto =
    `Hola FIRPLAK, quiero cotizar el lavamanos ${n.lavamanos.nombre} ${n.lavamanos.medida} ` +
    `con el mueble ${n.mueble.nombre} en acabado ${n.acabado.nombre}. ` +
    `Lo armé en el estudio Mix & Match: ${urlCombinacion}`;
  return `https://wa.me/${WHATSAPP_VENTAS}?text=${encodeURIComponent(texto)}`;
}

/** Siguiente o anterior de una lista, dando la vuelta. */
export function rotar<T extends { id: string }>(lista: T[], actual: string, paso: number): string {
  const i = Math.max(0, lista.findIndex((x) => x.id === actual));
  return lista[(i + paso + lista.length) % lista.length].id;
}

function otro<T extends { id: string }>(lista: T[], actual: string, azar: () => number): string {
  const resto = lista.filter((x) => x.id !== actual);
  if (!resto.length) return actual;
  return resto[Math.min(resto.length - 1, Math.floor(azar() * resto.length))].id;
}

/** "Sorpréndeme": otro lavamanos, otro mueble y uno de sus acabados. */
export function sorprenderD(sel: SeleccionD, azar: () => number = Math.random): SeleccionD {
  const mueble = otro(MUEBLES_D, sel.mueble, azar);
  return normalizarD({
    lavamanos: otro(lavamanosDe(mueble), sel.lavamanos, azar),
    mueble,
    acabado: otro(acabadosDe(mueble), sel.acabado, azar),
  });
}

/**
 * Encuadre del escenario para un mueble y acabado: union del mueble cerrado,
 * el abierto y el lavamanos mas alto, con margen. Fijo mientras se cambia de
 * lavamanos o se abre el mueble, para que nada salte.
 */
export function encuadreD(mueble: string, acabado: string, margen = 0.04): CajaD {
  const cajas: CajaD[] = LAVAMANOS_D.map((l) => capaLavamanosD(l.id).caja);
  for (const estado of ['cerrado', 'abierto'] as const) {
    const c = capaMuebleD(mueble, acabado, estado);
    if (c) cajas.push(c.caja);
  }
  const x0 = Math.min(...cajas.map((c) => c[0])) - margen;
  const y0 = Math.min(...cajas.map((c) => c[1])) - margen;
  const x1 = Math.max(...cajas.map((c) => c[0] + c[2])) + margen;
  const y1 = Math.max(...cajas.map((c) => c[1] + c[3])) + margen;
  return [x0, y0, x1 - x0, y1 - y0];
}

/**
 * Posicion de un item respecto al elegido en un carrusel circular: 0 el elegido,
 * -1 / 1 sus vecinos, y el camino mas corto dando la vuelta.
 */
export function desfaseCircular(indice: number, elegido: number, total: number): number {
  let d = (((indice - elegido) % total) + total) % total;
  if (d > total / 2) d -= total;
  return d;
}

/** Acabado con el que se muestra un mueble: el elegido si lo tiene, si no el primero de su paleta. */
export function acabadoVisibleD(mueble: string, acabado: string): string {
  const disponibles = acabadosDe(mueble);
  return disponibles.some((a) => a.id === acabado) ? acabado : disponibles[0].id;
}

/**
 * Limites (en unidades, origen en el anclaje) de todo lo que puede verse en el
 * centro del escenario: el lavamanos mas alto, el mueble mas bajo y la puerta
 * mas abierta. El escenario se escala con esto y no salta al cambiar piezas.
 */
export function limitesD(): { x0: number; y0: number; x1: number; y1: number } {
  const cajas: CajaD[] = LAVAMANOS_D.map((l) => capaLavamanosD(l.id).caja);
  for (const m of MUEBLES_D)
    for (const a of acabadosDe(m.id))
      for (const estado of ['cerrado', 'abierto'] as const) {
        const c = capaMuebleD(m.id, a.id, estado);
        if (c) cajas.push(c.caja);
      }
  return {
    x0: Math.min(...cajas.map((c) => c[0])),
    y0: Math.min(...cajas.map((c) => c[1])),
    x1: Math.max(...cajas.map((c) => c[0] + c[2])),
    y1: Math.max(...cajas.map((c) => c[1] + c[3])),
  };
}

/** Caja de una capa en % de su encuadre, para posicionarla con CSS. */
export function posicionEn(caja: CajaD, encuadre: CajaD) {
  return {
    left: `${((caja[0] - encuadre[0]) / encuadre[2]) * 100}%`,
    top: `${((caja[1] - encuadre[1]) / encuadre[3]) * 100}%`,
    width: `${(caja[2] / encuadre[2]) * 100}%`,
    height: `${(caja[3] / encuadre[3]) * 100}%`,
  };
}
