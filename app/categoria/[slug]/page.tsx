import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, ChevronRight, Home, SlidersHorizontal, ChevronDown, Eye, Filter } from 'lucide-react';
import { Product } from '@/services/home-service';

export default async function CategoriaPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  
  const title = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  const mockProducts: Product[] = [
    {
      id: `mock-1-${slug}`,
      name: `Lavadero en Acero Inoxidable Premium para ${title}`,
      price: 150000,
      imageUrl: '/cat-lavadero.webp',
      href: `/producto/mock-1-${slug}`,
      badge: 'Nuevo'
    },
    {
      id: `mock-2-${slug}`,
      name: `Mueble Organizador Multifuncional ${title}`,
      price: 250000,
      imageUrl: '/cat-lavadero.webp',
      href: `/producto/mock-2-${slug}`
    },
    {
      id: `mock-3-${slug}`,
      name: `Kit de Aseo y Limpieza Profesional`,
      price: 350000,
      imageUrl: '/cat-lavadero.webp',
      href: `/producto/mock-3-${slug}`,
      badge: 'Más Vendido'
    },
    {
      id: `mock-4-${slug}`,
      name: `Poceta de Cerámica Alta Resistencia`,
      price: 450000,
      imageUrl: '/cat-lavadero.webp',
      href: `/producto/mock-4-${slug}`
    },
    {
      id: `mock-5-${slug}`,
      name: `Estante Flotante Minimalista Diseño Exclusivo`,
      price: 120000,
      imageUrl: '/cat-lavadero.webp',
      href: `/producto/mock-5-${slug}`
    },
    {
      id: `mock-6-${slug}`,
      name: `Grifería Monocontrol Elegance para ${title}`,
      price: 280000,
      imageUrl: '/cat-lavadero.webp',
      href: `/producto/mock-6-${slug}`,
      badge: '-15%'
    },
    {
      id: `mock-7-${slug}`,
      name: `Set de Canastas Organizadoras Premium`,
      price: 85000,
      imageUrl: '/cat-lavadero.webp',
      href: `/producto/mock-7-${slug}`
    },
    {
      id: `mock-8-${slug}`,
      name: `Módulo Esquinero con Acabado Brillante`,
      price: 310000,
      imageUrl: '/cat-lavadero.webp',
      href: `/producto/mock-8-${slug}`,
      badge: 'Últimas unidades'
    }
  ];

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Hero Section */}
      <div className="relative bg-[#254153] overflow-hidden pt-24 pb-16 lg:pt-32 lg:pb-24">
        {/* Subtle background patterns */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#1d3342] via-[#254153] to-[#2a4d63]"></div>
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          {/* Breadcrumbs */}
          <nav className="flex mb-8" aria-label="Breadcrumb">
            <ol role="list" className="flex items-center space-x-2 text-sm text-zinc-300">
              <li>
                <Link href="/" className="hover:text-white transition-colors flex items-center">
                  <Home className="h-4 w-4" />
                  <span className="sr-only">Inicio</span>
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRight className="h-4 w-4 flex-shrink-0 text-zinc-400" aria-hidden="true" />
                  <span className="ml-2 text-zinc-400">Categorías</span>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRight className="h-4 w-4 flex-shrink-0 text-zinc-400" aria-hidden="true" />
                  <span className="ml-2 font-medium text-white" aria-current="page">{title}</span>
                </div>
              </li>
            </ol>
          </nav>
          
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-6 drop-shadow-sm">
            {title}
          </h1>
          <p className="max-w-2xl text-lg text-zinc-300 font-light">
            Descubre nuestra exclusiva colección diseñada para transformar tu espacio. Funcionalidad superior y diseño de vanguardia en cada detalle.
          </p>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-x-8">
          
          {/* Sidebar Filters (Left Column) */}
          <aside className="w-full lg:w-[280px] mb-10 lg:mb-0 flex-shrink-0 hidden md:block">
            <div className="sticky top-24 bg-white p-6 rounded-3xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] border border-zinc-100/50">
              <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-zinc-100">
                <Filter className="h-5 w-5 text-[#bf2712]" />
                <h2 className="text-lg font-bold text-[#254153]">Filtros</h2>
              </div>
              
              {/* Categorías Filter */}
              <div className="mb-8">
                <h3 className="text-xs font-black text-zinc-400 mb-4 uppercase tracking-widest">Subcategorías</h3>
                <ul className="space-y-3">
                  {['Lavaderos', 'Muebles organizadores', 'Pocetas', 'Accesorios', 'Grifería'].map((cat, idx) => (
                    <li key={idx} className="flex items-center group">
                      <input type="checkbox" id={`cat-${idx}`} className="h-4 w-4 rounded border-zinc-300 text-[#bf2712] focus:ring-[#bf2712] cursor-pointer" />
                      <label htmlFor={`cat-${idx}`} className="ml-3 text-sm text-zinc-600 group-hover:text-[#bf2712] group-hover:font-medium cursor-pointer transition-colors">{cat}</label>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Precio Filter */}
              <div className="mb-8">
                <h3 className="text-xs font-black text-zinc-400 mb-4 uppercase tracking-widest">Rango de Precio</h3>
                <div className="space-y-4">
                  <input type="range" min="0" max="1000000" className="w-full accent-[#bf2712] h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer" />
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-500 bg-zinc-50 px-3 py-1.5 rounded-full border border-zinc-100">$0</span>
                    <span className="text-xs font-bold text-zinc-500 bg-zinc-50 px-3 py-1.5 rounded-full border border-zinc-100">$1M+</span>
                  </div>
                </div>
              </div>
              
              {/* Materiales Filter */}
              <div className="mb-8">
                <h3 className="text-xs font-black text-zinc-400 mb-4 uppercase tracking-widest">Material</h3>
                <div className="flex flex-wrap gap-2">
                  {['Acero Inox', 'Cerámica', 'Madera RH', 'Plástico'].map((mat, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-white border border-zinc-200 text-xs font-medium text-zinc-600 rounded-full hover:bg-[#254153] hover:text-white hover:border-[#254153] cursor-pointer transition-all shadow-sm">
                      {mat}
                    </span>
                  ))}
                </div>
              </div>

              <button className="w-full py-3.5 bg-zinc-100 text-zinc-700 hover:bg-[#254153] hover:text-white rounded-2xl font-bold text-sm transition-all duration-300 shadow-sm hover:shadow-md">
                Aplicar Filtros
              </button>
            </div>
          </aside>

          {/* Product Grid Area (Right Column) */}
          <div className="flex-1">
            
            {/* Toolbar (Mobile Filters & Sorting) */}
            <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-3 sm:px-5 sm:py-3 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] border border-zinc-100 mb-8">
              <div className="flex items-center mb-4 sm:mb-0">
                <span className="text-sm font-medium text-zinc-500">
                  Mostrando <span className="font-bold text-[#254153]">{mockProducts.length}</span> resultados
                </span>
              </div>
              
              <div className="flex space-x-3 w-full sm:w-auto">
                <button className="md:hidden flex-1 flex items-center justify-center space-x-2 px-5 py-2.5 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-xl text-sm font-semibold text-zinc-700 transition-colors">
                  <SlidersHorizontal className="h-4 w-4" />
                  <span>Filtros</span>
                </button>
                <div className="relative flex-1 sm:w-auto">
                  <select className="w-full appearance-none bg-zinc-50 border border-zinc-200 text-zinc-700 text-sm font-semibold rounded-xl px-5 py-2.5 pr-10 hover:bg-zinc-100 transition-colors outline-none focus:border-[#254153] cursor-pointer">
                    <option>Recomendados</option>
                    <option>Menor a Mayor Precio</option>
                    <option>Mayor a Menor Precio</option>
                    <option>Novedades</option>
                  </select>
                  <ChevronDown className="h-4 w-4 text-zinc-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>
            
            {/* Grid */}
            <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 xl:grid-cols-3">
              {mockProducts.map((product) => (
                <div key={product.id} className="group relative flex flex-col bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-zinc-100/60 transform hover:-translate-y-1">
                  
                  {/* Image Container */}
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-zinc-50">
                    {product.badge && (
                      <span className={`absolute top-4 left-4 z-10 rounded-full px-3 py-1 text-xs font-bold tracking-wide text-white shadow-md ${
                        product.badge === '-15%' ? 'bg-green-600' : 'bg-[#bf2712]'
                      }`}>
                        {product.badge}
                      </span>
                    )}
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none" />
                    
                    {/* Quick actions on hover */}
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-20">
                      <button className="flex items-center space-x-2 bg-white/95 backdrop-blur-md text-[#254153] px-6 py-2.5 rounded-full font-bold text-sm shadow-xl hover:bg-[#254153] hover:text-white transition-colors">
                        <Eye className="h-4 w-4" />
                        <span>Vista rápida</span>
                      </button>
                    </div>

                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  
                  {/* Product Info */}
                  <div className="flex flex-1 flex-col justify-between p-5">
                    <div>
                      <div className="mb-2 text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{title}</div>
                      <h3 className="text-sm font-bold text-[#1a202c] line-clamp-2 mb-2 leading-snug group-hover:text-[#bf2712] transition-colors">
                        <Link href={product.href} className="focus:outline-none">
                          <span aria-hidden="true" className="absolute inset-0 z-0" />
                          {product.name}
                        </Link>
                      </h3>
                    </div>
                    
                    <div className="mt-4 flex items-end justify-between relative z-20">
                      <div className="flex flex-col">
                        {product.badge === '-15%' && (
                           <span className="text-xs text-zinc-400 line-through mb-0.5 font-medium">
                             ${(product.price * 1.15).toLocaleString('es-CO')}
                           </span>
                        )}
                        <span className="text-lg font-extrabold text-[#254153]">
                          ${product.price.toLocaleString('es-CO')}
                        </span>
                      </div>
                      
                      <button 
                        className="relative z-30 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-zinc-50 border border-zinc-200 text-[#254153] hover:bg-[#bf2712] hover:border-[#bf2712] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer" 
                        aria-label="Añadir al carrito"
                      >
                        <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Pagination / Load More */}
            <div className="mt-14 flex justify-center">
              <button className="px-10 py-3.5 bg-white border-2 border-[#254153] text-[#254153] rounded-full font-bold hover:bg-[#254153] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
                Cargar más productos
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
