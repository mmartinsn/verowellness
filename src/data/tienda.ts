import type { ImageMetadata } from 'astro';
import { desdeCentavos } from '../lib/precio';
import { todos, unico, uno, type Fila } from '../lib/datos/canonico';
import { imagen } from '../lib/datos/imagenes';
import { si, siHay, siVerdadero } from '../lib/datos/forma';
import { texto } from '../lib/datos/bloques';

export interface Producto {
  id: string;
  num: string;
  paginas: number;
  nombre: string;
  tituloPortada: string;
  precio: number;
  portada: ImageMetadata;
  bestSeller?: boolean;
  subtitulo: string;
  gancho: string;
  paraTi?: string[];
  incluye: string[];
  cita: { texto: string; pagina?: number };
  formato: string;
  nota?: string;
  boton: string;
  tono: 'clay' | 'sage' | 'rose';
}

const aProducto = (g: Fila<'guia'>): Producto => {
  const producto = uno('producto', g.producto);
  return {
    id: g.id,
    num: g.num,
    paginas: g.paginas,
    nombre: producto.nombre,
    tituloPortada: g.tituloPortada,
    precio: desdeCentavos(producto.precio),
    ...siVerdadero('bestSeller', g.masVendido),
    portada: imagen(g.portada),
    subtitulo: g.subtitulo,
    gancho: g.gancho,
    ...siHay('paraTi', g.paraTi),
    incluye: g.incluye,
    cita: { texto: g.cita, ...si('pagina', g.citaPagina) },
    formato: g.formato,
    ...si('nota', g.nota),
    boton: g.boton,
    tono: g.tono,
  };
};

export const productos: Producto[] = todos('guia').map(aProducto);

export function precioTienda(n: number): string {
  return `USD ${Number.isInteger(n) ? n : n.toFixed(2).replace('.', ',')}`;
}

export function guiasCheckout() {
  return productos.map((p) => ({
    id: p.id,
    nombre: p.nombre,
    precio: p.precio,
    portada: p.portada.src,
  }));
}

const ajustes = unico('ajustes');

export const ofertaPopupGuias = [...ajustes.ofertaGuias];

export const DESCUENTO_POPUP = ajustes.descuentoOferta / 100;

export const CLAVE_TIENDA = 'vw-tienda-seleccion';

export const avisoLegal = texto('tienda', 'aviso-legal');
