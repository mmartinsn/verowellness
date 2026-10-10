# Dominio y Stripe: la sesión que los pone en marcha

Lo que decidió Santiago el 10-oct-2026 (`DECISIONES.md` § 39): el sitio de Astro va a
`veronicawellness.com`, con el `noindex` mientras siga siendo prototipo, y la caja de Webflow a
`pago.veronicawellness.com`. Stripe se conecta en modo prueba. Este documento es el plan de esa
sesión: qué hay hoy, qué se cambia, quién lo hace y cómo se comprueba.

## Lo que hay hoy (medido el 10-oct con `nslookup` contra 1.1.1.1 y 8.8.8.8)

| Registro | Valor                                                           | Qué es                                                      |
| -------- | --------------------------------------------------------------- | ----------------------------------------------------------- |
| NS       | `ns45.domaincontrol.com`, `ns46.domaincontrol.com`              | Los DNS están en GoDaddy                                    |
| A `@`    | `3.33.130.190`, `15.197.148.33`                                 | Página de estacionamiento de GoDaddy (redirige a `/lander`) |
| `www`    | alias de `@`                                                    | Lo mismo                                                    |
| MX `@`   | `aspmx.l.google.com` (1), `alt1`/`alt2` (5), `alt3`/`alt4` (10) | **Correo de Google Workspace**                              |
| TXT `@`  | `google-site-verification=FyyB7oXD…`                            | Verificación de Google                                      |
| TXT `@`  | `v=spf1 include:dc-aa8e722993._spfm.veronicawellness.com ~all`  | SPF del correo                                              |
| `pago`   | no existe                                                       |                                                             |

**No se tocan los MX ni los dos TXT**: son el correo de Verónica. Solo cambian `@`, `www` y `pago`.

## Quién hace qué

| Paso                                                         | Lo hace                            | Por qué esa persona                                                         |
| ------------------------------------------------------------ | ---------------------------------- | --------------------------------------------------------------------------- |
| Registros en GoDaddy                                         | Santiago                           | Tiene la cuenta                                                             |
| Dominio propio en GitHub Pages (Settings → Pages)            | Mari, o quien tenga admin          | Santiago tiene permiso de escritura, no de administrador (medido el 10-oct) |
| Dominio `pago.` en Webflow (Site settings → Publishing)      | Santiago, con la sesión de Webflow | Lo hace la interfaz; la API no lo expone                                    |
| Conectar Stripe en Webflow (Settings → Ecommerce → Payments) | Santiago                           | El inicio de sesión de Stripe es suyo                                       |
| Código, publicación del puente, pruebas                      | La sesión                          | Rama `dominio`, ya preparada                                                |

## Pasos, en orden

1. **Antes de empezar:** el PR #1 (rama `webflow`) mergeado en `main`, con el OK de Santiago. Y el
   cambio del sitio de Webflow que quedó sin publicar el 10-oct a las 14:20 UTC: publicarlo o
   descartarlo, sabiendo quién lo hizo, porque `vw puente --aplicar` se niega mientras exista.
2. **GoDaddy, registros de la raíz y `www`** (comprobar las IP en la documentación de GitHub Pages
   ese mismo día):
   - Quitar los dos A de estacionamiento y apagar el reenvío o la página «lander» si GoDaddy la
     tiene como reenvío.
   - A `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`.
   - AAAA `@` → `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`,
     `2606:50c0:8003::153`.
   - CNAME `www` → `mmartinsn.github.io`.
3. **GitHub Pages:** Settings → Pages → Custom domain = `veronicawellness.com`; cuando aparezca
   el certificado, «Enforce HTTPS». Con despliegue por Actions no hace falta un archivo `CNAME`.
4. **Código:** mergear la rama local `dominio` (un solo commit encima de `webflow`; si `webflow` avanzó,
   `git rebase webflow` y `npm run vw -- puente` para regenerar el puente): cambia
   `src/lib/despliegue.ts` (sitio, base, URL pública y dominio de pago) y regenera
   `webflow/pedido.html` con la nueva URL de regreso. El sitio sigue con `prototipo = true`, o sea
   con `noindex`, y `public/robots.txt` sigue en `Disallow: /`, que en la raíz del dominio pasa a
   valer. Su `dist/` se comprobó idéntico al de `cfdc54d` construido en esa misma dirección. **Al
   mergearla, `vw paridad` da 185 diferencias** (su línea base, `capturas/base/dist`, es de la
   dirección vieja): se rehace la línea base con la receta de `cerebro/revision-2026-10-10.md`,
   cambiando `site` y `base` en el `astro.config.mjs` de la copia de `cfdc54d`.
5. **Webflow:** agregar `pago.veronicawellness.com` como dominio propio. Webflow muestra el CNAME
   (hoy suele ser `cdn.webflow.com`) y a veces un TXT de verificación; ambos van en GoDaddy. Publicar
   también en ese dominio.
6. **Puente:** `npm run vw -- puente` regenera `webflow/pedido.html` con la nueva URL de regreso;
   después `--aplicar`. Luego, `npm run vw -- probar-puente --base https://pago.veronicawellness.com`.
7. **Stripe en modo prueba:** Settings → Ecommerce → Payments → Stripe → conectar. Ver en esa
   pantalla si Webflow ofrece modo de prueba. Si lo ofrece, se activa y se hace una compra con la
   tarjeta de prueba de Stripe. **Si no lo ofrece, no se activa «Enable Checkout»**: con la cuenta
   real conectada, activarlo empieza a cobrar.
8. **Comprobar:** `nslookup` de `@`, `www` y `pago` (y que los MX sigan iguales);
   `https://veronicawellness.com/` da 200 con `noindex`; el pedido de prueba llega al checkout
   en `pago.`; `npm run vw -- auditar` sin hallazgos nuevos; capturas contra el dominio
   (`npm run capturas -- --base https://veronicawellness.com`). Y que `/1-1/` lleve a
   `/asesorias/`: hoy, bajo `/verowellness/`, esa redirección da 404 porque Astro no le antepone la
   base al destino (medido el 10-oct); con la base vacía queda bien sola.

## Si algo sale mal

- **El sitio no carga en el dominio:** volver a poner en GoDaddy los A `3.33.130.190` y
  `15.197.148.33` y quitar el dominio propio en GitHub Pages; el sitio sigue en
  `mmartinsn.github.io/verowellness/` hasta revertir la rama `dominio`.
- **El correo deja de llegar:** no debería, porque no se tocan los MX. Si pasa, comparar los MX y el
  SPF con la tabla de arriba.

## Lo que queda después, antes del cobro real

Está en `WEBFLOW.md` § Pendiente a mano: impuesto, envío de exámenes, la decisión sobre ofertas y
cargo, los mensajes del puente, los correos de la tienda y el paso de resumen del sitio. «Enable
Checkout» es lo último.
