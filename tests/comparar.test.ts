import { test } from 'node:test';
import assert from 'node:assert/strict';
import { comparar, exportsComparables } from '../scripts/vw/comun/comparar.ts';

const modulo = {
  lista: [1, 2],
  total: () => 3,
  doble: (n: number) => n * 2,
  sinEntradas: (s: string) => s,
};

test('una función con parámetros se compara con las entradas declaradas', async () => {
  const { valores, sinEntradas } = await exportsComparables(modulo, {
    doble: (m) => m.lista as number[],
  });
  assert.deepEqual(valores, { lista: [1, 2], 'total()': 3, 'doble(…)': [2, 4] });
  assert.deepEqual(sinEntradas, ['sinEntradas']);
});

test('un cambio en lo que devuelve una función con parámetros es una diferencia', async () => {
  const antes = await exportsComparables(modulo, { doble: () => [5] });
  const despues = await exportsComparables(
    { ...modulo, doble: (n: number) => n * 3 },
    { doble: () => [5] }
  );
  assert.deepEqual(comparar(antes.valores, despues.valores), [
    { ruta: '$.doble(…)[0]', antes: '10', despues: '15' },
  ]);
});
