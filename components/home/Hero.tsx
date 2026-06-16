import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative bg-zinc-900 overflow-hidden w-full h-[500px] lg:h-[650px] group">
      
      {/* Background Image (Simulating active slide) */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/cat-baneras.webp" 
          alt="Baño moderno premium Firplak" 
          className="w-full h-full object-cover object-center opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <span className="inline-block px-3 py-1 bg-[#254153]/80 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-widest mb-6 border border-[#254153]">
            Nueva Colección 2026
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl drop-shadow-md">
            Espacios que inspiran <br/>
            Santuarios de <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-[#254153]">bienestar</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-gray-200 drop-shadow-sm">
            Diseñamos y fabricamos jacuzzis, bañeras y módulos de cocina con los más altos estándares de calidad y tecnología en Colombia.
          </p>
          <div className="mt-10 flex gap-4">
            <Link 
              href="/catalogo" 
              className="group flex items-center justify-center gap-2 rounded-full bg-[#bf2712] px-8 py-4 text-sm font-bold text-white shadow-xl transition-all hover:bg-[#a0200e] hover:shadow-2xl hover:-translate-y-1"
            >
              Comprar ahora
            </Link>
            <Link 
              href="/catalogos" 
              className="flex items-center justify-center gap-2 rounded-full bg-white/10 backdrop-blur-md border border-white/30 px-8 py-4 text-sm font-bold text-white shadow-xl transition-all hover:bg-white/20"
            >
              Ver catálogos
            </Link>
          </div>
        </div>
      </div>

      {/* Slider Controls (Decorative for now to match UI) */}
      <button className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Anterior">
        <ChevronLeft className="w-8 h-8" />
      </button>
      <button className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Siguiente">
        <ChevronRight className="w-8 h-8" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        <div className="w-3 h-3 rounded-full bg-[#bf2712]"></div>
        <div className="w-3 h-3 rounded-full bg-white/50 hover:bg-white/80 cursor-pointer transition-colors"></div>
        <div className="w-3 h-3 rounded-full bg-white/50 hover:bg-white/80 cursor-pointer transition-colors"></div>
        <div className="w-3 h-3 rounded-full bg-white/50 hover:bg-white/80 cursor-pointer transition-colors"></div>
      </div>
    </div>
  );
}
