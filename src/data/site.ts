/**
 * Site-wide strings and navigation. Copy is Verónica's / Mari's; nothing here is invented.
 * Paths are base-relative and go through `href()` when rendered.
 */
export const marca = {
  /** Wordmark without accent, on purpose (brand book: neutral, international reading). */
  nombre: 'Veronica Wellness',
  metodo: 'The Layer Method™',
  lema: 'Health has layers.™',
  firma: 'Salud por capas. Del terreno a la célula.',
  instagram: '@veronicawellness',
  dominio: 'veronicawellness.com',
  creadora: 'Verónica Dudamell',
};

export interface NavItem {
  label: string;
  path: string;
}

/** Main navigation as designed: Inicio · The Method · 1:1 · FAQ. The FAQ lives on the home page. */
export const nav: NavItem[] = [
  { label: 'Inicio', path: '/' },
  { label: 'The Method', path: '/el-metodo' },
  { label: '1:1', path: '/1-1' },
  { label: 'FAQ', path: '/#faq' },
];

export const cta = {
  label: 'Trabaja conmigo',
  path: '/1-1',
};

export const legal = {
  terminos: '/legal/terminos',
  privacidad: '/legal/privacidad',
  avisoMedico: '/legal/aviso-medico',
};

export const copyright = `© ${new Date().getFullYear()} Veronica Wellness. Todos los derechos reservados.`;
