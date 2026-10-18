import { test } from 'node:test';
import assert from 'node:assert/strict';
import { leerSnapshot } from '../scripts/vw/comun/snapshot.ts';
import { catalogoDe } from '../scripts/vw/comercio/puente.ts';
import { diferenciasDePedido } from '../scripts/vw/comercio/pedidos.ts';

const catalogo = catalogoDe(leerSnapshot());
const pedido = (...items: [string, number][]) =>
  diferenciasDePedido(
    items.map(([productSlug, count]) => ({ productSlug, count })),
    catalogo
  );

test('un pedido armado por el sitio pasa', () => {
  assert.deepEqual(
    pedido(['h-pylori', 1], ['organic-acids', 1], ['layer-session', 1], ['cargo-laboratorio', 2]),
    []
  );
  assert.deepEqual(pedido(['recetario-30-desayunos', 1], ['hackear-tu-cerebro-oferta', 1]), []);
});

test('una guía «Próximamente» no se vende, ni su oferta', () => {
  // The hormones guide went on sale on 2026-10-18; mark it «Próximamente» here to keep the rule tested.
  const tabla = structuredClone(leerSnapshot());
  for (const g of tabla.guia) if (g.producto === 'guia-hormonas-30') g.proximamente = true;
  const conPronto = catalogoDe(tabla);
  const pedidoPronto = (...items: [string, number][]) =>
    diferenciasDePedido(
      items.map(([productSlug, count]) => ({ productSlug, count })),
      conPronto
    );
  assert.deepEqual(pedidoPronto(['guia-hormonas-30', 1]), [
    'guia-hormonas-30 ×1 (el sitio arma ×0)',
  ]);
  assert.deepEqual(pedidoPronto(['recetario-30-desayunos', 1], ['guia-hormonas-30-oferta', 1]), [
    'guia-hormonas-30-oferta ×1 (el sitio arma ×0)',
  ]);
  assert.deepEqual(pedido(['guia-hormonas-30', 1]), []);
});

test('la oferta comprada sola se marca', () => {
  assert.deepEqual(pedido(['recetario-30-desayunos-oferta', 1]), [
    'recetario-30-desayunos-oferta ×1 (el sitio arma ×0)',
  ]);
});

test('exámenes sin su cargo de laboratorio, o con menos, se marcan', () => {
  assert.deepEqual(pedido(['h-pylori', 1], ['organic-acids', 1]), [
    'cargo-laboratorio ×0 (el sitio arma ×2)',
  ]);
  assert.deepEqual(pedido(['h-pylori', 1], ['organic-acids', 1], ['cargo-laboratorio', 1]), [
    'cargo-laboratorio ×1 (el sitio arma ×2)',
  ]);
});

test('un producto en cantidad que el sitio no ofrece se marca', () => {
  assert.deepEqual(pedido(['h-pylori', 2], ['cargo-laboratorio', 1]), [
    'h-pylori ×2 (el sitio arma ×1)',
  ]);
});
