import type { MapaProductos } from '../lib/comercio/pedido';
import { todos } from '../lib/datos/canonico';
import { conImpuesto } from '../lib/precio';
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
