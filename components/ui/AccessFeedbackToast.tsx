'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ExternalLink, Info, X } from 'lucide-react';

export interface AccessFeedbackDetail {
  title: string;
  url?: string;
  category?: string;
  note?: string;
}

export function triggerAccessFeedback(detail: AccessFeedbackDetail) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('firplak:access-feedback', { detail }));
  }
}

export default function AccessFeedbackToast() {
  const [current, setCurrent] = useState<AccessFeedbackDetail | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => setCurrent(null), 250);
  }, []);

  useEffect(() => {
    const onFeedback = (e: Event) => {
      const customEvent = e as CustomEvent<AccessFeedbackDetail>;
      setCurrent(customEvent.detail);
      setIsVisible(true);
    };

    window.addEventListener('firplak:access-feedback', onFeedback);
    return () => window.removeEventListener('firplak:access-feedback', onFeedback);
  }, []);

  // Auto hide after 4.5 seconds
  useEffect(() => {
    if (!isVisible) return;
    const timer = setTimeout(() => {
      handleClose();
    }, 4500);
    return () => clearTimeout(timer);
  }, [isVisible, handleClose]);

  if (!current) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`transition-all duration-300 ease-out transform pointer-events-auto ${
        isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95 pointer-events-none'
      }`}
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 100000,
        maxWidth: '420px',
        width: 'calc(100vw - 3rem)',
      }}
    >
      <div 
        className="relative overflow-hidden rounded-2xl p-4 text-white"
        style={{
          backgroundColor: 'rgba(70, 70, 70, 0.75)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.65)'
        }}
      >
        {/* Glow accent */}
        <div 
          className="absolute top-0 left-0 right-0 h-[2px]" 
          style={{ background: 'linear-gradient(to right, transparent, #22d3ee, transparent)' }} 
        />

        <div className="flex items-start gap-3">
          <div 
            className="p-2 rounded-xl text-cyan-300 shrink-0 mt-0.5"
            style={{ backgroundColor: 'rgba(34, 211, 238, 0.15)', border: '1px solid rgba(34, 211, 238, 0.3)' }}
          >
            <Info className="w-4 h-4" />
          </div>

          <div className="flex-1 min-w-0 pr-6">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400">
                {current.category || 'Acceso firplak.com'}
              </span>
              <span 
                className="text-[10px] px-2 py-0.5 rounded-full text-white/80 font-medium"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
              >
                En Integración
              </span>
            </div>

            <h5 className="text-sm font-semibold text-white mt-1 truncate">
              {current.title}
            </h5>

            {current.url && (
              <div className="flex items-center gap-1.5 mt-1 text-xs text-cyan-300/80 font-mono break-all line-clamp-1">
                <ExternalLink className="w-3 h-3 text-cyan-400 shrink-0" />
                <span className="truncate">{current.url}</span>
              </div>
            )}

            <p className="text-xs text-white/75 mt-1.5 leading-relaxed">
              {current.note || 'Este acceso está registrado en el mapa del sitio. No redirige por ahora.'}
            </p>
          </div>

          <button
            onClick={handleClose}
            className="absolute top-3 right-3 p-1.5 rounded-full text-white/40 hover:text-white transition-colors"
            style={{ backgroundColor: 'transparent' }}
            aria-label="Cerrar notificación"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
