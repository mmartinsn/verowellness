import type { LineaPedido } from '../../lib/precio';

export const EVENTO_EXTRA = 'checkout:extra';
export const EVENTO_QUITADO = 'checkout:quitado';
export const EVENTO_CARRITO = 'checkout:carrito';

export interface DetalleExtra {
  grupo: string;
  lineas: LineaPedido[];
}

export interface DetalleQuitado {
  grupo: string;
  id: string;
}

export interface DetalleCarrito {
  ids: string[];
}

export function raizCheckout(): HTMLElement | null {
  return document.getElementById('checkout');
}

export function emitir<T>(nombre: string, detalle: T): void {
  raizCheckout()?.dispatchEvent(new CustomEvent<T>(nombre, { detail: detalle }));
}

export function escuchar<T>(nombre: string, fn: (detalle: T) => void): void {
  raizCheckout()?.addEventListener(nombre, (e) => fn((e as CustomEvent<T>).detail));
}

export function alCarrito(fn: (ids: string[]) => void): void {
  const raiz = raizCheckout();
  if (raiz?.dataset.ids) {
    fn(JSON.parse(raiz.dataset.ids));
    return;
  }
  escuchar<DetalleCarrito>(EVENTO_CARRITO, (d) => fn(d.ids));
}
