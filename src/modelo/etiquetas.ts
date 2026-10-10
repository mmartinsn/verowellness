const ACENTOS: Record<string, string> = {
  area: 'área',
  asesorias: 'asesorías',
  boton: 'botón',
  confirmacion: 'confirmación',
  descripcion: 'descripción',
  envio: 'envío',
  examenes: 'exámenes',
  guias: 'guías',
  icono: 'ícono',
  mas: 'más',
  metodo: 'método',
  num: 'número',
  orientacion: 'orientación',
  pagina: 'página',
  paginas: 'páginas',
  pais: 'país',
  publica: 'pública',
  que: 'qué',
  sintoma: 'síntoma',
  subtitulo: 'subtítulo',
  telefono: 'teléfono',
  titulo: 'título',
  unitario: 'unitario',
};

export const palabrasDe = (clave: string): string[] =>
  clave
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

export const slugCampo = (clave: string): string => palabrasDe(clave).join('-');

export const etiquetaAscii = (clave: string): string => {
  const texto = palabrasDe(clave).join(' ');
  return texto.charAt(0).toUpperCase() + texto.slice(1);
};

export const etiquetaCampo = (clave: string): string => {
  const texto = palabrasDe(clave)
    .map((p) => ACENTOS[p] ?? p)
    .join(' ');
  return texto.charAt(0).toUpperCase() + texto.slice(1);
};
