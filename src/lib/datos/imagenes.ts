import type { ImageMetadata } from 'astro';

export const CARPETAS_IMAGEN = ['testimonios', 'tienda'] as const;

const archivos = import.meta.glob<ImageMetadata>(
  '/src/assets/{testimonios,tienda}/*.{jpg,jpeg,png,webp,avif}',
  { eager: true, import: 'default' }
);

export function imagen(ruta: string): ImageMetadata {
  const metadatos = archivos[`/src/assets/${ruta}`];
  if (!metadatos) throw new Error(`Imagen no encontrada en src/assets: ${ruta}`);
  return metadatos;
}
