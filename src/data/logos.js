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

// Ícono de base de datos SQL (estilo Azure SQL Database).
// No está en los sets de Iconify, así que se vectorizó desde el PNG original
// y se guarda aquí como texto SVG (capas de color + degradado azul del cuerpo).
export const svgSqlDatabase = '<svg xmlns="http://www.w3.org/2000/svg" height="36" aria-hidden="true" viewBox="0 0 364 484"><defs><linearGradient id="sqlg" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#005BA1"/><stop offset=".5" stop-color="#0078D4"/><stop offset="1" stop-color="#005BA1"/></linearGradient></defs><path fill="url(#sqlg)" fill-rule="evenodd" d="M155 483C78 479 17 457 3 430L-0 424L0 242L0 60L2 55C10 38 32 25 68 14C88 9 105 6 136 2C154 0 207 -0 224 2C282 8 322 19 345 37C354 43 358 48 362 55L364 60L364 242L364 424L362 429C354 445 332 459 296 469C258 480 204 486 155 483Z"/><path fill="#E8E8E8" fill-rule="evenodd" d="M151 131C99 128 48 115 22 98C-6 80 -8 56 18 37C50 14 108 1 182 1C210 1 222 1 244 4C328 15 377 46 361 78C348 105 290 125 216 131C204 132 165 132 151 131ZM234 101C288 93 322 78 322 61C322 43 287 28 230 21C210 19 154 19 133 21C59 30 24 54 52 76C66 87 98 97 136 101C155 103 218 103 234 101Z"/><path fill="#50E6FF" fill-rule="evenodd" d="M62 82C9 55 66 22 170 19C255 17 326 38 322 64C320 69 312 77 302 82C292 87 294 87 282 83C253 75 227 72 182 72C136 72 119 74 74 86C72 87 68 85 62 82Z"/><path fill="#198AB3" fill-rule="evenodd" d="M154 102C130 101 110 98 92 93C76 89 72 87 74 87C95 80 116 76 138 73C157 71 207 71 228 73C249 76 276 81 288 85L292 87L284 89C262 96 239 100 214 102C204 103 165 103 154 102Z"/><path fill="#F2F2F2" fill-rule="evenodd" d="M199 347C188 334 186 332 183 332C178 332 166 328 159 324C122 302 124 239 162 220C175 214 192 212 205 216C224 220 238 235 245 257C254 285 240 317 216 327C213 328 212 329 212 330C212 330 219 338 228 346L245 361L228 361L211 361L199 347ZM62 332C58 331 53 329 51 329L47 327L47 314C47 308 47 302 48 302C48 302 50 303 52 305C66 315 89 316 94 306C99 298 94 292 75 282C59 274 53 269 49 261C44 250 45 236 52 228C55 223 65 217 71 215C82 211 103 212 113 216L116 217L116 228C116 235 116 240 116 240C115 240 112 239 109 237C103 234 101 234 92 233C78 233 72 236 72 245C72 252 75 255 90 263C112 275 119 283 120 298C120 309 119 314 115 320C106 332 81 337 62 332ZM268 272L268 214L280 214L293 214L293 262L293 311L315 311L337 311L337 321L337 331L302 331L268 331L268 272ZM200 309C218 300 224 273 215 250C209 239 202 234 190 234C169 234 158 249 159 275C160 288 163 296 170 303C178 311 191 313 200 309Z"/></svg>';
