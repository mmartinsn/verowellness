import { bloque, bloques } from '../lib/datos/bloques';

/**
 * Thank-you pages (TYP), one per product (Mari, 2026-10-11). Copy: Codex, from Verónica's
 * policies; it lives in Textos de sección › checkout › gracias-*.
 */
export const pasosAsesoria = bloques('checkout', 'gracias-pasos').map((b) => ({
  titulo: b.titulo as string,
  texto: b.texto as string,
}));

const examenes = bloque('checkout', 'gracias-examenes');
export const graciasExamenes = {
  titulo: examenes.titulo as string,
  texto: examenes.texto as string,
  lectura: examenes.nota as string,
  /** What happens after paying: the order steps from the Exámenes page, minus «Elige y paga». */
  pasos: bloques('examenes', 'pasos-pedido')
    .slice(1)
    .map((b) => ({ titulo: b.titulo as string, texto: b.texto as string })),
};

const tienda = bloque('checkout', 'gracias-tienda');
export const graciasTienda = { titulo: tienda.titulo as string, texto: tienda.texto as string };

export const textoBonus = bloque('checkout', 'gracias-bonus').texto as string;

/** Zelle is verified by hand: the same words the checkout uses. */
export const zellePendiente =
  'Verificaremos tu pago por Zelle en las próximas 24–48h y te contactaremos por email.';
