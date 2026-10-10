import type { Fuente, Modulo } from './entradas.ts';

export interface Diferencia {
  ruta: string;
  antes: string;
  despues: string;
}

const corto = (v: unknown) => {
  const s = v === undefined ? 'undefined' : JSON.stringify(v);
  return s.length > 120 ? `${s.slice(0, 117)}…` : s;
};

const tipo = (v: unknown) =>
  v === null
    ? 'null'
    : Array.isArray(v)
      ? 'array'
      : v instanceof Map
        ? 'map'
        : v instanceof Set
          ? 'set'
          : typeof v;

export function comparar(antes: unknown, despues: unknown, ruta = '$'): Diferencia[] {
  const ta = tipo(antes);
  const td = tipo(despues);
  if (ta !== td)
    return [{ ruta, antes: `${ta} ${corto(antes)}`, despues: `${td} ${corto(despues)}` }];
  if (ta === 'map')
    return comparar(
      [...(antes as Map<unknown, unknown>)],
      [...(despues as Map<unknown, unknown>)],
      ruta
    );
  if (ta === 'set')
    return comparar([...(antes as Set<unknown>)], [...(despues as Set<unknown>)], ruta);
  if (ta === 'function') return [];
  if (ta === 'array') {
    const a = antes as unknown[];
    const d = despues as unknown[];
    if (a.length !== d.length)
      return [{ ruta: `${ruta}.length`, antes: String(a.length), despues: String(d.length) }];
    return a.flatMap((x, i) => comparar(x, d[i], `${ruta}[${i}]`));
  }
  if (ta === 'object') {
    const a = antes as Record<string, unknown>;
    const d = despues as Record<string, unknown>;
    const ka = Object.keys(a);
    const kd = Object.keys(d);
    if (ka.join('|') !== kd.join('|'))
      return [{ ruta: `${ruta}{claves}`, antes: ka.join(','), despues: kd.join(',') }];
    return ka.flatMap((k) => comparar(a[k], d[k], `${ruta}.${k}`));
  }
  return Object.is(antes, despues) ? [] : [{ ruta, antes: corto(antes), despues: corto(despues) }];
}

export interface Comparables {
  valores: Record<string, unknown>;
  sinEntradas: string[];
}

export async function exportsComparables(
  modulo: Modulo,
  entradas: Record<string, (m: Modulo, otro: Fuente) => Promise<unknown[]> | unknown[]> = {},
  otro: Fuente = async () => ({})
): Promise<Comparables> {
  const valores: Record<string, unknown> = {};
  const sinEntradas: string[] = [];
  for (const [nombre, valor] of Object.entries(modulo)) {
    if (typeof valor !== 'function') {
      valores[nombre] = valor;
      continue;
    }
    const funcion = valor as (...a: unknown[]) => unknown;
    if (funcion.length === 0) {
      valores[`${nombre}()`] = funcion();
      continue;
    }
    const generar = entradas[nombre];
    if (!generar) {
      sinEntradas.push(nombre);
      continue;
    }
    valores[`${nombre}(…)`] = (await generar(modulo, otro)).map((x) => funcion(x));
  }
  return { valores, sinEntradas };
}
