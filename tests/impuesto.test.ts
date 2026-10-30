import { test } from 'node:test';
import assert from 'node:assert/strict';
import { conImpuesto, desglose } from '../src/lib/precio.ts';
import { impuestoDe } from '../src/lib/comercio/cobro.ts';
import { productosDeCampana } from '../src/lib/comercio/reglas.ts';
import { campanas } from '../src/data/campanas.ts';
import { catalogoCobro } from '../scripts/vw/comercio/cobro.ts';
import { leerSnapshot } from '../scripts/vw/comun/snapshot.ts';

// Since 2026-10-21 the 7 % is included in the price of tests and consultations, rounded to the
// dollar (Mari and Verónica), so nothing carries tax on top: not the site's summary, not Klarna,
// not Webflow's own calculation.
const tabla = leerSnapshot();
const productos = catalogoCobro(tabla);
const deTipo = (tipo: string) => tabla.producto.filter((p) => p.tipo === tipo);

test('ningún tipo lleva impuesto aparte: el 7 % va dentro del precio', () => {
  for (const tipo of ['examen', 'asesoria', 'guia', 'oferta', 'cargo'])
    for (const p of deTipo(tipo)) assert.equal(conImpuesto(p.tipo as string), false, p.id);
  assert.equal(desglose(288).impuesto, 0);
  assert.equal(desglose(288).total, 288);
});

test('exámenes y asesorías cuestan dólares enteros y no le piden impuesto a Webflow', () => {
  const deCampana = new Set(productosDeCampana(campanas));
  for (const p of [...deTipo('examen'), ...deTipo('asesoria')]) {
    if (!deCampana.has(p.id)) assert.equal((p.precio as number) % 100, 0, `${p.id}: ${p.precio}`);
    assert.equal(p.impuesto, 'standard-exempt', p.id);
  }
  assert.equal(productos['initial-layer-cycle'].precio, 28800);
  assert.equal(productos['layer-session'].precio, 16100);
});

test('Klarna no suma impuesto a ningún pedido', () => {
  const [a, b] = deTipo('examen');
  const lineas = [
    { producto: a.id, cantidad: 1 },
    { producto: b.id, cantidad: 1 },
    { producto: 'layer-session', cantidad: 1 },
    { producto: 'cargo-laboratorio', cantidad: 2 },
    ...deTipo('guia').map((g) => ({ producto: g.id, cantidad: 1 })),
  ];
  assert.equal(impuestoDe(lineas, productos), 0);
});
