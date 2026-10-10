export type Modulo = Record<string, unknown>;
export type Fuente = (nombre: string) => Promise<Modulo>;
type Entradas = (modulo: Modulo, otro: Fuente) => Promise<unknown[]> | unknown[];

const ciclos = (m: Modulo) => Object.values(m.ciclos as Record<string, unknown>);

export const ENTRADAS: Record<string, Record<string, Entradas>> = {
  examenes: {
    productoDe: (m) => m.examenes as unknown[],
    examenesDeArea: (m) => (m.areas as { id: string }[]).map((a) => a.id),
  },
  oferta: { checkoutPath: ciclos, precioCard: ciclos, precios: ciclos },
  sintomas: {
    paraQuien: async (_m, otro) => (await otro('examenes')).examenes as unknown[],
    examenesDe: (m) => (m.sintomas as { grupos: unknown[] }[]).flatMap((s) => s.grupos),
    totalExamenes: (m) => m.sintomas as unknown[],
  },
  tienda: {
    precioTienda: (m) => [
      0,
      1,
      9.99,
      24.5,
      ...(m.productos as { precio: number }[]).map((p) => p.precio),
    ],
  },
};

export const EXPORTS_NUEVOS: Record<string, string[]> = {
  site: ['comercio'],
  testimonios: ['testimoniosAsesorias'],
};
