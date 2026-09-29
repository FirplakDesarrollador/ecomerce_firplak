'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  LayoutGrid,
  Phone,
  User,
  ShoppingCart,
  ShoppingBag,
  ArrowUpRight
} from 'lucide-react';
import FirplakLogo from '@/components/layout/FirplakLogo';
import { LOOMERE_SCENES } from './sceneData';
import { triggerAccessFeedback } from '@/components/ui/AccessFeedbackToast';

interface LoomereNavbarProps {
  currentSceneIndex: number;
  onOpenMegamenu: () => void;
}

export default function LoomereNavbar({
  currentSceneIndex,
  onOpenMegamenu
}: LoomereNavbarProps) {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleTopAccess = (title: string, url: string, category: string) => {
    triggerAccessFeedback({
      title,
      url,
      category,
      note: 'Acceso registrado en la cabecera institucional. Redirección deshabilitada en esta fase.'
    });
  };

  const handleContactClick = (title: string, url: string) => {
    triggerAccessFeedback({
      title,
      url,
      category: 'Contacto & Atención',
      note: 'Canal de atención oficial de Firplak. Redirección deshabilitada en esta fase.'
    });
  };

  return (
    <>
      {isContactOpen && (
        <div
          className="fixed inset-0 z-60"
          onClick={() => setIsContactOpen(false)}
        />
      )}
      <header
        className="fixed top-0 left-0 w-full z-50 transition-all duration-300"
        style={{
          backgroundColor: 'rgba(70, 70, 70, 0.6)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
        }}
      >
        {/* Header Único: Navegación Principal con Marca FIRPLAK */}
        <div className="max-w-[1620px] mx-auto px-4 sm:px-8 h-16 sm:h-20 flex items-center justify-between relative">

          {/* Left: Categorías Trigger Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenMegamenu}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-cyan-500/15 border border-cyan-400/30 text-cyan-200 hover:bg-cyan-500/25 hover:scale-105 transition-all duration-200 shadow-lg shadow-cyan-950/40"
              aria-label="Abrir catálogo y categorías"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-cyan-400" />
              <span>Categorías</span>
            </button>
          </div>

          {/* Center: Logo FIRPLAK */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-auto">
            <Link href="/" className="flex items-center group">
              <div className="flex items-center h-[18px]">
                <FirplakLogo height={18} letterSpacing="0.48em" color="#ffffff" className="group-hover:scale-105 transition-transform" />
              </div>
            </Link>
          </div>

          {/* Right: Contact Trigger, Account & Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* WhatsApp & Contact Trigger */}
            <button
              onClick={() => {
                setIsContactOpen(!isContactOpen);
                if (isCartOpen) setIsCartOpen(false);
              }}
              className={`p-2 sm:px-3 sm:py-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 flex items-center gap-1.5 ${isContactOpen ? 'bg-white/20 text-white ring-1 ring-white/30' : ''
                }`}
              aria-label="Líneas de contacto y WhatsApp"
              title="Líneas de Contacto & WhatsApp"
            >
              <div className="relative flex items-center justify-center">
                <Phone className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-xs font-medium hidden md:inline">Contacto</span>
            </button>

            {/* User / Mi Cuenta Button */}
            <button
              onClick={() => handleTopAccess('Mi Cuenta / Login', '/mi-cuenta/', 'Portal Usuario')}
              className="p-2 sm:px-3 sm:py-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 flex items-center gap-1.5"
              aria-label="Mi Cuenta"
              title="Mi Cuenta"
            >
              <User className="w-4 h-4 text-white/80" />
              <span className="text-xs font-medium hidden md:inline">Ingresar</span>
            </button>

            {/* Cart / Carrito Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsCartOpen(!isCartOpen);
                  if (isContactOpen) setIsContactOpen(false);
                }}
                className={`p-2 sm:px-3 sm:py-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 flex items-center gap-1.5 group ${isCartOpen ? 'bg-white/15 text-white ring-1 ring-cyan-400/50' : ''
                  }`}
                aria-label="Carrito de Compras"
                title="Carrito de Compras"
              >
                <div className="relative flex items-center justify-center">
                  <ShoppingCart className="w-4 h-4 text-white/80 group-hover:text-white transition-colors" />
                  <span className="absolute -top-1.5 -right-2 flex h-3.5 min-w-3.5 px-0.5 items-center justify-center rounded-full bg-cyan-400 text-[8px] font-extrabold text-black ring-1 ring-zinc-900 shadow-sm">
                    0
                  </span>
                </div>
                <span className="text-xs font-medium hidden md:inline">Carrito</span>
              </button>

              {isCartOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsCartOpen(false)}
                  />
                  <div
                    className="absolute right-0 mt-2 w-80 sm:w-96 py-4 px-4 rounded-2xl shadow-2xl z-50 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200"
                    style={{
                      backgroundColor: 'rgba(70, 70, 70, 0.65)',
                      backdropFilter: 'blur(16px)',
                      WebkitBackdropFilter: 'blur(16px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)'
                    }}
                  >
                    <div
                      className="pb-2.5 text-[10px] font-semibold uppercase tracking-widest text-cyan-400/90 flex items-center justify-between gap-2"
                      style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.15)' }}
                    >
                      <div className="flex items-center gap-1.5 whitespace-nowrap">
                        <ShoppingBag className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span className="whitespace-nowrap">Tu Carrito de Compras</span>
                      </div>
                      <span className="text-[10px] text-white/60 font-mono whitespace-nowrap shrink-0">0 productos</span>
                    </div>

                    {/* Estado Carrito Vacío */}
                    <div className="py-6 flex flex-col items-center justify-center text-center space-y-3">
                      <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 shadow-inner">
                        <ShoppingCart className="w-6 h-6 text-cyan-300/60" />
                      </div>
                      <div className="space-y-1 max-w-[250px]">
                        <p className="text-sm font-semibold text-white">Tu carrito está vacío</p>
                        <p className="text-xs text-white/60 leading-relaxed">
                          Explora bañeras con hidromasaje, lavamanos y spas para comenzar tu compra.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setIsCartOpen(false);
                          onOpenMegamenu();
                        }}
                        className="mt-1 py-2 px-4 rounded-xl text-xs font-semibold bg-cyan-500/20 border border-cyan-400/40 text-cyan-200 hover:bg-cyan-500/30 hover:scale-105 transition-all shadow-md flex items-center gap-1.5"
                      >
                        <LayoutGrid className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Explorar Categorías</span>
                      </button>
                    </div>

                    {/* Footer del Desplegable */}
                    <div
                      className="pt-3 flex items-center justify-between"
                      style={{ borderTop: '1px solid rgba(255, 255, 255, 0.15)' }}
                    >
                      <div>
                        <span className="text-[10px] text-white/50 uppercase tracking-wider block font-semibold">Subtotal</span>
                        <span className="text-sm font-bold text-white font-mono">$0 COP</span>
                      </div>
                      <button
                        onClick={() => {
                          handleTopAccess('Carrito de Compras', '/carrito/', 'Transaccional');
                          setIsCartOpen(false);
                        }}
                        className="py-2 px-3 rounded-xl text-xs font-semibold text-cyan-300 hover:text-white hover:bg-cyan-500/20 transition-all flex items-center gap-1"
                        style={{
                          backgroundColor: 'rgba(34, 211, 238, 0.1)',
                          border: '1px solid rgba(34, 211, 238, 0.25)'
                        }}
                      >
                        <span>Ir al Carrito</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

          </div>

        </div>

        {/* Franja de Contacto Expandible: Animación CSS Grid 0fr -> 1fr */}
        <div
          className="grid transition-[grid-template-rows,opacity] duration-300 ease-out"
          style={{
            gridTemplateRows: isContactOpen ? '1fr' : '0fr',
            opacity: isContactOpen ? 1 : 0,
            pointerEvents: isContactOpen ? 'auto' : 'none'
          }}
        >
          <div className="overflow-hidden">
            <div className="max-w-[1620px] mx-auto px-4 sm:px-8 pb-6 pt-1 relative flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6 text-xs sm:text-[13px] tracking-wide text-white">
              {/* Watsapp */}
              <a
                href="https://wa.me/573158173390?text=Hola%20FIRPLAK,%20deseo%20asesor%C3%ADa%20sobre%20sus%20productos."
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleContactClick('Watsapp', 'https://wa.me/573158173390')}
                className="hover:text-emerald-400 transition-colors whitespace-nowrap"
              >
                Watsapp +57 3158173390
              </a>

              {/* Ventas: Alineado milimétricamente con el centro del logo FIRPLAK */}
              <div
                className="whitespace-nowrap flex items-center gap-1.5 pointer-events-auto"
                style={{
                  position: 'absolute',
                  left: '50%',
                  transform: 'translateX(-50%)'
                }}
              >
                <span>Ventas</span>
                <a
                  href="tel:+573158173390"
                  onClick={() => handleContactClick('Línea Ventas PBX 1', 'tel:+573158173390')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  +57 315 817 3390
                </a>
                <span className="text-white/40">/</span>
                <a
                  href="tel:+573176650987"
                  onClick={() => handleContactClick('Línea Ventas Móvil 2', 'tel:+573176650987')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  +57 317 665 0987
                </a>
              </div>

              {/* Servicio al Cliente */}
              <div className="whitespace-nowrap flex items-center gap-1.5 sm:ml-auto">
                <span>Servicio al Cliente</span>
                <a
                  href="tel:+6044441771"
                  onClick={() => handleContactClick('Conmutador General', 'tel:+6044441771')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  +57 (604) 444 1771 Llamar (Opcion 2)
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar under navbar */}
        <div className="w-full h-[1.5px] relative overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 transition-all duration-300 ease-out"
            style={{
              width: `${((currentSceneIndex + 1) / LOOMERE_SCENES.length) * 100}%`
            }}
          />
        </div>
      </header>
    </>
  );
}
