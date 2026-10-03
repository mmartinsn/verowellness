/**
 * Exámenes by symptom (Mari, 2026-09-24: «presentar los exámenes por síntoma… fácil de leer»).
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

export interface Sintoma {
  id: string;
  /** How the visitor would say it. */
  titulo: string;
  /** Examples that help her recognise herself. */
  ejemplos: string;
  /** A token from `@theme` (`--color-<name>`). */
  color: string;
  /** A line icon on a 24-unit grid, stroked (same style as the sample icons). */
  icono: string;
  examenes: string[];
}

export const sintomas: Sintoma[] = [
  {
    id: 'digestion',
    icono: 'M9 3v4.5A4.5 4.5 0 0 0 13.5 12h.5a4 4 0 0 1 0 8h-3A6 6 0 0 1 5 14v-1',
    titulo: 'Me hincho y tengo molestias digestivas',
    ejemplos: 'Tengo gases, acidez o reflujo; me cuesta ir al baño o tengo diarrea.',
    color: 'clay',
    examenes: [
      'yeast-culture-sensitivities',
      'h-pylori',
      'microbiology-profile',
      '96-igg-food-sensitivity-panel',
      'culture-pcr-parasitology-cpp',
      'sibo-en-aliento-3h',
      'comprehensive-stool-analysis-parasitology',
      'gi-advanced-profile-includes-zonulin-and-h-pylori',
      'gi-effects-3-days',
    ],
  },
  {
    id: 'energia',
    icono:
      'M3 8h14a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1zM21 11v2M5.5 11v2',
    titulo: 'Me siento cansada y me cuesta concentrarme',
    ejemplos: 'Descanso y sigo cansada; mi energía baja durante el día.',
    color: 'sage',
    examenes: [
      'metales-pesados-minerales',
      'candida-albicans-en-sangre',
      'dutch-adrenal-only',
      'organic-acids',
      'mycotoxins-panel',
      'comprehensive-stool-analysis-parasitology',
      'dutch-plus-hormonas-sexuales-adrenal',
      'all-tox',
    ],
  },
  {
    id: 'hormonas',
    icono: 'M12 14a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM12 14v7M9 18h6',
    titulo: 'Noto cambios en mi ciclo',
    ejemplos: 'Mi menstruación es irregular o tengo molestias antes de que llegue.',
    color: 'rose',
    examenes: [
      'dutch-solo-hormonas',
      'comprehensive-hormone-plus-profile',
      'cardiometabolic-profile',
      'gi-advanced-profile-includes-zonulin-and-h-pylori',
      'dutch-plus-hormonas-sexuales-adrenal',
      'all-tox',
    ],
  },
  {
    id: 'estres',
    icono: 'M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5zM16 3h3l-3 3h3',
    titulo: 'Me cuesta relajarme o dormir bien',
    ejemplos: 'Estoy cansada, pero sigo acelerada; me siento ansiosa o desanimada.',
    color: 'olive',
    examenes: [
      'dutch-adrenal-only',
      'organic-acids',
      'comprehensive-neurotransmitter-profile',
      'dutch-plus-hormonas-sexuales-adrenal',
    ],
  },
  {
    id: 'alimentos',
    icono:
      'M12 7.5c-1.6-1.6-5.2-1.4-6.6 1.2C4 11.3 4.6 15.4 7 18.4c1.6 2 3.4 2.6 5 1.6 1.6 1 3.4.4 5-1.6 2.4-3 3-7.1 1.6-9.7-1.4-2.6-5-2.8-6.6-1.2zM12 7.5c0-2 1-3.4 3-4.5',
    titulo: 'Siento que algo que como me cae mal',
    ejemplos: 'Noto molestias después de comer y no sé qué alimento las provoca.',
    color: 'clay-deep',
    examenes: [
      'celiac-and-gluten-sensitivity-blood-spot',
      '96-igg-food-sensitivity-panel',
      '184-igg-food-sensitivity-panel',
      '96-igg-food-gluten-related-disorders-panel',
      '96-vegetarian-food-panel-iga-igg-igg4',
      '184-igg-food-gluten-related-disorders-panel',
      '184-igg-food-sensitivity-25-comprehensive-ige-combo-panel',
      '198-vegetarian-food-panel-iga-igg-igg4',
      '205-igg-food-sensitivity-25-comprehensive-ige-combo-panel',
      '240-food-panel-iga-igg-igg4',
      '184-igg-food-sensitivity-50-expanded-ige-combo-panel',
      '205-igg-food-sensitivity-50-expanded-ige-combo-panel',
    ],
  },
  {
    id: 'piel',
    icono:
      'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3zM18.5 15.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7.7-1.8z',
    titulo: 'Tengo brotes en la piel o molestias alérgicas',
    ejemplos: 'Me salen granitos o ronchas, me pica la piel o estornudo seguido.',
    color: 'rose-deep',
    examenes: [
      'celiac-and-gluten-sensitivity-blood-spot',
      'dutch-solo-hormonas',
      '96-igg-food-gluten-related-disorders-panel',
      'expanded-mold-immunoreactivity-panel',
      'comprehensive-stool-analysis-parasitology',
      'gi-advanced-profile-includes-zonulin-and-h-pylori',
      '184-igg-food-sensitivity-25-comprehensive-ige-combo-panel',
      '240-food-panel-iga-igg-igg4',
      '184-igg-food-sensitivity-50-expanded-ige-combo-panel',
    ],
  },
  {
    id: 'peso',
    icono:
      'M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM8 10a4 4 0 0 1 8 0M12 10l1.6-2.2',
    titulo: 'Me cuesta bajar de peso',
    ejemplos: 'Tengo antojos, noto grasa en el abdomen o me canso después de comer.',
    color: 'sand',
    examenes: [
      'yeast-culture-sensitivities',
      'findwhy-weight-control-profile',
      'dutch-adrenal-only',
      'cardiometabolic-profile',
      'comprehensive-neurotransmitter-profile',
    ],
  },
  {
    id: 'intima',
    icono:
      'M12 21c-4 0-7-3-7-7 3 0 5.2 1.6 7 4.2 1.8-2.6 4-4.2 7-4.2 0 4-3 7-7 7zM12 18.2c-2.2-3.2-2.2-7.6 0-11.2 2.2 3.6 2.2 8 0 11.2z',
    titulo: 'Tengo molestias en mi zona íntima',
    ejemplos: 'Noto cambios en el flujo o el olor, o tengo picazón que vuelve.',
    color: 'clay-rich',
    examenes: [
      'yeast-culture-sensitivities-salud-vaginal',
      'vaginosis-profile',
      'candida-albicans-en-sangre',
    ],
  },
  {
    id: 'toxicos',
    icono:
      'M4 11l8-7 8 7M6 9.5V20h12V9.5M12 11.5s-2.6 2.8-2.6 4.5a2.6 2.6 0 0 0 5.2 0c0-1.7-2.6-4.5-2.6-4.5z',
    titulo: 'Me preocupa lo que hay en mi entorno',
    ejemplos: 'Hay humedad en casa, me molestan los olores o trabajo con químicos o metales.',
    color: 'sage-deep',
    examenes: [
      'metales-pesados-minerales',
      'hepatic-detox-profile',
      'mold-mycotoxin-building',
      'mycotoxins-panel',
      'expanded-mold-immunoreactivity-panel',
      'all-tox',
    ],
  },
  {
    id: 'prevencion',
    icono:
      'M12 20s-7-4.4-9-9a4.5 4.5 0 0 1 9-3 4.5 4.5 0 0 1 9 3c-.3.7-.7 1.4-1.2 2M3 12h4l2-3 3 6 2-3h2.5',
    titulo: 'Quiero cuidar mi salud a largo plazo',
    ejemplos: 'Quiero cuidar mi corazón, conocer mi metabolismo y envejecer con bienestar.',
    color: 'sage',
    examenes: ['dna-oxidative-damage', 'organic-acids', 'cardiometabolic-profile'],
  },
];

/** The sentence of a description that says who the test is for («Útil si…», «Ideal si…»). */
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

/** Every exam of a group, resolved. Throws at build time if an id does not exist. */
export function examenesDe(s: Sintoma): Examen[] {
  return s.examenes.map((id) => {
    const e = examenPorId.get(id);
    if (!e) throw new Error(`sintomas.ts: «${id}» no existe en data/examenes`);
    return e;
  });
}
