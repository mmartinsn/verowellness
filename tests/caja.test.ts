import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import {
  CODIGO_PAIS,
  cookieTraspaso,
  dominioCompartido,
  leerTraspaso,
  limpiarCupon,
} from '../src/lib/comercio/traspaso.ts';
import { generarCaja } from '../scripts/vw/comercio/caja.ts';

test('el sitio y la caja comparten veronicawellness.com; dominios ajenos no comparten nada', () => {
  assert.equal(
    dominioCompartido('veronicawellness.com', 'pago.veronicawellness.com'),
    'veronicawellness.com'
  );
  assert.equal(
    dominioCompartido('pago.veronicawellness.com', 'veronicawellness.com'),
    'veronicawellness.com'
  );
  assert.equal(dominioCompartido('mmartinsn.github.io', 'pago.veronicawellness.com'), null);
  assert.equal(dominioCompartido('localhost', 'pago.veronicawellness.com'), null);
});

test('cada país del checkout tiene su código de Webflow, salvo «Otro»', () => {
  const fuente = readFileSync('src/components/checkout/Checkout.astro', 'utf8');
  const lista = fuente.match(/const paises = \[([^\]]+)\]/)![1];
  const paises = [...lista.matchAll(/'([^']+)'/g)].map((m) => m[1]).filter((p) => p !== 'Otro');
  assert.deepEqual(
    paises.filter((p) => !CODIGO_PAIS[p]),
    []
  );
});

test('lo que viaja se limpia y se lee de vuelta; lo inválido no viaja', () => {
  assert.equal(limpiarCupon('  PACIENTE 10 '), 'PACIENTE10');
  const cookie = cookieTraspaso(
    { cupon: ' Vero 10% ', email: 'ana@correo.com', nombre: ' Ana   Pérez ', pais: 'VE' },
    'veronicawellness.com'
  );
  assert.match(cookie, /domain=veronicawellness\.com/);
  assert.match(cookie, /max-age=1800/);
  const par = cookie.split(';')[0];
  assert.deepEqual(leerTraspaso(`otra=1; ${par}; x=2`), {
    cupon: 'Vero10%',
    email: 'ana@correo.com',
    nombre: 'Ana Pérez',
    pais: 'VE',
  });
  const malo = cookieTraspaso({ email: 'no-es-email', pais: 'Venezuela' }, null).split(';')[0];
  assert.equal(malo, 'vw_caja=');
  assert.equal(leerTraspaso('otra=1'), null);
  assert.equal(leerTraspaso('vw_caja=%E0%A4%A'), null);
});

test('sin nada que llevar, la cookie se borra con max-age=0 en el mismo dominio', () => {
  const cookie = cookieTraspaso(null, 'veronicawellness.com');
  assert.match(cookie, /^vw_caja=;/);
  assert.match(cookie, /max-age=0/);
  assert.match(cookie, /domain=veronicawellness\.com/);
});

class Elemento {
  value = '';
  style: Record<string, string> & { removeProperty?: (p: string) => void } = {};
  eventos: string[] = [];
  textContent = '';
  dispatchEvent(e: { type: string }) {
    this.eventos.push(e.type);
  }
  setAttribute() {}
  addEventListener() {}
  append() {}
  before() {}
  focus() {}
}
class Entrada extends Elemento {}
class Seleccion extends Elemento {
  options = [{ value: 'US' }, { value: 'VE' }];
}

test('la caja rellena email, nombre y país, resume el email, aplica el código y borra la cookie', async () => {
  const email = new Entrada();
  const nombre = new Entrada();
  const pais = new Seleccion();
  const cupon = new Entrada();
  const enviados: string[] = [];
  const formulario = {
    requestSubmit: () => {
      enviados.push(cupon.value);
      cupon.value = '';
    },
  };
  Object.assign(cupon, { form: formulario });
  const bloqueCliente = new Elemento();
  const cookies: string[] = [];
  const valor = encodeURIComponent(
    JSON.stringify({
      cupon: 'VEROPRUEBA',
      email: 'ana@correo.com',
      nombre: 'Ana Pérez',
      pais: 'VE',
    })
  );
  const document = {
    get cookie() {
      return `vw_caja=${valor}`;
    },
    set cookie(v: string) {
      cookies.push(v);
    },
    getElementById: (id: string) =>
      ({ 'wf-ecom-email': email, 'wf-ecom-billing-name': nombre, 'wf-ecom-billing-country': pais })[
        id
      ] ?? null,
    querySelector: (sel: string) =>
      sel.includes('discountsinput')
        ? cupon
        : sel.includes('summarytotal')
          ? { textContent: '$ 150.00 USD' }
          : sel.includes('customerinfowrapper')
            ? bloqueCliente
            : null,
    createElement: () => new Elemento(),
  };
  vm.runInNewContext(generarCaja().replace(/^<script>|<\/script>\s*$/g, ''), {
    document,
    window: { Webflow: {} },
    location: { hostname: 'pago.veronicawellness.com' },
    Event: class {
      type: string;
      constructor(type: string) {
        this.type = type;
      }
    },
    HTMLSelectElement: Seleccion,
    setTimeout,
    Date,
    JSON,
    encodeURIComponent,
    decodeURIComponent,
  });
  await new Promise((r) => setTimeout(r, 2400));
  assert.equal(email.value, 'ana@correo.com');
  assert.deepEqual(email.eventos, ['input', 'change']);
  assert.equal(nombre.value, 'Ana Pérez');
  assert.equal(pais.value, 'VE');
  assert.equal(bloqueCliente.style.display, 'none');
  assert.deepEqual(enviados, ['VEROPRUEBA']);
  assert.equal(cookies.length, 1);
  assert.match(cookies[0], /^vw_caja=;.*max-age=0.*domain=veronicawellness\.com/);
});
