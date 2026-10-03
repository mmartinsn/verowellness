/**
 * Opens the newest self-contained deliverable in `entregas/` FROM DISK (file://) and checks it
 * behaves like the site: the frame renders, hash routes swap pages, links inside the frame route
 * through the shell, anchors scroll, the checkout validates, and the console stays clean.
 * Screenshots land in capturas/entrega-*.png.
 *
 * Usage: npm run verificar:entrega        (or the whole chain: npm run entrega)
 */
import { readdirSync } from 'node:fs';
import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].find((p) => existsSync(p));
if (!CHROME) {
  console.error('No Chrome found; set the path in scripts/verificar-entrega.mjs');
  process.exit(2);
}

const ENTREGAS = path.resolve('entregas');
const archivo = readdirSync(ENTREGAS)
  .filter((f) => f.endsWith('.html'))
  .sort()
  .at(-1);
if (!archivo) {
  console.error('No hay entregas/*.html — corre `npm run empaquetar` primero');
  process.exit(2);
}
const url = 'file:///' + path.join(ENTREGAS, archivo).replace(/\\/g, '/');
const OUT = path.resolve('capturas');
await mkdir(OUT, { recursive: true });

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage();
const logs = [];
page.on('console', (m) => logs.push(`[${m.type()}] ${m.text()}`));
page.on('pageerror', (e) => logs.push(`[pageerror] ${e.message}`));
await page.setViewport({ width: 1440, height: 900 });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const marcoListo = () =>
  page.waitForFunction(() => {
    const f = document.getElementById('marco');
    return f && f.classList.contains('lista') && f.contentDocument && f.contentDocument.body;
  });
const marco = () => page.frames().find((f) => f !== page.mainFrame());
const foto = async (nombre) => {
  await sleep(1200);
  await page.screenshot({ path: path.join(OUT, `entrega-${nombre}.png`) });
};
let fallos = 0;
const esperar = (ok, msg) => {
  console.log(`${ok ? 'ok ' : '!! '} ${msg}`);
  if (!ok) fallos++;
};

console.log(`archivo: ${archivo}`);
await page.goto(url, { waitUntil: 'load' });
await marcoListo();
esperar(
  /LAYER METHOD/.test(await page.title()),
  `abre en el inicio (título: ${await page.title()})`
);
await foto('01-inicio');

// A header link inside the frame must route the shell to #el-metodo.
await marco().click('.header-nav a[data-ir="el-metodo"]');
await page.waitForFunction(() => location.hash === '#el-metodo');
await marcoListo();
esperar(true, 'clic en «The Method» dentro del marco → #el-metodo');
await foto('02-el-metodo');

// Nested route + anchor.
await page.goto(url + '#1-1~cta', { waitUntil: 'load' });
await marcoListo();
await sleep(900);
const scrollY = await page.evaluate(() => document.getElementById('marco').contentWindow.scrollY);
esperar(scrollY > 1000, `#1-1~cta desplaza al ancla (scrollY ${Math.round(scrollY)})`);
await foto('03-1-1-cta');

// The checkout keeps its behaviour inside the bundle.
await page.goto(url + '#checkout/initial-layer-cycle', { waitUntil: 'load' });
await marcoListo();
await marco().click('#form-datos button[type=submit]');
const errores = await marco().$$eval('.field-error.show', (els) => els.length);
esperar(errores === 6, `checkout valida el formulario vacío (${errores} errores)`);
await foto('04-checkout');

// Phone width.
await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
await page.goto(url + '#inicio', { waitUntil: 'load' });
await marcoListo();
await foto('05-inicio-phone');

const problemas = logs.filter((l) => /error|pageerror/i.test(l));
esperar(
  problemas.length === 0,
  problemas.length ? `consola:\n${problemas.join('\n')}` : 'consola sin errores'
);
await browser.close();
console.log(fallos ? `\n${fallos} comprobación(es) fallaron` : '\nEntrega verificada');
process.exit(fallos ? 1 : 0);
