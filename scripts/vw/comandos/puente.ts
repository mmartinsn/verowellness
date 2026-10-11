import { opcion } from '../comun/args.ts';
import { leerSnapshot } from '../comun/snapshot.ts';
import { ARCHIVO_PUENTE, generarPuente, VOLVER } from '../comercio/puente.ts';
import { llevarCodigoDePagina } from '../webflow/codigo-de-pagina.ts';
import { leerSitio } from '../webflow/conexion.ts';

export const ejecutar = (args: string[], abrir = leerSitio): Promise<number> =>
  llevarCodigoDePagina(args, abrir, {
    slug: 'pedido',
    titulo: 'Pedido',
    archivo: ARCHIVO_PUENTE,
    codigo: generarPuente(leerSnapshot(), opcion(args, '--volver') ?? VOLVER),
    que: 'Puente',
  });
