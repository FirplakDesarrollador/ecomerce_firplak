'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { type SeleccionD } from './catalogoOpcionD';
import { AMBIENTES_D, CAPAS_PILOTO_D, LAVAMANOS_CAPAS_D, MUEBLES_CAPAS_D } from './capasPilotoD';
import { useDeslizamientoD } from './useDeslizamientoD';

type Fila = 'lavamanos' | 'mueble';
// Todos los ambientes comparten lienzo, cámara y marco de producto.
const LIENZO = AMBIENTES_D[0];
const MARCO = CAPAS_PILOTO_D.product_frame;
const MUEBLES = Object.entries(MUEBLES_CAPAS_D).flatMap(([mueble, acabados]) =>
  Object.entries(acabados).flatMap(([acabado, estados]) => estados.cerrado ? [{
    mueble, acabado, src: estados.cerrado.src,
  }] : []));
const LAVAMANOS = Object.entries(LAVAMANOS_CAPAS_D);
const TOTAL_CAPAS = new Set([
  ...AMBIENTES_D.flatMap((a) => [a.src, ...MUEBLES.map((m) => a.shadows[m.mueble]).filter(Boolean)]),
  ...MUEBLES.map((m) => m.src), ...LAVAMANOS.map(([, l]) => l.src),
]).size;
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
  /** Ambiente activo: cambia solo el nodo de ambiente; las piezas no se recargan ni se mueven. */
  ambiente: string;
  direcciones: Record<Fila, number>;
  animar: boolean;
  onPaso: (fila: Fila, paso: number) => void;
  onCargado: () => void;
}

/** Una sola combinación activa; el ambiente nunca depende de la selección.
 * Todas las piezas comparten cámara y marco, y permanecen precargadas.
 */
export default function CarruselesD({ sel, ambiente, direcciones, animar, onPaso, onCargado }: CarruselesDProps) {
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
  const ancho = Math.max(tam.w, tam.h * LIENZO.width / LIENZO.height) * (tam.w < 640 ? 1.35 : 1);
  const marco = {
    left: `${MARCO.x / LIENZO.width * 100}%`, top: `${MARCO.y / LIENZO.height * 100}%`,
    width: `${MARCO.width / LIENZO.width * 100}%`, height: `${MARCO.height / LIENZO.height * 100}%`,
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
        style={{ width: ancho, height: ancho * LIENZO.height / LIENZO.width }}>
        {/* Un nodo persistente por ambiente (placa + sombras de cada mueble en su lienzo completo).
            El entrante se funde encima; el saliente se oculta al terminar, sin trasladar nada. */}
        {AMBIENTES_D.map((a) => {
          const activo = a.id === ambiente;
          return (
            <div key={a.id} data-ambiente={a.id} data-activa={activo}
              className={`absolute inset-0 transition-opacity motion-reduce:transition-none ${activo ? 'z-[1] opacity-100 duration-500' : 'z-0 opacity-0 delay-500 duration-0'}`}>
              <Image data-capa="ambiente" data-activa={activo} src={a.src} alt="" fill unoptimized priority sizes="100vw"
                onLoad={() => cargada(a.src)} onError={fallo} />
              {MUEBLES.map((m) => a.shadows[m.mueble] && capa(a.shadows[m.mueble], 'sombra', m.mueble, sel.mueble === m.mueble && sel.acabado === m.acabado, `${m.mueble}__${m.acabado}`))}
            </div>
          );
        })}
        {/* Piezas compartidas por todos los ambientes, encima de ellos.
            Muebles y lavamanos en contextos de apilamiento propios para que el lavamanos
            permanezca siempre por encima del mueble incluso durante el fundido de acabados. */}
        <div className="absolute inset-0 z-[2]">
          <div className="absolute inset-0 z-[1]">
            {MUEBLES.map((m) => capa(m.src, 'mueble', m.mueble, sel.mueble === m.mueble && sel.acabado === m.acabado, `${m.mueble}__${m.acabado}`))}
          </div>
          <div className="absolute inset-0 z-[2]">
            {LAVAMANOS.map(([id, l]) => capa(l.src, 'lavamanos', id, sel.lavamanos === id))}
          </div>
        </div>
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
