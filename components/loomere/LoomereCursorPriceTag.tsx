'use client';

import React, { useEffect, useRef, useState } from 'react';
import { SceneProduct } from './sceneData';
import { Sparkles, ArrowRight } from 'lucide-react';

interface LoomereCursorPriceTagProps {
  product: SceneProduct;
  isActive: boolean;
}

export default function LoomereCursorPriceTag({
  product,
  isActive
}: LoomereCursorPriceTagProps) {
  const tagRef = useRef<HTMLDivElement>(null);
  const targetPos = useRef({ x: -400, y: -400 });
  const currentPos = useRef({ x: -400, y: -400 });
  const [isVisible, setIsVisible] = useState(false);
  const [isOverInteractive, setIsOverInteractive] = useState(false);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Si el mouse está sobre botones, enlaces u otros controles interactivos, atenuar ligeramente
      const target = e.target as HTMLElement | null;
      const overInteractive = !!target?.closest('button, a, input, [data-interactive]');
      setIsOverInteractive(overInteractive);

      const padding = 16;
      const estimatedWidth = 340;
      const estimatedHeight = 44;

      let x = e.clientX + padding;
      let y = e.clientY + padding;

      // Invertir posición si se acerca al borde derecho de la pantalla
      if (e.clientX + estimatedWidth + padding > window.innerWidth) {
        x = e.clientX - estimatedWidth - 10;
      }

      // Invertir posición si se acerca al borde inferior de la pantalla
      if (e.clientY + estimatedHeight + padding > window.innerHeight) {
        y = e.clientY - estimatedHeight - 10;
      }

      targetPos.current = { x, y };

      if (!isVisible) {
        currentPos.current = { x, y };
        setIsVisible(true);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    // Interpolación de inercia suave (Lerp a 60/120fps vía DOM directo)
    const lerp = (start: number, end: number, factor: number) =>
      start + (end - start) * factor;

    const animate = () => {
      currentPos.current.x = lerp(currentPos.current.x, targetPos.current.x, 0.22);
      currentPos.current.y = lerp(currentPos.current.y, targetPos.current.y, 0.22);

      if (tagRef.current) {
        tagRef.current.style.transform = `translate3d(${currentPos.current.x}px, ${currentPos.current.y}px, 0)`;
      }

      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [isVisible]);

  const shouldShow = isActive && isVisible;

  return (
    <div
      ref={tagRef}
      className="fixed top-0 left-0 z-50 pointer-events-none select-none transition-opacity duration-300 will-change-transform"
      style={{
        opacity: shouldShow ? (isOverInteractive ? 0.2 : 1) : 0,
        transform: `translate3d(${currentPos.current.x}px, ${currentPos.current.y}px, 0)`
      }}
    >
      {/* Tag slim minimalista idéntico al señalado */}
      <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white shadow-2xl">
        <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse flex-shrink-0" />
        <span className="text-xs font-medium text-white/95 whitespace-nowrap">
          {product.name}
        </span>
        <span className="text-xs font-semibold text-white/75 whitespace-nowrap">
          {product.price}
        </span>
        <ArrowRight className="w-3.5 h-3.5 text-white/60 flex-shrink-0" />
      </div>
    </div>
  );
}
