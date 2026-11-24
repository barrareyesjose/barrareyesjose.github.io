# barrareyesjose.github.io

Portafolio de análisis de datos y business intelligence de José Barra.
Sitio estático hecho con [Astro](https://astro.build) y publicado en GitHub Pages.

**Sitio:** https://barrareyesjose.github.io

## Estructura

```
src/
├── pages/
│   ├── index.astro              # Portada (hero + proyectos + stack + contacto)
│   └── proyectos/
│       ├── index.astro          # Listado de proyectos
│       └── [id].astro           # Plantilla de cada caso de estudio
├── content/proyectos/           # ← Un archivo .md por proyecto
├── components/
│   ├── FloatingBackground.astro # Fondo animado de la portada (bases de datos, carpetas y archivos)
│   ├── ProjectCard.astro        # Tarjeta de proyecto
│   ├── Header.astro / Footer.astro
├── scripts/
│   └── reveal.js                # Aparición de secciones y barra de progreso
├── data/site.js                 # Datos de contacto (email, LinkedIn, GitHub)
└── styles/global.css            # Colores, tipografías y estilos compartidos
```



Cuando compres el dominio (por ejemplo `josebarra.cl`):

1. Crea `public/CNAME` con una sola línea: `josebarra.cl`
2. Cambia `site` en `astro.config.mjs` a `https://josebarra.cl`
3. Configura el DNS según la [guía de GitHub Pages](https://docs.github.com/es/pages/configuring-a-custom-domain-for-your-github-pages-site).
