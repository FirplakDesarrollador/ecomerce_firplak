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
  // Páginas de categoría con diseño oscuro cinematográfico propio
  const isDarkCategoryPage = pathname.startsWith('/categoria/hidromasajes');

  if (isLoomereHomePage || isDarkCategoryPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-full flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
