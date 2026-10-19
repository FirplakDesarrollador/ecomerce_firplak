import fs from 'fs';
import path from 'path';
import { describe, it, expect } from 'vitest';
import {
  ACABADOS_MIX,
  INICIAL_MIX,
  LAVAMANOS_MIX,
  MUEBLES_MIX,
  existeRender,
  rutasRender,
} from '../components/banos-muebles/opcion-b/catalogoMixMatch';
import {
  ajustarCompatible,
  enlaceCotizacionMix,
  escribirSeleccionMix,
  leerSeleccionMix,
  rotar,
} from '../components/banos-muebles/opcion-b/mixMatchLogica';
import { LADO_RENDER } from '../components/banos-muebles/opcion-b/rendersMixMatch';

const publico = (url: string) => path.join(process.cwd(), 'public', url);

describe('Opción B · Mix & Match', () => {
  it('todas las parejas mueble × lavamanos tienen render y capa en public/', () => {
    for (const m of MUEBLES_MIX) {
      for (const l of LAVAMANOS_MIX) {
        expect(existeRender(m.id, l.id), `${m.id}__${l.id}`).toBe(true);
        const r = rutasRender(m.id, l.id);
        expect(fs.existsSync(publico(r.base)), r.base).toBe(true);
        expect(fs.existsSync(publico(r.capa)), r.capa).toBe(true);
        // La costura (tapa del mueble) cae cerca de la mitad del render.
        expect(r.costura / LADO_RENDER).toBeGreaterThan(0.4);
        expect(r.costura / LADO_RENDER).toBeLessThan(0.6);
      }
    }
    for (const l of LAVAMANOS_MIX) expect(fs.existsSync(publico(l.miniatura)), l.miniatura).toBe(true);
    for (const a of ACABADOS_MIX) expect(fs.existsSync(publico(a.textura)), a.textura).toBe(true);
  });

  it('marca como armada por capas solo la combinación sin render propio', () => {
    const porCapas = MUEBLES_MIX.flatMap((m) => LAVAMANOS_MIX.map((l) => rutasRender(m.id, l.id)))
      .filter((r) => r.porCapas)
      .map((r) => r.id);
    expect(porCapas).toEqual(['vitelli__ovalado']);
  });

  it('lee un enlace compartido tolerando mayúsculas y valores inválidos', () => {
    expect(leerSeleccionMix('?mueble=VITELLI&lavamanos=Parma&acabado=mitte')).toEqual({ mueble: 'vitelli', lavamanos: 'parma', acabado: 'mitte' });
    expect(leerSeleccionMix('?mueble=x&lavamanos=y&acabado=z')).toEqual(INICIAL_MIX);
  });

  it('una pareja que existe no se ajusta', () => {
    const sel = { mueble: 'vitelli' as const, lavamanos: 'siena' as const, acabado: 'gracia' };
    expect(ajustarCompatible(sel, 'mueble')).toEqual(sel);
  });

  it('las flechas recorren la lista en círculo', () => {
    expect(rotar(LAVAMANOS_MIX, 'siena', 1)).toBe('ovalado');
    expect(rotar(LAVAMANOS_MIX, 'ovalado', -1)).toBe('siena');
    expect(rotar(MUEBLES_MIX, 'curva', 1)).toBe('vitelli');
  });

  it('escribe la combinación sin perder ?opcion=b', () => {
    const p = new URLSearchParams(escribirSeleccionMix('?opcion=b', { mueble: 'curva', lavamanos: 'genova', acabado: 'austral' }));
    expect(p.get('opcion')).toBe('b');
    expect(p.get('mueble')).toBe('curva');
    expect(p.get('lavamanos')).toBe('genova');
    expect(p.get('acabado')).toBe('austral');
  });

  it('el mensaje de cotización nombra mueble, acabado, lavamanos, grifería y enlace', () => {
    const url = 'https://firplak.com/categoria-producto/banos/combos-lavamanos-con-mueble?opcion=b';
    const texto = decodeURIComponent(enlaceCotizacionMix({ mueble: 'curva', lavamanos: 'ovalado', acabado: 'gracia' }, url).split('?text=')[1]);
    expect(texto).toContain('Gola Curva');
    expect(texto).toContain('acabado Gracia');
    expect(texto).toContain('lavamanos Ovalado sobre mesón');
    expect(texto).toContain('grifería monocontrol alta');
    expect(texto).toContain(url);
  });
});
