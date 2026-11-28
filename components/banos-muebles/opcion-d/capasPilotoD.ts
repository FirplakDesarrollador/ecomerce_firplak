import manifestJson from '../../../public/images/muebles/capas-63x48/manifest.json';

interface PiezaPublicada { src: string; bounds?: number[]; shadow?: string }
type MueblesPublicados = Record<string, Record<string, Partial<Record<'cerrado' | 'abierto', PiezaPublicada>>>>;

/** Ambiente persistente: una placa vacía y una sombra auxiliar por mueble, en el lienzo completo. */
export interface AmbienteCapasD {
  id: string;
  nombre: string;
  descripcion: string;
  src: string;
  thumb: string;
  width: number;
  height: number;
  shadows: Record<string, string>;
}

interface ManifestV3 {
  version: number;
  default_environment?: string;
  camera: { camera_rotation: number[] };
  environments?: AmbienteCapasD[];
  environment?: { id: string; src: string; width: number; height: number };
  product_frame: { x: number; y: number; width: number; height: number; resolution: number };
  shadow_frame: { x: number; y: number; width: number; height: number };
  basins: Record<string, { src: string; faucet: string; nombre?: string; forma?: string }>;
  cabinets: MueblesPublicados;
  /** Nombres desde el registro del catálogo (scripts/mix-match/catalogo-mix-match.json). */
  cabinet_info?: Record<string, { nombre: string; descripcion: string; medida: string }>;
  verified_combinations: Array<{ mueble: string; lavamanos: string; acabado: string; estado: string; fuente: string }>;
  compatibility_source: string;
}

const manifest = manifestJson as unknown as ManifestV3;

function resolverAmbientes(m: ManifestV3): AmbienteCapasD[] {
  if (Array.isArray(m.environments) && m.environments.length > 0) return m.environments;
  if (!m.environment) return [];
  const shadows: Record<string, string> = {};
  for (const [mueble, acabados] of Object.entries(m.cabinets)) {
    for (const estados of Object.values(acabados)) {
      if (estados.cerrado?.shadow) {
        shadows[mueble] = estados.cerrado.shadow;
        break;
      }
    }
  }
  return [{
    ...m.environment,
    nombre: 'Estudio',
    descripcion: '',
    thumb: m.environment.src,
    shadows,
  }];
}

/** Una cámara y un marco compartidos por todas las piezas y todos los ambientes. */
export const CAPAS_PILOTO_D = manifest;
export const AMBIENTES_D: AmbienteCapasD[] = resolverAmbientes(manifest);
export const AMBIENTE_INICIAL_D: string = manifest.default_environment ?? AMBIENTES_D[0]?.id ?? '';
export const MUEBLES_CAPAS_D: MueblesPublicados = manifest.cabinets;
export const LAVAMANOS_CAPAS_D: Record<string, { src: string; faucet: string; nombre?: string; forma?: string }> = manifest.basins;
export const INFO_MUEBLES_CAPAS_D = manifest.cabinet_info ?? {};

/** Los parámetros de URL nunca se convierten en rutas: solo se aceptan ids publicados. */
export function normalizarAmbienteD(id: string | null | undefined): string {
  const limpio = id?.trim().toLowerCase();
  return AMBIENTES_D.some((a) => a.id === limpio) ? limpio! : AMBIENTE_INICIAL_D;
}

export function ambienteD(id: string): AmbienteCapasD {
  return AMBIENTES_D.find((a) => a.id === normalizarAmbienteD(id))!;
}

export function combinacionVerificadaD(mueble: string, lavamanos: string, acabado: string, estado = 'cerrado') {
  return manifest.verified_combinations.some((c) =>
    c.mueble === mueble && c.lavamanos === lavamanos && c.acabado === acabado && c.estado === estado);
}

/** Capas de una selección en un ambiente. El fondo depende solo del ambiente; la sombra, del mueble y el ambiente. */
export function capasSeleccionD(sel: { mueble: string; lavamanos: string; acabado: string }, ambiente = AMBIENTE_INICIAL_D) {
  if (!combinacionVerificadaD(sel.mueble, sel.lavamanos, sel.acabado)) return null;
  const cabinet = MUEBLES_CAPAS_D[sel.mueble]?.[sel.acabado]?.cerrado;
  const basin = LAVAMANOS_CAPAS_D[sel.lavamanos];
  const amb = ambienteD(ambiente);
  const sombra = amb.shadows[sel.mueble];
  return cabinet && basin && sombra ? {
    ambiente: amb.src,
    lavamanos: basin.src,
    mueble: cabinet.src,
    sombra,
  } : null;
}

/** Ambiente compartido por enlace (?ambiente=); tolera mayúsculas y valores inválidos. */
export function leerAmbienteD(search: string): string {
  return normalizarAmbienteD(new URLSearchParams(search).get('ambiente'));
}

export function escribirAmbienteD(search: string, ambiente: string): string {
  const p = new URLSearchParams(search);
  p.set('ambiente', normalizarAmbienteD(ambiente));
  return `?${p.toString()}`;
}
