import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import type { CampoImagen } from '../../../src/modelo/campos.ts';
import type { RegistroLibre } from '../../../src/modelo/entidad.ts';
import { entidadPorClave } from '../../../src/modelo/esquema.ts';
import { normalizar } from '../../../src/modelo/serializar.ts';
import type { Tabla } from '../comun/snapshot.ts';
import type { Sitio } from './conexion.ts';
import { desdeWebflow, type Indices } from './convertir.ts';
import { CATEGORIAS, coleccionesCms, faltantes, planEsquema } from './esquema.ts';
import { CARPETA_ASSETS, descargar, md5 } from './imagenes.ts';
import { productosPublicados } from './productos.ts';
import { itemsSinPublicar } from './publicacion.ts';
import type { ImagenWf, ItemWf } from './tipos.ts';

const PRESENTACIONES = ['asesoria', 'guia', 'examen'];

export interface ResultadoBajada {
  tabla: Tabla;
  imagenes: Map<string, Buffer>;
  sinPublicar: string[];
}

const extension = (url: string) => {
  const ext = path.extname(new URL(url).pathname).toLowerCase();
  return ext === '.jpeg' ? '.jpg' : ext || '.jpg';
};

async function resolverImagen(
  carpeta: string,
  id: string,
  imagen: ImagenWf,
  anterior: string | undefined,
  imagenes: Map<string, Buffer>
): Promise<string> {
  const bytes = await descargar(imagen.url);
  if (anterior) {
    const local = path.join(CARPETA_ASSETS, anterior);
    if (existsSync(local) && md5(readFileSync(local)) === md5(bytes)) return anterior;
  }
  const ruta = `${carpeta}/${id}${extension(imagen.url)}`;
  imagenes.set(ruta, bytes);
  return ruta;
}

export async function bajar(sitio: Sitio, anterior: Tabla): Promise<ResultadoBajada> {
  const { api } = sitio;
  const categorias = await api.items(sitio.categorias.id);
  const faltan = faltantes(
    planEsquema(
      [...sitio.colecciones.values()],
      categorias.map((c) => c.fieldData)
    )
  );
  if (faltan.length)
    throw new Error(
      `A Webflow le falta lo que el modelo declara (${faltan.join(', ')}); corre vw esquema`
    );
  const productos = await api.productos();
  const vivos = new Map<string, ItemWf[]>();
  for (const e of coleccionesCms()) {
    const c = sitio.colecciones.get(e.coleccion);
    if (!c) throw new Error(`Falta la colección ${e.coleccion} en Webflow`);
    vivos.set(e.coleccion, await api.items(c.id, true));
  }
  const borradores = new Map<string, ItemWf[]>();
  for (const e of coleccionesCms())
    borradores.set(e.coleccion, await api.items(sitio.colecciones.get(e.coleccion)!.id));

  const slugPorId = new Map<string, string>();
  for (const p of productos) slugPorId.set(p.product.id, p.product.fieldData.slug);
  for (const lista of vivos.values()) for (const i of lista) slugPorId.set(i.id, i.fieldData.slug);
  const indices: Indices = { idPorSlug: new Map(), slugPorId };

  const tipoPorCategoria = new Map(
    categorias.map((c) => [
      c.id,
      Object.entries(CATEGORIAS).find(([, v]) => v.slug === c.fieldData.slug)?.[0] ?? '?',
    ])
  );
  const publicados = productosPublicados(productos, anterior.producto ?? [], tipoPorCategoria);
  const tabla: Tabla = { producto: publicados.registros };
  const nombrePorProducto = new Map(tabla.producto.map((p) => [p.id, p.nombre]));
  const imagenes = new Map<string, Buffer>();

  for (const e of coleccionesCms()) {
    const coleccion = sitio.colecciones.get(e.coleccion)!;
    const previos = new Map((anterior[e.clave] ?? []).map((r) => [r.id, r]));
    const registros: RegistroLibre[] = [];
    for (const item of vivos.get(e.coleccion) ?? []) {
      if (item.isArchived || item.isDraft) continue;
      const r = desdeWebflow(e, item, coleccion, indices);
      for (const [clave, campo] of Object.entries(e.campos)) {
        if (campo.tipo !== 'imagen' || r[clave] === undefined) continue;
        const previo = previos.get(r.id)?.[clave] as string | undefined;
        r[clave] = await resolverImagen(
          (campo as CampoImagen).carpeta,
          r.id,
          r[clave] as ImagenWf,
          previo,
          imagenes
        );
      }
      if (PRESENTACIONES.includes(e.clave) && nombrePorProducto.has(r.producto as string))
        r.nombre = nombrePorProducto.get(r.producto as string)!;
      registros.push(normalizar(entidadPorClave(e.clave), r));
    }
    tabla[e.clave] = registros;
  }

  const sinPublicar = [
    ...publicados.pendientes,
    ...coleccionesCms().flatMap((e) =>
      itemsSinPublicar(e.coleccion, vivos.get(e.coleccion) ?? [], borradores.get(e.coleccion) ?? [])
    ),
  ];
  return { tabla, imagenes, sinPublicar };
}

export function escribirImagenes(imagenes: Map<string, Buffer>) {
  for (const [ruta, bytes] of imagenes) {
    const archivo = path.join(CARPETA_ASSETS, ruta);
    mkdirSync(path.dirname(archivo), { recursive: true });
    writeFileSync(archivo, bytes);
  }
}

export function imagenesHuerfanas(tabla: Tabla, carpetas: readonly string[]): string[] {
  const usadas = new Set<string>();
  for (const [clave, registros] of Object.entries(tabla)) {
    const e = entidadPorClave(clave);
    for (const [k, c] of Object.entries(e.campos))
      if (c.tipo === 'imagen') for (const r of registros) if (r[k]) usadas.add(r[k] as string);
  }
  return carpetas.flatMap((carpeta) =>
    readdirSync(path.join(CARPETA_ASSETS, carpeta))
      .map((f) => `${carpeta}/${f}`)
      .filter((ruta) => !usadas.has(ruta))
  );
}
