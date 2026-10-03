import type { ImageMetadata } from 'astro';
import portadaHackear from '../assets/tienda/portada-hackear.jpg';
import portadaRecetario from '../assets/tienda/portada-recetario.jpg';
import portadaGlp1 from '../assets/tienda/portada-glp1.jpg';
import portadaHormonas from '../assets/tienda/portada-hormonas.jpg';

export type Texto = (string | { b: string })[];

export interface Libro {
  id: string;
  num: string;
  nombre: string;
  titulo: string;
  portada: ImageMetadata;
  pregunta: string;
  parrafo: Texto;
  incluye: Texto[];
  cierre: string;
  formato: string;
  nota?: string;
  bestSeller?: boolean;
  tono: 'clay' | 'sage' | 'rose';
}

export interface Producto extends Libro {
  precio: number;
  boton: string;
}

export const productos: Producto[] = [
  {
    id: 'hackear-tu-cerebro',
    num: '01',
    nombre: 'Cómo hackear tu cerebro',
    titulo: 'Cómo hackear tu cerebro para dejar el azúcar y las harinas en 14 días',
    precio: 9.99,
    portada: portadaHackear,
    pregunta:
      '¿Empiezas el día decidida a comer mejor y terminas la tarde buscando algo dulce que te calme?',
    parrafo: [
      'Ese ciclo de antojo, culpa y «mañana empiezo» puede ocupar más espacio en tu vida del que quisieras. Esta guía te propone una ruta de 14 días para observar qué dispara tus antojos, organizar tus comidas y practicar herramientas para responder de otra manera.',
    ],
    incluye: [
      [
        { b: 'Dos fases claras:' },
        ' una primera semana de cambios alimentarios y una segunda de reintroducción de frutas y tubérculos.',
      ],
      [
        { b: 'La fórmula del plato S.O.S.' },
        ' y un ejemplo de menú para organizar comidas con proteína, vegetales y grasas.',
      ],
      [
        { b: 'La regla de los 15 minutos' },
        ', ejercicios de mindfulness y respiración para hacer una pausa frente al impulso de comer.',
      ],
      [
        { b: 'El escáner H.A.L.T.' },
        ' para explorar si estás buscando comida por hambre, ansiedad, soledad o cansancio.',
      ],
      ['Orientación sobre frutas, endulzantes y combinaciones de alimentos para la segunda fase.'],
    ],
    cierre: 'No hace falta esperar a otro lunes para empezar a entender tus patrones.',
    formato: 'PDF · 34 páginas',
    nota: 'Los 14 días describen la estructura de la propuesta, no un plazo garantizado de resultados. Los cambios de alimentación requieren valorar tu caso.',
    boton: 'Comprar ebook',
    tono: 'clay',
  },
  {
    id: 'recetario-30-desayunos',
    num: '02',
    nombre: '30 desayunos antiinflamatorios express',
    titulo: '30 desayunos antiinflamatorios express',
    precio: 19.99,
    bestSeller: true,
    portada: portadaRecetario,
    pregunta:
      'Quieres evitar las harinas, lácteos y el azúcar, empezar tu día con un mejor desayuno, pero ya te aburriste de los huevos de siempre y de buscar recetas que nunca preparas.',
    parrafo: [
      'Resuelve tus mañanas con 30 recetas dulces y saladas que combinan sabor, variedad y ',
      { b: 'entre 26 y 35 g de proteína por porción' },
      '. Desde rollos de canela y pancakes hasta arepas de yuca y egg wraps: opciones concretas para abrir el recetario, elegir y cocinar.',
    ],
    incluye: [
      [
        'Recetas sin trigo, cebada, centeno, avena, maíz, arroz, soya, lácteos de vaca ni azúcar refinada.',
      ],
      [
        {
          b: '10 desayunos dulces altos en proteína, 10 con carbohidratos anti-inflamatorios y proteína animal, y 10 salados low carb.',
        },
      ],
      [
        { b: '16 recetas listas en 15 minutos o menos' },
        ', más opciones para dejar preparadas desde la noche anterior.',
      ],
      [
        'Calorías y macronutrientes estimados por porción, ingredientes con cantidades y preparación paso a paso.',
      ],
      [
        { b: 'Tips de meal prep, conservación y congelación' },
        ' para cocinar una vez y resolver varias mañanas.',
      ],
      ['Sustituciones, despensa básica y claves para revisar las etiquetas de tus ingredientes.'],
    ],
    cierre:
      'Mañana vas a desayunar otra vez. Ten lista una opción que te provoque y encaje con tu forma de comer.',
    formato: 'PDF · 47 páginas · Edición 2026',
    boton: 'Comprar recetario',
    tono: 'sage',
  },
  {
    id: 'guia-glp1-retatrutida',
    num: '03',
    nombre: 'Todas se están inyectando',
    titulo: 'Todas se están inyectando: guía de GLP-1 y RETA',
    precio: 12.99,
    portada: portadaGlp1,
    pregunta:
      'Antes de tu próxima decisión sobre las inyecciones, entiende qué necesitas cuidar además del peso.',
    parrafo: [
      'Quizás estás considerando usarlas. Quizás ya empezaste y ahora te preguntas cómo comer con menos apetito, qué hacer con las molestias digestivas o cómo cuidar tu músculo. Esta guía reúne las preguntas que conviene hacer y las bases de alimentación y hábitos que acompañan el proceso.',
    ],
    incluye: [
      [
        { b: 'Diferencias entre semaglutida, tirzepatida y retatrutida' },
        ', con una explicación de su funcionamiento y las precauciones descritas para RETA.',
      ],
      [
        { b: 'Cálculos orientativos de calorías, proteína, grasas, carbohidratos y fibra' },
        ', con un ejemplo paso a paso.',
      ],
      ['Ideas de comidas y estrategias para cuando la llenura dificulta alimentarte.'],
      [
        { b: 'Una tabla de efectos adversos:' },
        ' náuseas, reflujo, estreñimiento, fatiga y otras molestias, con señales para consultar.',
      ],
      [{ b: 'Un esquema semanal de movimiento y fuerza' }, ' enfocado en conservar músculo.'],
      [
        'Herramientas para abordar el hambre emocional y preparar, junto con tu médico, los hábitos que necesitarás si el tratamiento cambia.',
      ],
    ],
    cierre:
      'Si ya estás en este camino, cada día es una oportunidad para construir hábitos que te acompañen a largo plazo. Una guía educativa para llegar mejor informada a tus decisiones y consultas.',
    formato: 'PDF · 21 páginas',
    nota: 'Contenido educativo para conversar con tu médico. No recomienda iniciar fármacos ni sustituye la valoración médica para decidir sobre un tratamiento.',
    boton: 'Comprar guía educativa',
    tono: 'rose',
  },
  {
    id: 'guia-hormonas-30',
    num: '04',
    nombre: 'Vuelve a sentirte tú',
    titulo: 'Vuelve a sentirte tú',
    precio: 19.99,
    bestSeller: true,
    portada: portadaHormonas,
    pregunta: 'Entiende tus hormonas a partir de los 30 y empieza por lo que sí puedes cambiar.',
    parrafo: [
      'Entre los 30 y los 40 muchas mujeres notan cambios: menos energía, un ciclo distinto, peor descanso, más antojos o un cuerpo que ya no responde igual. Los 30 no son un interruptor: nada cambia automáticamente al cumplir años, y ninguno de estos cambios es un diagnóstico por sí solo.',
    ],
    incluye: [
      [
        { b: 'Tu ciclo y tus hormonas sexuales:' },
        ' tu ciclo como una conversación mensual, tus números de referencia y qué mirar cuando el SPM se vuelve incapacitante.',
      ],
      [
        { b: 'Tiroides, cortisol e insulina:' },
        ' el termostato de tu metabolismo, tu respuesta al estrés y tu composición corporal.',
      ],
      [
        { b: 'Tu plato hormonal' },
        ', comidas sencillas y cómo ajustar alimentación, entrenamiento y hábitos a cada fase.',
      ],
      [
        { b: 'Ovulación y preconcepción' },
        ', hígado e intestino, y lo que hacen los anticonceptivos.',
      ],
      [
        { b: 'Exámenes que podemos evaluar' },
        ' en nuestra asesoría, según tu historia y tus síntomas.',
      ],
      [
        { b: 'Un plan de 30 días' },
        ' y workbooks para registrar tu ciclo, tu energía y tu radar premenstrual.',
      ],
    ],
    cierre: 'Tus hormonas son una capa, no toda la historia.',
    formato: 'PDF · 20 páginas · Libro y workbook',
    nota: 'Contenido educativo. No sustituye una evaluación médica ni sirve para diagnosticar o tratar enfermedades. Esta guía incluye enlaces comerciales a productos que uso y recomiendo; cualquier compra es opcional y separada del precio de la guía.',
    boton: 'Comprar guía',
    tono: 'clay',
  },
];

export const proximamente: Libro[] = [];

export const libros: (Producto | Libro)[] = [...productos, ...proximamente];

export function esComprable(libro: Producto | Libro): libro is Producto {
  return 'precio' in libro;
}

export function precioTienda(n: number): string {
  return `USD ${Number.isInteger(n) ? n : n.toFixed(2).replace('.', ',')}`;
}

export const precioPorDefinir = 'Precio por definir';

export const CLAVE_TIENDA = 'vw-tienda-seleccion';

export const avisoLegal =
  'Contenido educativo. No reemplaza una consulta médica o nutricional ni una valoración individual. Las decisiones sobre medicación corresponden a tu médico.';
