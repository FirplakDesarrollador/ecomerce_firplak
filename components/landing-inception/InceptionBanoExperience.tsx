'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import LoomereNavbar from '@/components/loomere/LoomereNavbar';
import LoomereMegamenu from '@/components/loomere/LoomereMegamenu';
import { PUNTO_MUNDO, TINA_EN_CASA, progresoBucle, suave } from './camaraInception';
import { LAV_EN_CASA, TRAMOS_LAV, camaraCasa } from './capituloLavamanos';
import { CAPAS_MUNDO, PARADAS, enBucle, fotograma, paradaActiva, referenciaParalaje, type IdCapa } from './guion';
import { aPantallaG, enCapa, transformCapa, type Escenario } from './proyeccion';
import { PUNTO_AZUL } from './geometriaBano';
import { FOCO_PROFUNDIDAD } from './profundidadBano';
import { FOCO_LAVAMANOS } from './profundidadLavamanos';
import { PlacaViva } from './placaViva';
import { GotaLente } from './gotaLente';

// El documento contiene el bucle repetido: al acercarse a un borde se salta una vuelta
// entera y, como el cuadro es idéntico, el scroll nunca termina.
const VUELTAS = 3;
const VH_POR_VUELTA = 1600;
/** Segundos que tarda la cámara en alcanzar al scroll: desliza en vez de saltar. */
const INERCIA = 0.14;

type IdPlaca = Exclude<IdCapa, 'casa'>;

const CAPAS_DEF: { id: IdCapa; imagen: string; video?: string; profundidad?: string; foco?: number; alt: string }[] = [
  { id: 'casa', imagen: '/images/inception/bano-casa.webp', video: '/videos/inception/bano-casa', alt: 'La casa completa vista desde arriba' },
  { id: 'bano', imagen: '/images/inception/bano-bano.webp', video: '/videos/inception/bano-bano', profundidad: '/images/inception/bano-bano-prof.webp', foco: FOCO_PROFUNDIDAD.bano, alt: 'Baño con bañera exenta de hidromasaje; una mujer con bata de seda toca los mandos' },
  { id: 'azul', imagen: '/images/inception/bano-azul.webp', video: '/videos/inception/bano-azul', profundidad: '/images/inception/bano-azul-prof.webp', foco: FOCO_PROFUNDIDAD.azul, alt: 'Mandos de cubo cromado sobre el borde de la tina: rojo, azul y uno liso' },
  { id: 'lav', imagen: '/images/inception/lav-cerrado.webp', video: '/videos/inception/lav-cerrado', profundidad: '/images/inception/lav-lav-prof.webp', foco: FOCO_LAVAMANOS.lav, alt: 'Mueble de lavamanos con dos puertas, lavabo de sobreponer y grifería de pared blanca' },
  { id: 'grifo', imagen: '/images/inception/lav-grifo.webp', profundidad: '/images/inception/lav-grifo-prof.webp', foco: FOCO_LAVAMANOS.grifo, alt: 'Grifería de pared blanca sobre el lavabo' },
];

/** Cuadros de la apertura de las puertas (mismo encuadre). Hoy: cerrado y abierto. */
const CUADROS_PUERTAS = ['/images/inception/lav-cerrado.webp', '/images/inception/lav-abierto.webp'];

// Espacios de la casa (coordenadas sobre la vista desde arriba).
const ESPACIOS = [
  { nombre: 'Hidromasaje', x: TINA_EN_CASA.x + 0.02, y: TINA_EN_CASA.y + 0.12, p: enBucle('vuelta', 0.515) },
  { nombre: 'Lavamanos', x: LAV_EN_CASA.x + 0.005, y: LAV_EN_CASA.y + 0.105, p: enBucle('lavamanos', (TRAMOS_LAV.mueble[0] + TRAMOS_LAV.mueble[1]) / 2) },
  { nombre: 'Cocina', x: 0.52, y: 0.64, p: null },
  { nombre: 'Zona de ropas', x: 0.763, y: 0.725, p: null },
];

const BORDE_SUAVE =
  'linear-gradient(to right, transparent, #000 9%, #000 91%, transparent), linear-gradient(to bottom, transparent, #000 9%, #000 91%, transparent)';

const TEXTOS: { id: string; eyebrow: string; titulo: string; texto?: string; cta?: { href: string; label: string }; nivel: 'h1' | 'h2'; pista?: string }[] = [
  { id: 'azul', nivel: 'h1', eyebrow: 'Firplak · Tu casa', titulo: 'Todo empieza en el azul.', pista: 'Desliza para salir del sueño' },
  { id: 'llave', nivel: 'h2', eyebrow: 'Agua fría', titulo: 'Un giro. Y el agua responde.', texto: 'Mandos de cubo cromado sobre el borde de la tina: el rojo para el agua caliente, el azul para la fría.' },
  { id: 'bano', nivel: 'h2', eyebrow: 'Hidromasaje', titulo: 'Tu santuario, a un gesto de distancia.', texto: 'Bañera exenta con hidromasaje, pensada para el centro de tu baño.', cta: { href: '/categoria-producto/jacuzzis-e-hidromasajes/freestanding/', label: 'Ver hidromasajes freestanding' } },
  { id: 'casa', nivel: 'h2', eyebrow: 'Tu casa', titulo: 'Un sueño dentro de otro.', texto: 'Cada espacio es un capítulo. Sigue bajando para entrar al siguiente.' },
  { id: 'lav', nivel: 'h2', eyebrow: 'Lavamanos', titulo: 'Todo cabe. Todo combina.', texto: 'Mueble de dos puertas con entrepaño, lavamanos de sobreponer y grifería de pared.', cta: { href: '/categoria-producto/banos/combos-lavamanos-con-mueble/?opcion=c', label: 'Arma tu combinación' } },
  { id: 'puertas', nivel: 'h2', eyebrow: 'Por dentro', titulo: 'Ábrelo: espacio para el día a día.' },
  { id: 'grifo', nivel: 'h2', eyebrow: 'Grifería de pared', titulo: 'Una gota basta para volver a empezar.', texto: 'Sigue bajando y entra en ella.' },
];

export default function InceptionBanoExperience() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const contenedorRef = useRef<HTMLDivElement | null>(null);
  const escenarioRef = useRef<HTMLDivElement | null>(null);
  const capaRefs = useRef<Record<IdCapa, HTMLDivElement | null>>({ casa: null, bano: null, azul: null, lav: null, grifo: null });
  const lienzoRefs = useRef<Record<IdPlaca, HTMLCanvasElement | null>>({ bano: null, azul: null, lav: null, grifo: null });
  const videoRefs = useRef<Record<IdCapa, HTMLVideoElement | null>>({ casa: null, bano: null, azul: null, lav: null, grifo: null });
  const gotaRef = useRef<HTMLCanvasElement | null>(null);
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

    const placas: Partial<Record<IdPlaca, PlacaViva>> = {};
    const cuadroNuevo: Record<IdCapa, boolean> = { casa: true, bano: true, azul: true, lav: true, grifo: true };
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
            prof.onload = () => placa.ponerProfundidad(prof, def.foco ?? 0.5);
            prof.src = def.profundidad;
          }
        } else if (lienzo) {
          lienzo.style.display = 'none';
        }
      }
      if (!video || !def.video) continue;
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

    // Puertas: los cuadros se mezclan en un lienzo que pasa a ser la fuente de la placa del mueble.
    const lienzoPuertas = document.createElement('canvas');
    lienzoPuertas.width = resolucion;
    lienzoPuertas.height = resolucion;
    const ctxPuertas = lienzoPuertas.getContext('2d');
    const cuadrosPuertas = CUADROS_PUERTAS.map((src) => {
      const img = new window.Image();
      img.decoding = 'async';
      img.src = src;
      return img;
    });
    let puertasPintadas = -1;
    const pintarPuertas = (puertas: number) => {
      const placa = placas.lav;
      const video = videoRefs.current.lav;
      if (!placa || !ctxPuertas) return;
      if (puertas <= 0.0005) {
        if (puertasPintadas !== 0 && video && video.readyState >= 2) placa.ponerFuente(video);
        puertasPintadas = 0;
        return;
      }
      if (Math.abs(puertas - puertasPintadas) < 0.002 && !(puertas < 0.1 && cuadroNuevo.lav)) return;
      if (!cuadrosPuertas.every((c) => c.complete && c.naturalWidth > 0)) return;
      const n = cuadrosPuertas.length;
      const pos = puertas * (n - 1);
      const i = Math.min(n - 2, Math.floor(pos));
      const f = pos - i;
      // Al empezar se pasa del clip vivo al primer cuadro, sin salto.
      const entrada = suave(0, 0.08, puertas);
      ctxPuertas.globalAlpha = 1;
      if (entrada < 1 && video && video.readyState >= 2) ctxPuertas.drawImage(video, 0, 0, resolucion, resolucion);
      ctxPuertas.globalAlpha = entrada;
      ctxPuertas.drawImage(cuadrosPuertas[i], 0, 0, resolucion, resolucion);
      ctxPuertas.globalAlpha = entrada * f;
      ctxPuertas.drawImage(cuadrosPuertas[i + 1], 0, 0, resolucion, resolucion);
      ctxPuertas.globalAlpha = 1;
      placa.ponerFuente(lienzoPuertas);
      cuadroNuevo.lav = true;
      puertasPintadas = puertas;
    };

    // La gota y su lente con la casa viva adentro.
    const lienzoGota = gotaRef.current;
    const gota = lienzoGota ? GotaLente.crear(lienzoGota) : null;
    const imgCasa = new window.Image();
    imgCasa.src = '/images/inception/bano-casa.webp';
    if (gota) gota.ponerFuente(imgCasa);
    let gotaVisible = false;
    let gotaTieneVideo = false;

    const medir = () => {
      const c = contenedorRef.current, e = escenarioRef.current;
      if (!c || !e) return;
      largoRef.current = (c.offsetHeight - e.offsetHeight) / VUELTAS;
      if (lienzoGota) {
        const dpr = Math.min(1.5, window.devicePixelRatio || 1);
        lienzoGota.width = Math.round(e.clientWidth * dpr);
        lienzoGota.height = Math.round(e.clientHeight * dpr);
      }
    };

    const reproducir = (id: IdCapa, visible: boolean) => {
      const v = videoRefs.current[id];
      if (!v || !v.src) return;
      if (visible && v.paused) v.play().catch(() => {});
      else if (!visible && !v.paused) v.pause();
    };

    const pintar = (y: number, tiempo: number, dt: number) => {
      const e = escenarioRef.current;
      if (!e) return;
      const vw = e.clientWidth, vh = e.clientHeight, lado = Math.max(vw, vh);
      const esc: Escenario = { lado, off: { x: (vw - lado) / 2, y: (vh - lado) / 2 } };
      if (lado !== ladoAnterior) {
        e.style.setProperty('--lado', `${lado}px`);
        ladoAnterior = lado;
      }
      const p = progresoBucle(y, largoRef.current);
      const aspecto = vw / vh;
      const f = fotograma(p, aspecto, reducir);
      const cam = f.cam;

      // Desenfoque de zoom según la velocidad real de la cámara; el salto del portal no cuenta.
      const lnVista = Math.log(cam.vista);
      const delta = lnVistaPrevia ? Math.abs(lnVista - lnVistaPrevia) : 0;
      const vel = dt > 0 && delta < 1 ? delta / dt : 0;
      lnVistaPrevia = lnVista;
      velocidadZoom += (vel - velocidadZoom) * (1 - Math.exp(-dt / 0.08));
      const desenfoque = reducir ? 0 : Math.min(0.045, Math.max(0, velocidadZoom - 0.3) * 0.016);
      const vaiven: [number, number] = reducir ? [0, 0] : [Math.sin(tiempo * 0.37), Math.cos(tiempo * 0.29)];

      if (f.capas.lav.opacidad > 0.005) pintarPuertas(f.puertas);

      for (const def of CAPAS_DEF) {
        const id = def.id;
        const el = capaRefs.current[id];
        if (!el) continue;
        const estado = f.capas[id];
        const capa = CAPAS_MUNDO[id];
        const visible = estado.opacidad >= 0.005;
        el.style.visibility = visible ? 'visible' : 'hidden';
        reproducir(id, visible);
        if (!visible) continue;
        el.style.transform = transformCapa(capa, cam, esc, estado.inclinacion, estado.pivote);
        el.style.opacity = String(estado.opacidad);
        // Mientras se pliega o se funde dentro de otra, los bordes se difuminan para no ver el recorte.
        const borde = estado.inclinacion || ((id === 'azul' || id === 'grifo') && estado.opacidad < 0.999) ? BORDE_SUAVE : '';
        if (el.style.maskImage !== borde) {
          el.style.maskImage = borde;
          el.style.maskComposite = borde ? 'intersect' : '';
        }
        const placa = id !== 'casa' ? placas[id] : undefined;
        if (placa) {
          if (cuadroNuevo[id] || sinCallbackDeCuadro) {
            placa.subirCuadro();
            cuadroNuevo[id] = false;
          }
          const ref = referenciaParalaje(id as IdPlaca, aspecto);
          const centro = enCapa(capa, cam);
          const acerca = Math.log(capa.lado / cam.vista);
          const subida = id === 'bano' ? f.subidaBano : 0;
          placa.dibujar({
            shift: reducir ? [0, 0] : [-(centro.x - ref.x) * 0.09 + vaiven[0] * 0.006, -(centro.y - ref.y) * 0.09 + subida * 0.05 + vaiven[1] * 0.004],
            dolly: reducir ? 0 : Math.max(-0.05, Math.min(0.12, acerca * 0.07)),
            centro: [centro.x, centro.y],
            blur: desenfoque,
          });
        }
      }

      // Entrar al azul (capítulo 1): el punto real del mando crece hasta llenar la pantalla.
      const flor = floracionRef.current;
      if (flor) {
        const fl = f.floracion;
        const opacidad = suave(0, 0.15, fl);
        flor.style.visibility = opacidad < 0.005 ? 'hidden' : 'visible';
        if (opacidad >= 0.005) {
          const centro = aPantallaG(PUNTO_MUNDO, cam, esc);
          const radioPunto = (PUNTO_MUNDO.radio / cam.vista) * lado;
          const cubrir = Math.hypot(Math.max(centro.x, vw - centro.x), Math.max(centro.y, vh - centro.y)) * 1.05;
          const radio = radioPunto + (cubrir - radioPunto) * fl * fl * (3 - 2 * fl);
          // El degradado del círculo es sólido hasta el 80 % del radio: se escala por ese radio.
          flor.style.transform = `translate3d(${centro.x}px,${centro.y}px,0) translate(-50%,-50%) scale(${radio / 40})`;
          flor.style.opacity = String(opacidad);
          if (!reducir) {
            flor.style.setProperty('--hx', `${38 + 10 * Math.sin(tiempo * 0.5 + p * 6.283)}%`);
            flor.style.setProperty('--hy', `${34 + 8 * Math.cos(tiempo * 0.43)}%`);
          }
        }
      }

      // La gota (capítulo 2): lente de agua con la casa adentro.
      if (lienzoGota && gota) {
        if (f.gota) {
          const casaVideo = videoRefs.current.casa;
          if (!gotaTieneVideo && casaVideo && casaVideo.readyState >= 2) {
            gota.ponerFuente(casaVideo);
            gotaTieneVideo = true;
          }
          reproducir('casa', true);
          gota.subirCuadro();
          const esc2 = lienzoGota.width / vw;
          const centro = aPantallaG(f.gota.centro, cam, esc);
          const casa = camaraCasa(aspecto);
          gota.dibujar({
            centro: [centro.x * esc2, centro.y * esc2],
            radio: (f.gota.radio / cam.vista) * lado * esc2,
            estira: f.gota.estira,
            mezcla: f.gota.mezcla,
            c: [(lado / 2 + esc.off.x) * esc2, (lado / 2 + esc.off.y) * esc2],
            s: lado * esc2,
            vistaCasa: casa.vista,
          });
          if (!gotaVisible) {
            lienzoGota.style.visibility = 'visible';
            gotaVisible = true;
          }
        } else if (gotaVisible) {
          gota.limpiar();
          lienzoGota.style.visibility = 'hidden';
          gotaVisible = false;
        }
      }

      for (const [id, v] of Object.entries(f.textos)) {
        const el = textoRefs.current[id];
        if (!el) continue;
        el.style.opacity = String(v);
        el.style.transform = `translate3d(0,${(1 - v) * 18}px,0)`;
        el.style.visibility = v < 0.005 ? 'hidden' : 'visible';
        el.style.pointerEvents = v > 0.6 ? 'auto' : 'none';
      }

      ESPACIOS.forEach((esp, i) => {
        const el = pinRefs.current[i];
        if (!el) return;
        const visible = f.pines >= 0.005;
        el.style.visibility = visible ? 'visible' : 'hidden';
        if (!visible) return;
        const q = aPantallaG(esp, cam, esc);
        el.style.transform = `translate3d(${q.x}px,${q.y}px,0) translate(-50%,-50%)`;
        el.style.opacity = String(f.pines);
        el.style.pointerEvents = f.pines > 0.6 ? 'auto' : 'none';
      });

      const activa = paradaActiva(p);
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
      // El salto de una vuelta se aplica también a la cámara para que no se note.
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
      limpiezas.forEach((fn) => fn());
      Object.values(videos).forEach((v) => v?.pause());
      history.scrollRestoration = restauracion;
      window.scrollTo({ top: 0, behavior: 'instant' });
    };
  }, []);

  const irA = (pDestino: number) => {
    const largo = largoRef.current;
    if (largo <= 0) return;
    const p = progresoBucle(window.scrollY, largo);
    const base = window.scrollY - p * largo;
    // Siempre hacia adelante: si el destino quedó atrás, se va a la vuelta siguiente.
    const destino = pDestino >= p ? pDestino : pDestino + 1;
    window.scrollTo({ top: base + destino * largo, behavior: 'smooth' });
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
          aria-label="Recorrido en bucle por la casa: hidromasaje, lavamanos y grifería"
          className="sticky top-0 h-[100svh] w-full overflow-hidden bg-[#0b0d11]"
        >
          <div className="absolute inset-0">
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
                  priority={def.id === 'azul' || def.id === 'casa'}
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
                    {def.video && (
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
                    )}
                  </>
                )}
              </div>
            ))}

            <div
              ref={floracionRef}
              aria-hidden="true"
              className="absolute left-0 top-0 h-[100px] w-[100px] rounded-full will-change-transform"
              style={{
                visibility: 'hidden',
                background: `radial-gradient(circle at var(--hx, 40%) var(--hy, 36%), color-mix(in srgb, #9db4ff 55%, transparent) 0%, transparent 42%), radial-gradient(circle closest-side, color-mix(in srgb, ${PUNTO_AZUL.color} 60%, #6f8dff) 0%, color-mix(in srgb, ${PUNTO_AZUL.color} 82%, #3550d8) 40%, ${PUNTO_AZUL.color} 80%, color-mix(in srgb, ${PUNTO_AZUL.color} 40%, transparent) 92%, transparent 100%)`,
              }}
            />

            <canvas ref={gotaRef} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" style={{ visibility: 'hidden' }} />

            {ESPACIOS.map((esp, i) => (
              <div
                key={esp.nombre}
                ref={(el) => {
                  pinRefs.current[i] = el;
                }}
                className="absolute left-0 top-0"
                style={{ visibility: 'hidden' }}
              >
                <button
                  type="button"
                  disabled={esp.p === null}
                  onClick={() => esp.p !== null && irA(esp.p)}
                  className={`flex min-h-[32px] items-center gap-2 whitespace-nowrap rounded-full border px-3 py-1.5 text-[11px] font-medium tracking-wide backdrop-blur-md transition sm:text-xs ${
                    esp.p !== null
                      ? 'border-sky-300/60 bg-sky-500/25 text-white shadow-[0_0_24px_rgba(56,132,255,0.45)] hover:bg-sky-500/45'
                      : 'cursor-default border-white/15 bg-black/45 text-white/75'
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${esp.p !== null ? 'animate-pulse bg-sky-300' : 'bg-white/40'}`} />
                  {esp.nombre}
                  <span className="hidden text-white/50 sm:inline">{esp.p !== null ? '· entrar' : '· pronto'}</span>
                </button>
              </div>
            ))}
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[48%] bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

          <div className="pointer-events-none absolute inset-x-0 bottom-0 px-5 pb-24 sm:px-10 sm:pb-16 lg:px-16">
            <div className="relative mx-auto max-w-6xl">
              {TEXTOS.map((tx) => {
                const Titulo = tx.nivel;
                return (
                  <div
                    key={tx.id}
                    ref={(el) => {
                      textoRefs.current[tx.id] = el;
                    }}
                    className="absolute bottom-0 left-0 max-w-xl"
                    style={{ visibility: 'hidden' }}
                  >
                    <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-sky-200/90">{tx.eyebrow}</p>
                    <Titulo className={`${tx.nivel === 'h1' ? 'text-4xl sm:text-6xl' : 'text-3xl sm:text-5xl'} font-light leading-[1.05] tracking-tight`}>{tx.titulo}</Titulo>
                    {tx.texto && <p className="mt-4 max-w-md text-sm leading-relaxed text-white/75 sm:text-base">{tx.texto}</p>}
                    {tx.pista && (
                      <p className="mt-5 flex items-center gap-2 text-sm text-white/70">
                        <ArrowDown className="h-4 w-4 animate-bounce" aria-hidden="true" />
                        {tx.pista}
                      </p>
                    )}
                    {tx.cta && (
                      <a
                        href={tx.cta.href}
                        className="mt-6 inline-flex min-h-[44px] items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-black transition hover:bg-sky-100"
                      >
                        {tx.cta.label}
                        <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                      </a>
                    )}
                  </div>
                );
              })}
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
                onClick={() => irA(parada.p)}
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
