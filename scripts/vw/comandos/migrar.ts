import { rmSync } from 'node:fs';
import { extraerArbol } from '../comun/arbol.ts';
import { opcion } from '../comun/args.ts';
import { escribirSnapshot, normalizarTabla } from '../comun/snapshot.ts';
import { informarProblemas, problemasDe } from '../comun/problemas.ts';
import { migrar } from '../migracion/desde-ts.ts';

export async function ejecutar(args: string[]): Promise<number> {
  const ref = opcion(args, '--desde') ?? 'HEAD';
  const raiz = extraerArbol(ref);
  try {
    process.env.VW_RAIZ = raiz;
    const tabla = normalizarTabla(await migrar(raiz));
    const problemas = problemasDe(tabla);
    if (problemas.length) return informarProblemas(problemas);
    const cambiados = escribirSnapshot(tabla);
    const total = Object.values(tabla).reduce((n, r) => n + r.length, 0);
    console.log(
      `Snapshot canónico desde ${ref}: ${total} registros; cambiaron ${cambiados.length} archivo(s).`
    );
    for (const [clave, registros] of Object.entries(tabla))
      console.log(`  ${clave.padEnd(16)} ${registros.length}`);
    return 0;
  } finally {
    rmSync(raiz, { recursive: true, force: true });
  }
}
