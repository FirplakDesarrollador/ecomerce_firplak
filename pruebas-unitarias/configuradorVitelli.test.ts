import fs from 'fs';
import path from 'path';
import { describe, it, expect } from 'vitest';
import { MUEBLES_BANO, VITELLI_63 } from '../components/banos-muebles/catalogoMuebles';
import {
  enlaceCotizacion,
  escribirSeleccion,
  leerSeleccion,
  WHATSAPP_VENTAS,
} from '../components/banos-muebles/opcion-a/configuradorLogica';
import { VITELLI_RIG } from '../components/banos-muebles/opcion-a/vitelliRig';

const publico = (url: string) => path.join(process.cwd(), 'public', url);

describe('Sesión lavamanos & muebles · Opción A (Vitelli 63)', () => {
  it('el primer mueble de la sesión es el Vitelli 63 con la Opción A', () => {
    expect(MUEBLES_BANO[0].id).toBe('vitelli-63');
    expect(MUEBLES_BANO[0].opcion).toBe('A');
  });

  it('ofrece los 5 acabados y los 4 lavamanos del modelo', () => {
    expect(VITELLI_63.acabados.map((a) => a.id)).toEqual(['blanco-madera', 'soder', 'austral', 'gracia', 'mitte']);
    expect(VITELLI_63.lavamanos.map((l) => l.id)).toEqual(['oslo', 'siena', 'genova', 'parma']);
  });

  it('todos los archivos que usa la experiencia existen en public/', () => {
    const archivos = [
      VITELLI_63.modelo,
      ...VITELLI_63.acabados.flatMap((a) => [a.textura, a.muestra]),
      ...VITELLI_63.lavamanos.map((l) => l.miniatura),
    ];
    for (const a of archivos) expect(fs.existsSync(publico(a)), a).toBe(true);
  });

  it('el rig del modelo trae grifo y sifón ajustados para cada lavamanos', () => {
    for (const l of VITELLI_63.lavamanos) {
      const r = VITELLI_RIG.lavamanos[l.id];
      expect(r.grifo).toHaveLength(3);
      expect(r.sifon).toHaveLength(3);
      // Ningun lavamanos queda mas alto que un mueble de bano razonable.
      expect(r.alto).toBeGreaterThan(0.45);
      expect(r.alto).toBeLessThan(0.65);
    }
    expect(VITELLI_RIG.puerta.residuoM).toBeLessThan(0.004);
  });

  it('el GLB conserva grupos animables, materiales por nombre y UV del acabado (bugs 011-012)', async () => {
    const { NodeIO } = await import('@gltf-transform/core');
    const { ALL_EXTENSIONS } = await import('@gltf-transform/extensions');
    const { MeshoptDecoder } = await import('meshoptimizer');
    await MeshoptDecoder.ready;
    const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });
    const doc = await io.read(publico(VITELLI_63.modelo));
    const nodos = doc.getRoot().listNodes().map((n) => n.getName());
    for (const g of ['Puerta', 'Bisagras', 'CajonSuperior', 'CajonInferior', 'Grifo', 'Sifon', 'Lavamanos_oslo', 'Lavamanos_siena', 'Lavamanos_genova', 'Lavamanos_parma']) {
      expect(nodos, g).toContain(g);
    }
    const materiales = new Set(doc.getRoot().listMaterials().map((m) => m.getName()));
    for (const m of ['Acabado', 'Marmol', 'GrifoNegro', 'Cromo', 'Aluminio', 'SifonNegro', 'TapaBlanca']) expect(materiales, m).toContain(m);
    const primAcabado = doc.getRoot().listMeshes().flatMap((m) => m.listPrimitives()).filter((p) => p.getMaterial()?.getName() === 'Acabado');
    expect(primAcabado.length).toBeGreaterThan(0);
    for (const p of primAcabado) expect(p.getAttribute('TEXCOORD_0')).not.toBeNull();
  });

  it('lee la combinación de un enlace compartido, tolerando mayúsculas', () => {
    expect(leerSeleccion(VITELLI_63, '?acabado=MITTE&lavamanos=Parma')).toEqual({ acabado: 'mitte', lavamanos: 'parma' });
  });

  it('cae a la combinación inicial con valores inválidos o vacíos', () => {
    expect(leerSeleccion(VITELLI_63, '?acabado=rosado&lavamanos=xx')).toEqual({ acabado: 'gracia', lavamanos: 'oslo' });
    expect(leerSeleccion(VITELLI_63, '')).toEqual({ acabado: 'gracia', lavamanos: 'oslo' });
  });

  it('escribe la combinación en la URL sin perder otros parámetros', () => {
    const q = escribirSeleccion('?utm_source=tienda&acabado=soder', { acabado: 'austral', lavamanos: 'siena' });
    const p = new URLSearchParams(q);
    expect(p.get('utm_source')).toBe('tienda');
    expect(p.get('acabado')).toBe('austral');
    expect(p.get('lavamanos')).toBe('siena');
  });

  it('el mensaje de cotización lleva mueble, acabado, lavamanos y el enlace', () => {
    const url = 'https://firplak.com/categoria-producto/banos/combos-lavamanos-con-mueble?acabado=austral&lavamanos=siena';
    const enlace = enlaceCotizacion(VITELLI_63, { acabado: 'austral', lavamanos: 'siena' }, url);
    expect(enlace.startsWith(`https://wa.me/${WHATSAPP_VENTAS}?text=`)).toBe(true);
    const texto = decodeURIComponent(enlace.split('?text=')[1]);
    expect(texto).toContain('Vitelli 63');
    expect(texto).toContain('acabado Austral');
    expect(texto).toContain('lavamanos Siena (63 × 48 cm)');
    expect(texto).toContain(url);
  });
});
