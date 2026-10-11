import path from 'node:path';
import {
  normalizarNombre,
  type CatalogoGracias,
  type ProductoGracias,
} from '../../../src/lib/comercio/confirmacion.ts';
import type { Tabla } from '../comun/snapshot.ts';
import { envolver, javascript } from './inyectable.ts';

export const ARCHIVO_CONFIRMACION = path.resolve('webflow', 'confirmacion.html');

export const PAGINA_CONFIRMACION = 'order-confirmation';

export function catalogoGracias(tabla: Tabla): CatalogoGracias {
  const guiaDe = new Map<string, string>(
    tabla.guia.flatMap((g) => [
      [g.producto as string, g.id],
      ...(g.oferta ? [[g.oferta as string, g.id] as [string, string]] : []),
    ])
  );
  return {
    porNombre: Object.fromEntries(
      tabla.producto.map((p) => {
        const guia = guiaDe.get(p.id);
        const producto: ProductoGracias = {
          id: p.id,
          tipo: p.tipo as string,
          ...(guia ? { guia } : {}),
        };
        return [normalizarNombre(p.nombre as string), producto];
      })
    ),
  };
}

export const generarConfirmacion = (tabla: Tabla, volver: string) =>
  envolver([
    `const CATALOGO = ${JSON.stringify(catalogoGracias(tabla))};`,
    `const VOLVER = ${JSON.stringify(volver)};`,
    javascript('src/lib/comercio/confirmacion.ts'),
    javascript('webflow/confirmacion.ts'),
  ]);
