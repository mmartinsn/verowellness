import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  avisoPendientes,
  decidir,
  itemsSinPublicar,
  pendientesDePublicar,
  sitioSinPublicar,
} from '../scripts/vw/webflow/publicacion.ts';
import { T1, T2, item, webflowFalso } from './apoyo/webflow-falso.ts';

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

test('decidir: en seco nunca escribe; con pendientes se niega; sin escrituras no hace nada', () => {
  assert.equal(decidir(false, 5, 3), 'seco');
  assert.equal(decidir(true, 0, 3), 'nada');
  assert.equal(decidir(true, 5, 1), 'negar');
  assert.equal(decidir(true, 5, 0), 'aplicar');
});

test('pendientesDePublicar junta el sitio, los productos, los SKU y el CMS', async () => {
  const { sitio } = webflowFalso({
    fechas: { lastUpdated: T2, lastPublished: T1 },
    vivos: { layers: [item('a')], product: [item('guia-x')], sku: [item('sku-x')] },
    borradores: {
      layers: [item('a', { lastUpdated: T2 })],
      product: [item('guia-x')],
      sku: [item('sku-x', { lastUpdated: T2 })],
    },
  });
  const pendientes = await pendientesDePublicar(sitio);
  assert.match(pendientes[0], /^sitio: /);
  assert.deepEqual(pendientes.slice(1), ['layers/a', 'sku/sku-x']);
});
