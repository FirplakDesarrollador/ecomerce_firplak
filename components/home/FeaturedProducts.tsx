import Link from 'next/link';
import { Product } from '@/services/home-service';
import { ShoppingCart } from 'lucide-react';

export default function FeaturedProducts({ products }: { products: Product[] }) {
  return (
    <section className="bg-zinc-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Destacados del mes</h2>
          <Link href="/catalogo" className="text-sm font-semibold text-[#254153] hover:text-[#1d3342] transition-colors">Ver todos &rarr;</Link>
        </div>
        
        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <div key={product.id} className="group relative flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-zinc-100">
              <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden bg-gray-200 lg:aspect-none group-hover:opacity-75 h-64 lg:h-80 relative">
                {product.badge && (
                  <span className="absolute top-4 left-4 z-10 rounded-full bg-[#bf2712] px-3 py-1 text-xs font-bold text-white shadow-sm">
                    {product.badge}
                  </span>
                )}
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-full w-full object-cover object-center lg:h-full lg:w-full transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                    <Link href={product.href}>
                      <span aria-hidden="true" className="absolute inset-0" />
                      {product.name}
                    </Link>
                  </h3>
                </div>
                <div className="mt-4 flex items-center justify-between relative z-20">
                  <p className="text-lg font-bold text-[#254153]">
                    ${product.price.toLocaleString('es-CO')}
                  </p>
                  <button className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 hover:bg-[#254153] hover:text-white transition-colors cursor-pointer" aria-label="Añadir al carrito">
                    <ShoppingCart className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
