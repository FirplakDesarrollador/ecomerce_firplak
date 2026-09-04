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
    tag: "CAPÍTULO 01 — RITUAL MATUTINO",
    title: "El Despertar",
    headline: "Pureza sensorial para comenzar el día",
    description: "La luz dorada de la mañana baña el baño arquitectónico. La suavidad del mármol sintético satinado y la fluidez del agua acompañan el primer momento de introspección y cuidado personal.",
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
      id: "lavadero-ergonomico-alpes",
      name: "Lavadero Ergonómico Alpes con Mueble RH",
      category: "Zona de Labores",
      material: "Resina Sintética de Alto Impacto & Gabinete RH",
      price: "$689.000 COP",
      dimensions: "60 cm × 50 cm × 88 cm",
      specs: [
        "Pozo profundo de 28 litros con fregadero inclinado estriado",
        "Mueble inferior con bisagras inoxidables para almacenamiento",
        "Resistente a químicos de limpieza, detergentes y rayos UV"
      ],
      features: [
        "Ergonomía certificada para evitar molestias lumbares",
        "Gabinete ventilado anti-humedad",
        "Acabado granítico texturizado de larga durabilidad"
      ],
      badge: "Esencial Hogar"
    },
    fallbackImage: "/images/loomere/lavadero.webp",
    videoUrl: "/videos/loomere/video_2.mp4",
    hotspot: { x: 64, y: 54 }
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
