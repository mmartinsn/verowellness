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

export async function exportsComparables(
  modulo: Record<string, unknown>
): Promise<Record<string, unknown>> {
  const salida: Record<string, unknown> = {};
  for (const [nombre, valor] of Object.entries(modulo)) {
    if (typeof valor === 'function') {
      if ((valor as (...a: unknown[]) => unknown).length === 0)
        salida[`${nombre}()`] = (valor as () => unknown)();
      continue;
    }
    salida[nombre] = valor;
  }
  return salida;
}
