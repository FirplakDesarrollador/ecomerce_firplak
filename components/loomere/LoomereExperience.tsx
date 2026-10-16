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
import FirplakFeaturedOffers from '@/components/home/FirplakFeaturedOffers';
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
  // null hasta resolver la media query: asi un movil no descarga el master
  // de desktop antes de saber que le toca la variante ligera.
  const [videoVariant, setVideoVariant] = useState<'desktop' | 'mobile' | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const lastActiveIndexRef = useRef(0);

  // Calcula el viaje y las transiciones entre las 4 escenas.
  // Calibrado para que cada cambio de escena tome entre 3 y 5 clics de rueda (~520-580px).
  // La transición se resuelve por tiempo (CSS), garantizando que NUNCA queden dos videos
  // congelados en superposición al detener el scroll.
  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight || 800;
    const totalScenes = LOOMERE_SCENES.length;

    // Distancia de scroll por cada transición (0->1, 1->2, 2->3).
    // Con 120-150px por muesca de rueda, ~540px equivale exactamente a entre 3.6 y 4.5 clics (rango 3 a 5).
    const sceneStep = Math.max(Math.round(windowHeight * 0.62), 520);
    const videoTravel = (totalScenes - 1) * sceneStep;
    const dwellTravel = Math.round(windowHeight * 0.45);
    const pinTravel = videoTravel + dwellTravel;

    const inVideoSection = scrollY < pinTravel + windowHeight * 0.15;
    setIsAtVideoSection(inVideoSection);

    // Progreso continuo entre escenas: de 0.0 a 3.0
    const rawProgress =
      videoTravel > 0 ? (scrollY / videoTravel) * (totalScenes - 1) : 0;

    // Umbral de avance/retroceso con histéresis (±0.55) para evitar oscilaciones en la frontera.
    // Al cruzar el umbral entre 3 y 5 clics, se dispara el cambio de escena activa.
    const currentActive = lastActiveIndexRef.current;
    let nextActive = currentActive;

    if (rawProgress > currentActive + 0.55) {
      nextActive = Math.min(Math.floor(rawProgress + 0.45), totalScenes - 1);
    } else if (rawProgress < currentActive - 0.55) {
      nextActive = Math.max(Math.ceil(rawProgress - 0.45), 0);
    }

    if (nextActive !== currentActive) {
      lastActiveIndexRef.current = nextActive;
      setActiveSceneIndex(nextActive);
    }
  }, []);

  // Mantener los videos reproduciéndose de manera continua y limpia (loops de descanso de 3-4s)
  // Precalienta la escena activa y la inmediata adyacente para que la transición sea instantánea
  useEffect(() => {
    videoRefs.current.forEach((video, idx) => {
      if (!video) return;
      video.muted = true;
      video.playsInline = true;
      video.loop = true;

      const isNearby = Math.abs(idx - activeSceneIndex) <= 1;
      if (isNearby) {
        if (video.paused) {
          video.play().catch(() => {});
        }
      } else {
        if (!video.paused) {
          video.pause();
        }
      }
    });
  }, [activeSceneIndex, videoVariant]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Sincroniza la escena con el scroll restaurado por el navegador, fuera del render (Bug 002 fix).
    const syncId = requestAnimationFrame(handleScroll);
    return () => {
      cancelAnimationFrame(syncId);
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
    const windowHeight = window.innerHeight || 800;
    const sceneStep = Math.max(Math.round(windowHeight * 0.62), 520);
    window.scrollTo({
      top: index * sceneStep,
      behavior: 'smooth'
    });
  };

  // Smooth scroll to the brand attributes section
  const scrollToBrandSection = () => {
    const windowHeight = window.innerHeight || 800;
    const totalScenes = LOOMERE_SCENES.length;
    const sceneStep = Math.max(Math.round(windowHeight * 0.62), 520);
    const videoTravel = (totalScenes - 1) * sceneStep;
    const dwellTravel = Math.round(windowHeight * 0.45);
    window.scrollTo({
      top: videoTravel + dwellTravel + windowHeight * 0.1,
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
  // La foto del drawer sale de la escena del producto seleccionado, no de la
  // escena en pantalla: asi sigue siendo correcta si se abre desde otro lugar.
  const drawerScene =
    LOOMERE_SCENES.find((s) => s.product.id === selectedProduct?.id) ?? currentScene;
  const sceneTextOpacity = isAtVideoSection ? 1 : 0;

  return (
    <div className="relative bg-[#060a15] text-white selection:bg-white/20 selection:text-white">
      {/* 1. SCROLL-DRIVEN VIDEO CONTAINER (300vh para viaje fluido y continuo) */}
      <div className="relative h-[300vh]" style={{ height: '300vh' }}>
        {/* Sticky Viewport pinned at top while scrolling the 4 scenes */}
        <div
          className="sticky top-0 w-full h-screen overflow-hidden cursor-default"
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
                    // Mismo anclaje que el video: si difieren, se ve un salto
                    // al reemplazar el poster por el clip.
                    style={
                      videoVariant === 'desktop' && scene.focusDesktop
                        ? { objectPosition: scene.focusDesktop }
                        : undefined
                    }
                    className="object-cover filter brightness-[0.85] contrast-[1.03]"
                  />

                  {/* Video continuo en loop de descanso (reproducción fluida sin saltos ni seeking forzado) */}
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
                      loop
                      muted
                      autoPlay
                      playsInline
                      preload="auto"
                      // El master es cuadrado: en 9:16 el centro funciona, en
                      // 16:9 algunas escenas necesitan subir el encuadre.
                      style={
                        videoVariant === 'desktop' && scene.focusDesktop
                          ? { objectPosition: scene.focusDesktop }
                          : undefined
                      }
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
            isActive={isAtVideoSection}
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

        </div>
      </div>

      {/* 2. PRODUCTOS DESTACADOS & OFERTAS FIRPLAK (Fondo blanco, renders limpios y paleta oficial) */}
      <FirplakFeaturedOffers />

      {/* 3. FOOTER CORPORATIVO & REGULATORIO (SIC / COLOMBIA) */}
      <FirplakGlobalFooter />

      {/* Product Detail Drawer */}
      <LoomereProductDrawer
        product={selectedProduct}
        imageSrc={drawerScene.productImage ?? drawerScene.fallbackImage}
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
