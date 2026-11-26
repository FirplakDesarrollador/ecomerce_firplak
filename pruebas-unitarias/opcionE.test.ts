import fs from 'fs';
import path from 'path';
import { describe, it, expect } from 'vitest';
import {
  ACABADOS_E,
  ACABADOS_GRIFO_E,
  COLORES_LAVAMANOS_E,
  COMPRAS_E,
  GRIFOS_E,
  INICIAL_E,
  LAVAMANOS_E,
  MUEBLES_E,
  PRECIOS_SUGERIDOS_E,
  TOTAL_COMBINACIONES_E,
  rutaCuerpoE,
  rutaTapaE,
  type SeleccionE,
} from '../components/banos-muebles/opcion-e/catalogoOpcionE';
import {
  curvaApertura,
  curvaCierre,
  descripcionCompraE,
  enlaceCotizacionE,
  escribirSeleccionE,
  formatoPesos,
  grifoReal,
  leerSeleccionE,
  precioE,
  sorprenderE,
} from '../components/banos-muebles/opcion-e/opcionELogica';
import { cotaCajon, frenteEn, movimientoEn, puertaEn, transformacionCajon, volumenCajon } from '../components/banos-muebles/opcion-e/animacionE';
import { CAJONES_E, LIENZO_E, PUERTA_E, SALIDA_GRIFO_E } from '../components/banos-muebles/opcion-e/rendersOpcionE';
import { aplicarColorLavamanos, aplicarMadera, prepararCuerpo, prepararTapa } from '../components/banos-muebles/opcion-e/pixelesE';
import { FONDO_POCETA_E } from '../components/banos-muebles/opcion-e/AguaE';

const publico = (url: string) => path.join(process.cwd(), 'public', url);

describe('Opción E · catálogo y archivos', () => {
  it('tiene los dos muebles, cuatro lavamanos, seis acabados y tres colores de gelcoat', () => {
    expect(MUEBLES_E.map((m) => m.id)).toEqual(['vitelli', 'tucano']);
    expect(LAVAMANOS_E).toHaveLength(4);
    expect(ACABADOS_E.map((a) => a.id)).toEqual(['blanco-nevado', 'tauari', 'mali', 'nola', 'tambo', 'candelaria']);
    expect(COLORES_LAVAMANOS_E.map((c) => c.id)).toEqual(['blanco', 'marfil', 'niebla']);
    expect(TOTAL_COMBINACIONES_E).toBe(2 * 6 * 4 * 3 * 2 * 4);
  });

  it('el blanco es el único unicolor (color plano); los demás son melamina con textura', () => {
    for (const a of ACABADOS_E) {
      if (a.id === 'blanco-nevado') {
        expect(a.tipo).toBe('Unicolor');
        expect(a.plano).toBeDefined();
        expect(a.textura).toBeUndefined();
      } else {
        expect(a.tipo).toBe('Melamina maderada');
        expect(a.textura && fs.existsSync(publico(a.textura))).toBe(true);
      }
    }
  });

  it('cada cuerpo y cada tapa tienen sus archivos', () => {
    for (const m of MUEBLES_E)
      for (const pieza of [...LAVAMANOS_E.map((l) => l.id), 'solo' as const])
        for (const e of ['cerrado', 'abierto'] as const) {
          const r = rutaCuerpoE(m.id, pieza, e);
          for (const f of [r.foto, r.capa, r.luz]) expect(fs.existsSync(publico(f)), f).toBe(true);
        }
    for (const l of LAVAMANOS_E)
      for (const g of GRIFOS_E) {
        const r = rutaTapaE(l.id, g.id);
        for (const f of [r.foto, r.capa]) expect(fs.existsSync(publico(f)), f).toBe(true);
      }
  });

  it('cada acabado de grifería tiene tono para el grifo que no es su base', () => {
    for (const a of ACABADOS_GRIFO_E) {
      if (a.id !== 'niquel') expect(a.tonoDesdeNiquel).not.toBeNull();
      if (a.id !== 'negro') expect(a.tonoDesdeNegro).not.toBeNull();
    }
    expect(grifoReal({ grifo: 'bajo', acabadoGrifo: 'niquel' })).toBe(true);
    expect(grifoReal({ grifo: 'alto', acabadoGrifo: 'negro' })).toBe(true);
    expect(grifoReal({ grifo: 'bajo', acabadoGrifo: 'oro' })).toBe(false);
  });

  it('cada lavamanos y grifo tiene salida de agua y fondo de poceta debajo', () => {
    for (const l of LAVAMANOS_E)
      for (const g of GRIFOS_E) {
        const [x, y] = SALIDA_GRIFO_E[l.id][g.id];
        expect(x).toBeGreaterThan(0);
        expect(x).toBeLessThan(LIENZO_E.ancho);
        expect(FONDO_POCETA_E[l.id]).toBeGreaterThan(y + 100);
      }
  });
});

describe('Opción E · precios sugeridos y compra', () => {
  it('cada pieza tiene su precio y el conjunto es la suma', () => {
    expect(precioE('mueble')).toBe(720_000);
    expect(precioE('lavamanos')).toBe(320_000);
    expect(precioE('griferia')).toBe(280_000);
    expect(precioE('conjunto')).toBe(PRECIOS_SUGERIDOS_E.mueble + PRECIOS_SUGERIDOS_E.lavamanos + PRECIOS_SUGERIDOS_E.griferia);
    expect(formatoPesos(1_320_000)).toMatch(/^\$1.320.000$/);
  });

  it('la descripción y el mensaje de WhatsApp dicen qué se compra y que el precio es sugerido', () => {
    const sel: SeleccionE = { ...INICIAL_E, compra: 'lavamanos', lavamanos: 'parma', color: 'niebla' };
    expect(descripcionCompraE(sel)).toBe('lavamanos Parma 63 × 48 cm en gelcoat niebla');
    const texto = decodeURIComponent(enlaceCotizacionE(sel, 'https://x/y?opcion=e').split('text=')[1]);
    expect(texto).toContain('precio sugerido $320.000');
    expect(texto).toContain('https://x/y?opcion=e');
    expect(descripcionCompraE({ ...INICIAL_E, compra: 'conjunto' })).toMatch(/^mueble Vitelli en Tauari, lavamanos Oslo .* y grifería monocontrol bajo en níquel cepillado$/);
    expect(COMPRAS_E.map((c) => c.id)).toEqual(['conjunto', 'mueble', 'lavamanos', 'griferia']);
  });
});

describe('Opción E · enlace compartido', () => {
  it('lee y escribe la combinación (tolera mayúsculas e inválidos)', () => {
    const sel: SeleccionE = { mueble: 'tucano', acabado: 'nola', lavamanos: 'siena', color: 'marfil', grifo: 'alto', acabadoGrifo: 'oro', compra: 'griferia' };
    const q = escribirSeleccionE('?opcion=e', sel);
    expect(q).toContain('opcion=e');
    expect(q).toContain('acabadogrifo=oro');
    expect(leerSeleccionE(q)).toEqual(sel);
    expect(leerSeleccionE('?mueble=TUCANO&acabado=xx&color=Niebla')).toEqual({ ...INICIAL_E, mueble: 'tucano', color: 'niebla' });
  });

  it('sorpréndeme cambia la combinación y conserva lo que se compra', () => {
    let k = 0;
    const azar = () => [0.99, 0.5, 0.9, 0.7, 0.2, 0.6][k++ % 6];
    const nueva = sorprenderE({ ...INICIAL_E, compra: 'mueble' }, azar);
    expect(nueva.compra).toBe('mueble');
    expect(nueva).not.toEqual({ ...INICIAL_E, compra: 'mueble' });
  });
});

describe('Opción E · cierre suave', () => {
  it('cerrar arranca rápido y frena al final; abrir llega suave', () => {
    expect(curvaCierre(0)).toBe(1);
    expect(curvaCierre(1)).toBe(0);
    expect(curvaCierre(0.5)).toBeLessThan(0.07);
    // Más recorrido en el primer décimo que en el último.
    expect(curvaCierre(0) - curvaCierre(0.1)).toBeGreaterThan(20 * (curvaCierre(0.9) - curvaCierre(1)));
    expect(curvaApertura(0)).toBe(0);
    expect(curvaApertura(1)).toBe(1);
  });

  it('con puerta: al abrir la puerta va primero; al cerrar los cajones entran primero', () => {
    const cerrado = { cajones: 0, puerta: 0 }, abierto = { cajones: 1, puerta: 1 };
    const a = movimientoEn(cerrado, true, 0.2, true);
    expect(a.puerta).toBeGreaterThan(0.5);
    expect(a.cajones).toBe(0);
    const c = movimientoEn(abierto, false, 0.25, true);
    expect(c.cajones).toBeLessThan(0.3);
    expect(c.puerta).toBe(1);
    expect(movimientoEn(abierto, false, 1, true)).toEqual({ cajones: 0, puerta: 0 });
    expect(movimientoEn(cerrado, true, 1, false)).toEqual({ cajones: 1, puerta: 0 });
  });

  it('invertir a mitad de camino parte de donde estaba (sin saltos)', () => {
    const medio = { cajones: 0.4, puerta: 0.8 };
    expect(movimientoEn(medio, false, 0, true)).toEqual(medio);
    expect(movimientoEn(medio, true, 0, true)).toEqual(medio);
  });
});

describe('Opción E · geometría del movimiento', () => {
  it('el frente del cajón va de su sitio cerrado al del render abierto', () => {
    for (const m of MUEBLES_E)
      for (const c of CAJONES_E[m.id]) {
        expect(frenteEn(c, 0)).toEqual(c.frente);
        const [k, dx, dy] = transformacionCajon(c, 1);
        expect(k).toBeCloseTo(1, 6);
        expect(dx).toBeCloseTo(0, 6);
        expect(dy).toBeCloseTo(0, 6);
        // En e = 0 la transformación lleva el frente abierto al cerrado.
        const [k0, dx0, dy0] = transformacionCajon(c, 0);
        const abierto = frenteEn(c, 1)[0];
        expect(k0 * abierto[0] + dx0).toBeCloseTo(c.frente[0][0], 4);
        expect(k0 * abierto[1] + dy0).toBeCloseTo(c.frente[0][1], 4);
        expect(volumenCajon(c, 0.5).length).toBeGreaterThanOrEqual(4);
      }
  });

  it('la puerta parte cerrada, pasa de canto y llega a la posición del render abierto', () => {
    const p0 = puertaEn(0);
    expect(p0.fa[0]).toBeCloseTo(PUERTA_E.cerrada.fa[0], 6);
    expect(p0.exterior).toBe(true);
    const p1 = puertaEn(1);
    expect(p1.fa[0]).toBeCloseTo(PUERTA_E.abierta.fa[0], 6);
    expect(p1.fa[1]).toBeCloseTo(PUERTA_E.abierta.fa[1], 6);
    expect(p1.exterior).toBe(false);
  });

  it('la cota del cajón crece hasta 35 cm', () => {
    expect(cotaCajon('tucano', 1).centimetros).toBe(35);
    expect(cotaCajon('vitelli', 0.5).centimetros).toBe(18);
    const c = cotaCajon('vitelli', 1);
    expect(c.normal[1]).toBeGreaterThan(0);
  });
});

describe('Opción E · píxeles', () => {
  const imagen = (w: number, h: number, f: (i: number) => [number, number, number, number]) => {
    const data = new Uint8ClampedArray(w * h * 4);
    for (let i = 0; i < w * h; i++) data.set(f(i), i * 4);
    return { data, width: w, height: h };
  };

  it('el unicolor es plano: misma luz, mismo color en todo el frente', () => {
    const capa = imagen(4, 1, () => [255, 0, 0, 255]);
    const luz = imagen(4, 1, () => [128, 128, 128, 255]);
    const o = new Uint8ClampedArray(16);
    aplicarMadera(o, prepararCuerpo(capa, luz), { plano: [244, 244, 241], cmTextura: 60 }, { esquinaX: 2, pendienteFrente: 0.2, pendienteCostado: -0.3, pxPorCm: 12 });
    expect(Array.from(o.slice(0, 3))).toEqual([244, 244, 241]);
    expect(Array.from(o.slice(12, 15))).toEqual([244, 244, 241]);
  });

  it('el gelcoat se tiñe con la luz del render y conserva los brillos', () => {
    const foto = imagen(2, 1, (i) => (i === 0 ? [238, 238, 238, 255] : [255, 255, 255, 255]));
    const capa = imagen(2, 1, () => [255, 0, 0, 255]);
    const o = new Uint8ClampedArray(foto.data);
    aplicarColorLavamanos(o, prepararTapa(foto, capa), [98, 96, 97]);
    expect(o[0]).toBeCloseTo(98, -1);
    expect(o[4]).toBeGreaterThan(200);
  });
});
