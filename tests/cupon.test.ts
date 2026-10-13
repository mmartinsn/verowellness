import { test } from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {
  cookieCupon,
  dominioCompartido,
  leerCupon,
  limpiarCupon,
} from '../src/lib/comercio/cupon.ts';
import { generarCupon } from '../scripts/vw/comercio/cupon.ts';

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

test('el código se limpia de espacios y se lee de vuelta tal cual de la cookie', () => {
  assert.equal(limpiarCupon('  PACIENTE 10 '), 'PACIENTE10');
  const cookie = cookieCupon('Vero-10%', 'veronicawellness.com');
  assert.match(cookie, /domain=veronicawellness\.com/);
  assert.match(cookie, /max-age=1800/);
  const par = cookie.split(';')[0];
  assert.equal(leerCupon(`otra=1; ${par}; x=2`), 'Vero-10%');
  assert.equal(leerCupon('otra=1'), '');
  assert.equal(leerCupon('vw_cupon=%E0%A4%A'), '');
});

test('borrar la cookie la vacía con max-age=0 en el mismo dominio', () => {
  const cookie = cookieCupon('', 'veronicawellness.com', true);
  assert.match(cookie, /^vw_cupon=;/);
  assert.match(cookie, /max-age=0/);
  assert.match(cookie, /domain=veronicawellness\.com/);
});

test('el script de la caja escribe el código, pulsa Apply y borra la cookie', async () => {
  const eventos: string[] = [];
  const campo = {
    value: '',
    dispatchEvent: (e: { type: string }) => eventos.push(e.type),
  };
  const boton = { click: () => eventos.push(`click:${campo.value}`) };
  const cookies: string[] = [];
  const document = {
    get cookie() {
      return 'vw_cupon=VEROPRUEBA';
    },
    set cookie(v: string) {
      cookies.push(v);
    },
    querySelector: (sel: string) =>
      sel.includes('discountsinput')
        ? campo
        : sel.includes('discountsbutton')
          ? boton
          : sel.includes('summarytotal')
            ? { textContent: '$ 210.00' }
            : null,
  };
  const codigo = generarCupon().replace(/^<script>|<\/script>\s*$/g, '');
  vm.runInNewContext(codigo, {
    document,
    location: { hostname: 'pago.veronicawellness.com' },
    Event: class {
      type: string;
      constructor(type: string) {
        this.type = type;
      }
    },
    setTimeout,
    Date,
    encodeURIComponent,
    decodeURIComponent,
  });
  await new Promise((r) => setTimeout(r, 700));
  assert.deepEqual(eventos, ['input', 'change', 'click:VEROPRUEBA']);
  assert.equal(cookies.length, 1);
  assert.match(cookies[0], /^vw_cupon=;.*max-age=0.*domain=veronicawellness\.com/);
});
