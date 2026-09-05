export interface SceneProduct {
  id: string;
  name: string;
  category: string;
  material: string;
  price: string;
  dimensions: string;
  specs: string[];
  features: string[];
  badge: string;
}

export interface LoomereScene {
  id: number;
  time: string;
  tag: string;
  title: string;
  headline: string;
  description: string;
  product: SceneProduct;
  fallbackImage: string;
  videoUrl?: string;
  hotspot: {
    x: number; // percentage from left
    y: number; // percentage from top
  };
}

export const LOOMERE_SCENES: LoomereScene[] = [
  {
    id: 0,
    time: "07:00 AM",
    tag: "LAVAMANOS Y MUEBLES",
    title: "El Despertar",
    headline: "Diseños que superan el tiempo",
    description: "Elige y combina más de 300 referencias para crear espacios que inspiren cada momento del día.",
    product: {
      id: "lavamanos-sobreponer-vessel",
      name: "Lavamanos Sobreponer Milán",
      category: "Baños & Bienestar",
      material: "Mármol Sintético Blanco Satinado",
      price: "$429.900 COP",
      dimensions: "45 cm × 38 cm × 12 cm",
      specs: [
        "Material de alta resistencia a manchas y rayones",
        "Superficie ultra lisa y no porosa (fácil asepsia)",
        "Compatible con grifería monocontrol alta o de pared"
      ],
      features: [
        "Garantía extendida de 10 años",
        "Diseño escultural minimalista",
        "Tecnología Firplak Eco-Drain"
      ],
      badge: "Lanzamiento 2026"
    },
    fallbackImage: "/images/loomere/cat-lavamanos.webp",
    videoUrl: "/videos/loomere/video_0.mp4",
    hotspot: { x: 64, y: 54 }
  },
  {
    id: 1,
    time: "08:30 AM",
    tag: "CAPÍTULO 02 — VITALIDAD & DISEÑO",
    title: "El Ritmo del Hogar",
    headline: "El epicentro culinario que reúne a la familia",
    description: "Sol matutino, café recién preparado y el desayuno compartido. El mesón de cuarzo y la grifería de precisión responden con silenciosa ergonomía al movimiento dinámico de la mañana.",
    product: {
      id: "cocina-integral-nordic",
      name: "Cocina Integral Nórdica & Mesón Cuarzo",
      category: "Cocinas Integrales",
      material: "Madera Termotratada RH & Cuarzo Calacatta",
      price: "$3.850.000 COP",
      dimensions: "Módulos modulares a medida (desde 1.80m hasta 3.20m)",
      specs: [
        "Herrajes alemanes con sistema Soft-Close de cierre lento",
        "Mesón anti-bacteriano resistente a calor y líquidos",
        "Módulos inferiores y superiores 100% resistentes a humedad (RH)"
      ],
      features: [
        "Diseño ergonómico sin tiradores visibles (Push-to-open)",
        "Distribución inteligente para electrodomésticos empotrados",
        "Instalación y asesoría especializada incluida"
      ],
      badge: "Más Vendido"
    },
    fallbackImage: "/images/loomere/cocina.png",
    videoUrl: "/videos/loomere/video_1.mp4",
    hotspot: { x: 66, y: 52 }
  },
  {
    id: 2,
    time: "15:00 PM",
    tag: "CAPÍTULO 03 — CUIDADO & RESISTENCIA",
    title: "El Retorno Activo",
    headline: "Robustez higiénica para tus pasiones al aire libre",
    description: "Al volver de una expedición de senderismo por la cordillera, la zona de labores recibe el calzado y equipo de montaña. Un pozo amplio y profundo que resiste el uso rudo manteniendo impecable el hogar.",
    product: {
      id: "combo-lavadero-pro-rh",
      name: "Combo Lavadero Pro con Mueble RH",
      category: "Zona de Labores",
      material: "Mármol Sintético No Poroso & Aglomerado RH",
      price: "$899.900 COP",
      dimensions: "Módulos configurables (Lavadero 80/100cm + Módulo Lavadora)",
      specs: [
        "Pozo profundo en mármol sintético no poroso con estregadero ergonómico",
        "Mueble en aglomerado RH resistente a humedad con tapacantos PUR",
        "Resistente a químicos de limpieza domésticos, cloro y rayos UV"
      ],
      features: [
        "Garantía de 5 años en mármol sintético",
        "Selector de orientación de estregadero (Izquierda / Derecha)",
        "Despacho prioritario en Envío Rápido (<48h)"
      ],
      badge: "Envío Rápido <48h"
    },
    fallbackImage: "/images/loomere/PORTADA.jpg",
    videoUrl: "/videos/loomere/video_2.mp4",
    hotspot: { x: 44, y: 55 }
  },
  {
    id: 3,
    time: "18:30 PM",
    tag: "CAPÍTULO 04 — SANTUARIO & FAMILIA",
    title: "La Gran Inmersión",
    headline: "Hidroterapia en el santuario del atardecer",
    description: "Cielo crepuscular, brisa fresca y vapor tibio. Los niños ríen mientras los micro-chorros de hidroterapia envuelven a la familia en un oasis de relajación profunda bajo las estrellas.",
    product: {
      id: "hidromasaje-galapagos",
      name: "Hidromasaje Exterior Galápagos",
      category: "Hidromasajes & Spas",
      material: "Acrílico Sanitario Reforzado con Fibra de Vidrio",
      price: "$9.450.000 COP",
      dimensions: "210 cm × 210 cm × 92 cm (Capacidad: 5 personas)",
      specs: [
        "24 hidrojets de precisión (masaje lumbar, dorsal y plantar)",
        "Sistema de calentador digital inteligente con sensor térmico",
        "Sistema de cromoterapia subacuática LED multicolor"
      ],
      features: [
        "Estructura autoportante de alta rigidez",
        "Filtración de ozono para agua cristalina permanente",
        "Cobertor térmico de protección incluido"
      ],
      badge: "Lujo & Exclusividad"
    },
    fallbackImage: "/images/loomere/hero_jacuzzi.png",
    videoUrl: "/videos/loomere/video_3.mp4",
    hotspot: { x: 62, y: 56 }
  }
];
