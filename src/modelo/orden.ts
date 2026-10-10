import type { Entidad } from './entidad.ts';

export function ordenTopologico(entidades: Entidad[], soloObligatorias = true): Entidad[] {
  const pendientes = new Map(entidades.map((e) => [e.clave, e]));
  const salida: Entidad[] = [];
  while (pendientes.size) {
    const lista = [...pendientes.values()].filter((e) =>
      Object.values(e.campos).every(
        (c) =>
          c.tipo !== 'referencia' ||
          (soloObligatorias && !c.requerido) ||
          c.entidad === e.clave ||
          !pendientes.has(c.entidad)
      )
    );
    if (lista.length === 0) throw new Error('Las referencias forman un ciclo');
    for (const e of lista) {
      salida.push(e);
      pendientes.delete(e.clave);
    }
  }
  return salida;
}
