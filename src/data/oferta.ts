import { desdeCentavos, desglose, type Desglose } from '../lib/precio';
import { todos, uno, type Fila } from '../lib/datos/canonico';
import { si } from '../lib/datos/forma';

export type CicloId = 'LAYER_SESSION' | 'INITIAL_LAYER_CYCLE' | 'NEXT_LAYER_CYCLE';

export interface Ciclo {
  id: CicloId;
  slug: 'layer-session' | 'initial-layer-cycle' | 'next-layer-cycle';
  nombre: string;
  consultas: string;
  etiqueta: string;
  etiquetaNota?: string;
  subtotal: number;
  descripcion: string;
  descripcionCorta: string;
  incluye: string[];
  incluyeCheckout: string[];
  notaPie?: string;
  bonus?: string;
  confirmacion: { titulo: string; texto: string; calendlyUrl: string; calendlyEtiqueta: string };
}

const aCiclo = (a: Fila<'asesoria'>): Ciclo => {
  const producto = uno('producto', a.producto);
  return {
    id: a.clave as CicloId,
    slug: a.id as Ciclo['slug'],
    nombre: producto.nombre,
    consultas: a.consultas,
    etiqueta: a.etiqueta,
    ...si('etiquetaNota', a.etiquetaNota),
    subtotal: desdeCentavos(producto.precio),
    descripcion: a.descripcion,
    descripcionCorta: a.descripcionCorta,
    incluye: a.incluye,
    ...si('bonus', a.bonus),
    incluyeCheckout: a.incluyeCheckout,
    ...si('notaPie', a.notaPie),
    confirmacion: {
      titulo: a.confirmacionTitulo,
      texto: a.confirmacionTexto,
      calendlyUrl: a.calendlyUrl,
      calendlyEtiqueta: a.calendlyEtiqueta,
    },
  };
};

const asesorias = todos('asesoria');

export const ciclos = Object.fromEntries(asesorias.map((a) => [a.clave, aCiclo(a)])) as Record<
  CicloId,
  Ciclo
>;

export const listaCiclos: Ciclo[] = asesorias
  .filter((a) => a.publica)
  .map((a) => ciclos[a.clave as CicloId]);

export const continuidad = {
  etiqueta: 'Acceso privado',
  titulo: '¿Ya eres mi paciente?',
  texto:
    'Next Layer Cycle está reservado para quienes ya completaron su primer ciclo conmigo. Escríbeme y te enviaré tus opciones por correo.',
  canales: [{ nombre: 'Instagram', url: 'https://ig.me/m/verodudamell' }],
};

export function checkoutPath(ciclo: Ciclo): string {
  return `/checkout/${ciclo.slug}`;
}

export const checkoutPrincipal = checkoutPath(ciclos.INITIAL_LAYER_CYCLE);

export function precioCard(ciclo: Ciclo): string {
  return `$${ciclo.subtotal}`;
}

export function precios(ciclo: Ciclo): Desglose {
  return desglose(ciclo.subtotal);
}

export const zelle = {
  titular: 'VERODUD CORP',
  correo: 'veronicadudamell@gmail.com',
};
