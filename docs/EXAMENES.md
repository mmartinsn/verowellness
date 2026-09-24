# Exámenes — de dónde sale la página y qué queda por confirmar

Fecha: 2026-09-23. Página `/examenes/` y checkout `/checkout/examenes/`.

## La fuente

`LISTA DE PRECIOS EXAMENES VERONICA WELLNESS SEPT 2026.xlsx` (autora del archivo:
veronica@veronicawellness.com), una hoja: 38 exámenes en 11 áreas, con laboratorio (C), precio del
laboratorio (D), precio de venta = D × (1 + C2), con C2 = 0,35 (E) y «¿Qué incluye y para quién es?» (F).
**El Excel no entra al repositorio** y **en el sitio solo existe la columna E**: el costo del
laboratorio y el margen no aparecen en ningún archivo de `src/`. Los datos viven en
`src/data/examenes.ts`; si el Excel cambia, se regenera ese archivo.

La columna E dice «en el check out hay que agregar &%». Se leyó como **7 %**, el mismo impuesto de los
ciclos (`src/lib/precio.ts`). **Confirmar.**

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

**Tipo de muestra** y **«Desde casa»** se marcaron solo donde la descripción lo dice. Donde no lo dice
(p. ej. H. pylori, los paneles de alimentos, DUTCH adrenal only, metales pesados, All Tox), la tarjeta
no muestra muestra y el comparador dice «No indicada».

## Para Verónica

- **Impuesto:** ¿«&%» es 7 %?
- **Laboratorio sin dato** en 4 filas: los dos paneles de 205 alimentos, Mycotoxins Panel y Organic Acids.
- **«Yeast Culture & Sensitivities»** aparece dos veces (Infecciones y Salud vaginal), mismo precio y
  laboratorio. ¿Es el mismo examen? Hoy son dos entradas separadas, y se pueden comprar las dos.
- **Nombres de área** en inglés: «Mold» y «Anti aging». ¿Se quedan así o van en español?
- **Muestra** de los exámenes que no la indican: si la dice, se completa el filtro.
- **Texto de confirmación del pedido** («Te escribiremos por email con los siguientes pasos») es un
  marcador: ¿qué pasa después de pagar? (envío del kit, instrucciones, cita para resultados).
- **Afirmaciones de salud:** la revisión de copy de astra (22-sep) pidió cuidado con promesas y
  mecanismos; las descripciones de exámenes son informativas pero conviene que Verónica las valide
  con ese criterio.
