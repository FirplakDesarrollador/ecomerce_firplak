import Link from 'next/link';
import { RUTA_ESTUDIO_D, RUTA_LAVAMANOS_MUEBLES } from './rutas';

export type OpcionExperiencia = 'a' | 'b' | 'c' | 'd' | 'e';

export const OPCIONES: { id: OpcionExperiencia; nombre: string; detalle: string; href: string }[] = [
  { id: 'a', nombre: 'Opción A', detalle: 'Configurador 3D', href: `${RUTA_LAVAMANOS_MUEBLES}?opcion=a` },
  { id: 'b', nombre: 'Opción B', detalle: 'Mix & Match', href: `${RUTA_LAVAMANOS_MUEBLES}?opcion=b` },
  { id: 'c', nombre: 'Opción C', detalle: 'Ricardo', href: `${RUTA_LAVAMANOS_MUEBLES}?opcion=c` },
  // Ruta propia: usa la UI del home de Alejandro (sin header ni footer del sitio).
  { id: 'd', nombre: 'Opción D', detalle: 'Alejandro', href: RUTA_ESTUDIO_D },
  { id: 'e', nombre: 'Opción E', detalle: 'Mix & Match iso', href: `${RUTA_LAVAMANOS_MUEBLES}?opcion=e` },
];

/**
 * Prototipos en revision: alterna entre formatos de la sesion
 * "lavamanos & muebles" sin perder ninguno (?opcion=a | b | c | e, y ./mix-match).
 */
export default function SelectorOpcion({ activa }: { activa: OpcionExperiencia }) {
  return (
    <div className="border-b border-[#e5e0d8] bg-[#f6f3ee]">
      <div className="mx-auto flex max-w-[1408px] flex-wrap items-center justify-between gap-3 px-4 py-2.5 sm:px-6 lg:px-8">
        <p className="text-xs font-medium text-[#58696b]">Prototipos en revisión</p>
        <nav aria-label="Formato de la experiencia" className="flex max-w-full overflow-x-auto rounded-full bg-white p-1 shadow-sm">
          {OPCIONES.map((o) => {
            const activo = o.id === activa;
            return (
              <Link
                key={o.id}
                href={o.href}
                scroll={false}
                aria-current={activo ? 'page' : undefined}
                aria-label={`${o.nombre} · ${o.detalle}`}
                className={`flex min-h-11 min-w-11 shrink-0 items-center justify-center gap-1.5 rounded-full px-3 text-xs font-semibold sm:px-4 transition-colors duration-150 ${
                  activo ? 'bg-[#324354] text-white' : 'text-[#324354] hover:bg-[#f6f3ee]'
                }`}
              >
                {/* Con cinco opciones, en móvil va solo la letra (como en la píldora de prototipos). */}
                <span className="sm:hidden">{o.id.toUpperCase()}</span>
                <span className="hidden sm:inline">{o.nombre}</span>
                <span className={`hidden sm:inline ${activo ? 'text-white/80' : 'text-[#58696b]'}`}>· {o.detalle}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
