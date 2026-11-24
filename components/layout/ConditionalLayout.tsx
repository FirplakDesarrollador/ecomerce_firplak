'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import { RUTA_ESTUDIO_D } from '@/components/banos-muebles/rutas';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const isLoomereHomePage = pathname === '/';
  // El estudio Mix & Match de Alejandro trae su propio navbar (Loomere), como el home.
  const isEstudioAlejandro = pathname === RUTA_ESTUDIO_D || pathname === `${RUTA_ESTUDIO_D}/`;

  if (isLoomereHomePage || isEstudioAlejandro) {
    return <main className="min-h-screen bg-[#070c18]">{children}</main>;
  }

  return (
    <div className="min-h-full flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
