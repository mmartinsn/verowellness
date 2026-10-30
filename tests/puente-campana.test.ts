import { test } from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { generarPuente } from '../scripts/vw/comercio/puente.ts';
import { leerSnapshot } from '../scripts/vw/comun/snapshot.ts';

const html = generarPuente(leerSnapshot(), 'https://veronicawellness.com/');
const cuerpo = html.slice(
  html.indexOf('<script>') + '<script>'.length,
  html.lastIndexOf('</script>')
);

const enPuente = (items: string, cupon: string, ahora: string) => {
  const final = /principal\(\);\s*\}\)\(\);\s*$/;
  assert.match(cuerpo, final);
  const codigo = cuerpo.replace(
    final,
    `globalThis.resultado = escribirItems(normalizarPedido(leerItems(${JSON.stringify(items)}), CATALOGO, ${JSON.stringify(cupon)}, new Date(${JSON.stringify(ahora)})));\n})();`
  );
  const contexto: { resultado?: string } = {};
  vm.runInNewContext(codigo, contexto);
  return contexto.resultado;
};

test('el puente generado aplica Black Friday con la regla del repo', () => {
  assert.equal(
    enPuente(
      '184-igg-food-sensitivity-panel,layer-session',
      'BLACKFRIDAY',
      '2026-11-02T12:00:00-05:00'
    ),
    '184-igg-food-sensitivity-panel-black-friday,layer-session-black-friday,cargo-laboratorio'
  );
});

test('el puente generado no aplica la campaña antes de noviembre', () => {
  assert.equal(
    enPuente(
      '184-igg-food-sensitivity-panel,layer-session',
      'BLACKFRIDAY',
      '2026-10-31T23:00:00-04:00'
    ),
    '184-igg-food-sensitivity-panel,layer-session,cargo-laboratorio'
  );
});
