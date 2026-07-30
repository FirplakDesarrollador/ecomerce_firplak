import Image from 'next/image';

const categories = [
  { id: 1, name: 'Muebles Suspendidos', count: 2, image: '/cat-lavamanos.webp' },
  { id: 2, name: 'Muebles de Piso', count: 1, image: '/cat-lavadero.webp' },
  { id: 3, name: 'Gabinetes y Espejos', count: 1, image: '/cat-lavamanos.webp' },
  { id: 4, name: 'Muebles Auxiliares', count: 1, image: '/cat-lavadero.webp' },
];

export default function CategoryNavigation() {
  return (
    <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-8 border-b border-stone-200 pb-4">
        <div>
          <h2 className="text-3xl font-serif text-stone-900 font-medium">Explorar Líneas de Diseño</h2>
          <p className="text-stone-500 mt-2 font-sans">Encuentra la solución ideal para el almacenamiento de tu baño</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {categories.map((category) => (
          <div 
            key={category.id} 
            className="group relative cursor-pointer overflow-hidden bg-stone-100 aspect-[4/3] rounded-sm"
          >
            <Image
              src={category.image}
              alt={category.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/35 transition-colors duration-300"></div>
            <div className="absolute bottom-0 left-0 w-full p-4 md:p-6 bg-gradient-to-t from-black/85 to-transparent">
              <h3 className="text-white font-serif text-lg md:text-xl font-medium">{category.name}</h3>
              <p className="text-stone-300 text-sm font-sans mt-1">{category.count} Productos</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
