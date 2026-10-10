import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  CATEGORIAS,
  camposDeseados,
  coleccionesCms,
  faltantes,
  planEsquema,
} from '../scripts/vw/webflow/esquema.ts';
import type { ColeccionWf } from '../scripts/vw/webflow/tipos.ts';

const completas = (): ColeccionWf[] =>
  coleccionesCms().map((e) => ({
    id: e.coleccion,
    slug: e.coleccion,
    displayName: e.titulo,
    singularName: e.singular,
    fields: camposDeseados(e).map((d) => ({
      id: d.slug,
      slug: d.slug,
      displayName: d.etiqueta,
      type: d.tipo,
      isRequired: d.requerido,
      helpText: d.campo.ayuda,
    })),
  }));

const categorias = () => Object.values(CATEGORIAS).map(({ slug }) => ({ slug }));

test('con todas las colecciones, campos y categorías no falta nada', () => {
  assert.deepEqual(faltantes(planEsquema(completas(), categorias())), []);
});

test('un campo que falta en Webflow se nombra', () => {
  const colecciones = completas();
  const bloques = colecciones.find((c) => c.slug === 'bloques')!;
  bloques.fields = bloques.fields.filter((f) => f.slug !== 'titulo');
  assert.deepEqual(faltantes(planEsquema(colecciones, categorias())), ['campo bloques.titulo']);
});

test('una categoría de productos que falta se nombra', () => {
  const sinOfertas = categorias().filter((c) => c.slug !== 'ofertas');
  assert.deepEqual(faltantes(planEsquema(completas(), sinOfertas)), ['categoría ofertas']);
});
