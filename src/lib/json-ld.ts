export const scriptJsonLd = (grafo: Record<string, unknown>[]): string =>
  JSON.stringify({ '@context': 'https://schema.org', '@graph': grafo }).replaceAll('<', '\\u003c');
