import { bandera, opcion } from '../comun/args.ts';
import { leerSnapshot } from '../comun/snapshot.ts';
import { generarPuente, TIENDA, VOLVER } from '../comercio/puente.ts';
import { CASOS, probarPuente } from '../comercio/probar-puente.ts';

export async function ejecutar(args: string[]): Promise<number> {
  const rondas = Number(opcion(args, '--rondas') ?? 3);
  const tabla = leerSnapshot();
  const local = bandera(args, '--local') ? generarPuente(tabla, VOLVER) : undefined;
  if (local)
    console.log(
      'Se prueba el puente local: se inyecta en cada carga de «Pedido»; Webflow no se toca.'
    );
  const solo = opcion(args, '--solo');
  const casos = solo
    ? CASOS.filter((c) => solo.split(',').some((s) => c.nombre.includes(s.trim())))
    : CASOS;
  const resultados = await probarPuente(
    tabla,
    opcion(args, '--base') ?? TIENDA,
    rondas,
    local,
    casos
  );
  for (const r of resultados)
    console.log(`${r.ok ? 'ok   ' : 'FALLA'} ronda ${r.ronda} · ${r.caso.padEnd(32)} ${r.detalle}`);
  if (resultados.length === 0) {
    console.log('Ninguna corrida: revisa --solo y --rondas.');
    return 1;
  }
  const fallas = resultados.filter((r) => !r.ok).length;
  console.log(`${resultados.length - fallas}/${resultados.length} corridas correctas.`);
  return fallas === 0 ? 0 : 1;
}
