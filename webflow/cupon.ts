import { cookieCupon, dominioCompartido, leerCupon } from '../src/lib/comercio/cupon.ts';

declare const SITIO: string;

const espera = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function hasta<T>(leer: () => T | null | undefined, ms = 15000): Promise<T | null> {
  const fin = Date.now() + ms;
  for (;;) {
    const valor = leer();
    if (valor) return valor;
    if (Date.now() > fin) return null;
    await espera(150);
  }
}

// Read once and forget: a code that fails stays on screen with Webflow's own error, and is
// not retried on the next visit.
async function principal() {
  const codigo = leerCupon(document.cookie);
  if (!codigo) return;
  document.cookie = cookieCupon('', dominioCompartido(location.hostname, SITIO), true);
  const campo = await hasta(() =>
    document.querySelector<HTMLInputElement>('.w-commerce-commercecheckoutdiscountsinput')
  );
  const boton = document.querySelector<HTMLElement>('.w-commerce-commercecheckoutdiscountsbutton');
  if (!campo || !boton) return;
  // Webflow fills the summary once the cart has loaded; applying before that is lost.
  await hasta(() =>
    document.querySelector('.w-commerce-commercecheckoutsummarytotal')?.textContent?.trim()
  );
  await espera(400);
  campo.value = codigo;
  campo.dispatchEvent(new Event('input', { bubbles: true }));
  campo.dispatchEvent(new Event('change', { bubbles: true }));
  boton.click();
}

principal();
