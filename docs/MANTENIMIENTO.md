# Mantenimiento: la auditoría de todo el sitio

`npm run vw -- auditar` mide el estado de los datos, la venta, los límites del plan de Webflow, el
sitio construido y el repositorio, y deja un reporte. Está pensado para correr cada día solo y
para que una persona (o un agente) investigue lo que encuentre.

## Salida

- **0**: todo en orden. **1**: hallazgos (algo que hay que mirar). **2**: alguna verificación no
  pudo medirse (sin red, sin token, error de la herramienta).
- Escribe `cerebro/MANTENIMIENTO.md` (tabla por dimensión) y `cerebro/mantenimiento.json`, fuera
  del repo.
- `--solo datos,comercio` limita las dimensiones; `--sin-webflow` no llama a Webflow;
  `--sin-build` usa el `dist/` que haya.

## Qué mide

| Dimensión        | Verificaciones                                                                                                                                                                                                                              |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Datos            | Snapshot contra esquema y reglas · conteo por entidad · documentación del modelo al día · esquema de Webflow = modelo · Webflow publicado = snapshot (imágenes incluidas) · cambios sin publicar en Webflow · sobrantes · siembra pendiente |
| Comercio         | Guías sin PDF · puente generado y publicado al día · moneda USD · descargas que responden · pedidos sin cumplir de más de 3 días (solo conteos)                                                                                             |
| Límites          | Ítems de ecommerce y de CMS, colecciones, campos y referencias contra el plan (alarma al 80 %) · permisos del token                                                                                                                         |
| Sitio            | Build · enlaces internos y externos (Calendly incluido) · SEO por página · JSON-LD con los precios del snapshot · accesibilidad básica · peso por página · sitemap                                                                          |
| Repo y seguridad | `main` contra `origin` · árbol limpio · último deploy · `npm audit` · `.env` fuera de git · el token ausente de `dist/`, el snapshot y el puente                                                                                            |

## Qué hacer con cada hallazgo

- **Webflow publicado ≠ snapshot**: alguien publicó cambios en Webflow → `vw bajar`, revisar el
  diff, `npm run verify`, commit.
- **Cambios sin publicar**: hay borradores en Webflow; no bajan hasta que se publiquen.
- **Esquema ≠ modelo**: `vw esquema` (en seco) y, si corresponde, `--aplicar`.
- **Puente desactualizado**: `vw puente --aplicar`.
- **Límites al 80 %**: planear el plan siguiente de Webflow (Plus duplica colecciones) o
  consolidar.
- **Enlaces externos caídos, guías sin PDF**: son de Verónica; se le pasa la lista.
- **Vulnerabilidades**: `npm audit` y actualizar con cuidado (es el repo de Mari).

Nunca se arregla a mano en Webflow lo que el código siembra: se arregla en el snapshot o en el
modelo y se vuelve a sembrar, o se edita en Webflow y se baja. Una sola dirección por cambio.
