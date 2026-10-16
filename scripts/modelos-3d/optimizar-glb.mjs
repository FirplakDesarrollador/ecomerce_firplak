// Optimiza un GLB para la web: soldado, simplificacion selectiva por nombre de
// malla, cuantizacion y compresion meshopt (el decodificador viene con three,
// sin CDN).
//
// Va en un proceso aparte a proposito: @gltf-transform/functions arrastra su
// propia version de sharp y Windows no admite dos libvips en el mismo proceso.
//
// Uso: node scripts/modelos-3d/optimizar-glb.mjs entrada.glb salida.glb '[{"patron":"_riel_","ratio":0.5}]'
import fs from 'fs';
import path from 'path';
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dedup, weld, prune, quantize, meshopt, reorder, simplifyPrimitive } from '@gltf-transform/functions';
import { MeshoptEncoder, MeshoptSimplifier } from 'meshoptimizer';

const [entrada, salida, reglasJson = '[]'] = process.argv.slice(2);
if (!entrada || !salida) {
  console.error('Uso: optimizar-glb.mjs entrada.glb salida.glb [reglas-json]');
  process.exit(1);
}
const reglas = JSON.parse(reglasJson).map((r) => ({ patron: new RegExp(r.patron), ratio: r.ratio }));

await MeshoptEncoder.ready;
await MeshoptSimplifier.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.encoder': MeshoptEncoder });
const doc = await io.read(entrada);
// keepUniqueNames: la escena reemplaza materiales por nombre; sin esto dedup
// fusiona dos materiales iguales con nombres distintos.
await doc.transform(dedup({ keepUniqueNames: true }), weld());

const tris = (p) => (p.getIndices()?.getCount() ?? p.getAttribute('POSITION').getCount()) / 3;
let antes = 0, despues = 0;
for (const nodo of doc.getRoot().listNodes()) {
  const malla = nodo.getMesh();
  if (!malla) continue;
  const regla = reglas.find((r) => r.patron.test(nodo.getName()));
  for (const prim of malla.listPrimitives()) {
    antes += tris(prim);
    if (regla) simplifyPrimitive(prim, { simplifier: MeshoptSimplifier, ratio: regla.ratio, error: 0.0004 });
    despues += tris(prim);
  }
}
// keepAttributes: las UV del acabado no tienen textura en el GLB (la pone la
// web al elegir acabado) y prune las borraria por no usarse.
await doc.transform(prune({ keepAttributes: true }), reorder({ encoder: MeshoptEncoder }), quantize(), meshopt({ encoder: MeshoptEncoder, level: 'medium' }));
fs.mkdirSync(path.dirname(salida), { recursive: true });
await io.write(salida, doc);
console.log(`${salida}: ${(fs.statSync(salida).size / 1024).toFixed(0)} KB | triangulos ${Math.round(antes)} -> ${Math.round(despues)}`);
