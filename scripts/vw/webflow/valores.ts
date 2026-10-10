const vacio = (v: unknown) =>
  v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0);

export function mismoValor(actual: unknown, deseado: unknown): boolean {
  if (vacio(actual) && vacio(deseado)) return true;
  if (typeof deseado === 'boolean') return Boolean(actual) === deseado;
  return JSON.stringify(actual) === JSON.stringify(deseado);
}

export const camposDistintos = (
  actual: Record<string, unknown>,
  deseado: Record<string, unknown>
) => Object.keys(deseado).filter((k) => !mismoValor(actual[k], deseado[k]));
