'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { LOOMERE_SCENES, SceneProduct } from './sceneData';
import LoomereNavbar from './LoomereNavbar';
import LoomereOverlay from './LoomereOverlay';
import LoomereProductDrawer from './LoomereProductDrawer';
import LoomereCatalogModal from './LoomereCatalogModal';
import LoomereMegamenu from './LoomereMegamenu';
import LoomereCursorPriceTag from './LoomereCursorPriceTag';
import LoomereHero from './LoomereHero';
import LoomereFinalCta from './LoomereFinalCta';
import FirplakKeyFeatures from '@/components/home/FirplakKeyFeatures';
import FirplakEcosystemSection from '@/components/home/FirplakEcosystemSection';
import FirplakGlobalFooter from '@/components/layout/FirplakGlobalFooter';
import AccessFeedbackToast from '@/components/ui/AccessFeedbackToast';

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);

export default function LoomereExperience() {
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<SceneProduct | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isMegamenuOpen, setIsMegamenuOpen] = useState(false);
  const [isAtVideoSection, setIsAtVideoSection] = useState(true);
  // Pantalla inicial visible al cargar; cierre apagado hasta el ultimo tramo.
  const [heroOpacity, setHeroOpacity] = useState(1);
  const [ctaProgress, setCtaProgress] = useState(0);
  // null hasta resolver la media query: asi un movil no descarga el master
  // de desktop antes de saber que le toca la variante ligera.
  const [videoVariant, setVideoVariant] = useState<'desktop' | 'mobile' | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  // Ultimo objetivo de scrub calculado; el rAF es el unico que toca el DOM.
  const scrubRef = useRef({ index: 0, local: 0 });
  const rafRef = useRef<number | null>(null);

  // El scroll es el transporte del video: la rueda escribe currentTime.
  // Los clips estan codificados con GOP denso (skills/scroll-craft/scripts/
  // encode.sh) precisamente para que este seek sea barato.
  const applyScrub = useCallback(() => {
    rafRef.current = null;
    const { index, local } = scrubRef.current;
    const video = videoRefs.current[index];
    if (!video) return;
    const duration = video.duration;
    if (!Number.isFinite(duration) || duration <= 0) return;
    const target = local * duration;
    // Un seek por fotograma basta; pedir mas hace temblar el decoder.
    if (Math.abs(video.currentTime - target) < 1 / 48) return;
    video.currentTime = target;
  }, []);

  // Calculate active scene smoothly based on scroll position
  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const totalScenes = LOOMERE_SCENES.length;

    // El viewport queda fijado durante (n - 1) alturas de pantalla del
    // contenedor de 400vh; ese es el recorrido completo del viaje.
    const pinTravel = (totalScenes - 1) * windowHeight;
    const journey = pinTravel > 0 ? clamp01(scrollY / pinTravel) : 0;

    // Reparto uniforme: cada tramo ocupa exactamente 1/n del recorrido, para
    // que ningun texto quede sin tiempo en pantalla.
    const rawIndex = Math.floor(journey * totalScenes);
    const clampedIndex = Math.min(Math.max(rawIndex, 0), totalScenes - 1);

    setActiveSceneIndex(clampedIndex);
    setIsAtVideoSection(scrollY < (totalScenes - 0.2) * windowHeight);

    // Hero: se desvanece dentro del primer 35% de viewport de scroll.
    const fadeSpan = windowHeight * 0.35;
    setHeroOpacity(fadeSpan > 0 ? clamp01(1 - scrollY / fadeSpan) : 0);

    // Cierre: overlay negro + CTA entran en el ultimo 12% del recorrido.
    setCtaProgress(clamp01((journey - 0.88) / 0.12));

    // Progreso dentro del tramo activo: 0 al entrar, 1 al salir.
    const local = clamp01(journey * totalScenes - clampedIndex);
    scrubRef.current = { index: clampedIndex, local };
    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(applyScrub);
    }
  }, [applyScrub]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Sincroniza la escena con el scroll restaurado por el navegador, fuera del render.
    const syncId = requestAnimationFrame(handleScroll);
    return () => {
      cancelAnimationFrame(syncId);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  // Elige la variante de video segun el ancho real del dispositivo.
  useEffect(() => {
    const query = window.matchMedia('(max-width: 899px)');
    const sync = () => setVideoVariant(query.matches ? 'mobile' : 'desktop');
    // Diferido: no se hace setState en el cuerpo del effect (ver bug 002).
    const syncId = requestAnimationFrame(sync);
    query.addEventListener('change', sync);
    return () => {
      cancelAnimationFrame(syncId);
      query.removeEventListener('change', sync);
    };
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
    setIsMegamenuOpen(false);
    setIsCatalogOpen(false);
  };

  const currentScene = LOOMERE_SCENES[activeSceneIndex];
  // El texto de tramo entra cuando el hero ya se fue y sale en la primera
  // mitad de la rampa del cierre, para no dejar fantasma bajo el CTA.
  const sceneTextOpacity = (1 - heroOpacity) * (1 - clamp01(ctaProgress * 2));
  const isHeroOrCtaVisible = heroOpacity > 0.5 || ctaProgress > 0.5;

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
            // Durante la pantalla inicial y el cierre, el clic no abre producto.
            if (isHeroOrCtaVisible) return;
            handleOpenProduct(currentScene.product);
          }}
        >
          {/* Header Navbar */}
          <LoomereNavbar
            currentSceneIndex={activeSceneIndex}
            onOpenMegamenu={() => {
              setIsMegamenuOpen(true);
              setIsCatalogOpen(false);
              setIsDrawerOpen(false);
            }}
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

                  {/* Video scrubbeado por el scroll (sin autoplay) */}
                  {scene.videoUrl && videoVariant && (
                    <video
                      key={videoVariant}
                      ref={(el) => {
                        videoRefs.current[idx] = el;
                      }}
                      src={
                        videoVariant === 'mobile'
                          ? scene.videoUrlMobile ?? scene.videoUrl
                          : scene.videoUrl
                      }
                      poster={scene.fallbackImage}
                      muted
                      playsInline
                      preload="auto"
                      className="absolute inset-0 w-full h-full object-cover filter brightness-[0.88] contrast-[1.03]"
                    />
                  )}

                  {/* Top subtle vignette for navbar legibility (no bottom darkening) */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent pointer-events-none" />
                </div>
              );
            })}
          </div>

          {/* Dynamic Cursor Price Tag following mouse pointer across the 4 videos */}
          <LoomereCursorPriceTag
            product={currentScene.product}
            isActive={isAtVideoSection && !isHeroOrCtaVisible}
          />

          {/* Pantalla inicial: "Diseno que fluye contigo." */}
          <LoomereHero opacity={heroOpacity} />

          {/* Cierre: overlay negro al 50% + "Haz realidad tu espacio ideal." */}
          <LoomereFinalCta
            progress={ctaProgress}
            onOpenCatalog={() => setIsCatalogOpen(true)}
          />

          {/* Clean Scene Overlay (Bottom-left opacity box + scene locator beacon) */}
          <LoomereOverlay
            currentScene={currentScene}
            currentSceneIndex={activeSceneIndex}
            totalScenes={LOOMERE_SCENES.length}
            opacity={sceneTextOpacity}
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

      {/* 2. KEY FEATURES & ATRIBUTOS DE MARCA FIRPLAK (Fondo degradado oscuro, Apple design y Humanizer) */}
      <FirplakKeyFeatures onOpenCatalog={() => setIsCatalogOpen(true)} />

      {/* 3. ECOSISTEMA Y TODAS LAS CATEGORÍAS & SOLUCIONES FIRPLAK */}
      <FirplakEcosystemSection />

      {/* 4. FOOTER CORPORATIVO & REGULATORIO (SIC / COLOMBIA) */}
      <FirplakGlobalFooter />

      {/* Product Detail Drawer */}
      <LoomereProductDrawer
        product={selectedProduct}
        imageSrc={currentScene.productImage ?? currentScene.fallbackImage}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

      {/* Full Catalog Modal */}
      <LoomereCatalogModal
        isOpen={isCatalogOpen}
        onClose={() => setIsCatalogOpen(false)}
      />

      {/* Megamenú Completo con 6 Categorías, Subcategorías y B2B */}
      <LoomereMegamenu
        isOpen={isMegamenuOpen}
        onClose={() => setIsMegamenuOpen(false)}
      />

      {/* Notificación interactiva no intrusiva de feedback para accesos en integración */}
      <AccessFeedbackToast />
    </div>
  );
}
