/**
 * Money helpers shared by the server-rendered price cards and the checkout script.
 * Amounts are USD. Since 2026-10-21 the 7 % is INCLUDED in the price of tests and consultations
 * (Mari and Verónica: «a todos los precios se les suma el 7 %», rounded to the dollar), so no type
 * carries tax on top: the checkout's tax row hides itself at 0 and Klarna adds no tax line.
 */
export const TAX_RATE = 0.07;

export const TIPOS_CON_IMPUESTO: readonly string[] = [];

export const conImpuesto = (tipo: string | undefined): boolean =>
  !!tipo && TIPOS_CON_IMPUESTO.includes(tipo);

export const impuestoCentavos = (baseCentavos: number): number =>
  Math.round(baseCentavos * TAX_RATE);

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

export function desglose(subtotal: number, taxRate = 0): Desglose {
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
