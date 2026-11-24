/** Resorte críticamente amortiguado, en píxeles y segundos. Sin rebote. */
export const DURACION_DESLIZAMIENTO_D = 650;
const FRECUENCIA = 18;

export function estadoResorteD(desde: number, hasta: number, velocidad: number, segundos: number) {
  const diferencia = desde - hasta;
  const impulso = velocidad + FRECUENCIA * diferencia;
  const decaimiento = Math.exp(-FRECUENCIA * segundos);
  return {
    x: hasta + (diferencia + impulso * segundos) * decaimiento,
    velocidad: (velocidad - FRECUENCIA * impulso * segundos) * decaimiento,
  };
}

export function fotogramasResorteD(desde: number, hasta: number, velocidad: number, distancia: number, sombra: boolean) {
  return Array.from({ length: 61 }, (_, i) => {
    const offset = i / 60;
    const x = i === 60 ? hasta : estadoResorteD(desde, hasta, velocidad, offset * DURACION_DESLIZAMIENTO_D / 1000).x;
    return {
      offset,
      // La placa de sombra conserva su proyección en pared/piso; trasladarla
      // desplazaría también la oclusión ambiental y produciría bandas visibles.
      transform: sombra ? 'translate3d(0, 0, 0)' : `translate3d(${x}px, 0, 0)`,
      opacity: sombra ? Math.max(0, 1 - Math.abs(x) / distancia * 5) : 1,
    };
  });
}
