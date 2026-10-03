import { faq } from './faq';

/**
 * Suplementos — Verónica recommends, she does not sell: the purchase happens on Wholescripts, the
 * way nutriwhitesalud.com/supplement does it (registration link + referral code + practitioner's
 * last name). Mari, 2026-09-23.
 *
 * PENDIENTE (Verónica): her own Wholescripts registration link, referral code and the last name
 * patients search her by. Until then the button goes to the Wholescripts home page and the code
 * step is not shown.
 */
export const wholescripts = {
  /** Her registration link, e.g. https://www.wholescripts.com/register/<codigo>-<apellido>. */
  registro: 'https://www.wholescripts.com/',
  /** Referral code patients type when registering. `null` hides the step. */
  codigo: null as string | null,
  /** Practitioner last name asked for at registration. `null` hides it. */
  apellido: null as string | null,
  pendiente: true,
};

/** The label: what goes into each recommendation (100%) and what never does (0%). */
export const etiqueta = {
  si: [
    'Tu contexto (The Layer Assessment)',
    'Una prioridad que lo justifique',
    'Calidad de grado profesional',
    'Revisión en tu siguiente sesión',
  ],
  no: ['Modas', '"Por si acaso"', 'Listas genéricas'],
};

export const principios = [
  {
    titulo: 'Primero el mapa',
    texto:
      'Un suplemento entra cuando responde a una de tus prioridades, no antes. Por eso se define dentro de tu Layer Plan, junto con la alimentación y los hábitos.',
  },
  {
    titulo: 'Calidad que se puede rastrear',
    texto:
      'Recomiendo marcas de grado profesional a través de Wholescripts, una plataforma para profesionales de la salud. Tú compras directamente ahí.',
  },
  {
    titulo: 'Se revisa, no se acumula',
    texto:
      'Lo que tomas se revisa en cada ciclo: qué está ayudando, qué ya no hace falta y qué conviene ajustar.',
  },
];

export const avisoSuplementos =
  'Los suplementos no sustituyen un diagnóstico ni un tratamiento médico. Consulta con tu médico antes de empezar cualquiera, sobre todo si estás embarazada, en lactancia o tomas medicación. Veronica Wellness no procesa pagos ni almacena datos de tarjetas: el registro, la compra y el envío se hacen en Wholescripts.';

export interface Suplemento {
  nombre: string;
  marca: string;
}

/**
 * «El estante»: the picks shown on each Layer's bottle. Taken from the list on
 * nutriwhitesalud.com/supplement (six groups, 17 products; read 2026-09-24) at Mari's request, and
 * placed by what each Layer observes (data/layers): vitamins → 01, digestion/liver → 02,
 * microbiota/gut/immune/metabolism → 03, mitochondria/antioxidants → 04. NutriWhite lists nothing
 * for sleep or stress, so 05 stays empty and its card says the picks come in the Layer Plan.
 * PENDIENTE (Verónica): confirm the list and the placement, and that each product is on her
 * Wholescripts (NutriWhite links these to FullScript).
 */
export const recomendaciones: Record<'01' | '02' | '03' | '04' | '05', Suplemento[]> = {
  '01': [
    { nombre: 'Vitamin C with Flavonoids', marca: 'Thorne' },
    { nombre: 'K2-D3 5000', marca: 'XYMOGEN' },
  ],
  '02': [
    { nombre: 'XymoZyme', marca: 'XYMOGEN' },
    { nombre: 'GastrAcid', marca: 'XYMOGEN' },
    { nombre: 'MotilPro', marca: 'Pure Encapsulations' },
    { nombre: 'Liver Protect', marca: 'XYMOGEN' },
  ],
  '03': [
    { nombre: 'MegaMucosa', marca: 'Microbiome Labs' },
    { nombre: 'Berbemycin', marca: 'XYMOGEN' },
    { nombre: 'G.I. Detox +', marca: 'Biocidin Botanicals' },
    { nombre: 'Candidastat', marca: 'Vitanica' },
    { nombre: 'Serrapeptase', marca: 'Protocol for Life Balance' },
    { nombre: 'MedCaps IS', marca: 'XYMOGEN' },
    { nombre: 'Berberine ES-5', marca: 'XYMOGEN' },
  ],
  '04': [
    { nombre: 'NAD+ Activate', marca: 'DaVinci Labs' },
    { nombre: 'Phyto Benefits', marca: 'DaVinci Labs' },
    { nombre: 'Berberine with MicroPQQ', marca: 'Dr. Mercola' },
    { nombre: 'L-Carnitine', marca: 'Pure Encapsulations' },
  ],
  '05': [],
};

/** The shelf's central tip — Verónica's own answer in the FAQ, read from there (one source). */
export const tipOrden =
  faq.find((f) => f.q.startsWith('¿En qué se diferencia de tomar suplementos'))?.a ?? '';
