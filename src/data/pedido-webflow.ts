import type { MapaProductos } from '../lib/comercio/pedido';
import { todos } from '../lib/datos/canonico';
import { examenes, productoDe } from './examenes';
import { ciclos } from './oferta';

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
