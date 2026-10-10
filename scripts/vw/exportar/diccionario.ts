import type { Campo } from '../../../src/modelo/campos.ts';
import type { Entidad } from '../../../src/modelo/entidad.ts';
import { VERSION_ESQUEMA, entidadPorClave, listaEntidades } from '../../../src/modelo/esquema.ts';
import { etiquetaCampo, slugCampo } from '../../../src/modelo/etiquetas.ts';

const ALMACEN: Record<Entidad['almacen'], string> = {
  cms: 'Webflow CMS',
  comercio: 'Webflow Ecommerce (producto + SKU)',
  operacion: 'Pedidos de Webflow (solo modelada; datos personales fuera del repo)',
};

const describirTipo = (c: Campo): string => {
  switch (c.tipo) {
    case 'opcion':
      return `opción: ${c.opciones.map((o) => `\`${o}\``).join(', ')}`;
    case 'referencia':
      return `→ ${entidadPorClave(c.entidad).singular}`;
    case 'referencias':
      return `⇉ ${entidadPorClave(c.entidad).titulo} (ordenadas)`;
    case 'imagen':
      return `imagen en src/assets/${c.carpeta}/`;
    case 'dinero':
      return 'dinero (centavos de USD)';
    case 'lista':
      return 'lista (una línea por elemento)';
    case 'parrafos':
      return 'párrafos (línea vacía entre párrafos)';
    default:
      return c.tipo;
  }
};

const obligatorio = (c: Campo): string => {
  if (c.tipo === 'booleano') return 'siempre (sí o no)';
  if (c.tipo === 'referencias' || !c.requerido) return 'no';
  return c.tipo === 'lista' || c.tipo === 'parrafos' ? 'sí, al menos uno' : 'sí';
};

const ident = (e: Entidad) => e.coleccion.replaceAll('-', '_');

function mermaid(): string {
  const lineas = ['```mermaid', 'erDiagram'];
  for (const e of listaEntidades())
    for (const c of Object.values(e.campos))
      if (c.tipo === 'referencia' || c.tipo === 'referencias') {
        const destino = entidadPorClave(c.entidad);
        const flecha = c.tipo === 'referencia' ? '}o--||' : '}o--o{';
        lineas.push(
          `  ${ident(e)} ${flecha} ${ident(destino)} : "${c.tipo === 'referencia' ? 'pertenece a' : 'incluye'}"`
        );
      }
  lineas.push('```');
  return lineas.join('\n');
}

export function diccionario(): string {
  const partes = [
    '# Modelo de datos de Veronica Wellness',
    '',
    `Generado por \`npm run vw -- exportar docs\` desde \`src/modelo/\` (versión ${VERSION_ESQUEMA}). No se edita a mano: se cambia el modelo y se vuelve a generar.`,
    '',
    'El modelo es canónico y no depende de ninguna plataforma. Hoy Webflow es su primer adaptador',
    '(CMS y Ecommerce); `docs/modelo.sql` es el mismo modelo en Postgres para un stack propio. Cómo se',
    'conectan las piezas: `docs/INTEGRACION.md`.',
    '',
    '## Relaciones',
    '',
    mermaid(),
    '',
    '## Entidades',
    '',
    '| Entidad | Dónde vive | Para qué |',
    '|---|---|---|',
    ...listaEntidades().map((e) => `| ${e.titulo} | ${ALMACEN[e.almacen]} | ${e.descripcion} |`),
    '',
  ];
  for (const e of listaEntidades()) {
    partes.push(
      `### ${e.titulo}`,
      '',
      `${e.descripcion} Colección \`${e.coleccion}\`${e.orden ? `, ordenada por \`${e.orden}\`` : ''}${e.unica ? '; un solo registro' : ''}.`,
      '',
      '| Campo | Slug en Webflow | Tipo | Obligatorio | Ayuda |',
      '|---|---|---|---|---|',
      '| Id | `slug` | texto (slug) | sí | Identificador estable; no cambia nunca. |',
      '| Nombre | `name` | texto | sí | Nombre visible. |'
    );
    for (const [clave, c] of Object.entries(e.campos))
      partes.push(
        `| ${etiquetaCampo(clave)} | \`${slugCampo(clave)}\` | ${describirTipo(c)} | ${obligatorio(c)} | ${c.ayuda} |`
      );
    partes.push('');
  }
  return partes.join('\n');
}
