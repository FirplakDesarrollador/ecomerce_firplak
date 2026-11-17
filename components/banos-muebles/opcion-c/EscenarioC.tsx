'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Dices, DoorClosed, DoorOpen, Layers, Moon, Sun, X } from 'lucide-react';
import { MUEBLES_C, rutaVistaC, type EstadoC, type SeleccionC, type VistaC } from './catalogoOpcionC';
import { componerC, ladoPreferidoC } from './componerC';
import { aPantalla, encuadreVista, nombresC, tipoCambioC, transformEncuadre } from './opcionCLogica';

// Panel flotante claro del sistema de diseno (glass-panel), igual que A y B.
export const VIDRIO = 'border border-white/70 bg-white/80 shadow-[0_8px_30px_rgba(50,67,84,0.14)] backdrop-blur-[20px]';

const VISTAS: { id: VistaC; nombre: string }[] = [
  { id: 'conjunto', nombre: 'Conjunto' },
  { id: 'lavamanos', nombre: 'Lavamanos' },
  { id: 'mueble', nombre: 'Mueble' },
];

const CURVA = MUEBLES_C.find((m) => m.id === 'curva');

/** Copia la franja [y0, y1) del render compuesto en un lienzo visible. */
function pintarFranja(destino: HTMLCanvasElement, origen: HTMLCanvasElement, y0: number, y1: number) {
  destino.width = origen.width;
  destino.height = y1 - y0;
  destino.getContext('2d')?.drawImage(origen, 0, y0, origen.width, y1 - y0, 0, 0, origen.width, y1 - y0);
}

/** Fantasma: copia congelada de un lienzo para animar su salida sobre el nuevo. */
function fantasma(contenedor: HTMLElement, lienzo: HTMLCanvasElement): HTMLCanvasElement {
  const f = document.createElement('canvas');
  f.width = lienzo.width;
  f.height = lienzo.height;
  f.getContext('2d')?.drawImage(lienzo, 0, 0);
  f.className = 'pointer-events-none absolute inset-0 h-full w-full';
  contenedor.appendChild(f);
  return f;
}

const quitarAlTerminar = (a: Animation, el: HTMLElement) => a.finished.then(() => el.remove(), () => el.remove());

function barrer(fantasmaEl: HTMLElement, luz: HTMLElement | null) {
  quitarAlTerminar(
    fantasmaEl.animate([{ clipPath: 'inset(0 0 0 0%)' }, { clipPath: 'inset(0 0 0 100%)' }], { duration: 760, easing: 'cubic-bezier(.6,0,.3,1)', fill: 'forwards' }),
    fantasmaEl
  );
  luz?.animate(
    [{ left: '0%', opacity: 0 }, { left: '8%', opacity: 1, offset: 0.1 }, { left: '92%', opacity: 1, offset: 0.9 }, { left: '100%', opacity: 0 }],
    { duration: 760, easing: 'cubic-bezier(.6,0,.3,1)' }
  );
}

const fundir = (el: HTMLElement, ms: number) => quitarAlTerminar(el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: ms, fill: 'forwards' }), el);

export interface EscenarioCProps {
  sel: SeleccionC;
  estado: EstadoC;
  vista: VistaC;
  oscuro: boolean;
  previa: boolean;
  interactuo: boolean;
  reducirMovimiento: boolean;
  onLavamanos: (paso: 1 | -1) => void;
  onAlternarEstado: () => void;
  onVista: (v: VistaC) => void;
  onOscuro: () => void;
  onPrevia: (abrir: boolean) => void;
  onSorprender: () => void;
  onCotizarPrevia: () => void;
  onPintado: (lienzo: HTMLCanvasElement, costura: number) => void;
  onListo: () => void;
  onError: (mensaje: string) => void;
}

/**
 * Escenario de la Opcion C: el render partido en dos piezas (lavamanos arriba,
 * mueble abajo) mas el mueble solo. Cada cambio anima solo la pieza que cambio.
 */
export default function EscenarioC({
  sel,
  estado,
  vista,
  oscuro,
  previa,
  interactuo,
  reducirMovimiento,
  onLavamanos,
  onAlternarEstado,
  onVista,
  onOscuro,
  onPrevia,
  onSorprender,
  onCotizarPrevia,
  onPintado,
  onListo,
  onError,
}: EscenarioCProps) {
  const [listo, setListo] = useState(false);
  const [piezas, setPiezas] = useState(true);
  const [costura, setCostura] = useState(() => rutaVistaC(sel.mueble, sel.lavamanos, 'cerrado').costura);
  const [alto, setAlto] = useState(640);

  const raiz = useRef<HTMLDivElement>(null);
  const piezaSup = useRef<HTMLDivElement>(null);
  const piezaInf = useRef<HTMLDivElement>(null);
  const piezaSolo = useRef<HTMLDivElement>(null);
  const lienzoSup = useRef<HTMLCanvasElement>(null);
  const lienzoInf = useRef<HTMLCanvasElement>(null);
  const lienzoSolo = useRef<HTMLCanvasElement>(null);
  const barridoInf = useRef<HTMLDivElement>(null);
  const barridoSolo = useRef<HTMLDivElement>(null);
  const cajaProducto = useRef<HTMLDivElement>(null);
  const mostrado = useRef<{ sel: SeleccionC; estado: EstadoC } | null>(null);
  const soloMostrado = useRef<string | null>(null);
  const turno = useRef(0);
  const gesto = useRef<{ x: number; y: number; t: number; zona: 'lavamanos' | 'mueble' } | null>(null);

  const n = nombresC(sel);
  const enc = encuadreVista(vista, sel, alto);
  const rc = rutaVistaC(sel.mueble, sel.lavamanos, 'cerrado');
  const rs = rutaVistaC(sel.mueble, 'solo', 'cerrado');

  // Alto real del escenario: el encuadre deja libres las barras de arriba y abajo.
  useEffect(() => {
    const el = raiz.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setAlto(Math.round(el.clientHeight)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Conjunto: pinta la combinacion y anima segun que cambio.
  useEffect(() => {
    const t = ++turno.current;
    const actual = { sel, estado };
    const cambio = tipoCambioC(mostrado.current, actual);
    if (cambio === 'ninguno') return;
    let cancelado = false;
    const lado = ladoPreferidoC();
    const r = rutaVistaC(sel.mueble, sel.lavamanos, estado);
    componerC(sel, sel.lavamanos, estado, lado)
      .then((lienzo) => {
        if (cancelado || t !== turno.current) return;
        const sup = lienzoSup.current, inf = lienzoInf.current, ps = piezaSup.current, pi = piezaInf.current;
        if (!sup || !inf || !ps || !pi) return;
        const c = Math.round(r.costura * lado);
        const animar = !reducirMovimiento && cambio !== 'inicio';
        const arriba = animar && (cambio === 'lavamanos' || cambio === 'griferia' || cambio === 'varios') ? fantasma(ps, sup) : null;
        const abajo = animar && cambio !== 'griferia' ? fantasma(pi, inf) : null;
        pintarFranja(sup, lienzo, 0, c);
        pintarFranja(inf, lienzo, c, lado);
        mostrado.current = actual;
        setCostura(r.costura);
        onPintado(lienzo, r.costura);
        if (cambio === 'inicio') {
          setListo(true);
          onListo();
          if (!reducirMovimiento) {
            sup.animate([{ transform: 'translateY(-26%)', opacity: 0 }, { transform: 'translateY(0)', opacity: 1 }], { duration: 760, easing: 'cubic-bezier(.2,.9,.25,1.15)' });
            inf.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 480 });
          }
          return;
        }
        if (cambio === 'lavamanos' || cambio === 'varios') {
          // El lavamanos anterior sube y se va; el nuevo baja y asienta.
          if (arriba) quitarAlTerminar(arriba.animate([{ transform: 'translateY(0)', opacity: 1 }, { transform: 'translateY(-18%)', opacity: 0 }], { duration: 280, easing: 'ease-in', fill: 'forwards' }), arriba);
          sup.animate(
            [{ transform: 'translateY(-30%)', opacity: 0 }, { transform: 'translateY(3%)', opacity: 1, offset: 0.7 }, { transform: 'translateY(0)', opacity: 1 }],
            { duration: 560, delay: 120, easing: 'cubic-bezier(.2,.8,.3,1)', fill: 'backwards' }
          );
          if (abajo) {
            if (cambio === 'varios') barrer(abajo, barridoInf.current);
            else fundir(abajo, 300);
          }
        } else if (cambio === 'acabado') {
          // La madera nueva barre el mueble de izquierda a derecha con un filo de luz.
          if (abajo) barrer(abajo, barridoInf.current);
        } else if (cambio === 'griferia') {
          if (arriba) fundir(arriba, 420);
        } else if (cambio === 'estado') {
          if (abajo) fundir(abajo, 340);
        }
      })
      .catch(() => onError('No pudimos cargar esta combinación. Intenta de nuevo.'));
    return () => {
      cancelado = true;
    };
  }, [sel, estado, reducirMovimiento, onPintado, onListo, onError]);

  // Mueble solo: listo de antemano para que la vista "Mueble" entre sin espera.
  useEffect(() => {
    if (!listo) return;
    const clave = `${sel.mueble}|${sel.acabado}|${estado}`;
    if (soloMostrado.current === clave) return;
    let cancelado = false;
    const lado = ladoPreferidoC();
    componerC(sel, 'solo', estado, lado)
      .then((lienzo) => {
        const s = lienzoSolo.current, cont = piezaSolo.current;
        if (cancelado || !s || !cont) return;
        const anterior = soloMostrado.current;
        const animar = !reducirMovimiento && anterior !== null && vista === 'mueble';
        const f = animar ? fantasma(cont, s) : null;
        s.width = lado;
        s.height = lado;
        s.getContext('2d')?.drawImage(lienzo, 0, 0);
        soloMostrado.current = clave;
        if (f) {
          if (anterior?.split('|')[1] !== sel.acabado) barrer(f, barridoSolo.current);
          else fundir(f, 340);
        }
      })
      .catch(() => undefined);
    return () => {
      cancelado = true;
    };
  }, [sel, estado, listo, vista, reducirMovimiento]);

  // Primera visita: las piezas llegan separadas y se ensamblan (enseña que se mezclan).
  useEffect(() => {
    if (!listo) return;
    const id = window.setTimeout(() => setPiezas(false), reducirMovimiento ? 0 : 1100);
    return () => window.clearTimeout(id);
  }, [listo, reducirMovimiento]);

  /* ---------- Gestos: deslizar cambia el lavamanos, tocar el mueble lo abre ---------- */

  const zonaDe = (y: number): 'lavamanos' | 'mueble' => {
    if (vista !== 'conjunto') return vista;
    const r = piezaSup.current?.getBoundingClientRect();
    return r && y < r.bottom ? 'lavamanos' : 'mueble';
  };

  const sobreProducto = (x: number) => {
    const r = cajaProducto.current?.getBoundingClientRect();
    if (!r) return false;
    const caja = vista === 'mueble' ? rs.caja : rc.caja;
    const izq = r.left + (aPantalla(caja[0], enc, 'x') / 100) * r.width;
    const der = r.left + (aPantalla(caja[2], enc, 'x') / 100) * r.width;
    return x >= izq && x <= der;
  };

  const alSoltar = (e: React.PointerEvent<HTMLDivElement>) => {
    const g = gesto.current;
    gesto.current = null;
    if (!g || previa) return;
    const dx = e.clientX - g.x, dy = e.clientY - g.y;
    if (Math.abs(dx) >= 40 && Math.abs(dx) > Math.abs(dy)) {
      if (g.zona === 'lavamanos') onLavamanos(dx < 0 ? 1 : -1);
      else onPrevia(true);
      return;
    }
    if (Math.abs(dx) < 10 && Math.abs(dy) < 10 && e.timeStamp - g.t < 450 && g.zona === 'mueble' && sobreProducto(e.clientX)) onAlternarEstado();
  };

  /* ---------- Posiciones en pantalla (fuera del producto escalado) ---------- */

  const cajaX = vista === 'mueble' ? rs.caja : rc.caja;
  const xIzq = aPantalla(cajaX[0], enc, 'x');
  const xDer = aPantalla(cajaX[2], enc, 'x');
  const yLav = aPantalla(((rc.grifo?.[1] ?? rc.caja[1]) + rc.costura) / 2, enc, 'y');
  const yMue = vista === 'mueble' ? aPantalla((rs.caja[1] + rs.caja[3]) / 2, enc, 'y') : aPantalla((rc.costura + rc.caja[3]) / 2, enc, 'y');
  const yCostura = aPantalla(rc.costura, enc, 'y');

  const flecha = (lado: 'izq' | 'der', pieza: 'lavamanos' | 'mueble') => {
    const etiqueta = pieza === 'lavamanos' ? `Lavamanos ${lado === 'izq' ? 'anterior' : 'siguiente'}` : 'Ver otro mueble';
    return (
      <button
        type="button"
        aria-label={etiqueta}
        title={etiqueta}
        onClick={() => (pieza === 'lavamanos' ? onLavamanos(lado === 'izq' ? -1 : 1) : onPrevia(true))}
        className={`pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full text-[#324354] transition-transform duration-150 hover:scale-110 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#324354] ${VIDRIO}`}
      >
        {lado === 'izq' ? <ChevronLeft className="h-5 w-5" aria-hidden /> : <ChevronRight className="h-5 w-5" aria-hidden />}
      </button>
    );
  };

  const fondo = oscuro
    ? 'bg-[radial-gradient(ellipse_at_50%_35%,#2a2f36_0%,#121418_70%)]'
    : 'bg-[radial-gradient(ellipse_at_50%_30%,#f7f3ed_0%,#e9e1d6_75%)]';
  const sombra = oscuro ? 'drop-shadow(0 24px 34px rgba(0,0,0,0.55))' : 'drop-shadow(0 26px 30px rgba(60,45,30,0.22))';
  const transicion = reducirMovimiento ? 'none' : 'transform 700ms cubic-bezier(.2,.8,.2,1), opacity 450ms ease';

  const verSup = vista !== 'mueble';
  const verInf = vista === 'conjunto';
  const abierto = estado === 'abierto';
  const textoEstado = abierto ? 'Cerrar' : 'Abrir';

  return (
    <div
      ref={raiz}
      tabIndex={0}
      aria-label="Escenario: desliza o usa las flechas del teclado para cambiar el lavamanos"
      className={`relative h-full w-full touch-pan-y select-none overflow-hidden rounded-3xl transition-colors duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#324354] ${fondo}`}
      onKeyDown={(e) => {
        if (previa) return;
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
          e.preventDefault();
          onLavamanos(e.key === 'ArrowLeft' ? -1 : 1);
        }
      }}
      onPointerDown={(e) => {
        if ((e.target as HTMLElement).closest('button, a')) return;
        gesto.current = { x: e.clientX, y: e.clientY, t: e.timeStamp, zona: zonaDe(e.clientY) };
      }}
      onPointerUp={alSoltar}
      onPointerCancel={() => {
        gesto.current = null;
      }}
    >
      {/* Producto */}
      <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${previa ? 'opacity-0' : 'opacity-100'}`}>
        <div
          role="img"
          aria-label={`Lavamanos ${n.lavamanos.nombre} con mueble ${n.mueble.nombre} en acabado ${n.acabado.nombre}, grifería ${n.griferia.nombre}${abierto ? ', abierto' : ''}`}
          className="relative aspect-square h-[86%] max-w-[94%]"
          style={{ filter: sombra, transform: transformEncuadre(enc), transition: transicion }}
        >
          <div
            ref={piezaSup}
            className="absolute inset-x-0 top-0"
            style={{
              height: `${costura * 100}%`,
              transform: !verSup ? 'translateY(-38%)' : piezas ? 'translateY(-9%)' : 'none',
              opacity: verSup ? 1 : 0,
              transition: transicion,
            }}
          >
            <canvas ref={lienzoSup} className="absolute inset-0 h-full w-full" />
          </div>
          <div
            ref={piezaInf}
            className="absolute inset-x-0 bottom-0 overflow-hidden"
            style={{
              height: `${(1 - costura) * 100}%`,
              transform: vista === 'lavamanos' ? 'translateY(14%)' : piezas ? 'translateY(6%)' : 'none',
              opacity: verInf ? 1 : 0,
              transition: transicion,
            }}
          >
            <canvas ref={lienzoInf} className="absolute inset-0 h-full w-full" />
            <div
              ref={barridoInf}
              aria-hidden
              className="pointer-events-none absolute inset-y-0 w-10 -translate-x-1/2 opacity-0"
              style={{ left: '0%', background: 'linear-gradient(90deg, transparent, rgba(255,246,228,0.85), transparent)' }}
            />
          </div>
          <div ref={piezaSolo} className="pointer-events-none absolute inset-0 overflow-hidden" style={{ opacity: vista === 'mueble' ? 1 : 0, transition: transicion }}>
            <canvas ref={lienzoSolo} className="absolute inset-0 h-full w-full" />
            <div
              ref={barridoSolo}
              aria-hidden
              className="pointer-events-none absolute w-10 -translate-x-1/2 opacity-0"
              style={{ left: '0%', top: `${rs.caja[1] * 100}%`, bottom: `${(1 - rs.caja[3]) * 100}%`, background: 'linear-gradient(90deg, transparent, rgba(255,246,228,0.85), transparent)' }}
            />
          </div>
        </div>
      </div>

      {/* Flechas y etiquetas: misma caja que el producto, sin escalar */}
      {listo && !previa && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div ref={cajaProducto} className="relative aspect-square h-[86%] max-w-[94%]">
            {vista !== 'mueble' && (
              <>
                <div className="absolute -translate-y-1/2" style={{ left: `max(-6%, calc(${xIzq}% - 56px))`, top: `${yLav}%` }}>{flecha('izq', 'lavamanos')}</div>
                <div className="absolute -translate-y-1/2" style={{ left: `min(calc(106% - 44px), calc(${xDer}% + 12px))`, top: `${yLav}%` }}>{flecha('der', 'lavamanos')}</div>
              </>
            )}
            {vista !== 'lavamanos' && CURVA && (
              <>
                <div className="absolute -translate-y-1/2" style={{ left: `max(-6%, calc(${xIzq}% - 56px))`, top: `${yMue}%` }}>{flecha('izq', 'mueble')}</div>
                <div className="absolute -translate-y-1/2" style={{ left: `min(calc(106% - 44px), calc(${xDer}% + 12px))`, top: `${yMue}%` }}>{flecha('der', 'mueble')}</div>
              </>
            )}
            <span
              className={`absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold text-[#324354] transition-opacity duration-300 ${VIDRIO} ${piezas ? 'opacity-100' : 'opacity-0'}`}
              style={{ top: `calc(${yCostura}% - 52px)` }}
            >
              Lavamanos · {n.lavamanos.nombre}
            </span>
            <span
              className={`absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold text-[#324354] transition-opacity duration-300 ${VIDRIO} ${piezas ? 'opacity-100' : 'opacity-0'}`}
              style={{ top: `calc(${yCostura}% + 22px)` }}
            >
              Mueble · {n.mueble.nombre}
            </span>
          </div>
        </div>
      )}

      {!listo && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 bg-[#efe9e1]">
          <Layers className="h-9 w-9 text-[#58696b] motion-safe:animate-pulse" aria-hidden />
          <p className="text-sm font-medium text-[#324354]">Preparando tu combinación…</p>
        </div>
      )}

      {/* Barra superior: que ver y abrir */}
      {!previa && (
        <>
          <div role="radiogroup" aria-label="Qué ver" className={`absolute left-3 top-3 z-10 flex rounded-full p-1 ${VIDRIO}`}>
            {VISTAS.map((v) => {
              const activa = v.id === vista;
              return (
                <button
                  key={v.id}
                  type="button"
                  role="radio"
                  aria-checked={activa}
                  onClick={() => onVista(v.id)}
                  className={`h-10 rounded-full px-3 text-xs font-semibold transition-colors duration-150 sm:px-3.5 ${activa ? 'bg-[#324354] text-white' : 'text-[#324354] hover:bg-black/5'}`}
                >
                  {v.nombre}
                </button>
              );
            })}
          </div>
          {vista !== 'lavamanos' && (
            <button
              type="button"
              onClick={onAlternarEstado}
              aria-pressed={abierto}
              aria-label={`${textoEstado} puerta y cajones`}
              title={`${textoEstado} puerta y cajones`}
              className={`absolute right-3 top-3 z-10 flex h-12 items-center gap-1.5 rounded-full px-3.5 text-xs font-semibold transition-colors duration-150 ${abierto ? 'bg-[#324354] text-white shadow-[0_8px_30px_rgba(50,67,84,0.25)]' : `text-[#324354] ${VIDRIO}`}`}
            >
              {abierto ? <DoorClosed className="h-4 w-4" aria-hidden /> : <DoorOpen className="h-4 w-4" aria-hidden />}
              <span className="hidden sm:inline">{textoEstado}</span>
            </button>
          )}
        </>
      )}

      {/* Barra inferior: pista de primera visita (o el nombre), sorpresa y fondo */}
      {!previa && (
        <div className="absolute inset-x-3 bottom-3 z-10 flex items-end justify-between gap-3">
          {listo && !interactuo ? (
            <p className={`pointer-events-none min-w-0 truncate rounded-full px-3.5 py-2.5 text-[11px] font-medium text-[#324354] sm:text-xs ${VIDRIO}`}>
              <span className="sm:hidden">Desliza el lavamanos · toca el mueble</span>
              <span className="hidden sm:inline">Desliza el lavamanos para cambiarlo · toca el mueble para abrirlo</span>
            </p>
          ) : (
            <p className={`hidden min-w-0 truncate rounded-full px-3.5 py-2.5 text-xs font-medium text-[#324354] sm:block ${VIDRIO}`}>
              {vista === 'mueble' ? (
                <>
                  Mueble <span className="font-semibold">{n.mueble.nombre}</span> · {n.acabado.nombre} · {n.mueble.medida}
                </>
              ) : (
                <>
                  {vista === 'lavamanos' ? 'Lavamanos ' : ''}
                  <span className="font-semibold">{n.lavamanos.nombre}</span>
                  {vista === 'lavamanos' ? ` · ${n.lavamanos.medida}` : ` + ${n.mueble.nombre} · ${n.acabado.nombre}`} · Grifería en {n.griferia.nombre.toLowerCase()}
                  {n.griferia.simulada && <span className="text-[#58696b]"> (vista previa)</span>}
                </>
              )}
            </p>
          )}
          <div className={`ml-auto flex shrink-0 rounded-full p-1 ${VIDRIO}`}>
            <button
              type="button"
              onClick={onSorprender}
              aria-label="Sorpréndeme"
              title="Sorpréndeme: una combinación al azar"
              className="flex h-10 min-w-10 items-center justify-center gap-1.5 rounded-full px-2.5 text-xs font-semibold text-[#324354] hover:bg-black/5 sm:px-3"
            >
              <Dices className="h-4 w-4" aria-hidden />
              <span className="hidden sm:inline">Sorpréndeme</span>
            </button>
            <button
              type="button"
              onClick={onOscuro}
              aria-label={oscuro ? 'Fondo claro' : 'Fondo oscuro'}
              title={oscuro ? 'Fondo claro' : 'Fondo oscuro'}
              className="flex h-10 w-10 items-center justify-center rounded-full text-[#324354] hover:bg-black/5"
            >
              {oscuro ? <Sun className="h-4 w-4" aria-hidden /> : <Moon className="h-4 w-4" aria-hidden />}
            </button>
          </div>
        </div>
      )}

      {/* Mueble que aun no esta en el estudio: su foto y la invitacion a cotizarlo */}
      {CURVA?.referencia && (
        <div aria-hidden={!previa} className={`absolute inset-0 z-20 transition-opacity duration-500 ${previa ? 'opacity-100' : 'pointer-events-none opacity-0'}`}>
          <div className="absolute inset-x-[8%] bottom-[132px] top-[4%] sm:bottom-[112px]" style={{ filter: sombra }}>
            <Image src={CURVA.referencia.imagen} alt={`Mueble ${CURVA.nombre} con lavamanos Siena`} fill sizes="(min-width: 1024px) 50vw, 90vw" className="object-contain" />
          </div>
          <button
            type="button"
            onClick={() => onPrevia(false)}
            aria-label="Volver al estudio"
            title="Volver al estudio"
            tabIndex={previa ? 0 : -1}
            className={`absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full text-[#324354] ${VIDRIO}`}
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
          <div className={`absolute inset-x-3 bottom-3 mx-auto flex max-w-xl flex-col gap-2 rounded-2xl px-4 py-3 text-[#324354] sm:flex-row sm:items-center sm:gap-4 ${VIDRIO}`}>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-2 whitespace-nowrap text-sm font-semibold">
                {CURVA.nombre}
                <span className="rounded-full bg-[#324354] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">Pronto</span>
              </p>
              <p className="mt-0.5 hidden text-xs text-[#58696b] sm:block">
                Muy pronto lo mezclas aquí con los 4 lavamanos, los 5 acabados y la grifería. En la foto: con lavamanos Siena.
              </p>
            </div>
            <div className="flex gap-2">
              <button type="button" tabIndex={previa ? 0 : -1} onClick={onCotizarPrevia} className="h-11 flex-1 rounded-full bg-[#324354] px-4 text-xs font-semibold text-white active:scale-[0.98] sm:flex-none">
                Cotizarlo
              </button>
              <button type="button" tabIndex={previa ? 0 : -1} onClick={() => onPrevia(false)} className="h-11 flex-1 whitespace-nowrap rounded-full px-3 text-xs font-semibold hover:bg-black/5 sm:flex-none">
                Volver al {n.mueble.nombre}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
