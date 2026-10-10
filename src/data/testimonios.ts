import type { ImageMetadata } from 'astro';
import { todos } from '../lib/datos/canonico';
import { imagen } from '../lib/datos/imagenes';
import { si } from '../lib/datos/forma';

export interface Testimonio {
  id: string;
  nombre: string;
  lugar?: string;
  foto?: ImageMetadata;
  motivo: string[];
  destacado: string;
  texto: string[];
  prioridad: number;
}

const registros = todos('testimonio');

export const testimonios: Testimonio[] = registros.map((t) => ({
  id: t.id,
  nombre: t.nombre,
  ...si('lugar', t.lugar),
  ...si('foto', t.foto === undefined ? undefined : imagen(t.foto)),
  motivo: t.motivos,
  destacado: t.destacado,
  texto: t.texto,
  prioridad: t.prioridad,
}));

export const testimoniosAsesorias: string[] = registros
  .filter((t) => t.enAsesorias)
  .map((t) => t.id);
