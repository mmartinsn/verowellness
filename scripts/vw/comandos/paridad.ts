import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { opcion } from '../comun/args.ts';

const HASH = /\.[A-Za-z0-9_-]{8}(?=[._])/g;

function archivos(raiz: string, actual = raiz): string[] {
  return readdirSync(actual).flatMap((nombre) => {
    const ruta = path.join(actual, nombre);
    return statSync(ruta).isDirectory()
      ? archivos(raiz, ruta)
      : [path.relative(raiz, ruta).split(path.sep).join('/')];
  });
}

const md5 = (buffer: Buffer) => createHash('md5').update(buffer).digest('hex');

function primeraDiferencia(a: string, b: string): string {
  const la = a.split(/(?<=>)/);
  const lb = b.split(/(?<=>)/);
  for (let i = 0; i < Math.max(la.length, lb.length); i++)
    if (la[i] !== lb[i])
      return `\n      antes:   ${(la[i] ?? '').slice(0, 160)}\n      después: ${(lb[i] ?? '').slice(0, 160)}`;
  return '';
}

export async function ejecutar(args: string[]): Promise<number> {
  const base = path.resolve(opcion(args, '--base') ?? path.join('capturas', 'base', 'dist'));
  const actual = path.resolve(opcion(args, '--dist') ?? 'dist');
  const lb = archivos(base);
  const la = archivos(actual);
  const normal = (f: string) => f.replace(HASH, '.#');
  const porNormal = (lista: string[], raiz: string) =>
    new Map(lista.map((f) => [normal(f), { f, h: md5(readFileSync(path.join(raiz, f))) }]));
  const mb = porNormal(lb, base);
  const ma = porNormal(la, actual);
  const problemas: string[] = [];
  for (const [n, b] of mb) {
    const a = ma.get(n);
    if (!a) {
      problemas.push(`falta      ${b.f}`);
      continue;
    }
    if (a.h === b.h) continue;
    if (/\.(html|xml|txt|json)$/.test(n)) {
      const ta = readFileSync(path.join(base, b.f), 'utf8').replace(HASH, '.#');
      const td = readFileSync(path.join(actual, a.f), 'utf8').replace(HASH, '.#');
      if (ta === td) continue;
      problemas.push(`distinto   ${a.f}${primeraDiferencia(ta, td)}`);
    } else problemas.push(`distinto   ${a.f} (binario)`);
  }
  for (const [n, a] of ma) if (!mb.has(n)) problemas.push(`nuevo      ${a.f}`);
  console.log(`dist/ actual: ${la.length} archivos · línea base: ${lb.length}`);
  for (const p of problemas.slice(0, 30)) console.log(`  ${p}`);
  console.log(
    problemas.length === 0 ? 'Paridad exacta del front.' : `${problemas.length} diferencia(s).`
  );
  return problemas.length === 0 ? 0 : 1;
}
