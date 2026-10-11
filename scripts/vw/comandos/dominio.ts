import { bandera } from '../comun/args.ts';
import {
  comparar,
  consultar,
  SERVIDORES,
  type Comparacion,
  type Servidor,
} from '../dominio/dns.ts';
import { comprobacionesHttp } from '../dominio/http.ts';
import { DOMINIO, REGISTROS, type Registro } from '../dominio/registros.ts';

interface Lectura {
  servidor: Servidor;
  comparacion: Comparacion;
}

export function describir(c: Comparacion): string {
  return [
    c.faltan.length ? `faltan ${c.faltan.join(', ')}` : '',
    c.sobran.length ? `sobran ${c.sobran.join(', ')}` : '',
  ]
    .filter(Boolean)
    .join(' · ');
}

async function leer(registro: Registro, servidor: Servidor): Promise<Lectura> {
  try {
    return {
      servidor,
      comparacion: comparar(registro.valores, await consultar(servidor, registro)),
    };
  } catch (error) {
    const motivo = error instanceof Error ? error.message : String(error);
    return {
      servidor,
      comparacion: { estado: 'distinto', faltan: [], sobran: [`error: ${motivo}`] },
    };
  }
}

function imprimir(registro: Registro, lecturas: Lectura[]): boolean {
  const listo = lecturas.every((l) => l.comparacion.estado === 'ok');
  const marca = listo ? 'ok' : registro.intocable ? 'ALERTA' : 'pendiente';
  const titulo = `  ${marca.padEnd(9)} ${registro.tipo.padEnd(5)} ${registro.nombre}`;
  const textos = lecturas.map((l) => describir(l.comparacion));
  if (listo) console.log(titulo);
  else if (new Set(textos).size === 1) console.log(`${titulo}: ${textos[0]}`);
  else {
    console.log(titulo);
    for (const [i, l] of lecturas.entries())
      console.log(`              ${l.servidor.nombre}: ${textos[i] || 'ok'}`);
  }
  return listo;
}

export async function ejecutar(args: string[]): Promise<number> {
  console.log(`DNS de ${DOMINIO} (${SERVIDORES.map((s) => s.nombre).join(' · ')})`);
  let registrosListos = 0;
  for (const registro of REGISTROS) {
    const lecturas = await Promise.all(SERVIDORES.map((s) => leer(registro, s)));
    if (imprimir(registro, lecturas)) registrosListos++;
  }
  console.log(
    `${registrosListos}/${REGISTROS.length} registros como deben en ${SERVIDORES.length} resolvedores.`
  );
  let httpListos = 0;
  const http = bandera(args, '--solo-dns') ? [] : await Promise.all(comprobacionesHttp());
  if (http.length) console.log('\nSitio');
  for (const r of http) {
    console.log(`  ${(r.ok ? 'ok' : 'pendiente').padEnd(9)} ${r.nombre}: ${r.detalle}`);
    if (r.ok) httpListos++;
  }
  if (http.length) console.log(`${httpListos}/${http.length} respuestas como deben.`);
  return registrosListos === REGISTROS.length && httpListos === http.length ? 0 : 1;
}
