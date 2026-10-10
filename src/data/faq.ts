import { todos } from '../lib/datos/canonico';
import { completar } from '../lib/datos/plantillas';

export interface Pregunta {
  q: string;
  a: string;
}

export const faq: Pregunta[] = todos('pregunta')
  .filter((p) => p.pagina === 'inicio')
  .map((p) => ({ q: completar(p.pregunta), a: completar(p.respuesta) }));
