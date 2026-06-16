import Image from 'next/image';

const categories = [
  { id: 1, name: '2 personas', count: 12, image: '/images/cat_2_personas.png' },
  { id: 2, name: '4 personas', count: 8, image: '/images/hero_hydromassage.png' },
  { id: 3, name: '6 personas', count: 5, image: '/images/hero_hydromassage.png' },
  { id: 4, name: '8+ personas', count: 3, image: '/images/hero_hydromassage.png' },
  { id: 5, name: 'Lujo Premium', count: 6, image: '/images/hero_hydromassage.png' },
  { id: 6, name: 'Exteriores', count: 15, image: '/images/hero_hydromassage.png' },
  { id: 7, name: 'Interiores', count: 9, image: '/images/cat_2_personas.png' },
  { id: 8, name: 'Con Calefacción', count: 21, image: '/images/hero_hydromassage.png' },
];

export default function CategoryNavigation() {
  return (
    <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-8 border-b border-stone-200 pb-4">
        <div>
          <h2 className="text-3xl font-serif text-stone-900">Explorar Categorías</h2>
          <p className="text-stone-500 mt-2 font-sans">Encuentra el modelo ideal según tus necesidades</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {categories.map((category) => (
          <div 
            key={category.id} 
            className="group relative cursor-pointer overflow-hidden bg-stone-100 aspect-[4/3]"
          >
            <Image
              src={category.image}
              alt={category.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>
            <div className="absolute bottom-0 left-0 w-full p-4 md:p-6 bg-gradient-to-t from-black/80 to-transparent">
              <h3 className="text-white font-serif text-lg md:text-xl">{category.name}</h3>
              <p className="text-stone-300 text-sm font-sans mt-1">{category.count} Productos</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
