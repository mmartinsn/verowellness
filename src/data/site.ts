import type { Comercio } from '../lib/comercio/pedido';
import { PAGO } from '../lib/despliegue';
/**
 * Site-wide strings and navigation. Copy is Verónica's / Mari's; nothing here is invented.
 * Paths are base-relative and go through `href()` when rendered.
 */
export const marca = {
  /** Wordmark without accent, on purpose (brand book: neutral, international reading). */
  nombre: 'Veronica Wellness',
  metodo: 'The Layer Method',
  lema: 'Health has layers.',
  firma: 'Salud por capas.',
  /** Verónica's Instagram (Mari, 2026-09-23 — not @veronicawellness). */
  instagram: '@verodudamell',
  dominio: 'veronicawellness.com',
  creadora: 'Verónica Dudamell',
  /** Her professional title, as Verónica uses it (confirmed by Mari, 2026-09-23). */
  titulo: 'Nutricionista',
};

export interface NavItem {
  label: string;
  path: string;
}

/**
 * Main navigation: the home design of 2026-09-22 (Inicio · The Method · Sobre mí · 1:1 · FAQ) plus
 * Exámenes, Tienda and Suplementos (2026-09-23). «Sobre mí» left the menu on 2026-09-24 (Mari): it
 * is a section of the home, reached from there. It came back as its own page on 2026-10-03 (Mari). The FAQ is also a home section and stays.
 */
export const nav: NavItem[] = [
  { label: 'Inicio', path: '/' },
  { label: 'Sobre mí', path: '/sobre-mi' },
  { label: 'Mi método', path: '/el-metodo' },
  { label: 'Asesorías', path: '/asesorias' },
  { label: 'Exámenes', path: '/examenes' },
  { label: 'Tienda', path: '/tienda' },
  { label: 'Suplementos', path: '/suplementos' },
  { label: 'FAQ', path: '/#faq' },
];

export const cta = {
  label: 'Trabaja conmigo · Clic aquí',
  /** Short form for the header, where the full label does not fit. */
  corto: 'Trabaja conmigo',
  path: '/asesorias',
};

export const legal = {
  terminos: '/legal/terminos',
  privacidad: '/legal/privacidad',
  avisoMedico: '/legal/aviso-medico',
};

/**
 * While the site is the GitHub Pages prototype, every page carries `noindex`. The robots.txt under
 * /verowellness/ does not protect anything (crawlers only read /robots.txt at the host root), so
 * this flag is what keeps the preview out of search. Set to `false` when moving to
 * veronicawellness.com (see README, «Despliegue»).
 */
export const prototipo = true;

/** Social-sharing image (1200 × 630), built by scripts/og-image.mjs. */
export const imagenSocial = {
  archivo: 'og/veronica-wellness.jpg',
  alt: 'Verónica Dudamell, creadora de The Layer Method, sonriendo con bata blanca',
  ancho: 1200,
  alto: 630,
};

export const copyright = `© ${new Date().getFullYear()} Veronica Wellness. Todos los derechos reservados.`;

export const comercio: Comercio = {
  modo: 'prototipo',
  pago: PAGO,
};
