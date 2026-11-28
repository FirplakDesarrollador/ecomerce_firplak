import fs from 'fs';
import path from 'path';
import { describe, it, expect } from 'vitest';
import { ACABADOS_D, INICIAL_D, MEDIDAS_D, MUEBLES_D, LAVAMANOS_D, TOTAL_COMBINACIONES_D, acabadosDe, lavamanosDe, capaMuebleD, capaLavamanosD } from '../components/banos-muebles/opcion-d/catalogoOpcionD';
import { AMBIENTES_D, AMBIENTE_INICIAL_D, CAPAS_PILOTO_D, capasSeleccionD, combinacionVerificadaD, escribirAmbienteD, leerAmbienteD, normalizarAmbienteD } from '../components/banos-muebles/opcion-d/capasPilotoD';
import { leerSeleccionD, escribirSeleccionD, normalizarD, nombresD, sorprenderD, rotar, enlaceCotizacionD } from '../components/banos-muebles/opcion-d/opcionDLogica';

import catalogo from '../scripts/mix-match/catalogo-mix-match.json';

const publico = (url: string) => path.join(process.cwd(), 'public', url);

// Las expectativas salen del registro del catálogo: agregar una pieza, color o ambiente no exige
// reescribir números en las pruebas, pero el manifiesto publicado debe coincidir con el registro.
const REG_MUEBLES = catalogo.muebles.map(m => m.id);
const REG_LAVAMANOS = catalogo.lavamanos.map(l => l.id);
const REG_AMBIENTES = catalogo.ambientes.map(a => a.id);
const cruzan = (mueble: string) => REG_LAVAMANOS.filter(l => catalogo.cruces.some(c => c.mueble === mueble && c.lavamanos === l));

describe('Alejandro · ambiente persistente y productos intercambiables', () => {
  it('el manifiesto publicado corresponde exactamente al registro del catálogo', () => {
    expect(MUEBLES_D.map(m => m.id)).toEqual(REG_MUEBLES);
    expect(LAVAMANOS_D.map(l => l.id)).toEqual(REG_LAVAMANOS);
    expect(AMBIENTES_D.map(a => a.id)).toEqual(REG_AMBIENTES);
    expect(AMBIENTE_INICIAL_D).toBe(catalogo.ambiente_por_defecto);
    expect(CAPAS_PILOTO_D.verified_combinations).toEqual(catalogo.cruces);
    expect(TOTAL_COMBINACIONES_D).toBe(catalogo.cruces.length);
    for (const m of catalogo.muebles) {
      expect(MUEBLES_D.find(x => x.id === m.id)?.nombre).toBe(m.nombre);
      expect(lavamanosDe(m.id).map(l => l.id)).toEqual(cruzan(m.id));
      // Solo los acabados con capa; cada acabado del registro tiene muestra en la paleta.
      expect(acabadosDe(m.id).map(a => a.id).sort()).toEqual([...m.acabados].sort());
      for (const a of m.acabados) expect(ACABADOS_D.some(x => x.id === a)).toBe(true);
      expect(capaMuebleD(m.id, m.acabados[0], 'abierto')).toBeNull();
    }
    for (const l of catalogo.lavamanos) expect(LAVAMANOS_D.find(x => x.id === l.id)?.nombre).toBe(l.nombre);
  });

  it('el registro es coherente: cruces con fuente, piezas existentes y sin cruces prohibidos', () => {
    const claves = catalogo.cruces.map(c => `${c.mueble}|${c.lavamanos}|${c.acabado}|${c.estado}`);
    expect(new Set(claves).size).toBe(claves.length);
    for (const c of catalogo.cruces) {
      expect(REG_MUEBLES).toContain(c.mueble);
      expect(REG_LAVAMANOS).toContain(c.lavamanos);
      expect(c.fuente.trim().length).toBeGreaterThan(10);
      expect(catalogo.no_ofrecidos.some(n => n.mueble === c.mueble && n.lavamanos === c.lavamanos)).toBe(false);
    }
  });

  it('no interpreta la igualdad de medida como compatibilidad física', () => {
    // Los no ofrecidos del registro (p. ej., Vitelli + Quadratto, Tiziano + Bari) no se publican.
    for (const n of catalogo.no_ofrecidos) {
      for (const acabado of catalogo.muebles.find(m => m.id === n.mueble)!.acabados) {
        expect(combinacionVerificadaD(n.mueble, n.lavamanos, acabado)).toBe(false);
        expect(capasSeleccionD({ mueble: n.mueble, lavamanos: n.lavamanos, acabado })).toBeNull();
      }
    }
    for (const c of catalogo.cruces) expect(capasSeleccionD(c)).not.toBeNull();
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
    for (const ambiente of AMBIENTES_D) {
      expect(fs.existsSync(publico(ambiente.thumb))).toBe(true);
      for (const combo of CAPAS_PILOTO_D.verified_combinations) {
        const capas = capasSeleccionD(combo, ambiente.id)!;
        for (const src of Object.values(capas)) {
          expect(src).toMatch(/^\/images\/muebles\/capas-63x48\/[a-z0-9-]+\.[a-f0-9]{12}\.webp$/);
          expect(fs.existsSync(publico(src!))).toBe(true);
          srcs.add(src!);
        }
        expect(capaMuebleD(combo.mueble, combo.acabado, 'cerrado')?.src).toBe(capas.mueble);
        expect(capaLavamanosD(combo.lavamanos).src).toBe(capas.lavamanos);
      }
    }
    // Por ambiente: placa + una sombra por mueble; comunes: lavamanos y muebles con acabado de algún cruce.
    const muebles = new Set(catalogo.cruces.map(c => `${c.mueble}|${c.acabado}`)).size;
    const lavamanos = new Set(catalogo.cruces.map(c => c.lavamanos)).size;
    const conCruce = new Set(catalogo.cruces.map(c => c.mueble)).size;
    expect(srcs.size).toBe(REG_AMBIENTES.length * (1 + conCruce) + muebles + lavamanos);
  });

  it('cada cruce publicado declara su fuente de compatibilidad', () => {
    for (const c of CAPAS_PILOTO_D.verified_combinations) {
      expect(c.fuente).toMatch(/^(Matriz de compatibilidad BAÑOS \d{4}|firplak\.com, LAVAMANOS .+ consultado \d{4}-\d{2}-\d{2})/);
    }
  });

  it('cambiar lavamanos conserva exactamente las referencias del fondo, mueble y sombra', () => {
    for (const mueble of REG_MUEBLES) {
      const ids = lavamanosDe(mueble).map(l => l.id);
      const acabado = acabadosDe(mueble)[0].id;
      for (const x of ids) for (const y of ids) {
        if (x === y) continue;
        const a = capasSeleccionD({ mueble, lavamanos: x, acabado })!;
        const b = capasSeleccionD({ mueble, lavamanos: y, acabado })!;
        expect(a.ambiente).toBe(b.ambiente);
        expect(a.mueble).toBe(b.mueble);
        expect(a.sombra).toBe(b.sombra);
        expect(a.lavamanos).not.toBe(b.lavamanos);
      }
    }
  });

  it('cambiar mueble conserva exactamente las referencias del fondo y lavamanos', () => {
    const [m1, m2] = REG_MUEBLES;
    const compartidos = cruzan(m1).filter(l => cruzan(m2).includes(l));
    expect(compartidos.length).toBeGreaterThan(0);
    for (const lavamanos of compartidos) {
      const a = capasSeleccionD({ mueble: m1, lavamanos, acabado: acabadosDe(m1)[0].id })!;
      const b = capasSeleccionD({ mueble: m2, lavamanos, acabado: acabadosDe(m2)[0].id })!;
      expect(a.ambiente).toBe(b.ambiente);
      expect(a.lavamanos).toBe(b.lavamanos);
      expect(a.mueble).not.toBe(b.mueble);
      expect(a.sombra).not.toBe(b.sombra);
      expect(new Set(Object.values(a)).size).toBe(4);
    }
  });

  it('cambiar de ambiente conserva las piezas y cambiar de pieza conserva el ambiente', () => {
    const [amb1, amb2] = REG_AMBIENTES;
    for (const combo of CAPAS_PILOTO_D.verified_combinations) {
      const a = capasSeleccionD(combo, amb1)!;
      const b = capasSeleccionD(combo, amb2)!;
      expect(a.mueble).toBe(b.mueble);
      expect(a.lavamanos).toBe(b.lavamanos);
      expect(a.ambiente).not.toBe(b.ambiente);
      expect(a.sombra).not.toBe(b.sombra);
      expect(a.ambiente).toBe(AMBIENTES_D[0].src);
      expect(b.ambiente).toBe(AMBIENTES_D[1].src);
    }
  });

  it('el ambiente del enlace solo acepta ids publicados', () => {
    expect(leerAmbienteD('?ambiente=CALIDO')).toBe('calido');
    expect(leerAmbienteD('?ambiente=../../secret')).toBe('moderno');
    expect(leerAmbienteD('')).toBe('moderno');
    expect(normalizarAmbienteD('constructor')).toBe('moderno');
    expect(capasSeleccionD(INICIAL_D, '__proto__')!.ambiente).toBe(AMBIENTES_D[0].src);
    const url = escribirAmbienteD(escribirSeleccionD('?opcion=d', INICIAL_D), 'calido');
    expect(url).toContain('opcion=d');
    expect(leerAmbienteD(url)).toBe('calido');
    expect(leerSeleccionD(url)).toEqual(INICIAL_D);
  });

  it('mantiene un marco de cámara común dentro del ambiente, sin reajustes por selección', () => {
    const e = AMBIENTES_D[0], f = CAPAS_PILOTO_D.product_frame;
    for (const a of AMBIENTES_D) expect([a.width, a.height]).toEqual([e.width, e.height]);
    // Cámara de dos puntos de fuga: rotación X = 90° (nivelada) y la misma posición para ambiente y producto.
    expect(CAPAS_PILOTO_D.camera.camera_rotation[0]).toBeCloseTo(Math.PI / 2, 6);
    expect(CAPAS_PILOTO_D.camera.camera_rotation[1]).toBe(0);
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
    // Un cruce no ofrecido cae al primer lavamanos compatible de ese mueble.
    for (const n of catalogo.no_ofrecidos) {
      const acabado = acabadosDe(n.mueble)[0].id;
      expect(normalizarD({ mueble: n.mueble, acabado, lavamanos: n.lavamanos }))
        .toEqual({ mueble: n.mueble, acabado, lavamanos: lavamanosDe(n.mueble)[0].id });
    }
    expect(normalizarD({ mueble: 'tiziano', acabado: 'soder', lavamanos: 'quadratto' }))
      .toEqual({ mueble: 'tiziano', acabado: 'soder', lavamanos: 'quadratto' });
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
    const primero = MUEBLES_D[0].id, ultimo = MUEBLES_D[MUEBLES_D.length - 1].id;
    expect(rotar(MUEBLES_D, primero, -1)).toBe(ultimo);
    expect(rotar(MUEBLES_D, ultimo, 1)).toBe(primero);
  });

  it('describe las piezas activas y la grifería real sin enviar una cotización', () => {
    const sel = { lavamanos: 'genova', mueble: 'tiziano', acabado: 'soder' };
    expect(nombresD(sel).lavamanos.griferia).toBe('Negro');
    // Las capas publicadas llevan grifería negra, aunque el archivo anterior diga cromo.
    for (const c of catalogo.cruces) {
      expect(nombresD(c).lavamanos.griferia).toBe(catalogo.griferia.acabado);
      expect(CAPAS_PILOTO_D.basins[c.lavamanos].faucet).toBe(catalogo.griferia.acabado);
    }
    const texto = decodeURIComponent(enlaceCotizacionD(sel, 'https://x.test/mix-match').split('text=')[1]);
    for (const nombre of ['Génova', 'Tiziano', 'Soder', 'https://x.test/mix-match']) expect(texto).toContain(nombre);
  });

  it('ofrece únicamente la medida de las fuentes verificadas', () => {
    expect(MEDIDAS_D.filter(m => m.disponible).map(m => m.id)).toEqual(['63x48']);
  });
});
