import type { RegistroLibre } from '../../../src/modelo/entidad.ts';
import { entidadPorClave } from '../../../src/modelo/esquema.ts';
import { normalizar } from '../../../src/modelo/serializar.ts';
import { CATEGORIAS } from './esquema.ts';
import type { ItemWf, PrecioWf, ProductoWf } from './tipos.ts';

export interface Deseado {
  producto: Record<string, unknown>;
  sku: Record<string, unknown>;
}

export function productoAWebflow(p: RegistroLibre, categoria: Map<string, string>): Deseado {
  const cat = categoria.get(CATEGORIAS[p.tipo as string].slug);
  if (!cat) throw new Error(`Falta la categoría de ${p.tipo}`);
  return {
    producto: {
      name: p.nombre,
      slug: p.id,
      description: (p.descripcion as string | undefined) ?? '',
      shippable: Boolean(p.enviable),
      'tax-category': p.impuesto,
      category: [cat],
    },
    sku: {
      name: p.nombre,
      slug: p.id,
      price: { value: p.precio, unit: 'USD', currency: 'USD' },
      sku: p.sku,
      'download-files': p.descarga ? [{ name: 'Descarga', url: p.descarga }] : [],
    },
  };
}

export function productoDesdeWebflow(
  item: ProductoWf,
  tipoPorCategoria: Map<string, string>
): RegistroLibre {
  const p = item.product.fieldData;
  const s = (item.skus[0]?.fieldData ?? {}) as ItemWf['fieldData'];
  const categorias = (p.category as string[] | undefined) ?? [];
  const tipo = categorias.map((id) => tipoPorCategoria.get(id)).find(Boolean) ?? '?sin-categoria';
  const descarga = (s['download-files'] as { url: string }[] | undefined)?.[0]?.url;
  return {
    id: p.slug,
    nombre: p.name,
    tipo,
    precio: (s.price as PrecioWf | undefined)?.value,
    impuesto: p['tax-category'],
    enviable: Boolean(p.shippable),
    sku: s.sku,
    descripcion: (p.description as string | undefined) || undefined,
    descarga: descarga || undefined,
  };
}

export type EstadoProducto = 'vivo' | 'pendiente' | 'fuera';

const sinPublicar = (i: ItemWf) =>
  !i.lastPublished || (!!i.lastUpdated && Date.parse(i.lastUpdated) > Date.parse(i.lastPublished));

export function estadoProducto(p: ProductoWf): EstadoProducto {
  const fueraDeLinea = p.product.isDraft || p.product.isArchived;
  if (!p.product.lastPublished && fueraDeLinea) return 'fuera';
  if (sinPublicar(p.product) || p.skus.some(sinPublicar)) return 'pendiente';
  return fueraDeLinea ? 'fuera' : 'vivo';
}

export function productosPublicados(
  productos: ProductoWf[],
  anteriores: readonly RegistroLibre[],
  tipoPorCategoria: Map<string, string>
): { registros: RegistroLibre[]; pendientes: string[] } {
  const previos = new Map(anteriores.map((r) => [r.id, r]));
  const registros: RegistroLibre[] = [];
  const pendientes: string[] = [];
  for (const p of productos) {
    const slug = p.product.fieldData.slug;
    const estado = estadoProducto(p);
    if (estado === 'fuera') continue;
    if (estado === 'pendiente') {
      pendientes.push(`productos/${slug}`);
      const previo = previos.get(slug);
      if (previo) registros.push(previo);
      continue;
    }
    registros.push(
      normalizar(entidadPorClave('producto'), productoDesdeWebflow(p, tipoPorCategoria))
    );
  }
  return { registros, pendientes };
}

const igual = (a: unknown, b: unknown) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);

export function diferencias(actual: Record<string, unknown>, deseado: Record<string, unknown>) {
  return Object.keys(deseado).filter((k) => {
    if (k === 'price')
      return (actual.price as PrecioWf | undefined)?.value !== (deseado.price as PrecioWf).value;
    if (k === 'download-files')
      return !igual(
        ((actual[k] as { url: string; name: string }[]) ?? []).map(({ name, url }) => ({
          name,
          url,
        })),
        deseado[k]
      );
    return !igual(actual[k] ?? (k === 'description' ? '' : null), deseado[k]);
  });
}
