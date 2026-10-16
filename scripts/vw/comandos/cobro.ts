import { spawnSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import path from 'node:path';
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

export async function ejecutar(args: string[]): Promise<number> {
  const generado = generarCobro(leerSnapshot(), VOLVER);
  const anterior = leerArchivo(ARCHIVO_COBRO);
  if (anterior !== generado) writeFileSync(ARCHIVO_COBRO, generado);
  const version = versionDe(generado);
  console.log(
    `cobro/src/generado.ts ${anterior === generado ? 'al día' : 'regenerado'} (versión ${version}).`
  );
  const desplegado = await versionDesplegada();
  if (desplegado?.version === version) {
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
    console.log('Repite con --aplicar para desplegar cobro/ en Webflow Cloud.');
    return 1;
  }
  const r = spawnSync('npx', ['--yes', CLI_WEBFLOW, 'cloud', 'deploy'], {
    cwd: path.resolve('cobro'),
    stdio: 'inherit',
    shell: true,
  });
  return r.status ?? 1;
}
