import { mockBathroomProducts } from '@/services/mock-bathroom-data';
import HeroSection from '@/components/category-bathroom/HeroSection';
import CategoryNavigation from '@/components/category-bathroom/CategoryNavigation';
import FilterSidebar from '@/components/category-bathroom/FilterSidebar';
import ProductCard from '@/components/category-bathroom/ProductCard';
import SortingBar from '@/components/category-bathroom/SortingBar';
import { BuyingGuide, SEOBlock, TrustSection } from '@/components/category-bathroom/AdditionalSections';

export default function BathroomCategoryPage() {
  const products = mockBathroomProducts;

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Categories Navigation */}
      <CategoryNavigation />

      {/* Main Shopping Area */}
      <section id="productos" className="max-w-7xl mx-auto px-4 md:px-8 py-16 flex flex-col lg:flex-row gap-12">
        {/* Sticky Filters Sidebar */}
        <FilterSidebar />

        {/* Products Grid Area */}
        <div className="flex-1">
          <SortingBar totalResults={products.length} />

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Load More (Mock) */}
          <div className="mt-16 text-center">
            <button className="border border-stone-300 text-stone-900 px-8 py-4 uppercase tracking-wider text-sm font-medium hover:bg-stone-50 transition-colors duration-300 font-sans">
              Cargar Más Productos
            </button>
          </div>
        </div>
      </section>

      {/* Informational Sections */}
      <TrustSection />
      <BuyingGuide />
      <SEOBlock />
    </div>
  );
}
