export interface Category {
  id: string;
  name: string;
  imageUrl: string;
  href: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  href: string;
  badge?: string;
}

export async function getCategories(): Promise<Category[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  return [
    {
      id: '1',
      name: 'Bañeras',
      imageUrl: '/cat-baneras.webp',
      href: '/categoria/baneras'
    },
    {
      id: '2',
      name: 'Lavamanos',
      imageUrl: '/cat-lavamanos.webp',
      href: '/categoria/lavamanos'
    },
    {
      id: '3',
      name: 'Muebles de Baño',
      imageUrl: '/cat-lavadero.webp', // Usando la imagen del lavadero/mueble
      href: '/categoria/muebles-bano'
    },
    {
      id: '4',
      name: 'Cocinas',
      imageUrl: '/cat-cocinas.webp', // Usando la imagen de la cocina
      href: '/categoria/cocinas'
    }
  ];
}

export async function getFeaturedProducts(): Promise<Product[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  return [
    {
      id: 'p1',
      name: 'Bañera Isla Exenta Acrílica Blanca',
      price: 2850000,
      imageUrl: '/cat-baneras.webp',
      href: '/producto/banera-isla',
      badge: 'Nuevo'
    },
    {
      id: 'p2',
      name: 'Lavamanos Vessel Rectangular Cerámica',
      price: 185000,
      imageUrl: '/cat-lavamanos.webp',
      href: '/producto/lavamanos-vessel',
      badge: 'Descuento'
    },
    {
      id: 'p3',
      name: 'Mueble de Baño Suspendido 60cm',
      price: 450000,
      imageUrl: '/cat-lavadero.webp',
      href: '/producto/mueble-bano'
    },
    {
      id: 'p4',
      name: 'Módulo de Cocina Integral',
      price: 1200000,
      imageUrl: '/cat-cocinas.webp',
      href: '/producto/cocina-integral',
      badge: 'Premium'
    }
  ];
}
