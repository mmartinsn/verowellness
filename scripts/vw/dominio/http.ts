import { existsSync, readFileSync } from 'node:fs';
import { PAGO } from '../../../src/lib/despliegue.ts';
import { DOMINIO, USUARIO_PAGES } from './registros.ts';

export interface Resultado {
  nombre: string;
  ok: boolean;
  detalle: string;
}

interface Respuesta {
  estado: number;
  destino: string;
  cuerpo: string;
}

const RAIZ = `https://${DOMINIO}/`;
const META_ROBOTS = /<meta name="robots" content="([^"]*)">/;

async function pedir(url: string): Promise<Respuesta> {
  const r = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(15_000) });
  return { estado: r.status, destino: r.headers.get('location') ?? '', cuerpo: await r.text() };
}

const motivo = (error: unknown) => {
  const e = error as { cause?: { code?: string; message?: string }; message?: string };
  return e.cause?.code ?? e.cause?.message ?? e.message ?? String(error);
};

async function comprobar(
  nombre: string,
  url: string,
  evaluar: (r: Respuesta) => [boolean, string]
): Promise<Resultado> {
  try {
    const [ok, detalle] = evaluar(await pedir(url));
    return { nombre, ok, detalle };
  } catch (error) {
    return { nombre, ok: false, detalle: `${url}: ${motivo(error)}` };
  }
}

const redirigeA =
  (...prefijos: string[]) =>
  (r: Respuesta): [boolean, string] => [
    r.estado >= 300 && r.estado < 400 && prefijos.some((p) => r.destino.startsWith(p)),
    `${r.estado} → ${r.destino || '(sin destino)'}`,
  ];

const robotsLocal = () => {
  const html = existsSync('dist/index.html') ? readFileSync('dist/index.html', 'utf8') : '';
  return html.match(META_ROBOTS)?.[1];
};

export const comprobacionesHttp = (): Promise<Resultado>[] => [
  comprobar('inicio en el dominio', RAIZ, (r) => {
    const robots = r.cuerpo.match(META_ROBOTS)?.[1];
    const esperado = robotsLocal();
    const iguales = esperado === undefined || robots === esperado;
    return [
      r.estado === 200 && iguales,
      `${r.estado} · robots «${robots ?? 'sin meta'}»${iguales ? '' : ` (dist/ dice «${esperado}»)`}`,
    ];
  }),
  comprobar('robots.txt = public/robots.txt', `${RAIZ}robots.txt`, (r) => [
    r.estado === 200 && r.cuerpo === readFileSync('public/robots.txt', 'utf8'),
    `${r.estado} · ${r.cuerpo.split('\n').find((l) => l.startsWith('Disallow')) ?? 'sin Disallow'}`,
  ]),
  comprobar('/1-1/ lleva a /asesorias/', `${RAIZ}1-1/`, (r) => [
    r.estado === 200 && r.cuerpo.includes('url=/asesorias/'),
    `${r.estado} · ${r.cuerpo.includes('url=/asesorias/') ? 'refresco a /asesorias/' : 'sin refresco'}`,
  ]),
  comprobar('www lleva al dominio', `https://www.${DOMINIO}/`, redirigeA(RAIZ)),
  comprobar(
    'github.io lleva al dominio',
    `https://${USUARIO_PAGES}.github.io/verowellness/`,
    redirigeA(RAIZ, `http://${DOMINIO}/`)
  ),
  comprobar('http lleva a https', `http://${DOMINIO}/`, redirigeA(RAIZ)),
  comprobar('caja en el dominio de pago', `${PAGO}/`, (r) => [r.estado === 200, `${r.estado}`]),
];
