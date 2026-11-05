'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import LoomereNavbar from '@/components/loomere/LoomereNavbar';
import LoomereMegamenu from '@/components/loomere/LoomereMegamenu';
import {
  CAPAS,
  PUNTO_MUNDO,
  TINA_EN_CASA,
  aPantalla,
  camara,
  encuadre,
  escena,
  progresoBucle,
  recorrido,
  suave,
  type Capa,
} from './camaraInception';
import { PUNTO_AZUL } from './geometriaBano';

// El documento contiene el bucle repetido: al acercarse a un borde se salta una vuelta
// entera y, como el cuadro es idéntico, el scroll nunca termina.
const VUELTAS = 3;
const VH_POR_VUELTA = 900;

type IdCapa = 'casa' | 'bano' | 'azul';
const IMAGENES: { id: IdCapa; src: string; alt: string }[] = [
  { id: 'casa', src: '/images/inception/bano-casa.webp', alt: 'La casa completa vista desde arriba, con el baño, el patio interior, el cuarto, la cocina y la zona de lavado' },
  { id: 'bano', src: '/images/inception/bano-bano.webp', alt: 'Baño con bañera exenta de hidromasaje; una mujer con bata de seda toca los mandos' },
  { id: 'azul', src: '/images/inception/bano-azul.webp', alt: 'Mandos de cubo cromado sobre el borde de la tina: rojo, azul y uno liso' },
];

// Espacios de la casa (coordenadas sobre la vista desde arriba). El baño es el capítulo activo.
const ESPACIOS = [
  { nombre: 'Baño', x: TINA_EN_CASA.x + 0.02, y: TINA_EN_CASA.y + 0.12, activo: true },
  { nombre: 'Patio interior', x: 0.714, y: 0.418, activo: false },
  { nombre: 'Cuarto', x: 0.3, y: 0.74, activo: false },
  { nombre: 'Cocina', x: 0.52, y: 0.64, activo: false },
  { nombre: 'Zona de lavado', x: 0.763, y: 0.725, activo: false },
];

// Paradas del indicador lateral (s del recorrido de salida).
const PARADAS = [
  { id: 'azul', nombre: 'Azul', s: 0 },
  { id: 'llave', nombre: 'Llave', s: 0.14 },
  { id: 'bano', nombre: 'Baño', s: 0.485 },
  { id: 'casa', nombre: 'Casa', s: 1 },
] as const;

const BORDE_SUAVE =
  'linear-gradient(to right, transparent, #000 9%, #000 91%, transparent), linear-gradient(to bottom, transparent, #000 9%, #000 91%, transparent)';

const paradaActiva = (s: number) => (s < 0.06 ? 0 : s < 0.31 ? 1 : s < 0.7 ? 2 : 3);

export default function InceptionBanoExperience() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const contenedorRef = useRef<HTMLDivElement | null>(null);
  const escenarioRef = useRef<HTMLDivElement | null>(null);
  const mundoRef = useRef<HTMLDivElement | null>(null);
  const capaRefs = useRef<Record<IdCapa, HTMLDivElement | null>>({ casa: null, bano: null, azul: null });
  const floracionRef = useRef<HTMLDivElement | null>(null);
  const textoRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const pinRefs = useRef<(HTMLDivElement | null)[]>([]);
  const paradaRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const largoRef = useRef(0);

  useEffect(() => {
    const reducir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let ladoAnterior = 0;

    const medir = () => {
      const c = contenedorRef.current, e = escenarioRef.current;
      if (!c || !e) return;
      largoRef.current = (c.offsetHeight - e.offsetHeight) / VUELTAS;
    };

    const pintar = () => {
      raf = 0;
      const e = escenarioRef.current;
      if (!e) return;
      const vw = e.clientWidth, vh = e.clientHeight, lado = Math.max(vw, vh);
      const off = { x: (vw - lado) / 2, y: (vh - lado) / 2 };
      if (lado !== ladoAnterior) {
        e.style.setProperty('--lado', `${lado}px`);
        ladoAnterior = lado;
      }
      const s = recorrido(progresoBucle(window.scrollY, largoRef.current));
      const cam = camara(s, vw / vh);
      const est = escena(s, cam, reducir);

      const ponerCapa = (id: IdCapa, capa: Capa, opacidad: number, angulo: number) => {
        const el = capaRefs.current[id];
        if (!el) return;
        const { tx, ty, k } = encuadre(capa, cam, lado, off);
        // El pliegue gira alrededor de la tina, que es el punto que comparten baño y casa.
        // La perspectiva va dentro de la capa (en su tamaño propio) para que la inclinación
        // se lea igual con cualquier zoom.
        const ax = ((TINA_EN_CASA.x - capa.x) / capa.lado) * lado;
        const ay = ((TINA_EN_CASA.y - capa.y) / capa.lado) * lado;
        el.style.transform = angulo
          ? `translate3d(${tx}px,${ty}px,0) scale3d(${k},${k},1) translate3d(${ax}px,${ay}px,0) perspective(${lado * 1.1}px) rotateX(${angulo}deg) translate3d(${-ax}px,${-ay}px,0)`
          : `translate3d(${tx}px,${ty}px,0) scale3d(${k},${k},1)`;
        el.style.opacity = String(opacidad);
        el.style.visibility = opacidad < 0.005 ? 'hidden' : 'visible';
        // Mientras se pliega, los bordes de la imagen se funden para que no se vea el corte.
        const borde = angulo ? BORDE_SUAVE : '';
        if (el.style.maskImage !== borde) {
          el.style.maskImage = borde;
          el.style.maskComposite = borde ? 'intersect' : '';
        }
      };
      ponerCapa('casa', CAPAS.casa, est.opacidadCasa, est.anguloCasa);
      ponerCapa('bano', CAPAS.bano, est.opacidadBano, est.anguloBano);
      ponerCapa('azul', CAPAS.azul, est.opacidadAzul, 0);

      const mundo = mundoRef.current;
      if (mundo) mundo.style.transform = est.giro ? `rotate(${est.giro}deg)` : '';

      // Entrar al azul: el punto real del mando crece hasta llenar la pantalla.
      const flor = floracionRef.current;
      if (flor) {
        const centro = aPantalla(PUNTO_MUNDO, cam, lado, off);
        const radioPunto = (PUNTO_MUNDO.radio / cam.vista) * lado;
        const cubrir = Math.hypot(Math.max(centro.x, vw - centro.x), Math.max(centro.y, vh - centro.y)) * 1.05;
        const f = est.floracion;
        const radio = radioPunto + (cubrir - radioPunto) * f * f * (3 - 2 * f);
        const opacidad = suave(0, 0.15, f);
        // El degradado del círculo es sólido hasta el 80 % del radio: se escala por ese radio.
        flor.style.transform = `translate3d(${centro.x}px,${centro.y}px,0) translate(-50%,-50%) scale(${radio / 40})`;
        flor.style.opacity = String(opacidad);
        flor.style.visibility = opacidad < 0.005 ? 'hidden' : 'visible';
      }

      for (const [id, v] of Object.entries(est.textos)) {
        const el = textoRefs.current[id];
        if (!el) continue;
        el.style.opacity = String(v);
        el.style.transform = `translate3d(0,${(1 - v) * 18}px,0)`;
        el.style.visibility = v < 0.005 ? 'hidden' : 'visible';
        el.style.pointerEvents = v > 0.6 ? 'auto' : 'none';
      }

      const opacidadPines = suave(0.88, 0.96, s) * est.opacidadCasa;
      ESPACIOS.forEach((esp, i) => {
        const el = pinRefs.current[i];
        if (!el) return;
        const p = aPantalla(esp, cam, lado, off);
        el.style.transform = `translate3d(${p.x}px,${p.y}px,0) translate(-50%,-50%)`;
        el.style.opacity = String(opacidadPines);
        el.style.visibility = opacidadPines < 0.005 ? 'hidden' : 'visible';
      });

      const activa = paradaActiva(s);
      paradaRefs.current.forEach((el, i) => {
        if (!el) return;
        el.dataset.activo = String(i === activa);
        if (i === activa) el.setAttribute('aria-current', 'step');
        else el.removeAttribute('aria-current');
      });
    };

    const programar = () => {
      if (!raf) raf = requestAnimationFrame(pintar);
    };

    const alScroll = () => {
      const largo = largoRef.current, y = window.scrollY;
      if (largo > 0) {
        if (y < largo * 0.5) window.scrollTo({ top: y + largo, behavior: 'instant' });
        else if (y > largo * 2.5) window.scrollTo({ top: y - largo, behavior: 'instant' });
      }
      programar();
    };

    const restauracion = history.scrollRestoration;
    history.scrollRestoration = 'manual';
    const inicio = requestAnimationFrame(() => {
      medir();
      window.scrollTo({ top: largoRef.current, behavior: 'instant' });
      pintar();
    });
    window.addEventListener('scroll', alScroll, { passive: true });
    const observador = new ResizeObserver(() => {
      medir();
      programar();
    });
    if (escenarioRef.current) observador.observe(escenarioRef.current);

    return () => {
      cancelAnimationFrame(inicio);
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', alScroll);
      observador.disconnect();
      history.scrollRestoration = restauracion;
      window.scrollTo({ top: 0, behavior: 'instant' });
    };
  }, []);

  const irA = (sDestino: number) => {
    const largo = largoRef.current;
    if (largo <= 0) return;
    const p = progresoBucle(window.scrollY, largo);
    const base = window.scrollY - p * largo;
    // Se queda en la mitad del bucle en la que va: de salida hacia la casa o de vuelta al azul.
    const pDestino = p <= 0.5 ? sDestino / 2 : 1 - sDestino / 2;
    window.scrollTo({ top: base + pDestino * largo, behavior: 'smooth' });
  };

  return (
    <div className="relative bg-[#0b0d11] text-white selection:bg-sky-400/30">
      <LoomereNavbar
        currentSceneIndex={0}
        onOpenMegamenu={() => setMenuAbierto(true)}
        urlLavamanosMuebles="/categoria-producto/banos/combos-lavamanos-con-mueble/?opcion=c"
      />
      <LoomereMegamenu isOpen={menuAbierto} onClose={() => setMenuAbierto(false)} />

      <div
        ref={contenedorRef}
        className="relative w-full"
        style={{ height: `calc(${VUELTAS * VH_POR_VUELTA}svh + 100svh)` }}
      >
        <section
          ref={escenarioRef}
          aria-label="Recorrido en bucle: del mando de agua fría a la casa completa"
          className="sticky top-0 h-[100svh] w-full overflow-hidden bg-[#0b0d11]"
        >
          <div ref={mundoRef} className="absolute inset-0 origin-center">
            {IMAGENES.map((img) => (
              <div
                key={img.id}
                ref={(el) => {
                  capaRefs.current[img.id] = el;
                }}
                className="absolute left-0 top-0 will-change-transform"
                style={{ width: 'var(--lado, 100vmax)', height: 'var(--lado, 100vmax)', transformOrigin: '0 0', visibility: 'hidden' }}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="100vmax"
                  priority={img.id !== 'casa'}
                  draggable={false}
                  className="select-none object-cover"
                />
              </div>
            ))}

            <div
              ref={floracionRef}
              aria-hidden="true"
              className="absolute left-0 top-0 h-[100px] w-[100px] rounded-full will-change-transform"
              style={{
                background: `radial-gradient(circle closest-side, color-mix(in srgb, ${PUNTO_AZUL.color} 60%, #6f8dff) 0%, color-mix(in srgb, ${PUNTO_AZUL.color} 82%, #3550d8) 40%, ${PUNTO_AZUL.color} 80%, color-mix(in srgb, ${PUNTO_AZUL.color} 40%, transparent) 92%, transparent 100%)`,
              }}
            />

            {ESPACIOS.map((esp, i) => (
              <div
                key={esp.nombre}
                ref={(el) => {
                  pinRefs.current[i] = el;
                }}
                className="absolute left-0 top-0"
                style={{ visibility: 'hidden' }}
              >
                <div
                  className={`flex items-center gap-2 whitespace-nowrap rounded-full border px-3 py-1.5 text-[11px] font-medium tracking-wide backdrop-blur-md sm:text-xs ${
                    esp.activo
                      ? 'border-sky-300/60 bg-sky-500/25 text-white shadow-[0_0_24px_rgba(56,132,255,0.45)]'
                      : 'border-white/15 bg-black/45 text-white/75'
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${esp.activo ? 'bg-sky-300 animate-pulse' : 'bg-white/40'}`} />
                  {esp.nombre}
                  <span className="hidden text-white/50 sm:inline">{esp.activo ? '· estás aquí' : '· pronto'}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[48%] bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

          <div className="pointer-events-none absolute inset-x-0 bottom-0 px-5 pb-24 sm:px-10 sm:pb-16 lg:px-16">
            <div className="relative mx-auto max-w-6xl">
              <div ref={(el) => { textoRefs.current.azul = el; }} className="absolute bottom-0 left-0 max-w-xl" style={{ visibility: 'hidden' }}>
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-sky-200/90">Firplak · Hidromasaje</p>
                <h1 className="text-4xl font-light leading-[1.05] tracking-tight sm:text-6xl">Todo empieza en el azul.</h1>
                <p className="mt-5 flex items-center gap-2 text-sm text-white/70">
                  <ArrowDown className="h-4 w-4 animate-bounce" aria-hidden="true" />
                  Desliza para salir del sueño
                </p>
              </div>

              <div ref={(el) => { textoRefs.current.llave = el; }} className="absolute bottom-0 left-0 max-w-xl" style={{ visibility: 'hidden' }}>
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-sky-200/90">Agua fría</p>
                <h2 className="text-3xl font-light leading-tight tracking-tight sm:text-5xl">Un giro. Y el agua responde.</h2>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-white/75 sm:text-base">Mandos de cubo cromado sobre el borde de la tina: el rojo para el agua caliente, el azul para la fría.</p>
              </div>

              <div ref={(el) => { textoRefs.current.bano = el; }} className="absolute bottom-0 left-0 max-w-xl" style={{ visibility: 'hidden' }}>
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-sky-200/90">El baño</p>
                <h2 className="text-3xl font-light leading-tight tracking-tight sm:text-5xl">Tu santuario, a un gesto de distancia.</h2>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-white/75 sm:text-base">Bañera exenta con hidromasaje, pensada para el centro de tu baño.</p>
                <a
                  href="/categoria-producto/jacuzzis-e-hidromasajes/freestanding/"
                  className="mt-6 inline-flex min-h-[44px] items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-black transition hover:bg-sky-100"
                >
                  Ver hidromasajes freestanding
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>

              <div ref={(el) => { textoRefs.current.casa = el; }} className="absolute bottom-0 left-0 max-w-xl" style={{ visibility: 'hidden' }}>
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-sky-200/90">Tu casa</p>
                <h2 className="text-3xl font-light leading-tight tracking-tight sm:text-5xl">Un sueño dentro de otro.</h2>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-white/75 sm:text-base">Cada espacio es un capítulo. El baño es el primero; sigue bajando y vuelve a entrar al azul.</p>
              </div>
            </div>
          </div>

          <nav
            aria-label="Paradas del recorrido"
            className="absolute right-3 top-1/2 z-20 flex -translate-y-1/2 flex-col gap-1 sm:right-6"
          >
            {PARADAS.map((parada, i) => (
              <button
                key={parada.id}
                ref={(el) => {
                  paradaRefs.current[i] = el;
                }}
                type="button"
                onClick={() => irA(parada.s)}
                className="group flex min-h-[44px] items-center justify-end gap-3 text-[11px] font-medium uppercase tracking-[0.2em] text-white/45 transition hover:text-white data-[activo=true]:text-white"
              >
                <span className="hidden opacity-0 transition group-hover:opacity-100 group-data-[activo=true]:opacity-100 sm:inline">{parada.nombre}</span>
                <span className="h-2 w-2 rounded-full border border-white/50 transition group-data-[activo=true]:scale-125 group-data-[activo=true]:border-sky-300 group-data-[activo=true]:bg-sky-300" />
                <span className="sr-only sm:hidden">{parada.nombre}</span>
              </button>
            ))}
          </nav>
        </section>
      </div>
    </div>
  );
}
