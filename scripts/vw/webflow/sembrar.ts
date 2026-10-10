import type { Campo } from '../../../src/modelo/campos.ts';
import type { Entidad, RegistroLibre } from '../../../src/modelo/entidad.ts';
import { entidadPorClave } from '../../../src/modelo/esquema.ts';
import { ordenTopologico } from '../../../src/modelo/orden.ts';
import type { Tabla } from '../comun/snapshot.ts';
import type { Sitio } from './conexion.ts';
import { aWebflow, type Indices } from './convertir.ts';
import { camposDeseados, coleccionesCms, slugColeccion } from './esquema.ts';
import { mismaImagen, subirImagen } from './imagenes.ts';
import { diferencias, productoAWebflow } from './productos.ts';
import type { ImagenWf, ItemWf } from './tipos.ts';
import { camposDistintos } from './valores.ts';

export interface Resumen {
  coleccion: string;
  crear: number;
  actualizar: number;
  iguales: number;
  sobrantes: string[];
}

const nuevoResumen = (coleccion: string): Resumen => ({
  coleccion,
  crear: 0,
  actualizar: 0,
  iguales: 0,
  sobrantes: [],
});

const destinoDe = (c: Campo) =>
  c.tipo === 'referencia' || c.tipo === 'referencias'
    ? slugColeccion(entidadPorClave(c.entidad))
    : '';

function indices(items: Map<string, ItemWf[]>): Indices {
  const idPorSlug = new Map<string, Map<string, string>>();
  const slugPorId = new Map<string, string>();
  for (const [coleccion, lista] of items) {
    idPorSlug.set(coleccion, new Map(lista.map((i) => [i.fieldData.slug, i.id])));
    for (const i of lista) slugPorId.set(i.id, i.fieldData.slug);
  }
  return { idPorSlug, slugPorId };
}

async function sembrarProductos(sitio: Sitio, tabla: Tabla, aplicar: boolean): Promise<Resumen> {
  const { api } = sitio;
  const resumen = nuevoResumen('productos');
  const categorias = await api.items(sitio.categorias.id);
  const porCategoria = new Map(categorias.map((c) => [c.fieldData.slug, c.id]));
  const actuales = new Map((await api.productos()).map((p) => [p.product.fieldData.slug, p]));
  for (const p of tabla.producto) {
    const deseado = productoAWebflow(p, porCategoria);
    const actual = actuales.get(p.id);
    if (!actual) {
      resumen.crear++;
      if (aplicar)
        await api.crearProducto({
          product: { fieldData: deseado.producto },
          sku: { fieldData: deseado.sku },
        });
      continue;
    }
    const sku = actual.skus[0];
    const dp = diferencias(actual.product.fieldData, deseado.producto);
    const ds = diferencias(sku?.fieldData ?? {}, deseado.sku);
    if (dp.length === 0 && ds.length === 0) {
      resumen.iguales++;
      continue;
    }
    resumen.actualizar++;
    if (!aplicar) continue;
    if (dp.length) await api.actualizarProducto(actual.product.id, deseado.producto);
    if (ds.length && sku) await api.actualizarSku(actual.product.id, sku.id, deseado.sku);
  }
  const canonicos = new Set(tabla.producto.map((p) => p.id));
  resumen.sobrantes = [...actuales.keys()].filter((slug) => !canonicos.has(slug));
  return resumen;
}

async function leerItems(sitio: Sitio): Promise<Map<string, ItemWf[]>> {
  const items = new Map<string, ItemWf[]>();
  const productos = await sitio.api.productos();
  items.set(
    sitio.productos.slug,
    productos.map((p) => p.product)
  );
  for (const e of coleccionesCms()) {
    const c = sitio.colecciones.get(e.coleccion);
    items.set(e.coleccion, c ? await sitio.api.items(c.id) : []);
  }
  return items;
}

async function imagenesDeseadas(
  sitio: Sitio,
  e: Entidad,
  r: RegistroLibre,
  actual: ItemWf | undefined,
  aplicar: boolean
): Promise<Record<string, ImagenWf | null>> {
  const salida: Record<string, ImagenWf | null> = {};
  for (const d of camposDeseados(e)) {
    if (d.campo.tipo !== 'imagen') continue;
    const ruta = r[d.clave] as string | undefined;
    const presente = actual?.fieldData[d.slug] as ImagenWf | undefined;
    if (!ruta) {
      if (presente) salida[d.slug] = null;
      continue;
    }
    if (await mismaImagen(ruta, presente)) continue;
    salida[d.slug] = aplicar ? await subirImagen(sitio.api, ruta) : { fileId: '?', url: ruta };
  }
  return salida;
}

export async function sembrar(sitio: Sitio, tabla: Tabla, aplicar: boolean) {
  const resumenes = [await sembrarProductos(sitio, tabla, aplicar)];
  const orden = ordenTopologico(coleccionesCms());
  let items = await leerItems(sitio);
  const porColeccion = new Map(orden.map((e) => [e.coleccion, nuevoResumen(e.coleccion)]));

  for (const e of orden) {
    const coleccion = sitio.colecciones.get(e.coleccion);
    if (!coleccion)
      throw new Error(`Falta la colección ${e.coleccion}: corre antes vw esquema --aplicar`);
    const existentes = new Set((items.get(e.coleccion) ?? []).map((i) => i.fieldData.slug));
    const nuevos = (tabla[e.clave] ?? []).filter((r) => !existentes.has(r.id));
    porColeccion.get(e.coleccion)!.crear = nuevos.length;
    if (!aplicar || nuevos.length === 0) continue;
    const idx = indices(items);
    const cuerpos = [];
    for (const r of nuevos)
      cuerpos.push({
        fieldData: {
          ...aWebflow(e, r, coleccion, idx, destinoDe, 'creacion'),
          ...(await imagenesDeseadas(sitio, e, r, undefined, true)),
        },
      });
    const creados = await sitio.api.crearItems(coleccion.id, cuerpos);
    items.set(e.coleccion, [...(items.get(e.coleccion) ?? []), ...creados]);
    if (creados.length !== nuevos.length)
      throw new Error(
        `${e.coleccion}: se pidieron ${nuevos.length} ítems y Webflow devolvió ${creados.length}`
      );
  }

  if (aplicar) items = await leerItems(sitio);
  const idx = indices(items);
  for (const e of orden) {
    const coleccion = sitio.colecciones.get(e.coleccion)!;
    const resumen = porColeccion.get(e.coleccion)!;
    const actuales = new Map((items.get(e.coleccion) ?? []).map((i) => [i.fieldData.slug, i]));
    const cambios: { id: string; fieldData: Record<string, unknown> }[] = [];
    for (const r of tabla[e.clave] ?? []) {
      const actual = actuales.get(r.id);
      if (!actual) continue;
      let deseado: Record<string, unknown>;
      try {
        deseado = aWebflow(e, r, coleccion, idx, destinoDe, 'completo');
      } catch (error) {
        if (aplicar) throw error;
        resumen.actualizar++;
        continue;
      }
      const imagenes = await imagenesDeseadas(sitio, e, r, actual, aplicar);
      const distintos = [...camposDistintos(actual.fieldData, deseado), ...Object.keys(imagenes)];
      if (distintos.length === 0) {
        resumen.iguales++;
        continue;
      }
      resumen.actualizar++;
      cambios.push({ id: actual.id, fieldData: { ...deseado, ...imagenes } });
    }
    if (aplicar && cambios.length) await sitio.api.actualizarItems(coleccion.id, cambios);
    const canonicos = new Set((tabla[e.clave] ?? []).map((r) => r.id));
    resumen.sobrantes = [...actuales.keys()].filter((slug) => !canonicos.has(slug));
  }
  resumenes.push(...porColeccion.values());
  return resumenes;
}
