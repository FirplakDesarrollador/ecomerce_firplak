/**
 * Compositor del Mix & Match (Opcion B), solo navegador.
 *
 * Cada render trae una "capa" (scripts/mix-match/preparar-opcion-b.mjs):
 * R = mascara del mueble, G = luz del render sin veta (x128). Para aplicar un
 * acabado se multiplica la textura del tablero por esa luz dentro de la
 * mascara; el resto del render (lavamanos, grifo, sombras) queda intacto.
 */

export interface DatosRender {
  lado: number;
  base: ImageData;
  /** Indices de pixel que pertenecen al mueble (mascara > 0). */
  indices: Uint32Array;
  mascara: Float32Array;
  luz: Float32Array;
}

const imagenes = new Map<string, Promise<HTMLImageElement>>();

export function cargarImagen(src: string): Promise<HTMLImageElement> {
  let p = imagenes.get(src);
  if (!p) {
    p = new Promise((resolve, reject) => {
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`No cargo ${src}`));
      img.src = src;
    });
    imagenes.set(src, p);
  }
  return p;
}

function pixeles(img: HTMLImageElement, lado: number): ImageData {
  const c = document.createElement('canvas');
  c.width = lado;
  c.height = lado;
  const ctx = c.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Canvas 2D no disponible');
  ctx.drawImage(img, 0, 0, lado, lado);
  return ctx.getImageData(0, 0, lado, lado);
}

const renders = new Map<string, Promise<DatosRender>>();

export function cargarRender(base: string, capa: string, lado: number): Promise<DatosRender> {
  const clave = `${base}|${lado}`;
  let p = renders.get(clave);
  if (!p) {
    p = Promise.all([cargarImagen(base), cargarImagen(capa)]).then(([bi, ci]) => {
      const b = pixeles(bi, lado);
      const c = pixeles(ci, lado).data;
      const total = lado * lado;
      const mascara = new Float32Array(total);
      const luz = new Float32Array(total);
      let n = 0;
      for (let i = 0; i < total; i++) {
        const m = c[i * 4] / 255;
        if (m > 0.004) n++;
        mascara[i] = m;
        luz[i] = c[i * 4 + 1] / 128;
      }
      const indices = new Uint32Array(n);
      for (let i = 0, k = 0; i < total; i++) if (mascara[i] > 0.004) indices[k++] = i;
      return { lado, base: b, indices, mascara, luz };
    });
    renders.set(clave, p);
  }
  return p;
}

const texturas = new Map<string, Promise<ImageData>>();

export function cargarTextura(src: string): Promise<ImageData> {
  let p = texturas.get(src);
  if (!p) {
    p = cargarImagen(src).then((img) => {
      const c = document.createElement('canvas');
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      const ctx = c.getContext('2d', { willReadFrequently: true });
      if (!ctx) throw new Error('Canvas 2D no disponible');
      ctx.drawImage(img, 0, 0);
      return ctx.getImageData(0, 0, c.width, c.height);
    });
    texturas.set(src, p);
  }
  return p;
}

/**
 * Pinta en `destino` el render con la textura aplicada al mueble.
 * La textura va en espacio de pantalla, espejada para que no se note la union,
 * con la veta horizontal como en los frentes reales.
 */
export function componer(destino: HTMLCanvasElement, r: DatosRender, tex: ImageData) {
  const { lado, base, indices, mascara, luz } = r;
  destino.width = lado;
  destino.height = lado;
  const ctx = destino.getContext('2d');
  if (!ctx) return;
  const out = new ImageData(new Uint8ClampedArray(base.data), lado, lado);
  const o = out.data;
  const T = tex.data, TW = tex.width, TH = tex.height;
  // La textura cubre ~70 cm de tablero; el mueble mide ~63 cm sobre ~72% del lado.
  const escala = TW / (lado * 0.8);
  const x0 = lado * 0.15;
  for (let k = 0; k < indices.length; k++) {
    const i = indices[k];
    const x = i % lado, y = (i / lado) | 0;
    const u = (x - x0) * escala, v = y * escala;
    const tu = Math.floor(u / TW), tv = Math.floor(v / TH);
    let sx = Math.floor(u - tu * TW), sy = Math.floor(v - tv * TH);
    if (tu & 1) sx = TW - 1 - sx;
    if (tv & 1) sy = TH - 1 - sy;
    const j = (sy * TW + sx) * 4;
    const m = mascara[i], l = luz[i], q = i * 4;
    o[q] = o[q] * (1 - m) + Math.min(255, T[j] * l) * m;
    o[q + 1] = o[q + 1] * (1 - m) + Math.min(255, T[j + 1] * l) * m;
    o[q + 2] = o[q + 2] * (1 - m) + Math.min(255, T[j + 2] * l) * m;
  }
  ctx.putImageData(out, 0, 0);
}
