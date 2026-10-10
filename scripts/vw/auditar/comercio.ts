import { existsSync, readFileSync } from 'node:fs';
import { leerSnapshot, type Tabla } from '../comun/snapshot.ts';
import type { ApiWebflow } from '../webflow/api.ts';
import { diferenciasDePedido, type ItemPedido } from '../comercio/pedidos.ts';
import { ARCHIVO_PUENTE, catalogoDe, generarPuente, VOLVER } from '../comercio/puente.ts';
import { conectar } from '../webflow/conexion.ts';
import { error, hallazgo, medir, ok, type Auditoria, type Verificacion } from './tipos.ts';

const C = 'comercio';
const DIAS_SIN_CUMPLIR = 3;

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
    ...(await medir(C, 'puente generado al día', async () => {
      const generado = generarPuente(tabla, VOLVER);
      const archivo = existsSync(ARCHIVO_PUENTE) ? readFileSync(ARCHIVO_PUENTE, 'utf8') : '';
      return archivo === generado
        ? ok(C, 'puente generado al día', generado.length)
        : hallazgo(
            C,
            'puente generado al día',
            'webflow/pedido.html no coincide con el snapshot; correr vw puente'
          );
    }))
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
    ...(await medir(C, 'puente publicado en Webflow', async () => {
      const pagina = (await api.paginas()).find((p) => p.slug === 'pedido');
      if (!pagina)
        return hallazgo(C, 'puente publicado en Webflow', 'no existe la página «pedido»');
      const publicado = await api.codigoLibre(pagina.id, 'footer');
      const local = existsSync(ARCHIVO_PUENTE) ? readFileSync(ARCHIVO_PUENTE, 'utf8') : '';
      return publicado === local
        ? ok(C, 'puente publicado en Webflow', publicado.length)
        : hallazgo(
            C,
            'puente publicado en Webflow',
            'la página «pedido» tiene otra versión; correr vw puente --aplicar'
          );
    })),
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
