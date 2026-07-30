export type ProductCapacity = '2 personas' | '4 personas' | '6 personas' | '8 personas' | '10+ personas';
export type ProductShape = 'Rectangular' | 'Cuadrado' | 'Circular' | 'Esquinero';
export type ProductInstallation = 'Interior' | 'Exterior';
export type ProductMaterial = 'Acrílico' | 'Fibra de vidrio' | 'Material compuesto premium';
export type ProductAvailability = 'Disponible' | 'Entrega inmediata' | 'Bajo pedido';

export interface HydromassageProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  rating: number;
  reviewsCount: number;
  image: string;
  gallery: string[];
  capacity: ProductCapacity;
  shape: ProductShape;
  installation: ProductInstallation;
  material: ProductMaterial;
  availability: ProductAvailability;
  features: string[];
  isNew: boolean;
  hasFinancing: boolean;
  freeShipping: boolean;
  dimensions: string;
  jets: number;
  powerConsumption: string;
  warranty: string;
}

export const mockHydromassageProducts: HydromassageProduct[] = [
  {
    id: 'h1',
    name: 'Spa Premium Oasis 4',
    slug: 'spa-premium-oasis-4',
    price: 12500000,
    rating: 4.8,
    reviewsCount: 124,
    image: '/images/cat_2_personas.png',
    gallery: ['/images/cat_2_personas.png'],
    capacity: '4 personas',
    shape: 'Cuadrado',
    installation: 'Exterior',
    material: 'Acrílico',
    availability: 'Entrega inmediata',
    features: ['Cromoterapia', 'Sistema de calefacción', 'Jets de alta presión', 'Iluminación LED', 'Control digital'],
    isNew: true,
    hasFinancing: true,
    freeShipping: true,
    dimensions: '200x200x90 cm',
    jets: 45,
    powerConsumption: '1.5 kW/h',
    warranty: '5 años'
  },
  {
    id: 'h2',
    name: 'Jacuzzi Infinity Elite',
    slug: 'jacuzzi-infinity-elite',
    price: 24800000,
    rating: 5.0,
    reviewsCount: 89,
    image: '/images/hero_hydromassage.png',
    gallery: ['/images/hero_hydromassage.png'],
    capacity: '6 personas',
    shape: 'Rectangular',
    installation: 'Exterior',
    material: 'Material compuesto premium',
    availability: 'Bajo pedido',
    features: ['Cromoterapia', 'Cascada', 'Sistema de calefacción', 'Jets de alta presión', 'Bluetooth', 'Iluminación LED', 'Control digital', 'Sistema de ahorro energético'],
    isNew: false,
    hasFinancing: true,
    freeShipping: true,
    dimensions: '230x230x100 cm',
    jets: 72,
    powerConsumption: '2.0 kW/h',
    warranty: '10 años'
  },
  {
    id: 'h3',
    name: 'Tina de Hidromasaje Zen Duo',
    slug: 'tina-hidromasaje-zen-duo',
    price: 5900000,
    rating: 4.6,
    reviewsCount: 45,
    image: '/images/cat_2_personas.png',
    gallery: ['/images/cat_2_personas.png'],
    capacity: '2 personas',
    shape: 'Rectangular',
    installation: 'Interior',
    material: 'Fibra de vidrio',
    availability: 'Disponible',
    features: ['Jets de alta presión', 'Control digital'],
    isNew: false,
    hasFinancing: false,
    freeShipping: false,
    dimensions: '180x120x60 cm',
    jets: 16,
    powerConsumption: '1.0 kW/h',
    warranty: '2 años'
  },
  {
    id: 'h4',
    name: 'Spa Esquinero Serenity',
    slug: 'spa-esquinero-serenity',
    price: 8400000,
    rating: 4.7,
    reviewsCount: 67,
    image: '/images/hero_hydromassage.png', // Fallback image for now
    gallery: ['/images/hero_hydromassage.png'],
    capacity: '4 personas',
    shape: 'Esquinero',
    installation: 'Interior',
    material: 'Acrílico',
    availability: 'Entrega inmediata',
    features: ['Cromoterapia', 'Jets de alta presión', 'Control digital'],
    isNew: true,
    hasFinancing: true,
    freeShipping: true,
    dimensions: '150x150x70 cm',
    jets: 24,
    powerConsumption: '1.2 kW/h',
    warranty: '3 años'
  }
];

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(price);
};
