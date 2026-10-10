import { test } from 'node:test';
import assert from 'node:assert/strict';
import { problemasDe } from '../scripts/vw/comun/problemas.ts';
import { leerSnapshot, type Tabla } from '../scripts/vw/comun/snapshot.ts';
import { parrafos } from '../src/modelo/campos.ts';
import { revisarValor } from '../src/modelo/validar.ts';

const real = leerSnapshot();

function problemas(mutar: (t: Tabla) => void): string[] {
  const tabla = structuredClone(real);
  mutar(tabla);
  return problemasDe(tabla).map((p) => `${p.entidad}/${p.id}.${p.campo}: ${p.mensaje}`);
}

const buscar = (t: Tabla, entidad: string, id: string) => {
  const r = t[entidad].find((x) => x.id === id);
  if (!r) throw new Error(`${entidad}/${id} no está en el snapshot`);
  return r;
};

const enSeccion = (t: Tabla, seccion: string) => t.bloque.filter((b) => b.seccion === seccion);

test('el snapshot real pasa todas las reglas', () => {
  assert.deepEqual(
    problemas(() => {}),
    []
  );
});

test('una clave de asesoría mal escrita se nombra antes de romper el build', () => {
  assert.deepEqual(
    problemas((t) => {
      buscar(t, 'asesoria', 'initial-layer-cycle').clave = 'INITIAL_LAYER_CYCEL';
    }),
    [
      'asesoria/initial-layer-cycle.clave: «INITIAL_LAYER_CYCEL» no es LAYER_SESSION, INITIAL_LAYER_CYCLE, NEXT_LAYER_CYCLE',
      'asesoria/-.clave: INITIAL_LAYER_CYCLE debe estar una vez y está 0',
    ]
  );
});

test('una asesoría con la clave de otra no deja una ruta de checkout sin datos', () => {
  assert.deepEqual(
    problemas((t) => {
      buscar(t, 'asesoria', 'layer-session').clave = 'NEXT_LAYER_CYCLE';
    }),
    [
      'asesoria/layer-session.id: la asesoría NEXT_LAYER_CYCLE va con el id next-layer-cycle',
      'asesoria/-.clave: LAYER_SESSION debe estar una vez y está 0',
      'asesoria/-.clave: NEXT_LAYER_CYCLE debe estar una vez y está 2',
    ]
  );
});

test('una sección que el sitio lee no puede faltar', () => {
  assert.deepEqual(
    problemas((t) => {
      t.bloque = t.bloque.filter((b) => b.seccion !== 'continuidad');
    }),
    ['bloque/-.seccion: falta la sección sitio/continuidad']
  );
});

test('un bloque en una sección que el sitio no muestra se nombra', () => {
  const [bloque] = enSeccion(real, 'pasos-pedido');
  assert.ok(
    problemas((t) => {
      buscar(t, 'bloque', bloque.id).seccion = 'pasos-pedid';
    }).includes(
      `bloque/${bloque.id}.seccion: «examenes/pasos-pedid» no es una sección que el sitio muestre`
    )
  );
});

test('un título borrado no deja un encabezado vacío', () => {
  const [paso] = enSeccion(real, 'proceso-pasos');
  assert.deepEqual(
    problemas((t) => {
      delete buscar(t, 'bloque', paso.id).titulo;
    }),
    [`bloque/${paso.id}.titulo: la sección asesorias/proceso-pasos lo necesita`]
  );
});

test('una sección de un solo bloque no acepta un segundo que nadie vería', () => {
  assert.deepEqual(
    problemas((t) => {
      const [aviso] = enSeccion(t, 'aviso');
      t.bloque.push({ ...aviso, id: 'suplementos-aviso-2', orden: 2 });
    }),
    ['bloque/-.seccion: la sección suplementos/aviso lleva un bloque y tiene 2']
  );
});

test('la pregunta que usa la página de suplementos no puede faltar', () => {
  assert.ok(
    problemas((t) => {
      t.pregunta = t.pregunta.filter((q) => q.id !== 'inicio-01');
    }).includes('pregunta/inicio-01.-: el sitio lo usa y no existe')
  );
});

test('párrafos que no vuelven iguales por Webflow se rechazan', () => {
  const [testimonio] = real.testimonio;
  const con = (texto: string[]) =>
    problemas((t) => {
      buscar(t, 'testimonio', testimonio.id).texto = texto;
    });
  const id = `testimonio/${testimonio.id}.texto`;
  assert.deepEqual(con([]), []);
  assert.deepEqual(con(['']), [`${id}: tiene un párrafo vacío`]);
  assert.deepEqual(con(['Primer párrafo\n', 'Segundo']), [
    `${id}: un párrafo empieza o termina con un salto de línea`,
  ]);
});

test('unos párrafos obligatorios necesitan al menos uno', () => {
  assert.equal(revisarValor(parrafos({ ayuda: '' }), []), 'necesita al menos un párrafo');
  assert.equal(revisarValor(parrafos({ requerido: false, ayuda: '' }), []), null);
});

test('una lista con una línea vacía se rechaza', () => {
  const [problema] = enSeccion(real, 'problema');
  assert.deepEqual(
    problemas((t) => {
      buscar(t, 'bloque', problema.id).items = ['Una', ''];
    }),
    [`bloque/${problema.id}.items: tiene una línea vacía`]
  );
});

test('el texto que se pinta como HTML solo admite las marcas del diseño', () => {
  const [paso] = enSeccion(real, 'proceso-pasos');
  const con = (campo: string, valor: string) =>
    problemas((t) => {
      buscar(t, 'bloque', paso.id)[campo] = valor;
    });
  assert.deepEqual(con('texto', 'Uno <strong>dos</strong><br />tres'), []);
  assert.deepEqual(con('texto', 'Hola <script>alert(1)</script>'), [
    `bloque/${paso.id}.texto: marca «<script>» que asesorias/proceso-pasos no puede mostrar`,
    `bloque/${paso.id}.texto: marca «</script>» que asesorias/proceso-pasos no puede mostrar`,
  ]);
  assert.deepEqual(con('texto', 'Uno <img src=x onerror=alert(1)> dos'), [
    `bloque/${paso.id}.texto: marca «<img src=x onerror=alert(1)>» que asesorias/proceso-pasos no puede mostrar`,
  ]);
  assert.deepEqual(con('titulo', 'Paso <strong>uno</strong>'), [
    `bloque/${paso.id}.titulo: marca «<strong>» que asesorias/proceso-pasos no puede mostrar`,
    `bloque/${paso.id}.titulo: marca «</strong>» que asesorias/proceso-pasos no puede mostrar`,
  ]);
});

test('una sección que no pinta HTML no acepta marcas, que se verían literales', () => {
  const [pilar] = enSeccion(real, 'pasos-pedido');
  assert.deepEqual(
    problemas((t) => {
      buscar(t, 'bloque', pilar.id).texto = 'Uno <strong>dos</strong>';
    }),
    [
      `bloque/${pilar.id}.texto: marca «<strong>» que examenes/pasos-pedido no puede mostrar`,
      `bloque/${pilar.id}.texto: marca «</strong>» que examenes/pasos-pedido no puede mostrar`,
    ]
  );
});
