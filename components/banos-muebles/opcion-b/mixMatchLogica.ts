import { WHATSAPP_VENTAS } from '../opcion-a/configuradorLogica';
import {
  ACABADOS_MIX,
  existeRender,
  INICIAL_MIX,
  LAVAMANOS_MIX,
  MUEBLES_MIX,
  type SeleccionMix,
} from './catalogoMixMatch';

const valido = <T extends { id: string }>(lista: T[], v: string | undefined) =>
  lista.find((x) => x.id === v)?.id as T['id'] | undefined;

/**
 * Lee una combinacion compartida (?mueble=&lavamanos=&acabado=). Tolera
 * mayusculas y valores invalidos; si la pareja mueble-lavamanos no tiene
 * render, conserva el lavamanos y cambia al primer mueble que lo tenga.
 */
export function leerSeleccionMix(search: string): SeleccionMix {
  const p = new URLSearchParams(search);
  const lee = (k: string) => p.get(k)?.trim().toLowerCase();
  const sel: SeleccionMix = {
    mueble: valido(MUEBLES_MIX, lee('mueble')) ?? INICIAL_MIX.mueble,
    lavamanos: valido(LAVAMANOS_MIX, lee('lavamanos')) ?? INICIAL_MIX.lavamanos,
    acabado: valido(ACABADOS_MIX, lee('acabado')) ?? INICIAL_MIX.acabado,
  };
  return ajustarCompatible(sel, 'lavamanos');
}

/** Si la pareja no existe, mueve la otra pieza a la primera compatible. */
export function ajustarCompatible(sel: SeleccionMix, fija: 'mueble' | 'lavamanos'): SeleccionMix {
  if (existeRender(sel.mueble, sel.lavamanos)) return sel;
  if (fija === 'lavamanos') {
    const m = MUEBLES_MIX.find((x) => existeRender(x.id, sel.lavamanos));
    return m ? { ...sel, mueble: m.id } : { ...INICIAL_MIX, acabado: sel.acabado };
  }
  const l = LAVAMANOS_MIX.find((x) => existeRender(sel.mueble, x.id));
  return l ? { ...sel, lavamanos: l.id } : { ...INICIAL_MIX, acabado: sel.acabado };
}

export function escribirSeleccionMix(search: string, sel: SeleccionMix): string {
  const p = new URLSearchParams(search);
  p.set('mueble', sel.mueble);
  p.set('lavamanos', sel.lavamanos);
  p.set('acabado', sel.acabado);
  return `?${p.toString()}`;
}

/** Siguiente o anterior en una lista circular (flechas y gestos del escenario). */
export function rotar<T extends { id: string }>(lista: T[], actual: string, paso: 1 | -1): T['id'] {
  const i = lista.findIndex((x) => x.id === actual);
  return lista[(i + paso + lista.length) % lista.length].id;
}

export function nombresMix(sel: SeleccionMix) {
  return {
    mueble: MUEBLES_MIX.find((m) => m.id === sel.mueble) ?? MUEBLES_MIX[0],
    lavamanos: LAVAMANOS_MIX.find((l) => l.id === sel.lavamanos) ?? LAVAMANOS_MIX[0],
    acabado: ACABADOS_MIX.find((a) => a.id === sel.acabado) ?? ACABADOS_MIX[0],
  };
}

export function enlaceCotizacionMix(sel: SeleccionMix, urlCombinacion: string): string {
  const n = nombresMix(sel);
  const texto =
    `Hola FIRPLAK, quiero cotizar el mueble ${n.mueble.nombre} en acabado ${n.acabado.nombre} ` +
    `con lavamanos ${n.lavamanos.nombre} y grifería ${n.lavamanos.griferia.toLowerCase()}. ` +
    `Lo armé en el Mix & Match: ${urlCombinacion}`;
  return `https://wa.me/${WHATSAPP_VENTAS}?text=${encodeURIComponent(texto)}`;
}
