import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CATEGORIAS, incompatibles, planEsquema } from '../scripts/vw/webflow/esquema.ts';
import { colecciones } from './apoyo/webflow-falso.ts';

const categorias = () => Object.values(CATEGORIAS).map(({ slug }) => ({ slug }));

test('con todas las colecciones, campos y categorías no hay incompatibles', () => {
  assert.deepEqual(incompatibles(planEsquema(colecciones(), categorias())), []);
});

test('un campo que falta en Webflow se nombra', () => {
  const lista = colecciones();
  const bloques = lista.find((c) => c.slug === 'bloques')!;
  bloques.fields = bloques.fields.filter((f) => f.slug !== 'titulo');
  assert.deepEqual(incompatibles(planEsquema(lista, categorias())), ['campo bloques.titulo']);
});

test('un campo con otro tipo en Webflow se nombra', () => {
  const lista = colecciones();
  lista.find((c) => c.slug === 'layers')!.fields.find((f) => f.slug === 'orden')!.type =
    'PlainText';
  assert.deepEqual(incompatibles(planEsquema(lista, categorias())), [
    'campo layers.orden con tipo PlainText',
  ]);
});

test('una categoría de productos que falta se nombra', () => {
  const sinOfertas = categorias().filter((c) => c.slug !== 'ofertas');
  assert.deepEqual(incompatibles(planEsquema(colecciones(), sinOfertas)), ['categoría ofertas']);
});
