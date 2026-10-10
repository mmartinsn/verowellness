import { desdeCentavos, desglose, type Desglose } from '../lib/precio';
import { todos, unico, uno, type Fila } from '../lib/datos/canonico';
import { bloque } from '../lib/datos/bloques';
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

const bloqueContinuidad = bloque('sitio', 'continuidad');

export const continuidad = {
  etiqueta: bloqueContinuidad.etiqueta as string,
  titulo: bloqueContinuidad.titulo as string,
  texto: bloqueContinuidad.texto as string,
  canales: [
    { nombre: bloqueContinuidad.enlaceTexto as string, url: bloqueContinuidad.enlace as string },
  ],
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

const ajustes = unico('ajustes');

export const zelle = {
  titular: ajustes.zelleTitular,
  correo: ajustes.zelleCorreo,
};
