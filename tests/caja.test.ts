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
import { ERRORES, ES, generarCaja } from '../scripts/vw/comercio/caja.ts';

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
    querySelectorAll: () => [],
    createTreeWalker: () => ({ nextNode: () => null }),
    documentElement: { lang: 'en', classList: { add() {} } },
    body: { prepend() {}, append() {} },
  };
  vm.runInNewContext(generarCaja().replace(/^<style>.*<\/style>\n<script>|<\/script>\s*$/gs, ''), {
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
    NodeFilter: { SHOW_TEXT: 4 },
    MutationObserver: class {
      observe() {}
    },
    Intl,
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

test('la caja queda en español: textos, errores, el botón y la línea del descuento', () => {
  const nodos = [
    'Customer Info',
    '  Order Summary ',
    'Place Order',
    'Discount (VEROPRUEBA)',
    '$ 150.00 USD',
    'Total',
  ].map((nodeValue) => ({ nodeValue }));
  const errores = new Map<string, string>();
  const boton = new Map([['data-loading-text', 'Placing Order...']]);
  const conAtributos = (m: Map<string, string>) => ({
    getAttribute: (a: string) => m.get(a) ?? null,
    setAttribute: (a: string, v: string) => m.set(a, v),
  });
  const html = {
    lang: 'en',
    clases: [] as string[],
    classList: { add: (c: string) => html.clases.push(c) },
  };
  const document = {
    documentElement: html,
    body: { prepend() {}, append() {} },
    querySelector: () => null,
    querySelectorAll: (sel: string) =>
      sel === '[data-loading-text]'
        ? [conAtributos(boton)]
        : sel === '.w-checkout-error-msg'
          ? [conAtributos(errores)]
          : [],
    createElement: () => new Elemento(),
    createTreeWalker: () => {
      let i = 0;
      return { nextNode: () => nodos[i++] ?? null };
    },
  };
  const codigo = generarCaja()
    .replace(/^<style>.*<\/style>\n<script>/s, '')
    .replace(/<\/script>\s*$/, '')
    .replace(/principal\(\);\s*\}\)\(\);\s*$/, '})();');
  vm.runInNewContext(codigo, {
    document,
    NodeFilter: { SHOW_TEXT: 4 },
    MutationObserver: class {
      observe() {}
    },
    Intl,
    JSON,
    location: { hostname: 'pago.veronicawellness.com' },
  });
  assert.deepEqual(
    nodos.map((n) => n.nodeValue),
    [
      'Tus datos',
      '  Resumen del pedido ',
      'Confirmar y pagar',
      'Descuento (VEROPRUEBA)',
      '$ 150.00 USD',
      'Total',
    ]
  );
  assert.equal(boton.get('data-loading-text'), 'Procesando…');
  assert.equal(errores.get('data-w-invalid-discount-error'), 'Este código no es válido.');
  assert.equal(html.lang, 'es');
  assert.deepEqual(html.clases, ['vw-lista']);
});

test('cada texto de la caja de Webflow tiene su traducción', () => {
  const caja = readFileSync('webflow/caja.html', 'utf8');
  assert.ok(caja.includes('Resumen del pedido'));
  for (const [ingles, espanol] of Object.entries(ES)) assert.notEqual(ingles, espanol);
  assert.ok(Object.keys(ERRORES).every((a) => /^data-w-[a-z-]+-error$/.test(a)));
});
