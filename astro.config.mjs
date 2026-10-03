import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Preview host: GitHub Pages as a *project site* → the site lives under `/verowellness/`.
// Every internal link goes through `href()` in `src/lib/url.ts`, which reads `BASE_URL`, so
// moving to a custom domain later is: set `site`, delete `base`, done.
export default defineConfig({
  site: 'https://mmartinsn.github.io',
  base: '/verowellness',
  trailingSlash: 'always',
  output: 'static',
  // Astro 7 defaults compressHTML to 'jsx', which glues adjacent inline elements together.
  // Keep the classic whitespace behaviour: the design relies on inline spacing in a few places.
  compressHTML: true,
  // «1:1» became «Asesorías» on 2026-10-03 (Verónica, change 28); old links keep working.
  redirects: { '/1-1': '/asesorias' },
  vite: { plugins: [tailwindcss()] },
});
