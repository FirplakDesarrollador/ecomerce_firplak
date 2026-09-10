import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.join(ROOT_DIR, 'lib', 'data');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'firplak-assets.json');

const CATEGORIES = [
  { name: 'Hidromasajes y Spas', slug: 'jacuzzis-e-hidromasajes', url: 'https://www.firplak.com/categoria-producto/jacuzzis-e-hidromasajes/' },
  { name: 'Spas 1 Persona', slug: '1-persona', url: 'https://www.firplak.com/categoria-producto/jacuzzis-e-hidromasajes/1-persona/' },
  { name: 'Spas 2 Personas', slug: '2-personas', url: 'https://www.firplak.com/categoria-producto/jacuzzis-e-hidromasajes/2-personas/' },
  { name: 'Tinas Freestanding', slug: 'freestanding', url: 'https://www.firplak.com/categoria-producto/jacuzzis-e-hidromasajes/freestanding/' },
  { name: 'Multipersonales Spa', slug: 'multipersonales', url: 'https://www.firplak.com/categoria-producto/jacuzzis-e-hidromasajes/multipersonales/' },
  { name: 'Tinas', slug: 'tinas', url: 'https://www.firplak.com/categoria-producto/jacuzzis-e-hidromasajes/tinas/' },
  { name: 'Baños', slug: 'banos', url: 'https://www.firplak.com/categoria-producto/banos/' },
  { name: 'Combos Lavamanos con Mueble', slug: 'combos-lavamanos-con-mueble', url: 'https://www.firplak.com/categoria-producto/banos/combos-lavamanos-con-mueble/' },
  { name: 'Lavamanos Vanity', slug: 'lavamanos-tipo-vanity', url: 'https://www.firplak.com/categoria-producto/banos/lavamanos-tipo-vanity/' },
  { name: 'Lavamanos Vessel', slug: 'lavamanos-tipo-vessel', url: 'https://www.firplak.com/categoria-producto/banos/lavamanos-tipo-vessel/' },
  { name: 'Mesones Baño', slug: 'mesones-para-lavamanos', url: 'https://www.firplak.com/categoria-producto/banos/mesones-para-lavamanos/' },
  { name: 'Muebles Lavamanos', slug: 'muebles-para-lavamanos', url: 'https://www.firplak.com/categoria-producto/banos/muebles-para-lavamanos/' },
  { name: 'Muebles Complementarios', slug: 'muebles-complementarios', url: 'https://www.firplak.com/categoria-producto/banos/muebles-complementarios/' },
  { name: 'Línea Godai', slug: 'linea-godai', url: 'https://www.firplak.com/categoria-producto/banos/linea-godai/' },
  { name: 'Espejos', slug: 'espejos', url: 'https://www.firplak.com/categoria-producto/banos/espejos/' },
  { name: 'Zona de Ropas', slug: 'zona-de-ropas', url: 'https://www.firplak.com/categoria-producto/zona-de-ropas/' },
  { name: 'Combos Lavaderos', slug: 'combos-lavaderos', url: 'https://www.firplak.com/categoria-producto/zona-de-ropas/combos-lavaderos/' },
  { name: 'Lavaderos Pro', slug: 'lavaderos-pro', url: 'https://www.firplak.com/categoria-producto/zona-de-ropas/lavaderos-pro/' },
  { name: 'Lavaderos Aqua', slug: 'lavaderos-aqua', url: 'https://www.firplak.com/categoria-producto/zona-de-ropas/lavaderos-aqua/' },
  { name: 'Lavaderos Eco', slug: 'lavaderos-eco', url: 'https://www.firplak.com/categoria-producto/zona-de-ropas/lavaderos-eco/' },
  { name: 'Cocinas Integrales', slug: 'cocinas-integrales', url: 'https://www.firplak.com/categoria-producto/cocinas-integrales/' },
  { name: 'Muebles Cocina', slug: 'muebles-solos-cocinas', url: 'https://www.firplak.com/categoria-producto/cocinas-integrales/muebles-solos-cocinas/' },
  { name: 'Mesones Cocina', slug: 'mesones-para-cocina', url: 'https://www.firplak.com/categoria-producto/cocinas-integrales/mesones-para-cocina/' },
  { name: 'Lavaplatos', slug: 'lavaplatos', url: 'https://www.firplak.com/categoria-producto/cocinas-integrales/lavaplatos/' },
  { name: 'Accesorios', slug: 'accesorios', url: 'https://www.firplak.com/categoria-producto/accesorios/' },
  { name: 'Zona Outdoor', slug: 'zona-outdoor', url: 'https://www.firplak.com/categoria-producto/zona-outdoor/' },
  { name: 'Asadores', slug: 'asadores', url: 'https://www.firplak.com/categoria-producto/zona-outdoor/asadores/' },
  { name: 'Saunas', slug: 'saunas', url: 'https://www.firplak.com/categoria-producto/zona-outdoor/saunas/' },
];

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

async function fetchHtml(url) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': USER_AGENT,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
      },
    });
    if (!res.ok) {
      console.warn(`[WARN] Failed to fetch ${url}: Status ${res.status}`);
      return null;
    }
    return await res.text();
  } catch (err) {
    console.error(`[ERROR] Fetch error on ${url}:`, err.message);
    return null;
  }
}

function parseHighestResFromSrcset(srcset) {
  if (!srcset) return null;
  const entries = srcset.split(',').map(entry => {
    const parts = entry.trim().split(/\s+/);
    const url = parts[0];
    const width = parts[1] ? parseInt(parts[1].replace('w', ''), 10) : 0;
    return { url, width };
  });
  entries.sort((a, b) => b.width - a.width);
  return entries[0]?.url || null;
}

function getCleanHighResUrl(src) {
  if (!src) return null;
  // Remove dimension suffixes like -400x400, -300x300, etc., but preserve extension
  return src.replace(/-\d+x\d+(\.[a-zA-Z0-9]+)$/, '$1');
}

function extractProducts(html, category) {
  const products = [];
  // Match products in WooCommerce loop
  const productBlocks = html.split(/<li\s+class=["'][^"']*product[^"']*["']/i);
  // Remove first segment (before first product)
  productBlocks.shift();

  for (const block of productBlocks) {
    // Title & URL
    const titleMatch = block.match(/class=["'][^"']*woocommerce-loop-product__title[^"']*["'][^>]*>\s*<a\s+href=["']([^"']+)["'][^>]*>([^<]+)<\/a>/i)
      || block.match(/<a\s+href=["'](https:\/\/www\.firplak\.com\/producto\/[^"']+)["'][^>]*>\s*<h2[^>]*>([^<]+)<\/h2>/i);

    const productUrl = titleMatch ? titleMatch[1].trim() : null;
    const title = titleMatch ? titleMatch[2].trim().replace(/&amp;/g, '&') : null;

    if (!title || !productUrl) continue;

    // Slug
    const slugMatch = productUrl.match(/\/producto\/([^\/]+)\/?/);
    const slug = slugMatch ? slugMatch[1] : title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    // Images
    const imgMatches = [...block.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi)];
    const images = [];

    for (const match of imgMatches) {
      const tag = match[0];
      const src = match[1];
      if (!src.includes('wp-content/uploads')) continue;

      const srcsetMatch = tag.match(/srcset=["']([^"']+)["']/i);
      const altMatch = tag.match(/alt=["']([^"']*)["']/i);
      const alt = altMatch ? altMatch[1].trim() : '';

      const highestFromSrcset = srcsetMatch ? parseHighestResFromSrcset(srcsetMatch[1]) : null;
      const cleanOriginal = getCleanHighResUrl(src);

      const bestImage = highestFromSrcset || cleanOriginal || src;
      if (bestImage && !images.includes(bestImage)) {
        images.push(bestImage);
      }
    }

    if (images.length > 0) {
      products.push({
        title,
        slug,
        category: category.name,
        categorySlug: category.slug,
        productUrl,
        primaryImage: images[0],
        secondaryImage: images[1] || null,
        gallery: images,
      });
    }
  }

  return products;
}

function extractAllUploadImages(html) {
  const images = new Set();
  const matches = html.matchAll(/https:\/\/(?:www\.)?firplak\.com\/wp-content\/uploads\/[^\s"'<>)]+\.(?:webp|avif|jpg|jpeg|png|svg)/gi);
  for (const m of matches) {
    const raw = m[0];
    const clean = getCleanHighResUrl(raw);
    images.add(clean);
  }
  return Array.from(images);
}

async function main() {
  console.log('🚀 Iniciando escaneo e indexación de assets de Firplak.com...');

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const allProducts = new Map();
  const allMediaUrls = new Set();

  // 1. Escanear Home
  console.log('  → Escaneando página principal...');
  const homeHtml = await fetchHtml('https://www.firplak.com/');
  if (homeHtml) {
    const homeImgs = extractAllUploadImages(homeHtml);
    homeImgs.forEach(img => allMediaUrls.add(img));
  }

  // 2. Escanear Categorías
  for (const cat of CATEGORIES) {
    console.log(`  → Escaneando categoría: ${cat.name} (${cat.url})`);
    const html = await fetchHtml(cat.url);
    if (!html) continue;

    const products = extractProducts(html, cat);
    for (const p of products) {
      if (!allProducts.has(p.slug)) {
        allProducts.set(p.slug, p);
      }
      p.gallery.forEach(img => allMediaUrls.add(img));
    }

    const catImgs = extractAllUploadImages(html);
    catImgs.forEach(img => allMediaUrls.add(img));
  }

  const productsList = Array.from(allProducts.values());
  const mediaList = Array.from(allMediaUrls);

  const dataset = {
    updatedAt: new Date().toISOString(),
    totalProducts: productsList.length,
    totalImages: mediaList.length,
    categories: [...new Set(productsList.map(p => p.category))],
    products: productsList,
    allImages: mediaList,
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(dataset, null, 2), 'utf-8');
  console.log(`✅ ¡Índice generado con éxito!`);
  console.log(`   - Productos indexados: ${dataset.totalProducts}`);
  console.log(`   - Imágenes totales indexadas: ${dataset.totalImages}`);
  console.log(`   - Archivo guardado en: ${OUTPUT_FILE}`);
}

main();
