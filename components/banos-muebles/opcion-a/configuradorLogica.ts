import type { LavamanosOpcion, MuebleBano } from '../catalogoMuebles';

export interface Seleccion {
  acabado: string;
  lavamanos: LavamanosOpcion['id'];
}

/** Linea comercial de WhatsApp (la misma del menu de contacto). */
export const WHATSAPP_VENTAS = '573158173390';

/**
 * Lee la combinacion de un enlace compartido (?acabado=...&lavamanos=...).
 * Tolera mayusculas y valores invalidos: cae a la combinacion inicial.
 */
export function leerSeleccion(mueble: MuebleBano, search: string): Seleccion {
  const params = new URLSearchParams(search);
  const a = params.get('acabado')?.trim().toLowerCase();
  const l = params.get('lavamanos')?.trim().toLowerCase();
  return {
    acabado: mueble.acabados.some((x) => x.id === a) ? (a as string) : mueble.acabadoInicial,
    lavamanos: mueble.lavamanos.find((x) => x.id === l)?.id ?? mueble.lavamanosInicial,
  };
}

/** Query string que reproduce la combinacion, conservando otros parametros. */
export function escribirSeleccion(search: string, sel: Seleccion): string {
  const params = new URLSearchParams(search);
  params.set('acabado', sel.acabado);
  params.set('lavamanos', sel.lavamanos);
  return `?${params.toString()}`;
}

export function nombresSeleccion(mueble: MuebleBano, sel: Seleccion) {
  const acabado = mueble.acabados.find((a) => a.id === sel.acabado) ?? mueble.acabados[0];
  const lavamanos = mueble.lavamanos.find((l) => l.id === sel.lavamanos) ?? mueble.lavamanos[0];
  return { acabado, lavamanos };
}

/** Enlace de WhatsApp con la combinacion ya escrita para el asesor. */
export function enlaceCotizacion(mueble: MuebleBano, sel: Seleccion, urlCombinacion: string): string {
  const { acabado, lavamanos } = nombresSeleccion(mueble, sel);
  const texto =
    `Hola FIRPLAK, quiero cotizar el mueble ${mueble.nombre} en acabado ${acabado.nombre} ` +
    `con lavamanos ${lavamanos.nombre} (${lavamanos.medida}). ` +
    `Lo armé en el configurador 3D: ${urlCombinacion}`;
  return `https://wa.me/${WHATSAPP_VENTAS}?text=${encodeURIComponent(texto)}`;
}
