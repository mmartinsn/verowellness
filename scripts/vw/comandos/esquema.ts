import { bandera } from '../comun/args.ts';
import { leerSitio } from '../webflow/conexion.ts';
import { aplicarEsquema, planEsquema, type Accion } from '../webflow/esquema.ts';

const describir = (a: Accion) => {
  switch (a.tipo) {
    case 'crear-coleccion':
      return `crear colección   ${a.entidad.coleccion}`;
    case 'crear-campo':
      return `crear campo       ${a.entidad.coleccion}.${a.campo.slug} (${a.campo.tipo})`;
    case 'ajustar-campo':
      return `ajustar campo     ${a.entidad.coleccion}.${a.campo.slug}: ${Object.keys(a.cambios).join(', ')}`;
    case 'crear-categoria':
      return `crear categoría   ${a.slug}`;
    case 'tipo-distinto':
      return `MANUAL            ${a.entidad.coleccion}.${a.campo.slug}: es ${a.actual} en Webflow y el modelo pide ${a.campo.tipo}`;
    case 'manual':
      return `MANUAL            ${a.detalle}`;
    case 'aviso':
      return `aviso             ${a.detalle}`;
  }
};

const pendientes = (acciones: Accion[]) =>
  acciones.filter((a) => a.tipo !== 'manual' && a.tipo !== 'tipo-distinto' && a.tipo !== 'aviso');

async function plan() {
  const sitio = await leerSitio();
  const categorias = await sitio.api.items(sitio.categorias.id);
  return {
    sitio,
    acciones: planEsquema(
      [...sitio.colecciones.values()],
      categorias.map((c) => c.fieldData)
    ),
  };
}

export async function ejecutar(args: string[]): Promise<number> {
  const { sitio, acciones } = await plan();
  const porHacer = pendientes(acciones);
  for (const a of acciones) console.log(`  ${describir(a)}`);
  console.log(
    `${porHacer.length} cambio(s) por aplicar, ${acciones.length - porHacer.length} nota(s).`
  );
  if (!bandera(args, '--aplicar')) {
    if (porHacer.length)
      console.log('En seco: nada se escribió. Repite con --aplicar para ejecutarlo.');
    return 0;
  }
  if (porHacer.length === 0) return 0;
  await aplicarEsquema(sitio.api, porHacer, sitio.categorias.id);
  const segunda = pendientes((await plan()).acciones);
  console.log(
    `Aplicado con ${sitio.api.c.solicitudes} solicitud(es). Segunda vuelta: ${segunda.length} cambio(s).`
  );
  for (const a of segunda) console.log(`  ${describir(a)}`);
  return segunda.length === 0 ? 0 : 1;
}
