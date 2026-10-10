import {
  booleano,
  entero,
  imagen,
  lista,
  opcion,
  parrafos,
  referencia,
  referencias,
  texto,
} from '../campos.ts';
import { entidad } from '../entidad.ts';
import { COLORES, PAGINAS_FAQ } from '../vocabulario.ts';

export const testimonio = entidad({
  clave: 'testimonio',
  coleccion: 'testimonios',
  titulo: 'Testimonios',
  singular: 'Testimonio',
  descripcion: 'Las voces de pacientes, con su foto cuando la hay.',
  almacen: 'cms',
  orden: 'prioridad',
  campos: {
    lugar: texto({ requerido: false, ayuda: 'País o ciudad.' }),
    foto: imagen('testimonios', { requerido: false, ayuda: 'Foto pequeña y nítida.' }),
    motivos: lista({ requerido: false, ayuda: 'Motivos de consulta, una línea por motivo.' }),
    destacado: texto({ multilinea: true, ayuda: 'La frase que se destaca.' }),
    texto: parrafos({ ayuda: 'El testimonio completo; una línea vacía separa los párrafos.' }),
    prioridad: entero({ ayuda: 'Orden en el muro, de menor a mayor.' }),
    enAsesorias: booleano({ ayuda: 'Si aparece también en la página de Asesorías.' }),
  },
});

export const pregunta = entidad({
  clave: 'pregunta',
  coleccion: 'preguntas-frecuentes',
  titulo: 'Preguntas frecuentes',
  singular: 'Pregunta frecuente',
  descripcion:
    'Preguntas del inicio y de exámenes. Los nombres y precios se escriben como {nombre:id} y {precio:id} y se completan solos.',
  almacen: 'cms',
  orden: 'orden',
  campos: {
    pagina: opcion(PAGINAS_FAQ, { ayuda: 'Página donde aparece.' }),
    pregunta: texto({ multilinea: true, ayuda: 'La pregunta.' }),
    respuesta: texto({ multilinea: true, ayuda: 'La respuesta.' }),
    orden: entero({ ayuda: 'Posición en su página, de menor a mayor.' }),
  },
});

export const layer = entidad({
  clave: 'layer',
  coleccion: 'layers',
  titulo: 'Layers',
  singular: 'Layer',
  descripcion: 'Las cinco capas de The Layer Method™.',
  almacen: 'cms',
  orden: 'orden',
  campos: {
    pregunta: texto({ multilinea: true, ayuda: 'La pregunta de la capa.' }),
    observaTexto: texto({ multilinea: true, ayuda: 'Introducción a lo que observa.' }),
    observa: lista({ ayuda: 'Lo que observa, una línea por punto.' }),
    cita: texto({ multilinea: true, ayuda: 'Cita de la capa.' }),
    conecta: referencias('layer', { ayuda: 'Capas con las que se conecta.' }),
    rol: texto({ ayuda: 'Rol de la capa.' }),
    color: opcion(COLORES, { ayuda: 'Color de la capa.' }),
    oscuro: booleano({ ayuda: 'Si la capa va sobre fondo oscuro.' }),
    orden: entero({ ayuda: 'Posición, de menor a mayor.' }),
  },
});

export const suplemento = entidad({
  clave: 'suplemento',
  coleccion: 'suplementos',
  titulo: 'Suplementos',
  singular: 'Suplemento',
  descripcion: 'Los suplementos recomendados en el estante de cada capa.',
  almacen: 'cms',
  orden: 'orden',
  campos: {
    marca: texto({ ayuda: 'Marca del suplemento.' }),
    layer: referencia('layer', { ayuda: 'Capa en cuyo estante aparece.' }),
    orden: entero({ ayuda: 'Posición dentro de su capa, de menor a mayor.' }),
  },
});
