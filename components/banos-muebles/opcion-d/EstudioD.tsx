'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Check, ChevronDown, ChevronRight, Copy, Dices, DoorClosed, DoorOpen, X } from 'lucide-react';
import LoomereNavbar from '@/components/loomere/LoomereNavbar';
import LoomereMegamenu from '@/components/loomere/LoomereMegamenu';
import AccessFeedbackToast from '@/components/ui/AccessFeedbackToast';
import PildoraPrototipos from '../PildoraPrototipos';
import { RUTA_ESTUDIO_D } from '../rutas';
import CarruselesD from './CarruselesD';
import { AMBIENTES_D, AMBIENTE_INICIAL_D, ambienteD, escribirAmbienteD, leerAmbienteD } from './capasPilotoD';
import {
  INICIAL_D,
  MEDIDAS_D,
  MEDIDA_INICIAL_D,
  MUEBLES_D,
  TOTAL_COMBINACIONES_D,
  acabadosDe,
  lavamanosDe,
  capaLavamanosD,
  capaMuebleD,
  type EstadoD,
  type SeleccionD,
} from './catalogoOpcionD';
import {
  acabadoVisibleD,
  enlaceCotizacionD,
  escribirSeleccionD,
  leerSeleccionD,
  nombresD,
  normalizarD,
  rotar,
  sorprenderD,
} from './opcionDLogica';

/* Estetica del home de Alejandro (Loomere): vidrio pizarra. */
const VIDRIO: React.CSSProperties = {
  backgroundColor: 'rgba(50, 67, 84, 0.20)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  border: '1px solid rgba(255, 255, 255, 0.20)',
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.35)',
};
const VIDRIO_DENSO: React.CSSProperties = { ...VIDRIO, backgroundColor: 'rgba(50, 67, 84, 0.85)' };

/**
 * Fondo en degradado de malla con la paleta oficial (manual de identidad):
 * Navy #324354 dominante, Sage #7B8E90 de acento y Crema #F6F3EE como luz
 * detras del producto.
 */
const MALLA: React.CSSProperties = {
  backgroundColor: '#324354',
  backgroundImage: [
    'radial-gradient(at 50% 45%, rgba(246, 243, 238, 0.26) 0px, transparent 42%)',
    'radial-gradient(at 8% 12%, rgba(123, 142, 144, 0.85) 0px, transparent 50%)',
    'radial-gradient(at 70% 0%, rgba(123, 142, 144, 0.45) 0px, transparent 45%)',
    'radial-gradient(at 96% 48%, rgba(36, 50, 64, 0.95) 0px, transparent 55%)',
    'radial-gradient(at 12% 96%, rgba(123, 142, 144, 0.55) 0px, transparent 50%)',
    'radial-gradient(at 88% 100%, rgba(26, 37, 49, 1) 0px, transparent 55%)',
  ].join(', '),
};

type Galeria = 'lavamanos' | 'muebles' | null;

export default function EstudioD() {
  const [navegacion, setNavegacion] = useState({ sel: INICIAL_D, direcciones: { mueble: 1, lavamanos: 1 } });
  const { sel, direcciones } = navegacion;
  const setSel = useCallback((actualizar: React.SetStateAction<SeleccionD>, paso?: { fila: 'lavamanos' | 'mueble'; sentido: number }) =>
    setNavegacion((anterior) => {
      const siguiente = typeof actualizar === 'function' ? actualizar(anterior.sel) : actualizar;
      const direccion = (fila: 'lavamanos' | 'mueble', lista: { id: string }[]) => {
        if (paso?.fila === fila) return Math.sign(paso.sentido) || 1;
        if (siguiente[fila] === anterior.sel[fila]) return anterior.direcciones[fila];
        return lista.findIndex((p) => p.id === siguiente[fila]) >= lista.findIndex((p) => p.id === anterior.sel[fila]) ? 1 : -1;
      };
      return { sel: siguiente, direcciones: {
        mueble: direccion('mueble', MUEBLES_D),
        lavamanos: direccion('lavamanos', lavamanosDe(siguiente.mueble)),
      } };
    }), []);
  const [estado, setEstado] = useState<EstadoD>('cerrado');
  // Nodo independiente de la selección: cambiar producto no cambia el ambiente y viceversa.
  const [ambiente, setAmbiente] = useState(AMBIENTE_INICIAL_D);
  const [listo, setListo] = useState(false);
  const [galeria, setGaleria] = useState<Galeria>(null);
  const [medida, setMedida] = useState(MEDIDA_INICIAL_D);
  const [aviso, setAviso] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);
  const [cab, setCab] = useState(0);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const urlLeida = useRef(false);

  const n = nombresD(sel);
  const acabados = acabadosDe(sel.mueble);
  const lavamanos = lavamanosDe(sel.mueble);
  const hayAbierto = !!capaMuebleD(sel.mueble, sel.acabado, 'abierto');
  const abrir = estado === 'abierto' && hayAbierto;

  // Combinacion compartida por enlace. Diferido: sin setState en el cuerpo del effect (bug 002).
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setSel(leerSeleccionD(window.location.search));
      setAmbiente(leerAmbienteD(window.location.search));
      urlLeida.current = true;
    });
    return () => cancelAnimationFrame(id);
  }, [setSel]);

  useEffect(() => {
    if (!urlLeida.current) return;
    window.history.replaceState(null, '', escribirAmbienteD(escribirSeleccionD(window.location.search, sel), ambiente));
  }, [sel, ambiente]);

  // Alto del navbar fijo (Loomere): el contenido arranca debajo.
  useEffect(() => {
    const cabecera = document.querySelector('header');
    if (!cabecera) return;
    const ro = new ResizeObserver(() => setCab(Math.round(cabecera.getBoundingClientRect().height)));
    ro.observe(cabecera);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!aviso) return;
    const id = window.setTimeout(() => setAviso(null), 3200);
    return () => window.clearTimeout(id);
  }, [aviso]);

  const elegir = (parcial: Partial<SeleccionD>) => setSel((s) => normalizarD({ ...s, ...parcial }));
  const pasar = (fila: 'lavamanos' | 'mueble', paso: number) =>
    fila === 'lavamanos'
      ? setSel((s) => normalizarD({ ...s, lavamanos: rotar(lavamanosDe(s.mueble), s.lavamanos, paso) }), { fila, sentido: paso })
      : setSel((s) => normalizarD({ ...s, mueble: rotar(MUEBLES_D, s.mueble, paso) }), { fila, sentido: paso });

  const urlCombinacion = () => `${window.location.origin}${RUTA_ESTUDIO_D}${escribirAmbienteD(escribirSeleccionD('', sel), ambiente)}`;
  const cotizar = () => window.open(enlaceCotizacionD(sel, urlCombinacion()), '_blank', 'noopener,noreferrer');
  const copiarEnlace = async () => {
    try {
      await navigator.clipboard.writeText(urlCombinacion());
      setCopiado(true);
      window.setTimeout(() => setCopiado(false), 2200);
    } catch {
      setCopiado(false);
    }
  };

  const botonBarra =
    'inline-flex h-11 shrink-0 items-center gap-2 rounded-full border px-3 text-xs font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white';

  return (
    <div
      className="relative min-h-screen pb-24 text-white lg:pb-6"
      data-experiencia="banos-muebles-opcion-d"
      style={{ '--cab': `${cab}px`, paddingTop: 'var(--cab)' } as React.CSSProperties}
    >
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-0" style={MALLA} />

      <LoomereNavbar currentSceneIndex={0} directCategories onOpenMegamenu={() => setMenuAbierto(true)} urlLavamanosMuebles={RUTA_ESTUDIO_D} />
      <LoomereMegamenu isOpen={menuAbierto} onClose={() => setMenuAbierto(false)} />

      <div className="relative z-10 mx-auto max-w-[1620px] px-4 sm:px-8">
        {/* Encabezado: ruta, titulo y selector de medida */}
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3 pt-4">
          <div className="min-w-0">
            <nav aria-label="Ruta de navegación">
              <ol className="flex flex-wrap items-center gap-1 text-xs font-medium lowercase tracking-wide text-white/60">
                <li><Link href="/" className="hover:text-white">inicio</Link></li>
                <li aria-hidden><ChevronRight className="h-3.5 w-3.5" /></li>
                <li><Link href="/categoria/banos" className="hover:text-white">baños</Link></li>
                <li aria-hidden><ChevronRight className="h-3.5 w-3.5" /></li>
                <li className="text-white" aria-current="page">lavamanos & muebles</li>
              </ol>
            </nav>
            <h1 className="mt-1.5 text-2xl font-light tracking-tight text-white sm:text-3xl">
              Mézclalo a tu manera
              <span className="ml-3 hidden align-middle text-xs font-medium uppercase tracking-[0.2em] text-white/60 sm:inline">{TOTAL_COMBINACIONES_D} combinaciones</span>
            </h1>
          </div>

          <div className="-mx-4 max-w-[calc(100%+2rem)] overflow-x-auto px-4 sm:mx-0 sm:px-0" role="radiogroup" aria-label="Medida del lavamanos">
            <div className="flex w-max items-center gap-1 rounded-full p-1" style={VIDRIO}>
              {MEDIDAS_D.map((m) => {
                const elegida = m.id === medida;
                return (
                  <button
                    key={m.id}
                    type="button"
                    role="radio"
                    aria-checked={elegida}
                    aria-disabled={!m.disponible}
                    title={m.disponible ? `${m.nombre} cm` : `${m.nombre} cm · pronto`}
                    onClick={() => (m.disponible ? setMedida(m.id) : setAviso(`Las piezas de ${m.nombre} cm llegan pronto al estudio. Por ahora puedes combinar las de 63 × 48 cm.`))}
                    className={`flex h-10 shrink-0 items-center gap-1.5 rounded-full px-3 text-xs font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                      elegida ? 'bg-white text-zinc-950 shadow-md' : m.disponible ? 'text-white/85 hover:bg-white/10' : 'text-white/40 hover:text-white/60'
                    }`}
                  >
                    {m.nombre}
                    {!m.disponible && <span className="rounded-full border border-white/20 px-1.5 py-px text-[9px] font-medium uppercase tracking-wider">pronto</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Ambiente persistente y una única combinación de capas intercambiables. */}
        <section
          aria-label={`Tu combinación: lavamanos ${n.lavamanos.nombre} sobre el mueble ${n.mueble.nombre} en acabado ${n.acabado.nombre}, ${abrir ? 'abierto' : 'cerrado'}, ambiente ${ambienteD(ambiente).nombre.toLowerCase()}`}
          className="relative mt-4 h-[58svh] min-h-[340px] overflow-hidden rounded-[28px] lg:h-[calc(100svh-var(--cab)-232px)] lg:min-h-[440px]"
          style={VIDRIO}
        >
          <CarruselesD sel={sel} ambiente={ambiente} direcciones={direcciones} animar={listo} onPaso={pasar} onCargado={() => setListo(true)} />

          {/* Nombres de la combinacion */}
          <div className="pointer-events-none absolute bottom-3 left-4 z-20 sm:bottom-4 sm:left-6">
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/55">Tu combinación</p>
            <p className="mt-0.5 text-sm font-semibold text-white sm:text-base">{n.lavamanos.nombre} + {n.mueble.nombre}</p>
            <p className="text-xs text-white/65">{n.acabado.nombre} · Grifería en {n.lavamanos.griferia.toLowerCase()}</p>
          </div>

          <div className="absolute bottom-3 right-3 z-20 flex items-center gap-2 sm:bottom-4 sm:right-4">
            <button
              type="button"
              onClick={() => setSel((s) => sorprenderD(s))}
              aria-label="Sorpréndeme: otra combinación al azar"
              title="Sorpréndeme"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white/80 backdrop-blur-md hover:bg-white/10 hover:text-white"
            >
              <Dices className="h-5 w-5" aria-hidden />
            </button>
            {hayAbierto && (
              <button
                type="button"
                onClick={() => setEstado((e) => (e === 'abierto' ? 'cerrado' : 'abierto'))}
                aria-pressed={abrir}
                className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-4 text-xs font-semibold text-zinc-950 shadow-lg transition-all duration-200 hover:scale-105 hover:bg-white/90 active:scale-[0.98]"
              >
                {abrir ? <DoorClosed className="h-4 w-4" aria-hidden /> : <DoorOpen className="h-4 w-4" aria-hidden />}
                {abrir ? 'Cerrar' : 'Ábrelo'}
              </button>
            )}
          </div>

          <p className="pointer-events-none absolute bottom-4 left-1/2 z-20 hidden -translate-x-1/2 text-[11px] text-white/45 lg:block">
            Desliza o usa las flechas para cambiar el lavamanos o el mueble
          </p>

          {!listo && (
            <div className="absolute inset-0 z-30 flex items-center justify-center" role="status">
              <span className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              <span className="sr-only">Cargando tu combinación</span>
            </div>
          )}

          {aviso && (
            <div role="status" className="absolute inset-x-3 top-3 z-40 mx-auto flex max-w-md items-center gap-2 rounded-2xl px-4 py-3 text-xs font-medium text-white" style={VIDRIO_DENSO}>
              <span className="flex-1">{aviso}</span>
              <button type="button" onClick={() => setAviso(null)} aria-label="Cerrar aviso" className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-white/10">
                <X className="h-4 w-4" aria-hidden />
              </button>
            </div>
          )}
        </section>

        <div className="relative mt-3">
        {/* Galeria abierta: tira de miniaturas que flota sobre la barra (no empuja la pagina) */}
        <div
          className={`absolute inset-x-0 bottom-full z-30 mb-2 transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none ${
            galeria ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0'
          }`}
          inert={!galeria}
        >
          <div>
            <div id="galeria-d" className="flex gap-2 overflow-x-auto rounded-2xl p-2" style={VIDRIO_DENSO} role="radiogroup" aria-label={galeria === 'muebles' ? 'Galería de muebles' : 'Galería de lavamanos'}>
              {(galeria === 'muebles' ? MUEBLES_D : lavamanos).map((item) => {
                const esMueble = galeria === 'muebles';
                const elegido = esMueble ? item.id === sel.mueble : item.id === sel.lavamanos;
                const src = esMueble ? capaMuebleD(item.id, acabadoVisibleD(item.id, sel.acabado), 'cerrado')!.src
                  : capaLavamanosD(item.id).src;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="radio"
                    aria-checked={elegido}
                    onClick={() => elegir(esMueble ? { mueble: item.id } : { lavamanos: item.id })}
                    className={`group relative w-[112px] shrink-0 overflow-hidden rounded-xl border text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:w-[132px] ${
                      elegido ? 'border-white/80 bg-white/15' : 'border-white/10 bg-white/5 hover:border-white/40 hover:bg-white/10'
                    }`}
                  >
                    <span className="relative block aspect-[4/3]">
                      <Image src={src} alt="" fill sizes="132px" className="object-contain p-2 drop-shadow-[0_6px_10px_rgba(0,0,0,0.35)] transition-transform duration-300 group-hover:scale-105" />
                      {elegido && (
                        <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white text-zinc-950">
                          <Check className="h-3 w-3" aria-hidden />
                        </span>
                      )}
                    </span>
                    <span className="block truncate px-2 pb-2 text-[11px] font-semibold">{item.nombre}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Barra inferior compacta: galerias, acabado y cotizar */}
        <div className="flex flex-wrap items-center gap-2 rounded-[22px] p-2 sm:gap-3" style={VIDRIO}>
          {(
            [
              ['lavamanos', 'Lavamanos', n.lavamanos.nombre, capaLavamanosD(sel.lavamanos).src],
              ['muebles', 'Muebles', n.mueble.nombre, capaMuebleD(sel.mueble, sel.acabado, 'cerrado')!.src],
            ] as const
          ).map(([id, titulo, valor, src]) => {
            const activa = galeria === id;
            return (
              <button
                key={id}
                type="button"
                aria-expanded={activa}
                aria-controls="galeria-d"
                onClick={() => setGaleria((g) => (g === id ? null : id))}
                className={`${botonBarra} pl-1.5 ${activa ? 'border-white/70 bg-white/15' : 'border-white/15 bg-white/5 hover:bg-white/10'}`}
              >
                <span className="relative h-8 w-10 shrink-0">
                  <Image src={src} alt="" fill sizes="40px" className="object-contain" />
                </span>
                <span className="flex flex-col items-start leading-tight">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-white/55">{titulo}</span>
                  <span>{valor}</span>
                </span>
                <ChevronDown className={`h-4 w-4 text-white/60 transition-transform duration-200 ${activa ? 'rotate-180' : ''}`} aria-hidden />
              </button>
            );
          })}

          <div className="flex items-center gap-2 px-1" role="radiogroup" aria-label="Acabado del mueble">
            <span className="hidden text-[10px] font-medium uppercase tracking-wider text-white/55 md:inline">Acabado</span>
            {acabados.map((a) => {
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
                  className="group flex h-11 w-11 items-center justify-center focus:outline-none"
                >
                  <span className={`relative block h-8 w-8 overflow-hidden rounded-full ring-offset-2 ring-offset-[#2a3846] transition-all duration-150 group-hover:scale-110 group-focus-visible:ring-2 group-focus-visible:ring-white ${elegido ? 'ring-2 ring-white' : 'ring-1 ring-white/25'}`}>
                    <Image src={a.muestra} alt="" fill sizes="32px" className="object-cover" />
                  </span>
                </button>
              );
            })}
            <span className="text-xs font-semibold text-white/85">{n.acabado.nombre}</span>
          </div>

          {/* Ambiente: solo cambia la placa y sus sombras, nunca las piezas. */}
          <div className="flex items-center gap-2 px-1">
            <span className="hidden text-[10px] font-medium uppercase tracking-wider text-white/55 md:inline">Ambiente</span>
            <div role="radiogroup" aria-label="Ambiente" className="flex items-center gap-1 rounded-full border border-white/15 bg-white/5 p-0.5">
              {AMBIENTES_D.map((a) => {
                const elegido = a.id === ambiente;
                return (
                  <button
                    key={a.id}
                    type="button"
                    role="radio"
                    aria-checked={elegido}
                    aria-label={`Ambiente ${a.nombre}`}
                    title={`${a.nombre}: ${a.descripcion}`}
                    onClick={() => setAmbiente(a.id)}
                    className={`flex h-11 min-w-11 items-center gap-2 rounded-full p-1 text-xs font-semibold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:pr-3 ${
                      elegido ? 'bg-white text-zinc-950 shadow-md' : 'text-white/85 hover:bg-white/10'
                    }`}
                  >
                    <span className={`relative block h-9 w-9 shrink-0 overflow-hidden rounded-full ${elegido ? 'ring-2 ring-zinc-950/10' : 'ring-1 ring-white/25'}`}>
                      <Image src={a.thumb} alt="" fill unoptimized sizes="36px" className="object-cover" />
                    </span>
                    <span className="hidden sm:inline">{a.nombre}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={copiarEnlace}
              aria-live="polite"
              aria-label={copiado ? 'Enlace copiado' : 'Copiar enlace de esta combinación'}
              title="Copiar enlace de esta combinación"
              className={`${botonBarra} border-white/15 bg-white/5 text-white/85 hover:bg-white/10`}
            >
              {copiado ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
              <span className="hidden xl:inline">{copiado ? 'Enlace copiado' : 'Copiar enlace'}</span>
            </button>
            <button
              type="button"
              onClick={cotizar}
              className="hidden h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-zinc-950 shadow-lg transition-all duration-200 hover:scale-[1.02] hover:bg-white/90 active:scale-[0.98] lg:inline-flex"
            >
              Cotizar por WhatsApp
              <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>
        </div>
      </div>

      {/* Prototipos A–D: icono redondo flotante. En movil, encima de la barra de cotizar. */}
      <PildoraPrototipos activa="d" className="bottom-[88px] lg:bottom-4" />

      {/* Movil: cotizar a mano */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 px-4 py-3 lg:hidden"
        style={{ ...VIDRIO_DENSO, borderLeft: 0, borderRight: 0, borderBottom: 0, boxShadow: '0 -12px 30px rgba(0,0,0,0.4)' }}
      >
        <div className="mx-auto flex max-w-xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{n.lavamanos.nombre} + {n.mueble.nombre}</p>
            <p className="truncate text-xs text-white/65">{n.acabado.nombre} · Grifería en {n.lavamanos.griferia.toLowerCase()}</p>
          </div>
          <button type="button" onClick={cotizar} className="h-12 shrink-0 rounded-full bg-white px-5 text-sm font-semibold text-zinc-950 shadow-lg active:scale-[0.98]">
            Cotizar
          </button>
        </div>
      </div>

      <AccessFeedbackToast />
    </div>
  );
}
