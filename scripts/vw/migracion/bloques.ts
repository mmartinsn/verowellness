import { readFileSync } from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import type { RegistroLibre } from '../../../src/modelo/entidad.ts';

type Modulo = Record<string, unknown>;
type Fuente = Record<string, unknown>;

export function constante(archivo: string, nombre: string): unknown {
  const codigo = readFileSync(archivo, 'utf8');
  const inicio = codigo.search(new RegExp(`const ${nombre}\\s*=\\s*[\\[{]`));
  if (inicio < 0) throw new Error(`No encontré const ${nombre} en ${archivo}`);
  const abre = codigo.indexOf('=', inicio) + 1;
  let i = codigo.slice(abre).search(/[[{]/) + abre;
  const desde = i;
  let profundidad = 0;
  let cadena: string | null = null;
  for (; i < codigo.length; i++) {
    const c = codigo[i];
    if (cadena) {
      if (c === '\\') i++;
      else if (c === cadena) cadena = null;
      continue;
    }
    if (c === "'" || c === '"' || c === '`') cadena = c;
    else if (c === '[' || c === '{') profundidad++;
    else if (c === ']' || c === '}') {
      profundidad--;
      if (profundidad === 0) break;
    }
  }
  return vm.runInNewContext(`(${codigo.slice(desde, i + 1)})`, {});
}

interface Base {
  pagina: string;
  seccion: string;
}

const registro = ({ pagina, seccion }: Base, orden: number, campos: Fuente): RegistroLibre => ({
  id: `${pagina}-${seccion}-${orden}`,
  nombre: `${pagina} · ${seccion} · ${orden}`,
  pagina,
  seccion,
  orden,
  ...campos,
});

const lista = (base: Base, items: unknown) => [registro(base, 1, { items })];

const varios = (base: Base, filas: Fuente[], campos: (f: Fuente) => Fuente) =>
  filas.map((f, i) => registro(base, i + 1, campos(f)));

export function migrarBloques(raiz: string, datos: Record<string, Modulo>): RegistroLibre[] {
  const componente = (ruta: string) => path.join(raiz, 'src', ruta);
  const proceso = componente('components/uno-a-uno/Proceso.astro');
  const sobreMi = componente('pages/sobre-mi.astro');
  const porQue = componente('components/examenes/PorQue.astro');
  const { examenes, suplementos, tienda, oferta } = datos;
  const etiqueta = suplementos.etiqueta as { si: string[]; no: string[] };
  const continuidad = oferta.continuidad as {
    etiqueta: string;
    titulo: string;
    texto: string;
    canales: { nombre: string; url: string }[];
  };
  const listas: [Base, string, string][] = [
    [
      { pagina: 'inicio', seccion: 'herramientas' },
      'components/home/Herramientas.astro',
      'herramientas',
    ],
    [
      { pagina: 'inicio', seccion: 'otra-mirada' },
      'components/home/OtraMirada.astro',
      'principios',
    ],
    [{ pagina: 'inicio', seccion: 'problema' }, 'components/home/Problema.astro', 'fragmentos'],
    [
      { pagina: 'metodo', seccion: 'reframe-herramientas' },
      'components/metodo/ReframeMetodo.astro',
      'herramientas',
    ],
    [
      { pagina: 'asesorias', seccion: 'entregables-niveles' },
      'components/uno-a-uno/Entregables.astro',
      'tiers',
    ],
    [
      { pagina: 'asesorias', seccion: 'entregables-plan' },
      'components/uno-a-uno/Entregables.astro',
      'planTags',
    ],
    [
      { pagina: 'asesorias', seccion: 'entregables-extra' },
      'components/uno-a-uno/Entregables.astro',
      'planExtra',
    ],
    [
      { pagina: 'asesorias', seccion: 'reconocimiento' },
      'components/uno-a-uno/Reconocimiento.astro',
      'preguntas',
    ],
  ];
  return [
    ...listas.flatMap(([base, ruta, nombre]) => lista(base, constante(componente(ruta), nombre))),
    ...lista({ pagina: 'asesorias', seccion: 'proceso-temas' }, constante(proceso, 'temas')),
    ...varios(
      { pagina: 'asesorias', seccion: 'proceso-pasos' },
      constante(proceso, 'pasos') as Fuente[],
      (p) => ({
        etiqueta: p.snum,
        titulo: p.titulo,
        texto: p.texto,
        nota: p.nota,
        cita: p.cita,
        tono: p.tono,
        marcado: Boolean(p.chips),
      })
    ),
    ...lista({ pagina: 'sobre-mi', seccion: 'espejo' }, constante(sobreMi, 'espejo')),
    ...varios(
      { pagina: 'sobre-mi', seccion: 'capas' },
      constante(sobreMi, 'capas') as Fuente[],
      (c) => ({
        etiqueta: c.pre,
        items: c.chips,
        marcado: Boolean(c.tachado),
      })
    ),
    ...lista({ pagina: 'sobre-mi', seccion: 'acompano' }, constante(sobreMi, 'acompano')),
    ...varios(
      { pagina: 'sobre-mi', seccion: 'pilares' },
      constante(sobreMi, 'pilares') as Fuente[],
      (p) => ({
        titulo: p.t,
        texto: p.p,
      })
    ),
    ...lista({ pagina: 'examenes', seccion: 'porque-rutina' }, constante(porQue, 'rutina')),
    ...lista({ pagina: 'examenes', seccion: 'porque-funcional' }, constante(porQue, 'funcional')),
    ...varios(
      { pagina: 'examenes', seccion: 'porque-pilares' },
      constante(porQue, 'pilares') as Fuente[],
      (p) => ({
        titulo: p.titulo,
        texto: p.texto,
        icono: p.icono,
      })
    ),
    ...varios(
      { pagina: 'examenes', seccion: 'pasos-pedido' },
      examenes.pasosPedido as Fuente[],
      (p) => ({
        titulo: p.titulo,
        texto: p.texto,
      })
    ),
    ...varios(
      { pagina: 'suplementos', seccion: 'principios' },
      suplementos.principios as Fuente[],
      (p) => ({
        titulo: p.titulo,
        texto: p.texto,
      })
    ),
    ...lista({ pagina: 'suplementos', seccion: 'etiqueta-si' }, etiqueta.si),
    ...lista({ pagina: 'suplementos', seccion: 'etiqueta-no' }, etiqueta.no),
    registro({ pagina: 'suplementos', seccion: 'aviso' }, 1, {
      texto: suplementos.avisoSuplementos,
    }),
    registro({ pagina: 'tienda', seccion: 'aviso-legal' }, 1, { texto: tienda.avisoLegal }),
    registro({ pagina: 'sitio', seccion: 'continuidad' }, 1, {
      etiqueta: continuidad.etiqueta,
      titulo: continuidad.titulo,
      texto: continuidad.texto,
      enlace: continuidad.canales[0].url,
      enlaceTexto: continuidad.canales[0].nombre,
    }),
  ];
}
