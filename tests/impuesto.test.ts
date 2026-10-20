import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  aCentavos,
  conImpuesto,
  desdeCentavos,
  impuestoCentavos,
  TAX_RATE,
} from '../src/lib/precio.ts';
import { impuestoDe, NOMBRE_IMPUESTO } from '../src/lib/comercio/cobro.ts';
import { catalogoCobro } from '../scripts/vw/comercio/cobro.ts';
import { leerSnapshot } from '../scripts/vw/comun/snapshot.ts';

const tabla = leerSnapshot();
const productos = catalogoCobro(tabla);
const deTipo = (tipo: string) => tabla.producto.filter((p) => p.tipo === tipo);
const resumenDelSitio = (precios: number[]) =>
  desdeCentavos(impuestoCentavos(aCentavos(precios.reduce((t, p) => t + p, 0))));

test('el 7 % va sobre exámenes y asesorías; guías, ofertas y el cargo del laboratorio no llevan', () => {
  for (const tipo of ['examen', 'asesoria'])
    for (const p of deTipo(tipo)) assert.equal(conImpuesto(p.tipo as string), true, p.id);
  for (const tipo of ['guia', 'oferta', 'cargo'])
    for (const p of deTipo(tipo)) assert.equal(conImpuesto(p.tipo as string), false, p.id);
  assert.equal(conImpuesto(undefined), false);
});

test('se redondea una vez sobre la base gravada, en centavos', () => {
  assert.equal(TAX_RATE, 0.07);
  assert.equal(impuestoCentavos(26900), 1883);
  assert.equal(impuestoCentavos(19980 * 2), 2797);
  assert.equal(NOMBRE_IMPUESTO, 'Impuesto (7 %)');
});

test('el resumen del sitio y Klarna dan el mismo impuesto para cada asesoría y cada examen', () => {
  for (const p of [...deTipo('asesoria'), ...deTipo('examen')]) {
    const centavos = p.precio as number;
    assert.equal(
      aCentavos(resumenDelSitio([desdeCentavos(centavos)])),
      impuestoDe([{ producto: p.id, cantidad: 1 }], productos),
      p.id
    );
  }
});

test('asesoría con guía en oferta: el sitio y Klarna solo gravan la asesoría', () => {
  const [oferta] = deTipo('oferta');
  const lineas = [
    { producto: 'initial-layer-cycle', cantidad: 1 },
    { producto: oferta.id, cantidad: 1 },
  ];
  const sitio = resumenDelSitio([desdeCentavos(productos['initial-layer-cycle'].precio)]);
  assert.equal(aCentavos(sitio), impuestoDe(lineas, productos));
  assert.equal(impuestoDe(lineas, productos), impuestoCentavos(26900));
});

test('exámenes con lectura y cargo: el cargo queda fuera de la base', () => {
  const [a, b] = deTipo('examen');
  const lineas = [
    { producto: a.id, cantidad: 1 },
    { producto: b.id, cantidad: 1 },
    { producto: 'layer-session', cantidad: 1 },
    { producto: 'cargo-laboratorio', cantidad: 2 },
  ];
  const base = (a.precio as number) + (b.precio as number) + productos['layer-session'].precio;
  assert.equal(impuestoDe(lineas, productos), impuestoCentavos(base));
});

test('solo guías: sin impuesto', () => {
  const lineas = deTipo('guia').map((g) => ({ producto: g.id, cantidad: 1 }));
  assert.equal(impuestoDe(lineas, productos), 0);
});
