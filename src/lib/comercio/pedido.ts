import { escribirItems, type Linea } from './reglas.ts';

export type ModoComercio = 'prototipo' | 'webflow';

export interface Comercio {
  modo: ModoComercio;
  pago: string;
  klarna?: boolean;
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

export const RUTA_COBRO = '/cobro';

function urlConItems(ruta: string, comercio: Comercio, productos: string[]): URL {
  const lineas: Linea[] = [...new Set(productos)].map((producto) => ({ producto, cantidad: 1 }));
  const url = new URL(ruta, comercio.pago);
  url.searchParams.set('items', escribirItems(lineas));
  return url;
}

export const urlPedido = (comercio: Comercio, productos: string[]) =>
  urlConItems('/pedido', comercio, productos).toString();

export function urlKlarna(comercio: Comercio, productos: string[], desde: string): string {
  const url = urlConItems(`${RUTA_COBRO}/klarna`, comercio, productos);
  url.searchParams.set('desde', desde);
  return url.toString();
}
