import Link from 'next/link';
import Image from 'next/image';

export default function PromoBanners() {
  return (
    <section className="bg-zinc-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-[#254153]">Novedades</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Banner 1 */}
          <div className="relative overflow-hidden rounded-2xl group h-[300px] md:h-[400px] bg-zinc-800">
            <Image
              src="https://images.unsplash.com/photo-1556910103-1c02745a872f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
              alt="Tu cocina, el lugar perfecto"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-70 group-hover:opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            
            <div className="absolute inset-0 p-8 flex flex-col justify-end">
              <h3 className="text-3xl font-bold text-white mb-4 shadow-sm">
                Tu cocina,<br/> el lugar perfecto
              </h3>
              <Link 
                href="/categoria/cocinas" 
                className="inline-flex items-center justify-center rounded-full bg-white text-[#254153] px-6 py-3 text-sm font-bold shadow-md transition-all hover:bg-zinc-200 hover:scale-105 w-max"
              >
                Conoce más
              </Link>
            </div>
          </div>

          {/* Banner 2 */}
          <div className="relative overflow-hidden rounded-2xl group h-[300px] md:h-[400px] bg-zinc-800">
            <Image
              src="https://images.unsplash.com/photo-1620626011761-996317b8d101?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
              alt="Diseño con acabado premium"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-70 group-hover:opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#254153]/90 via-[#254153]/40 to-transparent"></div>
            
            <div className="absolute inset-0 p-8 flex flex-col justify-end">
              <span className="text-[#bf2712] font-bold uppercase tracking-wider text-sm mb-2 drop-shadow-md">Nuevo lanzamiento</span>
              <h3 className="text-3xl font-bold text-white mb-4 shadow-sm">
                Diseño con acabado premium
              </h3>
              <Link 
                href="/categoria/banos" 
                className="inline-flex items-center justify-center rounded-full bg-[#bf2712] text-white px-6 py-3 text-sm font-bold shadow-md transition-all hover:bg-[#a0200e] hover:scale-105 w-max"
              >
                Ver colección
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
