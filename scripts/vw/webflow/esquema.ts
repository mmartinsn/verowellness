import type { Campo } from '../../../src/modelo/campos.ts';
import { siempreConValor } from '../../../src/modelo/campos.ts';
import type { Entidad } from '../../../src/modelo/entidad.ts';
import { entidadPorClave, entidadesDeContenido } from '../../../src/modelo/esquema.ts';
import { etiquetaAscii, etiquetaCampo, slugCampo } from '../../../src/modelo/etiquetas.ts';
import type { ApiWebflow, NuevoCampo } from './api.ts';
import type { ColeccionWf } from './tipos.ts';

export const TIPO_WEBFLOW: Record<Campo['tipo'], string> = {
  texto: 'PlainText',
  lista: 'PlainText',
  parrafos: 'PlainText',
  entero: 'Number',
  dinero: 'Number',
  booleano: 'Switch',
  opcion: 'Option',
  referencia: 'Reference',
  referencias: 'MultiReference',
  imagen: 'Image',
  enlace: 'Link',
  fecha: 'DateTime',
};

export const CATEGORIAS: Record<string, { slug: string; nombre: string }> = {
  asesoria: { slug: 'asesorias', nombre: 'Asesorías' },
  guia: { slug: 'guias', nombre: 'Guías' },
  examen: { slug: 'examenes', nombre: 'Exámenes' },
  oferta: { slug: 'ofertas', nombre: 'Ofertas' },
  cargo: { slug: 'cargos', nombre: 'Cargos' },
};

export const SLUG_PRODUCTOS = 'product';
export const SLUG_SKUS = 'sku';
export const SLUG_CATEGORIAS = 'category';

export interface CampoDeseado {
  clave: string;
  slug: string;
  etiqueta: string;
  ascii: string;
  campo: Campo;
  tipo: string;
  requerido: boolean;
}

export const coleccionesCms = (): Entidad[] =>
  entidadesDeContenido().filter((e) => e.almacen === 'cms');

export const slugColeccion = (e: Entidad): string =>
  e.almacen === 'comercio' ? SLUG_PRODUCTOS : e.coleccion;

export function camposDeseados(e: Entidad): CampoDeseado[] {
  return Object.entries(e.campos).map(([clave, campo]) => ({
    clave,
    slug: slugCampo(clave),
    etiqueta: etiquetaCampo(clave),
    ascii: etiquetaAscii(clave),
    campo,
    tipo: TIPO_WEBFLOW[campo.tipo],
    requerido: campo.requerido && !siempreConValor(campo),
  }));
}

export type Accion =
  | { tipo: 'crear-coleccion'; entidad: Entidad }
  | { tipo: 'crear-campo'; entidad: Entidad; campo: CampoDeseado }
  | {
      tipo: 'ajustar-campo';
      entidad: Entidad;
      campo: CampoDeseado;
      cambios: Record<string, unknown>;
    }
  | { tipo: 'crear-categoria'; slug: string; nombre: string }
  | { tipo: 'manual'; detalle: string }
  | { tipo: 'aviso'; detalle: string };

export function planEsquema(existentes: ColeccionWf[], categorias: { slug: string }[]): Accion[] {
  const porSlug = new Map(existentes.map((c) => [c.slug, c]));
  const acciones: Accion[] = [];
  for (const e of coleccionesCms()) {
    const actual = porSlug.get(e.coleccion);
    if (!actual) {
      acciones.push({ tipo: 'crear-coleccion', entidad: e });
      for (const campo of camposDeseados(e))
        acciones.push({ tipo: 'crear-campo', entidad: e, campo });
      continue;
    }
    const campos = new Map(actual.fields.map((f) => [f.slug, f]));
    for (const campo of camposDeseados(e)) {
      const f = campos.get(campo.slug);
      if (!f) {
        acciones.push({ tipo: 'crear-campo', entidad: e, campo });
        continue;
      }
      if (f.type !== campo.tipo) {
        acciones.push({
          tipo: 'manual',
          detalle: `${e.coleccion}.${campo.slug}: es ${f.type} en Webflow y el modelo pide ${campo.tipo}`,
        });
        continue;
      }
      const cambios: Record<string, unknown> = {};
      if (f.displayName !== campo.etiqueta) cambios.displayName = campo.etiqueta;
      if ((f.helpText ?? '') !== campo.campo.ayuda) cambios.helpText = campo.campo.ayuda;
      if (Boolean(f.isRequired) !== campo.requerido) cambios.isRequired = campo.requerido;
      if (Object.keys(cambios).length)
        acciones.push({ tipo: 'ajustar-campo', entidad: e, campo, cambios });
      if (campo.campo.tipo === 'opcion') {
        const tiene = new Set((f.validations?.options ?? []).map((o) => o.name));
        const faltan = campo.campo.opciones.filter((o) => !tiene.has(o));
        if (faltan.length)
          acciones.push({
            tipo: 'manual',
            detalle: `${e.coleccion}.${campo.slug}: agregar en el Designer las opciones ${faltan.join(', ')}`,
          });
      }
    }
    const declarados = new Set(camposDeseados(e).map((c) => c.slug));
    for (const f of actual.fields)
      if (!declarados.has(f.slug) && f.slug !== 'name' && f.slug !== 'slug')
        acciones.push({
          tipo: 'aviso',
          detalle: `${e.coleccion}.${f.slug}: existe en Webflow y el modelo no lo declara`,
        });
  }
  const modelo = new Set(coleccionesCms().map((e) => e.coleccion));
  const propias = new Set([SLUG_PRODUCTOS, SLUG_SKUS, SLUG_CATEGORIAS]);
  for (const c of existentes)
    if (!modelo.has(c.slug) && !propias.has(c.slug))
      acciones.push({
        tipo: 'aviso',
        detalle: `colección ${c.slug}: existe en Webflow y el modelo no la declara`,
      });
  const hay = new Set(categorias.map((c) => c.slug));
  for (const { slug, nombre } of Object.values(CATEGORIAS))
    if (!hay.has(slug)) acciones.push({ tipo: 'crear-categoria', slug, nombre });
  return acciones;
}

export function faltantes(acciones: Accion[]): string[] {
  return acciones.flatMap((a) => {
    switch (a.tipo) {
      case 'crear-coleccion':
        return [`colección ${a.entidad.coleccion}`];
      case 'crear-campo':
        return [`campo ${a.entidad.coleccion}.${a.campo.slug}`];
      case 'crear-categoria':
        return [`categoría ${a.slug}`];
      default:
        return [];
    }
  });
}

function cuerpoCampo(d: CampoDeseado, destinos: Map<string, string>): NuevoCampo {
  const cuerpo: NuevoCampo = {
    type: d.tipo,
    displayName: d.ascii,
    helpText: d.campo.ayuda,
    isRequired: d.requerido,
  };
  if (d.campo.tipo === 'opcion')
    cuerpo.metadata = { options: d.campo.opciones.map((name) => ({ name })) };
  if (d.campo.tipo === 'referencia' || d.campo.tipo === 'referencias') {
    const destino = destinos.get(slugColeccion(entidadPorClave(d.campo.entidad)));
    if (!destino) throw new Error(`No existe la colección destino de ${d.clave}`);
    cuerpo.metadata = { collectionId: destino };
  }
  return cuerpo;
}

export async function aplicarEsquema(api: ApiWebflow, acciones: Accion[], categorias: string) {
  const existentes = await api.colecciones();
  const destinos = new Map(existentes.map((c) => [c.slug, c.id]));
  const nuevas = new Set<string>();
  for (const a of acciones)
    if (a.tipo === 'crear-coleccion') {
      const nueva = await api.crearColeccion(
        a.entidad.titulo,
        a.entidad.singular,
        a.entidad.coleccion
      );
      if (nueva.slug !== a.entidad.coleccion)
        throw new Error(
          `Webflow creó la colección con slug ${nueva.slug}, no ${a.entidad.coleccion}`
        );
      destinos.set(nueva.slug, nueva.id);
      nuevas.add(nueva.id);
    }
  if (nuevas.size)
    for (const p of await api.paginas())
      if (p.collectionId && nuevas.has(p.collectionId) && !p.draft) await api.borradorPagina(p.id);
  const campos = acciones.filter((a) => a.tipo === 'crear-campo');
  const esReferencia = (a: Accion) =>
    a.tipo === 'crear-campo' &&
    (a.campo.campo.tipo === 'referencia' || a.campo.campo.tipo === 'referencias');
  for (const a of [...campos.filter((x) => !esReferencia(x)), ...campos.filter(esReferencia)]) {
    if (a.tipo !== 'crear-campo') continue;
    const coleccion = destinos.get(a.entidad.coleccion)!;
    const creado = await api.crearCampo(coleccion, cuerpoCampo(a.campo, destinos));
    if (creado.slug !== a.campo.slug)
      throw new Error(
        `Webflow creó ${a.entidad.coleccion}.${creado.slug}, se esperaba ${a.campo.slug}`
      );
    if (a.campo.etiqueta !== a.campo.ascii)
      await api.actualizarCampo(coleccion, creado.id, { displayName: a.campo.etiqueta });
  }
  const actuales = new Map((await api.colecciones()).map((c) => [c.slug, c]));
  for (const a of acciones)
    if (a.tipo === 'ajustar-campo') {
      const c = actuales.get(a.entidad.coleccion)!;
      const f = c.fields.find((x) => x.slug === a.campo.slug)!;
      await api.actualizarCampo(c.id, f.id, a.cambios);
    }
  const nuevasCategorias = acciones.filter((a) => a.tipo === 'crear-categoria');
  if (nuevasCategorias.length)
    await api.crearItems(
      categorias,
      nuevasCategorias.map((a) => ({
        fieldData: a.tipo === 'crear-categoria' ? { name: a.nombre, slug: a.slug } : {},
      }))
    );
}
