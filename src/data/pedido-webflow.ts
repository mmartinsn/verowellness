import type { MapaProductos } from '../lib/comercio/pedido';
import { todos } from '../lib/datos/canonico';
import { conImpuesto, desdeCentavos } from '../lib/precio';
import { campanas } from './campanas';
import { examenes, productoDe } from './examenes';
import { ciclos } from './oferta';

const tipoDe = new Map(todos('producto').map((p) => [p.id, p.tipo]));

export const productoGravado = (producto: string | undefined): boolean =>
  conImpuesto(producto ? tipoDe.get(producto) : undefined);

export const mapaProductos: MapaProductos = {
  ciclos: Object.fromEntries(Object.values(ciclos).map((c) => [c.id, c.slug])),
  examenes: Object.fromEntries(examenes.map((e) => [e.id, productoDe(e)])),
  guias: Object.fromEntries(
    todos('guia').map((g) => [
      g.id,
      { producto: g.producto, ...(g.oferta ? { oferta: g.oferta } : {}) },
    ])
  ),
};

export interface CampanaCheckout {
  codigo: string;
  inicio: string;
  fin: string;
  examenes: Record<string, number>;
  lectura: Record<string, number>;
  regalo?: string;
}

const productoPorId = new Map(todos('producto').map((p) => [p.id, p]));

const preciosDeCampana = (
  cambios: { de: string; a: string }[],
  mapa: Record<string, string>
): Record<string, number> =>
  Object.fromEntries(
    cambios.flatMap(({ de, a }) =>
      Object.entries(mapa)
        .filter(([, producto]) => producto === de)
        .map(([id]) => [id, desdeCentavos(Number(productoPorId.get(a)?.precio))])
    )
  );

export const campanasCheckout: CampanaCheckout[] = campanas.map((c) => ({
  codigo: c.codigo,
  inicio: c.inicio,
  fin: c.fin,
  examenes: preciosDeCampana(c.cambios, mapaProductos.examenes),
  lectura: preciosDeCampana(c.cambios, mapaProductos.ciclos),
  ...(c.regalo ? { regalo: String(productoPorId.get(c.regalo)?.nombre) } : {}),
}));
