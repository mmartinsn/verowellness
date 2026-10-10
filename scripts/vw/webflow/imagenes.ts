import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import type { ApiWebflow } from './api.ts';
import type { ImagenWf } from './tipos.ts';

export const CARPETA_ASSETS = path.resolve('src', 'assets');

export const md5 = (datos: Buffer | Uint8Array) => createHash('md5').update(datos).digest('hex');

const TIPOS: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
};

export async function descargar(url: string): Promise<Buffer> {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`No pude descargar ${url}: ${r.status}`);
  return Buffer.from(await r.arrayBuffer());
}

export async function mismaImagen(ruta: string, actual: ImagenWf | undefined): Promise<boolean> {
  if (!actual?.url) return false;
  const local = md5(readFileSync(path.join(CARPETA_ASSETS, ruta)));
  return md5(await descargar(actual.url)) === local;
}

export async function subirImagen(api: ApiWebflow, ruta: string): Promise<ImagenWf> {
  const bytes = readFileSync(path.join(CARPETA_ASSETS, ruta));
  const nombre = path.basename(ruta);
  const asset = await api.crearAsset(nombre, md5(bytes));
  const formulario = new FormData();
  for (const [k, v] of Object.entries(asset.uploadDetails)) formulario.append(k, v);
  formulario.append(
    'file',
    new Blob([new Uint8Array(bytes)], { type: TIPOS[path.extname(nombre).toLowerCase()] }),
    nombre
  );
  const subida = await fetch(asset.uploadUrl, { method: 'POST', body: formulario });
  if (!subida.ok) throw new Error(`La subida de ${ruta} a Webflow falló: ${subida.status}`);
  const { hostedUrl } = await api.asset(asset.id);
  return { fileId: asset.id, url: hostedUrl };
}
