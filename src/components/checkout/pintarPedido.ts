import { FEE_POR_EXAMEN, usd, type LineaPedido, type TotalesPedido } from '../../lib/precio';

function precioDe(l: LineaPedido): HTMLSpanElement {
  const precio = document.createElement('span');
  precio.className = 'linea-precio';
  if (l.precioLista !== undefined) {
    const lista = document.createElement('s');
    lista.textContent = usd(l.precioLista);
    precio.append(lista, ' ');
  }
  precio.append(usd(l.precio));
  return precio;
}

function botonQuitar(l: LineaPedido): HTMLButtonElement {
  const quitar = document.createElement('button');
  quitar.type = 'button';
  quitar.className = 'linea-quitar';
  quitar.dataset.quitar = JSON.stringify({ grupo: l.grupo, id: l.id });
  quitar.setAttribute('aria-label', `Quitar ${l.nombre} del pedido`);
  quitar.textContent = '×';
  return quitar;
}

function itemDe(l: LineaPedido): HTMLLIElement {
  const li = document.createElement('li');
  const nombre = document.createElement('span');
  nombre.className = 'linea-nombre';
  nombre.textContent = l.nombre;
  li.append(nombre, precioDe(l));
  if (l.tipo === 'guia' && l.grupo) li.append(botonQuitar(l));
  return li;
}

export function pintarLineas(raiz: HTMLElement, lineas: LineaPedido[], visibles: boolean): void {
  raiz.querySelectorAll<HTMLElement>('[data-lineas]').forEach((ul) => {
    ul.hidden = !visibles;
    ul.replaceChildren(...lineas.map(itemDe));
  });
}

export function pintarTotales(raiz: HTMLElement, t: TotalesPedido): void {
  const poner = (selector: string, texto: string) =>
    raiz.querySelectorAll(selector).forEach((el) => (el.textContent = texto));
  poner('[data-subtotal]', usd(t.subtotal));
  poner('[data-impuesto]', usd(t.impuesto));
  poner('[data-fees]', usd(t.fees));
  poner('[data-fees-detalle]', `${t.examenes} × ${usd(FEE_POR_EXAMEN)}`);
  poner('[data-total]', usd(t.total));
  raiz
    .querySelectorAll<HTMLElement>('[data-fila-fees]')
    .forEach((el) => (el.hidden = t.fees === 0));
}
