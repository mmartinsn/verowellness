import { todos } from '../lib/datos/canonico';
import { si } from '../lib/datos/forma';

export const presentacionGrupo: Record<string, { icono: string; descripcion: string }> =
  Object.fromEntries(
    todos('area').map((a) => [a.id, { icono: a.icono, descripcion: a.descripcion }])
  );

export const caminosAlimentos: { id: string; pregunta: string; ayuda: string; ids: string[] }[] =
  todos('caminoAlimentos').map((c) => ({
    id: c.id,
    pregunta: c.pregunta,
    ayuda: c.ayuda,
    ids: c.examenes,
  }));

export const mideAlimentos: Record<string, { alimentos?: number; mide: string[] }> =
  Object.fromEntries(
    todos('examen')
      .filter((e) => e.mide.length > 0)
      .map((e) => [e.id, { ...si('alimentos', e.alimentos), mide: e.mide }])
  );
