// Capítulo 2 del loop Inception: desde la casa vista desde arriba la cámara gira (la pared del
// lavamanos queda al fondo), baja hasta el mueble, lo abre, se acerca a la grifería blanca y entra
// en una gota que cae del grifo. Dentro de la gota está la casa: al llenar la pantalla, la cámara
// vuelve a estar sobre la casa, exactamente donde empezó.
import { clamp01, suave, trayecto, vistaCasa, type Parada, type Punto } from './camaraInception';
import { enMundo, girar, type CamaraVista, type CapaMundo } from './proyeccion';

// Medidas tomadas sobre los renders de 1612 px y la casa de 2048 px.
/** Centro del lavabo en la casa vista desde arriba. */
export const LAV_EN_CASA: Punto = { x: 0.5465, y: 0.264 };
/** El mismo lavabo en el render del mueble. */
const LAVABO_EN_LAV: Punto = { x: 0.611, y: 0.323 };
/** Lado del render del mueble en la casa: el ancho del mueble en planta (≈105 px) sobre su ancho aparente en el render. */
const LADO_LAV = 0.19;
/** La pared del lavamanos mira al oeste: para verla de frente la casa gira 90°. */
const GIRO_LAV = 90;
/** Recorte del primer plano de la grifería sobre el render del mueble (x 860, y 290, lado 360 de 1612). */
const RECORTE_GRIFO = { x: 860 / 1612, y: 290 / 1612, lado: 360 / 1612 };
/** Salida del grifo en el primer plano. */
export const SALIDA_EN_GRIFO: Punto = { x: 0.412, y: 0.468 };
/** Radio de la gota: casi el del tubo del grifo (≈ 4,6 % del primer plano de diámetro). */
const RADIO_GOTA_EN_GRIFO = 0.022;
/** Caída de la gota hasta perderse dentro del lavabo (en lados del primer plano). */
const CAIDA_EN_GRIFO = 0.15;

const centroCapa = (ancla: Punto, enImagen: Punto, lado: number, giro: number): Punto => {
  const d = girar({ x: (0.5 - enImagen.x) * lado, y: (0.5 - enImagen.y) * lado }, giro);
  return { x: ancla.x + d.x, y: ancla.y + d.y };
};

const lavCentro = centroCapa(LAV_EN_CASA, LAVABO_EN_LAV, LADO_LAV, GIRO_LAV);
export const CAPA_LAV: CapaMundo = { cx: lavCentro.x, cy: lavCentro.y, lado: LADO_LAV, giro: GIRO_LAV };
const grifoCentro = enMundo(CAPA_LAV, { x: RECORTE_GRIFO.x + RECORTE_GRIFO.lado / 2, y: RECORTE_GRIFO.y + RECORTE_GRIFO.lado / 2 });
export const CAPA_GRIFO: CapaMundo = { cx: grifoCentro.x, cy: grifoCentro.y, lado: RECORTE_GRIFO.lado * LADO_LAV, giro: GIRO_LAV };
export const SALIDA_MUNDO = enMundo(CAPA_GRIFO, SALIDA_EN_GRIFO);
export const RADIO_GOTA = RADIO_GOTA_EN_GRIFO * CAPA_GRIFO.lado;

/** Tramos del capítulo (t de 0 a 1). */
export const TRAMOS_LAV = {
  casa: [0, 0.08],
  bajada: [0.08, 0.32],
  pliegue: [0.14, 0.32],
  mueble: [0.32, 0.44],
  puertas: [0.44, 0.58],
  haciaGrifo: [0.58, 0.7],
  grifo: [0.7, 0.78],
  gota: [0.72, 0.97],
  portal: 0.97,
} as const;

/** Cámara sobre la casa entera: donde empieza y termina el capítulo (la misma del capítulo 1 en la casa). */
export const camaraCasa = (aspecto: number): CamaraVista => ({ x: 0.5, y: 0.5, vista: vistaCasa(aspecto) * 1.02, giro: 0 });

/**
 * Centro de cámara sobre una capa vista de frente: el punto deseado (coordenadas de la imagen)
 * se ajusta para que, con ese zoom (`fraccion` = vista / lado) y esa proporción de pantalla,
 * la imagen siga cubriendo todo el cuadro.
 */
const mira = (capa: CapaMundo, u: Punto, fraccion: number, aspecto: number): Punto => {
  const ancho = aspecto >= 1 ? fraccion : fraccion * aspecto;
  const alto = aspecto >= 1 ? fraccion / aspecto : fraccion;
  const ajustar = (v: number, tam: number) => Math.min(1 - tam / 2, Math.max(tam / 2, v));
  return enMundo(capa, { x: ajustar(u.x, ancho), y: ajustar(u.y, alto) });
};

/** Posición de la gota en el mundo: cuelga del grifo y cae (con gravedad) hacia el lavabo. */
export function gotaEnMundo(t: number): { centro: Punto; formacion: number; caida: number } {
  const formacion = suave(0.72, 0.8, t);
  const u = clamp01((t - 0.8) / 0.14);
  const caida = u * u;
  // La gravedad apunta hacia abajo en la imagen del grifo (que se ve derecha con la casa girada).
  const abajo = girar({ x: 0, y: 1 }, GIRO_LAV);
  const colgando = RADIO_GOTA * (0.4 + 0.6 * formacion);
  const d = colgando + caida * CAIDA_EN_GRIFO * CAPA_GRIFO.lado;
  return { centro: { x: SALIDA_MUNDO.x + abajo.x * d, y: SALIDA_MUNDO.y + abajo.y * d }, formacion, caida };
}

function paradasLav(aspecto: number): Parada[] {
  const casa = camaraCasa(aspecto);
  // Siempre se apunta al mueble y a la grifería; cuánto se puede correr depende del zoom.
  const mueble = mira(CAPA_LAV, { x: 0.62, y: 0.45 }, 0.98, aspecto);
  const muebleCerca = mira(CAPA_LAV, { x: 0.62, y: 0.42 }, 0.88, aspecto);
  const abierto = mira(CAPA_LAV, { x: 0.6, y: 0.4 }, 0.74, aspecto);
  const grifo = mira(CAPA_GRIFO, { x: 0.5, y: 0.5 }, 0.97, aspecto);
  const colgando = gotaEnMundo(0.8).centro;
  const final = gotaEnMundo(TRAMOS_LAV.portal).centro;
  return [
    { s: 0, camara: { x: casa.x, y: casa.y, vista: casa.vista }, giro: 0 },
    { s: TRAMOS_LAV.casa[1], camara: { x: 0.52, y: 0.42, vista: casa.vista * 0.78 }, giro: -8 },
    { s: 0.2, camara: { x: LAV_EN_CASA.x, y: LAV_EN_CASA.y, vista: LADO_LAV * 1.9 }, giro: -70 },
    { s: TRAMOS_LAV.mueble[0], camara: { ...mueble, vista: LADO_LAV * 0.98 }, giro: -90 },
    { s: TRAMOS_LAV.mueble[1], camara: { ...muebleCerca, vista: LADO_LAV * 0.88 }, giro: -90 },
    { s: TRAMOS_LAV.puertas[1], camara: { ...abierto, vista: LADO_LAV * 0.74 }, giro: -90 },
    { s: TRAMOS_LAV.grifo[0], camara: { ...grifo, vista: CAPA_GRIFO.lado * 0.97 }, giro: -90 },
    { s: 0.8, camara: { ...colgando, vista: CAPA_GRIFO.lado * 0.6 }, giro: -90 },
    { s: TRAMOS_LAV.portal, camara: { ...final, vista: RADIO_GOTA * 0.9 }, giro: -90 },
  ];
}

/** Cámara del capítulo; desde el portal ya está otra vez sobre la casa. */
export function camaraLav(t: number, aspecto: number): CamaraVista {
  if (t >= TRAMOS_LAV.portal) return camaraCasa(aspecto);
  const c = trayecto(paradasLav(aspecto), t);
  // Desde que la gota se suelta, la cámara cae con ella: la gota queda al centro y el lavabo sube.
  const seguir = suave(0.77, 0.81, t);
  if (seguir <= 0) return c;
  const g = gotaEnMundo(t).centro;
  return { ...c, x: c.x + (g.x - c.x) * seguir, y: c.y + (g.y - c.y) * seguir };
}

/** Estado visual del capítulo para un instante. */
export function escenaLav(t: number, cam: CamaraVista, reducirMovimiento = false) {
  const g = suave(TRAMOS_LAV.pliegue[0], TRAMOS_LAV.pliegue[1], t);
  const ventana = (a: number, b: number, m = 0.02) => Math.min(suave(a - m, a + m, t), 1 - suave(b - m, b + m, t));
  const despuesPortal = t >= TRAMOS_LAV.portal;
  const gota = gotaEnMundo(t);
  return {
    opacidadCasa: despuesPortal ? 1 : 1 - suave(0.45, 0.9, g),
    // Bajada: la casa (piso) se inclina hacia el fondo y el mueble (pared) se endereza.
    anguloCasa: reducirMovimiento || despuesPortal ? 0 : 55 * g,
    opacidadLav: despuesPortal ? 0 : suave(0.1, 0.6, g),
    anguloLav: reducirMovimiento ? 0 : -40 * (1 - g),
    opacidadGrifo: despuesPortal ? 0 : 1 - suave(CAPA_GRIFO.lado * 1.08, CAPA_GRIFO.lado * 2.0, cam.vista),
    puertas: suave(TRAMOS_LAV.puertas[0], TRAMOS_LAV.puertas[1], t),
    gota: despuesPortal || t < TRAMOS_LAV.gota[0]
      ? null
      : {
          centro: gota.centro,
          radio: RADIO_GOTA * (0.25 + 0.75 * gota.formacion),
          // Al caer se alarga un poco, como una gota real.
          estira: 1 + 0.18 * Math.sin(Math.PI * gota.caida),
          mezcla: suave(0.89, TRAMOS_LAV.portal, t),
        },
    pines: despuesPortal ? suave(0.975, 0.995, t) : 1 - suave(0.01, 0.07, t),
    textos: {
      casa: despuesPortal ? suave(0.975, 0.995, t) : 1 - suave(0.02, 0.07, t),
      lav: ventana(TRAMOS_LAV.mueble[0] + 0.01, TRAMOS_LAV.mueble[1]),
      puertas: ventana(TRAMOS_LAV.puertas[0] + 0.02, TRAMOS_LAV.puertas[1] + 0.03),
      grifo: ventana(TRAMOS_LAV.grifo[0], 0.86),
    },
  };
}
