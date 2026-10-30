import type { Campana } from '../lib/comercio/reglas.ts';
import { DESCUENTO_BLACK_FRIDAY } from '../lib/precio.ts';

const conDescuento = (de: string) => ({
  de,
  a: `${de}-black-friday`,
  descuento: DESCUENTO_BLACK_FRIDAY,
});

export const campanas: Campana[] = [
  {
    codigo: 'BLACKFRIDAY',
    inicio: '2026-11-01T00:00:00-04:00',
    fin: '2026-12-01T00:00:00-05:00',
    cambios: [
      conDescuento('184-igg-food-sensitivity-panel'),
      conDescuento('dutch-plus-hormonas-sexuales-adrenal'),
      conDescuento('gi-advanced-profile-includes-zonulin-and-h-pylori'),
      { de: 'layer-session', a: 'layer-session-black-friday' },
    ],
    regalo: 'recetario-30-desayunos',
  },
];
