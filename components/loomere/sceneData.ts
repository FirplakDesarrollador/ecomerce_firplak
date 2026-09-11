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
  /** Marcador de tramo mostrado en los dots de progreso (ej. "01 · Exterior"). */
  time: string;
  tag: string;
  title: string;
  headline: string;
  description: string;
  product: SceneProduct;
  /** Poster del video: debe coincidir con el primer fotograma del clip. */
  fallbackImage: string;
  /** Foto de catálogo del producto para el drawer. Cae a fallbackImage si falta. */
  productImage?: string;
  videoUrl?: string;
  /** Variante 720p con GOP mas denso para movil. */
  videoUrlMobile?: string;
  hotspot: {
    x: number; // percentage from left
    y: number; // percentage from top
  };
}

/**
 * Guion: "El Viaje de los Sentidos".
 * Cuatro tramos que el usuario recorre con el scroll:
 * Exterior (jacuzzi) → Baño → Lavandería → Cocina → CTA final.
 *
 * ⚠️ DATO COMERCIAL PLACEHOLDER: `price`, `dimensions`, `specs` y `badge` son
 * provisionales para el prototipo. Deben venir del catálogo real (Supabase)
 * antes de cualquier publicación — no son datos verificados de Firplak.
 * La única medida tomada de un asset real es 155×48 del lavamanos Oslo/Macao.
 */
export const LOOMERE_SCENES: LoomereScene[] = [
  {
    id: 0,
    time: "01 · Exterior",
    tag: "JACUZZI MYDAS 180",
    title: "El Exterior",
    headline: "El Despertar de los Sentidos.",
    description: "Espacios diseñados para tu bienestar exterior.",
    product: {
      id: "jacuzzi-mydas-180",
      name: "Jacuzzi Mydas 180",
      category: "Hidromasajes y Spas",
      material: "Acrílico sanitario reforzado con faldón en madera",
      price: "Consultar con asesor",
      dimensions: "180 cm × 180 cm",
      specs: [
        "Sistema de hidromasaje con jets direccionables",
        "Requiere pre-instalación eléctrica con GFCI dedicado",
        "Apto para instalación en terraza o exterior cubierto"
      ],
      features: [
        "Garantía de 5 años con instalación certificada",
        "Cromoterapia LED integrada",
        "Cubierta térmica protectora disponible"
      ],
      badge: "Instalación certificada"
    },
    fallbackImage: "/images/loomere/viaje_1_exterior.webp",
    productImage: "/images/loomere/Hidromasaje Galapagos Básica empotrar 250X200 Blanco Sin luces.jpg",
    videoUrl: "/videos/loomere/viaje_1_exterior.mp4",
    videoUrlMobile: "/videos/loomere/viaje_1_exterior-m.mp4",
    hotspot: { x: 50, y: 58 }
  },
  {
    id: 1,
    time: "02 · Baño",
    tag: "LAVAMANOS OSLO / MUEBLE MACAO",
    title: "El Baño Boutique",
    headline: "Elegancia en Cada Detalle.",
    description: "Materiales que transforman lo cotidiano en un ritual.",
    product: {
      id: "lavamanos-oslo-mueble-macao",
      name: "Lavamanos Oslo con Mueble Macao",
      category: "Baños",
      material: "Mármol sintético no poroso + aglomerado RH",
      price: "Consultar con asesor",
      dimensions: "155 cm × 48 cm",
      specs: [
        "Superficie no porosa, resistente a manchas y rayones",
        "Mueble en aglomerado resistente a la humedad (RH)",
        "Compatible con grifería monocontrol o de pared"
      ],
      features: [
        "Confirmá la orientación del mueble antes de comprar",
        "Sifón y desagüe incluidos",
        "Disponible en Envío Rápido según referencia"
      ],
      badge: "Línea Oslo"
    },
    fallbackImage: "/images/loomere/viaje_2_bano.webp",
    productImage: "/images/loomere/Oslo-Blanco-Macao-Class-Gracia-155x48-Web.webp",
    videoUrl: "/videos/loomere/viaje_2_bano.mp4",
    videoUrlMobile: "/videos/loomere/viaje_2_bano-m.mp4",
    hotspot: { x: 42, y: 56 }
  },
  {
    id: 2,
    time: "03 · Lavandería",
    tag: "ZONA DE LAVANDERÍA — LÍNEA PRO",
    title: "Zona de Lavandería",
    headline: "Funcionalidad Reinventada.",
    description: "Soluciones inteligentes que mantienen la armonía de tu hogar.",
    product: {
      id: "combo-lavadero-linea-pro",
      name: "Combo Lavadero Línea Pro con Mueble RH",
      category: "Zona de Ropas",
      material: "Mármol sintético no poroso + aglomerado RH",
      price: "Consultar con asesor",
      dimensions: "Disponible en 80, 100 y 120 cm",
      specs: [
        "Tanque profundo con estregadero ergonómico en una sola pieza",
        "Selector de orientación de estregadero (izquierda o derecha)",
        "Sifón flexible de 2\" para desagüe de lavadora"
      ],
      features: [
        "Envío Rápido en referencias seleccionadas (<48 h)",
        "Mueble organizador que oculta la tubería",
        "Compatible con grifería de pared y llave terminal"
      ],
      badge: "Línea Pro"
    },
    fallbackImage: "/images/loomere/viaje_3_lavanderia.webp",
    productImage: "/images/loomere/lavadero.webp",
    videoUrl: "/videos/loomere/viaje_3_lavanderia.mp4",
    videoUrlMobile: "/videos/loomere/viaje_3_lavanderia-m.mp4",
    hotspot: { x: 55, y: 60 }
  },
  {
    id: 3,
    time: "04 · Cocina",
    tag: "COCINA JADE",
    title: "La Cocina",
    headline: "El Corazón del Hogar.",
    description: "Diseño abierto que inspira tus mejores momentos.",
    product: {
      id: "cocina-integral-jade",
      name: "Cocina Integral Jade",
      category: "Cocinas Integrales",
      material: "Tableros RH con mesón en Quartzstone",
      price: "Consultar con asesor",
      dimensions: "Módulos de 1.20 m a 2.00 m lineales",
      specs: [
        "Mesón en Quartzstone o mármol sintético",
        "Confirmá la orientación de la poceta (izquierda o derecha)",
        "Espacio previsto para estufa y campana extractora"
      ],
      features: [
        "Muebles superiores con pistones de gas",
        "Cajones caceroleros y cubierteros",
        "Venta cruzada con grifería flexible y canastillas en acero"
      ],
      badge: "Cocina Jade"
    },
    fallbackImage: "/images/loomere/viaje_4_cocina.webp",
    productImage: "/images/loomere/cocina.png",
    videoUrl: "/videos/loomere/viaje_4_cocina.mp4",
    videoUrlMobile: "/videos/loomere/viaje_4_cocina-m.mp4",
    hotspot: { x: 60, y: 55 }
  }
];
