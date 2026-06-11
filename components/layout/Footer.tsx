import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-[#254153] text-white">
      {/* Newsletter Section */}
      <div className="bg-[#1d3342] py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold tracking-wide">¿Te gustan las Novedades?</h3>
              <p className="mt-2 text-gray-300">Suscríbete a nuestro boletín y entérate primero de promociones, nuevos productos y tendencias de diseño.</p>
            </div>
            <div className="flex w-full max-w-md ml-auto">
              <input 
                type="email" 
                placeholder="Ingresa tu correo electrónico" 
                className="w-full rounded-l-md px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="bg-[#bf2712] px-6 py-3 font-semibold text-white rounded-r-md hover:bg-[#a0200e] transition-colors whitespace-nowrap">
                Suscribirme
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Directory */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8">
          
          {/* Column 1: Logo & Info */}
          <div className="col-span-1 lg:col-span-1">
            <Image 
              src="/logo.webp" 
              alt="Firplak Logo" 
              width={140} 
              height={45} 
              className="object-contain"
            />
            <p className="mt-6 text-sm text-gray-300 leading-relaxed">
              Comercializamos soluciones innovadoras que promueven salud y bienestar, mejoran la calidad de vida de nuestros clientes con diseños de vanguardia.
            </p>
          </div>

          {/* Column 2: Conmutador */}
          <div>
            <h4 className="text-lg font-bold">Conmutador</h4>
            <ul className="mt-6 space-y-4 text-sm text-gray-300">
              <li>+57 (604) 444 1771</li>
              <li>info@firplak.com</li>
              <li>Lunes a Viernes: 7:00 am - 5:00 pm</li>
            </ul>
          </div>

          {/* Column 3: Tienda Medellín */}
          <div>
            <h4 className="text-lg font-bold">Tienda Medellín</h4>
            <ul className="mt-6 space-y-4 text-sm text-gray-300">
              <li>C.C. Ideo - Local 141</li>
              <li>Carrera 42 #75-83, Itagüí</li>
              <li>+57 317 401 7914</li>
            </ul>
          </div>

          {/* Column 4: Tienda Bogotá */}
          <div>
            <h4 className="text-lg font-bold">Tienda Bogotá</h4>
            <ul className="mt-6 space-y-4 text-sm text-gray-300">
              <li>Avenida Carrera 19 #104-59</li>
              <li>Barrio San Patricio</li>
              <li>+57 318 362 5757</li>
            </ul>
          </div>

          {/* Column 5: Tienda Cali & Fábrica */}
          <div>
            <h4 className="text-lg font-bold">Tienda Cali</h4>
            <ul className="mt-6 space-y-2 text-sm text-gray-300">
              <li>C.C. Ideo - Local 120</li>
              <li>Calle 62 #1N-80</li>
              <li>+57 317 646 9516</li>
            </ul>
            <h4 className="text-lg font-bold mt-6">Fábrica (Guarne)</h4>
            <ul className="mt-2 space-y-2 text-sm text-gray-300">
              <li>Autopista Medellín - Bogotá Km 23</li>
              <li>Retorno 7, Guarne, Antioquia</li>
            </ul>
          </div>

        </div>

        {/* Bottom Legal Section */}
        <div className="mt-16 border-t border-[#1d3342] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Firplak S.A. Todos los derechos reservados.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-xs text-gray-400">
            <Link href="/politica-privacidad" className="hover:text-white transition-colors">Política de Privacidad</Link>
            <Link href="/terminos-condiciones" className="hover:text-white transition-colors">Términos y Condiciones</Link>
            <Link href="/politica-garantias" className="hover:text-white transition-colors">Política de Garantías</Link>
            <Link href="/politica-devoluciones" className="hover:text-white transition-colors">Política de Devoluciones</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
