export function opcion(args: string[], nombre: string): string | undefined {
  const i = args.indexOf(nombre);
  return i >= 0 ? args[i + 1] : undefined;
}

export function bandera(args: string[], nombre: string): boolean {
  return args.includes(nombre);
}
