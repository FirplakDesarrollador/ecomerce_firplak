/**
 * Opcion C · "Estudio" Mix & Match (propuesta Ricardo).
 *
 * Imagenes 2D fotorrealistas del usuario (misma camara frontal): cada
 * lavamanos sobre cada mueble, cerrado y abierto, y el mueble solo. El acabado
 * del mueble y la griferia se aplican en el navegador con la capa de cada render.
 *
 * Nombres y medidas: catalogo de firplak.com (scripts/mix-match/resultados-firplak.json).
 * "Gola Curva" es provisional: no aparece en ese catalogo.
 * DATO COMERCIAL PENDIENTE: sin precios; se cotiza con un asesor.
 */
import { ACABADOS_TABLERO, type AcabadoMueble } from '../catalogoMuebles';
import type { TonoGrifo } from './pixelesC';
import { RENDERS_C, type VistaRenderC } from './rendersOpcionC';

export const RUTA_C = '/images/muebles/opcion-c';

export type IdMuebleC = 'vitelli' | 'curva';
export type IdLavamanosC = 'oslo' | 'genova' | 'parma' | 'siena';
export type IdGriferiaC = 'negro' | 'cromo' | 'oro' | 'niquel';
export type EstadoC = 'cerrado' | 'abierto';
export type VistaC = 'conjunto' | 'lavamanos' | 'mueble';

export interface SeleccionC {
  lavamanos: IdLavamanosC;
  mueble: IdMuebleC;
  acabado: string;
  griferia: IdGriferiaC;
}

export interface MuebleC {
  id: IdMuebleC;
  nombre: string;
  descripcion: string;
  medida: string;
  /** false: aun no tiene la serie de renders con la camara del estudio. */
  disponible: boolean;
  provisional?: boolean;
  /** Mueble aun no disponible: foto suelta y miniatura para mostrarlo. */
  referencia?: { imagen: string; miniatura: string; lavamanos: IdLavamanosC };
}

export interface LavamanosC {
  id: IdLavamanosC;
  nombre: string;
  medida: string;
  forma: string;
  /** Frase corta para la tarjeta: lo que se ve en el render. */
  frase: string;
  miniatura: string;
}

export interface GriferiaC {
  id: IdGriferiaC;
  nombre: string;
  /** true: acabado simulado sobre el grifo del render (vista previa). */
  simulada: boolean;
  tono: TonoGrifo | null;
  /** Fondo CSS de la muestra redonda. */
  muestra: string;
}

export const MUEBLES_C: MuebleC[] = [
  { id: 'vitelli', nombre: 'Vitelli 63', descripcion: 'Elevado · puerta y dos cajones', medida: '63 × 48 cm', disponible: true },
  {
    id: 'curva',
    nombre: 'Gola Curva',
    descripcion: 'Un cajón amplio con gola curva',
    medida: '63 × 48 cm',
    disponible: false,
    provisional: true,
    referencia: {
      imagen: `${RUTA_C}/curva__siena__referencia.webp`,
      miniatura: `${RUTA_C}/curva-miniatura.webp`,
      lavamanos: 'siena',
    },
  },
];

export const LAVAMANOS_C: LavamanosC[] = [
  { id: 'oslo', nombre: 'Oslo', medida: '63 × 48 cm', forma: 'Poceta rectangular', frase: 'Líneas rectas y una poceta amplia', miniatura: `${RUTA_C}/lavamanos-oslo.webp` },
  { id: 'genova', nombre: 'Génova', medida: '63 × 48 cm', forma: 'Poceta trapezoidal', frase: 'Paredes inclinadas, poceta profunda', miniatura: `${RUTA_C}/lavamanos-genova.webp` },
  { id: 'parma', nombre: 'Parma', medida: '63 × 48 cm', forma: 'Poceta ovalada a la izquierda', frase: 'Poceta a un lado y mesón libre', miniatura: `${RUTA_C}/lavamanos-parma.webp` },
  { id: 'siena', nombre: 'Siena', medida: '63 × 48 cm', forma: 'Poceta de frente curvo', frase: 'Curvas suaves, como una ola', miniatura: `${RUTA_C}/lavamanos-siena.webp` },
];

export const ACABADOS_C: AcabadoMueble[] = ACABADOS_TABLERO;

/** Acabado con el que se renderizaron las imagenes: se muestra el render tal cual. */
export const ACABADO_RENDER_C = 'soder';

export const GRIFERIAS_C: GriferiaC[] = [
  {
    id: 'negro',
    nombre: 'Negro',
    simulada: false,
    tono: null,
    muestra: 'radial-gradient(circle at 34% 28%, #6b7079 0%, #23262b 42%, #08090a 100%)',
  },
  {
    id: 'cromo',
    nombre: 'Cromo',
    simulada: true,
    tono: { color: [0.93, 0.95, 0.98], base: 0.1, ganancia: 2.6, cielo: 0.24, brillo: [1, 1, 1] },
    muestra: 'linear-gradient(135deg, #fbfcfd 0%, #b3bbc4 34%, #f1f4f6 52%, #848d97 78%, #e2e6ea 100%)',
  },
  {
    id: 'oro',
    nombre: 'Oro cepillado',
    simulada: true,
    tono: { color: [0.86, 0.68, 0.4], base: 0.3, ganancia: 1.8, cielo: 0.18, brillo: [1, 0.93, 0.78] },
    muestra: 'linear-gradient(135deg, #f6e4b8 0%, #c9a15c 38%, #ecd39b 58%, #a27a3b 100%)',
  },
  {
    id: 'niquel',
    nombre: 'Níquel cepillado',
    simulada: true,
    tono: { color: [0.83, 0.81, 0.77], base: 0.38, ganancia: 1.5, cielo: 0.18, brillo: [0.98, 0.97, 0.94] },
    muestra: 'linear-gradient(135deg, #efeee9 0%, #b6b2a9 38%, #dddbd4 58%, #8c8981 100%)',
  },
];

export const INICIAL_C: SeleccionC = { lavamanos: 'oslo', mueble: 'vitelli', acabado: ACABADO_RENDER_C, griferia: 'negro' };

/** Combinaciones que hoy se pueden armar y ver en el estudio. */
export const TOTAL_COMBINACIONES_C =
  LAVAMANOS_C.length * MUEBLES_C.filter((m) => m.disponible).length * ACABADOS_C.length * GRIFERIAS_C.length;

export function idVistaC(mueble: IdMuebleC, pieza: IdLavamanosC | 'solo', estado: EstadoC) {
  return `${mueble}__${pieza}__${estado}`;
}

export function rutaVistaC(mueble: IdMuebleC, pieza: IdLavamanosC | 'solo', estado: EstadoC): VistaRenderC & { id: string; base: string; capa: string } {
  const id = idVistaC(mueble, pieza, estado);
  const datos = RENDERS_C[id];
  if (!datos) throw new Error(`Sin render para ${id}`);
  return { id, base: `${RUTA_C}/${id}.webp`, capa: `${RUTA_C}/${id}-capa.webp`, ...datos };
}

export function existeVistaC(mueble: IdMuebleC, pieza: IdLavamanosC | 'solo', estado: EstadoC) {
  return idVistaC(mueble, pieza, estado) in RENDERS_C;
}

export const IMAGEN_POR_DENTRO_C = `${RUTA_C}/vitelli-iso.webp`;
