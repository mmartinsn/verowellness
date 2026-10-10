import { bandera, opcion } from '../comun/args.ts';
import { censar } from '../contenido/censo.ts';

export async function ejecutar(args: string[]): Promise<number> {
  const conteos = censar();
  const vivos = conteos.filter((c) => c.enUso);
  const muertos = conteos.filter((c) => !c.enUso);
  const suma = (lista: typeof conteos) => lista.reduce((n, c) => n + c.textos, 0);
  const lista = bandera(args, '--todos') ? conteos : vivos;
  for (const c of lista.slice(0, Number(opcion(args, '--top') ?? 25)))
    console.log(
      `${String(c.textos).padStart(4)}  ${c.archivo}${c.enUso ? '' : ' (sin uso)'}  · ${c.ejemplos[0].slice(0, 60)}`
    );
  console.log(
    `${suma(vivos)} textos escritos en el código de páginas en uso (${vivos.length} archivos); ${suma(muertos)} más en ${muertos.length} componentes que ninguna página usa.`
  );
  return 0;
}
