'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { type SeleccionD } from './catalogoOpcionD';
import { CAPAS_PILOTO_D, LAVAMANOS_CAPAS_D, MUEBLES_CAPAS_D } from './capasPilotoD';
import { useDeslizamientoD } from './useDeslizamientoD';

type Fila = 'lavamanos' | 'mueble';
const AMBIENTE = CAPAS_PILOTO_D.environment;
const MARCO = CAPAS_PILOTO_D.product_frame;
const MUEBLES = Object.entries(MUEBLES_CAPAS_D).flatMap(([mueble, acabados]) =>
  Object.entries(acabados).flatMap(([acabado, estados]) => estados.cerrado ? [{
    mueble, acabado, src: estados.cerrado.src, sombra: estados.cerrado.shadow,
  }] : []));
const LAVAMANOS = Object.entries(LAVAMANOS_CAPAS_D);
const TOTAL_CAPAS = 1 + LAVAMANOS.length + MUEBLES.reduce((n, m) => n + (m.sombra ? 2 : 1), 0);
const VIDRIO_CONTROLES = {
  backgroundColor: 'rgba(15, 23, 42, 0.94)', backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.14)',
};

function Flecha({ lado, etiqueta, fila, onClick }: {
  lado: 'izq' | 'der'; etiqueta: string; fila: Fila; onClick: () => void;
}) {
  const Icono = lado === 'izq' ? ChevronLeft : ChevronRight;
  return (
    <button type="button" onClick={onClick} aria-label={etiqueta} title={etiqueta}
      className={`glass-panel-dark absolute z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-white transition-transform duration-150 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${lado === 'izq' ? 'left-2 sm:left-4' : 'right-2 sm:right-4'}`}
      style={{ ...VIDRIO_CONTROLES, top: fila === 'lavamanos' ? '40%' : '70%' }}>
      <Icono className="h-5 w-5" aria-hidden />
    </button>
  );
}

interface CarruselesDProps {
  sel: SeleccionD;
  direcciones: Record<Fila, number>;
  animar: boolean;
  onPaso: (fila: Fila, paso: number) => void;
  onCargado: () => void;
}

/** Una sola combinación activa; el ambiente nunca depende de la selección.
 * Todas las piezas comparten cámara y marco, y permanecen precargadas.
 */
export default function CarruselesD({ sel, direcciones, animar, onPaso, onCargado }: CarruselesDProps) {
  const escenario = useRef<HTMLDivElement>(null);
  const [tam, setTam] = useState({ w: 0, h: 0 });
  const [error, setError] = useState(false);
  const cargadas = useRef(new Set<string>());
  const toque = useRef<{ x: number; y: number; fila: Fila } | null>(null);

  useDeslizamientoD(escenario, 'mueble', `${sel.mueble}__${sel.acabado}`, direcciones.mueble, animar);
  useDeslizamientoD(escenario, 'lavamanos', sel.lavamanos, direcciones.lavamanos, animar);

  useEffect(() => {
    const el = escenario.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setTam({ w: entry.contentRect.width, h: entry.contentRect.height }));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const cargada = (src: string) => {
    cargadas.current.add(src);
    if (cargadas.current.size === TOTAL_CAPAS) onCargado();
  };
  const fallo = () => { setError(true); onCargado(); };
  // Se acerca TODO el ambiente en móvil, nunca las piezas por separado.
  const ancho = Math.max(tam.w, tam.h * AMBIENTE.width / AMBIENTE.height) * (tam.w < 640 ? 1.35 : 1);
  const marco = {
    left: `${MARCO.x / AMBIENTE.width * 100}%`, top: `${MARCO.y / AMBIENTE.height * 100}%`,
    width: `${MARCO.width / AMBIENTE.width * 100}%`, height: `${MARCO.height / AMBIENTE.height * 100}%`,
  };
  const capa = (src: string, tipo: string, id: string, activa: boolean, seleccion = id) => (
    <div key={seleccion} aria-hidden data-capa={tipo} data-pieza={id} data-seleccion={seleccion} data-activa={activa}
      className="pointer-events-none absolute"
      style={{ ...(tipo === 'sombra' ? { left: 0, top: 0, width: '100%', height: '100%' } : marco), opacity: activa ? 1 : 0, transform: 'translate3d(0, 0, 0)' }}>
      <Image src={src} alt="" fill unoptimized priority sizes="630px" onLoad={() => cargada(src)} onError={fallo} />
    </div>
  );

  return (
    <div ref={escenario} data-escena-capas className="absolute inset-0 touch-pan-y select-none overflow-clip"
      onPointerDown={(e) => {
        if ((e.target as HTMLElement).closest('button')) return;
        const rect = e.currentTarget.getBoundingClientRect();
        toque.current = { x: e.clientX, y: e.clientY, fila: e.clientY - rect.top < rect.height * .55 ? 'lavamanos' : 'mueble' };
      }}
      onPointerUp={(e) => {
        const t = toque.current;
        toque.current = null;
        if (!t) return;
        const dx = e.clientX - t.x, dy = e.clientY - t.y;
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2) onPaso(t.fila, dx < 0 ? 1 : -1);
      }}
      onPointerCancel={() => { toque.current = null; }}>
      <div data-marco-ambiente className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2"
        style={{ width: ancho, height: ancho * AMBIENTE.height / AMBIENTE.width }}>
        <Image data-capa="ambiente" src={AMBIENTE.src} alt="" fill unoptimized priority sizes="100vw"
          onLoad={() => cargada(AMBIENTE.src)} onError={fallo} />
        {MUEBLES.map((m) => m.sombra && capa(m.sombra, 'sombra', m.mueble, sel.mueble === m.mueble && sel.acabado === m.acabado, `${m.mueble}__${m.acabado}`))}
        {MUEBLES.map((m) => capa(m.src, 'mueble', m.mueble, sel.mueble === m.mueble && sel.acabado === m.acabado, `${m.mueble}__${m.acabado}`))}
        {LAVAMANOS.map(([id, l]) => capa(l.src, 'lavamanos', id, sel.lavamanos === id))}
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/80 to-transparent" />
      <Flecha lado="izq" fila="lavamanos" etiqueta="Lavamanos anterior" onClick={() => onPaso('lavamanos', -1)} />
      <Flecha lado="der" fila="lavamanos" etiqueta="Lavamanos siguiente" onClick={() => onPaso('lavamanos', 1)} />
      <Flecha lado="izq" fila="mueble" etiqueta="Mueble anterior" onClick={() => onPaso('mueble', -1)} />
      <Flecha lado="der" fila="mueble" etiqueta="Mueble siguiente" onClick={() => onPaso('mueble', 1)} />
      {error && <div role="alert" style={VIDRIO_CONTROLES} className="glass-panel-dark absolute inset-x-4 top-4 z-20 rounded-xl p-4 text-sm text-white">
        No se pudieron cargar todas las piezas. <button type="button" className="min-h-11 px-3 underline" onClick={() => window.location.reload()}>Volver a cargar</button>
      </div>}
    </div>
  );
}
