import { leerSnapshot } from '../comun/snapshot.ts';
import { informarProblemas, problemasDe } from '../comun/problemas.ts';

export async function ejecutar(): Promise<number> {
  const tabla = leerSnapshot();
  const problemas = problemasDe(tabla);
  if (problemas.length) return informarProblemas(problemas);
  const total = Object.values(tabla).reduce((n, r) => n + r.length, 0);
  console.log(
    `Snapshot canónico válido: ${total} registros en ${Object.keys(tabla).length} entidades.`
  );
  return 0;
}
