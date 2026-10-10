import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  escribirItems,
  leerItems,
  normalizarPedido,
  ofertaDisponible,
  type Catalogo,
} from '../src/lib/comercio/reglas.ts';

const catalogo: Catalogo = {
  vendibles: ['layer-session', 'guia-a', 'recetario', 'hormonas', 'ex-1', 'ex-2', 'ex-3'],
  examenes: ['ex-1', 'ex-2', 'ex-3'],
  guias: ['guia-a', 'recetario', 'hormonas'],
  cargo: 'cargo-laboratorio',
  ofertas: [
    { guia: 'recetario', oferta: 'recetario-oferta' },
    { guia: 'hormonas', oferta: 'hormonas-oferta' },
  ],
};

const pedido = (texto: string) => escribirItems(normalizarPedido(leerItems(texto), catalogo));

test('lee ids válidos, ignora cantidades y basura', () => {
  assert.deepEqual(leerItems('ex-1:5, bad id ,<script>,ex-2'), [
    { producto: 'ex-1', cantidad: 1 },
    { producto: 'ex-2', cantidad: 1 },
  ]);
});

test('una asesoría sola pasa igual', () => {
  assert.equal(pedido('layer-session'), 'layer-session');
});

test('cada examen suma una unidad del cargo de laboratorio', () => {
  assert.equal(
    pedido('ex-1,ex-2,ex-3,layer-session'),
    'ex-1,ex-2,ex-3,layer-session,cargo-laboratorio:3'
  );
});

test('un cargo escrito en la URL se ignora y se recalcula', () => {
  assert.equal(pedido('cargo-laboratorio:0,ex-1'), 'ex-1,cargo-laboratorio');
  assert.equal(pedido('cargo-laboratorio'), '');
});

test('el recetario en oferta solo con otra guía y sin el recetario', () => {
  assert.equal(pedido('guia-a,recetario-oferta'), 'guia-a,recetario-oferta');
  assert.equal(pedido('recetario-oferta'), '');
  assert.equal(pedido('layer-session,recetario-oferta'), 'layer-session');
});

test('con el recetario, la oferta que vale es la de hormonas', () => {
  assert.equal(pedido('recetario,recetario-oferta'), 'recetario');
  assert.equal(pedido('recetario,hormonas-oferta'), 'recetario,hormonas-oferta');
});

test('con las dos guías ofertables no hay oferta', () => {
  assert.equal(ofertaDisponible(['recetario', 'hormonas'], catalogo), null);
  assert.equal(pedido('recetario,hormonas,hormonas-oferta'), 'recetario,hormonas');
});

test('productos desconocidos o repetidos se descartan', () => {
  assert.equal(pedido('ex-1,ex-1,no-existe'), 'ex-1,cargo-laboratorio');
});
