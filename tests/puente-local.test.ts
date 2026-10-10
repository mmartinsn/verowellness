import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sustituirPuente } from '../scripts/vw/comercio/probar-puente.ts';

const publicado = (salto: string) =>
  `<body><main>Pedido</main><style>body{margin:0}</style>${salto}<script>${salto}(() => {${salto}viejo();${salto}})();${salto}</script>${salto}<script>otro()</script></body>`;

test('el puente publicado se reemplaza por el local y lo demás queda igual', () => {
  const salida = sustituirPuente(publicado('\n'), '<style>body{margin:0}</style>\nLOCAL\n');
  assert.equal(
    salida,
    '<body><main>Pedido</main><style>body{margin:0}</style>\nLOCAL\n<script>otro()</script></body>'
  );
});

test('también con saltos de línea de Windows', () => {
  const salida = sustituirPuente(publicado('\r\n'), 'LOCAL');
  assert.ok(salida.includes('LOCAL') && !salida.includes('viejo()'));
});

test('sin el puente publicado no se finge una inyección', () => {
  assert.throws(() => sustituirPuente('<body>sin puente</body>', 'LOCAL'), /no trae el puente/);
});
