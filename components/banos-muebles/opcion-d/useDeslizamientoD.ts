'use client';

import { useEffect, useLayoutEffect, useRef, type RefObject } from 'react';
import { DURACION_DESLIZAMIENTO_D, estadoResorteD, fotogramasResorteD } from './resorteD';

interface EnCurso { animation: Animation; desde: number; hasta: number; velocidad: number }

/** Movimiento independiente por fila; permite invertirlo desde su posición y velocidad actuales. */
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
        const transform = getComputedStyle(capa).transform;
        const estado = estadoResorteD(curso.desde, curso.hasta, curso.velocidad, Number(curso.animation.currentTime ?? 0) / 1000);
        desde = capa.dataset.capa === 'sombra' ? estado.x : transform === 'none' ? 0 : new DOMMatrixReadOnly(transform).m41;
        velocidad = estado.velocidad;
        curso.animation.cancel();
      }
      const hasta = activa ? 0 : !eraActiva && curso ? curso.hasta : -direccion * distancia;
      capa.style.willChange = 'transform, opacity';
      const animation = capa.animate(fotogramasResorteD(desde, hasta, velocidad, distancia, capa.dataset.capa === 'sombra'), {
        duration: DURACION_DESLIZAMIENTO_D, easing: 'linear', fill: 'both',
      });
      animaciones.current.set(capa, { animation, desde, hasta, velocidad });
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
      }
      cursos.clear();
    };
    const preferencia = () => { if (media.matches) cancelar(); };
    media.addEventListener('change', preferencia);
    return () => { media.removeEventListener('change', preferencia); cancelar(); };
  }, []);
}
