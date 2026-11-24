import { describe, expect, it } from 'vitest';
import { DURACION_DESLIZAMIENTO_D, estadoResorteD, fotogramasResorteD } from '../components/banos-muebles/opcion-d/resorteD';

describe('movimiento lateral de piezas independientes', () => {
  it('conserva posición y velocidad al invertir el destino a mitad de recorrido', () => {
    const actual = estadoResorteD(0, -1400, 0, .12);
    const inverso = estadoResorteD(actual.x, 0, actual.velocidad, 0);
    expect(inverso.x).toBeCloseTo(actual.x, 8);
    expect(inverso.velocidad).toBeCloseTo(actual.velocidad, 8);
    expect(estadoResorteD(actual.x, 0, actual.velocidad, 1).x).toBeCloseTo(0, 2);
  });

  it('entrada y salida son simétricas en los dos sentidos y llegan sin rebote', () => {
    for (let i = 0; i <= 60; i++) {
      const t = i / 60 * DURACION_DESLIZAMIENTO_D / 1000;
      const derecha = estadoResorteD(1400, 0, 0, t).x;
      const izquierda = estadoResorteD(-1400, 0, 0, t).x;
      expect(derecha).toBeGreaterThanOrEqual(0);
      expect(derecha).toBeLessThanOrEqual(1400);
      expect(izquierda).toBeCloseTo(-derecha, 8);
      expect(estadoResorteD(0, -1400, 0, t).x).toBeCloseTo(derecha - 1400, 8);
    }
  });

  it('el producto viaja opaco y termina exactamente en su anclaje', () => {
    const frames = fotogramasResorteD(1400, 0, 0, 1400, false);
    expect(frames.every(frame => frame.opacity === 1)).toBe(true);
    expect(frames.at(0)?.transform).toBe('translate3d(1400px, 0, 0)');
    expect(frames.at(-1)?.transform).toBe('translate3d(0px, 0, 0)');
  });

  it('la sombra conserva su proyección y aparece al acercarse el mueble a su posición final', () => {
    const frames = fotogramasResorteD(1400, 0, 0, 1400, true);
    expect(frames.at(0)?.opacity).toBe(0);
    expect(frames.at(-1)?.opacity).toBe(1);
    expect(frames.every(frame => frame.opacity >= 0 && frame.opacity <= 1)).toBe(true);
    expect(frames.every(frame => frame.transform === 'translate3d(0, 0, 0)')).toBe(true);
  });
});
