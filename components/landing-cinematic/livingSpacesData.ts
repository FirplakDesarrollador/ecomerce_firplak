import { SceneProduct } from '@/components/loomere/sceneData';

export interface LivingSpaceScene {
  id: number;
  timeSlot: string;
  roomName: string;
  tag: string;
  title: string;
  headline: string;
  description: string;
  product: SceneProduct;
  fallbackImage: string;
  productImage: string;
  videoUrl: string;
  videoUrlMobile: string;
  hotspot: {
    x: number; // percentage from left
    y: number; // percentage from top
  };
}

export const LIVING_SPACES_SCENES: LivingSpaceScene[] = [
  {
    id: 0,
    timeSlot: "08:00 AM · El Ritual Matutino",
    roomName: "El Baño",
    tag: "VANITORIO FLOTANTE FIRPLAK",
    title: "El Baño",
    headline: "Despertar en balance. La pureza del diseño suspendido.",
    description: "Líneas depuradas que flotan sobre el espacio, cajón retroiluminado LED cálido y grifería monomando negro mate.",
    product: {
      id: "vanitorio-flotante-white",
      name: "Mueble Vanitorio Flotante con Espejo Halo",
      category: "Muebles de Baño",
      material: "Madera hidrófuga lacada en blanco mate con encimera de cuarzo",
      price: "Consultar con asesor",
      dimensions: "90 cm × 50 cm × 55 cm",
      specs: [
        "Cajón de extracción total con iluminación LED perimetral integrada",
        "Encimera en superficie sólida antibacteriana con desagüe oculto",
        "Grifería monomando alta en acabado negro mate anticorrosión",
        "Resistencia certificada a la humedad y vapor de agua"
      ],
      features: [
        "Apertura suave y silenciosa con cierre amortiguado Soft-Close",
        "Instalación suspendida que maximiza la amplitud visual del piso",
        "Acabado mate de tacto sedoso antihuellas"
      ],
      badge: "Edición Living Spaces"
    },
    fallbackImage: "/images/living-spaces/01_ambiente_vanitory.png",
    productImage: "/images/living-spaces/01_ambiente_vanitory.png",
    videoUrl: "/videos/living-spaces/01_bano_scrollcraft.mp4",
    videoUrlMobile: "/videos/living-spaces/01_bano_scrollcraft.mp4",
    hotspot: {
      x: 38,
      y: 58
    }
  },
  {
    id: 1,
    timeSlot: "12:30 PM · El Arte de Compartir",
    roomName: "La Cocina",
    tag: "COCINA MODULAR CALACATTA",
    title: "La Cocina",
    headline: "Carácter mineral y calidez terrosa. La nueva cocina viva.",
    description: "Contraste contemporáneo en tonos terracota, alacenas superiores crema marfil y Mármol Calacatta Viola de vetas profundas.",
    product: {
      id: "cocina-modular-terracota",
      name: "Cocina Integral Modular Terracota & Calacatta",
      category: "Cocinas Integrales",
      material: "Módulos termolaminados terracota y encimera en piedra sinterizada Calacatta Viola",
      price: "Proyecto a medida",
      dimensions: "320 cm × 60 cm × 230 cm",
      specs: [
        "Encimera y salpicadero continuo con tolerancia a altas temperaturas",
        "Cajoneras con divisores organizadores de roble y cierre amortiguado",
        "Módulos superiores con iluminación rasante LED 2700K bajo alacena",
        "Módulo torre para horno empotrado y campana de extracción de diseño"
      ],
      features: [
        "Diseño arquitectónico europeo de líneas puras sin tiradores visibles",
        "Piedra sinterizada de ultra-bajo poro resistente a manchas y ácidos",
        "Garantía estructural Firplak de larga durabilidad"
      ],
      badge: "Arquitectura & Hogar"
    },
    fallbackImage: "/images/living-spaces/03_ambiente_cocina.png",
    productImage: "/images/living-spaces/03_ambiente_cocina.png",
    videoUrl: "/videos/living-spaces/02_cocina_scrollcraft.mp4",
    videoUrlMobile: "/videos/living-spaces/02_cocina_scrollcraft.mp4",
    hotspot: {
      x: 32,
      y: 55
    }
  },
  {
    id: 2,
    timeSlot: "04:00 PM · El Equilibrio Cotidiano",
    roomName: "Zona de Lavado",
    tag: "CENTRO DE LAVADO COMPACTO",
    title: "Zona de Lavado",
    headline: "Funcionalidad impecable. La armonía de lo esencial.",
    description: "Mobiliario modular que optimiza el espacio con poceta integrada de alta resistencia, alacena vertical y nichos abiertos.",
    product: {
      id: "centro-lavado-modular",
      name: "Centro de Lavado & Alacena Compacta",
      category: "Zona de Ropas & Lavaderos",
      material: "Superficie sólida compuesta y muebles en MDF hidrófugo blanco cálido",
      price: "Consultar con asesor",
      dimensions: "120 cm × 60 cm × 210 cm",
      specs: [
        "Poceta con frotador ergonómico integrado de fácil limpieza",
        "Grifería extensible cuello de ganso en acero pulido",
        "Alacena superior con baldas regulables para blancos y toallas",
        "Gabinete inferior con tolva oculta para ropa sucia y detergentes"
      ],
      features: [
        "Resistencia química a detergentes y desinfectantes domésticos",
        "Superficie no porosa que previene moho y bacterias",
        "Integración estética con electrodomésticos de lavado y secado"
      ],
      badge: "Eficiencia Ergonómica"
    },
    fallbackImage: "/images/living-spaces/04_ambiente_lavanderia.png",
    productImage: "/images/living-spaces/04_ambiente_lavanderia.png",
    videoUrl: "/videos/living-spaces/03_lavanderia_scrollcraft.mp4",
    videoUrlMobile: "/videos/living-spaces/03_lavanderia_scrollcraft.mp4",
    hotspot: {
      x: 46,
      y: 62
    }
  },
  {
    id: 3,
    timeSlot: "06:45 PM · El Santuario al Atardecer",
    roomName: "El Hidromasaje",
    tag: "BAÑERA EXENTA SPA RETREAT",
    title: "El Hidromasaje",
    headline: "Silencio, agua y textura. Tu santuario privado.",
    description: "Hidroterapia envolvente con almohadillas ergonómicas y burbujas relajantes frente al crepúsculo dorado.",
    product: {
      id: "banera-exenta-hidromasaje",
      name: "Bañera Exenta Spa con Sistema de Hidromasaje",
      category: "Bañeras & Hidromasajes",
      material: "Acrílico sanitario reforzado con fibra de vidrio y aislamiento térmico",
      price: "Consultar con asesor",
      dimensions: "175 cm × 85 cm × 68 cm",
      specs: [
        "Sistema de hidromasaje multisensorial con jets dorsales y laterales",
        "Doble cabezal ergonómico en poliuretano soft-touch lavable",
        "Grifería empotrada de llenado rápido y mandos de precisión cromados",
        "Mantenimiento de temperatura de agua mediante recirculación aislada"
      ],
      features: [
        "Diseño escultórico autoportante exento que jerarquiza el baño",
        "Bomba de agua ultra-silenciosa con protección antirrebase",
        "Garantía Firplak de acrílico de brillo permanente"
      ],
      badge: "Bienestar & Placer"
    },
    fallbackImage: "/images/living-spaces/02_ambiente_banera.png",
    productImage: "/images/living-spaces/02_ambiente_banera.png",
    videoUrl: "/videos/living-spaces/04_hidromasaje_scrollcraft.mp4",
    videoUrlMobile: "/videos/living-spaces/04_hidromasaje_scrollcraft.mp4",
    hotspot: {
      x: 52,
      y: 56
    }
  }
];
