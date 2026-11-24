// src/data/logos.js
// Logos oficiales de las herramientas del stack.
//
// Los SVG vienen de los sets de íconos de Iconify (paquetes @iconify-json/*),
// que se instalan con npm. Al compilar el sitio, Astro lee el ícono y lo
// inserta directamente en el HTML: no hay que guardar archivos de imagen
// ni depender de un servicio externo cuando alguien visita la página.
import logos from '@iconify-json/logos/icons.json';
import vscode from '@iconify-json/vscode-icons/icons.json';
import simple from '@iconify-json/simple-icons/icons.json';

const sets = { logos, 'vscode-icons': vscode, 'simple-icons': simple };

/**
 * Devuelve el código SVG de un ícono.
 * @param {string} set    nombre del set ('logos', 'vscode-icons', 'simple-icons')
 * @param {string} nombre nombre del ícono dentro del set
 * @param {string} [color] color para íconos de un solo color (los de simple-icons)
 */
export function svgLogo(set, nombre, color) {
  const data = sets[set];
  const icono = data.icons[nombre];
  if (!icono) throw new Error(`No existe el ícono ${set}:${nombre}`); // error claro al compilar
  const ancho = icono.width ?? data.width ?? 16;
  const alto = icono.height ?? data.height ?? 16;
  let cuerpo = icono.body;
  if (color) cuerpo = cuerpo.replaceAll('currentColor', color);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${icono.left ?? 0} ${icono.top ?? 0} ${ancho} ${alto}" height="36" aria-hidden="true">${cuerpo}</svg>`;
}
