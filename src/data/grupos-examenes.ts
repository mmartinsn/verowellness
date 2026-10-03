/**
 * How each catalogue group presents itself (2026-10-03, after the NutriWhite reference Mari sent):
 * a line icon for its pill and header, and one line on what its tests look at. Lines by Claude
 * from the tests' own descriptions; Codex will polish them.
 */
export const presentacionGrupo: Record<string, { icono: string; descripcion: string }> = {
  infecciones: {
    icono: 'M7 3.5h9a3.25 3.25 0 0 1 0 6.5H8.5a3.25 3.25 0 0 0 0 6.5H15a3 3 0 0 1 0 6',
    descripcion: 'Microbiota, parásitos, levaduras, digestión e inflamación intestinal.',
  },
  hormonales: {
    icono: 'M15 4.5A8 8 0 1 0 19.5 15 6.5 6.5 0 0 1 15 4.5zM18.5 3v3M17 4.5h3',
    descripcion: 'Hormonas sexuales y suprarrenales, y cómo las procesa tu cuerpo.',
  },
  alimentos: {
    icono: 'M20 12a8 8 0 1 1-16 0 8 8 0 0 1 16 0zM15.5 12a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0z',
    descripcion: 'Sensibilidades y reacciones a alimentos y al gluten.',
  },
  cardiovascular: {
    icono:
      'M12 20s-7-4.4-9-9a4.5 4.5 0 0 1 9-3 4.5 4.5 0 0 1 9 3c-2 4.6-9 9-9 9zM3 12h4l2-3 3 6 2-3h2.5',
    descripcion: 'Indicadores de salud cardiometabólica.',
  },
  'salud-vaginal': {
    icono:
      'M12 20c-4 0-7-3-7-7 3 0 5.2 1.6 7 4.2 1.8-2.6 4-4.2 7-4.2 0 4-3 7-7 7zM12 17.2c-2.2-3.2-2.2-7.6 0-11.2 2.2 3.6 2.2 8 0 11.2z',
    descripcion: 'El equilibrio de la flora vaginal y la presencia de levaduras.',
  },
  'salud-mental': {
    icono:
      'M9 4a4 4 0 0 0-4 4c0 1.2.5 2.2 1.3 3A4 4 0 0 0 9 18h1V4H9zM15 4a4 4 0 0 1 4 4c0 1.2-.5 2.2-1.3 3A4 4 0 0 1 15 18h-1V4h1z',
    descripcion: 'Neurotransmisores relacionados con el ánimo, el estrés y el descanso.',
  },
  moho: {
    icono:
      'M8 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM20 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM11 16a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0zM19 17a2 2 0 1 1-4 0 2 2 0 0 1 4 0z',
    descripcion: 'La exposición a moho en tu ambiente y la respuesta de tu cuerpo.',
  },
  longevidad: {
    icono:
      'M7 3c0 5 10 7 10 12 0 3-2 5-2 6M17 3c0 5-10 7-10 12 0 3 2 5 2 6M8.5 7h7M8.5 17h7M10 12h4',
    descripcion: 'Un marcador de estrés oxidativo y daño al ADN.',
  },
  peso: {
    icono: 'M12 4v16M6 20h12M6 8h12M6 8l-3 6a3 3 0 0 0 6 0zM18 8l-3 6a3 3 0 0 0 6 0z',
    descripcion: 'Predisposiciones genéticas relacionadas con el peso.',
  },
  intoxicaciones: {
    icono: 'M12 3l7.5 4.5v9L12 21l-7.5-4.5v-9zM12 8l3.5 2v4L12 16l-3.5-2v-4z',
    descripcion: 'Metales, contaminantes y la capacidad de detoxificación del hígado.',
  },
  'acidos-organicos': {
    icono: 'M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3M7.5 15h9',
    descripcion: 'Una mirada amplia a tu metabolismo, tu energía y tus nutrientes.',
  },
};

/**
 * «Reacciones a alimentos» as a guided choice (Mari, 2026-10-03: «más fácil de entender
 * visualmente»): four questions in the visitor's words, each opening only its panels. What each
 * panel looks at is said plainly, with Verónica's own explanations from the descriptions: IgG/IgG4
 * «reacciones retardadas que aparecen horas o días después», IgE «alergia verdadera, reacción
 * inmediata», and the coeliac markers.
 */
export const caminosAlimentos: { id: string; pregunta: string; ayuda: string; ids: string[] }[] = [
  {
    id: 'gluten',
    pregunta: '¿El gluten me afecta?',
    ayuda: 'Para saber si es celiaquía, alergia al trigo o sensibilidad al gluten.',
    ids: [
      'celiac-and-gluten-sensitivity-blood-spot',
      '96-igg-food-gluten-related-disorders-panel',
      '184-igg-food-gluten-related-disorders-panel',
    ],
  },
  {
    id: 'inflaman',
    pregunta: '¿Qué alimentos me inflaman o me hinchan?',
    ayuda: 'Sensibilidades con reacciones retardadas, que aparecen horas o días después de comer.',
    ids: [
      '96-igg-food-sensitivity-panel',
      '184-igg-food-sensitivity-panel',
      '240-food-panel-iga-igg-igg4',
    ],
  },
  {
    id: 'plantas',
    pregunta: 'Como mayormente plantas',
    ayuda: 'Paneles de alimentos vegetales, lácteos y huevo, sin carnes ni pescados.',
    ids: ['96-vegetarian-food-panel-iga-igg-igg4', '198-vegetarian-food-panel-iga-igg-igg4'],
  },
  {
    id: 'inmediatas',
    pregunta: 'Además tengo reacciones inmediatas',
    ayuda: 'Urticaria, picazón, congestión o hinchazón de labios después de comer.',
    ids: [
      '184-igg-food-sensitivity-25-comprehensive-ige-combo-panel',
      '184-igg-food-sensitivity-50-expanded-ige-combo-panel',
      '205-igg-food-sensitivity-25-comprehensive-ige-combo-panel',
      '205-igg-food-sensitivity-50-expanded-ige-combo-panel',
    ],
  },
];

/** What each panel measures, in plain words (from its description). */
export const mideAlimentos: Record<string, { alimentos?: number; mide: string[] }> = {
  'celiac-and-gluten-sensitivity-blood-spot': { mide: ['Celiaquía', 'Sensibilidad al gluten'] },
  '96-igg-food-gluten-related-disorders-panel': {
    alimentos: 96,
    mide: ['Reacción retardada', 'Celiaquía', 'Alergia al trigo y gluten'],
  },
  '184-igg-food-gluten-related-disorders-panel': {
    alimentos: 184,
    mide: ['Reacción retardada', 'Celiaquía', 'Alergia al trigo y gluten'],
  },
  '96-igg-food-sensitivity-panel': { alimentos: 96, mide: ['Reacción retardada'] },
  '184-igg-food-sensitivity-panel': { alimentos: 184, mide: ['Reacción retardada'] },
  '240-food-panel-iga-igg-igg4': {
    alimentos: 240,
    mide: ['Reacción retardada', 'Mucosa intestinal (IgA)'],
  },
  '96-vegetarian-food-panel-iga-igg-igg4': {
    alimentos: 96,
    mide: ['Reacción retardada', 'Mucosa intestinal (IgA)'],
  },
  '198-vegetarian-food-panel-iga-igg-igg4': {
    alimentos: 198,
    mide: ['Reacción retardada', 'Mucosa intestinal (IgA)'],
  },
  '184-igg-food-sensitivity-25-comprehensive-ige-combo-panel': {
    alimentos: 184,
    mide: ['Reacción retardada', 'Alergia inmediata a 25 alimentos'],
  },
  '184-igg-food-sensitivity-50-expanded-ige-combo-panel': {
    alimentos: 184,
    mide: ['Reacción retardada', 'Alergia inmediata a 50 alimentos'],
  },
  '205-igg-food-sensitivity-25-comprehensive-ige-combo-panel': {
    alimentos: 205,
    mide: ['Reacción retardada', 'Alergia inmediata a 25 alimentos'],
  },
  '205-igg-food-sensitivity-50-expanded-ige-combo-panel': {
    alimentos: 205,
    mide: ['Reacción retardada', 'Alergia inmediata a 50 alimentos'],
  },
};
