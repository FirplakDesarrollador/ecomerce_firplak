'use client';

import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Zap, 
  Tag, 
  Briefcase, 
  FileText, 
  Phone, 
  MapPin, 
  BookOpen, 
  ChevronRight,
  ShieldCheck,
  ArrowUpRight
} from 'lucide-react';
import { triggerAccessFeedback } from '@/components/ui/AccessFeedbackToast';

interface LoomereMegamenuProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Subcategory {
  name: string;
  url: string;
  badge?: string;
  isQuickShip?: boolean;
  isDiscount?: boolean;
}

interface CategoryGroup {
  id: string;
  name: string;
  description: string;
  url: string;
  subcategories: Subcategory[];
}

const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    id: 'hidromasajes',
    name: 'Hidromasajes y Spas',
    description: 'Sistemas de hidroterapia, tinas de relajación y tecnología de presurización.',
    url: '/categoria-producto/jacuzzis-e-hidromasajes/',
    subcategories: [
      { name: '1 Persona', url: '/categoria-producto/jacuzzis-e-hidromasajes/1-persona/' },
      { name: '2 Personas', url: '/categoria-producto/jacuzzis-e-hidromasajes/2-personas/' },
      { name: 'Freestanding (Exentas)', url: '/categoria-producto/jacuzzis-e-hidromasajes/freestanding/' },
      { name: 'Multipersonales', url: '/categoria-producto/jacuzzis-e-hidromasajes/multipersonales/' },
      { name: 'Tinas Tradicionales', url: '/categoria-producto/jacuzzis-e-hidromasajes/tinas/' },
      { name: 'Accesorios Tinas', url: '/categoria-producto/jacuzzis-e-hidromasajes/accesorios-tinas/' },
      { name: '⚡ Envío Rápido Hidromasajes', url: '/categoria-producto/jacuzzis-e-hidromasajes/envio-rapido-hidromasajes/', isQuickShip: true, badge: '< 48 Horas' },
    ]
  },
  {
    id: 'banos',
    name: 'Baños & Sanitarios',
    description: 'Lavamanos en mármol sintético mineral, mobiliario con cantos PUR y griferías.',
    url: '/categoria-producto/banos/',
    subcategories: [
      { name: 'Combos Lavamanos con Mueble', url: '/categoria-producto/banos/combos-lavamanos-con-mueble/' },
      { name: 'Lavamanos Tipo Vanity (Empotrados)', url: '/categoria-producto/banos/lavamanos-tipo-vanity/' },
      { name: 'Lavamanos Tipo Vessel (Sobreponer)', url: '/categoria-producto/banos/lavamanos-tipo-vessel/' },
      { name: 'Mesones para Lavamanos', url: '/categoria-producto/banos/mesones-para-lavamanos/' },
      { name: 'Muebles para Lavamanos (Solos)', url: '/categoria-producto/banos/muebles-para-lavamanos/' },
      { name: 'Muebles Complementarios (Botiquines/Columnas)', url: '/categoria-producto/banos/muebles-complementarios/' },
      { name: 'Línea Godai', url: '/categoria-producto/banos/linea-godai/', badge: 'Premium' },
      { name: 'Espejos Arquitectónicos', url: '/categoria-producto/banos/espejos/' },
      { name: 'Grifería / Plomería Baños', url: '/categoria-producto/banos/griferia-plomeria-banos/' },
      { name: '⚡ Envío Rápido Baños', url: '/categoria-producto/banos/envio-rapido-banos/', isQuickShip: true, badge: '< 48 Horas' },
      { name: '🏷️ Saldos Baños', url: '/categoria-producto/banos/saldos-banos/', isDiscount: true, badge: 'Oportunidad' },
    ]
  },
  {
    id: 'zona-de-ropas',
    name: 'Zona de Ropas (Labores)',
    description: 'Lavaderos de alto rendimiento higiénico, despensas y soluciones de organización.',
    url: '/categoria-producto/zona-de-ropas/',
    subcategories: [
      { name: 'Combos Lavaderos (Lavadero + Mueble)', url: '/categoria-producto/zona-de-ropas/combos-lavaderos/' },
      { name: 'Lavaderos Pro', url: '/categoria-producto/zona-de-ropas/lavaderos-pro/', badge: 'Uso Rudo' },
      { name: 'Lavaderos Aqua', url: '/categoria-producto/zona-de-ropas/lavaderos-aqua/' },
      { name: 'Lavaderos Eco', url: '/categoria-producto/zona-de-ropas/lavaderos-eco/' },
      { name: 'Muebles Zona de Labores', url: '/categoria-producto/zona-de-ropas/muebles-zona-de-ropas/' },
      { name: 'Llaves y Plomería Zona de Ropas', url: '/categoria-producto/zona-de-ropas/llaves-plomeria-zona-de-ropas/' },
      { name: '⚡ Envío Rápido Labores', url: '/categoria-producto/zona-de-ropas/envio-rapido-zona-de-labores/', isQuickShip: true, badge: '< 48 Horas' },
      { name: '🏷️ Saldos Labores', url: '/categoria-producto/zona-de-ropas/saldos-zona-de-labores/', isDiscount: true, badge: 'Oportunidad' },
    ]
  },
  {
    id: 'cocinas',
    name: 'Cocinas Integrales',
    description: 'Módulos superiores e inferiores, mesones en Quartzstone y lavaplatos ergonómicos.',
    url: '/categoria-producto/cocinas-integrales/',
    subcategories: [
      { name: 'Cocinas Integrales Modulares', url: '/categoria-producto/cocinas-integrales/cocinas-integrales-cocinas-integrales/' },
      { name: 'Muebles Solos para Cocinas', url: '/categoria-producto/cocinas-integrales/muebles-solos-cocinas/' },
      { name: 'Mesones para Cocina', url: '/categoria-producto/cocinas-integrales/mesones-para-cocina/' },
      { name: 'Lavaplatos Submontar y Sobreponer', url: '/categoria-producto/cocinas-integrales/lavaplatos/' },
      { name: 'Grifería / Plomería Cocinas', url: '/categoria-producto/cocinas-integrales/griferia-plomeria-cocinas/' },
      { name: '⚡ Envío Rápido Cocinas', url: '/categoria-producto/cocinas-integrales/envio-rapido-cocinas-integrales/', isQuickShip: true, badge: '< 48 Horas' },
      { name: '🏷️ Saldos Cocinas', url: '/categoria-producto/cocinas-integrales/saldos-cocinas-integrales/', isDiscount: true, badge: 'Oportunidad' },
    ]
  },
  {
    id: 'accesorios',
    name: 'Accesorios & Repuestos',
    description: 'Kits de mantenimiento, plomería certificada y componentes técnicos.',
    url: '/categoria-producto/accesorios/',
    subcategories: [
      { name: 'Accesorios para Tinas y Spas', url: '/categoria-producto/jacuzzis-e-hidromasajes/accesorios-tinas/' },
      { name: 'Accesorios de Baño y Toalleros', url: '/categoria-producto/banos/accesorios-banos/' },
      { name: 'Plomería Zona de Ropas', url: '/categoria-producto/zona-de-ropas/llaves-plomeria-zona-de-ropas/' },
      { name: 'Herrajes y Accesorios Cocina', url: '/categoria-producto/cocinas-integrales/griferia-plomeria-cocinas/' },
    ]
  },
  {
    id: 'zona-outdoor',
    name: 'Zona Outdoor & Asadores',
    description: 'Spas multipersonales para exteriores, saunas finlandeses y asadores en acero 304.',
    url: '/categoria-producto/zona-outdoor/',
    subcategories: [
      { name: 'Asadores Empotrables Acero 304', url: '/categoria-producto/zona-outdoor/asadores/', badge: 'Acero Inox' },
      { name: 'Multipersonales Spa Exteriores', url: '/categoria-producto/zona-outdoor/multipersonales-spa/' },
      { name: 'Saunas Secos y Húmedos', url: '/categoria-producto/zona-outdoor/saunas/' },
      { name: 'Mantenimiento de Agua y Filtros', url: '/categoria-producto/zona-outdoor/mantenimiento-de-agua/' },
      { name: 'Cubiertas Spa Térmicas', url: '/categoria-producto/zona-outdoor/cubiertas/' },
    ]
  }
];

const B2B_PORTALS = [
  {
    title: 'Carpintería de Obra',
    desc: 'Soluciones a escala para constructoras y arquitectos',
    url: '/carpinteria/',
    badge: 'B2B Obra'
  },
  {
    title: 'Atención Constructores / Mayoristas',
    desc: 'Canal corporativo para proyectos y licitaciones',
    url: '/atencion-a-constructores-y-distribuidores/',
    badge: 'Comercial'
  },
  {
    title: 'Solicitud de Servicios Técnicos',
    desc: 'Agendamiento oficial: pre-inspección, instalación y garantías',
    url: 'https://servicios-mu.vercel.app/formulario-cliente',
    badge: 'Servicio Oficial'
  },
  {
    title: 'USA Website (Exportación)',
    desc: 'Cabinetry & export platform for the US market',
    url: 'https://cabinetry.cema.firplak.com/',
    badge: 'International'
  }
];

const CORPORATE_LINKS = [
  { title: 'Contacto y PQRS', url: '/contacto/', icon: Phone },
  { title: 'Descarga de Catálogos (PDF)', url: '/descarga-de-catalogos/', icon: FileText },
  { title: 'Acerca de Firplak (Quiénes Somos)', url: '/quienes-somos/', icon: ShieldCheck },
  { title: '¿Dónde comprar? (Showrooms)', url: '/donde-comprar/', icon: MapPin },
  { title: 'Trabaja con Nosotros', url: 'https://forms.office.com/... (Forms)', icon: Briefcase },
  { title: 'Blog "Tu Spa en Casa"', url: '/tu-spa-en-casa-blog/', icon: BookOpen },
];

export default function LoomereMegamenu({ isOpen, onClose }: LoomereMegamenuProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('hidromasajes');

  if (!isOpen) return null;

  const activeCategory = CATEGORY_GROUPS.find((c) => c.id === selectedCategoryId) || CATEGORY_GROUPS[0];

  const handleLinkClick = (title: string, url: string, category: string) => {
    triggerAccessFeedback({
      title,
      url,
      category,
      note: 'Este enlace está estructurado en el mapa de sitio de Firplak. Redirección deshabilitada en esta fase.'
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Catálogo y Navegación Firplak"
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 sm:pt-28 px-4 sm:px-6 pointer-events-auto animate-in fade-in duration-200"
    >
      {/* Backdrop con click para cerrar */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-[4px] -z-10 transition-opacity"
      />

      {/* Contenedor Flotante Desplegable con Efecto de Blur y Opacidad */}
      <div
        className="relative w-full max-w-[1400px] max-h-[82vh] flex flex-col rounded-3xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300"
        style={{
          backgroundColor: 'rgba(70, 70, 70, 0.65)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 30px 70px rgba(0, 0, 0, 0.65)'
        }}
      >
        {/* Top Bar Header */}
        <header 
          className="shrink-0 px-6 py-4 flex items-center justify-between"
          style={{ 
            backgroundColor: 'rgba(45, 45, 45, 0.4)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.15)'
          }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="p-2 rounded-xl text-cyan-400"
              style={{ backgroundColor: 'rgba(34, 211, 238, 0.15)', border: '1px solid rgba(34, 211, 238, 0.3)' }}
            >
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-wide uppercase text-white">
                Arquitectura de Catálogo & Accesos firplak.com
              </h3>
              <p className="text-xs text-white/60">
                Taxonomía oficial mapeada según el blueprint de migración y directrices SEO
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full text-white/80 hover:text-white transition-colors"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.15)' }}
            aria-label="Cerrar navegación"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Main Content: Categories & Details */}
        <div className="flex-1 min-h-0 overflow-y-auto divide-y lg:divide-y-0 lg:divide-x divide-white/10 flex flex-col lg:flex-row">
          
          {/* Left Column: Category Selector (320px) */}
          <div 
            className="w-full lg:w-auto p-5 sm:p-6 space-y-3 overflow-y-auto"
            style={{ 
              width: '320px',
              minWidth: '300px',
              flexShrink: 0,
              backgroundColor: 'rgba(35, 35, 35, 0.35)',
              borderRight: '1px solid rgba(255, 255, 255, 0.12)'
            }}
          >
            <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-400 mb-4">
              Líneas Maestras de Producto
            </div>

            <div className="space-y-1.5">
              {CATEGORY_GROUPS.map((cat) => {
                const isCurrent = cat.id === selectedCategoryId;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategoryId(cat.id)}
                    className={`w-full text-left p-4 rounded-2xl transition-all duration-200 flex items-center justify-between group ${
                      isCurrent
                        ? 'shadow-lg shadow-cyan-950/40'
                        : 'hover:bg-white/10 border border-transparent text-white/80 hover:text-white'
                    }`}
                    style={
                      isCurrent
                        ? {
                            backgroundColor: 'rgba(34, 211, 238, 0.2)',
                            border: '1px solid rgba(34, 211, 238, 0.45)',
                            color: '#a5f3fc'
                          }
                        : {}
                    }
                  >
                    <div className="min-w-0 pr-3">
                      <div className="text-sm font-semibold flex items-center gap-2">
                        <span className="truncate">{cat.name}</span>
                        {cat.id === 'hidromasajes' && (
                          <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-cyan-400/20 text-cyan-300 font-bold border border-cyan-400/30">
                            Ícono
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-white/50 truncate mt-0.5">
                        {cat.subcategories.length} subcategorías registradas
                      </p>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 shrink-0 transition-transform ${
                        isCurrent ? 'text-cyan-400 translate-x-1' : 'text-white/30 group-hover:text-white/60'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Quick Commerce Shortcuts */}
            <div className="pt-6 border-t border-white/10 mt-6 space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40 mb-2">
                Atajos Comerciales Transversales
              </div>
              
              <button
                onClick={() => handleLinkClick('Catálogo General Completo', '/tienda/', 'Comercial')}
                className="w-full text-left px-3 py-2 rounded-xl text-xs text-white/80 hover:text-white hover:bg-white/10 flex items-center justify-between transition-colors"
              >
                <span>Ver Catálogo Completo / Tienda</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
              </button>
              <button
                onClick={() => handleLinkClick('Filtro de Descuentos & Liquidación', '/tienda/?filters=descuentos', 'Ofertas')}
                className="w-full text-left px-3 py-2 rounded-xl text-xs text-amber-300 hover:bg-amber-500/15 flex items-center justify-between transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5" />
                  Saldos & Liquidación (-10% a -65%)
                </span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleLinkClick('Despacho Rápido Express', '/categoria/envio-rapido/', 'Logística')}
                className="w-full text-left px-3 py-2 rounded-xl text-xs text-cyan-300 hover:bg-cyan-500/15 flex items-center justify-between transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5" />
                  Productos con Envío Rápido (&lt;48h)
                </span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Center Column: Subcategories of Active Group (flex-1) */}
          <div 
            className="flex-1 p-5 sm:p-6 space-y-6 overflow-y-auto"
            style={{ 
              flex: '1 1 0%',
              minWidth: '380px',
              backgroundColor: 'rgba(25, 25, 25, 0.25)' 
            }}
          >
            <div className="border-b border-white/10 pb-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase">
                  Taxonomía PLP / Next.js
                </span>
                <button
                  onClick={() => handleLinkClick(`Categoría: ${activeCategory.name}`, activeCategory.url, 'Macrocategoría')}
                  className="text-xs text-cyan-300 hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>Ver toda la categoría</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
              <h4 className="text-xl font-bold text-white mt-1">
                {activeCategory.name}
              </h4>
              <p className="text-xs text-white/65 mt-1 leading-relaxed">
                {activeCategory.description}
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40 mb-3">
                Subcategorías Registradas ({activeCategory.subcategories.length})
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {activeCategory.subcategories.map((sub, i) => (
                  <button
                    key={i}
                    onClick={() => handleLinkClick(sub.name, sub.url, activeCategory.name)}
                    className="text-left p-3.5 rounded-xl transition-all duration-200 flex flex-col justify-between group hover:scale-[1.02]"
                    style={{
                      minHeight: '60px',
                      backgroundColor: sub.isQuickShip
                        ? 'rgba(34, 211, 238, 0.12)'
                        : sub.isDiscount
                        ? 'rgba(245, 158, 11, 0.12)'
                        : 'rgba(255, 255, 255, 0.08)',
                      border: sub.isQuickShip
                        ? '1px solid rgba(34, 211, 238, 0.35)'
                        : sub.isDiscount
                        ? '1px solid rgba(245, 158, 11, 0.35)'
                        : '1px solid rgba(255, 255, 255, 0.15)'
                    }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-semibold text-white/95 group-hover:text-white transition-colors">
                        {sub.name}
                      </span>
                      <ArrowUpRight className="w-3 h-3 text-white/40 group-hover:text-cyan-400 transition-colors shrink-0" />
                    </div>
                    
                    {sub.badge && (
                      <div className="mt-2">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                          sub.isQuickShip 
                            ? 'bg-cyan-400/25 text-cyan-300 border border-cyan-400/30' 
                            : sub.isDiscount 
                            ? 'bg-amber-400/25 text-amber-300 border border-amber-400/30' 
                            : 'bg-white/10 text-white/70'
                        }`}>
                          {sub.badge}
                        </span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: B2B, Services & Corporate Channels (330px) */}
          <div 
            className="w-full lg:w-auto p-5 sm:p-6 space-y-6 overflow-y-auto"
            style={{ 
              width: '330px',
              minWidth: '300px',
              flexShrink: 0,
              backgroundColor: 'rgba(35, 35, 35, 0.35)',
              borderLeft: '1px solid rgba(255, 255, 255, 0.12)'
            }}
          >
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-400 mb-3 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5" />
                Canal B2B & Servicios
              </div>

              <div className="space-y-2">
                {B2B_PORTALS.map((portal, i) => (
                  <button
                    key={i}
                    onClick={() => handleLinkClick(portal.title, portal.url, 'B2B & Servicios')}
                    className="w-full text-left p-3 rounded-xl transition-all duration-200 group hover:scale-[1.01]"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.07)',
                      border: '1px solid rgba(255, 255, 255, 0.14)'
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {portal.title}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-400/15 text-cyan-300 font-mono border border-cyan-400/30">
                        {portal.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-white/60 mt-1 leading-normal line-clamp-2">
                      {portal.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40 mb-3">
                Canales Institucionales
              </div>

              <div className="grid grid-cols-1 gap-1.5">
                {CORPORATE_LINKS.map((link, i) => {
                  const IconComponent = link.icon;
                  return (
                    <button
                      key={i}
                      onClick={() => handleLinkClick(link.title, link.url, 'Institucional')}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs text-white/80 hover:text-white hover:bg-white/10 flex items-center gap-2.5 transition-colors"
                    >
                      <IconComponent className="w-3.5 h-3.5 text-cyan-400/80 shrink-0" />
                      <span className="truncate">{link.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

        </div>

        {/* Footer Info Notice */}
        <footer 
          className="shrink-0 px-6 py-3 flex flex-col sm:flex-row items-center justify-between text-[11px] text-white/60 gap-2"
          style={{ 
            backgroundColor: 'rgba(30, 30, 30, 0.45)',
            borderTop: '1px solid rgba(255, 255, 255, 0.15)'
          }}
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Modo de Exploración: 28 subcategorías y 12 accesos corporativos cargados</span>
          </div>
          <div className="text-white/50">
            Cumple con directrices de enrutamiento Next.js 15 y SEO On-Page
          </div>
        </footer>
      </div>
    </div>
  );
}
