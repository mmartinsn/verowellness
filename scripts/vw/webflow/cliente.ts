const API = 'https://api.webflow.com/v2';
const INTERVALO_MS = 1050;
const REINTENTOS = 6;

const espera = (ms: number) => new Promise((r) => setTimeout(r, ms));

export class ErrorWebflow extends Error {
  readonly estado: number;
  constructor(estado: number, mensaje: string) {
    super(mensaje);
    this.estado = estado;
  }
}

export interface Credenciales {
  token: string;
  sitio: string;
}

export function credenciales(): Credenciales {
  const token = process.env.WEBFLOW_SITE_TOKEN;
  const sitio = process.env.WEBFLOW_SITE_ID;
  if (!token || !sitio)
    throw new Error('Faltan WEBFLOW_SITE_TOKEN y WEBFLOW_SITE_ID en el entorno (.env).');
  return { token, sitio };
}

export class ClienteWebflow {
  readonly sitio: string;
  private readonly token: string;
  private ultimo = 0;
  solicitudes = 0;

  constructor({ token, sitio }: Credenciales) {
    this.token = token;
    this.sitio = sitio;
  }

  private async turno() {
    const falta = this.ultimo + INTERVALO_MS - Date.now();
    if (falta > 0) await espera(falta);
    this.ultimo = Date.now();
  }

  async pedir<T>(metodo: string, ruta: string, cuerpo?: unknown): Promise<T> {
    for (let intento = 1; intento <= REINTENTOS; intento++) {
      await this.turno();
      this.solicitudes++;
      const respuesta = await fetch(API + ruta, {
        method: metodo,
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
          accept: 'application/json',
        },
        body: cuerpo === undefined ? undefined : JSON.stringify(cuerpo),
      });
      if (respuesta.status === 429 || respuesta.status >= 500) {
        const segundos = Number(respuesta.headers.get('retry-after') ?? 2 ** intento);
        if (intento < REINTENTOS) {
          await espera(Math.min(segundos, 60) * 1000);
          continue;
        }
      }
      const texto = await respuesta.text();
      if (!respuesta.ok)
        throw new ErrorWebflow(
          respuesta.status,
          `${metodo} ${ruta} → ${respuesta.status} ${texto.slice(0, 500)}`
        );
      return (texto ? JSON.parse(texto) : {}) as T;
    }
    throw new ErrorWebflow(429, `${metodo} ${ruta} → sin respuesta tras ${REINTENTOS} intentos`);
  }

  get<T>(ruta: string) {
    return this.pedir<T>('GET', ruta);
  }

  post<T>(ruta: string, cuerpo: unknown) {
    return this.pedir<T>('POST', ruta, cuerpo);
  }

  patch<T>(ruta: string, cuerpo: unknown) {
    return this.pedir<T>('PATCH', ruta, cuerpo);
  }

  delete<T>(ruta: string, cuerpo?: unknown) {
    return this.pedir<T>('DELETE', ruta, cuerpo);
  }

  async todas<T>(ruta: string, clave: string): Promise<T[]> {
    const salida: T[] = [];
    for (let offset = 0; ; offset += 100) {
      const separador = ruta.includes('?') ? '&' : '?';
      const pagina = await this.get<Record<string, unknown>>(
        `${ruta}${separador}limit=100&offset=${offset}`
      );
      const lote = (pagina[clave] as T[]) ?? [];
      salida.push(...lote);
      const total = (pagina.pagination as { total?: number } | undefined)?.total ?? lote.length;
      if (lote.length < 100 || salida.length >= total) return salida;
    }
  }
}
