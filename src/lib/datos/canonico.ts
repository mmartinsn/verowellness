import productos from '../../data/canonico/productos.json' with { type: 'json' };
import asesorias from '../../data/canonico/asesorias.json' with { type: 'json' };
import guias from '../../data/canonico/guias.json' with { type: 'json' };
import ajustes from '../../data/canonico/ajustes.json' with { type: 'json' };
import areas from '../../data/canonico/areas.json' with { type: 'json' };
import tiposMuestra from '../../data/canonico/tipos-de-muestra.json' with { type: 'json' };
import examenes from '../../data/canonico/examenes.json' with { type: 'json' };
import sintomas from '../../data/canonico/sintomas.json' with { type: 'json' };
import rutasSintoma from '../../data/canonico/rutas-de-sintoma.json' with { type: 'json' };
import caminosAlimentos from '../../data/canonico/caminos-de-alimentos.json' with { type: 'json' };
import testimonios from '../../data/canonico/testimonios.json' with { type: 'json' };
import preguntas from '../../data/canonico/preguntas-frecuentes.json' with { type: 'json' };
import layers from '../../data/canonico/layers.json' with { type: 'json' };
import suplementos from '../../data/canonico/suplementos.json' with { type: 'json' };
import bloques from '../../data/canonico/bloques.json' with { type: 'json' };
import type { RegistroLibre } from '../../modelo/entidad.ts';
import type { ClaveContenido, Conjunto } from '../../modelo/esquema.ts';
import { validarConjunto } from '../../modelo/validar.ts';
import { validarReglas } from '../../modelo/reglas.ts';

const crudo = {
  producto: productos,
  asesoria: asesorias,
  guia: guias,
  ajustes,
  area: areas,
  tipoMuestra: tiposMuestra,
  examen: examenes,
  sintoma: sintomas,
  rutaSintoma: rutasSintoma,
  caminoAlimentos: caminosAlimentos,
  testimonio: testimonios,
  pregunta: preguntas,
  layer: layers,
  suplemento: suplementos,
  bloque: bloques,
} as unknown as Conjunto;

const leer = (clave: string) => (crudo as unknown as Record<string, RegistroLibre[]>)[clave] ?? [];
const problemas = [...validarConjunto(leer), ...validarReglas(leer)];
if (problemas.length > 0)
  throw new Error(
    `El snapshot canónico tiene ${problemas.length} problema(s):\n${problemas
      .slice(0, 20)
      .map((p) => `  ${p.entidad}/${p.id}.${p.campo}: ${p.mensaje}`)
      .join('\n')}`
  );

export const conjunto: Conjunto = crudo;

export type Fila<K extends ClaveContenido> = Conjunto[K][number];

export function todos<K extends ClaveContenido>(clave: K): Conjunto[K] {
  return conjunto[clave];
}

export function uno<K extends ClaveContenido>(clave: K, id: string): Conjunto[K][number] {
  const registro = (conjunto[clave] as Conjunto[K][number][]).find((r) => r.id === id);
  if (!registro) throw new Error(`${clave} «${id}» no existe en el snapshot canónico`);
  return registro;
}

export function unico<K extends ClaveContenido>(clave: K): Conjunto[K][number] {
  return conjunto[clave][0] as Conjunto[K][number];
}
