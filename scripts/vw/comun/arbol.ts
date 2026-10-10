import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

export function extraerArbol(ref: string, carpeta = 'src'): string {
  const destino = mkdtempSync(path.join(tmpdir(), `vw-${ref.replace(/[^a-z0-9]/gi, '')}-`));
  const archivos = execFileSync('git', ['ls-tree', '-r', '--name-only', ref, carpeta], {
    encoding: 'utf8',
  })
    .split('\n')
    .filter(Boolean);
  for (const archivo of archivos) {
    const contenido = execFileSync('git', ['show', `${ref}:${archivo}`], { maxBuffer: 1 << 28 });
    const salida = path.join(destino, archivo);
    mkdirSync(path.dirname(salida), { recursive: true });
    writeFileSync(salida, contenido);
  }
  return destino;
}
