'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, ArrowUpRight } from 'lucide-react';

interface LoomereCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES = [
  {
    name: 'Bañeras & Spas',
    desc: 'Oasis de relajación y bienestar hidromasaje',
    image: '/cat-baneras.webp',
    href: '/categoria/baneras-y-spas'
  },
  {
    name: 'Lavamanos',
    desc: 'Piezas esculturales en mármol sintético',
    image: '/cat-lavamanos.webp',
    href: '/categoria/lavamanos'
  },
  {
    name: 'Cocinas',
    desc: 'Diseño integral con mesones de cuarzo y herrajes RH',
    image: '/cat-cocinas.webp',
    href: '/categoria/cocinas'
  },
  {
    name: 'Zona de Labores',
    desc: 'Lavaderos ergonómicos de alta resistencia',
    image: '/cat-lavadero.webp',
    href: '/categoria/zona-de-labores'
  }
];

export default function LoomereCatalogModal({ isOpen, onClose }: LoomereCatalogModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />

      <div className="relative w-full max-w-5xl bg-[#090f1d] border border-white/15 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-10 z-10 space-y-8 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-white/10 pb-6">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-cyan-400 font-semibold block">
              Catálogo Integral Firplak
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Explorar Nuestras Colecciones
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((cat, i) => (
            <Link
              key={i}
              href={cat.href}
              className="group relative rounded-2xl overflow-hidden border border-white/10 bg-white/[0.02] hover:border-cyan-400/50 transition-all duration-300 flex flex-col h-72"
            >
              <div className="relative w-full h-44 bg-black/30 overflow-hidden">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090f1d] via-transparent to-transparent" />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors flex items-center justify-between">
                    <span>{cat.name}</span>
                    <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </h4>
                  <p className="text-xs text-white/60 mt-1 line-clamp-2">
                    {cat.desc}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-white/50">
          <span>FIRPLAK © 2026 — Líderes en innovación de diseño y superficies en Colombia</span>
          <a
            href="https://wa.me/573000000000"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:underline font-semibold"
          >
            ¿Necesitas un proyecto institucional o a medida? Contáctanos
          </a>
        </div>
      </div>
    </div>
  );
}
