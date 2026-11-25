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
    modelo: 'Basic de Empotrar',
    personas: 4,
    precio: '$9.158.320',
    precioNum: 9158320,
    dimensiones: '180 × 180 cm',
    imagen: 'https://www.firplak.com/wp-content/uploads/2017/09/HIDROMASAJE-SANTORINI-180-X-180-EMPOTRAR-blanca-iso-kit-limpieza-1200x1200.webp',
    url: 'https://www.firplak.com/producto/hidromasaje-santorini-basic-de-empotrar-180x180/',
  },
  {
    nombre: 'Mobu',
    modelo: 'Basic de Empotrar',
    personas: 5,
    precio: '$9.615.920',
    precioNum: 9615920,
    dimensiones: '200 cm',
    imagen: 'https://www.firplak.com/wp-content/uploads/2024/11/HIDROMASAJE-MOBU-BASIC-DE-EMPOTRAR-200cm-1200x1200.jpg',
    url: 'https://www.firplak.com/producto/hidromasaje-mobu-basic-de-empotrar-200cm/',
  },
  {
    nombre: 'Galápagos',
    modelo: 'Basic de Empotrar',
    personas: 8,
    precio: '$10.074.320',
    precioNum: 10074320,
    dimensiones: '250 × 200 cm',
    imagen: 'https://www.firplak.com/wp-content/uploads/2023/05/HIDROMASAJE-GALAPAGOS-BASIC-DE-EMPOTRAR-250X200CM-1200x1200.jpg',
    url: 'https://www.firplak.com/producto/hidromasaje-galapagos-basic-de-empotrar-250x200cm/',
  },
  {
    nombre: 'Chatanoogan',
    modelo: 'De Empotrar',
    personas: 6,
    precio: '$18.635.120',
    precioNum: 18635120,
    dimensiones: '200 × 200 cm',
    imagen: 'https://www.firplak.com/wp-content/uploads/2017/09/Hidromasaje-Chatanoogan-iso-Amb-empotrar-kit-1200x1200.jpg',
    url: 'https://www.firplak.com/producto/hidromasaje-chatanoogan-200-x-200-empotrar/',
  },
];

const SUBCATEGORIAS = [
  { label: 'Indoor', href: '/categoria/hidromasajes' },
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
    <div
      className="min-h-screen text-white"
      style={{ background: 'linear-gradient(180deg, #09111f 0%, #060c18 60%, #04080f 100%)' }}
    >
      {/* ── Sub-navegación ── */}
      <nav className="sticky top-12 sm:top-[108px] z-30 border-b border-white/[0.07]"
        style={{ background: 'rgba(6,12,24,0.88)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <ul className="flex items-center gap-1 overflow-x-auto">
            {SUBCATEGORIAS.map((sub) => (
              <li key={sub.href}>
                <Link
                  href={sub.href}
                  className={`block px-5 py-4 text-[11px] font-medium tracking-[0.2em] uppercase whitespace-nowrap transition-colors duration-200 ${
                    sub.activo
                      ? 'text-white border-b border-white'
                      : 'text-white/35 hover:text-white/70'
                  }`}
                >
                  {sub.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative h-[55vh] min-h-[380px] overflow-hidden">
        {/* Imagen de fondo */}
        <Image
          src="https://www.firplak.com/wp-content/uploads/2017/09/Hidromasaje-Chatanoogan-iso-Amb-empotrar-kit-1200x1200.jpg"
          alt="Hidromasajes multipersonales Firplak"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center scale-105"
        />

        {/* Capas de oscuridad + gloss */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(4,8,15,0.88) 0%, rgba(6,12,24,0.72) 60%, rgba(4,8,15,0.60) 100%)' }} />
        {/* Velo inferior para transición suave */}
        <div className="absolute inset-x-0 bottom-0 h-32" style={{ background: 'linear-gradient(to bottom, transparent, #060c18)' }} />

        {/* Reflejo gloss sutil en el centro */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 30%, rgba(255,255,255,0.03) 0%, transparent 70%)' }} />

        {/* Texto del hero */}
        <div className="relative z-10 h-full flex flex-col justify-end max-w-7xl mx-auto px-6 pb-14">
          <p className="text-[10px] tracking-[0.35em] uppercase text-white/40 mb-3">
            Hidromasajes · Colección
          </p>
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-light leading-none mb-5"
            style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}
          >
            Multipersonales
          </h1>
          <p className="text-white/50 text-sm max-w-sm leading-relaxed mb-7">
            Espacios de relajación diseñados para compartir.<br />
            De 4 a 8 personas, tecnología profesional.
          </p>
          {/* Botón estilo home */}
          <a
            href="#productos"
            className="inline-flex items-center gap-2.5 self-start px-6 py-3 rounded-full bg-white text-[#060c18] text-xs font-semibold tracking-widest uppercase transition-all duration-300 hover:bg-white/90 hover:gap-4"
          >
            Ver colección
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </section>

      {/* ── Filtros ── */}
      <section className="px-6 pt-14 pb-10" id="productos">
        <div className="max-w-7xl mx-auto">
          <p className="text-[10px] tracking-[0.3em] uppercase text-white/25 mb-5">
            Capacidad
          </p>
          <div className="flex flex-wrap gap-2.5">
            {FILTROS.map(({ label, valor }) => (
              <button
                key={valor}
                onClick={() => setFiltro(valor)}
                className={`px-5 py-2.5 rounded-full text-[11px] tracking-[0.18em] uppercase font-medium transition-all duration-200 ${
                  filtro === valor
                    ? 'bg-white text-[#060c18]'
                    : 'text-white/40 border border-white/[0.14] hover:border-white/35 hover:text-white/70'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Grilla de productos ── */}
      <section className="px-6 pb-28">
        <div className="max-w-7xl mx-auto">
          {productosFiltrados.length === 0 ? (
            <p className="text-white/25 text-sm py-20 text-center tracking-widest uppercase">
              Sin resultados
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {productosFiltrados.map((producto) => (
                <article key={producto.nombre} className="group flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
                  style={{
                    background: 'linear-gradient(160deg, rgba(255,255,255,0.065) 0%, rgba(255,255,255,0.025) 100%)',
                    border: '1px solid rgba(255,255,255,0.09)',
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  {/* Gloss highlight superior */}
                  <div className="relative">
                    <div className="absolute inset-x-0 top-0 h-px z-10"
                      style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)' }} />

                    {/* Imagen */}
                    <div className="relative aspect-square overflow-hidden bg-black/20">
                      <Image
                        src={producto.imagen}
                        alt={`Hidromasaje ${producto.nombre} ${producto.dimensiones}`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                      />

                      {/* Badge capacidad */}
                      <span
                        className="absolute top-3.5 left-3.5 text-[9px] tracking-[0.22em] uppercase font-medium px-3 py-1 rounded-full"
                        style={{
                          background: 'rgba(6,12,24,0.75)',
                          border: '1px solid rgba(255,255,255,0.12)',
                          backdropFilter: 'blur(8px)',
                          color: 'rgba(255,255,255,0.75)',
                        }}
                      >
                        {producto.personas} personas
                      </span>

                      {/* Degradado inferior en imagen */}
                      <div className="absolute inset-x-0 bottom-0 h-16 pointer-events-none"
                        style={{ background: 'linear-gradient(to bottom, transparent, rgba(6,12,24,0.45))' }} />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex flex-col flex-1 p-5 gap-4">
                    <div>
                      <h2
                        className="text-xl font-light leading-none tracking-wide"
                        style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}
                      >
                        {producto.nombre}
                      </h2>
                      <p className="text-white/35 text-[11px] mt-1.5 tracking-wide">
                        {producto.modelo} · {producto.dimensiones}
                      </p>
                    </div>

                    {/* Divisor sutil */}
                    <div className="h-px" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))' }} />

                    {/* Precio + CTA */}
                    <div className="flex items-end justify-between gap-3 mt-auto">
                      <div>
                        <p className="text-[9px] uppercase tracking-[0.25em] text-white/25 mb-1">
                          Desde
                        </p>
                        <p className="text-white text-lg font-light">{producto.precio}</p>
                      </div>

                      <a
                        href={producto.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 shrink-0 px-4 py-2 rounded-full text-[10px] tracking-[0.18em] uppercase font-medium transition-all duration-250 group/btn"
                        style={{
                          border: '1px solid rgba(255,255,255,0.18)',
                          color: 'rgba(255,255,255,0.65)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(255,255,255,1)';
                          e.currentTarget.style.color = '#060c18';
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = 'rgba(255,255,255,0.65)';
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)';
                        }}
                      >
                        Ver
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
                          <path d="M1 5h8M5.5 1.5l3.5 3.5-3.5 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Banda de asesoría ── */}
      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto">
          <div
            className="rounded-2xl px-10 py-12 flex flex-col sm:flex-row items-center justify-between gap-6"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.02) 100%)',
              border: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(12px)',
            }}
          >
            {/* Gloss */}
            <div className="absolute inset-x-0 top-0 h-px rounded-full"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)' }} />

            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-white/30 mb-2">
                Atención personalizada
              </p>
              <h3
                className="text-2xl sm:text-3xl font-light"
                style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}
              >
                ¿Cuál es el ideal para ti?
              </h3>
              <p className="text-white/40 text-sm mt-2">
                Nuestros asesores te ayudan a encontrar el modelo perfecto.
              </p>
            </div>
            <a
              href="https://www.firplak.com/contacto/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 shrink-0 px-7 py-3.5 rounded-full bg-white text-[#060c18] text-xs font-semibold tracking-widest uppercase transition-all duration-300 hover:bg-white/90"
            >
              Solicitar asesoría
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                <path d="M1 6h10M6.5 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
