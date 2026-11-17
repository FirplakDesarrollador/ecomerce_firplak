'use client';

import React, { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Check, ChevronLeft, ChevronRight, Copy, Droplets, Layers, Moon, Sun, X } from 'lucide-react';
import {
  ACABADOS_MIX,
  LADO_RENDER,
  LAVAMANOS_MIX,
  MUEBLES_MIX,
  existeRender,
  rutasRender,
  type SeleccionMix,
} from './catalogoMixMatch';
import { cargarRender, cargarTextura, componer } from './compositor';
import {
  ajustarCompatible,
  enlaceCotizacionMix,
  escribirSeleccionMix,
  leerSeleccionMix,
  nombresMix,
  rotar,
} from './mixMatchLogica';
import { INICIAL_MIX } from './catalogoMixMatch';

const consultaMovimiento = '(prefers-reduced-motion: reduce)';
const suscribirMovimiento = (cb: () => void) => {
  const mq = window.matchMedia(consultaMovimiento);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
};

// Panel flotante claro del sistema de diseno (glass-panel), igual que la Opcion A.
const VIDRIO = 'border border-white/70 bg-white/80 shadow-[0_8px_30px_rgba(50,67,84,0.14)] backdrop-blur-[20px]';

type Cambio = 'inicio' | 'lavamanos' | 'mueble' | 'acabado' | 'varios' | 'ninguno';

function tipoCambio(a: SeleccionMix | null, b: SeleccionMix): Cambio {
  if (!a) return 'inicio';
  const d = (['mueble', 'lavamanos', 'acabado'] as const).filter((k) => a[k] !== b[k]);
  if (d.length === 0) return 'ninguno';
  return d.length > 1 ? 'varios' : d[0];
}

/* ---------- Composicion con cache pequena (cada lienzo pesa ~6 MB) ---------- */

const compuestos = new Map<string, HTMLCanvasElement>();

async function compuesto(sel: SeleccionMix): Promise<{ lienzo: HTMLCanvasElement; costura: number }> {
  const r = rutasRender(sel.mueble, sel.lavamanos);
  const clave = `${r.id}|${sel.acabado}`;
  const acabado = ACABADOS_MIX.find((a) => a.id === sel.acabado) ?? ACABADOS_MIX[0];
  let lienzo = compuestos.get(clave);
  if (!lienzo) {
    const [datos, tex] = await Promise.all([cargarRender(r.base, r.capa, LADO_RENDER), cargarTextura(acabado.textura)]);
    lienzo = document.createElement('canvas');
    componer(lienzo, datos, tex);
    compuestos.set(clave, lienzo);
    if (compuestos.size > 6) compuestos.delete(compuestos.keys().next().value as string);
  } else {
    // Al reusar, pasa al final: la cache descarta el mas antiguo.
    compuestos.delete(clave);
    compuestos.set(clave, lienzo);
  }
  return { lienzo, costura: r.costura };
}

/** Copia la franja [y0, y1) del render compuesto en un lienzo visible. */
function pintarFranja(destino: HTMLCanvasElement, origen: HTMLCanvasElement, y0: number, y1: number) {
  destino.width = origen.width;
  destino.height = y1 - y0;
  destino.getContext('2d')?.drawImage(origen, 0, y0, origen.width, y1 - y0, 0, 0, origen.width, y1 - y0);
}

/** Fantasma: copia congelada de una pieza para animar su salida. */
function fantasma(pieza: HTMLDivElement, lienzo: HTMLCanvasElement): HTMLCanvasElement {
  const f = document.createElement('canvas');
  f.width = lienzo.width;
  f.height = lienzo.height;
  f.getContext('2d')?.drawImage(lienzo, 0, 0);
  f.className = 'absolute inset-0 h-full w-full pointer-events-none';
  pieza.appendChild(f);
  return f;
}

export default function MixMatchB() {
  const [sel, setSel] = useState<SeleccionMix>(INICIAL_MIX);
  const [listo, setListo] = useState(false);
  const [piezas, setPiezas] = useState(true);
  const [oscuro, setOscuro] = useState(false);
  const [interactuo, setInteractuo] = useState(false);
  const [costura, setCostura] = useState(0.485);
  const [aviso, setAviso] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);
  const reducirMovimiento = useSyncExternalStore(
    suscribirMovimiento,
    () => window.matchMedia(consultaMovimiento).matches,
    () => false
  );

  const piezaSup = useRef<HTMLDivElement>(null);
  const piezaInf = useRef<HTMLDivElement>(null);
  const lienzoSup = useRef<HTMLCanvasElement>(null);
  const lienzoInf = useRef<HTMLCanvasElement>(null);
  const barrido = useRef<HTMLDivElement>(null);
  const miniaturas = useRef<Partial<Record<string, HTMLCanvasElement | null>>>({});
  const mostrado = useRef<SeleccionMix | null>(null);
  const turno = useRef(0);
  const urlLeida = useRef(false);
  const gesto = useRef<{ x: number; y: number; arriba: boolean } | null>(null);

  const n = nombresMix(sel);
  const porCapas = rutasRender(sel.mueble, sel.lavamanos).porCapas;

  // Combinacion compartida por enlace. Diferido: sin setState en el cuerpo del effect (bug 002).
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setSel(leerSeleccionMix(window.location.search));
      urlLeida.current = true;
    });
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (!urlLeida.current) return;
    window.history.replaceState(null, '', escribirSeleccionMix(window.location.search, sel));
  }, [sel]);

  // Pinta la combinacion y anima segun que pieza cambio.
  useEffect(() => {
    const t = ++turno.current;
    const anterior = mostrado.current;
    const cambio = tipoCambio(anterior, sel);
    if (cambio === 'ninguno') return;
    let cancelado = false;
    compuesto(sel).then(({ lienzo, costura: c }) => {
      if (cancelado || t !== turno.current) return;
      const sup = lienzoSup.current, inf = lienzoInf.current, ps = piezaSup.current, pi = piezaInf.current;
      if (!sup || !inf || !ps || !pi) return;
      const animar = !reducirMovimiento && cambio !== 'inicio';
      const fantasmas: HTMLCanvasElement[] = [];
      if (animar && (cambio === 'lavamanos' || cambio === 'mueble' || cambio === 'varios')) fantasmas.push(fantasma(ps, sup));
      if (animar && (cambio === 'mueble' || cambio === 'acabado' || cambio === 'varios')) fantasmas.push(fantasma(pi, inf));
      pintarFranja(sup, lienzo, 0, c);
      pintarFranja(inf, lienzo, c, lienzo.height);
      setCostura(c / lienzo.height);
      mostrado.current = sel;
      setListo(true);

      const fin = (a: Animation, el: HTMLElement) => a.finished.then(() => el.remove(), () => el.remove());
      if (!animar) {
        fantasmas.forEach((f) => f.remove());
        if (cambio === 'inicio' && !reducirMovimiento) {
          sup.animate([{ transform: 'translateY(-26%)', opacity: 0 }, { transform: 'translateY(0)', opacity: 1 }], { duration: 700, easing: 'cubic-bezier(.2,.9,.25,1.15)' });
          inf.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 450 });
        }
        return;
      }
      if (cambio === 'lavamanos') {
        // El lavamanos anterior sube y se va; el nuevo baja y asienta.
        fin(fantasmas[0].animate([{ transform: 'translateY(0)', opacity: 1 }, { transform: 'translateY(-18%)', opacity: 0 }], { duration: 280, easing: 'ease-in', fill: 'forwards' }), fantasmas[0]);
        sup.animate(
          [{ transform: 'translateY(-30%)', opacity: 0 }, { transform: 'translateY(3%)', opacity: 1, offset: 0.7 }, { transform: 'translateY(0)', opacity: 1 }],
          { duration: 560, delay: 120, easing: 'cubic-bezier(.2,.8,.3,1)', fill: 'backwards' }
        );
      } else if (cambio === 'mueble') {
        // El mueble sale de lado y entra el nuevo; el lavamanos se queda.
        fin(fantasmas[0].animate([{ opacity: 1 }, { opacity: 0 }], { duration: 240, fill: 'forwards' }), fantasmas[0]);
        fin(fantasmas[1].animate([{ transform: 'translateX(0)', opacity: 1 }, { transform: 'translateX(-12%)', opacity: 0 }], { duration: 300, easing: 'ease-in', fill: 'forwards' }), fantasmas[1]);
        inf.animate([{ transform: 'translateX(12%)', opacity: 0 }, { transform: 'translateX(0)', opacity: 1 }], { duration: 460, delay: 90, easing: 'cubic-bezier(.2,.8,.3,1)', fill: 'backwards' });
      } else if (cambio === 'acabado') {
        // El acabado nuevo barre el mueble de izquierda a derecha con un filo de luz.
        const f = fantasmas[0];
        fin(f.animate([{ clipPath: 'inset(0 0 0 0%)' }, { clipPath: 'inset(0 0 0 100%)' }], { duration: 760, easing: 'cubic-bezier(.6,0,.3,1)', fill: 'forwards' }), f);
        barrido.current?.animate(
          [{ left: '0%', opacity: 0 }, { left: '8%', opacity: 1, offset: 0.1 }, { left: '92%', opacity: 1, offset: 0.9 }, { left: '100%', opacity: 0 }],
          { duration: 760, easing: 'cubic-bezier(.6,0,.3,1)' }
        );
      } else {
        fantasmas.forEach((g) => fin(g.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 320, fill: 'forwards' }), g));
      }
    }).catch(() => setAviso('No pudimos cargar esta combinación. Intenta de nuevo.'));
    return () => { cancelado = true; };
  }, [sel, reducirMovimiento]);

  // Primera visita: las piezas llegan separadas y se ensamblan (enseña que se mezclan).
  useEffect(() => {
    if (!listo) return;
    const id = window.setTimeout(() => setPiezas(false), reducirMovimiento ? 0 : 1100);
    return () => window.clearTimeout(id);
  }, [listo, reducirMovimiento]);

  // Miniaturas de mueble con el acabado y lavamanos elegidos; de paso precarga.
  useEffect(() => {
    let cancelado = false;
    for (const m of MUEBLES_MIX) {
      const l = existeRender(m.id, sel.lavamanos) ? sel.lavamanos : LAVAMANOS_MIX.find((x) => existeRender(m.id, x.id))?.id;
      if (!l) continue;
      compuesto({ mueble: m.id, lavamanos: l, acabado: sel.acabado }).then(({ lienzo, costura: c }) => {
        const destino = miniaturas.current[m.id];
        if (cancelado || !destino) return;
        // Solo el mueble: sin la franja transparente de los lados.
        const x0 = Math.round(lienzo.width * 0.14), ancho = Math.round(lienzo.width * 0.72);
        const alto = lienzo.height - c;
        destino.width = 360;
        destino.height = Math.round((360 * alto) / ancho);
        destino.getContext('2d')?.drawImage(lienzo, x0, c, ancho, alto, 0, 0, destino.width, destino.height);
      }).catch(() => undefined);
    }
    return () => { cancelado = true; };
  }, [sel.lavamanos, sel.acabado]);

  useEffect(() => {
    if (!aviso) return;
    const id = window.setTimeout(() => setAviso(null), 3200);
    return () => window.clearTimeout(id);
  }, [aviso]);

  const elegir = useCallback(
    (parcial: Partial<SeleccionMix>) => {
      setInteractuo(true);
      const fija = parcial.mueble ? 'mueble' : 'lavamanos';
      const nueva = { ...sel, ...parcial };
      const ajustada = ajustarCompatible(nueva, fija);
      // Matriz de compatibilidad: si la pareja no existe se ajusta la otra pieza y se avisa.
      if (ajustada.mueble !== nueva.mueble || ajustada.lavamanos !== nueva.lavamanos) {
        const nn = nombresMix(ajustada);
        setAviso(
          fija === 'mueble'
            ? `Ese mueble se combina con el lavamanos ${nn.lavamanos.nombre}: lo cambiamos por ti.`
            : `Ese lavamanos se combina con el mueble ${nn.mueble.nombre}: lo cambiamos por ti.`
        );
      }
      setSel(ajustada);
    },
    [sel]
  );

  const urlCombinacion = () => `${window.location.origin}${window.location.pathname}${escribirSeleccionMix('?opcion=b', sel)}`;
  const cotizar = () => window.open(enlaceCotizacionMix(sel, urlCombinacion()), '_blank', 'noopener,noreferrer');
  const copiarEnlace = async () => {
    try {
      await navigator.clipboard.writeText(urlCombinacion());
      setCopiado(true);
      window.setTimeout(() => setCopiado(false), 2200);
    } catch {
      setCopiado(false);
    }
  };

  // Deslizar sobre el lavamanos o sobre el mueble cambia esa pieza.
  const alSoltar = (e: React.PointerEvent<HTMLDivElement>) => {
    const g = gesto.current;
    gesto.current = null;
    if (!g) return;
    const dx = e.clientX - g.x, dy = e.clientY - g.y;
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
    const paso = dx < 0 ? 1 : -1;
    if (g.arriba) elegir({ lavamanos: rotar(LAVAMANOS_MIX, sel.lavamanos, paso) });
    else elegir({ mueble: rotar(MUEBLES_MIX, sel.mueble, paso) });
  };

  const flecha = (lado: 'izq' | 'der', pieza: 'lavamanos' | 'mueble') => {
    const paso = lado === 'izq' ? -1 : 1;
    const etiqueta = `${pieza === 'lavamanos' ? 'Lavamanos' : 'Mueble'} ${lado === 'izq' ? 'anterior' : 'siguiente'}`;
    return (
      <button
        type="button"
        aria-label={etiqueta}
        title={etiqueta}
        onClick={() =>
          pieza === 'lavamanos'
            ? elegir({ lavamanos: rotar(LAVAMANOS_MIX, sel.lavamanos, paso) })
            : elegir({ mueble: rotar(MUEBLES_MIX, sel.mueble, paso) })
        }
        className={`flex h-11 w-11 items-center justify-center rounded-full text-[#324354] transition-transform duration-150 hover:scale-110 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#324354] ${VIDRIO}`}
      >
        {lado === 'izq' ? <ChevronLeft className="h-5 w-5" aria-hidden /> : <ChevronRight className="h-5 w-5" aria-hidden />}
      </button>
    );
  };

  const fondo = oscuro
    ? 'bg-[radial-gradient(ellipse_at_50%_35%,#2a2f36_0%,#121418_70%)]'
    : 'bg-[radial-gradient(ellipse_at_50%_30%,#f7f3ed_0%,#e9e1d6_75%)]';
  const sombra = oscuro ? 'drop-shadow(0 24px 34px rgba(0,0,0,0.55))' : 'drop-shadow(0 26px 30px rgba(60,45,30,0.22))';

  return (
    <div className="bg-white pb-28 text-[#324354] lg:pb-16" data-experiencia="banos-muebles-opcion-b">
      <nav aria-label="Ruta de navegación" className="mx-auto max-w-[1408px] px-4 pt-5 sm:px-6 lg:px-8">
        <ol className="flex flex-wrap items-center gap-1 text-xs font-medium text-[#58696b]">
          <li><Link href="/" className="hover:text-[#324354]">Inicio</Link></li>
          <li aria-hidden><ChevronRight className="h-3.5 w-3.5" /></li>
          <li><Link href="/categoria/banos" className="hover:text-[#324354]">Baños</Link></li>
          <li aria-hidden><ChevronRight className="h-3.5 w-3.5" /></li>
          <li className="text-[#324354]" aria-current="page">Lavamanos & muebles</li>
        </ol>
      </nav>

      <div className="mx-auto grid max-w-[1408px] gap-6 px-4 pt-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-10 lg:px-8">
        {/* Escenario */}
        <section aria-label="Tu combinación" className="lg:sticky lg:top-[156px] lg:self-start">
          <div
            className={`relative aspect-square w-full touch-pan-y select-none overflow-hidden rounded-3xl transition-colors duration-500 lg:aspect-auto lg:h-[calc(100vh-180px)] lg:min-h-[560px] ${fondo}`}
            onPointerDown={(e) => {
              if ((e.target as HTMLElement).closest('button')) return;
              const r = e.currentTarget.querySelector('[data-producto]')?.getBoundingClientRect();
              const limite = r ? r.top + r.height * costura : e.clientY;
              gesto.current = { x: e.clientX, y: e.clientY, arriba: e.clientY < limite };
            }}
            onPointerUp={alSoltar}
            onPointerCancel={() => { gesto.current = null; }}
          >
            {/* Producto: dos piezas del mismo render, cortadas en la tapa del mueble */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                data-producto
                role="img"
                aria-label={`Mueble ${n.mueble.nombre} en acabado ${n.acabado.nombre} con lavamanos ${n.lavamanos.nombre}`}
                className="relative aspect-square h-[86%] max-w-[94%] transition-[filter] duration-500"
                style={{ filter: sombra, marginTop: '4%' }}
              >
                <div
                  ref={piezaSup}
                  className="absolute inset-x-0 top-0 transition-transform duration-500 ease-[cubic-bezier(.2,.8,.3,1)]"
                  style={{ height: `${costura * 100}%`, transform: piezas ? 'translateY(-9%)' : 'none' }}
                >
                  <canvas ref={lienzoSup} className="absolute inset-0 h-full w-full" />
                </div>
                <div
                  ref={piezaInf}
                  className="absolute inset-x-0 bottom-0 overflow-hidden transition-transform duration-500 ease-[cubic-bezier(.2,.8,.3,1)]"
                  style={{ height: `${(1 - costura) * 100}%`, transform: piezas ? 'translateY(6%)' : 'none' }}
                >
                  <canvas ref={lienzoInf} className="absolute inset-0 h-full w-full" />
                  {/* Filo de luz del barrido de acabado */}
                  <div
                    ref={barrido}
                    aria-hidden
                    className="pointer-events-none absolute inset-y-0 w-10 -translate-x-1/2 opacity-0"
                    style={{ left: '0%', background: 'linear-gradient(90deg, transparent, rgba(255,246,228,0.85), transparent)' }}
                  />
                </div>

                {/* Flechas: una pareja por pieza */}
                <div className="absolute -left-2 flex -translate-y-1/2 sm:-left-6" style={{ top: `${costura * 50}%` }}>{flecha('izq', 'lavamanos')}</div>
                <div className="absolute -right-2 flex -translate-y-1/2 sm:-right-6" style={{ top: `${costura * 50}%` }}>{flecha('der', 'lavamanos')}</div>
                <div className="absolute -left-2 flex -translate-y-1/2 sm:-left-6" style={{ top: `${(costura + (1 - costura) / 2) * 100}%` }}>{flecha('izq', 'mueble')}</div>
                <div className="absolute -right-2 flex -translate-y-1/2 sm:-right-6" style={{ top: `${(costura + (1 - costura) / 2) * 100}%` }}>{flecha('der', 'mueble')}</div>

                {/* Etiquetas de pieza: visibles al separar */}
                <span
                  className={`pointer-events-none absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold transition-opacity duration-300 ${VIDRIO} ${piezas ? 'opacity-100' : 'opacity-0'}`}
                  style={{ top: `${costura * 100 - 6}%` }}
                >
                  Lavamanos · {n.lavamanos.nombre}
                </span>
                <span
                  className={`pointer-events-none absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold transition-opacity duration-300 ${VIDRIO} ${piezas ? 'opacity-100' : 'opacity-0'}`}
                  style={{ top: `${costura * 100 + 4}%` }}
                >
                  Mueble · {n.mueble.nombre} · {n.acabado.nombre}
                </span>
              </div>
            </div>

            {!listo && (
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 bg-[#efe9e1]">
                <Layers className="h-9 w-9 text-[#58696b] motion-safe:animate-pulse" aria-hidden />
                <p className="text-sm font-medium text-[#324354]">Preparando tu combinación…</p>
              </div>
            )}

            {listo && !interactuo && !porCapas && (
              <div className={`pointer-events-none absolute bottom-3 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full px-3.5 py-2 text-xs font-medium ${VIDRIO}`}>
                Desliza o usa las flechas para mezclar
              </div>
            )}

            <div className={`absolute right-3 top-3 z-10 flex rounded-full p-1 ${VIDRIO}`}>
              <button
                type="button"
                onClick={() => setPiezas((p) => !p)}
                aria-pressed={piezas}
                className={`flex h-11 items-center gap-1.5 rounded-full px-3.5 text-xs font-semibold transition-colors duration-150 ${piezas ? 'bg-[#324354] text-white' : 'text-[#324354] hover:bg-black/5'}`}
              >
                <Layers className="h-4 w-4" aria-hidden />
                Piezas
              </button>
              <button
                type="button"
                onClick={() => setOscuro((o) => !o)}
                aria-label={oscuro ? 'Fondo claro' : 'Fondo oscuro'}
                title={oscuro ? 'Fondo claro' : 'Fondo oscuro'}
                className="flex h-11 w-11 items-center justify-center rounded-full text-[#324354] hover:bg-black/5"
              >
                {oscuro ? <Sun className="h-4 w-4" aria-hidden /> : <Moon className="h-4 w-4" aria-hidden />}
              </button>
            </div>

            {porCapas && listo && (
              <p className={`pointer-events-none absolute bottom-3 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-medium ${VIDRIO}`}>
                Vista armada por capas: lavamanos y mueble de renders distintos
              </p>
            )}

            {aviso && (
              <div role="status" className={`absolute inset-x-3 bottom-14 z-20 mx-auto flex max-w-md items-center gap-2 rounded-2xl px-4 py-3 text-xs font-medium ${VIDRIO}`}>
                <span className="flex-1">{aviso}</span>
                <button type="button" onClick={() => setAviso(null)} aria-label="Cerrar aviso" className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-black/5">
                  <X className="h-4 w-4" aria-hidden />
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Panel */}
        <section aria-labelledby="titulo-mix" className="pb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#58696b]">Mix &amp; Match · Lavamanos y muebles</p>
          <h1 id="titulo-mix" className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Arma tu mueble de baño</h1>
          <p className="mt-3 text-sm leading-relaxed text-[#58696b]">
            Combina el mueble, el lavamanos y el acabado que más te gusten. Todas las piezas encajan entre sí.
          </p>

          {/* 1. Mueble */}
          <div className="mt-7 border-t border-[#e5e0d8] pt-6">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="text-sm font-semibold"><span className="mr-2 text-[#58696b]">1</span>Mueble</h2>
              <span className="text-sm font-medium text-[#58696b]">{n.mueble.nombre}</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3" role="radiogroup" aria-label="Mueble">
              {MUEBLES_MIX.map((m) => {
                const elegido = m.id === sel.mueble;
                return (
                  <button
                    key={m.id}
                    type="button"
                    role="radio"
                    aria-checked={elegido}
                    onClick={() => elegir({ mueble: m.id })}
                    className={`group rounded-2xl border p-2.5 text-left transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#324354] ${elegido ? 'border-[#324354] bg-[#f6f3ee]' : 'border-[#e5e0d8] hover:border-[#7b8e90]'}`}
                  >
                    <span className="flex aspect-[3/2] items-center justify-center overflow-hidden rounded-xl bg-[#ece8e0] p-2">
                      <canvas
                        ref={(el) => { miniaturas.current[m.id] = el; }}
                        className="max-h-full max-w-full transition-transform duration-300 group-hover:scale-105"
                        aria-hidden
                      />
                    </span>
                    <span className="mt-2 flex items-center justify-between gap-2 px-0.5">
                      <span className="text-sm font-semibold">{m.nombre}</span>
                      {elegido && <Check className="h-4 w-4 shrink-0" aria-hidden />}
                    </span>
                    <span className="block px-0.5 text-[11px] leading-snug text-[#58696b]">{m.descripcion}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Lavamanos */}
          <div className="mt-6 border-t border-[#e5e0d8] pt-6">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="text-sm font-semibold"><span className="mr-2 text-[#58696b]">2</span>Lavamanos</h2>
              <span className="text-sm font-medium text-[#58696b]">{n.lavamanos.nombre}</span>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2.5" role="radiogroup" aria-label="Lavamanos">
              {LAVAMANOS_MIX.map((l) => {
                const elegido = l.id === sel.lavamanos;
                return (
                  <button
                    key={l.id}
                    type="button"
                    role="radio"
                    aria-checked={elegido}
                    title={`${l.nombre} · ${l.forma}`}
                    onClick={() => elegir({ lavamanos: l.id })}
                    className={`group rounded-2xl border p-2 text-left transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#324354] ${elegido ? 'border-[#324354] bg-[#f6f3ee]' : 'border-[#e5e0d8] hover:border-[#7b8e90]'}`}
                  >
                    <span className="relative block aspect-[4/3] overflow-hidden rounded-xl bg-[#ece8e0]">
                      <Image src={l.miniatura} alt="" fill sizes="120px" className="object-contain p-1.5 transition-transform duration-300 group-hover:scale-105" />
                    </span>
                    <span className="mt-1.5 flex items-center justify-between gap-1 px-0.5">
                      <span className="truncate text-xs font-semibold">{l.nombre}</span>
                      {elegido && <Check className="h-3.5 w-3.5 shrink-0" aria-hidden />}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-[11px] text-[#58696b]">{n.lavamanos.forma}</p>
          </div>

          {/* 3. Acabado */}
          <div className="mt-6 border-t border-[#e5e0d8] pt-6">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="text-sm font-semibold"><span className="mr-2 text-[#58696b]">3</span>Acabado del mueble</h2>
              <span className="text-sm font-medium text-[#58696b]">{n.acabado.nombre}</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-3" role="radiogroup" aria-label="Acabado del mueble">
              {ACABADOS_MIX.map((a) => {
                const elegido = a.id === sel.acabado;
                return (
                  <button
                    key={a.id}
                    type="button"
                    role="radio"
                    aria-checked={elegido}
                    aria-label={a.nombre}
                    title={a.nombre}
                    onClick={() => elegir({ acabado: a.id })}
                    className="group flex w-[60px] flex-col items-center gap-1.5 focus:outline-none"
                  >
                    <span className={`relative block h-[52px] w-[52px] overflow-hidden rounded-full ring-offset-2 transition-all duration-150 group-hover:scale-105 group-focus-visible:ring-2 group-focus-visible:ring-[#324354] ${elegido ? 'ring-2 ring-[#324354]' : 'ring-1 ring-[#e5e0d8]'}`}>
                      <Image src={a.muestra} alt="" fill sizes="52px" className="object-cover" />
                      {elegido && (
                        <span className="absolute inset-0 flex items-center justify-center bg-black/15">
                          <Check className="h-5 w-5 text-white drop-shadow" aria-hidden />
                        </span>
                      )}
                    </span>
                    <span className={`text-[11px] leading-tight ${elegido ? 'font-semibold text-[#324354]' : 'text-[#58696b]'}`}>{a.nombre}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Griferia */}
          <div className="mt-6 border-t border-[#e5e0d8] pt-6">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="text-sm font-semibold"><span className="mr-2 text-[#58696b]">4</span>Grifería</h2>
              <span className="text-xs font-medium text-[#58696b]">Más opciones pronto</span>
            </div>
            <div className="mt-3 flex items-center gap-3 rounded-2xl border border-[#324354] bg-[#f6f3ee] p-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1d2732] text-white"><Droplets className="h-5 w-5" aria-hidden /></span>
              <span className="flex-1">
                <span className="block text-sm font-semibold">{n.lavamanos.griferia}</span>
                <span className="block text-[11px] text-[#58696b]">Se ajusta al lavamanos elegido</span>
              </span>
              <Check className="h-4 w-4" aria-hidden />
            </div>
          </div>

          {/* Resumen */}
          <div className="mt-6 rounded-3xl bg-[#f6f3ee] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#58696b]">Tu combinación</p>
            <ul className="mt-3 space-y-1.5 text-sm">
              <li className="flex justify-between gap-4"><span className="text-[#58696b]">Mueble</span><span className="text-right font-semibold">{n.mueble.nombre} · {n.acabado.nombre}</span></li>
              <li className="flex justify-between gap-4"><span className="text-[#58696b]">Lavamanos</span><span className="text-right font-semibold">{n.lavamanos.nombre}</span></li>
              <li className="flex justify-between gap-4"><span className="text-[#58696b]">Grifería</span><span className="text-right font-semibold">{n.lavamanos.griferia}</span></li>
              <li className="flex justify-between gap-4"><span className="text-[#58696b]">Precio</span><span className="text-right font-semibold">Cotízalo con un asesor</span></li>
            </ul>
            <button
              type="button"
              onClick={cotizar}
              className="mt-5 hidden h-12 w-full items-center justify-center gap-2 rounded-full bg-[#324354] text-sm font-semibold text-white transition-[transform,background-color] duration-150 hover:bg-[#273543] active:scale-[0.98] lg:flex"
            >
              Cotizar esta combinación por WhatsApp
            </button>
            <button
              type="button"
              onClick={copiarEnlace}
              aria-live="polite"
              className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-full text-xs font-semibold text-[#324354] hover:bg-white/70"
            >
              {copiado ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
              {copiado ? 'Enlace copiado' : 'Copiar enlace de esta combinación'}
            </button>
          </div>
        </section>
      </div>

      {/* Movil: cotizar siempre a mano */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#e5e0d8] bg-white/95 px-4 py-3 backdrop-blur-[20px] lg:hidden">
        <div className="mx-auto flex max-w-xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{n.mueble.nombre} · {n.acabado.nombre}</p>
            <p className="truncate text-xs text-[#58696b]">Lavamanos {n.lavamanos.nombre}</p>
          </div>
          <button type="button" onClick={cotizar} className="h-12 shrink-0 rounded-full bg-[#324354] px-5 text-sm font-semibold text-white active:scale-[0.98]">
            Cotizar
          </button>
        </div>
      </div>
    </div>
  );
}
