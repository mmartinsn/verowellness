# Dominio y Stripe: la sesión que los pone en marcha

Lo que decidió Santiago el 10-oct-2026 (`DECISIONES.md` § 39): el sitio de Astro va a
`veronicawellness.com`, con el `noindex` mientras siga siendo prototipo, y la caja de Webflow a
`pago.veronicawellness.com`. Stripe se conecta en modo prueba. Este documento es el plan de esa
sesión: qué hay hoy, qué se cambia, quién lo hace y cómo se comprueba.

**En pausa desde el 10-oct:** el inicio de sesión de GoDaddy pide una verificación que llega a
Verónica, y no contestó. Se retoma cuando ella pueda dar el código en el momento.

## Lo que hay hoy (los 20 registros de GoDaddy, leídos en su panel y con `nslookup` el 10-oct)

| Tipo  | Nombre                                           | Valor                                                           | Qué es                                                      |
| ----- | ------------------------------------------------ | --------------------------------------------------------------- | ----------------------------------------------------------- |
| NS    | `@`                                              | `ns45.domaincontrol.com`, `ns46.domaincontrol.com`              | Los DNS están en GoDaddy                                    |
| SOA   | `@`                                              | `ns45.domaincontrol.com` (serial `2025082903`)                  | La zona no cambia desde el 29-ago-2025                      |
| A     | `@`                                              | «Parked» (resuelve a `3.33.130.190` y `15.197.148.33`)          | Página de estacionamiento de GoDaddy (redirige a `/lander`) |
| CNAME | `www`                                            | `veronicawellness.com.`                                         | Lo mismo                                                    |
| MX    | `@`                                              | `aspmx.l.google.com` (1), `alt1`/`alt2` (5), `alt3`/`alt4` (10) | **Correo de Google Workspace**                              |
| TXT   | `@`                                              | `google-site-verification=FyyB7oXD…`                            | Verificación de Google                                      |
| TXT   | `@`                                              | `v=spf1 include:dc-aa8e722993._spfm.veronicawellness.com ~all`  | SPF del correo                                              |
| TXT   | `dc-aa8e722993._spfm`                            | `v=spf1 include:_spf.google.com ~all`                           | El SPF de Google al que apunta el anterior                  |
| TXT   | `_dmarc`                                         | `v=DMARC1; p=none; rua=mailto:info@…`                           | DMARC del correo                                            |
| A     | `mail`                                           | `3.13.222.255`, `3.13.246.91`, `3.130.60.26`                    | De Verónica; van con los de Systeme.io                      |
| CNAME | `si14175901`                                     | `inbound.systeme.io.`                                           | **Systeme.io**                                              |
| CNAME | `systemeio1._domainkey`, `systemeio2._domainkey` | `key1.systeme.io.`, `key2.systeme.io.`                          | DKIM de Systeme.io                                          |

**Solo cambian el A de `@`, el CNAME de `www`, y se agregan `pago` y las dos verificaciones.** Todo
lo demás es el correo y Systeme.io de Verónica y no se toca. Tampoco se usan «Connect Domain»
(Airo), «Verify Domain Ownership» ni las pestañas Nameservers, Hostnames y DNSSEC, ni se agregan
registros CAA (pueden impedir que GitHub o Webflow saquen el certificado).

## Quién hace qué

| Paso                                                         | Lo hace              | Por qué                                                                                                  |
| ------------------------------------------------------------ | -------------------- | -------------------------------------------------------------------------------------------------------- |
| Registros en GoDaddy                                         | Santiago, a mano     | Tiene la cuenta; no deja iniciar sesión con VPN, y la verificación del inicio de sesión llega a Verónica |
| Dominio en GitHub (cuenta y Pages)                           | La cuenta de Mari    | El repo es de una cuenta personal: GitHub no da rol de admin a los colaboradores (medido el 10-oct)      |
| Dominio `pago.` en Webflow (Site settings → Publishing)      | La sesión, en Chrome | Lo hace la interfaz; la API no lo expone                                                                 |
| Conectar Stripe en Webflow (Settings → Ecommerce → Payments) | Santiago             | El inicio de sesión de Stripe es suyo                                                                    |
| Código, publicación del puente, pruebas                      | La sesión            | Rama `dominio`, ya preparada                                                                             |

## Pasos, en orden

1. **Antes de empezar** (hecho el 10-oct): el PR #1 mergeado en `main` (`ec94e51`) y la rama
   `dominio` pasada encima con `git rebase main`. Su línea base de paridad, `cfdc54d` construido en
   la dirección nueva, está en `capturas/base/dist-dominio` (`diff -rq` idéntico); mientras no se
   haga el corte, `capturas/base/dist` sigue siendo la de `github.io`. En la rama `dominio` la
   compuerta es `npm run vw -- paridad --base capturas/base/dist-dominio`.
2. **Ya agregados el 10-oct, sin verificar:** `pago.veronicawellness.com` en Webflow (Publishing →
   Manually add domain; no «Quick connect», que cambia el DNS de GoDaddy por su cuenta) y
   `veronicawellness.com` en los dominios verificados de la cuenta de Mari
   (<https://github.com/settings/pages>). Ninguno cambia nada hasta que exista su registro.
   `vw` publica Webflow solo en `webflow.io` (`publishToWebflowSubdomain`), así que el dominio sin
   verificar no le estorba.
3. **GoDaddy, todo de una vez** (IP comprobadas en la documentación de GitHub Pages el 10-oct; TTL de
   media hora en lo que cambia, para revertir rápido). Primero, en la sub-pestaña Forwarding,
   borrar el reenvío si lo hay. Después, en DNS Records:

   | Acción               | Tipo  | Nombre                              | Valor                                                               |
   | -------------------- | ----- | ----------------------------------- | ------------------------------------------------------------------- |
   | Agregar              | TXT   | `_github-pages-challenge-mmartinsn` | `3735b19e494bcb0eb0f0682534cfba`                                    |
   | Agregar              | TXT   | `_webflow.pago`                     | `one-time-verification=f8a168c3-b1dd-4587-a39c-567bdde99c00`        |
   | Agregar              | CNAME | `pago`                              | `cdn.webflow.com`                                                   |
   | Editar el A «Parked» | A     | `@`                                 | `185.199.108.153`                                                   |
   | Agregar              | A     | `@`                                 | `185.199.109.153`, `185.199.110.153`, `185.199.111.153` (uno a uno) |
   | Agregar              | AAAA  | `@`                                 | `2606:50c0:8000::153` … `2606:50c0:8003::153` (cuatro, uno a uno)   |
   | Editar               | CNAME | `www`                               | `mmartinsn.github.io`                                               |

   La verificación de la cuenta va primero porque GitHub pide que un dominio que apunta a Pages esté
   reclamado: si no, otra cuenta lo puede tomar.

   Para comprobar: `npm run vw -- dominio --solo-dns` compara los 14 registros de la tabla de
   arriba y de esta en Cloudflare y Google (por HTTPS: en esta máquina Node no tiene DNS por UDP).
   Si ya se había preguntado antes de guardar, pueden tener el «no existe» guardado hasta 10 min;
   el servidor de GoDaddy contesta al instante:
   `nslookup -type=TXT _webflow.pago.veronicawellness.com ns45.domaincontrol.com`.

4. **GitHub, con la cuenta de Mari:** «Verify» en los dominios verificados de la cuenta; después,
   en el repo, Settings → Pages → Custom domain = `veronicawellness.com` → Save. Desde aquí hasta
   el paso 5 el sitio se ve roto, así que 4 y 5 van de corrido.
5. **Código:** push de `dominio` a `main` (avance rápido) y pasar `capturas/base/dist-dominio` a
   `capturas/base/dist`. Cambia `src/lib/despliegue.ts` (sitio, base, URL pública y dominio de
   pago) y `webflow/pedido.html` con la nueva URL de regreso. El sitio sigue con
   `prototipo = true`, o sea con `noindex`, y `public/robots.txt` sigue en `Disallow: /`, que en la
   raíz del dominio pasa a valer. Con despliegue por Actions no hace falta un archivo `CNAME`.
6. **Webflow:** «Verify domain» en `pago.` y publicar también en ese dominio.
7. **HTTPS:** cuando aparezca el certificado, «Enforce HTTPS» en Settings → Pages. Mientras tanto
   anda `http://`.
8. **Puente:** con la raíz respondiendo, `npm run vw -- puente --aplicar`; luego
   `npm run vw -- probar-puente --base https://pago.veronicawellness.com`.
9. **Stripe:** no depende del dominio, pero sí de Verónica. Lo que se vio el 10-oct en el Designer
   (CMS → Ecommerce → Setup guide → Add payment provider): antes de los pagos, Webflow pide los
   datos de la tienda (nombre del negocio, dirección comercial, moneda e idioma), que son de
   Verónica. El sitio tiene plan **Ecommerce Standard** (42 USD al mes, 2 % por transacción,
   pagado con la tarjeta de Verónica desde el 4-oct), así que el hosting ya está. En la
   documentación y el foro de Webflow no aparece un modo de prueba para la tienda: **conectar
   Stripe no cobra, «Enable Checkout» sí**, y queda apagado hasta el cobro real.
10. **Comprobar:** `npm run vw -- dominio` da 14/14 registros y 7/7 respuestas: el inicio en 200
    con el mismo `robots` que `dist/`, `robots.txt` igual a `public/robots.txt`, `/1-1/` lleva a
    `/asesorias/` (bajo `/verowellness/` daba 404 porque Astro no le antepone la base al destino),
    `www`, `mmartinsn.github.io/verowellness/` y `http://` llevan a `https://veronicawellness.com/`,
    y `pago.` en 200. Además, el pedido de prueba llega al checkout en `pago.`,
    `npm run vw -- auditar` sin hallazgos nuevos y capturas contra el dominio
    (`npm run capturas -- --base https://veronicawellness.com`).

## Seguridad de la cuenta de GoDaddy

En la portada del dominio GoDaddy marca la protección en «Medium». Con la clienta: verificación en
dos pasos en la cuenta y, en Registration Settings, Domain Lock y Auto-renew activados (vence el
2-mar-2027, 22,99 USD al año).

## Si algo sale mal

- **El sitio no carga en el dominio:** volver a poner el A de `@` en «Parked», quitar el dominio
  propio en GitHub Pages y revertir en `main` el commit de `dominio`; el sitio vuelve a
  `mmartinsn.github.io/verowellness/`.
- **El correo deja de llegar:** no debería, porque no se tocan los MX. Si pasa, comparar los MX y el
  SPF con la tabla de arriba.

## Lo que queda después, antes del cobro real

Está en `WEBFLOW.md` § Pendiente a mano: impuesto, envío de exámenes, la decisión sobre ofertas y
cargo, los mensajes del puente, los correos de la tienda y el paso de resumen del sitio. «Enable
Checkout» es lo último.
