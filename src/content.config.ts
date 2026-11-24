// src/content.config.ts
// Define la "colección" de proyectos del portafolio.
//
// Cada proyecto es un archivo Markdown dentro de src/content/proyectos/.
// Para agregar un proyecto nuevo basta con crear otro archivo .md con el
// mismo encabezado (frontmatter): Astro genera su página automáticamente
// en /proyectos/<nombre-del-archivo>/ y lo agrega al listado.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const proyectos = defineCollection({
  // Lee todos los .md de la carpeta (los que empiezan con "_" se ignoran,
  // útil para borradores).
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/proyectos' }),

  // Esquema: valida que cada proyecto tenga los campos necesarios.
  // Si falta alguno, la compilación falla con un mensaje claro.
  schema: z.object({
    titulo: z.string(),                 // Nombre del proyecto
    resumen: z.string(),                // Una o dos frases para la tarjeta
    orden: z.number().default(99),      // Orden en el listado (menor = primero)
    etiquetas: z.array(z.string()),     // Herramientas / temas
    metricas: z                          // Cifras destacadas (máx. 3 recomendado)
      .array(z.object({ valor: z.string(), etiqueta: z.string() }))
      .default([]),
    repositorio: z.string().url().optional(), // Link a GitHub (opcional)
    estado: z.string().optional(),            // Ej.: "En desarrollo"
  }),
});

export const collections = { proyectos };
