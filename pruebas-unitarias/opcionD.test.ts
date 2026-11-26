import fs from 'fs';
import path from 'path';
import { describe, it, expect } from 'vitest';
import {
  ACABADOS_D,
  ACABADOS_GRIFO_D,
  COLORES_LAVAMANOS_D,
  COMPRAS_D,
  GRIFOS_D,
  INICIAL_D,
  LAVAMANOS_D,
  MUEBLES_D,
  PRECIOS_SUGERIDOS_D,
  TOTAL_COMBINACIONES_D,
  rutaCuerpoD,
  rutaTapaD,
  type SeleccionD,
} from '../components/banos-muebles/opcion-d/catalogoOpcionD';
import {
  curvaApertura,
  curvaCierre,
  descripcionCompraD,
  enlaceCotizacionD,
  escribirSeleccionD,
  formatoPesos,
  grifoReal,
  leerSeleccionD,
  precioD,
  sorprenderD,
} from '../components/banos-muebles/opcion-d/opcionDLogica';
import { cotaCajon, frenteEn, movimientoEn, puertaEn, transformacionCajon, volumenCajon } from '../components/banos-muebles/opcion-d/animacionD';
import { CAJONES_D, LIENZO_D, PUERTA_D, SALIDA_GRIFO_D } from '../components/banos-muebles/opcion-d/rendersOpcionD';
import { aplicarColorLavamanos, aplicarMadera, prepararCuerpo, prepararTapa } from '../components/banos-muebles/opcion-d/pixelesD';
import { FONDO_POCETA_D } from '../components/banos-muebles/opcion-d/AguaD';

const publico = (url: string) => path.join(process.cwd(), 'public', url);

describe('Opción D · catálogo y archivos', () => {
  it('tiene los dos muebles, cuatro lavamanos, seis acabados y tres colores de gelcoat', () => {
    expect(MUEBLES_D.map((m) => m.id)).toEqual(['vitelli', 'tucano']);
    expect(LAVAMANOS_D).toHaveLength(4);
    expect(ACABADOS_D.map((a) => a.id)).toEqual(['blanco-nevado', 'tauari', 'mali', 'nola', 'tambo', 'candelaria']);
    expect(COLORES_LAVAMANOS_D.map((c) => c.id)).toEqual(['blanco', 'marfil', 'niebla']);
    expect(TOTAL_COMBINACIONES_D).toBe(2 * 6 * 4 * 3 * 2 * 4);
  });

  it('el blanco es el único unicolor (color plano); los demás son melamina con textura', () => {
    for (const a of ACABADOS_D) {
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
    for (const m of MUEBLES_D)
      for (const pieza of [...LAVAMANOS_D.map((l) => l.id), 'solo' as const])
        for (const e of ['cerrado', 'abierto'] as const) {
          const r = rutaCuerpoD(m.id, pieza, e);
          for (const f of [r.foto, r.capa, r.luz]) expect(fs.existsSync(publico(f)), f).toBe(true);
        }
    for (const l of LAVAMANOS_D)
      for (const g of GRIFOS_D) {
        const r = rutaTapaD(l.id, g.id);
        for (const f of [r.foto, r.capa]) expect(fs.existsSync(publico(f)), f).toBe(true);
      }
  });

  it('cada acabado de grifería tiene tono para el grifo que no es su base', () => {
    for (const a of ACABADOS_GRIFO_D) {
      if (a.id !== 'niquel') expect(a.tonoDesdeNiquel).not.toBeNull();
      if (a.id !== 'negro') expect(a.tonoDesdeNegro).not.toBeNull();
    }
    expect(grifoReal({ grifo: 'bajo', acabadoGrifo: 'niquel' })).toBe(true);
    expect(grifoReal({ grifo: 'alto', acabadoGrifo: 'negro' })).toBe(true);
    expect(grifoReal({ grifo: 'bajo', acabadoGrifo: 'oro' })).toBe(false);
  });

  it('cada lavamanos y grifo tiene salida de agua y fondo de poceta debajo', () => {
    for (const l of LAVAMANOS_D)
      for (const g of GRIFOS_D) {
        const [x, y] = SALIDA_GRIFO_D[l.id][g.id];
        expect(x).toBeGreaterThan(0);
        expect(x).toBeLessThan(LIENZO_D.ancho);
        expect(FONDO_POCETA_D[l.id]).toBeGreaterThan(y + 100);
      }
  });
});

describe('Opción D · precios sugeridos y compra', () => {
  it('cada pieza tiene su precio y el conjunto es la suma', () => {
    expect(precioD('mueble')).toBe(720_000);
    expect(precioD('lavamanos')).toBe(320_000);
    expect(precioD('griferia')).toBe(280_000);
    expect(precioD('conjunto')).toBe(PRECIOS_SUGERIDOS_D.mueble + PRECIOS_SUGERIDOS_D.lavamanos + PRECIOS_SUGERIDOS_D.griferia);
    expect(formatoPesos(1_320_000)).toMatch(/^\$1.320.000$/);
  });

  it('la descripción y el mensaje de WhatsApp dicen qué se compra y que el precio es sugerido', () => {
    const sel: SeleccionD = { ...INICIAL_D, compra: 'lavamanos', lavamanos: 'parma', color: 'niebla' };
    expect(descripcionCompraD(sel)).toBe('lavamanos Parma 63 × 48 cm en gelcoat niebla');
    const texto = decodeURIComponent(enlaceCotizacionD(sel, 'https://x/y?opcion=d').split('text=')[1]);
    expect(texto).toContain('precio sugerido $320.000');
    expect(texto).toContain('https://x/y?opcion=d');
    expect(descripcionCompraD({ ...INICIAL_D, compra: 'conjunto' })).toMatch(/^mueble Vitelli en Tauari, lavamanos Oslo .* y grifería monocontrol bajo en níquel cepillado$/);
    expect(COMPRAS_D.map((c) => c.id)).toEqual(['conjunto', 'mueble', 'lavamanos', 'griferia']);
  });
});

describe('Opción D · enlace compartido', () => {
  it('lee y escribe la combinación (tolera mayúsculas e inválidos)', () => {
    const sel: SeleccionD = { mueble: 'tucano', acabado: 'nola', lavamanos: 'siena', color: 'marfil', grifo: 'alto', acabadoGrifo: 'oro', compra: 'griferia' };
    const q = escribirSeleccionD('?opcion=d', sel);
    expect(q).toContain('opcion=d');
    expect(q).toContain('acabadogrifo=oro');
    expect(leerSeleccionD(q)).toEqual(sel);
    expect(leerSeleccionD('?mueble=TUCANO&acabado=xx&color=Niebla')).toEqual({ ...INICIAL_D, mueble: 'tucano', color: 'niebla' });
  });

  it('sorpréndeme cambia la combinación y conserva lo que se compra', () => {
    let k = 0;
    const azar = () => [0.99, 0.5, 0.9, 0.7, 0.2, 0.6][k++ % 6];
    const nueva = sorprenderD({ ...INICIAL_D, compra: 'mueble' }, azar);
    expect(nueva.compra).toBe('mueble');
    expect(nueva).not.toEqual({ ...INICIAL_D, compra: 'mueble' });
  });
});

describe('Opción D · cierre suave', () => {
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

describe('Opción D · geometría del movimiento', () => {
  it('el frente del cajón va de su sitio cerrado al del render abierto', () => {
    for (const m of MUEBLES_D)
      for (const c of CAJONES_D[m.id]) {
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
    expect(p0.fa[0]).toBeCloseTo(PUERTA_D.cerrada.fa[0], 6);
    expect(p0.exterior).toBe(true);
    const p1 = puertaEn(1);
    expect(p1.fa[0]).toBeCloseTo(PUERTA_D.abierta.fa[0], 6);
    expect(p1.fa[1]).toBeCloseTo(PUERTA_D.abierta.fa[1], 6);
    expect(p1.exterior).toBe(false);
  });

  it('la cota del cajón crece hasta 35 cm', () => {
    expect(cotaCajon('tucano', 1).centimetros).toBe(35);
    expect(cotaCajon('vitelli', 0.5).centimetros).toBe(18);
    const c = cotaCajon('vitelli', 1);
    expect(c.normal[1]).toBeGreaterThan(0);
  });
});

describe('Opción D · píxeles', () => {
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
