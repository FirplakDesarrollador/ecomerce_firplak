export type BathroomProductType = 'Suspendido' | 'De piso' | 'Auxiliar' | 'Espejos';
export type BathroomMaterial = 'Madera RH (Resistente Humedad)' | 'Acrílico' | 'Material compuesto' | 'Vidrio templado';
export type BathroomColor = 'Madera Clara' | 'Grafito' | 'Blanco Brillante' | 'Rústico';
export type BathroomAvailability = 'Disponible' | 'Entrega inmediata' | 'Bajo pedido';

export interface BathroomProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  rating: number;
  reviewsCount: number;
  image: string;
  gallery: string[];
  type: BathroomProductType;
  material: BathroomMaterial;
  dimensions: string;
  color: BathroomColor;
  compatibility: string;
  availability: BathroomAvailability;
  features: string[];
  isNew: boolean;
  hasFinancing: boolean;
  freeShipping: boolean;
  warranty: string;
}

export const mockBathroomProducts: BathroomProduct[] = [
  {
    id: 'b1',
    name: 'Mueble de Baño Suspendido Volga 60',
    slug: 'mueble-bano-suspendido-volga-60',
    price: 850000,
    rating: 4.8,
    reviewsCount: 42,
    image: '/cat-lavamanos.webp',
    gallery: ['/cat-lavamanos.webp'],
    type: 'Suspendido',
    material: 'Madera RH (Resistente Humedad)',
    dimensions: '60x45x48 cm',
    color: 'Madera Clara',
    compatibility: 'Lavamanos de sobreponer',
    availability: 'Entrega inmediata',
    features: ['Cajón con cierre lento', 'Herrajes de cierre suave', 'Resistente a la humedad', 'Diseño flotante minimalista'],
    isNew: true,
    hasFinancing: true,
    freeShipping: true,
    warranty: '5 años'
  },
  {
    id: 'b2',
    name: 'Mueble de Baño de Piso Sena 80',
    slug: 'mueble-bano-piso-sena-80',
    price: 1250000,
    rating: 4.9,
    reviewsCount: 31,
    image: '/cat-lavadero.webp',
    gallery: ['/cat-lavadero.webp'],
    type: 'De piso',
    material: 'Madera RH (Resistente Humedad)',
    dimensions: '80x48x85 cm',
    color: 'Grafito',
    compatibility: 'Lavamanos integrado',
    availability: 'Disponible',
    features: ['Doble cajonera profunda', 'Patas regulables en altura', 'Superficie de fácil limpieza', 'Cierre suave'],
    isNew: false,
    hasFinancing: true,
    freeShipping: true,
    warranty: '5 años'
  },
  {
    id: 'b3',
    name: 'Gabinete con Espejo LED Aura 60',
    slug: 'gabinete-espejo-led-aura-60',
    price: 650000,
    rating: 4.7,
    reviewsCount: 19,
    image: '/cat-lavamanos.webp',
    gallery: ['/cat-lavamanos.webp'],
    type: 'Espejos',
    material: 'Vidrio templado',
    dimensions: '60x12x70 cm',
    color: 'Blanco Brillante',
    compatibility: 'Instalación a muro',
    availability: 'Entrega inmediata',
    features: ['Iluminación LED indirecta', 'Interruptor táctil sensor', 'Repisas interiores ajustables', 'Desempañador automático'],
    isNew: true,
    hasFinancing: false,
    freeShipping: false,
    warranty: '2 años'
  },
  {
    id: 'b4',
    name: 'Mueble Auxiliar Columna Siena',
    slug: 'mueble-auxiliar-columna-sena',
    price: 490000,
    rating: 4.6,
    reviewsCount: 27,
    image: '/cat-lavadero.webp',
    gallery: ['/cat-lavadero.webp'],
    type: 'Auxiliar',
    material: 'Madera RH (Resistente Humedad)',
    dimensions: '35x30x150 cm',
    color: 'Rústico',
    compatibility: 'Instalación a muro o de piso',
    availability: 'Disponible',
    features: ['Ahorro de espacio vertical', 'Puerta reversible', '4 nichos de almacenamiento', 'Fácil armado'],
    isNew: false,
    hasFinancing: false,
    freeShipping: true,
    warranty: '3 años'
  },
  {
    id: 'b5',
    name: 'Mueble de Baño Suspendido Milan 100',
    slug: 'mueble-bano-suspendido-milan-100',
    price: 1890000,
    rating: 5.0,
    reviewsCount: 14,
    image: '/cat-lavamanos.webp',
    gallery: ['/cat-lavamanos.webp'],
    type: 'Suspendido',
    material: 'Material compuesto',
    dimensions: '100x50x50 cm',
    color: 'Grafito',
    compatibility: 'Lavamanos doble o sencillo',
    availability: 'Bajo pedido',
    features: ['Tope de cuarzo premium', 'Cajón organizador interno', 'Estructura termoformada sin juntas', 'Gran capacidad de almacenamiento'],
    isNew: true,
    hasFinancing: true,
    freeShipping: true,
    warranty: '8 años'
  }
];

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(price);
};
