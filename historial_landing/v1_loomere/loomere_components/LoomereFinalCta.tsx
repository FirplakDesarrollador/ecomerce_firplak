'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';

interface LoomereFinalCtaProps {
  /** 0 = invisible, 1 = CTA completo con el overlay negro al 50%. */
  progress: number;
  onOpenCatalog: () => void;
}

/**
 * Cierre de "El Viaje de los Sentidos".
 * Sobre el ultimo tramo (cocina) el video se oscurece progresivamente hasta
 * el 50% y entra la llamada a la accion.
 */
export default function LoomereFinalCta({ progress, onOpenCatalog }: LoomereFinalCtaProps) {
  const isGone = progress <= 0.01;

  return (
    <div
      aria-hidden={isGone}
      className="absolute inset-0 z-40 flex flex-col items-center justify-center px-6 text-center"
      style={{
        visibility: isGone ? 'hidden' : 'visible',
        pointerEvents: progress > 0.6 ? 'auto' : 'none'
      }}
    >
      {/* Overlay negro que llega al 50% segun el guion */}
      <div
        className="absolute inset-0 bg-black"
        style={{ opacity: progress * 0.5 }}
      />

      <div className="relative" style={{ opacity: progress }}>
        <h2 className="font-serif font-light text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.1] tracking-tight drop-shadow-[0_2px_24px_rgba(0,0,0,0.6)] text-balance">
          Haz realidad tu espacio ideal.
        </h2>

        <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onOpenCatalog}
            className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold text-sm transition-colors duration-200 shadow-lg shadow-cyan-400/25 flex items-center justify-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
          >
            <span>Ver Catálogo</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href="/contacto"
            className="w-full sm:w-auto px-7 py-3.5 rounded-full border border-white/40 hover:border-white/70 hover:bg-white/10 text-white font-semibold text-sm transition-colors duration-200 flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Cotizar Proyecto
          </a>
        </div>
      </div>
    </div>
  );
}
