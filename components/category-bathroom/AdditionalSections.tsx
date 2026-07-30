import { ShieldCheck, Truck, Sparkles, Wrench, BookOpen } from 'lucide-react';

export function TrustSection() {
  const features = [
    { icon: <ShieldCheck size={32} strokeWidth={1} />, title: 'Madera RH Especial', desc: 'Resistente a la humedad' },
    { icon: <Truck size={32} strokeWidth={1} />, title: 'Despacho Seguro', desc: 'Protección en el transporte' },
    { icon: <Wrench size={32} strokeWidth={1} />, title: 'Guía de Instalación', desc: 'Soporte y planos detallados' },
    { icon: <Sparkles size={32} strokeWidth={1} />, title: 'Acabados Premium', desc: 'Diseños de alta calidad' }
  ];

  return (
    <section className="py-16 bg-stone-900 text-white border-y border-stone-800">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
        {features.map((feat, i) => (
          <div key={i} className="flex flex-col items-center text-center space-y-4">
            <div className="text-stone-300">{feat.icon}</div>
            <div>
              <h4 className="font-serif text-lg tracking-wide font-medium">{feat.title}</h4>
              <p className="text-sm text-stone-400 font-sans mt-1 font-light">{feat.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function BuyingGuide() {
  const guides = [
    { title: '¿Cómo elegir el mueble de baño ideal para espacios pequeños?', cat: 'Guía de Espacios' },
    { title: 'Madera RH: La tecnología que protege tu mueble de la humedad', cat: 'Materiales' },
    { title: 'Muebles Suspendidos vs. De Piso: Ventajas y comparativa de diseño', cat: 'Tendencias' }
  ];

  return (
    <section className="py-24 max-w-7xl mx-auto px-4 md:px-8">
      <div className="flex items-center justify-between mb-12">
        <h2 className="text-3xl font-serif text-stone-900 font-medium">Inspiración y Consejos</h2>
        <button className="text-sm uppercase tracking-widest font-semibold text-stone-500 hover:text-stone-900 flex items-center gap-2 font-sans transition-colors">
          Ver todos los artículos
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {guides.map((guide, i) => (
          <div key={i} className="group cursor-pointer">
            <div className="aspect-[4/3] bg-stone-100 mb-6 flex items-center justify-center text-stone-300 overflow-hidden relative rounded-sm">
               <BookOpen size={48} strokeWidth={1} className="opacity-50" />
               <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/5 transition-colors duration-300"></div>
            </div>
            <span className="text-xs uppercase tracking-widest text-stone-500 mb-2 block font-semibold font-sans">{guide.cat}</span>
            <h3 className="text-xl font-serif text-stone-900 group-hover:text-[#254153] transition-colors font-medium leading-snug">{guide.title}</h3>
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
        <h2 className="text-2xl font-serif text-stone-900 font-medium">Muebles de Baño Firplak: Estilo, Resistencia y Calidad</h2>
        <p className="text-stone-500 font-sans text-sm leading-relaxed font-light">
          Nuestra línea de muebles para baño está fabricada bajo los más altos estándares de calidad, utilizando tableros de madera aglomerada RH (Resistente a la Humedad). 
          Esto garantiza que tu mueble conservará su forma, textura y funcionalidad a lo largo del tiempo, resistiendo el vapor y el contacto indirecto con el agua en el cuarto de baño. 
          Ofrecemos soluciones innovadoras como herrajes de cierre suave, amplios cajones organizadores y diseños modulares suspendidos o al piso que se complementan a la perfección con nuestra línea de lavamanos.
        </p>
      </div>
    </section>
  );
}
