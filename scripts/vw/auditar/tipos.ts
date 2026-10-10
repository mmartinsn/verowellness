export type Estado = 'ok' | 'hallazgo' | 'error';

export interface Verificacion {
  dimension: string;
  nombre: string;
  estado: Estado;
  valor?: string | number;
  detalle?: string;
}

export interface Contexto {
  conWebflow: boolean;
  conBuild: boolean;
}

export type Auditoria = (contexto: Contexto) => Promise<Verificacion[]>;

export const ok = (
  dimension: string,
  nombre: string,
  valor?: string | number,
  detalle?: string
): Verificacion => ({
  dimension,
  nombre,
  estado: 'ok',
  valor,
  detalle,
});

export const hallazgo = (
  dimension: string,
  nombre: string,
  detalle: string,
  valor?: string | number
): Verificacion => ({
  dimension,
  nombre,
  estado: 'hallazgo',
  valor,
  detalle,
});

export const error = (dimension: string, nombre: string, causa: unknown): Verificacion => ({
  dimension,
  nombre,
  estado: 'error',
  detalle: causa instanceof Error ? causa.message : String(causa),
});

export async function medir(
  dimension: string,
  nombre: string,
  tarea: () => Promise<Verificacion | Verificacion[]>
): Promise<Verificacion[]> {
  try {
    const r = await tarea();
    return Array.isArray(r) ? r : [r];
  } catch (causa) {
    return [error(dimension, nombre, causa)];
  }
}

export function npm(): string {
  const ruta = process.env.npm_execpath;
  if (!ruta) throw new Error('Corre la auditoría con npm run vw -- auditar');
  return ruta;
}
