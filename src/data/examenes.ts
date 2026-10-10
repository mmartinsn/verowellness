import { desdeCentavos } from '../lib/precio';
import { todos, unico, uno, type Fila } from '../lib/datos/canonico';
import { completar } from '../lib/datos/plantillas';
import { si } from '../lib/datos/forma';

export type Muestra = 'heces' | 'orina' | 'sangre' | 'saliva' | 'aliento' | 'hisopo' | 'ambiente';

export interface Area {
  id: string;
  nombre: string;
  color: string;
}

export interface Examen {
  id: string;
  producto?: string;
  area: string;
  nombre: string;
  laboratorio?: string;
  precio: number;
  muestras: Muestra[];
  enCasa: boolean;
  descripcion: string;
  instructivo?: string;
}

export const muestras = Object.fromEntries(
  todos('tipoMuestra').map((m) => [m.id, m.nombre])
) as Record<Muestra, string>;

export const areas: Area[] = todos('area').map((a) => ({
  id: a.id,
  nombre: a.nombre,
  color: a.color,
}));

const aExamen = (e: Fila<'examen'>): Examen => {
  const producto = uno('producto', e.producto);
  return {
    id: e.id,
    ...si('producto', e.producto === e.id ? undefined : e.producto),
    area: e.area,
    nombre: producto.nombre,
    ...si('laboratorio', e.laboratorio),
    precio: desdeCentavos(producto.precio),
    muestras: e.muestras as Muestra[],
    enCasa: e.enCasa,
    descripcion: e.descripcion,
    ...si('instructivo', e.instructivo),
  };
};

export const examenes: Examen[] = todos('examen').map(aExamen);

export const examenPorId = new Map(examenes.map((e) => [e.id, e]));

export function productoDe(e: Examen): string {
  return e.producto ?? e.id;
}

export const pasosPedido = [
  {
    titulo: 'Elige y paga',
    texto: 'Arma tu selección, completa tus datos y la dirección de envío, y paga de forma segura.',
  },
  {
    titulo: 'Recibe tu kit',
    texto: 'Te llega a la dirección que indicaste, con las instrucciones de tu examen.',
  },
  {
    titulo: 'Toma y envía tu muestra',
    texto:
      'Cada examen tiene su propia forma de tomar la muestra: sigue su instructivo y envíala al laboratorio.',
  },
  {
    titulo: 'Recibe tus resultados',
    texto:
      'Entre 15 y 25 días hábiles desde que tu muestra llega al laboratorio, por email; los revisamos juntas en tu asesoría.',
  },
];

export function examenesDeArea(areaId: string): Examen[] {
  return examenes.filter((e) => e.area === areaId);
}

export const CLAVE_SELECCION = 'vw-examenes-seleccion';

export const FEE_LABORATORIO = desdeCentavos(
  uno('producto', unico('ajustes').cargoLaboratorio).precio
);

export const preguntasExamenes = todos('pregunta')
  .filter((p) => p.pagina === 'examenes')
  .map((p) => ({ q: completar(p.pregunta), a: completar(p.respuesta) }));
