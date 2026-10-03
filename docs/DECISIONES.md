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

13. **2026-09-22 — El inicio es el segundo diseño de Stitch.** Mari lo pidió explícitamente
    («quiero que el home sea esta página») y entregó su export, que se guarda sin versionar en
    `fuentes/stitch-home-2026-09-22.html`. El primer Stitch se movió a `/inicio-stitch/`
    (`noindex`) y el editorial sigue en `/inicio-editorial/`; ninguno se borró. Lo que se ajustó
    al pasarlo al sitio, con su razón:
    - **Tipografía y tonos:** tercer tema, `data-theme="inicio"`: Cormorant Garamond + Plus Jakarta
      Sans, y los hex del export donde difieren (`ivory`, `sand`, `sage-deep`, `olive`, `rose`,
      `charcoal`, más `clay-rich` y `sand-light`). Las demás páginas no cambian.
    - **Foto del hero:** el export usa un fotograma de la sesión con laptop que no está en esta
      máquina; se usa `ZGPH1218` (misma sesión y pose, 1024×1536), guardada como
      `veronica-bata-laptop.jpg`. La copia de Stitch era de 341×512. Cambiarla es un archivo.
    - **Punto azul** junto a «Asesorías 100% online»: el export usaba `#60A5FA`, fuera de la paleta
      que Verónica blindó; va en `sage-deep`.
    - **Botón del header:** en el export está escrito con un `@media` dentro de `style=""` que el
      navegador descarta, así que en la vista previa de Mari no aparece. Se dejó oculto; la llamada
      a la acción está en el hero, en la página y en la barra fija del teléfono.
    - **FAQ:** el export no tiene FAQ y su enlace «FAQ» apuntaba al cierre. Se conserva el FAQ del
      inicio anterior, entre «Sobre Verónica» y el cierre, para que el enlace lleve a preguntas.
    - **Enlaces:** «Click aquí» de cada tarjeta va a su checkout; «Conoce The Layer Method™» (en
      «Sobre Verónica») va a `/el-metodo/` en vez de a `#oferta`, porque ahora esa página existe.
    - **Navegación:** entra «Sobre mí» (`/#sobre-mi`), como en el diseño. Resuelve la pregunta
      abierta sobre «Sobre mí».
    - **Movimiento:** el shader WebGL, el halo que sigue al cursor y la inclinación 3D se
      conservan; el shader se pausa fuera de pantalla y todo se detiene con «reducir movimiento».

14. **2026-09-23 — Página de Exámenes.** Pedida por Mari («que sea innovadora completamente»), con la
    lista de precios de Verónica como fuente. Decisiones, con las opciones recomendadas que Mari
    aprobó («todas las recomendadas»): se **compra** desde la página (selección → checkout de 5
    pasos) y se suma **7 %** de impuesto. Solo el precio de venta entra al sitio. Los CTA del home
    llevan al checkout del Initial Layer Cycle (pedido de Mari, 22-sep). Detalle y preguntas en
    [`EXAMENES.md`](EXAMENES.md).

15. **2026-09-23 — Correcciones de copy y SEO** (revisión de astra del 22-sep, aplicada a pedido de
    Mari). **SEO:** `noindex` en todo el prototipo con un solo interruptor (`prototipo` en
    `src/data/site.ts`; el `robots.txt` de la subcarpeta no protege nada); `og:url`, `og:image`
    (1200×630, `scripts/og-image.mjs`) y tarjetas de X/Twitter en todas las páginas; JSON-LD
    (`Organization`, `WebSite`, `Person`, `Service` con las dos ofertas en USD sin impuesto) en
    inicio y 1:1 (`src/lib/schema.ts`); `sitemap.xml` con inicio, The Method, 1:1 y Exámenes;
    títulos con intención de búsqueda en inicio, 1:1 y The Method; hero visible sin esperar al
    script; las cinco Layers legibles sin JS; menú móvil cerrado fuera del teclado (`inert`);
    anclas compensadas por el header; contraste de la Layer 03 (texto carbón) y del copyright;
    enlaces legales en el pie. **Copy:** concordancia de la primera FAQ; «garantiza» → «busca
    que»; duración del ciclo alineada con la oferta («en un máximo de 60 días»); el lema sale de
    una sola fuente (`marca.lema`); «Click aquí» → «Haz clic aquí», con etiqueta accesible.
    **No se tocó, porque son hechos de Verónica:** el mecanismo de la primera FAQ y el alcance
    clínico de la segunda («diagnóstico clínico sintomático»); los plazos y resultados de la
    tercera («dos a tres semanas», «compuertas emuntoriales»); la duración del Next (90 vs
    60–90 min); credenciales y perfiles sociales (no van en el JSON-LD hasta confirmarlos); el
    tono de clay para texto pequeño (paleta blindada); anglicismos («lifestyle», «Continuum»).

16. **2026-09-23 — Título profesional: Nutricionista** (confirmado por Mari). Va en `marca.titulo` y en
    el JSON-LD (`Person.jobTitle`). Los ebooks usan otros rótulos en portada («Asesora de Salud
    Holística e Integral» en el de azúcar; «Nutrición clínica · Medicina integrativa» en el de GLP-1);
    el recetario ya dice «Nutricionista».

17. **2026-10-03 — Ajustes de Verónica, página por página, sobre la versión del 29-sep.** Mari
    pidió volver a esa versión (se deshizo la ronda del 03-oct, que sigue en el historial) y
    aplicar el documento «AJUSTES PAGINA WEB…» con cuidado, sin rediseñar lo que no se pide.
    Reparto: diseño Claude; textos nuevos y fotos, Codex. **Inicio (cambios 1–18):** subtítulo
    «El método que trata tus síntomas por capas»; frase resaltada «Todos tus síntomas están
    conectados…»; botón «Trabaja conmigo · Click aquí» (el header usa la versión corta); los
    cinco «Toma esto para…»; la premisa con la frase nueva; THE LAYER METHOD como título y «El
    cuerpo no funciona por departamentos» como subtítulo; colores fijos de las capas según ATLAS
    (Nutrición carbón, Vías clay, Terreno sage deep, Célula rose, Hábitos olive) en
    `layers.ts`, también en el párrafo «Cómo se conectan»; «Se mapean y trabajan en conjunto, no
    una por una» en cursiva y centrada; los tres globos nuevos; paréntesis en «Herramientas»; sin
    ™ en todo el sitio; «del terreno a la célula» fuera del pie y del hero. **Precios (Mari):**
    1 consulta (Layer Session) USD 150 a la izquierda, 2 consultas para nuevas (Initial) USD 269
    a la derecha, con el bonus de la guía siempre; 2 consultas de control (Next) USD 210 sin
    precio público: bloque «Acceso privado · ¿Ya eres mi paciente?» con enlace a Instagram, y su
    checkout queda para el enlace del correo. Nuevo checkout `/checkout/layer-session`. «Evolución
    continua», «¿Completas tu primer ciclo?» y «Ahora decidimos cuál es tu Next Layer con un
    segundo ciclo.». Botón fijo también en escritorio. Seis preguntas frecuentes nuevas (Codex).
    Los textos de la Layer Session y las FAQ nuevas son de Codex; la Layer Session no dice
    duración porque no está confirmada.

## Abiertas — para Mari y Verónica

- **¿Borrar las variantes A y B?** El inicio ya está elegido (decisión 13); se conservan para comparar.
- **Foto del hero:** ¿el fotograma exacto del export (no está en esta máquina) o `ZGPH1218`?
- **¿Una sola tipografía?** El inicio trae Cormorant + Plus Jakarta; el resto del sitio, Cormorant +
  Nunito (lo que Verónica pidió para el recetario). ¿Se unifica, y con cuál sans?
- **¿Paleta de Mari o los siete hex del brand book?** Verónica blindó la paleta; conviene que lo
  vea con la tabla de arriba.
- **¿Fotos con el pelo claro o oscurecido?** Regla de Mari para el recetario vs. su uso aquí.
- **Textos legales** y **aviso médico**: los redacta Verónica.
- **Pasarelas**: confirmar cuáles se contratan (Stripe, PayPal, Zelle manual) y si el impuesto es
  7 % para todos los países.
- **Agenda**: confirmar que es Calendly y las URL de los dos eventos.
