'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { LOOMERE_SCENES, SceneProduct } from './sceneData';
import LoomereNavbar from './LoomereNavbar';
import LoomereOverlay from './LoomereOverlay';
import LoomereProductDrawer from './LoomereProductDrawer';
import LoomereCatalogModal from './LoomereCatalogModal';
import LoomereCursorPriceTag from './LoomereCursorPriceTag';
import { Sparkles, PhoneCall, ShieldCheck, Award, Truck, ArrowRight, BookOpen } from 'lucide-react';

export default function LoomereExperience() {
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<SceneProduct | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isAtVideoSection, setIsAtVideoSection] = useState(true);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Calculate active scene smoothly based on scroll position
  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const totalScenes = LOOMERE_SCENES.length;

    // Each scene takes 1 windowHeight of scroll in the 400vh container
    const rawIndex = Math.floor((scrollY + windowHeight * 0.4) / windowHeight);
    const clampedIndex = Math.min(Math.max(rawIndex, 0), totalScenes - 1);

    setActiveSceneIndex(clampedIndex);
    setIsAtVideoSection(scrollY < (totalScenes - 0.2) * windowHeight);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Ensure all videos play smoothly without transition glitches
  useEffect(() => {
    videoRefs.current.forEach((video) => {
      if (!video) return;
      video.play().catch(() => {});
    });
  }, []);

  // Smooth scroll to a specific scene index
  const scrollToScene = (index: number) => {
    const windowHeight = window.innerHeight;
    window.scrollTo({
      top: index * windowHeight,
      behavior: 'smooth'
    });
  };

  // Smooth scroll to the brand attributes section
  const scrollToBrandSection = () => {
    const windowHeight = window.innerHeight;
    window.scrollTo({
      top: LOOMERE_SCENES.length * windowHeight,
      behavior: 'smooth'
    });
  };

  const handleOpenProduct = (product: SceneProduct) => {
    setSelectedProduct(product);
    setIsDrawerOpen(true);
  };

  const currentScene = LOOMERE_SCENES[activeSceneIndex];

  return (
    <div className="relative bg-[#060a15] text-white selection:bg-cyan-500 selection:text-black">
      {/* 1. SCROLL-DRIVEN VIDEO CONTAINER (400vh for 4 scenes) */}
      <div className="relative h-[400vh]" style={{ height: '400vh' }}>
        {/* Sticky Viewport pinned at top while scrolling the 4 scenes */}
        <div
          className="sticky top-0 w-full h-screen overflow-hidden cursor-crosshair"
          style={{ height: '100vh', minHeight: '100vh' }}
          onClick={(e) => {
            const target = e.target as HTMLElement | null;
            if (target?.closest('button, a, input, [data-interactive]')) return;
            handleOpenProduct(currentScene.product);
          }}
        >
          {/* Header Navbar */}
          <LoomereNavbar
            currentSceneIndex={activeSceneIndex}
            onSelectScene={scrollToScene}
            onOpenCatalog={() => setIsCatalogOpen(true)}
          />

          {/* Video & Image Background Layers */}
          <div className="absolute inset-0 w-full h-full bg-black">
            {LOOMERE_SCENES.map((scene, idx) => {
              const isActive = activeSceneIndex === idx;
              return (
                <div
                  key={scene.id}
                  className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                    isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                  }`}
                >
                  {/* Fallback image */}
                  <Image
                    src={scene.fallbackImage}
                    alt={scene.title}
                    fill
                    priority={idx === 0}
                    className="object-cover filter brightness-[0.85] contrast-[1.03]"
                  />

                  {/* Video loop */}
                  {scene.videoUrl && (
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
                      className="absolute inset-0 w-full h-full object-cover filter brightness-[0.88] contrast-[1.03]"
                    />
                  )}

                  {/* Vignette gradients */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />
                </div>
              );
            })}
          </div>

          {/* Dynamic Cursor Price Tag following mouse pointer across the 4 videos */}
          <LoomereCursorPriceTag
            product={currentScene.product}
            isActive={isAtVideoSection}
          />

          {/* Clean Scene Overlay (Bottom-left opacity box + scene locator beacon) */}
          <LoomereOverlay
            currentScene={currentScene}
            currentSceneIndex={activeSceneIndex}
            totalScenes={LOOMERE_SCENES.length}
            onOpenProduct={handleOpenProduct}
            onNextScene={() => {
              if (activeSceneIndex < LOOMERE_SCENES.length - 1) {
                scrollToScene(activeSceneIndex + 1);
              } else {
                scrollToBrandSection();
              }
            }}
          />

          {/* Subtle Right Side Progress Dots */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-3 pointer-events-auto">
            {LOOMERE_SCENES.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => scrollToScene(idx)}
                className="group flex items-center justify-end gap-2 focus:outline-none"
                title={`${s.time} — ${s.title}`}
              >
                <span
                  className={`text-[10px] font-mono tracking-widest transition-all duration-300 ${
                    activeSceneIndex === idx
                      ? 'text-cyan-400 font-bold opacity-100 translate-x-0'
                      : 'text-white/40 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0'
                  }`}
                >
                  {s.time}
                </span>
                <span
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    activeSceneIndex === idx
                      ? 'bg-cyan-400 ring-4 ring-cyan-400/20 scale-125'
                      : 'bg-white/30 hover:bg-white/60'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. ATRIBUTOS DE MARCA & CONVERSIÓN (Sin video, fondo degradado coherente, espaciado perfecto) */}
      <section className="relative z-20 bg-gradient-to-b from-[#060a15] via-[#0c1527] to-[#04060c] border-t border-white/10 px-6 sm:px-12 py-24 md:py-32">
        <div className="max-w-6xl mx-auto space-y-20">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-[0.25em] bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              Atributos de Marca • Firplak 2026
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              El Estándar Arquitectónico del Bienestar
            </h2>
            <p className="text-white/65 text-sm sm:text-base leading-relaxed">
              Más de cuatro décadas creando superficies sólidas y sistemas de hidroterapia que elevan la calidad de vida, fusionando ingeniería de materiales con diseño de vanguardia.
            </p>
          </div>

          {/* Reordered & Perfectly Spaced Value Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1: Calidad y Respaldo */}
            <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4 hover:border-cyan-500/30 transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">Garantía Directa de Fábrica</h3>
                <p className="text-xs text-white/60 leading-relaxed">
                  Superficies no porosas en mármol sintético, cuarzo y muebles RH hidrófugos probados contra humedad extrema, impactos y manchas.
                </p>
              </div>
              <div className="pt-4 border-t border-white/5">
                <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                  10 Años de Respaldo
                </span>
              </div>
            </div>

            {/* Pillar 2: Liderazgo y Experiencia */}
            <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4 hover:border-cyan-500/30 transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">+40 Años Liderando el Sector</h3>
                <p className="text-xs text-white/60 leading-relaxed">
                  Referente en Colombia y Latinoamérica en fabricación de hidromasajes de alta gama, cocinas a medida y soluciones hidrosanitarias.
                </p>
              </div>
              <div className="pt-4 border-t border-white/5">
                <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                  Ingeniería Colombiana
                </span>
              </div>
            </div>

            {/* Pillar 3: Asesoría y Cobertura */}
            <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4 hover:border-cyan-500/30 transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
                  <Truck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">Acompañamiento & Cobertura</h3>
                <p className="text-xs text-white/60 leading-relaxed">
                  Asesoría técnica personalizada para constructoras, arquitectos y particulares desde la modulación de planos hasta la instalación.
                </p>
              </div>
              <div className="pt-4 border-t border-white/5">
                <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                  Servicio a Nivel Nacional
                </span>
              </div>
            </div>
          </div>

          {/* Clean High-Impact CTA Banner */}
          <div className="rounded-3xl p-8 sm:p-12 md:p-16 bg-gradient-to-r from-cyan-950/40 via-[#0e1b33] to-blue-950/40 border border-white/15 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl">
            <div className="space-y-2 text-center lg:text-left max-w-xl">
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Inicia la remodelación o construcción de tus espacios
              </h3>
              <p className="text-sm text-white/70 leading-relaxed">
                Nuestros especialistas están listos para asesorarte con dimensiones, catálogos técnicos y presupuestos personalizados sin costo.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
              <button
                onClick={() => setIsCatalogOpen(true)}
                className="w-full sm:w-auto px-6 py-3.5 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/15 hover:border-white/30 transition-all flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>Explorar Colecciones</span>
              </button>
              <a
                href="https://wa.me/573000000000?text=Hola%20FIRPLAK,%20deseo%20asesoría%20sobre%20un%20proyecto."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-7 py-3.5 rounded-full text-xs font-bold bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-xl shadow-cyan-500/20 transition-all hover:scale-105 flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Hablar con un Asesor</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Product Detail Drawer */}
      <LoomereProductDrawer
        product={selectedProduct}
        imageSrc={currentScene.fallbackImage}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

      {/* Full Catalog Modal */}
      <LoomereCatalogModal
        isOpen={isCatalogOpen}
        onClose={() => setIsCatalogOpen(false)}
      />
    </div>
  );
}
