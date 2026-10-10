import { todos, unico, uno } from '../lib/datos/canonico';
import { completar } from '../lib/datos/plantillas';
import { bloques, items, texto } from '../lib/datos/bloques';

const ajustes = unico('ajustes');

export const wholescripts = {
  registro: ajustes.wholescriptsRegistro,
  codigo: (ajustes.wholescriptsCodigo ?? null) as string | null,
  apellido: (ajustes.wholescriptsApellido ?? null) as string | null,
  pendiente: ajustes.wholescriptsPendiente,
};

export const etiqueta = {
  si: items('suplementos', 'etiqueta-si'),
  no: items('suplementos', 'etiqueta-no'),
};

export const principios = bloques('suplementos', 'principios').map((b) => ({
  titulo: b.titulo as string,
  texto: b.texto as string,
}));

export const avisoSuplementos = texto('suplementos', 'aviso');

export interface Suplemento {
  nombre: string;
  marca: string;
}

const suplementos = todos('suplemento');

export const recomendaciones = Object.fromEntries(
  todos('layer').map((l) => [
    l.id,
    suplementos.filter((s) => s.layer === l.id).map((s) => ({ nombre: s.nombre, marca: s.marca })),
  ])
) as Record<'01' | '02' | '03' | '04' | '05', Suplemento[]>;

export const tipOrden = completar(uno('pregunta', 'inicio-01').respuesta);
