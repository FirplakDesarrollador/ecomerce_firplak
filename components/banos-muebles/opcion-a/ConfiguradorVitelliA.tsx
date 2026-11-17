'use client';

import React, { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import {
  Box,
  Check,
  ChevronRight,
  Columns2,
  Copy,
  DoorOpen,
  Eye,
  Move3d,
  PanelTop,
  Ruler,
  Rotate3d,
  X,
} from 'lucide-react';
import type { MuebleBano } from '../catalogoMuebles';
import {
  enlaceCotizacion,
  escribirSeleccion,
  leerSeleccion,
  nombresSeleccion,
  type Seleccion,
} from './configuradorLogica';
import type { PuntoInteres, VistaCamara } from './EscenarioVitelli3D';

// three + r3f solo se descargan en esta pagina y del lado del cliente.
const EscenarioVitelli3D = dynamic(() => import('./EscenarioVitelli3D'), { ssr: false });

const consultaMovimiento = '(prefers-reduced-motion: reduce)';
const suscribirMovimiento = (cb: () => void) => {
  const mq = window.matchMedia(consultaMovimiento);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
};

const VISTAS: { id: VistaCamara; etiqueta: string; Icono: typeof Eye }[] = [
  { id: 'tresCuartos', etiqueta: '3/4', Icono: Rotate3d },
  { id: 'frente', etiqueta: 'Frente', Icono: Box },
  { id: 'interior', etiqueta: 'Interior', Icono: DoorOpen },
  { id: 'cenital', etiqueta: 'Arriba', Icono: PanelTop },
];

// Panel flotante claro del sistema de diseno (glass-panel).
const VIDRIO = 'border border-white/70 bg-white/80 shadow-[0_8px_30px_rgba(50,67,84,0.14)] backdrop-blur-[20px]';

export default function ConfiguradorVitelliA({ mueble }: { mueble: MuebleBano }) {
  const [sel, setSel] = useState<Seleccion>({ acabado: mueble.acabadoInicial, lavamanos: mueble.lavamanosInicial });
  const [abierto, setAbierto] = useState(false);
  const [vista, setVista] = useState<VistaCamara>('tresCuartos');
  const [vistaPedido, setVistaPedido] = useState(0);
  const [medidas, setMedidas] = useState(false);
  const [acabadoB, setAcabadoB] = useState<string | null>(null);
  const [corte, setCorte] = useState(0.5);
  const [listo, setListo] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const [interactuo, setInteractuo] = useState(false);
  const [punto, setPunto] = useState<PuntoInteres | null>(null);
  const [copiado, setCopiado] = useState(false);
  const [enPantalla, setEnPantalla] = useState(true);
  const escenario = useRef<HTMLDivElement>(null);
  const urlLeida = useRef(false);
  const reducirMovimiento = useSyncExternalStore(
    suscribirMovimiento,
    () => window.matchMedia(consultaMovimiento).matches,
    () => false
  );
  const comparando = acabadoB !== null;
  const { acabado, lavamanos } = nombresSeleccion(mueble, sel);

  // Combinacion compartida por enlace (?acabado=&lavamanos=). Diferido: sin
  // setState en el cuerpo del effect (bug 002).
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setSel(leerSeleccion(mueble, window.location.search));
      urlLeida.current = true;
    });
    return () => cancelAnimationFrame(id);
  }, [mueble]);

  // La URL siempre refleja la combinacion: se puede copiar o compartir.
  useEffect(() => {
    if (!urlLeida.current) return;
    window.history.replaceState(null, '', escribirSeleccion(window.location.search, sel));
  }, [sel]);

  // Sin pantalla no se renderiza el 3D (bateria y GPU).
  useEffect(() => {
    const el = escenario.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => setEnPantalla(e.isIntersecting), { rootMargin: '120px' });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const pedirVista = useCallback((v: VistaCamara) => {
    setVista(v);
    setVistaPedido((n) => n + 1);
    if (v === 'interior') setAbierto(true);
  }, []);

  const elegirAcabado = (id: string) => {
    if (comparando) {
      if (id !== sel.acabado) setAcabadoB(id);
      return;
    }
    setSel((s) => ({ ...s, acabado: id }));
  };

  const iniciarComparacion = () => {
    const i = mueble.acabados.findIndex((a) => a.id === sel.acabado);
    setAcabadoB(mueble.acabados[(i + 1) % mueble.acabados.length].id);
    setCorte(0.5);
    setAbierto(false);
    setMedidas(false);
    setPunto(null);
    pedirVista('frente');
  };

  const terminarComparacion = (quedarseConB: boolean) => {
    if (quedarseConB && acabadoB) setSel((s) => ({ ...s, acabado: acabadoB }));
    setAcabadoB(null);
    pedirVista('tresCuartos');
  };

  const tocarPunto = useCallback(
    (p: PuntoInteres) => {
      setPunto(p);
      if (p === 'cajon') setAbierto(true);
      if (p === 'lavamanos') pedirVista('cenital');
    },
    [pedirVista]
  );

  const urlCombinacion = () => `${window.location.origin}${window.location.pathname}${escribirSeleccion('', sel)}`;

  const cotizar = () => {
    window.open(enlaceCotizacion(mueble, sel, urlCombinacion()), '_blank', 'noopener,noreferrer');
  };

  const copiarEnlace = async () => {
    try {
      await navigator.clipboard.writeText(urlCombinacion());
      setCopiado(true);
      window.setTimeout(() => setCopiado(false), 2200);
    } catch {
      setCopiado(false);
    }
  };

  // Deslizador de comparacion: arrastrar en cualquier punto del escenario.
  const moverCorte = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setCorte(Math.min(0.96, Math.max(0.04, (e.clientX - r.left) / r.width)));
  };

  const onListo = useCallback(() => setListo(true), []);
  const onInteraccion = useCallback(() => setInteractuo(true), []);
  const nombreB = mueble.acabados.find((a) => a.id === acabadoB)?.nombre;

  const panelPunto = punto && (
    <div className={`absolute right-3 top-3 z-20 w-[min(300px,calc(100%-24px))] rounded-2xl p-4 text-[#324354] ${VIDRIO}`}>
      <button
        type="button"
        onClick={() => setPunto(null)}
        aria-label="Cerrar detalle"
        className="absolute right-1.5 top-1.5 flex h-11 w-11 items-center justify-center rounded-full text-[#58696b] hover:bg-black/5"
      >
        <X className="h-4 w-4" aria-hidden />
      </button>
      {punto === 'cajon' && (
        <>
          <p className="pr-8 text-sm font-semibold">Cajones con cierre lento</p>
          <p className="mt-1.5 text-sm leading-relaxed text-[#58696b]">
            Los dos cajones corren sobre rieles de cierre lento: frenan solos al final del recorrido.
          </p>
        </>
      )}
      {punto === 'lavamanos' && (
        <>
          <p className="pr-8 text-sm font-semibold">Lavamanos {lavamanos.nombre}</p>
          <p className="mt-1.5 text-sm leading-relaxed text-[#58696b]">
            {lavamanos.forma}, {lavamanos.medida}. Los cuatro lavamanos encajan en el {mueble.nombre}: compáralos desde arriba.
          </p>
        </>
      )}
      {punto === 'grifo' && (
        <>
          <p className="pr-8 text-sm font-semibold">Grifería monocontrol</p>
          <p className="mt-1.5 text-sm leading-relaxed text-[#58696b]">
            Se muestra con grifería negra como referencia de ambientación. Pregúntale a tu asesor por las opciones disponibles.
          </p>
        </>
      )}
    </div>
  );

  return (
    <div className="bg-white pb-28 text-[#324354] lg:pb-16" data-experiencia="banos-muebles-opcion-a">
      {/* Migas */}
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
        {/* Escenario 3D */}
        <section aria-label="Vista 3D del mueble" className="lg:sticky lg:top-[156px] lg:self-start">
          <div
            ref={escenario}
            className="relative h-[58vh] min-h-[380px] overflow-hidden rounded-3xl bg-[#efe9e1] lg:h-[calc(100vh-180px)] lg:min-h-[560px]"
          >
            <EscenarioVitelli3D
              mueble={mueble}
              acabado={sel.acabado}
              lavamanos={sel.lavamanos}
              abierto={abierto}
              vista={vista}
              vistaPedido={vistaPedido}
              medidas={medidas}
              comparar={acabadoB ? { acabadoB, corte } : null}
              activo={enPantalla}
              reducirMovimiento={reducirMovimiento}
              puntosVisibles={listo && !comparando && !abierto && (vista === 'tresCuartos' || vista === 'frente')}
              onPunto={tocarPunto}
              onInteraccion={onInteraccion}
              onListo={onListo}
              onProgreso={setProgreso}
            />

            {/* Carga: respuesta inmediata mientras llega el modelo */}
            {!listo && (
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 bg-[#efe9e1]">
                <Move3d className="h-9 w-9 text-[#58696b] motion-safe:animate-pulse" aria-hidden />
                <p className="text-sm font-medium text-[#324354]">Preparando tu mueble en 3D…</p>
                <div className="h-1 w-48 overflow-hidden rounded-full bg-[#e5e0d8]" role="progressbar" aria-valuenow={Math.round(progreso)} aria-valuemin={0} aria-valuemax={100}>
                  <div className="h-full rounded-full bg-[#324354] transition-[width] duration-300" style={{ width: `${Math.max(6, progreso)}%` }} />
                </div>
              </div>
            )}

            {/* Pista de interaccion */}
            {listo && !interactuo && !comparando && (
              <div className={`pointer-events-none absolute left-3 top-3 z-10 flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-medium ${VIDRIO}`}>
                <Rotate3d className="h-4 w-4" aria-hidden />
                Arrastra para girar · rueda o pellizca para acercar
              </div>
            )}

            {panelPunto}

            {/* Comparador: el escenario entero es el deslizador */}
            {comparando && (
              <div
                className="absolute inset-0 z-20 cursor-ew-resize touch-none"
                onPointerDown={(e) => {
                  e.currentTarget.setPointerCapture(e.pointerId);
                  moverCorte(e);
                }}
                onPointerMove={(e) => {
                  if (e.currentTarget.hasPointerCapture(e.pointerId)) moverCorte(e);
                }}
                role="slider"
                aria-label="Comparar acabados"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(corte * 100)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowLeft') setCorte((c) => Math.max(0.04, c - 0.04));
                  if (e.key === 'ArrowRight') setCorte((c) => Math.min(0.96, c + 0.04));
                }}
              >
                <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow-[0_0_12px_rgba(0,0,0,0.25)]" style={{ left: `${corte * 100}%` }}>
                  <span className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#324354] shadow-lg">
                    <Columns2 className="h-5 w-5" aria-hidden />
                  </span>
                </div>
                <span className={`pointer-events-none absolute left-3 top-3 rounded-full px-3 py-1.5 text-xs font-semibold ${VIDRIO}`}>
                  {acabado.nombre}
                </span>
                <span className={`pointer-events-none absolute right-3 top-3 rounded-full px-3 py-1.5 text-xs font-semibold ${VIDRIO}`}>
                  {nombreB}
                </span>
              </div>
            )}

            {/* Controles del escenario */}
            {!comparando && (
              <div className="absolute inset-x-3 bottom-3 z-10 flex flex-wrap items-end justify-between gap-2">
                <div className={`flex rounded-full p-1 ${VIDRIO}`} role="group" aria-label="Encuadre de cámara">
                  {VISTAS.map(({ id, etiqueta, Icono }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => pedirVista(id)}
                      aria-pressed={vista === id}
                      aria-label={`Vista ${etiqueta}`}
                      className={`flex h-11 min-w-11 items-center justify-center gap-1.5 rounded-full px-3 text-xs font-semibold transition-colors duration-150 ${
                        vista === id ? 'bg-[#324354] text-white' : 'text-[#324354] hover:bg-black/5'
                      }`}
                    >
                      <Icono className="h-4 w-4" aria-hidden />
                      <span className="hidden sm:inline">{etiqueta}</span>
                    </button>
                  ))}
                </div>
                <div className={`flex rounded-full p-1 ${VIDRIO}`} role="group" aria-label="Mostrar">
                  <button
                    type="button"
                    onClick={() => setAbierto((a) => !a)}
                    aria-pressed={abierto}
                    className={`flex h-11 items-center gap-1.5 rounded-full px-3.5 text-xs font-semibold transition-colors duration-150 ${
                      abierto ? 'bg-[#324354] text-white' : 'text-[#324354] hover:bg-black/5'
                    }`}
                  >
                    <DoorOpen className="h-4 w-4" aria-hidden />
                    {abierto ? 'Cerrar' : 'Abrir'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setMedidas((m) => !m)}
                    aria-pressed={medidas}
                    className={`flex h-11 items-center gap-1.5 rounded-full px-3.5 text-xs font-semibold transition-colors duration-150 ${
                      medidas ? 'bg-[#324354] text-white' : 'text-[#324354] hover:bg-black/5'
                    }`}
                  >
                    <Ruler className="h-4 w-4" aria-hidden />
                    Medidas
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Panel de configuracion */}
        <section aria-labelledby="titulo-mueble" className="pb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#58696b]">{mueble.linea}</p>
          <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h1 id="titulo-mueble" className="text-3xl font-semibold tracking-tight sm:text-4xl">{mueble.nombre}</h1>
            <span className="rounded-full bg-[#f6f3ee] px-2.5 py-1 text-xs font-semibold text-[#58696b]">{mueble.medidaComercial}</span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-[#58696b]">{mueble.descripcion}</p>

          {/* 1. Acabado */}
          <div className="mt-7 border-t border-[#e5e0d8] pt-6">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="text-sm font-semibold">
                <span className="mr-2 text-[#58696b]">1</span>Acabado del mueble
              </h2>
              <span className="text-sm font-medium text-[#58696b]">{acabado.nombre}</span>
            </div>
            {comparando && (
              <p className="mt-2 text-xs leading-relaxed text-[#58696b]">
                Izquierda: <strong className="text-[#324354]">{acabado.nombre}</strong> (tu elección). Toca otro acabado para verlo a la derecha y desliza sobre el mueble.
              </p>
            )}
            <div className="mt-4 flex flex-wrap gap-3" role="radiogroup" aria-label="Acabado del mueble">
              {mueble.acabados.map((a) => {
                const elegido = a.id === sel.acabado;
                const enB = comparando && a.id === acabadoB;
                return (
                  <button
                    key={a.id}
                    type="button"
                    role="radio"
                    aria-checked={comparando ? enB : elegido}
                    aria-label={a.nombre}
                    title={a.nombre}
                    onClick={() => elegirAcabado(a.id)}
                    className="group flex w-[60px] flex-col items-center gap-1.5 focus:outline-none"
                  >
                    <span
                      className={`relative block h-[52px] w-[52px] overflow-hidden rounded-full ring-offset-2 transition-all duration-150 group-hover:scale-105 group-focus-visible:ring-2 group-focus-visible:ring-[#324354] ${
                        elegido || enB ? 'ring-2 ring-[#324354]' : 'ring-1 ring-[#e5e0d8]'
                      }`}
                    >
                      <Image src={a.muestra} alt="" fill sizes="52px" className="object-cover" />
                      {elegido && !comparando && (
                        <span className="absolute inset-0 flex items-center justify-center bg-black/15">
                          <Check className="h-5 w-5 text-white drop-shadow" aria-hidden />
                        </span>
                      )}
                    </span>
                    <span className={`text-[11px] leading-tight ${elegido || enB ? 'font-semibold text-[#324354]' : 'text-[#58696b]'}`}>
                      {a.nombre}
                    </span>
                  </button>
                );
              })}
            </div>
            {comparando ? (
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => terminarComparacion(true)}
                  className="h-11 rounded-full border border-[#324354] px-4 text-xs font-semibold text-[#324354] transition-colors hover:bg-[#f6f3ee]"
                >
                  Quedarme con {nombreB}
                </button>
                <button
                  type="button"
                  onClick={() => terminarComparacion(false)}
                  className="h-11 rounded-full px-4 text-xs font-semibold text-[#58696b] hover:bg-[#f6f3ee]"
                >
                  Terminar comparación
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={iniciarComparacion}
                className="mt-4 inline-flex h-11 items-center gap-2 rounded-full px-1 text-xs font-semibold text-[#324354] underline-offset-4 hover:underline"
              >
                <Columns2 className="h-4 w-4" aria-hidden />
                Comparar dos acabados lado a lado
              </button>
            )}
          </div>

          {/* 2. Lavamanos */}
          <div className="mt-6 border-t border-[#e5e0d8] pt-6">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="text-sm font-semibold">
                <span className="mr-2 text-[#58696b]">2</span>Lavamanos
              </h2>
              <span className="text-sm font-medium text-[#58696b]">{lavamanos.nombre}</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3" role="radiogroup" aria-label="Lavamanos">
              {mueble.lavamanos.map((l) => {
                const elegido = l.id === sel.lavamanos;
                return (
                  <button
                    key={l.id}
                    type="button"
                    role="radio"
                    aria-checked={elegido}
                    onClick={() => setSel((s) => ({ ...s, lavamanos: l.id }))}
                    className={`group rounded-2xl border p-2.5 text-left transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#324354] ${
                      elegido ? 'border-[#324354] bg-[#f6f3ee]' : 'border-[#e5e0d8] hover:border-[#7b8e90]'
                    }`}
                  >
                    <span className="relative block aspect-[3/2] overflow-hidden rounded-xl bg-[#ece8e0]">
                      <Image src={l.miniatura} alt="" fill sizes="(max-width: 1024px) 45vw, 180px" className="object-contain p-1.5 transition-transform duration-300 group-hover:scale-105" />
                    </span>
                    <span className="mt-2 flex items-center justify-between gap-2 px-0.5">
                      <span className="text-sm font-semibold">{l.nombre}</span>
                      {elegido && <Check className="h-4 w-4 shrink-0" aria-hidden />}
                    </span>
                    <span className="block px-0.5 text-[11px] leading-snug text-[#58696b]">{l.forma}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Resumen y cotizacion */}
          <div className="mt-6 rounded-3xl bg-[#f6f3ee] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#58696b]">Tu combinación</p>
            <ul className="mt-3 space-y-1.5 text-sm">
              <li className="flex justify-between gap-4"><span className="text-[#58696b]">Mueble</span><span className="font-semibold">{mueble.nombre} · {acabado.nombre}</span></li>
              <li className="flex justify-between gap-4"><span className="text-[#58696b]">Lavamanos</span><span className="font-semibold">{lavamanos.nombre} · {lavamanos.medida}</span></li>
              <li className="flex justify-between gap-4"><span className="text-[#58696b]">Precio</span><span className="font-semibold">Cotízalo con un asesor</span></li>
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
              className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-full text-xs font-semibold text-[#324354] hover:bg-white/70"
              aria-live="polite"
            >
              {copiado ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
              {copiado ? 'Enlace copiado' : 'Copiar enlace de esta combinación'}
            </button>
          </div>

          <ul className="mt-6 space-y-2.5">
            {mueble.detalles.map((d) => (
              <li key={d} className="flex items-start gap-2.5 text-sm text-[#324354]">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#7b8e90]" aria-hidden />
                {d}
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Movil: cotizar siempre a mano, en la zona del pulgar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#e5e0d8] bg-white/95 px-4 py-3 backdrop-blur-[20px] lg:hidden">
        <div className="mx-auto flex max-w-xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{mueble.nombre} · {acabado.nombre}</p>
            <p className="truncate text-xs text-[#58696b]">Lavamanos {lavamanos.nombre} · {lavamanos.medida}</p>
          </div>
          <button
            type="button"
            onClick={cotizar}
            className="h-12 shrink-0 rounded-full bg-[#324354] px-5 text-sm font-semibold text-white active:scale-[0.98]"
          >
            Cotizar
          </button>
        </div>
      </div>
    </div>
  );
}
