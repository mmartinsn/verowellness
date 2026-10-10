import { test } from 'node:test';
import assert from 'node:assert/strict';
import { productosVivos, registrosDeProductos } from '../scripts/vw/webflow/productos.ts';
import { item, type CambiosItem } from './apoyo/webflow-falso.ts';

const tipoPorCategoria = new Map([['cat-asesorias', 'asesoria']]);

const producto = (id: string, cambios: CambiosItem = {}) =>
  item(id, {
    ...cambios,
    fieldData: {
      slug: id,
      category: ['cat-asesorias'],
      'tax-category': 'service-professional',
      'default-sku': `s-${id}`,
      ...cambios.fieldData,
    },
  });

const sku = (id: string, deProducto: string, precio: number) =>
  item(id, {
    fieldData: { slug: id, product: deProducto, price: { value: precio, unit: 'USD' }, sku: id },
  });

test('los borradores y archivados publicados no son productos vivos', () => {
  const vivos = productosVivos(
    [producto('a'), producto('b', { isDraft: true }), producto('c', { isArchived: true })],
    [sku('s-a', 'a', 100), sku('s-b', 'b', 100), sku('s-c', 'c', 100)]
  );
  assert.deepEqual(
    vivos.map((p) => p.product.id),
    ['a']
  );
});

test('el precio sale del SKU por defecto de cada producto', () => {
  const vivos = productosVivos(
    [producto('a'), producto('b')],
    [sku('otro-a', 'a', 1), sku('s-b', 'b', 200), sku('s-a', 'a', 100)]
  );
  assert.deepEqual(
    registrosDeProductos(vivos, tipoPorCategoria).map((r) => [r.id, r.precio, r.tipo]),
    [
      ['a', 100, 'asesoria'],
      ['b', 200, 'asesoria'],
    ]
  );
});
