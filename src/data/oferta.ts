/**
 * The 1:1 offer: two cycles, as priced in Mari's pages and checkout prototype.
 * Every price shown on the site derives from `subtotal` here — never typed twice.
 */
import { desglose, type Desglose } from '../lib/precio';

export type CicloId = 'LAYER_SESSION' | 'INITIAL_LAYER_CYCLE' | 'NEXT_LAYER_CYCLE';

export interface Ciclo {
  id: CicloId;
  slug: 'layer-session' | 'initial-layer-cycle' | 'next-layer-cycle';
  nombre: string;
  citas: 1 | 2;
  destacado: boolean;
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
    citas: 1,
    destacado: false,
    etiqueta: 'Una sola cita',
    subtotal: 197,
    descripcion:
      'Una sesión privada de 90 minutos: escuchamos tu historia, revisamos tus formularios y sales con un plan de acción.',
    descripcionCorta: '1 sesión privada de 90 min · plan de acción.',
    incluye: ['The Layer Assessment', 'Revisión de tu historia y tus objetivos', 'Plan de acción'],
    incluyeCheckout: ['The Layer Assessment', 'Plan de acción'],
    confirmacion: {
      titulo: '¡Listo, bienvenida!',
      texto:
        'Tu Layer Session está confirmada. Agenda tu cita a continuación — recibirás The Layer Assessment por email antes de tu cita.',
      calendlyUrl: 'https://calendly.com/veronicawellness/layer-session',
      calendlyEtiqueta: 'Calendly — Layer Session booking',
    },
  },
  INITIAL_LAYER_CYCLE: {
    id: 'INITIAL_LAYER_CYCLE',
    slug: 'initial-layer-cycle',
    nombre: 'Initial Layer Cycle',
    citas: 2,
    destacado: true,
    etiqueta: 'Para nuevos clientes',
    etiquetaNota:
      'También aplica si tienes 6 meses o más sin asistir a una asesoría y necesitas plantear una nueva estrategia.',
    subtotal: 247,
    descripcion:
      'Dos sesiones privadas de 90 minutos, separadas ~30 días, a completar en un máximo de 60.',
    descripcionCorta:
      '2 sesiones privadas de 90 min · separación recomendada de aproximadamente 30 días · ciclo a completar dentro de 60 días.',
    incluye: [
      'The Layer Assessment',
      'The Layer Map: Alta Prioridad · Prioridad Secundaria · Mantenimiento',
      'Top 3 Priorities',
      'The Layer Plan',
      'The Layer Review',
    ],
    bonus: 'Pacientes nuevos: «Guía de alimentación anti-inflamatoria como estilo de vida» gratis.',
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
    citas: 2,
    destacado: false,
    etiqueta: 'Tarifa de continuidad',
    subtotal: 197,
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

export const listaCiclos: Ciclo[] = [ciclos.LAYER_SESSION, ciclos.INITIAL_LAYER_CYCLE];

export const continuidad = {
  etiqueta: 'Acceso exclusivo',
  titulo: 'Next Layer Cycle',
  texto:
    'Al completar tu Initial Layer Cycle te llega por correo tu invitación al Next Layer Cycle, con la tarifa preferencial reservada para quienes ya trabajan sus capas conmigo.',
};

export function rotuloCitas(ciclo: Ciclo): string {
  return ciclo.citas === 1 ? '1 cita' : `${ciclo.citas} citas`;
}

export function checkoutPath(ciclo: Ciclo): string {
  return `/checkout/${ciclo.slug}`;
}

/** Where the home's «Trabaja conmigo» buttons go: the new-client cycle (Mari, 2026-09-22). */
export const checkoutPrincipal = checkoutPath(ciclos.INITIAL_LAYER_CYCLE);

/** `$247`, as the cards print it. Tax shows only in the checkout (Mari, 2026-09-24). */
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
