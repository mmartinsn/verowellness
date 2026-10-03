/**
 * The 1:1 offer. Public: Layer Session (1 consulta) and Initial Layer Cycle (2 consultas, nuevas).
 * The Next Layer Cycle (2 consultas de control) is for existing patients: its price is not shown,
 * only its checkout exists, reached from the email (Mari, 2026-10-03: 150 / 269 / 210).
 * Every price shown on the site derives from `subtotal` here — never typed twice.
 */
import { desglose, type Desglose } from '../lib/precio';

export type CicloId = 'LAYER_SESSION' | 'INITIAL_LAYER_CYCLE' | 'NEXT_LAYER_CYCLE';

export interface Ciclo {
  id: CicloId;
  slug: 'layer-session' | 'initial-layer-cycle' | 'next-layer-cycle';
  nombre: string;
  /** «1 consulta» / «2 consultas», shown on the cards. */
  consultas: string;
  etiqueta: string;
  /** Small italic note under the tag (only the Initial cycle carries one on the cards). */
  etiquetaNota?: string;
  subtotal: number;
  /** One-line description used on price cards. */
  descripcion: string;
  /** Shorter variant for the checkout summary card. */
  descripcionCorta: string;
  incluye: string[];
  /** Items listed in the checkout summary (a shorter list than the card's). */
  incluyeCheckout: string[];
  /** Note at the bottom of the card (Next cycle: the 6-month reactivation rule). */
  notaPie?: string;
  /** A gift for this cycle, shown under what it includes (Mari, 2026-09-23; copy by Codex). */
  bonus?: string;
  /** Copy for the confirmation screen after paying. */
  confirmacion: { titulo: string; texto: string; calendlyUrl: string; calendlyEtiqueta: string };
}

export const ciclos: Record<CicloId, Ciclo> = {
  LAYER_SESSION: {
    id: 'LAYER_SESSION',
    slug: 'layer-session',
    nombre: 'Layer Session',
    consultas: '1 consulta',
    etiqueta: 'Consulta individual',
    subtotal: 150,
    descripcion:
      'Una consulta de 90 minutos para escuchar tu historia, revisar tus formularios y definir tu plan de acción.',
    descripcionCorta: '1 consulta de 90 min · historia, formularios y plan de acción.',
    incluye: ['Escucha de tu historia', 'Revisión de tus formularios', 'Plan de acción'],
    incluyeCheckout: ['Escucha de tu historia', 'Revisión de tus formularios', 'Plan de acción'],
    confirmacion: {
      titulo: '¡Listo, bienvenida!',
      texto:
        'Tu pago está confirmado. Agenda tu cita a continuación; recibirás The Layer Assessment por email antes de la cita.',
      calendlyUrl: 'https://calendly.com/veronicawellness/layer-session',
      calendlyEtiqueta: 'Calendly — Layer Session booking',
    },
  },
  INITIAL_LAYER_CYCLE: {
    id: 'INITIAL_LAYER_CYCLE',
    slug: 'initial-layer-cycle',
    nombre: 'Initial Layer Cycle',
    consultas: '2 consultas',
    etiqueta: 'Para nuevos clientes',
    etiquetaNota:
      'También aplica si tienes 6 meses o más sin asistir a una asesoría y necesitas plantear una nueva estrategia.',
    subtotal: 269,
    descripcion:
      'Dos sesiones privadas de 90 minutos, separadas ~30 días, a completar en un máximo de 60.',
    descripcionCorta:
      '2 sesiones privadas de 90 min · separación recomendada de aproximadamente 30 días · ciclo a completar dentro de 60 días.',
    incluye: [
      'The Layer Assessment',
      'The Layer Map — Alta Prioridad · Prioridad Secundaria · Mantenimiento',
      'Top 3 Priorities',
      'The Layer Plan',
      'The Layer Review',
    ],
    bonus: 'Incluye gratis la «Guía de alimentación anti-inflamatoria como estilo de vida».',
    incluyeCheckout: [
      'The Layer Assessment',
      'The Layer Map',
      'Top 3 Priorities',
      'The Layer Plan',
    ],
    confirmacion: {
      titulo: '¡Listo, bienvenida!',
      texto:
        'Tu Initial Layer Cycle está confirmado. Agenda tu primera sesión a continuación — recibirás The Layer Assessment por email antes de tu cita.',
      calendlyUrl: 'https://calendly.com/veronicawellness/layer-assessment',
      calendlyEtiqueta: 'Calendly — Layer Assessment booking',
    },
  },
  NEXT_LAYER_CYCLE: {
    id: 'NEXT_LAYER_CYCLE',
    slug: 'next-layer-cycle',
    nombre: 'Next Layer Cycle',
    consultas: '2 consultas de control',
    etiqueta: 'Tarifa de continuidad',
    subtotal: 210,
    descripcion:
      'Para quienes ya completaron su Initial Layer Cycle. Dos sesiones privadas de 90 minutos para continuar profundizando, revisar tu evolución y redefinir prioridades sin empezar de cero.',
    descripcionCorta: '2 sesiones privadas de 60-90 min · para clientes de seguimiento.',
    incluye: ['Revisión de tu evolución', 'Redefinición de prioridades', 'Layer Plan actualizado'],
    incluyeCheckout: [
      'Revisión de tu evolución',
      'Nuevas prioridades identificadas',
      'Layer Plan actualizado',
    ],
    notaPie:
      'Si tienes 6 meses o más sin asistir a una asesoría, deberás adquirir nuevamente el Initial Layer Cycle, ya que es necesario plantear tu estrategia desde cero.',
    confirmacion: {
      titulo: '¡Listo, seguimos!',
      texto: 'Tu Next Layer Cycle está confirmado. Agenda tu próxima sesión a continuación.',
      calendlyUrl: 'https://calendly.com/veronicawellness/next-layer-session',
      calendlyEtiqueta: 'Calendly — Next Layer session booking',
    },
  },
};

/** The two public offers, in card order: one appointment left, the new-patient cycle right. */
export const listaCiclos: Ciclo[] = [ciclos.LAYER_SESSION, ciclos.INITIAL_LAYER_CYCLE];

/** Existing patients: no public price, they write on Instagram (copy: Codex, 2026-10-03). */
export const continuidad = {
  etiqueta: 'Acceso privado',
  titulo: '¿Ya eres mi paciente?',
  texto:
    'Tus planes de continuidad no se publican. Escríbeme por Instagram y te los enviaré por correo para seguir trabajando conmigo.',
  boton: 'Escríbeme por Instagram',
  url: 'https://ig.me/m/verodudamell',
};

export function checkoutPath(ciclo: Ciclo): string {
  return `/checkout/${ciclo.slug}`;
}

/** Where the home's «Trabaja conmigo» buttons go: the new-client cycle (Mari, 2026-09-22). */
export const checkoutPrincipal = checkoutPath(ciclos.INITIAL_LAYER_CYCLE);

/** `$269`, as the cards print it. Tax shows only in the checkout (Mari, 2026-09-24). */
export function precioCard(ciclo: Ciclo): string {
  return `$${ciclo.subtotal}`;
}

export function precios(ciclo: Ciclo): Desglose {
  return desglose(ciclo.subtotal);
}

/** Zelle payee shown in the checkout, from Mari's prototype. */
export const zelle = {
  titular: 'VERODUD CORP',
  correo: 'veronicadudamell@gmail.com',
};
