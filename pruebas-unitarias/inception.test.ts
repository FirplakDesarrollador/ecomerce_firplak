import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  CAPAS,
  PUNTO_MUNDO,
  TRAMOS,
  camara,
  encuadre,
  escena,
  progresoBucle,
  recorrido,
} from '../components/landing-inception/camaraInception';
import { PUNTO_AZUL } from '../components/landing-inception/geometriaBano';

describe('Loop Inception del baño', () => {
  it('las tres imágenes existen', () => {
    for (const id of ['azul', 'bano', 'casa']) {
      expect(existsSync(resolve(`public/images/inception/bano-${id}.webp`))).toBe(true);
    }
  });

  it('el punto azul medido está en el centro del primer plano', () => {
    expect(PUNTO_AZUL.x).toBeCloseTo(0.5, 1);
    expect(PUNTO_AZUL.y).toBeCloseTo(0.5, 1);
    expect(PUNTO_AZUL.radio).toBeGreaterThan(0.005);
  });

  it('el scroll repite el bucle cada vuelta', () => {
    const L = 1000;
    expect(progresoBucle(L, L)).toBe(0);
    expect(progresoBucle(1.5 * L, L)).toBeCloseTo(0.5);
    expect(progresoBucle(0.75 * L, L)).toBeCloseTo(0.75);
    expect(progresoBucle(2.25 * L, L)).toBeCloseTo(0.25);
  });

  it('la ida y la vuelta son simétricas y el bucle cierra en el azul', () => {
    expect(recorrido(0)).toBe(0);
    expect(recorrido(0.5)).toBe(1);
    expect(recorrido(0.2)).toBeCloseTo(recorrido(0.8));
    expect(recorrido(1)).toBe(0);
  });

  it('cada imagen queda dentro de la que la contiene', () => {
    const dentro = (a: typeof CAPAS.azul, b: typeof CAPAS.bano) =>
      a.x >= b.x && a.y >= b.y && a.x + a.lado <= b.x + b.lado && a.y + a.lado <= b.y + b.lado;
    expect(dentro(CAPAS.azul, CAPAS.bano)).toBe(true);
    expect(dentro(CAPAS.bano, CAPAS.casa)).toBe(true);
    expect(PUNTO_MUNDO.x).toBeCloseTo(CAPAS.azul.x + PUNTO_AZUL.x * CAPAS.azul.lado, 6);
  });

  it('cada parada encuadra su imagen completa', () => {
    const llave = camara(TRAMOS.llave[0]);
    expect(llave.vista).toBeCloseTo(CAPAS.azul.lado, 6);
    const e = encuadre(CAPAS.azul, llave, 1000, { x: 0, y: 0 });
    expect(e.k).toBeCloseTo(1, 6);
    expect(e.tx).toBeCloseTo(0, 3);
    expect(e.ty).toBeCloseTo(0, 3);

    expect(camara(TRAMOS.bano[0]).vista).toBeCloseTo(CAPAS.bano.lado, 6);
    const casa = camara(TRAMOS.casa[0]);
    expect(casa.vista).toBeGreaterThanOrEqual(1);
    expect(casa.x).toBeCloseTo(0.5, 6);
    expect(casa.y).toBeCloseTo(0.5, 6);
  });

  it('la cámara no salta entre cuadros', () => {
    let previa = camara(0);
    for (let s = 0.001; s <= 1; s += 0.001) {
      const c = camara(s);
      expect(Math.abs(Math.log(c.vista / previa.vista))).toBeLessThan(0.06);
      expect(Math.hypot(c.x - previa.x, c.y - previa.y)).toBeLessThan(previa.vista * 0.06);
      previa = c;
    }
  });

  it('la casa cabe entera en vertical y en horizontal', () => {
    const vertical = camara(1, 390 / 844);
    expect(vertical.vista * (390 / 844)).toBeGreaterThanOrEqual(1);
    const horizontal = camara(1, 1440 / 900);
    expect(horizontal.vista / (1440 / 900)).toBeGreaterThanOrEqual(1);
  });

  it('cada momento muestra su texto', () => {
    const en = (s: number) => escena(s, camara(s));
    expect(en(0).floracion).toBe(1);
    expect(en(0).textos.azul).toBeCloseTo(1);
    expect(en(0.14).textos.llave).toBeCloseTo(1);
    expect(en(0.49).textos.bano).toBeCloseTo(1);
    expect(en(0.49).opacidadBano).toBe(1);
    expect(en(1).textos.casa).toBeCloseTo(1);
    expect(en(1).opacidadCasa).toBeCloseTo(1);
    expect(en(1).opacidadBano).toBeCloseTo(0);
  });

  it('sin movimiento reducido no hay giros', () => {
    const e = escena(0.7, camara(0.7), true);
    expect(e.anguloBano).toBe(0);
    expect(e.anguloCasa).toBe(0);
    expect(e.giro).toBe(0);
  });
});
