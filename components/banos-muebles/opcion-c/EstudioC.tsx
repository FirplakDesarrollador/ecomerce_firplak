'use client';

import React, { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Check, ChevronRight, Copy, Dices, DoorOpen, Sparkles, X } from 'lucide-react';
import {
  ACABADOS_C,
  GRIFERIAS_C,
  IMAGEN_POR_DENTRO_C,
  INICIAL_C,
  LAVAMANOS_C,
  MUEBLES_C,
  TOTAL_COMBINACIONES_C,
  type EstadoC,
  type SeleccionC,
  type VistaC,
} from './catalogoOpcionC';
import { cargarVistaC, ladoPreferidoC, precargarC } from './componerC';
import EscenarioC from './EscenarioC';
import {
  enlaceCotizacionC,
  enlaceCotizacionMuebleC,
  escribirSeleccionC,
  leerSeleccionC,
  nombresC,
  rotar,
  sorprender,
} from './opcionCLogica';

const consultaMovimiento = '(prefers-reduced-motion: reduce)';
const suscribirMovimiento = (cb: () => void) => {
  const mq = window.matchMedia(consultaMovimiento);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
};

const CURVA = MUEBLES_C.find((m) => m.id === 'curva');

/** Encabezado de cada paso del panel. */
function Paso({ numero, titulo, valor, children }: { numero: number; titulo: string; valor: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="mt-6 border-t border-[#e5e0d8] pt-6">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="flex items-center gap-2.5 text-sm font-semibold">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#324354] text-[11px] font-semibold text-white">{numero}</span>
          {titulo}
        </h2>
        <span className="text-right text-sm font-medium text-[#58696b]">{valor}</span>
      </div>
      {children}
    </div>
  );
}

/* Marcas sobre la vista 3/4: posiciones en fraccion de la imagen. */
const DETALLES_POR_DENTRO = [
  { x: 0.255, y: 0.535, titulo: 'Puerta con bisagras de cazoleta', texto: 'Ocultas por dentro: el frente queda limpio.' },
  { x: 0.675, y: 0.645, titulo: 'Cajones sobre rieles metálicos', texto: 'Salen completos para ver todo lo que guardas.' },
  { x: 0.355, y: 0.575, titulo: 'Espacio libre bajo la poceta', texto: 'Cabe el sifón y sobra lugar para lo de todos los días.' },
];

export default function EstudioC() {
  const [sel, setSel] = useState<SeleccionC>(INICIAL_C);
  const [estado, setEstado] = useState<EstadoC>('cerrado');
  const [vista, setVista] = useState<VistaC>('conjunto');
  const [oscuro, setOscuro] = useState(false);
  const [previa, setPrevia] = useState(false);
  const [listo, setListo] = useState(false);
  const [interactuo, setInteractuo] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);
  const [cab, setCab] = useState(0);
  const [enEstudio, setEnEstudio] = useState(true);
  const reducirMovimiento = useSyncExternalStore(suscribirMovimiento, () => window.matchMedia(consultaMovimiento).matches, () => false);

  const urlLeida = useRef(false);
  const vistazoHecho = useRef(false);
  const miniVitelli = useRef<HTMLCanvasElement>(null);
  const rejilla = useRef<HTMLDivElement>(null);

  const n = nombresC(sel);

  // Combinacion compartida por enlace. Diferido: sin setState en el cuerpo del effect (bug 002).
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setSel(leerSeleccionC(window.location.search));
      urlLeida.current = true;
    });
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (!urlLeida.current) return;
    window.history.replaceState(null, '', escribirSeleccionC(window.location.search, sel));
  }, [sel]);

  // Alto de la cabecera fija del sitio: el escenario se pega justo debajo.
  useEffect(() => {
    const cabecera = document.querySelector('header');
    if (!cabecera) return;
    const ro = new ResizeObserver(() => setCab(Math.round(cabecera.getBoundingClientRect().height)));
    ro.observe(cabecera);
    return () => ro.disconnect();
  }, []);

  // La barra de cotizar del movil acompaña solo mientras el estudio esta en pantalla.
  useEffect(() => {
    const el = rejilla.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setEnEstudio(e.isIntersecting), { rootMargin: '0px 0px -30% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Lo siguiente que probablemente vera: abierto, mueble solo y los otros lavamanos.
  useEffect(() => {
    if (!listo) return;
    return precargarC(sel, estado, ladoPreferidoC(), LAVAMANOS_C.map((l) => l.id));
  }, [listo, sel, estado]);

  // Primera visita: tras ensamblar las piezas, el mueble se abre un momento y se cierra.
  useEffect(() => {
    if (!listo || interactuo || reducirMovimiento || vistazoHecho.current) return;
    let cancelado = false;
    const tiempos: number[] = [];
    cargarVistaC(sel.mueble, sel.lavamanos, 'abierto', ladoPreferidoC())
      .then(() => {
        if (cancelado) return;
        tiempos.push(
          window.setTimeout(() => {
            vistazoHecho.current = true;
            setEstado('abierto');
          }, 2000),
          window.setTimeout(() => setEstado('cerrado'), 3700)
        );
      })
      .catch(() => undefined);
    return () => {
      cancelado = true;
      tiempos.forEach((t) => window.clearTimeout(t));
    };
  }, [listo, interactuo, reducirMovimiento, sel.mueble, sel.lavamanos]);

  useEffect(() => {
    if (!aviso) return;
    const id = window.setTimeout(() => setAviso(null), 3200);
    return () => window.clearTimeout(id);
  }, [aviso]);

  const elegir = useCallback((parcial: Partial<SeleccionC>) => {
    setInteractuo(true);
    setPrevia(false);
    setSel((s) => ({ ...s, ...parcial }));
  }, []);

  const alPintado = useCallback((lienzo: HTMLCanvasElement, costura: number) => {
    const destino = miniVitelli.current;
    if (!destino) return;
    // Miniatura del mueble: de la tapa hacia abajo, sin la franja vacia de los lados.
    const x0 = Math.round(lienzo.width * 0.16), ancho = Math.round(lienzo.width * 0.68);
    const y0 = Math.round(lienzo.height * costura), alto = Math.round(lienzo.height * 0.95) - y0;
    destino.width = 420;
    destino.height = Math.round((420 * alto) / ancho);
    destino.getContext('2d')?.drawImage(lienzo, x0, y0, ancho, alto, 0, 0, destino.width, destino.height);
  }, []);
  const alListo = useCallback(() => setListo(true), []);
  const alError = useCallback((m: string) => setAviso(m), []);

  const urlCombinacion = () => `${window.location.origin}${window.location.pathname}${escribirSeleccionC('?opcion=c', sel)}`;
  const abrirEnlace = (url: string) => window.open(url, '_blank', 'noopener,noreferrer');
  const cotizar = () => abrirEnlace(enlaceCotizacionC(sel, urlCombinacion()));
  const copiarEnlace = async () => {
    try {
      await navigator.clipboard.writeText(urlCombinacion());
      setCopiado(true);
      window.setTimeout(() => setCopiado(false), 2200);
    } catch {
      setCopiado(false);
    }
  };

  const verPorDentro = () => {
    setInteractuo(true);
    setPrevia(false);
    setVista('conjunto');
    setEstado('abierto');
    document.getElementById('estudio-c')?.scrollIntoView({ behavior: reducirMovimiento ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <div
      className="bg-white pb-28 text-[#324354] lg:pb-16"
      data-experiencia="banos-muebles-opcion-c"
      style={{ '--cab': `${cab}px` } as React.CSSProperties}
    >
      <nav aria-label="Ruta de navegación" className="mx-auto max-w-[1408px] px-4 pt-5 sm:px-6 lg:px-8">
        <ol className="flex flex-wrap items-center gap-1 text-xs font-medium text-[#58696b]">
          <li><Link href="/" className="hover:text-[#324354]">Inicio</Link></li>
          <li aria-hidden><ChevronRight className="h-3.5 w-3.5" /></li>
          <li><Link href="/categoria/banos" className="hover:text-[#324354]">Baños</Link></li>
          <li aria-hidden><ChevronRight className="h-3.5 w-3.5" /></li>
          <li className="text-[#324354]" aria-current="page">Lavamanos & muebles</li>
        </ol>
      </nav>

      <div ref={rejilla} className="mx-auto grid max-w-[1408px] gap-6 px-4 pt-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-10 lg:px-8">
        {/* Escenario: pegado arriba también en el móvil, para ver cada cambio */}
        <section
          id="estudio-c"
          aria-label="Tu combinación"
          className="sticky top-[var(--cab)] z-30 scroll-mt-[var(--cab)] self-start bg-white pb-3 lg:top-[calc(var(--cab)+20px)] lg:z-auto lg:bg-transparent lg:pb-0"
        >
          <div className="relative h-[46svh] min-h-[300px] lg:h-[calc(100svh-var(--cab)-140px)] lg:min-h-[520px]">
            <EscenarioC
              sel={sel}
              estado={estado}
              vista={vista}
              oscuro={oscuro}
              previa={previa}
              interactuo={interactuo}
              reducirMovimiento={reducirMovimiento}
              onLavamanos={(paso) => elegir({ lavamanos: rotar(LAVAMANOS_C, sel.lavamanos, paso) })}
              onAlternarEstado={() => {
                setInteractuo(true);
                setEstado((e) => (e === 'abierto' ? 'cerrado' : 'abierto'));
              }}
              onVista={(v) => {
                setInteractuo(true);
                setVista(v);
              }}
              onOscuro={() => setOscuro((o) => !o)}
              onPrevia={(abrir) => {
                setInteractuo(true);
                setPrevia(abrir);
              }}
              onSorprender={() => {
                setInteractuo(true);
                setPrevia(false);
                setSel((s) => sorprender(s));
              }}
              onCotizarPrevia={() => CURVA && abrirEnlace(enlaceCotizacionMuebleC(CURVA, `${window.location.origin}${window.location.pathname}?opcion=c`))}
              onPintado={alPintado}
              onListo={alListo}
              onError={alError}
            />
            {aviso && (
              <div role="status" className="absolute inset-x-3 bottom-16 z-40 mx-auto flex max-w-md items-center gap-2 rounded-2xl border border-white/70 bg-white/90 px-4 py-3 text-xs font-medium shadow-[0_8px_30px_rgba(50,67,84,0.14)] backdrop-blur-[20px]">
                <span className="flex-1">{aviso}</span>
                <button type="button" onClick={() => setAviso(null)} aria-label="Cerrar aviso" className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-black/5">
                  <X className="h-4 w-4" aria-hidden />
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Panel */}
        {/* scroll-mt/mb: el foco con teclado no queda bajo el escenario pegado ni bajo la barra de cotizar */}
        <section
          aria-labelledby="titulo-estudio"
          className="pb-4 [&_button]:scroll-mb-24 [&_button]:scroll-mt-[calc(var(--cab)+46svh+24px)] lg:[&_button]:scroll-mb-0 lg:[&_button]:scroll-mt-[calc(var(--cab)+16px)]"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#58696b]">Estudio Mix &amp; Match · Lavamanos y muebles</p>
          <h1 id="titulo-estudio" className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Mézclalo a tu manera</h1>
          <p className="mt-3 text-sm leading-relaxed text-[#58696b]">
            Elige el lavamanos, el mueble, el acabado y la grifería. Todas las piezas miden 63 × 48 cm, así que todo combina con todo. Ábrelo, míralo por partes y cotízalo cuando te enamore.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f6f3ee] px-3 py-1.5">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              {TOTAL_COMBINACIONES_C} combinaciones, ¿cuál es la tuya?
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f6f3ee] px-3 py-1.5">
              <DoorOpen className="h-3.5 w-3.5" aria-hidden />
              Míralo por dentro
            </span>
          </div>

          {/* 1. Lavamanos */}
          <Paso numero={1} titulo="Lavamanos" valor={n.lavamanos.nombre}>
            <div className="mt-4 grid grid-cols-2 gap-3" role="radiogroup" aria-label="Lavamanos">
              {LAVAMANOS_C.map((l) => {
                const elegido = l.id === sel.lavamanos;
                return (
                  <button
                    key={l.id}
                    type="button"
                    role="radio"
                    aria-checked={elegido}
                    onClick={() => elegir({ lavamanos: l.id })}
                    className={`group relative overflow-hidden rounded-2xl border text-left transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#324354] ${elegido ? 'border-[#324354] bg-[#f6f3ee] shadow-[0_6px_20px_rgba(50,67,84,0.12)]' : 'border-[#e5e0d8] hover:border-[#7b8e90]'}`}
                  >
                    <span className="relative block aspect-[2/1] bg-gradient-to-b from-[#f5f1ea] to-[#e9e2d8]">
                      <Image src={l.miniatura} alt="" fill sizes="(min-width: 1024px) 200px, 45vw" className="object-contain px-3 pb-1 pt-3 transition-transform duration-300 group-hover:scale-[1.05]" />
                      {elegido && (
                        <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#324354] text-white">
                          <Check className="h-3.5 w-3.5" aria-hidden />
                        </span>
                      )}
                    </span>
                    <span className="block px-3 pb-3 pt-2">
                      <span className="block text-sm font-semibold">{l.nombre}</span>
                      <span className="block text-[11px] leading-snug text-[#58696b]">{l.frase}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </Paso>

          {/* 2. Mueble */}
          <Paso numero={2} titulo="Mueble" valor={n.mueble.nombre}>
            <div className="mt-4 grid grid-cols-2 gap-3" role="radiogroup" aria-label="Mueble">
              {MUEBLES_C.map((m) => {
                const elegido = m.disponible && m.id === sel.mueble && !previa;
                const viendo = !m.disponible && previa;
                return (
                  <button
                    key={m.id}
                    type="button"
                    role="radio"
                    aria-checked={elegido}
                    aria-label={m.disponible ? `${m.nombre}: ${m.descripcion}` : `${m.nombre}: pronto en el estudio, toca para verlo`}
                    onClick={() => {
                      if (m.disponible) elegir({ mueble: m.id });
                      else {
                        setInteractuo(true);
                        setPrevia(true);
                      }
                    }}
                    className={`group relative overflow-hidden rounded-2xl border text-left transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#324354] ${elegido || viendo ? 'border-[#324354] bg-[#f6f3ee] shadow-[0_6px_20px_rgba(50,67,84,0.12)]' : 'border-[#e5e0d8] hover:border-[#7b8e90]'}`}
                  >
                    <span className="relative flex aspect-[4/3] items-center justify-center bg-gradient-to-b from-[#f5f1ea] to-[#e9e2d8] p-3">
                      {m.disponible ? (
                        <canvas ref={m.id === 'vitelli' ? miniVitelli : undefined} className="max-h-full max-w-full transition-transform duration-300 group-hover:scale-[1.05]" aria-hidden />
                      ) : (
                        m.referencia && <Image src={m.referencia.miniatura} alt="" fill sizes="(min-width: 1024px) 200px, 45vw" className="object-contain p-3 transition-transform duration-300 group-hover:scale-[1.05]" />
                      )}
                      {!m.disponible && (
                        <span className="absolute left-2 top-2 rounded-full bg-[#324354] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">Pronto</span>
                      )}
                      {elegido && (
                        <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#324354] text-white">
                          <Check className="h-3.5 w-3.5" aria-hidden />
                        </span>
                      )}
                    </span>
                    <span className="block px-3 pb-3 pt-2">
                      <span className="block text-sm font-semibold">{m.nombre}</span>
                      <span className="block text-[11px] leading-snug text-[#58696b]">{m.disponible ? m.descripcion : 'Toca para verlo'}</span>
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-[#58696b]">
              Cambia el mueble cuando quieras: el lavamanos se queda donde está. El {CURVA?.nombre ?? 'siguiente mueble'} llega pronto al estudio.
            </p>
          </Paso>

          {/* 3. Acabado */}
          <Paso numero={3} titulo="Acabado del mueble" valor={n.acabado.nombre}>
            <div className="mt-4 flex flex-wrap gap-3" role="radiogroup" aria-label="Acabado del mueble">
              {ACABADOS_C.map((a) => {
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
          </Paso>

          {/* 4. Griferia */}
          <Paso numero={4} titulo="Grifería" valor={n.griferia.nombre}>
            <div className="mt-4 flex flex-wrap gap-3" role="radiogroup" aria-label="Grifería">
              {GRIFERIAS_C.map((g) => {
                const elegido = g.id === sel.griferia;
                return (
                  <button
                    key={g.id}
                    type="button"
                    role="radio"
                    aria-checked={elegido}
                    aria-label={g.nombre}
                    title={g.simulada ? `${g.nombre} · vista previa` : g.nombre}
                    onClick={() => elegir({ griferia: g.id })}
                    className="group flex w-[68px] flex-col items-center gap-1.5 focus:outline-none"
                  >
                    <span
                      className={`relative block h-[52px] w-[52px] rounded-full shadow-[inset_0_-6px_12px_rgba(0,0,0,0.18),inset_0_4px_8px_rgba(255,255,255,0.35)] ring-offset-2 transition-all duration-150 group-hover:scale-105 group-focus-visible:ring-2 group-focus-visible:ring-[#324354] ${elegido ? 'ring-2 ring-[#324354]' : 'ring-1 ring-[#e5e0d8]'}`}
                      style={{ background: g.muestra }}
                    >
                      {elegido && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <Check className={`h-5 w-5 drop-shadow ${g.id === 'negro' ? 'text-white' : 'text-[#324354]'}`} aria-hidden />
                        </span>
                      )}
                    </span>
                    <span className={`text-center text-[11px] leading-tight ${elegido ? 'font-semibold text-[#324354]' : 'text-[#58696b]'}`}>{g.nombre}</span>
                  </button>
                );
              })}
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-[#58696b]">
              Negro es la grifería de la foto. Cromo, oro y níquel son una vista previa del acabado sobre el mismo grifo monocontrol.
            </p>
          </Paso>

          {/* Resumen */}
          <div className="mt-7 rounded-3xl bg-[#f6f3ee] p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#58696b]">Tu combinación</p>
              <button
                type="button"
                onClick={() => {
                  setInteractuo(true);
                  setPrevia(false);
                  setSel((s) => sorprender(s));
                }}
                className="inline-flex h-11 items-center gap-1.5 rounded-full px-3 text-xs font-semibold hover:bg-white/70"
              >
                <Dices className="h-4 w-4" aria-hidden />
                Sorpréndeme
              </button>
            </div>
            <ul className="mt-2 space-y-2.5 text-sm">
              <li className="flex items-center gap-3">
                <span className="relative h-8 w-14 shrink-0">
                  <Image src={n.lavamanos.miniatura} alt="" fill sizes="56px" className="object-contain" />
                </span>
                <span className="flex-1 text-[#58696b]">Lavamanos</span>
                <span className="text-right font-semibold">{n.lavamanos.nombre} · {n.lavamanos.medida}</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="relative h-8 w-14 shrink-0 overflow-hidden rounded-lg">
                  <Image src={n.acabado.muestra} alt="" fill sizes="56px" className="object-cover" />
                </span>
                <span className="flex-1 text-[#58696b]">Mueble</span>
                <span className="text-right font-semibold">{n.mueble.nombre} · {n.acabado.nombre}</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-8 w-14 shrink-0 items-center justify-center">
                  <span className="h-7 w-7 rounded-full" style={{ background: n.griferia.muestra }} />
                </span>
                <span className="flex-1 text-[#58696b]">Grifería</span>
                <span className="text-right font-semibold">{n.griferia.nombre}</span>
              </li>
              <li className="flex items-center gap-3 border-t border-[#e5e0d8] pt-2.5">
                <span className="flex-1 text-[#58696b]">Precio</span>
                <span className="text-right font-semibold">Cotízalo con un asesor</span>
              </li>
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

      {/* Por dentro: la vista 3/4 del render con sus detalles */}
      <section aria-labelledby="titulo-por-dentro" className="mx-auto mt-14 max-w-[1408px] px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 overflow-hidden rounded-[32px] bg-[#f6f3ee] p-6 sm:p-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#58696b]">Por dentro</p>
            <h2 id="titulo-por-dentro" className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Hecho para abrirse</h2>
            <p className="mt-3 text-sm leading-relaxed text-[#58696b]">Lo que no sale en la foto de catálogo también cuenta. Así es el Vitelli 63 por dentro:</p>
            <ol className="mt-6 space-y-4">
              {DETALLES_POR_DENTRO.map((d, i) => (
                <li key={d.titulo} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#324354] text-xs font-semibold text-white">{i + 1}</span>
                  <span>
                    <span className="block text-sm font-semibold">{d.titulo}</span>
                    <span className="block text-xs leading-relaxed text-[#58696b]">{d.texto}</span>
                  </span>
                </li>
              ))}
            </ol>
            <button
              type="button"
              onClick={verPorDentro}
              className="mt-7 inline-flex h-12 items-center gap-2 rounded-full bg-[#324354] px-6 text-sm font-semibold text-white transition-[transform,background-color] duration-150 hover:bg-[#273543] active:scale-[0.98]"
            >
              <DoorOpen className="h-4 w-4" aria-hidden />
              Ábrelo en el estudio
            </button>
          </div>
          <div className="relative mx-auto aspect-[1400/1180] w-full max-w-[680px]">
            <Image src={IMAGEN_POR_DENTRO_C} alt="Mueble Vitelli 63 abierto en vista de tres cuartos: puerta, cajones y espacio interior" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-contain drop-shadow-[0_24px_30px_rgba(60,45,30,0.18)]" />
            {DETALLES_POR_DENTRO.map((d, i) => (
              <span
                key={d.titulo}
                aria-hidden
                className="absolute flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#324354] text-xs font-semibold text-white shadow-[0_0_0_6px_rgba(50,67,84,0.18)]"
                style={{ left: `${d.x * 100}%`, top: `${d.y * 100}%` }}
              >
                {i + 1}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Movil: cotizar a mano mientras se arma la combinacion */}
      <div
        inert={!enEstudio}
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-[#e5e0d8] bg-white/95 px-4 py-3 backdrop-blur-[20px] transition-transform duration-300 lg:hidden ${enEstudio ? 'translate-y-0' : 'pointer-events-none translate-y-full'}`}
      >
        <div className="mx-auto flex max-w-xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{n.lavamanos.nombre} + {n.mueble.nombre}</p>
            <p className="truncate text-xs text-[#58696b]">{n.acabado.nombre} · Grifería en {n.griferia.nombre.toLowerCase()}</p>
          </div>
          <button type="button" onClick={cotizar} className="h-12 shrink-0 rounded-full bg-[#324354] px-5 text-sm font-semibold text-white active:scale-[0.98]">
            Cotizar
          </button>
        </div>
      </div>
    </div>
  );
}
