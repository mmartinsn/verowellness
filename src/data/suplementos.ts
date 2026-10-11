import { unico } from '../lib/datos/canonico';
import { bloque, bloques, items, texto } from '../lib/datos/bloques';

const ajustes = unico('ajustes');

/** Fullscript: where people buy (Verónica, change 50, 2026-10-10; it was Wholescripts). */
export const fullscript = {
  registro: ajustes.fullscriptRegistro,
  pendiente: ajustes.fullscriptPendiente,
};

/** Outside the USA, people write on Instagram (the same link as «¿Ya eres mi paciente?»). */
export const contactoFueraUsa = bloque('sitio', 'continuidad').enlace as string;

export const etiqueta = {
  si: items('suplementos', 'etiqueta-si'),
  no: items('suplementos', 'etiqueta-no'),
};

export const principios = bloques('suplementos', 'principios').map((b) => ({
  titulo: b.titulo as string,
  texto: b.texto as string,
}));

export const avisoSuplementos = texto('suplementos', 'aviso');

/**
 * What each Layer's bottle holds, by Layer number (Textos de sección › suplementos › frascos; the
 * order is the Layer). No product names on purpose (Verónica, change 49).
 */
export interface Frasco {
  intro?: string;
  items: string[];
  cierre?: string;
  /** Text of the «how to buy» link; absent hides it. */
  comprar?: string;
}

export const recomendaciones = Object.fromEntries(
  bloques('suplementos', 'frascos').map((b) => [
    String(b.orden).padStart(2, '0'),
    {
      intro: (b.texto as string | undefined) || undefined,
      items: (b.items as string[] | undefined) ?? [],
      cierre: (b.nota as string | undefined) || undefined,
      comprar: (b.enlaceTexto as string | undefined) || undefined,
    },
  ])
) as Record<'01' | '02' | '03' | '04' | '05', Frasco>;

/** The text under «El orden importa.» (Textos de sección › suplementos › orden). */
export const tipOrden = texto('suplementos', 'orden');
