// GENERADO por scripts/mix-match/preparar-opcion-c.mjs. No editar a mano.
// Fracciones del lado del render (1600 px):
//   costura  fila donde empieza la tapa del mueble (separa lavamanos y mueble)
//   caja     [x0, y0, x1, y1] de lo opaco; encuadra las vistas "solo"
//   grifo    [x0, y0, x1, y1] del grifo; null si la vista no tiene grifo

export const LADO_RENDER_C = 1600;

/** Encuadre del tablero: x donde empieza el frente y ancho que cubre una textura (~70 cm). */
export const TEXTURA_C = {"x0":0.1888,"ancho":0.6736};

export interface VistaRenderC {
  costura: number;
  caja: number[];
  grifo: number[] | null;
}

export const RENDERS_C: Record<string, VistaRenderC> = {
  "vitelli__oslo__cerrado": {
    "costura": 0.395,
    "caja": [
      0.1875,
      0.0856,
      0.8031,
      0.8388
    ],
    "grifo": [
      0.4731,
      0.0862,
      0.5163,
      0.2344
    ]
  },
  "vitelli__oslo__abierto": {
    "costura": 0.395,
    "caja": [
      0.1756,
      0.0856,
      0.8031,
      0.945
    ],
    "grifo": [
      0.4731,
      0.0862,
      0.5163,
      0.2344
    ]
  },
  "vitelli__genova__cerrado": {
    "costura": 0.393125,
    "caja": [
      0.185,
      0.1006,
      0.7994,
      0.8388
    ],
    "grifo": [
      0.4731,
      0.1006,
      0.5163,
      0.2506
    ]
  },
  "vitelli__genova__abierto": {
    "costura": 0.393125,
    "caja": [
      0.1756,
      0.1006,
      0.7994,
      0.945
    ],
    "grifo": [
      0.4731,
      0.1006,
      0.5163,
      0.2506
    ]
  },
  "vitelli__parma__cerrado": {
    "costura": 0.395,
    "caja": [
      0.1825,
      0.1412,
      0.8031,
      0.8388
    ],
    "grifo": [
      0.4075,
      0.1412,
      0.4519,
      0.2869
    ]
  },
  "vitelli__parma__abierto": {
    "costura": 0.395,
    "caja": [
      0.1756,
      0.1412,
      0.8031,
      0.945
    ],
    "grifo": [
      0.4075,
      0.1412,
      0.4519,
      0.2869
    ]
  },
  "vitelli__siena__cerrado": {
    "costura": 0.393125,
    "caja": [
      0.1825,
      0.1006,
      0.7975,
      0.8388
    ],
    "grifo": [
      0.4731,
      0.1006,
      0.5163,
      0.2506
    ]
  },
  "vitelli__siena__abierto": {
    "costura": 0.393125,
    "caja": [
      0.1756,
      0.1006,
      0.7988,
      0.945
    ],
    "grifo": [
      0.4731,
      0.1006,
      0.5163,
      0.2506
    ]
  },
  "vitelli__solo__cerrado": {
    "costura": 0.395,
    "caja": [
      0.1888,
      0.2956,
      0.7956,
      0.8388
    ],
    "grifo": null
  },
  "vitelli__solo__abierto": {
    "costura": 0.395,
    "caja": [
      0.1756,
      0.2956,
      0.7988,
      0.945
    ],
    "grifo": null
  }
};
