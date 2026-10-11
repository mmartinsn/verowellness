import { test } from 'node:test';
import assert from 'node:assert/strict';
import { describir } from '../scripts/vw/comandos/dominio.ts';
import { comparar, normalizar, valoresDoh } from '../scripts/vw/dominio/dns.ts';
import { DOMINIO, fqdn, REGISTROS, SUBDOMINIO_PAGO } from '../scripts/vw/dominio/registros.ts';

test('los valores se comparan sin mayúsculas ni punto final', () => {
  assert.equal(normalizar('Key1.Systeme.io.'), 'key1.systeme.io');
  assert.deepEqual(comparar(['key1.systeme.io'], ['KEY1.systeme.io.']), {
    estado: 'ok',
    faltan: [],
    sobran: [],
  });
});

test('sin registros es «falta»; con otros valores es «distinto» y dice cuáles', () => {
  const esperado = ['185.199.108.153', '185.199.109.153'];
  assert.equal(comparar(esperado, []).estado, 'falta');
  const c = comparar(esperado, ['185.199.108.153', '3.33.130.190']);
  assert.equal(c.estado, 'distinto');
  assert.equal(describir(c), 'faltan 185.199.109.153 · sobran 3.33.130.190');
});

test('DNS sobre HTTPS: sin dominio no hay valores; solo cuenta el tipo pedido; TXT sin comillas', () => {
  assert.deepEqual(valoresDoh('CNAME', { Status: 3 }), []);
  assert.deepEqual(
    valoresDoh('A', {
      Status: 0,
      Answer: [
        { type: 5, data: 'veronicawellness.com.' },
        { type: 1, data: '3.33.130.190' },
      ],
    }),
    ['3.33.130.190']
  );
  assert.deepEqual(
    valoresDoh('TXT', {
      Status: 0,
      Answer: [
        { type: 16, data: '"v=spf1 include:_spf.google.com ~all"' },
        { type: 16, data: '"parte uno " "parte \\"dos\\""' },
      ],
    }),
    ['v=spf1 include:_spf.google.com ~all', 'parte uno parte "dos"']
  );
  assert.throws(() => valoresDoh('A', { Status: 2 }), /DNS respondió 2/);
});

test('el orden no importa: los registros son conjuntos', () => {
  assert.equal(comparar(['b', 'a'], ['a', 'b']).estado, 'ok');
});

test('los nombres salen del dominio de despliegue.ts', () => {
  assert.equal(fqdn('@'), DOMINIO);
  assert.equal(fqdn('www'), `www.${DOMINIO}`);
  assert.ok(REGISTROS.some((r) => r.tipo === 'CNAME' && r.nombre === SUBDOMINIO_PAGO));
});

test('el correo y Systeme.io de Verónica están declarados como intocables', () => {
  const intocables = REGISTROS.filter((r) => r.intocable).map((r) => `${r.tipo} ${r.nombre}`);
  for (const r of [
    'MX @',
    'TXT @',
    'TXT _dmarc',
    'A mail',
    'CNAME systemeio1._domainkey',
    'CNAME systemeio2._domainkey',
  ])
    assert.ok(intocables.includes(r), r);
  assert.ok(!REGISTROS.some((r) => r.intocable && r.nombre === 'www'));
});
