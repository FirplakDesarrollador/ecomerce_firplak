// Dibuja una placa (video o imagen) en WebGL con paralaje por mapa de profundidad y
// desenfoque radial de zoom. La capa se sigue moviendo con CSS; esto solo pinta su interior.

const VERTICES = `
attribute vec2 p;
varying vec2 v;
void main() {
  v = vec2(p.x * 0.5 + 0.5, 0.5 - p.y * 0.5);
  gl_Position = vec4(p, 0.0, 1.0);
}`;

// Paralaje inverso iterado: cada píxel busca de dónde vendría según su profundidad
// (1 = cerca). Lo cercano se mueve con `uShift` y crece con `uDolly` alrededor de `uCentro`.
const FRAGMENTOS = `
precision highp float;
varying vec2 v;
uniform sampler2D uColor;
uniform sampler2D uDepth;
uniform vec2 uShift;
uniform float uDolly;
uniform float uFocus;
uniform float uConProf;
uniform vec2 uCentro;
uniform float uBlur;

vec2 desplazar(vec2 uv) {
  vec2 q = uv;
  for (int i = 0; i < 4; i++) {
    float d = (texture2D(uDepth, q).r - uFocus) * uConProf;
    q = uv - d * (uShift + (uv - uCentro) * uDolly);
  }
  return clamp(q, 0.0, 1.0);
}

void main() {
  vec2 uv = desplazar(v);
  if (uBlur < 0.0004) {
    gl_FragColor = texture2D(uColor, uv);
    return;
  }
  vec4 acc = vec4(0.0);
  for (int i = 0; i < 9; i++) {
    float t = float(i) / 8.0 - 0.5;
    acc += texture2D(uColor, clamp(uv + (uv - uCentro) * uBlur * t, 0.0, 1.0));
  }
  gl_FragColor = acc / 9.0;
}`;

export interface UniformesPlaca {
  shift: [number, number];
  dolly: number;
  /** Centro del zoom en coordenadas de la imagen (0-1). */
  centro: [number, number];
  /** Largo del desenfoque radial (0 = nítido). */
  blur: number;
}

type Fuente = HTMLVideoElement | HTMLImageElement;

const listo = (f: Fuente) =>
  f instanceof HTMLVideoElement ? f.readyState >= 2 && f.videoWidth > 0 : f.complete && f.naturalWidth > 0;

export class PlacaViva {
  private readonly gl: WebGLRenderingContext;
  private readonly texColor: WebGLTexture;
  private readonly texProf: WebGLTexture;
  private readonly u: Record<string, WebGLUniformLocation | null> = {};
  private fuente: Fuente | null = null;
  private foco = 0.5;
  private conProf = 0;
  private colorCargado = false;

  private constructor(gl: WebGLRenderingContext, programa: WebGLProgram) {
    this.gl = gl;
    gl.useProgram(programa);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(programa, 'p');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
    for (const n of ['uColor', 'uDepth', 'uShift', 'uDolly', 'uFocus', 'uConProf', 'uCentro', 'uBlur']) {
      this.u[n] = gl.getUniformLocation(programa, n);
    }
    this.texColor = this.textura(0);
    this.texProf = this.textura(1);
    // Profundidad neutra hasta que llegue el mapa.
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, 1, 1, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, new Uint8Array([128]));
    gl.uniform1i(this.u.uColor, 0);
    gl.uniform1i(this.u.uDepth, 1);
  }

  static crear(canvas: HTMLCanvasElement): PlacaViva | null {
    const gl = canvas.getContext('webgl', { alpha: false, antialias: false, premultipliedAlpha: false, preserveDrawingBuffer: false });
    if (!gl) return null;
    const compilar = (tipo: number, codigo: string) => {
      const sh = gl.createShader(tipo);
      if (!sh) return null;
      gl.shaderSource(sh, codigo);
      gl.compileShader(sh);
      return gl.getShaderParameter(sh, gl.COMPILE_STATUS) ? sh : null;
    };
    const vs = compilar(gl.VERTEX_SHADER, VERTICES), fs = compilar(gl.FRAGMENT_SHADER, FRAGMENTOS);
    const programa = gl.createProgram();
    if (!vs || !fs || !programa) return null;
    gl.attachShader(programa, vs);
    gl.attachShader(programa, fs);
    gl.linkProgram(programa);
    if (!gl.getProgramParameter(programa, gl.LINK_STATUS)) return null;
    return new PlacaViva(gl, programa);
  }

  private textura(unidad: number): WebGLTexture {
    const gl = this.gl;
    const t = gl.createTexture();
    if (!t) throw new Error('Sin textura WebGL');
    gl.activeTexture(gl.TEXTURE0 + unidad);
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return t;
  }

  ponerFuente(fuente: Fuente) {
    this.fuente = fuente;
  }

  ponerProfundidad(img: HTMLImageElement, foco: number) {
    const gl = this.gl;
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.texProf);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, gl.LUMINANCE, gl.UNSIGNED_BYTE, img);
    this.foco = foco;
    this.conProf = 1;
  }

  /** Sube el cuadro actual de la fuente. Devuelve false si todavía no hay nada que mostrar. */
  subirCuadro(): boolean {
    const f = this.fuente;
    if (!f || !listo(f)) return this.colorCargado;
    const gl = this.gl;
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texColor);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, f);
    this.colorCargado = true;
    return true;
  }

  dibujar(u: UniformesPlaca) {
    if (!this.colorCargado) return;
    const gl = this.gl;
    const c = gl.canvas as HTMLCanvasElement;
    gl.viewport(0, 0, c.width, c.height);
    gl.uniform2f(this.u.uShift, u.shift[0], u.shift[1]);
    gl.uniform1f(this.u.uDolly, u.dolly);
    gl.uniform1f(this.u.uFocus, this.foco);
    gl.uniform1f(this.u.uConProf, this.conProf);
    gl.uniform2f(this.u.uCentro, u.centro[0], u.centro[1]);
    gl.uniform1f(this.u.uBlur, u.blur);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  get cargada() {
    return this.colorCargado;
  }
}
