import type { Entidad, Registro } from './entidad.ts';
import { ajustes, asesoria, guia, producto } from './entidades/comercio.ts';
import {
  area,
  caminoAlimentos,
  examen,
  rutaSintoma,
  sintoma,
  tipoMuestra,
} from './entidades/catalogo.ts';
import { layer, pregunta, suplemento, testimonio } from './entidades/contenido.ts';
import { cliente, lineaPedido, pedido } from './entidades/operacion.ts';

export const VERSION_ESQUEMA = 1;

export const entidades = {
  producto,
  asesoria,
  guia,
  ajustes,
  area,
  tipoMuestra,
  examen,
  sintoma,
  rutaSintoma,
  caminoAlimentos,
  testimonio,
  pregunta,
  layer,
  suplemento,
  cliente,
  pedido,
  lineaPedido,
} as const;

export type Entidades = typeof entidades;
export type ClaveEntidad = keyof Entidades;

export type Conjunto = {
  [K in ClaveEntidad as Entidades[K]['almacen'] extends 'operacion' ? never : K]: Registro<
    Entidades[K]
  >[];
};

export type ClaveContenido = keyof Conjunto;

export const listaEntidades = (): Entidad[] => Object.values(entidades) as Entidad[];

export const entidadesDeContenido = (): Entidad[] =>
  listaEntidades().filter((e) => e.almacen !== 'operacion');

export const entidadPorClave = (clave: string): Entidad => {
  const e = (entidades as Record<string, Entidad>)[clave];
  if (!e) throw new Error(`Entidad desconocida: ${clave}`);
  return e;
};
