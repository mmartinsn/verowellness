import type { APIRoute } from 'astro';
import { VERSION } from '../generado.ts';
import { modoDeClave } from '../stripe.ts';

export const prerender = false;

export const GET: APIRoute = ({ locals }) =>
  Response.json(
    { version: VERSION, stripe: modoDeClave(locals.runtime?.env?.STRIPE_KLARNA_KEY) },
    { headers: { 'Cache-Control': 'no-store' } }
  );
