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
  'pedido-webflow': {
    productoGravado: (m) => {
      const mapa = m.mapaProductos as {
        ciclos: Record<string, string>;
        examenes: Record<string, string>;
        guias: Record<string, { producto: string; oferta?: string }>;
      };
      return [
        ...Object.values(mapa.ciclos),
        ...Object.values(mapa.examenes),
        ...Object.values(mapa.guias).flatMap((g) => [g.producto, g.oferta]),
        'cargo-laboratorio',
      ];
    },
  },
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
  'pedido-webflow': ['productoGravado(…)'],
  site: ['comercio'],
  testimonios: ['testimoniosAsesorias'],
};
