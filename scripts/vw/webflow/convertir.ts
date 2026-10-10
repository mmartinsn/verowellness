import type { Campo } from '../../../src/modelo/campos.ts';
import type { Entidad, RegistroLibre } from '../../../src/modelo/entidad.ts';
import { camposDeseados } from './esquema.ts';
import type { ColeccionWf, ImagenWf, ItemWf } from './tipos.ts';

export interface Indices {
  idPorSlug: Map<string, Map<string, string>>;
  slugPorId: Map<string, string>;
}

export const opcionesDe = (c: ColeccionWf, slug: string) =>
  c.fields.find((f) => f.slug === slug)?.validations?.options ?? [];

const SEPARADOR = { lista: '\n', parrafos: '\n\n' } as const;

export function aWebflow(
  e: Entidad,
  r: RegistroLibre,
  coleccion: ColeccionWf,
  indices: Indices,
  destinoDe: (c: Campo) => string,
  modo: 'creacion' | 'completo'
): Record<string, unknown> {
  const fieldData: Record<string, unknown> = { name: r.nombre, slug: r.id };
  for (const d of camposDeseados(e)) {
    const v = r[d.clave];
    const c = d.campo;
    if (c.tipo === 'imagen') continue;
    if (c.tipo === 'referencias' && modo === 'creacion') continue;
    if (v === undefined) {
      fieldData[d.slug] = c.tipo === 'booleano' ? false : c.tipo === 'referencias' ? [] : null;
      continue;
    }
    switch (c.tipo) {
      case 'lista':
      case 'parrafos':
        fieldData[d.slug] = (v as string[]).join(SEPARADOR[c.tipo]);
        break;
      case 'opcion': {
        const op = opcionesDe(coleccion, d.slug).find((o) => o.name === v);
        if (!op) throw new Error(`${e.coleccion}.${d.slug}: la opción «${v}» no existe en Webflow`);
        fieldData[d.slug] = op.id;
        break;
      }
      case 'referencia':
      case 'referencias': {
        const mapa = indices.idPorSlug.get(destinoDe(c));
        const ids = (c.tipo === 'referencia' ? [v] : (v as string[])).map((slug) => {
          const id = mapa?.get(slug as string);
          if (!id)
            throw new Error(`${e.coleccion}/${r.id}.${d.clave}: «${slug}» no existe en Webflow`);
          return id;
        });
        fieldData[d.slug] = c.tipo === 'referencia' ? ids[0] : ids;
        break;
      }
      default:
        fieldData[d.slug] = v;
    }
  }
  return fieldData;
}

export function desdeWebflow(
  e: Entidad,
  item: ItemWf,
  coleccion: ColeccionWf,
  indices: Indices
): RegistroLibre {
  const f = item.fieldData;
  const r: RegistroLibre = { id: f.slug, nombre: f.name };
  for (const d of camposDeseados(e)) {
    const v = f[d.slug];
    const c = d.campo;
    const vacio = v === undefined || v === null || v === '';
    switch (c.tipo) {
      case 'lista':
      case 'parrafos':
        r[d.clave] = vacio ? [] : String(v).split(SEPARADOR[c.tipo]);
        break;
      case 'booleano':
        r[d.clave] = Boolean(v);
        break;
      case 'referencias':
        r[d.clave] = ((v as string[] | null) ?? []).map(
          (id) => indices.slugPorId.get(id) ?? `?${id}`
        );
        break;
      case 'referencia':
        if (!vacio) r[d.clave] = indices.slugPorId.get(v as string) ?? `?${v}`;
        break;
      case 'opcion':
        if (!vacio)
          r[d.clave] = opcionesDe(coleccion, d.slug).find((o) => o.id === v)?.name ?? `?${v}`;
        break;
      case 'imagen':
        if (!vacio) r[d.clave] = v as ImagenWf;
        break;
      default:
        if (!vacio) r[d.clave] = v;
    }
  }
  return r;
}
