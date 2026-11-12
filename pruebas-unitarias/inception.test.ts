import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  CAPAS,
  PUNTO_MUNDO,
  TRAMOS,
  camara,
  encuadre,
  giroCasa,
  paralaje,
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

  it('en cada parada la imagen del frente cubre toda la pantalla, aunque la cámara siga moviéndose', () => {
    const cubre = (capa: typeof CAPAS.azul, s: number, aspecto: number) => {
      const cam = camara(s, aspecto);
      const lado = 1000, vw = aspecto >= 1 ? lado : lado * aspecto, vh = aspecto >= 1 ? lado / aspecto : lado;
      const e = encuadre(capa, cam, lado, { x: (vw - lado) / 2, y: (vh - lado) / 2 });
      const tam = capa.lado / cam.vista * lado;
      return e.tx <= 0.5 && e.ty <= 0.5 && e.tx + tam >= vw - 0.5 && e.ty + tam >= vh - 0.5;
    };
    for (const aspecto of [1440 / 900, 1, 390 / 844]) {
      for (const s of [TRAMOS.llave[0], 0.14, TRAMOS.llave[1]]) expect(cubre(CAPAS.azul, s, aspecto)).toBe(true);
      for (const s of [TRAMOS.bano[0], 0.49, TRAMOS.bano[1]]) expect(cubre(CAPAS.bano, s, aspecto)).toBe(true);
    }
    // la cámara nunca está quieta dentro de una parada
    expect(camara(TRAMOS.llave[0]).vista).not.toBeCloseTo(camara(TRAMOS.llave[1]).vista, 4);
    expect(camara(TRAMOS.bano[0]).vista).not.toBeCloseTo(camara(TRAMOS.bano[1]).vista, 4);
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

  it('con movimiento reducido no hay pliegue', () => {
    const e = escena(0.7, camara(0.7), true);
    expect(e.anguloBano).toBe(0);
    expect(e.anguloCasa).toBe(0);
  });

  it('la casa sigue girando en la cima del bucle y vuelve a cero antes del baño', () => {
    expect(giroCasa(0.5)).toBeCloseTo(0);
    expect(giroCasa(0.51)).toBeGreaterThan(giroCasa(0.49));
    expect(Math.abs(giroCasa(0.25))).toBeCloseTo(0);
    expect(Math.abs(giroCasa(0.75))).toBeCloseTo(0);
  });

  it('el paralaje es nulo cuando la cámara está en su referencia y sin vaivén', () => {
    const cam = { x: 0.5, y: 0.5, vista: 1 };
    const par = paralaje({ x: 0, y: 0, lado: 1 }, { x: 0.5, y: 0.5 }, cam, 0, [0, 0]);
    expect(par.shift[0]).toBeCloseTo(0);
    expect(par.shift[1]).toBeCloseTo(0);
    expect(par.dolly).toBeCloseTo(0);
  });
});
