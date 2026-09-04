'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  ShieldCheck, 
  Layers, 
  Droplets, 
  Wrench, 
  Truck, 
  MapPin, 
  BookOpen, 
  MessageSquareText, 
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Star,
  Sparkles
} from 'lucide-react';

interface FirplakKeyFeaturesProps {
  onOpenCatalog?: () => void;
}

interface FeatureStory {
  id: string;
  badge: string;
  headline: string;
  subheadline: string;
  title: string;
  highlightTag: string;
  rating: string;
  ratingSubtitle: string;
  description: string;
  imageSrc: string;
  specs: { label: string; value: string }[];
  keyPoints: string[];
  ctaLabel: string;
  whatsappMessage: string;
}

const FEATURE_STORIES: FeatureStory[] = [
  {
    id: 'marmol',
    badge: 'SUPERFICIE MINERAL CONTINUA',
    headline: 'Mármol Sintético',
    subheadline: 'Higiene activa y pureza mineral',
    title: 'Superficies Minerales Firplak',
    highlightTag: 'Garantía 5 Años',
    rating: '★ 5 AÑOS',
    ratingSubtitle: 'Garantía oficial de fábrica',
    description:
      'Formulación mineral maciza sin micro-porosidades. Evita el anidamiento de bacterias y manchas profundas, permitiendo pulido y restauración in situ sin retirar la pieza.',
    imageSrc: '/images/loomere/lavamanos.png',
    specs: [
      { label: 'Estructura', value: '100% Maciza' },
      { label: 'Porosidad', value: '0% Micro-poros' },
      { label: 'Mantenimiento', value: 'Restaurable in situ' },
      { label: 'Garantía', value: '5 Años directa' },
    ],
    keyPoints: ['Superficie antibacterial certificada', 'Resistencia a químicos domésticos', 'Tacto suave mate o brillante'],
    ctaLabel: 'Consultar Lavamanos & Cubiertas',
    whatsappMessage: 'Hola FIRPLAK, me interesa conocer especificaciones de lavamanos y superficies en Mármol Sintético.',
  },
  {
    id: 'pur',
    badge: 'TECNOLOGÍA DE BORDES',
    headline: 'Sellado Perimetral PUR',
    subheadline: 'Barrera impermeable de poliuretano',
    title: 'Mobiliario Arquitectónico',
    highlightTag: '100% Cantos PUR',
    rating: '★ 100% PUR',
    ratingSubtitle: 'Adhesivo reactivo al vapor',
    description:
      'Todo nuestro mobiliario cuenta con cantos sellados con adhesivo PUR termo-fusible. Reacciona químicamente con la humedad para forjar un escudo estanco permanente contra el vapor del baño.',
    imageSrc: '/images/loomere/Oslo-Blanco-Macao-Class-Gracia-155x48-Web.webp',
    specs: [
      { label: 'Tecnología', value: 'Adhesivo PUR' },
      { label: 'Barrera', value: '100% Antivapor' },
      { label: 'Fijación', value: 'Canto termofusible' },
      { label: 'Durabilidad', value: 'Grado baño' },
    ],
    keyPoints: ['Evita hinchazón por condensación', 'Sellado perimetral en todas las caras', 'Herrajes de cierre suave'],
    ctaLabel: 'Cotizar Mobiliario a Medida',
    whatsappMessage: 'Hola FIRPLAK, deseo cotizar muebles de baño con tecnología de cantos sellados PUR.',
  },
  {
    id: 'hidro',
    badge: 'SISTEMAS DE BIENESTAR',
    headline: 'Hidromasajes y Spas',
    subheadline: 'Presurización y prueba hidrostática 100%',
    title: 'Hidromasaje & Hidroterapia',
    highlightTag: '100% Test en Planta',
    rating: '★ 100% TEST',
    ratingSubtitle: 'Inspección con agua a presión',
    description:
      'Cada tina y spa se llena y prueba en banco hidráulico antes de su despacho. Certificamos estanqueidad total, balance térmico, motobombas y circuitos de cromoterapia.',
    imageSrc: '/images/loomere/hero_jacuzzi.png',
    specs: [
      { label: 'Prueba hidráulica', value: '100% En planta' },
      { label: 'Motobombas', value: 'Calibradas' },
      { label: 'Cromoterapia', value: 'LED sellado IP68' },
      { label: 'Estructura', value: 'Fibra reforzada' },
    ],
    keyPoints: ['Cero fugas garantizado bajo presión', 'Aislamiento eléctrico seguro', 'Jets ergonómicos regulables'],
    ctaLabel: 'Personalizar Sistema de Hidromasaje',
    whatsappMessage: 'Hola FIRPLAK, deseo asesoría técnica y cotización para una tina o spa de hidromasaje.',
  },
  {
    id: 'instalacion',
    badge: 'RESPALDO EN OBRA',
    headline: 'Instalación Oficial',
    subheadline: 'Pre-inspección técnica y puesta a punto',
    title: 'Servicio Técnico Directo',
    highlightTag: 'Técnicos Certificados',
    rating: '★ OFICIAL',
    ratingSubtitle: 'Cobertura directa de fábrica',
    description:
      'Personal técnico certificado valida acometidas sanitarias y eléctricas antes del anclaje final. La instalación oficial garantiza la calibración óptima y activa la cobertura de fábrica.',
    imageSrc: '/images/loomere/cocina.png',
    specs: [
      { label: 'Acompañamiento', value: 'Pre-inspección' },
      { label: 'Personal', value: 'Fábrica Firplak' },
      { label: 'Calibración', value: 'En sitio' },
      { label: 'Activación', value: 'Garantía extendida' },
    ],
    keyPoints: ['Validación de presiones y voltajes', 'Montaje limpio y nivelado', 'Firma de acta técnica oficial'],
    ctaLabel: 'Programar Visita de Instalación',
    whatsappMessage: 'Hola FIRPLAK, requiero agendar servicio técnico o instalación oficial para un proyecto.',
  },
  {
    id: 'logistica',
    badge: 'LOGÍSTICA ESPECIALIZADA',
    headline: 'Entregas a Nivel Nacional',
    subheadline: 'Despacho asegurado en primer piso',
    title: 'Cadena de Distribución Segura',
    highlightTag: 'Desde 5 Días',
    rating: '★ SEGURO 100%',
    ratingSubtitle: 'Entrega en primer piso',
    description:
      'Envíos programados con salidas prioritarias desde 5 días hábiles. Tu compra viaja asegurada contra cualquier daño y con entrega coordinada en el primer nivel de tu domicilio.',
    imageSrc: '/cat-baneras.webp',
    specs: [
      { label: 'Tiempos mínimos', value: 'Desde 5 días' },
      { label: 'Póliza', value: '100% Asegurado' },
      { label: 'Entrega', value: 'Primer piso' },
      { label: 'Alcance', value: 'Toda Colombia' },
    ],
    keyPoints: ['Embalaje reforzado para carga frágil', 'Guía con seguimiento en tiempo real', 'Coordinación previa de llegada'],
    ctaLabel: 'Consultar Tiempos y Cobertura',
    whatsappMessage: 'Hola FIRPLAK, requiero consultar tiempos de entrega y cobertura para mi ciudad.',
  },
  {
    id: 'showrooms',
    badge: 'ESPACIOS DE DISEÑO',
    headline: 'Salas de Experiencia',
    subheadline: 'Medellín • Cali • Bogotá',
    title: 'Showrooms y Asesoría',
    highlightTag: '3 Ciudades',
    rating: '★ 4 SEDES',
    ratingSubtitle: 'Showrooms interactivos',
    description:
      'Sedes oficiales en Medellín (IDEO y Planta Itagüí), Cali (IDEO) y Bogotá (Carrera 19). Espacios donde puedes tocar acabados en vivo, validar planos y recibir asesoría experta.',
    imageSrc: '/images/loomere/Captura de pantalla_3-9-2026_213549_www.firplak.com.jpeg',
    specs: [
      { label: 'Medellín', value: 'IDEO + Itagüí' },
      { label: 'Cali', value: 'IDEO' },
      { label: 'Bogotá', value: 'Carrera 19' },
      { label: 'Atención', value: 'Lunes a Sábado' },
    ],
    keyPoints: ['Muestrarios físicos de materiales', 'Revisión técnica de planos en mesa', 'Asesoría para arquitectos'],
    ctaLabel: 'Agendar Cita en Showroom',
    whatsappMessage: 'Hola FIRPLAK, deseo agendar una visita a su sala de experiencia en Medellín, Cali o Bogotá.',
  },
];

export default function FirplakKeyFeatures({ onOpenCatalog }: FirplakKeyFeaturesProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const current = FEATURE_STORIES[activeIndex];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % FEATURE_STORIES.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + FEATURE_STORIES.length) % FEATURE_STORIES.length);
  };

  return (
    <section 
      id="key-features"
      className="relative z-20 overflow-hidden"
      style={{
        backgroundColor: '#03060d',
        background: 'linear-gradient(180deg, #020408 0%, #050b18 50%, #020407 100%)',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        paddingTop: '4.5rem',
        paddingBottom: '6.5rem',
      }}
    >
      {/* Luz ambiental en la parte superior */}
      <div 
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '1200px',
          height: '400px',
          background: 'radial-gradient(ellipse 900px 350px at 50% 0%, rgba(0, 180, 216, 0.12), transparent 75%)',
          pointerEvents: 'none',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-8 lg:px-12" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        
        {/* TITULAR EDITORIAL SUPERIOR ESTILO NIXTIO RETREAT */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '20px' }}>
          <div>
            <div 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 16px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(12px)',
                marginBottom: '14px',
              }}
            >
              <Sparkles style={{ width: '13px', height: '13px', color: '#22d3ee' }} />
              <span 
                style={{
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  fontWeight: 600,
                  letterSpacing: '0.18em',
                  color: '#94a3b8',
                  textTransform: 'uppercase',
                }}
              >
                Atributos & Ingeniería Firplak
              </span>
            </div>

            <h2 
              style={{
                fontSize: 'clamp(2rem, 4.5vw, 3.4rem)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                color: '#ffffff',
                lineHeight: 1.12,
                margin: 0,
              }}
            >
              El Estándar Arquitectónico{' '}
              <span 
                style={{
                  background: 'linear-gradient(135deg, #ffffff 40%, #67e8f9 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                del Bienestar
              </span>
            </h2>
          </div>

          {/* Selector numérico y flechas de navegación */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '12px', fontFamily: 'monospace', color: '#67e8f9', fontWeight: 700, letterSpacing: '0.1em' }}>
              0{activeIndex + 1} / 0{FEATURE_STORIES.length}
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Anterior atributo"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.14)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.borderColor = 'rgba(34, 211, 238, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.14)';
                }}
              >
                <ChevronLeft style={{ width: '18px', height: '18px' }} />
              </button>

              <button
                type="button"
                onClick={handleNext}
                aria-label="Siguiente atributo"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.14)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.borderColor = 'rgba(34, 211, 238, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.14)';
                }}
              >
                <ChevronRight style={{ width: '18px', height: '18px' }} />
              </button>
            </div>
          </div>
        </div>

        {/* LIENZO PRINCIPAL ESTILO NIXTIO "NATURE'S PERFECT HIDEAWAYS" */}
        <div 
          style={{
            position: 'relative',
            borderRadius: '32px',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            borderTop: '1px solid rgba(255, 255, 255, 0.28)',
            backgroundColor: '#070e1c',
            boxShadow: '0 30px 100px -20px rgba(0, 0, 0, 0.9), 0 0 40px rgba(0, 180, 216, 0.08)',
            minHeight: '620px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          {/* Capas de Fotografía Inmersiva con Transición */}
          {FEATURE_STORIES.map((story, idx) => (
            <div 
              key={story.id}
              style={{
                position: 'absolute',
                inset: 0,
                opacity: activeIndex === idx ? 1 : 0,
                transition: 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
                pointerEvents: 'none',
              }}
            >
              <Image
                src={story.imageSrc}
                alt={story.title}
                fill
                priority={idx === 0}
                className="object-cover"
                style={{
                  filter: 'brightness(0.72) contrast(1.08)',
                  transform: activeIndex === idx ? 'scale(1)' : 'scale(1.04)',
                  transition: 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              />
              {/* Gradiente cinemático de viñeta para legibilidad suprema */}
              <div 
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to right, rgba(3, 7, 16, 0.92) 0%, rgba(3, 7, 16, 0.65) 45%, rgba(3, 7, 16, 0.4) 100%), linear-gradient(to top, rgba(2, 5, 12, 0.95) 0%, transparent 60%)',
                }}
              />
            </div>
          ))}

          {/* 1. Header interior de la tarjeta estilo WoodNest Navigation */}
          <div 
            style={{
              position: 'relative',
              zIndex: 10,
              padding: 'clamp(20px, 3vw, 32px)',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
            }}
          >
            {/* Tag de Categoría */}
            <div 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(3, 7, 18, 0.75)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.16)',
                fontSize: '10px',
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '0.14em',
                color: '#67e8f9',
                textTransform: 'uppercase',
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22d3ee' }} />
              {current.badge}
            </div>

            {/* Pill de garantía / métrica */}
            <div 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 16px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(8, 51, 68, 0.85)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(34, 211, 238, 0.4)',
                fontSize: '11px',
                fontFamily: 'monospace',
                fontWeight: 700,
                color: '#67e8f9',
              }}
            >
              {current.highlightTag}
            </div>
          </div>

          {/* 2. Cuerpo Central: Título Poético a la Izquierda + Floating Glass Booking Card a la Derecha */}
          <div 
            style={{
              position: 'relative',
              zIndex: 10,
              padding: 'clamp(20px, 4vw, 40px)',
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: '32px',
              flex: 1,
            }}
          >
            {/* LADO IZQUIERDO: Gran tipografía editorial estilo Nixtio */}
            <div style={{ flex: '1 1 440px', maxWidth: '560px' }}>
              <h3 
                style={{
                  fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.04em',
                  color: '#ffffff',
                  lineHeight: 1.05,
                  margin: '0 0 14px 0',
                  textShadow: '0 4px 24px rgba(0, 0, 0, 0.7)',
                }}
              >
                {current.headline}
              </h3>

              <p 
                style={{
                  fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                  fontWeight: 600,
                  color: '#67e8f9',
                  letterSpacing: '-0.01em',
                  marginBottom: '14px',
                }}
              >
                {current.subheadline}
              </p>

              <p 
                style={{
                  fontSize: '0.92rem',
                  color: 'rgba(255, 255, 255, 0.82)',
                  lineHeight: 1.6,
                  marginBottom: '20px',
                  maxWidth: '480px',
                }}
              >
                {current.description}
              </p>

              {/* Rating / Respaldo pill */}
              <div 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 16px',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(3, 7, 18, 0.65)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#38bdf8', fontSize: '12px', fontWeight: 700, fontFamily: 'monospace' }}>
                  <Star style={{ width: '13px', height: '13px', fill: '#38bdf8', color: '#38bdf8' }} />
                  <span>{current.rating}</span>
                </div>
                <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.65)' }}>
                  {current.ratingSubtitle}
                </span>
              </div>
            </div>

            {/* LADO DERECHO: Tarjeta Flotante Translúcida estilo Booking Lodge de Nixtio */}
            <div 
              style={{
                flex: '0 1 420px',
                width: '100%',
                maxWidth: '420px',
                backgroundColor: 'rgba(5, 11, 24, 0.78)',
                backdropFilter: 'blur(32px) saturate(180%)',
                WebkitBackdropFilter: 'blur(32px) saturate(180%)',
                borderRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.14)',
                borderTop: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '24px 26px',
                boxShadow: '0 24px 60px -15px rgba(0, 0, 0, 0.9), 0 0 30px rgba(0, 210, 211, 0.08)',
              }}
            >
              {/* Título de la tarjeta */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontSize: '10px', fontFamily: 'monospace', color: '#94a3b8', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                    Ficha de Ingeniería
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em' }}>
                    {current.title}
                  </div>
                </div>
                <div 
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(34, 211, 238, 0.12)',
                    border: '1px solid rgba(34, 211, 238, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#22d3ee',
                  }}
                >
                  <ShieldCheck style={{ width: '16px', height: '16px' }} />
                </div>
              </div>

              {/* Matriz 2x2 de Especificaciones Técnicas */}
              <div 
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '10px',
                  marginBottom: '16px',
                }}
              >
                {current.specs.map((item, i) => (
                  <div 
                    key={i}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    <div style={{ fontSize: '10px', fontFamily: 'monospace', color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase' }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#ffffff', marginTop: '2px' }}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Puntos de Calidad Garantizada */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                {current.keyPoints.map((point, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11.5px', color: 'rgba(255, 255, 255, 0.8)' }}>
                    <CheckCircle2 style={{ width: '13px', height: '13px', color: '#22d3ee', flexShrink: 0 }} />
                    <span>{point}</span>
                  </div>
                ))}
              </div>

              {/* Botón CTA Directo de Reserva / Cotización con animación física */}
              <a
                href={`https://wa.me/573158173390?text=${encodeURIComponent(current.whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  borderRadius: '14px',
                  backgroundColor: '#ffffff',
                  color: '#040b17',
                  fontSize: '13px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  textDecoration: 'none',
                  boxShadow: '0 8px 24px rgba(255, 255, 255, 0.25)',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#22d3ee';
                  e.currentTarget.style.boxShadow = '0 10px 28px rgba(34, 211, 238, 0.45)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 255, 255, 0.25)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = 'scale(0.97)';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <span>{current.ctaLabel}</span>
                <ArrowRight style={{ width: '15px', height: '15px' }} />
              </a>
            </div>
          </div>

          {/* 3. Selector Inferior de Atributos (Mini-pills interactivas estilo Nixtio Lodge) */}
          <div 
            style={{
              position: 'relative',
              zIndex: 10,
              padding: '16px 24px',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              backgroundColor: 'rgba(2, 6, 15, 0.65)',
              backdropFilter: 'blur(20px)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              overflowX: 'auto',
              scrollbarWidth: 'none',
            }}
          >
            {FEATURE_STORIES.map((story, i) => {
              const isSelected = activeIndex === i;
              return (
                <button
                  key={story.id}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '9999px',
                    fontSize: '12px',
                    fontWeight: isSelected ? 700 : 500,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                    border: isSelected 
                      ? '1px solid rgba(34, 211, 238, 0.6)' 
                      : '1px solid rgba(255, 255, 255, 0.08)',
                    backgroundColor: isSelected 
                      ? 'rgba(34, 211, 238, 0.15)' 
                      : 'rgba(255, 255, 255, 0.03)',
                    color: isSelected ? '#67e8f9' : 'rgba(255, 255, 255, 0.65)',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                      e.currentTarget.style.color = '#ffffff';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                      e.currentTarget.style.color = 'rgba(255, 255, 255, 0.65)';
                    }
                  }}
                >
                  <span style={{ fontFamily: 'monospace', fontSize: '10px', opacity: 0.7 }}>0{i + 1}</span>
                  <span>{story.headline}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. TRES PILARES INFERIORES DE SOPORTE ARQUITECTÓNICO */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
          }}
        >
          {/* Tarjeta 1: Catálogos Técnicos */}
          <div 
            style={{
              padding: '24px',
              borderRadius: '20px',
              backgroundColor: 'rgba(9, 16, 32, 0.6)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(34, 211, 238, 0.1)', border: '1px solid rgba(34, 211, 238, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22d3ee', marginBottom: '14px' }}>
                <BookOpen style={{ width: '18px', height: '18px' }} />
              </div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', marginBottom: '6px' }}>
                Fichas Técnicas & Planos
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.65)', lineHeight: 1.6 }}>
                Descarga cotas, esquemas de acometidas hidráulicas y especificaciones para integrar a tus modelos Revit y AutoCAD.
              </p>
            </div>
            {onOpenCatalog && (
              <button
                type="button"
                onClick={onOpenCatalog}
                style={{
                  marginTop: '16px',
                  padding: '10px 18px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#ffffff',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.14)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  width: 'fit-content',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.14)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
                }}
              >
                <span>Abrir Catálogo Digital</span>
                <ArrowRight style={{ width: '13px', height: '13px', color: '#22d3ee' }} />
              </button>
            )}
          </div>

          {/* Tarjeta 2: Showrooms Físicos */}
          <div 
            style={{
              padding: '24px',
              borderRadius: '20px',
              backgroundColor: 'rgba(9, 16, 32, 0.6)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(34, 211, 238, 0.1)', border: '1px solid rgba(34, 211, 238, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22d3ee', marginBottom: '14px' }}>
                <MapPin style={{ width: '18px', height: '18px' }} />
              </div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', marginBottom: '6px' }}>
                Medellín • Cali • Bogotá
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.65)', lineHeight: 1.6 }}>
                Sedes en Medellín (IDEO y Planta Itagüí), Cali (IDEO) y Bogotá (Carrera 19). Espacios para tocar materiales y coordinar tu proyecto.
              </p>
            </div>
            <a
              href="https://wa.me/573158173390?text=Hola%20FIRPLAK,%20deseo%20visitar%20un%20showroom."
              target="_blank"
              rel="noopener noreferrer"
              style={{
                marginTop: '16px',
                padding: '10px 18px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: 600,
                color: '#ffffff',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.14)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                width: 'fit-content',
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.14)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
              }}
            >
              <span>Coordinar Visita</span>
              <ArrowRight style={{ width: '13px', height: '13px', color: '#22d3ee' }} />
            </a>
          </div>

          {/* Tarjeta 3: Atención WhatsApp */}
          <div 
            style={{
              padding: '24px',
              borderRadius: '20px',
              backgroundColor: 'rgba(9, 16, 32, 0.6)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(34, 211, 238, 0.1)', border: '1px solid rgba(34, 211, 238, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22d3ee', marginBottom: '14px' }}>
                <MessageSquareText style={{ width: '18px', height: '18px' }} />
              </div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', marginBottom: '6px' }}>
                Asesoría Técnica Directa
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.65)', lineHeight: 1.6 }}>
                Resuelve dudas de presiones hidráulicas, dimensiones de nichos y compatibilidad de muebles en tiempo real.
              </p>
            </div>
            <a
              href="https://wa.me/573158173390?text=Hola%20FIRPLAK,%20requiero%20asesoría%20técnica."
              target="_blank"
              rel="noopener noreferrer"
              style={{
                marginTop: '16px',
                padding: '10px 18px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: 700,
                color: '#030816',
                backgroundColor: '#22d3ee',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                width: 'fit-content',
                textDecoration: 'none',
                transition: 'all 0.2s',
                boxShadow: '0 4px 14px rgba(34, 211, 238, 0.3)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#67e8f9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#22d3ee';
              }}
            >
              <span>WhatsApp Directo</span>
              <ArrowRight style={{ width: '13px', height: '13px' }} />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
