import { WHATSAPP_VENTAS } from '../opcion-a/configuradorLogica';
import { rotar } from '../opcion-b/mixMatchLogica';
import {
  ACABADOS_C,
  GRIFERIAS_C,
  INICIAL_C,
  LAVAMANOS_C,
  MUEBLES_C,
  rutaVistaC,
  type EstadoC,
  type MuebleC,
  type SeleccionC,
  type VistaC,
} from './catalogoOpcionC';

export { rotar };

const valido = <T extends { id: string }>(lista: T[], v: string | null | undefined) =>
  lista.find((x) => x.id === v)?.id as T['id'] | undefined;

/**
 * Lee una combinacion compartida (?lavamanos=&mueble=&acabado=&griferia=).
 * Tolera mayusculas y valores invalidos; un mueble sin serie de renders cae al
 * primero disponible.
 */
export function leerSeleccionC(search: string): SeleccionC {
  const p = new URLSearchParams(search);
  const lee = (k: string) => p.get(k)?.trim().toLowerCase();
  const mueble = MUEBLES_C.find((m) => m.id === lee('mueble') && m.disponible)?.id ?? INICIAL_C.mueble;
  return {
    lavamanos: valido(LAVAMANOS_C, lee('lavamanos')) ?? INICIAL_C.lavamanos,
    mueble,
    acabado: valido(ACABADOS_C, lee('acabado')) ?? INICIAL_C.acabado,
    griferia: valido(GRIFERIAS_C, lee('griferia')) ?? INICIAL_C.griferia,
  };
}

export function escribirSeleccionC(search: string, sel: SeleccionC): string {
  const p = new URLSearchParams(search);
  p.set('lavamanos', sel.lavamanos);
  p.set('mueble', sel.mueble);
  p.set('acabado', sel.acabado);
  p.set('griferia', sel.griferia);
  return `?${p.toString()}`;
}

export function nombresC(sel: SeleccionC) {
  return {
    lavamanos: LAVAMANOS_C.find((l) => l.id === sel.lavamanos) ?? LAVAMANOS_C[0],
    mueble: MUEBLES_C.find((m) => m.id === sel.mueble) ?? MUEBLES_C[0],
    acabado: ACABADOS_C.find((a) => a.id === sel.acabado) ?? ACABADOS_C[0],
    griferia: GRIFERIAS_C.find((g) => g.id === sel.griferia) ?? GRIFERIAS_C[0],
  };
}

export function enlaceCotizacionC(sel: SeleccionC, urlCombinacion: string): string {
  const n = nombresC(sel);
  const texto =
    `Hola FIRPLAK, quiero cotizar el lavamanos ${n.lavamanos.nombre} ${n.lavamanos.medida} ` +
    `con el mueble ${n.mueble.nombre} en acabado ${n.acabado.nombre} y grifería en ${n.griferia.nombre.toLowerCase()}. ` +
    `Lo armé en el estudio Mix & Match: ${urlCombinacion}`;
  return `https://wa.me/${WHATSAPP_VENTAS}?text=${encodeURIComponent(texto)}`;
}

/** Mueble que aun no esta en el estudio: se cotiza igual, con un asesor. */
export function enlaceCotizacionMuebleC(mueble: MuebleC, urlPagina: string): string {
  const texto =
    `Hola FIRPLAK, me interesa el mueble ${mueble.nombre} (${mueble.medida}) con lavamanos. ` +
    `Lo vi en el estudio Mix & Match: ${urlPagina}`;
  return `https://wa.me/${WHATSAPP_VENTAS}?text=${encodeURIComponent(texto)}`;
}

/** Elige otro valor de la lista, distinto del actual. */
function otro<T extends { id: string }>(lista: T[], actual: string, azar: () => number): T['id'] {
  const resto = lista.filter((x) => x.id !== actual);
  return resto[Math.min(resto.length - 1, Math.floor(azar() * resto.length))].id;
}

/** "Sorpréndeme": cambia lavamanos, acabado y griferia a la vez (el mueble queda). */
export function sorprender(sel: SeleccionC, azar: () => number = Math.random): SeleccionC {
  return {
    ...sel,
    lavamanos: otro(LAVAMANOS_C, sel.lavamanos, azar),
    acabado: otro(ACABADOS_C, sel.acabado, azar),
    griferia: otro(GRIFERIAS_C, sel.griferia, azar),
  };
}

/* ---------------- Encuadre de las vistas del escenario ---------------- */

export interface Encuadre {
  /** Escala y desplazamiento (en % del lado) del producto dentro de su caja cuadrada. */
  s: number;
  dx: number;
  dy: number;
}

const ESCALA_MAX = 1.5;

/** Caja [x0, y0, x1, y1] (fraccion del render) de lo que debe llenar cada vista. */
export function cajaVista(vista: VistaC, sel: SeleccionC): [number, number, number, number] {
  if (vista === 'mueble') {
    // Union de cerrado y abierto: al abrir no se mueve el encuadre.
    const c = rutaVistaC(sel.mueble, 'solo', 'cerrado').caja, a = rutaVistaC(sel.mueble, 'solo', 'abierto').caja;
    return [Math.min(c[0], a[0]), Math.min(c[1], a[1]), Math.max(c[2], a[2]), Math.max(c[3], a[3])];
  }
  const c = rutaVistaC(sel.mueble, sel.lavamanos, 'cerrado');
  if (vista === 'lavamanos') {
    const g = c.grifo ?? c.caja;
    return [c.caja[0], g[1], c.caja[2], c.costura];
  }
  const a = rutaVistaC(sel.mueble, sel.lavamanos, 'abierto').caja;
  return [Math.min(c.caja[0], a[0]), Math.min(c.caja[1], a[1]), Math.max(c.caja[2], a[2]), Math.max(c.caja[3], a[3])];
}

/** Lado de la caja del producto respecto al alto del escenario (h-[86%]). */
export const CAJA_PRODUCTO = 0.86;
/** Alto (px) que ocupan arriba y abajo las barras del escenario. */
const BARRAS_PX = 64;

/**
 * Escala para que la caja llene la vista centrada, sin tocar los bordes ni
 * meterse bajo las barras del escenario (`alto`: alto del escenario en px).
 */
export function encuadreVista(vista: VistaC, sel: SeleccionC, alto = 640): Encuadre {
  const [x0, y0, x1, y1] = cajaVista(vista, sel);
  const util = Math.max(0.5, (alto - 2 * BARRAS_PX) / (alto * CAJA_PRODUCTO));
  const llenar = Math.min(vista === 'conjunto' ? 0.92 : 0.8, util);
  const s = Math.min(ESCALA_MAX, 0.92 / (x1 - x0), llenar / (y1 - y0));
  return { s, dx: (0.5 - (x0 + x1) / 2) * 100, dy: (0.5 - (y0 + y1) / 2) * 100 };
}

export function transformEncuadre(e: Encuadre) {
  return `scale(${e.s.toFixed(4)}) translate(${e.dx.toFixed(3)}%, ${e.dy.toFixed(3)}%)`;
}

/** Posicion (en % de la caja del producto) de un punto del render tras el encuadre. */
export function aPantalla(p: number, e: Encuadre, eje: 'x' | 'y') {
  return 50 + e.s * (p - 0.5 + (eje === 'x' ? e.dx : e.dy) / 100) * 100;
}

export type CambioC = 'inicio' | 'lavamanos' | 'acabado' | 'griferia' | 'estado' | 'varios' | 'ninguno';

/** Que cambio entre dos combinaciones mostradas (decide la animacion). */
export function tipoCambioC(
  a: { sel: SeleccionC; estado: EstadoC } | null,
  b: { sel: SeleccionC; estado: EstadoC }
): CambioC {
  if (!a) return 'inicio';
  const d: CambioC[] = [];
  if (a.sel.lavamanos !== b.sel.lavamanos || a.sel.mueble !== b.sel.mueble) d.push('lavamanos');
  if (a.sel.acabado !== b.sel.acabado) d.push('acabado');
  if (a.sel.griferia !== b.sel.griferia) d.push('griferia');
  if (a.estado !== b.estado) d.push('estado');
  if (d.length === 0) return 'ninguno';
  return d.length > 1 ? 'varios' : d[0];
}
