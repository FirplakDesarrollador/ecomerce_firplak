import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { VITELLI_63 } from '@/components/banos-muebles/catalogoMuebles';
import ConfiguradorVitelliA from '@/components/banos-muebles/opcion-a/ConfiguradorVitelliA';
import MixMatchB from '@/components/banos-muebles/opcion-b/MixMatchB';
import EstudioC from '@/components/banos-muebles/opcion-c/EstudioC';
import SelectorOpcion, { type OpcionExperiencia } from '@/components/banos-muebles/SelectorOpcion';
import { RUTA_ESTUDIO_D } from '@/components/banos-muebles/rutas';

// Destino de "lavamanos & muebles" en el menu de la landing. Sesion de
// muebles de bano con cuatro formatos en revision:
//   ?opcion=a (por defecto) configurador 3D del Vitelli 63
//   ?opcion=b               Mix & Match sobre renders fotorrealistas
//   ?opcion=c               Estudio Mix & Match (propuesta Ricardo; el landing
//                           "Ricardo" abre esta opcion)
//   ?opcion=d               redirige a ./mix-match: Mix & Match de piezas sueltas
//                           con la UI del home de Alejandro (ruta propia: sin
//                           header ni footer del sitio)
export const metadata: Metadata = {
  title: 'Lavamanos y muebles · Arma tu mueble de baño | Firplak',
  description:
    'Combina el mueble, el lavamanos y el acabado que más te gusten y míralo armado al instante.',
};

function opcionDe(valor: string | undefined): Exclude<OpcionExperiencia, 'd'> | 'd' {
  const v = valor?.toLowerCase();
  return v === 'b' || v === 'c' || v === 'd' ? v : 'a';
}

export default async function CombosLavamanosConMueblePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const activa = opcionDe(typeof params.opcion === 'string' ? params.opcion : undefined);
  if (activa === 'd') {
    // Enlaces viejos (?opcion=d&lavamanos=…): conservan la combinacion.
    const resto = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) if (k !== 'opcion' && typeof v === 'string') resto.set(k, v);
    const q = resto.toString();
    redirect(q ? `${RUTA_ESTUDIO_D}?${q}` : RUTA_ESTUDIO_D);
  }
  return (
    <>
      <SelectorOpcion activa={activa} />
      {activa === 'c' ? <EstudioC /> : activa === 'b' ? <MixMatchB /> : <ConfiguradorVitelliA mueble={VITELLI_63} />}
    </>
  );
}
