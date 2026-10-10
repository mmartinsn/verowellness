import { todos, type Fila } from './canonico.ts';

export type Bloque = Fila<'bloque'>;

export function bloques(pagina: Bloque['pagina'], seccion: string): Bloque[] {
  const lista = todos('bloque').filter((b) => b.pagina === pagina && b.seccion === seccion);
  if (lista.length === 0) throw new Error(`No hay bloques de ${pagina}/${seccion} en el snapshot`);
  return lista;
}

export function bloque(pagina: Bloque['pagina'], seccion: string): Bloque {
  return bloques(pagina, seccion)[0];
}

export function items(pagina: Bloque['pagina'], seccion: string): string[] {
  return bloque(pagina, seccion).items;
}

export function texto(pagina: Bloque['pagina'], seccion: string): string {
  const valor = bloque(pagina, seccion).texto;
  if (valor === undefined) throw new Error(`El bloque ${pagina}/${seccion} no tiene texto`);
  return valor;
}
