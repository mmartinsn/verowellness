# El sitio de Webflow: qué está hecho y qué se hace a mano

El sitio de Webflow es **«Veronica's Radical Site»** (`6ac29c3b8c31cd570fd18ee3`), plan Ecommerce
Standard, del workspace de Verónica. Hoy solo se publica en su subdominio de webflow.io, con la
indexación apagada. El sitio homónimo en plan Starter no se usa.

## Hecho por API (repetible con `npm run vw -- …`)

- [x] 14 colecciones del CMS con sus campos, relaciones y textos de ayuda (`esquema`), incluida
      «Textos de sección» con 40 bloques.
- [x] 5 categorías de producto: Asesorías, Guías, Exámenes, Ofertas, Cargos.
- [x] 47 productos con su SKU, precio, clase de impuesto y si piden envío (`sembrar`).
- [x] 179 ítems del CMS con referencias e imágenes (`sembrar`).
- [x] El puente en el código del pie de la página «Pedido» (`puente --aplicar`).

## Hecho a mano en el Designer (10-oct)

- [x] Ecommerce activado, moneda USD (irreversible).
- [x] «Add to Cart» en la plantilla de producto (lo usa el puente).
- [x] Página «Pedido» (`/pedido`) con el elemento Cart (el puente lo usa para vaciar un carrito viejo).
- [x] Las 14 plantillas de colección en borrador: el CMS no se expone como páginas.

## Pendiente a mano

- [ ] **Campos de texto multilínea.** La API no puede activar «multi-line» en un campo de texto.
      Las listas y los párrafos se guardan con saltos de línea y llegan bien, pero para que se puedan
      editar cómodamente hay que activarlo en el Designer en estos campos:
  - Asesorías: descripción, descripción corta, incluye, incluye checkout, nota pie, confirmación texto.
  - Guías: subtítulo, gancho, para ti, incluye, cita, nota.
  - Exámenes: descripción, gancho, qué mide, por qué importa, ideal, obtienes, mide.
  - Áreas: descripción. Síntomas: ejemplos. Rutas de síntoma: pregunta. Caminos: ayuda.
  - Testimonios: motivos, destacado, texto. Preguntas frecuentes: pregunta, respuesta.
  - Layers: pregunta, observa texto, observa, cita.
  - Textos de sección: texto, ítems, nota, cita.
- [ ] **Token de solo lectura para el workflow `Datos desde Webflow`**: Site settings → Apps &
      Integrations → API access → Generate API token, con CMS, Ecommerce y Sites en «Read-only».
      Va como secret `WEBFLOW_SITE_TOKEN` del repo (lo pone Mari). El token de escritura no sale
      de la máquina de quien siembra.
- [ ] **Pasarela**: Settings → Ecommerce → Payments → conectar Stripe (empresa de EE. UU.) y
      PayPal. Santiago ya tiene acceso a Stripe (10-oct); se conecta en modo prueba en la sesión del
      dominio (`DOMINIO.md`). Sin pasarela el checkout no cobra.
- [ ] **Impuesto** (Verónica): Settings → Ecommerce → Taxes → cálculo automático en EE. UU. Las
      clases ya están puestas en cada producto (`service-professional`, `digital-goods`,
      `standard-exempt` para el cargo de laboratorio). El 7 % fijo del prototipo no existe en Webflow.
- [ ] **Envío de exámenes** (Verónica): los exámenes piden dirección; hace falta al menos una zona
      y un método de envío (el prototipo no cobraba envío; la FAQ menciona un cargo internacional).
- [ ] **Datos de la empresa** para la tienda (dirección; opcional en Webflow).
- [ ] **PDF de las 4 guías** (Verónica): se suben y se ponen como descarga del producto.
- [ ] **Calendly**: las tres URL del prototipo dan 404; van las reales en Asesorías.
- [ ] **Checkout** (Mari): vestirlo con la marca (Cormorant + Nunito, ivory, charcoal, clay) y
      agregar los campos extra (teléfono, «¿cómo me conociste?», consentimiento). Apple Pay y Google
      Pay se saltan esos campos.
- [ ] **Dominio** (`pago.veronicawellness.com`; pasos y registros en `DOMINIO.md`) y redirigir el inicio y las categorías del sitio
      de Webflow al sitio de Astro. **Las páginas de producto no se redirigen**: el puente abre
      `/product/<slug>` en un marco para usar su «Add to Cart», y con una redirección deja de
      poder leerlo.

- [ ] **Moneda**: ya es USD (10-oct). En la guía de Webflow solo falta abrir «Review currency
      settings» y confirmar el formato.
- [ ] **Página de producto** (Mari): la plantilla se ve en blanco y se llega a ella por URL. Si se
      diseña, tiene que conservar el botón «Add to Cart», que usa el puente, y conviene conservar el campo de cantidad (sin él, el puente agrega de a uno, más lento);
      `npm run vw -- probar-puente` avisa si se rompen.
- [ ] **Correos de la tienda** (Mari y Verónica): la confirmación de pedido y los demás salen en
      inglés y con el diseño de Webflow. El texto es de Verónica.
- [ ] **Enable Checkout** (Santiago, al final): es el interruptor del cobro real. Va después de la
      pasarela, el impuesto, el envío, los mensajes del puente y los correos, y de conectar el paso
      de resumen del sitio (`comercio.modo`).

## Dónde se edita cada página

Para Mari y Verónica: qué colección de Webflow alimenta cada página del sitio. Sale del código (los
`import` de cada página hasta sus datos), no de memoria. Los títulos y párrafos sueltos que todavía
están escritos en los componentes no están en Webflow; los mide `npm run vw -- censo`.

| Página      | Colecciones                                                                                                                                                                                                                                                                                   |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Todas       | Ajustes; Textos de sección › `sitio` / `continuidad`                                                                                                                                                                                                                                          |
| Inicio      | Asesorías y sus Productos (precios); Layers; Preguntas frecuentes (página «inicio»); Textos de sección › `inicio` (`problema`, `otra-mirada`, `herramientas`)                                                                                                                                 |
| Sobre mí    | Testimonios; Textos de sección › `sobre-mi` (`espejo`, `capas`, `acompano`, `pilares`)                                                                                                                                                                                                        |
| El método   | Layers; Textos de sección › `metodo` (`reframe-herramientas`)                                                                                                                                                                                                                                 |
| Asesorías   | Asesorías y Productos; Testimonios (los marcados «En asesorías»); Textos de sección › `asesorias` (`reconocimiento`, `proceso-temas`, `proceso-pasos`, `entregables-niveles`, `entregables-plan`, `entregables-extra`)                                                                        |
| Exámenes    | Exámenes, Áreas de exámenes, Tipos de muestra, Síntomas, Rutas de síntoma, Caminos de alimentos y Productos (precio y cargo de laboratorio); Preguntas frecuentes (página «exámenes»); Textos de sección › `examenes` (`porque-rutina`, `porque-funcional`, `porque-pilares`, `pasos-pedido`) |
| Tienda      | Guías y sus Productos (precio y ofertas); Textos de sección › `tienda` (`aviso-legal`)                                                                                                                                                                                                        |
| Suplementos | Suplementos y Layers; Preguntas frecuentes (la `inicio-01`); Textos de sección › `suplementos` (`etiqueta-si`, `etiqueta-no`, `principios`, `aviso`)                                                                                                                                          |
| Checkout    | Asesorías, Guías y Productos; Ajustes (Zelle y descuento)                                                                                                                                                                                                                                     |

**Cómo invitar a Mari:** en el espacio de trabajo de Verónica en Webflow, la sección de miembros del
workspace → invitar con su correo. El tipo de asiento (editar o solo revisar) decide si tiene costo;
lo elige Verónica. Con acceso de revisión ya ve todas las colecciones y los productos.
