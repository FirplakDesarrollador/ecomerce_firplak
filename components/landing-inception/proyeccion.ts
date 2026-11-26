// Proyección del mundo (la casa vista desde arriba, de 0 a 1) a la pantalla, con giro de cámara.
// Cada capa es una imagen cuadrada con centro, lado y giro propios dentro del mundo.
import type { Punto } from './camaraInception';

/** Cámara: centro en el mundo, lado del mundo que cabe en el cuadro y giro de la vista (grados, horario). */
export interface CamaraVista { x: number; y: number; vista: number; giro: number }
/** Capa en el mundo: centro, lado y giro propio (grados, horario). */
export interface CapaMundo { cx: number; cy: number; lado: number; giro: number }
/** Escenario: lado del cuadrado que cubre la pantalla y su desplazamiento. */
export interface Escenario { lado: number; off: Punto }

const rad = (g: number) => (g * Math.PI) / 180;
export const girar = (p: Punto, grados: number): Punto => {
  const c = Math.cos(rad(grados)), s = Math.sin(rad(grados));
  return { x: c * p.x - s * p.y, y: s * p.x + c * p.y };
};

/** Punto del mundo en píxeles de pantalla. */
export function aPantallaG(p: Punto, cam: CamaraVista, esc: Escenario): Punto {
  const v = girar({ x: (p.x - cam.x) / cam.vista, y: (p.y - cam.y) / cam.vista }, cam.giro);
  return { x: v.x * esc.lado + esc.lado / 2 + esc.off.x, y: v.y * esc.lado + esc.lado / 2 + esc.off.y };
}

/** Punto de la pantalla en el mundo (inversa de aPantallaG). */
export function aMundo(p: Punto, cam: CamaraVista, esc: Escenario): Punto {
  const v = girar({ x: (p.x - esc.lado / 2 - esc.off.x) / esc.lado, y: (p.y - esc.lado / 2 - esc.off.y) / esc.lado }, -cam.giro);
  return { x: cam.x + v.x * cam.vista, y: cam.y + v.y * cam.vista };
}

/** Punto relativo de una capa (0-1 sobre su imagen) en el mundo. */
export function enMundo(capa: CapaMundo, u: Punto): Punto {
  const d = girar({ x: (u.x - 0.5) * capa.lado, y: (u.y - 0.5) * capa.lado }, capa.giro);
  return { x: capa.cx + d.x, y: capa.cy + d.y };
}

/** Punto del mundo en coordenadas relativas (0-1) de la imagen de una capa. */
export function enCapa(capa: CapaMundo, p: Punto): Punto {
  const d = girar({ x: (p.x - capa.cx) / capa.lado, y: (p.y - capa.cy) / capa.lado }, -capa.giro);
  return { x: d.x + 0.5, y: d.y + 0.5 };
}

/**
 * `transform` CSS de una capa (elemento de `lado` × `lado` px, origen arriba a la izquierda).
 * `inclinacion` gira la capa sobre un eje horizontal de la pantalla que pasa por `pivote`
 * (el pliegue entre la vista desde arriba y la vista a la altura de los ojos). La perspectiva
 * va dentro de la capa, en su propio tamaño, para que la inclinación se lea igual con cualquier zoom.
 */
export function transformCapa(capa: CapaMundo, cam: CamaraVista, esc: Escenario, inclinacion = 0, pivote?: Punto): string {
  const L = esc.lado;
  const k = capa.lado / cam.vista;
  const c = { x: L / 2 + esc.off.x, y: L / 2 + esc.off.y };
  const d = { x: ((capa.cx - cam.x) / cam.vista) * L, y: ((capa.cy - cam.y) / cam.vista) * L };
  let t = `translate3d(${c.x}px,${c.y}px,0) rotate(${cam.giro}deg) translate3d(${d.x}px,${d.y}px,0) rotate(${capa.giro}deg) scale3d(${k},${k},1) translate3d(${-L / 2}px,${-L / 2}px,0)`;
  if (inclinacion && pivote) {
    const u = enCapa(capa, pivote);
    const px = u.x * L, py = u.y * L, g = cam.giro + capa.giro;
    t += ` translate3d(${px}px,${py}px,0) rotate(${-g}deg) perspective(${L * 1.1}px) rotateX(${inclinacion}deg) rotate(${g}deg) translate3d(${-px}px,${-py}px,0)`;
  }
  return t;
}
