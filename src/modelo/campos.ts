interface Base<R extends boolean> {
  readonly requerido: R;
  readonly ayuda: string;
}

export interface CampoTexto<R extends boolean = boolean> extends Base<R> {
  readonly tipo: 'texto';
  readonly multilinea: boolean;
}

export interface CampoLista<R extends boolean = boolean> extends Base<R> {
  readonly tipo: 'lista';
}

export interface CampoParrafos<R extends boolean = boolean> extends Base<R> {
  readonly tipo: 'parrafos';
}

export interface CampoEntero<R extends boolean = boolean> extends Base<R> {
  readonly tipo: 'entero';
}

export interface CampoDinero<R extends boolean = boolean> extends Base<R> {
  readonly tipo: 'dinero';
}

export interface CampoBooleano<R extends boolean = boolean> extends Base<R> {
  readonly tipo: 'booleano';
}

export interface CampoOpcion<
  O extends string = string,
  R extends boolean = boolean,
> extends Base<R> {
  readonly tipo: 'opcion';
  readonly opciones: readonly O[];
}

export interface CampoReferencia<R extends boolean = boolean> extends Base<R> {
  readonly tipo: 'referencia';
  readonly entidad: string;
}

export interface CampoReferencias<R extends boolean = boolean> extends Base<R> {
  readonly tipo: 'referencias';
  readonly entidad: string;
}

export interface CampoImagen<R extends boolean = boolean> extends Base<R> {
  readonly tipo: 'imagen';
  readonly carpeta: string;
}

export interface CampoEnlace<R extends boolean = boolean> extends Base<R> {
  readonly tipo: 'enlace';
}

export interface CampoFecha<R extends boolean = boolean> extends Base<R> {
  readonly tipo: 'fecha';
}

export type Campo =
  | CampoTexto
  | CampoLista
  | CampoParrafos
  | CampoEntero
  | CampoDinero
  | CampoBooleano
  | CampoOpcion
  | CampoReferencia
  | CampoReferencias
  | CampoImagen
  | CampoEnlace
  | CampoFecha;

export type TipoCampo = Campo['tipo'];

interface Obligatorio {
  requerido?: true;
  ayuda: string;
}

interface Optativo {
  requerido: false;
  ayuda: string;
}

type Opciones = Obligatorio | Optativo;

const base = (o: Opciones) => ({ requerido: o.requerido ?? true, ayuda: o.ayuda });

export function texto(o: Optativo & { multilinea?: boolean }): CampoTexto<false>;
export function texto(o: Obligatorio & { multilinea?: boolean }): CampoTexto<true>;
export function texto(o: Opciones & { multilinea?: boolean }): CampoTexto {
  return { tipo: 'texto', multilinea: o.multilinea ?? false, ...base(o) };
}

export function lista(o: Optativo): CampoLista<false>;
export function lista(o: Obligatorio): CampoLista<true>;
export function lista(o: Opciones): CampoLista {
  return { tipo: 'lista', ...base(o) };
}

export function parrafos(o: Optativo): CampoParrafos<false>;
export function parrafos(o: Obligatorio): CampoParrafos<true>;
export function parrafos(o: Opciones): CampoParrafos {
  return { tipo: 'parrafos', ...base(o) };
}

export function entero(o: Optativo): CampoEntero<false>;
export function entero(o: Obligatorio): CampoEntero<true>;
export function entero(o: Opciones): CampoEntero {
  return { tipo: 'entero', ...base(o) };
}

export function dinero(o: Optativo): CampoDinero<false>;
export function dinero(o: Obligatorio): CampoDinero<true>;
export function dinero(o: Opciones): CampoDinero {
  return { tipo: 'dinero', ...base(o) };
}

export function booleano(o: Optativo): CampoBooleano<false>;
export function booleano(o: Obligatorio): CampoBooleano<true>;
export function booleano(o: Opciones): CampoBooleano {
  return { tipo: 'booleano', ...base(o) };
}

export function opcion<const O extends string>(
  opciones: readonly O[],
  o: Optativo
): CampoOpcion<O, false>;
export function opcion<const O extends string>(
  opciones: readonly O[],
  o: Obligatorio
): CampoOpcion<O, true>;
export function opcion(opciones: readonly string[], o: Opciones): CampoOpcion {
  return { tipo: 'opcion', opciones, ...base(o) };
}

export function referencia(entidad: string, o: Optativo): CampoReferencia<false>;
export function referencia(entidad: string, o: Obligatorio): CampoReferencia<true>;
export function referencia(entidad: string, o: Opciones): CampoReferencia {
  return { tipo: 'referencia', entidad, ...base(o) };
}

export function referencias(entidad: string, o: Optativo): CampoReferencias<false>;
export function referencias(entidad: string, o: Obligatorio): CampoReferencias<true>;
export function referencias(entidad: string, o: Opciones): CampoReferencias {
  return { tipo: 'referencias', entidad, ...base(o) };
}

export function imagen(carpeta: string, o: Optativo): CampoImagen<false>;
export function imagen(carpeta: string, o: Obligatorio): CampoImagen<true>;
export function imagen(carpeta: string, o: Opciones): CampoImagen {
  return { tipo: 'imagen', carpeta, ...base(o) };
}

export function enlace(o: Optativo): CampoEnlace<false>;
export function enlace(o: Obligatorio): CampoEnlace<true>;
export function enlace(o: Opciones): CampoEnlace {
  return { tipo: 'enlace', ...base(o) };
}

export function fecha(o: Optativo): CampoFecha<false>;
export function fecha(o: Obligatorio): CampoFecha<true>;
export function fecha(o: Opciones): CampoFecha {
  return { tipo: 'fecha', ...base(o) };
}

type ValorDe<C> = C extends CampoTexto
  ? string
  : C extends CampoLista | CampoParrafos
    ? string[]
    : C extends CampoEntero | CampoDinero
      ? number
      : C extends CampoBooleano
        ? boolean
        : C extends CampoOpcion<infer O>
          ? O
          : C extends CampoReferencias
            ? string[]
            : C extends CampoReferencia | CampoImagen | CampoEnlace | CampoFecha
              ? string
              : never;

type SiempreConValor = CampoLista | CampoParrafos | CampoReferencias | CampoBooleano;

type Presente<C extends Campo> = C extends SiempreConValor
  ? true
  : C['requerido'] extends true
    ? true
    : false;

type Requeridos<C extends Record<string, Campo>> = {
  [K in keyof C as Presente<C[K]> extends true ? K : never]: ValorDe<C[K]>;
};

type Opcionales<C extends Record<string, Campo>> = {
  [K in keyof C as Presente<C[K]> extends true ? never : K]?: ValorDe<C[K]>;
};

export const siempreConValor = (c: Campo): boolean =>
  c.tipo === 'lista' || c.tipo === 'parrafos' || c.tipo === 'referencias' || c.tipo === 'booleano';

export type Valores<C extends Record<string, Campo>> = Requeridos<C> & Opcionales<C>;
