// GENERADO por scripts/modelos-3d/convertir-vitelli-63.mjs a partir del FBX
// "Vitelli mix & match". No editar a mano: volver a correr el script.
// Unidades en metros; origen en la pared, base del mueble y centro del ancho.

export const VITELLI_RIG = {
  "puerta": {
    "pivote": [
      -0.3025,
      0,
      0.4736
    ],
    "anguloAbierta": -1.5708,
    "residuoM": 0
  },
  "cajones": {
    "superior": 0.1234,
    "inferior": 0.182
  },
  "mueble": {
    "ancho": 0.624,
    "alto": 0.48,
    "fondo": 0.476
  },
  "lavamanos": {
    "oslo": {
      "grifo": [
        0,
        -0.0017,
        0
      ],
      "sifon": [
        0,
        0,
        0
      ],
      "alto": 0.54,
      "ancho": 0.63,
      "fondo": 0.48,
      "huecos": 1,
      "perforacionGrifo": false,
      "ajusteCm": [
        0.333,
        -0.247,
        0.5664
      ]
    },
    "siena": {
      "grifo": [
        0.0033,
        -0.0017,
        0.002
      ],
      "sifon": [
        0,
        0.0003,
        0.01
      ],
      "alto": 0.54,
      "ancho": 0.63,
      "fondo": 0.48,
      "huecos": 2,
      "perforacionGrifo": true,
      "ajusteCm": [
        0.2108,
        -0.2933,
        0.18
      ]
    },
    "genova": {
      "grifo": [
        0,
        0.0183,
        0
      ],
      "sifon": [
        0,
        0.0251,
        -0.0965
      ],
      "alto": 0.56,
      "ancho": 0.6448,
      "fondo": 0.493,
      "huecos": 1,
      "perforacionGrifo": false,
      "ajusteCm": [
        -1.244,
        -1.4109,
        -0.7594
      ]
    },
    "parma": {
      "grifo": [
        -0.0692,
        -0.0418,
        -0.0035
      ],
      "sifon": [
        -0.0725,
        -0.045,
        0.002
      ],
      "alto": 0.5,
      "ancho": 0.635,
      "fondo": 0.484,
      "huecos": 2,
      "perforacionGrifo": true,
      "ajusteCm": [
        -0.0995,
        -2.2857,
        -0.7598
      ]
    }
  },
  "anclas": {
    "cajon": [
      0.1785,
      0.2855,
      0.48
    ],
    "lavamanos": [
      0.185,
      0.544,
      0.43
    ],
    "grifo": [
      -0.0033,
      0.7107,
      0.0386
    ],
    "sifon": [
      -0.0023,
      0.284,
      0.126
    ]
  }
} as const;
