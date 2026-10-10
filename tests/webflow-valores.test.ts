import { test } from 'node:test';
import assert from 'node:assert/strict';
import { diferencias } from '../scripts/vw/webflow/productos.ts';
import { camposDistintos } from '../scripts/vw/webflow/valores.ts';

test('vacío, nulo, ausente y lista vacía cuentan como lo mismo', () => {
  assert.deepEqual(camposDistintos({ a: null, b: undefined }, { a: '', b: [], c: null }), []);
});

test('un booleano ausente en Webflow es falso, no un cambio', () => {
  assert.deepEqual(camposDistintos({}, { enviable: false }), []);
  assert.deepEqual(camposDistintos({}, { enviable: true }), ['enviable']);
});

test('productos y CMS usan la misma regla: shippable ausente y descripción vacía no son cambios', () => {
  assert.deepEqual(
    diferencias({ name: 'A' }, { name: 'A', shippable: false, description: '' }),
    []
  );
  assert.deepEqual(diferencias({ price: { value: 100 } }, { price: { value: 150, unit: 'USD' } }), [
    'price',
  ]);
});
