import { readFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { aCentavos } from '../../../src/lib/precio.ts';
import { precioOferta } from '../../../src/modelo/reglas.ts';
import type { RegistroLibre } from '../../../src/modelo/entidad.ts';

type Tabla = Record<string, RegistroLibre[]>;
type Modulo = Record<string, unknown>;

interface Imagen {
  src: string;
}

const NOMBRE_OFERTA = (nombre: string, descuento: number) => `${nombre} (−${descuento}%)`;
const CARGO = 'cargo-laboratorio';

export const slug = (texto: string) =>
  texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const rutaImagen = (img: Imagen) => img.src.replace(/^\/src\/assets\//, '');

async function cargar(raiz: string, nombre: string): Promise<Modulo> {
  return import(pathToFileURL(path.join(raiz, 'src', 'data', `${nombre}.ts`)).href);
}

function idsAsesorias(raiz: string): string[] {
  const pagina = readFileSync(path.join(raiz, 'src', 'pages', 'asesorias.astro'), 'utf8');
  const lista = pagina.match(/<Testimonios[\s\S]*?ids=\{\[([^\]]*)\]\}/);
  if (!lista) throw new Error('No encontré los ids de testimonios en asesorias.astro');
  return [...lista[1].matchAll(/'([^']+)'/g)].map((m) => m[1]);
}

function tokenizar(texto: string, nombres: [string, string][], precios: [string, string][]) {
  let salida = texto;
  for (const [valor, id] of precios) salida = salida.split(valor).join(`USD {precio:${id}}`);
  for (const [nombre, id] of nombres) salida = salida.split(nombre).join(`{nombre:${id}}`);
  return salida;
}

export async function migrar(raiz: string): Promise<Tabla> {
  const oferta = await cargar(raiz, 'oferta');
  const tienda = await cargar(raiz, 'tienda');
  const ex = await cargar(raiz, 'examenes');
  const fichasM = await cargar(raiz, 'fichas-examenes');
  const grupos = await cargar(raiz, 'grupos-examenes');
  const sint = await cargar(raiz, 'sintomas');
  const faqM = await cargar(raiz, 'faq');
  const test = await cargar(raiz, 'testimonios');
  const lay = await cargar(raiz, 'layers');
  const sup = await cargar(raiz, 'suplementos');

  const t: Tabla = {
    producto: [],
    asesoria: [],
    guia: [],
    ajustes: [],
    area: [],
    tipoMuestra: [],
    examen: [],
    sintoma: [],
    rutaSintoma: [],
    caminoAlimentos: [],
    testimonio: [],
    pregunta: [],
    layer: [],
    suplemento: [],
  };
  const descuento = Math.round(Number(tienda.DESCUENTO_POPUP) * 100);

  const ciclos = oferta.ciclos as Record<string, Record<string, unknown>>;
  const publicos = new Set((oferta.listaCiclos as { id: string }[]).map((c) => c.id));
  Object.values(ciclos).forEach((c, i) => {
    const conf = c.confirmacion as Record<string, string>;
    t.producto.push({
      id: c.slug as string,
      nombre: c.nombre as string,
      tipo: 'asesoria',
      precio: aCentavos(c.subtotal as number),
      impuesto: 'service-professional',
      enviable: false,
      sku: `ASE-${String(c.slug).toUpperCase()}`,
    });
    t.asesoria.push({
      id: c.slug as string,
      nombre: c.nombre as string,
      clave: c.id,
      producto: c.slug,
      consultas: c.consultas,
      etiqueta: c.etiqueta,
      etiquetaNota: c.etiquetaNota,
      descripcion: c.descripcion,
      descripcionCorta: c.descripcionCorta,
      incluye: c.incluye,
      incluyeCheckout: c.incluyeCheckout,
      notaPie: c.notaPie,
      bonus: c.bonus,
      confirmacionTitulo: conf.titulo,
      confirmacionTexto: conf.texto,
      calendlyUrl: conf.calendlyUrl,
      calendlyEtiqueta: conf.calendlyEtiqueta,
      publica: publicos.has(c.id as string),
      orden: i + 1,
    });
  });

  const ofertaGuias = tienda.ofertaPopupGuias as string[];
  (tienda.productos as Record<string, unknown>[]).forEach((p, i) => {
    const precio = aCentavos(p.precio as number);
    const cita = p.cita as { texto: string; pagina?: number };
    const conOferta = ofertaGuias.includes(p.id as string);
    t.producto.push({
      id: p.id as string,
      nombre: p.nombre as string,
      tipo: 'guia',
      precio,
      impuesto: 'digital-goods',
      enviable: false,
      sku: `GUIA-${p.num}`,
    });
    if (conOferta)
      t.producto.push({
        id: `${p.id}-oferta`,
        nombre: NOMBRE_OFERTA(p.nombre as string, descuento),
        tipo: 'oferta',
        precio: precioOferta(precio, descuento),
        impuesto: 'digital-goods',
        enviable: false,
        sku: `GUIA-${p.num}-OFERTA`,
      });
    t.guia.push({
      id: p.id as string,
      nombre: p.nombre as string,
      producto: p.id,
      oferta: conOferta ? `${p.id}-oferta` : undefined,
      num: p.num,
      paginas: p.paginas,
      tituloPortada: p.tituloPortada,
      portada: rutaImagen(p.portada as Imagen),
      masVendido: Boolean(p.bestSeller),
      subtitulo: p.subtitulo,
      gancho: p.gancho,
      paraTi: p.paraTi ?? [],
      incluye: p.incluye,
      cita: cita.texto,
      citaPagina: cita.pagina,
      formato: p.formato,
      nota: p.nota,
      boton: p.boton,
      tono: p.tono,
      orden: i + 1,
    });
  });

  t.producto.push({
    id: CARGO,
    nombre: 'Cargo del laboratorio (servicio y autorización)',
    tipo: 'cargo',
    precio: aCentavos(ex.FEE_LABORATORIO as number),
    impuesto: 'standard-exempt',
    enviable: false,
    sku: 'FEE-LAB',
  });

  const ws = sup.wholescripts as Record<string, unknown>;
  t.ajustes.push({
    id: 'sitio',
    nombre: 'Ajustes del sitio',
    descuentoOferta: descuento,
    ofertaGuias,
    cargoLaboratorio: CARGO,
    wholescriptsRegistro: ws.registro,
    wholescriptsCodigo: ws.codigo ?? undefined,
    wholescriptsApellido: ws.apellido ?? undefined,
    wholescriptsPendiente: ws.pendiente,
  });

  const presentacion = grupos.presentacionGrupo as Record<
    string,
    { icono: string; descripcion: string }
  >;
  (ex.areas as Record<string, string>[]).forEach((a, i) =>
    t.area.push({
      id: a.id,
      nombre: a.nombre,
      color: a.color,
      icono: presentacion[a.id]?.icono,
      descripcion: presentacion[a.id]?.descripcion,
      orden: i + 1,
    })
  );

  Object.entries(ex.muestras as Record<string, string>).forEach(([id, nombre], i) =>
    t.tipoMuestra.push({ id, nombre, orden: i + 1 })
  );

  const fichas = fichasM.fichas as Record<string, Record<string, unknown>>;
  const mide = grupos.mideAlimentos as Record<string, { alimentos?: number; mide: string[] }>;
  const vistos = new Set<string>();
  (ex.examenes as Record<string, unknown>[]).forEach((e, i) => {
    const productoId = (e.producto as string | undefined) ?? (e.id as string);
    if (!vistos.has(productoId)) {
      vistos.add(productoId);
      t.producto.push({
        id: productoId,
        nombre: e.nombre as string,
        tipo: 'examen',
        precio: aCentavos(e.precio as number),
        impuesto: 'service-professional',
        enviable: true,
        sku: `EX-${String(vistos.size).padStart(3, '0')}`,
      });
    }
    const f = fichas[e.id as string] ?? {};
    t.examen.push({
      id: e.id as string,
      nombre: e.nombre as string,
      producto: productoId,
      area: e.area,
      laboratorio: e.laboratorio,
      muestras: e.muestras,
      enCasa: e.enCasa,
      descripcion: e.descripcion,
      instructivo: e.instructivo,
      gancho: f.gancho,
      queMide: f.queMide,
      porQueImporta: f.porQueImporta,
      ideal: f.ideal,
      obtienes: f.obtienes,
      alimentos: mide[e.id as string]?.alimentos,
      mide: mide[e.id as string]?.mide ?? [],
      orden: i + 1,
    });
  });

  (grupos.caminosAlimentos as Record<string, unknown>[]).forEach((c, i) =>
    t.caminoAlimentos.push({
      id: c.id as string,
      nombre: c.pregunta as string,
      pregunta: c.pregunta,
      ayuda: c.ayuda,
      examenes: c.ids,
      orden: i + 1,
    })
  );

  (sint.sintomas as Record<string, unknown>[]).forEach((s, i) => {
    t.sintoma.push({
      id: s.id as string,
      nombre: s.titulo as string,
      ejemplos: s.ejemplos,
      color: s.color,
      icono: s.icono,
      orientacion: Boolean(s.orientacion),
      orden: i + 1,
    });
    (s.grupos as { pregunta: string; examenes: string[] }[]).forEach((g, j) =>
      t.rutaSintoma.push({
        id: `${s.id}-${j + 1}`,
        nombre: `${s.titulo} · ${j + 1}`,
        sintoma: s.id,
        pregunta: g.pregunta,
        examenes: g.examenes,
        orden: j + 1,
      })
    );
  });

  const nombres = Object.values(ciclos).map(
    (c) => [c.nombre as string, c.slug as string] as [string, string]
  );
  const precios = Object.values(ciclos).map(
    (c) => [`USD ${c.subtotal}`, c.slug as string] as [string, string]
  );
  const preguntaDe = (
    pagina: string,
    q: { q: string; a: string },
    i: number,
    conPrecios: boolean
  ) => {
    const pregunta = tokenizar(q.q, nombres, []);
    return {
      id: `${pagina}-${String(i + 1).padStart(2, '0')}`,
      nombre: pregunta,
      pagina,
      pregunta,
      respuesta: tokenizar(q.a, nombres, conPrecios ? precios : []),
      orden: i + 1,
    };
  };
  (faqM.faq as { q: string; a: string }[]).forEach((q, i) =>
    t.pregunta.push(preguntaDe('inicio', q, i, true))
  );
  (ex.preguntasExamenes as { q: string; a: string }[]).forEach((q, i) =>
    t.pregunta.push(preguntaDe('examenes', q, i, false))
  );

  const enAsesorias = new Set(idsAsesorias(raiz));
  (test.testimonios as Record<string, unknown>[]).forEach((x) =>
    t.testimonio.push({
      id: x.id as string,
      nombre: x.nombre as string,
      lugar: x.lugar,
      foto: x.foto ? rutaImagen(x.foto as Imagen) : undefined,
      motivos: x.motivo,
      destacado: x.destacado,
      texto: x.texto,
      prioridad: x.prioridad,
      enAsesorias: enAsesorias.has(x.id as string),
    })
  );

  const capas = lay.layers as Record<string, unknown>[];
  const numDe = new Map(capas.map((l) => [l.nombre as string, l.num as string]));
  capas.forEach((l, i) =>
    t.layer.push({
      id: l.num as string,
      nombre: l.nombre as string,
      pregunta: l.pregunta,
      observaTexto: l.observaTexto,
      observa: l.observa,
      cita: l.cita,
      conecta: (l.conecta as string[]).map((n) => {
        const id = numDe.get(n);
        if (!id) throw new Error(`Layer «${l.nombre}» conecta con «${n}», que no existe`);
        return id;
      }),
      rol: l.rol,
      color: l.color,
      oscuro: l.oscuro,
      orden: i + 1,
    })
  );

  for (const [layerId, lista] of Object.entries(
    sup.recomendaciones as Record<string, { nombre: string; marca: string }[]>
  ))
    lista.forEach((s, i) =>
      t.suplemento.push({
        id: slug(s.nombre),
        nombre: s.nombre,
        marca: s.marca,
        layer: layerId,
        orden: i + 1,
      })
    );

  return t;
}
