import { ARCHIVO_CAJA, generarCaja, PAGINA_CHECKOUT } from '../comercio/caja.ts';
import { llevarCodigoDePagina } from '../webflow/codigo-de-pagina.ts';
import { leerSitio } from '../webflow/conexion.ts';

export const ejecutar = (args: string[], abrir = leerSitio): Promise<number> =>
  llevarCodigoDePagina(args, abrir, {
    slug: PAGINA_CHECKOUT,
    titulo: 'Checkout',
    archivo: ARCHIVO_CAJA,
    codigo: generarCaja(),
    que: 'Lo que el sitio pasa a la caja (código de descuento y datos)',
  });
