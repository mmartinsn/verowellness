import { bloques, items } from '../lib/datos/bloques';

/**
 * Terms of the 1:1 plans, accepted right before paying (Verónica's «Términos para aceptar antes
 * del pago», 2026-10-11; Textos de sección › checkout › terminos). `grupo` opens a group of points.
 */
export const terminos = bloques('checkout', 'terminos').map((b) => ({
  grupo: (b.etiqueta as string | undefined) || undefined,
  titulo: b.titulo as string,
  parrafos: (b.texto as string).split(/\n\n+/),
}));

/** The two mandatory checkboxes, in order: terms, then scope and precautions. */
export const casillas = items('checkout', 'consentimiento');
