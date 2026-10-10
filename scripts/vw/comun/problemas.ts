import { validarReglas } from '../../../src/modelo/reglas.ts';
import { validarConjunto, type Problema } from '../../../src/modelo/validar.ts';
import { lector, type Tabla } from './snapshot.ts';

export function problemasDe(tabla: Tabla): Problema[] {
  const leer = lector(tabla);
  return [...validarConjunto(leer), ...validarReglas(leer)];
}

export function informarProblemas(problemas: Problema[]): number {
  console.error(`${problemas.length} problema(s):`);
  for (const p of problemas) console.error(`  ${p.entidad}/${p.id}.${p.campo}: ${p.mensaje}`);
  return 1;
}
