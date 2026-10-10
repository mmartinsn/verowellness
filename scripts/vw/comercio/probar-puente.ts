import { existsSync } from 'node:fs';
import puppeteer, { type Browser } from 'puppeteer-core';
import { leerItems, normalizarPedido } from '../../../src/lib/comercio/reglas.ts';
import type { Tabla } from '../comun/snapshot.ts';
import { catalogoDe } from './puente.ts';

export interface Caso {
  nombre: string;
  items: string;
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
];

const CHROME = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/usr/bin/google-chrome',
].find((p) => p && existsSync(p));

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

async function correr(navegador: Browser, base: string, caso: Caso) {
  const pagina = await navegador.newPage();
  try {
    await pagina.goto(`${base}/pedido?items=${encodeURIComponent(caso.items)}`, {
      waitUntil: 'domcontentloaded',
    });
    await pagina.waitForFunction(
      () =>
        location.pathname === '/checkout' ||
        /No encontramos|No pudimos/.test(
          document.querySelector('[data-vw-estado]')?.textContent ?? ''
        ),
      { timeout: 90000 }
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
      { timeout: 45000 }
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
  rondas: number
): Promise<Resultado[]> {
  if (!CHROME) throw new Error('No encontré Chrome; define CHROME_PATH');
  const navegador = await puppeteer.launch({ executablePath: CHROME, headless: true });
  const resultados: Resultado[] = [];
  try {
    for (let ronda = 1; ronda <= rondas; ronda++)
      for (const caso of CASOS) {
        const e = esperado(tabla, caso.items);
        try {
          const real = await correr(navegador, base, caso);
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
