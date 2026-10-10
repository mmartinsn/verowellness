import path from 'node:path';
import sharp from 'sharp';

export interface ObjetoImagen {
  src: string;
  width: number;
  height: number;
  format: string;
}

export async function objetoImagen(archivo: string): Promise<ObjetoImagen> {
  const meta = await sharp(archivo).metadata();
  const normal = archivo.split(path.sep).join('/');
  const corte = normal.lastIndexOf('/src/assets/');
  const src = corte >= 0 ? normal.slice(corte) : `/${path.basename(archivo)}`;
  return { src, width: meta.width ?? 0, height: meta.height ?? 0, format: meta.format ?? '' };
}
