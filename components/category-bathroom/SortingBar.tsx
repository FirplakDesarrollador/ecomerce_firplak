import { ChevronDown, SlidersHorizontal, X } from 'lucide-react';

interface SortingBarProps {
  totalResults: number;
}

export default function SortingBar({ totalResults }: SortingBarProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      {/* Active Filters / Results */}
      <div className="flex items-center gap-4 flex-wrap">
        <p className="text-sm text-stone-500 font-sans font-medium">{totalResults} Resultados</p>
        
        <div className="hidden md:flex items-center gap-2">
          <div className="h-4 w-[1px] bg-stone-300 mx-2"></div>
          {/* Example Active Filters */}
          <span className="inline-flex items-center gap-1.5 bg-stone-100 text-stone-700 px-3 py-1 text-xs rounded-full font-medium font-sans">
            Madera RH
            <button className="hover:text-stone-900 transition-colors"><X size={12} /></button>
          </span>
          <span className="inline-flex items-center gap-1.5 bg-stone-100 text-stone-700 px-3 py-1 text-xs rounded-full font-medium font-sans">
            Suspendido
            <button className="hover:text-stone-900 transition-colors"><X size={12} /></button>
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <button className="lg:hidden flex items-center justify-center gap-2 flex-1 border border-stone-200 px-4 py-2 text-sm text-stone-700 font-medium hover:bg-stone-50 transition-colors">
          <SlidersHorizontal size={16} />
          Filtros
        </button>

        <div className="relative flex-1 sm:flex-none">
          <button className="flex items-center justify-between w-full sm:w-48 border border-stone-200 px-4 py-2.5 text-sm text-stone-700 bg-white hover:bg-stone-50 transition-colors font-medium">
            <span>Más populares</span>
            <ChevronDown size={16} className="text-stone-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
