/**
 * Money helpers shared by the server-rendered price cards and the checkout script.
 * Amounts are USD; the tax rate comes from Mari's checkout prototype (7 %).
 */
export const TAX_RATE = 0.07;

export const TIPOS_CON_IMPUESTO: readonly string[] = ['examen', 'asesoria'];

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
