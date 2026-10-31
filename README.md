# LEX Oaxaca

Página informativa de derechos y trámites en lenguaje sencillo para Oaxaca. Funciona sin internet después de la primera visita.

## Publicar en GitHub Pages
1. Sube todos los archivos a un repositorio.
2. Settings > Pages > Deploy from a branch > `main` / root.
3. En `app.js` cambia `TU_USUARIO/TU_REPO` por tu repositorio (botón "Reportar un error").

## Contenido
- `data.js`: temas, leyes, directorio y sinónimos. Cada tema con campo `revisado` está verificado; `revisado: null` = por verificar.
- Para verificar un tema: confirma artículos, plazos y teléfonos en fuente oficial, y escribe la fecha en `revisado`.
- Cada vez que cambies archivos, sube el número de versión `V` en `sw.js`.

Información general, no es asesoría legal.
