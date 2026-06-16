import { ShieldCheck, Truck, CreditCard, HeadphonesIcon, BookOpen } from 'lucide-react';

export function TrustSection() {
  const features = [
    { icon: <ShieldCheck size={32} strokeWidth={1} />, title: 'Garantía Extendida', desc: 'Hasta 10 años de cobertura' },
    { icon: <Truck size={32} strokeWidth={1} />, title: 'Envíos Nacionales', desc: 'A toda Colombia' },
    { icon: <CreditCard size={32} strokeWidth={1} />, title: 'Pago Seguro', desc: 'Múltiples medios de pago' },
    { icon: <HeadphonesIcon size={32} strokeWidth={1} />, title: 'Soporte Especializado', desc: 'Acompañamiento en tu compra' }
  ];

  return (
    <section className="py-16 bg-stone-900 text-white border-y border-stone-800">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
        {features.map((feat, i) => (
          <div key={i} className="flex flex-col items-center text-center space-y-4">
            <div className="text-stone-300">{feat.icon}</div>
            <div>
              <h4 className="font-serif text-lg tracking-wide">{feat.title}</h4>
              <p className="text-sm text-stone-400 font-sans mt-1">{feat.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function BuyingGuide() {
  const guides = [
    { title: '¿Cómo elegir tu primer hidromasaje?', cat: 'Guía de Compra' },
    { title: 'Diferencias entre spa exterior e interior', cat: 'Comparativa' },
    { title: 'Mantenimiento preventivo básico', cat: 'Cuidado' }
  ];

  return (
    <section className="py-24 max-w-7xl mx-auto px-4 md:px-8">
      <div className="flex items-center justify-between mb-12">
        <h2 className="text-3xl font-serif text-stone-900">Centro de Bienestar</h2>
        <button className="text-sm uppercase tracking-widest font-medium text-stone-500 hover:text-stone-900 flex items-center gap-2">
          Ver todos los artículos
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {guides.map((guide, i) => (
          <div key={i} className="group cursor-pointer">
            <div className="aspect-[4/3] bg-stone-100 mb-6 flex items-center justify-center text-stone-300 overflow-hidden relative">
               {/* This would be an image in production */}
               <BookOpen size={48} strokeWidth={1} className="opacity-50" />
               <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/5 transition-colors duration-300"></div>
            </div>
            <span className="text-xs uppercase tracking-widest text-stone-500 mb-2 block">{guide.cat}</span>
            <h3 className="text-xl font-serif text-stone-900 group-hover:text-stone-600 transition-colors">{guide.title}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}

export function SEOBlock() {
  return (
    <section className="bg-stone-50 py-16">
      <div className="max-w-4xl mx-auto px-4 md:px-8 text-center space-y-6">
        <h2 className="text-2xl font-serif text-stone-900">Transforma tu hogar en un oasis de relajación</h2>
        <p className="text-stone-500 font-sans text-sm leading-relaxed">
          Nuestra colección de hidromasajes de lujo está diseñada para ofrecer una experiencia de bienestar incomparable. 
          Ya sea que busques un spa exterior para tu terraza o una elegante tina interior para tu baño, 
          en Firplak combinamos tecnología de vanguardia, diseño sofisticado y materiales premium. 
          Disfruta de los beneficios de la hidroterapia, desde el alivio del estrés hasta la mejora de la circulación, 
          con modelos que se adaptan a espacios de 2 hasta 8 personas.
        </p>
      </div>
    </section>
  );
}
