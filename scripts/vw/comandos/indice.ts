export interface Comando {
  ejecutar(args: string[]): Promise<number>;
}

interface Entrada {
  nombre: string;
  descripcion: string;
  cargar(): Promise<Comando>;
}

export const comandos: Entrada[] = [
  {
    nombre: 'migrar',
    descripcion: 'Arma el snapshot canónico desde los src/data/*.ts de un commit (--desde <ref>)',
    cargar: () => import('./migrar.ts'),
  },
  {
    nombre: 'validar',
    descripcion: 'Valida el snapshot canónico contra el esquema y las reglas de negocio',
    cargar: () => import('./validar.ts'),
  },
  {
    nombre: 'ida-vuelta',
    descripcion:
      'Compara cada export de src/data con el de un commit base (--base <ref>, --solo a,b)',
    cargar: () => import('./ida-vuelta.ts'),
  },
  {
    nombre: 'paridad',
    descripcion: 'Compara dist/ con la línea base del front (--base <dir>, --dist <dir>)',
    cargar: () => import('./paridad.ts'),
  },
  {
    nombre: 'esquema',
    descripcion: 'Compara el modelo con las colecciones de Webflow; --aplicar crea lo que falta',
    cargar: () => import('./esquema.ts'),
  },
  {
    nombre: 'sembrar',
    descripcion:
      'Lleva el snapshot canónico a Webflow (productos y CMS); --aplicar escribe y publica',
    cargar: () => import('./sembrar.ts'),
  },
  {
    nombre: 'bajar',
    descripcion: 'Trae lo publicado en Webflow al snapshot canónico; --comprobar solo compara',
    cargar: () => import('./bajar.ts'),
  },
  {
    nombre: 'puente',
    descripcion:
      'Genera webflow/pedido.html: el puente que carga el pedido en el carrito de Webflow',
    cargar: () => import('./puente.ts'),
  },
  {
    nombre: 'probar-puente',
    descripcion: 'Matriz de pedidos contra el puente de Webflow: el checkout debe dar lo esperado',
    cargar: () => import('./probar-puente.ts'),
  },
  {
    nombre: 'auditar',
    descripcion:
      'Auditoría de mantenimiento: datos, comercio, límites, sitio, repo (0 sano, 1 hallazgos, 2 error)',
    cargar: () => import('./auditar.ts'),
  },
];
