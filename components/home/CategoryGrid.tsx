import Link from 'next/link';
import { Category } from '@/services/home-service';

export default function CategoryGrid({ categories }: { categories: Category[] }) {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#254153]">Tu hogar espera por un nuevo estilo</h2>
        </div>
        
        <div className="mx-auto mt-12 grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-4 lg:grid-cols-5 justify-items-center">
          {categories.map((category) => (
            <div key={category.id} className="flex flex-col items-center text-center group w-full max-w-[200px]">
              
              {/* Circular Image */}
              <Link href={category.href} className="relative block w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-full overflow-hidden mb-6 shadow-md group-hover:shadow-xl transition-shadow duration-300 border-4 border-transparent group-hover:border-zinc-100">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10"></div>
                <img 
                  src={category.imageUrl} 
                  alt={category.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                />
              </Link>
              
              {/* Text & Button */}
              <h3 className="text-lg font-bold text-[#254153] mb-2 group-hover:text-[#1d3342] transition-colors">
                {category.name}
              </h3>
              <Link 
                href={category.href} 
                className="text-sm font-semibold text-zinc-500 group-hover:text-[#bf2712] transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#bf2712] group-hover:after:w-full after:transition-all after:duration-300"
              >
                Ver productos
              </Link>

            </div>
          ))}

          {/* Fallback mock category for the 5th item if services only returns 4 */}
          {categories.length === 4 && (
             <div className="flex flex-col items-center text-center group w-full max-w-[200px] hidden lg:flex">
             <Link href="/categoria/accesorios" className="relative block w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-full overflow-hidden mb-6 shadow-md group-hover:shadow-xl transition-shadow duration-300 border-4 border-transparent group-hover:border-zinc-100">
               <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10"></div>
               <img 
                 src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                 alt="Accesorios" 
                 className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
               />
             </Link>
             <h3 className="text-lg font-bold text-[#254153] mb-2 group-hover:text-[#1d3342] transition-colors">
               Accesorios
             </h3>
             <Link 
               href="/categoria/accesorios" 
               className="text-sm font-semibold text-zinc-500 group-hover:text-[#bf2712] transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#bf2712] group-hover:after:w-full after:transition-all after:duration-300"
             >
               Ver productos
             </Link>
           </div>
          )}
        </div>

      </div>
    </section>
  );
}
