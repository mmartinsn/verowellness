# El sitio de Webflow: qué está hecho y qué se hace a mano

El sitio de Webflow es **«Veronica's Radical Site»** (`6ac29c3b8c31cd570fd18ee3`), plan Ecommerce
Standard, del workspace de Verónica. Hoy solo se publica en su subdominio de webflow.io, con la
indexación apagada. El sitio homónimo en plan Starter no se usa.

## Hecho por API (repetible con `npm run vw -- …`)

- [x] 13 colecciones del CMS con sus campos, relaciones y textos de ayuda (`esquema`).
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
- [ ] **Pasarela** (Verónica): Settings → Ecommerce → Payments → conectar Stripe (empresa de
      EE. UU.) y PayPal. Sin esto el checkout no cobra.
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
- [ ] **Dominio** (`pago.veronicawellness.com`) y redirigir inicio, productos y categorías del
      sitio de Webflow al sitio de Astro.
