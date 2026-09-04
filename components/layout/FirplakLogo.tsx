import React from 'react';

interface FirplakLogoProps {
  className?: string;
  /**
   * Modifica este valor para cambiar la separación entre letras:
   * Ejemplos: '0.25em' (compacto), '0.35em' (medio), '0.48em' (amplio actual), '0.60em' (ultra)
   */
  letterSpacing?: string;
  height?: number | string;
}

export default function FirplakLogo({
  className = '',
  letterSpacing = '0.48em', // <-- EDITA AQUÍ DIRECTAMENTE LA SEPARACIÓN
  height = 18,
}: FirplakLogoProps) {
  return (
    <svg
      viewBox="0 0 340 32"
      height={height}
      className={`w-auto text-white fill-current transition-transform duration-300 ${className}`}
      aria-label="FIRPLAK"
      role="img"
    >
      <text
        x="50%"
        y="23"
        textAnchor="middle"
        style={{
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Montserrat", "Helvetica Neue", Arial, sans-serif',
          fontWeight: 800,
          letterSpacing,
          fontSize: '20px',
          textTransform: 'uppercase',
        }}
      >
        FIRPLAK
      </text>
    </svg>
  );
}
