/**
 * The shop (/tienda/): Verónica's digital products. Since 2026-10-03 the prices and copy are
 * Verónica's (document «AJUSTES…», changes 43 and 45: 9.99 / 19.99 best seller / 12.99, and her
 * title, hook, paragraph, «Dentro encontrarás» and closing line for each). The fourth guide, «Vuelve
 * a sentirte tú», comes from its manuscript v4 (Mari, 2026-10-03), whose cover note sets USD
 * 19.99; Verónica's document said its price was still to agree with Rosi. Pending: how the PDFs
 * are delivered after paying.
 *
 * The anti-inflammatory guide is not sold here: it is the bonus of the Initial Layer Cycle
 * (data/oferta.ts).
 */
import type { ImageMetadata } from 'astro';
import portadaHackear from '../assets/tienda/portada-hackear.jpg';
import portadaRecetario from '../assets/tienda/portada-recetario.jpg';
import portadaGlp1 from '../assets/tienda/portada-glp1.jpg';
import portadaHormonas from '../assets/tienda/portada-hormonas.jpg';

export interface Producto {
  id: string;
  num: string;
  /** Pages in the PDF — also the huge outline number behind the chapter. */
  paginas: number;
  /** Card name (Codex) and the title printed on the cover. */
  nombre: string;
  tituloPortada: string;
  /** USD, before tax (tax is added at checkout only). */
  precio: number;
  portada: ImageMetadata;
  /** Marked «más vendido» on the card (Verónica, change 43). */
  bestSeller?: boolean;
  subtitulo: string;
  gancho: string;
  /** «Para ti si…» lines; Verónica's copy of 2026-10-03 has none, so it is optional. */
  paraTi?: string[];
  incluye: string[];
  /** The closing line; `pagina` only when it is quoted from the book. */
  cita: { texto: string; pagina?: number };
  formato: string;
  /** Scope note under the chapter, when the product needs one. */
  nota?: string;
  boton: string;
  /** Visual tone of the chapter: ground and the accent of the number and the highlighter. */
  tono: 'clay' | 'sage' | 'rose';
}

export const productos: Producto[] = [
  {
    id: 'hackear-tu-cerebro',
    num: '01',
    paginas: 34,
    nombre: 'Cómo hackear tu cerebro para dejar el azúcar y las harinas en 14 días',
    tituloPortada: 'Cómo hackear tu cerebro para dejar el azúcar y las harinas en 14 días',
    precio: 9.99,
    portada: portadaHackear,
    subtitulo:
      'Ese ciclo de antojo, culpa y «mañana empiezo» puede ocupar más espacio en tu vida del que quisieras. Esta guía te propone una ruta de 14 días para observar qué dispara tus antojos, organizar tus comidas y practicar herramientas para responder de otra manera.',
    gancho:
      '¿Empiezas el día decidida a comer mejor y terminas la tarde buscando algo dulce que te calme?',
    incluye: [
      'Dos fases claras: una primera semana de cambios alimentarios y una segunda de reintroducción de frutas y tubérculos.',
      'La fórmula del plato S.O.S. y un ejemplo de menú para organizar comidas con proteína, vegetales y grasas.',
      'La regla de los 15 minutos, ejercicios de mindfulness y respiración para hacer una pausa frente al impulso de comer.',
      'El escáner H.A.L.T. para explorar si estás buscando comida por hambre, ansiedad, soledad o cansancio.',
      'Orientación sobre frutas, endulzantes y combinaciones de alimentos para la segunda fase.',
    ],
    cita: { texto: 'No hace falta esperar a otro lunes para empezar a entender tus patrones.' },
    formato: 'PDF · 34 páginas',
    nota: 'Los 14 días describen la estructura de la propuesta, no un plazo garantizado de resultados. Los cambios de alimentación requieren valorar tu caso.',
    boton: 'Comprar ebook',
    tono: 'clay',
  },
  {
    id: 'recetario-30-desayunos',
    num: '02',
    paginas: 47,
    nombre: '30 desayunos antiinflamatorios express',
    tituloPortada: '30 Desayunos Antiinflamatorios Express',
    precio: 19.99,
    bestSeller: true,
    portada: portadaRecetario,
    subtitulo:
      'Resuelve tus mañanas con 30 recetas dulces y saladas que combinan sabor, variedad y entre 26 y 35 g de proteína por porción. Desde rollos de canela y pancakes hasta arepas de yuca y egg wraps: opciones concretas para abrir el recetario, elegir y cocinar.',
    gancho:
      'Quieres evitar las harinas, lácteos y el azúcar, empezar tu día con un mejor desayuno, pero ya te aburriste de los huevos de siempre y de buscar recetas que nunca preparas.',
    incluye: [
      'Recetas sin trigo, cebada, centeno, avena, maíz, arroz, soya, lácteos de vaca ni azúcar refinada.',
      '10 desayunos dulces altos en proteína, 10 con carbohidratos anti-inflamatorios y proteína animal, y 10 salados low carb.',
      '16 recetas listas en 15 minutos o menos, más opciones para dejar preparadas desde la noche anterior.',
      'Calorías y macronutrientes estimados por porción, ingredientes con cantidades y preparación paso a paso.',
      'Tips de meal prep, conservación y congelación para cocinar una vez y resolver varias mañanas.',
      'Sustituciones, despensa básica y claves para revisar las etiquetas de tus ingredientes.',
    ],
    cita: {
      texto:
        'Mañana vas a desayunar otra vez. Ten lista una opción que te provoque y encaje con tu forma de comer.',
    },
    formato: 'PDF · 47 páginas · Edición 2026',
    boton: 'Comprar recetario',
    tono: 'sage',
  },
  {
    id: 'guia-glp1-retatrutida',
    num: '03',
    paginas: 21,
    nombre: 'Todas se están inyectando: guía de GLP-1 y RETA',
    tituloPortada: 'Todas a tu alrededor ya se están inyectando. Tú decide hacerlo bien.',
    precio: 12.99,
    portada: portadaGlp1,
    subtitulo:
      'Quizás estás considerando usarlas. Quizás ya empezaste y ahora te preguntas cómo comer con menos apetito, qué hacer con las molestias digestivas o cómo cuidar tu músculo. Esta guía reúne las preguntas que conviene hacer y las bases de alimentación y hábitos que acompañan el proceso.',
    gancho:
      'Antes de tu próxima decisión sobre las inyecciones, entiende qué necesitas cuidar además del peso.',
    incluye: [
      'Diferencias entre semaglutida, tirzepatida y retatrutida, con una explicación de su funcionamiento y las precauciones descritas para RETA.',
      'Cálculos orientativos de calorías, proteína, grasas, carbohidratos y fibra, con un ejemplo paso a paso.',
      'Ideas de comidas y estrategias para cuando la llenura dificulta alimentarte.',
      'Una tabla de efectos adversos: náuseas, reflujo, estreñimiento, fatiga y otras molestias, con señales para consultar.',
      'Un esquema semanal de movimiento y fuerza enfocado en conservar músculo.',
      'Herramientas para abordar el hambre emocional y preparar, junto con tu médico, los hábitos que necesitarás si el tratamiento cambia.',
    ],
    cita: {
      texto:
        'Si ya estás en este camino, cada día es una oportunidad para construir hábitos que te acompañen a largo plazo. Una guía educativa para llegar mejor informada a tus decisiones y consultas.',
    },
    formato: 'PDF · 21 páginas',
    nota: 'Contenido educativo para conversar con tu médico. No recomienda iniciar fármacos ni sustituye la valoración médica para decidir sobre un tratamiento.',
    boton: 'Comprar guía educativa',
    tono: 'rose',
  },
  {
    id: 'guia-hormonas-30',
    num: '04',
    paginas: 20,
    nombre: 'Vuelve a sentirte tú',
    tituloPortada: 'Vuelve a sentirte tú',
    precio: 19.99,
    bestSeller: true,
    portada: portadaHormonas,
    subtitulo:
      'Entre los 30 y los 40 muchas mujeres notan cambios: menos energía, un ciclo distinto, peor descanso, más antojos o un cuerpo que ya no responde igual. Los 30 no son un interruptor: nada cambia automáticamente al cumplir años, y ninguno de estos cambios es un diagnóstico por sí solo.',
    gancho: 'Entiende tus hormonas a partir de los 30 y empieza por lo que sí puedes cambiar.',
    incluye: [
      'Tu ciclo y tus hormonas sexuales: tu ciclo como una conversación mensual, tus números de referencia y qué mirar cuando el SPM se vuelve incapacitante.',
      'Tiroides, cortisol e insulina: el termostato de tu metabolismo, tu respuesta al estrés y tu composición corporal.',
      'Tu plato hormonal, comidas sencillas y cómo ajustar alimentación, entrenamiento y hábitos a cada fase.',
      'Ovulación y preconcepción, hígado e intestino, y lo que hacen los anticonceptivos.',
      'Exámenes que podemos evaluar en nuestra asesoría, según tu historia y tus síntomas.',
      'Un plan de 30 días y workbooks para registrar tu ciclo, tu energía y tu radar premenstrual.',
    ],
    cita: { texto: 'Tus hormonas son una capa, no toda la historia.' },
    formato: 'PDF · 20 páginas · Libro y workbook',
    nota: 'Contenido educativo. No sustituye una evaluación médica ni sirve para diagnosticar o tratar enfermedades. Esta guía incluye enlaces comerciales a productos que uso y recomiendo; cualquier compra es opcional y separada del precio de la guía.',
    boton: 'Comprar guía',
    tono: 'clay',
  },
];

/** `USD 19,99` — the shop writes prices the Spanish way, as in the copy. */
export function precioTienda(n: number): string {
  return `USD ${Number.isInteger(n) ? n : n.toFixed(2).replace('.', ',')}`;
}

/** The guides as the checkout offers them (name, price, cover URL). */
export function guiasCheckout() {
  return productos.map((p) => ({
    id: p.id,
    nombre: p.nombre,
    precio: p.precio,
    portada: p.portada.src,
  }));
}

/** Order of the shop popup (Verónica, change 46: the recipe book first, then «hackear»). */
export const ordenPopupGuias = [
  'recetario-30-desayunos',
  'hackear-tu-cerebro',
  'guia-hormonas-30',
  'guia-glp1-retatrutida',
];

/** Discount on guides added from the popup. Proposed, to confirm with Verónica. */
export const DESCUENTO_POPUP = 0.15;

/** localStorage key for the shop selection, read by /checkout/tienda/. */
export const CLAVE_TIENDA = 'vw-tienda-seleccion';

export const avisoLegal =
  'Contenido educativo. No reemplaza una consulta médica o nutricional ni una valoración individual. Las decisiones sobre medicación corresponden a tu médico.';
