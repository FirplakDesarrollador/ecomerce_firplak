'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Sparkles, ChevronRight, Eye, ArrowDown } from 'lucide-react';
import { LIVING_SPACES_SCENES } from './livingSpacesData';
import { SceneProduct } from '@/components/loomere/sceneData';
import LoomereNavbar from '@/components/loomere/LoomereNavbar';
import LoomereMegamenu from '@/components/loomere/LoomereMegamenu';
import LoomereProductDrawer from '@/components/loomere/LoomereProductDrawer';
import LoomereCatalogModal from '@/components/loomere/LoomereCatalogModal';
import FirplakKeyFeatures from '@/components/home/FirplakKeyFeatures';
import FirplakEcosystemSection from '@/components/home/FirplakEcosystemSection';
import FirplakGlobalFooter from '@/components/layout/FirplakGlobalFooter';

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);

export default function FirplakLivingSpacesExperience() {
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<SceneProduct | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isMegamenuOpen, setIsMegamenuOpen] = useState(false);
  
  // Estados de opacidad desacoplados para evitar colisiones tipográficas
  const [heroOpacity, setHeroOpacity] = useState(1);
  const [sceneContentOpacity, setSceneContentOpacity] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const currentScene = LIVING_SPACES_SCENES[activeSceneIndex];

  // Cálculo desacoplado y preciso de Scroll Craft
  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const totalScenes = LIVING_SPACES_SCENES.length;

    // Altura del recorrido: 1 tramo para Hero + 4 tramos para escenas = 500vh
    const totalTravel = (totalScenes + 0.5) * windowHeight;
    const overallProgress = totalTravel > 0 ? clamp01(scrollY / totalTravel) : 0;
    setScrollProgress(overallProgress);

    // 1. Fase HERO (primer tramo de scroll):
    // Desaparece por completo en el primer 35% de la altura de la ventana
    const heroFadeSpan = windowHeight * 0.35;
    const currentHeroOpacity = clamp01(1 - scrollY / heroFadeSpan);
    setHeroOpacity(currentHeroOpacity);

    // 2. Fase de CONTENIDO EDITORIAL DE ESCENA:
    // Solo emerge cuando el Hero ya se ha desvanecido (< 0.2)
    const sceneFadeIn = clamp01((scrollY - windowHeight * 0.25) / (windowHeight * 0.25));
    setSceneContentOpacity(sceneFadeIn);

    // 3. Selección de Escena Activa:
    const sceneScrollStart = windowHeight * 0.35;
    const effectiveScroll = Math.max(0, scrollY - sceneScrollStart);
    const sceneTravel = totalScenes * windowHeight;
    const sceneProgress = sceneTravel > 0 ? clamp01(effectiveScroll / sceneTravel) : 0;

    const rawIndex = Math.floor(sceneProgress * totalScenes);
    const clampedIndex = Math.min(Math.max(rawIndex, 0), totalScenes - 1);
    setActiveSceneIndex(clampedIndex);
  }, []);

  // Bug 002 fix: diferir la sincronización inicial con requestAnimationFrame
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    const rafId = requestAnimationFrame(handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, [handleScroll]);

  // Manejador de apertura de detalle de producto
  const handleOpenProduct = (product: SceneProduct) => {
    setSelectedProduct(product);
    setIsDrawerOpen(true);
  };

  const scrollToScene = (idx: number) => {
    const windowHeight = window.innerHeight;
    const targetScroll = (idx + 0.55) * windowHeight;
    window.scrollTo({
      top: targetScroll,
      behavior: 'smooth'
    });
  };

  return (
    <div className="relative bg-[#0b0d11] text-white min-h-screen selection:bg-amber-500/30 font-sans">
      {/* Navbar Institucional Firplak */}
      <LoomereNavbar
        currentSceneIndex={activeSceneIndex}
        onOpenMegamenu={() => setIsMegamenuOpen(true)}
      />

      {/* Megamenu */}
      <LoomereMegamenu
        isOpen={isMegamenuOpen}
        onClose={() => setIsMegamenuOpen(false)}
      />

      {/* CONTENEDOR PINNED DE SCROLL CRAFT (500vh) */}
      <div
        ref={containerRef}
        className="relative w-full"
        style={{ height: `${(LIVING_SPACES_SCENES.length + 1) * 100}vh` }}
      >
        {/* VIEWPORT FIJO STICKY (100vh / 100dvh) - PANTALLA ÚNICA UNIFICADA */}
        <div className="sticky top-0 left-0 w-full h-screen h-[100dvh] overflow-hidden flex items-center justify-center bg-[#0b0d11]">
          
          {/* ========================================================================= */}
          {/* FONDO ÚNICO FULL-BLEED: VIDEO EN LOOP SEEDANCE 2.5 (Cero pantallas divididas) */}
          {/* ========================================================================= */}
          <div className="absolute inset-0 w-full h-full bg-[#0b0d11]">
            {LIVING_SPACES_SCENES.map((scene, idx) => {
              const isActive = activeSceneIndex === idx;
              return (
                <div
                  key={scene.id}
                  className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-out ${
                    isActive ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'
                  }`}
                >
                  {/* Poster de Alta Resolución */}
                  <Image
                    src={scene.fallbackImage}
                    alt={scene.title}
                    fill
                    priority={idx === 0}
                    sizes="100vw"
                    className="object-cover object-[center_32%] filter brightness-[0.92] contrast-[1.03]"
                  />

                  {/* Video Loop Continuo Seedance 2.5 (Dense Keyframes -g 4) */}
                  <video
                    ref={(el) => {
                      videoRefs.current[idx] = el;
                    }}
                    src={scene.videoUrl}
                    poster={scene.fallbackImage}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    className="absolute inset-0 w-full h-full object-cover object-[center_32%] filter brightness-[0.92] contrast-[1.03]"
                  />

                  {/* Gradientes sutiles de contraste cinematográfico para legibilidad */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/35 pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-transparent to-transparent pointer-events-none hidden sm:block" />

                  {/* Hotspot Interactivo de Producto Firplak */}
                  {isActive && sceneContentOpacity > 0.25 && (
                    <div
                      className="absolute z-30 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                      style={{
                        left: `${scene.hotspot.x}%`,
                        top: `${scene.hotspot.y}%`
                      }}
                      onClick={() => handleOpenProduct(scene.product)}
                    >
                      <div className="relative flex items-center justify-center">
                        <span className="absolute w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amber-400/30 animate-ping" />
                        <span className="relative flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-amber-400 text-black shadow-2xl backdrop-blur-md transition-all duration-300 group-hover:scale-110">
                          <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
                        </span>

                        {/* Tooltip flotante */}
                        <div className="absolute left-10 sm:left-12 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1.5 bg-black/85 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-xs font-medium whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <span>{scene.product.name}</span>
                          <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ========================================================================= */}
          {/* 1. HERO OVERLAY: Solo visible al inicio, desvanecimiento limpio */}
          {/* ========================================================================= */}
          {heroOpacity > 0.02 && (
            <div
              className="absolute inset-0 z-30 flex flex-col items-center justify-center text-center px-4 sm:px-6 transition-opacity duration-300 pointer-events-none"
              style={{
                opacity: heroOpacity,
                transform: `translateY(${(1 - heroOpacity) * -25}px)`
              }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-amber-300 mb-4 sm:mb-6 shadow-xl">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Firplak Living Spaces · Edición 2026</span>
              </div>

              <h1 className="text-3xl sm:text-5xl md:text-7xl font-light tracking-tight max-w-4xl text-white leading-tight drop-shadow-2xl">
                El Arte de Habitar en <span className="font-serif italic font-normal text-amber-200">Armonía</span>
              </h1>

              <p className="mt-3 sm:mt-5 text-sm sm:text-lg text-white/80 max-w-xl font-light leading-relaxed drop-shadow-md px-2">
                Un recorrido visual y sensorial por cuatro atmósferas donde el diseño arquitectónico transforma cada momento del día.
              </p>

              <div className="mt-8 sm:mt-12 flex items-center gap-2 text-[11px] sm:text-xs uppercase tracking-widest text-white/70 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/15 animate-bounce shadow-2xl">
                <ArrowDown className="w-3.5 h-3.5 text-amber-400" />
                <span>Desliza para descubrir las atmósferas</span>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 2. TARJETA EDITORIAL UNIFICADA (Idéntico estilo tanto en Móvil como en Windows) */}
          {/* ========================================================================= */}
          <div
            className={`absolute bottom-4 left-4 right-4 sm:bottom-8 sm:left-8 sm:right-auto sm:max-w-xl z-20 transition-all duration-700 pointer-events-auto ${
              sceneContentOpacity > 0.05 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'
            }`}
            style={{ opacity: sceneContentOpacity }}
          >
            <div className="bg-black/80 backdrop-blur-xl border border-white/20 p-4 sm:p-7 rounded-2xl sm:rounded-3xl shadow-2xl shadow-black/80">
              {/* Encabezado de la tarjeta */}
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <span className="px-2.5 sm:px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-[10px] sm:text-xs font-semibold text-amber-300 uppercase tracking-wider">
                  {currentScene.timeSlot}
                </span>
                <span className="text-[10px] sm:text-xs text-white/50 tracking-widest uppercase font-medium">
                  {currentScene.roomName} · 0{currentScene.id + 1} / 04
                </span>
              </div>

              {/* Titular */}
              <h2 className="text-lg sm:text-3xl font-light text-white leading-snug sm:leading-tight">
                {currentScene.headline}
              </h2>

              {/* Descripción */}
              <p className="mt-1.5 sm:mt-3 text-xs sm:text-base text-white/75 font-light leading-relaxed line-clamp-2 sm:line-clamp-3">
                {currentScene.description}
              </p>

              {/* Botones de Acción */}
              <div className="mt-4 sm:mt-6 flex items-center gap-2.5 sm:gap-3">
                <button
                  onClick={() => handleOpenProduct(currentScene.product)}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 py-2.5 px-4 sm:py-3 sm:px-6 rounded-full bg-amber-400 text-black text-xs sm:text-sm font-semibold shadow-lg shadow-amber-500/20 hover:bg-amber-300 active:scale-95 transition-all"
                >
                  <span>Explorar Producto</span>
                  <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black" />
                </button>

                <button
                  onClick={() => setIsCatalogOpen(true)}
                  className="inline-flex items-center justify-center py-2.5 px-4 sm:py-3 sm:px-5 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs sm:text-sm font-medium transition-colors"
                >
                  <span>Catálogo</span>
                </button>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 3. NAVEGADOR LATERAL DE ESCENAS (En pantallas medianas y grandes) */}
          {/* ========================================================================= */}
          <div
            className={`absolute right-6 sm:right-10 top-1/2 -translate-y-1/2 z-20 hidden sm:flex flex-col items-center gap-4 transition-opacity duration-500 ${
              sceneContentOpacity > 0.1 ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            {LIVING_SPACES_SCENES.map((scene, idx) => {
              const isActive = activeSceneIndex === idx;
              return (
                <button
                  key={scene.id}
                  onClick={() => scrollToScene(idx)}
                  className="group relative flex items-center justify-end"
                  aria-label={`Ir a escena ${scene.roomName}`}
                >
                  <span className={`text-[11px] font-medium tracking-wider mr-3 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 ${
                    isActive ? 'text-amber-300 opacity-100' : 'text-white/40'
                  }`}>
                    {scene.roomName}
                  </span>
                  <div
                    className={`rounded-full transition-all duration-500 ${
                      isActive
                        ? 'w-3 h-8 bg-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.8)]'
                        : 'w-2 h-2 bg-white/30 group-hover:bg-white/70'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* BARRA DE PROGRESO DE SCROLL INFERIOR */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10 z-30">
            <div
              className="h-full bg-gradient-to-r from-amber-400 via-amber-200 to-white transition-all duration-150"
              style={{ width: `${scrollProgress * 100}%` }}
            />
          </div>

        </div>
      </div>

      {/* SECCIÓN INFERIOR INSTITUCIONAL */}
      <div className="relative z-20 bg-[#0b0d11] border-t border-white/10">
        <FirplakKeyFeatures />
        <FirplakEcosystemSection />
        <FirplakGlobalFooter />
      </div>

      {/* MODALES Y DRAWERS */}
      <LoomereProductDrawer
        product={selectedProduct}
        imageSrc={selectedProduct ? currentScene.productImage : ''}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

      <LoomereCatalogModal
        isOpen={isCatalogOpen}
        onClose={() => setIsCatalogOpen(false)}
      />
    </div>
  );
}
