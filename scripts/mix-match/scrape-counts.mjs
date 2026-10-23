import fs from 'fs';

async function fetchPage(url) {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } });
    if (!res.ok) return '';
    return await res.text();
  } catch (e) {
    console.error('Error fetching', url, e.message);
    return '';
  }
}

function parseProducts(html) {
  const titles = [];
  // match woocommerce loop titles or card titles
  const regex1 = /<h2[^>]*class="[^"]*woocommerce-loop-product__title[^"]*"[^>]*>([^<]+)<\/h2>/gi;
  let m;
  while ((m = regex1.exec(html)) !== null) {
    titles.push(m[1].trim());
  }
  if (titles.length === 0) {
    const regex2 = /<h[23][^>]*>[\s\S]*?<a[^>]*href="https:\/\/www\.firplak\.com\/producto\/[^"]*"[^>]*>([^<]+)<\/a>/gi;
    while ((m = regex2.exec(html)) !== null) {
      titles.push(m[1].trim());
    }
  }
  return titles;
}

function cleanDim(title) {
  let norm = title
    .replace(/&#215;/gi, 'X')
    .replace(/&times;/gi, 'X')
    .replace(/×/g, 'X')
    .toUpperCase()
    .replace(/\s+/g, ' ');

  if (norm.includes('IGUAZÚ 40CM')) return '40 × 28 cm';

  const m = norm.match(/(\d{2,3})\s*X\s*(\d{2,3})/);
  if (m) {
    return `${m[1]} × ${m[2]} cm`;
  }
  const mSingle = norm.match(/(\d{2,3})\s*CM/);
  if (mSingle) {
    return `${mSingle[1]} cm`;
  }
  return 'Otras';
}

async function main() {
  console.log('Fetching Firplak.com categories...');
  
  // 1. Lavamanos Vanity
  const vanityUrls = [
    'https://www.firplak.com/categoria-producto/banos/lavamanos-tipo-vanity/',
    'https://www.firplak.com/categoria-producto/banos/lavamanos-tipo-vanity/page/2/'
  ];
  let vanity = [];
  for (const u of vanityUrls) {
    const h = await fetchPage(u);
    const p = parseProducts(h);
    vanity.push(...p);
  }

  // 2. Lavamanos Vessel
  const vesselUrls = [
    'https://www.firplak.com/categoria-producto/banos/lavamanos-tipo-vessel/'
  ];
  let vessel = [];
  for (const u of vesselUrls) {
    const h = await fetchPage(u);
    const p = parseProducts(h);
    vessel.push(...p);
  }

  // 3. Muebles para Lavamanos (Solos)
  const mueblesUrls = [
    'https://www.firplak.com/categoria-producto/banos/muebles-para-lavamanos/',
    'https://www.firplak.com/categoria-producto/banos/muebles-para-lavamanos/page/2/',
    'https://www.firplak.com/categoria-producto/banos/muebles-para-lavamanos/page/3/'
  ];
  let muebles = [];
  for (const u of mueblesUrls) {
    const h = await fetchPage(u);
    const p = parseProducts(h);
    muebles.push(...p);
  }

  // Deduplicate
  const uniqueVanity = [...new Set(vanity)];
  const uniqueVessel = [...new Set(vessel)];
  const uniqueMuebles = [...new Set(muebles)];

  const todosLavamanos = [
    ...uniqueVanity.map(t => ({ tipo: 'Vanity', title: t, dim: cleanDim(t) })),
    ...uniqueVessel.map(t => ({ tipo: 'Vessel', title: t, dim: cleanDim(t) }))
  ];

  const todosMuebles = uniqueMuebles.map(t => ({ title: t, dim: cleanDim(t) }));

  // Agrupar por medida
  const resumenLavamanos = {};
  for (const item of todosLavamanos) {
    resumenLavamanos[item.dim] = (resumenLavamanos[item.dim] || 0) + 1;
  }

  const resumenMuebles = {};
  for (const item of todosMuebles) {
    resumenMuebles[item.dim] = (resumenMuebles[item.dim] || 0) + 1;
  }

  const result = {
    totalLavamanos: todosLavamanos.length,
    totalMuebles: todosMuebles.length,
    resumenLavamanos,
    resumenMuebles,
    detalleLavamanos: todosLavamanos,
    detalleMuebles: todosMuebles
  };

  fs.writeFileSync('scripts/mix-match/resultados-firplak.json', JSON.stringify(result, null, 2), 'utf8');
  console.log('Resultados guardados con éxito.');
  console.log('Total Lavamanos:', todosLavamanos.length);
  console.log('Total Muebles para Lavamanos:', todosMuebles.length);
}

main();
