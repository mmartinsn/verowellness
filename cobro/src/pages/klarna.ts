import type { APIRoute } from 'astro';
import {
  CATALOGO,
  PRODUCTOS,
  VOLVER,
  cookieTraspaso,
  dominioCompartido,
  leerItems,
  leerTraspaso,
  normalizarPedido,
  sesionKlarna,
  urlDeVuelta,
} from '../generado.ts';
import { claveStripe } from '../entorno.ts';
import { estado } from '../estado.ts';
import { crearSesion } from '../stripe.ts';

export const prerender = false;

export const GET: APIRoute = async ({ url, request }) => {
  const lineas = normalizarPedido(leerItems(url.searchParams.get('items') ?? ''), CATALOGO);
  const sesion = sesionKlarna(lineas, PRODUCTOS, {
    volver: VOLVER,
    cancelar: urlDeVuelta(url.searchParams.get('desde'), VOLVER),
    email: leerTraspaso(request.headers.get('cookie') ?? '')?.email,
  });
  if (!sesion) return estado('vacio', null, 400);
  const clave = claveStripe();
  if (!clave) console.error('Falta el secret STRIPE_KLARNA_KEY en el entorno de Webflow Cloud');
  const destino = clave ? await crearSesion(clave, sesion) : null;
  if (!destino) return estado('error', url.toString(), 502);
  return new Response(null, {
    status: 303,
    headers: {
      Location: destino,
      'Set-Cookie': cookieTraspaso(null, dominioCompartido(url.hostname, new URL(VOLVER).hostname)),
      'Cache-Control': 'no-store',
    },
  });
};
