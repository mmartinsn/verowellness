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
- [x] **Pasarela** (11-oct): Stripe conectado con la cuenta que Verónica ya usa
      (`DOMINIO.md`). Webflow no tiene modo de prueba: «Enable Checkout» es lo que empieza a cobrar.
      PayPal lo conectó Mari ese día.
- [x] **Impuesto** (20-oct, DECISIONES § 60): el cálculo automático de EE. UU. está encendido, con
      Florida como sede (la dirección de la tienda), y Webflow no admite una tasa manual. Exámenes
      y asesorías en `standard-taxable` (Florida cobra según el condado de quien compra), guías y
      ofertas en `digital-goods` y el cargo de laboratorio en `standard-exempt`, sembrados y
      publicados. Falta el texto de Verónica para la FAQ y el resumen del checkout, que dicen «7 %».
- [ ] **Envío de exámenes** (11-oct, Santiago): zona «Domestic Shipping» (EE. UU.) con el método
      «Envío incluido», gratis por pedido, con la frase de la FAQ. Fuera de EE. UU. se contacta a
      Verónica: no hay zona internacional. **No funciona el 20-oct**: con direcciones completas de
      Hialeah y Nueva York la caja no ofrece ningún envío y no deja pagar un examen (DECISIONES
      § 60 y § Abiertas). Revisar la zona y las condiciones del método.
- [x] **Datos de la empresa** (11-oct): Veronica Wellness, 6220 NW 173rd St 719, Hialeah, FL 33015.
- [ ] **PDF de las guías** (Verónica): se suben y se ponen como descarga del producto. Hecho para
      «Vuelve a sentirte tú» y su oferta (−15%) el 18-oct (Mari): el PDF va en los Assets del sitio
      de Webflow y su URL del CDN en Downloads, con el nombre del producto como «File name».
- [x] **Calendly**: las reales en Asesorías (Mari, 11-oct).
- [ ] **Checkout** (Mari): vestirlo con la marca (Cormorant + Nunito, ivory, charcoal, clay) y
      agregar los campos extra (teléfono, «¿cómo me conociste?», consentimiento). Apple Pay y Google
      Pay se saltan esos campos.
- [ ] **Dominio**: `pago.veronicawellness.com` hecho el 11-oct (`DOMINIO.md`). Falta redirigir el inicio y las categorías del sitio
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
- [x] **Lo que el sitio pasa a la caja** (13-oct, pegado por Mari en Checkout y en Checkout (PayPal), y
      probado): `webflow/caja.html` en el pie de las dos páginas de la caja (`npm run vw -- caja --aplicar`, o pegado a mano en su Custom code «Before
      </body>», reemplazando el `cupon.html` anterior). El campo «Discount Code» de la caja ya está
      (Mari, 13-oct). DECISIONES § 56.
- [x] **Enable Checkout** (Santiago, 11-oct): el interruptor del cobro real, encendido con lo que
      quedó abierto en DECISIONES § 54.
- [x] **App de Webflow Cloud** `verowellness-cobro` en `pago.veronicawellness.com/cobro` (16-oct,
      DECISIONES § 57): el cobro con Klarna, con el secret `STRIPE_KLARNA_KEY` (clave restringida real
      de `acct_1S3TX…`). Se despliega con `vw cobro --aplicar` o la CLI de Webflow (`INTEGRACION.md`).

## Vuelta a las páginas de gracias (TYP) — para Santiago

Desde el 11-oct cada producto tiene su página de gracias en el sitio: `/gracias/layer-session/`,
`/gracias/initial-layer-cycle/`, `/gracias/next-layer-cycle/`, `/gracias/examenes/` y
`/gracias/tienda/` (`src/pages/gracias/[tipo].astro`, DECISIONES § 49). El checkout de prueba ya
termina en ellas. Con el cobro real falta que la confirmación de pedido de Webflow
(`pago.veronicawellness.com`) mande a la persona a la suya:

- [x] **Script en «Order Confirmation»** (11-oct): `npm run vw -- confirmacion --aplicar`
      (`webflow/confirmacion.ts`, la regla en `src/lib/comercio/confirmacion.ts`). Lee los nombres
      de los productos que Webflow pinta en la confirmación, los cruza con el snapshot y redirige.
      **Por verificar con el primer pedido real**: que los nombres salgan en
      `.w-commerce-commerceboldtextblock` como en la plantilla. La plantilla publicada no tiene
      bloque de descargas, así que hoy `descargas=` va vacío y la página de gracias dice que el
      enlace llega por correo. La regla:
  - con un examen → `/gracias/examenes/`, y `lectura=1` si el pedido trae una asesoría;
  - con una asesoría (sin exámenes) → `/gracias/<slug de la asesoría>/`;
  - solo guías → `/gracias/tienda/?guias=<ids>`;
  - en todos, `descargas=` con la lista JSON `[{"nombre","url"}]` de los enlaces de descarga que
    Webflow muestra para ese pedido (el nombre como lo escribe Webflow; la TYP ignora el sufijo
    «(−15%)» y los acentos al emparejar). Solo se aceptan URL `https://`.
- [ ] **Descargas**: los PDF de las guías como descarga de cada producto digital (también en sus
      ofertas) y la «Guía de alimentación anti-inflamatoria» como descarga del Initial Layer Cycle
      (bonus; la TYP la busca por «anti-inflamatoria» en el nombre). **Por verificar:** que la
      página de confirmación de Webflow exponga esos enlaces, y que un producto de servicio admita
      una descarga; si no, el bonus necesita otra vía.
- PDF en la carpeta «Ebook y cursos» de Mari: hackear, recetario, GLP-1 y la guía
  anti-inflamatoria. «Vuelve a sentirte tú» salió a la venta el 18-oct con su PDF en los Assets de
  Webflow (Mari, DECISIONES § 58).

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
| Suplementos | Layers; Ajustes (Fullscript); Textos de sección › `suplementos` (`etiqueta-si`, `etiqueta-no`, `principios`, `aviso`, `orden`, `frascos`)                                                                                                                                                     |
| Checkout    | Asesorías, Guías y Productos; Ajustes (Zelle y descuento)                                                                                                                                                                                                                                     |

**Cómo invitar a Mari:** en el espacio de trabajo de Verónica en Webflow, la sección de miembros del
workspace → invitar con su correo. El tipo de asiento (editar o solo revisar) decide si tiene costo;
lo elige Verónica. Con acceso de revisión ya ve todas las colecciones y los productos.
