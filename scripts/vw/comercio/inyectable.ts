import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import path from 'node:path';

export const javascript = (archivo: string) =>
  stripTypeScriptTypes(readFileSync(path.resolve(archivo), 'utf8'), { mode: 'strip' })
    .replace(/^import[^;]+;\s*$/gm, '')
    .replace(/^declare const[^;]+;\s*$/gm, '')
    .replace(/^export /gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

export const sinImports = (archivo: string) =>
  readFileSync(path.resolve(archivo), 'utf8')
    .replace(/^import[^;]+;\s*$/gm, '')
    .trim();

export const envolver = (partes: string[]) =>
  `<script>\n(() => {\n${partes.join('\n')}\n})();\n</script>\n`;
