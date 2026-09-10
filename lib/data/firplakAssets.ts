import assetsData from './firplak-assets.json';

export interface FirplakProduct {
  title: string;
  slug: string;
  category: string;
  categorySlug: string;
  productUrl: string;
  primaryImage: string;
  secondaryImage: string | null;
  gallery: string[];
}

export interface FirplakAssetIndex {
  updatedAt: string;
  totalProducts: number;
  totalImages: number;
  categories: string[];
  products: FirplakProduct[];
  allImages: string[];
}

export const firplakAssets = assetsData as FirplakAssetIndex;

/**
 * Obtiene un producto buscando por slug o coincidencia en el título
 */
export function getFirplakProduct(query: string): FirplakProduct | undefined {
  const q = query.toLowerCase().trim();
  return firplakAssets.products.find(
    p => p.slug === q || p.slug.includes(q) || p.title.toLowerCase().includes(q)
  );
}

/**
 * Obtiene la URL de la mejor imagen para un producto o palabra clave
 */
export function getFirplakImage(query: string, fallback = '/images/placeholder.webp'): string {
  const q = query.toLowerCase().trim();
  
  // 1. Buscar en productos
  const product = getFirplakProduct(q);
  if (product?.primaryImage) {
    return product.primaryImage;
  }

  // 2. Buscar en el pool total de URLs indexadas
  const match = firplakAssets.allImages.find(url => url.toLowerCase().includes(q));
  if (match) {
    return match;
  }

  return fallback;
}

/**
 * Obtiene todos los productos de una categoría
 */
export function getFirplakProductsByCategory(categorySlugOrName: string): FirplakProduct[] {
  const q = categorySlugOrName.toLowerCase().trim();
  return firplakAssets.products.filter(
    p => p.categorySlug.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
  );
}

/**
 * Realiza búsqueda difusa sobre productos e imágenes
 */
export function searchFirplakAssets(term: string): FirplakProduct[] {
  const q = term.toLowerCase().trim();
  return firplakAssets.products.filter(
    p => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.slug.includes(q)
  );
}
