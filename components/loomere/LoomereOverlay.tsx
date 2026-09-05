'use client';

import React from 'react';
import { LoomereScene, SceneProduct } from './sceneData';
import { ChevronDown, ArrowRight } from 'lucide-react';

interface LoomereOverlayProps {
  currentScene: LoomereScene;
  currentSceneIndex: number;
  totalScenes: number;
  onOpenProduct: (product: SceneProduct) => void;
  onNextScene?: () => void;
}

export default function LoomereOverlay({
  currentScene,
  currentSceneIndex,
  totalScenes,
  onOpenProduct,
  onNextScene
}: LoomereOverlayProps) {
  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex flex-col justify-end p-6 sm:p-10 md:p-12">

      {/* 2. Cuadro con efecto de blur y opacidad (bg-black/60 y backdrop-blur-md) */}
      <div
        data-interactive="true"
        className="max-w-md md:max-w-lg pointer-events-auto p-6 sm:p-7 rounded-2xl shadow-2xl space-y-3.5 mb-2 bg-black/60 backdrop-blur-md border border-white/20"
        style={{
          backgroundColor: 'rgba(70, 70, 70, 0.6)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-cyan-400 font-semibold">
            <span>{currentScene.tag}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white drop-shadow-md leading-tight">
            {currentScene.headline}
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-white/75 leading-relaxed line-clamp-3">
          {currentScene.description}
        </p>

        {/* Action button único: Conoce los productos */}
        <div className="pt-2 flex items-center justify-center border-t border-white/20 mt-5">
          <button
            onClick={() => onOpenProduct(currentScene.product)}
            className="px-4 sm:px-5 py-2.5 rounded-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs hover:scale-105 transition-all duration-200 shadow-lg shadow-cyan-400/20 flex items-center gap-2"
          >
            <span>Conoce los productos</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
