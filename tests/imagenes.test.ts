import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { carpetasImagen } from '../src/modelo/esquema.ts';

test('el glob literal que exige Vite cubre las carpetas de imagen del modelo', () => {
  const fuente = readFileSync('src/lib/datos/imagenes.ts', 'utf8');
  const glob = fuente.match(/\/src\/assets\/\{([^}]+)\}\//)?.[1];
  assert.ok(glob, 'no encontré el glob de src/assets en src/lib/datos/imagenes.ts');
  assert.deepEqual(glob.split(',').sort(), carpetasImagen());
});
