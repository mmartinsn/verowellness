import { auditarComercio } from '../auditar/comercio.ts';
import { auditarContenido } from '../auditar/contenido.ts';
import { auditarDatos } from '../auditar/datos.ts';
import { auditarLimites } from '../auditar/limites.ts';
import { auditarRepo } from '../auditar/repo.ts';
import { codigoSalida, escribirReporte } from '../auditar/reporte.ts';
import { auditarSitio } from '../auditar/sitio.ts';
import type { Auditoria, Contexto, Verificacion } from '../auditar/tipos.ts';
import { bandera, opcion } from '../comun/args.ts';

const DIMENSIONES: Record<string, Auditoria> = {
  datos: auditarDatos,
  comercio: auditarComercio,
  limites: auditarLimites,
  sitio: auditarSitio,
  repo: auditarRepo,
  contenido: auditarContenido,
};

export async function ejecutar(args: string[]): Promise<number> {
  const contexto: Contexto = {
    conWebflow: !bandera(args, '--sin-webflow') && Boolean(process.env.WEBFLOW_SITE_TOKEN),
    conBuild: !bandera(args, '--sin-build'),
  };
  const solo = opcion(args, '--solo')?.split(',');
  const lista: Verificacion[] = [];
  for (const [nombre, auditar] of Object.entries(DIMENSIONES)) {
    if (solo && !solo.includes(nombre)) continue;
    lista.push(...(await auditar(contexto)));
  }
  if (!solo) escribirReporte(lista);
  for (const v of lista.filter((x) => x.estado !== 'ok'))
    console.log(
      `${v.estado === 'error' ? 'ERROR   ' : 'HALLAZGO'} ${v.dimension} · ${v.nombre}: ${v.detalle ?? ''}`
    );
  const salida = codigoSalida(lista);
  console.log(
    `${lista.filter((v) => v.estado === 'ok').length}/${lista.length} en orden${contexto.conWebflow ? '' : ' (sin Webflow)'}. Salida ${salida}.${solo ? '' : ' Reporte: cerebro/MANTENIMIENTO.md'}`
  );
  return salida;
}
