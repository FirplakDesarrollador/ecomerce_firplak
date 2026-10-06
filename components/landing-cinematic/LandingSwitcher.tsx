'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Layers, Sparkles, Users, RefreshCw } from 'lucide-react';

// Carga dinámica de las 3 experiencias de diseño
// 1. Alejandro (Loomere)
const AlejandroExperience = dynamic(
  () => import('@/components/loomere/LoomereExperience'),
  { ssr: false }
);

// 2. Ricardo (V2 Living Spaces)
const RicardoExperience = dynamic(
  () => import('@/components/landing-cinematic/FirplakLivingSpacesExperience'),
  { ssr: false }
);

// 3. Isabel / Gabriel (Réplica inicial de Alejandro / Loomere)
const IsabelGabrielExperience = dynamic(
  () => import('@/components/isabel-gabriel/IsabelGabrielExperience'),
  { ssr: false }
);

export type LandingVersion = 'alejandro' | 'ricardo' | 'isabel-gabriel';

const ROTATION_ORDER: LandingVersion[] = ['alejandro', 'ricardo', 'isabel-gabriel'];

/**
 * Normaliza cualquier valor ingresado por URL (?v=...) o localStorage
 * manteniendo compatibilidad retrospectiva con las versiones anteriores.
 */
function normalizeVersion(val: string | null): LandingVersion | null {
  if (!val) return null;
  const clean = val.toLowerCase().trim();
  if (clean === 'alejandro' || clean === 'loomere' || clean === 'v1') return 'alejandro';
  if (clean === 'ricardo' || clean === 'living-spaces' || clean === 'v2') return 'ricardo';
  if (
    clean === 'isabel-gabriel' ||
    clean === 'isabel_gabriel' ||
    clean === 'isabel/gabriel' ||
    clean === 'isabel' ||
    clean === 'gabriel' ||
    clean === 'v3'
  ) {
    return 'isabel-gabriel';
  }
  return null;
}

export default function LandingSwitcher() {
  const [activeVersion, setActiveVersion] = useState<LandingVersion | null>(null);

  useEffect(() => {
    // Bug 002 fix: diferir la lectura y seteo de estado fuera del cuerpo síncrono del effect
    const rafId = requestAnimationFrame(() => {
      // 1. Revisar si hay un parámetro forzado en la URL (?v=alejandro, ?v=ricardo o ?v=isabel-gabriel)
      const urlParams = new URLSearchParams(window.location.search);
      const queryParam = urlParams.get('v') || urlParams.get('diseno') || urlParams.get('version');
      const forcedVersion = normalizeVersion(queryParam);

      if (forcedVersion) {
        setActiveVersion(forcedVersion);
        localStorage.setItem('firplak_active_landing', forcedVersion);
        return;
      }

      // 2. Alternancia automática secuencial en cada refresh (recarga de página)
      const rawStored = localStorage.getItem('firplak_active_landing');
      const lastVersion = normalizeVersion(rawStored);
      let nextVersion: LandingVersion = 'alejandro';

      if (lastVersion) {
        const currentIndex = ROTATION_ORDER.indexOf(lastVersion);
        if (currentIndex !== -1) {
          nextVersion = ROTATION_ORDER[(currentIndex + 1) % ROTATION_ORDER.length];
        }
      }

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
      {/* RENDERIZADO DE LA PROPUESTA DE DISEÑO ACTIVA */}
      {activeVersion === 'ricardo' && <RicardoExperience />}
      {activeVersion === 'alejandro' && <AlejandroExperience />}
      {activeVersion === 'isabel-gabriel' && <IsabelGabrielExperience />}

      {/* CONTROL FLOTANTE INFORMATIVO & CONMUTADOR RÁPIDO */}
      <aside
        aria-label="Selector de versión de propuesta de diseño"
        className="fixed bottom-4 right-4 z-50 flex items-center gap-1.5 sm:gap-2 bg-black/90 backdrop-blur-xl border border-white/20 p-1.5 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.85)] text-xs text-white max-w-[calc(100vw-2rem)] overflow-x-auto"
      >
        <div className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-amber-300 shrink-0">
          <RefreshCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '8s' }} />
          <span className="hidden md:inline">Alterna en cada Refresh:</span>
        </div>

        {/* Opción 1: Alejandro */}
        <button
          onClick={() => toggleVersion('alejandro')}
          aria-pressed={activeVersion === 'alejandro'}
          title="Propuesta Alejandro (Base Loomere)"
          className={`flex items-center gap-1.5 px-3 sm:px-3.5 min-h-[44px] rounded-full transition-all duration-300 font-medium shrink-0 ${
            activeVersion === 'alejandro'
              ? 'bg-white text-black shadow-md font-semibold'
              : 'text-white/80 hover:text-white hover:bg-white/10'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Alejandro</span>
        </button>

        {/* Opción 2: Ricardo */}
        <button
          onClick={() => toggleVersion('ricardo')}
          aria-pressed={activeVersion === 'ricardo'}
          title="Propuesta Ricardo (V2 Living Spaces)"
          className={`flex items-center gap-1.5 px-3 sm:px-3.5 min-h-[44px] rounded-full transition-all duration-300 font-medium shrink-0 ${
            activeVersion === 'ricardo'
              ? 'bg-amber-400 text-black shadow-md font-semibold'
              : 'text-white/80 hover:text-white hover:bg-white/10'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ricardo</span>
        </button>

        {/* Opción 3: Isabel / Gabriel */}
        <button
          onClick={() => toggleVersion('isabel-gabriel')}
          aria-pressed={activeVersion === 'isabel-gabriel'}
          title="Propuesta Isabel / Gabriel"
          className={`flex items-center gap-1.5 px-3 sm:px-3.5 min-h-[44px] rounded-full transition-all duration-300 font-medium shrink-0 ${
            activeVersion === 'isabel-gabriel'
              ? 'bg-emerald-400 text-black shadow-md font-semibold'
              : 'text-white/80 hover:text-white hover:bg-white/10'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Isabel / Gabriel</span>
        </button>
      </aside>
    </main>
  );
}
