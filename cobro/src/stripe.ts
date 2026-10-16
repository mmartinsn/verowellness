const SESIONES = 'https://api.stripe.com/v1/checkout/sessions';

export type ModoClave = 'prueba' | 'real' | null;

export const modoDeClave = (clave: string | undefined): ModoClave =>
  /^(rk|sk)_live_/.test(clave ?? '')
    ? 'real'
    : /^(rk|sk)_test_/.test(clave ?? '')
      ? 'prueba'
      : null;

export async function crearSesion(clave: string, sesion: URLSearchParams): Promise<string | null> {
  const respuesta = await fetch(SESIONES, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${clave}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: sesion.toString(),
  });
  if (!respuesta.ok) {
    console.error(`Stripe ${respuesta.status}: ${await respuesta.text()}`);
    return null;
  }
  const { url } = (await respuesta.json()) as { url?: string };
  return url ?? null;
}
