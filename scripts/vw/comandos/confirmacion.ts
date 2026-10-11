import { opcion } from '../comun/args.ts';
import { leerSnapshot } from '../comun/snapshot.ts';
import {
  ARCHIVO_CONFIRMACION,
  generarConfirmacion,
  PAGINA_CONFIRMACION,
} from '../comercio/confirmacion.ts';
import { VOLVER } from '../comercio/puente.ts';
import { llevarCodigoDePagina } from '../webflow/codigo-de-pagina.ts';
import { leerSitio } from '../webflow/conexion.ts';

export const ejecutar = (args: string[], abrir = leerSitio): Promise<number> =>
  llevarCodigoDePagina(args, abrir, {
    slug: PAGINA_CONFIRMACION,
    titulo: 'Order Confirmation',
    archivo: ARCHIVO_CONFIRMACION,
    codigo: generarConfirmacion(leerSnapshot(), opcion(args, '--volver') ?? VOLVER),
    que: 'El paso a las páginas de gracias',
  });
