import type { ImageMetadata } from 'astro';
import { ciclos, rotuloCitas, type Ciclo } from '../../data/oferta';
import { productos } from '../../data/tienda';

export interface GuiaOferta {
  id: string;
  nombre: string;
  precio: number;
  portada: ImageMetadata;
}

export interface OpcionLectura {
  id: string;
  rotulo: string;
  nombre: string;
  precio: number;
  texto: string;
}

const ORDEN_SUGERENCIAS = [
  'recetario-30-desayunos',
  'hackear-tu-cerebro',
  'guia-hormonas-30',
  'guia-glp1-retatrutida',
];

function aGuia({ id, nombre, precio, portada }: GuiaOferta): GuiaOferta {
  return { id, nombre, precio, portada };
}

export function guiasEnOferta(): GuiaOferta[] {
  return productos.map(aGuia);
}

export function guiasSugeridas(): GuiaOferta[] {
  return ORDEN_SUGERENCIAS.map((id) => productos.find((p) => p.id === id))
    .filter((p): p is (typeof productos)[number] => !!p)
    .map(aGuia);
}

function opcion(ciclo: Ciclo, texto: string): OpcionLectura {
  return {
    id: ciclo.id,
    rotulo: rotuloCitas(ciclo),
    nombre: ciclo.nombre,
    precio: ciclo.subtotal,
    texto,
  };
}

export function opcionesLectura(): OpcionLectura[] {
  return [
    opcion(ciclos.LAYER_SESSION, 'Se brinda lectura de exámenes y plan de acción.'),
    opcion(
      ciclos.INITIAL_LAYER_CYCLE,
      'Aseguras el seguimiento de los pasos del plan de acción en base a tus resultados.'
    ),
  ];
}
