import type { RegistroLibre } from './entidad.ts';
import { ASESORIAS, REGISTROS_FIJOS, SECCIONES } from './secciones.ts';
import type { Problema } from './validar.ts';

type Lector = (clave: string) => readonly RegistroLibre[];
type Anota = (entidad: string, id: string, campo: string, mensaje: string) => void;

const conValor = (v: unknown) =>
  Array.isArray(v) ? v.length > 0 : typeof v === 'string' ? v.trim() !== '' : v !== undefined;

function revisarBloques(leer: Lector, anota: Anota) {
  const declaradas = new Map(SECCIONES.map((s) => [`${s.pagina}/${s.seccion}`, s]));
  const cuenta = new Map<string, number>();
  for (const b of leer('bloque')) {
    const clave = `${b.pagina}/${b.seccion}`;
    const s = declaradas.get(clave);
    if (!s) {
      anota('bloque', b.id, 'seccion', `«${clave}» no es una sección que el sitio muestre`);
      continue;
    }
    cuenta.set(clave, (cuenta.get(clave) ?? 0) + 1);
    for (const campo of s.campos)
      if (!conValor(b[campo])) anota('bloque', b.id, campo, `la sección ${clave} lo necesita`);
  }
  for (const [clave, s] of declaradas) {
    const n = cuenta.get(clave) ?? 0;
    if (n === 0) anota('bloque', '-', 'seccion', `falta la sección ${clave}`);
    else if (s.unica && n > 1)
      anota('bloque', '-', 'seccion', `la sección ${clave} lleva un bloque y tiene ${n}`);
  }
}

function revisarAsesorias(leer: Lector, anota: Anota) {
  const asesorias = leer('asesoria');
  for (const a of asesorias) {
    const id = ASESORIAS[a.clave as keyof typeof ASESORIAS];
    if (!id)
      anota('asesoria', a.id, 'clave', `«${a.clave}» no es ${Object.keys(ASESORIAS).join(', ')}`);
    else if (a.id !== id)
      anota('asesoria', a.id, 'id', `la asesoría ${a.clave} va con el id ${id}`);
  }
  for (const clave of Object.keys(ASESORIAS)) {
    const n = asesorias.filter((a) => a.clave === clave).length;
    if (n !== 1) anota('asesoria', '-', 'clave', `${clave} debe estar una vez y está ${n}`);
  }
}

function revisarFijos(leer: Lector, anota: Anota) {
  for (const [entidad, ids] of Object.entries(REGISTROS_FIJOS)) {
    const hay = new Set(leer(entidad).map((r) => r.id));
    for (const id of ids) if (!hay.has(id)) anota(entidad, id, '-', 'el sitio lo usa y no existe');
  }
}

export function validarSitio(leer: Lector): Problema[] {
  const problemas: Problema[] = [];
  const anota: Anota = (entidad, id, campo, mensaje) =>
    problemas.push({ entidad, id, campo, mensaje });
  revisarBloques(leer, anota);
  revisarAsesorias(leer, anota);
  revisarFijos(leer, anota);
  return problemas;
}
