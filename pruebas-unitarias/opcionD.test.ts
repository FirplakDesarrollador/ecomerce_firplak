import fs from 'fs';
import path from 'path';
import { describe, it, expect } from 'vitest';
import { INICIAL_D, MEDIDAS_D, MUEBLES_D, LAVAMANOS_D, TOTAL_COMBINACIONES_D, acabadosDe, lavamanosDe, capaMuebleD, capaLavamanosD } from '../components/banos-muebles/opcion-d/catalogoOpcionD';
import { CAPAS_PILOTO_D, capasSeleccionD, combinacionVerificadaD } from '../components/banos-muebles/opcion-d/capasPilotoD';
import { leerSeleccionD, escribirSeleccionD, normalizarD, nombresD, sorprenderD, rotar, enlaceCotizacionD } from '../components/banos-muebles/opcion-d/opcionDLogica';

const publico = (url: string) => path.join(process.cwd(), 'public', url);

describe('Alejandro · ambiente persistente y productos intercambiables', () => {
  it('limita el piloto a las diez parejas verificadas de 63 × 48', () => {
    expect(MUEBLES_D.map(m => m.id)).toEqual(['vitelli', 'tiziano']);
    expect(LAVAMANOS_D.map(l => l.id)).toEqual(['oslo', 'genova', 'bari', 'siena', 'trentino', 'quadratto']);
    expect(TOTAL_COMBINACIONES_D).toBe(10);
    expect(CAPAS_PILOTO_D.verified_combinations).toHaveLength(10);
    expect(lavamanosDe('vitelli').map(l => l.id)).toEqual(['oslo', 'genova', 'bari', 'siena', 'trentino']);
    expect(lavamanosDe('tiziano').map(l => l.id)).toEqual(['oslo', 'genova', 'siena', 'trentino', 'quadratto']);
    for (const m of MUEBLES_D) {
      expect(acabadosDe(m.id).map(a => a.id)).toEqual(['soder']);
      expect(capaMuebleD(m.id, 'soder', 'abierto')).toBeNull();
      expect(capaMuebleD(m.id, 'mitte', 'cerrado')).toBeNull();
    }
  });

  it('no interpreta la igualdad de medida como compatibilidad física', () => {
    // Tiziano + Quadratto lo aprobó el usuario; Vitelli + Quadratto y Tiziano + Bari no se ofrecen.
    expect(combinacionVerificadaD('tiziano', 'quadratto', 'soder')).toBe(true);
    expect(capasSeleccionD({ mueble: 'tiziano', lavamanos: 'quadratto', acabado: 'soder' })).not.toBeNull();
    expect(combinacionVerificadaD('vitelli', 'quadratto', 'soder')).toBe(false);
    expect(combinacionVerificadaD('tiziano', 'bari', 'soder')).toBe(false);
    expect(capasSeleccionD({ mueble: 'vitelli', lavamanos: 'quadratto', acabado: 'soder' })).toBeNull();
    expect(capasSeleccionD({ mueble: 'tiziano', lavamanos: 'bari', acabado: 'soder' })).toBeNull();
    for (const lavamanos of ['parma', 'quadratto-marfil', 'oasis', 'doha'])
      for (const mueble of ['vitelli', 'tiziano']) expect(combinacionVerificadaD(mueble, lavamanos, 'soder')).toBe(false);
    expect(combinacionVerificadaD('vitelli', 'parma', 'soder')).toBe(false);
    expect(combinacionVerificadaD('greco', 'oslo', 'soder')).toBe(false);
    expect(combinacionVerificadaD('tiziano', 'oslo', 'soder', 'abierto')).toBe(false);
    expect(lavamanosDe('greco')).toEqual([]);
    expect(capasSeleccionD({ ...INICIAL_D, lavamanos: 'quadratto' })).toBeNull();
  });

  it('cada capa es un archivo local existente con huella de contenido', () => {
    const srcs = new Set<string>();
    for (const combo of CAPAS_PILOTO_D.verified_combinations) {
      const capas = capasSeleccionD(combo)!;
      for (const src of Object.values(capas)) {
        expect(src).toMatch(/^\/images\/muebles\/capas-63x48\/[a-z0-9-]+\.[a-f0-9]{12}\.webp$/);
        expect(fs.existsSync(publico(src!))).toBe(true);
        srcs.add(src!);
      }
      expect(capaMuebleD(combo.mueble, combo.acabado, 'cerrado')?.src).toBe(capas.mueble);
      expect(capaLavamanosD(combo.lavamanos).src).toBe(capas.lavamanos);
    }
    expect(srcs.size).toBe(11); // Un fondo, seis lavamanos, dos muebles y dos sombras.
  });

  it('cada cruce publicado declara su fuente de compatibilidad', () => {
    for (const c of CAPAS_PILOTO_D.verified_combinations) {
      const original = ['oslo', 'genova'].includes(c.lavamanos);
      expect(c.fuente).toBe(original
        ? 'Matriz de compatibilidad BAÑOS 2025, páginas 1 y 3'
        : `firplak.com, LAVAMANOS ${c.lavamanos.toUpperCase()} + MUEBLE ${c.mueble.toUpperCase()} 63X48, consultado ${
          c.lavamanos === 'quadratto' ? '2026-11-24' : '2026-11-23'}`);
    }
  });

  it('cambiar lavamanos conserva exactamente las referencias del fondo, mueble y sombra', () => {
    for (const mueble of ['vitelli', 'tiziano']) {
      const ids = lavamanosDe(mueble).map(l => l.id);
      for (const x of ids) for (const y of ids) {
        if (x === y) continue;
        const a = capasSeleccionD({ mueble, lavamanos: x, acabado: 'soder' })!;
        const b = capasSeleccionD({ mueble, lavamanos: y, acabado: 'soder' })!;
        expect(a.ambiente).toBe(b.ambiente);
        expect(a.mueble).toBe(b.mueble);
        expect(a.sombra).toBe(b.sombra);
        expect(a.lavamanos).not.toBe(b.lavamanos);
      }
    }
  });

  it('cambiar mueble conserva exactamente las referencias del fondo y lavamanos', () => {
    for (const lavamanos of ['oslo', 'genova', 'siena', 'trentino']) {
      const a = capasSeleccionD({ mueble: 'vitelli', lavamanos, acabado: 'soder' })!;
      const b = capasSeleccionD({ mueble: 'tiziano', lavamanos, acabado: 'soder' })!;
      expect(a.ambiente).toBe(b.ambiente);
      expect(a.lavamanos).toBe(b.lavamanos);
      expect(a.mueble).not.toBe(b.mueble);
      expect(a.sombra).not.toBe(b.sombra);
      expect(new Set(Object.values(a)).size).toBe(4);
    }
  });

  it('mantiene un marco de cámara común dentro del ambiente, sin reajustes por selección', () => {
    const e = CAPAS_PILOTO_D.environment, f = CAPAS_PILOTO_D.product_frame;
    expect(f.width).toBe(f.height);
    expect(f.resolution).toBe(1600);
    expect(f.x).toBeGreaterThanOrEqual(0);
    expect(f.y).toBeGreaterThanOrEqual(0);
    expect(f.x + f.width).toBeLessThan(e.width);
    expect(f.y + f.height).toBeLessThan(e.height);
    // La sombra debe cubrir el ambiente completo para no dejar un borde rectangular.
    expect(CAPAS_PILOTO_D.shadow_frame).toEqual({ x: 0, y: 0, width: e.width, height: e.height });
  });

  it('normaliza enlaces inválidos, productos del archivo y estados no disponibles al piloto', () => {
    expect(normalizarD({ mueble: 'vitelli', acabado: 'mitte', lavamanos: 'parma' })).toEqual(INICIAL_D);
    expect(normalizarD({ mueble: 'tiziano', acabado: 'soder', lavamanos: 'bari' }))
      .toEqual({ mueble: 'tiziano', acabado: 'soder', lavamanos: 'oslo' });
    expect(normalizarD({ mueble: 'tiziano', acabado: 'soder', lavamanos: 'quadratto' }))
      .toEqual({ mueble: 'tiziano', acabado: 'soder', lavamanos: 'quadratto' });
    expect(normalizarD({ mueble: 'vitelli', acabado: 'soder', lavamanos: 'quadratto' }))
      .toEqual({ mueble: 'vitelli', acabado: 'soder', lavamanos: 'oslo' });
    expect(normalizarD({ mueble: 'vitelli', acabado: 'soder', lavamanos: 'bari' }))
      .toEqual({ mueble: 'vitelli', acabado: 'soder', lavamanos: 'bari' });
    expect(normalizarD({ mueble: 'greco', acabado: 'soder', lavamanos: 'oslo' })).toEqual(INICIAL_D);
    expect(leerSeleccionD('?mueble=../../secrets&lavamanos=constructor&acabado=__proto__')).toEqual(INICIAL_D);
    expect(capasSeleccionD({ ...INICIAL_D, mueble: '../secret' })).toBeNull();
    expect(normalizarD({ mueble: 'tiziano', acabado: 'mitte', lavamanos: 'genova' }))
      .toEqual({ mueble: 'tiziano', acabado: 'soder', lavamanos: 'genova' });
  });

  it('conserva la selección compartida y los parámetros ajenos', () => {
    const sel = { lavamanos: 'genova', mueble: 'tiziano', acabado: 'soder' };
    expect(leerSeleccionD(escribirSeleccionD('?opcion=d', sel))).toEqual(sel);
    expect(leerSeleccionD('?lavamanos=GENOVA&mueble=Tiziano&acabado=SODER')).toEqual(sel);
    expect(escribirSeleccionD('?opcion=d', sel)).toContain('opcion=d');
    expect(leerSeleccionD('')).toEqual(INICIAL_D);
  });

  it('el azar ofrece otra pareja verificada y la rotación vuelve al comienzo', () => {
    for (const combo of CAPAS_PILOTO_D.verified_combinations) {
      for (const azar of [0, .5, .99]) {
        const nueva = sorprenderD(combo, () => azar);
        expect(nueva.mueble).not.toBe(combo.mueble);
        expect(nueva.lavamanos).not.toBe(combo.lavamanos);
        expect(combinacionVerificadaD(nueva.mueble, nueva.lavamanos, nueva.acabado)).toBe(true);
      }
    }
    expect(rotar(MUEBLES_D, 'vitelli', -1)).toBe('tiziano');
    expect(rotar(MUEBLES_D, 'tiziano', 1)).toBe('vitelli');
  });

  it('describe las piezas activas y la grifería real sin enviar una cotización', () => {
    const sel = { lavamanos: 'genova', mueble: 'tiziano', acabado: 'soder' };
    expect(nombresD(sel).lavamanos.griferia).toBe('Negro');
    // Las capas publicadas llevan grifería negra, aunque el archivo anterior diga cromo.
    for (const lavamanos of ['oslo', 'genova', 'bari', 'siena', 'trentino']) {
      expect(nombresD({ ...sel, mueble: 'vitelli', lavamanos }).lavamanos.griferia).toBe('Negro');
      expect(CAPAS_PILOTO_D.basins[lavamanos as keyof typeof CAPAS_PILOTO_D.basins].faucet).toBe('Negro');
    }
    const texto = decodeURIComponent(enlaceCotizacionD(sel, 'https://x.test/mix-match').split('text=')[1]);
    for (const nombre of ['Génova', 'Tiziano', 'Soder', 'https://x.test/mix-match']) expect(texto).toContain(nombre);
  });

  it('ofrece únicamente la medida de las fuentes verificadas', () => {
    expect(MEDIDAS_D.filter(m => m.disponible).map(m => m.id)).toEqual(['63x48']);
  });
});
