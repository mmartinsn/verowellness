import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { bandera, opcion } from '../comun/args.ts';
import { leerSnapshot } from '../comun/snapshot.ts';
import { ARCHIVO_PUENTE, generarPuente } from '../comercio/puente.ts';
import { leerSitio } from '../webflow/conexion.ts';
import { avisoPendientes, pendientesDePublicar } from '../webflow/publicacion.ts';

const VOLVER = 'https://mmartinsn.github.io/verowellness/';
const SLUG_PAGINA = 'pedido';

export async function ejecutar(args: string[]): Promise<number> {
  const codigo = generarPuente(leerSnapshot(), opcion(args, '--volver') ?? VOLVER);
  const anterior = existsSync(ARCHIVO_PUENTE) ? readFileSync(ARCHIVO_PUENTE, 'utf8') : '';
  if (anterior !== codigo) writeFileSync(ARCHIVO_PUENTE, codigo);
  console.log(
    `webflow/pedido.html ${anterior === codigo ? 'al día' : 'regenerado'} (${codigo.length} caracteres).`
  );
  const sitio = await leerSitio();
  const { api } = sitio;
  const pagina = (await api.paginas()).find((p) => p.slug === SLUG_PAGINA);
  if (!pagina) throw new Error(`Webflow no tiene la página «${SLUG_PAGINA}»`);
  const publicado = await api.codigoLibre(pagina.id, 'footer');
  if (publicado === codigo) {
    console.log('La página «Pedido» de Webflow ya tiene esta versión.');
    return 0;
  }
  const aplicar = bandera(args, '--aplicar');
  const sinPublicar = await pendientesDePublicar(sitio);
  if (sinPublicar.length) console.log(avisoPendientes(sinPublicar, aplicar));
  if (!aplicar) {
    console.log('La página «Pedido» tiene otra versión. Repite con --aplicar para publicarla.');
    return 1;
  }
  if (sinPublicar.length) return 1;
  await api.escribirCodigoLibre(pagina.id, 'footer', codigo);
  await api.publicarSitio();
  console.log('Puente escrito en la página «Pedido» y sitio publicado en webflow.io.');
  return 0;
}
