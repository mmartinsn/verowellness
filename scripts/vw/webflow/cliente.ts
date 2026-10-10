const API = 'https://api.webflow.com/v2';
const INTERVALO_MS = 1050;
const REINTENTOS = 6;
const TOPE_ESPERA_S = 60;
const LOTE = 100;
const IDEMPOTENTES = new Set(['GET', 'PUT', 'PATCH', 'DELETE']);

const dormir = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

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

export interface Entorno {
  fetch: typeof fetch;
  espera: (ms: number) => Promise<void>;
  intervalo: number;
}

export function credenciales(): Credenciales {
  const token = process.env.WEBFLOW_SITE_TOKEN;
  const sitio = process.env.WEBFLOW_SITE_ID;
  if (!token || !sitio)
    throw new Error('Faltan WEBFLOW_SITE_TOKEN y WEBFLOW_SITE_ID en el entorno (.env).');
  return { token, sitio };
}

export function segundosDeEspera(cabecera: string | null, intento: number, ahora = Date.now()) {
  const porDefecto = 2 ** intento;
  if (cabecera === null || cabecera.trim() === '') return porDefecto;
  const segundos = Number(cabecera);
  if (Number.isFinite(segundos)) return Math.max(0, segundos);
  const fecha = Date.parse(cabecera);
  return Number.isNaN(fecha) ? porDefecto : Math.max(0, (fecha - ahora) / 1000);
}

export class ClienteWebflow {
  readonly sitio: string;
  private readonly token: string;
  private readonly entorno: Entorno;
  private ultimo = 0;
  solicitudes = 0;

  constructor({ token, sitio }: Credenciales, entorno: Partial<Entorno> = {}) {
    this.token = token;
    this.sitio = sitio;
    this.entorno = {
      fetch: (...args) => fetch(...args),
      espera: dormir,
      intervalo: INTERVALO_MS,
      ...entorno,
    };
  }

  private async turno() {
    const falta = this.ultimo + this.entorno.intervalo - Date.now();
    if (falta > 0) await this.entorno.espera(falta);
    this.ultimo = Date.now();
  }

  private async pausa(segundos: number) {
    await this.entorno.espera(Math.min(segundos, TOPE_ESPERA_S) * 1000);
  }

  async pedir<T>(metodo: string, ruta: string, cuerpo?: unknown): Promise<T> {
    const reintentable = IDEMPOTENTES.has(metodo);
    for (let intento = 1; ; intento++) {
      await this.turno();
      this.solicitudes++;
      let respuesta: Response;
      try {
        respuesta = await this.entorno.fetch(API + ruta, {
          method: metodo,
          headers: {
            Authorization: `Bearer ${this.token}`,
            'Content-Type': 'application/json',
            accept: 'application/json',
          },
          body: cuerpo === undefined ? undefined : JSON.stringify(cuerpo),
        });
      } catch (error) {
        if (!reintentable || intento >= REINTENTOS) throw error;
        await this.pausa(2 ** intento);
        continue;
      }
      const otraVez = respuesta.status === 429 || (reintentable && respuesta.status >= 500);
      if (otraVez && intento < REINTENTOS) {
        await this.pausa(segundosDeEspera(respuesta.headers.get('retry-after'), intento));
        continue;
      }
      const texto = await respuesta.text();
      if (!respuesta.ok)
        throw new ErrorWebflow(
          respuesta.status,
          `${metodo} ${ruta} → ${respuesta.status} ${texto.slice(0, 500)}`
        );
      return (texto ? JSON.parse(texto) : {}) as T;
    }
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
    for (let offset = 0; ; offset += LOTE) {
      const separador = ruta.includes('?') ? '&' : '?';
      const pagina = await this.get<Record<string, unknown>>(
        `${ruta}${separador}limit=${LOTE}&offset=${offset}`
      );
      const lote = (pagina[clave] as T[]) ?? [];
      if (offset > 0 && lote.length && JSON.stringify(lote[0]) === JSON.stringify(salida[0]))
        throw new Error(`${ruta}: la paginación no avanza (el offset se ignora)`);
      salida.push(...lote);
      const total = (pagina.pagination as { total?: number } | undefined)?.total;
      if (lote.length < LOTE || (total !== undefined && salida.length >= total)) return salida;
    }
  }
}
