/**
 * Opción D · operaciones de píxel puras (sin DOM).
 *
 * Cuerpo (mueble): capa R = madera, G = plano (0 frente, 255 costado); luz aparte (gris, x128).
 * Tapa (lavamanos + grifería): capa R = gelcoat, G = grifería.
 */
import { tonoMetal, type ImagenRGBA, type TonoGrifo } from '../opcion-c/pixelesC';

export interface CapaCuerpoD {
  ancho: number;
  idx: Uint32Array;
  mascara: Uint8Array;
  costado: Uint8Array;
  luz: Uint8Array;
}

export function prepararCuerpo(capa: ImagenRGBA, luz: ImagenRGBA): CapaCuerpoD {
  const c = capa.data, l = luz.data, total = capa.width * capa.height;
  let n = 0;
  for (let i = 0; i < total; i++) if (c[i * 4] > 8) n++;
  const idx = new Uint32Array(n), mascara = new Uint8Array(n), costado = new Uint8Array(n), lz = new Uint8Array(n);
  for (let i = 0, k = 0; i < total; i++) {
    if (c[i * 4] <= 8) continue;
    idx[k] = i;
    mascara[k] = c[i * 4];
    costado[k] = c[i * 4 + 1] > 127 ? 1 : 0;
    lz[k] = l[i * 4];
    k++;
  }
  return { ancho: capa.width, idx, mascara, costado, luz: lz };
}

/** Orientación de la veta: arista frente/costado, pendientes de las aristas y píxeles por centímetro. */
export interface VetaD {
  esquinaX: number;
  pendienteFrente: number;
  pendienteCostado: number;
  pxPorCm: number;
}

export interface MaterialD {
  /** Unicolor: color con luz plena. */
  plano?: [number, number, number];
  /** Melamina maderada: textura (veta vertical en la imagen) y ancho real que cubre. */
  textura?: ImagenRGBA;
  cmTextura: number;
}

/**
 * Pinta el tablero con la luz del render. En los frentes la veta corre a lo largo de las aristas
 * horizontales; en los costados (y la puerta abierta) corre en vertical. La textura se espeja al
 * repetirse para que no se note la unión.
 */
export function aplicarMadera(o: Uint8ClampedArray | Uint8Array, capa: CapaCuerpoD, material: MaterialD, veta: VetaD) {
  const { ancho, idx, mascara, costado, luz } = capa;
  const tex = material.textura;
  const plano = material.plano;
  const TW = tex?.width ?? 1, TH = tex?.height ?? 1, T = tex?.data;
  const k = tex ? TW / (material.cmTextura * veta.pxPorCm) : 0;
  for (let n = 0; n < idx.length; n++) {
    const i = idx[n];
    const x = i % ancho, y = (i / ancho) | 0;
    let r: number, g: number, b: number;
    if (T) {
      const a = x - veta.esquinaX;
      let u: number, v: number;
      if (costado[n]) {
        u = a * k + 391;
        v = (y - veta.pendienteCostado * a) * k + 157;
      } else {
        u = (y - veta.pendienteFrente * a) * k;
        v = a * k;
      }
      const tu = Math.floor(u / TW), tv = Math.floor(v / TH);
      let sx = Math.floor(u - tu * TW), sy = Math.floor(v - tv * TH);
      if (tu & 1) sx = TW - 1 - sx;
      if (tv & 1) sy = TH - 1 - sy;
      const j = (sy * TW + sx) * 4;
      r = T[j]; g = T[j + 1]; b = T[j + 2];
    } else {
      [r, g, b] = plano ?? [240, 240, 240];
    }
    const m = mascara[n] / 255, l = luz[n] / 128, q = i * 4;
    o[q] = o[q] * (1 - m) + Math.min(255, r * l) * m;
    o[q + 1] = o[q + 1] * (1 - m) + Math.min(255, g * l) * m;
    o[q + 2] = o[q + 2] * (1 - m) + Math.min(255, b * l) * m;
  }
}

export interface CapaTapaD {
  ancho: number;
  lav: Uint32Array;
  mLav: Uint8Array;
  grifo: Uint32Array;
  mGrifo: Uint8Array;
  lumGrifo: Uint8Array;
  grifoY0: number;
  grifoY1: number;
}

const lum = (d: Uint8ClampedArray | Uint8Array, q: number) => 0.2126 * d[q] + 0.7152 * d[q + 1] + 0.0722 * d[q + 2];

export function prepararTapa(foto: ImagenRGBA, capa: ImagenRGBA): CapaTapaD {
  const c = capa.data, f = foto.data, total = capa.width * capa.height;
  let nl = 0, ng = 0;
  for (let i = 0; i < total; i++) { if (c[i * 4] > 8) nl++; if (c[i * 4 + 1] > 8) ng++; }
  const lav = new Uint32Array(nl), mLav = new Uint8Array(nl), grifo = new Uint32Array(ng), mGrifo = new Uint8Array(ng), lumGrifo = new Uint8Array(ng);
  let y0 = capa.height, y1 = 0;
  for (let i = 0, a = 0, b = 0; i < total; i++) {
    if (c[i * 4] > 8) { lav[a] = i; mLav[a] = c[i * 4]; a++; }
    if (c[i * 4 + 1] > 8) {
      grifo[b] = i; mGrifo[b] = c[i * 4 + 1]; lumGrifo[b] = Math.round(lum(f, i * 4));
      const y = (i / capa.width) | 0;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
      b++;
    }
  }
  return { ancho: capa.width, lav, mLav, grifo, mGrifo, lumGrifo, grifoY0: y0, grifoY1: Math.max(y0 + 1, y1) };
}

/** Blanco del gelcoat a plena luz en los renders. */
const BLANCO_GELCOAT = 238;

/**
 * Tiñe el gelcoat: el color multiplica la luz del render y los brillos (reflejos del esmalte)
 * se conservan blancos, como en un gelcoat real.
 */
export function aplicarColorLavamanos(o: Uint8ClampedArray | Uint8Array, capa: CapaTapaD, color: [number, number, number]) {
  for (let n = 0; n < capa.lav.length; n++) {
    const q = capa.lav[n] * 4;
    const L = lum(o, q) / BLANCO_GELCOAT;
    // Solo lo que pasa del blanco a plena luz es reflejo del esmalte.
    const brillo = Math.min(1, Math.max(0, (L - 1.02) / 0.06));
    const m = capa.mLav[n] / 255;
    for (let c = 0; c < 3; c++) {
      const tenido = Math.min(255, color[c] * L);
      const v = tenido * (1 - brillo) + o[q + c] * brillo;
      o[q + c] = o[q + c] * (1 - m) + v * m;
    }
  }
}

/** Recolorea la grifería renderizada con otro tono de metal; forma y reflejos son los del render. */
export function aplicarGrifoD(o: Uint8ClampedArray | Uint8Array, capa: CapaTapaD, tono: TonoGrifo) {
  const alto = capa.grifoY1 - capa.grifoY0;
  for (let n = 0; n < capa.grifo.length; n++) {
    const i = capa.grifo[n], q = i * 4;
    const y = (i / capa.ancho) | 0;
    const [r, g, b] = tonoMetal(tono, capa.lumGrifo[n] / 255, (y - capa.grifoY0) / alto);
    const m = capa.mGrifo[n] / 255;
    o[q] = o[q] * (1 - m) + r * m;
    o[q + 1] = o[q + 1] * (1 - m) + g * m;
    o[q + 2] = o[q + 2] * (1 - m) + b * m;
  }
}
