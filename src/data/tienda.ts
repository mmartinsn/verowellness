/**
 * The shop (/tienda/): Verónica's digital products. Prices from Mari (2026-09-23); copy written by
 * Codex (astra) from the ebooks' own text and cut to five "Qué incluye" lines each, as in the
 * Claude Design canvas «Veronica Wellness — Tienda de ebooks». Pending Verónica's review:
 * how the PDFs are delivered after paying, and the card names (editorial vs. cover titles).
 *
 * The anti-inflammatory guide is not sold here: it is the bonus of the Initial Layer Cycle
 * (data/oferta.ts).
 */
import type { ImageMetadata } from 'astro';
import portadaHackear from '../assets/tienda/portada-hackear.jpg';
import portadaRecetario from '../assets/tienda/portada-recetario.jpg';
import portadaGlp1 from '../assets/tienda/portada-glp1.jpg';

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
  subtitulo: string;
  gancho: string;
  paraTi: string[];
  incluye: string[];
  cita: { texto: string; pagina: number };
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
    nombre: 'Azúcar, harinas y antojos',
    tituloPortada: 'Cómo hackear tu cerebro para dejar el azúcar y las harinas en 14 días',
    precio: 7,
    portada: portadaHackear,
    subtitulo: 'Una propuesta de 14 días para explorar tus hábitos alrededor de la comida.',
    gancho: 'Antes de cambiar lo que comes, observa qué pasa cuando aparece el antojo.',
    paraTi: [
      'Quieres observar qué situaciones y emociones acompañan tus antojos.',
      'Buscas ejemplos de comidas y alternativas para cocinar con otras harinas.',
      'Te interesa entender las etiquetas de los productos que compras.',
    ],
    incluye: [
      '34 páginas con una propuesta organizada en 2 fases: días 1–7 y días 8–14.',
      'La fórmula del Plato S.O.S. y 1 ejemplo de menú diario con desayuno, almuerzo, cena y snacks.',
      'La regla de los 15 minutos y 4 herramientas para explorar el impulso de comer, incluido el escáner H.A.L.T.',
      'Reintroducción de tubérculos y frutas, con un semáforo de carga glucémica.',
      'Lectura de etiquetas, 8 alternativas de harinas sin cereales y opciones vegetales para sustituir lácteos.',
    ],
    cita: { texto: 'En lugar de bloquearlo, obsérvalo.', pagina: 12 },
    formato: 'PDF · 34 páginas',
    nota: 'Los 14 días describen la estructura de la propuesta, no un plazo garantizado de resultados. Los cambios de alimentación requieren valorar tu caso.',
    boton: 'Comprar ebook',
    tono: 'clay',
  },
  {
    id: 'recetario-30-desayunos',
    num: '02',
    paginas: 47,
    nombre: '30 desayunos de Verónica',
    tituloPortada: '30 Desayunos Antiinflamatorios Express',
    precio: 19.99,
    portada: portadaRecetario,
    subtitulo: 'Recetas dulces y saladas para organizar tus mañanas con opciones concretas.',
    gancho: 'Tu mañana ya tiene suficientes decisiones. Deja pensado el desayuno.',
    paraTi: [
      'Quieres variar el desayuno y tener a mano opciones dulces y saladas.',
      'Te sirve preparar algunas bases con anticipación para la semana.',
      'Buscas cantidades, instrucciones y sustituciones en un mismo lugar.',
    ],
    incluye: [
      '30 recetas en 3 secciones de 10: dulces altos en proteína, carbohidratos con proteína animal y saladas bajas en carbohidratos.',
      'Ingredientes con cantidades, preparación paso a paso, porciones y valores nutricionales estimados.',
      'Una tabla resumen de las 30 recetas con tiempos, proteína por porción y página de consulta.',
      'Despensa básica, guía de utensilios, preparación anticipada y congelación.',
      '5 propuestas para organizar la semana y notas de conservación y sustitución.',
    ],
    cita: { texto: 'Mañanas reales. Decisiones ya tomadas.', pagina: 2 },
    formato: 'PDF · 47 páginas · Edición 2026',
    boton: 'Comprar recetario',
    tono: 'sage',
  },
  {
    id: 'guia-glp1-retatrutida',
    num: '03',
    paginas: 21,
    nombre: 'GLP-1 y retatrutida',
    tituloPortada: 'Todas a tu alrededor ya se están inyectando. Tú decide hacerlo bien.',
    precio: 13.5,
    portada: portadaGlp1,
    subtitulo: 'Una guía educativa para tomar decisiones informadas junto a tu médico.',
    gancho: 'Tu decisión merece información y una conversación con tu médico.',
    paraTi: [
      'Escuchas hablar de estas inyecciones y quieres entender los términos antes de hablar con tu médico.',
      'Estás en tratamiento médico y buscas temas de alimentación y hábitos para revisar en consulta.',
      'Quieres conocer los efectos adversos y las señales de alarma que aborda la guía.',
    ],
    incluye: [
      'Una introducción a GLP-1 y una comparación de semaglutida, tirzepatida y retatrutida.',
      'Secciones sobre hambre emocional, hábitos digestivos y una propuesta semanal de movimiento.',
      '12 ideas de comidas: 3 desayunos, 3 almuerzos, 3 cenas y 3 meriendas.',
      'Una tabla de 10 efectos adversos con cuándo consultar y 8 señales de alarma.',
      'Una lista diaria de 9 puntos para revisar hábitos y el seguimiento indicado por tu médico.',
    ],
    cita: { texto: 'Hoy avancé, aunque no haya sido perfecto. Y eso también cuenta.', pagina: 19 },
    formato: 'PDF · 21 páginas',
    nota: 'Contenido educativo para conversar con tu médico. No recomienda iniciar fármacos ni sustituye la valoración médica para decidir sobre un tratamiento.',
    boton: 'Comprar guía educativa',
    tono: 'rose',
  },
];

/** `USD 19,99` — the shop writes prices the Spanish way, as in the copy. */
export function precioTienda(n: number): string {
  return `USD ${Number.isInteger(n) ? n : n.toFixed(2).replace('.', ',')}`;
}

/** localStorage key for the shop selection, read by /checkout/tienda/. */
export const CLAVE_TIENDA = 'vw-tienda-seleccion';

export const avisoLegal =
  'Contenido educativo. No reemplaza una consulta médica o nutricional ni una valoración individual. Las decisiones sobre medicación corresponden a tu médico.';
