import { existsSync, readFileSync } from 'node:fs';
import { ARCHIVO_MODELO, ARCHIVO_SQL, documentos } from '../comandos/exportar.ts';
import { entidadesDeContenido } from '../../../src/modelo/esquema.ts';
import { ordenar } from '../../../src/modelo/serializar.ts';
import { comparar } from '../comun/comparar.ts';
import { problemasDe } from '../comun/problemas.ts';
import { leerSnapshot } from '../comun/snapshot.ts';
import { bajar } from '../webflow/bajar.ts';
import { leerSitio, type Sitio } from '../webflow/conexion.ts';
import { planEsquema } from '../webflow/esquema.ts';
import { sembrar } from '../webflow/sembrar.ts';
import { error, hallazgo, medir, ok, type Auditoria } from './tipos.ts';

const D = 'datos';

export const auditarDatos: Auditoria = async ({ conWebflow }) => {
  const tabla = leerSnapshot();
  const resultados = await medir(D, 'snapshot válido', async () => {
    const problemas = problemasDe(tabla);
    const total = Object.values(tabla).reduce((n, r) => n + r.length, 0);
    return problemas.length === 0
      ? ok(D, 'snapshot válido', total, `${total} registros pasan esquema y reglas`)
      : hallazgo(
          D,
          'snapshot válido',
          problemas
            .slice(0, 5)
            .map((p) => `${p.entidad}/${p.id}.${p.campo}: ${p.mensaje}`)
            .join(' · '),
          problemas.length
        );
  });
  for (const e of entidadesDeContenido())
    resultados.push(ok(D, `conteo ${e.coleccion}`, (tabla[e.clave] ?? []).length));
  resultados.push(
    ...(await medir(D, 'documentación del modelo al día', async () => {
      const { modelo, sql } = documentos(tabla);
      const actual = (f: string) => (existsSync(f) ? readFileSync(f, 'utf8') : '');
      const viejos = [
        actual(ARCHIVO_MODELO) !== modelo && 'docs/MODELO.md',
        actual(ARCHIVO_SQL) !== sql && 'docs/modelo.sql',
      ].filter(Boolean);
      return viejos.length === 0
        ? ok(D, 'documentación del modelo al día', 2)
        : hallazgo(
            D,
            'documentación del modelo al día',
            `${viejos.join(' y ')}: correr vw exportar docs`
          );
    }))
  );
  if (!conWebflow) return resultados;

  let sitio: Sitio;
  try {
    sitio = await leerSitio();
  } catch (causa) {
    return [...resultados, error(D, 'conexión con Webflow', causa)];
  }
  resultados.push(
    ...(await medir(D, 'esquema Webflow = modelo', async () => {
      const categorias = await sitio.api.items(sitio.categorias.id);
      const acciones = planEsquema(
        [...sitio.colecciones.values()],
        categorias.map((c) => c.fieldData)
      );
      const pendientes = acciones.filter((a) => a.tipo !== 'aviso');
      return pendientes.length === 0
        ? ok(D, 'esquema Webflow = modelo', 0)
        : hallazgo(
            D,
            'esquema Webflow = modelo',
            `${pendientes.length} diferencia(s); correr vw esquema`,
            pendientes.length
          );
    })),
    ...(await medir(D, 'Webflow publicado = snapshot', async () => {
      const { tabla: remota, imagenes, sinPublicar } = await bajar(sitio, tabla);
      let diferencias = 0;
      for (const e of entidadesDeContenido())
        diferencias += comparar(
          ordenar(e, tabla[e.clave] ?? []),
          ordenar(e, remota[e.clave] ?? [])
        ).length;
      return [
        diferencias === 0 && imagenes.size === 0
          ? ok(D, 'Webflow publicado = snapshot', 0)
          : hallazgo(
              D,
              'Webflow publicado = snapshot',
              `${diferencias} diferencia(s) y ${imagenes.size} imagen(es); correr vw bajar`,
              diferencias + imagenes.size
            ),
        sinPublicar.length === 0
          ? ok(D, 'cambios sin publicar en Webflow', 0)
          : hallazgo(
              D,
              'cambios sin publicar en Webflow',
              sinPublicar.slice(0, 8).join(', '),
              sinPublicar.length
            ),
      ];
    })),
    ...(await medir(D, 'sobrantes en Webflow', async () => {
      const plan = await sembrar(sitio, tabla, false);
      const sobrantes = plan.flatMap((r) => r.sobrantes.map((s) => `${r.coleccion}/${s}`));
      const pendientes = plan.reduce((n, r) => n + r.crear + r.actualizar, 0);
      return [
        sobrantes.length === 0
          ? ok(D, 'sobrantes en Webflow', 0)
          : hallazgo(D, 'sobrantes en Webflow', sobrantes.slice(0, 8).join(', '), sobrantes.length),
        pendientes === 0
          ? ok(D, 'snapshot llevado a Webflow', 0)
          : hallazgo(
              D,
              'snapshot llevado a Webflow',
              `${pendientes} escritura(s) pendientes; correr vw sembrar`,
              pendientes
            ),
      ];
    }))
  );
  return resultados;
};
