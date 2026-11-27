import { test, expect } from '@playwright/test';

// Usa Chrome instalado en el entorno local; no requiere descargar otro navegador.
test.use({ channel: 'chrome' });

// El servidor de desarrollo puede correr en otro puerto: URL_BASE=http://localhost:3001 npx playwright test
const BASE = process.env.URL_BASE ?? 'http://localhost:3000';
const URL_ESTUDIO = `${BASE}/categoria-producto/banos/combos-lavamanos-con-mueble/mix-match`;
const FONDO = '[data-capa="ambiente"][data-activa="true"]';

test('Alejandro conserva ambiente y la otra pieza al recorrer las cuatro parejas', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(URL_ESTUDIO);
  await page.locator('[data-escena-capas] img').evaluateAll(async images => {
    await Promise.all(images.map(image => (image as HTMLImageElement).decode()));
  });
  const fondo = await page.locator(FONDO).elementHandle();
  const pedidos: string[] = [];
  page.on('request', request => { if (/\/images\/muebles\/capas-63x48\/.+\.webp$/.test(request.url())) pedidos.push(request.url()); });
  for (const [boton, mueble, lavamanos, conserva] of [
    ['Mueble siguiente', 'tiziano', 'oslo', 'lavamanos'],
    ['Lavamanos siguiente', 'tiziano', 'genova', 'mueble'],
    ['Mueble anterior', 'vitelli', 'genova', 'lavamanos'],
    ['Lavamanos anterior', 'vitelli', 'oslo', 'mueble'],
  ]) {
    const pieza = await page.locator(`[data-capa="${conserva}"][data-activa="true"]`).elementHandle();
    await page.getByRole('button', { name: boton, exact: true }).click();
    await expect(page.locator('[data-capa="mueble"][data-activa="true"]')).toHaveAttribute('data-pieza', mueble);
    await expect(page.locator('[data-capa="lavamanos"][data-activa="true"]')).toHaveAttribute('data-pieza', lavamanos);
    expect(await fondo!.evaluate(node => node === document.querySelector('[data-capa="ambiente"][data-activa="true"]'))).toBe(true);
    expect(await pieza!.evaluate((node, tipo) => node === document.querySelector(`[data-capa="${tipo}"][data-activa="true"]`), conserva)).toBe(true);
    expect(await page.locator('[data-escena-capas]').evaluate(node => node.scrollLeft)).toBe(0);
    expect(await page.locator('[data-seleccion]').evaluateAll(capas => capas.reduce((n, capa) => n + capa.getAnimations().length, 0))).toBe(0);
  }
  expect(pedidos).toEqual([]);
  // Vitelli + Quadratto no se ofrece: cae a Oslo.
  await page.goto(URL_ESTUDIO + '?mueble=vitelli&lavamanos=quadratto&acabado=mitte');
  await expect(page).toHaveURL(/lavamanos=oslo.*acabado=soder/);
  await page.goto(URL_ESTUDIO + '?mueble=tiziano&lavamanos=quadratto&acabado=mitte');
  await expect(page).toHaveURL(/lavamanos=quadratto.*acabado=soder/);
  await page.getByRole('button', { name: 'Lavamanos Quadratto', exact: true }).click();
  // Tiziano: Oslo, Génova, Siena, Trentino y Quadratto; Bari no se ofrece.
  await expect(page.getByRole('radiogroup', { name: 'Galería de lavamanos' }).getByRole('radio')).toHaveCount(5);
  await page.goto(URL_ESTUDIO + '?mueble=tiziano&lavamanos=bari&acabado=soder');
  await expect(page).toHaveURL(/lavamanos=oslo/);
});

test('recorre los diez cruces publicados en cada ambiente sin cambiar ambiente ni mueble', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const manifest = await (await page.request.get(`${BASE}/images/muebles/capas-63x48/manifest.json`)).json();
  const visitados: string[] = [];
  for (const ambiente of manifest.environments.map((a: { id: string }) => a.id))
  for (const [mueble, lavamanos] of [
    ['vitelli', ['oslo', 'genova', 'bari', 'siena', 'trentino']],
    ['tiziano', ['oslo', 'genova', 'siena', 'trentino', 'quadratto']],
  ] as const) {
    await page.goto(`${URL_ESTUDIO}?mueble=${mueble}&lavamanos=oslo&acabado=soder&ambiente=${ambiente}`);
    await expect(page.getByText('Cargando tu combinación', { exact: true })).toHaveCount(0);
    await page.locator('[data-escena-capas] img').evaluateAll(async images => {
      await Promise.all(images.map(image => (image as HTMLImageElement).decode()));
    });
    await expect(page.locator('[data-capa="mueble"][data-activa="true"]')).toHaveAttribute('data-pieza', mueble);
    await expect(page.locator(`[data-ambiente="${ambiente}"]`)).toHaveAttribute('data-activa', 'true');
    await expect(page.getByRole('radio', { name: `Ambiente ${manifest.environments.find((a: { id: string }) => a.id === ambiente).nombre}` })).toHaveAttribute('aria-checked', 'true');
    const fondo = await page.locator(FONDO).elementHandle();
    const capaMueble = await page.locator('[data-capa="mueble"][data-activa="true"]').elementHandle();
    for (const [i, id] of lavamanos.entries()) {
      if (i) await page.getByRole('button', { name: 'Lavamanos siguiente', exact: true }).click();
      const activa = page.locator('[data-capa="lavamanos"][data-activa="true"]');
      await expect(activa).toHaveAttribute('data-pieza', id);
      await expect(page).toHaveURL(new RegExp(`lavamanos=${id}`));
      const src = await activa.evaluate(node => (node instanceof HTMLImageElement ? node : node.querySelector('img'))!.getAttribute('src'));
      expect(src).toContain(manifest.basins[id].src.split('/').pop().replace('.webp', ''));
      expect(await fondo!.evaluate(node => node === document.querySelector('[data-capa="ambiente"][data-activa="true"]'))).toBe(true);
      expect(await capaMueble!.evaluate(node => node === document.querySelector('[data-capa="mueble"][data-activa="true"]'))).toBe(true);
      await expect(page.getByText('Grifería en negro').first()).toBeVisible();
      await expect(page).toHaveURL(new RegExp(`ambiente=${ambiente}`));
      visitados.push(`${ambiente}:${mueble}+${id}`);
    }
    await page.getByRole('button', { name: 'Lavamanos siguiente', exact: true }).click();
    await expect(page.locator('[data-capa="lavamanos"][data-activa="true"]')).toHaveAttribute('data-pieza', 'oslo');
  }
  expect(visitados).toHaveLength(manifest.verified_combinations.length * manifest.environments.length);
});

test('cambiar de ambiente conserva las piezas y cambiar de pieza conserva el ambiente', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(URL_ESTUDIO + '?mueble=tiziano&lavamanos=siena&acabado=soder');
  await expect(page.getByText('Cargando tu combinación', { exact: true })).toHaveCount(0);
  await page.locator('[data-escena-capas] img').evaluateAll(async images => {
    await Promise.all(images.map(image => (image as HTMLImageElement).decode()));
  });
  const pedidos: string[] = [];
  page.on('request', request => { if (/\/images\/muebles\/capas-63x48\/.+\.webp$/.test(request.url())) pedidos.push(request.url()); });
  const mueble = await page.locator('[data-capa="mueble"][data-activa="true"]').elementHandle();
  const lavamanos = await page.locator('[data-capa="lavamanos"][data-activa="true"]').elementHandle();
  const nodoCalido = await page.locator('[data-ambiente="calido"]').elementHandle();
  const posicion = () => page.locator('[data-capa="mueble"][data-activa="true"]').evaluate(n => {
    const r = n.getBoundingClientRect();
    const s = document.querySelector('[data-escena-capas]')!.getBoundingClientRect();
    return JSON.stringify({ x: r.left - s.left, y: r.top - s.top, width: r.width, height: r.height });
  });
  const antes = await posicion();
  await page.getByRole('radio', { name: 'Ambiente Cálido' }).click();
  await expect(page.locator('[data-ambiente="calido"]')).toHaveAttribute('data-activa', 'true');
  await expect(page).toHaveURL(/ambiente=calido/);
  // Las piezas son los mismos nodos, en la misma posición y sin animaciones de deslizamiento.
  expect(await mueble!.evaluate(n => n === document.querySelector('[data-capa="mueble"][data-activa="true"]'))).toBe(true);
  expect(await lavamanos!.evaluate(n => n === document.querySelector('[data-capa="lavamanos"][data-activa="true"]'))).toBe(true);
  expect(await posicion()).toBe(antes);
  expect(await page.locator('[data-seleccion]').evaluateAll(capas => capas.reduce((n, capa) => n + capa.getAnimations().length, 0))).toBe(0);
  // Cambiar de pieza no cambia el nodo ni el src del ambiente.
  const src = await page.locator(FONDO).getAttribute('src');
  await page.getByRole('button', { name: 'Lavamanos siguiente', exact: true }).click();
  await page.getByRole('button', { name: 'Mueble siguiente', exact: true }).click();
  await expect(page.locator('[data-capa="mueble"][data-activa="true"]')).toHaveAttribute('data-pieza', 'vitelli');
  expect(await nodoCalido!.evaluate(n => n === document.querySelector('[data-ambiente="calido"][data-activa="true"]'))).toBe(true);
  expect(await page.locator(FONDO).getAttribute('src')).toBe(src);
  // La sombra activa es la del mueble en el ambiente elegido; la otra placa queda oculta.
  await page.locator('[data-escena-capas]').evaluate(root => root.getAnimations({ subtree: true }).forEach(a => a.finish()));
  await expect(page.locator('[data-ambiente="calido"] [data-capa="sombra"][data-activa="true"]')).toHaveAttribute('data-pieza', 'vitelli');
  await expect(page.locator('[data-ambiente="moderno"]')).toHaveCSS('opacity', '0');
  await page.getByRole('radio', { name: 'Ambiente Moderno' }).click();
  await expect(page).toHaveURL(/ambiente=moderno/);
  expect(pedidos).toEqual([]);
  const radio = (await page.getByRole('radio', { name: 'Ambiente Moderno' }).boundingBox())!;
  expect(radio.width).toBeGreaterThanOrEqual(44);
  expect(radio.height).toBeGreaterThanOrEqual(44);
});

test('las piezas salen lateralmente, entran por el lado contrario y se pueden invertir sin saltos', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(URL_ESTUDIO);
  await expect(page.getByText('Cargando tu combinación', { exact: true })).toHaveCount(0);
  await page.locator('[data-escena-capas] img').evaluateAll(async images => {
    await Promise.all(images.map(image => (image as HTMLImageElement).decode()));
  });
  const fondo = await page.locator(FONDO).elementHandle();
  const estado = (fila: string, tiempo: number) => page.evaluate(({ fila, tiempo }) => {
    const root = document.querySelector('[data-escena-capas]')!;
    const piezas = [...root.querySelectorAll<HTMLElement>(`[data-capa="${fila}"]`)];
    for (const pieza of piezas) for (const animation of pieza.getAnimations()) {
      animation.pause(); animation.currentTime = tiempo;
    }
    // La sombra comparte el tiempo, conservando su proyección sobre el ambiente.
    if (fila === 'mueble') for (const pieza of root.querySelectorAll('[data-capa="sombra"]')) {
      for (const animation of pieza.getAnimations()) { animation.pause(); animation.currentTime = tiempo; }
    }
    return piezas.map(pieza => ({
      id: pieza.dataset.pieza, x: new DOMMatrixReadOnly(getComputedStyle(pieza).transform).m41,
      opacity: Number(getComputedStyle(pieza).opacity),
    }));
  }, { fila, tiempo });
  const terminar = async () => {
    await page.locator('[data-escena-capas]').evaluate(root => root.getAnimations({ subtree: true }).forEach(animation => animation.finish()));
    await expect.poll(() => page.locator('[data-escena-capas]').evaluate(root => root.getAnimations({ subtree: true }).length)).toBe(0);
  };
  for (const [boton, entra, sale, signo] of [
    ['Mueble siguiente', 'tiziano', 'vitelli', 1],
    // Con dos opciones, avanzar otra vez mantiene el sentido incluso al dar la vuelta.
    ['Mueble siguiente', 'vitelli', 'tiziano', 1],
    ['Mueble anterior', 'tiziano', 'vitelli', -1],
  ] as const) {
    await page.getByRole('button', { name: boton, exact: true }).click();
    const principio = await estado('mueble', 0);
    expect(principio.find(p => p.id === entra)!.x * signo).toBeGreaterThan(1400);
    expect(principio.find(p => p.id === sale)!.x).toBe(0);
    const medio = await estado('mueble', 180);
    expect(medio.find(p => p.id === sale)!.x * signo).toBeLessThan(0);
    expect(medio.find(p => p.id === entra)!.x * signo).toBeGreaterThan(0);
    expect(medio.every(p => p.opacity === 1)).toBe(true);
    expect(await page.locator('[data-capa="sombra"]').evaluateAll(capas => capas.every(capa => new DOMMatrixReadOnly(getComputedStyle(capa).transform).m41 === 0))).toBe(true);
    expect(await page.locator('[data-capa="lavamanos"][data-activa="true"]').evaluate(node => new DOMMatrixReadOnly(getComputedStyle(node).transform).m41)).toBe(0);
    expect(await fondo!.evaluate(node => node === document.querySelector('[data-capa="ambiente"][data-activa="true"]'))).toBe(true);
    // Fuera de assets-fuente: escribir ahí dispara Fast Refresh en `next dev --webpack` y reinicia
    // la página de los otros workers a mitad de animación (bug 031).
    if (entra === 'tiziano' && signo === 1) await page.screenshot({ path: test.info().outputPath('transicion-mueble.png') });
    await terminar();
    expect((await estado('mueble', 650)).find(p => p.id === entra)!.x).toBe(0);
  }
  await page.getByRole('button', { name: 'Lavamanos siguiente', exact: true }).click();
  const antes = await estado('lavamanos', 120);
  expect(antes.find(p => p.id === 'oslo')!.x).toBeLessThan(0);
  expect(antes.find(p => p.id === 'genova')!.x).toBeGreaterThan(0);
  await page.getByRole('button', { name: 'Lavamanos anterior', exact: true }).click();
  const despues = await estado('lavamanos', 0);
  for (const pieza of antes) expect(despues.find(p => p.id === pieza.id)!.x).toBeCloseTo(pieza.x, 0);
  await terminar();
  await expect(page.locator('[data-capa="lavamanos"][data-activa="true"]')).toHaveAttribute('data-pieza', 'oslo');
  expect(await page.locator('[data-escena-capas]').evaluate(node => node.scrollLeft)).toBe(0);
  // El gesto horizontal usa el mismo sentido que las flechas, también en móvil.
  await page.setViewportSize({ width: 375, height: 812 });
  await expect.poll(() => page.locator('[data-escena-capas]').evaluate(node => Math.round(node.getBoundingClientRect().width))).toBe(341);
  const rect = (await page.locator('[data-escena-capas]').boundingBox())!;
  await page.mouse.move(rect.x + rect.width * .7, rect.y + rect.height * .35);
  await page.mouse.down();
  await page.mouse.move(rect.x + rect.width * .3, rect.y + rect.height * .35);
  await page.mouse.up();
  expect((await estado('lavamanos', 0)).find(p => p.id === 'genova')!.x).toBeGreaterThan(350);
  await terminar();
  await expect(page.locator('[data-capa="lavamanos"][data-activa="true"]')).toHaveAttribute('data-pieza', 'genova');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('el encuadre mantiene productos completos y controles táctiles en móvil y escritorio', async ({ page }) => {
  await page.goto(URL_ESTUDIO + '?mueble=tiziano&lavamanos=genova&acabado=soder');
  const manifest = await (await page.request.get(`${BASE}/images/muebles/capas-63x48/manifest.json`)).json();
  for (const viewport of [{ width: 375, height: 812 }, { width: 768, height: 1024 }, { width: 1920, height: 1080 }]) {
    await page.setViewportSize(viewport);
    const validar = () => page.evaluate(manifest => {
      const stage = document.querySelector('[data-escena-capas]')!;
      const rect = stage.getBoundingClientRect();
      const frame = stage.querySelector('[data-capa="mueble"][data-activa="true"]')!.getBoundingClientRect();
      const bounds = [manifest.cabinets.tiziano.soder.cerrado.bounds, manifest.basins.genova.bounds];
      const completo = bounds.every(b => frame.left + b[0] / 1600 * frame.width >= rect.left
        && frame.left + b[2] / 1600 * frame.width <= rect.right
        && frame.top + b[1] / 1600 * frame.height >= rect.top
        && frame.top + b[3] / 1600 * frame.height <= rect.bottom);
      const tactil = [...stage.querySelectorAll('button')].every(button => {
        const r = button.getBoundingClientRect(); return r.width >= 44 && r.height >= 44;
      });
      return completo && tactil && document.documentElement.scrollWidth <= innerWidth;
    }, manifest);
    await expect.poll(validar).toBe(true);
  }
});
