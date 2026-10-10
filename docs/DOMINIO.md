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

| Paso                                                         | Lo hace              | Por qué                                                                                             |
| ------------------------------------------------------------ | -------------------- | --------------------------------------------------------------------------------------------------- |
| Registros en GoDaddy                                         | Santiago, a mano     | Tiene la cuenta; GoDaddy no deja iniciar sesión con VPN                                             |
| Dominio propio en GitHub Pages (Settings → Pages)            | La cuenta de Mari    | El repo es de una cuenta personal: GitHub no da rol de admin a los colaboradores (medido el 10-oct) |
| Dominio `pago.` en Webflow (Site settings → Publishing)      | La sesión, en Chrome | Lo hace la interfaz; la API no lo expone                                                            |
| Conectar Stripe en Webflow (Settings → Ecommerce → Payments) | Santiago             | El inicio de sesión de Stripe es suyo                                                               |
| Código, publicación del puente, pruebas                      | La sesión            | Rama `dominio`, ya preparada                                                                        |

## Pasos, en orden

1. **Antes de empezar** (hecho el 10-oct): el PR #1 mergeado en `main` (`ec94e51`), la rama
   `dominio` pasada encima con `git rebase main`, y la línea base de paridad
   (`capturas/base/dist`) rehecha con `cfdc54d` construido en la dirección nueva: `vw paridad`
   exacta y `diff -rq` idéntico. La de `github.io` quedó en `capturas/base/dist-github-io`.
2. **Webflow, `pago.`:** Publishing → Add a custom domain → **Manually add domain** (no «Quick
   connect», que cambia el DNS de GoDaddy por su cuenta). Webflow pide dos registros, que van en
   GoDaddy: TXT `_webflow.pago` con el `one-time-verification=…` que muestra, y CNAME `pago` →
   `cdn.webflow.com`. Después, «Verify domain» y publicar también en ese dominio. No depende del
   corte de la raíz: mientras `comercio.modo` sea `'prototipo'` el sitio no manda a `pago.`; lo usa
   el puente.
3. **GitHub Pages, antes que el DNS:** Settings → Pages → Custom domain = `veronicawellness.com`.
   GitHub pide este orden: un dominio que apunta a Pages sin estar puesto en un repo lo puede tomar
   otro. Desde aquí hasta el paso 5 el sitio se ve roto, así que 3, 4 y 5 van de corrido.
4. **GoDaddy, raíz y `www`** (IP comprobadas en la documentación de GitHub Pages el 10-oct):
   - Quitar los dos A de estacionamiento y apagar el reenvío o la página «lander» si GoDaddy la
     tiene como reenvío.
   - A `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`.
   - AAAA `@` → `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`,
     `2606:50c0:8003::153`.
   - CNAME `www` → `mmartinsn.github.io`.
5. **Código:** push de `dominio` a `main` (avance rápido). Cambia `src/lib/despliegue.ts` (sitio,
   base, URL pública y dominio de pago) y `webflow/pedido.html` con la nueva URL de regreso. El
   sitio sigue con `prototipo = true`, o sea con `noindex`, y `public/robots.txt` sigue en
   `Disallow: /`, que en la raíz del dominio pasa a valer. Con despliegue por Actions no hace falta
   un archivo `CNAME`.
6. **HTTPS:** cuando aparezca el certificado, «Enforce HTTPS» en Settings → Pages. Mientras tanto
   anda `http://`.
7. **Puente:** con la raíz respondiendo, `npm run vw -- puente --aplicar`; luego
   `npm run vw -- probar-puente --base https://pago.veronicawellness.com`.
8. **Stripe en modo prueba:** Settings → Ecommerce → Payments → Stripe → conectar. Ver en esa
   pantalla si Webflow ofrece modo de prueba. Si lo ofrece, se activa y se hace una compra con la
   tarjeta de prueba de Stripe. **Si no lo ofrece, no se activa «Enable Checkout»**: con la cuenta
   real conectada, activarlo empieza a cobrar.
9. **Comprobar:** `nslookup` de `@`, `www` y `pago` (y que los MX sigan iguales);
   `https://veronicawellness.com/` da 200 con `noindex`; `mmartinsn.github.io/verowellness/`
   redirige al dominio; el pedido de prueba llega al checkout en `pago.`;
   `npm run vw -- auditar` sin hallazgos nuevos; capturas contra el dominio
   (`npm run capturas -- --base https://veronicawellness.com`). Y que `/1-1/` lleve a
   `/asesorias/`: bajo `/verowellness/` esa redirección daba 404 porque Astro no le antepone la
   base al destino (medido el 10-oct); con la base vacía queda bien sola.

## Si algo sale mal

- **El sitio no carga en el dominio:** volver a poner en GoDaddy los A `3.33.130.190` y
  `15.197.148.33`, quitar el dominio propio en GitHub Pages y revertir en `main` el commit de
  `dominio`; el sitio vuelve a `mmartinsn.github.io/verowellness/`.
- **El correo deja de llegar:** no debería, porque no se tocan los MX. Si pasa, comparar los MX y el
  SPF con la tabla de arriba.

## Lo que queda después, antes del cobro real

Está en `WEBFLOW.md` § Pendiente a mano: impuesto, envío de exámenes, la decisión sobre ofertas y
cargo, los mensajes del puente, los correos de la tienda y el paso de resumen del sitio. «Enable
Checkout» es lo último.
