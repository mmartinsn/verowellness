import type { APIRoute } from 'astro';
import { claveStripe } from '../entorno.ts';
import { VERSION } from '../generado.ts';
import { modoDeClave } from '../stripe.ts';

export const prerender = false;

export const GET: APIRoute = () =>
  Response.json(
    { version: VERSION, stripe: modoDeClave(claveStripe()) },
    { headers: { 'Cache-Control': 'no-store' } }
  );
