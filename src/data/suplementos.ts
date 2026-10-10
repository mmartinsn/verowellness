import { todos, unico, uno } from '../lib/datos/canonico';
import { completar } from '../lib/datos/plantillas';

const ajustes = unico('ajustes');

export const wholescripts = {
  registro: ajustes.wholescriptsRegistro,
  codigo: (ajustes.wholescriptsCodigo ?? null) as string | null,
  apellido: (ajustes.wholescriptsApellido ?? null) as string | null,
  pendiente: ajustes.wholescriptsPendiente,
};

export const etiqueta = {
  si: [
    'Tu contexto (The Layer Assessment)',
    'Una prioridad que lo justifique',
    'Calidad de grado profesional',
    'Revisión en tu siguiente sesión',
  ],
  no: ['Modas', '"Por si acaso"', 'Listas genéricas'],
};

export const principios = [
  {
    titulo: 'Primero el mapa',
    texto:
      'Un suplemento entra cuando responde a una de tus prioridades, no antes. Por eso se define dentro de tu Layer Plan, junto con la alimentación y los hábitos.',
  },
  {
    titulo: 'Calidad que se puede rastrear',
    texto:
      'Recomiendo marcas de grado profesional a través de Wholescripts, una plataforma para profesionales de la salud. Tú compras directamente ahí.',
  },
  {
    titulo: 'Se revisa, no se acumula',
    texto:
      'Lo que tomas se revisa en cada ciclo: qué está ayudando, qué ya no hace falta y qué conviene ajustar.',
  },
];

export const avisoSuplementos =
  'Los suplementos no sustituyen un diagnóstico ni un tratamiento médico. Consulta con tu médico antes de empezar cualquiera, sobre todo si estás embarazada, en lactancia o tomas medicación. Veronica Wellness no procesa pagos ni almacena datos de tarjetas: el registro, la compra y el envío se hacen en Wholescripts.';

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
