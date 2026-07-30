import Image from 'next/image';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/images/hero_hydromassage.png"
          alt="Luxury Hydromassage Spa"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Elegant dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto flex flex-col items-center">
        <span className="uppercase tracking-[0.2em] text-sm md:text-base mb-4 font-sans text-stone-200">
          Colección Premium
        </span>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-medium mb-6 leading-tight text-shadow-sm">
          Encuentra el hidromasaje perfecto para tu hogar
        </h1>
        <p className="text-lg md:text-xl mb-10 font-sans font-light max-w-2xl text-stone-100">
          Descubre nuestra exclusiva línea de diseño, pensada para brindarte el máximo confort, innovación y bienestar en tu espacio personal.
        </p>
        <Link 
          href="#productos" 
          className="bg-white text-stone-900 px-8 py-4 uppercase tracking-wider text-sm font-medium hover:bg-stone-100 transition-colors duration-300 shadow-lg"
        >
          Explorar Modelos
        </Link>
      </div>
    </section>
  );
}
