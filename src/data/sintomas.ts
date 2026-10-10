import { examenPorId, type Examen } from './examenes';
import { todos } from '../lib/datos/canonico';
import { siVerdadero } from '../lib/datos/forma';

export interface GrupoSintoma {
  pregunta: string;
  examenes: string[];
}

export interface Sintoma {
  id: string;
  titulo: string;
  ejemplos: string;
  color: string;
  icono: string;
  orientacion?: boolean;
  grupos: GrupoSintoma[];
}

const rutas = todos('rutaSintoma');

export const sintomas: Sintoma[] = todos('sintoma').map((s) => ({
  id: s.id,
  icono: s.icono,
  titulo: s.nombre,
  ejemplos: s.ejemplos,
  color: s.color,
  ...siVerdadero('orientacion', s.orientacion),
  grupos: rutas
    .filter((r) => r.sintoma === s.id)
    .map((r) => ({ pregunta: r.pregunta, examenes: r.examenes })),
}));

export function paraQuien(e: Examen): string {
  const frases = e.descripcion.match(/[^.!?]+[.!?]+/g) ?? [e.descripcion];
  return (
    frases
      .map((f) => f.trim())
      .find((f) => /^(Útil|Ideal|Recomendado|Buena opción|Para )/.test(f)) ??
    frases[frases.length - 1].trim()
  );
}

export function examenesDe(g: GrupoSintoma): Examen[] {
  return g.examenes.map((id) => {
    const e = examenPorId.get(id);
    if (!e) throw new Error(`sintomas.ts: «${id}» no existe en data/examenes`);
    return e;
  });
}

export function totalExamenes(s: Sintoma): number {
  return new Set(s.grupos.flatMap((g) => g.examenes)).size;
}
