/** Popup copy for each test (Codex, 2026-10-03), built only from each test's `descripcion` in examenes.ts. */
export interface Ficha {
  gancho: string;
  queMide: string[];
  porQueImporta: string;
  ideal: string[];
  obtienes: string[];
}

export const fichas: Record<string, Ficha> = {
  'comprehensive-stool-analysis-parasitology': {
    gancho: 'Descubre qué ocurre en tu intestino con una mirada que conecta varios desequilibrios.',
    queMide: [
      'Bacterias beneficiosas y disbióticas, levaduras y parásitos',
      'Digestión: elastasa pancreática y fibras',
      'Inflamación: calprotectina, lactoferrina y lisozima',
      'Inmunidad intestinal: IgA secretora',
      'Ácidos grasos de cadena corta',
      'Sensibilidad a antimicrobianos farmacéuticos y naturales',
    ],
    porQueImporta:
      'Reúne infección, digestión e inflamación en una sola prueba para darte un punto de partida amplio. Las sensibilidades a antimicrobianos añaden información concreta para orientar los siguientes pasos según lo encontrado.',
    ideal: [
      'Ideal si tienes síntomas digestivos crónicos.',
      'Ideal si buscas explorar el intestino ante problemas de piel.',
      'Ideal si tienes autoinmunidad.',
      'Ideal si tienes fatiga.',
    ],
    obtienes: [
      'Resultados del cultivo y de los marcadores digestivos, inflamatorios e inmunitarios.',
      'Información sobre qué antimicrobianos farmacéuticos y naturales funcionan contra lo encontrado.',
      'Una visión conjunta de infección, digestión e inflamación intestinal.',
    ],
  },
  'gi-effects-3-days': {
    gancho: 'Profundiza en tu salud intestinal con varias tecnologías y tres días de muestras.',
    queMide: [
      'Digestión y absorción: elastasa pancreática, grasa fecal y proteína no digerida',
      'Inflamación e inmunidad: calprotectina e IgA secretora',
      'Microbioma por PCR e índices de disbiosis',
      'Parásitos por microscopía y PCR en 3 muestras',
      'Sensibilidades farmacéuticas y botánicas',
    ],
    porQueImporta:
      'Combina varias tecnologías para explorar digestión, inflamación y microbioma en un mismo perfil. Las 3 muestras aumentan la probabilidad de encontrar parásitos intermitentes y aportan profundidad cuando los intentos previos no han dado resultado.',
    ideal: [
      'Ideal si ya probaste tratamientos sin éxito.',
      'Ideal si hay alta sospecha de parásitos.',
      'Ideal si buscas explorar digestión, inflamación y microbioma en conjunto.',
    ],
    obtienes: [
      'Resultados de los tres ejes: digestión y absorción, inflamación e inmunidad, y microbioma.',
      'Evaluación parasitológica de 3 muestras mediante microscopía y PCR.',
      'Información de sensibilidades farmacéuticas y botánicas.',
    ],
  },
  'sibo-en-aliento-3h': {
    gancho: 'Dale contexto a tu hinchazón con tres horas de información desde casa.',
    queMide: [
      'Hidrógeno en el aliento',
      'Metano en el aliento',
      'Variación de ambos gases durante 3 horas tras tomar una solución de azúcar',
    ],
    porQueImporta:
      'El hidrógeno y el metano aportan información para evaluar el sobrecrecimiento bacteriano o de arqueas productoras de metano. La medición durante 3 horas cubre mejor el tránsito lento y ayuda a orientar la evaluación de tus síntomas digestivos.',
    ideal: [
      'Ideal si te hinchas poco después de comer o tienes gases.',
      'Ideal si tienes diarrea o estreñimiento.',
      'Ideal si los probióticos o la fibra empeoran tus síntomas.',
      'Ideal si tienes tránsito lento.',
    ],
    obtienes: [
      'Mediciones de hidrógeno y metano durante 3 horas con una prueba de aliento en casa.',
      'Información para orientar la evaluación de SIBO o IMO.',
    ],
  },
  'microbiology-profile': {
    gancho: 'Conoce tu equilibrio microbiano con un análisis enfocado en bacterias y levaduras.',
    queMide: [
      'Bacterias beneficiosas, desequilibradas y patógenas mediante cultivo',
      'Levaduras mediante cultivo',
      'Sensibilidad a agentes farmacéuticos y naturales',
    ],
    porQueImporta:
      'Concentra la evaluación en bacterias, levaduras y sus sensibilidades cuando la principal sospecha es disbiosis. Su alcance específico permite un control más económico, sin incluir parasitología ni marcadores de digestión o inflamación.',
    ideal: [
      'Ideal si buscas un control después de un tratamiento.',
      'Ideal si la sospecha principal es disbiosis.',
    ],
    obtienes: [
      'Resultados del cultivo de bacterias y levaduras en heces.',
      'Información de sensibilidad a agentes farmacéuticos y naturales.',
    ],
  },
  'h-pylori': {
    gancho: 'Explora una pista concreta detrás de tu acidez, ardor o llenura rápida.',
    queMide: [
      'Un único marcador: Helicobacter pylori',
      'Presencia de esta bacteria del estómago, asociada a gastritis, úlceras y reflujo',
      'Presencia de esta bacteria, también asociada a baja producción de ácido gástrico',
    ],
    porQueImporta:
      'Saber si está presente Helicobacter pylori aporta una pista específica para orientar la evaluación de tus molestias. Su asociación con baja producción de ácido gástrico también da contexto cuando preocupa la absorción de hierro, B12 y proteínas.',
    ideal: [
      'Ideal si tienes acidez o ardor.',
      'Ideal si tienes náuseas o llenura rápida.',
      'Ideal si tienes anemia sin causa clara.',
    ],
    obtienes: [
      'Un resultado enfocado en la presencia de Helicobacter pylori.',
      'Información específica sobre esta bacteria para orientar la evaluación de tus síntomas.',
    ],
  },
  'culture-pcr-parasitology-cpp': {
    gancho: 'Explora infección y disbiosis intestinal con cultivo, PCR y microscopía en conjunto.',
    queMide: [
      'Bacterias y levaduras mediante cultivo',
      'Patógenos bacterianos, virus y parásitos mediante PCR',
      'Parásitos mediante microscopía',
      'Sensibilidades a agentes farmacéuticos y naturales',
    ],
    porQueImporta:
      'Combina tres métodos para ampliar la evaluación de infección y disbiosis intestinal. Al centrarse en ese objetivo, ofrece información de sensibilidades a menor costo que el análisis completo, sin sus marcadores de digestión e inflamación.',
    ideal: [
      'Ideal si sospechas parásitos o una infección intestinal tras un viaje.',
      'Ideal si has consumido agua no tratada.',
      'Ideal si tienes mascotas y sospechas una infección intestinal.',
      'Ideal si tienes diarrea recurrente.',
    ],
    obtienes: [
      'Resultados de cultivo, PCR y parasitología por microscopía.',
      'Información de sensibilidad a agentes farmacéuticos y naturales.',
    ],
  },
  'yeast-culture-sensitivities': {
    gancho: 'Conoce qué levadura aparece y su sensibilidad antes de seguir probando opciones.',
    queMide: [
      'Hongos y levaduras en heces, como Candida',
      'Identificación de la especie encontrada',
      'Sensibilidad a antifúngicos naturales y farmacéuticos',
    ],
    porQueImporta:
      'Identificar la especie y sus sensibilidades aporta una orientación específica cuando sospechas levaduras. Este análisis enfocado reúne información para valorar el agente adecuado sin depender de pruebas a ciegas.',
    ideal: [
      'Ideal si tienes antojos de azúcar.',
      'Ideal si tienes hinchazón.',
      'Ideal si has usado antibióticos recientemente.',
      'Ideal si tienes candidiasis recurrente.',
    ],
    obtienes: [
      'Resultado del cultivo en heces con identificación de la especie encontrada.',
      'Información sobre sensibilidad a antifúngicos naturales y farmacéuticos.',
    ],
  },
  'gi-advanced-profile-includes-zonulin-and-h-pylori': {
    gancho: 'Explora tu intestino con 98 marcadores, incluida la permeabilidad y H. pylori.',
    queMide: [
      'Microbioma por PCR, incluidos Akkermansia y Bifidobacterium, y cultivo bacteriano',
      'Patógenos bacterianos, virales y parasitarios, Candida y H. pylori',
      'Ácidos grasos como el butirato',
      'Calprotectina, relacionada con inflamación',
      'Beta-glucuronidasa, relacionada con el reciclaje de estrógenos',
      'Zonulina, relacionada con permeabilidad intestinal',
    ],
    porQueImporta:
      'Sus 98 marcadores permiten explorar microbioma, patógenos, inflamación y permeabilidad intestinal dentro del mismo perfil. Incluir zonulina y H. pylori amplía la información disponible sin añadirlos como pruebas separadas.',
    ideal: [
      'Ideal si tienes autoinmunidad.',
      'Ideal si tienes alergias.',
      'Ideal si tienes desbalance hormonal.',
      'Ideal si tienes inflamación sistémica.',
    ],
    obtienes: [
      'Resultados de un perfil de heces con 98 marcadores.',
      'Resultados de zonulina y H. pylori incluidos en el perfil.',
      'Una visión conjunta del microbioma y de marcadores de inflamación y permeabilidad intestinal.',
    ],
  },
  'candida-albicans-en-sangre': {
    gancho: 'Descubre cómo responde tu sistema inmune a Candida albicans.',
    queMide: [
      'Anticuerpos IgG contra Candida albicans',
      'Anticuerpos IgA contra Candida albicans',
      'Anticuerpos IgM contra Candida albicans',
    ],
    porQueImporta:
      'Los tres anticuerpos aportan matices sobre una respuesta reciente, prolongada o relacionada con mucosas. Esta perspectiva inmune complementa las pruebas de heces cuando se sospecha un sobrecrecimiento crónico.',
    ideal: [
      'Ideal si tienes fatiga o niebla mental.',
      'Ideal si tienes antojos de azúcar.',
      'Ideal si tienes infecciones vaginales u orales recurrentes.',
      'Ideal si buscas complementar pruebas de heces ante sospecha de sobrecrecimiento crónico.',
    ],
    obtienes: [
      'Resultados en sangre de IgG, IgA e IgM contra Candida albicans.',
      'Información sobre tu respuesta inmune para complementar la evaluación de cándida.',
    ],
  },
  'dutch-plus-hormonas-sexuales-adrenal': {
    gancho: 'Conoce cuántas hormonas produces, cómo las procesas y cómo cambia tu cortisol.',
    queMide: [
      'Estrógenos, progesterona, testosterona, DHEA y cortisol junto con sus metabolitos: 35 analitos',
      'Ritmo del cortisol durante el día y respuesta del cortisol al despertar (CAR)',
      'Melatonina',
      'Ácidos orgánicos: B12, B6, glutatión, dopamina, noradrenalina y daño oxidativo',
      'Vías de estrógeno y metilación',
    ],
    porQueImporta:
      'Conocer la producción hormonal y sus vías de procesamiento aporta profundidad a la evaluación de tu equilibrio hormonal. El ritmo diario del cortisol y su respuesta al despertar añaden contexto para orientar la estrategia ante fatiga, insomnio o síntomas de perimenopausia.',
    ideal: [
      'Ideal si tienes fatiga al despertar o burnout.',
      'Ideal si tienes insomnio o ansiedad.',
      'Ideal si tienes SPM.',
      'Ideal si estás en perimenopausia.',
    ],
    obtienes: [
      'Resultados de hormonas y metabolitos a partir de orina seca y saliva tomadas en casa.',
      'Información del ritmo diario del cortisol y de su respuesta al despertar.',
      'Datos de melatonina, ácidos orgánicos y procesamiento de estrógenos.',
    ],
  },
  'dutch-solo-hormonas': {
    gancho: 'Profundiza en tus hormonas sexuales y en cómo procesas los estrógenos.',
    queMide: [
      'Estrógenos y sus vías de metabolismo',
      'Metilación de estrógenos',
      'Progesterona',
      'Andrógenos como la testosterona',
    ],
    porQueImporta:
      'Explorar las hormonas sexuales y el metabolismo de estrógenos ayuda a orientar la evaluación de tu balance hormonal. El panel concentra la inversión en ese objetivo, sin incluir el panel adrenal ni los ácidos orgánicos.',
    ideal: [
      'Ideal si tienes SPM o ciclos irregulares.',
      'Ideal si tienes endometriosis o SOP.',
      'Ideal si tienes acné hormonal o sospecha de dominancia estrogénica.',
      'Ideal si buscas monitorear terapia hormonal.',
    ],
    obtienes: [
      'Resultados del panel de hormonas sexuales en orina seca.',
      'Información de las vías de metabolismo de estrógenos, incluida la metilación.',
    ],
  },
  'dutch-adrenal-only': {
    gancho: 'Dale sentido a tu ritmo de energía con una mirada al cortisol diario.',
    queMide: [
      'Cortisol libre en varios momentos del día',
      'Cortisona libre en varios momentos del día',
      'Producción total de cortisol',
      'DHEA',
    ],
    porQueImporta:
      'Observar varios momentos del día permite conocer tu ritmo de cortisol y cortisona. Junto con la producción total de cortisol y DHEA, aporta información para orientar la evaluación de tu eje del estrés.',
    ideal: [
      'Ideal si te sientes cansada pero acelerada.',
      'Ideal si tienes estrés crónico o insomnio.',
      'Ideal si tienes bajones de energía por la tarde.',
      'Ideal si tienes antojos.',
    ],
    obtienes: [
      'Resultados de cortisol y cortisona libres en distintos momentos del día.',
      'Datos de producción total de cortisol y DHEA para explorar tu eje del estrés.',
    ],
  },
  'comprehensive-hormone-plus-profile': {
    gancho: 'Explora las hormonas que tu cuerpo usa y el ritmo de tu cortisol.',
    queMide: [
      'Estrona, estradiol y estriol en su fracción libre',
      'Progesterona en su fracción libre',
      'Testosterona y DHEA en su fracción libre',
      'Cortisol 4 veces al día',
      'Índice de estrógenos',
    ],
    porQueImporta:
      'Medir la fracción libre aporta información sobre las hormonas que tu cuerpo utiliza. El balance progesterona/estrógeno y el cortisol en cuatro momentos ayudan a orientar la revisión hormonal o el monitoreo de terapia en crema.',
    ideal: [
      'Ideal si quieres revisar el balance progesterona/estrógeno.',
      'Ideal si buscas conocer tu ritmo de cortisol.',
      'Ideal si buscas monitorear terapia hormonal en crema.',
    ],
    obtienes: [
      'Resultados hormonales en saliva e índice de estrógenos, sin metabolitos.',
      'Mediciones de cortisol en 4 momentos del día.',
    ],
  },
  'celiac-and-gluten-sensitivity-blood-spot': {
    gancho: 'Explora tu respuesta al gluten con un panel específico de anticuerpos.',
    queMide: [
      'Anticuerpos IgA e IgG contra transglutaminasa tisular (tTG)',
      'Anticuerpos IgA e IgG contra gliadina deaminada (DGP)',
      'Anticuerpos IgA e IgG contra gliadina',
    ],
    porQueImporta:
      'Este panel específico aporta datos para orientar la evaluación de enfermedad celíaca y sensibilidad al gluten no celíaca. Debes estar comiendo gluten al hacer la prueba para realizarla en las condiciones indicadas.',
    ideal: [
      'Ideal si tienes hinchazón.',
      'Ideal si tienes anemia.',
      'Ideal si tienes tiroiditis u otra autoinmunidad.',
      'Ideal si tienes deficiencias de nutrientes sin explicación.',
    ],
    obtienes: [
      'Resultados de anticuerpos mediante una muestra obtenida por pinchazo en el dedo.',
      'Información específica para orientar la evaluación de tu respuesta al gluten.',
    ],
  },
  '198-vegetarian-food-panel-iga-igg-igg4': {
    gancho: 'Explora 198 alimentos y tres anticuerpos para orientar tu alimentación vegetariana.',
    queMide: [
      'IgA, relacionado con la mucosa intestinal',
      'IgG, relacionado con reacciones retardadas',
      'IgG4, relacionado con reacciones retardadas',
      'Sensibilidad a 198 alimentos vegetales, lácteos y huevo, incluidas especias',
    ],
    porQueImporta:
      'La cobertura de 198 alimentos y tres anticuerpos aporta amplitud para orientar una eliminación y reintroducción guiada. No diagnostica alergias y se centra en alimentos vegetales, lácteos y huevo, sin carnes ni pescados.',
    ideal: [
      'Ideal si eres vegetariana.',
      'Ideal si comes mayormente plantas.',
      'Ideal si buscas orientar una eliminación y reintroducción guiada.',
    ],
    obtienes: [
      'Resultados de IgA, IgG e IgG4 frente a 198 alimentos.',
      'Información para orientar una dieta de eliminación y reintroducción guiada.',
    ],
  },
  '96-vegetarian-food-panel-iga-igg-igg4': {
    gancho: 'Enfoca tu evaluación vegetariana en 96 alimentos y tres anticuerpos.',
    queMide: [
      'IgA frente a 96 alimentos vegetarianos comunes',
      'IgG frente a 96 alimentos vegetarianos comunes',
      'IgG4 frente a 96 alimentos vegetarianos comunes',
    ],
    porQueImporta:
      'Su selección de 96 alimentos permite explorar tres anticuerpos con una inversión menor que el panel de 198. No diagnostica alergias y aporta orientación para una dieta de eliminación y reintroducción guiada.',
    ideal: [
      'Ideal si eres vegetariana y tu dieta es poco variada.',
      'Ideal si buscas orientar una eliminación y reintroducción guiada.',
    ],
    obtienes: [
      'Resultados de IgA, IgG e IgG4 frente a 96 alimentos vegetarianos comunes.',
      'Información para orientar una dieta de eliminación y reintroducción guiada.',
    ],
  },
  '240-food-panel-iga-igg-igg4': {
    gancho: 'Dale amplitud a tu búsqueda con 240 alimentos y tres anticuerpos.',
    queMide: [
      'IgA frente a 240 alimentos',
      'IgG frente a 240 alimentos',
      'IgG4 frente a 240 alimentos',
      'Cobertura de lácteos, huevos, legumbres, frutos secos y semillas',
      'Cobertura de granos, frutas, verduras, especias y proteínas animales',
    ],
    porQueImporta:
      'La cobertura de 240 alimentos aporta una evaluación amplia cuando comes muy variado o un panel pequeño no fue concluyente. No diagnostica alergias y ofrece información para orientar una dieta de eliminación.',
    ideal: [
      'Ideal si comes muy variado y tienes síntomas persistentes.',
      'Ideal si tienes colon irritable o migrañas persistentes.',
      'Ideal si tienes eccema o dolor articular persistentes.',
      'Ideal si un panel pequeño no fue concluyente.',
    ],
    obtienes: [
      'Resultados de IgA, IgG e IgG4 frente a 240 alimentos de distintos grupos.',
      'Información para orientar una dieta de eliminación.',
    ],
  },
  '96-igg-food-sensitivity-panel': {
    gancho: 'Da un primer paso para explorar qué alimentos podrían relacionarse con tu hinchazón.',
    queMide: [
      'IgG frente a 96 alimentos de consumo frecuente',
      'Sensibilidad IgG a lácteos, trigo, huevo y soya',
      'Sensibilidad IgG a carnes, frutas y verduras',
    ],
    porQueImporta:
      'Evaluar un anticuerpo y 96 alimentos ofrece un punto de entrada económico cuando sospechas que la comida te inflama o hincha. No diagnostica alergias y aporta información para orientar una dieta de eliminación.',
    ideal: [
      'Ideal si sospechas que algún alimento te inflama.',
      'Ideal si sospechas que algún alimento te hincha.',
      'Ideal si buscas un primer paso para orientar una dieta de eliminación.',
    ],
    obtienes: [
      'Resultados de IgG frente a 96 alimentos de consumo frecuente.',
      'Información para orientar una dieta de eliminación.',
    ],
  },
  '184-igg-food-sensitivity-panel': {
    gancho: 'Amplía tu exploración alimentaria con resultados de IgG frente a 184 alimentos.',
    queMide: [
      'IgG frente a 184 alimentos',
      'Sensibilidad IgG a pescados, mariscos y carnes',
      'Sensibilidad IgG a granos, frutas, verduras y especias',
    ],
    porQueImporta:
      'Explorar 184 alimentos amplía la información cuando tu dieta es variada o el panel de 96 no explicó tus síntomas. No diagnostica alergias y aporta orientación para una dieta de eliminación.',
    ideal: [
      'Ideal si tu dieta es variada.',
      'Ideal si el panel de 96 alimentos no explicó tus síntomas.',
      'Ideal si buscas orientar una dieta de eliminación.',
    ],
    obtienes: [
      'Resultados de IgG frente a 184 alimentos, incluidos pescados, mariscos y especias.',
      'Información para orientar una dieta de eliminación.',
    ],
  },
  '96-igg-food-gluten-related-disorders-panel': {
    gancho: 'Explora tu respuesta al gluten y a 96 alimentos en una sola muestra.',
    queMide: [
      'IgG frente a 96 alimentos',
      'Panel celíaco: tTG, DGP y gliadina IgA/IgG',
      'IgE al trigo',
      'IgE al gluten',
    ],
    porQueImporta:
      'Reúne marcadores alimentarios, celíacos y de alergia al trigo y al gluten en una sola muestra. Esa información ayuda a orientar la distinción entre enfermedad celíaca, alergia al trigo y sensibilidad al gluten.',
    ideal: [
      'Ideal si sospechas que el gluten te afecta y no sabes de qué manera.',
      'Ideal si tienes autoinmunidad, especialmente tiroidea.',
      'Ideal si quieres explorar gluten y sensibilidad a alimentos en conjunto.',
    ],
    obtienes: [
      'Resultados de IgG frente a 96 alimentos.',
      'Resultados del panel celíaco y de IgE al trigo y al gluten en la misma muestra.',
    ],
  },
  '184-igg-food-gluten-related-disorders-panel': {
    gancho: 'Reúne la evaluación del gluten y 184 alimentos en una sola prueba.',
    queMide: [
      'IgG frente a 184 alimentos',
      'Panel celíaco completo: tTG, DGP y gliadina IgA/IgG',
      'IgE a trigo y gluten',
    ],
    porQueImporta:
      'Combinar 184 alimentos IgG, el panel celíaco y la IgE a trigo y gluten amplía la información sobre tu alimentación. Reunirlos en una sola prueba permite orientar una evaluación conjunta.',
    ideal: [
      'Ideal si buscas evaluar tu respuesta al gluten.',
      'Ideal si quieres explorar gluten y alimentación en una sola prueba.',
    ],
    obtienes: [
      'Resultados de IgG frente a 184 alimentos.',
      'Resultados del panel celíaco completo y de IgE a trigo y gluten.',
    ],
  },
  '184-igg-food-sensitivity-25-comprehensive-ige-combo-panel': {
    gancho: 'Explora respuestas inmediatas y retardadas a los alimentos en un mismo panel.',
    queMide: [
      'IgG frente a 184 alimentos',
      'IgE frente a 25 alimentos',
      'Sensibilidades de reacción retardada y respuestas alérgicas de reacción inmediata',
    ],
    porQueImporta:
      'Combinar IgG e IgE aporta información sobre respuestas retardadas de horas a días e inmediatas. Esa perspectiva ayuda a orientar la evaluación cuando tus molestias digestivas se acompañan de otras reacciones después de comer.',
    ideal: [
      'Ideal si tus síntomas digestivos se acompañan de urticaria después de comer.',
      'Ideal si tus síntomas digestivos se acompañan de picazón después de comer.',
      'Ideal si tienes síntomas digestivos y congestión después de comer.',
      'Ideal si tienes síntomas digestivos e hinchazón de labios después de comer.',
    ],
    obtienes: [
      'Resultados de IgG frente a 184 alimentos y de IgE frente a 25 alimentos.',
      'Información conjunta sobre sensibilidades y respuestas alérgicas alimentarias.',
    ],
  },
  '184-igg-food-sensitivity-50-expanded-ige-combo-panel': {
    gancho: 'Amplía la evaluación de tu respuesta alérgica con IgE frente a 50 alimentos.',
    queMide: [
      'IgE ampliado a 50 alimentos',
      'Sensibilidad alimentaria',
      'Respuesta alérgica a alimentos',
    ],
    porQueImporta:
      'La combinación de sensibilidad alimentaria e IgE ampliado a 50 alimentos aporta una perspectiva conjunta. Esa información ayuda a orientar la distinción entre sensibilidad y alergia cuando tienes antecedentes de alergias múltiples.',
    ideal: [
      'Ideal si tienes historial de alergias múltiples.',
      'Ideal si tienes asma.',
      'Ideal si tienes dermatitis atópica.',
    ],
    obtienes: [
      'Resultados de IgE frente a 50 alimentos.',
      'Información conjunta para orientar la evaluación de sensibilidad y alergia alimentaria.',
    ],
  },
  '205-igg-food-sensitivity-25-comprehensive-ige-combo-panel': {
    gancho: 'Explora una dieta muy variada con aproximadamente 205 alimentos IgG y 25 IgE.',
    queMide: [
      'Sensibilidad IgG a aproximadamente 205 alimentos',
      'IgE a 25 alimentos',
      'Sensibilidad y respuesta alérgica alimentaria en un panel combinado',
    ],
    porQueImporta:
      'La cobertura ampliada de IgG se combina con IgE a 25 alimentos para reunir ambas perspectivas. Aporta más amplitud a la evaluación si tu dieta es muy variada o los paneles pequeños no fueron concluyentes.',
    ideal: [
      'Ideal si tu dieta es muy variada.',
      'Ideal si paneles más pequeños no fueron concluyentes.',
    ],
    obtienes: [
      'Resultados de sensibilidad IgG frente a aproximadamente 205 alimentos.',
      'Resultados de IgE frente a 25 alimentos en el mismo panel.',
    ],
  },
  '205-igg-food-sensitivity-50-expanded-ige-combo-panel': {
    gancho:
      'Explora aproximadamente 205 alimentos IgG y 50 IgE para ampliar tu información alimentaria.',
    queMide: [
      'Sensibilidad IgG a aproximadamente 205 alimentos',
      'IgE a 50 alimentos',
      'Sensibilidad y respuesta alérgica alimentaria en un panel combinado',
    ],
    porQueImporta:
      'Combinar sensibilidad IgG a aproximadamente 205 alimentos con IgE a 50 amplía ambas perspectivas de evaluación. Esta cobertura aporta información cuando tu dieta es muy variada y tienes historial de alergias.',
    ideal: [
      'Ideal si tienes una dieta muy variada e historial de alergias.',
      'Ideal si buscas evaluar sensibilidad IgG y respuesta IgE en conjunto.',
    ],
    obtienes: [
      'Resultados de sensibilidad IgG frente a aproximadamente 205 alimentos.',
      'Resultados de IgE frente a 50 alimentos en el mismo panel.',
    ],
  },
  'cardiometabolic-profile': {
    gancho:
      'Conecta lípidos, control de azúcar e inflamación para conocer tu salud cardiometabólica.',
    queMide: ['Perfil de lípidos', 'Insulina', 'HbA1c', 'PCR ultrasensible'],
    porQueImporta:
      'Reunir lípidos, control de azúcar e inflamación amplía la evaluación de tu riesgo cardiometabólico. Los resultados aportan información para explorar resistencia a la insulina e inflamación y orientar los siguientes pasos.',
    ideal: [
      'Ideal si tienes grasa abdominal o antojos.',
      'Ideal si sientes cansancio después de comer.',
      'Ideal si tienes SOP.',
      'Ideal si tienes antecedentes familiares de diabetes o enfermedad cardíaca.',
    ],
    obtienes: [
      'Resultados de lípidos, insulina, HbA1c y PCR ultrasensible mediante pinchazo en el dedo en ayunas.',
      'Una visión conjunta de marcadores de riesgo cardiometabólico.',
    ],
  },
  'vaginosis-profile': {
    gancho:
      'Busca claridad sobre tus molestias vaginales con información de flora y sensibilidades.',
    queMide: [
      'Lactobacilos, la flora protectora',
      'Puntaje de Nugent',
      'Células clave y leucocitos',
      'Bacterias y levaduras mediante cultivo',
      'Sensibilidad a agentes farmacéuticos y naturales',
    ],
    porQueImporta:
      'Evaluar flora, células y cultivos aporta datos para orientar la distinción entre vaginosis bacteriana y candidiasis. Las sensibilidades añaden información específica cuando las molestias se repiten y los tratamientos habituales no han funcionado.',
    ideal: [
      'Ideal si tienes flujo recurrente.',
      'Ideal si tienes olor o picazón recurrentes.',
      'Ideal si los tratamientos habituales no han funcionado.',
    ],
    obtienes: [
      'Resultados del perfil vaginal mediante hisopo, incluido el cultivo de bacterias y levaduras.',
      'Información de sensibilidad a agentes farmacéuticos y naturales.',
    ],
  },
  'yeast-culture-sensitivities-salud-vaginal': {
    gancho: 'Conoce la especie de levadura y sus sensibilidades ante candidiasis recurrente.',
    queMide: [
      'Levaduras, como Candida, mediante cultivo',
      'Identificación de la especie',
      'Sensibilidad a antifúngicos naturales y farmacéuticos',
    ],
    porQueImporta:
      'Identificar la especie y sus sensibilidades aporta información para orientar la elección del agente ante candidiasis recurrente. Si eliges Vaginosis Profile, ese perfil ya incluye cultivo de levaduras.',
    ideal: [
      'Ideal si tienes candidiasis recurrente.',
      'Ideal si buscas conocer la especie y su sensibilidad a antifúngicos.',
    ],
    obtienes: [
      'Resultado del cultivo de levaduras con identificación de especie.',
      'Información de sensibilidad a antifúngicos naturales y farmacéuticos.',
    ],
  },
  'comprehensive-neurotransmitter-profile': {
    gancho: 'Explora tus neurotransmisores y metabolitos para orientar el apoyo nutricional.',
    queMide: [
      'Serotonina y dopamina',
      'GABA y glutamato',
      'Noradrenalina y adrenalina',
      'Histamina, glicina y PEA',
      'Metabolitos de neurotransmisores, que aportan información sobre MAO y COMT',
    ],
    porQueImporta:
      'Los neurotransmisores y sus metabolitos aportan información para orientar el uso de aminoácidos y cofactores nutricionales. La prueba refleja niveles del cuerpo y no constituye una medición directa del cerebro.',
    ideal: [
      'Ideal si tienes ansiedad o ánimo bajo.',
      'Ideal si tienes insomnio.',
      'Ideal si tienes falta de concentración.',
      'Ideal si tienes antojos.',
    ],
    obtienes: [
      'Resultados en orina de neurotransmisores y sus metabolitos.',
      'Información sobre el trabajo de MAO y COMT para orientar el apoyo nutricional.',
    ],
  },
  'mold-mycotoxin-building': {
    gancho: 'Explora si tu casa u oficina es una fuente de exposición al moho.',
    queMide: [
      '12 mohos tóxicos en el ambiente',
      '16 micotoxinas en el ambiente',
      'Presencia de mohos y micotoxinas en polvo de tu casa u oficina',
    ],
    porQueImporta:
      'Conocer una posible fuente de exposición permite considerar el ambiente dentro de tu estrategia. El análisis del polvo aporta información de tu casa u oficina para orientar acciones sobre esa fuente.',
    ideal: [
      'Ideal si hay humedad en tu casa u oficina.',
      'Ideal si hay filtraciones.',
      'Ideal si tus síntomas mejoran al salir de casa.',
    ],
    obtienes: [
      'Resultados de 12 mohos tóxicos y 16 micotoxinas a partir de un hisopo de polvo.',
      'Información ambiental para explorar la fuente de exposición, sin una muestra de tu cuerpo.',
    ],
  },
  'mycotoxins-panel': {
    gancho: 'Conoce qué micotoxinas está eliminando tu cuerpo con un panel de 16.',
    queMide: [
      '16 micotoxinas que tu cuerpo elimina en orina',
      'Aflatoxinas',
      'Ocratoxina A',
      'Gliotoxina',
      'Tricotecenos del moho negro',
    ],
    porQueImporta:
      'Evaluar las micotoxinas que eliminas aporta información sobre tu carga interna. Al combinar estos datos con una prueba del edificio, puedes explorar tanto el cuerpo como una posible fuente de exposición.',
    ideal: [
      'Ideal si tienes fatiga crónica o niebla mental.',
      'Ideal si tienes síntomas respiratorios.',
      'Ideal si tienes sensibilidad química.',
      'Ideal si tienes inflamación sin causa clara.',
    ],
    obtienes: [
      'Resultados en orina de un panel de 16 micotoxinas.',
      'Información de tu carga interna que puedes complementar con una prueba del edificio.',
    ],
  },
  'expanded-mold-immunoreactivity-panel': {
    gancho: 'Descubre si tu sistema inmune reacciona al moho y cómo reducir la exposición.',
    queMide: [
      'IgE frente a mohos ambientales comunes',
      'IgA frente a mohos ambientales comunes',
      'IgG frente a mohos ambientales comunes',
      'Respuesta inmune a Stachybotrys, el moho negro, incluido en el panel',
    ],
    porQueImporta:
      'Conocer tu respuesta inmune al moho aporta una perspectiva distinta de la carga de toxinas en orina. El plan de reducción de exposición incluido ayuda a trasladar esa información a acciones sobre tu entorno.',
    ideal: [
      'Ideal si tienes rinitis.',
      'Ideal si tienes asma.',
      'Ideal si tienes sinusitis.',
      'Ideal si tus síntomas empeoran en ambientes húmedos.',
    ],
    obtienes: [
      'Resultados en sangre de IgE, IgA e IgG frente a mohos ambientales comunes.',
      'Información sobre la respuesta inmune a mohos, incluido Stachybotrys.',
      'Un plan de reducción de exposición.',
    ],
  },
  'dna-oxidative-damage': {
    gancho: 'Dale una referencia medible a tu plan de longevidad.',
    queMide: [
      'Un único marcador en orina: 8-OHdG',
      'Daño oxidativo al ADN, evaluado mediante 8-OHdG',
      'Estrés oxidativo que enfrenta tu cuerpo, según ese mismo marcador',
    ],
    porQueImporta:
      'Medir 8-OHdG aporta una línea base del daño oxidativo al ADN para tu plan de longevidad. Su seguimiento ayuda a valorar si la alimentación, los antioxidantes y el estilo de vida están funcionando.',
    ideal: [
      'Ideal si buscas una línea base para un plan de longevidad.',
      'Ideal si quieres valorar cambios en tu alimentación y uso de antioxidantes.',
      'Ideal si buscas evaluar cómo está funcionando tu estilo de vida.',
    ],
    obtienes: [
      'Un resultado de 8-OHdG en orina como marcador de daño oxidativo al ADN.',
      'Una referencia para dar seguimiento a tu plan de longevidad.',
    ],
  },
  'findwhy-weight-control-profile': {
    gancho: 'Conoce tus predisposiciones genéticas para personalizar tu alimentación y ejercicio.',
    queMide: [
      '5 genes asociados al peso: FTO, MC4R, ADRB2, FABP2 y SH2B1',
      'Predisposiciones relacionadas con apetito y saciedad',
      'Predisposiciones relacionadas con absorción de grasas',
      'Predisposiciones relacionadas con respuesta al ejercicio',
    ],
    porQueImporta:
      'Conocer estas predisposiciones ayuda a personalizar tu plan de alimentación y ejercicio sin asumir que tus genes determinan tu destino. La prueba se realiza una sola vez en la vida porque tus genes no cambian.',
    ideal: [
      'Ideal si te cuesta bajar de peso a pesar de hacer todo bien.',
      'Ideal si buscas personalizar tu plan de alimentación.',
      'Ideal si buscas personalizar tu plan de ejercicio.',
    ],
    obtienes: [
      'Resultados de 5 genes asociados al peso mediante un hisopo bucal.',
      'Información de predisposiciones para orientar tu alimentación y ejercicio.',
    ],
  },
  'metales-pesados-minerales': {
    gancho:
      'Explora metales tóxicos y minerales esenciales para ampliar la mirada sobre tu bienestar.',
    queMide: ['Plomo y mercurio', 'Arsénico, cadmio y aluminio', 'Magnesio y zinc', 'Selenio'],
    porQueImporta:
      'Evaluar metales tóxicos junto con minerales esenciales permite explorar dos aspectos relacionados, ya que los metales desplazan minerales. Esta información aporta contexto para orientar la evaluación de energía, tiroides, sistema nervioso y hormonas.',
    ideal: [
      'Ideal si consumes mucho pescado.',
      'Ideal si tienes amalgamas dentales o exposición laboral.',
      'Ideal si tienes fatiga o niebla mental.',
      'Ideal si tienes problemas de tiroides.',
    ],
    obtienes: [
      'Resultados de metales tóxicos como plomo, mercurio, arsénico, cadmio y aluminio.',
      'Resultados de minerales esenciales como magnesio, zinc y selenio.',
    ],
  },
  'hepatic-detox-profile': {
    gancho: 'Explora tu exposición a tóxicos y cómo participa tu hígado en eliminarlos.',
    queMide: [
      'Ácido D-glucárico: fase I, relacionado con exposición a más de 200 químicos',
      'Ácidos mercaptúricos: fase II, relacionados con uso de glutatión',
      'Desintoxicación del hígado mediante estos dos marcadores de las fases I y II',
    ],
    porQueImporta:
      'Estos dos marcadores aportan información sobre exposición a tóxicos y eliminación hepática desde un panel específico. Contar con esa perspectiva ayuda a orientar la evaluación antes de un protocolo de detox.',
    ideal: [
      'Ideal si tienes sensibilidad a olores o químicos.',
      'Ideal si tienes intolerancia al alcohol o al café.',
      'Ideal si buscas información antes de un protocolo de detox.',
    ],
    obtienes: [
      'Resultados de ácido D-glucárico y ácidos mercaptúricos en la primera orina de la mañana.',
      'Información de las fases I y II de la desintoxicación hepática.',
    ],
  },
  'all-tox': {
    gancho: 'Amplía tu visión de la carga tóxica con más de 100 marcadores.',
    queMide: [
      'Micotoxinas',
      'Contaminantes ambientales, incluidos PFAS y BPA',
      'Metales pesados, incluidos plomo y litio',
      'Glifosato',
    ],
    porQueImporta:
      'Reunir más de 100 marcadores de micotoxinas, contaminantes ambientales y metales pesados amplía la evaluación de tu carga tóxica. Combinar varios paneles en uno aporta una visión conjunta para orientar los siguientes pasos.',
    ideal: [
      'Ideal si tienes fatiga crónica.',
      'Ideal si tienes autoinmunidad o desbalance hormonal.',
      'Ideal si tienes infertilidad.',
      'Ideal si tienes síntomas neurológicos.',
    ],
    obtienes: [
      'Resultados de más de 100 marcadores de carga tóxica.',
      'Una evaluación conjunta de micotoxinas, contaminantes ambientales y metales pesados.',
    ],
  },
  'organic-acids': {
    gancho: 'Explora energía, nutrientes y metabolismo con la profundidad de una sola muestra.',
    queMide: [
      'Productos del metabolismo relacionados con energía celular y mitocondria',
      'Vitaminas del complejo B',
      'Neurotransmisores',
      'Capacidad de desintoxicación: glutatión',
      'Oxalatos',
      'Marcadores de levaduras y bacterias intestinales',
    ],
    porQueImporta:
      'Explorar varios productos del metabolismo ofrece una visión amplia de energía, nutrientes y desintoxicación en una sola muestra. Esa información ayuda a orientar la búsqueda de deficiencias nutricionales funcionales y la evaluación de tus síntomas.',
    ideal: [
      'Ideal si tienes fatiga.',
      'Ideal si tienes ánimo bajo.',
      'Ideal si tienes problemas digestivos.',
      'Ideal si buscas explorar deficiencias nutricionales funcionales.',
    ],
    obtienes: [
      'Resultados de productos del metabolismo a partir de una muestra de orina.',
      'Una visión conjunta de energía celular, nutrientes, neurotransmisores y capacidad de desintoxicación.',
      'Información sobre oxalatos y marcadores de levaduras y bacterias intestinales.',
    ],
  },
};
