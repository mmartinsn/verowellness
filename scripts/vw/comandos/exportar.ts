import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { entidadesDeContenido } from '../../../src/modelo/esquema.ts';
import { slugCampo } from '../../../src/modelo/etiquetas.ts';
import { bandera, opcion } from '../comun/args.ts';
import { leerSnapshot, type Tabla } from '../comun/snapshot.ts';
import { diccionario } from '../exportar/diccionario.ts';
import { datos, ddl } from '../exportar/sql.ts';

export const ARCHIVO_MODELO = path.resolve('docs', 'MODELO.md');
export const ARCHIVO_SQL = path.resolve('docs', 'modelo.sql');

const csvCelda = (v: unknown) => {
  const texto = Array.isArray(v) ? v.join('\n') : v === undefined || v === null ? '' : String(v);
  return /[",\n]/.test(texto) ? `"${texto.replaceAll('"', '""')}"` : texto;
};

function csv(t: Tabla, carpeta: string) {
  mkdirSync(carpeta, { recursive: true });
  for (const e of entidadesDeContenido()) {
    const claves = Object.keys(e.campos);
    const filas = [
      ['id', 'nombre', ...claves.map(slugCampo)].join(','),
      ...(t[e.clave] ?? []).map((r) =>
        [r.id, r.nombre, ...claves.map((k) => r[k])].map(csvCelda).join(',')
      ),
    ];
    writeFileSync(path.join(carpeta, `${e.coleccion}.csv`), `\uFEFF${filas.join('\r\n')}\r\n`);
  }
}

export function documentos(t: Tabla) {
  return { modelo: diccionario(t), sql: ddl() };
}

export async function ejecutar(args: string[]): Promise<number> {
  const que = args[0];
  const t = leerSnapshot();
  if (que === 'docs' || que === 'sql') {
    const { modelo, sql } = documentos(t);
    writeFileSync(ARCHIVO_MODELO, modelo);
    writeFileSync(ARCHIVO_SQL, sql);
    console.log('docs/MODELO.md y docs/modelo.sql generados desde el modelo.');
    if (bandera(args, '--con-datos')) {
      const destino = path.resolve(opcion(args, '--a') ?? 'exportacion', 'datos.sql');
      mkdirSync(path.dirname(destino), { recursive: true });
      writeFileSync(destino, datos(t));
      console.log(`Datos en SQL: ${destino}`);
    }
    return 0;
  }
  if (que === 'csv') {
    const carpeta = path.resolve(opcion(args, '--a') ?? 'exportacion');
    csv(t, carpeta);
    console.log(`Un CSV por entidad en ${carpeta}`);
    return 0;
  }
  console.log('Uso: npm run vw -- exportar <docs|sql|csv> [--con-datos] [--a carpeta]');
  return 2;
}
