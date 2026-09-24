/**
 * Full-page screenshots of every route, desktop and phone, plus a scripted walk through the
 * checkout — the evidence that a build looks and behaves as intended before it is shown to Mari
 * or pushed. Drives the Chrome already installed on this machine through puppeteer-core; no
 * browser download.
 *
 * Usage (with `npm run preview` running, or against any base URL):
 *   npm run capturas                       # http://127.0.0.1:4321/verowellness
 *   npm run capturas -- --base https://mmartinsn.github.io/verowellness
 *
 * Output: capturas/<route>-<viewport>.png and capturas/checkout-paso-N.png (folder is gitignored).
 */
import { mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const args = process.argv.slice(2);
const baseArg = args.indexOf('--base');
const BASE = (baseArg >= 0 ? args[baseArg + 1] : 'http://127.0.0.1:4321/verowellness').replace(
  /\/$/,
  ''
);
const OUT = path.resolve('capturas');

const CHROME = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].find((p) => p && existsSync(p));
if (!CHROME) {
  console.error('No Chrome found; set CHROME_PATH or add the path in scripts/capturas.mjs');
  process.exit(2);
}

const RUTAS = [
  '/',
  '/inicio-stitch/',
  '/inicio-editorial/',
  '/el-metodo/',
  '/1-1/',
  '/examenes/',
  '/tienda/',
  '/checkout/initial-layer-cycle/',
  '/checkout/next-layer-cycle/',
  '/legal/terminos/',
  '/variantes/',
];

const VIEWPORTS = {
  desktop: { width: 1440, height: 900, deviceScaleFactor: 1 },
  // deviceScaleFactor stays 1: at 2 the full-page capture of the longest pages exceeds Chrome's
  // texture limit and comes back garbled.
  phone: { width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true },
};

const slug = (ruta) => (ruta === '/' ? 'inicio' : ruta.replace(/^\/|\/$/g, '').replace(/\//g, '-'));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Scroll the whole page once, then force every reveal block to its shown state and wait for the
 * transitions (0.9 s plus up to 0.7 s of stagger). Headless Chrome delivers IntersectionObserver
 * callbacks late under programmatic scrolling, so a full-page capture taken right after the scroll
 * used to come out blank below the fold; the explicit `.in` makes the capture deterministic.
 */
async function revelarTodo(page) {
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 80));
    }
    window.scrollTo(0, 0);
    document
      .querySelectorAll('.reveal, .reveal-scale, .reveal-left, .reveal-right, .reveal-stagger')
      .forEach((el) => el.classList.add('in'));
  });
  await sleep(1900);
}

async function capturaRuta(browser, ruta, nombreVp, vp) {
  const page = await browser.newPage();
  await page.setViewport(vp);
  await page.goto(BASE + ruta, { waitUntil: 'networkidle0' });
  await revelarTodo(page);
  const file = path.join(OUT, `${slug(ruta)}-${nombreVp}.png`);
  await page.screenshot({ path: file, fullPage: true });
  const ancho = await page.evaluate(() => document.documentElement.scrollWidth);
  const overflow = ancho > vp.width ? `  !! overflow: scrollWidth ${ancho} > ${vp.width}` : '';
  console.log(`${path.basename(file)}${overflow}`);
  await page.close();
}

/** Walk the Initial Layer Cycle checkout with test data and screenshot every step. */
async function recorridoCheckout(browser) {
  const page = await browser.newPage();
  await page.setViewport(VIEWPORTS.desktop);
  const logs = [];
  page.on('console', (m) => logs.push(`[${m.type()}] ${m.text()}`));
  page.on('pageerror', (e) => logs.push(`[pageerror] ${e.message}`));
  await page.goto(`${BASE}/checkout/initial-layer-cycle/`, { waitUntil: 'networkidle0' });

  const shot = async (n) =>
    page.screenshot({ path: path.join(OUT, `checkout-paso-${n}.png`), fullPage: true });

  // Step 1 — submit empty first: every required field must show its error.
  await page.click('#form-datos button[type=submit]');
  const errores = await page.$$eval('.field-error.show', (els) => els.length);
  console.log(`checkout paso 1: ${errores} errores mostrados con el formulario vacío (esperado 6)`);
  await page.type('#nombre', 'Prueba');
  await page.type('#apellido', 'Interna');
  await page.type('#email', 'prueba@example.com');
  await page.type('#telefono', '809 555 0101');
  await page.select('#pais', 'Venezuela');
  await page.select('#fuente', 'Instagram');
  await shot(1);
  await page.click('#form-datos button[type=submit]');
  await page.waitForSelector('#step-2.active');
  await shot(2);

  // Step 2 → 3, pick Zelle (the only method with visible content in the prototype).
  await page.click('#step-2 [data-goto="3"]');
  await page.waitForSelector('#step-3.active');
  await page.click('.pay-method[data-method="zelle"]');
  await shot(3);
  const total3 = await page.$eval('#panel-zelle [data-total]', (el) => el.textContent);
  console.log(`checkout paso 3: Zelle muestra el total ${total3}`);
  await page.click('#btn-to-step4');
  await page.waitForSelector('#step-4.active');

  // Step 4 — both consents required.
  const disabledBefore = await page.$eval('#btn-to-step5', (b) => b.disabled);
  await page.click('#consent-terms');
  await page.click('#consent-policy');
  const disabledAfter = await page.$eval('#btn-to-step5', (b) => b.disabled);
  console.log(
    `checkout paso 4: Continuar deshabilitado antes=${disabledBefore} después=${disabledAfter} (esperado true/false)`
  );
  await shot(4);
  await page.click('#btn-to-step5');
  await page.waitForSelector('#step-5.active');
  await shot(5);

  // Step 5 — simulated payment, then the confirmation screen (Zelle → pending).
  await page.click('#btn-pay');
  await page.waitForSelector('#step5-success:not([hidden])', { timeout: 5000 });
  await shot('5-pagado');
  await page.click('#btn-continue-after-pay');
  await page.waitForSelector('#step-confirmation.active');
  await shot(6);
  const titulo = await page.$eval('#confirm-title', (el) => el.textContent);
  console.log(`checkout confirmación: "${titulo}"`);

  const problemas = logs.filter((l) => /error|pageerror/i.test(l));
  console.log(
    problemas.length ? `!! consola con errores:\n${problemas.join('\n')}` : 'consola sin errores'
  );
  await page.close();
}

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
try {
  await mkdir(OUT, { recursive: true });
  for (const ruta of RUTAS) {
    for (const [nombre, vp] of Object.entries(VIEWPORTS))
      await capturaRuta(browser, ruta, nombre, vp);
  }
  await recorridoCheckout(browser);
  console.log(`\nListo → ${OUT}`);
} finally {
  await browser.close();
}
