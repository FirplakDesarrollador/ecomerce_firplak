import fs from 'fs';
import path from 'path';
import { describe, it, expect } from 'vitest';
import {
  ACABADOS_C,
  GRIFERIAS_C,
  IMAGEN_POR_DENTRO_C,
  INICIAL_C,
  LAVAMANOS_C,
  MUEBLES_C,
  TOTAL_COMBINACIONES_C,
  existeVistaC,
  rutaVistaC,
  type SeleccionC,
} from '../components/banos-muebles/opcion-c/catalogoOpcionC';
import {
  aPantalla,
  cajaVista,
  encuadreVista,
  enlaceCotizacionC,
  escribirSeleccionC,
  leerSeleccionC,
  sorprender,
  tipoCambioC,
} from '../components/banos-muebles/opcion-c/opcionCLogica';
import { aplicarAcabado, aplicarGrifo, prepararCapa, tonoMetal } from '../components/banos-muebles/opcion-c/pixelesC';

const publico = (url: string) => path.join(process.cwd(), 'public', url);
const disponibles = MUEBLES_C.filter((m) => m.disponible);

describe('Opción C · estudio Mix & Match', () => {
  it('cada lavamanos tiene su vista cerrada y abierta, y el mueble su vista sola, con render y capa en public/', () => {
    for (const m of disponibles) {
      for (const pieza of [...LAVAMANOS_C.map((l) => l.id), 'solo' as const]) {
        for (const estado of ['cerrado', 'abierto'] as const) {
          expect(existeVistaC(m.id, pieza, estado), `${m.id}__${pieza}__${estado}`).toBe(true);
          const r = rutaVistaC(m.id, pieza, estado);
          expect(fs.existsSync(publico(r.base)), r.base).toBe(true);
          expect(fs.existsSync(publico(r.capa)), r.capa).toBe(true);
          // La tapa del mueble cae por encima de la mitad del render (camara frontal del estudio).
          expect(r.costura).toBeGreaterThan(0.35);
          expect(r.costura).toBeLessThan(0.45);
          if (pieza === 'solo') expect(r.grifo).toBeNull();
          else {
            // El grifo vive en la pieza del lavamanos, sobre la tapa.
            expect(r.grifo).not.toBeNull();
            expect(r.grifo![3]).toBeLessThanOrEqual(r.costura);
          }
        }
      }
    }
    for (const l of LAVAMANOS_C) expect(fs.existsSync(publico(l.miniatura)), l.miniatura).toBe(true);
    for (const a of ACABADOS_C) expect(fs.existsSync(publico(a.textura)), a.textura).toBe(true);
    for (const m of MUEBLES_C.filter((x) => x.referencia)) {
      expect(fs.existsSync(publico(m.referencia!.imagen))).toBe(true);
      expect(fs.existsSync(publico(m.referencia!.miniatura))).toBe(true);
    }
    expect(fs.existsSync(publico(IMAGEN_POR_DENTRO_C))).toBe(true);
  });

  it('abierto y cerrado comparten lavamanos: misma costura y mismo grifo', () => {
    for (const l of LAVAMANOS_C) {
      const c = rutaVistaC('vitelli', l.id, 'cerrado'), a = rutaVistaC('vitelli', l.id, 'abierto');
      expect(a.costura).toBe(c.costura);
      expect(a.grifo).toEqual(c.grifo);
    }
  });

  it('cuenta las combinaciones que hoy se pueden ver', () => {
    expect(TOTAL_COMBINACIONES_C).toBe(LAVAMANOS_C.length * disponibles.length * ACABADOS_C.length * GRIFERIAS_C.length);
    expect(TOTAL_COMBINACIONES_C).toBe(80);
  });

  it('lee un enlace compartido tolerando mayúsculas, valores inválidos y muebles que aún no están', () => {
    expect(leerSeleccionC('?lavamanos=PARMA&mueble=Vitelli&acabado=mitte&griferia=Oro')).toEqual({
      lavamanos: 'parma',
      mueble: 'vitelli',
      acabado: 'mitte',
      griferia: 'oro',
    });
    expect(leerSeleccionC('?lavamanos=x&mueble=y&acabado=z&griferia=w')).toEqual(INICIAL_C);
    expect(leerSeleccionC('?mueble=curva').mueble).toBe('vitelli');
  });

  it('escribe la combinación sin perder ?opcion=c', () => {
    const p = new URLSearchParams(escribirSeleccionC('?opcion=c', { lavamanos: 'siena', mueble: 'vitelli', acabado: 'austral', griferia: 'cromo' }));
    expect(p.get('opcion')).toBe('c');
    expect(p.get('lavamanos')).toBe('siena');
    expect(p.get('acabado')).toBe('austral');
    expect(p.get('griferia')).toBe('cromo');
  });

  it('"Sorpréndeme" cambia lavamanos, acabado y grifería, y deja el mueble', () => {
    for (const azar of [0, 0.5, 0.999]) {
      const s = sorprender(INICIAL_C, () => azar);
      expect(s.mueble).toBe(INICIAL_C.mueble);
      expect(s.lavamanos).not.toBe(INICIAL_C.lavamanos);
      expect(s.acabado).not.toBe(INICIAL_C.acabado);
      expect(s.griferia).not.toBe(INICIAL_C.griferia);
    }
  });

  it('el mensaje de cotización nombra lavamanos, mueble, acabado, grifería y enlace', () => {
    const url = 'https://firplak.com/categoria-producto/banos/combos-lavamanos-con-mueble?opcion=c';
    const sel: SeleccionC = { lavamanos: 'genova', mueble: 'vitelli', acabado: 'gracia', griferia: 'niquel' };
    const texto = decodeURIComponent(enlaceCotizacionC(sel, url).split('?text=')[1]);
    expect(texto).toContain('lavamanos Génova 63 × 48 cm');
    expect(texto).toContain('mueble Vitelli 63 en acabado Gracia');
    expect(texto).toContain('grifería en níquel cepillado');
    expect(texto).toContain(url);
  });

  it('clasifica qué cambió para animar solo esa pieza', () => {
    const a = { sel: INICIAL_C, estado: 'cerrado' as const };
    expect(tipoCambioC(null, a)).toBe('inicio');
    expect(tipoCambioC(a, a)).toBe('ninguno');
    expect(tipoCambioC(a, { ...a, sel: { ...INICIAL_C, lavamanos: 'siena' } })).toBe('lavamanos');
    expect(tipoCambioC(a, { ...a, sel: { ...INICIAL_C, acabado: 'mitte' } })).toBe('acabado');
    expect(tipoCambioC(a, { ...a, sel: { ...INICIAL_C, griferia: 'oro' } })).toBe('griferia');
    expect(tipoCambioC(a, { ...a, estado: 'abierto' })).toBe('estado');
    expect(tipoCambioC(a, { estado: 'abierto', sel: { ...INICIAL_C, griferia: 'oro' } })).toBe('varios');
  });

  it('encuadra cada vista centrada, sin pasar del alto útil del escenario', () => {
    for (const vista of ['conjunto', 'lavamanos', 'mueble'] as const) {
      for (const alto of [380, 640, 900]) {
        const e = encuadreVista(vista, INICIAL_C, alto);
        const [x0, y0, x1, y1] = cajaVista(vista, INICIAL_C);
        // El centro de la caja cae en el centro de la pantalla.
        expect(aPantalla((x0 + x1) / 2, e, 'x')).toBeCloseTo(50, 5);
        expect(aPantalla((y0 + y1) / 2, e, 'y')).toBeCloseTo(50, 5);
        // Arriba y abajo quedan libres las barras del escenario (64 px cada una).
        const altoPx = e.s * (y1 - y0) * 0.86 * alto;
        expect(altoPx).toBeLessThanOrEqual(alto - 128 + 1);
        expect(e.s * (x1 - x0)).toBeLessThanOrEqual(0.92 + 1e-9);
      }
    }
    // Ver solo el lavamanos lo acerca.
    expect(encuadreVista('lavamanos', INICIAL_C, 640).s).toBeGreaterThan(encuadreVista('conjunto', INICIAL_C, 640).s);
  });
});

describe('Opción C · píxeles', () => {
  // Capa de 2x2: [mueble, grifo, nada, mueble a medias]
  const capa = prepararCapa({
    width: 2,
    height: 2,
    data: new Uint8ClampedArray([255, 128, 0, 255, 0, 40, 255, 255, 0, 0, 0, 255, 128, 64, 0, 255]),
  });

  it('separa los píxeles del mueble y del grifo', () => {
    expect(Array.from(capa.mueble)).toEqual([0, 3]);
    expect(Array.from(capa.grifo)).toEqual([1]);
    expect(capa.grifoY0).toBe(0);
  });

  it('el acabado multiplica la textura por la luz solo dentro de la máscara', () => {
    const o = new Uint8ClampedArray([10, 10, 10, 255, 20, 20, 20, 255, 30, 30, 30, 255, 40, 40, 40, 255]);
    const tex = { width: 1, height: 1, data: new Uint8ClampedArray([200, 100, 50, 255]) };
    aplicarAcabado(o, capa, tex, { x0: 0, ancho: 1 });
    expect(Array.from(o.slice(0, 3))).toEqual([200, 100, 50]); // luz 128 = 1.0
    expect(Array.from(o.slice(4, 12))).toEqual([20, 20, 20, 255, 30, 30, 30, 255]); // grifo y fondo intactos
    // Mascara 0.5 y luz 0.5: mitad del original, mitad de la textura a media luz.
    expect(o[12]).toBe(Math.round(40 * 0.498 + 100 * 0.502));
  });

  it('el tono de metal sube con la luz del render y satura hacia el brillo', () => {
    const cromo = GRIFERIAS_C.find((g) => g.id === 'cromo')!.tono!;
    const oscuro = tonoMetal(cromo, 0.02, 1), claro = tonoMetal(cromo, 0.3, 1), saturado = tonoMetal(cromo, 1, 0);
    expect(claro[0]).toBeGreaterThan(oscuro[0]);
    expect(saturado.map(Math.round)).toEqual([255, 255, 255]);
  });

  it('el grifo se recolorea solo donde está su máscara', () => {
    const o = new Uint8ClampedArray([10, 10, 10, 255, 5, 5, 5, 255, 30, 30, 30, 255, 40, 40, 40, 255]);
    aplicarGrifo(o, capa, GRIFERIAS_C.find((g) => g.id === 'oro')!.tono!);
    expect(o[4]).toBeGreaterThan(5);
    expect(o[4]).toBeGreaterThan(o[6]); // dorado: mas rojo que azul
    expect(Array.from(o.slice(0, 4))).toEqual([10, 10, 10, 255]);
  });
});
