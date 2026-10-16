import * as THREE from 'three';

/**
 * Material del mueble con dos texturas y un corte vertical en el mundo:
 * a la izquierda del corte se ve `texturaB`, a la derecha `map`.
 *
 * - Cambio de acabado: el corte barre de izquierda a derecha y la nueva
 *   textura "se aplica" sobre el mueble con un filo de luz.
 * - Comparar: el corte sigue al deslizador y deja los dos acabados lado a lado.
 */
export interface UniformesAcabado {
  texturaB: { value: THREE.Texture | null };
  corte: { value: number };
  suavizado: { value: number };
  brillo: { value: number };
}

/** Ancho del mueble que recorre el barrido, con margen (metros, eje x). */
export const CORTE_INICIO = -0.42;
export const CORTE_FIN = 0.42;

export function crearMaterialAcabado(): { material: THREE.MeshStandardMaterial; uniformes: UniformesAcabado } {
  const uniformes: UniformesAcabado = {
    texturaB: { value: null },
    // Corte fuera del mueble: se ve solo `map`.
    corte: { value: CORTE_INICIO - 1 },
    suavizado: { value: 0.012 },
    brillo: { value: 0 },
  };
  const material = new THREE.MeshStandardMaterial({ name: 'Acabado', roughness: 0.58, metalness: 0 });
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniformes);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vPosMundo;')
      .replace(
        '#include <begin_vertex>',
        '#include <begin_vertex>\nvPosMundo = (modelMatrix * vec4(transformed, 1.0)).xyz;'
      );
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
varying vec3 vPosMundo;
uniform sampler2D texturaB;
uniform float corte;
uniform float suavizado;
uniform float brillo;
float mezclaCorte = 0.0;`
      )
      .replace(
        '#include <map_fragment>',
        `#ifdef USE_MAP
  mezclaCorte = 1.0 - smoothstep(corte - suavizado, corte + suavizado, vPosMundo.x);
  vec4 colorA = texture2D(map, vMapUv);
  vec4 colorB = texture2D(texturaB, vMapUv);
  diffuseColor *= mix(colorA, colorB, mezclaCorte);
#endif`
      )
      .replace(
        '#include <emissivemap_fragment>',
        `#include <emissivemap_fragment>
float filo = 1.0 - abs(mezclaCorte * 2.0 - 1.0);
totalEmissiveRadiance += vec3(1.0, 0.95, 0.86) * filo * brillo;`
      );
  };
  // Mismo programa para todas las instancias: no recompila al cambiar texturas.
  material.customProgramCacheKey = () => 'acabado-corte-v1';
  return { material, uniformes };
}

/** Prepara una textura de tablero: veta horizontal, escala real, sin costuras. */
export function prepararTextura(tex: THREE.Texture, anisotropia: number) {
  tex.colorSpace = THREE.SRGBColorSpace;
  // La textura cubre 70 cm de tablero; espejada para que no se note la union
  // en los paneles mas largos.
  tex.wrapS = THREE.MirroredRepeatWrapping;
  tex.wrapT = THREE.MirroredRepeatWrapping;
  tex.repeat.set(1 / 0.7, 1 / 0.7);
  tex.anisotropy = anisotropia;
  tex.needsUpdate = true;
}
