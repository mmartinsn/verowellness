import type { RegistroLibre } from './entidad.ts';
import type { Problema } from './validar.ts';

type Lector = (clave: string) => readonly RegistroLibre[];

export const TOKEN = /\{(nombre|precio):([a-z0-9-]+)\}/g;

export const precioOferta = (base: number, descuento: number): number =>
  Math.round((base * (100 - descuento)) / 100);

const presentaciones = [
  { entidad: 'examen', tipo: 'examen' },
  { entidad: 'asesoria', tipo: 'asesoria' },
  { entidad: 'guia', tipo: 'guia' },
] as const;

export function validarReglas(leer: Lector): Problema[] {
  const problemas: Problema[] = [];
  const anota = (entidad: string, id: string, campo: string, mensaje: string) =>
    problemas.push({ entidad, id, campo, mensaje });
  const productos = new Map(leer('producto').map((p) => [p.id, p]));
  const tipoDe = (id: unknown) => productos.get(id as string)?.tipo;
  const usados = new Map<string, number>();
  const usa = (id: unknown) => usados.set(id as string, (usados.get(id as string) ?? 0) + 1);

  for (const { entidad, tipo } of presentaciones)
    for (const r of leer(entidad)) {
      if (tipoDe(r.producto) !== tipo)
        anota(entidad, r.id, 'producto', `debe ser un producto de tipo ${tipo}`);
      if (productos.get(r.producto as string)?.nombre !== r.nombre)
        anota(entidad, r.id, 'nombre', 'debe ser igual al nombre de su producto');
      usa(r.producto);
    }

  const ajustes = leer('ajustes')[0];
  const descuento = Number(ajustes?.descuentoOferta ?? 0);
  if (ajustes) {
    if (tipoDe(ajustes.cargoLaboratorio) !== 'cargo')
      anota('ajustes', ajustes.id, 'cargoLaboratorio', 'debe ser un producto de tipo cargo');
    usa(ajustes.cargoLaboratorio);
    const guias = new Map(leer('guia').map((g) => [g.id, g]));
    for (const id of (ajustes.ofertaGuias as string[]) ?? [])
      if (!guias.get(id)?.oferta)
        anota('ajustes', ajustes.id, 'ofertaGuias', `la guía «${id}» no tiene oferta`);
  }

  for (const g of leer('guia')) {
    if (g.oferta === undefined) continue;
    usa(g.oferta);
    const oferta = productos.get(g.oferta as string);
    const base = productos.get(g.producto as string);
    if (oferta?.tipo !== 'oferta')
      anota('guia', g.id, 'oferta', 'debe ser un producto de tipo oferta');
    else if (base && oferta.precio !== precioOferta(Number(base.precio), descuento))
      anota(
        'producto',
        oferta.id,
        'precio',
        `debe ser ${precioOferta(Number(base.precio), descuento)} (${descuento} % menos que ${base.id})`
      );
  }

  for (const p of productos.values()) {
    const veces = usados.get(p.id) ?? 0;
    if (veces === 0) anota('producto', p.id, '-', 'producto sin presentación (huérfano)');
    if ((p.tipo === 'oferta' || p.tipo === 'cargo') && veces > 1)
      anota('producto', p.id, '-', 'producto de oferta o cargo usado más de una vez');
  }

  for (const r of leer('rutaSintoma'))
    if ((r.examenes as string[]).length === 0)
      anota('rutaSintoma', r.id, 'examenes', 'ruta sin exámenes');
  const conRutas = new Set(leer('rutaSintoma').map((r) => r.sintoma));
  for (const s of leer('sintoma'))
    if (!conRutas.has(s.id)) anota('sintoma', s.id, '-', 'síntoma sin rutas');

  for (const q of leer('pregunta'))
    for (const campo of ['pregunta', 'respuesta'] as const)
      for (const [, , id] of String(q[campo]).matchAll(TOKEN))
        if (!productos.has(id))
          anota('pregunta', q.id, campo, `token hacia «${id}», que no existe`);

  return problemas;
}
