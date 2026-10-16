import { spawnSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { RUTA_COBRO } from '../../../src/lib/comercio/pedido.ts';
import { bandera } from '../comun/args.ts';
import { leerSnapshot } from '../comun/snapshot.ts';
import {
  ARCHIVO_COBRO,
  generarCobro,
  URL_VERSION,
  versionDe,
  versionDesplegada,
} from '../comercio/cobro.ts';
import { VOLVER } from '../comercio/puente.ts';
import { leerArchivo } from '../webflow/codigo-de-pagina.ts';

export const CLI_WEBFLOW = '@webflow/webflow-cli@2.12.0';

export const ENTORNO_COBRO = 'main';

export const argumentosDespliegue = (sitio: string) => [
  '--yes',
  CLI_WEBFLOW,
  'apps',
  'deploy',
  '--no-input',
  '--site-id',
  sitio,
  '--framework',
  'astro',
  '--mount',
  RUTA_COBRO,
  '--environment',
  ENTORNO_COBRO,
  '--skip-mount-path-check',
  '--skip-update-check',
];

export async function ejecutar(args: string[]): Promise<number> {
  const generado = generarCobro(leerSnapshot(), VOLVER);
  const anterior = leerArchivo(ARCHIVO_COBRO);
  if (anterior !== generado) writeFileSync(ARCHIVO_COBRO, generado);
  const version = versionDe(generado);
  console.log(
    `cobro/src/generado.ts ${anterior === generado ? 'al día' : 'regenerado'} (versión ${version}).`
  );
  const desplegado = await versionDesplegada();
  const forzar = bandera(args, '--forzar');
  if (desplegado?.version === version && !forzar) {
    console.log(
      `${URL_VERSION} ya tiene esta versión; Stripe: ${desplegado.stripe ?? 'sin clave'}.`
    );
    return 0;
  }
  console.log(
    desplegado
      ? `${URL_VERSION} tiene la versión ${desplegado.version}.`
      : `${URL_VERSION} no responde: el cobro no está desplegado.`
  );
  if (!bandera(args, '--aplicar')) {
    console.log(
      'Repite con --aplicar para desplegar cobro/ en Webflow Cloud (--forzar tras cambiar un secret).'
    );
    return 1;
  }
  const sitio = process.env.WEBFLOW_SITE_ID;
  if (!sitio) throw new Error('Falta WEBFLOW_SITE_ID en .env');
  const r = spawnSync('npx', argumentosDespliegue(sitio), {
    cwd: path.resolve('cobro'),
    stdio: 'inherit',
    shell: true,
  });
  return r.status ?? 1;
}
