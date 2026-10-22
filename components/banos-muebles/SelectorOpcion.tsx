import Link from 'next/link';

export type OpcionExperiencia = 'a' | 'b';

const OPCIONES: { id: OpcionExperiencia; nombre: string; detalle: string }[] = [
  { id: 'a', nombre: 'Opción A', detalle: 'Configurador 3D' },
  { id: 'b', nombre: 'Opción B', detalle: 'Mix & Match' },
];

/**
 * Prototipos en revision: alterna entre formatos de la sesion
 * "lavamanos & muebles" sin perder ninguno (?opcion=a | ?opcion=b).
 */
export default function SelectorOpcion({ activa }: { activa: OpcionExperiencia }) {
  return (
    <div className="border-b border-[#e5e0d8] bg-[#f6f3ee]">
      <div className="mx-auto flex max-w-[1408px] flex-wrap items-center justify-between gap-3 px-4 py-2.5 sm:px-6 lg:px-8">
        <p className="text-xs font-medium text-[#58696b]">Prototipos en revisión</p>
        <nav aria-label="Formato de la experiencia" className="flex rounded-full bg-white p-1 shadow-sm">
          {OPCIONES.map((o) => {
            const activo = o.id === activa;
            return (
              <Link
                key={o.id}
                href={`?opcion=${o.id}`}
                scroll={false}
                aria-current={activo ? 'page' : undefined}
                className={`flex min-h-11 items-center gap-1.5 rounded-full px-4 text-xs font-semibold transition-colors duration-150 ${
                  activo ? 'bg-[#324354] text-white' : 'text-[#324354] hover:bg-[#f6f3ee]'
                }`}
              >
                {o.nombre}
                <span className={`hidden sm:inline ${activo ? 'text-white/80' : 'text-[#58696b]'}`}>· {o.detalle}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
