import { test } from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { destinoGracias, type CatalogoGracias } from '../src/lib/comercio/confirmacion.ts';
import { catalogoGracias, generarConfirmacion } from '../scripts/vw/comercio/confirmacion.ts';
import { leerSnapshot } from '../scripts/vw/comun/snapshot.ts';

const tabla = leerSnapshot();
const catalogo = catalogoGracias(tabla);
const nombre = (id: string) => tabla.producto.find((p) => p.id === id)!.nombre as string;
const examen = tabla.producto.find((p) => p.tipo === 'examen')!.id;

test('cada producto del snapshot está en el catálogo por su nombre, y cada oferta apunta a su guía', () => {
  assert.equal(Object.keys(catalogo.porNombre).length, tabla.producto.length);
  for (const g of tabla.guia) {
    assert.equal(
      destinoGracias([nombre(g.producto as string)], [], catalogo),
      `gracias/tienda/?guias=${g.id}`
    );
    if (g.oferta)
      assert.equal(
        destinoGracias([nombre(g.oferta as string)], [], catalogo),
        `gracias/tienda/?guias=${g.id}`
      );
  }
});

test('una asesoría va a su página de gracias, cuyo nombre es el id de la asesoría', () => {
  for (const a of tabla.asesoria)
    assert.equal(destinoGracias([nombre(a.id)], [], catalogo), `gracias/${a.id}/`);
});

test('con un examen va a la de exámenes; con una asesoría además, marca la lectura', () => {
  assert.equal(destinoGracias([nombre(examen)], [], catalogo), 'gracias/examenes/');
  assert.equal(
    destinoGracias(
      [nombre(examen), nombre('cargo-laboratorio'), nombre('layer-session')],
      [],
      catalogo
    ),
    'gracias/examenes/?lectura=1'
  );
});

test('los nombres se comparan sin mayúsculas ni espacios de más; uno desconocido no redirige', () => {
  assert.equal(destinoGracias(['  LAYER   session '], [], catalogo), 'gracias/layer-session/');
  assert.equal(destinoGracias(['Algo que no vendemos'], [], catalogo), null);
  assert.equal(destinoGracias([], [], catalogo), null);
});

test('las descargas solo pasan con nombre y https, como lista JSON', () => {
  const destino = destinoGracias(
    [nombre('hackear-tu-cerebro')],
    [
      { nombre: 'Guía', url: 'https://cdn.example.com/a.pdf' },
      { nombre: 'Guía', url: 'http://cdn.example.com/b.pdf' },
      { nombre: '', url: 'https://cdn.example.com/c.pdf' },
    ],
    catalogo
  )!;
  const q = new URLSearchParams(destino.split('?')[1]);
  assert.deepEqual(JSON.parse(q.get('descargas')!), [
    { nombre: 'Guía', url: 'https://cdn.example.com/a.pdf' },
  ]);
});

function correrGenerado(nombres: string[]): Promise<string | null> {
  const codigo = generarConfirmacion(tabla, 'https://veronicawellness.com/').match(
    /<script>([\s\S]*)<\/script>/
  )![1];
  let destino: string | null = null;
  const nodos = nombres.map((n) => ({ textContent: n }));
  const documento = {
    querySelectorAll: (selector: string) => (selector.includes('downloads') ? [] : nodos),
  };
  vm.runInNewContext(codigo, {
    document: documento,
    location: { replace: (url: string) => (destino = url) },
    setTimeout,
    Date,
    URLSearchParams,
    JSON,
  });
  return new Promise((r) => setTimeout(() => r(destino), 20));
}

test('el script generado lee los nombres de la confirmación y redirige a la página de gracias', async () => {
  assert.equal(
    await correrGenerado(['Initial Layer Cycle']),
    'https://veronicawellness.com/gracias/initial-layer-cycle/'
  );
  assert.equal(await correrGenerado(['Algo que no vendemos']), null);
});

test('el script generado no trae import, export ni declare', () => {
  const html = generarConfirmacion(tabla, 'https://veronicawellness.com/');
  assert.doesNotMatch(html, /^\s*(import|export|declare)\b/m);
  const catalogoEnElScript = JSON.parse(
    html.match(/const CATALOGO = (.*);/)![1]
  ) as CatalogoGracias;
  assert.deepEqual(catalogoEnElScript, catalogo);
});
