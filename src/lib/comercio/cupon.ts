/**
 * Discount code: typed in the site's order summary, applied by Webflow's own checkout (Mari,
 * 2026-10-13). The site cannot check a code — discounts live in Webflow and its API does not
 * expose them — so it only carries it: a cookie shared by veronicawellness.com and
 * pago.veronicawellness.com, read once by webflow/cupon.ts on the checkout page.
 */

export const COOKIE_CUPON = 'vw_cupon';

/** Half an hour: enough to fill the checkout, short enough not to surprise a later visit. */
const VIDA_SEGUNDOS = 1800;

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

export function cookieCupon(codigo: string, dominio: string | null, borrar = false): string {
  return [
    `${COOKIE_CUPON}=${borrar ? '' : encodeURIComponent(codigo)}`,
    'path=/',
    `max-age=${borrar ? 0 : VIDA_SEGUNDOS}`,
    'SameSite=Lax',
    ...(dominio ? [`domain=${dominio}`] : []),
  ].join('; ');
}

export function leerCupon(cookies: string): string {
  const valor = cookies
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${COOKIE_CUPON}=`))
    ?.slice(COOKIE_CUPON.length + 1);
  if (!valor) return '';
  try {
    return limpiarCupon(decodeURIComponent(valor));
  } catch {
    return '';
  }
}
