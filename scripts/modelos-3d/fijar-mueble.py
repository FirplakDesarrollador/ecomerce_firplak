# Mantiene el mueble identico al cambiar de lavamanos (regla de Mix & Match).
#
# La IA regenera la veta en cada pulido. Por eso el mueble se pule UNA vez por
# ambiente + acabado + estado (la imagen "base") y de cada lavamanos se toma
# solo lo que esta por encima de la costura (lavamanos y grifo). La costura es
# la fila donde empieza la tapa del mueble (rendersOpcionC.ts), igual para
# todos los lavamanos del Vitelli.
#
# Uso: python scripts/modelos-3d/fijar-mueble.py <base_ajustada.png> <costura_fraccion> <salida.png> <lavamanos_ajustado.png>
import sys

import numpy as np
from PIL import Image


def main():
    base_p, costura, salida, lav_p = sys.argv[1], float(sys.argv[2]), sys.argv[3], sys.argv[4]
    base = np.asarray(Image.open(base_p).convert('RGB'), dtype=np.float32)
    lav = np.asarray(Image.open(lav_p).convert('RGB').resize(base.shape[1::-1]), dtype=np.float32)
    n = base.shape[0]
    fila = int(round(costura * n))
    # Transicion de 3 px en la costura (es la junta real entre lavamanos y tapa).
    w = np.clip((np.arange(n) - (fila - 1)) / 3, 0, 1)[:, None, None]
    out = lav * (1 - w) + base * w
    Image.fromarray(np.clip(out + 0.5, 0, 255).astype(np.uint8)).save(salida)
    dif = np.abs(out[fila + 3:] - base[fila + 3:]).max()
    print(f'{salida}: mueble identico a la base debajo de la costura (dif max {dif:.0f})')


main()
