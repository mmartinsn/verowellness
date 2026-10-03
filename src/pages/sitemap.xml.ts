/**
 * sitemap.xml — only the pages meant to be found: home, The Method, 1:1, Exámenes, Tienda and Suplementos. Variants,
 * checkout, legal placeholders and 404 stay out. While `prototipo` is true every page is noindex
 * anyway; the sitemap is ready for the move to the real domain (declare it in that robots.txt).
 */
import type { APIRoute } from 'astro';
import { href } from '../lib/url';

const paginas = ['/', '/el-metodo', '/asesorias', '/examenes', '/tienda', '/suplementos'];

export const GET: APIRoute = ({ site }) => {
  const urls = paginas
    .map((p) => `  <url><loc>${site ? new URL(href(p), site).href : href(p)}</loc></url>`)
    .join('\n');
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } }
  );
};
