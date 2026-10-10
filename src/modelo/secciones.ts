import type { PAGINAS_SITIO } from './vocabulario.ts';

type Pagina = (typeof PAGINAS_SITIO)[number];

export interface Seccion {
  pagina: Pagina;
  seccion: string;
  unica: boolean;
  html: boolean;
  campos: readonly string[];
}

const una = (pagina: Pagina, seccion: string, ...campos: string[]): Seccion => ({
  pagina,
  seccion,
  unica: true,
  html: false,
  campos,
});

const varias = (pagina: Pagina, seccion: string, ...campos: string[]): Seccion => ({
  ...una(pagina, seccion, ...campos),
  unica: false,
});

const conHtml = (s: Seccion): Seccion => ({ ...s, html: true });

export const SECCIONES: readonly Seccion[] = [
  una('sitio', 'continuidad', 'etiqueta', 'titulo', 'texto', 'enlace', 'enlaceTexto'),
  una('inicio', 'problema', 'items'),
  una('inicio', 'otra-mirada', 'items'),
  una('inicio', 'herramientas', 'items'),
  una('metodo', 'reframe-herramientas', 'items'),
  una('sobre-mi', 'espejo', 'items'),
  varias('sobre-mi', 'capas', 'etiqueta', 'items'),
  una('sobre-mi', 'acompano', 'items'),
  varias('sobre-mi', 'pilares', 'titulo', 'texto'),
  una('asesorias', 'reconocimiento', 'items'),
  una('asesorias', 'proceso-temas', 'items'),
  conHtml(varias('asesorias', 'proceso-pasos', 'etiqueta', 'titulo', 'texto', 'tono')),
  una('asesorias', 'entregables-niveles', 'items'),
  una('asesorias', 'entregables-plan', 'items'),
  una('asesorias', 'entregables-extra', 'items'),
  una('examenes', 'porque-rutina', 'items'),
  una('examenes', 'porque-funcional', 'items'),
  varias('examenes', 'porque-pilares', 'titulo', 'texto', 'icono'),
  varias('examenes', 'pasos-pedido', 'titulo', 'texto'),
  una('suplementos', 'etiqueta-si', 'items'),
  una('suplementos', 'etiqueta-no', 'items'),
  varias('suplementos', 'principios', 'titulo', 'texto'),
  una('suplementos', 'aviso', 'texto'),
  una('tienda', 'aviso-legal', 'texto'),
];

export const ASESORIAS = {
  LAYER_SESSION: 'layer-session',
  INITIAL_LAYER_CYCLE: 'initial-layer-cycle',
  NEXT_LAYER_CYCLE: 'next-layer-cycle',
} as const;

export const REGISTROS_FIJOS: Readonly<Record<string, readonly string[]>> = {
  pregunta: ['inicio-01'],
};
