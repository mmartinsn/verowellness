import path from 'node:path';
import { envolver, javascript } from './inyectable.ts';
import { SITIO } from '../../../src/lib/despliegue.ts';

export const ARCHIVO_CAJA = path.resolve('webflow', 'caja.html');

export const PAGINA_CHECKOUT = 'checkout';

const TEXTOS = { email: 'Email', cambiar: 'Cambiar' };

export const generarCaja = () =>
  envolver([
    `const SITIO = ${JSON.stringify(new URL(SITIO).hostname)};`,
    `const TEXTOS = ${JSON.stringify(TEXTOS)};`,
    javascript('src/lib/comercio/traspaso.ts'),
    javascript('webflow/caja.ts'),
  ]);
