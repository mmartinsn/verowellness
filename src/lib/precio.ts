/**
 * Money helpers shared by the server-rendered price cards and the checkout script.
 * Amounts are USD; the tax rate comes from Mari's checkout prototype (7 %).
 */
export const TAX_RATE = 0.07;

/** Round to cents the way the prototype did it (`Math.round(x * 100) / 100`). */
export function redondear(n: number): number {
  return Math.round(n * 100) / 100;
}

export interface Desglose {
  subtotal: number;
  impuesto: number;
  total: number;
  taxRate: number;
}

export function desglose(subtotal: number, taxRate = TAX_RATE): Desglose {
  const impuesto = redondear(subtotal * taxRate);
  const total = redondear(subtotal + impuesto);
  return { subtotal, impuesto, total, taxRate };
}

export function usd(n: number): string {
  return `$${n.toFixed(2)}`;
}

export const precioOferta = (centavos: number, descuento: number): number =>
  Math.round((centavos * (100 - descuento)) / 100);

export function desdeCentavos(centavos: number): number {
  return centavos / 100;
}

export function aCentavos(monto: number): number {
  return Math.round(monto * 100);
}
