import { bandera } from '../comun/args.ts';
import { informarProblemas, problemasDe } from '../comun/problemas.ts';
import { leerSnapshot } from '../comun/snapshot.ts';
import { leerSitio } from '../webflow/conexion.ts';
import { sembrar, type Resumen } from '../webflow/sembrar.ts';

const pendiente = (r: Resumen) => r.crear + r.actualizar;

function imprimir(resumenes: Resumen[]) {
  console.log('  colección              crear  actualizar  iguales  sobrantes');
  for (const r of resumenes)
    console.log(
      `  ${r.coleccion.padEnd(22)} ${String(r.crear).padStart(5)} ${String(r.actualizar).padStart(11)} ${String(r.iguales).padStart(8)}  ${r.sobrantes.join(', ') || '-'}`
    );
}

export async function ejecutar(args: string[]): Promise<number> {
  const tabla = leerSnapshot();
  const problemas = problemasDe(tabla);
  if (problemas.length) return informarProblemas(problemas);
  const sitio = await leerSitio();
  const aplicar = bandera(args, '--aplicar');
  const plan = await sembrar(sitio, tabla, false);
  imprimir(plan);
  const total = plan.reduce((n, r) => n + pendiente(r), 0);
  console.log(`${total} escritura(s) pendientes.`);
  if (!aplicar) {
    if (total) console.log('En seco: nada se escribió. Repite con --aplicar para ejecutarlo.');
    return 0;
  }
  if (total === 0) return 0;
  await sembrar(sitio, tabla, true);
  await sitio.api.publicarSitio();
  const segunda = await sembrar(await leerSitio(), tabla, false);
  const restante = segunda.reduce((n, r) => n + pendiente(r), 0);
  console.log(
    `Aplicado y publicado en webflow.io (${sitio.api.c.solicitudes} solicitudes). Segunda vuelta:`
  );
  imprimir(segunda);
  return restante === 0 ? 0 : 1;
}
