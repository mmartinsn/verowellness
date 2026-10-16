import { createHash } from 'node:crypto';
import path from 'node:path';
import type { CatalogoCobro } from '../../../src/lib/comercio/cobro.ts';
import { RUTA_COBRO } from '../../../src/lib/comercio/pedido.ts';
import { PAGO } from '../../../src/lib/despliegue.ts';
import type { Tabla } from '../comun/snapshot.ts';
import { productoGracias } from './confirmacion.ts';
import { sinImports } from './inyectable.ts';
import type { ItemPedido } from './pedidos.ts';
import { catalogoDe, estiloDeEstado, TEXTOS } from './puente.ts';

export const ARCHIVO_COBRO = path.resolve('cobro', 'src', 'generado.ts');

const FUENTES = [
  'src/lib/comercio/reglas.ts',
  'src/lib/comercio/confirmacion.ts',
  'src/lib/comercio/traspaso.ts',
  'src/lib/comercio/cobro.ts',
];

export function catalogoCobro(tabla: Tabla): CatalogoCobro {
  const gracias = productoGracias(tabla);
  return Object.fromEntries(
    tabla.producto.map((p) => [
      p.id,
      {
        ...gracias(p),
        nombre: p.nombre as string,
        precio: p.precio as number,
        enviable: p.enviable === true,
      },
    ])
  );
}

export function generarCobro(tabla: Tabla, volver: string): string {
  const cuerpo = [
    `export const VOLVER = ${JSON.stringify(volver)};`,
    `export const TEXTOS = ${JSON.stringify(TEXTOS, null, 2)};`,
    `export const ESTILO = ${JSON.stringify(estiloDeEstado())};`,
    `export const CATALOGO = ${JSON.stringify(catalogoDe(tabla), null, 2)};`,
    `export const PRODUCTOS: CatalogoCobro = ${JSON.stringify(catalogoCobro(tabla), null, 2)};`,
    ...FUENTES.map(sinImports),
  ].join('\n\n');
  const version = createHash('sha256').update(cuerpo).digest('hex').slice(0, 16);
  return `export const VERSION = '${version}';\n\n${cuerpo}\n`;
}

export const versionDe = (generado: string) =>
  generado.match(/^export const VERSION = '([0-9a-f]+)';/)?.[1] ?? null;

export const URL_VERSION = `${PAGO}${RUTA_COBRO}/version`;

export interface Desplegado {
  version: string;
  stripe: 'prueba' | 'real' | null;
}

export async function versionDesplegada(url = URL_VERSION): Promise<Desplegado | null> {
  const r = await fetch(url, { headers: { Accept: 'application/json' } }).catch(() => null);
  if (!r?.ok || !r.headers.get('content-type')?.includes('json')) return null;
  return (await r.json()) as Desplegado;
}

export interface SesionStripe {
  id: string;
  created: number;
  amount_subtotal: number | null;
  metadata?: { items?: string };
  payment_method_types?: string[];
}

export async function sesionesKlarna(clave: string, desde: Date): Promise<SesionStripe[]> {
  const sesiones: SesionStripe[] = [];
  let despues: string | undefined;
  for (;;) {
    const q = new URLSearchParams({
      status: 'complete',
      limit: '100',
      'created[gte]': String(Math.floor(desde.getTime() / 1000)),
      ...(despues ? { starting_after: despues } : {}),
    });
    const r = await fetch(`https://api.stripe.com/v1/checkout/sessions?${q}`, {
      headers: { Authorization: `Bearer ${clave}` },
    });
    if (!r.ok) throw new Error(`Stripe ${r.status}: ${(await r.text()).slice(0, 200)}`);
    const pagina = (await r.json()) as { data: SesionStripe[]; has_more: boolean };
    sesiones.push(...pagina.data);
    if (!pagina.has_more || !pagina.data.length) break;
    despues = pagina.data[pagina.data.length - 1].id;
  }
  return sesiones.filter((s) => s.payment_method_types?.includes('klarna'));
}

export const itemsDeSesion = (s: SesionStripe): ItemPedido[] =>
  (s.metadata?.items ?? '')
    .split(',')
    .filter(Boolean)
    .map((parte) => {
      const [productSlug, cantidad] = parte.split(':');
      return { productSlug, count: Number(cantidad ?? 1) };
    });

export function diferenciaDePrecio(s: SesionStripe, productos: CatalogoCobro): string | null {
  const esperado = itemsDeSesion(s).reduce(
    (suma, i) => suma + (productos[i.productSlug]?.precio ?? NaN) * i.count,
    0
  );
  return esperado === s.amount_subtotal
    ? null
    : `cobrado ${s.amount_subtotal} centavos, el snapshot da ${esperado}`;
}
