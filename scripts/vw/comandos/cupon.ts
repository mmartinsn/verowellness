import { ARCHIVO_CUPON, generarCupon, PAGINA_CHECKOUT } from '../comercio/cupon.ts';
import { llevarCodigoDePagina } from '../webflow/codigo-de-pagina.ts';
import { leerSitio } from '../webflow/conexion.ts';

export const ejecutar = (args: string[], abrir = leerSitio): Promise<number> =>
  llevarCodigoDePagina(args, abrir, {
    slug: PAGINA_CHECKOUT,
    titulo: 'Checkout',
    archivo: ARCHIVO_CUPON,
    codigo: generarCupon(),
    que: 'El código de descuento del sitio',
  });
