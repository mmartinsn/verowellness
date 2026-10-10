export function si<K extends string, V>(clave: K, valor: V | undefined): { [P in K]?: V } {
  return (valor === undefined ? {} : { [clave]: valor }) as { [P in K]?: V };
}

export function siHay<K extends string, V>(clave: K, valor: V[] | undefined): { [P in K]?: V[] } {
  return (valor && valor.length > 0 ? { [clave]: valor } : {}) as { [P in K]?: V[] };
}

export function siVerdadero<K extends string>(clave: K, valor: boolean): { [P in K]?: true } {
  return (valor ? { [clave]: true } : {}) as { [P in K]?: true };
}
