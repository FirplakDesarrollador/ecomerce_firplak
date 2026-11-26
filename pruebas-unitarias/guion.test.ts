import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { CAPAS_MUNDO, CAPITULOS, PARADAS, enBucle, fotograma, paradaActiva, ubicar } from '../components/landing-inception/guion';
import { CAPA_GRIFO, CAPA_LAV, LAV_EN_CASA, SALIDA_MUNDO, TRAMOS_LAV, camaraCasa } from '../components/landing-inception/capituloLavamanos';
import { aPantallaG, enCapa, enMundo, transformCapa, type CamaraVista, type CapaMundo } from '../components/landing-inception/proyeccion';

const ASPECTOS = [1440 / 900, 1, 390 / 844];
const escenario = (aspecto: number) => {
  const lado = 1000, vw = aspecto >= 1 ? lado : lado * aspecto, vh = aspecto >= 1 ? lado / aspecto : lado;
  return { esc: { lado, off: { x: (vw - lado) / 2, y: (vh - lado) / 2 } }, vw, vh };
};

/** La capa cubre toda la pantalla (sus cuatro esquinas de pantalla caen dentro de la imagen). */
function cubre(capa: CapaMundo, cam: CamaraVista, aspecto: number) {
  const { esc, vw, vh } = escenario(aspecto);
  const dentro = (x: number, y: number) => {
    // pantalla → mundo → imagen
    const v = { x: (x - esc.lado / 2 - esc.off.x) / esc.lado, y: (y - esc.lado / 2 - esc.off.y) / esc.lado };
    const c = Math.cos((-cam.giro * Math.PI) / 180), s = Math.sin((-cam.giro * Math.PI) / 180);
    const w = { x: cam.x + (c * v.x - s * v.y) * cam.vista, y: cam.y + (s * v.x + c * v.y) * cam.vista };
    const u = enCapa(capa, w);
    return u.x >= -0.001 && u.y >= -0.001 && u.x <= 1.001 && u.y <= 1.001;
  };
  return dentro(0, 0) && dentro(vw, 0) && dentro(0, vh) && dentro(vw, vh);
}

describe('Guion del gran recorrido', () => {
  it('las imágenes y la placa del lavamanos existen', () => {
    for (const f of ['lav-cerrado.webp', 'lav-abierto.webp', 'lav-grifo.webp', 'lav-lav-prof.webp', 'lav-grifo-prof.webp']) {
      expect(existsSync(resolve(`public/images/inception/${f}`))).toBe(true);
    }
    expect(existsSync(resolve('public/videos/inception/lav-cerrado.mp4'))).toBe(true);
  });

  it('los capítulos cubren el bucle sin huecos', () => {
    expect(CAPITULOS[0].desde).toBe(0);
    expect(CAPITULOS[CAPITULOS.length - 1].hasta).toBe(1);
    for (let i = 1; i < CAPITULOS.length; i++) expect(CAPITULOS[i].desde).toBe(CAPITULOS[i - 1].hasta);
    expect(ubicar(enBucle('lavamanos', 0.5))).toEqual({ capitulo: 'lavamanos', t: expect.closeTo(0.5, 6) });
  });

  it('la cámara no salta entre capítulos y el bucle cierra en el mismo cuadro', () => {
    for (const aspecto of ASPECTOS) {
      for (const c of CAPITULOS) {
        const antes = fotograma(c.desde - 1e-6, aspecto).cam, despues = fotograma(c.desde + 1e-6, aspecto).cam;
        expect(despues.x).toBeCloseTo(antes.x, 4);
        expect(despues.y).toBeCloseTo(antes.y, 4);
        expect(despues.vista / antes.vista).toBeCloseTo(1, 3);
        expect(despues.giro).toBeCloseTo(antes.giro, 2);
      }
    }
  });

  it('fuera del portal de la gota la cámara se mueve suave', () => {
    let previo = fotograma(0, 1440 / 900).cam;
    for (let p = 0.0005; p < 1; p += 0.0005) {
      const cam = fotograma(p, 1440 / 900).cam;
      const portal = ubicar(p).capitulo === 'lavamanos' && Math.abs(ubicar(p).t - TRAMOS_LAV.portal) < 0.01;
      if (!portal) {
        expect(Math.abs(Math.log(cam.vista / previo.vista))).toBeLessThan(0.12);
        expect(Math.abs(cam.giro - previo.giro)).toBeLessThan(2);
      }
      previo = cam;
    }
  });

  it('la grifería es un recorte dentro del mueble y el mueble está sobre el lavabo de la planta', () => {
    const u = enCapa(CAPA_LAV, { x: CAPA_GRIFO.cx, y: CAPA_GRIFO.cy });
    expect(u.x).toBeGreaterThan(0);
    expect(u.x).toBeLessThan(1);
    expect(u.y).toBeGreaterThan(0);
    expect(u.y).toBeLessThan(1);
    const lavabo = enCapa(CAPA_LAV, LAV_EN_CASA);
    expect(lavabo.x).toBeCloseTo(0.611, 3);
    expect(lavabo.y).toBeCloseTo(0.323, 3);
    const salida = enCapa(CAPA_GRIFO, SALIDA_MUNDO);
    expect(salida.x).toBeCloseTo(0.412, 3);
  });

  it('el mueble y la grifería cubren la pantalla en sus paradas, ya girados de frente', () => {
    for (const aspecto of ASPECTOS) {
      for (const t of [TRAMOS_LAV.mueble[0], 0.38, TRAMOS_LAV.mueble[1], 0.5, TRAMOS_LAV.puertas[1]]) {
        const f = fotograma(enBucle('lavamanos', t), aspecto);
        expect(f.cam.giro).toBeCloseTo(-90, 1);
        expect(cubre(CAPAS_MUNDO.lav, f.cam, aspecto)).toBe(true);
      }
      for (const t of [TRAMOS_LAV.grifo[0], 0.74, TRAMOS_LAV.grifo[1]]) {
        expect(cubre(CAPAS_MUNDO.grifo, fotograma(enBucle('lavamanos', t), aspecto).cam, aspecto)).toBe(true);
      }
    }
  });

  it('al llegar al portal la gota llena la pantalla y muestra la casa como la cámara que sigue', () => {
    for (const aspecto of ASPECTOS) {
      const f = fotograma(enBucle('lavamanos', TRAMOS_LAV.portal - 1e-6), aspecto);
      expect(f.gota).not.toBeNull();
      const { esc, vw, vh } = escenario(aspecto);
      const centro = aPantallaG(f.gota!.centro, f.cam, esc);
      const radio = (f.gota!.radio / f.cam.vista) * esc.lado;
      const cubrir = Math.hypot(Math.max(centro.x, vw - centro.x), Math.max(centro.y, vh - centro.y));
      expect(radio).toBeGreaterThan(cubrir);
      expect(f.gota!.mezcla).toBeCloseTo(1, 2);
      const despues = fotograma(enBucle('lavamanos', TRAMOS_LAV.portal + 1e-6), aspecto).cam;
      expect(despues).toEqual(camaraCasa(aspecto));
    }
  });

  it('la proyección CSS de una capa coincide con la del mundo', () => {
    // Intérprete mínimo de la cadena transform (2D): aplica las funciones de derecha a izquierda.
    const aplicar = (transform: string, punto: { x: number; y: number }) => {
      const ops = [...transform.matchAll(/(\w+)\(([^)]*)\)/g)].map((m) => ({ fn: m[1], v: m[2].split(',').map((s) => parseFloat(s)) }));
      let p = { ...punto };
      for (const { fn, v } of ops.reverse()) {
        if (fn === 'translate3d') p = { x: p.x + v[0], y: p.y + v[1] };
        else if (fn === 'scale3d') p = { x: p.x * v[0], y: p.y * v[1] };
        else if (fn === 'rotate') { const a = (v[0] * Math.PI) / 180; p = { x: Math.cos(a) * p.x - Math.sin(a) * p.y, y: Math.sin(a) * p.x + Math.cos(a) * p.y }; }
      }
      return p;
    };
    const cam = { x: 0.4, y: 0.3, vista: 0.2, giro: -90 };
    const esc = { lado: 1000, off: { x: 0, y: -100 } };
    const t = transformCapa(CAPA_LAV, cam, esc);
    for (const u of [{ x: 0.5, y: 0.5 }, { x: 0.25, y: 0.75 }, { x: 0.9, y: 0.1 }]) {
      const css = aplicar(t, { x: u.x * esc.lado, y: u.y * esc.lado });
      const mundo = aPantallaG(enMundo(CAPA_LAV, u), cam, esc);
      expect(css.x).toBeCloseTo(mundo.x, 3);
      expect(css.y).toBeCloseTo(mundo.y, 3);
    }
  });

  it('el indicador marca la parada que se ve, también de vuelta al azul', () => {
    PARADAS.forEach((par, i) => expect(paradaActiva(par.p)).toBe(i));
    const id = (p: number) => PARADAS[paradaActiva(p)].id;
    expect(id(enBucle('vuelta', 0.05))).toBe('casa');
    expect(id(enBucle('vuelta', 0.5))).toBe('hidromasaje');
    expect(id(enBucle('vuelta', 0.95))).toBe('azul');
    expect(id(enBucle('lavamanos', 0.99))).toBe('casa');
  });
});
