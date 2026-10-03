/**
 * «¿No sabes qué examen podrías necesitar?» — Verónica's classification of 2026-10-02 (her red text,
 * fuentes/2026-10-02_Vero_ajustes_inicio_metodo_1-1_examenes.docx): fifteen cards in the visitor's
 * voice, each with the subcategories that list its options. Titles, descriptions and questions are
 * hers; her loose exam names are mapped to the catalogue ids of data/examenes. A test may appear
 * under several cards and keeps a single ficha.
 */
import { examenPorId, type Examen } from './examenes';

export interface Subcategoria {
  pregunta: string;
  conCierre?: false;
  examenes: string[];
}

export interface Sintoma {
  id: string;
  num: string;
  titulo: string;
  descripcion: string;
  color: string;
  icono: string;
  orientacionPrimero?: true;
  subcategorias: Subcategoria[];
}

const GASTRO_BASE = [
  'comprehensive-stool-analysis-parasitology',
  'gi-effects-3-days',
  'gi-advanced-profile-includes-zonulin-and-h-pylori',
];
const GASTRO = [
  ...GASTRO_BASE,
  'sibo-en-aliento-3h',
  'microbiology-profile',
  'h-pylori',
  'culture-pcr-parasitology-cpp',
];
const IGE = [
  '184-igg-food-sensitivity-25-comprehensive-ige-combo-panel',
  '184-igg-food-sensitivity-50-expanded-ige-combo-panel',
  '205-igg-food-sensitivity-25-comprehensive-ige-combo-panel',
  '205-igg-food-sensitivity-50-expanded-ige-combo-panel',
];
const ALIMENTOS = [
  '198-vegetarian-food-panel-iga-igg-igg4',
  '96-vegetarian-food-panel-iga-igg-igg4',
  '240-food-panel-iga-igg-igg4',
  '96-igg-food-sensitivity-panel',
  '184-igg-food-sensitivity-panel',
  '96-igg-food-gluten-related-disorders-panel',
  '184-igg-food-gluten-related-disorders-panel',
  ...IGE,
];
const MOHO = [
  'mold-mycotoxin-building',
  'expanded-mold-immunoreactivity-panel',
  'mycotoxins-panel',
];
const DUTCH_PLUS = 'dutch-plus-hormonas-sexuales-adrenal';
const HORMONE_PLUS = 'comprehensive-hormone-plus-profile';
const CANDIDA = 'candida-albicans-en-sangre';
const ACIDOS = 'organic-acids';
const CARDIO = 'cardiometabolic-profile';
const CELIACA = 'celiac-and-gluten-sensitivity-blood-spot';

const P = {
  gastro: '¿Te conviene hacer algún examen gastrointestinal?',
  hormonal: '¿Te conviene explorar tu perfil hormonal?',
  candida: '¿Te conviene evaluar Candida?',
  acidos: '¿Te conviene hacer un examen de ácidos orgánicos?',
  metabolica: '¿Te conviene hacer una evaluación metabólica?',
  alimentos: '¿Te conviene explorar los exámenes relacionados con alimentos?',
  moho: '¿Te conviene explorar exámenes relacionados con moho y micotoxinas?',
  inmuneMoho: '¿Te conviene explorar la respuesta inmune a mohos?',
};

export const sintomas: Sintoma[] = [
  {
    id: 'digestivas',
    num: '01',
    titulo: 'Tengo molestias digestivas',
    descripcion: 'Hinchazón, gases, estreñimiento, diarrea, ardor o molestias después de comer.',
    color: 'sage-deep',
    icono: 'M9 3v4.5A4.5 4.5 0 0 0 13.5 12h.5a4 4 0 0 1 0 8h-3A6 6 0 0 1 5 14v-1',
    subcategorias: [
      { pregunta: P.gastro, examenes: GASTRO },
      { pregunta: P.candida, examenes: [CANDIDA, 'yeast-culture-sensitivities'] },
    ],
  },
  {
    id: 'hormonas',
    num: '02',
    titulo: 'Quiero entender mis hormonas',
    descripcion:
      'Cambios en mi ciclo, síntomas premenstruales, síndrome premenstrual, ovarios poliquísticos, endometriosis, miomas, dificultad para perder peso, acné, libido baja o cambios durante la perimenopausia.',
    color: 'rose-deep',
    icono: 'M12 14a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM12 14v7M9 18h6',
    subcategorias: [{ pregunta: P.hormonal, examenes: [DUTCH_PLUS, HORMONE_PLUS] }],
  },
  {
    id: 'peso',
    num: '03',
    titulo: 'Me cuesta perder peso o mejorar mi composición corporal',
    descripcion:
      'Quiero explorar aspectos de mi metabolismo y conocer mis predisposiciones relacionadas con el peso.',
    color: 'clay-deep',
    icono:
      'M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM8 10a4 4 0 0 1 8 0M12 10l1.6-2.2',
    subcategorias: [
      { pregunta: P.metabolica, examenes: [CARDIO] },
      {
        pregunta: '¿Quieres conocer tus predisposiciones genéticas relacionadas con el peso?',
        examenes: ['findwhy-weight-control-profile'],
      },
      { pregunta: P.hormonal, examenes: [DUTCH_PLUS, HORMONE_PLUS] },
    ],
  },
  {
    id: 'agotada',
    num: '04',
    titulo: 'Me siento agotada o me cuesta descansar',
    descripcion:
      'Fatiga persistente, dificultades para dormir, cambios de energía o problemas de concentración.',
    color: 'olive',
    icono: 'M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5zM16 3h3l-3 3h3',
    subcategorias: [
      { pregunta: P.hormonal, examenes: [DUTCH_PLUS, 'dutch-adrenal-only'] },
      { pregunta: P.acidos, examenes: [ACIDOS] },
    ],
  },
  {
    id: 'animo',
    num: '05',
    titulo: 'Sufro de ansiedad o depresión',
    descripcion:
      'Quiero acompañar el cuidado de mi salud emocional y explorar aspectos de mi bienestar físico con orientación profesional.',
    color: 'clay-rich',
    icono:
      'M12 3a7 7 0 0 0-4 12.7V18a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.3A7 7 0 0 0 12 3zM10 22h4M9.5 10.5c.8-1 1.6-1.5 2.5-1.5s1.7.5 2.5 1.5',
    orientacionPrimero: true,
    subcategorias: [
      {
        pregunta: '¿Te conviene explorar un perfil de neurotransmisores?',
        examenes: ['comprehensive-neurotransmitter-profile'],
      },
      { pregunta: P.hormonal, examenes: [DUTCH_PLUS] },
      { pregunta: P.gastro, examenes: ['gi-advanced-profile-includes-zonulin-and-h-pylori'] },
      { pregunta: P.candida, examenes: [CANDIDA] },
      { pregunta: P.acidos, examenes: [ACIDOS] },
    ],
  },
  {
    id: 'alimentos',
    num: '06',
    titulo: 'Siento que algunos alimentos me caen mal',
    descripcion:
      'Molestias después de comer o sospecha de una reacción al trigo, al gluten u otros alimentos.',
    color: 'clay-deep',
    icono:
      'M12 7.5c-1.6-1.6-5.2-1.4-6.6 1.2C4 11.3 4.6 15.4 7 18.4c1.6 2 3.4 2.6 5 1.6 1.6 1 3.4.4 5-1.6 2.4-3 3-7.1 1.6-9.7-1.4-2.6-5-2.8-6.6-1.2zM12 7.5c0-2 1-3.4 3-4.5',
    subcategorias: [
      {
        pregunta: '¿Te conviene explorar una prueba relacionada con celiaquía y gluten?',
        examenes: [CELIACA],
      },
      { pregunta: P.alimentos, examenes: ALIMENTOS },
      { pregunta: P.gastro, examenes: GASTRO },
    ],
  },
  {
    id: 'piel',
    num: '07',
    titulo: 'Tengo alergias o reacciones en la piel',
    descripcion:
      'Picazón, ronchas, enrojecimiento o reacciones que relaciono con alimentos o con el ambiente.',
    color: 'rose-deep',
    icono:
      'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3zM18.5 15.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7.7-1.8z',
    subcategorias: [
      {
        pregunta: '¿Te conviene explorar paneles que incluyan IgE a alimentos?',
        examenes: IGE,
      },
      { pregunta: P.gastro, examenes: GASTRO_BASE },
      { pregunta: P.candida, examenes: [CANDIDA] },
      { pregunta: P.inmuneMoho, examenes: ['expanded-mold-immunoreactivity-panel'] },
    ],
  },
  {
    id: 'intimas',
    num: '08',
    titulo: 'Tengo molestias íntimas recurrentes',
    descripcion: 'Picazón, cambios en el flujo, olor o episodios repetidos de candidiasis vaginal.',
    color: 'rose',
    icono:
      'M12 21c-4 0-7-3-7-7 3 0 5.2 1.6 7 4.2 1.8-2.6 4-4.2 7-4.2 0 4-3 7-7 7zM12 18.2c-2.2-3.2-2.2-7.6 0-11.2 2.2 3.6 2.2 8 0 11.2z',
    subcategorias: [
      {
        pregunta: '¿Te conviene hacer un examen vaginal?',
        examenes: ['vaginosis-profile', 'yeast-culture-sensitivities-salud-vaginal'],
      },
      { pregunta: P.candida, examenes: [CANDIDA] },
    ],
  },
  {
    id: 'embarazo',
    num: '09',
    titulo: 'Estoy buscando embarazo',
    descripcion:
      'Quiero prepararme para un embarazo o recibir orientación sobre qué evaluar si me está costando concebir.',
    color: 'sage-deep',
    icono: 'M12 21v-8M12 13c0-4 3-7 7-7 0 4-3 7-7 7zM12 15.5c0-3-2.5-5.5-6-5.5 0 3.5 2.5 5.5 6 5.5',
    orientacionPrimero: true,
    subcategorias: [
      { pregunta: P.hormonal, examenes: [DUTCH_PLUS, HORMONE_PLUS] },
      { pregunta: P.gastro, examenes: GASTRO_BASE },
      { pregunta: P.acidos, examenes: [ACIDOS] },
      { pregunta: P.metabolica, examenes: [CARDIO] },
    ],
  },
  {
    id: 'respiratorias',
    num: '10',
    titulo: 'Tengo alergias respiratorias',
    descripcion:
      'Estornudos, congestión nasal o molestias respiratorias que relaciono con alimentos, con el ambiente o con exposición al moho.',
    color: 'olive',
    icono: 'M3 8h11a3 3 0 1 0-3-3M3 13h15a3 3 0 1 1-3 3M3 18h7',
    subcategorias: [
      { pregunta: P.alimentos, examenes: [CELIACA, ...ALIMENTOS] },
      { pregunta: P.gastro, examenes: GASTRO_BASE },
      { pregunta: P.moho, examenes: MOHO },
    ],
  },
  {
    id: 'articulares',
    num: '11',
    titulo: 'Tengo dolores articulares',
    descripcion:
      'Molestias articulares persistentes o recurrentes y quiero orientación sobre qué aspectos conviene evaluar.',
    color: 'clay-rich',
    icono: 'M5 3l5 7M19 21l-5-7M12 14.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
    orientacionPrimero: true,
    subcategorias: [
      { pregunta: P.gastro, examenes: GASTRO_BASE },
      { pregunta: P.acidos, examenes: [ACIDOS] },
      {
        pregunta: 'Otras opciones complementarias según la evaluación:',
        conCierre: false,
        examenes: [CELIACA, CARDIO],
      },
    ],
  },
  {
    id: 'autoinmune',
    num: '12',
    titulo: 'Tengo una condición autoinmune',
    descripcion:
      'Quiero acompañar el cuidado de mi salud y explorar aspectos digestivos y metabólicos relevantes para mi caso.',
    color: 'sage-deep',
    icono: 'M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6l7-3zM9 12l2 2 4-4',
    orientacionPrimero: true,
    subcategorias: [
      { pregunta: P.gastro, examenes: GASTRO_BASE },
      { pregunta: P.acidos, examenes: [ACIDOS] },
      {
        pregunta: 'Otras opciones complementarias según el diagnóstico y los antecedentes:',
        conCierre: false,
        examenes: [CELIACA, CARDIO],
      },
    ],
  },
  {
    id: 'moho',
    num: '13',
    titulo: 'Me preocupa la exposición al moho',
    descripcion: 'Humedad en casa o en el trabajo, o molestias que relaciono con esos ambientes.',
    color: 'olive',
    icono:
      'M4 11l8-7 8 7M6 9.5V20h12V9.5M12 11.5s-2.6 2.8-2.6 4.5a2.6 2.6 0 0 0 5.2 0c0-1.7-2.6-4.5-2.6-4.5z',
    subcategorias: [
      { pregunta: '¿Te conviene evaluar el ambiente?', examenes: ['mold-mycotoxin-building'] },
      { pregunta: P.inmuneMoho, examenes: ['expanded-mold-immunoreactivity-panel'] },
      {
        pregunta: '¿Quieres consultar la opción de micotoxinas en orina?',
        conCierre: false,
        examenes: ['mycotoxins-panel'],
      },
    ],
  },
  {
    id: 'contaminantes',
    num: '14',
    titulo: 'Quiero explorar mi exposición a contaminantes',
    descripcion:
      'Tengo antecedentes de exposición ambiental u ocupacional y quiero saber qué conviene evaluar.',
    color: 'clay-deep',
    icono: 'M3 21V11l5 3v-3l5 3V7l8-4v18H3zM7 17h2M12 17h2M17 17h1',
    subcategorias: [
      {
        pregunta: '¿Te conviene explorar exámenes de contaminantes y metales?',
        examenes: ['metales-pesados-minerales', 'all-tox'],
      },
      {
        pregunta: '¿Quieres consultar el perfil hepático de nuestro catálogo?',
        conCierre: false,
        examenes: ['hepatic-detox-profile'],
      },
      { pregunta: P.moho, examenes: MOHO },
    ],
  },
  {
    id: 'largo-plazo',
    num: '15',
    titulo: 'Quiero cuidar mi salud a largo plazo',
    descripcion:
      'Me interesa conocer indicadores de salud cardiometabólica y estrés oxidativo, junto con opciones hormonales y de metabolismo.',
    color: 'rose-deep',
    icono:
      'M12 20s-7-4.4-9-9a4.5 4.5 0 0 1 9-3 4.5 4.5 0 0 1 9 3c-.3.7-.7 1.4-1.2 2M3 12h4l2-3 3 6 2-3h2.5',
    subcategorias: [
      { pregunta: P.metabolica, examenes: [CARDIO] },
      {
        pregunta: '¿Te conviene explorar un marcador de estrés oxidativo?',
        examenes: ['dna-oxidative-damage'],
      },
      { pregunta: P.hormonal, examenes: [DUTCH_PLUS] },
      { pregunta: P.acidos, examenes: [ACIDOS] },
    ],
  },
];

export function cierre(sub: Subcategoria): string {
  if (sub.conCierre === false) return '';
  return sub.examenes.length === 1 ? 'Esta es nuestra opción:' : 'Estas son nuestras opciones:';
}

export function examenesDe(sub: Subcategoria): Examen[] {
  return sub.examenes.map((id) => {
    const e = examenPorId.get(id);
    if (!e) throw new Error(`sintomas.ts: «${id}» no existe en data/examenes`);
    return e;
  });
}

export function opcionesDe(s: Sintoma): number {
  return new Set(s.subcategorias.flatMap((sub) => sub.examenes)).size;
}

export function sintomasDeExamen(id: string): Sintoma[] {
  return sintomas.filter((s) => s.subcategorias.some((sub) => sub.examenes.includes(id)));
}
