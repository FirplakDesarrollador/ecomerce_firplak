'use client';

import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  Clock, 
  ShieldCheck, 
  ArrowUpRight,
  Sparkles,
  Send,
  PhoneCall
} from 'lucide-react';
import FirplakLogo from './FirplakLogo';
import { triggerAccessFeedback } from '@/components/ui/AccessFeedbackToast';

const SHOWROOMS = [
  {
    city: 'Bogotá',
    address: 'Cra. 19 #104-52, San Patricio',
    phone: '+57 324 266 1789',
    mapsUrl: 'https://maps.app.goo.gl/LMhUMTSiWs17Rn64A'
  },
  {
    city: 'Medellín (IDEO)',
    address: 'C.C. IDEO, Local 218, Autopista Sur #75-83, Itagüí',
    phone: '+57 316 224 5115',
    mapsUrl: 'https://maps.app.goo.gl/EZpYNH7LCwD5XGDg9'
  },
  {
    city: 'Cali (IDEO)',
    address: 'C.C. IDEO, Local 174, Calle 1 #62-80',
    phone: '+57 315 457 3304',
    mapsUrl: 'https://maps.app.goo.gl/9CFtukW9oWakwmKU9'
  },
  {
    city: 'Showroom Fábrica Itagüí',
    address: 'Calle 29 #41-15, Itagüí',
    phone: '+57 316 224 5115',
    mapsUrl: 'https://maps.app.goo.gl/qhF6uobdGEwcVGdC7'
  },
  {
    city: 'Planta Principal Guarne',
    address: 'Autopista Medellín - Bogotá Km 23, Retorno 7',
    phone: '+57 (604) 444 1771',
    mapsUrl: 'https://maps.app.goo.gl/EZpYNH7LCwD5XGDg9'
  }
];

export default function FirplakGlobalFooter() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [acceptedHabeasData, setAcceptedHabeasData] = useState(true);

  const handleAccess = (title: string, url: string, category: string) => {
    triggerAccessFeedback({
      title,
      url,
      category,
      note: 'Este acceso forma parte de la arquitectura del sitio y requerimientos legales. No redirige por ahora.'
    });
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    triggerAccessFeedback({
      title: 'Suscripción a Newsletter',
      url: '/newsletter-subscribe',
      category: 'Captación de Leads',
      note: `Correo registrado: ${newsletterEmail}. Simulación completada con Habeas Data.`
    });
    setNewsletterEmail('');
  };

  return (
    <footer 
      className="relative text-white border-t border-white/10 pt-16 pb-12 font-sans"
      style={{ backgroundColor: '#030712' }}
      aria-label="Pie de página institucional Firplak"
    >
      {/* 1. Newsletter & Value Hook */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 mb-16">
        <div 
          className="rounded-3xl p-8 sm:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8 shadow-2xl"
          style={{ backgroundColor: '#081124', border: '1px solid rgba(34, 211, 238, 0.25)' }}
        >
          <div className="max-w-xl space-y-2">
            <div 
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-cyan-300 text-xs font-semibold uppercase tracking-wider"
              style={{ backgroundColor: 'rgba(34, 211, 238, 0.1)', border: '1px solid rgba(34, 211, 238, 0.25)' }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Comunidad & Tendencias
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Diseño, Innovación y Bienestar en tu Bandeja
            </h3>
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
              Recibe primicias de lanzamientos, guías arquitectónicas y promociones de temporada antes que nadie.
            </p>
          </div>

          <form onSubmit={handleNewsletterSubmit} className="w-full lg:max-w-md space-y-3">
            <div className="flex gap-2">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Ingresa tu correo corporativo o personal"
                required
                className="flex-1 px-4 py-3 rounded-2xl text-sm text-white placeholder-white/40 focus:outline-none transition-all"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.15)' }}
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-2xl text-white text-xs font-bold hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 shrink-0"
                style={{ background: 'linear-gradient(to right, #06b6d4, #2563eb)', boxShadow: '0 8px 24px rgba(6, 182, 212, 0.25)' }}
              >
                <span>Suscribirme</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

            <label className="flex items-start gap-2 text-[11px] text-white/50 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={acceptedHabeasData}
                onChange={(e) => setAcceptedHabeasData(e.target.checked)}
                className="mt-0.5 rounded border-white/20 bg-white/5 text-cyan-400 focus:ring-0"
              />
              <span>
                Autorizo el tratamiento de mis datos personales según la Ley 1581 de 2012 (Habeas Data).
              </span>
            </label>
          </form>
        </div>
      </div>

      {/* 2. Main 5-Column Navigation Directory */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-16 border-b border-white/10">
          
          {/* Column 1: Brand & Contacts */}
          <div className="space-y-4">
            <div className="flex items-center h-6">
              <FirplakLogo height={20} letterSpacing="0.45em" color="#ffffff" />
            </div>
            <p className="text-xs text-white/60 leading-relaxed pt-2">
              Transformamos hogares y espacios con soluciones de bienestar, hidroterapia, mármol sintético mineral y carpintería de alta gama en Colombia y América.
            </p>

            <div className="space-y-2 text-xs text-white/75 pt-2">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>PBX: +57 (604) 444 1771</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Ventas: +57 315 817 3390</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>info@firplak.com</span>
              </div>
              <div className="flex items-center gap-2 text-white/50">
                <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>L-V: 7:00 am - 5:00 pm</span>
              </div>
            </div>
          </div>

          {/* Column 2: Catálogo & Líneas de Producto */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
              Catálogo & Líneas
            </h4>
            <ul className="space-y-2 text-xs">
              {[
                { name: 'Hidromasajes & Spas', url: '/categoria-producto/jacuzzis-e-hidromasajes/' },
                { name: 'Baños & Mobiliario', url: '/categoria-producto/banos/' },
                { name: 'Zona de Ropas (Labores)', url: '/categoria-producto/zona-de-ropas/' },
                { name: 'Cocinas Integrales', url: '/categoria-producto/cocinas-integrales/' },
                { name: 'Accesorios & Repuestos', url: '/categoria-producto/accesorios/' },
                { name: 'Zona Outdoor & Asadores', url: '/categoria-producto/zona-outdoor/' },
                { name: '⚡ Envíos Rápidos (<48h)', url: '/categoria/envio-rapido/' },
                { name: '🏷️ Saldos & Liquidación', url: '/tienda/?filters=descuentos' },
              ].map((item, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => handleAccess(item.name, item.url, 'Catálogo')}
                    className="text-white/60 hover:text-white hover:underline transition-colors text-left"
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Empresa e Institucional */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
              Empresa & Canales
            </h4>
            <ul className="space-y-2 text-xs">
              {[
                { name: 'Contacto y PQRS', url: 'https://www.firplak.com/contacto/' },
                { name: 'Descarga de Catálogos (PDF)', url: 'https://www.firplak.com/descarga-de-catalogos/' },
                { name: 'Acerca de Firplak (Quiénes Somos)', url: 'https://www.firplak.com/quienes-somos/' },
                { name: '¿Dónde comprar? (Showrooms)', url: 'https://www.firplak.com/donde-comprar/' },
                { name: 'Trabaja con Nosotros', url: 'https://forms.office.com/pages/responsepage.aspx?id=T-Ad-oBHg02pQpPHro3uneGj_EKTr1hGlQYnfxQ0FUhUQUYxSVNFOTJYSU0zQzREUVJMQzNDNkJEUC4u&route=shorturl' },
                { name: 'Blog "Tu Spa en Casa"', url: 'https://www.firplak.com/tu-spa-en-casa-blog/' },
                { name: 'Mi Cuenta / Login', url: '/mi-cuenta/' },
                { name: 'Carrito de Compras', url: '/carrito/' },
              ].map((item, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => handleAccess(item.name, item.url, 'Institucional')}
                    className="text-white/60 hover:text-white hover:underline transition-colors text-left"
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: B2B & Servicios Técnicos */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
              B2B & Servicios
            </h4>
            <ul className="space-y-2 text-xs">
              {[
                { name: 'Carpintería de Obra (Showcase)', url: '/carpinteria/' },
                { name: 'Atención Constructores y Distribuidores', url: '/atencion-a-constructores-y-distribuidores/' },
                { name: 'Solicitud de Servicios Técnicos', url: 'https://servicios-mu.vercel.app/formulario-cliente' },
                { name: 'USA Website (Cabinetry & Exports)', url: 'https://cabinetry.cema.firplak.com/' },
                { name: 'Asesoría en Proyectos Especiales', url: '/proyectos-especiales/' },
                { name: 'Red de Instaladores Certificados', url: '/instaladores/' },
              ].map((item, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => handleAccess(item.name, item.url, 'B2B & Servicios')}
                    className="text-white/60 hover:text-white hover:underline transition-colors text-left"
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Red Omnicanal & Sedes Físicas */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
              Showrooms Físicos
            </h4>
            <div className="space-y-3 text-xs text-white/60">
              {SHOWROOMS.slice(0, 4).map((s, idx) => (
                <div 
                  key={idx} 
                  className="p-2.5 rounded-xl space-y-1"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)' }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white/90">{s.city}</span>
                    <button
                      onClick={() => handleAccess(`Mapa ${s.city}`, s.mapsUrl, 'Google Maps')}
                      className="text-[10px] text-cyan-400 hover:underline flex items-center gap-0.5"
                    >
                      Mapa <ArrowUpRight className="w-2.5 h-2.5" />
                    </button>
                  </div>
                  <p className="text-[11px] text-white/50 leading-tight">{s.address}</p>
                  <p className="text-[11px] font-mono text-cyan-400/80">{s.phone}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* 3. Regulatory & Legal Band (SIC / Colombia Law 1480 & 1581) */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 pt-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pb-6 border-b border-white/10 text-xs text-white/50">
          
          {/* SIC Official Compliance Badge */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-cyan-300 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-white/80 font-semibold block">
                Superintendencia de Industria y Comercio (SIC)
              </span>
              <p className="text-[11px] text-white/50">
                Cumplimiento de la Ley 1480 de 2011 (Estatuto del Consumidor)
              </p>
            </div>
            <button
              onClick={() => handleAccess('Sede Electrónica SIC', 'https://sedeelectronica.sic.gov.co/', 'SIC Colombia')}
              className="ml-2 px-3 py-1 rounded-full bg-white/5 hover:bg-cyan-500/20 border border-white/15 text-[10px] font-bold text-cyan-300 transition-colors"
            >
              Ir a la SIC
            </button>
          </div>

          {/* Legal Links Directory */}
          <div className="flex flex-wrap justify-center lg:justify-end gap-x-6 gap-y-2 text-[11px] text-white/60">
            {[
              { title: 'Protección de Datos (Habeas Data)', url: '/proteccion-de-datos/' },
              { title: 'Términos y Condiciones Generales', url: '/terminos-y-condiciones/' },
              { title: 'T&C Precios Especiales Hidros', url: '/terminos-y-condiciones-precios-especiales-hidros/' },
              { title: 'Política de Envío Gratis Hidromasajes', url: '/politica-de-envio-gratis-hidromasajes/' },
              { title: 'Políticas de Devoluciones y Garantía', url: '/Documento_Devoluciones_Hidros.pdf' },
              { title: 'Manual de Línea Ética', url: '/MANUAL-DE-LINEA-ETICA-FIRPLAK-SA-2025.pdf' },
              { title: 'Notificaciones Judiciales', url: '/notificaciones-judiciales/' },
            ].map((legal, i) => (
              <button
                key={i}
                onClick={() => handleAccess(legal.title, legal.url, 'Normativo')}
                className="hover:text-white hover:underline transition-colors text-left"
              >
                {legal.title}
              </button>
            ))}
          </div>
        </div>

        {/* Copyright & Disclaimer */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-white/40">
          <p>
            &copy; {new Date().getFullYear()} FIRPLAK S.A. Nit: 890.932.185-1. Todos los derechos reservados.
          </p>
          <p>
            Desarrollo e Innovación Digital Next.js 15 • Supabase • Integración SAP
          </p>
        </div>
      </div>
    </footer>
  );
}
