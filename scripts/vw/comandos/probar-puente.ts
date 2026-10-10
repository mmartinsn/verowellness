import { opcion } from '../comun/args.ts';
import { leerSnapshot } from '../comun/snapshot.ts';
import { probarPuente } from '../comercio/probar-puente.ts';

const BASE = 'https://veronicas-radical-site-497b87.webflow.io';

export async function ejecutar(args: string[]): Promise<number> {
  const rondas = Number(opcion(args, '--rondas') ?? 3);
  const resultados = await probarPuente(leerSnapshot(), opcion(args, '--base') ?? BASE, rondas);
  for (const r of resultados)
    console.log(`${r.ok ? 'ok   ' : 'FALLA'} ronda ${r.ronda} · ${r.caso.padEnd(32)} ${r.detalle}`);
  const fallas = resultados.filter((r) => !r.ok).length;
  console.log(`${resultados.length - fallas}/${resultados.length} corridas correctas.`);
  return fallas === 0 ? 0 : 1;
}
