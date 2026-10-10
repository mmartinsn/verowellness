import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import path from 'node:path';
import type { Catalogo } from '../../../src/lib/comercio/reglas.ts';
import type { Tabla } from '../comun/snapshot.ts';

export const ARCHIVO_PUENTE = path.resolve('webflow', 'pedido.html');

export const VOLVER = 'https://mmartinsn.github.io/verowellness/';

export const TIENDA = 'https://veronicas-radical-site-497b87.webflow.io';

const TEXTOS = {
  preparando: 'Preparando tu pedido…',
  vacio: 'No encontramos productos en tu pedido.',
  error: 'No pudimos preparar tu pedido.',
  reintentar: 'Intentar de nuevo',
  volver: 'Volver a Veronica Wellness',
};

const TOKENS = [
  'color-ivory',
  'color-charcoal',
  'color-clay-rich',
  'font-serif',
  'font-sans',
] as const;

export function catalogoDe(tabla: Tabla): Catalogo {
  const de = (tipo: string) => tabla.producto.filter((p) => p.tipo === tipo).map((p) => p.id);
  const ajustes = tabla.ajustes[0];
  const guias = new Map(tabla.guia.map((g) => [g.id, g]));
  return {
    vendibles: [...de('asesoria'), ...de('guia'), ...de('examen')],
    examenes: de('examen'),
    guias: de('guia'),
    cargo: ajustes.cargoLaboratorio as string,
    ofertas: (ajustes.ofertaGuias as string[]).map((g) => ({
      guia: g,
      oferta: guias.get(g)?.oferta as string,
    })),
  };
}

function tokens(): Record<(typeof TOKENS)[number], string> {
  const css = readFileSync(path.resolve('src', 'styles', 'global.css'), 'utf8');
  return Object.fromEntries(
    TOKENS.map((t) => {
      const valor = css.match(new RegExp(`--${t}:\\s*([^;]+);`))?.[1].trim();
      if (!valor) throw new Error(`No encontré --${t} en global.css`);
      return [t, valor];
    })
  ) as Record<(typeof TOKENS)[number], string>;
}

const javascript = (archivo: string) =>
  stripTypeScriptTypes(readFileSync(path.resolve(archivo), 'utf8'), { mode: 'strip' })
    .replace(/^import[^;]+;\s*$/gm, '')
    .replace(/^declare const[^;]+;\s*$/gm, '')
    .replace(/^export /gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

export function generarPuente(tabla: Tabla, volver: string): string {
  const t = tokens();
  const estilo = [
    'body{margin:0;background:' +
      t['color-ivory'] +
      ';color:' +
      t['color-charcoal'] +
      ';font-family:' +
      t['font-sans'] +
      '}',
    '[data-vw-estado]{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;padding:24px;text-align:center}',
    '[data-vw-estado] p{font-family:' + t['font-serif'] + ';font-size:28px;margin:0}',
    '[data-vw-estado] a{color:' + t['color-clay-rich'] + '}',
    '.w-commerce-commercecartwrapper{position:absolute;left:-9999px}',
  ].join('');
  const codigo = [
    `const CATALOGO = ${JSON.stringify(catalogoDe(tabla))};`,
    `const VOLVER = ${JSON.stringify(volver)};`,
    `const TEXTOS = ${JSON.stringify(TEXTOS)};`,
    javascript('src/lib/comercio/reglas.ts'),
    javascript('webflow/puente.ts'),
  ].join('\n');
  return `<style>${estilo}</style>\n<script>\n(() => {\n${codigo}\n})();\n</script>\n`;
}
