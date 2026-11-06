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
  centroBano,
  encuadre,
  escena,
  giroCasa,
  paralaje,
  progresoBucle,
  recorrido,
  suave,
  type Capa,
} from './camaraInception';
import { PUNTO_AZUL } from './geometriaBano';
import { FOCO_PROFUNDIDAD } from './profundidadBano';
import { PlacaViva } from './placaViva';

// El documento contiene el bucle repetido: al acercarse a un borde se salta una vuelta
// entera y, como el cuadro es idéntico, el scroll nunca termina.
const VUELTAS = 3;
const VH_POR_VUELTA = 900;
/** Segundos que tarda la cámara en alcanzar al scroll: desliza en vez de saltar. */
const INERCIA = 0.14;

type IdCapa = 'casa' | 'bano' | 'azul';
type IdPlaca = 'azul' | 'bano';

const CAPAS_DEF: { id: IdCapa; imagen: string; video: string; alt: string; profundidad?: string }[] = [
  {
    id: 'casa',
    imagen: '/images/inception/bano-casa.webp',
    video: '/videos/inception/bano-casa',
    alt: 'La casa completa vista desde arriba, con el baño, el patio interior, el cuarto, la cocina y la zona de lavado',
  },
  {
    id: 'bano',
    imagen: '/images/inception/bano-bano.webp',
    video: '/videos/inception/bano-bano',
    profundidad: '/images/inception/bano-bano-prof.webp',
    alt: 'Baño con bañera exenta de hidromasaje; una mujer con bata de seda toca los mandos',
  },
  {
    id: 'azul',
    imagen: '/images/inception/bano-azul.webp',
    video: '/videos/inception/bano-azul',
    profundidad: '/images/inception/bano-azul-prof.webp',
    alt: 'Mandos de cubo cromado sobre el borde de la tina: rojo, azul y uno liso',
  },
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
  const lienzoRefs = useRef<Record<IdPlaca, HTMLCanvasElement | null>>({ azul: null, bano: null });
  const videoRefs = useRef<Record<IdCapa, HTMLVideoElement | null>>({ casa: null, bano: null, azul: null });
  const floracionRef = useRef<HTMLDivElement | null>(null);
  const textoRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const pinRefs = useRef<(HTMLDivElement | null)[]>([]);
  const paradaRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const largoRef = useRef(0);

  useEffect(() => {
    const reducir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const movil = window.matchMedia('(max-width: 899px)').matches;
    const resolucion = movil ? 1080 : 2048;
    let raf = 0;
    let ladoAnterior = 0;
    let yRender = 0;
    let tPrevio = 0;
    let lnVistaPrevia = 0;
    let velocidadZoom = 0;

    // Placas WebGL: muestran el render mientras carga el video y luego el video vivo.
    const placas: Partial<Record<IdPlaca, PlacaViva>> = {};
    const cuadroNuevo: Record<IdCapa, boolean> = { casa: false, bano: true, azul: true };
    const limpiezas: (() => void)[] = [];
    for (const def of CAPAS_DEF) {
      const video = videoRefs.current[def.id];
      if (def.id !== 'casa') {
        const id = def.id;
        const lienzo = lienzoRefs.current[id];
        const placa = lienzo ? PlacaViva.crear(lienzo) : null;
        if (lienzo && placa) {
          lienzo.width = resolucion;
          lienzo.height = resolucion;
          placas[id] = placa;
          const img = new window.Image();
          img.decoding = 'async';
          img.onload = () => {
            if (!(video && video.readyState >= 2)) placa.ponerFuente(img);
            cuadroNuevo[id] = true;
          };
          img.src = def.imagen;
          if (def.profundidad) {
            const prof = new window.Image();
            prof.onload = () => placa.ponerProfundidad(prof, FOCO_PROFUNDIDAD[id]);
            prof.src = def.profundidad;
          }
        } else if (lienzo) {
          lienzo.style.display = 'none';
        }
      }
      if (!video) continue;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      const alCargar = () => {
        const placa = def.id !== 'casa' ? placas[def.id] : undefined;
        if (placa) placa.ponerFuente(video);
        cuadroNuevo[def.id] = true;
      };
      video.addEventListener('loadeddata', alCargar);
      limpiezas.push(() => video.removeEventListener('loadeddata', alCargar));
      // Solo se sube a la GPU cuando el video tiene un cuadro nuevo.
      const conCuadros = video as HTMLVideoElement & { requestVideoFrameCallback?: (cb: () => void) => number };
      if (conCuadros.requestVideoFrameCallback) {
        const marcar = () => {
          cuadroNuevo[def.id] = true;
          conCuadros.requestVideoFrameCallback?.(marcar);
        };
        conCuadros.requestVideoFrameCallback(marcar);
      }
      video.src = `${def.video}${movil ? '-m' : ''}.mp4`;
    }
    const sinCallbackDeCuadro = !('requestVideoFrameCallback' in HTMLVideoElement.prototype);

    const medir = () => {
      const c = contenedorRef.current, e = escenarioRef.current;
      if (!c || !e) return;
      largoRef.current = (c.offsetHeight - e.offsetHeight) / VUELTAS;
    };

    const reproducir = (id: IdCapa, visible: boolean) => {
      const v = videoRefs.current[id];
      if (!v) return;
      if (visible && v.paused) v.play().catch(() => {});
      else if (!visible && !v.paused) v.pause();
    };

    const pintar = (y: number, tiempo: number, dt: number) => {
      const e = escenarioRef.current;
      if (!e) return;
      const vw = e.clientWidth, vh = e.clientHeight, lado = Math.max(vw, vh);
      const off = { x: (vw - lado) / 2, y: (vh - lado) / 2 };
      if (lado !== ladoAnterior) {
        e.style.setProperty('--lado', `${lado}px`);
        ladoAnterior = lado;
      }
      const p = progresoBucle(y, largoRef.current);
      const s = recorrido(p);
      const aspecto = vw / vh;
      const cam = camara(s, aspecto);
      const est = escena(s, cam, reducir);

      // Desenfoque de zoom según la velocidad real de la cámara (suavizada).
      const lnVista = Math.log(cam.vista);
      const vel = lnVistaPrevia && dt > 0 ? Math.abs(lnVista - lnVistaPrevia) / dt : 0;
      lnVistaPrevia = lnVista;
      velocidadZoom += (vel - velocidadZoom) * (1 - Math.exp(-dt / 0.08));
      const desenfoque = reducir ? 0 : Math.min(0.045, Math.max(0, velocidadZoom - 0.3) * 0.016);
      const vaiven: [number, number] = reducir ? [0, 0] : [Math.sin(tiempo * 0.37), Math.cos(tiempo * 0.29)];

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
        const visible = opacidad >= 0.005;
        el.style.visibility = visible ? 'visible' : 'hidden';
        // Mientras se pliega o se funde dentro de otra, los bordes de la imagen se difuminan
        // para que no se vea el corte del recorte.
        const borde = angulo || (id === 'azul' && opacidad < 0.999) ? BORDE_SUAVE : '';
        if (el.style.maskImage !== borde) {
          el.style.maskImage = borde;
          el.style.maskComposite = borde ? 'intersect' : '';
        }
        reproducir(id, visible);

        const placa = id !== 'casa' ? placas[id] : undefined;
        if (placa && visible) {
          if (cuadroNuevo[id] || sinCallbackDeCuadro) {
            placa.subirCuadro();
            cuadroNuevo[id] = false;
          }
          const ref = id === 'bano' ? centroBano(aspecto) : PUNTO_MUNDO;
          const par = reducir ? { shift: [0, 0] as [number, number], dolly: 0 } : paralaje(capa, ref, cam, id === 'bano' ? est.subida : 0, vaiven);
          placa.dibujar({
            ...par,
            centro: [(cam.x - capa.x) / capa.lado, (cam.y - capa.y) / capa.lado],
            blur: desenfoque,
          });
        }
      };
      ponerCapa('casa', CAPAS.casa, est.opacidadCasa, est.anguloCasa);
      ponerCapa('bano', CAPAS.bano, est.opacidadBano, est.anguloBano);
      ponerCapa('azul', CAPAS.azul, est.opacidadAzul, 0);

      const mundo = mundoRef.current;
      if (mundo) {
        const giro = reducir ? 0 : giroCasa(p);
        mundo.style.transform = Math.abs(giro) > 0.001 ? `rotate(${giro}deg)` : '';
      }

      // Entrar al azul: el punto real del mando crece hasta llenar la pantalla; su brillo se mueve solo.
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
        if (opacidad >= 0.005 && !reducir) {
          flor.style.setProperty('--hx', `${38 + 10 * Math.sin(tiempo * 0.5 + p * 6.283)}%`);
          flor.style.setProperty('--hy', `${34 + 8 * Math.cos(tiempo * 0.43)}%`);
        }
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
        const q = aPantalla(esp, cam, lado, off);
        el.style.transform = `translate3d(${q.x}px,${q.y}px,0) translate(-50%,-50%)`;
        el.style.opacity = String(opacidadPines);
        el.style.visibility = opacidadPines < 0.005 ? 'hidden' : 'visible';
      });

      const activa = paradaActiva(s);
      paradaRefs.current.forEach((el, i) => {
        if (!el) return;
        const es = i === activa;
        if (el.dataset.activo !== String(es)) {
          el.dataset.activo = String(es);
          if (es) el.setAttribute('aria-current', 'step');
          else el.removeAttribute('aria-current');
        }
      });
    };

    // Un solo bucle de cuadros: la cámara persigue al scroll con inercia y las placas vivas
    // siguen moviéndose aunque el scroll esté quieto.
    const cuadro = (ts: number) => {
      raf = requestAnimationFrame(cuadro);
      const dt = tPrevio ? Math.min(0.05, (ts - tPrevio) / 1000) : 1 / 60;
      tPrevio = ts;
      const objetivo = window.scrollY;
      yRender += (objetivo - yRender) * (reducir ? 1 : 1 - Math.exp(-dt / INERCIA));
      if (Math.abs(objetivo - yRender) < 0.25) yRender = objetivo;
      pintar(yRender, ts / 1000, dt);
    };

    const alScroll = () => {
      const largo = largoRef.current, y = window.scrollY;
      if (largo <= 0) return;
      // El salto de una vuelta se aplica también a la cámara para que no lo note.
      if (y < largo * 0.5) {
        window.scrollTo({ top: y + largo, behavior: 'instant' });
        yRender += largo;
      } else if (y > largo * 2.5) {
        window.scrollTo({ top: y - largo, behavior: 'instant' });
        yRender -= largo;
      }
    };

    const restauracion = history.scrollRestoration;
    history.scrollRestoration = 'manual';
    const inicio = requestAnimationFrame(() => {
      medir();
      window.scrollTo({ top: largoRef.current, behavior: 'instant' });
      yRender = largoRef.current;
      raf = requestAnimationFrame(cuadro);
    });
    window.addEventListener('scroll', alScroll, { passive: true });
    const observador = new ResizeObserver(medir);
    if (escenarioRef.current) observador.observe(escenarioRef.current);
    const videos = videoRefs.current;

    return () => {
      cancelAnimationFrame(inicio);
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', alScroll);
      observador.disconnect();
      limpiezas.forEach((f) => f());
      Object.values(videos).forEach((v) => v?.pause());
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
            {CAPAS_DEF.map((def) => (
              <div
                key={def.id}
                ref={(el) => {
                  capaRefs.current[def.id] = el;
                }}
                className="absolute left-0 top-0 will-change-transform"
                style={{ width: 'var(--lado, 100vmax)', height: 'var(--lado, 100vmax)', transformOrigin: '0 0', visibility: 'hidden' }}
              >
                <Image
                  src={def.imagen}
                  alt={def.alt}
                  fill
                  sizes="100vmax"
                  priority={def.id !== 'casa'}
                  draggable={false}
                  className="select-none object-cover"
                />
                {def.id === 'casa' ? (
                  <video
                    ref={(el) => {
                      videoRefs.current.casa = el;
                    }}
                    aria-hidden="true"
                    muted
                    loop
                    playsInline
                    preload="auto"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <>
                    <canvas
                      ref={(el) => {
                        lienzoRefs.current[def.id as IdPlaca] = el;
                      }}
                      aria-hidden="true"
                      className="absolute inset-0 h-full w-full"
                    />
                    <video
                      ref={(el) => {
                        videoRefs.current[def.id] = el;
                      }}
                      aria-hidden="true"
                      muted
                      loop
                      playsInline
                      preload="auto"
                      className="pointer-events-none absolute left-0 top-0 h-px w-px opacity-0"
                    />
                  </>
                )}
              </div>
            ))}

            <div
              ref={floracionRef}
              aria-hidden="true"
              className="absolute left-0 top-0 h-[100px] w-[100px] rounded-full will-change-transform"
              style={{
                background: `radial-gradient(circle at var(--hx, 40%) var(--hy, 36%), color-mix(in srgb, #9db4ff 55%, transparent) 0%, transparent 42%), radial-gradient(circle closest-side, color-mix(in srgb, ${PUNTO_AZUL.color} 60%, #6f8dff) 0%, color-mix(in srgb, ${PUNTO_AZUL.color} 82%, #3550d8) 40%, ${PUNTO_AZUL.color} 80%, color-mix(in srgb, ${PUNTO_AZUL.color} 40%, transparent) 92%, transparent 100%)`,
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
