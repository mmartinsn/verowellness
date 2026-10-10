import { test } from 'node:test';
import assert from 'node:assert/strict';
import { estadoProducto, productosPublicados } from '../scripts/vw/webflow/productos.ts';
import type { ItemWf, ProductoWf } from '../scripts/vw/webflow/tipos.ts';

const PUBLICADO = '2026-10-10T08:00:00.000Z';
const ANTES = '2026-10-10T07:00:00.000Z';
const DESPUES = '2026-10-10T09:00:00.000Z';

const tipoPorCategoria = new Map([['cat-asesoria', 'asesoria']]);

function producto(
  slug: string,
  precio: number,
  cambios: { producto?: Partial<ItemWf>; sku?: Partial<ItemWf> } = {}
): ProductoWf {
  return {
    product: {
      id: `p-${slug}`,
      lastPublished: PUBLICADO,
      lastUpdated: ANTES,
      isDraft: false,
      isArchived: false,
      fieldData: {
        name: slug,
        slug,
        category: ['cat-asesoria'],
        'tax-category': 'service-professional',
        shippable: false,
      },
      ...cambios.producto,
    },
    skus: [
      {
        id: `s-${slug}`,
        lastPublished: PUBLICADO,
        lastUpdated: ANTES,
        fieldData: { name: slug, slug, price: { value: precio, unit: 'USD' }, sku: slug },
        ...cambios.sku,
      },
    ],
  };
}

test('un producto publicado y sin cambios está vivo', () => {
  assert.equal(estadoProducto(producto('a', 100)), 'vivo');
});

test('un cambio sin publicar en el producto o en su SKU lo deja pendiente', () => {
  assert.equal(
    estadoProducto(producto('a', 100, { producto: { lastUpdated: DESPUES } })),
    'pendiente'
  );
  assert.equal(estadoProducto(producto('a', 100, { sku: { lastUpdated: DESPUES } })), 'pendiente');
  assert.equal(
    estadoProducto(producto('a', 100, { producto: { lastPublished: null } })),
    'pendiente'
  );
});

test('borrador o archivado ya publicado queda fuera; sin publicar sigue pendiente', () => {
  assert.equal(estadoProducto(producto('a', 100, { producto: { isDraft: true } })), 'fuera');
  assert.equal(estadoProducto(producto('a', 100, { producto: { isArchived: true } })), 'fuera');
  assert.equal(
    estadoProducto(producto('a', 100, { producto: { isArchived: true, lastUpdated: DESPUES } })),
    'pendiente'
  );
});

test('un precio sin publicar conserva el registro anterior y se reporta', () => {
  const anterior = { id: 'a', nombre: 'a', tipo: 'asesoria', precio: 100 };
  const { registros, pendientes } = productosPublicados(
    [producto('a', 999, { sku: { lastUpdated: DESPUES } })],
    [anterior],
    tipoPorCategoria
  );
  assert.deepEqual(registros, [anterior]);
  assert.deepEqual(pendientes, ['productos/a']);
});

test('pendiente sin registro anterior, borrador y archivado no llegan al snapshot', () => {
  const { registros, pendientes } = productosPublicados(
    [
      producto('nuevo', 50, { producto: { lastPublished: null } }),
      producto('borrador', 50, { producto: { isDraft: true } }),
      producto('archivado', 50, { producto: { isArchived: true } }),
      producto('vivo', 70),
    ],
    [],
    tipoPorCategoria
  );
  assert.deepEqual(
    registros.map((r) => [r.id, r.precio]),
    [['vivo', 70]]
  );
  assert.deepEqual(pendientes, ['productos/nuevo']);
});
