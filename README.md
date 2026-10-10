# verowellness — sitio de Veronica Wellness / The Layer Method™

El frontend de `veronicawellness.com`, ensamblado a partir de las páginas que diseñó **Mari**
(Mariangelis Martins) para su clienta **Verónica Dudamell**. Hoy es un **prototipo para presentar**:
todas las páginas, navegables y desplegadas, con el checkout funcionando en modo simulado. Tras la
aprobación se le conecta la infraestructura real (pagos, CRM, agenda, legal, dominio).

**Vista previa:** <https://mmartinsn.github.io/verowellness/> · índice interno de páginas en
`/variantes/`.

## Rutas

| Ruta                             | Qué es                                                                                                        |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `/`                              | Inicio — el segundo diseño de Stitch, el que Mari eligió el 22-sep                                            |
| `/inicio-stitch/`                | Inicio, variante A — el primer diseño de Stitch (fue el inicio hasta el 22-sep)                               |
| `/inicio-editorial/`             | Inicio, variante B — la versión editorial (nueve secciones)                                                   |
| `/el-metodo/`                    | The Method: principio, tres pasos, mapa de las cinco Layers, puente al 1:1                                    |
| `/1-1/`                          | La oferta 1:1 sesión por sesión, entregables, precios, para quién es                                          |
| `/examenes/`                     | Catálogo de exámenes: órbita de áreas, buscador, filtros, comparador, «Mi selección» (ver `docs/EXAMENES.md`) |
| `/checkout/examenes/`            | Checkout de los exámenes elegidos (pago simulado)                                                             |
| `/checkout/initial-layer-cycle/` | Checkout de 5 pasos del Initial Layer Cycle (pago simulado)                                                   |
| `/checkout/next-layer-cycle/`    | Checkout del Next Layer Cycle                                                                                 |
| `/legal/*`                       | Términos, privacidad y aviso médico — **marcadores**, el texto lo redacta Verónica                            |
| `/variantes/`                    | Índice de todas las páginas, para presentar. No enlazado, `noindex`                                           |

Las variantes A y B se conservan para comparar; el inicio es el que Mari eligió. Ver
[`docs/DECISIONES.md`](docs/DECISIONES.md).

## Correr

```bash
npm install
npm run dev        # http://localhost:4321/verowellness/   (ojo al base path)
npm run build      # dist/
npm run preview    # sirve dist/ en http://127.0.0.1:4321/verowellness/
npm run verify     # lint + prettier --check + astro check + pruebas + build  (lo mismo que corre CI)
npm test           # pruebas de las reglas del pedido (node:test)
npm run vw         # el ejecutable de datos y Webflow: lista sus comandos (docs/INTEGRACION.md)
npm run capturas   # screenshots de cada ruta (escritorio y teléfono) + recorrido del checkout → capturas/
npm run capturas -- --base https://mmartinsn.github.io/verowellness   # contra el sitio publicado
npm run entrega    # build + empaquetar + verificar: UN .html autocontenido en entregas/, probado desde disco
```

Node 24 (`.nvmrc`). `capturas`, `empaquetar` y `verificar:entrega` usan el Chrome instalado en la
máquina vía `puppeteer-core`; no descargan navegador.

**El entregable para Mari es `entregas/<fecha>_Veronica_Wellness_prototipo.html`**: las once páginas
en un solo archivo (~1 MB) que se abre desde el disco, sin servidor ni enlace con nombre de cuenta.
CSS, scripts e imágenes van incrustados; las tipografías se cargan de Google Fonts, así que la primera
apertura necesita conexión. Se navega con los enlaces del sitio o con el hash: `#el-metodo`, `#1-1`,
`#inicio-editorial`, `#variantes`, `#checkout/initial-layer-cycle`, `#inicio~faq`.

## Cómo está hecho

Astro 7 estático + Tailwind 4 CSS-first (`@tailwindcss/vite`). Cero framework de cliente: la poca
interactividad (menú, acordeones, checkout) son `<script>` de Astro por componente.

| Carpeta / archivo          | Qué hay                                                                                                                   |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `src/styles/global.css`    | **Los tokens**: paleta, tipografías, radios, y las primitivas compartidas (`.wrap`, `.eyebrow`, `.btn`, `.reveal`)        |
| `src/data/`                | Las exportaciones que leen las páginas (`ciclos`, `productos`, `examenes`, `layers`…), armadas desde `src/data/canonico/` |
| `src/data/canonico/`       | **El snapshot de la base de datos**: lo publicado en Webflow, en forma canónica. Lo escribe `npm run vw -- bajar`         |
| `src/modelo/`              | **El modelo de datos**: una declaración por entidad, validación y reglas de negocio (`docs/MODELO.md`, generado)          |
| `src/lib/datos/`           | Acceso al snapshot (validado al construir), imágenes y plantillas de precios                                              |
| `src/lib/comercio/`        | Reglas del pedido y la URL del puente de cobro                                                                            |
| `webflow/`                 | El puente que corre en la página «Pedido» de Webflow y su versión generada                                                |
| `scripts/vw/`              | `npm run vw`: esquema, siembra y bajada de Webflow, puente, exportación, auditoría                                        |
| `tests/`                   | Pruebas de las reglas del pedido                                                                                          |
| `src/lib/url.ts`           | `href()`: todo enlace interno pasa por aquí para respetar el `base` y la barra final                                      |
| `src/lib/precio.ts`        | Redondeo y desglose de impuestos, compartido por tarjetas y checkout                                                      |
| `src/layouts/`             | `BaseLayout` (head, fuentes), `SiteLayout` (header + footer + reveal), `CheckoutLayout`                                   |
| `src/components/`          | Compartidos en la raíz (`SiteHeader`, `SiteFooter`, `PriceCard`, `Icon`…); una subcarpeta por página                      |
| `src/assets/`              | Las fotos que usa el sitio, optimizadas por Astro al construir                                                            |
| `scripts/capturas.mjs`     | Las capturas y el recorrido del checkout                                                                                  |
| `docs/`                    | Brief de lo recibido, decisiones tomadas y abiertas, la especificación de diseño de Stitch                                |
| `fuentes/` (no versionado) | El material tal como llegó de Mari: HTML, zips, audio, fotos de estudio, capturas                                         |

**Tres sistemas visuales conviven por diseño**: las páginas editoriales (Cormorant Garamond + Nunito),
el primer Stitch (Bodoni Moda + Plus Jakarta Sans, `data-theme="stitch"`) y el inicio
(Cormorant Garamond + Plus Jakarta Sans, `data-theme="inicio"`). Cada tema cambia los pocos tokens
que difieren; el resto es común. Unificar tipografía es cambiar dos variables.

Las fuentes se autoalojan con `@fontsource`; nada se carga de Google. Plus Jakarta Sans (y Bodoni en
`/inicio-stitch/`) solo la cargan las rutas que la usan.

## Datos y Webflow

Desde el 10-oct-2026 **Webflow es la base de datos y la caja**; el sitio sigue siendo este código.
Los precios, productos, exámenes, síntomas, testimonios, preguntas, Layers y suplementos se editan y
publican en Webflow, y bajan al snapshot con `npm run vw -- bajar` (validados antes de escribirse).
El build nunca llama a Webflow. El cobro pasa por el checkout nativo de Webflow a través de un puente.
Arquitectura, comandos y recetas en `docs/INTEGRACION.md`; lo que se hace a mano en Webflow, en
`docs/WEBFLOW.md`; la auditoría, en `docs/MANTENIMIENTO.md`.

## Despliegue

`push` a `main` → `.github/workflows/deploy.yml`: `npm ci` → lint → prettier → `astro check` →
`build` → GitHub Pages (fuente «GitHub Actions»). Cualquier compuerta que falle bloquea el deploy.

El sitio vive bajo `/verowellness/` (project site). Para pasar a dominio propio: poner `site` y
**quitar `base`** en `astro.config.mjs`, y dejar de bloquear robots en `public/robots.txt`. Ningún
enlace hay que tocar porque todos pasan por `href()`.

## Qué falta para producción

- [x] Aprobar el inicio (22-sep: el segundo diseño de Stitch)
- [ ] Borrar las variantes A y B cuando ya no hagan falta para comparar
- [ ] Decidir tipografía y paleta finales (ver `docs/DECISIONES.md`)
- [x] Base de datos y tienda en Webflow, con el puente de cobro probado (decisión 38)
- [ ] Pagos reales: Verónica conecta Stripe y PayPal en Webflow; Mari diseña el paso de resumen y se pasa `comercio.modo` a `'webflow'`
- [ ] Impuesto automático, envío de exámenes y datos de la empresa en Webflow (`docs/WEBFLOW.md`)
- [ ] PDF de las cuatro guías como descarga de cada producto
- [ ] Agenda: las URL reales de Calendly (las del prototipo dan 404)
- [ ] Textos legales de Verónica en `/legal/*`
- [ ] Dominio propio y DNS; quitar `noindex`/robots
- [ ] Analítica y monitoreo (observabilidad va en la fase 1, no después)

## Convenciones

- El copy es de Verónica y de Mari. **No se inventa texto en su voz.** Lo único escrito aquí son
  rótulos de navegación, las páginas internas y los marcadores legales.
- Un precio, una Layer, un registro: se escriben **una vez**, en Webflow, y se leen del snapshot.
  El modelo (`src/modelo/`) es la única definición de qué datos existen.
- Antes de mandarle algo a Mari: `npm run verify` y `npm run capturas`, y mirar las capturas.
- Commits sin pie de coautoría.
