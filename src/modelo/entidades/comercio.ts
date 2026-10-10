import {
  booleano,
  dinero,
  enlace,
  entero,
  imagen,
  lista,
  opcion,
  referencia,
  referencias,
  texto,
} from '../campos.ts';
import { entidad } from '../entidad.ts';
import { CLASES_IMPUESTO, TIPOS_PRODUCTO, TONOS_GUIA } from '../vocabulario.ts';

export const producto = entidad({
  clave: 'producto',
  coleccion: 'productos',
  titulo: 'Productos',
  singular: 'Producto',
  descripcion:
    'Lo que se vende: el nombre, el precio y cómo se cobra. Cada asesoría, guía, examen, oferta y cargo es un producto; su presentación vive en su propia colección.',
  almacen: 'comercio',
  campos: {
    tipo: opcion(TIPOS_PRODUCTO, { ayuda: 'Qué clase de producto es; define su categoría.' }),
    precio: dinero({ ayuda: 'Precio de venta antes de impuestos, en centavos de USD.' }),
    impuesto: opcion(CLASES_IMPUESTO, { ayuda: 'Clase de impuesto para el cálculo automático.' }),
    enviable: booleano({ ayuda: 'Si el pedido necesita dirección de envío.' }),
    sku: texto({ ayuda: 'Código interno único del producto.' }),
    descripcion: texto({ requerido: false, multilinea: true, ayuda: 'Descripción comercial.' }),
    descarga: enlace({
      requerido: false,
      ayuda: 'Enlace que recibe quien compra (PDF de la guía o página de agenda).',
    }),
  },
});

export const asesoria = entidad({
  clave: 'asesoria',
  coleccion: 'asesorias',
  titulo: 'Asesorías',
  singular: 'Asesoría',
  descripcion:
    'Las consultas y ciclos 1:1: lo que incluye cada uno y lo que pasa después de pagar.',
  almacen: 'cms',
  orden: 'orden',
  campos: {
    clave: texto({ ayuda: 'Identificador fijo que usa el código (LAYER_SESSION…).' }),
    producto: referencia('producto', { ayuda: 'Producto que se cobra.' }),
    consultas: texto({ ayuda: '«1 consulta», «2 consultas»…' }),
    etiqueta: texto({ ayuda: 'Etiqueta de la tarjeta de precio.' }),
    etiquetaNota: texto({ requerido: false, ayuda: 'Nota pequeña bajo la etiqueta.' }),
    descripcion: texto({ multilinea: true, ayuda: 'Descripción de la tarjeta de precio.' }),
    descripcionCorta: texto({ multilinea: true, ayuda: 'Descripción del resumen del pago.' }),
    incluye: lista({ ayuda: 'Lo que incluye, una línea por punto.' }),
    incluyeCheckout: lista({
      ayuda: 'Lo que incluye en el resumen del pago, una línea por punto.',
    }),
    notaPie: texto({ requerido: false, multilinea: true, ayuda: 'Nota al pie de la tarjeta.' }),
    bonus: texto({ requerido: false, ayuda: 'Regalo que acompaña al ciclo.' }),
    confirmacionTitulo: texto({ ayuda: 'Título de la pantalla después de pagar.' }),
    confirmacionTexto: texto({ multilinea: true, ayuda: 'Texto de la pantalla después de pagar.' }),
    calendlyUrl: enlace({ ayuda: 'Enlace de Calendly para agendar.' }),
    calendlyEtiqueta: texto({ ayuda: 'Rótulo del enlace de Calendly.' }),
    publica: booleano({ ayuda: 'Si se muestra con precio en el sitio.' }),
    orden: entero({ ayuda: 'Posición en el sitio, de menor a mayor.' }),
  },
});

export const guia = entidad({
  clave: 'guia',
  coleccion: 'guias',
  titulo: 'Guías',
  singular: 'Guía',
  descripcion: 'Las guías y recetarios en PDF de la tienda.',
  almacen: 'cms',
  orden: 'orden',
  campos: {
    producto: referencia('producto', { ayuda: 'Producto que se cobra.' }),
    oferta: referencia('producto', {
      requerido: false,
      ayuda: 'Producto con el descuento que se ofrece dentro del pedido.',
    }),
    num: texto({ ayuda: 'Número del capítulo en la tienda («01»).' }),
    paginas: entero({ ayuda: 'Páginas del PDF.' }),
    tituloPortada: texto({ ayuda: 'Título impreso en la portada.' }),
    portada: imagen('tienda', { ayuda: 'Imagen de la portada.' }),
    masVendido: booleano({ ayuda: 'Marca «Más vendido».' }),
    subtitulo: texto({ multilinea: true, ayuda: 'Subtítulo bajo el nombre.' }),
    gancho: texto({ multilinea: true, ayuda: 'Pregunta o frase de entrada.' }),
    paraTi: lista({ requerido: false, ayuda: '«Para ti si…», una línea por punto.' }),
    incluye: lista({ ayuda: '«Dentro encontrarás», una línea por punto.' }),
    cita: texto({ multilinea: true, ayuda: 'Frase de cierre.' }),
    citaPagina: entero({ requerido: false, ayuda: 'Página del libro de donde sale la cita.' }),
    formato: texto({ ayuda: '«PDF · 34 páginas»…' }),
    nota: texto({ requerido: false, multilinea: true, ayuda: 'Nota de alcance bajo el capítulo.' }),
    boton: texto({ ayuda: 'Texto del botón de compra.' }),
    tono: opcion(TONOS_GUIA, { ayuda: 'Color del capítulo.' }),
    orden: entero({ ayuda: 'Posición en la tienda, de menor a mayor.' }),
  },
});

export const ajustes = entidad({
  clave: 'ajustes',
  coleccion: 'ajustes',
  titulo: 'Ajustes',
  singular: 'Ajustes',
  descripcion: 'Valores de funcionamiento del sitio. Hay un solo registro.',
  almacen: 'cms',
  unica: true,
  campos: {
    descuentoOferta: entero({ ayuda: 'Porcentaje de descuento de la guía ofrecida en el pedido.' }),
    ofertaGuias: referencias('guia', {
      ayuda: 'Guías que se ofrecen con descuento dentro del pedido, en orden de prioridad.',
    }),
    cargoLaboratorio: referencia('producto', { ayuda: 'Producto del cargo de laboratorio.' }),
    wholescriptsRegistro: enlace({ ayuda: 'Página de registro en Wholescripts.' }),
    wholescriptsCodigo: texto({ requerido: false, ayuda: 'Código de la cuenta en Wholescripts.' }),
    wholescriptsApellido: texto({ requerido: false, ayuda: 'Apellido para buscar la cuenta.' }),
    wholescriptsPendiente: booleano({ ayuda: 'Si la cuenta de Wholescripts está por confirmar.' }),
  },
});
