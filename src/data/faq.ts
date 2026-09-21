/** FAQ shown on the home page. Copy as delivered by Mari (Stitch design). */
export interface Pregunta {
  q: string;
  a: string;
}

export const faq: Pregunta[] = [
  {
    q: '¿En qué se diferencia de tomar suplementos por mi cuenta?',
    a: 'Tomar suplementos sin abrir primero las vías de drenaje (L2) o sin reparar el terreno inflamatorio (L3) suele sobrecargar al hígado y no ser aprovechado por la célula. The Layer Method™ garantiza que cada nutriente ingrese en el momento biológico óptimo.',
  },
  {
    q: '¿Necesito analíticas previas para comenzar?',
    a: 'Si cuentas con analíticas de los últimos 6 meses, las integraremos en tu Layer Map™. Si no las tienes, realizaremos primero el diagnóstico clínico sintomático para recomendarte únicamente las pruebas pertinentes.',
  },
  {
    q: '¿Cuánto dura el proceso y cuándo se ven cambios?',
    a: 'El ciclo inicial se extiende durante 60 días. El alivio digestivo y el incremento de energía matutina suelen apreciarse en las primeras dos a tres semanas al descongestionar las primeras compuertas emuntoriales.',
  },
];
