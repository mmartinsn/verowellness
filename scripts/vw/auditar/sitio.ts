import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { leerSnapshot } from '../comun/snapshot.ts';
import { hallazgo, medir, npm, ok, type Auditoria, type Verificacion } from './tipos.ts';

const S = 'sitio';
const DIST = path.resolve('dist');
const BASE = '/verowellness';
const PESO_MAXIMO = 2_500_000;
const EXTERNOS_VIGILADOS =
  /^https:\/\/(calendly\.com|ig\.me|www\.instagram\.com|www\.wholescripts\.com)/;

function archivos(carpeta: string): string[] {
  return readdirSync(carpeta).flatMap((n) => {
    const r = path.join(carpeta, n);
    return statSync(r).isDirectory() ? archivos(r) : [r];
  });
}

const esRedireccion = (f: string) => /http-equiv="refresh"/.test(readFileSync(f, 'utf8'));
const paginas = () => archivos(DIST).filter((f) => f.endsWith('.html') && !esRedireccion(f));
const relativo = (f: string) => path.relative(DIST, f).split(path.sep).join('/');

function destino(href: string): string | null {
  if (!href.startsWith(`${BASE}/`)) return null;
  const limpio = href.slice(BASE.length).split(/[?#]/)[0];
  const ruta = path.join(DIST, decodeURIComponent(limpio));
  return limpio.endsWith('/') ? path.join(ruta, 'index.html') : ruta;
}

function construir(): Verificacion {
  execFileSync(process.execPath, [npm(), 'run', 'build'], { stdio: 'pipe' });
  return ok(S, 'build', paginas().length, `${paginas().length} páginas`);
}

function enlacesInternos(): Verificacion {
  const rotos = new Set<string>();
  for (const f of paginas()) {
    const html = readFileSync(f, 'utf8');
    for (const [, href] of html.matchAll(/\shref="([^"]+)"/g)) {
      const d = destino(href);
      if (d && !existsSync(d) && !existsSync(`${d}.html`)) rotos.add(`${relativo(f)} → ${href}`);
    }
  }
  return rotos.size === 0
    ? ok(S, 'enlaces internos', 0)
    : hallazgo(S, 'enlaces internos', [...rotos].slice(0, 8).join(' · '), rotos.size);
}

async function enlacesExternos(): Promise<Verificacion> {
  const urls = new Set<string>();
  for (const f of paginas())
    for (const [, href] of readFileSync(f, 'utf8').matchAll(/\shref="(https:[^"]+)"/g))
      if (EXTERNOS_VIGILADOS.test(href)) urls.add(href.replaceAll('&amp;', '&'));
  for (const a of leerSnapshot().asesoria) urls.add(a.calendlyUrl as string);
  const caidos: string[] = [];
  for (const url of urls) {
    const r = await fetch(url, { redirect: 'follow' }).catch(() => null);
    if (!r || r.status >= 400) caidos.push(`${url} (${r?.status ?? 'sin respuesta'})`);
  }
  return caidos.length === 0
    ? ok(S, 'enlaces externos', urls.size)
    : hallazgo(S, 'enlaces externos', caidos.join(' · '), caidos.length);
}

function seo(): Verificacion {
  const faltan: string[] = [];
  for (const f of paginas()) {
    const html = readFileSync(f, 'utf8');
    const falta = [
      !/<title>[^<]+<\/title>/.test(html) && 'title',
      !/<meta name="description" content="[^"]+"/.test(html) && 'description',
      !/<meta property="og:image" content="[^"]+"/.test(html) && 'og:image',
      !/<html[^>]* lang="es/.test(html) && 'lang',
    ].filter(Boolean);
    if (falta.length) faltan.push(`${relativo(f)}: ${falta.join(', ')}`);
  }
  return faltan.length === 0
    ? ok(S, 'SEO por página', paginas().length)
    : hallazgo(S, 'SEO por página', faltan.slice(0, 8).join(' · '), faltan.length);
}

function jsonLd(): Verificacion {
  const precios = new Map(
    leerSnapshot().producto.map((p) => [p.nombre as string, Number(p.precio) / 100])
  );
  const problemas: string[] = [];
  for (const f of paginas()) {
    const html = readFileSync(f, 'utf8');
    for (const [, bloque] of html.matchAll(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g
    )) {
      let datos: unknown;
      try {
        datos = JSON.parse(bloque);
      } catch {
        problemas.push(`${relativo(f)}: JSON-LD inválido`);
        continue;
      }
      const texto = JSON.stringify(datos);
      for (const [, nombre, precio] of texto.matchAll(
        /"name":"([^"]+)"[^{}]*?"price":"?([\d.]+)"?/g
      )) {
        const esperado = precios.get(nombre);
        if (esperado !== undefined && Number(precio) !== esperado)
          problemas.push(`${relativo(f)}: ${nombre} a ${precio}, el snapshot dice ${esperado}`);
      }
    }
  }
  return problemas.length === 0
    ? ok(S, 'JSON-LD válido y con los precios del snapshot', 0)
    : hallazgo(
        S,
        'JSON-LD válido y con los precios del snapshot',
        problemas.slice(0, 6).join(' · '),
        problemas.length
      );
}

function accesibilidad(): Verificacion {
  const problemas: string[] = [];
  for (const f of paginas()) {
    const html = readFileSync(f, 'utf8');
    const sinAlt = [...html.matchAll(/<img\b(?![^>]*\salt[\s=>])[^>]*>/g)].length;
    const h1 = [...html.matchAll(/<h1\b/g)].length;
    const enlacesVacios = [...html.matchAll(/<a\b[^>]*>\s*<\/a>/g)].filter(
      (m) => !/aria-label=/.test(m[0])
    ).length;
    if (sinAlt) problemas.push(`${relativo(f)}: ${sinAlt} imagen(es) sin alt`);
    if (h1 !== 1 && !relativo(f).startsWith('404')) problemas.push(`${relativo(f)}: ${h1} h1`);
    if (enlacesVacios) problemas.push(`${relativo(f)}: ${enlacesVacios} enlace(s) sin texto`);
  }
  return problemas.length === 0
    ? ok(S, 'accesibilidad básica', paginas().length)
    : hallazgo(S, 'accesibilidad básica', problemas.slice(0, 8).join(' · '), problemas.length);
}

function peso(): Verificacion {
  const pesados: string[] = [];
  for (const f of paginas()) {
    const html = readFileSync(f, 'utf8');
    let total = statSync(f).size;
    for (const [, src] of html.matchAll(/(?:src|href)="(\/verowellness\/_astro\/[^"]+)"/g)) {
      const d = destino(src);
      if (d && existsSync(d)) total += statSync(d).size;
    }
    if (total > PESO_MAXIMO) pesados.push(`${relativo(f)}: ${(total / 1e6).toFixed(1)} MB`);
  }
  return pesados.length === 0
    ? ok(S, 'peso por página', `≤ ${PESO_MAXIMO / 1e6} MB`)
    : hallazgo(S, 'peso por página', pesados.join(' · '), pesados.length);
}

function sitemap(): Verificacion {
  const archivo = path.join(DIST, 'sitemap.xml');
  if (!existsSync(archivo)) return hallazgo(S, 'sitemap', 'no existe dist/sitemap.xml');
  const urls = [...readFileSync(archivo, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (m) => new URL(m[1]).pathname
  );
  const faltan = urls.filter((u) => !existsSync(destino(u) ?? ''));
  return faltan.length === 0
    ? ok(S, 'sitemap', urls.length)
    : hallazgo(S, 'sitemap', `rutas que no existen: ${faltan.join(', ')}`, faltan.length);
}

export const auditarSitio: Auditoria = async ({ conBuild }) => {
  const resultados: Verificacion[] = [];
  if (conBuild) resultados.push(...(await medir(S, 'build', async () => construir())));
  if (!existsSync(DIST))
    return [...resultados, hallazgo(S, 'dist', 'no hay dist/: correr sin --sin-build')];
  for (const [nombre, f] of [
    ['enlaces internos', enlacesInternos],
    ['SEO por página', seo],
    ['JSON-LD', jsonLd],
    ['accesibilidad básica', accesibilidad],
    ['peso por página', peso],
    ['sitemap', sitemap],
  ] as const)
    resultados.push(...(await medir(S, nombre, async () => f())));
  resultados.push(...(await medir(S, 'enlaces externos', enlacesExternos)));
  return resultados;
};
