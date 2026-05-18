# PWA icons

Esta carpeta debe contener los iconos PNG referenciados por `vite-plugin-pwa` en
`vite.config.ts` y por `index.html`:

- `icon-192.png` (192x192, used by `apple-touch-icon` y el manifest)
- `icon-512.png` (512x512, used by el manifest con `purpose: "any maskable"`)

Estos binarios NO se incluyen en el repositorio. El desarrollador debe generarlos
a partir de `frontend/public/favicon.svg` (o de su propio diseno) antes de hacer
build de produccion. Opciones rapidas:

1. Con `librsvg` instalado:

   ```
   cd frontend/public/icons
   rsvg-convert -w 192 -h 192 ../favicon.svg -o icon-192.png
   rsvg-convert -w 512 -h 512 ../favicon.svg -o icon-512.png
   ```

2. Con ImageMagick:

   ```
   magick -background none -density 600 ../favicon.svg -resize 192x192 icon-192.png
   magick -background none -density 600 ../favicon.svg -resize 512x512 icon-512.png
   ```

3. Con cualquier editor (Figma, Inkscape, etc.) exportando los tamanos
   indicados.

Mientras estos archivos no existan, la instalacion como PWA mostrara el icono
por defecto del navegador, pero el build no fallara.
