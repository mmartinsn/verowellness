import { dinero, entero, fecha, opcion, referencia, texto } from '../campos.ts';
import { entidad } from '../entidad.ts';
import { ESTADOS_PEDIDO, METODOS_PAGO, MONEDAS } from '../vocabulario.ts';

export const cliente = entidad({
  clave: 'cliente',
  coleccion: 'clientes',
  titulo: 'Clientes',
  singular: 'Cliente',
  descripcion: 'Quien compra. Datos personales: nunca en el repositorio ni en reportes.',
  almacen: 'operacion',
  campos: {
    email: texto({ ayuda: 'Correo, en minúsculas; identifica a la clienta.' }),
    apellido: texto({ ayuda: 'Apellido.' }),
    telefono: texto({ requerido: false, ayuda: 'Teléfono con código de país.' }),
    pais: texto({ requerido: false, ayuda: 'País.' }),
    fuente: texto({ requerido: false, ayuda: 'Cómo conoció a Verónica.' }),
  },
});

export const pedido = entidad({
  clave: 'pedido',
  coleccion: 'pedidos',
  titulo: 'Pedidos',
  singular: 'Pedido',
  descripcion: 'Cada compra, con sus montos en centavos.',
  almacen: 'operacion',
  campos: {
    cliente: referencia('cliente', { ayuda: 'Quien compra.' }),
    fecha: fecha({ ayuda: 'Momento de la compra.' }),
    estado: opcion(ESTADOS_PEDIDO, { ayuda: 'Estado del pedido.' }),
    metodoPago: opcion(METODOS_PAGO, { ayuda: 'Cómo se pagó.' }),
    moneda: opcion(MONEDAS, { ayuda: 'Moneda.' }),
    subtotal: dinero({ ayuda: 'Suma de las líneas.' }),
    impuesto: dinero({ ayuda: 'Impuesto cobrado.' }),
    envio: dinero({ ayuda: 'Envío cobrado.' }),
    total: dinero({ ayuda: 'Total cobrado.' }),
  },
});

export const lineaPedido = entidad({
  clave: 'lineaPedido',
  coleccion: 'lineas-de-pedido',
  titulo: 'Líneas de pedido',
  singular: 'Línea de pedido',
  descripcion: 'Cada producto dentro de un pedido.',
  almacen: 'operacion',
  campos: {
    pedido: referencia('pedido', { ayuda: 'Pedido al que pertenece.' }),
    producto: referencia('producto', { ayuda: 'Producto comprado.' }),
    cantidad: entero({ ayuda: 'Unidades.' }),
    precioUnitario: dinero({ ayuda: 'Precio por unidad al momento de la compra.' }),
  },
});
