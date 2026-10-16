import { ESTILO, TEXTOS, VOLVER } from './generado.ts';

const escapar = (texto: string) => texto.replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);

export function estado(
  texto: 'vacio' | 'error',
  reintentar: string | null,
  status: number
): Response {
  const enlaces = [
    ...(reintentar ? [{ texto: TEXTOS.reintentar, href: reintentar }] : []),
    { texto: TEXTOS.volver, href: VOLVER },
  ]
    .map((e) => `<a href="${escapar(e.href)}">${escapar(e.texto)}</a>`)
    .join('');
  const html = [
    '<!doctype html><html lang="es"><head><meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width,initial-scale=1">',
    '<meta name="robots" content="noindex"><title>Veronica Wellness</title>',
    `<style>${ESTILO}</style></head><body>`,
    `<div data-vw-estado><p>${escapar(TEXTOS[texto])}</p>${enlaces}</div>`,
    '</body></html>',
  ].join('');
  return new Response(html, {
    status,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}
