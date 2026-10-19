/**
 * Opcion B · Mix & Match: muebles, lavamanos y acabados que se combinan
 * libremente sobre renders fotorrealistas.
 *
 * Nombres marcados "provisional" esperan el nombre comercial real.
 * DATO COMERCIAL PENDIENTE: sin precios; se cotiza con un asesor.
 */
import { ACABADOS_TABLERO, type AcabadoMueble } from '../catalogoMuebles';
import { LADO_RENDER, RENDERS_MIX_MATCH } from './rendersMixMatch';

export interface MuebleMix {
  id: 'curva' | 'vitelli';
  nombre: string;
  descripcion: string;
  provisional?: boolean;
}

export interface LavamanosMix {
  id: 'ovalado' | 'oslo' | 'genova' | 'parma' | 'siena';
  nombre: string;
  forma: string;
  griferia: string;
  miniatura: string;
  provisional?: boolean;
}

export interface SeleccionMix {
  mueble: MuebleMix['id'];
  lavamanos: LavamanosMix['id'];
  acabado: string;
}

const RUTA = '/images/muebles/opcion-b';

export const MUEBLES_MIX: MuebleMix[] = [
  { id: 'curva', nombre: 'Gola Curva', descripcion: 'Un cajón amplio con gola curva', provisional: true },
  { id: 'vitelli', nombre: 'Vitelli 63', descripcion: 'Puerta y dos cajones' },
];

export const LAVAMANOS_MIX: LavamanosMix[] = [
  {
    id: 'ovalado',
    nombre: 'Ovalado sobre mesón',
    forma: 'De sobreponer, con mesón',
    griferia: 'Monocontrol alta, negra',
    miniatura: `${RUTA}/lavamanos-ovalado.webp`,
    provisional: true,
  },
  { id: 'oslo', nombre: 'Oslo', forma: 'Poceta rectangular', griferia: 'Monocontrol, negra', miniatura: `${RUTA}/lavamanos-oslo.webp` },
  { id: 'genova', nombre: 'Genova', forma: 'Poceta trapezoidal', griferia: 'Monocontrol, negra', miniatura: `${RUTA}/lavamanos-genova.webp` },
  { id: 'parma', nombre: 'Parma', forma: 'Poceta ovalada con apoyo', griferia: 'Monocontrol, negra', miniatura: `${RUTA}/lavamanos-parma.webp` },
  { id: 'siena', nombre: 'Siena', forma: 'Poceta de frente curvo', griferia: 'Monocontrol, negra', miniatura: `${RUTA}/lavamanos-siena.webp` },
];

export const ACABADOS_MIX: AcabadoMueble[] = ACABADOS_TABLERO;

export const INICIAL_MIX: SeleccionMix = { mueble: 'curva', lavamanos: 'oslo', acabado: 'soder' };

export { LADO_RENDER };

export function claveRender(m: MuebleMix['id'], l: LavamanosMix['id']) {
  return `${m}__${l}`;
}

export function rutasRender(m: MuebleMix['id'], l: LavamanosMix['id']) {
  const id = claveRender(m, l);
  return { id, base: `${RUTA}/${id}.webp`, capa: `${RUTA}/${id}-capa.webp`, ...RENDERS_MIX_MATCH[id] };
}

export function existeRender(m: MuebleMix['id'], l: LavamanosMix['id']) {
  return claveRender(m, l) in RENDERS_MIX_MATCH;
}
