import type { Campo, Valores } from './campos.ts';

export type Almacen = 'cms' | 'comercio' | 'operacion';

export interface Entidad<C extends Record<string, Campo> = Record<string, Campo>> {
  readonly clave: string;
  readonly coleccion: string;
  readonly titulo: string;
  readonly singular: string;
  readonly descripcion: string;
  readonly almacen: Almacen;
  readonly orden?: string;
  readonly unica?: boolean;
  readonly campos: C;
}

export const entidad = <const C extends Record<string, Campo>>(e: Entidad<C>): Entidad<C> => e;

export interface Identidad {
  id: string;
  nombre: string;
}

export type Registro<E extends Entidad> = Identidad & Valores<E['campos']>;

export type RegistroLibre = Identidad & Record<string, unknown>;
