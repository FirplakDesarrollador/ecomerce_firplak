import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative bg-zinc-950 overflow-hidden w-full h-[560px] lg:h-[720px] group">

      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/cat-baneras.webp"
          alt="Baño moderno premium Firplak"
          fill
          sizes="100vw"
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-20 sm:px-10 lg:px-16 lg:pb-28">
        <div className="max-w-xl">
          <span className="block text-white/70 text-xs font-medium uppercase tracking-[0.3em] mb-5">
            Nueva Colección 2026
          </span>
          <h1 className="text-4xl font-light tracking-tight text-white sm:text-5xl lg:text-6xl">
            Espacios que inspiran
            <br />
            <span className="font-normal">Santuarios de bienestar</span>
          </h1>
          <p className="mt-6 max-w-md text-base font-light text-white/70 leading-relaxed">
            Diseñamos y fabricamos jacuzzis, bañeras y módulos de cocina con los más altos estándares de calidad y tecnología en Colombia.
          </p>
          <div className="mt-10 flex items-center gap-8">
            <Link
              href="/catalogo"
              className="group/cta inline-flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-white border-b border-white pb-1 transition-colors hover:text-white/70 hover:border-white/70"
            >
              Comprar ahora
              <ArrowRight className="w-4 h-4 transition-transform group-hover/cta:translate-x-1" />
            </Link>
            <Link
              href="/catalogos"
              className="text-sm font-medium uppercase tracking-widest text-white/60 transition-colors hover:text-white"
            >
              Ver catálogos
            </Link>
          </div>
        </div>
      </div>

      {/* Slider Controls */}
      <button className="absolute left-6 top-1/2 -translate-y-1/2 z-20 text-white/60 opacity-0 group-hover:opacity-100 transition-opacity hover:text-white" aria-label="Anterior">
        <ChevronLeft className="w-6 h-6" strokeWidth={1.5} />
      </button>
      <button className="absolute right-6 top-1/2 -translate-y-1/2 z-20 text-white/60 opacity-0 group-hover:opacity-100 transition-opacity hover:text-white" aria-label="Siguiente">
        <ChevronRight className="w-6 h-6" strokeWidth={1.5} />
      </button>

      {/* Progress indicators */}
      <div className="absolute bottom-8 right-6 sm:right-10 lg:right-16 z-20 flex gap-2">
        <div className="h-[2px] w-8 bg-white"></div>
        <div className="h-[2px] w-8 bg-white/30 hover:bg-white/60 cursor-pointer transition-colors"></div>
        <div className="h-[2px] w-8 bg-white/30 hover:bg-white/60 cursor-pointer transition-colors"></div>
        <div className="h-[2px] w-8 bg-white/30 hover:bg-white/60 cursor-pointer transition-colors"></div>
      </div>
    </div>
  );
}
