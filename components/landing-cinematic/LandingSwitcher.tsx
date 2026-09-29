'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Layers, Sparkles, RefreshCw } from 'lucide-react';

// Carga dinámica de ambas experiencias
const LoomereExperience = dynamic(
  () => import('@/components/loomere/LoomereExperience'),
  { ssr: false }
);

const FirplakLivingSpacesExperience = dynamic(
  () => import('@/components/landing-cinematic/FirplakLivingSpacesExperience'),
  { ssr: false }
);

type LandingVersion = 'loomere' | 'living-spaces';

export default function LandingSwitcher() {
  const [activeVersion, setActiveVersion] = useState<LandingVersion | null>(null);

  useEffect(() => {
    // Bug 002 fix: diferir la lectura y seteo de estado fuera del cuerpo síncrono del effect
    const rafId = requestAnimationFrame(() => {
      // 1. Revisar si hay un parámetro forzado en la URL (?v=loomere o ?v=living-spaces)
      const urlParams = new URLSearchParams(window.location.search);
      const forcedVersion = urlParams.get('v') as LandingVersion | null;

      if (forcedVersion === 'loomere' || forcedVersion === 'living-spaces') {
        setActiveVersion(forcedVersion);
        localStorage.setItem('firplak_active_landing', forcedVersion);
        return;
      }

      // 2. Alternancia automática en cada refresh (recarga de página)
      const lastVersion = localStorage.getItem('firplak_active_landing') as LandingVersion | null;
      const nextVersion: LandingVersion = lastVersion === 'living-spaces' ? 'loomere' : 'living-spaces';

      localStorage.setItem('firplak_active_landing', nextVersion);
      setActiveVersion(nextVersion);
    });

    return () => cancelAnimationFrame(rafId);
  }, []);

  // Función para alternar manualmente sin necesidad de recargar
  const toggleVersion = (version: LandingVersion) => {
    setActiveVersion(version);
    localStorage.setItem('firplak_active_landing', version);
  };

  if (!activeVersion) {
    return (
      <div className="min-h-screen bg-[#0d0f12] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <main className="relative">
      {/* RENDERIZADO DE LA LANDING CORRESPONDIENTE */}
      {activeVersion === 'living-spaces' ? (
        <FirplakLivingSpacesExperience />
      ) : (
        <LoomereExperience />
      )}

      {/* CONTROL FLOTANTE INFORMATIVO & CONMUTADOR RÁPIDO */}
      <aside 
        aria-label="Selector de versión de Landing"
        className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-black/85 backdrop-blur-xl border border-white/20 p-1.5 rounded-full shadow-[0_10px_35px_rgba(0,0,0,0.8)] text-xs text-white"
      >
        <div className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-amber-300">
          <RefreshCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '8s' }} />
          <span className="hidden sm:inline">Alterna en cada Refresh:</span>
        </div>

        <button
          onClick={() => toggleVersion('living-spaces')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-300 font-medium ${
            activeVersion === 'living-spaces'
              ? 'bg-amber-400 text-black shadow-md font-semibold'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>v2 Living Spaces</span>
        </button>

        <button
          onClick={() => toggleVersion('loomere')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-300 font-medium ${
            activeVersion === 'loomere'
              ? 'bg-white text-black shadow-md font-semibold'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>v1 Loomere</span>
        </button>
      </aside>
    </main>
  );
}
