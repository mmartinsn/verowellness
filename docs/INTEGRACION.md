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
  llega al sitio.
- **`vw bajar`** trae lo publicado, lo convierte al modelo canónico (slugs, centavos, opciones
  por nombre, imágenes a `src/assets/`), lo valida contra el esquema y las reglas de negocio y
  solo entonces escribe el snapshot. Si algo no pasa, el snapshot queda como estaba y el sitio
  sigue con el último bueno.
- **El build nunca llama a Webflow**: lee el snapshot. Si Webflow no responde, el sitio se sigue
  construyendo igual. `src/lib/datos/canonico.ts` vuelve a validar todo al construir; un dato
  roto rompe el build en vez de llegar al sitio.
- **`src/data/*.ts` conservan exactamente sus exportaciones** (`ciclos`, `productos`, `examenes`,
  `fichas`, `sintomas`, `testimonios`, `layers`…): los componentes no se enteraron del cambio.

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
- **Interruptor** `comercio.modo` en `src/data/site.ts`: en `'prototipo'` el checkout de Mari
  sigue igual que siempre; en `'webflow'` el paso de resumen manda a `urlPedido()`. Se cambia
  cuando Stripe esté conectado y Mari haya diseñado el paso de resumen.

## Recetas

**Cambiar un precio, un texto de una ficha, un testimonio:** editarlo en Webflow, publicar, y
`npm run vw -- bajar` (o esperar al workflow programado, cuando exista). Revisar el diff del
snapshot, `npm run verify`, commit.

**Agregar un campo:** declararlo en la entidad de `src/modelo/entidades/` → `npm run vw -- esquema`
(en seco) y `--aplicar` → leerlo en la fachada de `src/data/` → `npm run vw -- exportar docs`.

**Agregar un registro desde el código** (por ejemplo, una carga inicial): escribirlo en el
snapshot, `npm run vw -- validar`, `npm run vw -- sembrar` en seco y después `--aplicar`.

**Cambiar de plataforma:** el snapshot canónico y `npm run vw -- exportar docs --con-datos`
(SQL de Postgres) o `exportar csv` son la salida completa. Un adaptador nuevo implementa las
mismas dos direcciones que `scripts/vw/webflow/` (sembrar y bajar) y el puerto de cobro
(`urlPedido`).

## El ejecutable: `npm run vw -- <comando>`

| Comando                                            | Qué hace                                                                       | Escribe                  |
| -------------------------------------------------- | ------------------------------------------------------------------------------ | ------------------------ |
| `validar`                                          | Valida el snapshot contra el esquema y las reglas                              | nada                     |
| `migrar --desde <ref>`                             | Arma el snapshot desde los `src/data/*.ts` de un commit (la migración inicial) | el snapshot              |
| `ida-vuelta --base <ref>`                          | Compara cada export de `src/data` con el de un commit base                     | nada                     |
| `paridad`                                          | Compara `dist/` con la línea base del front                                    | nada                     |
| `esquema [--aplicar]`                              | Compara el modelo con las colecciones de Webflow; crea lo que falta            | Webflow, con `--aplicar` |
| `sembrar [--aplicar]`                              | Lleva el snapshot a Webflow y publica                                          | Webflow, con `--aplicar` |
| `bajar [--comprobar]`                              | Trae lo publicado al snapshot; `--comprobar` solo compara                      | el snapshot              |
| `puente [--aplicar]`                               | Genera `webflow/pedido.html` y lo publica en la página «Pedido»                | Webflow, con `--aplicar` |
| `probar-puente [--rondas N]`                       | Pedidos de prueba contra el checkout real (nunca compra)                       | un carrito de prueba     |
| `exportar docs\|csv [--con-datos]`                 | `docs/MODELO.md`, `docs/modelo.sql`, datos en SQL o CSV                        | docs/ y exportacion/     |
| `auditar [--solo …] [--sin-webflow] [--sin-build]` | La auditoría de mantenimiento (ver `MANTENIMIENTO.md`)                         | el reporte               |

Todo lo que escribe en Webflow funciona en seco por defecto, imprime su plan y necesita
`--aplicar`; una segunda corrida tiene que dar cero cambios.

Variables en `.env` (ver `.env.example`): `WEBFLOW_SITE_TOKEN` (token del sitio) y
`WEBFLOW_SITE_ID`.

## Archivos

| Archivo                              | Para                                                                                                    | Lee                               | Escribe               | Falla                           | Probado                         | Razones                                                                                                     |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------- | --------------------------------- | --------------------- | ------------------------------- | ------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `src/modelo/campos.ts`               | Tipos de campo y su inferencia de tipos                                                                 | —                                 | —                     | —                               | build                           | Listas, párrafos, multirreferencias y booleanos siempre tienen valor: Webflow no distingue vacío de ausente |
| `src/modelo/entidades/*.ts`          | Una declaración por entidad, con la ayuda que ve quien edita en Webflow                                 | —                                 | —                     | —                               | build                           | Comercio, catálogo, contenido y operación agrupados por lo que son                                          |
| `src/modelo/esquema.ts`              | Registro versionado de entidades                                                                        | —                                 | —                     | —                               | build                           | `VERSION_ESQUEMA` sube con cada cambio del modelo                                                           |
| `src/modelo/validar.ts`, `reglas.ts` | Esquema y reglas de negocio                                                                             | el conjunto                       | —                     | lista de problemas              | build, vw validar               | Un producto por presentación, ofertas al 85 %, tokens de la FAQ, rutas con exámenes                         |
| `src/modelo/serializar.ts`           | Orden y forma deterministas del snapshot                                                                | —                                 | —                     | —                               | vw bajar                        | Diffs legibles y reproducibles                                                                              |
| `src/lib/datos/canonico.ts`          | El snapshot validado para Astro y Node                                                                  | `src/data/canonico/`              | —                     | rompe el build si hay problemas | build                           | Un dato roto nunca se despliega                                                                             |
| `src/lib/datos/imagenes.ts`          | Rutas del snapshot → imágenes de Astro                                                                  | `src/assets/{testimonios,tienda}` | —                     | error si falta                  | build                           | El mismo pipeline de `<Image>` de siempre                                                                   |
| `src/lib/datos/plantillas.ts`        | `{nombre:id}` y `{precio:id}` en las preguntas                                                          | el snapshot                       | —                     | id inexistente rompe el build   | ida-vuelta                      | Un precio nunca se escribe dos veces                                                                        |
| `src/lib/comercio/reglas.ts`         | Reglas del pedido                                                                                       | —                                 | —                     | —                               | `tests/reglas-comercio.test.ts` | La misma fuente para el sitio y el puente                                                                   |
| `src/lib/comercio/pedido.ts`         | URL del puente                                                                                          | —                                 | —                     | —                               | `tests/pedido.test.ts`          | El puerto de cobro: otro adaptador cambia esto                                                              |
| `src/data/*.ts`                      | Fachada: las exportaciones de siempre                                                                   | el snapshot                       | —                     | —                               | vw ida-vuelta                   | Ningún componente cambió                                                                                    |
| `webflow/puente.ts`                  | El puente que corre en Webflow                                                                          | la URL                            | el carrito            | mensaje y reintento             | vw probar-puente                | Usa los elementos nativos de Webflow, no endpoints internos                                                 |
| `scripts/vw/cli.ts`, `comandos/`     | Un ejecutable, un archivo por comando                                                                   | —                                 | —                     | salida 2                        | —                               | Un solo punto de entrada                                                                                    |
| `scripts/vw/webflow/`                | Adaptador: cliente (60 rpm, reintentos), api, esquema, conversión, productos, imágenes, siembra, bajada | Webflow                           | Webflow / snapshot    | errores con la ruta y el estado | segunda corrida en 0            | Nunca borra; lo que no hace la API va a `WEBFLOW.md`                                                        |
| `scripts/vw/comercio/`               | Genera y prueba el puente                                                                               | snapshot, `global.css`            | `webflow/pedido.html` | —                               | 28/28 corridas                  | Tipos quitados con `stripTypeScriptTypes` de Node                                                           |
| `scripts/vw/exportar/`               | Modelo en Markdown y Postgres; datos en SQL o CSV                                                       | modelo, snapshot                  | docs/, exportacion/   | —                               | cargado en PGlite               | La salida portable                                                                                          |
| `scripts/vw/auditar/`                | La auditoría                                                                                            | todo lo anterior                  | reporte               | salida 1 o 2                    | corrida real                    | Ver `MANTENIMIENTO.md`                                                                                      |
| `scripts/vw/cargador/`               | Ganchos de Node para importar los `.ts` de datos con imágenes                                           | —                                 | —                     | —                               | ida-vuelta                      | Migración y comparación sin compilar                                                                        |
