import {
  booleano,
  enlace,
  entero,
  lista,
  opcion,
  referencia,
  referencias,
  texto,
} from '../campos.ts';
import { entidad } from '../entidad.ts';
import { COLORES, LABORATORIOS } from '../vocabulario.ts';

export const area = entidad({
  clave: 'area',
  coleccion: 'areas',
  titulo: 'Áreas de exámenes',
  singular: 'Área',
  descripcion: 'Los grupos del catálogo de exámenes (Gastrointestinal, Hormonales…).',
  almacen: 'cms',
  orden: 'orden',
  campos: {
    color: opcion(COLORES, { ayuda: 'Color del grupo.' }),
    icono: texto({ ayuda: 'Trazo SVG del ícono del grupo.' }),
    descripcion: texto({ multilinea: true, ayuda: 'Descripción bajo el nombre del grupo.' }),
    orden: entero({ ayuda: 'Posición en el catálogo, de menor a mayor.' }),
  },
});

export const tipoMuestra = entidad({
  clave: 'tipoMuestra',
  coleccion: 'tipos-de-muestra',
  titulo: 'Tipos de muestra',
  singular: 'Tipo de muestra',
  descripcion: 'Cómo se toma la muestra de un examen (heces, sangre, saliva…).',
  almacen: 'cms',
  orden: 'orden',
  campos: {
    orden: entero({ ayuda: 'Posición, de menor a mayor.' }),
  },
});

export const examen = entidad({
  clave: 'examen',
  coleccion: 'examenes',
  titulo: 'Exámenes',
  singular: 'Examen',
  descripcion:
    'Cada tarjeta del catálogo de exámenes con su ficha completa. Un mismo producto puede tener dos tarjetas en áreas distintas.',
  almacen: 'cms',
  orden: 'orden',
  campos: {
    producto: referencia('producto', { ayuda: 'Producto que se cobra (nombre y precio).' }),
    area: referencia('area', { ayuda: 'Área del catálogo.' }),
    laboratorio: opcion(LABORATORIOS, { requerido: false, ayuda: 'Laboratorio que lo procesa.' }),
    muestras: referencias('tipoMuestra', { ayuda: 'Tipos de muestra que pide.' }),
    enCasa: booleano({ ayuda: 'Si la muestra se toma en casa.' }),
    descripcion: texto({ multilinea: true, ayuda: 'Descripción del examen.' }),
    instructivo: enlace({ requerido: false, ayuda: 'PDF con las instrucciones.' }),
    gancho: texto({ multilinea: true, ayuda: 'Frase de entrada de la ficha.' }),
    queMide: lista({ ayuda: 'Qué mide, una línea por punto.' }),
    porQueImporta: texto({ multilinea: true, ayuda: 'Por qué importa.' }),
    ideal: lista({ ayuda: 'Ideal si…, una línea por punto.' }),
    obtienes: lista({ ayuda: 'Qué obtienes, una línea por punto.' }),
    alimentos: entero({ requerido: false, ayuda: 'Cuántos alimentos evalúa (paneles).' }),
    mide: lista({
      requerido: false,
      ayuda: 'Qué evalúa el panel de alimentos, una línea por punto.',
    }),
    orden: entero({ ayuda: 'Posición en el catálogo, de menor a mayor.' }),
  },
});

export const sintoma = entidad({
  clave: 'sintoma',
  coleccion: 'sintomas',
  titulo: 'Síntomas',
  singular: 'Síntoma',
  descripcion: 'Las tarjetas «por síntoma» que llevan a los exámenes.',
  almacen: 'cms',
  orden: 'orden',
  campos: {
    ejemplos: texto({ multilinea: true, ayuda: 'Ejemplos en la voz de la visitante.' }),
    color: opcion(COLORES, { ayuda: 'Color de la tarjeta.' }),
    icono: texto({ ayuda: 'Trazo SVG del ícono.' }),
    orientacion: booleano({ ayuda: 'Si propone empezar por una consulta.' }),
    orden: entero({ ayuda: 'Posición, de menor a mayor.' }),
  },
});

export const rutaSintoma = entidad({
  clave: 'rutaSintoma',
  coleccion: 'rutas-de-sintoma',
  titulo: 'Rutas de síntoma',
  singular: 'Ruta de síntoma',
  descripcion: 'Cada pregunta dentro de un síntoma, con los exámenes que propone en orden.',
  almacen: 'cms',
  orden: 'orden',
  campos: {
    sintoma: referencia('sintoma', { ayuda: 'Síntoma al que pertenece.' }),
    pregunta: texto({ multilinea: true, ayuda: 'Pregunta que abre la ruta.' }),
    examenes: referencias('examen', {
      ayuda: 'Exámenes que propone, del más simple al más completo.',
    }),
    orden: entero({ ayuda: 'Posición dentro del síntoma, de menor a mayor.' }),
  },
});

export const caminoAlimentos = entidad({
  clave: 'caminoAlimentos',
  coleccion: 'caminos-de-alimentos',
  titulo: 'Caminos de alimentos',
  singular: 'Camino de alimentos',
  descripcion: 'Las preguntas guiadas para elegir un panel de reacciones a alimentos.',
  almacen: 'cms',
  orden: 'orden',
  campos: {
    pregunta: texto({ ayuda: 'Pregunta del camino.' }),
    ayuda: texto({ multilinea: true, ayuda: 'Texto de ayuda bajo la pregunta.' }),
    examenes: referencias('examen', { ayuda: 'Exámenes que propone.' }),
    orden: entero({ ayuda: 'Posición, de menor a mayor.' }),
  },
});
