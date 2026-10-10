import { test } from 'node:test';
import assert from 'node:assert/strict';
import { leerSnapshot } from '../scripts/vw/comun/snapshot.ts';
import { datos } from '../scripts/vw/exportar/sql.ts';
import { entidadPorClave, listaEntidades } from '../src/modelo/esquema.ts';
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
  const primera = new Map<string, number>();
  const ultima = new Map<string, number>();
  datos(leerSnapshot())
    .split('\n')
    .forEach((linea, i) => {
      const tabla = linea.match(/^INSERT INTO (\w+) /)?.[1];
      if (!tabla) return;
      if (!primera.has(tabla)) primera.set(tabla, i);
      ultima.set(tabla, i);
    });
  const tabla = (clave: string) => entidadPorClave(clave).coleccion.replaceAll('-', '_');
  let revisadas = 0;
  for (const e of entidades)
    for (const c of Object.values(e.campos)) {
      if (c.tipo !== 'referencia' || c.entidad === e.clave) continue;
      const origen = tabla(e.clave);
      const destino = tabla(c.entidad);
      if (!primera.has(origen) || !ultima.has(destino)) continue;
      revisadas++;
      assert.ok(
        ultima.get(destino)! < primera.get(origen)!,
        `${destino} termina después de que empieza ${origen}`
      );
    }
  assert.ok(revisadas > 5, `solo se revisaron ${revisadas} referencias`);
});
