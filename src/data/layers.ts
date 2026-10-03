/**
 * The five Layers of The Layer Method — the one source for every page that lists them
 * (home, The Method, 1:1). Text is Verónica's, taken verbatim from Mari's pages.
 *
 * `color` names a token from `@theme` in global.css (`--color-<name>`); `oscuro` marks the
 * slabs whose fill is dark enough to need light text on top.
 */
export type LayerColor = 'clay' | 'sage' | 'sage-deep' | 'rose' | 'olive' | 'charcoal';

export interface Layer {
  num: '01' | '02' | '03' | '04' | '05';
  nombre: string;
  /** The question this Layer asks (editorial pages). */
  pregunta: string;
  /** What this Layer observes, as one sentence (editorial home legend). */
  observaTexto: string;
  /** The same list, item by item (The Method cards). */
  observa: string[];
  /** Verónica's one-line quote for the Layer. */
  cita: string;
  /** Layers it connects with (The Method cards). */
  conecta: string[];
  /** One-word role used as a badge on the home page. */
  rol: string;
  color: LayerColor;
  oscuro: boolean;
}

export const layers: Layer[] = [
  {
    num: '01',
    nombre: 'Nutrición',
    pregunta:
      '¿Tiene el cuerpo las materias primas y la energía que necesita para funcionar, reparar y adaptarse?',
    observaTexto:
      'Proteínas, carbohidratos, grasas, fibra, vitaminas, minerales, antioxidantes e hidratación.',
    observa: [
      'Proteínas',
      'Carbohidratos',
      'Grasas',
      'Fibra',
      'Vitaminas y minerales',
      'Antioxidantes',
      'Hidratación',
    ],
    cita: 'Materias primas: lo que el cuerpo necesita para funcionar, reparar y adaptarse.',
    conecta: ['Vías de Eliminación', 'Célula'],
    rol: 'Cimiento',
    color: 'charcoal',
    oscuro: true,
  },
  {
    num: '02',
    nombre: 'Vías de Eliminación',
    pregunta:
      '¿Las principales vías de procesamiento y eliminación están funcionando y siendo apoyadas de forma adecuada?',
    observaTexto:
      'Digestión, tránsito intestinal, hígado, riñones, sistema linfático, flujo biliar, hidratación y movimiento.',
    observa: [
      'Digestión',
      'Tránsito intestinal',
      'Hígado',
      'Riñones',
      'Sistema linfático',
      'Flujo biliar',
      'Hidratación y movimiento',
    ],
    cita: 'Antes de hablar de detox profundo, quiero saber cómo eliminas.',
    conecta: ['Terreno', 'Nutrición', 'Célula'],
    rol: 'Drenaje',
    color: 'clay',
    oscuro: false,
  },
  {
    num: '03',
    nombre: 'Terreno',
    pregunta: '¿En qué entorno interno está intentando funcionar y adaptarse el cuerpo?',
    observaTexto:
      'Microbiota, barrera intestinal, hormonas sexuales, cortisol, sistema nervioso, tiroides, inflamación, sistema inmune y metabolismo.',
    observa: [
      'Microbiota',
      'Barrera intestinal',
      'Hormonas sexuales',
      'Cortisol',
      'Sistema nervioso',
      'Tiroides',
      'Inflamación',
      'Sistema inmune',
      'Metabolismo',
    ],
    cita: 'Tus células no existen aisladas del entorno en el que funcionan.',
    conecta: ['Vías de Eliminación', 'Nutrición', 'Hábitos'],
    rol: 'Microambiente',
    color: 'sage-deep',
    oscuro: false,
  },
  {
    num: '04',
    nombre: 'Célula',
    pregunta:
      '¿Qué necesita el entorno celular y mitocondrial para producir energía, recuperarse y sostener resiliencia a largo plazo?',
    observaTexto:
      'Estrés oxidativo, nutrición celular, energía, mitocondria, recuperación, antioxidantes, healthy aging y longevidad.',
    observa: [
      'Estrés oxidativo',
      'Nutrición celular',
      'Energía',
      'Mitocondria',
      'Recuperación',
      'Antioxidantes',
      'Healthy aging',
      'Longevidad',
    ],
    cita: 'La salud celular empieza mucho antes de llegar a la célula.',
    conecta: ['Nutrición', 'Vías de Eliminación', 'Hábitos'],
    rol: 'Energía',
    color: 'rose',
    oscuro: false,
  },
  {
    num: '05',
    nombre: 'Hábitos',
    pregunta:
      '¿Tus hábitos diarios están apoyando —o interfiriendo con— las demás Layers y con tu capacidad de sostener cambios?',
    observaTexto:
      'Estilo de vida, ayuno cuando aplica, descanso y sueño, movimiento, luz, emociones, estrés y rutinas.',
    observa: [
      'Estilo de vida',
      'Ayuno (cuando aplica)',
      'Descanso y sueño',
      'Movimiento',
      'Luz',
      'Emociones',
      'Estrés',
      'Rutinas',
    ],
    cita: 'Lo que se repite todos los días termina siendo la estrategia.',
    conecta: ['Terreno', 'Célula'],
    rol: 'Regulador',
    color: 'olive',
    oscuro: true,
  },
];
