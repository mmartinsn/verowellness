import { test } from 'node:test';
import assert from 'node:assert/strict';
import { urlPedido } from '../src/lib/comercio/pedido.ts';
import { leerItems } from '../src/lib/comercio/reglas.ts';

const comercio = { modo: 'webflow' as const, pago: 'https://pago.example.com' };

test('arma la URL del puente con los productos sin repetir', () => {
  const url = new URL(urlPedido(comercio, ['h-pylori', 'layer-session', 'h-pylori']));
  assert.equal(url.origin + url.pathname, 'https://pago.example.com/pedido');
  assert.equal(url.searchParams.get('items'), 'h-pylori,layer-session');
});

test('lo que arma la URL lo lee igual el puente', () => {
  const items = new URL(
    urlPedido(comercio, ['recetario-30-desayunos', 'guia-hormonas-30-oferta'])
  ).searchParams.get('items')!;
  assert.deepEqual(
    leerItems(items).map((l) => l.producto),
    ['recetario-30-desayunos', 'guia-hormonas-30-oferta']
  );
});
