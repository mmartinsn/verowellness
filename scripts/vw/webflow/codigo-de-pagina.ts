import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { bandera } from '../comun/args.ts';
import type { ApiWebflow } from './api.ts';
import type { Sitio } from './conexion.ts';
import {
  avisoPendientes,
  decidir,
  dominiosAPublicar,
  pendientesDePublicar,
  publicadoEn,
} from './publicacion.ts';

export interface CodigoDePagina {
  slug: string;
  titulo: string;
  archivo: string;
  codigo: string;
  que: string;
}

export const leerArchivo = (archivo: string) =>
  existsSync(archivo) ? readFileSync(archivo, 'utf8') : '';

export async function publicadoEnPagina(api: ApiWebflow, slug: string): Promise<string | null> {
  const pagina = (await api.paginas()).find((p) => p.slug === slug);
  return pagina ? api.codigoLibre(pagina.id, 'footer') : null;
}

export async function llevarCodigoDePagina(
  args: string[],
  abrir: () => Promise<Sitio>,
  c: CodigoDePagina
): Promise<number> {
  const anterior = leerArchivo(c.archivo);
  if (anterior !== c.codigo) writeFileSync(c.archivo, c.codigo);
  const nombre = path.relative(process.cwd(), c.archivo).split(path.sep).join('/');
  console.log(
    `${nombre} ${anterior === c.codigo ? 'al día' : 'regenerado'} (${c.codigo.length} caracteres).`
  );
  const sitio = await abrir();
  const { api } = sitio;
  const pagina = (await api.paginas()).find((p) => p.slug === c.slug);
  if (!pagina) throw new Error(`Webflow no tiene la página «${c.slug}»`);
  if ((await api.codigoLibre(pagina.id, 'footer')) === c.codigo) {
    console.log(`La página «${c.titulo}» de Webflow ya tiene esta versión.`);
    return 0;
  }
  const aplicar = bandera(args, '--aplicar');
  const sinPublicar = await pendientesDePublicar(sitio);
  if (sinPublicar.length) console.log(avisoPendientes(sinPublicar, aplicar, true));
  const paso = decidir(aplicar, 1, sinPublicar.length);
  if (paso === 'seco')
    console.log(
      `La página «${c.titulo}» tiene otra versión. Repite con --aplicar para publicarla.`
    );
  if (paso !== 'aplicar') return 1;
  const dominios = await dominiosAPublicar(api);
  await api.escribirCodigoLibre(pagina.id, 'footer', c.codigo);
  await api.publicarSitio(dominios);
  console.log(
    `${c.que} escrito en la página «${c.titulo}» y sitio publicado en ${publicadoEn(dominios)}.`
  );
  return 0;
}
