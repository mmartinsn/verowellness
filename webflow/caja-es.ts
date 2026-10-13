// The Webflow checkout in Spanish and with the site's frame (Mari, 2026-10-13). Webflow writes
// its checkout in English and the template's texts are not reachable from the API, so they are
// replaced here, on the page, and again whenever Webflow redraws a part of it.

declare const ES: Record<string, string>;
declare const ES_PATRONES: [string, string][];
declare const ERRORES: Record<string, string>;
declare const MARCO: { marca: string; volver: string; volverTexto: string; pie: string };

const patrones = ES_PATRONES.map(([de, a]) => [new RegExp(de), a] as const);

function traducirTexto(texto: string): string | null {
  const limpio = texto.replace(/\s+/g, ' ').trim();
  if (ES[limpio]) return texto.replace(limpio, ES[limpio]);
  for (const [de, a] of patrones) if (de.test(limpio)) return limpio.replace(de, a);
  return null;
}

function traducirNodos(raiz: Node) {
  const recorrido = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT);
  for (let n = recorrido.nextNode(); n; n = recorrido.nextNode()) {
    const nuevo = traducirTexto(n.nodeValue ?? '');
    if (nuevo !== null && nuevo !== n.nodeValue) n.nodeValue = nuevo;
  }
}

function traducirAtributos() {
  for (const el of document.querySelectorAll<HTMLElement>('[data-loading-text]')) {
    const nuevo = traducirTexto(el.getAttribute('data-loading-text') ?? '');
    if (nuevo) el.setAttribute('data-loading-text', nuevo);
  }
  for (const el of document.querySelectorAll<HTMLElement>('.w-checkout-error-msg'))
    for (const [atributo, texto] of Object.entries(ERRORES)) el.setAttribute(atributo, texto);
  for (const el of document.querySelectorAll<HTMLElement>('[aria-label]')) {
    const nuevo = traducirTexto(el.getAttribute('aria-label') ?? '');
    if (nuevo) el.setAttribute('aria-label', nuevo);
  }
}

// Country names come from the browser, in Spanish, keyed by the option's ISO code.
function traducirPaises() {
  if (typeof Intl === 'undefined' || !('DisplayNames' in Intl)) return;
  const nombres = new Intl.DisplayNames(['es'], { type: 'region' });
  for (const select of document.querySelectorAll<HTMLSelectElement>(
    '.w-commerce-commercecheckoutshippingcountryselector, .w-commerce-commercecheckoutbillingcountryselector'
  )) {
    const opciones = [...select.options];
    for (const o of opciones) {
      try {
        const nombre = nombres.of(o.value);
        if (nombre && nombre !== o.value) o.textContent = nombre;
      } catch {
        /* a code the browser does not know keeps Webflow's name */
      }
    }
    const elegida = select.value;
    opciones.sort((a, b) => (a.textContent ?? '').localeCompare(b.textContent ?? '', 'es'));
    select.append(...opciones);
    select.value = elegida;
  }
}

function marco() {
  if (document.querySelector('[data-vw-marco]')) return;
  const cabecera = document.createElement('header');
  cabecera.setAttribute('data-vw-marco', '');
  cabecera.className = 'vw-cabecera';
  const marca = document.createElement('a');
  marca.className = 'vw-marca';
  marca.href = MARCO.volver;
  marca.innerHTML =
    '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="4" r="2" fill="currentColor"/><path d="M4 10L12 15L20 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 16L12 21L20 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const nombre = document.createElement('span');
  nombre.textContent = MARCO.marca;
  marca.append(nombre);
  const volver = document.createElement('a');
  volver.className = 'vw-volver';
  volver.href = MARCO.volver;
  volver.textContent = MARCO.volverTexto;
  cabecera.append(marca, volver);
  document.body.prepend(cabecera);
  const pie = document.createElement('footer');
  pie.className = 'vw-pie';
  pie.textContent = MARCO.pie;
  document.body.append(pie);
}

function espanol() {
  document.documentElement.lang = 'es';
  marco();
  traducirNodos(document.body);
  traducirAtributos();
  traducirPaises();
  document.documentElement.classList.add('vw-lista');
  new MutationObserver((cambios) => {
    for (const c of cambios) {
      if (c.type === 'characterData') {
        const nuevo = traducirTexto(c.target.nodeValue ?? '');
        if (nuevo !== null && nuevo !== c.target.nodeValue) c.target.nodeValue = nuevo;
      } else c.addedNodes.forEach((n) => traducirNodos(n));
    }
  }).observe(document.body, { childList: true, subtree: true, characterData: true });
}

espanol();
