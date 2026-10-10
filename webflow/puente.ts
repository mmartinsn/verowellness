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

function escuchar(ventana: Window, operacion: string, ms = 15000): Promise<void> {
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
        const lista = Array.isArray(datos) ? datos : [datos];
        if (!respuesta.ok || lista.some((d) => d?.errors?.length))
          rechazar(new Error(`${operacion} falló`));
        else resolver();
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

const enCarrito = () =>
  Number(
    document.querySelector('.w-commerce-commercecartopenlinkcount')?.textContent?.trim() || '0'
  );

async function vaciarCarrito() {
  await hasta(() => document.querySelector('.w-commerce-commercecartopenlinkcount'));
  await espera(800);
  for (let vuelta = 0; enCarrito() > 0 && vuelta < 50; vuelta++) {
    const quitar = await hasta(() =>
      document.querySelector<HTMLElement>(
        '.w-commerce-commercecartlist [data-wf-cart-action="remove-item"]'
      )
    );
    const antes = enCarrito();
    quitar.click();
    await hasta(() => enCarrito() < antes, 15000);
  }
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
    const cantidad = doc.querySelector<HTMLInputElement>(
      '.w-commerce-commerceaddtocartquantityinput'
    );
    if (cantidad) {
      cantidad.value = String(linea.cantidad);
      cantidad.dispatchEvent(new Event('input', { bubbles: true }));
      cantidad.dispatchEvent(new Event('change', { bubbles: true }));
    }
    const listo = escuchar(ventana, 'AddToCart');
    boton.click();
    await listo;
  } finally {
    marco.remove();
  }
}

async function conReintento(tarea: () => Promise<void>) {
  try {
    await tarea();
  } catch {
    await espera(1000);
    await tarea();
  }
}

async function principal() {
  const lineas = normalizarPedido(
    leerItems(new URLSearchParams(location.search).get('items') ?? ''),
    CATALOGO
  );
  if (lineas.length === 0) {
    estado(TEXTOS.vacio, [{ texto: TEXTOS.volver, href: VOLVER }]);
    return;
  }
  estado(TEXTOS.preparando);
  try {
    await conReintento(vaciarCarrito);
    for (const linea of lineas) await conReintento(() => agregar(linea));
    location.replace('/checkout');
  } catch {
    estado(TEXTOS.error, [
      { texto: TEXTOS.reintentar, href: location.href },
      { texto: TEXTOS.volver, href: VOLVER },
    ]);
  }
}

principal();
