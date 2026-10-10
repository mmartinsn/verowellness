import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import type { RegistroLibre } from '../../../src/modelo/entidad.ts';
import { entidadPorClave, entidadesDeContenido } from '../../../src/modelo/esquema.ts';
import { normalizar, serializar } from '../../../src/modelo/serializar.ts';

export type Tabla = Record<string, RegistroLibre[]>;

export const CARPETA_SNAPSHOT = path.resolve('src', 'data', 'canonico');

export function leerSnapshot(carpeta = CARPETA_SNAPSHOT): Tabla {
  const tabla: Tabla = {};
  for (const e of entidadesDeContenido())
    tabla[e.clave] = JSON.parse(readFileSync(path.join(carpeta, `${e.coleccion}.json`), 'utf8'));
  return tabla;
}

export function escribirSnapshot(tabla: Tabla, carpeta = CARPETA_SNAPSHOT): string[] {
  mkdirSync(carpeta, { recursive: true });
  const cambiados: string[] = [];
  for (const e of entidadesDeContenido()) {
    const archivo = path.join(carpeta, `${e.coleccion}.json`);
    const nuevo = serializar(e, tabla[e.clave] ?? []);
    const anterior = existsSync(archivo) ? readFileSync(archivo, 'utf8') : '';
    if (anterior !== nuevo) {
      writeFileSync(archivo, nuevo);
      cambiados.push(e.coleccion);
    }
  }
  const esperados = new Set(entidadesDeContenido().map((e) => `${e.coleccion}.json`));
  const sobrantes = readdirSync(carpeta).filter((f) => f.endsWith('.json') && !esperados.has(f));
  if (sobrantes.length)
    throw new Error(`Archivos que el esquema no declara: ${sobrantes.join(', ')}`);
  return cambiados;
}

export const lector = (tabla: Tabla) => (clave: string) => tabla[clave] ?? [];

export const normalizarTabla = (tabla: Tabla): Tabla =>
  Object.fromEntries(
    Object.entries(tabla).map(([clave, registros]) => [
      clave,
      registros.map((r) => normalizar(entidadPorClave(clave), r)),
    ])
  );
