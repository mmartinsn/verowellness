import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import type { Verificacion } from './tipos.ts';

export const CARPETA_REPORTE = path.resolve('cerebro');

const ICONO = { ok: '✓', hallazgo: '⚠', error: '✗' } as const;

export const codigoSalida = (lista: Verificacion[]) =>
  lista.some((v) => v.estado === 'error') ? 2 : lista.some((v) => v.estado === 'hallazgo') ? 1 : 0;

const celda = (texto: unknown) =>
  String(texto ?? '')
    .replaceAll('|', '\\|')
    .replaceAll('\n', ' ');

export function markdown(lista: Verificacion[], fecha: Date): string {
  const cuenta = (e: Verificacion['estado']) => lista.filter((v) => v.estado === e).length;
  const dimensiones = [...new Set(lista.map((v) => v.dimension))];
  const lineas = [
    '# Mantenimiento de verowellness',
    '',
    `Generado por \`npm run vw -- auditar\` el ${fecha.toISOString()}. No se edita a mano.`,
    '',
    `**${cuenta('ok')} en orden · ${cuenta('hallazgo')} hallazgo(s) · ${cuenta('error')} error(es) de medición.** Salida ${codigoSalida(lista)}.`,
    '',
  ];
  for (const d of dimensiones) {
    lineas.push(
      `## ${d.charAt(0).toUpperCase()}${d.slice(1)}`,
      '',
      '| | Verificación | Valor | Detalle |',
      '|---|---|---|---|'
    );
    for (const v of lista.filter((x) => x.dimension === d))
      lineas.push(
        `| ${ICONO[v.estado]} | ${celda(v.nombre)} | ${celda(v.valor)} | ${celda(v.detalle)} |`
      );
    lineas.push('');
  }
  return lineas.join('\n');
}

export function escribirReporte(lista: Verificacion[], fecha = new Date()) {
  mkdirSync(CARPETA_REPORTE, { recursive: true });
  writeFileSync(path.join(CARPETA_REPORTE, 'MANTENIMIENTO.md'), markdown(lista, fecha));
  writeFileSync(
    path.join(CARPETA_REPORTE, 'mantenimiento.json'),
    `${JSON.stringify({ fecha: fecha.toISOString(), salida: codigoSalida(lista), verificaciones: lista }, null, 2)}\n`
  );
}
