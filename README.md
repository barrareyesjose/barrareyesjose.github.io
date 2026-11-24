# barrareyesjose.github.io

Portafolio de análisis de datos y business intelligence de José Barra.
Sitio estático hecho con [Astro](https://astro.build) y publicado en GitHub Pages.

**Sitio:** https://barrareyesjose.github.io

## Estructura

```
src/
├── pages/
│   ├── index.astro              # Portada (hero + animación + proyectos + stack + contacto)
│   └── proyectos/
│       ├── index.astro          # Listado de proyectos
│       └── [id].astro           # Plantilla de cada caso de estudio
├── content/proyectos/           # ← Un archivo .md por proyecto
├── components/
│   ├── ScrollStory.astro        # HTML/CSS de la animación "del dato al insight"
│   ├── ProjectCard.astro        # Tarjeta de proyecto
│   ├── Header.astro / Footer.astro
├── scripts/
│   ├── scroll-story.js          # Lógica de la animación (controlada por el scroll)
│   └── reveal.js                # Aparición de secciones y barra de progreso
├── data/site.js                 # Datos de contacto (email, LinkedIn, GitHub)
└── styles/global.css            # Colores, tipografías y estilos compartidos
```

## Agregar un proyecto

1. Crea `src/content/proyectos/mi-proyecto.md` copiando el encabezado de uno existente.
2. Escribe el caso de estudio en Markdown (contexto → problema → datos → análisis → hallazgos).
3. Sube el cambio a `main`. GitHub Actions publica el sitio solo en 1–2 minutos.

La página queda en `/proyectos/mi-proyecto/`.

## Trabajar en local

Requiere Node.js 22.23 o superior.

```bash
npm install
npm run dev      # servidor local en http://localhost:4321
npm run build    # genera el sitio en dist/
```
