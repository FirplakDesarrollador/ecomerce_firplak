import Hero from '@/components/home/Hero';
import CategoryGrid from '@/components/home/CategoryGrid';
import PromoBanners from '@/components/home/PromoBanners';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import FeaturesGrid from '@/components/home/FeaturesGrid';
import { getCategories, getFeaturedProducts } from '@/services/home-service';

export default async function Home() {
  const categories = await getCategories();
  const featuredProducts = await getFeaturedProducts();

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Banner Slider */}
      <Hero />
      
      {/* 2. Categorías (Círculos) */}
      <CategoryGrid categories={categories} />
      
      {/* 3. Novedades (Banners) */}
      <PromoBanners />
      
      {/* 4. Productos Destacados */}
      <FeaturedProducts products={featuredProducts} />

      {/* 5. Propuestas de Valor */}
      <FeaturesGrid />
    </div>
  );
}
