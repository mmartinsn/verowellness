# Exámenes — de dónde sale la página y qué queda por confirmar

Página `/examenes/` y checkout `/checkout/examenes/`. Última revisión: 2026-10-02, con los ajustes de
Verónica (documento «AJUSTES PAGINA WEB… examenes», cambios 35–42).

## Cómo está armada

De arriba abajo, con la lupa como único tramo oscuro («la amo», pero el resto se aclaró porque
cansaba la vista):

| Sección                       | Componente                     | Qué hace                                                                                                   |
| ----------------------------- | ------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| Hero de la lupa               | `examenes/HeroLupa.astro`      | El mundo microscópico bajo la lente; el botón baja a «¿No sabes qué examen…?»                              |
| Aviso                         | `examenes/AvisoAsesoria.astro` | Cambio 35: los exámenes no son obligatorios para las asesorías; elegir y priorizar es parte de la asesoría |
| De tu pedido a tus resultados | `examenes/Proceso.astro`       | Cambio 42: el paso a paso va antes de las categorías                                                       |
| Catálogo                      | `examenes/Catalogo.astro`      | Cambios 36 y 37: buscador y grupos del Excel (un grupo a la vez, para que la página no se alargue)         |
| ¿No sabes qué examen…?        | `examenes/PorSintoma.astro`    | Cambio 38: las 15 tarjetas de Verónica; cada una abre un panel con sus subcategorías                       |
| ¿Por qué estos exámenes?      | `examenes/PorQue.astro`        | Sin cambios de texto; tonos claros                                                                         |
| Preguntas frecuentes          | `examenes/FaqExamenes.astro`   | Con las preguntas nuevas sobre la cita de lectura y los fees                                               |
| Ficha de un examen            | `examenes/FichaExamen.astro`   | Una sola ficha por examen (nombre, laboratorio, precio, muestra, descripción, en qué tarjetas aparece)     |
| Selección                     | `examenes/Seleccion.astro`     | La barra flotante con el total; guarda la selección en `localStorage` (`CLAVE_SELECCION`) para el checkout |

Cada examen se pinta con `examenes/FilaExamen.astro`, igual en el catálogo y en los paneles; «Ver
ficha» abre la ficha única y «Agregar» suma a la misma selección desde cualquier lugar.

**Grupos del catálogo** (`areas` en `src/data/examenes.ts`): Gastrointestinal, Reacciones a
alimentos, Hormonales, Toxinas y metales pesados, Anti-aging, Salud vaginal, Moho y micotoxinas,
Salud mental, Cardiovascular, Peso, Ácidos orgánicos. Los cuatro primeros nombres y «Anti-aging»
son los de Verónica; el resto conserva el del Excel en español.

**Las 15 tarjetas** viven en `src/data/sintomas.ts`: título, descripción y preguntas son el texto de
Verónica; sus nombres sueltos de exámenes se mapearon a los del catálogo. En 05 (ansiedad o
depresión), 09 (embarazo), 11 (dolores articulares) y 12 (autoinmune) el botón de orientación va
primero, como ella pidió. El cierre «Esta es nuestra opción / Estas son nuestras opciones» se
calcula por cantidad: en su texto cuatro preguntas tenían el número cambiado.

El buscador encuentra por nombre, laboratorio, grupo, muestra, el texto de las tarjetas de síntoma y
la descripción del examen; ignora acentos y apóstrofos («doctors» encuentra «Doctor's Data»).

## La fuente

`LISTA DE PRECIOS EXAMENES VERONICA WELLNESS SEPT 2026.xlsx` (autora del archivo:
veronica@veronicawellness.com), una hoja: 38 exámenes en 11 áreas, con laboratorio (C), precio del
laboratorio (D), precio de venta = D × (1 + C2), con C2 = 0,35 (E) y «¿Qué incluye y para quién es?» (F).
**El Excel no entra al repositorio** y **en el sitio solo existe la columna E**: el costo del
laboratorio y el margen no aparecen en ningún archivo de `src/`. Los datos viven en
`src/data/examenes.ts`; si el Excel cambia, se regenera ese archivo.

## Al pagar

Lo cobra el checkout (`src/components/checkout/`); aquí solo se explica en las preguntas frecuentes,
que leen los precios de `src/data/oferta.ts` y los cargos de `src/lib/precio.ts`:

- **Cita de lectura** opcional: 1 cita (precio de la Layer Session) con lectura de exámenes y plan de
  acción, o 2 citas (precio del Initial Layer Cycle) para el seguimiento. Se lee 1 examen por cita.
- **Fees del laboratorio** por examen: service fee y authorization network. Verónica los dio como
  «$10–15» y «$10 aprox.»; el sitio usa 15 y 10.
- **Impuesto** del 7 %.

## Lo que se normalizó (y nada más)

Las descripciones (columna F) van **tal cual**. Solo se corrigieron erratas evidentes en nombres de
producto y de laboratorio:

| En el Excel                                     | En el sitio                                      |
| ----------------------------------------------- | ------------------------------------------------ |
| `Alletes`                                       | `Alletess` (Alletess Medical Laboratory)         |
| `Doctors Data` / `Doctors data`                 | `Doctor's Data`                                  |
| `US BIOTEK` / `us biotek`                       | `US BioTek`                                      |
| `Dutch`                                         | `DUTCH`                                          |
| `DNA Oxidate damagge`                           | `DNA Oxidative Damage`                           |
| `184 IgG food sensitiviy panel`                 | `184 IgG Food Sensitivity Panel`                 |
| `… gluten related desorders panel`              | `… Gluten-Related Disorders Panel`               |
| `198 Vegetarian Food Panel: IgA/IgG/igG4`       | `… IgA/IgG/IgG4` (y los otros dos paneles igual) |
| `Mold and  mycotoxin building`                  | `Mold & Mycotoxin Building`                      |
| `all tox` / `organic acid` / `H pylori`         | `All Tox` / `Organic Acids` / `H. pylori`        |
| mayúsculas sueltas (`Cardiometabolic profile`…) | Title Case en los nombres en inglés              |

En el texto de las tarjetas, «¿Quieres consultar el perfil hepático de tu catálogo?» quedó «…de
nuestro catálogo»: lo lee la paciente, no Verónica.

**Tipo de muestra** y **«Desde casa»** se marcaron solo donde la descripción lo dice. Donde no lo dice
(p. ej. H. pylori, los paneles de alimentos, DUTCH adrenal only, metales pesados, All Tox), la ficha
no muestra muestra.

## Para Verónica

- **Fees:** ¿15 y 10 por examen, o el monto exacto de cada uno?
- **Yeast Culture & Sensitivities:** en la tarjeta 08 escribió «confirmar muestra vaginal». Hoy la
  entrada de Salud vaginal no indica muestra; si es hisopo vaginal, se completa.
- **DUTCH solo hormonas** no aparece en ninguna de las 15 tarjetas; se encuentra en el catálogo y en
  el buscador. ¿Va en alguna (p. ej. 02 hormonas)?
- **Laboratorio sin dato** en 4 filas: los dos paneles de 205 alimentos, Mycotoxins Panel y Organic Acids.
- **Nombres de grupo** que no estaban en su lista: Moho y micotoxinas, Salud mental, Cardiovascular,
  Peso, Ácidos orgánicos. ¿Se quedan así?
- **Muestra** de los exámenes que no la indican: si la dice, se completa.
- **Texto de confirmación del pedido** («Te escribiremos por email con los siguientes pasos») es un
  marcador: ¿qué pasa después de pagar? (envío del kit, instrucciones, cita para resultados).
- **Afirmaciones de salud:** la revisión de copy de astra (22-sep) pidió cuidado con promesas y
  mecanismos; las descripciones de exámenes son informativas pero conviene que Verónica las valide
  con ese criterio.
