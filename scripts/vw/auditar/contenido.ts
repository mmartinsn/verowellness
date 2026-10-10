import { censar } from '../contenido/censo.ts';
import { medir, ok, type Auditoria } from './tipos.ts';

const T = 'contenido';

export const auditarContenido: Auditoria = async () =>
  medir(T, 'textos aún escritos en el código', async () => {
    const conteos = censar();
    const vivos = conteos.filter((c) => c.enUso);
    const muertos = conteos.filter((c) => !c.enUso);
    const suma = vivos.reduce((n, c) => n + c.textos, 0);
    return [
      ok(
        T,
        'textos aún escritos en el código',
        suma,
        `${vivos.length} archivos; los que más: ${vivos
          .slice(0, 3)
          .map((c) => `${c.archivo} (${c.textos})`)
          .join(', ')}`
      ),
      ok(T, 'componentes sin uso', muertos.length, muertos.map((c) => c.archivo).join(', ')),
    ];
  });
