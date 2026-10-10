import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ClienteWebflow, ErrorWebflow, segundosDeEspera } from '../scripts/vw/webflow/cliente.ts';

type Paso = Response | Error;

function cliente(pasos: Paso[]) {
  const pedidos: string[] = [];
  const esperas: number[] = [];
  const c = new ClienteWebflow(
    { token: 't', sitio: 's' },
    {
      intervalo: 0,
      espera: async (ms) => {
        esperas.push(ms);
      },
      fetch: async (url, init) => {
        pedidos.push(`${init?.method} ${String(url).replace('https://api.webflow.com/v2', '')}`);
        const paso = pasos.shift();
        if (!paso) throw new Error('sin más respuestas');
        if (paso instanceof Error) throw paso;
        return paso;
      },
    }
  );
  return { c, pedidos, esperas };
}

const json = (cuerpo: unknown, estado = 200, cabeceras: Record<string, string> = {}) =>
  new Response(JSON.stringify(cuerpo), { status: estado, headers: cabeceras });

test('un POST que da 5xx no se reintenta: podría haber creado el ítem', async () => {
  const { c, pedidos } = cliente([json({ m: 'caído' }, 502), json({ id: 'x' })]);
  await assert.rejects(c.post('/collections/a/items', {}), (e: ErrorWebflow) => e.estado === 502);
  assert.equal(pedidos.length, 1);
});

test('un GET que da 5xx se reintenta', async () => {
  const { c, pedidos } = cliente([json({}, 503), json({ ok: 1 })]);
  assert.deepEqual(await c.get('/sites/s'), { ok: 1 });
  assert.equal(pedidos.length, 2);
});

test('un 429 se reintenta en cualquier método y respeta Retry-After en segundos', async () => {
  const { c, pedidos, esperas } = cliente([
    json({}, 429, { 'retry-after': '7' }),
    json({ id: 'x' }),
  ]);
  assert.deepEqual(await c.post('/collections/a/items', {}), { id: 'x' });
  assert.equal(pedidos.length, 2);
  assert.deepEqual(esperas, [7000]);
});

test('Retry-After en formato fecha se convierte en segundos, no en NaN', () => {
  const ahora = Date.parse('2026-10-10T12:00:00Z');
  assert.equal(segundosDeEspera('Sat, 10 Oct 2026 12:00:30 GMT', 1, ahora), 30);
  assert.equal(segundosDeEspera('basura', 3, ahora), 8);
  assert.equal(segundosDeEspera(null, 2, ahora), 4);
});

test('un error de red se reintenta en un GET y no en un POST', async () => {
  const get = cliente([new TypeError('fetch failed'), json({ ok: 1 })]);
  assert.deepEqual(await get.c.get('/sites/s'), { ok: 1 });
  const post = cliente([new TypeError('fetch failed'), json({ id: 'x' })]);
  await assert.rejects(post.c.post('/collections/a/items', {}), /fetch failed/);
  assert.equal(post.pedidos.length, 1);
});

test('tras agotar los reintentos el error trae el estado y el cuerpo', async () => {
  const { c, pedidos } = cliente(Array.from({ length: 6 }, () => json({ m: 'lento' }, 429)));
  await assert.rejects(
    c.get('/sites/s'),
    (e: ErrorWebflow) => e.estado === 429 && /lento/.test(e.message)
  );
  assert.equal(pedidos.length, 6);
});

test('sin pagination sigue pidiendo mientras lleguen lotes llenos', async () => {
  const lleno = Array.from({ length: 100 }, (_, i) => ({ id: i }));
  const { c, pedidos } = cliente([json({ items: lleno }), json({ items: [{ id: 100 }] })]);
  assert.equal((await c.todas('/collections/a/items', 'items')).length, 101);
  assert.deepEqual(pedidos, [
    'GET /collections/a/items?limit=100&offset=0',
    'GET /collections/a/items?limit=100&offset=100',
  ]);
});

test('con pagination se detiene en el total', async () => {
  const lleno = Array.from({ length: 100 }, (_, i) => ({ id: i }));
  const { c, pedidos } = cliente([json({ items: lleno, pagination: { total: 100 } })]);
  assert.equal((await c.todas('/collections/a/items', 'items')).length, 100);
  assert.equal(pedidos.length, 1);
});
