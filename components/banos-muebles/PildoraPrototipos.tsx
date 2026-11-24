import Link from 'next/link';
import { Layers } from 'lucide-react';
import SelectorFlotante from '@/components/ui/SelectorFlotante';
import { OPCIONES, type OpcionExperiencia } from './SelectorOpcion';

/**
 * Selector de prototipos con la estetica del home de Alejandro: el mismo icono
 * redondo flotante del conmutador de landings, que se expande al pasar el mouse
 * (o al tocarlo en movil).
 */
export default function PildoraPrototipos({ activa, className = '' }: { activa: OpcionExperiencia; className?: string }) {
  const actual = OPCIONES.find((o) => o.id === activa);
  return (
    <SelectorFlotante
      etiqueta="Prototipos de lavamanos y muebles"
      className={className}
      icono={
        <span className="relative flex items-center justify-center">
          <Layers className="h-5 w-5" aria-hidden />
          {actual && (
            <span className="absolute -bottom-2.5 -right-2.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#324354] px-1 text-[10px] font-bold text-white ring-2 ring-black/90">
              {actual.id.toUpperCase()}
            </span>
          )}
        </span>
      }
    >
      <span className="hidden shrink-0 px-2 text-[11px] font-medium text-white/60 md:inline">Prototipos</span>
      {OPCIONES.map((o) => {
        const activo = o.id === activa;
        return (
          <Link
            key={o.id}
            href={o.href}
            aria-current={activo ? 'page' : undefined}
            title={`${o.nombre} · ${o.detalle}`}
            className={`flex min-h-[44px] shrink-0 items-center gap-1 rounded-full px-3 font-medium transition-all duration-300 sm:px-3.5 ${
              activo ? 'bg-white font-semibold text-black shadow-md' : 'text-white/80 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span className="sm:hidden">{o.nombre.replace('Opción ', '')}</span>
            <span className="hidden sm:inline">{o.nombre}</span>
            <span className={`hidden lg:inline ${activo ? 'text-black/60' : 'text-white/50'}`}>· {o.detalle}</span>
          </Link>
        );
      })}
    </SelectorFlotante>
  );
}
