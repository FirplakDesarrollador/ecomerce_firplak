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

      {/* 2. Solo un cuadro con efecto opacidad con texto, invitando a explorar la categoría (Imagen de referencia 1) */}
      <div data-interactive="true" className="max-w-md md:max-w-lg pointer-events-auto bg-black/60 backdrop-blur-xl p-6 sm:p-7 rounded-2xl border border-white/10 shadow-2xl space-y-3.5 mb-2">
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

        {/* Action button & Siguiente */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 mt-3">
          <button
            onClick={() => onOpenProduct(currentScene.product)}
            className="px-4 sm:px-5 py-2.5 rounded-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs hover:scale-105 transition-all duration-200 shadow-lg shadow-cyan-400/20 flex items-center gap-2"
          >
            <span>Inspeccionar Producto</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {onNextScene && (
            <button
              onClick={onNextScene}
              className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white transition-colors group"
            >
              <span>{currentSceneIndex < totalScenes - 1 ? 'Siguiente momento' : 'Ver atributos de marca'}</span>
              <ChevronDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
