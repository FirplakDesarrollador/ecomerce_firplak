'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';

interface LoomereHeroProps {
  /** 1 = totalmente visible al cargar, 0 = ya desvanecido por el scroll. */
  opacity: number;
}

/**
 * Pantalla inicial de "El Viaje de los Sentidos".
 * Se muestra sobre el primer frame (jacuzzi) y se desvanece en cuanto
 * el usuario empieza a bajar.
 */
export default function LoomereHero({ opacity }: LoomereHeroProps) {
  const isGone = opacity <= 0.01;

  return (
    <div
      aria-hidden={isGone}
      className="absolute inset-0 z-40 flex flex-col items-center justify-center px-6 text-center pointer-events-none"
      style={{
        opacity,
        visibility: isGone ? 'hidden' : 'visible',
        transition: 'opacity 200ms linear'
      }}
    >
      <div className="absolute inset-0 bg-black/25" />

      <div className="relative">
        {/* leading holgado: a este cuerpo los descendentes de "q/y/g" invaden
            la linea siguiente si se aprieta el interlineado. */}
        <h1 className="font-serif font-light text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.22] tracking-tight drop-shadow-[0_2px_24px_rgba(0,0,0,0.55)] text-balance">
          Diseño que fluye contigo.
        </h1>

        <p className="mt-10 sm:mt-12 flex items-center justify-center gap-2 text-white/80 text-xs sm:text-sm font-light tracking-[0.22em] uppercase">
          <span>Haz scroll para vivir la experiencia</span>
          <ChevronDown className="w-4 h-4 animate-bounce motion-reduce:animate-none" />
        </p>
      </div>
    </div>
  );
}
