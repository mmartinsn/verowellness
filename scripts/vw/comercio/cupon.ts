import path from 'node:path';
import { envolver, javascript } from './inyectable.ts';
import { SITIO } from '../../../src/lib/despliegue.ts';

export const ARCHIVO_CUPON = path.resolve('webflow', 'cupon.html');

export const PAGINA_CHECKOUT = 'checkout';

export const generarCupon = () =>
  envolver([
    `const SITIO = ${JSON.stringify(new URL(SITIO).hostname)};`,
    javascript('src/lib/comercio/cupon.ts'),
    javascript('webflow/cupon.ts'),
  ]);
