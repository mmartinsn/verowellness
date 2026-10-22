import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { sesionKlarna, urlDeVuelta } from '../src/lib/comercio/cobro.ts';
import { leerItems, normalizarPedido } from '../src/lib/comercio/reglas.ts';
import { catalogoCobro, generarCobro, versionDe } from '../scripts/vw/comercio/cobro.ts';
import { catalogoDe } from '../scripts/vw/comercio/puente.ts';
import { leerSnapshot } from '../scripts/vw/comun/snapshot.ts';

const tabla = leerSnapshot();
const catalogo = catalogoDe(tabla);
const productos = catalogoCobro(tabla);
const opciones = {
  volver: 'https://veronicawellness.com/',
  cancelar: 'https://veronicawellness.com/checkout/tienda/',
};
const examenes = tabla.producto.filter((p) => p.tipo === 'examen').map((p) => p.id);

const sesion = (items: string, email?: string) =>
  sesionKlarna(normalizarPedido(leerItems(items), catalogo), productos, { ...opciones, email });

function lineas(s: URLSearchParams) {
  const salida: { producto: string; cantidad: number; centavos: number; nombre: string }[] = [];
  for (let i = 0; s.has(`line_items[${i}][quantity]`); i++)
    salida.push({
      producto: s.get(`line_items[${i}][price_data][product_data][metadata][producto]`)!,
      cantidad: Number(s.get(`line_items[${i}][quantity]`)),
      centavos: Number(s.get(`line_items[${i}][price_data][unit_amount]`)),
      nombre: s.get(`line_items[${i}][price_data][product_data][name]`)!,
    });
  return salida.filter((l) => l.producto !== 'impuesto');
}

const impuesto = (s: URLSearchParams) => {
  for (let i = 0; s.has(`line_items[${i}][quantity]`); i++)
    if (s.get(`line_items[${i}][price_data][product_data][metadata][producto]`) === 'impuesto')
      return Number(s.get(`line_items[${i}][price_data][unit_amount]`));
  return 0;
};

test('una asesoría: solo Klarna, en español, a su página de gracias y sin pedir envío', () => {
  const s = sesion('initial-layer-cycle')!;
  assert.equal(s.get('mode'), 'payment');
  assert.equal(s.get('payment_method_types[0]'), 'klarna');
  assert.equal(s.has('payment_method_types[1]'), false);
  assert.equal(s.get('locale'), 'es-419');
  assert.equal(s.get('success_url'), 'https://veronicawellness.com/gracias/initial-layer-cycle/');
  assert.equal(s.get('cancel_url'), opciones.cancelar);
  assert.equal(s.has('shipping_address_collection[allowed_countries][0]'), false);
  assert.deepEqual(lineas(s), [
    {
      producto: 'initial-layer-cycle',
      cantidad: 1,
      centavos: productos['initial-layer-cycle'].precio,
      nombre: 'Initial Layer Cycle',
    },
  ]);
});

test('cada línea lleva el precio y el nombre del snapshot', () => {
  for (const p of tabla.producto.filter((x) => x.tipo !== 'cargo')) {
    const s = sesionKlarna([{ producto: p.id, cantidad: 1 }], productos, opciones);
    if (!s) continue;
    const [linea] = lineas(s);
    assert.equal(linea.centavos, p.precio, p.id);
    assert.equal(linea.nombre, p.nombre, p.id);
  }
});

test('exámenes con lectura: cargo de laboratorio por examen, envío solo a EE. UU. y lectura marcada', () => {
  const s = sesion(`${examenes[0]},${examenes[1]},cargo-laboratorio:9,layer-session`)!;
  const ls = lineas(s);
  assert.deepEqual(
    ls.find((l) => l.producto === 'cargo-laboratorio'),
    {
      producto: 'cargo-laboratorio',
      cantidad: 2,
      centavos: 2500,
      nombre: 'Cargo del laboratorio (servicio y autorización)',
    }
  );
  assert.equal(s.get('shipping_address_collection[allowed_countries][0]'), 'US');
  assert.equal(s.has('shipping_address_collection[allowed_countries][1]'), false);
  assert.equal(s.get('success_url'), 'https://veronicawellness.com/gracias/examenes/?lectura=1');
  assert.equal(
    s.get('metadata[items]'),
    `${examenes[0]},${examenes[1]},layer-session,cargo-laboratorio:2`
  );
  assert.equal(s.get('payment_intent_data[metadata][items]'), s.get('metadata[items]'));
});

test('sin línea de impuesto: el 7 % ya va en el precio (desde el 21-oct)', () => {
  assert.equal(impuesto(sesion('initial-layer-cycle')!), 0);
  assert.equal(
    impuesto(
      sesion(
        `${examenes[0]},${examenes[1]},cargo-laboratorio:9,layer-session,recetario-30-desayunos`
      )!
    ),
    0
  );
});

test('guías con la oferta del popup: van a la tienda con sus guías', () => {
  const s = sesion('recetario-30-desayunos,hackear-tu-cerebro-oferta')!;
  const gracias = new URL(s.get('success_url')!);
  assert.equal(gracias.pathname, '/gracias/tienda/');
  assert.equal(gracias.searchParams.get('guias'), 'recetario-30-desayunos,hackear-tu-cerebro');
  assert.deepEqual(
    lineas(s).map((l) => [l.producto, l.centavos]),
    [
      ['recetario-30-desayunos', 1999],
      ['hackear-tu-cerebro-oferta', 849],
    ]
  );
  assert.deepEqual(
    lineas(sesion('recetario-30-desayunos,guia-hormonas-30-oferta')!).map((l) => l.producto),
    ['recetario-30-desayunos'],
    'la oferta de una guía «Próximamente» no se vende'
  );
});

test('el email del paso 1 llega a Stripe; sin email, Stripe lo pide', () => {
  assert.equal(
    sesion('layer-session', 'ana@example.com')!.get('customer_email'),
    'ana@example.com'
  );
  assert.equal(sesion('layer-session')!.has('customer_email'), false);
});

test('si cancela, vuelve al checkout de donde vino y nunca fuera del sitio', () => {
  const volver = 'https://veronicawellness.com/';
  assert.equal(
    urlDeVuelta('/checkout/examenes/', volver),
    'https://veronicawellness.com/checkout/examenes/'
  );
  for (const raro of [
    null,
    '',
    '//evil.com/x',
    'https://evil.com/',
    '/x?y=1',
    '/../a.b',
    'checkout',
  ])
    assert.equal(urlDeVuelta(raro, volver), volver, String(raro));
});

test('un pedido vacío o con un producto que no vendemos no arma sesión', () => {
  assert.equal(sesion(''), null);
  assert.equal(sesion('algo-que-no-vendemos'), null);
  assert.equal(
    sesionKlarna([{ producto: 'algo-que-no-vendemos', cantidad: 1 }], productos, opciones),
    null
  );
});

test('el módulo generado es estable y hace lo mismo que el código del repo', async () => {
  const generado = generarCobro(tabla, opciones.volver);
  assert.equal(generarCobro(tabla, opciones.volver), generado);
  assert.match(versionDe(generado) ?? '', /^[0-9a-f]{16}$/);
  assert.notEqual(versionDe(generarCobro(tabla, 'https://otro.example.com/')), versionDe(generado));
  const archivo = path.join(mkdtempSync(path.join(tmpdir(), 'vw-cobro-')), 'generado.ts');
  writeFileSync(archivo, generado);
  const m = await import(pathToFileURL(archivo).href);
  const items = `${examenes[2]},hackear-tu-cerebro,hackear-tu-cerebro-oferta,next-layer-cycle`;
  const desdeGenerado = m.sesionKlarna(
    m.normalizarPedido(m.leerItems(items), m.CATALOGO),
    m.PRODUCTOS,
    opciones
  );
  assert.equal(desdeGenerado.toString(), sesion(items)!.toString());
  assert.equal(m.VOLVER, opciones.volver);
  assert.equal(m.COOKIE_TRASPASO, 'vw_caja');
});
