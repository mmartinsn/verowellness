import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scriptJsonLd } from '../src/lib/json-ld.ts';

test('un texto de Webflow no puede cerrar el script del JSON-LD', () => {
  const nombre = '</script><img src=x onerror=alert(1)>';
  const salida = scriptJsonLd([{ '@type': 'Question', name: nombre }]);
  assert.ok(!salida.includes('<'));
  assert.equal(JSON.parse(salida)['@graph'][0].name, nombre);
});
