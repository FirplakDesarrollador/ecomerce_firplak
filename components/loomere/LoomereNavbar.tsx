'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { LOOMERE_SCENES } from './sceneData';

interface LoomereNavbarProps {
  currentSceneIndex: number;
  onSelectScene: (index: number) => void;
  onOpenCatalog: () => void;
}

export default function LoomereNavbar({
  currentSceneIndex,
  onSelectScene,
  onOpenCatalog
}: LoomereNavbarProps) {
  const [isChaptersOpen, setIsChaptersOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 transition-all duration-500 bg-black/30 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between relative">
        {/* Left Navigation: Colecciones & Capítulos */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenCatalog}
            className="px-3.5 sm:px-4 py-2 rounded-full text-xs font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
          >
            Colecciones
          </button>

          {/* Chapter Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsChaptersOpen(!isChaptersOpen)}
              className="flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-full text-xs font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              <span>Capítulos</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  isChaptersOpen ? 'rotate-180 text-cyan-400' : 'text-white/50'
                }`}
              />
            </button>

            {isChaptersOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsChaptersOpen(false)}
                />
                <div className="absolute left-0 mt-2 w-64 py-2 bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-2 text-[10px] font-semibold uppercase tracking-widest text-cyan-400/90 border-b border-white/10 mb-1">
                    Escenas de la Experiencia
                  </div>
                  {LOOMERE_SCENES.map((scene, idx) => {
                    const isActive = currentSceneIndex === idx;
                    return (
                      <button
                        key={scene.id}
                        onClick={() => {
                          onSelectScene(idx);
                          setIsChaptersOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-xs flex items-center gap-3 transition-colors ${
                          isActive
                            ? 'bg-cyan-500/20 text-cyan-300 font-medium'
                            : 'text-white/70 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isActive ? 'bg-cyan-400' : 'bg-white/30'
                          }`}
                        />
                        <span className="font-mono text-[10px] text-white/40">
                          0{idx + 1}
                        </span>
                        <span className="truncate">{scene.title}</span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Center: Logo FIRPLAK */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-auto">
          <Link href="/" className="flex items-center group">
            <div className="flex items-center h-9">
              <Image
                src="/logo.webp"
                alt="FIRPLAK"
                width={140}
                height={36}
                className="object-contain brightness-0 invert transition-transform duration-300 group-hover:scale-105"
                priority
              />
            </div>
          </Link>
        </div>

        {/* Right CTA */}
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="https://wa.me/573000000000?text=Hola%20FIRPLAK,%20deseo%20asesoría%20sobre%20sus%20productos%20de%20diseño."
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 sm:px-5 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 hover:scale-105 transition-all duration-200"
          >
            Cotizar Experiencia
          </a>
        </div>
      </div>

      {/* Progress Bar under navbar */}
      <div className="w-full h-[1.5px] relative overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 transition-all duration-300 ease-out"
          style={{
            width: `${((currentSceneIndex + 1) / LOOMERE_SCENES.length) * 100}%`
          }}
        />
      </div>
    </header>
  );
}
