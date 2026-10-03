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

18. **2026-10-03 — Mi método, Asesorías, fotos y fichas de exámenes.** **Mi método (19–27):**
    menú «Mi método»; hero sin «del terreno a la célula», con la frase del síntoma y el botón
    del sitio; orden hero → Cinco capas → El principio → La idea central → puente; «Entender cada
    detalle de tu historia y crear un plan de acción» y «capa» en el punto 2; nota del mapa en
    grande; tarjetas sin «Se conecta con»; herramientas con «Suplementos, técnicas vanguardistas,
    sueros de vitaminas, péptidos…»; el puente desglosa los pasos y muestra los precios
    (componentes compartidos `components/oferta/PasosProceso` y `BloquePrecios`, usados también
    en el inicio y Asesorías). **Asesorías (28–35):** «1:1» → «Asesorías» (`/asesorias`, `/1-1`
    redirige); «un proceso individual y personalizado»; las cuatro preguntas en tarjetas; «No
    necesitas hacer más»; el proceso con fondo en movimiento, pasos que aparecen al desplazarse,
    30–60 días, Layer Map como plan por fases y un 5.º paso Next Layer Cycle; entregables mitad
    texto y mitad imagen (recorte de manos de ZGPH1218, sin cara ni sticker) con la explicación
    nueva del Layer Map; precios compartidos y «el siguiente paso» con las dos opciones.
    **Fotos:** las originales con el pelo oscurecido por Codex (retoque por color con máscara,
    cara intacta; fuentes en `fuentes/fotos-pelo-2026-10-03/`). **Exámenes:** cada examen abre
    una ficha (nombre, gancho, precio y agregar, qué mide, por qué importa, ideal si, lo que
    obtienes); textos de Codex en `src/data/fichas-examenes.ts`, solo desde la descripción de
    Verónica. «Clic» sin k (Mari).

19. **2026-10-03 — Exámenes (cambios 35–42).** Orden: hero → aviso «Los exámenes no son
    obligatorios para tus asesorías…» (frase de Verónica en «tú») → «De tu pedido a tus
    resultados» → catálogo por grupo con buscador → los quince síntomas e intereses → por qué →
    FAQ. Grupos con los nombres del documento (Gastrointestinal, Reacciones a alimentos,
    Hormonales, Toxinas y metales pesados, Anti-aging, Salud vaginal…), uno a la vez en pestañas;
    el buscador recorre nombre, laboratorio, muestra y descripción. Los quince síntomas, sus
    ejemplos, preguntas («¿Te conviene…? Estas son nuestras opciones:») y exámenes son el texto
    rojo literal de Verónica (`data/sintomas.ts`); en ansiedad/depresión, embarazo, articulaciones
    y autoinmune va primero un recuadro de orientación con el botón a Asesorías. Fondos
    alternados para aligerar: aviso, proceso, catálogo y FAQ en claro; hero, síntomas y «por
    qué» en oscuro. Rótulos de interfaz del catálogo (título, buscador, sin resultados) por
    Claude. «Perfil hepático de tu catálogo» → «de nuestro catálogo».

20. **2026-10-03 — Tienda (43–47) y checkouts.** Precios 9.99 / 19.99 (más vendido) / 12.99 y la
    cuarta guía «Vuelve a sentirte tú» a 19.99 (más vendido) con su portada; los textos de las
    tres guías son los de Verónica tal cual (título, pregunta, párrafo, «Dentro encontrarás» y
    cierre); la de hormonas, del manuscrito v4. **Checkouts:** 7 % en todos (ya estaba); el bonus
    del Initial se ve en el resumen; en Layer Session, Initial y Next, antes de pagar,
    «¿Deseas adquirir alguna de nuestras guías?» con las cuatro guías a precio normal; en la
    tienda, al llegar, una ventana ofrece la siguiente guía que no está en el pedido (recetario →
    hackear → hormonas → GLP-1) con 15 % de descuento «solo en este pedido» (porcentaje propuesto,
    a confirmar); en exámenes, Sí/No a la cita de lectura (1 consulta USD 150 «Se brinda lectura
    de exámenes y plan de acción», 2 consultas USD 269 «Aseguras el seguimiento…»), con el aviso
    «se lee 1 examen por cita…», y el fee del laboratorio aparte y sin impuesto, USD 25 por examen
    (tope de lo que dio Verónica, a confirmar). «Overall pick up» del cambio 39 = la opción que
    conviene elegir (nota de voz de Verónica, 03-oct): la de 2 consultas lleva «Recomendada» y
    viene marcada por defecto. Totales probados en navegador (p. ej. 2 exámenes 399.60 + 7 % 27.97 + fee
    50 = 477.57).

21. **2026-10-03 — Ajustes de Mari sobre lo publicado.** Exámenes: más aire alrededor del aviso;
    una figura de línea por examen en el catálogo (`data/iconos-examenes.ts`, dibujadas por
    Claude); las tarjetas de síntomas ya no despliegan su lista abajo: llevan al catálogo, que
    muestra la vista de ese síntoma (preguntas de Verónica, orientación y «Ver todos los
    grupos»), y `/examenes/#<síntoma>` la abre directo. Asesorías: la foto de «Tres piezas» es la
    de manos en la laptop que generó Codex el 03-oct (sin cara). Tienda: textos resumidos por
    Claude con las palabras de Verónica (Codex llegó a su límite de uso; los pule después).

22. **2026-10-03 — Catálogo de exámenes al estilo de la referencia de NutriWhite** (captura de
    Mari). Sin figuras por examen (a Mari no le gustaron). Pastillas de grupo con ícono, centradas;
    encabezado del grupo con ícono, nombre y una línea de qué evalúa (`data/grupos-examenes.ts`,
    líneas de Claude para pulir con Codex); tarjetas anchas de a dos con nombre, precio grande,
    el gancho de la ficha, «Ver ficha completa», «Agregar» y «Solo este» (deja solo ese examen en
    la selección y va al checkout). En el teléfono las pastillas se deslizan y las tarjetas se
    apilan. Fuera la nota «Los grupos siguientes organizan…» (Mari).

23. **2026-10-03 — Grupos largos más cortos.** Cada grupo muestra 4 tarjetas y un botón «Ver los N
    exámenes»; «Reacciones a alimentos» se ve como comparador (alimentos, anticuerpos, qué
    incluye, precio, Agregar y Solo este), con los datos leídos del nombre de cada panel
    (`comparadorAlimentos` en `data/grupos-examenes.ts`); en el teléfono cada fila se vuelve una
    ficha compacta. La búsqueda sigue recorriendo todos los exámenes.

24. **2026-10-03 — Página «Sobre mí»** (`/sobre-mi`, en el menú tras Inicio; el inicio enlaza con
    «Conoce mi historia»). Objetivo de Mari: que la persona conecte y diga «es ella». Hechos de
    la versión resumida de Verónica; títulos y conectores de Claude (Mari: «eres mi diseñador UX
    y copywriter»). Recorrido: «Antes de ser nutricionista, fui paciente» con su retrato en arco →
    «¿Te suena?» (cuatro frases de su historia como espejo) → su historia como capas que se
    apilan hasta «capa por capa» → «Tu síntoma no es el problema» → «Por eso mi trabajo empieza
    escuchándote» (tres pilares y a quién acompaña) → +8 años y +5.000 casos → testimonios
    reservados → nota final firmada «Vero». Fotos con el pelo oscurecido: té, bowl y bata.

25. **2026-10-03 — «Reacciones a alimentos» como elección guiada** (en lugar de la tabla; Mari:
    «más fácil de entender visualmente»). «¿Qué quieres saber?» con cuatro caminos: «¿El gluten
    me afecta?», «¿Qué alimentos me inflaman o me hinchan?», «Como mayormente plantas», «Además
    tengo reacciones inmediatas»; cada uno muestra solo sus paneles, con la cantidad de alimentos
    en barra y qué miden en palabras simples tomadas de las descripciones de Verónica (IgG =
    reacción retardada, IgE = alergia inmediata, celiaquía). Datos en `caminosAlimentos` y
    `mideAlimentos` (`data/grupos-examenes.ts`).

26. **2026-10-03 — Testimonios.** Componente `Testimonios.astro` con datos en
    `data/testimonios.ts`, como muro de tarjetas (las fotos vienen de capturas y se pixelaban en
    grande; Mari pidió otra propuesta): frase literal destacada en grande, extracto con «Leer
    más», y al pie foto pequeña de 56 px (o inicial), nombre, lugar y motivo. Tres columnas que se
    llenan de izquierda a derecha por `prioridad` (los más potentes en la primera fila; la
    tarjetas alternan tonos suaves de la paleta: salvia, arena, rosa y blanco); en el teléfono, una
    fila que se desliza. Van en Sobre mí y en
    Asesorías antes de los precios (los tres primeros). Textos tal cual los mandó Mari, solo con
    ortografía corregida: Lorena González, Liza Koutcharyan (foto), Fabiana de Luca (foto), Mouna
    Harbie, Sofía Molina, Patricia Medel (foto), Mariexis Palacios (foto), Margarita Medel (foto) y
    Yisandra Sori (foto).

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
