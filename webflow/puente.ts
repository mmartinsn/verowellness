import {
  leerItems,
  normalizarPedido,
  type Catalogo,
  type Linea,
} from '../src/lib/comercio/reglas.ts';

declare const CATALOGO: Catalogo;
declare const VOLVER: string;
declare const TEXTOS: {
  preparando: string;
  vacio: string;
  error: string;
  reintentar: string;
  volver: string;
};

const INTENTOS = 2;

const espera = (ms: number) => new Promise((r) => setTimeout(r, ms));

function estado(texto: string, acciones: { texto: string; href: string }[] = []) {
  let caja = document.querySelector<HTMLElement>('[data-vw-estado]');
  if (!caja) {
    caja = document.createElement('main');
    caja.setAttribute('data-vw-estado', '');
    caja.setAttribute('role', 'status');
    caja.setAttribute('aria-live', 'polite');
    document.body.prepend(caja);
  }
  caja.replaceChildren();
  const p = document.createElement('p');
  p.textContent = texto;
  caja.append(p);
  for (const a of acciones) {
    const enlace = document.createElement('a');
    enlace.textContent = a.texto;
    enlace.href = a.href;
    caja.append(enlace);
  }
}

function escuchar(ventana: Window, operacion: string, ms = 15000): Promise<unknown[]> {
  const original = ventana.fetch;
  return new Promise((resolver, rechazar) => {
    const plazo = setTimeout(() => {
      ventana.fetch = original;
      rechazar(new Error(`Sin respuesta de ${operacion}`));
    }, ms);
    ventana.fetch = async (...args: Parameters<typeof fetch>) => {
      const respuesta = await original.apply(ventana, args);
      const cuerpo = typeof args[1]?.body === 'string' ? args[1].body : '';
      if (cuerpo.includes(`"operationName":"${operacion}"`)) {
        clearTimeout(plazo);
        ventana.fetch = original;
        const datos = await respuesta
          .clone()
          .json()
          .catch(() => null);
        const lista: unknown[] = Array.isArray(datos) ? datos : [datos];
        if (!respuesta.ok || lista.some((d) => (d as { errors?: unknown[] })?.errors?.length))
          rechazar(new Error(`${operacion} falló`));
        else resolver(lista);
      }
      return respuesta;
    };
  });
}

async function hasta<T>(leer: () => T | null | undefined, ms = 10000): Promise<T> {
  const fin = Date.now() + ms;
  for (;;) {
    const valor = leer();
    if (valor) return valor;
    if (Date.now() > fin) throw new Error('Tiempo de espera agotado');
    await espera(150);
  }
}

function consultaCarrito(): string {
  const consulta = document
    .querySelector('[data-wf-cart-query]')
    ?.getAttribute('data-wf-cart-query');
  const nombre = consulta?.match(/query\s+(\w+)/)?.[1];
  if (!nombre) throw new Error('La página no tiene la consulta del carrito');
  return nombre;
}

const lineasDelCarrito = (datos: unknown[]): number =>
  (
    datos[0] as {
      data?: { database?: { commerceOrder?: { userItems?: unknown[] } | null } };
    }
  )?.data?.database?.commerceOrder?.userItems?.length ?? 0;

const cantidadAgregada = (datos: unknown[]): number =>
  Number(
    (datos[0] as { data?: { ecommerceAddToCart?: { itemCount?: number } } })?.data
      ?.ecommerceAddToCart?.itemCount ?? Number.NaN
  );

const skuDe = (item: Element) =>
  item.getAttribute('data-commerce-sku-id') ||
  item.querySelector('[data-commerce-sku-id]')?.getAttribute('data-commerce-sku-id') ||
  '';

const itemsDelCarrito = () =>
  [
    ...document.querySelectorAll('.w-commerce-commercecartlist .w-commerce-commercecartitem'),
  ].filter((item) => skuDe(item) !== '');

async function vaciarCarrito(lineas: number) {
  await hasta(() => itemsDelCarrito().length === lineas, 15000);
  for (let vuelta = 0; itemsDelCarrito().length > 0 && vuelta < 50; vuelta++) {
    const antes = itemsDelCarrito().length;
    const quitar = itemsDelCarrito()[0].querySelector<HTMLElement>(
      '[data-wf-cart-action="remove-item"]'
    );
    if (!quitar) throw new Error('El carrito no tiene botón para quitar');
    quitar.click();
    await hasta(() => itemsDelCarrito().length < antes, 15000);
  }
  if (itemsDelCarrito().length > 0) throw new Error('No se pudo vaciar el carrito');
}

async function pulsar(ventana: Window, boton: HTMLElement): Promise<number> {
  const listo = escuchar(ventana, 'AddToCart');
  boton.click();
  return cantidadAgregada(await listo);
}

async function agregar(linea: Linea) {
  const marco = document.createElement('iframe');
  marco.hidden = true;
  marco.src = `/product/${linea.producto}`;
  document.body.append(marco);
  try {
    await new Promise((r) => marco.addEventListener('load', r, { once: true }));
    const doc = marco.contentDocument!;
    const ventana = marco.contentWindow!;
    const boton = await hasta(() =>
      doc.querySelector<HTMLInputElement>('.w-commerce-commerceaddtocartbutton')
    );
    await hasta(() => (ventana as unknown as { Webflow?: unknown }).Webflow);
    await espera(400);
    const campo = doc.querySelector<HTMLInputElement>('.w-commerce-commerceaddtocartquantityinput');
    if (campo) {
      campo.value = String(linea.cantidad);
      campo.dispatchEvent(new Event('input', { bubbles: true }));
      campo.dispatchEvent(new Event('change', { bubbles: true }));
    }
    let total = await pulsar(ventana, boton);
    while (!campo && total < linea.cantidad) {
      await espera(300);
      total = await pulsar(ventana, boton);
    }
    if (total !== linea.cantidad)
      throw new Error(`${linea.producto}: ${total} en el carrito, se pidieron ${linea.cantidad}`);
  } finally {
    marco.remove();
  }
}

function principal() {
  const parametros = new URLSearchParams(location.search);
  const intento = Number(parametros.get('intento') ?? '1');
  const lineas = normalizarPedido(leerItems(parametros.get('items') ?? ''), CATALOGO);
  if (lineas.length === 0) {
    estado(TEXTOS.vacio, [{ texto: TEXTOS.volver, href: VOLVER }]);
    return;
  }
  estado(TEXTOS.preparando);
  (async () => {
    const carrito = escuchar(window, consultaCarrito(), 20000);
    await vaciarCarrito(lineasDelCarrito(await carrito));
    for (const linea of lineas) await agregar(linea);
    location.replace('/checkout');
  })().catch(() => {
    parametros.delete('intento');
    if (intento < INTENTOS) {
      parametros.set('intento', String(intento + 1));
      location.replace(`${location.pathname}?${parametros}`);
      return;
    }
    estado(TEXTOS.error, [
      { texto: TEXTOS.reintentar, href: `${location.pathname}?${parametros}` },
      { texto: TEXTOS.volver, href: VOLVER },
    ]);
  });
}

principal();
