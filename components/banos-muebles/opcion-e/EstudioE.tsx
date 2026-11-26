'use client';

import React, { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Check, ChevronRight, Copy, Dices, DoorOpen, Droplets, MoveHorizontal, Sparkles, X } from 'lucide-react';
import {
  ACABADOS_E,
  ACABADOS_GRIFO_E,
  COLORES_LAVAMANOS_E,
  COMPRAS_E,
  GRIFOS_E,
  INICIAL_E,
  LAVAMANOS_E,
  MUEBLES_E,
  PRECIOS_SUGERIDOS_E,
  RUTA_E,
  TOTAL_COMBINACIONES_E,
  rutaCuerpoE,
  rutaTapaE,
  type IdCompraE,
  type SeleccionE,
} from './catalogoOpcionE';
import { ALTO_E, ANCHO_E, precargarE } from './componerE';
import { DURACION_CERRAR_E } from './animacionE';
import EscenarioE from './EscenarioE';
import {
  descripcionCompraE,
  enlaceCotizacionE,
  escribirSeleccionE,
  formatoPesos,
  grifoReal,
  leerSeleccionE,
  nombresE,
  precioE,
  sorprenderE,
} from './opcionELogica';

const consultaMovimiento = '(prefers-reduced-motion: reduce)';
const suscribirMovimiento = (cb: () => void) => {
  const mq = window.matchMedia(consultaMovimiento);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
};

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

/** Un trozo del render (x0, y0, x1, y1 en px del render) como miniatura. */
function Recorte({ src, caja, sizes }: { src: string; caja: [number, number, number, number]; sizes: string }) {
  const [x0, y0, x1, y1] = caja;
  const w = x1 - x0, h = y1 - y0;
  return (
    <span className="relative block w-full overflow-hidden" style={{ aspectRatio: `${w} / ${h}` }}>
      <Image
        src={src}
        alt=""
        width={ANCHO_E}
        height={ALTO_E}
        sizes={sizes}
        className="absolute max-w-none transition-transform duration-300 group-hover:scale-[1.04]"
        style={{ width: `${(ANCHO_E / w) * 100}%`, height: 'auto', left: `${(-x0 / w) * 100}%`, top: `${(-y0 / h) * 100}%` }}
      />
    </span>
  );
}

const CAJA_MUEBLE: [number, number, number, number] = [330, 290, 1590, 1370];
const CAJA_LAVAMANOS: [number, number, number, number] = [330, 30, 1590, 640];
const CAJA_GRIFO: [number, number, number, number] = [860, 0, 1220, 370];

/** Botón de selección con tarjeta (miniatura + nombre). */
function Tarjeta({ elegido, onClick, etiqueta, children }: { elegido: boolean; onClick: () => void; etiqueta: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={elegido}
      aria-label={etiqueta}
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl border text-left transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#324354] ${elegido ? 'border-[#324354] bg-[#f6f3ee] shadow-[0_6px_20px_rgba(50,67,84,0.12)]' : 'border-[#e5e0d8] hover:border-[#7b8e90]'}`}
    >
      {children}
      {elegido && (
        <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#324354] text-white">
          <Check className="h-3.5 w-3.5" aria-hidden />
        </span>
      )}
    </button>
  );
}

/** Muestra redonda (acabado, color o metal). */
function Muestra({
  elegido,
  onClick,
  nombre,
  titulo,
  fondo,
  imagen,
  checkClaro,
}: {
  elegido: boolean;
  onClick: () => void;
  nombre: string;
  titulo?: string;
  fondo?: string;
  imagen?: string;
  checkClaro?: boolean;
}) {
  return (
    <button type="button" role="radio" aria-checked={elegido} aria-label={nombre} title={titulo ?? nombre} onClick={onClick} className="group flex w-[64px] flex-col items-center gap-1.5 focus:outline-none">
      <span
        className={`relative block h-[50px] w-[50px] overflow-hidden rounded-full shadow-[inset_0_-6px_12px_rgba(0,0,0,0.12),inset_0_4px_8px_rgba(255,255,255,0.35)] ring-offset-2 transition-all duration-150 group-hover:scale-105 group-focus-visible:ring-2 group-focus-visible:ring-[#324354] ${elegido ? 'ring-2 ring-[#324354]' : 'ring-1 ring-[#e5e0d8]'}`}
        style={{ background: fondo }}
      >
        {imagen && <Image src={imagen} alt="" fill sizes="50px" className="object-cover" />}
        {elegido && (
          <span className="absolute inset-0 flex items-center justify-center">
            <Check className={`h-5 w-5 drop-shadow ${checkClaro ? 'text-white' : 'text-[#324354]'}`} aria-hidden />
          </span>
        )}
      </span>
      <span className={`text-center text-[11px] leading-tight ${elegido ? 'font-semibold text-[#324354]' : 'text-[#58696b]'}`}>{nombre}</span>
    </button>
  );
}

const CLAROS = new Set(['blanco-nevado', 'candelaria', 'mali', 'tauari']);

export default function EstudioE() {
  const [sel, setSel] = useState<SeleccionE>(INICIAL_E);
  const [abierto, setAbierto] = useState(false);
  const [agua, setAgua] = useState(false);
  const [avisoCierre, setAvisoCierre] = useState(false);
  const [listo, setListo] = useState(false);
  const [interactuo, setInteractuo] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);
  const [cab, setCab] = useState(0);
  const [enEstudio, setEnEstudio] = useState(true);
  const reducirMovimiento = useSyncExternalStore(suscribirMovimiento, () => window.matchMedia(consultaMovimiento).matches, () => false);

  const urlLeida = useRef(false);
  const vistazoHecho = useRef(false);
  const rejilla = useRef<HTMLDivElement>(null);
  const tiempoCierre = useRef(0);

  const n = nombresE(sel);
  const precio = precioE(sel.compra);

  // Combinación compartida por enlace. Diferido: sin setState en el cuerpo del effect (bug 002).
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setSel(leerSeleccionE(window.location.search));
      urlLeida.current = true;
    });
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (!urlLeida.current) return;
    window.history.replaceState(null, '', escribirSeleccionE(window.location.search, sel));
  }, [sel]);

  // Alto de la cabecera fija del sitio: el escenario se pega justo debajo.
  useEffect(() => {
    const cabecera = document.querySelector('header');
    if (!cabecera) return;
    const ro = new ResizeObserver(() => setCab(Math.round(cabecera.getBoundingClientRect().height)));
    ro.observe(cabecera);
    return () => ro.disconnect();
  }, []);

  // La barra de cotizar del móvil acompaña solo mientras el estudio está en pantalla.
  useEffect(() => {
    const el = rejilla.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setEnEstudio(e.isIntersecting), { rootMargin: '0px 0px -30% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Lo siguiente que probablemente verá: los otros lavamanos y el otro mueble (sin pintar).
  useEffect(() => {
    if (!listo) return;
    const id = window.setTimeout(() => {
      for (const l of LAVAMANOS_E) precargarE(sel.mueble, l.id, sel.grifo, sel.acabado);
      precargarE(sel.mueble === 'vitelli' ? 'tucano' : 'vitelli', sel.lavamanos, sel.grifo, sel.acabado);
    }, 900);
    return () => window.clearTimeout(id);
  }, [listo, sel.mueble, sel.lavamanos, sel.grifo, sel.acabado]);

  const cerrarConAviso = useCallback(() => {
    setAbierto(false);
    setAvisoCierre(true);
    window.clearTimeout(tiempoCierre.current);
    tiempoCierre.current = window.setTimeout(() => setAvisoCierre(false), DURACION_CERRAR_E + 500);
  }, []);
  useEffect(() => () => window.clearTimeout(tiempoCierre.current), []);

  // Primera visita: el mueble se abre y se cierra solo una vez (se ve el cierre suave).
  useEffect(() => {
    if (!listo || interactuo || reducirMovimiento || vistazoHecho.current) return;
    const t1 = window.setTimeout(() => {
      vistazoHecho.current = true;
      setAbierto(true);
    }, 1300);
    const t2 = window.setTimeout(cerrarConAviso, 1300 + 2600);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [listo, interactuo, reducirMovimiento, cerrarConAviso]);

  useEffect(() => {
    if (!aviso) return;
    const id = window.setTimeout(() => setAviso(null), 3200);
    return () => window.clearTimeout(id);
  }, [aviso]);

  const elegir = useCallback((parcial: Partial<SeleccionE>) => {
    setInteractuo(true);
    setSel((s) => ({ ...s, ...parcial }));
  }, []);

  const alternarAbierto = () => {
    setInteractuo(true);
    if (abierto) cerrarConAviso();
    else {
      setAvisoCierre(false);
      setAbierto(true);
    }
  };
  const alternarAgua = () => {
    setInteractuo(true);
    setAgua((a) => !a);
  };
  const elegirCompra = useCallback((c: IdCompraE) => elegir({ compra: c }), [elegir]);
  const alListo = useCallback(() => setListo(true), []);
  const alError = useCallback((m: string) => setAviso(m), []);

  const irAlEstudio = () => document.getElementById('estudio-e')?.scrollIntoView({ behavior: reducirMovimiento ? 'auto' : 'smooth', block: 'start' });
  const probarCajones = () => {
    setInteractuo(true);
    if (sel.compra !== 'conjunto' && sel.compra !== 'mueble') setSel((s) => ({ ...s, compra: 'conjunto' }));
    irAlEstudio();
    if (abierto) {
      cerrarConAviso();
      return;
    }
    window.setTimeout(() => setAbierto(true), 350);
    window.setTimeout(cerrarConAviso, 350 + 2200);
  };
  const probarAgua = () => {
    setInteractuo(true);
    if (sel.compra !== 'conjunto' && sel.compra !== 'griferia') setSel((s) => ({ ...s, compra: 'conjunto' }));
    irAlEstudio();
    window.setTimeout(() => setAgua(true), 350);
  };

  const urlCombinacion = () => `${window.location.origin}${window.location.pathname}${escribirSeleccionE('?opcion=e', sel)}`;
  const cotizar = () => window.open(enlaceCotizacionE(sel, urlCombinacion()), '_blank', 'noopener,noreferrer');
  const copiarEnlace = async () => {
    try {
      await navigator.clipboard.writeText(urlCombinacion());
      setCopiado(true);
      window.setTimeout(() => setCopiado(false), 2200);
    } catch {
      setCopiado(false);
    }
  };

  const incluye = {
    mueble: sel.compra === 'conjunto' || sel.compra === 'mueble',
    lavamanos: sel.compra === 'conjunto' || sel.compra === 'lavamanos',
    griferia: sel.compra === 'conjunto' || sel.compra === 'griferia',
  };
  const lineas = [
    { id: 'mueble', etiqueta: 'Mueble', valor: `${n.mueble.nombre} · ${n.acabado.nombre}`, precio: PRECIOS_SUGERIDOS_E.mueble, va: incluye.mueble },
    { id: 'lavamanos', etiqueta: 'Lavamanos', valor: `${n.lavamanos.nombre} · ${n.color.nombre}`, precio: PRECIOS_SUGERIDOS_E.lavamanos, va: incluye.lavamanos },
    { id: 'griferia', etiqueta: 'Grifería', valor: `${n.grifo.nombre.replace('Monocontrol ', 'Mono. ')} · ${n.acabadoGrifo.nombre}`, precio: PRECIOS_SUGERIDOS_E.griferia, va: incluye.griferia },
  ];

  return (
    <div className="bg-white pb-28 text-[#324354] lg:pb-16" data-experiencia="banos-muebles-opcion-e" style={{ '--cab': `${cab}px` } as React.CSSProperties}>
      <nav aria-label="Ruta de navegación" className="mx-auto max-w-[1408px] px-4 pt-5 sm:px-6 lg:px-8">
        <ol className="flex flex-wrap items-center gap-1 text-xs font-medium text-[#58696b]">
          <li><Link href="/" className="hover:text-[#324354]">Inicio</Link></li>
          <li aria-hidden><ChevronRight className="h-3.5 w-3.5" /></li>
          <li><Link href="/categoria/banos" className="hover:text-[#324354]">Baños</Link></li>
          <li aria-hidden><ChevronRight className="h-3.5 w-3.5" /></li>
          <li className="text-[#324354]" aria-current="page">Lavamanos & muebles</li>
        </ol>
      </nav>

      <div ref={rejilla} className="mx-auto grid max-w-[1408px] grid-cols-[minmax(0,1fr)] gap-6 px-4 pt-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-10 lg:px-8">
        {/* Escenario: pegado arriba también en el móvil, para ver cada cambio */}
        <section
          id="estudio-e"
          aria-label="Tu combinación"
          className="sticky top-[var(--cab)] z-30 scroll-mt-[var(--cab)] self-start bg-white pb-3 lg:top-[calc(var(--cab)+20px)] lg:z-auto lg:bg-transparent lg:pb-0"
        >
          <div className="relative h-[50svh] min-h-[330px] lg:h-[calc(100svh-var(--cab)-150px)] lg:min-h-[540px]">
            <EscenarioE
              sel={sel}
              abierto={abierto}
              agua={agua}
              avisoCierre={avisoCierre}
              interactuo={interactuo}
              reducirMovimiento={reducirMovimiento}
              onAlternarAbierto={alternarAbierto}
              onAlternarAgua={alternarAgua}
              onCompra={elegirCompra}
              onListo={alListo}
              onError={alError}
            />
            {aviso && (
              <div role="status" className="absolute inset-x-3 bottom-20 z-40 mx-auto flex max-w-md items-center gap-2 rounded-2xl border border-white/70 bg-white/90 px-4 py-3 text-xs font-medium shadow-[0_8px_30px_rgba(50,67,84,0.14)] backdrop-blur-[20px]">
                <span className="flex-1">{aviso}</span>
                <button type="button" onClick={() => setAviso(null)} aria-label="Cerrar aviso" className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-black/5">
                  <X className="h-4 w-4" aria-hidden />
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Panel */}
        <section
          aria-labelledby="titulo-estudio-e"
          className="pb-4 [&_button]:scroll-mb-24 [&_button]:scroll-mt-[calc(var(--cab)+50svh+24px)] lg:[&_button]:scroll-mb-0 lg:[&_button]:scroll-mt-[calc(var(--cab)+16px)]"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#58696b]">Mix &amp; Match · Vista isométrica</p>
          <h1 id="titulo-estudio-e" className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Tu baño, pieza por pieza</h1>
          <p className="mt-3 text-sm leading-relaxed text-[#58696b]">
            Elige el mueble, el lavamanos y la grifería con sus acabados. Ábrelo, abre el agua y llévate el conjunto completo o solo la pieza que necesitas.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f6f3ee] px-3 py-1.5">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              {TOTAL_COMBINACIONES_E.toLocaleString('es-CO')} combinaciones
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f6f3ee] px-3 py-1.5">
              <MoveHorizontal className="h-3.5 w-3.5" aria-hidden />
              Rieles de 35 cm
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f6f3ee] px-3 py-1.5">
              <Droplets className="h-3.5 w-3.5" aria-hidden />
              Aire inducido
            </span>
          </div>

          {/* 1. Mueble */}
          <Paso numero={1} titulo="Mueble" valor={`${n.mueble.nombre} · ${n.acabado.nombre}`}>
            <div className="mt-4 grid grid-cols-2 gap-3" role="radiogroup" aria-label="Mueble">
              {MUEBLES_E.map((m) => (
                <Tarjeta key={m.id} elegido={m.id === sel.mueble} onClick={() => elegir({ mueble: m.id })} etiqueta={`${m.nombre}: ${m.frentes}`}>
                  <span className="block bg-gradient-to-b from-[#f5f1ea] to-[#e9e2d8] px-3 pt-3">
                    <Recorte src={rutaCuerpoE(m.id, 'solo', 'cerrado').foto} caja={CAJA_MUEBLE} sizes="(min-width: 1024px) 420px, 60vw" />
                  </span>
                  <span className="block px-3 pb-3 pt-2">
                    <span className="block text-sm font-semibold">{m.nombre}</span>
                    <span className="block text-[11px] leading-snug text-[#58696b]">{m.frentes}</span>
                  </span>
                </Tarjeta>
              ))}
            </div>
            <p className="mt-5 text-xs font-semibold">
              Acabado <span className="font-medium text-[#58696b]">· {n.acabado.tipo === 'Unicolor' ? 'unicolor' : 'melamina maderada'}</span>
            </p>
            <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Acabado del mueble">
              {ACABADOS_E.map((a) => (
                <Muestra
                  key={a.id}
                  elegido={a.id === sel.acabado}
                  onClick={() => elegir({ acabado: a.id })}
                  nombre={a.nombre}
                  titulo={`${a.nombre} · ${a.tipo === 'Unicolor' ? 'unicolor' : 'melamina maderada'}`}
                  imagen={a.textura ? `${RUTA_E}/acabado-${a.id}-muestra.webp` : undefined}
                  fondo={a.plano ? `rgb(${a.plano.join(',')})` : undefined}
                  checkClaro={!CLAROS.has(a.id)}
                />
              ))}
            </div>
            <ul className="mt-4 space-y-1.5 text-[11px] leading-snug text-[#58696b]">
              {n.mueble.rasgos.map((r) => (
                <li key={r} className="flex items-start gap-2">
                  <Check className="mt-px h-3.5 w-3.5 shrink-0 text-[#324354]" aria-hidden />
                  {r}
                </li>
              ))}
            </ul>
          </Paso>

          {/* 2. Lavamanos */}
          <Paso numero={2} titulo="Lavamanos" valor={`${n.lavamanos.nombre} · ${n.color.nombre}`}>
            <div className="mt-4 grid grid-cols-2 gap-3" role="radiogroup" aria-label="Lavamanos">
              {LAVAMANOS_E.map((l) => (
                <Tarjeta key={l.id} elegido={l.id === sel.lavamanos} onClick={() => elegir({ lavamanos: l.id })} etiqueta={`${l.nombre}: ${l.forma}`}>
                  <span className="block bg-gradient-to-b from-[#f5f1ea] to-[#e9e2d8] px-2 pt-2">
                    <Recorte src={rutaTapaE(l.id, sel.grifo).foto} caja={CAJA_LAVAMANOS} sizes="(min-width: 1024px) 260px, 60vw" />
                  </span>
                  <span className="block px-3 pb-3 pt-2">
                    <span className="block text-sm font-semibold">{l.nombre}</span>
                    <span className="block text-[11px] leading-snug text-[#58696b]">{l.forma}</span>
                  </span>
                </Tarjeta>
              ))}
            </div>
            <p className="mt-5 text-xs font-semibold">
              Color <span className="font-medium text-[#58696b]">· gelcoat</span>
            </p>
            <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Color del lavamanos">
              {COLORES_LAVAMANOS_E.map((c) => (
                <Muestra
                  key={c.id}
                  elegido={c.id === sel.color}
                  onClick={() => elegir({ color: c.id })}
                  nombre={c.nombre}
                  fondo={`radial-gradient(circle at 35% 30%, rgba(255,255,255,0.75), transparent 45%), ${c.muestra}`}
                  checkClaro={c.id === 'niebla'}
                />
              ))}
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-[#58696b]">Todos miden {n.lavamanos.medida}: cualquiera va con cualquier mueble.</p>
          </Paso>

          {/* 3. Griferia */}
          <Paso numero={3} titulo="Grifería" valor={`${n.grifo.nombre.replace('Monocontrol ', '')} · ${n.acabadoGrifo.nombre}`}>
            <div className="mt-4 grid grid-cols-2 gap-3" role="radiogroup" aria-label="Modelo de grifería">
              {GRIFOS_E.map((g) => (
                <Tarjeta key={g.id} elegido={g.id === sel.grifo} onClick={() => elegir({ grifo: g.id })} etiqueta={`${g.nombre}: ${g.detalle}`}>
                  <span className="block bg-gradient-to-b from-[#f5f1ea] to-[#e9e2d8] px-6 pt-3">
                    <Recorte src={rutaTapaE('oslo', g.id).foto} caja={CAJA_GRIFO} sizes="(min-width: 1024px) 420px, 80vw" />
                  </span>
                  <span className="block px-3 pb-3 pt-2">
                    <span className="block text-sm font-semibold">{g.nombre}</span>
                    <span className="block text-[11px] leading-snug text-[#58696b]">{g.detalle}</span>
                  </span>
                </Tarjeta>
              ))}
            </div>
            <p className="mt-5 text-xs font-semibold">Acabado</p>
            <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Acabado de la grifería">
              {ACABADOS_GRIFO_E.map((a) => {
                const real = grifoReal({ grifo: sel.grifo, acabadoGrifo: a.id });
                return (
                  <Muestra
                    key={a.id}
                    elegido={a.id === sel.acabadoGrifo}
                    onClick={() => elegir({ acabadoGrifo: a.id })}
                    nombre={a.nombre}
                    titulo={real ? a.nombre : `${a.nombre} · vista previa`}
                    fondo={a.muestra}
                    checkClaro={a.id === 'negro'}
                  />
                );
              })}
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-[#58696b]">
              El {GRIFOS_E[0].nombre.toLowerCase()} está renderizado en níquel y el alto en negro; los demás acabados son una vista previa sobre la misma grifería.
            </p>
            <button
              type="button"
              onClick={probarAgua}
              className="mt-3 inline-flex h-11 items-center gap-2 rounded-full bg-[#f6f3ee] px-4 text-xs font-semibold transition-colors hover:bg-[#ece6dd]"
            >
              <Droplets className="h-4 w-4" aria-hidden />
              Abre el agua y mira el aireador
            </button>
          </Paso>

          {/* 4. Que te llevas */}
          <Paso numero={4} titulo="¿Qué te llevas?" valor={formatoPesos(precio)}>
            <div className="mt-4 grid grid-cols-2 gap-3" role="radiogroup" aria-label="Qué te llevas">
              {COMPRAS_E.map((c) => {
                const elegido = c.id === sel.compra;
                return (
                  <button
                    key={c.id}
                    type="button"
                    role="radio"
                    aria-checked={elegido}
                    onClick={() => elegir({ compra: c.id })}
                    className={`relative rounded-2xl border p-3 text-left transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#324354] ${elegido ? 'border-[#324354] bg-[#f6f3ee] shadow-[0_6px_20px_rgba(50,67,84,0.12)]' : 'border-[#e5e0d8] hover:border-[#7b8e90]'}`}
                  >
                    <span className="block pr-6 text-sm font-semibold">{c.nombre}</span>
                    <span className="mt-0.5 block text-[11px] leading-snug text-[#58696b]">{c.detalle}</span>
                    <span className="mt-2 block text-sm font-semibold tabular-nums">{formatoPesos(precioE(c.id))}</span>
                    {elegido && (
                      <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#324354] text-white">
                        <Check className="h-3.5 w-3.5" aria-hidden />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-[#58696b]">Precios sugeridos de referencia; el conjunto es la suma de las tres piezas. Un asesor te confirma el valor final.</p>
          </Paso>

          {/* Resumen */}
          <div className="mt-7 rounded-3xl bg-[#f6f3ee] p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#58696b]">Tu elección</p>
              <button
                type="button"
                onClick={() => {
                  setInteractuo(true);
                  setSel((s) => sorprenderE(s));
                }}
                className="inline-flex h-11 items-center gap-1.5 rounded-full px-3 text-xs font-semibold hover:bg-white/70"
              >
                <Dices className="h-4 w-4" aria-hidden />
                Sorpréndeme
              </button>
            </div>
            <ul className="mt-2 space-y-2.5 text-sm">
              {lineas.map((l) => (
                <li key={l.id} className={`flex items-baseline gap-3 transition-opacity duration-300 ${l.va ? '' : 'opacity-40'}`}>
                  <span className="w-20 shrink-0 text-[#58696b]">{l.etiqueta}</span>
                  <span className="min-w-0 flex-1 truncate font-semibold">{l.valor}</span>
                  <span className="shrink-0 tabular-nums">{l.va ? formatoPesos(l.precio) : 'No incluido'}</span>
                </li>
              ))}
              <li className="flex items-baseline gap-3 border-t border-[#e5e0d8] pt-2.5">
                <span className="flex-1 text-[#58696b]">Total sugerido</span>
                <span className="text-lg font-semibold tabular-nums">{formatoPesos(precio)}</span>
              </li>
            </ul>
            <button
              type="button"
              onClick={cotizar}
              className="mt-5 hidden h-12 w-full items-center justify-center gap-2 rounded-full bg-[#324354] text-sm font-semibold text-white transition-[transform,background-color] duration-150 hover:bg-[#273543] active:scale-[0.98] lg:flex"
            >
              Cotizar por WhatsApp
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

      {/* Detalles que se sienten al usarlo */}
      <section aria-labelledby="titulo-detalles-e" className="mx-auto mt-14 max-w-[1408px] px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#58696b]">Al usarlo</p>
        <h2 id="titulo-detalles-e" className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Lo que no se ve en una foto</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            {
              icono: <MoveHorizontal className="h-5 w-5" aria-hidden />,
              titulo: 'Rieles de extensión total · 35 cm',
              texto: 'Los cajones salen completos: ves y alcanzas todo, hasta el fondo.',
              accion: 'Ábrelo',
              agua: false,
            },
            {
              icono: <DoorOpen className="h-5 w-5" aria-hidden />,
              titulo: 'Cierre suave',
              texto: 'Arrancan rápido y frenan solos al final: la puerta y los cajones cierran sin golpes.',
              accion: 'Pruébalo',
              agua: false,
            },
            {
              icono: <Droplets className="h-5 w-5" aria-hidden />,
              titulo: 'Grifería con aire inducido',
              texto: 'El aireador mezcla aire con el agua: un chorro suave y espumoso que salpica menos.',
              accion: 'Abre el agua',
              agua: true,
            },
          ].map((d) => (
            <div key={d.titulo} className="flex flex-col rounded-3xl bg-[#f6f3ee] p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#324354] shadow-sm">{d.icono}</span>
              <h3 className="mt-4 text-base font-semibold">{d.titulo}</h3>
              <p className="mt-1.5 flex-1 text-sm leading-relaxed text-[#58696b]">{d.texto}</p>
              <button
                type="button"
                onClick={() => (d.agua ? probarAgua() : probarCajones())}
                className="mt-5 inline-flex h-11 w-fit items-center gap-2 rounded-full bg-[#324354] px-5 text-xs font-semibold text-white transition-[transform,background-color] duration-150 hover:bg-[#273543] active:scale-[0.98]"
              >
                {d.accion}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Móvil: cotizar a mano mientras se arma la combinación */}
      <div
        inert={!enEstudio}
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-[#e5e0d8] bg-white/95 px-4 py-3 backdrop-blur-[20px] transition-transform duration-300 lg:hidden ${enEstudio ? 'translate-y-0' : 'pointer-events-none translate-y-full'}`}
      >
        <div className="mx-auto flex max-w-xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold tabular-nums">
              {formatoPesos(precio)} <span className="text-xs font-medium text-[#58696b]">sugerido</span>
            </p>
            <p className="truncate text-xs text-[#58696b] first-letter:uppercase">{descripcionCompraE(sel)}</p>
          </div>
          <button type="button" onClick={cotizar} className="h-12 shrink-0 rounded-full bg-[#324354] px-5 text-sm font-semibold text-white active:scale-[0.98]">
            Cotizar
          </button>
        </div>
      </div>
    </div>
  );
}
