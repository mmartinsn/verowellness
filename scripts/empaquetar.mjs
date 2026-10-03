/**
 * Packs the built site (dist/) into ONE self-contained .html that can be sent by WhatsApp or
 * email and opened from disk — no server, no link, no repo name anywhere in it.
 *
 * How it works: every page becomes a fully inlined document (CSS, scripts and images embedded;
 * fonts from Google Fonts, which is the one thing that needs a connection) and is stored as a
 * string inside a small shell page. The shell shows one page at a time in a full-window
 * <iframe srcdoc>, routes with the URL hash (#el-metodo, #asesorias, #checkout/initial-layer-cycle,
 * #inicio~faq) and receives the clicks on internal links from inside the frame.
 *
 * Usage:  npm run build && npm run empaquetar          → entregas/<fecha>_Veronica_Wellness_prototipo.html
 *         npm run empaquetar -- --salida ruta.html
 */
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';

const DIST = path.resolve('dist');
const args = process.argv.slice(2);
const salidaArg = args.indexOf('--salida');
const hoy = new Date().toISOString().slice(0, 10);
const SALIDA = path.resolve(
  salidaArg >= 0 ? args[salidaArg + 1] : `entregas/${hoy}_Veronica_Wellness_prototipo.html`
);

// The base path comes from astro.config.mjs so the two never drift.
const config = await readFile('astro.config.mjs', 'utf8');
const BASE = (config.match(/base:\s*'([^']*)'/)?.[1] ?? '').replace(/\/$/, '');

// Google Fonts replaces the self-hosted @fontsource faces inside the bundle.
const FUENTES = {
  editorial:
    'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Nunito:wght@400..800&display=swap',
  stitch:
    'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Nunito:wght@400..800&family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..700;1,6..96,400..700&family=Plus+Jakarta+Sans:wght@300..800&display=swap',
  inicio:
    'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500;1,600&family=Nunito:wght@400..800&family=Plus+Jakarta+Sans:wght@300..800&display=swap',
};
const FAMILIAS = [
  ['Nunito Variable', 'Nunito'],
  ['Bodoni Moda Variable', 'Bodoni Moda'],
  ['Plus Jakarta Sans Variable', 'Plus Jakarta Sans'],
];

const MIME = {
  webp: 'image/webp',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  svg: 'image/svg+xml',
};

async function dataUri(rutaPublica) {
  const local = path.join(DIST, rutaPublica.replace(BASE, ''));
  const ext = path.extname(local).slice(1).toLowerCase();
  const buf = await readFile(local);
  return `data:${MIME[ext] ?? 'application/octet-stream'};base64,${buf.toString('base64')}`;
}

/** Every dist/<route>/index.html plus 404.html → [{ ruta, archivo }]. */
async function paginas(dir = DIST, rel = '') {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (e.isDirectory()) {
      if (e.name === '_astro') continue;
      out.push(...(await paginas(path.join(dir, e.name), path.posix.join(rel, e.name))));
    } else if (e.name === 'index.html') {
      out.push({ ruta: rel || 'inicio', archivo: path.join(dir, e.name) });
    } else if (e.name === '404.html' && !rel) {
      out.push({ ruta: '404', archivo: path.join(dir, e.name) });
    }
  }
  return out;
}

function rutaDesdeHref(href) {
  // "/verowellness/checkout/initial-layer-cycle/#cta" → { ruta, ancla }
  const [sinHash, hash = ''] = href.split('#');
  const limpio = sinHash.replace(BASE, '').replace(/^\/+|\/+$/g, '');
  return { ruta: limpio || 'inicio', ancla: hash };
}

const IMPORT_ESTATICO =
  /(\bimport\s*(?:[\w${},*\s]+from\s*)?|\bexport\s*[\w${},*\s]*from\s*)(["'])([^"']+)\2/g;
const modulosEmbebidos = new Map();

function archivoDeImport(especificador, dir) {
  if (especificador.startsWith(BASE + '/'))
    return path.join(DIST, especificador.slice(BASE.length));
  if (especificador.startsWith('./') || especificador.startsWith('../'))
    return path.resolve(dir, especificador);
  return null;
}

async function moduloComoDataUri(archivo) {
  if (!modulosEmbebidos.has(archivo)) {
    const js = await embeberImports(await readFile(archivo, 'utf8'), path.dirname(archivo));
    modulosEmbebidos.set(
      archivo,
      `data:text/javascript;base64,${Buffer.from(js).toString('base64')}`
    );
  }
  return modulosEmbebidos.get(archivo);
}

async function embeberImports(js, dir) {
  let salida = '';
  let desde = 0;
  for (const m of js.matchAll(IMPORT_ESTATICO)) {
    const archivo = archivoDeImport(m[3], dir);
    if (!archivo) continue;
    salida += js.slice(desde, m.index) + m[1] + m[2] + (await moduloComoDataUri(archivo)) + m[2];
    desde = m.index + m[0].length;
  }
  salida += js.slice(desde);
  if (/\bimport\s*\(/.test(salida))
    throw new Error('A module uses dynamic import(); the bundle only embeds static imports');
  return salida;
}

function autocontenido(css) {
  let limpio = css.replace(/@font-face\s*{[^}]*}/g, '');
  for (const [de, a] of FAMILIAS) limpio = limpio.replaceAll(de, a);
  const sinDatos = limpio.replace(/url\((["'])data:.*?\1\)/g, '').replace(/url\(data:[^)]*\)/g, '');
  const restos = sinDatos.match(/url\([^)]*\)/g);
  if (restos) throw new Error(`CSS still references files: ${restos.slice(0, 3).join(', ')}`);
  return limpio;
}

async function empaquetarPagina(html) {
  const tema = html.match(/data-theme="(stitch|inicio)"/)?.[1] ?? 'editorial';
  const titulo = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? 'Veronica Wellness';

  // 1. Nothing that names the hosting account.
  html = html.replace(/<link rel="canonical"[^>]*>/g, '');

  // 2. Stylesheets → inline <style>, with the @fontsource faces removed and families renamed.
  const hojas = [...html.matchAll(/<link rel="stylesheet" href="([^"]+)">/g)];
  for (const m of hojas) {
    const css = autocontenido(await readFile(path.join(DIST, m[1].replace(BASE, '')), 'utf8'));
    html = html.replace(m[0], () => `<style>${css}</style>`);
  }
  html = html.replace(
    /<style>([\s\S]*?)<\/style>/g,
    (_, css) => `<style>${autocontenido(css)}</style>`
  );
  html = html.replace(
    '<meta charset="utf-8">',
    `<meta charset="utf-8"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="${FUENTES[tema]}">`
  );

  // 3. External module scripts → inline; every chunk they import becomes a data: module.
  for (const m of [...html.matchAll(/<script type="module" src="([^"]+)"><\/script>/g)]) {
    const archivo = path.join(DIST, m[1].replace(BASE, ''));
    const js = await embeberImports(await readFile(archivo, 'utf8'), path.dirname(archivo));
    html = html.replace(m[0], () => `<script type="module">${js}</script>`);
  }
  for (const m of [...html.matchAll(/<script type="module">([\s\S]*?)<\/script>/g)]) {
    const js = await embeberImports(m[1], DIST);
    html = html.replace(m[0], () => `<script type="module">${js}</script>`);
  }

  // 4. Images → data URIs (the largest srcset candidate), favicon too.
  for (const m of [...html.matchAll(/<img\b[^>]*>/g)]) {
    let tag = m[0];
    const srcset = tag.match(/\ssrcset="([^"]+)"/)?.[1];
    let src = tag.match(/\ssrc="([^"]+)"/)?.[1];
    if (srcset) {
      const candidatos = srcset.split(',').map((c) => c.trim().split(/\s+/));
      candidatos.sort((a, b) => parseInt(b[1] ?? '0') - parseInt(a[1] ?? '0'));
      src = candidatos[0][0];
      tag = tag.replace(/\ssrcset="[^"]+"/, '').replace(/\ssizes="[^"]+"/, '');
    }
    if (src && src.startsWith(BASE + '/')) {
      tag = tag.replace(/\ssrc="[^"]+"/, ` src="${await dataUri(src)}"`);
    }
    html = html.replace(m[0], () => tag);
  }
  for (const m of [...html.matchAll(/<link rel="icon" href="([^"]+)"[^>]*>/g)]) {
    const limpio = m[1].replace(/\/$/, '');
    html = html.replace(
      m[0],
      `<link rel="icon" href="${await dataUri(limpio)}" type="image/svg+xml">`
    );
  }

  // 5. Internal links → hash routes the shell understands. Same-page anchors stay as they are.
  html = html.replace(/<a\b([^>]*?)\shref="(\/[^"]*)"([^>]*)>/g, (todo, antes, href, despues) => {
    if (!href.startsWith(BASE + '/') && href !== BASE) return todo;
    const { ruta, ancla } = rutaDesdeHref(href);
    const attrs = (antes + despues)
      .replace(/\starget="_blank"/, '')
      .replace(/\srel="noopener"/, '');
    return `<a${attrs} href="#${ruta}${ancla ? '~' + ancla : ''}" data-ir="${ruta}" data-ancla="${ancla}">`;
  });

  // 6. The bridge: clicks on internal links go to the shell, which swaps the page.
  html = html.replace(
    '</body>',
    `<script>document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[data-ir]');if(!a)return;e.preventDefault();parent.postMessage({tipo:'ir',ruta:a.getAttribute('data-ir'),ancla:a.getAttribute('data-ancla')||''},'*');},true);</script></body>`
  );

  const sobrante = html.match(/(?:href|src)="(\/verowellness[^"]*)"/g);
  if (sobrante)
    throw new Error(`Paths left unpacked: ${[...new Set(sobrante)].slice(0, 5).join(', ')}`);
  return { html, titulo };
}

const lista = await paginas();
const empaquetadas = {};
for (const p of lista) {
  empaquetadas[p.ruta] = await empaquetarPagina(await readFile(p.archivo, 'utf8'));
}
const favicon = await dataUri(`${BASE}/favicon.svg`);
// `<` is escaped so no `</script>` or `<!--` inside a page can break out of the data block.
const json = JSON.stringify(empaquetadas).replace(/</g, '\\u003c');

const shell = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Veronica Wellness — prototipo</title>
<link rel="icon" href="${favicon}" type="image/svg+xml">
<style>
  html, body { margin: 0; height: 100%; background: #FBFAF6; overflow: hidden; }
  iframe { border: 0; width: 100%; height: 100%; display: block; opacity: 0; transition: opacity .35s ease; }
  iframe.lista { opacity: 1; }
</style>
</head>
<body>
<iframe id="marco" title="Veronica Wellness"></iframe>
<script type="application/json" id="paginas">${json}</script>
<script>
  // One page at a time: #ruta or #ruta~ancla. Internal links inside the frame post here.
  var paginas = JSON.parse(document.getElementById('paginas').textContent);
  var marco = document.getElementById('marco');
  var anclaPendiente = '';
  function ir(ruta, ancla) {
    if (!paginas[ruta]) ruta = paginas['404'] ? '404' : 'inicio';
    anclaPendiente = ancla || '';
    marco.classList.remove('lista');
    document.title = paginas[ruta].titulo;
    marco.srcdoc = paginas[ruta].html;
  }
  marco.addEventListener('load', function () {
    marco.classList.add('lista');
    if (anclaPendiente) {
      var el = marco.contentDocument && marco.contentDocument.getElementById(anclaPendiente);
      if (el) el.scrollIntoView({ block: 'start' });
    }
    anclaPendiente = '';
  });
  window.addEventListener('message', function (e) {
    if (!e.data || e.data.tipo !== 'ir') return;
    var destino = '#' + e.data.ruta + (e.data.ancla ? '~' + e.data.ancla : '');
    if (location.hash === destino) desdeHash(); else location.hash = destino;
  });
  function desdeHash() {
    var h = decodeURIComponent(location.hash.replace(/^#\\/?/, ''));
    var partes = h.split('~');
    ir(partes[0] || 'inicio', partes[1] || '');
  }
  window.addEventListener('hashchange', desdeHash);
  desdeHash();
</script>
</body>
</html>
`;

await mkdir(path.dirname(SALIDA), { recursive: true });
await writeFile(SALIDA, shell, 'utf8');
const kb = Math.round(Buffer.byteLength(shell, 'utf8') / 1024);
console.log(`${Object.keys(empaquetadas).length} páginas → ${SALIDA} (${kb} KB)`);
console.log(`rutas: ${Object.keys(empaquetadas).sort().join(', ')}`);
