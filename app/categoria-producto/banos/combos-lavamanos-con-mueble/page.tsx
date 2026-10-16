import type { Metadata } from 'next';
import { VITELLI_63 } from '@/components/banos-muebles/catalogoMuebles';
import ConfiguradorVitelliA from '@/components/banos-muebles/opcion-a/ConfiguradorVitelliA';

// Destino de "lavamanos & muebles" en el menu de la landing. Sesion de
// muebles de bano: la Opcion A es el configurador 3D, empezando por el Vitelli 63.
export const metadata: Metadata = {
  title: 'Vitelli 63 · Arma tu mueble de baño en 3D | Firplak',
  description:
    'Elige el acabado del mueble Vitelli 63 y el lavamanos que más te guste, y míralo armado en 3D: por dentro, por fuera y con medidas.',
};

export default function CombosLavamanosConMueblePage() {
  return <ConfiguradorVitelliA mueble={VITELLI_63} />;
}
