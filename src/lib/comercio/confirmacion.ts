export interface ProductoGracias {
  id: string;
  tipo: string;
  guia?: string;
}

export interface CatalogoGracias {
  porNombre: Record<string, ProductoGracias>;
}

export interface Descarga {
  nombre: string;
  url: string;
}

export const normalizarNombre = (nombre: string) =>
  nombre.normalize('NFC').replace(/\s+/g, ' ').trim().toLowerCase();

export function destinoGracias(
  nombres: string[],
  descargas: Descarga[],
  catalogo: CatalogoGracias
): string | null {
  const productos = nombres
    .map((n) => catalogo.porNombre[normalizarNombre(n)])
    .filter((p): p is ProductoGracias => !!p);
  const asesoria = productos.find((p) => p.tipo === 'asesoria');
  const guias = [...new Set(productos.flatMap((p) => (p.guia ? [p.guia] : [])))];
  const q = new URLSearchParams();
  let ruta: string;
  if (productos.some((p) => p.tipo === 'examen')) {
    ruta = 'gracias/examenes/';
    if (asesoria) q.set('lectura', '1');
  } else if (asesoria) ruta = `gracias/${asesoria.id}/`;
  else if (guias.length) {
    ruta = 'gracias/tienda/';
    q.set('guias', guias.join(','));
  } else return null;
  const seguras = descargas.filter((d) => d.nombre && /^https:\/\//.test(d.url));
  if (seguras.length) q.set('descargas', JSON.stringify(seguras));
  const query = q.toString();
  return query ? `${ruta}?${query}` : ruta;
}
