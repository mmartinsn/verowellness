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
];
