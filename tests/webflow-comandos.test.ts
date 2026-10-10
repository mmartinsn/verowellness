import { after, before, test } from 'node:test';
import { readFileSync, writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { ejecutar as puente } from '../scripts/vw/comandos/puente.ts';
import { ejecutar as sembrar } from '../scripts/vw/comandos/sembrar.ts';
import { leerSnapshot } from '../scripts/vw/comun/snapshot.ts';
import { bajar } from '../scripts/vw/webflow/bajar.ts';
import { ARCHIVO_PUENTE } from '../scripts/vw/comercio/puente.ts';
import { T1, T2, colecciones, item, webflowFalso } from './apoyo/webflow-falso.ts';

const conCambioSinPublicar = { lastUpdated: T2, lastPublished: T1 };

let puenteGuardado = '';
before(() => {
  puenteGuardado = readFileSync(ARCHIVO_PUENTE, 'utf8');
});
after(() => {
  writeFileSync(ARCHIVO_PUENTE, puenteGuardado);
});

test('sembrar --aplicar no escribe nada si Webflow tiene cambios sin publicar', async () => {
  const { sitio, escrituras } = webflowFalso({ fechas: conCambioSinPublicar });
  assert.equal(await sembrar(['--aplicar'], async () => sitio), 1);
  assert.deepEqual(escrituras, []);
});

test('sembrar --aplicar escribe cuando no hay nada pendiente', async () => {
  const { sitio, escrituras } = webflowFalso();
  await assert.rejects(
    sembrar(['--aplicar'], async () => sitio),
    /escritura detenida/
  );
  assert.deepEqual(escrituras, ['crearProducto']);
});

test('sembrar en seco no escribe aunque haya cambios', async () => {
  const { sitio, escrituras } = webflowFalso({ fechas: conCambioSinPublicar });
  assert.equal(await sembrar([], async () => sitio), 0);
  assert.deepEqual(escrituras, []);
});

test('puente --aplicar no publica si Webflow tiene cambios sin publicar', async () => {
  const { sitio, escrituras } = webflowFalso({ fechas: conCambioSinPublicar });
  assert.equal(await puente(['--aplicar'], async () => sitio), 1);
  assert.deepEqual(escrituras, []);
});

test('puente --aplicar escribe el código cuando no hay nada pendiente', async () => {
  const { sitio, escrituras } = webflowFalso();
  await assert.rejects(
    puente(['--aplicar'], async () => sitio),
    /escritura detenida/
  );
  assert.deepEqual(escrituras, ['escribirCodigoLibre']);
});

test('bajar aborta si a Webflow le falta un campo del modelo', async () => {
  const lista = colecciones();
  const bloques = lista.find((c) => c.slug === 'bloques')!;
  bloques.fields = bloques.fields.filter((f) => f.slug !== 'titulo');
  const { sitio } = webflowFalso({ colecciones: lista });
  await assert.rejects(bajar(sitio, leerSnapshot()), /le falta .*campo bloques\.titulo/);
});

test('bajar aborta si un campo cambió de tipo en Webflow', async () => {
  const lista = colecciones();
  const campo = lista.find((c) => c.slug === 'bloques')!.fields.find((f) => f.slug === 'texto')!;
  campo.type = 'RichText';
  const { sitio } = webflowFalso({ colecciones: lista });
  await assert.rejects(bajar(sitio, leerSnapshot()), /campo bloques\.texto con tipo RichText/);
});

test('bajar toma el producto publicado aunque su slug cambió sin publicar', async () => {
  const publicado = item('p1', {
    fieldData: { name: 'Layer Session', slug: 'layer-session', category: ['cat-asesorias'] },
  });
  const editado = item('p1', {
    lastUpdated: T2,
    fieldData: { name: 'Layer Session', slug: 'layer-session-nuevo', category: ['cat-asesorias'] },
  });
  const sku = item('s1', {
    fieldData: { slug: 'layer-session', product: 'p1', price: { value: 15000, unit: 'USD' } },
  });
  const { sitio } = webflowFalso({
    vivos: { product: [publicado], sku: [sku] },
    borradores: { product: [editado], sku: [sku] },
  });
  const { tabla, sinPublicar } = await bajar(sitio, leerSnapshot());
  assert.deepEqual(
    tabla.producto.map((p) => [p.id, p.precio, p.tipo]),
    [['layer-session', 15000, 'asesoria']]
  );
  assert.deepEqual(sinPublicar, ['product/layer-session-nuevo']);
});

test('bajar reporta el cambio del sitio que sembrar y puente se niegan a publicar', async () => {
  const { sitio } = webflowFalso({ fechas: conCambioSinPublicar });
  const { sinPublicar } = await bajar(sitio, leerSnapshot());
  assert.equal(sinPublicar.length, 1);
  assert.match(sinPublicar[0], /^sitio: /);
});
