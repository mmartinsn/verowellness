import { leerSitio } from '../webflow/conexion.ts';
import { coleccionesCms } from '../webflow/esquema.ts';
import { hallazgo, medir, ok, type Auditoria, type Verificacion } from './tipos.ts';

const L = 'límites';
const ALARMA = 0.8;

const PLAN = {
  itemsComercio: 500,
  itemsCms: 2000,
  colecciones: 20,
  campos: 60,
  referencias: 10,
};

const ESCOPOS = [
  'cms:write',
  'ecommerce:write',
  'assets:write',
  'pages:write',
  'sites:write',
  'custom_code:write',
];

function contra(nombre: string, usado: number, tope: number, unidad: string): Verificacion {
  const uso = usado / tope;
  const valor = `${usado}/${tope}`;
  return uso < ALARMA
    ? ok(L, nombre, valor, `${Math.round(uso * 100)} % de ${unidad}`)
    : hallazgo(
        L,
        nombre,
        `${Math.round(uso * 100)} % de ${unidad}: cerca del tope del plan`,
        valor
      );
}

export const auditarLimites: Auditoria = async ({ conWebflow }) => {
  if (!conWebflow) return [];
  const sitio = await leerSitio();
  const { api } = sitio;
  return medir(L, 'uso del plan', async () => {
    const productos = await api.productos();
    const categorias = await api.items(sitio.categorias.id);
    const itemsComercio = productos.reduce((n, p) => n + 1 + p.skus.length, 0) + categorias.length;
    let itemsCms = 0;
    let maxCampos = 0;
    let maxReferencias = 0;
    for (const e of coleccionesCms()) {
      const c = sitio.colecciones.get(e.coleccion);
      if (!c) continue;
      itemsCms += (await api.items(c.id)).length;
      maxCampos = Math.max(maxCampos, c.fields.length);
      maxReferencias = Math.max(
        maxReferencias,
        c.fields.filter((f) => f.type === 'Reference' || f.type === 'MultiReference').length
      );
    }
    const token = await api.c.get<{ authorization: { scope: string } }>('/token/introspect');
    const faltan = ESCOPOS.filter((s) => !token.authorization.scope.split(',').includes(s));
    return [
      contra('ítems de ecommerce', itemsComercio, PLAN.itemsComercio, 'los ítems de ecommerce'),
      contra('ítems de CMS', itemsCms, PLAN.itemsCms, 'los ítems de CMS'),
      contra('colecciones', sitio.colecciones.size, PLAN.colecciones, 'las colecciones'),
      contra('campos por colección (máximo)', maxCampos, PLAN.campos, 'los campos'),
      contra(
        'referencias por colección (máximo)',
        maxReferencias,
        PLAN.referencias,
        'las referencias'
      ),
      faltan.length === 0
        ? ok(L, 'permisos del token', ESCOPOS.length)
        : hallazgo(L, 'permisos del token', `faltan ${faltan.join(', ')}`, faltan.length),
    ];
  });
};
