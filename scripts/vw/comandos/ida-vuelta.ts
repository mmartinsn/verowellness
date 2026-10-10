import { readdirSync, rmSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { extraerArbol } from '../comun/arbol.ts';
import { opcion } from '../comun/args.ts';
import { comparar, exportsComparables } from '../comun/comparar.ts';

const ORDEN_LIBRE: Record<string, string[]> = {
  testimonios: ['testimonios'],
  'grupos-examenes': ['mideAlimentos'],
};

const porId = (valor: unknown) => {
  if (Array.isArray(valor))
    return [...valor].sort((a, b) =>
      String((a as { id: string }).id).localeCompare(String((b as { id: string }).id))
    );
  if (valor && typeof valor === 'object')
    return Object.fromEntries(Object.entries(valor).sort(([a], [b]) => a.localeCompare(b)));
  return valor;
};

function sinOrden(nombre: string, exportados: Record<string, unknown>) {
  for (const clave of ORDEN_LIBRE[nombre] ?? []) exportados[clave] = porId(exportados[clave]);
  return exportados;
}

export async function ejecutar(args: string[]): Promise<number> {
  const ref = opcion(args, '--base') ?? 'main';
  const solo = opcion(args, '--solo');
  const base = extraerArbol(ref);
  try {
    const nombres = readdirSync(path.join(base, 'src', 'data'))
      .filter((f) => f.endsWith('.ts'))
      .map((f) => f.replace(/\.ts$/, ''))
      .filter((n) => !solo || solo.split(',').includes(n));
    let diferencias = 0;
    for (const nombre of nombres) {
      const antes = await import(
        pathToFileURL(path.join(base, 'src', 'data', `${nombre}.ts`)).href
      );
      const despues = await import(pathToFileURL(path.resolve('src', 'data', `${nombre}.ts`)).href);
      const ea = sinOrden(nombre, await exportsComparables(antes));
      const ed = sinOrden(nombre, await exportsComparables(despues));
      const faltan = Object.keys(ea).filter((k) => !(k in ed));
      const nuevos = Object.keys(ed).filter((k) => !(k in ea));
      if (nuevos.length) console.log(`    nuevos en ${nombre}.ts: ${nuevos.join(', ')}`);
      const lista = [
        ...faltan.map((k) => ({ ruta: k, antes: 'existe', despues: 'falta' })),
        ...Object.keys(ea)
          .filter((k) => k in ed)
          .flatMap((k) => comparar(ea[k], ed[k], k)),
      ];
      diferencias += lista.length;
      console.log(
        `${lista.length === 0 ? 'igual    ' : 'DISTINTO '} src/data/${nombre}.ts${lista.length ? ` (${lista.length})` : ''}`
      );
      for (const d of lista.slice(0, 8))
        console.log(`    ${d.ruta}\n      antes:   ${d.antes}\n      después: ${d.despues}`);
    }
    console.log(
      diferencias === 0
        ? `Ida y vuelta exacta contra ${ref}.`
        : `${diferencias} diferencia(s) contra ${ref}.`
    );
    return diferencias === 0 ? 0 : 1;
  } finally {
    rmSync(base, { recursive: true, force: true });
  }
}
