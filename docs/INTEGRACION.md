# Integración con Webflow: datos, cobro y mantenimiento

Cómo está conectado el sitio con Webflow desde el 10-oct-2026 y por qué. La decisión está en
`DECISIONES.md` § 38; el modelo de datos completo, en `MODELO.md` (generado).

## La idea en tres líneas

- **El sitio sigue siendo este código de Astro**, así que se ve exactamente igual (el `dist/` se
  comprobó idéntico byte a byte en cada corte).
- **Webflow es la base de datos y la caja**: todo registro y todo precio se edita allí; cobra con
  su checkout nativo.
- **El modelo de datos es nuestro, no de Webflow** (`src/modelo/`): Webflow es su primer
  adaptador. Pasar mañana a un stack propio (Postgres + Stripe directo) es escribir otro
  adaptador; ni las páginas ni el modelo cambian.

## Cómo fluyen los datos

```
Webflow (CMS + Ecommerce)  ──vw bajar──▶  src/data/canonico/*.json  ──build──▶  src/data/*.ts  ──▶  páginas
        ▲                                  (snapshot versionado,                (las mismas
        └──────────vw sembrar─────────────  validado al construir)               exportaciones de siempre)
```

- **Verónica edita y publica en Webflow.** Lo publicado es lo único que baja: un borrador no
  llega al sitio. Vale también para los productos: se leen de las colecciones Products y SKUs
  publicadas (`/items/live`), así que un precio cambiado y sin publicar no llega al sitio mientras
  la caja cobra el viejo. Si a Webflow le falta un campo del modelo o un campo cambió de tipo,
  `bajar` se detiene en vez de escribirlo vacío.
- **`vw bajar`** trae lo publicado, lo convierte al modelo canónico (slugs, centavos, opciones
  por nombre, imágenes a `src/assets/`), lo valida contra el esquema y las reglas de negocio y
  solo entonces escribe el snapshot. Si algo no pasa, el snapshot queda como estaba y el sitio
  sigue con el último bueno.
- **El build nunca llama a Webflow**: lee el snapshot. Si Webflow no responde, el sitio se sigue
  construyendo igual. `src/lib/datos/canonico.ts` vuelve a validar todo al construir; un dato
  roto rompe el build en vez de llegar al sitio.
- **`src/data/*.ts` conservan exactamente sus exportaciones** (`ciclos`, `productos`, `examenes`,
  `fichas`, `sintomas`, `testimonios`, `layers`…): los componentes no se enteraron del cambio.

## Los textos de sección

Además de los registros (precios, productos, exámenes…), los textos con forma de lista o de
tarjeta viven en la colección **«Textos de sección»** (`bloque` en el modelo): cada bloque tiene
página, sección y orden, y los campos que haga falta (etiqueta, título, texto, ítems, nota, cita,
tono, ícono, enlace). Un componente los lee con `bloques(pagina, seccion)`, `items(…)` o
`texto(…)` (`src/lib/datos/bloques.ts`). Hoy son 40 bloques: los pasos del proceso y los temas del
Assessment, las listas de «Sobre mí», los pilares y listas de Exámenes y Suplementos, las listas
de inicio, método y Asesorías, los avisos y el bloque de continuidad.

Lo que sigue escrito en los componentes lo mide `npm run vw -- censo` (también en la auditoría):
títulos y párrafos sueltos del marcado, listas que mezclan copy con diseño, el checkout (cambia
con el comercio) y los inicios alternativos. Cada traslado se hace igual: leer la constante del
commit base, sembrarla, reemplazar la constante por su lectura y exigir `vw paridad` en 0.

## Cómo fluye el cobro

```
veronicawellness.com (Astro)                       pago.veronicawellness.com (Webflow)
  selección + resumen + ofertas ──urlPedido()──▶   /pedido?items=…  → carrito nativo → /checkout
                                                    (puente: vacía el carrito viejo, agrega cada
                                                     producto con su formulario nativo)
```

- **Webflow no tiene API de carrito ni de checkout**: su checkout solo corre en páginas de
  Webflow. Por eso existe el puente (`webflow/puente.ts`), publicado en la página «Pedido».
- **Las reglas del pedido viven en un solo archivo** (`src/lib/comercio/reglas.ts`) y las usan el
  sitio y el puente: solo productos conocidos, una sola oferta y solo cuando corresponde, y el
  cargo de laboratorio recalculado por examen. Lo que llega en la URL nunca decide el cargo.
- **El puente no adivina**: espera la consulta real del carrito de Webflow antes de vaciarlo,
  verifica cada línea con la cantidad que devuelve Webflow al agregarla (`itemCount`) y, si algo
  falla, recarga la página una vez y rearma el carrito desde cero; nunca vuelve a pulsar «Add to
  Cart» a ciegas. Si la plantilla de producto no tiene campo de cantidad, agrega de a uno. Se
  prueba sin publicar con `vw probar-puente --local`, que inyecta el puente de este repo en la
  página real.
- **Interruptor** `comercio.modo` en `src/data/site.ts`: **existe, pero todavía no lo usa ninguna
  página.** El checkout del prototipo (`src/components/checkout/Checkout.astro`) conserva su propia
  lógica de oferta y cargo y no llama a `urlPedido()`. Se conecta cuando Mari diseñe el paso de
  resumen: ese paso arma la URL con `urlPedido()` y, con `modo = 'webflow'`, manda al puente. Hasta
  entonces el sitio no cobra.
- **Lo que Webflow no impide** (decisión pendiente en `DECISIONES.md` § Abiertas): las reglas del
  pedido corren en el navegador; la tienda nativa permite comprar la oferta sola por su URL y quitar
  el cargo de laboratorio del carrito antes de pagar.

## Recetas

**Cambiar un precio, un texto de una ficha, un testimonio:** editarlo en Webflow y publicar. El
workflow `Datos desde Webflow` (`.github/workflows/datos.yml`) lo baja cada día a las 11:17 UTC, o
al momento con «Run workflow» en GitHub: trae lo publicado, corre `npm run verify` y, si algo
cambió, abre o actualiza el PR «Datos desde Webflow» (rama `datos/webflow`). **Nada se publica
solo: al mergear el PR se despliega.** Si Webflow vuelve a coincidir con `main`, el workflow cierra
el PR. Necesita el secret `WEBFLOW_SITE_TOKEN` (basta con un token de solo lectura) y, en el repo,
Settings → Actions → General → «Allow GitHub Actions to create and approve pull requests». A mano
es lo mismo: `npm run vw -- bajar`, revisar el diff, `npm run verify`, commit.

**Agregar un campo:** declararlo en la entidad de `src/modelo/entidades/` → `npm run vw -- esquema`
(en seco) y `--aplicar` → leerlo en la fachada de `src/data/` → `npm run vw -- exportar docs`.

**Agregar un registro desde el código** (por ejemplo, una carga inicial): escribirlo en el
snapshot, `npm run vw -- validar`, `npm run vw -- sembrar` en seco y después `--aplicar`.

**Cambiar de plataforma:** el snapshot canónico y `npm run vw -- exportar docs --con-datos`
(SQL de Postgres) o `exportar csv` son la salida completa. Un adaptador nuevo implementa las
mismas dos direcciones que `scripts/vw/webflow/` (sembrar y bajar) y el puerto de cobro
(`urlPedido`).

## El ejecutable: `npm run vw -- <comando>`

| Comando                                            | Qué hace                                                            | Escribe                  |
| -------------------------------------------------- | ------------------------------------------------------------------- | ------------------------ |
| `validar`                                          | Valida el snapshot contra el esquema y las reglas                   | nada                     |
| `ida-vuelta --base <ref>`                          | Compara cada export de `src/data` con el de un commit base          | nada                     |
| `paridad`                                          | Compara `dist/` con la línea base del front                         | nada                     |
| `esquema [--aplicar]`                              | Compara el modelo con las colecciones de Webflow; crea lo que falta | Webflow, con `--aplicar` |
| `sembrar [--aplicar]`                              | Lleva el snapshot a Webflow y publica                               | Webflow, con `--aplicar` |
| `bajar [--comprobar]`                              | Trae lo publicado al snapshot; `--comprobar` solo compara           | el snapshot              |
| `puente [--aplicar]`                               | Genera `webflow/pedido.html` y lo publica en la página «Pedido»     | Webflow, con `--aplicar` |
| `probar-puente [--rondas N]`                       | Pedidos de prueba contra el checkout real (nunca compra)            | un carrito de prueba     |
| `exportar docs\|csv [--con-datos]`                 | `docs/MODELO.md`, `docs/modelo.sql`, datos en SQL o CSV             | docs/ y exportacion/     |
| `auditar [--solo …] [--sin-webflow] [--sin-build]` | La auditoría de mantenimiento (ver `MANTENIMIENTO.md`)              | el reporte               |

Todo lo que escribe en Webflow funciona en seco por defecto, imprime su plan y necesita
`--aplicar`; una segunda corrida tiene que dar cero cambios. **`sembrar` y `puente` se niegan a
aplicar si Webflow tiene cambios sin publicar** (en el sitio, un producto o un ítem): `--aplicar`
publica el sitio entero y los arrastraría. Se publican o se descartan en Webflow y se repite.

`probar-puente` acepta `--local` (prueba el puente de este repo sin publicarlo) y `--solo a,b`
(solo los casos cuyo nombre contiene esos textos). `ida-vuelta` compara también lo que devuelven
las funciones con parámetros (entradas en `scripts/vw/comun/entradas.ts`) y falla con un export
nuevo que no esté declarado allí.

Variables en `.env` (ver `.env.example`): `WEBFLOW_SITE_TOKEN` (token del sitio) y
`WEBFLOW_SITE_ID`.

## Archivos

| Archivo                                      | Para                                                                                                                                    | Lee                               | Escribe               | Falla                             | Probado                                                                    | Razones                                                                                                                                               |
| -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- | --------------------- | --------------------------------- | -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/modelo/campos.ts`                       | Tipos de campo y su inferencia de tipos                                                                                                 | —                                 | —                     | —                                 | build                                                                      | Listas, párrafos, multirreferencias y booleanos siempre tienen valor: Webflow no distingue vacío de ausente                                           |
| `src/modelo/entidades/*.ts`                  | Una declaración por entidad, con la ayuda que ve quien edita en Webflow                                                                 | —                                 | —                     | —                                 | build                                                                      | Comercio, catálogo, contenido y operación agrupados por lo que son                                                                                    |
| `src/modelo/esquema.ts`                      | Registro versionado de entidades                                                                                                        | —                                 | —                     | —                                 | build                                                                      | `VERSION_ESQUEMA` sube con cada cambio del modelo                                                                                                     |
| `src/modelo/validar.ts`, `reglas.ts`         | Esquema y reglas de negocio                                                                                                             | el conjunto                       | —                     | lista de problemas                | build, vw validar, `tests/modelo-validacion.test.ts`                       | Un producto por presentación, ofertas al 85 %, tokens de la FAQ, rutas con exámenes; listas y párrafos que no vuelven iguales por Webflow se rechazan |
| `src/modelo/secciones.ts`, `reglas-sitio.ts` | Lo que el sitio lee del snapshot: las 24 secciones de bloques con sus campos, las tres asesorías con su ruta y los registros fijos      | el conjunto                       | —                     | lista de problemas                | `tests/modelo-validacion.test.ts`                                          | Un error de tipeo en Webflow se nombra al bajar en vez de romper el build; solo `proceso-pasos` admite `<strong>` y `<br />`                          |
| `src/modelo/serializar.ts`                   | Orden y forma deterministas del snapshot                                                                                                | —                                 | —                     | —                                 | vw bajar                                                                   | Diffs legibles y reproducibles                                                                                                                        |
| `src/lib/datos/canonico.ts`                  | El snapshot validado para Astro y Node                                                                                                  | `src/data/canonico/`              | —                     | rompe el build si hay problemas   | build                                                                      | Un dato roto nunca se despliega                                                                                                                       |
| `src/lib/datos/imagenes.ts`                  | Rutas del snapshot → imágenes de Astro                                                                                                  | las carpetas de imagen del modelo | —                     | error si falta                    | build, `tests/imagenes.test.ts`                                            | El mismo pipeline de `<Image>` de siempre; el glob literal que exige Vite se compara con el modelo                                                    |
| `src/lib/datos/plantillas.ts`                | `{nombre:id}` y `{precio:id}` en las preguntas                                                                                          | el snapshot                       | —                     | id inexistente rompe el build     | ida-vuelta                                                                 | Un precio nunca se escribe dos veces                                                                                                                  |
| `src/lib/comercio/reglas.ts`                 | Reglas del pedido                                                                                                                       | —                                 | —                     | —                                 | `tests/reglas-comercio.test.ts`                                            | La misma fuente para el sitio y el puente                                                                                                             |
| `src/lib/comercio/pedido.ts`                 | URL del puente                                                                                                                          | —                                 | —                     | —                                 | `tests/pedido.test.ts`                                                     | El puerto de cobro: otro adaptador cambia esto                                                                                                        |
| `src/lib/despliegue.ts`                      | Dónde vive el sitio y la caja: sitio, base, URL pública y dominio de pago                                                               | —                                 | —                     | —                                 | paridad                                                                    | Lo leen `astro.config.mjs`, la auditoría, las capturas y el puente: cambiar de dominio es cambiar este archivo                                        |
| `src/lib/json-ld.ts`                         | El JSON-LD con `<` escapado                                                                                                             | —                                 | —                     | —                                 | `tests/json-ld.test.ts`                                                    | Un texto de Webflow no puede cerrar el `<script>`                                                                                                     |
| `src/data/*.ts`                              | Fachada: las exportaciones de siempre                                                                                                   | el snapshot                       | —                     | —                                 | vw ida-vuelta                                                              | Ningún componente cambió                                                                                                                              |
| `webflow/puente.ts`                          | El puente que corre en Webflow                                                                                                          | la URL                            | el carrito            | recarga una vez; después, mensaje | vw probar-puente                                                           | Usa los formularios nativos; solo escucha las respuestas de Webflow (consulta del carrito y `AddToCart`) para saber cuándo y cuánto                   |
| `scripts/vw/cli.ts`, `comandos/`             | Un ejecutable, un archivo por comando                                                                                                   | —                                 | —                     | salida 2                          | —                                                                          | Un solo punto de entrada                                                                                                                              |
| `scripts/vw/webflow/`                        | Adaptador: cliente (60 rpm; reintenta solo lo idempotente), api, esquema, conversión, productos, publicación, imágenes, siembra, bajada | Webflow                           | Webflow / snapshot    | errores con la ruta y el estado   | segunda corrida en 0, `tests/webflow-*.test.ts` con un Webflow falso       | Nunca borra; no aplica con cambios sin publicar; lo que no hace la API va a `WEBFLOW.md`                                                              |
| `scripts/vw/comercio/`                       | Genera y prueba el puente                                                                                                               | snapshot, `global.css`            | `webflow/pedido.html` | —                                 | 20/20 con `--local` (red lenta, respuesta perdida, plantilla sin cantidad) | Tipos quitados con `stripTypeScriptTypes` de Node                                                                                                     |
| `scripts/vw/exportar/`                       | Modelo en Markdown y Postgres; datos en SQL o CSV                                                                                       | modelo, snapshot                  | docs/, exportacion/   | —                                 | cargado en PGlite                                                          | La salida portable                                                                                                                                    |
| `scripts/vw/auditar/`                        | La auditoría                                                                                                                            | todo lo anterior                  | reporte               | salida 1 o 2                      | corrida real                                                               | Ver `MANTENIMIENTO.md`                                                                                                                                |
| `scripts/vw/cargador/`                       | Ganchos de Node para importar los `.ts` de datos con imágenes                                                                           | —                                 | —                     | —                                 | ida-vuelta                                                                 | Comparación sin compilar                                                                                                                              |
