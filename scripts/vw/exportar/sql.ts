import type { Campo } from '../../../src/modelo/campos.ts';
import { siempreConValor } from '../../../src/modelo/campos.ts';
import type { Entidad, RegistroLibre } from '../../../src/modelo/entidad.ts';
import { VERSION_ESQUEMA, entidadPorClave, listaEntidades } from '../../../src/modelo/esquema.ts';
import { slugCampo } from '../../../src/modelo/etiquetas.ts';
import { ordenTopologico } from '../../../src/modelo/orden.ts';
import type { Tabla } from '../comun/snapshot.ts';

const tabla = (e: Entidad) => e.coleccion.replaceAll('-', '_');
const columna = (clave: string) => slugCampo(clave).replaceAll('-', '_');
const puente = (e: Entidad, clave: string) => `${tabla(e)}__${columna(clave)}`;
const texto = (v: string) => `'${v.replaceAll("'", "''")}'`;

function tipoSql(c: Campo, nombre: string): string {
  const nulo = c.requerido || siempreConValor(c) ? ' NOT NULL' : '';
  switch (c.tipo) {
    case 'texto':
    case 'imagen':
    case 'enlace':
      return `text${nulo}`;
    case 'lista':
    case 'parrafos':
      return `text[] NOT NULL DEFAULT '{}'`;
    case 'entero':
      return `integer${nulo}`;
    case 'dinero':
      return `integer${nulo} CHECK (${nombre} >= 0)`;
    case 'booleano':
      return 'boolean NOT NULL DEFAULT false';
    case 'opcion':
      return `text${nulo} CHECK (${nombre} IN (${c.opciones.map(texto).join(', ')}))`;
    case 'referencia':
      return `text${nulo} REFERENCES ${tabla(entidadPorClave(c.entidad))} (id)`;
    case 'fecha':
      return `timestamptz${nulo}`;
    case 'referencias':
      throw new Error('las referencias múltiples van en su tabla puente');
  }
}

export function ddl(): string {
  const entidades = listaEntidades();
  const bloques = [
    `-- Generado por \`npm run vw -- exportar sql\` desde src/modelo (versión ${VERSION_ESQUEMA}). No se edita a mano.`,
    '-- Dinero en centavos enteros (USD). Los ids son los slugs del modelo canónico.',
    '',
  ];
  for (const e of entidades) {
    const columnas = [
      `  id text PRIMARY KEY CHECK (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$')`,
      '  nombre text NOT NULL',
    ];
    for (const [clave, c] of Object.entries(e.campos))
      if (c.tipo !== 'referencias')
        columnas.push(`  ${columna(clave)} ${tipoSql(c, columna(clave))}`);
    bloques.push(`CREATE TABLE ${tabla(e)} (\n${columnas.join(',\n')}\n);`, '');
  }
  for (const e of entidades)
    for (const [clave, c] of Object.entries(e.campos))
      if (c.tipo === 'referencias')
        bloques.push(
          `CREATE TABLE ${puente(e, clave)} (\n  origen text NOT NULL REFERENCES ${tabla(e)} (id) ON DELETE CASCADE,\n  destino text NOT NULL REFERENCES ${tabla(entidadPorClave(c.entidad))} (id),\n  posicion integer NOT NULL,\n  PRIMARY KEY (origen, destino)\n);`,
          ''
        );
  return bloques.join('\n');
}

const valorSql = (c: Campo, v: unknown) => {
  if (v === undefined || v === null) return 'NULL';
  if (c.tipo === 'lista' || c.tipo === 'parrafos')
    return `ARRAY[${(v as string[]).map(texto).join(', ')}]::text[]`;
  if (c.tipo === 'entero' || c.tipo === 'dinero') return String(v);
  if (c.tipo === 'booleano') return v ? 'true' : 'false';
  return texto(String(v));
};

export function datos(t: Tabla): string {
  const lineas: string[] = ['BEGIN;'];
  const entidades = listaEntidades().filter((e) => e.almacen !== 'operacion');
  const insertar = (e: Entidad, r: RegistroLibre) => {
    const campos = Object.entries(e.campos).filter(([, c]) => c.tipo !== 'referencias');
    const nombres = ['id', 'nombre', ...campos.map(([k]) => columna(k))];
    const valores = [texto(r.id), texto(r.nombre), ...campos.map(([k, c]) => valorSql(c, r[k]))];
    return `INSERT INTO ${tabla(e)} (${nombres.join(', ')}) VALUES (${valores.join(', ')});`;
  };
  const ordenadas = ordenTopologico(entidades, false);
  for (const e of ordenadas) for (const r of t[e.clave] ?? []) lineas.push(insertar(e, r));
  for (const e of entidades)
    for (const [clave, c] of Object.entries(e.campos))
      if (c.tipo === 'referencias')
        for (const r of t[e.clave] ?? [])
          (r[clave] as string[]).forEach((destino, i) =>
            lineas.push(
              `INSERT INTO ${puente(e, clave)} (origen, destino, posicion) VALUES (${texto(r.id)}, ${texto(destino)}, ${i + 1});`
            )
          );
  lineas.push('COMMIT;', '');
  return lineas.join('\n');
}
