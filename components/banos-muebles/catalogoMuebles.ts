/**
 * Sesion "Lavamanos & muebles": catalogo de muebles de bano configurables.
 *
 * Cada mueble se presenta con una "opcion" de experiencia (A, B, ...) para
 * iterar el formato con el equipo sin perder las anteriores. La Opcion A es
 * el configurador 3D: acabado del mueble + lavamanos, vistos en vivo.
 *
 * DATO COMERCIAL PENDIENTE: no hay precios ni fichas verificadas en esta fase;
 * la UI ofrece cotizar con un asesor en vez de mostrar un valor.
 */

export interface AcabadoMueble {
  id: string;
  nombre: string;
  /** Textura 1024 px con la veta en horizontal (ver scripts/modelos-3d). */
  textura: string;
  /** Muestra de 160 px para el selector. */
  muestra: string;
}

export interface LavamanosOpcion {
  id: 'oslo' | 'siena' | 'genova' | 'parma';
  nombre: string;
  medida: string;
  /** Rasgo visible de la poceta, tomado del modelo 3D. */
  forma: string;
  miniatura: string;
}

export interface MuebleBano {
  id: string;
  opcion: 'A';
  nombre: string;
  linea: string;
  medidaComercial: string;
  descripcion: string;
  modelo: string;
  acabados: AcabadoMueble[];
  lavamanos: LavamanosOpcion[];
  acabadoInicial: string;
  lavamanosInicial: LavamanosOpcion['id'];
  /** Solo rasgos que se ven en el modelo 3D; nada sin verificar. */
  detalles: string[];
}

const ACABADOS = '/images/muebles/vitelli-63/acabados';
const LAVAMANOS = '/images/muebles/vitelli-63/lavamanos';

const acabado = (id: string, nombre: string): AcabadoMueble => ({
  id,
  nombre,
  textura: `${ACABADOS}/${id}.webp`,
  muestra: `${ACABADOS}/${id}-muestra.webp`,
});

/**
 * Los 5 tableros de la linea, compartidos por todos los muebles y por las dos
 * opciones de experiencia. Mismas texturas que usa el configurador Unreal
 * "Vitelli_M_M".
 */
export const ACABADOS_TABLERO: AcabadoMueble[] = [
  acabado('blanco-madera', 'Blanco Madera'),
  acabado('soder', 'Soder'),
  acabado('austral', 'Austral'),
  acabado('gracia', 'Gracia'),
  acabado('mitte', 'Mitte'),
];

export const VITELLI_63: MuebleBano = {
  id: 'vitelli-63',
  opcion: 'A',
  nombre: 'Vitelli 63',
  linea: 'Mueble de baño flotante',
  medidaComercial: '63 × 79 cm',
  descripcion:
    'Elige el acabado del mueble y el lavamanos que más te guste. Lo ves armado en 3D al instante, por dentro y por fuera.',
  modelo: '/models/muebles/vitelli-63.glb',
  acabados: ACABADOS_TABLERO,
  lavamanos: [
    { id: 'oslo', nombre: 'Oslo', medida: '63 × 48 cm', forma: 'Poceta rectangular', miniatura: `${LAVAMANOS}/oslo.webp` },
    { id: 'siena', nombre: 'Siena', medida: '63 × 48 cm', forma: 'Poceta de frente curvo', miniatura: `${LAVAMANOS}/siena.webp` },
    { id: 'genova', nombre: 'Genova', medida: '63 × 48 cm', forma: 'Poceta trapezoidal', miniatura: `${LAVAMANOS}/genova.webp` },
    { id: 'parma', nombre: 'Parma', medida: '63 × 48 cm', forma: 'Poceta ovalada con apoyo lateral', miniatura: `${LAVAMANOS}/parma.webp` },
  ],
  acabadoInicial: 'gracia',
  lavamanosInicial: 'oslo',
  detalles: [
    'Cajones con rieles de cierre lento',
    'Frente sin manijas, con canal de agarre',
    'Cuatro lavamanos compatibles de 63 × 48 cm',
  ],
};

export const MUEBLES_BANO: MuebleBano[] = [VITELLI_63];
