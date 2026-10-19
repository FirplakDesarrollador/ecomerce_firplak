import type { Metadata } from 'next';
import { VITELLI_63 } from '@/components/banos-muebles/catalogoMuebles';
import ConfiguradorVitelliA from '@/components/banos-muebles/opcion-a/ConfiguradorVitelliA';
import MixMatchB from '@/components/banos-muebles/opcion-b/MixMatchB';
import SelectorOpcion from '@/components/banos-muebles/SelectorOpcion';

// Destino de "lavamanos & muebles" en el menu de la landing. Sesion de
// muebles de bano con dos formatos en revision:
//   ?opcion=a (por defecto) configurador 3D del Vitelli 63
//   ?opcion=b               Mix & Match sobre renders fotorrealistas
export const metadata: Metadata = {
  title: 'Lavamanos y muebles · Arma tu mueble de baño | Firplak',
  description:
    'Combina el mueble, el lavamanos y el acabado que más te gusten y míralo armado al instante.',
};

export default async function CombosLavamanosConMueblePage({
  searchParams,
}: {
  searchParams: Promise<{ opcion?: string }>;
}) {
  const { opcion } = await searchParams;
  const activa = opcion?.toLowerCase() === 'b' ? 'b' : 'a';
  return (
    <>
      <SelectorOpcion activa={activa} />
      {activa === 'b' ? <MixMatchB /> : <ConfiguradorVitelliA mueble={VITELLI_63} />}
    </>
  );
}
