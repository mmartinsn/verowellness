import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { Sitio } from '../scripts/vw/webflow/conexion.ts';
import {
  avisoPendientes,
  itemsSinPublicar,
  pendientesDePublicar,
  sitioSinPublicar,
} from '../scripts/vw/webflow/publicacion.ts';
import type { ItemWf, ProductoWf } from '../scripts/vw/webflow/tipos.ts';

const T1 = '2026-10-10T08:00:00.000Z';
const T2 = '2026-10-10T09:00:00.000Z';

const item = (id: string, cambios: Partial<ItemWf> = {}): ItemWf => ({
  id,
  lastUpdated: T1,
  lastPublished: T1,
  fieldData: { name: id, slug: id },
  ...cambios,
});

test('un ítem editado después de publicarse está pendiente', () => {
  assert.deepEqual(
    itemsSinPublicar('layers', [item('a'), item('b')], [item('a'), item('b', { lastUpdated: T2 })]),
    ['layers/b']
  );
});

test('un ítem nuevo sin publicar está pendiente; un borrador a propósito no', () => {
  assert.deepEqual(
    itemsSinPublicar('layers', [], [item('nuevo'), item('borrador', { isDraft: true })]),
    ['layers/nuevo']
  );
});

test('un ítem borrado que sigue en línea está pendiente', () => {
  assert.deepEqual(itemsSinPublicar('layers', [item('viejo')], []), ['layers/viejo (borrado)']);
});

test('el sitio con cambios después de su última publicación está pendiente', () => {
  assert.equal(sitioSinPublicar({ lastUpdated: T2, lastPublished: T1 }).length, 1);
  assert.deepEqual(sitioSinPublicar({ lastUpdated: T1, lastPublished: T2 }), []);
});

test('el aviso dice si se negó o solo advierte', () => {
  assert.match(avisoPendientes(['layers/b'], true), /^No se aplica nada\. 1 cambio/);
  assert.match(avisoPendientes(['layers/b'], false), /--aplicar se negaría/);
});

test('pendientesDePublicar junta sitio, productos e ítems del CMS', async () => {
  const producto: ProductoWf = {
    product: item('guia-x', { lastUpdated: T2 }),
    skus: [item('sku-x')],
  };
  const api = {
    sitio: async () => ({ lastUpdated: T2, lastPublished: T1 }),
    productos: async () => [producto],
    items: async (id: string, vivos = false) =>
      id === 'col-layers' ? (vivos ? [item('a')] : [item('a', { lastUpdated: T2 })]) : [],
  };
  const sitio = {
    api,
    colecciones: new Map([['layers', { id: 'col-layers' }]]),
  } as unknown as Sitio;
  const pendientes = await pendientesDePublicar(sitio);
  assert.equal(pendientes.length, 3);
  assert.match(pendientes[0], /^sitio: /);
  assert.deepEqual(pendientes.slice(1), ['productos/guia-x', 'layers/a']);
});
