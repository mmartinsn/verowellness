import path from 'node:path';
import { leerSnapshot, type Tabla } from '../comun/snapshot.ts';
import type { ApiWebflow } from '../webflow/api.ts';
import {
  ARCHIVO_CONFIRMACION,
  generarConfirmacion,
  PAGINA_CONFIRMACION,
} from '../comercio/confirmacion.ts';
import { diferenciasDePedido, type ItemPedido } from '../comercio/pedidos.ts';
import { ARCHIVO_PUENTE, catalogoDe, generarPuente, VOLVER } from '../comercio/puente.ts';
import { leerArchivo, publicadoEnPagina } from '../webflow/codigo-de-pagina.ts';
import { conectar } from '../webflow/conexion.ts';
import { error, hallazgo, medir, ok, type Auditoria, type Verificacion } from './tipos.ts';

const C = 'comercio';
const DIAS_SIN_CUMPLIR = 3;

const generadoAlDia = (
  nombre: string,
  generado: string,
  archivo: string,
  comando: string
): Verificacion =>
  leerArchivo(archivo) === generado
    ? ok(C, nombre, generado.length)
    : hallazgo(
        C,
        nombre,
        `webflow/${path.basename(archivo)} no coincide con el snapshot; correr vw ${comando}`
      );

async function codigoPublicado(
  api: ApiWebflow,
  nombre: string,
  slug: string,
  archivo: string,
  comando: string
): Promise<Verificacion> {
  const publicado = await publicadoEnPagina(api, slug);
  if (publicado === null) return hallazgo(C, nombre, `no existe la página «${slug}»`);
  return publicado === leerArchivo(archivo)
    ? ok(C, nombre, publicado.length)
    : hallazgo(C, nombre, `la página «${slug}» tiene otra versión; correr vw ${comando} --aplicar`);
}

interface PedidoWf {
  orderId?: string;
  status: string;
  acceptedOn?: string;
  purchasedItems?: ItemPedido[];
}

export const auditarComercio: Auditoria = async ({ conWebflow }) => {
  let tabla: Tabla;
  try {
    tabla = leerSnapshot();
  } catch (causa) {
    return [error(C, 'snapshot legible', causa)];
  }
  const resultados: Verificacion[] = [];
  const guias = tabla.producto.filter((p) => p.tipo === 'guia');
  const sinDescarga = guias.filter((p) => !p.descarga).map((p) => p.id);
  resultados.push(
    sinDescarga.length === 0
      ? ok(C, 'guías con archivo de descarga', guias.length)
      : hallazgo(
          C,
          'guías con archivo de descarga',
          `sin PDF: ${sinDescarga.join(', ')}`,
          sinDescarga.length
        )
  );
  resultados.push(
    ...(await medir(C, 'puente generado al día', async () =>
      generadoAlDia(
        'puente generado al día',
        generarPuente(tabla, VOLVER),
        ARCHIVO_PUENTE,
        'puente'
      )
    )),
    ...(await medir(C, 'confirmación generada al día', async () =>
      generadoAlDia(
        'confirmación generada al día',
        generarConfirmacion(tabla, VOLVER),
        ARCHIVO_CONFIRMACION,
        'confirmacion'
      )
    ))
  );
  if (!conWebflow) return resultados;
  let api: ApiWebflow;
  try {
    api = conectar();
  } catch (causa) {
    return [...resultados, error(C, 'conexión con Webflow', causa)];
  }
  resultados.push(
    ...(await medir(C, 'moneda de la tienda', async () => {
      const { defaultCurrency } = await api.c.get<{ defaultCurrency: string }>(
        `/sites/${api.c.sitio}/ecommerce/settings`
      );
      return defaultCurrency === 'USD'
        ? ok(C, 'moneda de la tienda', defaultCurrency)
        : hallazgo(C, 'moneda de la tienda', `es ${defaultCurrency}, se espera USD`);
    })),
    ...(await medir(C, 'puente publicado en Webflow', () =>
      codigoPublicado(api, 'puente publicado en Webflow', 'pedido', ARCHIVO_PUENTE, 'puente')
    )),
    ...(await medir(C, 'confirmación publicada en Webflow', () =>
      codigoPublicado(
        api,
        'confirmación publicada en Webflow',
        PAGINA_CONFIRMACION,
        ARCHIVO_CONFIRMACION,
        'confirmacion'
      )
    )),
    ...(await medir(C, 'plantillas de colección en borrador', async () => {
      const productos = (await api.colecciones()).find((c) => c.slug === 'product')?.id;
      const publicas = (await api.paginas())
        .filter((p) => p.collectionId && p.collectionId !== productos && !p.draft)
        .map((p) => p.title);
      return publicas.length === 0
        ? ok(
            C,
            'plantillas de colección en borrador',
            0,
            'solo la plantilla de producto está publicada'
          )
        : hallazgo(
            C,
            'plantillas de colección en borrador',
            `públicas: ${publicas.join(', ')}`,
            publicas.length
          );
    })),
    ...(await medir(C, 'descargas responden', async () => {
      const urls = tabla.producto
        .map((p) => p.descarga as string | undefined)
        .filter((u): u is string => Boolean(u));
      const caidas: string[] = [];
      for (const url of urls) {
        const r = await fetch(url, { method: 'HEAD', redirect: 'follow' }).catch(() => null);
        if (!r || r.status >= 400) caidas.push(url);
      }
      return caidas.length === 0
        ? ok(C, 'descargas responden', urls.length)
        : hallazgo(C, 'descargas responden', caidas.join(', '), caidas.length);
    })),
    ...(await medir(C, 'pedidos sin cumplir', async () => {
      const pedidos = await api.c.todas<PedidoWf>(
        `/sites/${api.c.sitio}/orders?status=unfulfilled`,
        'orders'
      );
      const limite = Date.now() - DIAS_SIN_CUMPLIR * 86400000;
      const viejos = pedidos.filter(
        (p) => p.acceptedOn && Date.parse(p.acceptedOn) < limite
      ).length;
      return viejos === 0
        ? ok(
            C,
            'pedidos sin cumplir',
            pedidos.length,
            `${pedidos.length} abiertos, ninguno de más de ${DIAS_SIN_CUMPLIR} días`
          )
        : hallazgo(
            C,
            'pedidos sin cumplir',
            `${viejos} con más de ${DIAS_SIN_CUMPLIR} días`,
            viejos
          );
    })),
    ...(await medir(C, 'pedidos con las reglas del sitio', async () => {
      const pedidos = await api.c.todas<PedidoWf>(
        `/sites/${api.c.sitio}/orders?status=unfulfilled`,
        'orders'
      );
      const catalogo = catalogoDe(tabla);
      const rotos = pedidos.flatMap((p) => {
        const diferencias = diferenciasDePedido(p.purchasedItems ?? [], catalogo);
        return diferencias.length ? [`pedido ${p.orderId}: ${diferencias.join(', ')}`] : [];
      });
      return rotos.length === 0
        ? ok(
            C,
            'pedidos con las reglas del sitio',
            pedidos.length,
            `${pedidos.length} pedido(s) sin enviar revisados: oferta y cargo de laboratorio en orden`
          )
        : hallazgo(
            C,
            'pedidos con las reglas del sitio',
            `revisar antes de enviar: ${rotos.join(' · ')}`,
            rotos.length
          );
    }))
  );
  return resultados;
};
