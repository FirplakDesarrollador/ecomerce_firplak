import { WHATSAPP_VENTAS } from '../opcion-a/configuradorLogica';
import {
  ACABADOS_D,
  ACABADOS_GRIFO_D,
  COLORES_LAVAMANOS_D,
  COMPRAS_D,
  GRIFOS_D,
  INICIAL_D,
  LAVAMANOS_D,
  MUEBLES_D,
  PRECIOS_SUGERIDOS_D,
  type IdCompraD,
  type SeleccionD,
} from './catalogoOpcionD';

const valido = <T extends { id: string }>(lista: T[], v: string | null | undefined) =>
  lista.find((x) => x.id === v)?.id as T['id'] | undefined;

const CLAVES = ['mueble', 'acabado', 'lavamanos', 'color', 'grifo', 'acabadoGrifo', 'compra'] as const;

/** Lee una combinación compartida; tolera mayúsculas y valores inválidos. */
export function leerSeleccionD(search: string): SeleccionD {
  const p = new URLSearchParams(search);
  const lee = (k: string) => p.get(k)?.trim().toLowerCase();
  return {
    mueble: valido(MUEBLES_D, lee('mueble')) ?? INICIAL_D.mueble,
    acabado: valido(ACABADOS_D, lee('acabado')) ?? INICIAL_D.acabado,
    lavamanos: valido(LAVAMANOS_D, lee('lavamanos')) ?? INICIAL_D.lavamanos,
    color: valido(COLORES_LAVAMANOS_D, lee('color')) ?? INICIAL_D.color,
    grifo: valido(GRIFOS_D, lee('grifo')) ?? INICIAL_D.grifo,
    acabadoGrifo: valido(ACABADOS_GRIFO_D, lee('acabadogrifo') ?? lee('acabadoGrifo')) ?? INICIAL_D.acabadoGrifo,
    compra: valido(COMPRAS_D, lee('compra')) ?? INICIAL_D.compra,
  };
}

export function escribirSeleccionD(search: string, sel: SeleccionD): string {
  const p = new URLSearchParams(search);
  for (const k of CLAVES) p.set(k === 'acabadoGrifo' ? 'acabadogrifo' : k, sel[k]);
  return `?${p.toString()}`;
}

export function nombresD(sel: SeleccionD) {
  return {
    mueble: MUEBLES_D.find((x) => x.id === sel.mueble) ?? MUEBLES_D[0],
    acabado: ACABADOS_D.find((x) => x.id === sel.acabado) ?? ACABADOS_D[0],
    lavamanos: LAVAMANOS_D.find((x) => x.id === sel.lavamanos) ?? LAVAMANOS_D[0],
    color: COLORES_LAVAMANOS_D.find((x) => x.id === sel.color) ?? COLORES_LAVAMANOS_D[0],
    grifo: GRIFOS_D.find((x) => x.id === sel.grifo) ?? GRIFOS_D[0],
    acabadoGrifo: ACABADOS_GRIFO_D.find((x) => x.id === sel.acabadoGrifo) ?? ACABADOS_GRIFO_D[0],
    compra: COMPRAS_D.find((x) => x.id === sel.compra) ?? COMPRAS_D[0],
  };
}

/** El acabado de grifería que se ve es el renderizado (no una vista previa). */
export const grifoReal = (sel: Pick<SeleccionD, 'grifo' | 'acabadoGrifo'>) =>
  GRIFOS_D.find((g) => g.id === sel.grifo)?.base === sel.acabadoGrifo;

/** Precio sugerido de lo que se compra: cada pieza sola o la suma de las tres. */
export function precioD(compra: IdCompraD): number {
  const { mueble, lavamanos, griferia } = PRECIOS_SUGERIDOS_D;
  return compra === 'conjunto' ? mueble + lavamanos + griferia : PRECIOS_SUGERIDOS_D[compra];
}

export const formatoPesos = (v: number) => `$${v.toLocaleString('es-CO', { maximumFractionDigits: 0 })}`;

/** Descripción de lo que se compra, para el resumen y para WhatsApp. */
export function descripcionCompraD(sel: SeleccionD): string {
  const n = nombresD(sel);
  const mueble = `mueble ${n.mueble.nombre} en ${n.acabado.nombre}`;
  const lavamanos = `lavamanos ${n.lavamanos.nombre} ${n.lavamanos.medida} en gelcoat ${n.color.nombre.toLowerCase()}`;
  const griferia = `grifería ${n.grifo.nombre.toLowerCase()} en ${n.acabadoGrifo.nombre.toLowerCase()}`;
  if (sel.compra === 'mueble') return mueble;
  if (sel.compra === 'lavamanos') return lavamanos;
  if (sel.compra === 'griferia') return griferia;
  return `${mueble}, ${lavamanos} y ${griferia}`;
}

export function enlaceCotizacionD(sel: SeleccionD, urlCombinacion: string): string {
  const texto =
    `Hola FIRPLAK, quiero cotizar: ${descripcionCompraD(sel)} ` +
    `(precio sugerido ${formatoPesos(precioD(sel.compra))}). Lo armé en el Mix & Match: ${urlCombinacion}`;
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
export function sorprenderD(sel: SeleccionD, azar: () => number = Math.random): SeleccionD {
  const uno = <T extends { id: string }>(lista: T[]) => lista[Math.min(lista.length - 1, Math.floor(azar() * lista.length))].id as T['id'];
  for (let intento = 0; intento < 6; intento++) {
    const nueva: SeleccionD = {
      ...sel,
      mueble: uno(MUEBLES_D),
      acabado: uno(ACABADOS_D),
      lavamanos: uno(LAVAMANOS_D),
      color: uno(COLORES_LAVAMANOS_D),
      grifo: uno(GRIFOS_D),
      acabadoGrifo: uno(ACABADOS_GRIFO_D),
    };
    if (nueva.acabado !== sel.acabado || nueva.lavamanos !== sel.lavamanos || nueva.mueble !== sel.mueble) return nueva;
  }
  return { ...sel, acabado: ACABADOS_D[(ACABADOS_D.findIndex((a) => a.id === sel.acabado) + 1) % ACABADOS_D.length].id };
}
