import { WHATSAPP_VENTAS } from '../opcion-a/configuradorLogica';
import {
  ACABADOS_E,
  ACABADOS_GRIFO_E,
  COLORES_LAVAMANOS_E,
  COMPRAS_E,
  GRIFOS_E,
  INICIAL_E,
  LAVAMANOS_E,
  MUEBLES_E,
  PRECIOS_SUGERIDOS_E,
  type IdCompraE,
  type SeleccionE,
} from './catalogoOpcionE';

const valido = <T extends { id: string }>(lista: T[], v: string | null | undefined) =>
  lista.find((x) => x.id === v)?.id as T['id'] | undefined;

const CLAVES = ['mueble', 'acabado', 'lavamanos', 'color', 'grifo', 'acabadoGrifo', 'compra'] as const;

/** Lee una combinación compartida; tolera mayúsculas y valores inválidos. */
export function leerSeleccionE(search: string): SeleccionE {
  const p = new URLSearchParams(search);
  const lee = (k: string) => p.get(k)?.trim().toLowerCase();
  return {
    mueble: valido(MUEBLES_E, lee('mueble')) ?? INICIAL_E.mueble,
    acabado: valido(ACABADOS_E, lee('acabado')) ?? INICIAL_E.acabado,
    lavamanos: valido(LAVAMANOS_E, lee('lavamanos')) ?? INICIAL_E.lavamanos,
    color: valido(COLORES_LAVAMANOS_E, lee('color')) ?? INICIAL_E.color,
    grifo: valido(GRIFOS_E, lee('grifo')) ?? INICIAL_E.grifo,
    acabadoGrifo: valido(ACABADOS_GRIFO_E, lee('acabadogrifo') ?? lee('acabadoGrifo')) ?? INICIAL_E.acabadoGrifo,
    compra: valido(COMPRAS_E, lee('compra')) ?? INICIAL_E.compra,
  };
}

export function escribirSeleccionE(search: string, sel: SeleccionE): string {
  const p = new URLSearchParams(search);
  for (const k of CLAVES) p.set(k === 'acabadoGrifo' ? 'acabadogrifo' : k, sel[k]);
  return `?${p.toString()}`;
}

export function nombresE(sel: SeleccionE) {
  return {
    mueble: MUEBLES_E.find((x) => x.id === sel.mueble) ?? MUEBLES_E[0],
    acabado: ACABADOS_E.find((x) => x.id === sel.acabado) ?? ACABADOS_E[0],
    lavamanos: LAVAMANOS_E.find((x) => x.id === sel.lavamanos) ?? LAVAMANOS_E[0],
    color: COLORES_LAVAMANOS_E.find((x) => x.id === sel.color) ?? COLORES_LAVAMANOS_E[0],
    grifo: GRIFOS_E.find((x) => x.id === sel.grifo) ?? GRIFOS_E[0],
    acabadoGrifo: ACABADOS_GRIFO_E.find((x) => x.id === sel.acabadoGrifo) ?? ACABADOS_GRIFO_E[0],
    compra: COMPRAS_E.find((x) => x.id === sel.compra) ?? COMPRAS_E[0],
  };
}

/** El acabado de grifería que se ve es el renderizado (no una vista previa). */
export const grifoReal = (sel: Pick<SeleccionE, 'grifo' | 'acabadoGrifo'>) =>
  GRIFOS_E.find((g) => g.id === sel.grifo)?.base === sel.acabadoGrifo;

/** Precio sugerido de lo que se compra: cada pieza sola o la suma de las tres. */
export function precioE(compra: IdCompraE): number {
  const { mueble, lavamanos, griferia } = PRECIOS_SUGERIDOS_E;
  return compra === 'conjunto' ? mueble + lavamanos + griferia : PRECIOS_SUGERIDOS_E[compra];
}

export const formatoPesos = (v: number) => `$${v.toLocaleString('es-CO', { maximumFractionDigits: 0 })}`;

/** Descripción de lo que se compra, para el resumen y para WhatsApp. */
export function descripcionCompraE(sel: SeleccionE): string {
  const n = nombresE(sel);
  const mueble = `mueble ${n.mueble.nombre} en ${n.acabado.nombre}`;
  const lavamanos = `lavamanos ${n.lavamanos.nombre} ${n.lavamanos.medida} en gelcoat ${n.color.nombre.toLowerCase()}`;
  const griferia = `grifería ${n.grifo.nombre.toLowerCase()} en ${n.acabadoGrifo.nombre.toLowerCase()}`;
  if (sel.compra === 'mueble') return mueble;
  if (sel.compra === 'lavamanos') return lavamanos;
  if (sel.compra === 'griferia') return griferia;
  return `${mueble}, ${lavamanos} y ${griferia}`;
}

export function enlaceCotizacionE(sel: SeleccionE, urlCombinacion: string): string {
  const texto =
    `Hola FIRPLAK, quiero cotizar: ${descripcionCompraE(sel)} ` +
    `(precio sugerido ${formatoPesos(precioE(sel.compra))}). Lo armé en el Mix & Match: ${urlCombinacion}`;
  return `https://wa.me/${WHATSAPP_VENTAS}?text=${encodeURIComponent(texto)}`;
}

/* ---------------- Movimiento de puertas y cajones ---------------- */

/** Apertura: arranca rápido y llega suave. */
export const curvaApertura = (t: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);

/**
 * Cierre con amortiguador: arranca a toda velocidad y frena hasta detenerse; a mitad de tiempo
 * ya recorrió el 94 %, así el último tramo se ve lento como un cierre suave. Devuelve cuánto
 * queda abierto (1 → 0).
 */
export const curvaCierre = (t: number) => Math.pow(1 - Math.min(1, Math.max(0, t)), 4);

/** Una combinación al azar distinta de la actual (conserva lo que se compra). */
export function sorprenderE(sel: SeleccionE, azar: () => number = Math.random): SeleccionE {
  const uno = <T extends { id: string }>(lista: T[]) => lista[Math.min(lista.length - 1, Math.floor(azar() * lista.length))].id as T['id'];
  for (let intento = 0; intento < 6; intento++) {
    const nueva: SeleccionE = {
      ...sel,
      mueble: uno(MUEBLES_E),
      acabado: uno(ACABADOS_E),
      lavamanos: uno(LAVAMANOS_E),
      color: uno(COLORES_LAVAMANOS_E),
      grifo: uno(GRIFOS_E),
      acabadoGrifo: uno(ACABADOS_GRIFO_E),
    };
    if (nueva.acabado !== sel.acabado || nueva.lavamanos !== sel.lavamanos || nueva.mueble !== sel.mueble) return nueva;
  }
  return { ...sel, acabado: ACABADOS_E[(ACABADOS_E.findIndex((a) => a.id === sel.acabado) + 1) % ACABADOS_E.length].id };
}
