// La gota del capítulo 2: una lente de agua que lleva la casa vista desde arriba adentro.
// Pequeña, la casa se ve entera y abombada como a través de una gota; al llenar la pantalla
// el contenido se convierte, sin corte, en el encuadre de la cámara sobre la casa.

const VERTICES = `
attribute vec2 p;
varying vec2 v;
void main() {
  v = vec2(p.x * 0.5 + 0.5, 0.5 - p.y * 0.5);
  gl_Position = vec4(p, 0.0, 1.0);
}`;

const FRAGMENTOS = `
precision highp float;
varying vec2 v;
uniform sampler2D uCasa;
uniform vec2 uRes;
uniform vec2 uCentro;
uniform float uRadio;
uniform float uEstira;
uniform float uMezcla;
uniform vec2 uC;
uniform float uS;
uniform float uVistaCasa;

vec3 casa(vec2 uv) {
  if (uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0) return vec3(0.043, 0.051, 0.067);
  return texture2D(uCasa, uv).rgb;
}

void main() {
  vec2 P = v * uRes;
  vec2 d = (P - uCentro) / uRadio;
  d.y /= uEstira;
  // Un poco más angosta arriba, como una gota que cae.
  d.x *= 1.0 + 0.22 * max(0.0, -d.y) * (1.0 - uMezcla);
  float r = length(d);
  float borde = 2.0 / uRadio;
  float alfa = 1.0 - smoothstep(1.0 - borde, 1.0, r);
  if (alfa <= 0.0) { gl_FragColor = vec4(0.0); return; }

  // Lente: la casa entera dentro de la gota, ampliada en el centro.
  vec2 lente = 0.5 + d * pow(max(r, 1e-4), 0.45) * 0.6;
  // Encuadre de la cámara sobre la casa: lo que se ve cuando la gota llena la pantalla.
  vec2 encuadre = (P - uC) / uS * uVistaCasa + 0.5;
  vec2 uv = mix(lente, encuadre, uMezcla);
  vec3 col = casa(uv);

  float agua = 1.0 - uMezcla;
  col = mix(col, col * vec3(0.86, 0.95, 1.06), 0.35 * agua);
  // Borde: más oscuro abajo a la derecha, reflejo claro arriba a la izquierda.
  float aro = smoothstep(0.62, 1.0, r);
  float luz = clamp(dot(normalize(d + 1e-4), vec2(-0.6, -0.8)), 0.0, 1.0);
  col = mix(col, mix(col * 0.45, vec3(0.86, 0.92, 1.0), luz), aro * 0.55 * agua);
  vec2 brillo = d - vec2(-0.36, -0.44);
  col += vec3(1.0) * exp(-dot(brillo, brillo) * 42.0) * 0.9 * agua;
  col += vec3(0.7, 0.85, 1.0) * smoothstep(0.72, 0.96, r) * smoothstep(0.25, 0.9, d.y) * 0.35 * agua;
  gl_FragColor = vec4(col * alfa, alfa);
}`;

export interface UniformesGota {
  /** Centro y radio de la gota en píxeles del lienzo. */
  centro: [number, number];
  radio: number;
  estira: number;
  /** 0 = lente de agua, 1 = encuadre de la casa a pantalla completa. */
  mezcla: number;
  /** Centro del escenario, lado del escenario (px del lienzo) y vista de la cámara sobre la casa. */
  c: [number, number];
  s: number;
  vistaCasa: number;
}

type Fuente = HTMLVideoElement | HTMLImageElement;
const listo = (f: Fuente) =>
  f instanceof HTMLVideoElement ? f.readyState >= 2 && f.videoWidth > 0 : f.complete && f.naturalWidth > 0;

export class GotaLente {
  private readonly gl: WebGLRenderingContext;
  private readonly tex: WebGLTexture;
  private readonly u: Record<string, WebGLUniformLocation | null> = {};
  private fuente: Fuente | null = null;
  private cargada = false;

  private constructor(gl: WebGLRenderingContext, programa: WebGLProgram) {
    this.gl = gl;
    gl.useProgram(programa);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(programa, 'p');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
    for (const n of ['uCasa', 'uRes', 'uCentro', 'uRadio', 'uEstira', 'uMezcla', 'uC', 'uS', 'uVistaCasa']) {
      this.u[n] = gl.getUniformLocation(programa, n);
    }
    const t = gl.createTexture();
    if (!t) throw new Error('Sin textura WebGL');
    this.tex = t;
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, t);
    for (const [p, v] of [[gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]]) {
      gl.texParameteri(gl.TEXTURE_2D, p, v);
    }
    gl.uniform1i(this.u.uCasa, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  }

  static crear(canvas: HTMLCanvasElement): GotaLente | null {
    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false });
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
    return new GotaLente(gl, programa);
  }

  ponerFuente(fuente: Fuente) {
    this.fuente = fuente;
  }

  subirCuadro() {
    const f = this.fuente;
    if (!f || !listo(f)) return;
    const gl = this.gl;
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, f);
    this.cargada = true;
  }

  dibujar(u: UniformesGota) {
    const gl = this.gl;
    const c = gl.canvas as HTMLCanvasElement;
    gl.viewport(0, 0, c.width, c.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    if (!this.cargada) return;
    gl.uniform2f(this.u.uRes, c.width, c.height);
    gl.uniform2f(this.u.uCentro, u.centro[0], u.centro[1]);
    gl.uniform1f(this.u.uRadio, Math.max(1, u.radio));
    gl.uniform1f(this.u.uEstira, u.estira);
    gl.uniform1f(this.u.uMezcla, u.mezcla);
    gl.uniform2f(this.u.uC, u.c[0], u.c[1]);
    gl.uniform1f(this.u.uS, u.s);
    gl.uniform1f(this.u.uVistaCasa, u.vistaCasa);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  limpiar() {
    const gl = this.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }
}
