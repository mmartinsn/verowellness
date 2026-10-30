import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  productosDe,
  urlKlarna,
  urlPedido,
  type MapaProductos,
} from '../src/lib/comercio/pedido.ts';
import { leerItems } from '../src/lib/comercio/reglas.ts';

const comercio = { modo: 'webflow' as const, pago: 'https://pago.example.com' };

test('arma la URL del puente con los productos sin repetir', () => {
  const url = new URL(urlPedido(comercio, ['h-pylori', 'layer-session', 'h-pylori']));
  assert.equal(url.origin + url.pathname, 'https://pago.example.com/pedido');
  assert.equal(url.searchParams.get('items'), 'h-pylori,layer-session');
});

test('Klarna va al cobro del dominio de pago con los mismos items que el puente', () => {
  const productos = ['h-pylori', 'layer-session', 'h-pylori'];
  const url = new URL(urlKlarna(comercio, productos, '/checkout/layer-session/'));
  assert.equal(url.origin + url.pathname, 'https://pago.example.com/cobro/klarna');
  assert.equal(
    url.searchParams.get('items'),
    new URL(urlPedido(comercio, productos)).searchParams.get('items')
  );
  assert.equal(url.searchParams.get('desde'), '/checkout/layer-session/');
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

const mapa: MapaProductos = {
  ciclos: { INITIAL_LAYER_CYCLE: 'initial-layer-cycle', LAYER_SESSION: 'layer-session' },
  examenes: { 'gi-map': 'gi-map', 'dutch-plus-a': 'dutch-plus', 'dutch-plus-b': 'dutch-plus' },
  guias: {
    'hackear-tu-cerebro': { producto: 'hackear-tu-cerebro', oferta: 'hackear-tu-cerebro-oferta' },
    'guia-glp1-retatrutida': { producto: 'guia-glp1-retatrutida' },
  },
};

test('un ciclo con una guía agregada va con sus dos productos', () => {
  assert.deepEqual(
    productosDe(
      {
        ciclo: 'INITIAL_LAYER_CYCLE',
        items: [],
        guias: [{ id: 'guia-glp1-retatrutida', oferta: false }],
      },
      mapa
    ),
    ['initial-layer-cycle', 'guia-glp1-retatrutida']
  );
});

test('los exámenes van por su producto, y la lectura por el de su asesoría', () => {
  assert.deepEqual(
    productosDe({ items: ['gi-map', 'dutch-plus-a'], guias: [], lectura: 'LAYER_SESSION' }, mapa),
    ['gi-map', 'dutch-plus', 'layer-session']
  );
});

test('en la tienda, la guía de la oferta va como su producto de oferta', () => {
  assert.deepEqual(
    productosDe(
      {
        items: ['guia-glp1-retatrutida'],
        guias: [{ id: 'hackear-tu-cerebro', oferta: true }],
      },
      mapa
    ),
    ['guia-glp1-retatrutida', 'hackear-tu-cerebro-oferta']
  );
});

test('lo que no está en el mapa no viaja', () => {
  assert.deepEqual(
    productosDe({ ciclo: 'OTRO', items: ['nada'], guias: [{ id: 'nada', oferta: true }] }, mapa),
    []
  );
});

test('el código de una campaña viaja en la URL del puente y en la de Klarna', () => {
  const productos = ['184-igg-food-sensitivity-panel'];
  assert.equal(
    new URL(urlPedido(comercio, productos, 'BLACKFRIDAY')).searchParams.get('cupon'),
    'BLACKFRIDAY'
  );
  assert.equal(
    new URL(urlKlarna(comercio, productos, '/checkout/examenes/', 'BLACKFRIDAY')).searchParams.get(
      'cupon'
    ),
    'BLACKFRIDAY'
  );
  assert.equal(new URL(urlPedido(comercio, productos)).searchParams.has('cupon'), false);
});
