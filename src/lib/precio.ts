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

const formatoUsd = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function usd(n: number): string {
  return `$${formatoUsd.format(n)}`;
}

export const DESCUENTO_GUIAS = 0.15;
export const FEE_SERVICIO = 15;
export const FEE_AUTORIZACION = 10;
export const FEE_POR_EXAMEN = FEE_SERVICIO + FEE_AUTORIZACION;

export function conDescuento(precio: number, descuento = DESCUENTO_GUIAS): number {
  return redondear(precio * (1 - descuento));
}

export type TipoLinea = 'base' | 'producto' | 'examen' | 'guia' | 'cita';

export interface LineaPedido {
  id: string;
  nombre: string;
  precio: number;
  tipo: TipoLinea;
  precioLista?: number;
  grupo?: string;
}

export interface TotalesPedido extends Desglose {
  examenes: number;
  fees: number;
}

export function totalesPedido(lineas: LineaPedido[], taxRate = TAX_RATE): TotalesPedido {
  const subtotal = redondear(lineas.reduce((suma, l) => suma + l.precio, 0));
  const impuesto = redondear(subtotal * taxRate);
  const examenes = lineas.filter((l) => l.tipo === 'examen').length;
  const fees = redondear(examenes * FEE_POR_EXAMEN);
  const total = redondear(subtotal + impuesto + fees);
  return { subtotal, impuesto, total, taxRate, examenes, fees };
}
