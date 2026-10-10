import { ApiWebflow } from './api.ts';
import { ClienteWebflow, credenciales } from './cliente.ts';
import { SLUG_CATEGORIAS, SLUG_PRODUCTOS, SLUG_SKUS } from './esquema.ts';
import type { ColeccionWf } from './tipos.ts';

export interface Sitio {
  api: ApiWebflow;
  colecciones: Map<string, ColeccionWf>;
  productos: ColeccionWf;
  skus: ColeccionWf;
  categorias: ColeccionWf;
}

export const conectar = () => new ApiWebflow(new ClienteWebflow(credenciales()));

export async function leerSitio(api = conectar()): Promise<Sitio> {
  const lista = await api.colecciones();
  const colecciones = new Map(lista.map((c) => [c.slug, c]));
  const requerida = (slug: string) => {
    const c = colecciones.get(slug);
    if (!c) throw new Error(`El sitio no tiene la colección ${slug}: ¿está activado Ecommerce?`);
    return c;
  };
  return {
    api,
    colecciones,
    productos: requerida(SLUG_PRODUCTOS),
    skus: requerida(SLUG_SKUS),
    categorias: requerida(SLUG_CATEGORIAS),
  };
}
