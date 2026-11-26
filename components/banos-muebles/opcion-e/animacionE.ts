/**
 * Opción E · movimiento de cajones y puerta a partir de dos renders (cerrado y abierto).
 *
 * Cajones: el render abierto se dibuja recortado al volumen que barre cada frente desde el mueble
 * hasta donde está (envolvente del frente y del frente retrocedido), con una transformación que lo
 * lleva de la posición abierta a la intermedia. Así la caja asoma solo lo que salió del mueble.
 * Puerta: gira sobre la bisagra; su cara exterior sale del render cerrado y, pasado el ángulo en
 * que se ve de canto, la interior (con las bisagras) sale del render abierto.
 */
import type { IdMuebleE } from './catalogoOpcionE';
import { curvaApertura, curvaCierre } from './opcionELogica';
import { CAJONES_E, LIENZO_E, PUERTA_E, type CajonE } from './rendersOpcionE';

type P = [number, number];

/** Ángulo de la puerta en el render abierto (resuelto con sus bordes: ~91°). */
const ANGULO_PUERTA = (90.8 * Math.PI) / 180;

/** Frente de un cajón en la posición de apertura e (0 cerrado, 1 como en el render abierto). */
export function frenteEn(c: CajonE, e: number): P[] {
  const k = 1 + (c.escala - 1) * e;
  return c.frente.map(([x, y]) => [c.centro[0] + (x - c.centro[0]) * k + c.mueve[0] * e, c.centro[1] + (y - c.centro[1]) * k + c.mueve[1] * e]);
}

/** Transformación que lleva un punto del render abierto a la apertura e: [escala, dx, dy]. */
export function transformacionCajon(c: CajonE, e: number): [number, number, number] {
  const k = (1 + (c.escala - 1) * e) / c.escala;
  return [k, c.centro[0] + c.mueve[0] * e - k * (c.mueve[0] + c.centro[0]), c.centro[1] + c.mueve[1] * e - k * (c.mueve[1] + c.centro[1])];
}

function envolvente(pts: P[]): P[] {
  const p = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cruz = (o: P, a: P, b: P) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo: P[] = [], hi: P[] = [];
  for (const q of p) { while (lo.length >= 2 && cruz(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
  for (const q of p.reverse()) { while (hi.length >= 2 && cruz(hi[hi.length - 2], hi[hi.length - 1], q) <= 0) hi.pop(); hi.push(q); }
  return [...lo.slice(0, -1), ...hi.slice(0, -1)];
}

/** Volumen visible del cajón en coordenadas del render abierto, para una apertura e. */
export function volumenCajon(c: CajonE, e: number): P[] {
  const abierto = frenteEn(c, 1);
  const atras = abierto.map(([x, y]): P => [x - c.mueve[0] * e, y - c.mueve[1] * e]);
  return envolvente([...abierto, ...atras]);
}

const trazar = (ctx: CanvasRenderingContext2D, pts: P[]) => {
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.closePath();
};

/** Puerta: vectores del canto libre respecto a la bisagra (arriba y abajo), cerrada y girada 90°. */
function geometriaPuerta() {
  const c = PUERTA_E.cerrada, o = PUERTA_E.abierta;
  const cos = Math.cos(ANGULO_PUERTA), sin = Math.sin(ANGULO_PUERTA);
  const vec = (f: readonly number[], h: readonly number[]): P => [f[0] - h[0], f[1] - h[1]];
  const ancho = { a: vec(c.fa, c.ha), b: vec(c.fb, c.hb) };
  const abiertoA = vec(o.fa, o.ha), abiertoB = vec(o.fb, o.hb);
  const fondo = {
    a: [(abiertoA[0] - cos * ancho.a[0]) / sin, (abiertoA[1] - cos * ancho.a[1]) / sin] as P,
    b: [(abiertoB[0] - cos * ancho.b[0]) / sin, (abiertoB[1] - cos * ancho.b[1]) / sin] as P,
  };
  return { c, o, ancho, fondo };
}
const PUERTA = geometriaPuerta();

/** Esquinas de la puerta abierta en f (0 cerrada, 1 como en el render): bisagra arriba/abajo y canto libre. */
export function puertaEn(f: number) {
  const { c, o, ancho, fondo } = PUERTA;
  const th = ANGULO_PUERTA * f, cos = Math.cos(th), sin = Math.sin(th);
  const mezcla = (a: readonly number[], b: readonly number[]): P => [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
  const ha = mezcla(c.ha, o.ha), hb = mezcla(c.hb, o.hb);
  const fa: P = [ha[0] + cos * ancho.a[0] + sin * fondo.a[0], ha[1] + cos * ancho.a[1] + sin * fondo.a[1]];
  const fb: P = [hb[0] + cos * ancho.b[0] + sin * fondo.b[0], hb[1] + cos * ancho.b[1] + sin * fondo.b[1]];
  // Cara exterior mientras el canto libre sigue a la derecha de la bisagra; después, la interior.
  return { ha, hb, fa, fb, exterior: fa[0] - ha[0] > 0 };
}

/** Dibuja un triángulo de `src` (puntos s) en el triángulo d del destino con una transformación afín. */
function triangulo(ctx: CanvasRenderingContext2D, esc: number, src: CanvasImageSource, s: P[], d: P[]) {
  const [[x0, y0], [x1, y1], [x2, y2]] = s;
  const [[u0, v0], [u1, v1], [u2, v2]] = d;
  const den = (x1 - x0) * (y2 - y0) - (x2 - x0) * (y1 - y0);
  if (Math.abs(den) < 1e-6) return;
  const a = ((u1 - u0) * (y2 - y0) - (u2 - u0) * (y1 - y0)) / den;
  const b = ((v1 - v0) * (y2 - y0) - (v2 - v0) * (y1 - y0)) / den;
  const c = ((u2 - u0) * (x1 - x0) - (u1 - u0) * (x2 - x0)) / den;
  const dd = ((v2 - v0) * (x1 - x0) - (v1 - v0) * (x2 - x0)) / den;
  const e = u0 - a * x0 - c * y0, f = v0 - b * x0 - dd * y0;
  ctx.save();
  ctx.setTransform(esc, 0, 0, esc, 0, 0);
  // Un poco más grande para que no se vea la unión entre los dos triángulos.
  const cx = (u0 + u1 + u2) / 3, cy = (v0 + v1 + v2) / 3;
  ctx.beginPath();
  trazar(ctx, d.map(([u, v]): P => [u + Math.sign(u - cx) * 0.8, v + Math.sign(v - cy) * 0.8]));
  ctx.clip();
  ctx.setTransform(esc * a, esc * b, esc * c, esc * dd, esc * e, esc * f);
  ctx.drawImage(src, 0, 0);
  ctx.restore();
}

/** Recorta a un polígono (coordenadas del render) y dibuja `src` encima. */
function dentroDe(ctx: CanvasRenderingContext2D, esc: number, src: CanvasImageSource, poligonos: P[][], alfa = 1) {
  if (alfa <= 0) return;
  ctx.save();
  ctx.setTransform(esc, 0, 0, esc, 0, 0);
  ctx.globalAlpha = alfa;
  ctx.beginPath();
  for (const p of poligonos) trazar(ctx, p);
  ctx.clip();
  ctx.drawImage(src, 0, 0);
  ctx.restore();
}

/**
 * Dibuja el cuerpo del mueble con los cajones abiertos en `cajones` y la puerta en `puerta` (0 a 1).
 * `cerrado` y `abierto` son los cuerpos ya pintados con el acabado, del tamaño del render; el lienzo
 * de destino puede ser más pequeño (se escala).
 */
export function dibujarMovimiento(
  ctx: CanvasRenderingContext2D,
  cerrado: CanvasImageSource,
  abierto: CanvasImageSource,
  mueble: IdMuebleE,
  cajones: number,
  puerta: number,
) {
  const { width, height } = ctx.canvas;
  const esc = width / LIENZO_E.ancho;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.setTransform(esc, 0, 0, esc, 0, 0);
  const conPuerta = mueble === 'vitelli';
  const p = conPuerta ? puerta : 0;
  if (cajones <= 0 && p <= 0) { ctx.drawImage(cerrado, 0, 0); return; }
  if (cajones >= 1 && (p >= 1 || !conPuerta)) { ctx.drawImage(abierto, 0, 0); return; }

  ctx.drawImage(cerrado, 0, 0);
  const lista = CAJONES_E[mueble];

  // Hueco: donde estaban los frentes cerrados se ve el interior del render abierto.
  if (cajones > 0) dentroDe(ctx, esc, abierto, lista.map((c) => c.frente as P[]));
  if (p > 0) {
    const c = PUERTA_E.cerrada;
    const borde = PUERTA_E.abierta.ha[0] + 8;
    dentroDe(ctx, esc, abierto, [[[borde, c.ha[1]], [c.fa[0], c.fa[1]], [c.fb[0], c.fb[1]], [borde, c.hb[1]]]]);
    // Junto a la bisagra el render abierto tiene el arranque de la puerta: entra a medida que gira.
    dentroDe(ctx, esc, abierto, [[[c.ha[0] - 2, c.ha[1]], [borde, c.ha[1]], [borde, c.hb[1]], [c.hb[0] - 2, c.hb[1]]]], p * p);
  }

  // Puerta: detrás de los cajones (están a su derecha, más cerca de la cámara).
  if (p > 0) {
    const q = puertaEn(p);
    const destino: P[] = [q.ha, q.fa, q.fb, q.hb];
    const pc = PUERTA_E.cerrada, po = PUERTA_E.abierta;
    const origen: P[] = q.exterior
      ? [[pc.ha[0], pc.ha[1]], [pc.fa[0], pc.fa[1]], [pc.fb[0], pc.fb[1]], [pc.hb[0], pc.hb[1]]]
      : [[po.ha[0], po.ha[1]], [po.fa[0], po.fa[1]], [po.fb[0], po.fb[1]], [po.hb[0], po.hb[1]]];
    const fuente = q.exterior ? cerrado : abierto;
    triangulo(ctx, esc, fuente, [origen[0], origen[1], origen[2]], [destino[0], destino[1], destino[2]]);
    triangulo(ctx, esc, fuente, [origen[0], origen[2], origen[3]], [destino[0], destino[2], destino[3]]);
    // La cara que gira se oscurece un poco al ponerse de canto frente a la luz.
    const canto = 1 - Math.min(1, Math.abs(q.fa[0] - q.ha[0]) / 140);
    if (canto > 0) {
      ctx.save();
      ctx.setTransform(esc, 0, 0, esc, 0, 0);
      ctx.globalAlpha = 0.28 * canto;
      ctx.fillStyle = '#1a140e';
      ctx.beginPath();
      trazar(ctx, destino);
      ctx.fill();
      ctx.restore();
    }
  }

  // Cajones: de abajo hacia arriba (el de arriba tapa el interior del de abajo); cada uno sin los
  // frentes de los otros.
  if (cajones > 0) {
    for (let i = lista.length - 1; i >= 0; i--) {
      const c = lista[i];
      const [k, dx, dy] = transformacionCajon(c, cajones);
      ctx.save();
      ctx.setTransform(esc * k, 0, 0, esc * k, esc * dx, esc * dy);
      ctx.beginPath();
      trazar(ctx, volumenCajon(c, cajones));
      ctx.clip();
      lista.forEach((otro, j) => {
        if (j === i) return;
        ctx.beginPath();
        ctx.rect(-50, -50, LIENZO_E.ancho + 100, LIENZO_E.alto + 100);
        trazar(ctx, frenteEn(otro, 1));
        ctx.clip('evenodd');
      });
      ctx.drawImage(abierto, 0, 0);
      ctx.restore();
    }
    // Al llegar al final, el render cerrado toma el relevo sin salto.
    if (cajones < 0.05) dentroDe(ctx, esc, cerrado, lista.map((c) => c.frente as P[]), 1 - cajones / 0.05);
  }
}

/* ---------------- Línea de tiempo ---------------- */

export interface MovimientoE {
  cajones: number;
  puerta: number;
}

/** Abrir es ágil; cerrar dura más porque el último tramo va despacio (amortiguador). */
export const DURACION_ABRIR_E = 1150;
export const DURACION_CERRAR_E = 1900;

const tramo = (t: number, desde: number, hasta: number) => (t - desde) / (hasta - desde);

/**
 * Apertura de cajones y puerta en el instante t (0 a 1) de una orden de abrir o cerrar que empezó
 * en `desde`. Al abrir, la puerta va primero y los cajones salen detrás; al cerrar, los cajones
 * entran primero y la puerta cierra después. Cada pieza parte de donde estaba (se puede invertir
 * a mitad de camino sin saltos).
 */
export function movimientoEn(desde: MovimientoE, abrir: boolean, t: number, conPuerta: boolean): MovimientoE {
  if (abrir) {
    const c = conPuerta ? curvaApertura(tramo(t, 0.26, 1)) : curvaApertura(t);
    const p = conPuerta ? curvaApertura(tramo(t, 0, 0.62)) : 0;
    return { cajones: desde.cajones + (1 - desde.cajones) * c, puerta: desde.puerta + (1 - desde.puerta) * p };
  }
  const c = conPuerta ? curvaCierre(tramo(t, 0, 0.7)) : curvaCierre(t);
  const p = conPuerta ? curvaCierre(tramo(t, 0.28, 1)) : 0;
  return { cajones: desde.cajones * c, puerta: desde.puerta * p };
}

/** Recorrido real de los rieles de extensión total. */
export const EXTENSION_CM_E = 35;

/**
 * Cota del recorrido del cajón de abajo: va del frente cerrado al frente en la apertura e, por
 * debajo de la arista inferior derecha y un poco separada, como en un plano.
 */
export function cotaCajon(mueble: IdMuebleE, e: number, separacion = 30) {
  const lista = CAJONES_E[mueble];
  const c = lista[lista.length - 1];
  const a = c.frente[2] as P;
  const b = frenteEn(c, e)[2];
  const largo = Math.hypot(c.mueve[0], c.mueve[1]) || 1;
  // Normal al recorrido, hacia abajo.
  let nx = -c.mueve[1] / largo, ny = c.mueve[0] / largo;
  if (ny < 0) { nx = -nx; ny = -ny; }
  const desde: P = [a[0] + nx * separacion, a[1] + ny * separacion];
  const hasta: P = [b[0] + nx * separacion, b[1] + ny * separacion];
  return { desde, hasta, normal: [nx, ny] as P, centimetros: Math.round(EXTENSION_CM_E * e) };
}

/* ---------------- Motor: dibuja el cuerpo y lo anima (fuera de React) ---------------- */

export interface CuerposE {
  mueble: IdMuebleE;
  clave: string;
  cerrado: HTMLCanvasElement;
  abierto: HTMLCanvasElement | null;
}

/**
 * Lleva el estado del movimiento y lo dibuja en `lienzo` con requestAnimationFrame. `alPintar`
 * recibe cada cuadro (para la cota y las etiquetas que acompañan al cajón).
 */
export function crearMotorE(lienzo: HTMLCanvasElement, alPintar: (m: MovimientoE, mueble: IdMuebleE) => void) {
  const ctx = lienzo.getContext('2d');
  let cuerpos: CuerposE | null = null;
  let mov: MovimientoE = { cajones: 0, puerta: 0 };
  let orden: { abrir: boolean; inicio: number | null; desde: MovimientoE; duracion: number } | null = null;
  let raf = 0;

  const pintar = () => {
    if (!ctx || !cuerpos) return;
    const m = cuerpos.abierto ? mov : { cajones: 0, puerta: 0 };
    dibujarMovimiento(ctx, cuerpos.cerrado, cuerpos.abierto ?? cuerpos.cerrado, cuerpos.mueble, m.cajones, m.puerta);
    alPintar(m, cuerpos.mueble);
  };

  const paso = (ahora: number) => {
    if (!orden || !cuerpos) return;
    if (orden.inicio === null) orden.inicio = ahora;
    const t = Math.min(1, (ahora - orden.inicio) / orden.duracion);
    mov = movimientoEn(orden.desde, orden.abrir, t, cuerpos.mueble === 'vitelli');
    pintar();
    if (t < 1) raf = requestAnimationFrame(paso);
    else {
      orden = null;
      raf = 0;
    }
  };

  return {
    movimiento: () => mov,
    /** Cuerpos nuevos (otro mueble, acabado o lavamanos): se dibujan en el estado actual. */
    ponerCuerpos(c: CuerposE) {
      cuerpos = c;
      pintar();
    },
    /** Llega el render abierto de los cuerpos que se están mostrando. */
    ponerAbierto(clave: string, abierto: HTMLCanvasElement) {
      if (!cuerpos || cuerpos.clave !== clave) return;
      cuerpos = { ...cuerpos, abierto };
      pintar();
    },
    claveActual: () => cuerpos?.clave ?? null,
    ordenar(abrir: boolean, inmediato: boolean) {
      cancelAnimationFrame(raf);
      raf = 0;
      if (inmediato) {
        orden = null;
        mov = abrir ? { cajones: 1, puerta: 1 } : { cajones: 0, puerta: 0 };
        pintar();
        return;
      }
      orden = { abrir, inicio: null, desde: { ...mov }, duracion: abrir ? DURACION_ABRIR_E : DURACION_CERRAR_E };
      raf = requestAnimationFrame(paso);
    },
    destruir() {
      cancelAnimationFrame(raf);
      orden = null;
    },
  };
}

export type MotorE = ReturnType<typeof crearMotorE>;
