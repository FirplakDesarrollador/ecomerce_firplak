import type { Metadata } from 'next';
import EstudioD from '@/components/banos-muebles/opcion-d/EstudioD';

// Opcion D · Mix & Match de la visualizacion Alejandro, con la UI de su home
// (navbar Loomere, fondo de escena y paneles de vidrio). ?opcion=d de la pagina
// madre redirige aqui.
export const metadata: Metadata = {
  title: 'Mix & Match · Lavamanos y muebles | Firplak',
  description: 'Combina el lavamanos, el mueble y el acabado que más te gusten y míralo armado al instante.',
};

export default function EstudioMixMatchPage() {
  return <EstudioD />;
}
