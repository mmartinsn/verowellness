# verowellness — sitio de Veronica Wellness / The Layer Method™

El frontend de `veronicawellness.com`, ensamblado a partir de las páginas que diseñó **Mari**
(Mariangelis Martins) para su clienta **Verónica Dudamell**. Hoy es un **prototipo para presentar**:
todas las páginas, navegables y desplegadas, con el checkout funcionando en modo simulado. Tras la
aprobación se le conecta la infraestructura real (pagos, CRM, agenda, legal, dominio).

**Vista previa:** <https://mmartinsn.github.io/verowellness/> · índice interno de páginas en
`/variantes/`.

## Rutas

| Ruta                             | Qué es                                                                                            |
| -------------------------------- | ------------------------------------------------------------------------------------------------- |
| `/`                              | Inicio — el segundo diseño de Stitch, el que Mari eligió el 22-sep                                |
| `/inicio-stitch/`                | Inicio, variante A — el primer diseño de Stitch (fue el inicio hasta el 22-sep)                   |
| `/inicio-editorial/`             | Inicio, variante B — la versión editorial (nueve secciones)                                       |
| `/el-metodo/`                    | Mi método: el mapa de las cinco Layers, el principio, la idea central, puente a las asesorías     |
| `/asesorias/`                    | Las asesorías sesión por sesión, entregables y precios (`/1-1/` redirige aquí)                    |
| `/examenes/`                     | Catálogo de exámenes por grupos y por síntomas, buscador, «Mi selección» (ver `docs/EXAMENES.md`) |
| `/tienda/`                       | Guías y recetario de Verónica                                                                     |
| `/suplementos/`                  | El estante de Verónica y el acceso por Wholescripts                                               |
| `/checkout/examenes/`            | Checkout de los exámenes elegidos, con cita de lectura opcional y fees por examen (pago simulado) |
| `/checkout/tienda/`              | Checkout de la tienda, con la oferta de una guía más                                              |
| `/checkout/layer-session/`       | Checkout de la Layer Session, una cita (pago simulado)                                            |
| `/checkout/initial-layer-cycle/` | Checkout del Initial Layer Cycle, dos citas, con la oferta de guías (pago simulado)               |
| `/checkout/next-layer-cycle/`    | Checkout del Next Layer Cycle; no está enlazado, llega por invitación                             |
| `/legal/*`                       | Términos, privacidad y aviso médico — **marcadores**, el texto lo redacta Verónica                |
| `/variantes/`                    | Índice de todas las páginas, para presentar. No enlazado, `noindex`                               |

Las variantes A y B se conservan para comparar; el inicio es el que Mari eligió. Ver
[`docs/DECISIONES.md`](docs/DECISIONES.md).

## Correr

```bash
npm install
npm run dev        # http://localhost:4321/verowellness/   (ojo al base path)
npm run build      # dist/
npm run preview    # sirve dist/ en http://127.0.0.1:4321/verowellness/
npm run verify     # lint + prettier --check + astro check + build  (lo mismo que corre CI)
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

| Carpeta / archivo          | Qué hay                                                                                                                          |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `src/styles/global.css`    | **Los tokens**: paleta, tipografías, radios, y las primitivas compartidas (`.wrap`, `.eyebrow`, `.btn`, `.reveal`)               |
| `src/data/`                | El contenido que se repite, escrito una vez: `layers.ts` (las cinco Layers), `oferta.ts` (ciclos y precios), `site.ts`, `faq.ts` |
| `src/lib/url.ts`           | `href()`: todo enlace interno pasa por aquí para respetar el `base` y la barra final                                             |
| `src/lib/precio.ts`        | Redondeo y desglose de impuestos, compartido por tarjetas y checkout                                                             |
| `src/layouts/`             | `BaseLayout` (head, fuentes), `SiteLayout` (header + footer + reveal), `CheckoutLayout`                                          |
| `src/components/`          | Compartidos en la raíz (`SiteHeader`, `SiteFooter`, `PriceCard`, `Icon`…); una subcarpeta por página                             |
| `src/assets/`              | Las fotos que usa el sitio, optimizadas por Astro al construir                                                                   |
| `scripts/capturas.mjs`     | Las capturas y el recorrido del checkout                                                                                         |
| `docs/`                    | Brief de lo recibido, decisiones tomadas y abiertas, la especificación de diseño de Stitch                                       |
| `fuentes/` (no versionado) | El material tal como llegó de Mari: HTML, zips, audio, fotos de estudio, capturas                                                |

**Tres sistemas visuales conviven por diseño**: las páginas editoriales (Cormorant Garamond + Nunito),
el primer Stitch (Bodoni Moda + Plus Jakarta Sans, `data-theme="stitch"`) y el inicio
(Cormorant Garamond + Plus Jakarta Sans, `data-theme="inicio"`). Cada tema cambia los pocos tokens
que difieren; el resto es común. Unificar tipografía es cambiar dos variables.

Las fuentes se autoalojan con `@fontsource`; nada se carga de Google. Plus Jakarta Sans (y Bodoni en
`/inicio-stitch/`) solo la cargan las rutas que la usan.

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
- [ ] Pagos reales: Stripe (tarjeta / Apple Pay), PayPal, verificación manual de Zelle — cada punto está marcado `INTEGRATION POINT` en `Checkout.astro`
- [ ] CRM: alta del cliente y del pedido (el prototipo solo lo escribe en consola)
- [ ] Agenda: widget de Calendly en la confirmación
- [ ] Textos legales de Verónica en `/legal/*`
- [ ] Dominio propio y DNS; quitar `noindex`/robots
- [ ] Analítica y monitoreo (observabilidad va en la fase 1, no después)

## Convenciones

- El copy es de Verónica y de Mari. **No se inventa texto en su voz.** Lo único escrito aquí son
  rótulos de navegación, las páginas internas y los marcadores legales.
- Un precio, una Layer, un enlace: se escriben **una vez** en `src/data/` y se leen desde ahí.
- Antes de mandarle algo a Mari: `npm run verify` y `npm run capturas`, y mirar las capturas.
- Commits sin pie de coautoría.
