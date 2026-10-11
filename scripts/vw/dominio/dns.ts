import { fqdn, type Registro, type Tipo } from './registros.ts';

export type Estado = 'ok' | 'falta' | 'distinto';

export interface Comparacion {
  estado: Estado;
  faltan: string[];
  sobran: string[];
}

export interface Servidor {
  nombre: string;
  url: string;
}

interface RespuestaDoh {
  Status: number;
  Answer?: { type: number; data: string }[];
}

export const SERVIDORES: Servidor[] = [
  { nombre: 'Cloudflare', url: 'https://cloudflare-dns.com/dns-query' },
  { nombre: 'Google', url: 'https://dns.google/resolve' },
];

const CODIGO: Record<Tipo, number> = { A: 1, CNAME: 5, MX: 15, TXT: 16, AAAA: 28 };
const NXDOMAIN = 3;

export const normalizar = (valor: string) => valor.trim().toLowerCase().replace(/\.$/, '');

const textoTxt = (data: string) =>
  [...data.matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((m) => m[1].replace(/\\(.)/g, '$1')).join('') ||
  data;

export function valoresDoh(tipo: Tipo, respuesta: RespuestaDoh): string[] {
  if (respuesta.Status === NXDOMAIN) return [];
  if (respuesta.Status !== 0) throw new Error(`DNS respondió ${respuesta.Status}`);
  return (respuesta.Answer ?? [])
    .filter((a) => a.type === CODIGO[tipo])
    .map((a) => (tipo === 'TXT' ? textoTxt(a.data) : a.data));
}

export function comparar(esperado: string[], actual: string[]): Comparacion {
  const e = new Set(esperado.map(normalizar));
  const a = new Set(actual.map(normalizar));
  const faltan = [...e].filter((v) => !a.has(v));
  const sobran = [...a].filter((v) => !e.has(v));
  const estado: Estado =
    faltan.length === 0 && sobran.length === 0 ? 'ok' : a.size === 0 ? 'falta' : 'distinto';
  return { estado, faltan, sobran };
}

export async function consultar(servidor: Servidor, registro: Registro): Promise<string[]> {
  const url = `${servidor.url}?name=${fqdn(registro.nombre)}&type=${registro.tipo}`;
  const r = await fetch(url, {
    headers: { accept: 'application/dns-json' },
    signal: AbortSignal.timeout(10_000),
  });
  if (!r.ok) throw new Error(`${servidor.nombre} respondió ${r.status}`);
  return valoresDoh(registro.tipo, (await r.json()) as RespuestaDoh);
}
