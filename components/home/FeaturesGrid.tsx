import { Truck, ShieldCheck, HeadphonesIcon, Wrench } from 'lucide-react';

export default function FeaturesGrid() {
  const features = [
    {
      name: 'Envíos a todo Colombia',
      description: 'Cobertura nacional para todos tus pedidos de gran formato.',
      icon: Truck,
    },
    {
      name: 'Respaldo y Garantía',
      description: 'Productos certificados con altos estándares de calidad.',
      icon: ShieldCheck,
    },
    {
      name: 'Asesoría Personalizada',
      description: 'Acompañamiento en tu proyecto de remodelación.',
      icon: HeadphonesIcon,
    },
    {
      name: 'Servicio de Instalación',
      description: 'Contamos con técnicos expertos a nivel nacional.',
      icon: Wrench,
    },
  ];

  return (
    <section className="bg-white border-y border-zinc-200">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 lg:grid-cols-4 gap-x-8">
          {features.map((feature) => (
            <div key={feature.name} className="flex flex-col items-center text-center group">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-50 border border-zinc-100 shadow-sm mb-6 group-hover:scale-110 group-hover:bg-[#254153] transition-all duration-300">
                <feature.icon className="h-8 w-8 text-[#254153] group-hover:text-white transition-colors" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.name}</h3>
              <p className="text-sm text-gray-500 leading-relaxed max-w-xs">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
