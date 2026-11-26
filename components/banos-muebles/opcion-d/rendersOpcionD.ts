// Generado por scripts/mix-match/preparar-opcion-d.mjs: no editar a mano.
// Coordenadas en píxeles de las imágenes de la Opción D (1593 × 1460).
export const LIENZO_D = { ancho: 1593, alto: 1460 } as const;
/** Arista frente/costado y pendientes de las aristas horizontales (para orientar la veta). */
export const ORIENTACION_D = { esquinaX: 1141, pendienteFrente: 0.197, pendienteCostado: -0.343 } as const;
export interface CajonD { frente: [number, number][]; mueve: [number, number]; escala: number; centro: [number, number] }
export const CAJONES_D: Record<'vitelli' | 'tucano', CajonD[]> = {"vitelli":[{"frente":[[800,687],[1147,755],[1147,1047],[800,979]],"mueve":[-117.5,51],"escala":1.009,"centro":[973.5,870]},{"frente":[[800,1003],[1144,1071],[1144,1348],[800,1280]],"mueve":[-172.5,80],"escala":1.009,"centro":[972,1179]}],"tucano":[{"frente":[[379,458],[1128,605.5],[1128,954.5],[379,807]],"mueve":[-125.5,48],"escala":1.008,"centro":[753.5,704]},{"frente":[[383,820],[1125,966],[1125,1333],[383,1187]],"mueve":[-215.5,100],"escala":1.009,"centro":[754,1080]}]};
export const PUERTA_D = {"cerrada":{"ha":[355,598],"hb":[355,1172],"fa":[797,685],"fb":[797,1259]},"abierta":{"ha":[394,611],"hb":[394,1170],"fa":[15,746],"fb":[15,1326]}} as const;
/** Boca de cada grifería (aireador) sobre cada lavamanos. */
export const SALIDA_GRIFO_D: Record<'oslo' | 'genova' | 'parma' | 'siena', Record<'bajo' | 'alto', [number, number]>> = {"oslo":{"bajo":[1000.2,187],"alto":[960.3,165]},"genova":{"bajo":[1001,187],"alto":[960.4,165]},"parma":{"bajo":[907.8,241],"alto":[887.3,152]},"siena":{"bajo":[1000.3,187],"alto":[960.3,165]}};
export const GRIFO_RENDER_D = {"vitelli":"bajo","tucano":"alto"} as const;
export const COLOR_ACABADO_D: Record<string, string> = {"blanco-nevado":"#ffffff","tauari":"#bc9e7a","mali":"#cabbb1","nola":"#735a44","tambo":"#7e7363","candelaria":"#fafbf6"};
