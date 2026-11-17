'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { triggerAccessFeedback } from '@/components/ui/AccessFeedbackToast';

export interface FirplakOfferProduct {
  id: string;
  name: string;
  category: string;
  originalPrice: number;
  salePrice: number;
  discountPercent: number;
  savings: number;
  imageUrl: string;
  productUrl: string;
  hasOptions?: boolean;
}

// Productos oficiales y renders limpios extraídos directamente de firplak.com
const FEATURED_OFFERS: FirplakOfferProduct[] = [
  {
    id: 'opalo-150',
    name: 'MUEBLE SUPERIOR DE COCINA ÓPALO COLOR HUMO / 150X55CM',
    category: 'Cocinas',
    originalPrice: 387460,
    salePrice: 309968,
    discountPercent: 20,
    savings: 77492,
    imageUrl: 'https://www.firplak.com/wp-content/uploads/2024/05/Mueble-superior-cocina-Opalo-150-Humo-400x400.webp',
    productUrl: 'https://www.firplak.com/producto/mueble-superior-de-cocina-integral-opalo-ambar-150x55cm/'
  },
  {
    id: 'oslo-godai-63',
    name: 'LAVAMANOS OSLO CON MUEBLE GODAI PISO 63X48cm LM',
    category: 'Baños',
    originalPrice: 699700,
    salePrice: 629800,
    discountPercent: 10,
    savings: 69900,
    imageUrl: 'https://www.firplak.com/wp-content/uploads/2025/08/Mueble-godai-con-lavamanos-oslo-63x48-trib-1-400x400.webp',
    productUrl: 'https://www.firplak.com/producto/lavamanos-con-mueble-de-piso-de-63x48cm-lm/'
  },
  {
    id: 'aroma-marfil-84',
    name: 'LAVAPLATOS AROMA MARFIL DE SOBRE PONER GRIF8 / 84X56CM',
    category: 'Cocinas',
    originalPrice: 677900,
    salePrice: 237265,
    discountPercent: 65,
    savings: 440635,
    imageUrl: 'https://www.firplak.com/wp-content/uploads/2025/08/LVP-AROMA-MARFIL-84X56cm-Amb-WEB-400x400.webp',
    productUrl: 'https://www.firplak.com/producto/lavaplatos-aroma-marfil-de-sobre-poner-grif8-84x56cm/',
    hasOptions: true
  },
  {
    id: 'mueble-pro-lavadora',
    name: 'MUEBLE PRO PARA LAVADORA 140x60CM',
    category: 'Zona de Ropas',
    originalPrice: 950900,
    salePrice: 665630,
    discountPercent: 30,
    savings: 285270,
    imageUrl: 'https://www.firplak.com/wp-content/uploads/2024/05/Mueble-con-LVR-PRO-140x60-LAVADORA-Blanco-WEB-400x400.webp',
    productUrl: 'https://www.firplak.com/producto/mueble-pro-rh-para-lavadora-140x60cm/'
  },
  {
    id: 'siena-basico-elevado',
    name: 'LAVAMANOS SIENA + MUEBLE BÁSICO ELEVADO 124X48cm TABACO CHIC LM',
    category: 'Baños',
    originalPrice: 1507800,
    salePrice: 1007500,
    discountPercent: 33,
    savings: 500300,
    imageUrl: 'https://www.firplak.com/wp-content/uploads/2024/05/LVM-SIENA-MUEBLE-BASICO-ELEVADO-124X48-TABACO-CHIC-WEB-400x400.jpg',
    productUrl: 'https://www.firplak.com/producto/lavamanos-siena-mueble-basico-elevado-124x48cm-tabaco-chic-lm/'
  },
  {
    id: 'espejo-marco-nuez',
    name: 'ESPEJO CON MARCO COLOR NUEZ / 48x63cm',
    category: 'Baños',
    originalPrice: 112900,
    salePrice: 101610,
    discountPercent: 10,
    savings: 11290,
    imageUrl: 'https://www.firplak.com/wp-content/uploads/2024/05/Espejo-con-marco-48x63-Nuez-WEB-400x400.webp',
    productUrl: 'https://www.firplak.com/producto/espejopara-bano-con-marco-color-nuez-48x63cm/'
  },
  {
    id: 'ocean-79',
    name: 'LAVAMANOS OCEAN 79X56 cm',
    category: 'Baños',
    originalPrice: 297900,
    salePrice: 119160,
    discountPercent: 60,
    savings: 178740,
    imageUrl: 'https://www.firplak.com/wp-content/uploads/2024/05/LVM-Ocean-79x56cm-Blanco-Planta-WEB-400x400.webp',
    productUrl: 'https://www.firplak.com/producto/lavamanos-ocean-79x48-cm/'
  },
  {
    id: 'oslo-marfil-100',
    name: 'LAVAMANOS OSLO COLOR MARFIL / 100x50cm',
    category: 'Baños',
    originalPrice: 756900,
    salePrice: 302760,
    discountPercent: 60,
    savings: 454140,
    imageUrl: 'https://www.firplak.com/wp-content/uploads/2024/05/LVM-Oslo-100x50cm-Marfil-WEB-400x400.webp',
    productUrl: 'https://www.firplak.com/producto/lavamanos-oslo-100x50cm/'
  },
  {
    id: 'tahiti-spa',
    name: 'HIDROMASAJE TAHITI SPA 180X120CM',
    category: 'Hidromasajes',
    originalPrice: 7490000,
    salePrice: 5992000,
    discountPercent: 20,
    savings: 1498000,
    imageUrl: 'https://www.firplak.com/wp-content/uploads/2026/04/Seccion-Novedades-Hidromasaje-Tahiti-Spa-400x400.webp',
    productUrl: 'https://www.firplak.com/categoria-producto/jacuzzis-e-hidromasajes/'
  }
];

export default function FirplakFeaturedOffers() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calibrar número de elementos visibles según pantalla
  useEffect(() => {
    const updateCount = () => {
      if (window.innerWidth < 640) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(3);
      }
    };
    updateCount();
    window.addEventListener('resize', updateCount);
    return () => window.removeEventListener('resize', updateCount);
  }, []);

  const maxIndex = Math.max(0, FEATURED_OFFERS.length - visibleCount);

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const handleProductAction = (product: FirplakOfferProduct) => {
    triggerAccessFeedback({
      title: product.hasOptions ? `Ver Opciones: ${product.name}` : `Comprar: ${product.name}`,
      url: product.productUrl,
      category: product.category,
      note: 'Redirección a compra oficial en Firplak.com'
    });
  };

  return (
    <section 
      aria-label="Ofertas y Productos Destacados Firplak" 
      className="bg-[#FFFFFF] text-[#1E293B] py-16 sm:py-24 px-4 sm:px-6 lg:px-12 border-t border-slate-100 relative z-20"
    >
      <div className="max-w-[1440px] mx-auto space-y-8">
        {/* Carrusel de Productos con Controles Laterales */}
        <div className="relative">
          {/* Botón Anterior Flotante Lateral */}
          <button
            onClick={prevSlide}
            disabled={currentIndex === 0}
            aria-label="Ver productos anteriores"
            className={`absolute -left-2 sm:-left-5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full flex items-center justify-center bg-white border border-slate-200/90 shadow-lg text-slate-700 transition-all ${
              currentIndex === 0
                ? 'opacity-0 pointer-events-none'
                : 'hover:bg-slate-50 hover:scale-105 hover:border-slate-400 cursor-pointer'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Carrusel */}
          <div ref={containerRef} className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-out -mx-3"
              style={{
                transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`
              }}
            >
              {FEATURED_OFFERS.map((product) => (
              <div 
                key={product.id}
                className="px-3 shrink-0"
                style={{ width: `${100 / visibleCount}%` }}
              >
                <article 
                  onClick={() => handleProductAction(product)}
                  tabIndex={0}
                  role="button"
                  aria-label={`Ver producto: ${product.name}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleProductAction(product);
                    }
                  }}
                  className="group h-full flex flex-col bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] hover:border-slate-300 transition-all duration-300 overflow-hidden cursor-pointer"
                >
                  
                  {/* IMAGEN DEL PRODUCTO: 100% LIMPIA Y SIN INTERVENCIONES */}
                  <div className="relative aspect-square w-full bg-[#F8F9FA] flex items-center justify-center p-6 border-b border-slate-100">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* CONTENEDOR INFERIOR: DESCUENTO, NOMBRE Y PRECIO */}
                  <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between gap-4">
                    <div className="space-y-3">
                      {/* Etiqueta de descuento con paleta oficial */}
                      <div className="flex items-center justify-end">
                        <span 
                          className="px-2.5 py-0.5 rounded-full text-xs font-bold text-white shadow-xs"
                          style={{ backgroundColor: '#7B8E90' }}
                        >
                          {product.discountPercent}% OFF
                        </span>
                      </div>

                      {/* Nombre oficial del producto */}
                      <h3 className="text-sm font-bold text-[#0F172A] leading-snug line-clamp-2 group-hover:text-[#324354] transition-colors">
                        {product.name}
                      </h3>
                    </div>

                    {/* Precio final destacado */}
                    <div className="pt-2">
                      <span className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
                        ${product.salePrice.toLocaleString('es-CO')}
                      </span>
                    </div>

                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>

        {/* Botón Siguiente Flotante Lateral */}
        <button
          onClick={nextSlide}
          disabled={currentIndex >= maxIndex}
          aria-label="Ver productos siguientes"
          className={`absolute -right-2 sm:-right-5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full flex items-center justify-center bg-white border border-slate-200/90 shadow-lg text-slate-700 transition-all ${
            currentIndex >= maxIndex
              ? 'opacity-0 pointer-events-none'
              : 'hover:bg-slate-50 hover:scale-105 hover:border-slate-400 cursor-pointer'
          }`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

        {/* Indicadores de Paginación (Dots) */}
        <div className="flex justify-center items-center gap-2 pt-2">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Ir a grupo de ofertas ${index + 1}`}
              className={`h-2.5 rounded-full transition-all cursor-pointer ${
                currentIndex === index 
                  ? 'w-8 bg-[#324354]' 
                  : 'w-2.5 bg-slate-200 hover:bg-slate-300'
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
