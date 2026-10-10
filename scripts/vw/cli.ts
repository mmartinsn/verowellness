import { comandos } from './comandos/indice.ts';

const [nombre, ...args] = process.argv.slice(2);
const comando = comandos.find((c) => c.nombre === nombre);

if (!comando) {
  console.log('Uso: npm run vw -- <comando> [opciones]\n');
  for (const c of comandos) console.log(`  ${c.nombre.padEnd(12)} ${c.descripcion}`);
  process.exit(nombre ? 2 : 0);
}

try {
  const modulo = await comando.cargar();
  process.exitCode = await modulo.ejecutar(args);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 2;
}
