'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { LOOMERE_SCENES, SceneProduct } from './sceneData';
import LoomereNavbar from './LoomereNavbar';
import LoomereOverlay from './LoomereOverlay';
import LoomereProductDrawer from './LoomereProductDrawer';
import LoomereCatalogModal from './LoomereCatalogModal';
import LoomereCursorPriceTag from './LoomereCursorPriceTag';
import FirplakKeyFeatures from '@/components/home/FirplakKeyFeatures';

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

      {/* 2. KEY FEATURES & ATRIBUTOS DE MARCA FIRPLAK (Fondo degradado oscuro, Apple design y Humanizer) */}
      <FirplakKeyFeatures onOpenCatalog={() => setIsCatalogOpen(true)} />

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
