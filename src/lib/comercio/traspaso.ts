/**
 * What the site's checkout hands to Webflow's (Mari, 2026-10-13): the discount code typed in the
 * order summary, and the email, name and country already asked in step 1, so the Webflow
 * checkout does not ask them again. The site cannot check a code — discounts live in Webflow and
 * its API does not expose them — so it only carries it. The carrier is a cookie shared by
 * veronicawellness.com and pago.veronicawellness.com, read once and deleted by webflow/caja.ts.
 */

export const COOKIE_TRASPASO = 'vw_caja';

/** Half an hour: enough to fill the checkout, short enough not to surprise a later visit. */
const VIDA_SEGUNDOS = 1800;

export interface Traspaso {
  cupon?: string;
  email?: string;
  nombre?: string;
  /** ISO 3166 code, the value of Webflow's country selects. */
  pais?: string;
}

/** The site's country names (Checkout.astro) to Webflow's codes; «Otro» has none. */
export const CODIGO_PAIS: Record<string, string> = {
  'Estados Unidos': 'US',
  México: 'MX',
  España: 'ES',
  Colombia: 'CO',
  Argentina: 'AR',
  Chile: 'CL',
  Perú: 'PE',
  Ecuador: 'EC',
  Venezuela: 'VE',
  'República Dominicana': 'DO',
};

export function limpiarCupon(texto: string): string {
  return texto.replace(/\s+/g, '').slice(0, 64);
}

/** The parent domain both hosts share (veronicawellness.com), or null if they share none. */
export function dominioCompartido(a: string, b: string): string | null {
  const x = a.toLowerCase().split('.').reverse();
  const y = b.toLowerCase().split('.').reverse();
  const comun: string[] = [];
  for (let i = 0; i < Math.min(x.length, y.length) && x[i] === y[i]; i++) comun.push(x[i]);
  return comun.length >= 2 ? comun.reverse().join('.') : null;
}

function depurar(datos: Traspaso): Traspaso {
  const salida: Traspaso = {};
  const cupon = limpiarCupon(datos.cupon ?? '');
  if (cupon) salida.cupon = cupon;
  const email = (datos.email ?? '').trim().slice(0, 254);
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) salida.email = email;
  const nombre = (datos.nombre ?? '').replace(/\s+/g, ' ').trim().slice(0, 120);
  if (nombre) salida.nombre = nombre;
  if (/^[A-Z]{2}$/.test(datos.pais ?? '')) salida.pais = datos.pais;
  return salida;
}

/** The cookie to write; with nothing worth carrying, the one that deletes it. */
export function cookieTraspaso(datos: Traspaso | null, dominio: string | null): string {
  const limpio = datos ? depurar(datos) : {};
  const vacio = Object.keys(limpio).length === 0;
  return [
    `${COOKIE_TRASPASO}=${vacio ? '' : encodeURIComponent(JSON.stringify(limpio))}`,
    'path=/',
    `max-age=${vacio ? 0 : VIDA_SEGUNDOS}`,
    'SameSite=Lax',
    ...(dominio ? [`domain=${dominio}`] : []),
  ].join('; ');
}

export function leerTraspaso(cookies: string): Traspaso | null {
  const valor = cookies
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${COOKIE_TRASPASO}=`))
    ?.slice(COOKIE_TRASPASO.length + 1);
  if (!valor) return null;
  try {
    const datos = depurar(JSON.parse(decodeURIComponent(valor)) as Traspaso);
    return Object.keys(datos).length ? datos : null;
  } catch {
    return null;
  }
}
