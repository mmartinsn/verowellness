export function normalizar(texto: string): string {
  return texto.normalize('NFD').replace(/\p{M}/gu, '').replace(/['’]/g, '').toLowerCase().trim();
}
