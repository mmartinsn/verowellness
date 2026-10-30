import path from 'node:path';
import { leerSnapshot, type Tabla } from '../comun/snapshot.ts';
import {
  ARCHIVO_COBRO,
  catalogoCobro,
  diferenciaDePrecio,
  generarCobro,
  itemsDeSesion,
  sesionesKlarna,
  versionDe,
  versionDesplegada,
} from '../comercio/cobro.ts';
import { diferenciasDePedido } from '../comercio/pedidos.ts';
import { catalogoDe, VOLVER } from '../comercio/puente.ts';
import { leerArchivo } from '../webflow/codigo-de-pagina.ts';
import { error, hallazgo, medir, ok, type Auditoria, type Verificacion } from './tipos.ts';

const C = 'cobro';
const DIAS_PEDIDOS = 30;
const ARCHIVO = path.relative(process.cwd(), ARCHIVO_COBRO).split(path.sep).join('/');

export const auditarCobro: Auditoria = async ({ conWebflow }) => {
  let tabla: Tabla;
  try {
    tabla = leerSnapshot();
  } catch (causa) {
    return [error(C, 'snapshot legible', causa)];
  }
  const generado = generarCobro(tabla, VOLVER);
  const resultados: Verificacion[] = [
    leerArchivo(ARCHIVO_COBRO) === generado
      ? ok(C, 'cobro Klarna generado al día', versionDe(generado) ?? '')
      : hallazgo(
          C,
          'cobro Klarna generado al día',
          `${ARCHIVO} no coincide con el snapshot; correr vw cobro`
        ),
  ];
  if (!conWebflow) return resultados;
  resultados.push(
    ...(await medir(C, 'cobro Klarna desplegado', async () => {
      const local = versionDe(leerArchivo(ARCHIVO_COBRO));
      const desplegado = await versionDesplegada();
      if (!desplegado)
        return hallazgo(C, 'cobro Klarna desplegado', 'no responde; correr vw cobro --aplicar');
      if (desplegado.version !== local)
        return hallazgo(
          C,
          'cobro Klarna desplegado',
          `desplegada ${desplegado.version}, local ${local}; correr vw cobro --aplicar`
        );
      return desplegado.stripe === 'real'
        ? ok(C, 'cobro Klarna desplegado', desplegado.version, 'con la clave real de Stripe')
        : hallazgo(
            C,
            'cobro Klarna desplegado',
            `Stripe: ${desplegado.stripe ?? 'sin clave'}; el cobro real necesita la clave live`
          );
    })),
    ...(await medir(C, 'pedidos Klarna con las reglas del sitio', async () => {
      const clave = process.env.STRIPE_LECTURA;
      if (!clave)
        return hallazgo(
          C,
          'pedidos Klarna con las reglas del sitio',
          'falta STRIPE_LECTURA (clave restringida de solo lectura) en .env'
        );
      const sesiones = await sesionesKlarna(clave, new Date(Date.now() - DIAS_PEDIDOS * 86400000));
      const catalogo = catalogoDe(tabla);
      const productos = catalogoCobro(tabla);
      const rotos = sesiones.flatMap((s) => {
        const problemas = [
          ...diferenciasDePedido(itemsDeSesion(s), catalogo, new Date(s.created * 1000)),
          ...[diferenciaDePrecio(s, productos)].filter((d): d is string => !!d),
        ];
        return problemas.length ? [`${s.id}: ${problemas.join(', ')}`] : [];
      });
      const conExamen = sesiones.filter((s) =>
        itemsDeSesion(s).some((i) => productos[i.productSlug]?.enviable)
      ).length;
      return rotos.length === 0
        ? ok(
            C,
            'pedidos Klarna con las reglas del sitio',
            sesiones.length,
            `${sesiones.length} pagado(s) en ${DIAS_PEDIDOS} días, ${conExamen} con exámenes para enviar desde Stripe`
          )
        : hallazgo(
            C,
            'pedidos Klarna con las reglas del sitio',
            `revisar: ${rotos.join(' · ')}`,
            rotos.length
          );
    }))
  );
  return resultados;
};
