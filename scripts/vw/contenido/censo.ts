import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

export interface Conteo {
  archivo: string;
  textos: number;
  enUso: boolean;
  ejemplos: string[];
}

function usados(raiz: string, lista: string[]): Set<string> {
  const fuentes = lista.map((f) => readFileSync(f, 'utf8')).join('\n');
  return new Set(
    lista.filter((f) => {
      const relativo = path.relative(raiz, f).split(path.sep).join('/');
      if (!relativo.startsWith('src/components/')) return true;
      return fuentes.includes(`/${path.basename(f)}'`);
    })
  );
}

const CARPETAS = ['src/components', 'src/pages', 'src/layouts', 'src/data'];
const PALABRA = /[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]{2,}/g;

function archivos(carpeta: string): string[] {
  return readdirSync(carpeta).flatMap((n) => {
    const r = path.join(carpeta, n);
    if (statSync(r).isDirectory()) return archivos(r);
    return /\.(astro|ts)$/.test(n) ? [r] : [];
  });
}

export function esCopy(texto: string): boolean {
  const t = texto.trim();
  if (t.length < 4 || (t.match(PALABRA)?.length ?? 0) < 2) return false;
  if (/^(\/|\.|#|@|https?:|mailto:|data:|var\(|M\d|[\w-]+\/[\w-])/.test(t)) return false;
  if (/^[a-z0-9:_[\]./-]+(\s+[a-z0-9:_[\]./-]+)*$/.test(t)) return false;
  if (/^[A-Z0-9_]+$/.test(t) || /^[A-Z][A-Z_]+ [A-Z]+$/.test(t)) return false;
  return /[A-ZÁÉÍÓÚÑ]|[áéíóúüñ¿¡.,;:!?—«»]/.test(t);
}

const sinComentarios = (codigo: string) =>
  codigo.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/^\s*\/\/.*$/gm, ' ');

function literales(fuente: string): string[] {
  const codigo = sinComentarios(fuente);
  const salida: string[] = [];
  for (const m of codigo.matchAll(/'((?:[^'\\\n]|\\.)*)'|"((?:[^"\\\n]|\\.)*)"|`([^`$]*)`/g)) {
    const linea = codigo.slice(codigo.lastIndexOf('\n', m.index) + 1, m.index);
    if (/^\s*import\b|from\s*$/.test(linea)) continue;
    salida.push(m[1] ?? m[2] ?? m[3] ?? '');
  }
  return salida;
}

function nodosDeTexto(plantilla: string): string[] {
  return plantilla
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/\{[^{}]*\}/g, ' ')
    .replace(/<[^>]+>/g, '\n')
    .split('\n');
}

function textosDe(codigo: string, esAstro: boolean): string[] {
  if (!esAstro) return literales(codigo);
  const partes = codigo.split(/^---$/m);
  const frontmatter = partes.length >= 3 ? partes[1] : '';
  const plantilla = partes.length >= 3 ? partes.slice(2).join('---') : codigo;
  const expresiones = plantilla.match(/\{[^{}]*\}/g)?.join('\n') ?? '';
  return [...literales(frontmatter), ...literales(expresiones), ...nodosDeTexto(plantilla)];
}

export function censar(raiz = '.'): Conteo[] {
  const conteos: Conteo[] = [];
  const todos = CARPETAS.flatMap((carpeta) => archivos(path.join(raiz, carpeta)));
  const vivos = usados(raiz, todos);
  for (const archivo of todos) {
    const copy = textosDe(readFileSync(archivo, 'utf8'), archivo.endsWith('.astro'))
      .filter(esCopy)
      .map((t) => t.trim().replace(/\s+/g, ' '));
    if (copy.length)
      conteos.push({
        archivo: path.relative(raiz, archivo).split(path.sep).join('/'),
        textos: copy.length,
        enUso: vivos.has(archivo),
        ejemplos: copy.slice(0, 3),
      });
  }
  return conteos.sort((a, b) => b.textos - a.textos);
}
