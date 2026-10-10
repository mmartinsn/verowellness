import type { Sitio } from '../../scripts/vw/webflow/conexion.ts';
import {
  CATEGORIAS,
  camposDeseados,
  coleccionesCms,
  SLUG_CATEGORIAS,
  SLUG_PRODUCTOS,
  SLUG_SKUS,
} from '../../scripts/vw/webflow/esquema.ts';
import type { Fechas } from '../../scripts/vw/webflow/publicacion.ts';
import type { ColeccionWf, ItemWf } from '../../scripts/vw/webflow/tipos.ts';

export const T1 = '2026-10-10T08:00:00.000Z';
export const T2 = '2026-10-10T09:00:00.000Z';

export type CambiosItem = Omit<Partial<ItemWf>, 'fieldData'> & {
  fieldData?: Record<string, unknown>;
};

export const item = (id: string, cambios: CambiosItem = {}): ItemWf => ({
  id,
  lastUpdated: T1,
  lastPublished: T1,
  ...cambios,
  fieldData: { name: id, slug: id, ...cambios.fieldData },
});

export function colecciones(): ColeccionWf[] {
  return coleccionesCms().map((e) => ({
    id: e.coleccion,
    slug: e.coleccion,
    displayName: e.titulo,
    singularName: e.singular,
    fields: camposDeseados(e).map((d) => ({
      id: d.slug,
      slug: d.slug,
      displayName: d.etiqueta,
      type: d.tipo,
      isRequired: d.requerido,
      helpText: d.campo.ayuda,
      validations:
        d.campo.tipo === 'opcion'
          ? { options: d.campo.opciones.map((name) => ({ id: name, name })) }
          : null,
    })),
  }));
}

const coleccionPropia = (slug: string): ColeccionWf => ({
  id: slug,
  slug,
  displayName: slug,
  singularName: slug,
  fields: [],
});

export const categorias = () =>
  Object.values(CATEGORIAS).map(({ slug }) =>
    item(`cat-${slug}`, { fieldData: { name: slug, slug } })
  );

export interface Falso {
  sitio: Sitio;
  escrituras: string[];
}

export function webflowFalso(
  opciones: {
    fechas?: Fechas;
    vivos?: Record<string, ItemWf[]>;
    borradores?: Record<string, ItemWf[]>;
    colecciones?: ColeccionWf[];
    codigo?: string;
  } = {}
): Falso {
  const escrituras: string[] = [];
  const anota = (nombre: string) => async () => {
    escrituras.push(nombre);
    throw new Error(`escritura detenida: ${nombre}`);
  };
  const vivos = opciones.vivos ?? {};
  const borradores = opciones.borradores ?? vivos;
  const api = {
    c: { solicitudes: 0 },
    sitio: async () => opciones.fechas ?? { lastUpdated: T1, lastPublished: T1 },
    items: async (id: string, enVivo = false) =>
      id === SLUG_CATEGORIAS ? categorias() : ((enVivo ? vivos : borradores)[id] ?? []),
    productos: async () => [],
    paginas: async () => [{ id: 'p-pedido', slug: 'pedido', title: 'Pedido', draft: false }],
    codigoLibre: async () => opciones.codigo ?? 'versión vieja',
    escribirCodigoLibre: anota('escribirCodigoLibre'),
    publicarSitio: anota('publicarSitio'),
    crearProducto: anota('crearProducto'),
    actualizarProducto: anota('actualizarProducto'),
    actualizarSku: anota('actualizarSku'),
    crearItems: anota('crearItems'),
    actualizarItems: anota('actualizarItems'),
  };
  const lista = opciones.colecciones ?? colecciones();
  const sitio = {
    api,
    colecciones: new Map(lista.map((c) => [c.slug, c])),
    productos: coleccionPropia(SLUG_PRODUCTOS),
    skus: coleccionPropia(SLUG_SKUS),
    categorias: coleccionPropia(SLUG_CATEGORIAS),
  } as unknown as Sitio;
  return { sitio, escrituras };
}
