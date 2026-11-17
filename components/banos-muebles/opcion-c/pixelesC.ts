/**
 * Opcion C · operaciones de pixel puras (sin DOM): se usan en el navegador y
 * en los scripts de revision con Node.
 *
 * La capa de cada render (scripts/mix-match/preparar-opcion-c.mjs) trae:
 *   R = mascara del mueble        G = luz sin veta (x128) / luminancia del grifo
 *   B = mascara del grifo
 */

export interface ImagenRGBA {
  data: Uint8ClampedArray | Uint8Array;
  width: number;
  height: number;
}

export interface CapaC {
  lado: number;
  /** Pixeles del mueble (mascara > 0) y sus valores en bytes (mascara 0-255; luz = byte / 128). */
  mueble: Uint32Array;
  mascara: Uint8Array;
  luz: Uint8Array;
  /** Pixeles del grifo, su mascara y su luminancia original (bytes). */
  grifo: Uint32Array;
  mGrifo: Uint8Array;
  lumGrifo: Uint8Array;
  /** Filas del grifo, para el degradado de su reflejo. */
  grifoY0: number;
  grifoY1: number;
}

/** Tono de una griferia simulada a partir de la luminancia del grifo negro del render. */
export interface TonoGrifo {
  /** Color del metal (0-1). */
  color: [number, number, number];
  /** Brillo base, ganancia sobre la luminancia original y reflejo del cielo (arriba mas claro). */
  base: number;
  ganancia: number;
  cielo: number;
  /** Color al que tiende el brillo especular cuando se satura. */
  brillo: [number, number, number];
}

/** Encuadre del tablero: x (fraccion del lado) donde empieza el frente y ancho que cubre una textura. */
export interface EncuadreTextura {
  x0: number;
  ancho: number;
}

export function prepararCapa(capa: ImagenRGBA): CapaC {
  const lado = capa.width;
  const c = capa.data;
  const total = lado * lado;
  let nm = 0, ng = 0;
  for (let i = 0; i < total; i++) {
    if (c[i * 4] > 1) nm++;
    if (c[i * 4 + 2] > 1) ng++;
  }
  const mueble = new Uint32Array(nm), mascara = new Uint8Array(nm), luz = new Uint8Array(nm);
  const grifo = new Uint32Array(ng), mGrifo = new Uint8Array(ng), lumGrifo = new Uint8Array(ng);
  let gy0 = lado, gy1 = 0;
  for (let i = 0, a = 0, b = 0; i < total; i++) {
    const q = i * 4;
    if (c[q] > 1) {
      mueble[a] = i;
      mascara[a] = c[q];
      luz[a] = c[q + 1];
      a++;
    }
    if (c[q + 2] > 1) {
      grifo[b] = i;
      mGrifo[b] = c[q + 2];
      lumGrifo[b] = c[q + 1];
      const y = (i / lado) | 0;
      if (y < gy0) gy0 = y;
      if (y > gy1) gy1 = y;
      b++;
    }
  }
  return { lado, mueble, mascara, luz, grifo, mGrifo, lumGrifo, grifoY0: gy0, grifoY1: Math.max(gy0 + 1, gy1) };
}

/**
 * Multiplica la textura del tablero por la luz del render dentro de la mascara.
 * La textura va en espacio de pantalla, espejada para que no se note la union,
 * con la veta horizontal como en los frentes reales.
 */
export function aplicarAcabado(o: Uint8ClampedArray, capa: CapaC, tex: ImagenRGBA, encuadre: EncuadreTextura) {
  const { lado, mueble, mascara, luz } = capa;
  const T = tex.data, TW = tex.width, TH = tex.height;
  const escala = TW / (lado * encuadre.ancho);
  const x0 = lado * encuadre.x0;
  for (let k = 0; k < mueble.length; k++) {
    const i = mueble[k];
    const x = i % lado, y = (i / lado) | 0;
    const u = (x - x0) * escala, v = y * escala;
    const tu = Math.floor(u / TW), tv = Math.floor(v / TH);
    let sx = Math.floor(u - tu * TW), sy = Math.floor(v - tv * TH);
    if (tu & 1) sx = TW - 1 - sx;
    if (tv & 1) sy = TH - 1 - sy;
    const j = (sy * TW + sx) * 4;
    const m = mascara[k] / 255, l = luz[k] / 128, q = i * 4;
    o[q] = o[q] * (1 - m) + Math.min(255, T[j] * l) * m;
    o[q + 1] = o[q + 1] * (1 - m) + Math.min(255, T[j + 1] * l) * m;
    o[q + 2] = o[q + 2] * (1 - m) + Math.min(255, T[j + 2] * l) * m;
  }
}

/** Color del metal para una luminancia original L (0-1) a la altura relativa yRel (0 arriba). */
export function tonoMetal(t: TonoGrifo, L: number, yRel: number): [number, number, number] {
  const v = t.base + t.ganancia * L + t.cielo * (1 - yRel);
  const sat = Math.min(1, Math.max(0, (v - 1) / 0.35));
  const w = Math.min(1, Math.max(0, v));
  return [
    (t.color[0] * w * (1 - sat) + t.brillo[0] * sat) * 255,
    (t.color[1] * w * (1 - sat) + t.brillo[1] * sat) * 255,
    (t.color[2] * w * (1 - sat) + t.brillo[2] * sat) * 255,
  ];
}

/** Recolorea el grifo del render con un tono de metal; la forma y los reflejos son los del render. */
export function aplicarGrifo(o: Uint8ClampedArray, capa: CapaC, tono: TonoGrifo) {
  const { lado, grifo, mGrifo, lumGrifo, grifoY0, grifoY1 } = capa;
  const alto = grifoY1 - grifoY0;
  for (let k = 0; k < grifo.length; k++) {
    const i = grifo[k];
    const y = (i / lado) | 0;
    const [r, g, b] = tonoMetal(tono, lumGrifo[k] / 255, (y - grifoY0) / alto);
    const m = mGrifo[k] / 255, q = i * 4;
    o[q] = o[q] * (1 - m) + r * m;
    o[q + 1] = o[q + 1] * (1 - m) + g * m;
    o[q + 2] = o[q + 2] * (1 - m) + b * m;
  }
}
