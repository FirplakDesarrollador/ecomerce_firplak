import Link from 'next/link';
import Image from 'next/image';
import { Search, ShoppingCart, User, Phone, PhoneCall } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="w-full bg-white shadow-sm font-sans z-50 sticky top-0">
      {/* Promo Bar */}
      <div className="w-full bg-zinc-900 text-white py-2 text-center text-xs font-semibold tracking-wider uppercase">
        <p>Envío rápido en lavamanos con mueble | <Link href="/catalogo" className="underline hover:text-gray-300">Ver todo</Link></p>
      </div>

      {/* Deck 1: Upper Navbar */}
      <div className="border-b border-zinc-100 hidden lg:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          
          {/* Left: Contact Info */}
          <div className="flex items-center gap-6 text-xs text-zinc-600 font-medium">
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#254153]" />
              <span>Ventas: +57 315 817 3390</span>
            </div>
            <div className="flex items-center gap-2">
              <PhoneCall className="w-3.5 h-3.5 text-[#254153]" />
              <span>Servicio al cliente: +604 444 1771 Opción 2</span>
            </div>
          </div>

          {/* Center: Logo */}
          <div className="flex justify-center absolute left-1/2 transform -translate-x-1/2">
            <Link href="/" className="group">
              <Image 
                src="/logo.webp" 
                alt="Firplak Logo" 
                width={150} 
                height={50} 
                className="object-contain filter invert brightness-0 transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
          </div>

          {/* Right: Auxiliary Links */}
          <div className="flex items-center gap-4 text-xs font-semibold text-zinc-500 uppercase tracking-wide">
            <Link href="/contacto" className="hover:text-[#254153] transition-colors">Contacto</Link>
            <Link href="/catalogos" className="hover:text-[#254153] transition-colors">Catálogos</Link>
            <Link href="/nosotros" className="hover:text-[#254153] transition-colors">Acerca de Firplak</Link>
          </div>

        </div>
      </div>

      {/* Deck 2: Main Navigation */}
      <div className="bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Left: Categories (Desktop) */}
          <nav className="hidden lg:flex gap-8 items-center h-full">
            <Link href="/categoria/hidromasajes" className="text-sm font-bold text-[#254153] hover:text-[#1d3342] transition-colors py-5 border-b-2 border-transparent hover:border-[#254153]">Hidromasajes</Link>
            <Link href="/categoria/banos" className="text-sm font-bold text-[#254153] hover:text-[#1d3342] transition-colors py-5 border-b-2 border-transparent hover:border-[#254153]">Baños</Link>
            <Link href="/categoria/zona-labores" className="text-sm font-bold text-[#254153] hover:text-[#1d3342] transition-colors py-5 border-b-2 border-transparent hover:border-[#254153]">Zona de labores</Link>
            <Link href="/categoria/cocinas" className="text-sm font-bold text-[#254153] hover:text-[#1d3342] transition-colors py-5 border-b-2 border-transparent hover:border-[#254153]">Cocinas</Link>
            <Link href="/categoria/accesorios" className="text-sm font-bold text-[#254153] hover:text-[#1d3342] transition-colors py-5 border-b-2 border-transparent hover:border-[#254153]">Accesorios</Link>
            <Link href="/categoria/outdoor" className="text-sm font-bold text-[#254153] hover:text-[#1d3342] transition-colors py-5 border-b-2 border-transparent hover:border-[#254153]">Zona Outdoor</Link>
          </nav>

          {/* Mobile Logo (Visible only on mobile) */}
          <div className="flex lg:hidden items-center">
            <Link href="/">
              <Image 
                src="/logo.webp" 
                alt="Firplak Logo" 
                width={120} 
                height={40} 
                className="object-contain filter invert brightness-0"
              />
            </Link>
          </div>

          {/* Right: Utility Icons */}
          <div className="flex items-center gap-5 ml-auto">
            <button className="text-zinc-700 hover:text-[#254153] hover:scale-110 transition-all" aria-label="Search">
              <Search className="h-5 w-5" />
            </button>
            <button className="text-zinc-700 hover:text-[#254153] hover:scale-110 transition-all hidden sm:flex items-center gap-2 group" aria-label="Account">
              <User className="h-5 w-5" />
              <span className="text-xs font-semibold text-zinc-500 group-hover:text-[#254153]">Ingresar</span>
            </button>
            <button className="relative text-zinc-700 hover:text-[#254153] hover:scale-110 transition-all group" aria-label="Cart">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#bf2712] text-[9px] font-bold text-white shadow-sm group-hover:bg-[#a0200e] transition-colors">0</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
