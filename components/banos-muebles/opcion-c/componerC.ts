/**
 * Opcion C · composicion en el navegador: render + acabado del tablero + tono
 * del grifo. Con el acabado del render y la griferia negra se dibuja el render
 * tal cual (la imagen mas fiel).
 */
import { cargarImagen, cargarTextura } from '../opcion-b/compositor';
import { ACABADOS_C, ACABADO_RENDER_C, GRIFERIAS_C, rutaVistaC, type EstadoC, type IdLavamanosC, type IdMuebleC, type SeleccionC } from './catalogoOpcionC';
import { aplicarAcabado, aplicarGrifo, prepararCapa, type CapaC } from './pixelesC';
import { TEXTURA_C } from './rendersOpcionC';

/** Lado de trabajo: 1600 en pantallas grandes, 1100 en moviles (memoria). */
export function ladoPreferidoC(): number {
  return window.matchMedia('(min-width: 1024px)').matches ? 1600 : 1100;
}

interface VistaCargada {
  img: HTMLImageElement;
  capa: CapaC;
}

/** Cache LRU pequeña: cada capa a 1600 px ocupa ~5 MB. */
function lru<V>(max: number) {
  const m = new Map<string, V>();
  return {
    get(k: string) {
      const v = m.get(k);
      if (v !== undefined) {
        m.delete(k);
        m.set(k, v);
      }
      return v;
    },
    set(k: string, v: V) {
      m.set(k, v);
      if (m.size > max) m.delete(m.keys().next().value as string);
    },
  };
}

const vistas = lru<Promise<VistaCargada>>(10);

function lienzo(lado: number) {
  const c = document.createElement('canvas');
  c.width = lado;
  c.height = lado;
  return c;
}

export function cargarVistaC(mueble: IdMuebleC, pieza: IdLavamanosC | 'solo', estado: EstadoC, lado: number): Promise<VistaCargada> {
  const r = rutaVistaC(mueble, pieza, estado);
  const clave = `${r.id}|${lado}`;
  let p = vistas.get(clave);
  if (!p) {
    p = Promise.all([cargarImagen(r.base), cargarImagen(r.capa)]).then(([img, ci]) => {
      const ctx = lienzo(lado).getContext('2d', { willReadFrequently: true });
      if (!ctx) throw new Error('Canvas 2D no disponible');
      ctx.drawImage(ci, 0, 0, lado, lado);
      return { img, capa: prepararCapa(ctx.getImageData(0, 0, lado, lado)) };
    });
    p.catch(() => undefined);
    vistas.set(clave, p);
  }
  return p;
}

const compuestos = lru<HTMLCanvasElement>(6);

/**
 * Lienzo con la vista compuesta (mueble con su acabado, grifo con su tono).
 * `pieza` 'solo' es el mueble sin lavamanos: no lleva grifo.
 */
export async function componerC(sel: SeleccionC, pieza: IdLavamanosC | 'solo', estado: EstadoC, lado: number): Promise<HTMLCanvasElement> {
  const acabado = ACABADOS_C.find((a) => a.id === sel.acabado) ?? ACABADOS_C[0];
  const griferia = pieza === 'solo' ? null : (GRIFERIAS_C.find((g) => g.id === sel.griferia) ?? GRIFERIAS_C[0]);
  const conTextura = acabado.id !== ACABADO_RENDER_C;
  const tono = griferia?.tono ?? null;
  const clave = `${sel.mueble}__${pieza}__${estado}|${conTextura ? acabado.id : '-'}|${tono ? griferia?.id : '-'}|${lado}`;
  const hecho = compuestos.get(clave);
  if (hecho) return hecho;

  const [v, tex] = await Promise.all([
    cargarVistaC(sel.mueble, pieza, estado, lado),
    conTextura ? cargarTextura(acabado.textura) : Promise.resolve(null),
  ]);
  const destino = lienzo(lado);
  const ctx = destino.getContext('2d', { willReadFrequently: Boolean(tex || tono) });
  if (!ctx) throw new Error('Canvas 2D no disponible');
  ctx.drawImage(v.img, 0, 0, lado, lado);
  if (tex || tono) {
    const datos = ctx.getImageData(0, 0, lado, lado);
    if (tex) aplicarAcabado(datos.data, v.capa, tex, TEXTURA_C);
    if (tono) aplicarGrifo(datos.data, v.capa, tono);
    ctx.putImageData(datos, 0, 0);
  }
  compuestos.set(clave, destino);
  return destino;
}

/** Descarga y decodifica en segundo plano lo que el usuario probablemente vera despues. */
export function precargarC(sel: SeleccionC, estado: EstadoC, lado: number, lavamanos: IdLavamanosC[]) {
  const otro: EstadoC = estado === 'cerrado' ? 'abierto' : 'cerrado';
  const tareas: (() => Promise<unknown>)[] = [
    () => cargarVistaC(sel.mueble, sel.lavamanos, otro, lado),
    () => cargarVistaC(sel.mueble, 'solo', estado, lado),
    ...lavamanos.filter((l) => l !== sel.lavamanos).map((l) => () => cargarVistaC(sel.mueble, l, estado, lado)),
    () => cargarVistaC(sel.mueble, 'solo', otro, lado),
  ];
  let cancelado = false;
  (async () => {
    for (const t of tareas) {
      if (cancelado) return;
      await t().catch(() => undefined);
    }
  })();
  return () => {
    cancelado = true;
  };
}
