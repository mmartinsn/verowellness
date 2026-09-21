/**
 * Base-aware internal links.
 *
 * The preview is served from GitHub Pages under `/verowellness/`, so a literal `href="/1-1/"`
 * would escape the site. Every internal link in a component goes through `href()`, which
 * prefixes `BASE_URL` (set from `base` in astro.config.mjs) and normalises the trailing slash
 * to match `trailingSlash: 'always'`. Hash-only links (`#faq`) and external URLs pass through.
 */
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

export function href(path: string): string {
  if (/^(https?:|mailto:|tel:|#)/.test(path)) return path;

  const [pathname, hash = ''] = path.split('#');
  const clean = pathname.replace(/^\/+/, '').replace(/\/+$/, '');
  const withSlash = clean ? `${BASE}/${clean}/` : `${BASE}/`;
  return hash ? `${withSlash}#${hash}` : withSlash;
}

/** A file under `public/` (no trailing slash — a file, not a route). */
export function asset(file: string): string {
  return `${BASE}/${file.replace(/^\/+/, '')}`;
}

/** True when `current` (Astro.url.pathname) is the page `path` points at. */
export function isCurrent(current: string, path: string): boolean {
  const target = href(path).split('#')[0];
  return current.replace(/\/$/, '') === target.replace(/\/$/, '');
}
