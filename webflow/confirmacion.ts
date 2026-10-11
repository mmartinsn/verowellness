import {
  destinoGracias,
  type CatalogoGracias,
  type Descarga,
} from '../src/lib/comercio/confirmacion.ts';

declare const CATALOGO: CatalogoGracias;
declare const VOLVER: string;

const ITEM = '.w-commerce-commercecheckoutorderitem';
const NOMBRE = '.w-commerce-commerceboldtextblock';
const DESCARGA = '[data-node-type="commerce-downloads-button"]';
const PLAZO_MS = 10000;
const PASO_MS = 150;

const texto = (nodo: Element | null | undefined) => nodo?.textContent?.trim() ?? '';

function leerNombres(): string[] {
  return [...document.querySelectorAll(`${ITEM} ${NOMBRE}`)].map(texto).filter(Boolean);
}

function leerDescargas(): Descarga[] {
  return [...document.querySelectorAll<HTMLAnchorElement>(DESCARGA)].map((a) => ({
    nombre: texto(a.closest(ITEM)?.querySelector(NOMBRE)) || texto(a),
    url: a.href,
  }));
}

async function llevarAGracias() {
  const limite = Date.now() + PLAZO_MS;
  while (Date.now() < limite) {
    const nombres = leerNombres();
    if (nombres.length) {
      const destino = destinoGracias(nombres, leerDescargas(), CATALOGO);
      if (destino) location.replace(VOLVER + destino);
      return;
    }
    await new Promise((r) => setTimeout(r, PASO_MS));
  }
}

llevarAGracias();
