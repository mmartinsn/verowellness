/**
 * Black Friday 2026: the campaign's numbers and its copy. Copy written by Codex on 2026-10-28
 * (Mari: «usa Codex para los textos»); it lives here and not in the canonical snapshot because
 * the campaign ends on 30 Nov and is never synced to Webflow. The prices the checkout charges
 * come from Webflow: the code below must exist there (DECISIONES).
 */
export const campana = {
  codigo: 'BLACKFRIDAY',
  descuento: 20,
  /** Banner and landing live from 1 Nov until the end of Cyber Monday, US Eastern time. */
  inicio: '2026-11-01T00:00:00-04:00',
  fin: '2026-11-30T23:59:59-05:00',
  examenes: [
    '184-igg-food-sensitivity-panel',
    'dutch-plus-hormonas-sexuales-adrenal',
    'gi-advanced-profile-includes-zonulin-and-h-pylori',
  ],
  lectura: 150,
  lecturaNormal: 161,
  recetarioNormal: 19.99,
};

interface CopyExamen {
  nombre: string;
  gancho: string;
  paraTi: string[];
  cta: string;
}

export const bf = {
  meta: 'Black Friday en Veronica Wellness: 20 % de descuento en tres exámenes funcionales todo noviembre y hasta Cyber Monday, con un recetario de regalo.',
  kicker: 'Black Friday en Veronica Wellness',
  titulo: 'Tu cuerpo merece más que suposiciones.',
  sub: 'Todo noviembre y hasta Cyber Monday: 20% de descuento en tres exámenes para explorar tu alimentación, tus hormonas o tu salud intestinal.',
  ctaPrincipal: 'Elige tu examen',
  urgencia: 'Termina el lunes 30 de noviembre a las 23:59',
  problemaTitulo: 'Adivinar también cansa',
  problema: [
    'Dudas de lo que comes.',
    'Te frustra no entender lo que sientes.',
    'Te abruma no saber por dónde empezar.',
  ],
  examenesTitulo: 'Empieza por lo que quieres explorar',
  examenes: {
    '184-igg-food-sensitivity-panel': {
      nombre: 'Sensibilidad a 184 alimentos',
      gancho: '184 alimentos. No diagnostica alergias.',
      paraTi: [
        'Quieres explorar tu respuesta IgG a alimentos.',
        'Buscas orientar una dieta de eliminación.',
        'Tienes dudas sobre tu alimentación.',
      ],
      cta: 'Explora tus opciones',
    },
    'dutch-plus-hormonas-sexuales-adrenal': {
      nombre: 'DUTCH Plus',
      gancho: 'Pon tus hormonas en contexto.',
      paraTi: [
        'Te despiertas cansada o tienes insomnio.',
        'Tienes ansiedad o agotamiento.',
        'Tienes síndrome premenstrual o estás en perimenopausia.',
      ],
      cta: 'Explora tus hormonas',
    },
    'gi-advanced-profile-includes-zonulin-and-h-pylori': {
      nombre: 'GI-Advanced',
      gancho: '98 marcadores para explorar tu intestino.',
      paraTi: [
        'Tienes una condición autoinmune.',
        'Buscas explorar tu intestino ante desequilibrios hormonales.',
        'Tienes inflamación sistémica.',
      ],
      cta: 'Explora tu intestino',
    },
  } as Record<string, CopyExamen>,
  addonTitulo: 'Revisa tus resultados con Verónica',
  addonTexto:
    'Añade una sesión con Verónica Dudamell, nutricionista, para revisar tus resultados y definir un plan de acción.',
  bonusTitulo: 'De regalo: 30 desayunos antiinflamatorios express',
  bonusTexto:
    'Gratis con cualquier examen. 26–35 g de proteína por porción; 16 recetas listas en 15 minutos o menos.',
  pasos: [
    {
      titulo: 'Elige tu examen',
      texto: 'Revisa qué explora cada prueba y elige la que se ajuste a lo que buscas.',
    },
    {
      titulo: 'Paga con descuento',
      texto: 'Verifica que el código esté aplicado y completa tu pago.',
    },
    {
      titulo: 'Recibe tu kit',
      texto: 'Tu kit llega a la dirección que indiques dentro de Estados Unidos.',
    },
  ],
  faq: [
    {
      q: '¿Hasta cuándo puedo aprovechar la promoción?',
      a: 'Durante todo noviembre, hasta Cyber Monday: lunes 30 de noviembre de 2026 a las 23:59.',
    },
    { q: '¿Dónde hacen envíos?', a: 'Los kits se envían únicamente dentro de Estados Unidos.' },
    {
      q: '¿Hay algún cargo adicional?',
      a: 'Sí. Al pagar se añaden $25 de laboratorio por cada examen.',
    },
    {
      q: '¿El examen incluye la lectura de resultados?',
      a: 'Se compra por separado. Puedes añadir una sesión con Verónica por $150, antes $161. Incluye revisión de resultados y plan de acción.',
    },
  ],
  finalTitulo: 'Dale espacio a tus preguntas',
  finalSub: 'Elige tu examen con 20% de descuento y recibe tu recetario de regalo.',
  banner: 'Black Friday: 20% en tres exámenes hasta el 30/11',
  ticker: [
    'Black Friday',
    'Todo noviembre',
    '−20% en exámenes',
    'Hasta Cyber Monday',
    'Recetario de regalo',
  ],
};
