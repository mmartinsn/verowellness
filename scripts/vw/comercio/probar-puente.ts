import { existsSync } from 'node:fs';
import puppeteer, { type Browser, type Page } from 'puppeteer-core';
import { leerItems, normalizarPedido } from '../../../src/lib/comercio/reglas.ts';
import type { Tabla } from '../comun/snapshot.ts';
import { catalogoDe } from './puente.ts';

export interface Caso {
  nombre: string;
  items: string;
  redLenta?: boolean;
  perderAddToCart?: boolean;
  sinCampoCantidad?: boolean;
}

export interface Resultado {
  caso: string;
  ronda: number;
  ok: boolean;
  detalle: string;
}

export const CASOS: Caso[] = [
  { nombre: 'asesoría sola', items: 'layer-session' },
  {
    nombre: 'ciclo + 2 guías',
    items: 'initial-layer-cycle,hackear-tu-cerebro,guia-glp1-retatrutida',
  },
  {
    nombre: '3 exámenes + lectura (cargo ×3)',
    items: 'h-pylori,organic-acids,cardiometabolic-profile,layer-session',
  },
  {
    nombre: 'recetario + hormonas en oferta',
    items: 'recetario-30-desayunos,guia-hormonas-30-oferta',
  },
  { nombre: 'next layer cycle (privado)', items: 'next-layer-cycle' },
  {
    nombre: 'URL alterada',
    items: 'cargo-laboratorio:0,h-pylori:9,recetario-30-desayunos-oferta,no-existe',
  },
  { nombre: 'pedido vacío', items: 'cargo-laboratorio,no-existe' },
  {
    nombre: 'red lenta y carrito lleno',
    items: 'h-pylori,organic-acids,layer-session',
    redLenta: true,
  },
  {
    nombre: 'respuesta de AddToCart perdida',
    items: 'h-pylori,organic-acids,cardiometabolic-profile,layer-session',
    perderAddToCart: true,
  },
  {
    nombre: 'plantilla sin campo de cantidad',
    items: 'h-pylori,organic-acids,cardiometabolic-profile',
    sinCampoCantidad: true,
  },
];

const CHROME = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/usr/bin/google-chrome',
].find((p) => p && existsSync(p));

const INICIO_PUENTE = '<style>body{margin:0';
const FIN_PUENTE = '})();\n</script>';

const dinero = (centavos: number) => `$ ${(centavos / 100).toFixed(2)} USD`;

export function esperado(tabla: Tabla, items: string) {
  const precios = new Map(tabla.producto.map((p) => [p.id, p]));
  const lineas = normalizarPedido(leerItems(items), catalogoDe(tabla));
  const subtotal = lineas.reduce(
    (n, l) => n + Number(precios.get(l.producto)!.precio) * l.cantidad,
    0
  );
  return {
    lineas: lineas.map((l) => {
      const p = precios.get(l.producto)!;
      return `${p.nombre} Quantity: ${l.cantidad} ${dinero(Number(p.precio) * l.cantidad)}`;
    }),
    subtotal: lineas.length ? `Subtotal ${dinero(subtotal)}` : '',
  };
}

export function sustituirPuente(html: string, codigo: string): string {
  const inicio = html.indexOf(INICIO_PUENTE);
  const fin = html.indexOf(FIN_PUENTE, inicio);
  if (inicio < 0 || fin < 0) throw new Error('La página «Pedido» no trae el puente publicado');
  return html.slice(0, inicio) + codigo.trimEnd() + html.slice(fin + FIN_PUENTE.length);
}

async function interceptar(pagina: Page, caso: Caso, local: string | undefined) {
  if (!local && !caso.perderAddToCart) return;
  const cdp = await pagina.createCDPSession();
  let retenida = false;
  cdp.on('Fetch.requestPaused', async (e) => {
    try {
      if (e.resourceType === 'Document' && local) {
        const { body, base64Encoded } = await cdp.send('Fetch.getResponseBody', {
          requestId: e.requestId,
        });
        const html = base64Encoded ? Buffer.from(body, 'base64').toString('utf8') : body;
        await cdp.send('Fetch.fulfillRequest', {
          requestId: e.requestId,
          responseCode: e.responseStatusCode ?? 200,
          responseHeaders: [{ name: 'Content-Type', value: 'text/html; charset=utf-8' }],
          body: Buffer.from(sustituirPuente(html, local)).toString('base64'),
        });
        return;
      }
      if (
        caso.perderAddToCart &&
        !retenida &&
        (e.request.postData ?? '').includes('"operationName":"AddToCart"')
      ) {
        retenida = true;
        return;
      }
      await cdp.send('Fetch.continueRequest', { requestId: e.requestId });
    } catch {
      await cdp.send('Fetch.continueRequest', { requestId: e.requestId }).catch(() => {});
    }
  });
  await cdp.send('Fetch.enable', {
    patterns: [
      ...(local
        ? [
            {
              urlPattern: '*/pedido?*',
              resourceType: 'Document' as const,
              requestStage: 'Response' as const,
            },
          ]
        : []),
      ...(caso.perderAddToCart
        ? [{ urlPattern: '*/.wf_graphql/*', requestStage: 'Response' as const }]
        : []),
    ],
  });
}

async function preparar(pagina: Page, caso: Caso, local: string | undefined) {
  if (caso.redLenta)
    await pagina.emulateNetworkConditions({ download: 400_000, upload: 200_000, latency: 400 });
  if (caso.sinCampoCantidad)
    await pagina.evaluateOnNewDocument(() => {
      if (!location.pathname.startsWith('/product/')) return;
      document.addEventListener('DOMContentLoaded', () =>
        document.querySelector('.w-commerce-commerceaddtocartquantityinput')?.remove()
      );
    });
  await interceptar(pagina, caso, local);
}

async function correr(navegador: Browser, base: string, caso: Caso, local: string | undefined) {
  const pagina = await navegador.newPage();
  try {
    await preparar(pagina, caso, local);
    await pagina.goto(`${base}/pedido?items=${encodeURIComponent(caso.items)}`, {
      waitUntil: 'domcontentloaded',
    });
    await pagina.waitForFunction(
      () =>
        location.pathname === '/checkout' ||
        /No encontramos|No pudimos/.test(
          document.querySelector('[data-vw-estado]')?.textContent ?? ''
        ),
      { timeout: 150000 }
    );
    if (new URL(pagina.url()).pathname !== '/checkout')
      return {
        lineas: [],
        subtotal: '',
        estado: await pagina.$eval('[data-vw-estado]', (e) => e.textContent ?? ''),
      };
    await pagina.waitForFunction(
      () => {
        const items = [...document.querySelectorAll('.w-commerce-commercecheckoutorderitem')];
        const subtotal =
          document.querySelector('.w-commerce-commercecheckoutsummarylineitem')?.textContent ?? '';
        return (
          items.length > 0 &&
          items.every((e) => !/^\s*Quantity/.test((e as HTMLElement).innerText)) &&
          /\$\s*[1-9]/.test(subtotal)
        );
      },
      { timeout: 60000 }
    );
    return pagina.evaluate(() => ({
      lineas: [...document.querySelectorAll('.w-commerce-commercecheckoutorderitem')].map((e) =>
        (e as HTMLElement).innerText.replace(/\s+/g, ' ').trim()
      ),
      subtotal: (
        document.querySelector('.w-commerce-commercecheckoutsummarylineitem') as HTMLElement
      )?.innerText
        .replace(/\s+/g, ' ')
        .trim(),
      estado: '',
    }));
  } finally {
    await pagina.close();
  }
}

export async function probarPuente(
  tabla: Tabla,
  base: string,
  rondas: number,
  local?: string,
  casos: Caso[] = CASOS
): Promise<Resultado[]> {
  if (!CHROME) throw new Error('No encontré Chrome; define CHROME_PATH');
  const navegador = await puppeteer.launch({ executablePath: CHROME, headless: true });
  const resultados: Resultado[] = [];
  try {
    for (let ronda = 1; ronda <= rondas; ronda++)
      for (const caso of casos) {
        const e = esperado(tabla, caso.items);
        try {
          const real = await correr(navegador, base, caso, local);
          const ok =
            e.lineas.length === 0
              ? real.lineas.length === 0 && /No encontramos/.test(real.estado)
              : JSON.stringify([...real.lineas].sort()) === JSON.stringify([...e.lineas].sort()) &&
                real.subtotal === e.subtotal;
          resultados.push({
            caso: caso.nombre,
            ronda,
            ok,
            detalle: ok
              ? real.subtotal || 'mensaje de pedido vacío'
              : `esperado ${JSON.stringify(e)} · real ${JSON.stringify(real)}`,
          });
        } catch (error) {
          resultados.push({ caso: caso.nombre, ronda, ok: false, detalle: String(error) });
        }
      }
  } finally {
    await navegador.close();
  }
  return resultados;
}
