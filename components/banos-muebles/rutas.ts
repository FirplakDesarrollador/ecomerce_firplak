/** Rutas de la sesion "lavamanos & muebles" (sin datos pesados: lo importa el layout global). */
export const RUTA_LAVAMANOS_MUEBLES = '/categoria-producto/banos/combos-lavamanos-con-mueble';

/**
 * Opcion D (Mix & Match, visualizacion Alejandro). Tiene ruta propia porque usa
 * la UI del home de Alejandro (navbar Loomere, sin header ni footer del sitio) y
 * el layout global solo puede decidirlo por la ruta.
 */
export const RUTA_ESTUDIO_D = `${RUTA_LAVAMANOS_MUEBLES}/mix-match`;
