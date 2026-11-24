import manifest from '../../../public/images/muebles/capas-63x48/manifest.json';

interface PiezaPublicada { src: string; shadow?: string }
type MueblesPublicados = Record<string, Record<string, Partial<Record<'cerrado' | 'abierto', PiezaPublicada>>>>;

/** Un ambiente, una cámara y un marco compartido para todas las piezas. */
export const CAPAS_PILOTO_D = manifest;
export const MUEBLES_CAPAS_D: MueblesPublicados = manifest.cabinets;
export const LAVAMANOS_CAPAS_D: Record<string, { src: string; faucet: string }> = manifest.basins;

export function combinacionVerificadaD(mueble: string, lavamanos: string, acabado: string, estado = 'cerrado') {
  return manifest.verified_combinations.some((c) =>
    c.mueble === mueble && c.lavamanos === lavamanos && c.acabado === acabado && c.estado === estado);
}

/** Los parámetros de URL nunca se convierten en rutas de archivos. */
export function capasSeleccionD(sel: { mueble: string; lavamanos: string; acabado: string }) {
  if (!combinacionVerificadaD(sel.mueble, sel.lavamanos, sel.acabado)) return null;
  const cabinet = MUEBLES_CAPAS_D[sel.mueble]?.[sel.acabado]?.cerrado;
  const basin = LAVAMANOS_CAPAS_D[sel.lavamanos];
  return cabinet && basin ? {
    ambiente: manifest.environment.src,
    lavamanos: basin.src,
    mueble: cabinet.src,
    sombra: cabinet.shadow,
  } : null;
}
