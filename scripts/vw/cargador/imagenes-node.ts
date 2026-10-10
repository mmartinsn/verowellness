import { readdirSync } from 'node:fs';
import path from 'node:path';
import { carpetasImagen } from '../../../src/modelo/esquema.ts';
import { objetoImagen, type ObjetoImagen } from './imagen.ts';

const raiz = path.resolve(process.env.VW_RAIZ ?? process.cwd(), 'src', 'assets');
const archivos = new Map<string, ObjetoImagen>();
for (const carpeta of carpetasImagen())
  for (const nombre of readdirSync(path.join(raiz, carpeta)))
    if (/\.(jpe?g|png|webp|avif)$/i.test(nombre))
      archivos.set(`${carpeta}/${nombre}`, await objetoImagen(path.join(raiz, carpeta, nombre)));

export function imagen(ruta: string): ObjetoImagen {
  const metadatos = archivos.get(ruta);
  if (!metadatos) throw new Error(`Imagen no encontrada en src/assets: ${ruta}`);
  return metadatos;
}
