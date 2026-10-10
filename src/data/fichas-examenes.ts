import { todos } from '../lib/datos/canonico';

export interface Ficha {
  gancho: string;
  queMide: string[];
  porQueImporta: string;
  ideal: string[];
  obtienes: string[];
}

export const fichas: Record<string, Ficha> = Object.fromEntries(
  todos('examen').map((e) => [
    e.id,
    {
      gancho: e.gancho,
      queMide: e.queMide,
      porQueImporta: e.porQueImporta,
      ideal: e.ideal,
      obtienes: e.obtienes,
    },
  ])
);
