// astro.config.mjs
// Configuración principal de Astro para el portafolio.
//
// `site` es la URL pública final del sitio. Astro la usa para generar
// URLs absolutas (por ejemplo en etiquetas Open Graph o el sitemap).
// Cuando compres tu dominio propio (por ejemplo https://josebarra.cl),
// solo cambia este valor y agrega el archivo public/CNAME.
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://barrareyesjose.github.io',
  // Como es un "sitio de usuario" (usuario.github.io), se publica en la raíz:
  // no hace falta configurar `base`.
});
