import { existsSync } from 'node:fs';
import { registerHooks } from 'node:module';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const IMAGEN = /\.(jpe?g|png|webp|avif|gif)$/i;
const SUSTITUTO_IMAGENES = pathToFileURL(path.join(import.meta.dirname, 'imagenes-node.ts')).href;
const OBJETO_IMAGEN = pathToFileURL(path.join(import.meta.dirname, 'imagen.ts')).href;

const sustituir = (url: string) =>
  url.replaceAll('\\', '/').endsWith('/src/lib/datos/imagenes.ts') ? SUSTITUTO_IMAGENES : url;

registerHooks({
  resolve(especificador, contexto, siguiente) {
    const relativo = especificador.startsWith('.') || especificador.startsWith('/');
    if (relativo && contexto.parentURL && !path.extname(especificador)) {
      const candidato = fileURLToPath(new URL(`${especificador}.ts`, contexto.parentURL));
      if (existsSync(candidato))
        return { url: sustituir(pathToFileURL(candidato).href), shortCircuit: true };
    }
    const resuelto = siguiente(especificador, contexto);
    return { ...resuelto, url: sustituir(resuelto.url), shortCircuit: true };
  },
  load(url, contexto, siguiente) {
    if (!IMAGEN.test(url)) return siguiente(url, contexto);
    const archivo = JSON.stringify(fileURLToPath(url));
    return {
      format: 'module',
      shortCircuit: true,
      source: `import { objetoImagen } from ${JSON.stringify(OBJETO_IMAGEN)};\nexport default await objetoImagen(${archivo});\n`,
    };
  },
});
