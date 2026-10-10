import { escribirItems, type Linea } from './reglas.ts';

export type ModoComercio = 'prototipo' | 'webflow';

export interface Comercio {
  modo: ModoComercio;
  pago: string;
}

export function urlPedido(comercio: Comercio, productos: string[]): string {
  const lineas: Linea[] = [...new Set(productos)].map((producto) => ({ producto, cantidad: 1 }));
  const url = new URL('/pedido', comercio.pago);
  url.searchParams.set('items', escribirItems(lineas));
  return url.toString();
}
