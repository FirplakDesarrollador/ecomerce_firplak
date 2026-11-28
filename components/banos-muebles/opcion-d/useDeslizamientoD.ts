'use client';

import { useEffect, useLayoutEffect, useRef, type RefObject } from 'react';
import { DURACION_DESLIZAMIENTO_D, estadoResorteD, fotogramasResorteD } from './resorteD';

const DURACION_FUNDIDO_ACABADO_D = 320;

interface EnCurso { animation: Animation; desde: number; hasta: number; velocidad: number; modo: 'deslizar' | 'fundido' }

/** Movimiento independiente por fila; permite invertirlo desde su posición y velocidad actuales.
 * Cuando cambia solo el acabado del mismo mueble, hace un fundido suave en el sitio sin deslizar.
 */
export function useDeslizamientoD(escenario: RefObject<HTMLDivElement | null>, fila: 'mueble' | 'lavamanos', seleccion: string, direccion: number, animar: boolean) {
  const anterior = useRef<string | null>(null);
  const animaciones = useRef(new Map<HTMLElement, EnCurso>());

  useLayoutEffect(() => {
    const antes = anterior.current;
    anterior.current = seleccion;
    if (antes === seleccion) return;
    const root = escenario.current;
    if (!root) return;
    const capas = root.querySelectorAll<HTMLElement>(fila === 'mueble'
      ? '[data-capa="mueble"], [data-capa="sombra"]' : '[data-capa="lavamanos"]');
    if (antes === null || !animar || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      for (const capa of capas) {
        animaciones.current.get(capa)?.animation.cancel();
        animaciones.current.delete(capa);
        capa.style.willChange = '';
        capa.style.zIndex = '';
      }
      return;
    }
    const soloAcabado = fila === 'mueble' && antes.split('__')[0] === seleccion.split('__')[0];
    if (soloAcabado) {
      for (const capa of capas) {
        const activa = capa.dataset.activa === 'true';
        const eraActiva = capa.dataset.seleccion === antes;
        const curso = animaciones.current.get(capa);
        if (!activa && !eraActiva && !curso) continue;
        if (typeof capa.animate !== 'function') continue;
        const opacidadActual = Number(getComputedStyle(capa).opacity);
        if (curso) {
          curso.animation.cancel();
          animaciones.current.delete(capa);
        }
        // La sombra del mismo mueble no cambia: evitar cualquier parpadeo al alternar acabado.
        if (capa.dataset.capa === 'sombra') {
          capa.style.willChange = '';
          capa.style.zIndex = '';
          continue;
        }
        capa.style.willChange = 'opacity';
        // El acabado entrante sube sobre el saliente para no traslucir la pared a mitad del fundido.
        capa.style.zIndex = activa ? '2' : '1';
        const frames: Keyframe[] = activa
          ? [
              { transform: 'translate3d(0, 0, 0)', opacity: curso ? opacidadActual : 0 },
              { transform: 'translate3d(0, 0, 0)', opacity: 1 },
            ]
          : [
              { transform: 'translate3d(0, 0, 0)', opacity: curso ? opacidadActual : 1, offset: 0 },
              { transform: 'translate3d(0, 0, 0)', opacity: curso ? opacidadActual : 1, offset: 0.85 },
              { transform: 'translate3d(0, 0, 0)', opacity: 0, offset: 1 },
            ];
        const animation = capa.animate(frames, {
          duration: DURACION_FUNDIDO_ACABADO_D, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'both',
        });
        animaciones.current.set(capa, { animation, desde: 0, hasta: 0, velocidad: 0, modo: 'fundido' });
        animation.onfinish = () => {
          if (animaciones.current.get(capa)?.animation !== animation) return;
          animaciones.current.delete(capa);
          animation.cancel();
          capa.style.willChange = '';
          capa.style.zIndex = '';
        };
      }
      return;
    }
    const distancia = root.getBoundingClientRect().width + 48;
    for (const capa of capas) {
      const activa = capa.dataset.activa === 'true';
      const eraActiva = capa.dataset.seleccion === antes;
      const curso = animaciones.current.get(capa);
      if (!activa && !eraActiva && !curso) continue;
      if (typeof capa.animate !== 'function') continue;
      let desde = activa ? direccion * distancia : 0;
      let velocidad = 0;
      if (curso) {
        if (curso.modo === 'deslizar') {
          const transform = getComputedStyle(capa).transform;
          const estado = estadoResorteD(curso.desde, curso.hasta, curso.velocidad, Number(curso.animation.currentTime ?? 0) / 1000);
          desde = capa.dataset.capa === 'sombra' ? estado.x : transform === 'none' ? 0 : new DOMMatrixReadOnly(transform).m41;
          velocidad = estado.velocidad;
        }
        curso.animation.cancel();
      }
      const hasta = activa ? 0 : !eraActiva && curso ? curso.hasta : -direccion * distancia;
      capa.style.zIndex = '';
      capa.style.willChange = 'transform, opacity';
      const animation = capa.animate(fotogramasResorteD(desde, hasta, velocidad, distancia, capa.dataset.capa === 'sombra'), {
        duration: DURACION_DESLIZAMIENTO_D, easing: 'linear', fill: 'both',
      });
      animaciones.current.set(capa, { animation, desde, hasta, velocidad, modo: 'deslizar' });
      animation.onfinish = () => {
        if (animaciones.current.get(capa)?.animation !== animation) return;
        animaciones.current.delete(capa);
        // Los estilos declarativos ya representan el destino. No se acumulan animaciones.
        animation.cancel();
        capa.style.willChange = '';
      };
    }
  }, [escenario, fila, seleccion, direccion, animar]);

  useEffect(() => {
    const cursos = animaciones.current;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const cancelar = () => {
      for (const [capa, curso] of cursos) {
        curso.animation.cancel();
        capa.style.willChange = '';
        capa.style.zIndex = '';
      }
      cursos.clear();
    };
    const preferencia = () => { if (media.matches) cancelar(); };
    media.addEventListener('change', preferencia);
    return () => { media.removeEventListener('change', preferencia); cancelar(); };
  }, []);
}
