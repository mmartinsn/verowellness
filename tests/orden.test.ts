import { test } from 'node:test';
import assert from 'node:assert/strict';
import { leerSnapshot } from '../scripts/vw/comun/snapshot.ts';
import { datos } from '../scripts/vw/exportar/sql.ts';
import { listaEntidades } from '../src/modelo/esquema.ts';
import { ordenTopologico } from '../src/modelo/orden.ts';

const entidades = listaEntidades().filter((e) => e.almacen !== 'operacion');

test('con todas las referencias, cada entidad va después de las que referencia', () => {
  const orden = ordenTopologico(entidades, false).map((e) => e.clave);
  for (const e of entidades)
    for (const c of Object.values(e.campos))
      if (c.tipo === 'referencia' && c.entidad !== e.clave)
        assert.ok(
          orden.indexOf(c.entidad) < orden.indexOf(e.clave),
          `${e.clave} va antes que ${c.entidad}`
        );
});

test('los INSERT del SQL respetan las claves foráneas del snapshot real', () => {
  const insertados = new Set<string>();
  for (const linea of datos(leerSnapshot()).split('\n')) {
    const m = linea.match(/^INSERT INTO (\w+) \(id, nombre[^)]*\) VALUES \('((?:[^']|'')*)'/);
    if (m) insertados.add(`${m[1]}:${m[2]}`);
  }
  const orden = ordenTopologico(entidades, false).map((e) => e.coleccion.replaceAll('-', '_'));
  const primeros = [...insertados].map((k) => k.split(':')[0]);
  const vistas = [...new Set(primeros)];
  assert.deepEqual(
    vistas,
    orden.filter((t) => vistas.includes(t))
  );
});
