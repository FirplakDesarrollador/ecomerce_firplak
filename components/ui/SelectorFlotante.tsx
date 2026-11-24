'use client';

import React, { useEffect, useId, useRef, useState } from 'react';

interface SelectorFlotanteProps {
  /** Nombre accesible del selector (y del boton redondo). */
  etiqueta: string;
  /** Contenido del boton redondo cuando esta colapsado. */
  icono: React.ReactNode;
  /** Posicion vertical y extras (p. ej. "bottom-4"). Siempre va pegado a la derecha. */
  className?: string;
  children: React.ReactNode;
}

const CIERRE_MS = 180;

/**
 * Selector flotante colapsado en un icono redondo. Con mouse se expande al pasar
 * por encima y se recoge al salir; en pantallas tactiles se abre y se cierra al
 * tocar el icono, y se cierra al tocar fuera. Esc tambien lo cierra. Las opciones
 * solo son alcanzables con teclado mientras esta abierto.
 */
export default function SelectorFlotante({ etiqueta, icono, className = '', children }: SelectorFlotanteProps) {
  const [abierto, setAbierto] = useState(false);
  const raiz = useRef<HTMLDivElement>(null);
  const cierre = useRef<number | undefined>(undefined);
  const id = useId();

  const conMouse = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const abrir = () => {
    window.clearTimeout(cierre.current);
    setAbierto(true);
  };
  const cerrarPronto = () => {
    window.clearTimeout(cierre.current);
    cierre.current = window.setTimeout(() => setAbierto(false), CIERRE_MS);
  };

  useEffect(() => () => window.clearTimeout(cierre.current), []);

  // Abierto: se cierra al tocar fuera o con Esc.
  useEffect(() => {
    if (!abierto) return;
    const fuera = (e: PointerEvent) => {
      if (!raiz.current?.contains(e.target as Node)) setAbierto(false);
    };
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAbierto(false);
    };
    document.addEventListener('pointerdown', fuera);
    document.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('pointerdown', fuera);
      document.removeEventListener('keydown', esc);
    };
  }, [abierto]);

  return (
    <div
      ref={raiz}
      role="group"
      aria-label={etiqueta}
      className={`fixed right-4 z-50 ${className}`}
      onMouseEnter={() => conMouse() && abrir()}
      onMouseLeave={() => conMouse() && cerrarPronto()}
      onBlur={(e) => {
        if (!raiz.current?.contains(e.relatedTarget as Node | null)) setAbierto(false);
      }}
    >
      {/* row-reverse: el icono queda a la derecha y las opciones lo siguen en el orden del tabulador */}
      <div className="flex flex-row-reverse items-center rounded-full border border-white/20 bg-black/90 p-1.5 text-xs text-white shadow-[0_12px_40px_rgba(0,0,0,0.85)] backdrop-blur-xl">
        <button
          type="button"
          aria-expanded={abierto}
          aria-controls={id}
          aria-label={abierto ? `Cerrar ${etiqueta.toLowerCase()}` : etiqueta}
          title={etiqueta}
          onClick={() => (abierto ? setAbierto(false) : abrir())}
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
            abierto ? 'bg-white/15 text-white' : 'bg-white text-black hover:bg-white/90'
          }`}
        >
          {icono}
        </button>
        <div
          id={id}
          inert={!abierto}
          className={`grid transition-[grid-template-columns,opacity] duration-300 ease-out motion-reduce:transition-none ${
            abierto ? 'grid-cols-[1fr] opacity-100' : 'grid-cols-[0fr] opacity-0'
          }`}
        >
          <div className="overflow-hidden">
            <div className="flex max-w-[calc(100vw-6.5rem)] items-center gap-1 overflow-x-auto whitespace-nowrap pr-1.5">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
