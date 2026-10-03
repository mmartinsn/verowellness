/**
 * Exámenes by symptom and interest — Verónica's catalogue of 2026-10-03 (document «AJUSTES…»,
 * change 38): fifteen cards in her words, each opening sub-groups by type of study («¿Te conviene…?
 * Estas son nuestras opciones:»). A test can appear in several cards; it keeps one fact sheet.
 * Earlier (Mari, 2026-09-24: «presentar los exámenes por síntoma… fácil de leer»).
 * The page starts from what the visitor feels, not from the lab's categories.
 *
 * Each group lists exam ids from data/examenes. The placement follows each test's own description
 * (Verónica's text, column F of her price list): its «Útil si… / Ideal si… / Recomendado…» line
 * names the symptoms it is for. A test can sit under several symptoms. Groups are ordered from the
 * lighter, cheaper entry test to the most complete one.
 *
 * Titles and examples in the visitor's voice, copy by Codex (2026-09-24); to review with Verónica.
 */
import { examenPorId, type Examen } from './examenes';

export interface GrupoSintoma {
  pregunta: string;
  examenes: string[];
}

export interface Sintoma {
  id: string;
  /** How the visitor would say it (Verónica's wording). */
  titulo: string;
  /** Examples that help her recognise herself. */
  ejemplos: string;
  /** A token from `@theme` (`--color-<name>`). */
  color: string;
  /** A line icon on a 24-unit grid, stroked (same style as the sample icons). */
  icono: string;
  /** Cases where Verónica asks to lead with guidance before choosing (anxiety, pregnancy…). */
  orientacion?: boolean;
  grupos: GrupoSintoma[];
}

export const sintomas: Sintoma[] = [
  {
    id: 'digestion',
    icono: 'M9 3v4.5A4.5 4.5 0 0 0 13.5 12h.5a4 4 0 0 1 0 8h-3A6 6 0 0 1 5 14v-1',
    titulo: 'Tengo molestias digestivas',
    ejemplos: 'Hinchazón, gases, estreñimiento, diarrea, ardor o molestias después de comer.',
    color: 'clay',
    grupos: [
      {
        pregunta: '¿Te conviene hacer algún examen gastrointestinal? Estas son nuestras opciones:',
        examenes: [
          'comprehensive-stool-analysis-parasitology',
          'gi-effects-3-days',
          'gi-advanced-profile-includes-zonulin-and-h-pylori',
          'sibo-en-aliento-3h',
          'microbiology-profile',
          'h-pylori',
          'culture-pcr-parasitology-cpp',
        ],
      },
      {
        pregunta: '¿Te conviene evaluar Candida? Esta es nuestra opción:',
        examenes: ['candida-albicans-en-sangre', 'yeast-culture-sensitivities'],
      },
    ],
  },
  {
    id: 'hormonas',
    icono: 'M12 14a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM12 14v7M9 18h6',
    titulo: 'Quiero entender mis hormonas',
    ejemplos:
      'Cambios en mi ciclo, síntomas premenstruales, síndrome premenstrual, ovarios poliquísticos, endometriosis, miomas, dificultad para perder peso, acné, libido baja o cambios durante la perimenopausia.',
    color: 'rose',
    grupos: [
      {
        pregunta: '¿Te conviene explorar tu perfil hormonal? Estas son nuestras opciones:',
        examenes: ['dutch-plus-hormonas-sexuales-adrenal', 'comprehensive-hormone-plus-profile'],
      },
    ],
  },
  {
    id: 'peso',
    icono:
      'M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM8 10a4 4 0 0 1 8 0M12 10l1.6-2.2',
    titulo: 'Me cuesta perder peso o mejorar mi composición corporal',
    ejemplos:
      'Quiero explorar aspectos de mi metabolismo y conocer mis predisposiciones relacionadas con el peso.',
    color: 'sand',
    grupos: [
      {
        pregunta: '¿Te conviene hacer una evaluación metabólica? Esta es nuestra opción:',
        examenes: ['cardiometabolic-profile'],
      },
      {
        pregunta:
          '¿Quieres conocer tus predisposiciones genéticas relacionadas con el peso? Esta es nuestra opción:',
        examenes: ['findwhy-weight-control-profile'],
      },
      {
        pregunta: '¿Te conviene explorar tu perfil hormonal? Estas son nuestras opciones:',
        examenes: ['dutch-plus-hormonas-sexuales-adrenal', 'comprehensive-hormone-plus-profile'],
      },
    ],
  },
  {
    id: 'energia',
    icono:
      'M3 8h14a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1zM21 11v2M5.5 11v2',
    titulo: 'Me siento agotada o me cuesta descansar',
    ejemplos:
      'Fatiga persistente, dificultades para dormir, cambios de energía o problemas de concentración.',
    color: 'sage',
    grupos: [
      {
        pregunta: '¿Te conviene explorar tu perfil hormonal? Estas son nuestras opciones:',
        examenes: ['dutch-plus-hormonas-sexuales-adrenal', 'dutch-adrenal-only'],
      },
      {
        pregunta: '¿Te conviene hacer un examen de ácidos orgánicos? Esta es nuestra opción:',
        examenes: ['organic-acids'],
      },
    ],
  },
  {
    id: 'animo',
    icono:
      'M9 4a4 4 0 0 0-4 4c0 1.2.5 2.2 1.3 3A4 4 0 0 0 9 18h1V4H9zM15 4a4 4 0 0 1 4 4c0 1.2-.5 2.2-1.3 3A4 4 0 0 1 15 18h-1V4h1z',
    titulo: 'Sufro de ansiedad o depresión',
    ejemplos:
      'Quiero acompañar el cuidado de mi salud emocional y explorar aspectos de mi bienestar físico con orientación profesional.',
    color: 'olive',
    orientacion: true,
    grupos: [
      {
        pregunta: '¿Te conviene explorar un perfil de neurotransmisores? Esta es nuestra opción:',
        examenes: ['comprehensive-neurotransmitter-profile'],
      },
      {
        pregunta: '¿Te conviene explorar tu perfil hormonal? Estas son nuestras opciones:',
        examenes: ['dutch-plus-hormonas-sexuales-adrenal'],
      },
      {
        pregunta: '¿Te conviene hacer algún examen gastrointestinal? Estas son nuestras opciones:',
        examenes: ['gi-advanced-profile-includes-zonulin-and-h-pylori'],
      },
      {
        pregunta: '¿Te conviene evaluar Candida? Esta es nuestra opción:',
        examenes: ['candida-albicans-en-sangre'],
      },
      {
        pregunta: '¿Te conviene hacer un examen de ácidos orgánicos? Esta es nuestra opción:',
        examenes: ['organic-acids'],
      },
    ],
  },
  {
    id: 'alimentos',
    icono:
      'M12 7.5c-1.6-1.6-5.2-1.4-6.6 1.2C4 11.3 4.6 15.4 7 18.4c1.6 2 3.4 2.6 5 1.6 1.6 1 3.4.4 5-1.6 2.4-3 3-7.1 1.6-9.7-1.4-2.6-5-2.8-6.6-1.2zM12 7.5c0-2 1-3.4 3-4.5',
    titulo: 'Siento que algunos alimentos me caen mal',
    ejemplos:
      'Molestias después de comer o sospecha de una reacción al trigo, al gluten u otros alimentos.',
    color: 'clay-deep',
    grupos: [
      {
        pregunta:
          '¿Te conviene explorar una prueba relacionada con celiaquía y gluten? Esta es nuestra opción:',
        examenes: ['celiac-and-gluten-sensitivity-blood-spot'],
      },
      {
        pregunta:
          '¿Te conviene explorar los exámenes relacionados con alimentos? Estas son nuestras opciones:',
        examenes: [
          '198-vegetarian-food-panel-iga-igg-igg4',
          '96-vegetarian-food-panel-iga-igg-igg4',
          '240-food-panel-iga-igg-igg4',
          '96-igg-food-sensitivity-panel',
          '184-igg-food-sensitivity-panel',
          '96-igg-food-gluten-related-disorders-panel',
          '184-igg-food-gluten-related-disorders-panel',
          '184-igg-food-sensitivity-25-comprehensive-ige-combo-panel',
          '184-igg-food-sensitivity-50-expanded-ige-combo-panel',
          '205-igg-food-sensitivity-25-comprehensive-ige-combo-panel',
          '205-igg-food-sensitivity-50-expanded-ige-combo-panel',
        ],
      },
      {
        pregunta: '¿Te conviene hacer algún examen gastrointestinal? Estas son nuestras opciones:',
        examenes: [
          'comprehensive-stool-analysis-parasitology',
          'gi-effects-3-days',
          'gi-advanced-profile-includes-zonulin-and-h-pylori',
          'sibo-en-aliento-3h',
          'microbiology-profile',
          'h-pylori',
          'culture-pcr-parasitology-cpp',
        ],
      },
    ],
  },
  {
    id: 'piel',
    icono:
      'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3zM18.5 15.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7.7-1.8z',
    titulo: 'Tengo alergias o reacciones en la piel',
    ejemplos:
      'Picazón, ronchas, enrojecimiento o reacciones que relaciono con alimentos o con el ambiente.',
    color: 'rose-deep',
    grupos: [
      {
        pregunta:
          '¿Te conviene explorar paneles que incluyan IgE a alimentos? Estas son nuestras opciones:',
        examenes: [
          '184-igg-food-sensitivity-25-comprehensive-ige-combo-panel',
          '184-igg-food-sensitivity-50-expanded-ige-combo-panel',
          '205-igg-food-sensitivity-25-comprehensive-ige-combo-panel',
          '205-igg-food-sensitivity-50-expanded-ige-combo-panel',
        ],
      },
      {
        pregunta: '¿Te conviene hacer algún examen gastrointestinal? Estas son nuestras opciones:',
        examenes: [
          'comprehensive-stool-analysis-parasitology',
          'gi-effects-3-days',
          'gi-advanced-profile-includes-zonulin-and-h-pylori',
        ],
      },
      {
        pregunta: '¿Te conviene evaluar Candida? Esta es nuestra opción:',
        examenes: ['candida-albicans-en-sangre'],
      },
      {
        pregunta: '¿Te conviene explorar la respuesta inmune a mohos? Esta es nuestra opción:',
        examenes: ['expanded-mold-immunoreactivity-panel'],
      },
    ],
  },
  {
    id: 'intima',
    icono:
      'M12 21c-4 0-7-3-7-7 3 0 5.2 1.6 7 4.2 1.8-2.6 4-4.2 7-4.2 0 4-3 7-7 7zM12 18.2c-2.2-3.2-2.2-7.6 0-11.2 2.2 3.6 2.2 8 0 11.2z',
    titulo: 'Tengo molestias íntimas recurrentes',
    ejemplos: 'Picazón, cambios en el flujo, olor o episodios repetidos de candidiasis vaginal.',
    color: 'clay-rich',
    grupos: [
      {
        pregunta: '¿Te conviene hacer un examen vaginal? Estas son nuestras opciones:',
        examenes: ['vaginosis-profile', 'yeast-culture-sensitivities-salud-vaginal'],
      },
      {
        pregunta: '¿Te conviene evaluar Candida? Esta es nuestra opción:',
        examenes: ['candida-albicans-en-sangre'],
      },
    ],
  },
  {
    id: 'embarazo',
    icono: 'M12 21s-7-4.6-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.4-7 10-7 10zM12 11v4M10 13h4',
    titulo: 'Estoy buscando embarazo',
    ejemplos:
      'Quiero prepararme para un embarazo o recibir orientación sobre qué evaluar si me está costando concebir.',
    color: 'rose',
    orientacion: true,
    grupos: [
      {
        pregunta: '¿Te conviene explorar tu perfil hormonal? Estas son nuestras opciones:',
        examenes: ['dutch-plus-hormonas-sexuales-adrenal', 'comprehensive-hormone-plus-profile'],
      },
      {
        pregunta: '¿Te conviene hacer algún examen gastrointestinal? Estas son nuestras opciones:',
        examenes: [
          'comprehensive-stool-analysis-parasitology',
          'gi-effects-3-days',
          'gi-advanced-profile-includes-zonulin-and-h-pylori',
        ],
      },
      {
        pregunta: '¿Te conviene hacer un examen de ácidos orgánicos? Esta es nuestra opción:',
        examenes: ['organic-acids'],
      },
      {
        pregunta: '¿Te conviene hacer una evaluación metabólica? Esta es nuestra opción:',
        examenes: ['cardiometabolic-profile'],
      },
    ],
  },
  {
    id: 'respiratorias',
    icono: 'M12 4v9M12 13c-2 0-4 1.5-5 4l-1 3c2 0 4-1 5-3M12 13c2 0 4 1.5 5 4l1 3c-2 0-4-1-5-3',
    titulo: 'Tengo alergias respiratorias',
    ejemplos:
      'Estornudos, congestión nasal o molestias respiratorias que relaciono con alimentos, con el ambiente o con exposición al moho.',
    color: 'sage-deep',
    grupos: [
      {
        pregunta:
          '¿Te conviene explorar los exámenes relacionados con alimentos? Estas son nuestras opciones:',
        examenes: [
          'celiac-and-gluten-sensitivity-blood-spot',
          '198-vegetarian-food-panel-iga-igg-igg4',
          '96-vegetarian-food-panel-iga-igg-igg4',
          '240-food-panel-iga-igg-igg4',
          '96-igg-food-sensitivity-panel',
          '184-igg-food-sensitivity-panel',
          '96-igg-food-gluten-related-disorders-panel',
          '184-igg-food-gluten-related-disorders-panel',
          '184-igg-food-sensitivity-25-comprehensive-ige-combo-panel',
          '184-igg-food-sensitivity-50-expanded-ige-combo-panel',
          '205-igg-food-sensitivity-25-comprehensive-ige-combo-panel',
          '205-igg-food-sensitivity-50-expanded-ige-combo-panel',
        ],
      },
      {
        pregunta: '¿Te conviene hacer algún examen gastrointestinal? Estas son nuestras opciones:',
        examenes: [
          'comprehensive-stool-analysis-parasitology',
          'gi-effects-3-days',
          'gi-advanced-profile-includes-zonulin-and-h-pylori',
        ],
      },
      {
        pregunta:
          '¿Te conviene explorar exámenes relacionados con moho y micotoxinas? Estas son nuestras opciones:',
        examenes: [
          'mold-mycotoxin-building',
          'expanded-mold-immunoreactivity-panel',
          'mycotoxins-panel',
        ],
      },
    ],
  },
  {
    id: 'articulaciones',
    icono: 'M8 3l2 6M16 3l-2 6M10 9h4l1 4-3 8-3-8 1-4z',
    titulo: 'Tengo dolores articulares',
    ejemplos:
      'Molestias articulares persistentes o recurrentes y quiero orientación sobre qué aspectos conviene evaluar.',
    color: 'olive',
    orientacion: true,
    grupos: [
      {
        pregunta: '¿Te conviene hacer algún examen gastrointestinal? Estas son nuestras opciones:',
        examenes: [
          'comprehensive-stool-analysis-parasitology',
          'gi-effects-3-days',
          'gi-advanced-profile-includes-zonulin-and-h-pylori',
        ],
      },
      {
        pregunta: '¿Te conviene hacer un examen de ácidos orgánicos? Esta es nuestra opción:',
        examenes: ['organic-acids'],
      },
      {
        pregunta: 'Otras opciones complementarias según la evaluación:',
        examenes: ['celiac-and-gluten-sensitivity-blood-spot', 'cardiometabolic-profile'],
      },
    ],
  },
  {
    id: 'autoinmune',
    icono: 'M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3zM9 12l2 2 4-4',
    titulo: 'Tengo una condición autoinmune',
    ejemplos:
      'Quiero acompañar el cuidado de mi salud y explorar aspectos digestivos y metabólicos relevantes para mi caso.',
    color: 'clay',
    orientacion: true,
    grupos: [
      {
        pregunta: '¿Te conviene hacer algún examen gastrointestinal? Estas son nuestras opciones:',
        examenes: [
          'comprehensive-stool-analysis-parasitology',
          'gi-effects-3-days',
          'gi-advanced-profile-includes-zonulin-and-h-pylori',
        ],
      },
      {
        pregunta: '¿Te conviene hacer un examen de ácidos orgánicos? Esta es nuestra opción:',
        examenes: ['organic-acids'],
      },
      {
        pregunta: 'Otras opciones complementarias según el diagnóstico y los antecedentes:',
        examenes: ['celiac-and-gluten-sensitivity-blood-spot', 'cardiometabolic-profile'],
      },
    ],
  },
  {
    id: 'moho',
    icono:
      'M4 11l8-7 8 7M6 9.5V20h12V9.5M12 11.5s-2.6 2.8-2.6 4.5a2.6 2.6 0 0 0 5.2 0c0-1.7-2.6-4.5-2.6-4.5z',
    titulo: 'Me preocupa la exposición al moho',
    ejemplos: 'Humedad en casa o en el trabajo, o molestias que relaciono con esos ambientes.',
    color: 'sage',
    grupos: [
      {
        pregunta: '¿Te conviene evaluar el ambiente? Esta es nuestra opción:',
        examenes: ['mold-mycotoxin-building'],
      },
      {
        pregunta: '¿Te conviene explorar la respuesta inmune a mohos? Esta es nuestra opción:',
        examenes: ['expanded-mold-immunoreactivity-panel'],
      },
      {
        pregunta: '¿Quieres consultar la opción de micotoxinas en orina?',
        examenes: ['mycotoxins-panel'],
      },
    ],
  },
  {
    id: 'contaminantes',
    icono:
      'M4 11l8-7 8 7M6 9.5V20h12V9.5M12 11.5s-2.6 2.8-2.6 4.5a2.6 2.6 0 0 0 5.2 0c0-1.7-2.6-4.5-2.6-4.5z',
    titulo: 'Quiero explorar mi exposición a contaminantes',
    ejemplos:
      'Tengo antecedentes de exposición ambiental u ocupacional y quiero saber qué conviene evaluar.',
    color: 'sage-deep',
    grupos: [
      {
        pregunta:
          '¿Te conviene explorar exámenes de contaminantes y metales? Estas son nuestras opciones:',
        examenes: ['metales-pesados-minerales', 'all-tox'],
      },
      {
        pregunta: '¿Quieres consultar el perfil hepático de nuestro catálogo?',
        examenes: ['hepatic-detox-profile'],
      },
      {
        pregunta:
          '¿Te conviene explorar exámenes relacionados con moho y micotoxinas? Estas son nuestras opciones:',
        examenes: [
          'mold-mycotoxin-building',
          'expanded-mold-immunoreactivity-panel',
          'mycotoxins-panel',
        ],
      },
    ],
  },
  {
    id: 'largo-plazo',
    icono:
      'M12 20s-7-4.4-9-9a4.5 4.5 0 0 1 9-3 4.5 4.5 0 0 1 9 3c-.3.7-.7 1.4-1.2 2M3 12h4l2-3 3 6 2-3h2.5',
    titulo: 'Quiero cuidar mi salud a largo plazo',
    ejemplos:
      'Me interesa conocer indicadores de salud cardiometabólica y estrés oxidativo, junto con opciones hormonales y de metabolismo.',
    color: 'clay-rich',
    grupos: [
      {
        pregunta: '¿Te conviene hacer una evaluación metabólica? Esta es nuestra opción:',
        examenes: ['cardiometabolic-profile'],
      },
      {
        pregunta: '¿Te conviene explorar un marcador de estrés oxidativo? Esta es nuestra opción:',
        examenes: ['dna-oxidative-damage'],
      },
      {
        pregunta: '¿Te conviene explorar tu perfil hormonal? Estas son nuestras opciones:',
        examenes: ['dutch-plus-hormonas-sexuales-adrenal'],
      },
      {
        pregunta: '¿Te conviene hacer un examen de ácidos orgánicos? Esta es nuestra opción:',
        examenes: ['organic-acids'],
      },
    ],
  },
];

export function paraQuien(e: Examen): string {
  const frases = e.descripcion.match(/[^.!?]+[.!?]+/g) ?? [e.descripcion];
  return (
    frases
      .map((f) => f.trim())
      .find((f) => /^(Útil|Ideal|Recomendado|Buena opción|Para )/.test(f)) ??
    // No «Útil si…» line (one test): its last sentence says what sets it apart.
    frases[frases.length - 1].trim()
  );
}

/** One sub-group's exams, resolved. Throws at build time if an id does not exist. */
export function examenesDe(g: GrupoSintoma): Examen[] {
  return g.examenes.map((id) => {
    const e = examenPorId.get(id);
    if (!e) throw new Error(`sintomas.ts: «${id}» no existe en data/examenes`);
    return e;
  });
}

/** How many different tests a card offers. */
export function totalExamenes(s: Sintoma): number {
  return new Set(s.grupos.flatMap((g) => g.examenes)).size;
}
