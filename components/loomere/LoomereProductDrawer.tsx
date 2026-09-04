'use client';

import React from 'react';
import Image from 'next/image';
import { X, Check, ShieldCheck, Sparkles, Ruler, Layers, MessageCircle } from 'lucide-react';
import { SceneProduct } from './sceneData';

interface LoomereProductDrawerProps {
  product: SceneProduct | null;
  imageSrc: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function LoomereProductDrawer({
  product,
  imageSrc,
  isOpen,
  onClose
}: LoomereProductDrawerProps) {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-xl h-full bg-[#0d1527]/95 border-l border-white/10 text-white shadow-2xl flex flex-col z-10 overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              {product.badge}
            </span>
            <span className="text-xs text-white/50">{product.category}</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Main Product Image Card */}
          <div className="relative w-full h-64 rounded-2xl overflow-hidden bg-black/40 border border-white/10 group">
            <Image
              src={imageSrc}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d1527] via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-4 left-4 right-4">
              <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400">
                FIRPLAK LUXURY COLLECTION
              </span>
              <h3 className="text-xl font-bold tracking-tight text-white">{product.name}</h3>
            </div>
          </div>

          {/* Pricing & Guarantee Bar */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-white/50 block">Precio Referencial</span>
              <span className="text-2xl font-bold text-white tracking-tight">{product.price}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
              <ShieldCheck className="w-4 h-4" />
              <span>Garantía de Fábrica</span>
            </div>
          </div>

          {/* Physical Attributes */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-white/50 text-xs">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>Materialidad</span>
              </div>
              <p className="text-xs font-medium text-white/90">{product.material}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-white/50 text-xs">
                <Ruler className="w-3.5 h-3.5 text-cyan-400" />
                <span>Dimensiones</span>
              </div>
              <p className="text-xs font-medium text-white/90">{product.dimensions}</p>
            </div>
          </div>

          {/* Specifications */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-white/60 font-semibold flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Especificaciones de Ingeniería
            </h4>
            <div className="space-y-2">
              {product.specs.map((spec, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-white/80">
                  <span className="p-0.5 rounded-full bg-cyan-500/20 text-cyan-400 mt-0.5">
                    <Check className="w-3 h-3" />
                  </span>
                  <span>{spec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Highlights */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-white/60 font-semibold">
              Beneficios Exclusivos
            </h4>
            <ul className="space-y-2">
              {product.features.map((feat, i) => (
                <li key={i} className="text-xs text-white/70 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/80" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-6 border-t border-white/10 bg-black/40 space-y-3">
          <a
            href={`https://wa.me/573000000000?text=Hola%20FIRPLAK,%20deseo%20cotizar%20y%20conocer%20disponibilidad%20de:%20${encodeURIComponent(product.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02]"
          >
            <MessageCircle className="w-4 h-4" />
            Cotizar por WhatsApp
          </a>
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors"
          >
            Continuar Explorando la Experiencia
          </button>
        </div>
      </div>
    </div>
  );
}
