import type { Sitio } from './conexion.ts';
import { coleccionesCms } from './esquema.ts';
import type { ColeccionWf, ItemWf } from './tipos.ts';

export interface Lectura {
  vivos: Map<string, ItemWf[]>;
  borradores: Map<string, ItemWf[]>;
}

export interface Fechas {
  lastUpdated?: string | null;
  lastPublished?: string | null;
}

export type Paso = 'seco' | 'nada' | 'negar' | 'aplicar';

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

export function sitioSinPublicar(sitio: Fechas): string[] {
  return despues(sitio.lastUpdated, sitio.lastPublished)
    ? [`sitio: cambios del ${sitio.lastUpdated} sin publicar (Designer, páginas o ajustes)`]
    : [];
}

export function coleccionesLeidas(sitio: Sitio): ColeccionWf[] {
  const cms = coleccionesCms().map((e) => {
    const c = sitio.colecciones.get(e.coleccion);
    if (!c) throw new Error(`Falta la colección ${e.coleccion} en Webflow`);
    return c;
  });
  return [...cms, sitio.productos, sitio.skus];
}

export async function leerColecciones(sitio: Sitio): Promise<Lectura> {
  const vivos = new Map<string, ItemWf[]>();
  const borradores = new Map<string, ItemWf[]>();
  for (const c of coleccionesLeidas(sitio)) {
    vivos.set(c.slug, await sitio.api.items(c.id, true));
    borradores.set(c.slug, await sitio.api.items(c.id));
  }
  return { vivos, borradores };
}

export const sinPublicar = (fechas: Fechas, { vivos, borradores }: Lectura): string[] => [
  ...sitioSinPublicar(fechas),
  ...[...borradores.keys()].flatMap((slug) =>
    itemsSinPublicar(slug, vivos.get(slug) ?? [], borradores.get(slug) ?? [])
  ),
];

export const pendientesDePublicar = async (sitio: Sitio): Promise<string[]> =>
  sinPublicar(await sitio.api.sitio(), await leerColecciones(sitio));

export const decidir = (aplicar: boolean, escrituras: number, pendientes: number): Paso =>
  !aplicar ? 'seco' : escrituras === 0 ? 'nada' : pendientes > 0 ? 'negar' : 'aplicar';

export function avisoPendientes(pendientes: string[], aplicar: boolean): string {
  const lista = `${pendientes.length} cambio(s) en Webflow sin publicar: ${pendientes.slice(0, 10).join(', ')}`;
  return aplicar
    ? `No se aplica nada. ${lista}. --aplicar publica el sitio entero y los publicaría también: publícalos o descártalos en Webflow y repite.`
    : `Aviso: ${lista}. --aplicar se negaría hasta que se publiquen o se descarten.`;
}
