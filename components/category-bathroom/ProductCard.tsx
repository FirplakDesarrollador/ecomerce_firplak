import Image from 'next/image';
import { Heart, Plus, ShoppingCart, Star } from 'lucide-react';
import { formatPrice, BathroomProduct } from '@/services/mock-bathroom-data';

interface ProductCardProps {
  product: BathroomProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group flex flex-col bg-white border border-transparent hover:border-stone-200 transition-all duration-300 relative rounded-sm">
      {/* Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {product.isNew && (
          <span className="bg-stone-900 text-white text-[10px] uppercase tracking-wider px-2.5 py-1 font-semibold font-sans">Nuevo</span>
        )}
        <span className="bg-white/95 backdrop-blur text-stone-800 text-[10px] uppercase tracking-wider px-2.5 py-1 border border-stone-100 shadow-sm font-semibold font-sans">
          {product.type}
        </span>
      </div>

      {/* Wishlist Button */}
      <button className="absolute top-4 right-4 z-10 p-2.5 bg-white/80 backdrop-blur rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white text-stone-400 hover:text-rose-500 shadow-sm">
        <Heart size={18} />
      </button>

      {/* Image Gallery */}
      <div className="relative aspect-square overflow-hidden bg-stone-50 mb-4 rounded-t-sm">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
        />
        {/* Quick actions overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-center gap-2">
          <button className="flex-1 bg-white text-stone-900 py-2.5 text-xs uppercase tracking-wide font-semibold hover:bg-stone-100 transition-colors flex items-center justify-center gap-1.5 shadow-sm">
            <Plus size={14} /> Comparar
          </button>
          <button className="flex-1 bg-[#254153] text-white py-2.5 text-xs uppercase tracking-wide font-semibold hover:bg-[#1d3342] transition-colors flex items-center justify-center gap-1.5 shadow-sm">
            <ShoppingCart size={14} /> Comprar
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="px-4 pb-6 flex flex-col flex-grow">
        <div className="flex items-center gap-1 mb-2">
          <div className="flex text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={12} fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'} />
            ))}
          </div>
          <span className="text-xs text-stone-400 ml-1 font-sans">({product.reviewsCount})</span>
        </div>

        <h3 className="text-lg font-serif text-stone-900 mb-1.5 line-clamp-1 group-hover:text-[#254153] transition-colors font-medium">{product.name}</h3>
        <p className="text-xs text-stone-500 mb-4 line-clamp-2 font-sans">{product.features.slice(0, 3).join(' • ')}</p>

        <div className="mt-auto pt-4 border-t border-stone-100 flex items-end justify-between">
          <div>
            <p className="text-xl font-semibold text-stone-900 font-sans">{formatPrice(product.price)}</p>
            {product.hasFinancing && (
              <p className="text-[10px] text-stone-500 mt-1 uppercase tracking-wider font-semibold font-sans">Financiación disponible</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
