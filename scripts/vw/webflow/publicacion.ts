import type { Sitio } from './conexion.ts';
import { coleccionesCms } from './esquema.ts';
import { estadoProducto } from './productos.ts';
import type { ItemWf } from './tipos.ts';

const despues = (a: string | null | undefined, b: string | null | undefined) =>
  !!a && (!b || Date.parse(a) > Date.parse(b));

const fueraDeLinea = (i: ItemWf) => i.isDraft || i.isArchived;

export function itemsSinPublicar(coleccion: string, vivos: ItemWf[], borradores: ItemWf[]) {
  const vivosPorId = new Map(vivos.map((i) => [i.id, i]));
  const enBorrador = new Set(borradores.map((i) => i.id));
  const cambiados = borradores
    .filter((b) => {
      const v = vivosPorId.get(b.id);
      return v ? despues(b.lastUpdated, v.lastUpdated) : !fueraDeLinea(b);
    })
    .map((b) => `${coleccion}/${b.fieldData.slug}`);
  const borrados = vivos
    .filter((v) => !enBorrador.has(v.id))
    .map((v) => `${coleccion}/${v.fieldData.slug} (borrado)`);
  return [...cambiados, ...borrados];
}

export function sitioSinPublicar(sitio: {
  lastUpdated?: string | null;
  lastPublished?: string | null;
}): string[] {
  return despues(sitio.lastUpdated, sitio.lastPublished)
    ? [`sitio: cambios del ${sitio.lastUpdated} sin publicar (Designer, páginas o ajustes)`]
    : [];
}

export async function pendientesDePublicar({ api, colecciones }: Sitio): Promise<string[]> {
  const pendientes = sitioSinPublicar(await api.sitio());
  for (const p of await api.productos())
    if (estadoProducto(p) === 'pendiente') pendientes.push(`productos/${p.product.fieldData.slug}`);
  for (const e of coleccionesCms()) {
    const c = colecciones.get(e.coleccion);
    if (c)
      pendientes.push(
        ...itemsSinPublicar(e.coleccion, await api.items(c.id, true), await api.items(c.id))
      );
  }
  return pendientes;
}

export function avisoPendientes(pendientes: string[], aplicar: boolean): string {
  const lista = `${pendientes.length} cambio(s) en Webflow sin publicar: ${pendientes.slice(0, 10).join(', ')}`;
  return aplicar
    ? `No se aplica nada. ${lista}. --aplicar publica el sitio entero y los publicaría también: publícalos o descártalos en Webflow y repite.`
    : `Aviso: ${lista}. --aplicar se negaría hasta que se publiquen o se descarten.`;
}
