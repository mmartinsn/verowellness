import { bandera } from '../comun/args.ts';
import { informarProblemas, problemasDe } from '../comun/problemas.ts';
import { leerSnapshot } from '../comun/snapshot.ts';
import { leerSitio } from '../webflow/conexion.ts';
import { incompatibles, planEsquema } from '../webflow/esquema.ts';
import { avisoPendientes, decidir, pendientesDePublicar } from '../webflow/publicacion.ts';
import { sembrar, type Resumen } from '../webflow/sembrar.ts';

const pendiente = (r: Resumen) => r.crear + r.actualizar;

function imprimir(resumenes: Resumen[]) {
  console.log('  colección              crear  actualizar  iguales  sobrantes');
  for (const r of resumenes)
    console.log(
      `  ${r.coleccion.padEnd(22)} ${String(r.crear).padStart(5)} ${String(r.actualizar).padStart(11)} ${String(r.iguales).padStart(8)}  ${r.sobrantes.join(', ') || '-'}`
    );
}

export async function ejecutar(args: string[], abrir = leerSitio): Promise<number> {
  const tabla = leerSnapshot();
  const problemas = problemasDe(tabla);
  if (problemas.length) return informarProblemas(problemas);
  const sitio = await abrir();
  const aplicar = bandera(args, '--aplicar');
  const categorias = await sitio.api.items(sitio.categorias.id);
  const choques = incompatibles(
    planEsquema(
      [...sitio.colecciones.values()],
      categorias.map((c) => c.fieldData)
    )
  );
  if (choques.length) {
    console.error(`Webflow no coincide con el modelo (${choques.join(', ')}); corre vw esquema.`);
    return 1;
  }
  const sinPublicar = await pendientesDePublicar(sitio);
  const plan = await sembrar(sitio, tabla, false);
  imprimir(plan);
  const total = plan.reduce((n, r) => n + pendiente(r), 0);
  console.log(`${total} escritura(s) pendientes.`);
  if (sinPublicar.length)
    console.log(
      avisoPendientes(sinPublicar, aplicar, decidir(true, total, sinPublicar.length) === 'negar')
    );
  const paso = decidir(aplicar, total, sinPublicar.length);
  if (paso === 'seco' && total)
    console.log('En seco: nada se escribió. Repite con --aplicar para ejecutarlo.');
  if (paso !== 'aplicar') return paso === 'negar' ? 1 : 0;
  await sembrar(sitio, tabla, true);
  await sitio.api.publicarSitio();
  const segunda = await sembrar(await abrir(), tabla, false);
  const restante = segunda.reduce((n, r) => n + pendiente(r), 0);
  console.log(
    `Aplicado y publicado en webflow.io (${sitio.api.c.solicitudes} solicitudes). Segunda vuelta:`
  );
  imprimir(segunda);
  return restante === 0 ? 0 : 1;
}
