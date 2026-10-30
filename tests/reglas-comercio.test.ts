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

const conCampana: Catalogo = {
  ...catalogo,
  campanas: [
    {
      codigo: 'BLACKFRIDAY',
      inicio: '2026-11-01T00:00:00-04:00',
      fin: '2026-12-01T00:00:00-05:00',
      cambios: [
        { de: 'ex-1', a: 'ex-1-bf', descuento: 20 },
        { de: 'layer-session', a: 'layer-session-bf' },
      ],
    },
  ],
};
const noviembre = new Date('2026-11-02T12:00:00-05:00');
const enCampana = (texto: string, cupon = 'BLACKFRIDAY', ahora = noviembre) =>
  escribirItems(normalizarPedido(leerItems(texto), conCampana, cupon, ahora));

test('con el código y un examen, la campaña cambia sus productos y el cargo sigue igual', () => {
  assert.equal(
    enCampana('ex-1,ex-2,layer-session'),
    'ex-1-bf,ex-2,layer-session-bf,cargo-laboratorio:2'
  );
});

test('el código vale escrito en minúsculas o con espacios', () => {
  assert.equal(enCampana('ex-1', ' blackFriday '), 'ex-1-bf,cargo-laboratorio');
});

test('vale del 1 de noviembre a las 00:00 al 30 de noviembre a las 23:59, hora del Este', () => {
  assert.equal(
    enCampana('ex-1', 'BLACKFRIDAY', new Date('2026-11-01T00:00:00-04:00')),
    'ex-1-bf,cargo-laboratorio'
  );
  assert.equal(
    enCampana('ex-1', 'BLACKFRIDAY', new Date('2026-11-30T23:59:59-05:00')),
    'ex-1-bf,cargo-laboratorio'
  );
  assert.equal(
    enCampana('ex-1', 'BLACKFRIDAY', new Date('2026-10-31T23:59:59-04:00')),
    'ex-1,cargo-laboratorio'
  );
  assert.equal(
    enCampana('ex-1', 'BLACKFRIDAY', new Date('2026-12-01T00:00:00-05:00')),
    'ex-1,cargo-laboratorio'
  );
});

test('sin el código o sin un examen, nada cambia', () => {
  assert.equal(enCampana('ex-1,layer-session', 'OTRO'), 'ex-1,layer-session,cargo-laboratorio');
  assert.equal(enCampana('ex-1', ''), 'ex-1,cargo-laboratorio');
  assert.equal(enCampana('layer-session'), 'layer-session');
});

test('un producto de la campaña pedido directo no se vende', () => {
  assert.equal(enCampana('ex-1-bf,layer-session-bf'), '');
});
