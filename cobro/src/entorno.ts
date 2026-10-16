import { env } from 'cloudflare:workers';

export const claveStripe = (): string | undefined =>
  (env as Record<string, string | undefined>).STRIPE_KLARNA_KEY;
