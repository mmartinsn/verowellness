/**
 * FAQ shown on the home page. The first three are Mari's copy (Stitch design) with the fixes from
 * the copy review of 2026-09-23; their health claims still need Verónica's review
 * (docs/DECISIONES.md, decisión 15). The rest were written on 2026-10-03 at Verónica's request
 * («extender la sección de preguntas frecuentes») from facts already on the site, pending her OK.
 */
export interface Pregunta {
  q: string;
  a: string;
}

export const faq: Pregunta[] = [
  {
    q: '¿En qué se diferencia de tomar suplementos por mi cuenta?',
    a: 'Tomar suplementos sin abrir primero las vías de drenaje (L2) o sin reparar el terreno inflamatorio (L3) suele sobrecargar al hígado, y la célula no llega a aprovecharlos. The Layer Method busca que cada nutriente ingrese en el momento biológico óptimo.',
  },
  {
    q: '¿Necesito analíticas previas para comenzar?',
    a: 'Si cuentas con analíticas de los últimos 6 meses, las integraremos en tu Layer Map. Si no las tienes, realizaremos primero el diagnóstico clínico sintomático para recomendarte únicamente las pruebas pertinentes.',
  },
  {
    q: '¿Cuánto dura el proceso y cuándo se ven cambios?',
    a: 'El ciclo inicial se completa en un máximo de 60 días. El alivio digestivo y el incremento de energía matutina suelen apreciarse en las primeras dos a tres semanas al descongestionar las primeras compuertas emuntoriales.',
  },
  {
    q: '¿Las asesorías son presenciales u online?',
    a: 'Son 100% online y se adaptan a tu horario, estés donde estés. Solo necesitas una conexión estable y un espacio tranquilo para conversar.',
  },
  {
    q: '¿Qué diferencia hay entre la Layer Session y el Initial Layer Cycle?',
    a: 'La Layer Session es una sola cita privada de 90 minutos: escuchamos tu historia, revisamos tus formularios y sales con un plan de acción. El Initial Layer Cycle son dos citas de 90 minutos, separadas unos 30 días: en la segunda revisamos qué mejoró, qué falta, y ajustamos tu Layer Plan con base en tu respuesta real.',
  },
  {
    q: '¿Tengo que hacerme exámenes antes de mi asesoría?',
    a: 'No. Los exámenes no son obligatorios para tus asesorías. Si no sabes cuál elegir o cuál priorizar, no te preocupes: identificar si necesitas estudios, y en qué orden, forma parte de tu asesoría.',
  },
  {
    q: '¿Cómo funciona el Next Layer Cycle?',
    a: 'Es la continuidad para quienes ya completaron su Initial Layer Cycle: dos sesiones para seguir trabajando las capas de tu plan sin empezar de cero. Si ya eres mi paciente, escríbeme por Instagram y te envío tus planes por correo. Si pasan 6 meses o más sin asesoría, se empieza de nuevo con el Initial Layer Cycle.',
  },
  {
    q: '¿Qué incluye el bonus del Initial Layer Cycle?',
    a: 'Con el Initial Layer Cycle recibes gratis la «Guía de alimentación anti-inflamatoria como estilo de vida».',
  },
  {
    q: '¿Cómo puedo pagar?',
    a: 'Los precios se muestran sin impuestos: el 7% se suma en el checkout, donde ves el total antes de pagar. En los exámenes se suma además el fee del laboratorio.',
  },
];
