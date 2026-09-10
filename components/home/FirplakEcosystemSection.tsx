'use client';

import React from 'react';
import Image from 'next/image';
import { 
  Layers, 
  ArrowUpRight, 
  FileDown, 
  Building2, 
  Wrench, 
  Globe, 
  Sparkles,
  Tag,
  Zap
} from 'lucide-react';
import { triggerAccessFeedback } from '@/components/ui/AccessFeedbackToast';

const CATEGORIES_DATA = [
  {
    id: 'hidro',
    title: 'Hidromasajes & Spas',
    tagline: 'Bienestar e Hidroterapia',
    url: '/categoria-producto/jacuzzis-e-hidromasajes/',
    image: '/images/loomere/hero_jacuzzi.png',
    badge: '★ 100% Test en Planta',
    items: ['1 Persona', '2 Personas', 'Freestanding', 'Multipersonales', 'Tinas', 'Accesorios', 'Envío Rápido (<48h)']
  },
  {
    id: 'banos',
    title: 'Baños & Mobiliario',
    tagline: 'Mármol Sintético & Cantos PUR',
    url: '/categoria-producto/banos/',
    image: '/images/loomere/lavamanos.png',
    badge: '5 Años Garantía',
    items: ['Combos con Mueble', 'Lavamanos Vanity', 'Lavamanos Vessel', 'Mesones', 'Muebles Solos', 'Línea Godai', 'Espejos']
  },
  {
    id: 'ropas',
    title: 'Zona de Ropas',
    tagline: 'Ergonomía y Cuidado Activo',
    url: '/categoria-producto/zona-de-ropas/',
    image: '/images/loomere/hero_ropas.png',
    badge: 'Resistencia Química',
    items: ['Combos Lavaderos', 'Lavaderos Pro', 'Lavaderos Aqua', 'Lavaderos Eco', 'Muebles Despensa', 'Plomería Ropas']
  },
  {
    id: 'cocinas',
    title: 'Cocinas Integrales',
    tagline: 'Arquitectura & Quartzstone',
    url: '/categoria-producto/cocinas-integrales/',
    image: '/images/loomere/hero_cocina.png',
    badge: 'Herrajes Soft-Close',
    items: ['Cocinas Modulares', 'Muebles Superiores e Inferiores', 'Mesones', 'Lavaplatos Submontar', 'Griferías']
  },
  {
    id: 'accesorios',
    title: 'Accesorios & Grifería',
    tagline: 'Complementos Certificados',
    url: '/categoria-producto/accesorios/',
    image: '/images/loomere/lavamanos.png',
    badge: 'Acabados Premium',
    items: ['Accesorios Tinas', 'Accesorios Baño', 'Grifería Alta y Baja', 'Plomería Técnica']
  },
  {
    id: 'outdoor',
    title: 'Zona Outdoor',
    tagline: 'Acero Inox 304 & Exteriores',
    url: '/categoria-producto/zona-outdoor/',
    image: '/images/loomere/hero_jacuzzi.png',
    badge: 'Resistencia Intemperie',
    items: ['Asadores Empotrables Acero 304', 'Multipersonales Spa', 'Saunas Secos y Húmedos', 'Cubiertas Térmicas']
  }
];

const B2B_SERVICES = [
  {
    title: 'Carpintería de Obra',
    subtitle: 'Soluciones institucionales para constructoras',
    desc: 'Diseño, modulación y suministro masivo de cocinas, baños y carpintería arquitectónica para proyectos inmobiliarios.',
    url: '/carpinteria/',
    badge: 'Canal Constructor',
    icon: Building2
  },
  {
    title: 'Atención a Distribuidores & Mayoristas',
    subtitle: 'Alianzas comerciales estratégicas',
    desc: 'Atención directa para cadenas de retail, ferreterías especializadas y distribución nacional e internacional.',
    url: '/atencion-a-constructores-y-distribuidores/',
    badge: 'Licitaciones',
    icon: Layers
  },
  {
    title: 'Solicitud de Servicios Técnicos',
    subtitle: 'Red oficial de soporte y mantenimiento',
    desc: 'Agendamiento digital de pre-inspección de punto hidráulico, instalación de hidromasajes y garantías oficiales.',
    url: 'https://servicios-mu.vercel.app/formulario-cliente',
    badge: 'App de Agendamiento',
    icon: Wrench
  },
  {
    title: 'USA Website (Cabinetry & Export)',
    subtitle: 'Presencia internacional Firplak',
    desc: 'Plataforma para el mercado de exportación en Norteamérica con especificaciones de cabinetry y certificaciones internacionales.',
    url: 'https://cabinetry.cema.firplak.com/',
    badge: 'Mercado USA',
    icon: Globe
  }
];

const OFFICIAL_CATALOGS = [
  {
    title: 'Catálogo Hidromasajes & Spas',
    size: 'PDF 14.2 MB',
    desc: 'Tinas, hidromasajes, especificaciones hidráulicas y circuitos de cromoterapia.',
    url: '/descarga-de-catalogos/hidromasajes/'
  },
  {
    title: 'Catálogo Baños & Mobiliario',
    size: 'PDF 22.8 MB',
    desc: 'Lavamanos en mármol sintético, muebles con cantos PUR y espejos táctiles.',
    url: '/descarga-de-catalogos/banos/'
  },
  {
    title: 'Catálogo Zona de Labores',
    size: 'PDF 9.5 MB',
    desc: 'Lavaderos ergonómicos, combos con mueble y tecnología antibacterial.',
    url: '/descarga-de-catalogos/zona-de-ropas/'
  },
  {
    title: 'Catálogo Cocinas Integrales',
    size: 'PDF 18.6 MB',
    desc: 'Cocinas modulares, mesones en cuarzo y herrajes de amortiguación.',
    url: '/descarga-de-catalogos/cocinas/'
  },
  {
    title: 'Catálogo Carpintería de Obra',
    size: 'PDF 11.3 MB',
    desc: 'Especificaciones técnicas para arquitectos, diseñadores e ingenieros de obra.',
    url: '/descarga-de-catalogos/carpinteria-obra/'
  }
];

export default function FirplakEcosystemSection() {
  const handleAccess = (title: string, url: string, category: string) => {
    triggerAccessFeedback({
      title,
      url,
      category,
      note: 'Mapeado en el mapa del sitio de firplak.com. Enlace simulado y no funcional para pruebas de interfaz.'
    });
  };

  return (
    <section 
      className="relative z-20 py-24 px-4 sm:px-6 lg:px-12 text-white border-t border-white/10"
      style={{ backgroundColor: '#050914' }}
      aria-label="Ecosistema y Categorías Firplak"
    >
      <div className="max-w-[1440px] mx-auto space-y-24">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div 
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-cyan-300 text-xs font-semibold uppercase tracking-widest"
            style={{ backgroundColor: 'rgba(34, 211, 238, 0.1)', border: '1px solid rgba(34, 211, 238, 0.3)' }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Catálogo & Ecosistema Omnicanal
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            Explora la Colección Completa de Firplak
          </h2>
          <p className="text-sm sm:text-base text-white/60 leading-relaxed">
            Arquitectura de producto, soluciones a gran escala para constructoras, centros de servicio técnico y descarga de catálogos oficiales.
          </p>
        </div>

        {/* 1. Category Cards Grid (6 Main Categories) */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">
                Taxonomía PLP
              </span>
              <h3 className="text-2xl font-bold text-white mt-1">
                Líneas de Producto Principales
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleAccess('Filtro Envíos Rápidos (<48h)', '/categoria/envio-rapido/', 'Logística')}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-cyan-300 hover:bg-cyan-500/30 transition-colors flex items-center gap-1.5"
                style={{ backgroundColor: 'rgba(34, 211, 238, 0.15)', border: '1px solid rgba(34, 211, 238, 0.35)' }}
              >
                <Zap className="w-3.5 h-3.5" />
                ⚡ Envíos Rápidos (&lt;48h)
              </button>
              <button
                onClick={() => handleAccess('Filtro Saldos & Liquidación', '/tienda/?filters=descuentos', 'Liquidación')}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-amber-300 hover:bg-amber-500/30 transition-colors flex items-center gap-1.5"
                style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.35)' }}
              >
                <Tag className="w-3.5 h-3.5" />
                🏷️ Saldos
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORIES_DATA.map((cat) => (
              <div
                key={cat.id}
                className="group relative rounded-3xl overflow-hidden transition-all duration-300 flex flex-col justify-between"
                style={{ 
                  backgroundColor: '#0a1020', 
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)'
                }}
              >
                {/* Top Image Preview */}
                <div className="relative h-48 w-full overflow-hidden" style={{ backgroundColor: '#03060f' }}>
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    className="object-cover object-center filter brightness-[0.8] contrast-[1.05] group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #0a1020 0%, transparent 60%)' }} />
                  
                  <div className="absolute top-4 left-4">
                    <span 
                      className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full text-cyan-300"
                      style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.15)' }}
                    >
                      {cat.badge}
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-xs text-cyan-400 font-medium tracking-wide">
                      {cat.tagline}
                    </span>
                    <h4 className="text-xl font-bold text-white mt-1 group-hover:text-cyan-200 transition-colors">
                      {cat.title}
                    </h4>

                    {/* Subcategory Pills */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {cat.items.map((sub, i) => (
                        <button
                          key={i}
                          onClick={() => handleAccess(sub, `${cat.url}${encodeURIComponent(sub)}/`, cat.title)}
                          className="text-[11px] px-2.5 py-1 rounded-lg text-white/80 hover:text-cyan-200 transition-all"
                          style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}
                        >
                          {sub}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <button
                      onClick={() => handleAccess(cat.title, cat.url, 'Categoría')}
                      className="text-xs font-semibold text-white/80 group-hover:text-cyan-300 flex items-center gap-1.5 transition-colors"
                    >
                      <span>Ver toda la categoría</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. B2B & Specialized Portals Grid */}
        <div 
          className="rounded-3xl p-8 sm:p-10 space-y-8"
          style={{ backgroundColor: '#070d1c', border: '1px solid rgba(255, 255, 255, 0.1)' }}
        >
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">
              Canales Profesionales
            </span>
            <h3 className="text-2xl font-bold text-white mt-1">
              Soluciones B2B, Proyectos & Servicios Técnicos
            </h3>
            <p className="text-xs sm:text-sm text-white/60 mt-1">
              Atención dedicada para proyectos institucionales, constructoras, arquitectos y asistencia técnica oficial.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {B2B_SERVICES.map((serv, i) => {
              const IconComp = serv.icon;
              return (
                <div
                  key={i}
                  className="rounded-2xl p-6 transition-all flex flex-col justify-between group space-y-4"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)' }}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div 
                        className="p-2.5 rounded-xl text-cyan-400"
                        style={{ backgroundColor: 'rgba(34, 211, 238, 0.1)', border: '1px solid rgba(34, 211, 238, 0.25)' }}
                      >
                        <IconComp className="w-5 h-5" />
                      </div>
                      <span 
                        className="text-[10px] font-mono uppercase px-2 py-0.5 rounded text-white/70"
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                      >
                        {serv.badge}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white mt-3 group-hover:text-cyan-300 transition-colors">
                      {serv.title}
                    </h4>
                    <p className="text-xs text-cyan-400/80 font-medium mt-0.5">
                      {serv.subtitle}
                    </p>
                    <p className="text-xs text-white/60 mt-2 leading-relaxed">
                      {serv.desc}
                    </p>
                  </div>

                  <button
                    onClick={() => handleAccess(serv.title, serv.url, 'Canal B2B')}
                    className="w-full py-2 px-3 rounded-xl text-xs font-semibold text-white/80 hover:text-white flex items-center justify-center gap-1.5 transition-all"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.12)' }}
                  >
                    <span>Abrir Portal</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Official Catalog Downloads Hub */}
        <div 
          className="rounded-3xl p-8 sm:p-10 space-y-8"
          style={{ backgroundColor: '#091329', border: '1px solid rgba(34, 211, 238, 0.3)' }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">
                Hub de Documentación Oficial
              </span>
              <h3 className="text-2xl font-bold text-white mt-1">
                Descarga de Catálogos Oficiales en PDF
              </h3>
              <p className="text-xs sm:text-sm text-white/60 mt-1">
                Portafolios actualizados con medidas técnicas, acabados de planta y opciones de modulación.
              </p>
            </div>
            <button
              onClick={() => handleAccess('Hub General de Catálogos', '/descarga-de-catalogos/', 'Documentos')}
              className="px-5 py-2.5 rounded-full text-[#030816] text-xs font-bold transition-all flex items-center gap-2 shrink-0"
              style={{ backgroundColor: '#22d3ee', boxShadow: '0 8px 24px rgba(34, 211, 238, 0.35)' }}
            >
              <FileDown className="w-4 h-4" />
              <span>Ver Todos los Catálogos</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {OFFICIAL_CATALOGS.map((cat, i) => (
              <button
                key={i}
                onClick={() => handleAccess(cat.title, cat.url, 'Descarga PDF')}
                className="text-left p-4 rounded-2xl transition-all flex flex-col justify-between group"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <FileDown className="w-4 h-4 text-cyan-400" />
                    <span className="text-[10px] font-mono text-white/40">{cat.size}</span>
                  </div>
                  <h5 className="text-xs font-bold text-white group-hover:text-cyan-200 transition-colors leading-snug">
                    {cat.title}
                  </h5>
                  <p className="text-[11px] text-white/50 mt-1.5 leading-normal line-clamp-2">
                    {cat.desc}
                  </p>
                </div>
                <span className="text-[10px] font-semibold text-cyan-400 mt-4 inline-flex items-center gap-1 group-hover:underline">
                  Descargar PDF
                  <ArrowUpRight className="w-3 h-3" />
                </span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
