/**
 * A small line figure per lab test for the catalogue (Verónica, 2026-10-03: «una figurita
 * representativa y elegante por cada examen»). Drawn by Claude on a 24-unit grid, stroked like
 * the sample icons; each test gets the figure of what it looks at.
 */
const f = {
  intestino: 'M7 3.5h9a3.25 3.25 0 0 1 0 6.5H8.5a3.25 3.25 0 0 0 0 6.5H15a3 3 0 0 1 0 6',
  aliento: 'M3 9h10a2.5 2.5 0 1 0-2.5-2.5M3 13h14a3 3 0 1 1-3 3M3 17h6',
  bacteria:
    'M9 7a3 3 0 0 1 6 0v10a3 3 0 0 1-6 0zM12 20v2M10 3.5 9 2M14 3.5 15 2M9 12H6.5M15 12h2.5',
  levadura:
    'M14.5 14a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0zM19 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zM8.5 13h.01M11 15.5h.01',
  gota: 'M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11zM9.5 14.5a2.5 2.5 0 0 0 2.5 2.5',
  hormonas: 'M15 4.5A8 8 0 1 0 19.5 15 6.5 6.5 0 0 1 15 4.5zM18.5 3v3M17 4.5h3',
  trigo:
    'M12 21V8M12 8c-2-1-3-3-3-5 2 1 3 3 3 5zm0 0c2-1 3-3 3-5-2 1-3 3-3 5zM12 13c-2-1-3.5-2.5-3.5-4.5 2 .5 3.5 2.5 3.5 4.5zm0 0c2-1 3.5-2.5 3.5-4.5-2 .5-3.5 2.5-3.5 4.5zM12 18c-2-1-3.5-2.5-3.5-4.5 2 .5 3.5 2.5 3.5 4.5zm0 0c2-1 3.5-2.5 3.5-4.5-2 .5-3.5 2.5-3.5 4.5z',
  plato: 'M20 12a8 8 0 1 1-16 0 8 8 0 0 1 16 0zM15.5 12a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0z',
  hoja: 'M5 19c0-8 5-13 14-14-1 9-6 14-14 14zM5 19l8-8',
  corazon:
    'M12 20s-7-4.4-9-9a4.5 4.5 0 0 1 9-3 4.5 4.5 0 0 1 9 3c-2 4.6-9 9-9 9zM3 12h4l2-3 3 6 2-3h2.5',
  loto: 'M12 20c-4 0-7-3-7-7 3 0 5.2 1.6 7 4.2 1.8-2.6 4-4.2 7-4.2 0 4-3 7-7 7zM12 17.2c-2.2-3.2-2.2-7.6 0-11.2 2.2 3.6 2.2 8 0 11.2z',
  mente:
    'M9 4a4 4 0 0 0-4 4c0 1.2.5 2.2 1.3 3A4 4 0 0 0 9 18h1V4H9zM15 4a4 4 0 0 1 4 4c0 1.2-.5 2.2-1.3 3A4 4 0 0 1 15 18h-1V4h1z',
  casa: 'M4 11l8-7 8 7M6 9.5V20h12V9.5M12 11.5s-2.6 2.8-2.6 4.5a2.6 2.6 0 0 0 5.2 0c0-1.7-2.6-4.5-2.6-4.5z',
  esporas:
    'M8 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM20 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM11 16a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0zM19 17a2 2 0 1 1-4 0 2 2 0 0 1 4 0z',
  adn: 'M7 3c0 5 10 7 10 12 0 3-2 5-2 6M17 3c0 5-10 7-10 12 0 3 2 5 2 6M8.5 7h7M8.5 17h7M10 12h4',
  balanza: 'M12 4v16M6 20h12M6 8h12M6 8l-3 6a3 3 0 0 0 6 0zM18 8l-3 6a3 3 0 0 0 6 0z',
  molecula: 'M12 3l7.5 4.5v9L12 21l-7.5-4.5v-9zM12 8l3.5 2v4L12 16l-3.5-2v-4z',
  higado:
    'M3 9c0-2.5 2-4 5-4 4 0 8 0 11 1 1.5.5 2 2 1 3.5C18 13 12 19 8 19c-3 0-5-4-5-10zM12 9c0 3-1 6-3 8',
  matraz: 'M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3M7.5 15h9',
};

const porExamen: Record<string, keyof typeof f> = {
  'comprehensive-stool-analysis-parasitology': 'intestino',
  'gi-effects-3-days': 'intestino',
  'sibo-en-aliento-3h': 'aliento',
  'microbiology-profile': 'intestino',
  'h-pylori': 'bacteria',
  'culture-pcr-parasitology-cpp': 'bacteria',
  'yeast-culture-sensitivities': 'levadura',
  'gi-advanced-profile-includes-zonulin-and-h-pylori': 'intestino',
  'candida-albicans-en-sangre': 'gota',
  'dutch-plus-hormonas-sexuales-adrenal': 'hormonas',
  'dutch-solo-hormonas': 'hormonas',
  'dutch-adrenal-only': 'hormonas',
  'comprehensive-hormone-plus-profile': 'hormonas',
  'celiac-and-gluten-sensitivity-blood-spot': 'trigo',
  '198-vegetarian-food-panel-iga-igg-igg4': 'hoja',
  '96-vegetarian-food-panel-iga-igg-igg4': 'hoja',
  '240-food-panel-iga-igg-igg4': 'plato',
  '96-igg-food-sensitivity-panel': 'plato',
  '184-igg-food-sensitivity-panel': 'plato',
  '96-igg-food-gluten-related-disorders-panel': 'trigo',
  '184-igg-food-gluten-related-disorders-panel': 'trigo',
  '184-igg-food-sensitivity-25-comprehensive-ige-combo-panel': 'plato',
  '184-igg-food-sensitivity-50-expanded-ige-combo-panel': 'plato',
  '205-igg-food-sensitivity-25-comprehensive-ige-combo-panel': 'plato',
  '205-igg-food-sensitivity-50-expanded-ige-combo-panel': 'plato',
  'cardiometabolic-profile': 'corazon',
  'vaginosis-profile': 'loto',
  'yeast-culture-sensitivities-salud-vaginal': 'levadura',
  'comprehensive-neurotransmitter-profile': 'mente',
  'mold-mycotoxin-building': 'casa',
  'mycotoxins-panel': 'esporas',
  'expanded-mold-immunoreactivity-panel': 'esporas',
  'dna-oxidative-damage': 'adn',
  'findwhy-weight-control-profile': 'balanza',
  'metales-pesados-minerales': 'molecula',
  'hepatic-detox-profile': 'higado',
  'all-tox': 'molecula',
  'organic-acids': 'matraz',
};

/** The figure for a test; a flask if a new test has no figure yet. */
export function iconoExamen(id: string): string {
  return f[porExamen[id] ?? 'matraz'];
}
