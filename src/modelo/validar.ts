import { siempreConValor, type Campo } from './campos.ts';
import type { Entidad, RegistroLibre } from './entidad.ts';
import { entidadPorClave, entidadesDeContenido } from './esquema.ts';

export interface Problema {
  entidad: string;
  id: string;
  campo: string;
  mensaje: string;
}

export const ID_VALIDO = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

type Lector = (clave: string) => readonly RegistroLibre[];

const esTextoSinSalto = (v: unknown) => typeof v === 'string' && !v.includes('\n');

export function revisarValor(c: Campo, v: unknown): string | null {
  switch (c.tipo) {
    case 'texto':
      if (typeof v !== 'string') return 'debe ser texto';
      if (!c.multilinea && v.includes('\n')) return 'no admite saltos de línea';
      if (c.requerido && v.trim() === '') return 'no puede ir vacío';
      return null;
    case 'lista':
      if (!Array.isArray(v) || !v.every(esTextoSinSalto)) return 'debe ser una lista de líneas';
      if (v.some((l) => l.trim() === '')) return 'tiene una línea vacía';
      if (c.requerido && v.length === 0) return 'necesita al menos una línea';
      return null;
    case 'parrafos':
      if (!Array.isArray(v) || !v.every((p) => typeof p === 'string' && !p.includes('\n\n')))
        return 'debe ser una lista de párrafos';
      if (v.some((p) => p.trim() === '')) return 'tiene un párrafo vacío';
      if (v.some((p) => p.startsWith('\n') || p.endsWith('\n')))
        return 'un párrafo empieza o termina con un salto de línea';
      if (c.requerido && v.length === 0) return 'necesita al menos un párrafo';
      return null;
    case 'entero':
      return Number.isInteger(v) ? null : 'debe ser un entero';
    case 'dinero':
      return Number.isInteger(v) && (v as number) >= 0 ? null : 'debe ser centavos enteros ≥ 0';
    case 'booleano':
      return typeof v === 'boolean' ? null : 'debe ser verdadero o falso';
    case 'opcion':
      return c.opciones.includes(v as string) ? null : `opción fuera de ${c.opciones.join(', ')}`;
    case 'referencia':
      return typeof v === 'string' && ID_VALIDO.test(v) ? null : 'debe ser un id';
    case 'referencias':
      if (!Array.isArray(v) || !v.every((x) => typeof x === 'string' && ID_VALIDO.test(x)))
        return 'debe ser una lista de ids';
      if (new Set(v).size !== v.length) return 'tiene ids repetidos';
      return null;
    case 'imagen':
      return typeof v === 'string' && /^[a-z0-9-]+\/[^/]+\.(jpe?g|png|webp|avif)$/i.test(v)
        ? null
        : 'debe ser carpeta/archivo de imagen';
    case 'enlace':
      return typeof v === 'string' && /^https?:\/\/\S+$/.test(v) ? null : 'debe ser una URL';
    case 'fecha':
      return typeof v === 'string' && !Number.isNaN(Date.parse(v)) ? null : 'debe ser una fecha';
  }
}

function revisarRegistro(e: Entidad, r: RegistroLibre): Problema[] {
  const problemas: Problema[] = [];
  const anota = (campo: string, mensaje: string) =>
    problemas.push({ entidad: e.clave, id: String(r.id), campo, mensaje });
  if (typeof r.id !== 'string' || !ID_VALIDO.test(r.id)) anota('id', 'id inválido');
  if (typeof r.nombre !== 'string' || r.nombre.trim() === '') anota('nombre', 'nombre vacío');
  if (typeof r.nombre === 'string' && r.nombre.length > 256)
    anota('nombre', 'más de 256 caracteres');
  for (const [k, c] of Object.entries(e.campos)) {
    const v = r[k];
    if (v === undefined) {
      if (c.requerido || siempreConValor(c)) anota(k, 'falta');
      continue;
    }
    const error = revisarValor(c, v);
    if (error) anota(k, error);
    if (c.tipo === 'imagen' && typeof v === 'string' && !v.startsWith(`${c.carpeta}/`))
      anota(k, `debe estar en la carpeta ${c.carpeta}`);
  }
  for (const k of Object.keys(r))
    if (k !== 'id' && k !== 'nombre' && !(k in e.campos))
      anota(k, 'campo que el esquema no declara');
  return problemas;
}

function revisarReferencias(e: Entidad, r: RegistroLibre, leer: Lector): Problema[] {
  const problemas: Problema[] = [];
  for (const [k, c] of Object.entries(e.campos)) {
    if (c.tipo !== 'referencia' && c.tipo !== 'referencias') continue;
    const destino = new Set(leer(entidadPorClave(c.entidad).clave).map((x) => x.id));
    const ids = c.tipo === 'referencia' ? [r[k]] : ((r[k] as unknown[] | undefined) ?? []);
    for (const id of ids)
      if (id !== undefined && !destino.has(id as string))
        problemas.push({
          entidad: e.clave,
          id: r.id,
          campo: k,
          mensaje: `apunta a «${id}», que no existe`,
        });
  }
  return problemas;
}

export function validarConjunto(leer: Lector): Problema[] {
  const problemas: Problema[] = [];
  for (const e of entidadesDeContenido()) {
    const registros = leer(e.clave);
    const vistos = new Set<string>();
    if (e.unica && registros.length !== 1)
      problemas.push({
        entidad: e.clave,
        id: '-',
        campo: '-',
        mensaje: 'debe tener exactamente un registro',
      });
    for (const r of registros) {
      if (vistos.has(r.id))
        problemas.push({ entidad: e.clave, id: r.id, campo: 'id', mensaje: 'id repetido' });
      vistos.add(r.id);
      problemas.push(...revisarRegistro(e, r), ...revisarReferencias(e, r, leer));
    }
  }
  return problemas;
}
