import { auditarComercio } from '../auditar/comercio.ts';
import { auditarContenido } from '../auditar/contenido.ts';
import { auditarDatos } from '../auditar/datos.ts';
import { auditarLimites } from '../auditar/limites.ts';
import { auditarRepo } from '../auditar/repo.ts';
import { codigoSalida, escribirReporte } from '../auditar/reporte.ts';
import { auditarSitio } from '../auditar/sitio.ts';
import { error, type Auditoria, type Contexto, type Verificacion } from '../auditar/tipos.ts';
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
  const sinWebflow = bandera(args, '--sin-webflow');
  const hayToken = Boolean(process.env.WEBFLOW_SITE_TOKEN);
  const contexto: Contexto = {
    conWebflow: !sinWebflow && hayToken,
    conBuild: !bandera(args, '--sin-build'),
  };
  const solo = opcion(args, '--solo')?.split(',');
  const completa = !solo && !sinWebflow && contexto.conBuild;
  const lista: Verificacion[] =
    sinWebflow || hayToken
      ? []
      : [error('datos', 'conexión con Webflow', 'falta WEBFLOW_SITE_TOKEN en .env')];
  for (const [nombre, auditar] of Object.entries(DIMENSIONES)) {
    if (solo && !solo.includes(nombre)) continue;
    lista.push(...(await auditar(contexto)));
  }
  if (completa) escribirReporte(lista);
  for (const v of lista.filter((x) => x.estado !== 'ok'))
    console.log(
      `${v.estado === 'error' ? 'ERROR   ' : 'HALLAZGO'} ${v.dimension} · ${v.nombre}: ${v.detalle ?? ''}`
    );
  const salida = codigoSalida(lista);
  console.log(
    `${lista.filter((v) => v.estado === 'ok').length}/${lista.length} en orden${contexto.conWebflow ? '' : ' (sin Webflow)'}. Salida ${salida}.${completa ? ' Reporte: cerebro/MANTENIMIENTO.md' : ' Parcial: el reporte no cambia.'}`
  );
  return salida;
}
