'use client';

import React, { useId } from 'react';
import type { IdAcabadoGrifoE, IdGrifoE, IdLavamanosE } from './catalogoOpcionE';

/** Fila (en el render) donde el chorro llega al fondo de cada poceta, bajo la salida de la grifería. */
export const FONDO_POCETA_E: Record<IdLavamanosE, number> = { oslo: 430, genova: 430, parma: 452, siena: 440 };

/** Ancho del chorro en la salida del aireador (px del render). */
export const ANCHO_CHORRO_E: Record<IdGrifoE, number> = { bajo: 19, alto: 16 };

/**
 * Chorro aireado dentro del SVG del escenario (coordenadas del render). Blanco lechoso con burbujas
 * que bajan, bordes con un leve tono para que se lea sobre el gelcoat blanco y un remanso de espuma
 * en el fondo de la poceta. Al abrir, el chorro baja desde el aireador; al cerrar, la cola cae.
 */
export function ChorroE({
  salida,
  fondo,
  grifo,
  abierta,
  quieto,
}: {
  salida: readonly [number, number];
  fondo: number;
  grifo: IdGrifoE;
  abierta: boolean;
  quieto: boolean;
}) {
  const id = useId().replace(/:/g, '');
  const [x, y0] = salida;
  const w0 = ANCHO_CHORRO_E[grifo];
  const w1 = w0 * 0.84;
  const y1 = fondo;
  const forma = `M ${x - w0 / 2} ${y0} L ${x + w0 / 2} ${y0} L ${x + w1 / 2} ${y1} Q ${x} ${y1 + 5} ${x - w1 / 2} ${y1} Z`;
  const ondas = quieto ? [] : [0, 0.42];
  return (
    <g aria-hidden>
      <defs>
        <linearGradient id={`${id}c`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#7b97aa" stopOpacity="0.6" />
          <stop offset="0.2" stopColor="#eef3f6" stopOpacity="0.92" />
          <stop offset="0.42" stopColor="#ffffff" />
          <stop offset="0.72" stopColor="#e4ecf1" stopOpacity="0.94" />
          <stop offset="1" stopColor="#6d8b9f" stopOpacity="0.55" />
        </linearGradient>
        <pattern id={`${id}b`} width="20" height="34" patternUnits="userSpaceOnUse">
          <circle cx="5" cy="6" r="2.3" fill="#fff" />
          <circle cx="14" cy="12" r="1.5" fill="#fff" opacity="0.85" />
          <circle cx="9" cy="21" r="2.7" fill="#fff" opacity="0.9" />
          <circle cx="16" cy="28" r="1.3" fill="#d9e4ea" />
          <circle cx="3" cy="30" r="1.1" fill="#d9e4ea" />
          {!quieto && <animateTransform attributeName="patternTransform" type="translate" from="0 0" to="0 34" dur="0.26s" repeatCount="indefinite" />}
        </pattern>
        <pattern id={`${id}v`} width="30" height="58" patternUnits="userSpaceOnUse">
          <path d="M4 4 v18 M15 20 v24 M25 0 v14" stroke="#9fb4c2" strokeWidth="1.2" strokeLinecap="round" opacity="0.55" />
          {!quieto && <animateTransform attributeName="patternTransform" type="translate" from="0 0" to="0 58" dur="0.4s" repeatCount="indefinite" />}
        </pattern>
        <filter id={`${id}s`} x="-50%" y="-10%" width="200%" height="120%">
          <feDropShadow dx="3" dy="0" stdDeviation="2.4" floodColor="#2f4a5c" floodOpacity="0.32" />
        </filter>
        <filter id={`${id}e`} x="-50%" y="-80%" width="200%" height="260%">
          <feGaussianBlur stdDeviation="2.2" />
        </filter>
      </defs>
      <g
        filter={`url(#${id}s)`}
        style={{
          transformBox: 'fill-box',
          transformOrigin: abierta ? 'top' : 'bottom',
          transform: abierta ? 'scaleY(1)' : 'scaleY(0)',
          transition: quieto ? 'none' : abierta ? 'transform 300ms cubic-bezier(.55,0,1,.45)' : 'transform 260ms cubic-bezier(.4,0,1,1)',
        }}
      >
        <path d={forma} fill={`url(#${id}c)`} />
        <path d={forma} fill={`url(#${id}v)`} />
        <path d={forma} fill={`url(#${id}b)`} opacity="0.9" />
        <rect x={x - w0 * 0.2} y={y0} width="2" height={y1 - y0 - 4} rx="1" fill="#fff" opacity="0.9" />
      </g>
      {/* Espuma y ondas en el fondo de la poceta */}
      <g
        transform={`rotate(-9 ${x} ${y1})`}
        style={{ opacity: abierta ? 1 : 0, transition: quieto ? 'none' : `opacity ${abierta ? 260 : 380}ms ease ${abierta ? 240 : 0}ms` }}
      >
        <ellipse cx={x} cy={y1} rx={w0 * 1.6} ry={w0 * 0.55} fill="#fff" opacity="0.95" filter={`url(#${id}e)`} />
        <ellipse cx={x} cy={y1} rx={w0 * 0.9} ry={w0 * 0.3} fill="#fff" />
        {ondas.map((inicio) => (
          <ellipse key={inicio} cx={x} cy={y1} rx={w0} ry={w0 * 0.34} fill="none" stroke="#7e98aa" strokeWidth="2" opacity="0">
            <animate attributeName="rx" values={`${w0};${w0 * 3.8}`} dur="0.95s" begin={`${inicio}s`} repeatCount="indefinite" />
            <animate attributeName="ry" values={`${w0 * 0.34};${w0 * 1.3}`} dur="0.95s" begin={`${inicio}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.75;0" dur="0.95s" begin={`${inicio}s`} repeatCount="indefinite" />
          </ellipse>
        ))}
      </g>
    </g>
  );
}

/** Tres tonos (claro, medio, oscuro) del metal elegido para el corte del aireador. */
const METAL: Record<IdAcabadoGrifoE, [string, string, string]> = {
  niquel: ['#e2ddd3', '#a39c90', '#6f695f'],
  negro: ['#55555a', '#2a2a2d', '#111113'],
  cromo: ['#f6f8fb', '#b9c1ca', '#7d8792'],
  oro: ['#efd7a4', '#bb9354', '#80602c'],
};

/**
 * Corte del aireador de aire inducido: el agua baja por el centro, el aire entra por las ranuras
 * de los costados, se mezcla en las mallas y sale un chorro blanco y espumoso.
 */
export function LupaAireador({ acabado, quieto }: { acabado: IdAcabadoGrifoE; quieto: boolean }) {
  const id = useId().replace(/:/g, '');
  const [claro, medio, oscuro] = METAL[acabado];
  const burbujas = [
    [56, 0, 2.2],
    [63, 0.18, 1.6],
    [59, 0.33, 2.6],
    [65, 0.5, 1.4],
    [54, 0.66, 1.8],
    [61, 0.82, 2.1],
  ] as const;
  return (
    <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden>
      <defs>
        <radialGradient id={`${id}f`} cx="50%" cy="40%" r="70%">
          <stop offset="0" stopColor="#fbf9f6" />
          <stop offset="1" stopColor="#e7e1d8" />
        </radialGradient>
        <linearGradient id={`${id}m`} x1="0" x2="1">
          <stop offset="0" stopColor={oscuro} />
          <stop offset="0.3" stopColor={claro} />
          <stop offset="0.55" stopColor={medio} />
          <stop offset="1" stopColor={oscuro} />
        </linearGradient>
        <clipPath id={`${id}r`}>
          <circle cx="60" cy="60" r="58" />
        </clipPath>
        <marker id={`${id}p`} viewBox="0 0 6 6" refX="3" refY="3" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M0 0 L6 3 L0 6 z" fill="#4d7fa3" />
        </marker>
      </defs>
      <g clipPath={`url(#${id}r)`}>
        <rect width="120" height="120" fill={`url(#${id}f)`} />
        {/* Caño y cuerpo del aireador (en corte) */}
        <rect x="30" y="-6" width="60" height="44" rx="6" fill={`url(#${id}m)`} />
        <rect x="38" y="36" width="44" height="30" rx="4" fill={`url(#${id}m)`} />
        <rect x="52" y="-6" width="16" height="48" fill="#7fb2d6" opacity="0.85" />
        <rect x="44" y="42" width="32" height="20" rx="2" fill="#e9f1f6" />
        {/* Ranuras de aire */}
        <rect x="38" y="46" width="6" height="6" fill="#3b3b3e" />
        <rect x="76" y="46" width="6" height="6" fill="#3b3b3e" />
        {/* Mallas */}
        <path d="M45 56 H75 M45 60 H75" stroke={oscuro} strokeWidth="1.4" strokeDasharray="2 2" />
        {/* Aire que entra */}
        <path d="M10 49 H36" stroke="#4d7fa3" strokeWidth="2" strokeDasharray="4 4" markerEnd={`url(#${id}p)`}>
          {!quieto && <animate attributeName="stroke-dashoffset" values="16;0" dur="0.6s" repeatCount="indefinite" />}
        </path>
        <path d="M110 49 H84" stroke="#4d7fa3" strokeWidth="2" strokeDasharray="4 4" markerEnd={`url(#${id}p)`}>
          {!quieto && <animate attributeName="stroke-dashoffset" values="16;0" dur="0.6s" repeatCount="indefinite" />}
        </path>
        {/* Chorro aireado */}
        <rect x="50" y="66" width="20" height="60" fill="#ffffff" />
        <rect x="50" y="66" width="20" height="60" fill="none" stroke="#9db5c4" strokeWidth="1" />
        {burbujas.map(([cx, retraso, r], i) => (
          <circle key={i} cx={cx} cy={quieto ? 70 + i * 8 : 66} r={r} fill="#c4d6e1">
            {!quieto && <animate attributeName="cy" values="66;124" dur="0.9s" begin={`${retraso * 0.9}s`} repeatCount="indefinite" />}
          </circle>
        ))}
        {!quieto &&
          [0, 0.3, 0.6].map((b) => (
            <circle key={b} cx="60" cy="46" r="1.6" fill="#ffffff" stroke="#7fb2d6" strokeWidth="0.6">
              <animate attributeName="cy" values="44;58" dur="0.9s" begin={`${b}s`} repeatCount="indefinite" />
              <animate attributeName="cx" values="47;58" dur="0.9s" begin={`${b}s`} repeatCount="indefinite" />
            </circle>
          ))}
      </g>
      <circle cx="60" cy="60" r="58" fill="none" stroke="#ffffff" strokeWidth="3" />
    </svg>
  );
}
