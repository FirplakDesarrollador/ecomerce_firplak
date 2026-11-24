/**
 * Opcion D · Mix & Match de la visualizacion Alejandro.
 *
 * Piloto: Vitelli y Tiziano Soder con Oslo/Génova (matriz 2025) y Bari/Siena/
 * Trentino (cruces de firplak.com; Tiziano no lleva Bari). Capas independientes,
 * con la misma cámara y ambiente; la fuente de cada cruce va en el manifiesto.
 * El archivo de renders anterior se conserva para futuras ampliaciones,
 * pero sus productos no se ofrecen sin validar compatibilidad y cámara.
 *
 * Nombres: los de los archivos de render. Todas las piezas son 63 x 48 cm.
 * Las descripciones solo cuentan lo que se ve en el render.
 * DATO COMERCIAL PENDIENTE: sin precios; se cotiza con un asesor.
 */
import { ARCHIVOS_D, LAVAMANOS_RENDER_D, MUEBLES_RENDER_D, type CajaD } from './rendersOpcionD';
import { CAPAS_PILOTO_D, LAVAMANOS_CAPAS_D, MUEBLES_CAPAS_D } from './capasPilotoD';

export type { CajaD };

export const RUTA_D = '/images/muebles/opcion-d';

/** URL publicada de una imagen ("lavamanos/oslo"); el nombre lleva la huella de su contenido. */
export function urlD(clave: string): string {
  const archivo = ARCHIVOS_D[clave];
  if (!archivo) throw new Error(`Sin imagen publicada para ${clave}`);
  return `${RUTA_D}/${archivo}`;
}

export type EstadoD = 'cerrado' | 'abierto';

export interface SeleccionD {
  lavamanos: string;
  mueble: string;
  acabado: string;
}

export interface MuebleD {
  id: string;
  nombre: string;
  descripcion: string;
  medida: string;
}

export interface LavamanosD {
  id: string;
  nombre: string;
  medida: string;
  forma: string;
  griferia: 'Cromo' | 'Negro';
}

export interface AcabadoD {
  id: string;
  nombre: string;
  muestra: string;
}

const MEDIDA = '63 × 48 cm';

const MUEBLES_ARCHIVO_D: MuebleD[] = [
  { id: 'vitelli', nombre: 'Vitelli', descripcion: 'Elevado · puerta y dos cajones', medida: MEDIDA },
  { id: 'tiziano', nombre: 'Tiziano', descripcion: 'Elevado · puerta y dos cajones', medida: MEDIDA },
  { id: 'greco', nombre: 'Greco', descripcion: 'Elevado · un cajón de frente curvo', medida: MEDIDA },
  { id: 'basico-elevado', nombre: 'Básico elevado', descripcion: 'Elevado · dos puertas', medida: MEDIDA },
  { id: 'valdez-piso', nombre: 'Valdez', descripcion: 'De piso · puertas, cajón y repisa', medida: MEDIDA },
  { id: 'macao', nombre: 'Macao', descripcion: 'Elevado · cajón y puerta', medida: MEDIDA },
  { id: 'misus', nombre: 'Misus', descripcion: 'Elevado · dos cajones', medida: MEDIDA },
  { id: 'godai', nombre: 'Godai', descripcion: 'Estructura de piso · cubo con cajón', medida: MEDIDA },
];

/** Piloto por capas: únicamente productos con fuente y cruces verificados. */
export const MUEBLES_D = MUEBLES_ARCHIVO_D.filter((m) => m.id in MUEBLES_CAPAS_D);

const LAVAMANOS_ARCHIVO_D: LavamanosD[] = [
  { id: 'oslo', nombre: 'Oslo', medida: MEDIDA, forma: 'Poceta rectangular', griferia: 'Cromo' },
  { id: 'genova', nombre: 'Génova', medida: MEDIDA, forma: 'Poceta trapezoidal', griferia: 'Cromo' },
  { id: 'bari', nombre: 'Bari', medida: MEDIDA, forma: 'Poceta de líneas suaves', griferia: 'Cromo' },
  { id: 'siena', nombre: 'Siena', medida: MEDIDA, forma: 'Poceta de frente curvo', griferia: 'Negro' },
  { id: 'parma', nombre: 'Parma', medida: MEDIDA, forma: 'Poceta ovalada a la izquierda', griferia: 'Cromo' },
  { id: 'trentino', nombre: 'Trentino', medida: MEDIDA, forma: 'Poceta con desagüe a la vista', griferia: 'Cromo' },
  { id: 'quadratto', nombre: 'Quadratto', medida: MEDIDA, forma: 'Poceta ovalada · blanco', griferia: 'Cromo' },
  { id: 'quadratto-marfil', nombre: 'Quadratto marfil', medida: MEDIDA, forma: 'Poceta ovalada · marfil', griferia: 'Cromo' },
];
export const LAVAMANOS_D = LAVAMANOS_ARCHIVO_D.filter((l) => l.id in LAVAMANOS_CAPAS_D);

/** Orden de la paleta; cada mueble muestra solo los que tiene renderizados. */
export const ACABADOS_D: AcabadoD[] = [
  { id: 'blanco', nombre: 'Blanco', muestra: urlD('acabados/blanco') },
  { id: 'soder', nombre: 'Soder', muestra: urlD('acabados/soder') },
  { id: 'gracia', nombre: 'Gracia', muestra: urlD('acabados/gracia') },
  { id: 'tribeca', nombre: 'Tribeca', muestra: urlD('acabados/tribeca') },
  { id: 'mitte', nombre: 'Mitte', muestra: urlD('acabados/mitte') },
  { id: 'carbono', nombre: 'Carbono', muestra: urlD('acabados/carbono') },
];

export const INICIAL_D: SeleccionD = { lavamanos: 'oslo', mueble: 'vitelli', acabado: 'soder' };

export interface MedidaD {
  id: string;
  nombre: string;
  /** true: hay renders de lavamanos y muebles en esta medida. */
  disponible: boolean;
}

/** Medidas del selector superior. Solo 63 x 48 tiene renders; las demas salen como "pronto". */
export const MEDIDAS_D: MedidaD[] = [
  { id: '40x30', nombre: '40 × 30', disponible: false },
  { id: '48x38', nombre: '48 × 38', disponible: false },
  { id: '48x43', nombre: '48 × 43', disponible: false },
  { id: '63x48', nombre: '63 × 48', disponible: true },
  { id: '79x48', nombre: '79 × 48', disponible: false },
  { id: '94x48', nombre: '94 × 48', disponible: false },
  { id: '124x48', nombre: '124 × 48', disponible: false },
  { id: '151x48', nombre: '151 × 48', disponible: false },
];
export const MEDIDA_INICIAL_D = '63x48';

/** Acabados con render para un mueble, en el orden de la paleta. */
export function acabadosDe(mueble: string): AcabadoD[] {
  if (mueble in MUEBLES_CAPAS_D) return ACABADOS_D.filter((a) => a.id in MUEBLES_CAPAS_D[mueble]);
  const vistas = MUEBLES_RENDER_D[mueble] ?? {};
  return ACABADOS_D.filter((a) => a.id in vistas);
}

/** Compatibilidad comercial explícita más disponibilidad de las capas. */
export function lavamanosDe(mueble: string): LavamanosD[] {
  return LAVAMANOS_D.filter((l) => CAPAS_PILOTO_D.verified_combinations.some((c) =>
    c.mueble === mueble && c.lavamanos === l.id));
}

export const TOTAL_COMBINACIONES_D =
  MUEBLES_D.reduce((n, m) => n + lavamanosDe(m.id).length * acabadosDe(m.id).length, 0);

export interface CapaD {
  src: string;
  caja: CajaD;
}

export function capaMuebleD(mueble: string, acabado: string, estado: EstadoD): CapaD | null {
  if (mueble in MUEBLES_CAPAS_D) {
    const capa = MUEBLES_CAPAS_D[mueble]?.[acabado]?.[estado];
    // Marco de cámara completo; no confundir con las cajas recortadas del archivo.
    return capa ? { src: capa.src, caja: [0, 0, 1, 1] } : null;
  }
  const caja = MUEBLES_RENDER_D[mueble]?.[acabado]?.[estado];
  return caja ? { src: urlD(`muebles/${mueble}__${acabado}__${estado}`), caja } : null;
}

export function capaLavamanosD(lavamanos: string): CapaD {
  const capa = LAVAMANOS_CAPAS_D[lavamanos];
  if (capa) return { src: capa.src, caja: [0, 0, 1, 1] };
  const caja = LAVAMANOS_RENDER_D[lavamanos];
  if (!caja) throw new Error(`Sin render para el lavamanos ${lavamanos}`);
  return { src: urlD(`lavamanos/${lavamanos}`), caja };
}
