export interface OfertaGuia {
  guia: string;
  oferta: string;
}

export interface Catalogo {
  vendibles: string[];
  examenes: string[];
  guias: string[];
  cargo: string;
  ofertas: OfertaGuia[];
}

export interface Linea {
  producto: string;
  cantidad: number;
}

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function leerItems(texto: string): Linea[] {
  return texto
    .split(',')
    .map((parte) => parte.trim().split(':')[0])
    .filter((producto) => SLUG.test(producto))
    .map((producto) => ({ producto, cantidad: 1 }));
}

export function escribirItems(lineas: Linea[]): string {
  return lineas
    .map((l) => (l.cantidad === 1 ? l.producto : `${l.producto}:${l.cantidad}`))
    .join(',');
}

export function ofertaDisponible(productos: string[], catalogo: Catalogo): OfertaGuia | null {
  const hayGuia = productos.some((p) => catalogo.guias.includes(p));
  if (!hayGuia) return null;
  return catalogo.ofertas.find((o) => !productos.includes(o.guia)) ?? null;
}

export function normalizarPedido(lineas: Linea[], catalogo: Catalogo): Linea[] {
  const vistos = new Set<string>();
  const base = lineas.filter((l) => {
    const valido = catalogo.vendibles.includes(l.producto) && !vistos.has(l.producto);
    vistos.add(l.producto);
    return valido;
  });
  const productos = base.map((l) => l.producto);
  const oferta = ofertaDisponible(productos, catalogo);
  const pedidas = new Set(lineas.map((l) => l.producto));
  const salida = base.map((l) => ({ producto: l.producto, cantidad: 1 }));
  if (oferta && pedidas.has(oferta.oferta)) salida.push({ producto: oferta.oferta, cantidad: 1 });
  const examenes = productos.filter((p) => catalogo.examenes.includes(p)).length;
  if (examenes > 0) salida.push({ producto: catalogo.cargo, cantidad: examenes });
  return salida;
}
