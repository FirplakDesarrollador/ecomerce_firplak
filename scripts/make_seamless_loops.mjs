import { execSync } from 'child_process';
import fs from 'fs';

const VIDEOS = [
  // Loomere desktop & mobile
  {
    input: 'public/videos/loomere/originals/viaje_1_exterior.mp4',
    output: 'public/videos/loomere/viaje_1_exterior.mp4',
    fade: 1.0
  },
  {
    input: 'public/videos/loomere/originals/viaje_1_exterior-m.mp4',
    output: 'public/videos/loomere/viaje_1_exterior-m.mp4',
    fade: 1.0
  },
  {
    input: 'public/videos/loomere/originals/viaje_2_bano.mp4',
    output: 'public/videos/loomere/viaje_2_bano.mp4',
    fade: 1.0
  },
  {
    input: 'public/videos/loomere/originals/viaje_2_bano-m.mp4',
    output: 'public/videos/loomere/viaje_2_bano-m.mp4',
    fade: 1.0
  },
  {
    input: 'public/videos/loomere/originals/viaje_3_lavanderia.mp4',
    output: 'public/videos/loomere/viaje_3_lavanderia.mp4',
    fade: 1.0
  },
  {
    input: 'public/videos/loomere/originals/viaje_3_lavanderia-m.mp4',
    output: 'public/videos/loomere/viaje_3_lavanderia-m.mp4',
    fade: 1.0
  },
  {
    input: 'public/videos/loomere/originals/viaje_4_cocina.mp4',
    output: 'public/videos/loomere/viaje_4_cocina.mp4',
    fade: 1.0
  },
  {
    input: 'public/videos/loomere/originals/viaje_4_cocina-m.mp4',
    output: 'public/videos/loomere/viaje_4_cocina-m.mp4',
    fade: 1.0
  },
  // Living Spaces
  {
    input: 'public/videos/living-spaces/originals/01_bano_scrollcraft.mp4',
    output: 'public/videos/living-spaces/01_bano_scrollcraft.mp4',
    fade: 0.8
  },
  {
    input: 'public/videos/living-spaces/originals/02_cocina_scrollcraft.mp4',
    output: 'public/videos/living-spaces/02_cocina_scrollcraft.mp4',
    fade: 0.8
  },
  {
    input: 'public/videos/living-spaces/originals/03_lavanderia_scrollcraft.mp4',
    output: 'public/videos/living-spaces/03_lavanderia_scrollcraft.mp4',
    fade: 0.8
  },
  {
    input: 'public/videos/living-spaces/originals/04_hidromasaje_scrollcraft.mp4',
    output: 'public/videos/living-spaces/04_hidromasaje_scrollcraft.mp4',
    fade: 0.8
  }
];

function getDuration(filePath) {
  const stdout = execSync(
    `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filePath}"`,
    { encoding: 'utf-8' }
  );
  return parseFloat(stdout.trim());
}

async function processVideo({ input, output, fade }) {
  console.log(`\n--- Procesando: ${input} ---`);
  if (!fs.existsSync(input)) {
    console.error(`Error: Archivo de entrada no existe: ${input}`);
    return;
  }

  const duration = getDuration(input);
  console.log(`Duración original: ${duration.toFixed(3)}s, Fade: ${fade}s`);

  const splitPoint = (duration - fade).toFixed(3);
  const tempOutput = output.replace(/\.mp4$/, '_seamless.mp4');

  const filterComplex = `[0:v]split[v1][v2];[v1]trim=start=0:end=${splitPoint},setpts=PTS-STARTPTS[main];[v2]trim=start=${splitPoint}:end=${duration.toFixed(3)},setpts=PTS-STARTPTS[tail];[tail][main]xfade=transition=fade:duration=${fade}:offset=0[outv]`;

  const cmd = `ffmpeg -y -i "${input}" -filter_complex "${filterComplex}" -map "[outv]" -c:v libx264 -crf 18 -preset fast -pix_fmt yuv420p -an -movflags +faststart "${tempOutput}"`;

  console.log(`Ejecutando render de bucle continuo...`);
  execSync(cmd, { stdio: 'inherit' });

  // Reemplazar archivo final con el archivo generado
  fs.copyFileSync(tempOutput, output);
  fs.unlinkSync(tempOutput);

  const newDuration = getDuration(output);
  console.log(`✅ Completado: ${output} (Nueva duración: ${newDuration.toFixed(3)}s)`);
}

async function run() {
  console.log('Iniciando conversión de videos a bucles continuos (Seamless Loops)...');
  for (const item of VIDEOS) {
    processVideo(item);
  }
  console.log('\n✨ Todos los videos fueron procesados y convertidos a bucle infinito perfecto.');
}

run();
