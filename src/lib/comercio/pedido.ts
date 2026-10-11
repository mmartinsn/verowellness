import { escribirItems, type Linea } from './reglas.ts';

export type ModoComercio = 'prototipo' | 'webflow';

export interface Comercio {
  modo: ModoComercio;
  pago: string;
}

export interface MapaProductos {
  ciclos: Record<string, string>;
  examenes: Record<string, string>;
  guias: Record<string, { producto: string; oferta?: string }>;
}

export interface Seleccion {
  ciclo?: string;
  items: string[];
  guias: { id: string; oferta: boolean }[];
  lectura?: string;
}

export function productosDe(seleccion: Seleccion, mapa: MapaProductos): string[] {
  const deItem = (id: string) => mapa.examenes[id] ?? mapa.guias[id]?.producto;
  const deGuia = (g: { id: string; oferta: boolean }) =>
    g.oferta ? mapa.guias[g.id]?.oferta : mapa.guias[g.id]?.producto;
  return [
    seleccion.ciclo && mapa.ciclos[seleccion.ciclo],
    ...seleccion.items.map(deItem),
    ...seleccion.guias.map(deGuia),
    seleccion.lectura && mapa.ciclos[seleccion.lectura],
  ].filter((p): p is string => !!p);
}

export function urlPedido(comercio: Comercio, productos: string[]): string {
  const lineas: Linea[] = [...new Set(productos)].map((producto) => ({ producto, cantidad: 1 }));
  const url = new URL('/pedido', comercio.pago);
  url.searchParams.set('items', escribirItems(lineas));
  return url.toString();
}
