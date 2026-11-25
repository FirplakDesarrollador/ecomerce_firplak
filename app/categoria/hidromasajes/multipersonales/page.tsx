'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type CapacidadFiltro = 'todos' | '4' | '5' | '6' | '8';

interface Producto {
  nombre: string;
  modelo: string;
  personas: number;
  precio: string;
  precioNum: number;
  dimensiones: string;
  imagen: string;
  url: string;
}

const PRODUCTOS: Producto[] = [
  {
    nombre: 'Santorini',
    modelo: 'Basic de Empotrar 180×180',
    personas: 4,
    precio: '$9.158.320',
    precioNum: 9158320,
    dimensiones: '180 × 180 cm',
    imagen: 'https://www.firplak.com/wp-content/uploads/2017/09/HIDROMASAJE-SANTORINI-180-X-180-EMPOTRAR-blanca-iso-kit-limpieza-1200x1200.webp',
    url: 'https://www.firplak.com/producto/hidromasaje-santorini-basic-de-empotrar-180x180/',
  },
  {
    nombre: 'Mobu',
    modelo: 'Basic de Empotrar 200 cm',
    personas: 5,
    precio: '$9.615.920',
    precioNum: 9615920,
    dimensiones: '200 cm',
    imagen: 'https://www.firplak.com/wp-content/uploads/2024/11/HIDROMASAJE-MOBU-BASIC-DE-EMPOTRAR-200cm-1200x1200.jpg',
    url: 'https://www.firplak.com/producto/hidromasaje-mobu-basic-de-empotrar-200cm/',
  },
  {
    nombre: 'Galápagos',
    modelo: 'Basic de Empotrar 250×200',
    personas: 8,
    precio: '$10.074.320',
    precioNum: 10074320,
    dimensiones: '250 × 200 cm',
    imagen: 'https://www.firplak.com/wp-content/uploads/2023/05/HIDROMASAJE-GALAPAGOS-BASIC-DE-EMPOTRAR-250X200CM-1200x1200.jpg',
    url: 'https://www.firplak.com/producto/hidromasaje-galapagos-basic-de-empotrar-250x200cm/',
  },
  {
    nombre: 'Chatanoogan',
    modelo: 'Empotrar 200×200',
    personas: 6,
    precio: '$18.635.120',
    precioNum: 18635120,
    dimensiones: '200 × 200 cm',
    imagen: 'https://www.firplak.com/wp-content/uploads/2017/09/Hidromasaje-Chatanoogan-iso-Amb-empotrar-kit-1200x1200.jpg',
    url: 'https://www.firplak.com/producto/hidromasaje-chatanoogan-200-x-200-empotrar/',
  },
];

const SUBCATEGORIAS = [
  { label: 'Hidromasajes Indoor', href: '/categoria/hidromasajes' },
  { label: 'Freestanding', href: '/categoria/hidromasajes/freestanding' },
  { label: 'Multipersonales', href: '/categoria/hidromasajes/multipersonales', activo: true },
  { label: 'Tinas', href: '/categoria/hidromasajes/tinas' },
  { label: 'Accesorios', href: '/categoria/hidromasajes/accesorios' },
];

const FILTROS: { label: string; valor: CapacidadFiltro }[] = [
  { label: 'Todos', valor: 'todos' },
  { label: '4 personas', valor: '4' },
  { label: '5 personas', valor: '5' },
  { label: '6 personas', valor: '6' },
  { label: '8 personas', valor: '8' },
];

export default function MultipersonalesPage() {
  const [filtro, setFiltro] = useState<CapacidadFiltro>('todos');

  const productosFiltrados = PRODUCTOS
    .filter((p) => filtro === 'todos' || p.personas === Number(filtro))
    .sort((a, b) => a.precioNum - b.precioNum);

  return (
    <div className="min-h-screen bg-[#070c18] text-white">
      {/* Sub-navegación de categorías */}
      <nav className="border-b border-white/10 bg-[#070c18]/95 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center gap-0 overflow-x-auto scrollbar-hide">
            {SUBCATEGORIAS.map((sub) => (
              <li key={sub.href}>
                <Link
                  href={sub.href}
                  className={`block px-4 py-4 text-xs font-medium tracking-widest uppercase whitespace-nowrap transition-colors duration-200 ${
                    sub.activo
                      ? 'text-white border-b-2 border-white'
                      : 'text-white/40 hover:text-white/80'
                  }`}
                >
                  {sub.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs tracking-[0.3em] uppercase text-white/40 mb-4">
            Hidromasajes · Colección
          </p>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-light leading-tight mb-6"
            style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}
          >
            Multipersonales
          </h1>
          <p className="text-white/50 text-sm sm:text-base max-w-xl leading-relaxed">
            Diseñados para compartir. Desde 4 hasta 8 personas en un espacio de relajación sin
            igual, con tecnología de hidromasaje profesional.
          </p>
        </div>
      </section>

      {/* Filtros de capacidad */}
      <section className="px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs tracking-[0.25em] uppercase text-white/30 mb-4">
            Filtrar por capacidad
          </p>
          <div className="flex flex-wrap gap-2">
            {FILTROS.map(({ label, valor }) => (
              <button
                key={valor}
                onClick={() => setFiltro(valor)}
                className={`px-5 py-2 text-xs tracking-widest uppercase font-medium rounded-full border transition-all duration-200 ${
                  filtro === valor
                    ? 'bg-white text-[#070c18] border-white'
                    : 'bg-transparent text-white/50 border-white/20 hover:border-white/60 hover:text-white/80'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grilla de productos */}
      <section id="productos" className="px-4 sm:px-6 lg:px-8 pb-24">
        <div className="max-w-7xl mx-auto">
          {productosFiltrados.length === 0 ? (
            <p className="text-white/30 text-sm py-16 text-center">
              No hay productos para esta selección.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {productosFiltrados.map((producto) => (
                <article
                  key={producto.nombre}
                  className="group flex flex-col bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/25 transition-all duration-300"
                >
                  {/* Imagen */}
                  <div className="relative aspect-square bg-white/5 overflow-hidden">
                    <Image
                      src={producto.imagen}
                      alt={`Hidromasaje ${producto.nombre} ${producto.dimensiones}`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Badge de capacidad */}
                    <span className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-white/80 text-[10px] tracking-widest uppercase px-3 py-1 rounded-full border border-white/10">
                      {producto.personas} personas
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex flex-col flex-1 p-5 gap-3">
                    <div>
                      <h2
                        className="text-lg font-light leading-snug"
                        style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}
                      >
                        {producto.nombre}
                      </h2>
                      <p className="text-white/40 text-xs mt-0.5">{producto.modelo}</p>
                    </div>

                    <p className="text-white/30 text-xs tracking-wide">{producto.dimensiones}</p>

                    <div className="mt-auto pt-3 border-t border-white/10 flex items-end justify-between gap-2">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-white/30 mb-0.5">
                          Desde
                        </p>
                        <p className="text-white font-medium text-base">{producto.precio}</p>
                      </div>
                      <a
                        href={producto.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 px-4 py-2 text-[10px] tracking-widest uppercase font-medium border border-white/30 rounded-full text-white/70 hover:bg-white hover:text-[#070c18] hover:border-white transition-all duration-200"
                      >
                        Ver
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
