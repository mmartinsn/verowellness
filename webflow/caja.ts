import {
  cookieTraspaso,
  dominioCompartido,
  leerTraspaso,
  type Traspaso,
} from '../src/lib/comercio/traspaso.ts';

declare const SITIO: string;
declare const TEXTOS: { email: string; cambiar: string };

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

const campo = (id: string) =>
  document.getElementById(id) as HTMLInputElement | HTMLSelectElement | null;

// A `change` is what makes Webflow save the field in the order (its own handlers listen for it).
function poner(id: string, valor: string | undefined) {
  const el = campo(id);
  if (!el || !valor || el.value === valor) return;
  if (el instanceof HTMLSelectElement && ![...el.options].some((o) => o.value === valor)) return;
  el.value = valor;
  el.dispatchEvent(new Event('input', { bubbles: true }));
  el.dispatchEvent(new Event('change', { bubbles: true }));
}

// Only fills what is still empty: whatever the person typed in this checkout wins.
function rellenar(datos: Traspaso) {
  const vacio = (id: string) => !campo(id)?.value;
  if (vacio('wf-ecom-email')) poner('wf-ecom-email', datos.email);
  if (vacio('wf-ecom-billing-name')) poner('wf-ecom-billing-name', datos.nombre);
  if (vacio('wf-ecom-shipping-name')) poner('wf-ecom-shipping-name', datos.nombre);
  poner('wf-ecom-billing-country', datos.pais);
}

// The email is already known: one line with it and «Cambiar» instead of the whole block.
function resumirCliente(email: string) {
  const bloque = document.querySelector<HTMLElement>(
    '.w-commerce-commercecheckoutcustomerinfowrapper'
  );
  if (!bloque || document.querySelector('[data-vw-cliente]')) return;
  const linea = document.createElement('p');
  linea.setAttribute('data-vw-cliente', '');
  linea.style.cssText = 'margin:0 0 16px;display:flex;gap:12px;align-items:baseline';
  const texto = document.createElement('span');
  texto.textContent = `${TEXTOS.email}: ${email}`;
  const cambiar = document.createElement('a');
  cambiar.href = '#';
  cambiar.textContent = TEXTOS.cambiar;
  cambiar.addEventListener('click', (e) => {
    e.preventDefault();
    bloque.style.removeProperty('display');
    linea.remove();
    campo('wf-ecom-email')?.focus();
  });
  linea.append(texto, cambiar);
  bloque.style.display = 'none';
  bloque.before(linea);
}

const entradaCupon = () =>
  document.querySelector<HTMLInputElement>('.w-commerce-commercecheckoutdiscountsinput');

function enviarCupon(codigo: string) {
  const entrada = entradaCupon();
  const formulario = entrada?.form;
  if (!entrada || !formulario) return;
  entrada.value = codigo;
  if (formulario.requestSubmit) formulario.requestSubmit();
  else formulario.querySelector<HTMLElement>('button')?.click();
}

// Webflow empties the field when the code is accepted and shows its own error when not; a field
// that still holds the code with no error means the submit was lost, so it is sent once more.
async function aplicarCupon(codigo: string) {
  enviarCupon(codigo);
  const resuelto = await hasta(() => {
    const error = document.querySelector<HTMLElement>('.w-commerce-commercecheckouterrorstate');
    return entradaCupon()?.value === '' || (!!error && error.style.display !== 'none');
  }, 5000);
  if (!resuelto) enviarCupon(codigo);
}

async function principal() {
  const datos = leerTraspaso(document.cookie);
  if (!datos) return;
  document.cookie = cookieTraspaso(null, dominioCompartido(location.hostname, SITIO));
  // Webflow fills the summary once the cart has loaded and its handlers are in place; anything
  // written before that is lost.
  await hasta(
    () =>
      (window as unknown as { Webflow?: unknown }).Webflow &&
      document.querySelector('.w-commerce-commercecheckoutsummarytotal')?.textContent?.trim()
  );
  await espera(400);
  rellenar(datos);
  if (datos.email && campo('wf-ecom-email')?.value === datos.email) resumirCliente(datos.email);
  if (datos.cupon) await aplicarCupon(datos.cupon);
  // Applying the code redraws the checkout; put back anything the redraw emptied.
  await espera(1500);
  rellenar(datos);
}

principal();
