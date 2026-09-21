import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Preview host: GitHub Pages as a *project site* → the site lives under `/verowellness/`.
// Every internal link goes through `href()` in `src/lib/url.ts`, which reads `BASE_URL`, so
// moving to a custom domain later is: set `site`, delete `base`, done.
export default defineConfig({
  site: 'https://santilanzb.github.io',
  base: '/verowellness',
  trailingSlash: 'always',
  output: 'static',
  // Astro 7 defaults compressHTML to 'jsx', which glues adjacent inline elements together.
  // Keep the classic whitespace behaviour: the design relies on inline spacing in a few places.
  compressHTML: true,
  vite: { plugins: [tailwindcss()] },
});
