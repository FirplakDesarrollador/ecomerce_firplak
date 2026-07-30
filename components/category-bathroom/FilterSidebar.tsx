import { ChevronDown } from 'lucide-react';

export default function FilterSidebar() {
  const filterSections = [
    {
      title: 'Tipo de Mueble',
      options: ['Suspendido', 'De piso', 'Auxiliar', 'Espejos']
    },
    {
      title: 'Material',
      options: ['Madera RH (Resistente Humedad)', 'Material compuesto', 'Vidrio templado']
    },
    {
      title: 'Color',
      options: ['Madera Clara', 'Grafito', 'Blanco Brillante', 'Rústico']
    },
    {
      title: 'Garantía',
      options: ['2 años', '3 años', '5 años', '8 años']
    }
  ];

  return (
    <aside className="w-full lg:w-64 flex-shrink-0 lg:sticky lg:top-24 h-fit">
      <div className="flex justify-between items-center mb-6 lg:mb-8 border-b border-stone-200 pb-4">
        <h3 className="text-lg font-serif text-stone-900 font-medium">Filtros</h3>
        <button className="text-sm text-stone-500 hover:text-stone-900 underline">Limpiar</button>
      </div>

      <div className="space-y-6">
        {/* Price Slider placeholder */}
        <div className="border-b border-stone-100 pb-6">
          <button className="flex justify-between items-center w-full text-left mb-4">
            <span className="font-semibold text-stone-900 font-sans text-xs uppercase tracking-wider">Rango de Precio</span>
            <ChevronDown size={16} className="text-stone-400" />
          </button>
          <div className="px-2">
            <div className="w-full h-1 bg-stone-200 rounded-full mb-4 relative">
              <div className="absolute left-1/4 right-1/4 h-full bg-[#254153] rounded-full"></div>
            </div>
            <div className="flex justify-between text-xs text-stone-500 font-medium">
              <span>$400k</span>
              <span>$2M+</span>
            </div>
          </div>
        </div>

        {/* Dynamic Filters */}
        {filterSections.map((section, idx) => (
          <div key={idx} className="border-b border-stone-100 pb-6">
            <button className="flex justify-between items-center w-full text-left mb-4">
              <span className="font-semibold text-stone-900 font-sans text-xs uppercase tracking-wider">{section.title}</span>
              <ChevronDown size={16} className="text-stone-400" />
            </button>
            <div className="space-y-3">
              {section.options.map((option, oIdx) => (
                <label key={oIdx} className="flex items-center space-x-3 cursor-pointer group">
                  <div className="w-4 h-4 border border-stone-300 flex items-center justify-center group-hover:border-stone-500 transition-colors">
                    {/* Checkmark placeholder */}
                  </div>
                  <span className="text-sm text-stone-600 group-hover:text-stone-900 font-sans">{option}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
