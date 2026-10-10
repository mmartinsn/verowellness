import { siempreConValor } from './campos.ts';
import type { Entidad, RegistroLibre } from './entidad.ts';

export function normalizar(e: Entidad, r: RegistroLibre): RegistroLibre {
  const salida: RegistroLibre = { id: r.id, nombre: r.nombre };
  for (const [k, c] of Object.entries(e.campos)) {
    const v = r[k];
    if (v === undefined || v === null || (v === '' && !c.requerido)) {
      if (siempreConValor(c)) salida[k] = c.tipo === 'booleano' ? false : [];
      continue;
    }
    salida[k] = v;
  }
  return salida;
}

export function ordenar(e: Entidad, registros: readonly RegistroLibre[]): RegistroLibre[] {
  const clave = e.orden;
  return [...registros].sort((a, b) => {
    if (clave) {
      const d = Number(a[clave]) - Number(b[clave]);
      if (d !== 0) return d;
    }
    return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
  });
}

export function serializar(e: Entidad, registros: readonly RegistroLibre[]): string {
  return `${JSON.stringify(
    ordenar(
      e,
      registros.map((r) => normalizar(e, r))
    ),
    null,
    2
  )}\n`;
}
