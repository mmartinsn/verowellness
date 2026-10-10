import { normalizarPedido, type Catalogo } from '../../../src/lib/comercio/reglas.ts';

export interface ItemPedido {
  productSlug: string;
  count: number;
}

export function diferenciasDePedido(items: ItemPedido[], catalogo: Catalogo): string[] {
  const reales = new Map<string, number>();
  for (const i of items) reales.set(i.productSlug, (reales.get(i.productSlug) ?? 0) + i.count);
  const esperados = new Map(
    normalizarPedido(
      [...reales.keys()].map((producto) => ({ producto, cantidad: 1 })),
      catalogo
    ).map((l) => [l.producto, l.cantidad])
  );
  return [...new Set([...reales.keys(), ...esperados.keys()])]
    .filter((slug) => (reales.get(slug) ?? 0) !== (esperados.get(slug) ?? 0))
    .map(
      (slug) => `${slug} ×${reales.get(slug) ?? 0} (el sitio arma ×${esperados.get(slug) ?? 0})`
    );
}
