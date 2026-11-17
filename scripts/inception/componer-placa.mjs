// Placa viva del loop Inception: clip de cámara fija escalado a 2048 y, encima, el render
// donde la máscara lo indica (producto y fondo quietos), para que el clip no pueda deformar el producto.
// Uso: node scripts/inception/componer-placa.mjs <clip.mp4> <quieto.png|-> <salida_base>
//   <quieto.png>: keyframe RGBA, alfa 1 donde manda el render y 0 donde se ve el clip ("-" sin máscara).
//   Salida: <salida_base>.mp4 (2048 px) y <salida_base>-m.mp4 (1080 px, móvil).
import { execFileSync } from 'node:child_process';

const [clip, quieto, base] = process.argv.slice(2);
if (!clip || !quieto || !base) {
  console.error('Uso: node scripts/inception/componer-placa.mjs <clip.mp4> <quieto.png|-> <salida_base>');
  process.exit(1);
}

const comun = ['-an', '-c:v', 'libx264', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-g', '48', '-movflags', '+faststart'];
const escalar = 'scale=2048:2048:flags=lanczos,unsharp=5:5:0.45:5:5:0';
const grafo = quieto === '-'
  ? `[0:v]${escalar},format=yuv420p[o]`
  : `[0:v]${escalar}[v];[v][1:v]overlay=0:0:format=auto,format=yuv420p[o]`;
const entradas = quieto === '-' ? ['-i', clip] : ['-i', clip, '-loop', '1', '-i', quieto];
// 192 cuadros = 8 s a 24 fps: el bucle del clip (mismo cuadro al inicio y al final).
execFileSync('ffmpeg', ['-v', 'error', '-y', ...entradas, '-filter_complex', grafo, '-map', '[o]', '-frames:v', '192', '-crf', '23', ...comun, `${base}.mp4`]);
execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', `${base}.mp4`, '-vf', 'scale=1080:1080:flags=lanczos', '-crf', '24', ...comun, `${base}-m.mp4`]);
console.log('ok', base);
