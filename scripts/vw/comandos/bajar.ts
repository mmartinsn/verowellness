import { bandera } from '../comun/args.ts';
import { comparar } from '../comun/comparar.ts';
import { informarProblemas, problemasDe } from '../comun/problemas.ts';
import { escribirSnapshot, leerSnapshot } from '../comun/snapshot.ts';
import { carpetasImagen, entidadesDeContenido } from '../../../src/modelo/esquema.ts';
import { ordenar } from '../../../src/modelo/serializar.ts';
import { leerSitio } from '../webflow/conexion.ts';
import { bajar, escribirImagenes, imagenesHuerfanas } from '../webflow/bajar.ts';

export async function ejecutar(args: string[]): Promise<number> {
  const local = leerSnapshot();
  const sitio = await leerSitio();
  const { tabla, imagenes, sinPublicar } = await bajar(sitio, local);
  if (sinPublicar.length)
    console.log(
      `Aviso: ${sinPublicar.length} cambio(s) en Webflow sin publicar: ${sinPublicar.slice(0, 10).join(', ')}`
    );
  const problemas = problemasDe(tabla);
  if (problemas.length) {
    console.error('Lo publicado en Webflow no pasa el modelo; el snapshot local queda como está.');
    return informarProblemas(problemas);
  }
  let diferencias = 0;
  for (const e of entidadesDeContenido()) {
    const lista = comparar(
      ordenar(e, local[e.clave] ?? []),
      ordenar(e, tabla[e.clave] ?? []),
      e.coleccion
    );
    diferencias += lista.length;
    for (const d of lista.slice(0, 5))
      console.log(`  ${d.ruta}\n    local:   ${d.antes}\n    webflow: ${d.despues}`);
  }
  console.log(`Imágenes nuevas o cambiadas en Webflow: ${imagenes.size}.`);
  if (bandera(args, '--comprobar')) {
    console.log(
      diferencias === 0
        ? 'Webflow publicado = snapshot local.'
        : `${diferencias} diferencia(s) entre Webflow y el snapshot.`
    );
    return diferencias === 0 && imagenes.size === 0 ? 0 : 1;
  }
  escribirImagenes(imagenes);
  const cambiados = escribirSnapshot(tabla);
  const huerfanas = imagenesHuerfanas(tabla, carpetasImagen());
  console.log(
    `Snapshot actualizado desde Webflow: ${cambiados.length ? cambiados.join(', ') : 'sin cambios'}.`
  );
  if (huerfanas.length)
    console.log(
      `Imágenes que ya nadie usa (borrar a mano si corresponde): ${huerfanas.join(', ')}`
    );
  return 0;
}
