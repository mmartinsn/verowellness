/**
 * FAQ shown on the home page. Copy as delivered by Mari (Stitch design), with the fixes from the
 * copy review of 2026-09-23 applied at Mari's request: agreement in the first answer, «garantiza»
 * (an absolute promise) softened to «busca que», and the cycle length aligned with the offer
 * («a completar en un máximo de 60»). The health claims themselves — mechanisms, the clinical
 * scope of the second answer, the results window of the third — still need Verónica's review
 * (docs/DECISIONES.md, decisión 15).
 */
export interface Pregunta {
  q: string;
  a: string;
}

export const faq: Pregunta[] = [
  {
    q: '¿En qué se diferencia de tomar suplementos por mi cuenta?',
    a: 'Tomar suplementos sin abrir primero las vías de drenaje (L2) o sin reparar el terreno inflamatorio (L3) suele sobrecargar al hígado, y la célula no llega a aprovecharlos. The Layer Method™ busca que cada nutriente ingrese en el momento biológico óptimo.',
  },
  {
    q: '¿Necesito analíticas previas para comenzar?',
    a: 'Si cuentas con analíticas de los últimos 6 meses, las integraremos en tu Layer Map™. Si no las tienes, realizaremos primero el diagnóstico clínico sintomático para recomendarte únicamente las pruebas pertinentes.',
  },
  {
    q: '¿Cuánto dura el proceso y cuándo se ven cambios?',
    a: 'El ciclo inicial se completa en un máximo de 60 días. El alivio digestivo y el incremento de energía matutina suelen apreciarse en las primeras dos a tres semanas al descongestionar las primeras compuertas emuntoriales.',
  },
];
