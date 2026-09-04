'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const isLoomereHomePage = pathname === '/';

  if (isLoomereHomePage) {
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
