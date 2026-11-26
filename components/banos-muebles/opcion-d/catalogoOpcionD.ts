/**
 * Opción D · Mix & Match isométrico: catálogo.
 * Renders iso del usuario (v3 iso): Vitelli y Tucano × Oslo, Génova, Parma y Siena, cerrado y abierto,
 * más los muebles solos. Cada render trae un modelo de grifería: el Vitelli el bajo (níquel), el Tucano
 * el alto (negro); los dos se pueden poner en cualquier mueble.
 */
import type { TonoGrifo } from '../opcion-c/pixelesC';

export const RUTA_D = '/images/muebles/opcion-d';

export type IdMuebleD = 'vitelli' | 'tucano';
export type IdLavamanosD = 'oslo' | 'genova' | 'parma' | 'siena';
export type IdAcabadoD = 'blanco-nevado' | 'tauari' | 'mali' | 'nola' | 'tambo' | 'candelaria';
export type IdColorLavamanosD = 'blanco' | 'marfil' | 'niebla';
export type IdGrifoD = 'bajo' | 'alto';
export type IdAcabadoGrifoD = 'niquel' | 'negro' | 'cromo' | 'oro';
export type IdCompraD = 'conjunto' | 'mueble' | 'lavamanos' | 'griferia';
export type EstadoD = 'cerrado' | 'abierto';

export interface SeleccionD {
  mueble: IdMuebleD;
  acabado: IdAcabadoD;
  lavamanos: IdLavamanosD;
  color: IdColorLavamanosD;
  grifo: IdGrifoD;
  acabadoGrifo: IdAcabadoGrifoD;
  compra: IdCompraD;
}

export interface MuebleD {
  id: IdMuebleD;
  nombre: string;
  frentes: string;
  rasgos: string[];
}

export const MUEBLES_D: MuebleD[] = [
  { id: 'vitelli', nombre: 'Vitelli', frentes: 'Puerta y dos cajones', rasgos: ['Cajones con rieles de extensión total de 35 cm', 'Puerta y cajones con cierre suave'] },
  { id: 'tucano', nombre: 'Tucano', frentes: 'Dos cajones', rasgos: ['Rieles de extensión total de 35 cm', 'Cajones con cierre suave'] },
];

export interface LavamanosD {
  id: IdLavamanosD;
  nombre: string;
  forma: string;
  medida: string;
}

export const LAVAMANOS_D: LavamanosD[] = [
  { id: 'oslo', nombre: 'Oslo', forma: 'Poceta rectangular', medida: '63 × 48 cm' },
  { id: 'genova', nombre: 'Génova', forma: 'Poceta trapezoidal', medida: '63 × 48 cm' },
  { id: 'parma', nombre: 'Parma', forma: 'Poceta ovalada con apoyo lateral', medida: '63 × 48 cm' },
  { id: 'siena', nombre: 'Siena', forma: 'Poceta de frente curvo', medida: '63 × 48 cm' },
];

export interface ColorLavamanosD {
  id: IdColorLavamanosD;
  nombre: string;
  /** Color del gelcoat (0-255) con luz plena; null = el blanco del render. */
  color: [number, number, number] | null;
  muestra: string;
}

/** Gelcoat: colores tomados de las muestras del usuario (marfil y niebla). */
export const COLORES_LAVAMANOS_D: ColorLavamanosD[] = [
  { id: 'blanco', nombre: 'Blanco', color: null, muestra: '#f5f5f3' },
  { id: 'marfil', nombre: 'Marfil', color: [238, 231, 215], muestra: '#eee7d7' },
  { id: 'niebla', nombre: 'Niebla', color: [98, 96, 97], muestra: '#626061' },
];

export interface AcabadoD {
  id: IdAcabadoD;
  nombre: string;
  tipo: 'Unicolor' | 'Melamina maderada';
  /** Color plano (unicolor) o textura del tablero. */
  plano?: [number, number, number];
  textura?: string;
  /** Ancho real que cubre la textura (cm): escala de la veta sobre el mueble. */
  cmTextura: number;
}

export const ACABADOS_D: AcabadoD[] = [
  { id: 'blanco-nevado', nombre: 'Blanco nevado', tipo: 'Unicolor', plano: [244, 244, 241], cmTextura: 60 },
  { id: 'tauari', nombre: 'Tauari', tipo: 'Melamina maderada', textura: `${RUTA_D}/acabado-tauari.webp`, cmTextura: 70 },
  { id: 'mali', nombre: 'Mali', tipo: 'Melamina maderada', textura: `${RUTA_D}/acabado-mali.webp`, cmTextura: 55 },
  { id: 'nola', nombre: 'Nola', tipo: 'Melamina maderada', textura: `${RUTA_D}/acabado-nola.webp`, cmTextura: 80 },
  { id: 'tambo', nombre: 'Tambo', tipo: 'Melamina maderada', textura: `${RUTA_D}/acabado-tambo.webp`, cmTextura: 60 },
  { id: 'candelaria', nombre: 'Candelaria', tipo: 'Melamina maderada', textura: `${RUTA_D}/acabado-candelaria.webp`, cmTextura: 60 },
];

export interface GrifoD {
  id: IdGrifoD;
  nombre: string;
  detalle: string;
  /** Acabado con el que viene renderizado (el único que no es vista previa). */
  base: IdAcabadoGrifoD;
}

export const GRIFOS_D: GrifoD[] = [
  { id: 'bajo', nombre: 'Monocontrol bajo', detalle: 'Caño corto, aireador de aire inducido', base: 'niquel' },
  { id: 'alto', nombre: 'Monocontrol alto', detalle: 'Caño largo, aireador de aire inducido', base: 'negro' },
];

export interface AcabadoGrifoD {
  id: IdAcabadoGrifoD;
  nombre: string;
  muestra: string;
  /** Tono simulado a partir del grifo renderizado (níquel o negro). */
  tonoDesdeNiquel: TonoGrifo | null;
  tonoDesdeNegro: TonoGrifo | null;
}

const BLANCO: [number, number, number] = [1, 1, 1];
export const ACABADOS_GRIFO_D: AcabadoGrifoD[] = [
  {
    id: 'niquel', nombre: 'Níquel cepillado', muestra: 'linear-gradient(135deg,#d8d2c6,#8f887c 55%,#cfc8bb)',
    tonoDesdeNiquel: null,
    tonoDesdeNegro: { color: [0.82, 0.79, 0.73], base: 0.36, ganancia: 1.6, cielo: 0.16, brillo: [1, 0.97, 0.9] },
  },
  {
    id: 'negro', nombre: 'Negro mate', muestra: 'linear-gradient(135deg,#3a3a3c,#0f0f10 60%,#2a2a2c)',
    tonoDesdeNiquel: { color: [0.16, 0.16, 0.17], base: 0.02, ganancia: 0.55, cielo: 0.04, brillo: [0.5, 0.5, 0.52] },
    tonoDesdeNegro: null,
  },
  {
    id: 'cromo', nombre: 'Cromo', muestra: 'linear-gradient(135deg,#f4f6f9,#9aa3ad 50%,#e8ecf1)',
    tonoDesdeNiquel: { color: [0.9, 0.93, 0.97], base: -0.05, ganancia: 1.35, cielo: 0.12, brillo: BLANCO },
    tonoDesdeNegro: { color: [0.93, 0.95, 0.98], base: 0.1, ganancia: 2.6, cielo: 0.24, brillo: BLANCO },
  },
  {
    id: 'oro', nombre: 'Oro cepillado', muestra: 'linear-gradient(135deg,#ecd29b,#a8803f 55%,#e2c487)',
    tonoDesdeNiquel: { color: [0.88, 0.7, 0.4], base: 0.05, ganancia: 1.1, cielo: 0.1, brillo: [1, 0.93, 0.78] },
    tonoDesdeNegro: { color: [0.86, 0.68, 0.4], base: 0.3, ganancia: 1.8, cielo: 0.18, brillo: [1, 0.93, 0.78] },
  },
];

export interface CompraD {
  id: IdCompraD;
  nombre: string;
  detalle: string;
}

export const COMPRAS_D: CompraD[] = [
  { id: 'conjunto', nombre: 'Conjunto completo', detalle: 'Mueble, lavamanos y grifería' },
  { id: 'mueble', nombre: 'Solo el mueble', detalle: 'Sin lavamanos ni grifería' },
  { id: 'lavamanos', nombre: 'Solo el lavamanos', detalle: 'Gelcoat, sin grifería' },
  { id: 'griferia', nombre: 'Solo la grifería', detalle: 'Monocontrol con aireador' },
];

/** Precios sugeridos (COP) mientras llegan los reales; el conjunto es la suma de las partes. */
export const PRECIOS_SUGERIDOS_D = { mueble: 720_000, lavamanos: 320_000, griferia: 280_000 } as const;

export const INICIAL_D: SeleccionD = {
  mueble: 'vitelli',
  acabado: 'tauari',
  lavamanos: 'oslo',
  color: 'blanco',
  grifo: 'bajo',
  acabadoGrifo: 'niquel',
  compra: 'conjunto',
};

export const TOTAL_COMBINACIONES_D =
  MUEBLES_D.length * ACABADOS_D.length * LAVAMANOS_D.length * COLORES_LAVAMANOS_D.length * GRIFOS_D.length * ACABADOS_GRIFO_D.length;

/** Archivos de un cuerpo (mueble con un lavamanos o solo) en un estado. */
export function rutaCuerpoD(mueble: IdMuebleD, pieza: IdLavamanosD | 'solo', estado: EstadoD) {
  const id = `${mueble}__${pieza}__${estado}`;
  return { foto: `${RUTA_D}/${id}.webp`, capa: `${RUTA_D}/${id}-capa.webp`, luz: `${RUTA_D}/${id}-luz.webp` };
}

/** Archivos de una tapa (lavamanos con un modelo de grifería). */
export function rutaTapaD(lavamanos: IdLavamanosD, grifo: IdGrifoD) {
  const id = `tapa__${lavamanos}__${grifo}`;
  return { foto: `${RUTA_D}/${id}.webp`, capa: `${RUTA_D}/${id}-capa.webp` };
}
