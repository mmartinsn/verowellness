import { TOKEN } from '../../modelo/reglas.ts';
import { desdeCentavos } from '../precio.ts';
import { uno } from './canonico.ts';

export function completar(texto: string): string {
  return texto.replace(TOKEN, (_, tipo: string, id: string) => {
    const producto = uno('producto', id);
    return tipo === 'nombre' ? producto.nombre : String(desdeCentavos(producto.precio));
  });
}
