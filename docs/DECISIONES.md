# Decisiones al ensamblar el prototipo — y las que quedan abiertas

Fecha: 2026-09-21. Lo que se decidió al convertir las cinco páginas de Mari en un sitio, con la
razón de cada una, y lo que **no** se decidió porque le toca a Mari o a Verónica.

## Tomadas

1. **Dos inicios conviven: `/` es el de Stitch, `/inicio-editorial/` el editorial.** Mari dijo en
   el audio del 21-sep (1:46 am) que le gustó más el de Stitch — «creo que me gustó más el de
   Stitch» — así que ese es el predeterminado. El editorial se conserva íntegro porque es más
   completo (problema, premisa, herramientas ≠ estrategia, sobre Verónica) y para poder mostrar los
   dos. La que se apruebe se queda; la otra se borra junto con su carpeta de componentes.

2. **Tipografía: cada inicio conserva la suya; el resto del sitio va en Cormorant Garamond + Nunito.**
   Stitch trajo Bodoni Moda + Plus Jakarta Sans; las otras cuatro páginas, Cormorant + Nunito.
   Nunito es además lo que Verónica pidió para el recetario el 16-sep («una nunito… más redondita»,
   «lo que más me importa es que se pueda leer»). Está resuelto con tokens: `--font-serif` y
   `--font-sans` en `src/styles/global.css`, con la variante Stitch bajo `[data-theme='stitch']`.
   Unificar todo el sitio en una pareja es cambiar esas dos líneas.

3. **Paleta: se usan los hex de las páginas de Mari, no los siete del brand book.** Son parientes
   cercanos, no los mismos valores. Verónica dijo el 17-sep que **lo único intocable es la
   paleta**, así que esto hay que decidirlo a conciencia. La tabla:

   | Uso en las páginas | Hex de Mari           | Brand book (p. 4)       | Coincide |
   | ------------------ | --------------------- | ----------------------- | -------- |
   | bone (fondo)       | `#FBFAF6`             | —                       | —        |
   | ivory              | `#F8F6F1`             | Soft Ivory `#F8F6F1`    | sí       |
   | sand               | `#EFE7D9`             | Warm Sand `#EAE3D8`     | no       |
   | sage               | `#CFD7C4`             | Soft Sage `#C5CBBE`     | no       |
   | olive              | `#8E9480`             | Muted Olive `#9DA18D`   | no       |
   | clay / clay-deep   | `#E7B7A0` / `#D69A7C` | Nude Clay `#D6AA98`     | no       |
   | rose / rose-deep   | `#D8ABA6` / `#C98C86` | Dusty Rose `#C59A96`    | no       |
   | charcoal           | `#302F2A`             | Soft Charcoal `#343530` | no       |

   Mari diseñó con estos colores y la clienta los verá en la presentación. Si Verónica quiere los
   del brand book exactos, se cambian en `global.css` y todo el sitio los toma.

4. **Fotos: se usan los originales de la sesión de estudio a resolución completa.** Los HTML
   traían las fotos incrustadas y reducidas (760 px); Stitch cargaba una copia a 341×512 desde un
   CDN de Google. Se identificó cada una con su original (`ZGPH1213` para los héroes de inicio y
   The Method, `ZGPH1215` para el inicio de Stitch) y se usa el archivo de 1024×1536. Las dos que
   son recortes (retrato editorial, foto horizontal del 1:1) se conservan como venían.

5. **El pelo claro se dejó como en los diseños.** En el recetario Mari pidió (15-sep) que las fotos
   de bata blanca no se usaran sin oscurecerle el pelo a su tono natural. Para la web Mari misma
   las puso con el pelo claro, así que no se tocaron. Es una pregunta para ella (abajo).

6. **Una sola navegación: Inicio · The Method · 1:1 · FAQ, más el botón «Trabaja conmigo».** Las
   páginas traían menús distintos con enlaces a `#` sin destino. «Sobre mí» solo existe en la
   variante editorial y no entra al menú hasta que se decida el inicio.

7. **Una sola tarjeta de precio.** El inicio editorial y el 1:1 traían dos versiones casi iguales
   de la misma tarjeta; ahora es un componente (`PriceCard.astro`) que lee `src/data/oferta.ts`.
   Los precios (247 / 197 USD, impuesto 7 %) están escritos una sola vez.

8. **El checkout es un prototipo y lo dice.** El pago se simula en el navegador; los puntos donde
   entran Stripe, PayPal, Zelle, el CRM y Calendly están marcados `INTEGRATION POINT`. Los datos de
   Zelle (VERODUD CORP · veronicadudamell@gmail.com) son los que Mari puso. En teléfono el resumen
   del pedido va arriba del formulario, para ver qué se compra antes de llenar nada.

9. **Sin fuente de iconos.** Stitch usaba Material Symbols desde Google; se cambiaron por SVG en
   línea (`Icon.astro`). Las tipografías también se autoalojan (`@fontsource`).

10. **Enlaces legales a páginas marcador.** El checkout enlaza términos, privacidad y aviso médico;
    existen para no romper el enlace y dicen «contenido pendiente». No se redactó nada en nombre de
    Verónica.

11. **Hosting de la vista previa: GitHub Pages como project site, repo privado.** La cuenta
    `santilanzb` permite Pages en repos privados (comprobado al crear el repo por API). El sitio
    está bajo `/verowellness/`; pasar a dominio propio es quitar `base` en `astro.config.mjs`.
    El 23-sep el repo se transfirió a `mmartinsn` para que la vista previa lleve el nombre de Mari
    (`mmartinsn.github.io/verowellness/`). Si su cuenta es Free, Pages no sirve repos privados.

12. **Las páginas de Claude Design (`.dc.html`) no se usaron como fuente.** Su texto coincide con
    los HTML de Mari en más del 95 % (medido por palabras); solo cambian la tipografía (Instrument
    Sans) y el envoltorio. Los HTML sueltos son la fuente canónica.

## Abiertas — para Mari y Verónica

- **¿Cuál inicio?** A (Stitch) o B (editorial). Hasta que se decida, `/variantes/` muestra los dos.
- **¿Una sola tipografía?** Si sí, ¿Cormorant + Nunito (el resto del sitio y el recetario) o
  Bodoni + Plus Jakarta (Stitch)?
- **¿Paleta de Mari o los siete hex del brand book?** Verónica blindó la paleta; conviene que lo
  vea con la tabla de arriba.
- **¿Fotos con el pelo claro o oscurecido?** Regla de Mari para el recetario vs. su uso aquí.
- **«Sobre mí» en el menú**: solo tiene sentido si gana la variante editorial o se añade la sección
  a la de Stitch.
- **Textos legales** y **aviso médico**: los redacta Verónica.
- **Pasarelas**: confirmar cuáles se contratan (Stripe, PayPal, Zelle manual) y si el impuesto es
  7 % para todos los países.
- **Agenda**: confirmar que es Calendly y las URL de los dos eventos.
