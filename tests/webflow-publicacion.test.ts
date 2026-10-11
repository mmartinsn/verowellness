import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  avisoPendientes,
  decidir,
  dominiosAPublicar,
  itemsSinPublicar,
  pendientesDePublicar,
  publicadoEn,
  sitioSinPublicar,
} from '../scripts/vw/webflow/publicacion.ts';
import type { DominioWf } from '../scripts/vw/webflow/tipos.ts';
import { T1, T2, item, webflowFalso } from './apoyo/webflow-falso.ts';

const conDominios = (dominios: DominioWf[]) => {
  const llamadas: string[] = [];
  return {
    llamadas,
    api: {
      dominiosPropios: async () => {
        llamadas.push('dominiosPropios');
        return dominios;
      },
    },
  };
};

test('con la caja en webflow.io se publica solo ahí, sin preguntar por dominios', async () => {
  const { api, llamadas } = conDominios([]);
  assert.deepEqual(
    await dominiosAPublicar(api, 'https://veronicas-radical-site-497b87.webflow.io'),
    []
  );
  assert.deepEqual(llamadas, []);
  assert.equal(publicadoEn([], 'https://veronicas-radical-site-497b87.webflow.io'), 'webflow.io');
});

test('con la caja en un dominio propio verificado se publica también en él', async () => {
  const pago = 'https://pago.veronicawellness.com';
  for (const url of ['pago.veronicawellness.com', 'https://pago.veronicawellness.com/']) {
    const { api } = conDominios([
      { id: 'otro', url: 'veronicawellness.com' },
      { id: 'd-pago', url },
    ]);
    assert.deepEqual(await dominiosAPublicar(api, pago), ['d-pago']);
  }
  assert.equal(publicadoEn(['d-pago'], pago), 'webflow.io y pago.veronicawellness.com');
});

test('con la caja en un dominio propio sin verificar se niega', async () => {
  const { api } = conDominios([{ id: 'otro', url: 'veronicawellness.com' }]);
  await assert.rejects(
    dominiosAPublicar(api, 'https://pago.veronicawellness.com'),
    /pago\.veronicawellness\.com verificado/
  );
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

test('el aviso dice si se negó, si se negaría o solo informa', () => {
  assert.match(avisoPendientes(['layers/b'], true, true), /^No se aplica nada\. 1 cambio/);
  assert.match(avisoPendientes(['layers/b'], false, true), /--aplicar se negaría/);
  assert.equal(
    avisoPendientes(['layers/b'], false, false),
    'Aviso: 1 cambio(s) en Webflow sin publicar: layers/b.'
  );
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

test('publicar mueve la fecha del sitio unos segundos después: no cuenta como cambio', () => {
  assert.deepEqual(
    sitioSinPublicar({
      lastPublished: '2026-10-10T18:22:34.440Z',
      lastUpdated: '2026-10-10T18:22:41.545Z',
    }),
    []
  );
  assert.equal(
    sitioSinPublicar({
      lastPublished: '2026-10-10T18:22:34.440Z',
      lastUpdated: '2026-10-10T18:25:00.000Z',
    }).length,
    1
  );
});
