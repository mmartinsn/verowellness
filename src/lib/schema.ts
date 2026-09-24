/**
 * schema.org structured data (JSON-LD), built from the same data the pages render — nothing here
 * is typed twice and nothing is added that the site does not already say. `jobTitle` is her
 * title as confirmed on 2026-09-23. Deliberately left out until confirmed: formal credentials
 * (hasCredential), social profiles (sameAs), address and area served, and a FAQPage (its answers
 * are pending her review; Google no longer shows FAQ rich results anyway).
 */
import { listaCiclos, checkoutPath } from '../data/oferta';
import { marca } from '../data/site';
import { href } from './url';

type Nodo = Record<string, unknown>;

/** `site` is Astro.site; returns the absolute URL of an internal path. */
function url(site: URL | undefined, path: string): string {
  return site ? new URL(href(path), site).href : href(path);
}

export function grafoSitio(site: URL | undefined): Nodo[] {
  const inicio = url(site, '/');
  const org = `${inicio}#organizacion`;
  const persona = `${inicio}#veronica`;
  return [
    {
      '@type': 'Organization',
      '@id': org,
      name: marca.nombre,
      url: inicio,
      slogan: marca.lema,
      founder: { '@id': persona },
    },
    {
      '@type': 'WebSite',
      '@id': `${inicio}#sitio`,
      name: marca.nombre,
      url: inicio,
      inLanguage: 'es',
      publisher: { '@id': org },
    },
    {
      '@type': 'Person',
      '@id': persona,
      name: marca.creadora,
      jobTitle: marca.titulo,
      worksFor: { '@id': org },
    },
  ];
}

/** The 1:1 offer: one Service with an Offer per cycle (price before tax, in USD). */
export function grafoServicio(site: URL | undefined): Nodo {
  const inicio = url(site, '/');
  return {
    '@type': 'Service',
    '@id': `${inicio}#layer-method-1-1`,
    name: `${marca.metodo} 1:1`,
    serviceType: 'Asesoría de nutrición funcional y salud celular',
    provider: { '@id': `${inicio}#organizacion` },
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: url(site, '/1-1'),
      name: 'Asesorías 100% online',
    },
    offers: listaCiclos.map((c) => ({
      '@type': 'Offer',
      name: c.nombre,
      description: c.descripcion,
      price: c.subtotal.toFixed(2),
      priceCurrency: 'USD',
      priceSpecification: {
        '@type': 'PriceSpecification',
        price: c.subtotal.toFixed(2),
        priceCurrency: 'USD',
        valueAddedTaxIncluded: false,
      },
      url: url(site, checkoutPath(c)),
      availability: 'https://schema.org/InStock',
    })),
  };
}
