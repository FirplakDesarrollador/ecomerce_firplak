import type { Metadata } from 'next';
import { VITELLI_63 } from '@/components/banos-muebles/catalogoMuebles';
import ConfiguradorVitelliA from '@/components/banos-muebles/opcion-a/ConfiguradorVitelliA';
import MixMatchB from '@/components/banos-muebles/opcion-b/MixMatchB';
import EstudioC from '@/components/banos-muebles/opcion-c/EstudioC';
import EstudioE from '@/components/banos-muebles/opcion-e/EstudioE';
import SelectorOpcion, { type OpcionExperiencia } from '@/components/banos-muebles/SelectorOpcion';

// Destino de "lavamanos & muebles" en el menu de la landing. Sesion de
// muebles de bano con tres formatos en revision:
//   ?opcion=a (por defecto) configurador 3D del Vitelli 63
//   ?opcion=b               Mix & Match sobre renders fotorrealistas
//   ?opcion=c               Estudio Mix & Match (propuesta Ricardo; el landing
//                           "Ricardo" abre esta opcion)
//   ?opcion=e               Mix & Match isometrico: muebles, lavamanos y griferia
//                           con sus acabados, cierre suave, aireador y precio por pieza
export const metadata: Metadata = {
  title: 'Lavamanos y muebles · Arma tu mueble de baño | Firplak',
  description:
    'Combina el mueble, el lavamanos y el acabado que más te gusten y míralo armado al instante.',
};

function opcionDe(valor: string | undefined): OpcionExperiencia {
  const v = valor?.toLowerCase();
  return v === 'b' || v === 'c' || v === 'e' ? v : 'a';
}

export default async function CombosLavamanosConMueblePage({
  searchParams,
}: {
  searchParams: Promise<{ opcion?: string }>;
}) {
  const { opcion } = await searchParams;
  const activa = opcionDe(opcion);
  return (
    <>
      <SelectorOpcion activa={activa} />
      {activa === 'e' ? <EstudioE /> : activa === 'c' ? <EstudioC /> : activa === 'b' ? <MixMatchB /> : <ConfiguradorVitelliA mueble={VITELLI_63} />}
    </>
  );
}
