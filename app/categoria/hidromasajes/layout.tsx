'use client';

import { useState } from 'react';
import LoomereNavbar from '@/components/loomere/LoomereNavbar';
import LoomereMegamenu from '@/components/loomere/LoomereMegamenu';
import FirplakGlobalFooter from '@/components/layout/FirplakGlobalFooter';

export default function HidromasajesLayout({ children }: { children: React.ReactNode }) {
  const [isMegamenuOpen, setIsMegamenuOpen] = useState(false);

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #09111f 0%, #060c18 60%, #04080f 100%)' }}>
      <LoomereNavbar
        currentSceneIndex={0}
        directCategories
        onOpenMegamenu={() => setIsMegamenuOpen(true)}
      />

      <LoomereMegamenu
        isOpen={isMegamenuOpen}
        onClose={() => setIsMegamenuOpen(false)}
      />

      {/* pt: 48px navbar mobile + 0 categories / 60px navbar desktop + 50px categories */}
      <main className="pt-12 sm:pt-[108px]">
        {children}
      </main>

      <FirplakGlobalFooter />
    </div>
  );
}
