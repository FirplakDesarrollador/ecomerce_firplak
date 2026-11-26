'use client';

import React, { useEffect, useRef, useState } from 'react';
import { DoorClosed, DoorOpen, Droplets, Layers } from 'lucide-react';
import { COMPRAS_D, type IdCompraD, type IdLavamanosD, type IdMuebleD, type SeleccionD } from './catalogoOpcionD';
import { ALTO_D, ANCHO_D, cuerpoPintado, tapaPintada } from './componerD';
import { cotaCajon, crearMotorD, type MotorD, type MovimientoD } from './animacionD';
import { ChorroD, FONDO_POCETA_D, LupaAireador } from './AguaD';
import { formatoPesos, grifoReal, nombresD, precioD } from './opcionDLogica';
import { CAJONES_D, SALIDA_GRIFO_D } from './rendersOpcionD';

// Panel flotante claro del sistema de diseño (glass-panel), igual que A, B y C.
export const VIDRIO_D = 'border border-white/70 bg-white/80 shadow-[0_8px_30px_rgba(50,67,84,0.14)] backdrop-blur-[20px]';

const RELACION = ANCHO_D / ALTO_D;
const pct = (v: number, total: number) => `${(v / total) * 100}%`;

/** Copia congelada de un lienzo, encima del actual, para animar su salida. */
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
const fundir = (el: HTMLElement, ms: number) => quitarAlTerminar(el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: ms, easing: 'ease-out', fill: 'forwards' }), el);

/** El acabado nuevo barre el mueble de izquierda a derecha con un filo de luz. */
function barrer(f: HTMLElement, luz: HTMLElement | null) {
  const opciones = { duration: 820, easing: 'cubic-bezier(.6,0,.3,1)' };
  quitarAlTerminar(f.animate([{ clipPath: 'inset(0 0 0 0%)' }, { clipPath: 'inset(0 0 0 100%)' }], { ...opciones, fill: 'forwards' }), f);
  luz?.animate([{ left: '0%', opacity: 0 }, { left: '8%', opacity: 1, offset: 0.1 }, { left: '92%', opacity: 1, offset: 0.9 }, { left: '100%', opacity: 0 }], opciones);
}

function copiar(destino: HTMLCanvasElement, origen: HTMLCanvasElement) {
  const ctx = destino.getContext('2d');
  if (!ctx) return;
  ctx.clearRect(0, 0, destino.width, destino.height);
  ctx.drawImage(origen, 0, 0);
}

/** Región del render que se encuadra según lo que se compra. */
function regionCompra(compra: IdCompraD, cajaGrifo: [number, number, number, number], lavamanos: IdLavamanosD, salidaX: number): [number, number, number, number] | null {
  if (compra === 'griferia') return [Math.min(cajaGrifo[0], salidaX - 60), cajaGrifo[1] - 30, cajaGrifo[2] + 40, FONDO_POCETA_D[lavamanos] + 40];
  if (compra === 'lavamanos') return [330, 30, 1590, 640];
  if (compra === 'mueble') return [0, 290, ANCHO_D, ALTO_D];
  return null;
}

export interface EscenarioDProps {
  sel: SeleccionD;
  abierto: boolean;
  agua: boolean;
  avisoCierre: boolean;
  interactuo: boolean;
  reducirMovimiento: boolean;
  onAlternarAbierto: () => void;
  onAlternarAgua: () => void;
  onCompra: (c: IdCompraD) => void;
  onListo: () => void;
  onError: (mensaje: string) => void;
}

/**
 * Escenario de la Opción D: el render iso partido en cuerpo (mueble, animado) y tapa (lavamanos y
 * grifería). Lo que se compra decide qué se resalta y cómo se encuadra.
 */
export default function EscenarioD({
  sel,
  abierto,
  agua,
  avisoCierre,
  interactuo,
  reducirMovimiento,
  onAlternarAbierto,
  onAlternarAgua,
  onCompra,
  onListo,
  onError,
}: EscenarioDProps) {
  const [tam, setTam] = useState({ w: 0, h: 0 });
  const [cuerpoListo, setCuerpoListo] = useState(false);
  const [tapaLista, setTapaLista] = useState(false);
  const [cajaGrifo, setCajaGrifo] = useState<[number, number, number, number]>([940, 20, 1190, 310]);

  const raiz = useRef<HTMLDivElement>(null);
  const caja = useRef<HTMLDivElement>(null);
  const capaCuerpo = useRef<HTMLDivElement>(null);
  const capaTapa = useRef<HTMLDivElement>(null);
  const capaGrifo = useRef<HTMLDivElement>(null);
  const lienzoCuerpo = useRef<HTMLCanvasElement>(null);
  const lienzoTapa = useRef<HTMLCanvasElement>(null);
  const lienzoGrifo = useRef<HTMLCanvasElement>(null);
  const barrido = useRef<HTMLDivElement>(null);
  const cotaGrupo = useRef<SVGGElement>(null);
  const cotaLinea = useRef<SVGLineElement>(null);
  const cotaMarcaA = useRef<SVGLineElement>(null);
  const cotaMarcaB = useRef<SVGLineElement>(null);
  const cotaEtiqueta = useRef<HTMLDivElement>(null);
  const cotaNumero = useRef<HTMLSpanElement>(null);
  const motor = useRef<MotorD | null>(null);
  const mostradoCuerpo = useRef<{ mueble: IdMuebleD; acabado: string; pieza: string } | null>(null);
  const mostradoTapa = useRef<string | null>(null);
  const objetivo = useRef(abierto);
  const primeraOrden = useRef(true);

  const n = nombresD(sel);
  const pieza: IdLavamanosD | 'solo' = sel.compra === 'mueble' ? 'solo' : sel.lavamanos;
  const listo = cuerpoListo && tapaLista;
  const salida = SALIDA_GRIFO_D[sel.lavamanos][sel.grifo] as [number, number];
  const fondo = FONDO_POCETA_D[sel.lavamanos];
  const puedeAbrir = sel.compra === 'conjunto' || sel.compra === 'mueble';
  const puedeAgua = sel.compra === 'conjunto' || sel.compra === 'griferia';
  const aguaVisible = agua && puedeAgua;

  // Tamaño del escenario: el producto se ajusta dejando libres las barras de arriba y abajo.
  useEffect(() => {
    const el = raiz.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setTam({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Motor del cuerpo y cota del cajón (se actualizan cuadro a cuadro sin pasar por React).
  useEffect(() => {
    const lienzo = lienzoCuerpo.current;
    if (!lienzo) return;
    const alPintar = (m: MovimientoD, mueble: IdMuebleD) => {
      const g = cotaGrupo.current, et = cotaEtiqueta.current, num = cotaNumero.current;
      const linea = cotaLinea.current, a = cotaMarcaA.current, b = cotaMarcaB.current;
      if (!g || !et || !num || !linea || !a || !b) return;
      const visible = m.cajones > 0.02;
      g.style.opacity = visible ? '1' : '0';
      et.style.opacity = visible ? '1' : '0';
      if (!visible) return;
      const c = cotaCajon(mueble, m.cajones);
      const [nx, ny] = c.normal;
      linea.setAttribute('x1', `${c.desde[0]}`);
      linea.setAttribute('y1', `${c.desde[1]}`);
      linea.setAttribute('x2', `${c.hasta[0]}`);
      linea.setAttribute('y2', `${c.hasta[1]}`);
      for (const [marca, p] of [[a, c.desde], [b, c.hasta]] as const) {
        marca.setAttribute('x1', `${p[0] - nx * 12}`);
        marca.setAttribute('y1', `${p[1] - ny * 12}`);
        marca.setAttribute('x2', `${p[0] + nx * 12}`);
        marca.setAttribute('y2', `${p[1] + ny * 12}`);
      }
      const mx = (c.desde[0] + c.hasta[0]) / 2 + nx * 62, my = (c.desde[1] + c.hasta[1]) / 2 + ny * 62;
      et.style.left = pct(mx, ANCHO_D);
      et.style.top = pct(my, ALTO_D);
      num.textContent = `${c.centimetros} cm`;
    };
    const m = crearMotorD(lienzo, alPintar);
    motor.current = m;
    return () => m.destruir();
  }, []);

  // Cuerpo: pinta el mueble con su acabado (con el lavamanos o solo) en el estado en que esté.
  useEffect(() => {
    const clave = `${sel.mueble}|${pieza}|${sel.acabado}`;
    const m = motor.current;
    if (!m || m.claveActual() === clave) return;
    let cancelado = false;
    const conAbierto = objetivo.current || m.movimiento().cajones > 0 || m.movimiento().puerta > 0;
    Promise.all([
      cuerpoPintado(sel.mueble, pieza, 'cerrado', sel.acabado),
      conAbierto ? cuerpoPintado(sel.mueble, pieza, 'abierto', sel.acabado) : Promise.resolve(null),
    ])
      .then(([cerrado, abiertoL]) => {
        const capa = capaCuerpo.current, lienzo = lienzoCuerpo.current, motorA = motor.current;
        if (cancelado || !capa || !lienzo || !motorA) return;
        const antes = mostradoCuerpo.current;
        const f = antes && !reducirMovimiento ? fantasma(capa, lienzo) : null;
        motorA.ponerCuerpos({ mueble: sel.mueble, clave, cerrado, abierto: abiertoL });
        mostradoCuerpo.current = { mueble: sel.mueble, acabado: sel.acabado, pieza };
        if (f && antes) {
          if (antes.acabado !== sel.acabado && antes.mueble === sel.mueble && antes.pieza === pieza) barrer(f, barrido.current);
          else fundir(f, antes.mueble !== sel.mueble ? 460 : 320);
        }
        setCuerpoListo(true);
        // El abierto llega después, listo para cuando lo pidan.
        if (!abiertoL) {
          cuerpoPintado(sel.mueble, pieza, 'abierto', sel.acabado)
            .then((a) => motor.current?.ponerAbierto(clave, a))
            .catch(() => undefined);
        }
      })
      .catch(() => {
        if (!cancelado) onError('No pudimos cargar esta combinación. Intenta de nuevo.');
      });
    return () => {
      cancelado = true;
    };
  }, [sel.mueble, sel.acabado, pieza, reducirMovimiento, onError]);

  // Abrir o cerrar: espera el render abierto si aún no ha llegado.
  useEffect(() => {
    objetivo.current = abierto;
    if (primeraOrden.current) {
      primeraOrden.current = false;
      if (!abierto) return;
    }
    const m = motor.current;
    const clave = m?.claveActual();
    if (!m || !clave) return;
    let cancelado = false;
    const [mueble, piezaA, acabado] = clave.split('|') as [IdMuebleD, IdLavamanosD | 'solo', SeleccionD['acabado']];
    cuerpoPintado(mueble, piezaA, 'abierto', acabado)
      .then((a) => {
        if (cancelado) return;
        m.ponerAbierto(clave, a);
        m.ordenar(abierto, reducirMovimiento);
      })
      .catch(() => undefined);
    return () => {
      cancelado = true;
    };
  }, [abierto, reducirMovimiento]);

  // Tapa: lavamanos con su color y la grifería con su acabado.
  useEffect(() => {
    const clave = `${sel.lavamanos}|${sel.grifo}|${sel.color}|${sel.acabadoGrifo}`;
    if (mostradoTapa.current === clave) return;
    let cancelado = false;
    tapaPintada(sel.lavamanos, sel.grifo, sel.color, sel.acabadoGrifo)
      .then((t) => {
        const capa = capaTapa.current, cg = capaGrifo.current, lt = lienzoTapa.current, lg = lienzoGrifo.current;
        if (cancelado || !capa || !cg || !lt || !lg) return;
        const antes = mostradoTapa.current;
        const animar = antes !== null && !reducirMovimiento;
        const otroLavamanos = antes !== null && antes.split('|')[0] !== sel.lavamanos;
        const f = animar ? fantasma(capa, lt) : null;
        const fg = animar ? fantasma(cg, lg) : null;
        copiar(lt, t.tapa);
        copiar(lg, t.grifo);
        mostradoTapa.current = clave;
        setCajaGrifo(t.cajaGrifo);
        setTapaLista(true);
        if (fg) fundir(fg, 300);
        if (!f) return;
        if (otroLavamanos) {
          // El lavamanos anterior sube y se va; el nuevo baja y asienta sobre el mueble.
          quitarAlTerminar(f.animate([{ transform: 'translateY(0)', opacity: 1 }, { transform: 'translateY(-14%)', opacity: 0 }], { duration: 300, easing: 'ease-in', fill: 'forwards' }), f);
          lt.animate(
            [{ transform: 'translateY(-22%)', opacity: 0 }, { transform: 'translateY(1.2%)', opacity: 1, offset: 0.72 }, { transform: 'translateY(0)', opacity: 1 }],
            { duration: 620, delay: 140, easing: 'cubic-bezier(.2,.8,.3,1)', fill: 'backwards' }
          );
        } else fundir(f, 380);
      })
      .catch(() => {
        if (!cancelado) onError('No pudimos cargar esta combinación. Intenta de nuevo.');
      });
    return () => {
      cancelado = true;
    };
  }, [sel.lavamanos, sel.grifo, sel.color, sel.acabadoGrifo, reducirMovimiento, onError]);

  useEffect(() => {
    if (listo) onListo();
  }, [listo, onListo]);

  /* ---------- Encuadre ---------- */

  const anchoCaja = Math.max(0, Math.min(tam.w * 0.94, (tam.h - 150) * RELACION));
  const altoCaja = anchoCaja / RELACION;
  const region = regionCompra(sel.compra, cajaGrifo, sel.lavamanos, salida[0]);
  let escala = 1, tx = 0, ty = 0;
  if (region && anchoCaja > 0) {
    const k = anchoCaja / ANCHO_D;
    const rw = (region[2] - region[0]) * k, rh = (region[3] - region[1]) * k;
    const maximo = sel.compra === 'griferia' ? 1.9 : sel.compra === 'lavamanos' ? 1.45 : 1.12;
    escala = Math.max(1, Math.min(maximo, (tam.w * 0.84) / rw, (tam.h - 150) / rh));
    const cx = ((region[0] + region[2]) / 2 - ANCHO_D / 2) * k, cy = ((region[1] + region[3]) / 2 - ALTO_D / 2) * k;
    tx = -cx * escala;
    ty = -cy * escala + (sel.compra === 'griferia' ? 0 : 4);
  } else {
    ty = -6;
  }
  const transicion = reducirMovimiento ? 'none' : 'transform 760ms cubic-bezier(.2,.8,.2,1), opacity 480ms ease, filter 480ms ease';

  const atenuado = sel.compra === 'lavamanos' || sel.compra === 'griferia';
  const estiloCuerpo: React.CSSProperties = {
    opacity: atenuado ? (sel.compra === 'griferia' ? 0.1 : 0.16) : 1,
    filter: atenuado ? 'grayscale(1)' : 'none',
    transition: transicion,
  };
  const estiloTapa: React.CSSProperties = {
    opacity: sel.compra === 'mueble' ? 0 : sel.compra === 'griferia' ? 0.18 : 1,
    transform: sel.compra === 'mueble' ? 'translateY(-9%)' : 'none',
    filter: sel.compra === 'griferia' ? 'grayscale(1)' : 'none',
    transition: transicion,
  };
  // Lavamanos solo: la grifería queda como un fantasma (no viene incluida).
  const estiloGrifo: React.CSSProperties = {
    opacity: sel.compra === 'griferia' ? 1 : sel.compra === 'lavamanos' ? 0.96 : 0,
    filter: sel.compra === 'lavamanos' ? 'grayscale(1) contrast(0.22) brightness(1.85)' : 'none',
    transition: transicion,
  };

  /* ---------- Toques: la grifería abre el agua, el mueble se abre ---------- */

  const alTocar = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button, a')) return;
    const r = caja.current?.getBoundingClientRect();
    if (!r || !listo) return;
    const x = ((e.clientX - r.left) / r.width) * ANCHO_D, y = ((e.clientY - r.top) / r.height) * ALTO_D;
    const m = 40;
    if (puedeAgua && x > cajaGrifo[0] - m && x < cajaGrifo[2] + m && y > cajaGrifo[1] - m && y < cajaGrifo[3] + m) {
      onAlternarAgua();
      return;
    }
    if (!puedeAbrir || x < 0 || y < 0 || x >= ANCHO_D || y >= ALTO_D) return;
    const alfa = lienzoCuerpo.current?.getContext('2d')?.getImageData(Math.floor(x), Math.floor(y), 1, 1).data[3] ?? 0;
    if (alfa > 24) onAlternarAbierto();
  };

  const precio = precioD(sel.compra);
  const compra = n.compra;
  const fondoEscenario = 'bg-[radial-gradient(ellipse_at_50%_32%,#f8f5f0_0%,#ece6dd_62%,#e3dbd0_100%)]';
  const sombra = 'drop-shadow(0 28px 30px rgba(60,45,30,0.2))';
  const frenteArriba = CAJONES_D[sel.mueble][0].frente[1];

  return (
    <div
      ref={raiz}
      className={`relative h-full w-full select-none overflow-hidden rounded-3xl ${fondoEscenario}`}
      onClick={alTocar}
      style={{ cursor: listo ? 'pointer' : 'default' }}
    >
      {/* Piso: sombra suave bajo el mueble */}
      <div aria-hidden className="pointer-events-none absolute inset-x-[12%] bottom-[9%] h-[9%] rounded-[50%] bg-[radial-gradient(closest-side,rgba(60,45,30,0.16),transparent)]" />

      {/* Producto */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          ref={caja}
          role="img"
          aria-label={`Mueble ${n.mueble.nombre} en ${n.acabado.nombre} con lavamanos ${n.lavamanos.nombre} ${n.color.nombre.toLowerCase()} y grifería ${n.grifo.nombre.toLowerCase()} en ${n.acabadoGrifo.nombre.toLowerCase()}${abierto ? ', abierto' : ''}`}
          className="relative"
          style={{ width: anchoCaja, height: altoCaja, transform: `translate(${tx}px, ${ty}px) scale(${escala})`, transition: transicion }}
        >
          <div ref={capaCuerpo} className="absolute inset-0" style={{ ...estiloCuerpo, filter: `${estiloCuerpo.filter === 'none' ? '' : 'grayscale(1) '}${sombra}` }}>
            <canvas ref={lienzoCuerpo} width={ANCHO_D} height={ALTO_D} className="absolute inset-0 h-full w-full" />
            <div
              ref={barrido}
              aria-hidden
              className="pointer-events-none absolute bottom-[4%] top-[22%] w-12 -translate-x-1/2 opacity-0"
              style={{ left: '0%', background: 'linear-gradient(90deg, transparent, rgba(255,247,232,0.9), transparent)' }}
            />
          </div>
          <div ref={capaTapa} className="absolute inset-0" style={estiloTapa}>
            <canvas ref={lienzoTapa} width={ANCHO_D} height={ALTO_D} className="absolute inset-0 h-full w-full" />
          </div>
          <div ref={capaGrifo} className="pointer-events-none absolute inset-0" style={estiloGrifo}>
            <canvas ref={lienzoGrifo} width={ANCHO_D} height={ALTO_D} className="absolute inset-0 h-full w-full" />
          </div>

          {/* Agua y cota, en coordenadas del render */}
          <svg viewBox={`0 0 ${ANCHO_D} ${ALTO_D}`} className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden>
            <ChorroD salida={salida} fondo={fondo} grifo={sel.grifo} abierta={aguaVisible && listo} quieto={reducirMovimiento} />
            <g style={{ opacity: puedeAbrir ? 1 : 0, transition: 'opacity 300ms' }}>
              <g ref={cotaGrupo} style={{ opacity: 0, transition: 'opacity 200ms' }} stroke="#324354" strokeLinecap="round">
                <line ref={cotaLinea} strokeWidth="2.6" opacity="0.7" />
                <line ref={cotaMarcaA} strokeWidth="3" />
                <line ref={cotaMarcaB} strokeWidth="3" />
              </g>
            </g>
          </svg>

          {/* Etiquetas que acompañan al movimiento */}
          <div
            ref={cotaEtiqueta}
            aria-hidden
            className={`pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-semibold text-[#324354] transition-opacity duration-200 sm:text-[11px] ${VIDRIO_D}`}
            style={{ opacity: 0, left: '60%', top: '96%', visibility: puedeAbrir ? 'visible' : 'hidden' }}
          >
            <span ref={cotaNumero} className="tabular-nums">0 cm</span>
            <span className="font-medium text-[#58696b]"> · extensión total</span>
          </div>
          <div
            aria-hidden
            className={`pointer-events-none absolute z-10 -translate-y-1/2 whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-semibold text-[#324354] transition-[opacity,transform] duration-500 sm:text-[11px] ${VIDRIO_D}`}
            style={{
              left: pct(frenteArriba[0] + 34, ANCHO_D),
              top: pct(frenteArriba[1] + 60, ALTO_D),
              opacity: avisoCierre && puedeAbrir ? 1 : 0,
              transform: `translateY(-50%) translateX(${avisoCierre ? 0 : -8}px)`,
            }}
          >
            Cierre suave
          </div>
          <div
            aria-hidden
            className={`pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-full px-2 py-0.5 text-[9px] font-semibold text-[#58696b] transition-opacity duration-500 sm:text-[10px] ${VIDRIO_D}`}
            style={{ left: pct((cajaGrifo[0] + cajaGrifo[2]) / 2, ANCHO_D), top: pct(cajaGrifo[1] - 10, ALTO_D), opacity: sel.compra === 'lavamanos' ? 1 : 0 }}
          >
            Grifería no incluida
          </div>
          {/* Invitación a abrir el agua: un pulso en la salida del aireador */}
          {listo && !interactuo && puedeAgua && !agua && (
            <span
              aria-hidden
              className="pointer-events-none absolute h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#324354]/50 motion-safe:animate-ping"
              style={{ left: pct(salida[0], ANCHO_D), top: pct(salida[1] + 8, ALTO_D) }}
            />
          )}
        </div>
      </div>

      {!listo && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 bg-[#efe9e1]">
          <Layers className="h-9 w-9 text-[#58696b] motion-safe:animate-pulse" aria-hidden />
          <p className="text-sm font-medium text-[#324354]">Preparando tu combinación…</p>
        </div>
      )}

      {/* Precio de lo que se compra */}
      <div className={`absolute left-3 top-3 z-10 rounded-2xl px-3.5 py-2 text-[#324354] ${VIDRIO_D}`} aria-live="polite">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#58696b]">{compra.nombre}</p>
        <p className="text-base font-semibold tabular-nums leading-tight sm:text-lg">
          {formatoPesos(precio)}
          <span className="ml-1.5 text-[10px] font-medium normal-case tracking-normal text-[#58696b]">precio sugerido</span>
        </p>
      </div>

      {/* Acciones: abrir y agua */}
      <div className="absolute right-3 top-3 z-10 flex gap-2">
        {puedeAbrir && (
          <button
            type="button"
            onClick={onAlternarAbierto}
            aria-pressed={abierto}
            aria-label={abierto ? 'Cerrar puerta y cajones' : 'Abrir puerta y cajones'}
            title={abierto ? 'Cerrar (cierre suave)' : 'Abrir'}
            className={`flex h-11 items-center gap-1.5 rounded-full px-3.5 text-xs font-semibold transition-colors duration-150 ${abierto ? 'bg-[#324354] text-white shadow-[0_8px_30px_rgba(50,67,84,0.25)]' : `text-[#324354] ${VIDRIO_D}`}`}
          >
            {abierto ? <DoorClosed className="h-4 w-4" aria-hidden /> : <DoorOpen className="h-4 w-4" aria-hidden />}
            <span className="hidden sm:inline">{abierto ? 'Cerrar' : 'Abrir'}</span>
          </button>
        )}
        {puedeAgua && (
          <button
            type="button"
            onClick={onAlternarAgua}
            aria-pressed={agua}
            aria-label={agua ? 'Cerrar el agua' : 'Abrir el agua'}
            title={agua ? 'Cerrar el agua' : 'Abrir el agua: mira el aireador'}
            className={`flex h-11 items-center gap-1.5 rounded-full px-3.5 text-xs font-semibold transition-colors duration-150 ${agua ? 'bg-[#324354] text-white shadow-[0_8px_30px_rgba(50,67,84,0.25)]' : `text-[#324354] ${VIDRIO_D}`}`}
          >
            <Droplets className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">{agua ? 'Cerrar agua' : 'Agua'}</span>
          </button>
        )}
      </div>

      {/* Aireador: aparece con el agua */}
      <div
        aria-hidden={!aguaVisible}
        className={`pointer-events-none absolute left-3 top-[76px] z-10 flex items-center gap-3 transition-[opacity,transform] duration-500 sm:left-4 sm:top-[88px] ${aguaVisible && listo ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'}`}
      >
        <div className="h-[84px] w-[84px] shrink-0 overflow-hidden rounded-full shadow-[0_10px_30px_rgba(50,67,84,0.22)] sm:h-[124px] sm:w-[124px]">
          <LupaAireador acabado={sel.acabadoGrifo} quieto={reducirMovimiento} />
        </div>
        <div className={`hidden max-w-[190px] rounded-2xl px-3 py-2 sm:block ${VIDRIO_D}`}>
          <p className="text-xs font-semibold text-[#324354]">Aireador de aire inducido</p>
          <p className="mt-0.5 text-[11px] leading-snug text-[#58696b]">El agua arrastra aire por los costados: sale un chorro suave, espumoso y que salpica menos.</p>
          {!grifoReal(sel) && <p className="mt-1 text-[10px] text-[#58696b]">Acabado {n.acabadoGrifo.nombre.toLowerCase()} en vista previa.</p>}
        </div>
      </div>

      {/* Qué se compra */}
      <div className="absolute inset-x-3 bottom-3 z-10 flex flex-col items-center gap-2">
        {listo && !interactuo && sel.compra === 'conjunto' && !abierto && !avisoCierre && (
          <p className={`pointer-events-none max-w-full truncate rounded-full px-3.5 py-2 text-[11px] font-medium text-[#324354] sm:text-xs ${VIDRIO_D}`}>
            <span className="sm:hidden">Toca el mueble o la grifería</span>
            <span className="hidden sm:inline">Toca el mueble para abrirlo · toca la grifería para abrir el agua</span>
          </p>
        )}
        <div role="radiogroup" aria-label="Qué te llevas" className={`flex w-full max-w-[460px] rounded-full p-1 ${VIDRIO_D}`}>
          {COMPRAS_D.map((c) => {
            const activa = c.id === sel.compra;
            const corto = c.id === 'conjunto' ? 'Conjunto' : c.id === 'mueble' ? 'Mueble' : c.id === 'lavamanos' ? 'Lavamanos' : 'Grifería';
            return (
              <button
                key={c.id}
                type="button"
                role="radio"
                aria-checked={activa}
                aria-label={`${c.nombre}: ${formatoPesos(precioD(c.id))}, precio sugerido`}
                onClick={() => onCompra(c.id)}
                className={`h-10 min-w-0 flex-1 truncate rounded-full px-1.5 text-[11px] font-semibold transition-colors duration-150 sm:px-3 sm:text-xs ${activa ? 'bg-[#324354] text-white' : 'text-[#324354] hover:bg-black/5'}`}
              >
                {corto}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
