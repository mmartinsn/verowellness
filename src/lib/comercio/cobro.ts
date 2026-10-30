import { conImpuesto, impuestoCentavos, TAX_RATE } from '../precio.ts';
import { destinoDeProductos, type ProductoGracias } from './confirmacion.ts';
import { escribirItems, type Linea } from './reglas.ts';
import { limpiarCupon } from './traspaso.ts';

export interface ProductoCobro extends ProductoGracias {
  nombre: string;
  precio: number;
  enviable: boolean;
}

export type CatalogoCobro = Record<string, ProductoCobro>;

export interface OpcionesCobro {
  volver: string;
  cancelar: string;
  email?: string;
  cupon?: string;
}

export const NOMBRE_IMPUESTO = `Impuesto (${Math.round(TAX_RATE * 100)} %)`;

export const impuestoDe = (lineas: Linea[], catalogo: CatalogoCobro): number =>
  impuestoCentavos(
    lineas.reduce((suma, l) => {
      const p = catalogo[l.producto];
      return conImpuesto(p?.tipo) ? suma + p.precio * l.cantidad : suma;
    }, 0)
  );

export function urlDeVuelta(desde: string | null, volver: string): string {
  const base = new URL(volver);
  if (!desde || !/^\/(?!\/)[a-z0-9\-/]*$/.test(desde)) return base.toString();
  const url = new URL(desde, base);
  return url.origin === base.origin ? url.toString() : base.toString();
}

export function sesionKlarna(
  lineas: Linea[],
  catalogo: CatalogoCobro,
  opciones: OpcionesCobro
): URLSearchParams | null {
  const productos = lineas.map((l) => catalogo[l.producto]);
  if (!productos.length || productos.some((p) => !p)) return null;
  const destino = destinoDeProductos(productos, []);
  if (!destino) return null;
  const items = escribirItems(lineas);
  const sesion = new URLSearchParams({
    mode: 'payment',
    locale: 'es-419',
    'payment_method_types[0]': 'klarna',
    success_url: new URL(destino, opciones.volver).toString(),
    cancel_url: opciones.cancelar,
    'metadata[items]': items,
    'payment_intent_data[metadata][items]': items,
    'payment_intent_data[description]': productos.map((p) => p.nombre).join(' · '),
  });
  lineas.forEach((l, i) => {
    const producto = catalogo[l.producto];
    const linea = `line_items[${i}]`;
    sesion.set(`${linea}[quantity]`, String(l.cantidad));
    sesion.set(`${linea}[price_data][currency]`, 'usd');
    sesion.set(`${linea}[price_data][unit_amount]`, String(producto.precio));
    sesion.set(`${linea}[price_data][product_data][name]`, producto.nombre);
    sesion.set(`${linea}[price_data][product_data][metadata][producto]`, l.producto);
  });
  const impuesto = impuestoDe(lineas, catalogo);
  if (impuesto > 0) {
    const linea = `line_items[${lineas.length}]`;
    sesion.set(`${linea}[quantity]`, '1');
    sesion.set(`${linea}[price_data][currency]`, 'usd');
    sesion.set(`${linea}[price_data][unit_amount]`, String(impuesto));
    sesion.set(`${linea}[price_data][product_data][name]`, NOMBRE_IMPUESTO);
    sesion.set(`${linea}[price_data][product_data][metadata][producto]`, 'impuesto');
  }
  if (productos.some((p) => p.enviable))
    sesion.set('shipping_address_collection[allowed_countries][0]', 'US');
  if (opciones.email) sesion.set('customer_email', opciones.email);
  const cupon = limpiarCupon(opciones.cupon ?? '');
  if (cupon) sesion.set('metadata[cupon]', cupon);
  return sesion;
}
