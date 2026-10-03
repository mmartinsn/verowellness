/**
 * FAQ shown on the home page. Copy as delivered by Mari (Stitch design), with the fixes from the
 * copy review of 2026-09-23 applied at Mari's request: agreement in the first answer, «garantiza»
 * (an absolute promise) softened to «busca que», and the cycle length aligned with the offer
 * («a completar en un máximo de 60»). The health claims themselves — mechanisms, the clinical
 * scope of the second answer, the results window of the third — still need Verónica's review
 * (docs/DECISIONES.md, decisión 15). The last six (2026-10-03, Verónica's change 17: «extender la
 * sección») are Codex's copy, built only from facts already on the site.
 */
import { ciclos } from './oferta';

const session = ciclos.LAYER_SESSION;
const initial = ciclos.INITIAL_LAYER_CYCLE;

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
    q: '¿Las asesorías son online o presenciales?',
    a: 'Las asesorías son 100% online. Adaptamos el horario al país donde estés.',
  },
  {
    q: `¿Qué diferencia hay entre ${session.nombre} e ${initial.nombre}?`,
    a: `En ${session.nombre} trabajamos en una consulta de 90 minutos. ${initial.nombre} está dirigido a pacientes nuevas e incluye dos consultas de 90 minutos, separadas aproximadamente 30 días. Las completamos en un máximo de 60 días.`,
  },
  {
    q: '¿Tengo que hacerme exámenes antes de la asesoría?',
    a: 'Los exámenes funcionales no son obligatorios. Como parte de la asesoría, identificamos si hacen falta y qué prioridad tienen.',
  },
  {
    q: 'Ya soy paciente, ¿cómo sigo?',
    a: `Si ya trabajaste conmigo, puedes continuar con dos consultas de control. El precio no está publicado. Escríbeme por Instagram y recibirás tus planes por correo. Si han pasado seis meses o más sin asesoría, empezamos de nuevo con ${initial.nombre}.`,
  },
  {
    q: `¿Qué incluye el bonus de ${initial.nombre}?`,
    a: `Incluimos gratis la «Guía de alimentación anti-inflamatoria como estilo de vida». Siempre forma parte de ${initial.nombre}.`,
  },
  {
    q: '¿Cómo funcionan los precios y los impuestos?',
    a: `Publicamos los precios sin impuestos: ${session.nombre} cuesta USD ${session.subtotal} e ${initial.nombre}, USD ${initial.subtotal}. Sumamos el 7% al pagar, donde puedes ver el total antes de confirmar. En los exámenes se suma además un cargo del laboratorio.`,
  },
];
