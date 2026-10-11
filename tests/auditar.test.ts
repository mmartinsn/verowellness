import { test } from 'node:test';
import assert from 'node:assert/strict';
import { auditarComercio } from '../scripts/vw/auditar/comercio.ts';
import { colecciones } from '../scripts/vw/auditar/limites.ts';
import { estadoEnlace } from '../scripts/vw/auditar/sitio.ts';
import { coleccionesCms } from '../scripts/vw/webflow/esquema.ts';

test('un enlace externo está caído con 404, 410, 5xx o sin respuesta; 401, 403 y 429 bloquean robots', () => {
  assert.equal(estadoEnlace(200), 'vivo');
  assert.equal(estadoEnlace(301), 'vivo');
  for (const s of [401, 403, 429]) assert.equal(estadoEnlace(s), 'bloquea robots');
  for (const s of [400, 404, 410, 500, 503]) assert.equal(estadoEnlace(s), 'caído');
  assert.equal(estadoEnlace(null), 'caído');
});

const delModelo = () => [...coleccionesCms().map((e) => e.coleccion), 'product', 'sku', 'category'];

test('las colecciones que pide el modelo están en orden aunque pasen del 80 % del plan', () => {
  const v = colecciones(delModelo(), 20);
  assert.equal(v.estado, 'ok');
  assert.equal(v.valor, '17/20');
});

test('una colección de más o de menos en Webflow es un hallazgo', () => {
  assert.match(colecciones([...delModelo(), 'pruebas'], 20).detalle ?? '', /sobran pruebas/);
  assert.match(
    colecciones(
      delModelo().filter((c) => c !== 'bloques'),
      20
    ).detalle ?? '',
    /faltan bloques/
  );
});

test('sin credenciales la auditoría anota un error de medición en vez de caerse', async () => {
  const antes = process.env.WEBFLOW_SITE_ID;
  delete process.env.WEBFLOW_SITE_ID;
  try {
    const lista = await auditarComercio({ conWebflow: true, conBuild: false });
    const conexion = lista.find((v) => v.nombre === 'conexión con Webflow');
    assert.equal(conexion?.estado, 'error');
    assert.match(conexion?.detalle ?? '', /WEBFLOW_SITE_ID/);
  } finally {
    if (antes !== undefined) process.env.WEBFLOW_SITE_ID = antes;
  }
});
