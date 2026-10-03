/**
 * Functional lab tests offered by Veronica Wellness — the one source for /examenes/ and its checkout.
 *
 * Source: «LISTA DE PRECIOS EXAMENES VERONICA WELLNESS SEPT 2026.xlsx» (Verónica, 2026-09), kept
 * outside the repository. Only the SALE price (column E) is here; the lab cost (column D) and the
 * margin never enter the site. Descriptions are column F verbatim. Product and lab names had
 * obvious typos normalised (list in docs/EXAMENES.md); tax is added at checkout (lib/precio).
 *
 * `muestras` and `enCasa` are filled only where the description itself says how the sample is
 * taken; an empty list means the sheet does not say.
 */
import { ciclos, precioCard } from './oferta';
import { FEE_AUTORIZACION, FEE_SERVICIO, TAX_RATE, usd } from '../lib/precio';

export type Muestra = 'heces' | 'orina' | 'sangre' | 'saliva' | 'aliento' | 'hisopo' | 'ambiente';

export interface Area {
  id: string;
  nombre: string;
  /** A token from `@theme` in global.css (`--color-<name>`), used for the area's accent. */
  color: string;
  icono: string;
}

export interface Examen {
  /** Unique per card. */
  id: string;
  /**
   * What is bought, when the same test is listed under two areas (Yeast Culture, confirmed by
   * Verónica 2026-09-23 as one test). Selection and checkout use `producto ?? id`.
   */
  producto?: string;
  area: string;
  nombre: string;
  laboratorio?: string;
  /** Sale price in USD, before tax. */
  precio: number;
  muestras: Muestra[];
  enCasa: boolean;
  descripcion: string;
  /** URL of the test's collection instructions (PDF), once Verónica provides it. */
  instructivo?: string;
}

export const muestras: Record<Muestra, string> = {
  heces: 'Heces',
  orina: 'Orina',
  sangre: 'Sangre',
  saliva: 'Saliva',
  aliento: 'Aliento',
  hisopo: 'Hisopo',
  ambiente: 'Ambiente',
};

export const areas: Area[] = [
  {
    id: 'gastrointestinal',
    nombre: 'Gastrointestinal',
    color: 'sage-deep',
    icono: 'M9 3v4.5A4.5 4.5 0 0 0 13.5 12h.5a4 4 0 0 1 0 8h-3A6 6 0 0 1 5 14v-1',
  },
  {
    id: 'alimentos',
    nombre: 'Reacciones a alimentos',
    color: 'clay-deep',
    icono:
      'M12 7.5c-1.6-1.6-5.2-1.4-6.6 1.2C4 11.3 4.6 15.4 7 18.4c1.6 2 3.4 2.6 5 1.6 1.6 1 3.4.4 5-1.6 2.4-3 3-7.1 1.6-9.7-1.4-2.6-5-2.8-6.6-1.2zM12 7.5c0-2 1-3.4 3-4.5',
  },
  {
    id: 'hormonales',
    nombre: 'Hormonales',
    color: 'rose-deep',
    icono: 'M12 14a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM12 14v7M9 18h6',
  },
  {
    id: 'toxinas',
    nombre: 'Toxinas y metales pesados',
    color: 'olive',
    icono: 'M3 21V11l5 3v-3l5 3V7l8-4v18H3zM7 17h2M12 17h2M17 17h1',
  },
  {
    id: 'anti-aging',
    nombre: 'Anti-aging',
    color: 'clay-rich',
    icono:
      'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3zM18.5 15.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7.7-1.8z',
  },
  {
    id: 'salud-vaginal',
    nombre: 'Salud vaginal',
    color: 'rose',
    icono:
      'M12 21c-4 0-7-3-7-7 3 0 5.2 1.6 7 4.2 1.8-2.6 4-4.2 7-4.2 0 4-3 7-7 7zM12 18.2c-2.2-3.2-2.2-7.6 0-11.2 2.2 3.6 2.2 8 0 11.2z',
  },
  {
    id: 'moho',
    nombre: 'Moho y micotoxinas',
    color: 'sage-deep',
    icono:
      'M4 11l8-7 8 7M6 9.5V20h12V9.5M12 11.5s-2.6 2.8-2.6 4.5a2.6 2.6 0 0 0 5.2 0c0-1.7-2.6-4.5-2.6-4.5z',
  },
  {
    id: 'salud-mental',
    nombre: 'Salud mental',
    color: 'olive',
    icono: 'M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5zM16 3h3l-3 3h3',
  },
  {
    id: 'cardiovascular',
    nombre: 'Cardiovascular',
    color: 'rose-deep',
    icono:
      'M12 20s-7-4.4-9-9a4.5 4.5 0 0 1 9-3 4.5 4.5 0 0 1 9 3c-.3.7-.7 1.4-1.2 2M3 12h4l2-3 3 6 2-3h2.5',
  },
  {
    id: 'peso',
    nombre: 'Peso',
    color: 'clay',
    icono:
      'M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM8 10a4 4 0 0 1 8 0M12 10l1.6-2.2',
  },
  {
    id: 'acidos-organicos',
    nombre: 'Ácidos orgánicos',
    color: 'sage',
    icono: 'M9 3h6M10 3v5l-5 9a3 3 0 0 0 2.6 4.5h8.8A3 3 0 0 0 19 17l-5-9V3M7 14h10',
  },
];

export const areaPorId = new Map(areas.map((a) => [a.id, a]));

export const examenes: Examen[] = [
  {
    id: 'comprehensive-stool-analysis-parasitology',
    area: 'gastrointestinal',
    nombre: 'Comprehensive Stool Analysis + Parasitology',
    laboratorio: "Doctor's Data",
    precio: 449.55,
    muestras: ['heces'],
    enCasa: false,
    descripcion:
      'Análisis de heces completo: cultiva bacterias beneficiosas y disbióticas, levaduras y parásitos, y mide digestión (elastasa pancreática, fibras), inflamación (calprotectina, lactoferrina, lisozima), inmunidad intestinal (IgA secretora) y ácidos grasos de cadena corta. Incluye qué antimicrobianos farmacéuticos y naturales funcionan contra lo que se encuentre. Su precio refleja que evalúa infección, digestión e inflamación en una sola prueba. Ideal como punto de partida si tienes síntomas digestivos crónicos, piel, autoinmunidad o fatiga: en medicina funcional el intestino es la raíz de muchos desequilibrios.',
  },
  {
    id: 'gi-effects-3-days',
    area: 'gastrointestinal',
    nombre: 'GI Effects – 3 days',
    laboratorio: 'Genova',
    precio: 592.65,
    muestras: ['heces'],
    enCasa: false,
    descripcion:
      'Perfil de heces integral de Genova en tres ejes: digestión/absorción (elastasa pancreática, grasa fecal, proteína no digerida), inflamación/inmunidad (calprotectina, IgA secretora) y microbioma por PCR con índices de disbiosis. Parasitología por microscopía + PCR en 3 muestras (más probabilidad de detectar parásitos intermitentes) y sensibilidades farmacéuticas y botánicas. Es el más costoso del grupo por combinar varias tecnologías y la recolección de 3 días. Recomendado si ya probaste tratamientos sin éxito o hay alta sospecha de parásitos.',
  },
  {
    id: 'sibo-en-aliento-3h',
    area: 'gastrointestinal',
    nombre: 'SIBO en aliento 3H',
    laboratorio: 'Genova',
    precio: 303.75,
    muestras: ['aliento'],
    enCasa: true,
    descripcion:
      'Prueba de aliento en casa: mides hidrógeno y metano durante 3 horas tras tomar una solución de azúcar, para detectar sobrecrecimiento bacteriano en el intestino delgado (SIBO) o de arqueas productoras de metano (IMO). La versión de 3 horas cubre mejor a quienes tienen tránsito lento. Útil si te hinchas poco después de comer, tienes gases, diarrea o estreñimiento, o si los probióticos y la fibra te empeoran los síntomas.',
  },
  {
    id: 'microbiology-profile',
    area: 'gastrointestinal',
    nombre: 'Microbiology Profile',
    laboratorio: "Doctor's Data",
    precio: 151.2,
    muestras: ['heces'],
    enCasa: false,
    descripcion:
      'Versión enfocada del análisis de heces: cultivo de bacterias beneficiosas, desequilibradas y patógenas y de levaduras, con pruebas de sensibilidad a agentes farmacéuticos y naturales. No incluye parasitología ni marcadores de digestión o inflamación, por eso es más económico. Útil para control después de un tratamiento o cuando la sospecha principal es disbiosis.',
  },
  {
    id: 'h-pylori',
    area: 'gastrointestinal',
    nombre: 'H. pylori',
    laboratorio: "Doctor's Data",
    precio: 147.15,
    muestras: [],
    enCasa: false,
    descripcion:
      'Detecta Helicobacter pylori, bacteria del estómago asociada a gastritis, úlceras, reflujo y baja producción de ácido gástrico (lo que dificulta absorber hierro, B12 y proteínas). Es económico porque mide un solo marcador. Útil si tienes acidez, ardor, náuseas, llenura rápida o anemia sin causa clara.',
  },
  {
    id: 'culture-pcr-parasitology-cpp',
    area: 'gastrointestinal',
    nombre: 'Culture, PCR, Parasitology (CPP)',
    laboratorio: "Doctor's Data",
    precio: 253.8,
    muestras: ['heces'],
    enCasa: false,
    descripcion:
      'Cultivo de bacterias y levaduras + detección por PCR de patógenos (bacterias, virus y parásitos) + parasitología por microscopía, con sensibilidades a agentes farmacéuticos y naturales. Se enfoca en infección y disbiosis, sin los marcadores de digestión e inflamación del análisis completo, por eso cuesta menos. Ideal si sospechas parásitos o una infección intestinal (viajes, agua no tratada, mascotas, diarrea recurrente).',
  },
  {
    id: 'yeast-culture-sensitivities',
    area: 'gastrointestinal',
    nombre: 'Yeast Culture & Sensitivities',
    laboratorio: "Doctor's Data",
    precio: 94.5,
    muestras: ['heces'],
    enCasa: false,
    descripcion:
      'Cultivo de hongos y levaduras en heces (como Candida), identificando la especie y qué antifúngicos naturales y farmacéuticos funcionan contra ella. Es la opción más económica por ser un solo análisis. Útil ante antojos de azúcar, hinchazón, uso reciente de antibióticos o candidiasis recurrente, para tratar con el agente correcto en lugar de probar a ciegas.',
  },
  {
    id: 'gi-advanced-profile-includes-zonulin-and-h-pylori',
    area: 'gastrointestinal',
    nombre: 'GI-Advanced Profile (includes Zonulin and H. pylori)',
    laboratorio: 'US BioTek',
    precio: 525.15,
    muestras: ['heces'],
    enCasa: false,
    descripcion:
      'Perfil de heces de US BioTek con 98 marcadores: microbioma por PCR (incluye Akkermansia y Bifidobacterium), patógenos bacterianos, virales y parasitarios, Candida, cultivo bacteriano, ácidos grasos como el butirato, calprotectina (inflamación), beta-glucuronidasa (relacionada con el reciclaje de estrógenos), zonulina (permeabilidad intestinal o "intestino permeable") y H. pylori. Su precio incluye zonulina y H. pylori, que en otros laboratorios se cobran aparte. Útil en autoinmunidad, alergias, desbalance hormonal o inflamación sistémica.',
  },
  {
    id: 'candida-albicans-en-sangre',
    area: 'gastrointestinal',
    nombre: 'Candida albicans en sangre',
    laboratorio: 'Alletess',
    precio: 168.75,
    muestras: ['sangre'],
    enCasa: false,
    descripcion:
      'Análisis de sangre que mide anticuerpos IgG, IgA e IgM contra Candida albicans: muestra cómo está respondiendo tu sistema inmune a la cándida (IgM sugiere algo reciente, IgG algo prolongado, IgA afecta mucosas). Complementa las pruebas de heces cuando se sospecha un sobrecrecimiento crónico. Útil en fatiga, niebla mental, antojos de azúcar o infecciones vaginales u orales recurrentes.',
  },
  {
    id: 'dutch-plus-hormonas-sexuales-adrenal',
    area: 'hormonales',
    nombre: 'DUTCH Plus (hormonas sexuales, adrenal)',
    laboratorio: 'DUTCH',
    precio: 540.0,
    muestras: ['orina', 'saliva'],
    enCasa: true,
    descripcion:
      'La prueba hormonal más completa, en orina seca y saliva desde casa. Mide estrógenos, progesterona, testosterona, DHEA y cortisol junto con sus metabolitos (35 analitos), el ritmo del cortisol durante el día, melatonina y ácidos orgánicos (B12, B6, glutatión, dopamina, noradrenalina, daño oxidativo). Además agrega la respuesta del cortisol al despertar (CAR). Muestra no solo cuánta hormona produces, sino cómo la procesas (vías de estrógeno y metilación). Ideal si tienes fatiga al despertar, insomnio, ansiedad, burnout, SPM o estás en perimenopausia.',
  },
  {
    id: 'dutch-solo-hormonas',
    area: 'hormonales',
    nombre: 'DUTCH solo hormonas',
    laboratorio: 'DUTCH',
    precio: 243.0,
    muestras: ['orina'],
    enCasa: false,
    descripcion:
      'Solo el panel de hormonas sexuales en orina seca: estrógenos y sus vías de metabolismo (incluida la metilación), progesterona y andrógenos como la testosterona. No incluye el panel adrenal ni los ácidos orgánicos, por eso cuesta menos de la mitad del DUTCH Plus. Útil en SPM, ciclos irregulares, endometriosis, SOP, acné hormonal, sospecha de dominancia estrogénica o para monitorear terapia hormonal.',
  },
  {
    id: 'dutch-adrenal-only',
    area: 'hormonales',
    nombre: 'DUTCH adrenal only',
    laboratorio: 'DUTCH',
    precio: 243.0,
    muestras: [],
    enCasa: false,
    descripcion:
      'Solo el panel adrenal: cortisol y cortisona libres en varios momentos del día (tu ritmo diario), producción total de cortisol y DHEA. Muestra si tu eje del estrés está elevado, agotado o desordenado. Útil si te sientes "cansada pero acelerada", con estrés crónico, insomnio, bajones de energía por la tarde o antojos.',
  },
  {
    id: 'comprehensive-hormone-plus-profile',
    area: 'hormonales',
    nombre: 'Comprehensive Hormone Plus Profile',
    laboratorio: "Doctor's Data",
    precio: 298.35,
    muestras: ['saliva'],
    enCasa: false,
    descripcion:
      'Perfil hormonal en saliva (mide la fracción libre, la que tu cuerpo usa): estrona, estradiol, estriol, progesterona, testosterona, DHEA y cortisol 4 veces al día, más el índice de estrógenos. Más económico que el DUTCH y sin metabolitos. Ideal para revisar el balance progesterona/estrógeno y el ritmo del cortisol, o para monitorear terapia hormonal en crema.',
  },
  {
    id: 'celiac-and-gluten-sensitivity-blood-spot',
    area: 'alimentos',
    nombre: 'Celiac and Gluten Sensitivity (blood spot)',
    laboratorio: "Doctor's Data",
    precio: 120.15,
    muestras: ['sangre'],
    enCasa: false,
    descripcion:
      'Pinchazo en el dedo: anticuerpos IgA e IgG contra transglutaminasa tisular (tTG), gliadina deaminada (DGP) y gliadina, para detectar enfermedad celíaca y orientar sensibilidad al gluten no celíaca. Es económico porque es un panel específico. Importante: debes estar comiendo gluten al hacerla. Útil si tienes hinchazón, anemia, tiroiditis u otra autoinmunidad, o deficiencias de nutrientes sin explicación.',
  },
  {
    id: '198-vegetarian-food-panel-iga-igg-igg4',
    area: 'alimentos',
    nombre: '198 Vegetarian Food Panel: IgA/IgG/IgG4',
    laboratorio: 'US BioTek',
    precio: 538.65,
    muestras: [],
    enCasa: false,
    descripcion:
      'Sensibilidad a 198 alimentos de origen vegetal más lácteos y huevo (no incluye carnes ni pescados), incluidas especias. Mide tres anticuerpos: IgA (mucosa intestinal), IgG e IgG4 (reacciones retardadas que aparecen horas o días después). Ideal si eres vegetariana o comes mayormente plantas. El precio refleja la cantidad de alimentos y los 3 anticuerpos. No diagnostica alergias: orienta una dieta de eliminación y reintroducción guiada.',
  },
  {
    id: '96-vegetarian-food-panel-iga-igg-igg4',
    area: 'alimentos',
    nombre: '96 Vegetarian Food Panel: IgA/IgG/IgG4',
    laboratorio: 'US BioTek',
    precio: 444.15,
    muestras: [],
    enCasa: false,
    descripcion:
      'Versión reducida del panel vegetariano: 96 alimentos vegetarianos comunes con IgA, IgG e IgG4. Más económico que el de 198 al evaluar menos alimentos. Buena opción vegetariana si tu dieta es poco variada. No diagnostica alergias: orienta una dieta de eliminación y reintroducción guiada.',
  },
  {
    id: '240-food-panel-iga-igg-igg4',
    area: 'alimentos',
    nombre: '240 Food Panel: IgA/IgG/IgG4',
    laboratorio: 'US BioTek',
    precio: 700.65,
    muestras: [],
    enCasa: false,
    descripcion:
      'El panel de alimentos más amplio: 240 alimentos (lácteos, huevos, legumbres, frutos secos y semillas, granos, frutas, verduras, especias y proteínas animales) con tres anticuerpos: IgA, IgG e IgG4. Es el más costoso por su cobertura. Ideal si comes muy variado y tienes síntomas persistentes (colon irritable, migrañas, eccema, dolor articular) o si un panel pequeño no fue concluyente. No diagnostica alergias: orienta una dieta de eliminación.',
  },
  {
    id: '96-igg-food-sensitivity-panel',
    area: 'alimentos',
    nombre: '96 IgG Food Sensitivity Panel',
    laboratorio: 'Alletess',
    precio: 174.15,
    muestras: [],
    enCasa: false,
    descripcion:
      'Sensibilidad IgG a 96 alimentos de consumo frecuente (lácteos, trigo, huevo, soya, carnes, frutas y verduras). Es la opción de entrada más económica: un solo anticuerpo y menos alimentos. Útil como primer paso si sospechas que algún alimento te inflama o hincha. No diagnostica alergias: orienta una dieta de eliminación.',
  },
  {
    id: '184-igg-food-sensitivity-panel',
    area: 'alimentos',
    nombre: '184 IgG Food Sensitivity Panel',
    laboratorio: 'Alletess',
    precio: 321.3,
    muestras: [],
    enCasa: false,
    descripcion:
      'Sensibilidad IgG a 184 alimentos, incluyendo pescados, mariscos, carnes, granos, frutas, verduras y especias. Casi el doble de alimentos que el de 96, por eso cuesta más. Recomendado si tu dieta es variada o si el panel de 96 no explicó tus síntomas. No diagnostica alergias: orienta una dieta de eliminación.',
  },
  {
    id: '96-igg-food-gluten-related-disorders-panel',
    area: 'alimentos',
    nombre: '96 IgG Food + Gluten-Related Disorders Panel',
    laboratorio: 'Alletess',
    precio: 364.5,
    muestras: [],
    enCasa: false,
    descripcion:
      'Combina el panel IgG de 96 alimentos con un panel celíaco (tTG, DGP y gliadina IgA/IgG) y alergia IgE al trigo y al gluten. En una sola muestra diferencia enfermedad celíaca, alergia al trigo y sensibilidad al gluten. Útil si sospechas que el gluten te afecta pero no sabes de qué manera, o si tienes autoinmunidad (en especial tiroidea).',
  },
  {
    id: '184-igg-food-gluten-related-disorders-panel',
    area: 'alimentos',
    nombre: '184 IgG Food + Gluten-Related Disorders Panel',
    laboratorio: 'Alletess',
    precio: 488.7,
    muestras: [],
    enCasa: false,
    descripcion:
      'Igual que el anterior pero con 184 alimentos IgG: panel celíaco completo (tTG, DGP, gliadina IgA/IgG) + IgE a trigo y gluten. La opción más completa para evaluar gluten y alimentación en una sola prueba.',
  },
  {
    id: '184-igg-food-sensitivity-25-comprehensive-ige-combo-panel',
    area: 'alimentos',
    nombre: '184 IgG Food Sensitivity & 25 Comprehensive IgE Combo Panel',
    laboratorio: 'Alletess',
    precio: 531.9,
    muestras: [],
    enCasa: false,
    descripcion:
      'Combina sensibilidades (IgG a 184 alimentos, reacción retardada de horas a días) con alergias verdaderas (IgE a 25 alimentos, reacción inmediata). Útil si además de síntomas digestivos tienes urticaria, picazón, congestión o hinchazón de labios después de comer.',
  },
  {
    id: '184-igg-food-sensitivity-50-expanded-ige-combo-panel',
    area: 'alimentos',
    nombre: '184 IgG Food Sensitivity & 50 Expanded IgE Combo Panel',
    laboratorio: 'Alletess',
    precio: 796.5,
    muestras: [],
    enCasa: false,
    descripcion:
      'Igual que el anterior, pero con IgE ampliado a 50 alimentos. La opción más completa para diferenciar sensibilidad de alergia verdadera. Recomendado en historial de alergias múltiples, asma o dermatitis atópica.',
  },
  {
    id: '205-igg-food-sensitivity-25-comprehensive-ige-combo-panel',
    area: 'alimentos',
    nombre: '205 IgG Food Sensitivity & 25 Comprehensive IgE Combo Panel',
    precio: 588.6,
    muestras: [],
    enCasa: false,
    descripcion:
      'Versión ampliada con sensibilidad IgG a ~205 alimentos + alergia IgE a 25 alimentos. Para dietas muy variadas o casos donde paneles más pequeños no fueron concluyentes.',
  },
  {
    id: '205-igg-food-sensitivity-50-expanded-ige-combo-panel',
    area: 'alimentos',
    nombre: '205 IgG Food Sensitivity & 50 Expanded IgE Combo Panel',
    precio: 858.6,
    muestras: [],
    enCasa: false,
    descripcion:
      'La combinación más amplia: sensibilidad IgG a ~205 alimentos + alergia IgE a 50 alimentos. Para dietas muy variadas con historial de alergias.',
  },
  {
    id: 'cardiometabolic-profile',
    area: 'cardiovascular',
    nombre: 'Cardiometabolic Profile',
    laboratorio: "Doctor's Data",
    precio: 299.7,
    muestras: ['sangre'],
    enCasa: false,
    descripcion:
      'Pinchazo en el dedo en ayunas: marcadores de riesgo cardiometabólico como perfil de lípidos, control de azúcar (insulina, HbA1c) e inflamación (PCR ultrasensible). Desde la medicina funcional, permite ver resistencia a la insulina e inflamación años antes de que la glucosa suba. Útil si tienes grasa abdominal, antojos, cansancio después de comer, SOP o antecedentes familiares de diabetes o enfermedad cardíaca.',
  },
  {
    id: 'vaginosis-profile',
    area: 'salud-vaginal',
    nombre: 'Vaginosis Profile',
    laboratorio: "Doctor's Data",
    precio: 153.9,
    muestras: ['hisopo'],
    enCasa: false,
    descripcion:
      'Hisopo vaginal que diferencia vaginosis bacteriana de candidiasis: evalúa lactobacilos (flora protectora), puntaje de Nugent, células clave, leucocitos y cultivo de bacterias y levaduras, con sensibilidad a agentes farmacéuticos y naturales. Ideal si tienes flujo, olor o picazón recurrentes y los tratamientos habituales no han funcionado.',
  },
  {
    id: 'yeast-culture-sensitivities-salud-vaginal',
    producto: 'yeast-culture-sensitivities',
    area: 'salud-vaginal',
    nombre: 'Yeast Culture & Sensitivities',
    laboratorio: "Doctor's Data",
    precio: 94.5,
    muestras: [],
    enCasa: false,
    descripcion:
      'Cultivo de levaduras (como Candida) con identificación de especie y sensibilidad a antifúngicos naturales y farmacéuticos. Útil en candidiasis recurrente para usar el agente correcto. Si ya eliges el Vaginosis Profile, este ya incluye cultivo de levaduras.',
  },
  {
    id: 'comprehensive-neurotransmitter-profile',
    area: 'salud-mental',
    nombre: 'Comprehensive Neurotransmitter Profile',
    laboratorio: "Doctor's Data",
    precio: 373.95,
    muestras: ['orina'],
    enCasa: false,
    descripcion:
      'Prueba de orina que mide neurotransmisores (serotonina, dopamina, GABA, glutamato, noradrenalina, adrenalina, histamina, glicina, PEA) y sus metabolitos, lo que muestra cómo trabajan enzimas clave (MAO y COMT). Ayuda a orientar el uso de aminoácidos y cofactores nutricionales. Útil en ansiedad, ánimo bajo, insomnio, falta de concentración o antojos. Refleja niveles del cuerpo, no una medición directa del cerebro.',
  },
  {
    id: 'mold-mycotoxin-building',
    area: 'moho',
    nombre: 'Mold & Mycotoxin Building',
    laboratorio: 'US BioTek',
    precio: 403.65,
    muestras: ['ambiente'],
    enCasa: true,
    descripcion:
      'No es una muestra del cuerpo: se toma con un hisopo de polvo de tu casa u oficina y detecta 12 mohos tóxicos y 16 micotoxinas en el ambiente. Identifica la fuente de exposición, porque sin eliminarla el tratamiento no avanza. Útil si hay humedad, filtraciones o síntomas que mejoran al salir de casa.',
  },
  {
    id: 'mycotoxins-panel',
    area: 'moho',
    nombre: 'Mycotoxins Panel',
    precio: 403.65,
    muestras: ['orina'],
    enCasa: false,
    descripcion:
      'Prueba de orina que detecta 16 micotoxinas (como aflatoxinas, ocratoxina A, gliotoxina y tricotecenos del moho negro) que tu cuerpo está eliminando: muestra tu carga interna. Combinada con la prueba del edificio da el cuadro completo (cuerpo + fuente). Útil en fatiga crónica, niebla mental, síntomas respiratorios, sensibilidad química o inflamación sin causa clara.',
  },
  {
    id: 'expanded-mold-immunoreactivity-panel',
    area: 'moho',
    nombre: 'Expanded Mold Immunoreactivity Panel',
    laboratorio: 'Alletess',
    precio: 410.4,
    muestras: ['sangre'],
    enCasa: false,
    descripcion:
      'Análisis de sangre que mide la respuesta inmune (IgE, IgA e IgG) a mohos ambientales comunes, incluido Stachybotrys (moho negro). Muestra si tu sistema inmune está reaccionando al moho (alergia o sensibilidad), algo distinto a la carga de toxinas en orina. Incluye un plan de reducción de exposición. Útil en rinitis, asma, sinusitis o síntomas que empeoran en ambientes húmedos.',
  },
  {
    id: 'dna-oxidative-damage',
    area: 'anti-aging',
    nombre: 'DNA Oxidative Damage',
    laboratorio: "Doctor's Data",
    precio: 156.6,
    muestras: ['orina'],
    enCasa: false,
    descripcion:
      'Prueba de orina que mide 8-OHdG, marcador de daño oxidativo al ADN: cuánto estrés oxidativo está enfrentando tu cuerpo, un motor del envejecimiento y la inflamación crónica. Es económica por ser un solo marcador. Útil como línea base en un plan de longevidad y para comprobar si la alimentación, los antioxidantes y el estilo de vida están funcionando.',
  },
  {
    id: 'findwhy-weight-control-profile',
    area: 'peso',
    nombre: 'FindWhy Weight Control Profile',
    laboratorio: "Doctor's Data",
    precio: 225.45,
    muestras: ['hisopo'],
    enCasa: false,
    descripcion:
      'Prueba genética con hisopo bucal que analiza 5 genes asociados al peso (FTO, MC4R, ADRB2, FABP2, SH2B1): apetito y saciedad, absorción de grasas y respuesta al ejercicio. Se hace una sola vez en la vida porque tus genes no cambian. Muestra predisposiciones, no un destino: ayuda a personalizar tu plan de alimentación y ejercicio. Útil si te cuesta bajar de peso a pesar de hacer "todo bien".',
  },
  {
    id: 'metales-pesados-minerales',
    area: 'toxinas',
    nombre: 'Metales pesados + minerales',
    laboratorio: "Doctor's Data",
    precio: 168.75,
    muestras: [],
    enCasa: false,
    descripcion:
      'Evalúa metales tóxicos (como plomo, mercurio, arsénico, cadmio y aluminio) junto con minerales esenciales (como magnesio, zinc y selenio). Los metales desplazan minerales y afectan tiroides, energía, sistema nervioso y hormonas. Útil si consumes mucho pescado, tienes amalgamas dentales, exposición laboral, fatiga, niebla mental o problemas de tiroides.',
  },
  {
    id: 'hepatic-detox-profile',
    area: 'toxinas',
    nombre: 'Hepatic Detox Profile',
    laboratorio: "Doctor's Data",
    precio: 178.2,
    muestras: ['orina'],
    enCasa: false,
    descripcion:
      'Prueba de orina (primera de la mañana) con dos marcadores de la desintoxicación del hígado: ácido D-glucárico (fase I, refleja exposición a más de 200 químicos) y ácidos mercaptúricos (fase II, uso de glutatión). Muestra qué tan expuesta estás a tóxicos y qué tan bien los elimina tu hígado. Económica por ser un panel específico. Útil en sensibilidad a olores o químicos, intolerancia a alcohol o café, o antes de un protocolo de detox.',
  },
  {
    id: 'all-tox',
    area: 'toxinas',
    nombre: 'All Tox',
    laboratorio: 'US BioTek',
    precio: 552.15,
    muestras: [],
    enCasa: false,
    descripcion:
      'El panel de toxinas más completo: más de 100 marcadores que combinan micotoxinas, contaminantes ambientales y metales pesados (incluye PFAS, BPA, plomo, litio y glifosato). Es el más costoso por reunir varios paneles en uno. Ideal para evaluar tu carga tóxica total en fatiga crónica, autoinmunidad, desbalance hormonal, infertilidad o síntomas neurológicos.',
  },
  {
    id: 'organic-acids',
    area: 'acidos-organicos',
    nombre: 'Organic Acids',
    precio: 252.45,
    muestras: ['orina'],
    enCasa: false,
    descripcion:
      'Prueba de orina que mide productos del metabolismo: energía celular (mitocondria), vitaminas del complejo B, neurotransmisores, capacidad de desintoxicación (glutatión), oxalatos y marcadores de levaduras y bacterias intestinales. Da una foto amplia del metabolismo en una sola muestra. Útil en fatiga, ánimo bajo, problemas digestivos o cuando se buscan deficiencias nutricionales funcionales.',
  },
];

export const examenPorId = new Map(examenes.map((e) => [e.id, e]));

/** The purchasable id of a card. */
export function productoDe(e: Examen): string {
  return e.producto ?? e.id;
}

/**
 * What happens after paying, shown on /examenes/ and on the order confirmation. Adapted from
 * the process on nutriwhitesalud.com/exam (Mari, 2026-09-23); the results window and the
 * delivery channel are to be confirmed with Verónica (docs/EXAMENES.md).
 */
export const pasosPedido = [
  {
    titulo: 'Elige y paga',
    texto: 'Arma tu selección, completa tus datos y la dirección de envío, y paga de forma segura.',
  },
  {
    titulo: 'Recibe tu kit',
    texto: 'Te llega a la dirección que indicaste, con las instrucciones de tu examen.',
  },
  {
    titulo: 'Toma y envía tu muestra',
    texto:
      'Cada examen tiene su propia forma de tomar la muestra: sigue su instructivo y envíala al laboratorio.',
  },
  {
    titulo: 'Recibe tus resultados',
    texto:
      'Entre 15 y 25 días hábiles desde que tu muestra llega al laboratorio, por email. Si agregaste tu cita de lectura, los revisamos juntas.',
  },
];

export function examenesDeArea(areaId: string): Examen[] {
  return examenes.filter((e) => e.area === areaId);
}

/** localStorage key for the visitor's selection (ids), shared by /examenes/ and its checkout. */
export const CLAVE_SELECCION = 'vw-examenes-seleccion';

/**
 * FAQ of /examenes/ — adapted from nutriwhitesalud.com/politicas/examenes (read 2026-09-24) at
 * Mari's request («la logística es tal como ellos lo tienen»): the same windows, rules and fees,
 * with «Embajador NutriWhite» turned into the advisory with Verónica. Wording by Codex (2026-09-24);
 * the first question and the three about the reading appointment and the lab fees follow
 * Verónica's notes of 2026-10-02. Prices, fees and tax are read from data/oferta and lib/precio.
 * PENDIENTE (Verónica): confirm each figure for her own logistics (days, the $30 kit fee, the 20%
 * refund deduction, the international fee).
 */
export const preguntasExamenes = [
  {
    q: '¿Necesito hacerme exámenes para empezar mi asesoría?',
    a: 'No. Los exámenes no son obligatorios para tus asesorías. Si no sabes cuál elegir o priorizar, no te preocupes: identificar si necesitas estudios, y su prioridad, forma parte de tu asesoría.',
  },
  {
    q: '¿Cuándo recibiré mis resultados?',
    a: 'Los resultados tardan entre 15 y 25 días hábiles desde que tu muestra llega al laboratorio. Si contamos también el envío del kit y el de tu muestra, el proceso completo suele tomar de 4 a 6 semanas.',
  },
  {
    q: '¿Qué plazo tengo para enviar mi muestra?',
    a: 'Tienes hasta 30 días continuos desde la compra. Después de ese plazo, el examen se considera consumido y no tiene devolución. Si el examen depende de tu ciclo menstrual, tienes hasta dos ciclos: el que está en curso cuando compras y el siguiente.',
  },
  {
    q: '¿Cuándo se envía mi kit?',
    a: 'Enviamos tu kit en cuanto se verifica tu pago. Lo recibirás en la dirección que indicaste, con las instrucciones para tomar tu muestra y enviarla al laboratorio.',
  },
  {
    q: '¿El precio incluye la interpretación de mis resultados?',
    a: `No. Antes de pagar puedes agregar una cita para la lectura de tu examen: 1 cita (${precioCard(ciclos.LAYER_SESSION)}), con lectura de exámenes y plan de acción, o 2 citas (${precioCard(ciclos.INITIAL_LAYER_CYCLE)}), para asegurar el seguimiento de los pasos del plan de acción en base a tus resultados.`,
  },
  {
    q: '¿Cuántos exámenes se leen en cada cita?',
    a: 'Se lee 1 examen por cita. Además de leer tu examen, escuchamos tu historia y analizamos tus formularios para crear un plan de acción integral.',
  },
  {
    q: '¿Hay cargos adicionales además del precio del examen?',
    a: `Sí. Cada examen lleva dos cargos del laboratorio que se suman al finalizar la compra: service fee (${usd(FEE_SERVICIO)}) y authorization network (${usd(FEE_AUTORIZACION)}). Al pedido se le agrega además el impuesto del ${Math.round(TAX_RATE * 100)} %.`,
  },
  {
    q: '¿Puedo pedir exámenes desde fuera de Estados Unidos?',
    a: 'Sí. Dentro de Estados Unidos, la logística está incluida en tu pago. Si vives fuera, puedes acceder a la red de logística internacional pagando previamente la tarifa de envío correspondiente. Si vives en el estado de Nueva York, avísanos al comprar para verificar qué laboratorios pueden atenderte.',
  },
  {
    q: '¿Qué debo hacer si tomo antibióticos o probióticos?',
    a: 'Avísanos antes de tomar la muestra para que te indiquemos el día adecuado. Los antibióticos, los probióticos y otros medicamentos que alteran la microbiota pueden modificar los resultados.',
  },
  {
    q: '¿Necesito una orden médica para tomar la muestra?',
    a: 'Solo las muestras de sangre venosa requieren una orden de tu médico. El costo de la extracción no está incluido en el precio del examen. Las demás muestras —heces, orina, saliva, aliento y sangre capilar por pinchazo— las tomas tú en casa.',
  },
  {
    q: '¿Cómo debo llenar el formulario del kit?',
    a: 'Escribe tu nombre y apellido exactamente como nos los diste. Si usas apodos o iniciales, la muestra se cancela. Marca solo los exámenes que compraste: el laboratorio cobra cualquier prueba adicional que marques por error.',
  },
  {
    q: '¿Qué pasa si mi kit se daña o se pierde?',
    a: 'Podemos enviarte un kit nuevo con un recargo administrativo de $30 USD.',
  },
  {
    q: '¿En qué casos puedo pedir un reembolso?',
    a: 'Puedes solicitarlo solo por motivos de fuerza mayor justificados y siempre que tu muestra no se haya enviado al laboratorio. Del reembolso se descuenta un 20% por gastos administrativos. Si la muestra ya llegó al laboratorio y no pudo analizarse por causas ajenas a nosotros, se devuelve el importe descontando ese 20%, el envío y los gastos operativos que correspondan.',
  },
  {
    q: '¿Gestionan trámites con mi seguro médico?',
    a: 'No gestionamos trámites con seguros médicos. Solo te entregamos los resultados a ti, a menos que autorices por correo electrónico su entrega a otra persona.',
  },
];
