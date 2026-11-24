// src/scripts/scroll-story.js
// Lógica de la animación "del dato al insight" (ver ScrollStory.astro).
//
// Idea central: todo depende de un solo número P entre 0 y 1, que indica
// cuánto se ha avanzado dentro de la sección. Cada pieza tiene "ventanas"
// de tiempo (por ejemplo, de P=0.13 a P=0.29) en las que se mueve de un
// punto a otro. Así la animación es reversible: si subes, se rearma.
//
// Línea de tiempo aproximada:
//   0.00–0.17  la base tiembla
//   0.11–0.30  los discos se separan y la base desaparece
//   0.13–0.29  los fragmentos salen disparados
//   0.29–0.46  los fragmentos se ordenan como celdas de 3 tablas
//   0.50–0.60  las celdas son absorbidas por 8 archivos
//   0.56–0.78  los archivos orbitan y fluyen datos hacia la consulta
//   0.76–0.86  los archivos convergen en la consulta
//   0.86–0.99  aparecen los 4 insights y sus cifras cuentan hacia arriba

const story = document.querySelector('[data-story]');

if (story) {
  // ---------- Referencias a los elementos ----------
  const $ = (sel) => Array.from(story.querySelectorAll(sel));
  const stage = story.querySelector('.stage');
  const disks = $('[data-disk]');
  const leds = $('[data-led]');
  const shadow = story.querySelector('[data-shadow]');
  const dbLabel = story.querySelector('[data-dblabel]');
  const tables = $('[data-table]');
  const particles = $('[data-particle]');
  const files = $('[data-file]');
  const lines = $('[data-line]');
  const linesSvg = story.querySelector('[data-lines]');
  const node = story.querySelector('[data-node]');
  const insights = $('[data-insight]');
  const aucEl = story.querySelector('[data-auc]');
  const ticketsEl = story.querySelector('[data-tickets]');
  const pillars = $('[data-pillar]');
  const nbLine = story.querySelector('[data-nb-line]');
  const nbItems = $('[data-nb]');
  const hint = story.querySelector('[data-hint]');
  const end = story.querySelector('[data-end]');
  const capNum = story.querySelector('[data-cap-num]');
  const capTitle = story.querySelector('[data-cap-title]');
  const capText = story.querySelector('[data-cap-text]');
  const steps = $('[data-step]');
  const stepFills = $('[data-step-fill]');

  // ---------- Utilidades matemáticas ----------
  const clamp = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
  const lerp = (a, b, t) => a + (b - a) * t; // interpolación lineal
  // Suavizado "ease in-out cúbico": arranca y termina lento
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  // Pseudo-aleatorio determinista: mismo valor para la misma partícula
  // (así la explosión es siempre igual y reversible)
  const hash = (i, n) => {
    const x = Math.sin(i * 12.9898 + n * 78.233) * 43758.5453;
    return x - Math.floor(x);
  };

  // Color de acento leído desde CSS (por si lo cambias en global.css)
  const hexToRgb = (h) => {
    h = h.trim().replace('#', '');
    if (h.length === 3) h = h.split('').map((c) => c + c).join('');
    const n = parseInt(h, 16);
    return Number.isNaN(n) ? [92, 200, 255] : [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };
  const ACCENT = hexToRgb(getComputedStyle(document.documentElement).getPropertyValue('--accent') || '#5CC8FF');
  const CELL = [52, 70, 90]; // color de una celda ya ordenada en su tabla
  const mixColor = (t) =>
    `rgb(${Math.round(lerp(ACCENT[0], CELL[0], t))},${Math.round(lerp(ACCENT[1], CELL[1], t))},${Math.round(lerp(ACCENT[2], CELL[2], t))})`;

  // ¿El usuario pidió reducir el movimiento? Entonces no hay temblor.
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Textos de cada etapa ----------
  const fases = [
    { num: '01 — La fuente', title: 'Todo empieza en una base de datos.', text: 'Millones de registros sin contexto. Antes de analizar, hay que desarmarla.' },
    { num: '02 — Modelar', title: 'Se desmenuza y se reordena en tablas.', text: 'Cada fragmento encuentra su lugar: hechos y dimensiones en un modelo estrella limpio.' },
    { num: '03 — Analizar', title: 'Las tablas se vuelven trabajo concreto.', text: 'Consultas SQL, modelos de Power BI y notebooks de Python que convergen en una sola pregunta.' },
    { num: '04 — Comunicar', title: 'El resultado no son archivos: son insights.', text: 'Indicadores claros que alguien puede usar mañana para decidir.' },
  ];
  const limites = [0, 0.27, 0.5, 0.84, 1]; // dónde empieza cada etapa
  let faseActual = -1;

  // ---------- Datos fijos de cada fragmento (se calculan una vez) ----------
  const datosParticulas = particles.map((_, i) => {
    const tabla = i % 3;                  // a qué tabla va (0, 1 o 2)
    const celda = Math.floor(i / 3);      // posición dentro de la tabla (0–19)
    const col = celda % 4, fila = Math.floor(celda / 4);
    const ang = hash(i, 4) * Math.PI * 2; // dirección de la explosión
    const rad = 170 + hash(i, 5) * 330;   // distancia de la explosión
    return {
      d: hash(i, 1) * 0.05,               // pequeño desfase para que no se muevan todas juntas
      x0: (hash(i, 2) - 0.5) * 190, y0: (hash(i, 3) - 0.5) * 110,  // dentro de la base
      x1: Math.cos(ang) * rad * 1.25, y1: Math.sin(ang) * rad * 0.5, // explosión
      r1: (hash(i, 6) - 0.5) * 540,                                   // giro durante la explosión
      x2: (tabla - 1) * 330 - 105 + col * 70, y2: -26 + fila * 24 + 18, // celda de la tabla
      header: fila === 0,                 // la primera fila queda un poco más clara
      archivo: i % 8,                     // archivo que la absorbe
    };
  });

  // ---------- Bucle de dibujo ----------
  let K = 1;          // escala según el ancho de pantalla (en móvil todo se achica)
  let KI = 1;         // escala propia de los insights (en móvil van en grilla 2×2)
  let compacto = false; // true en pantallas angostas
  let pendiente = false;

  // Construye el transform de una pieza: centrada y desplazada (x, y).
  // `k` permite usar otra escala (los insights usan KI).
  const T = (x, y, s, r = 0, k = K) =>
    `translate(-50%, -50%) translate(${(x * k).toFixed(1)}px, ${(y * k).toFixed(1)}px) scale(${Math.max(0.001, s * k).toFixed(3)}) rotate(${r.toFixed(1)}deg)`;

  function medir() {
    const ancho = stage.offsetWidth;
    K = Math.max(0.38, Math.min(1, (ancho - 24) / 1180));
    // En pantallas angostas los 4 insights se ordenan en 2×2 y se ven más grandes
    compacto = ancho < 760;
    KI = compacto ? Math.min(1, (ancho - 24) / 540) : K;
    linesSvg.style.width = 1200 * K + 'px';
    linesSvg.style.height = 640 * K + 'px';
  }

  function dibujar() {
    pendiente = false;

    // Avance P dentro de la sección (0 al entrar, 1 al terminar el recorrido)
    const headerH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 70;
    const r = story.getBoundingClientRect();
    const recorrido = r.height - stage.offsetHeight;
    const P = recorrido > 0 ? clamp((headerH - r.top) / recorrido) : 0;

    // Solo se dibuja si la sección está cerca de la pantalla (ahorra batería)
    if (r.bottom < -200 || r.top > window.innerHeight + 200) return;

    const seg = (a, b) => clamp((P - a) / (b - a)); // avance dentro de una ventana [a, b]

    // Fondo: la cuadrícula se desplaza lento (efecto parallax)
    stage.style.backgroundPosition = `0 ${(-P * 480).toFixed(1)}px`;

    // ----- 1. Base de datos -----
    const temblor = reduceMotion ? 0 : seg(0.05, 0.13) * (1 - seg(0.13, 0.17));
    const separa = ease(seg(0.11, 0.25));
    const desaparece = ease(seg(0.2, 0.3));
    disks.forEach((el) => {
      const i = Number(el.dataset.disk);
      const base = -56 + i * 30;
      const jx = Math.sin(P * 900 + i * 1.7) * 6 * temblor;
      const x = jx + separa * (i % 2 ? 46 : -46);
      const y = base + separa * (i - 1.5) * 74;
      el.style.transform = T(x, y, 1 + 0.08 * separa, separa * (i - 1.5) * -7);
      el.style.opacity = 1 - desaparece;
    });
    // "Luces" de actividad que se encienden por turnos
    const luz = Math.floor(P * 400) % 4;
    leds.forEach((el, k) => el.classList.toggle('on', k === luz && P < 0.2));
    shadow.style.transform = T(0, 74, 1 + separa * 0.4);
    shadow.style.opacity = 1 - desaparece;
    dbLabel.style.transform = T(0, 150, 1);
    dbLabel.style.opacity = 1 - ease(seg(0.03, 0.1));

    // ----- 2. Marcos de las tablas -----
    const tIn = ease(seg(0.33, 0.43)), tOut = ease(seg(0.5, 0.57));
    tables.forEach((el, t) => {
      el.style.transform = T((t - 1) * 330, 18, lerp(0.94, 1, tIn) * (1 - 0.06 * tOut));
      el.style.opacity = tIn * (1 - tOut);
    });

    // ----- 3. Posición de los archivos (órbita) -----
    const orbita = ease(seg(0.56, 0.78)) * 0.7;
    const posArchivos = files.map((_, f) => {
      const a = (f / files.length) * Math.PI * 2 - Math.PI / 2 + orbita;
      return { x: Math.cos(a) * 440, y: Math.sin(a) * 190 + 10 };
    });

    // ----- Fragmentos: base → explosión → celda → archivo -----
    particles.forEach((el, i) => {
      const p = datosParticulas[i];
      const e = ease(seg(0.13 + p.d, 0.29 + p.d));             // explosión
      const g = ease(seg(0.29 + p.d * 0.6, 0.43 + p.d * 0.6)); // ordenarse en la tabla
      const h = ease(seg(0.5 + p.d, 0.59 + p.d));              // absorción por el archivo
      const dest = posArchivos[p.archivo];
      const x = lerp(lerp(lerp(p.x0, p.x1, e), p.x2, g), dest.x, h);
      const y = lerp(lerp(lerp(p.y0, p.y1, e), p.y2, g), dest.y, h);
      const s = lerp(lerp(lerp(0.2, 0.42, e), 1, g), 0.12, h);
      const rot = lerp(lerp(lerp(0, p.r1, e), 0, g), 90, h);
      el.style.transform = T(x, y, s, rot);
      el.style.opacity = seg(0.13 + p.d, 0.17 + p.d) * (1 - seg(0.56 + p.d, 0.6 + p.d));
      // En vuelo son color acento; al ordenarse toman color de celda
      const c = Math.max(0, g - h);
      el.style.background = mixColor(p.header ? c * 0.55 : c);
    });

    // ----- Archivos -----
    const crece = ease(seg(0.52, 0.6));
    files.forEach((el, f) => {
      const conv = ease(seg(0.76 + f * 0.006, 0.83 + f * 0.006)); // viajan a la consulta
      const x = lerp(posArchivos[f].x, 0, conv);
      const y = lerp(posArchivos[f].y, 0, conv);
      el.style.transform = T(x, y, lerp(0.55, 1, crece) * lerp(1, 0.2, conv), (f % 2 ? -4 : 4) * crece * (1 - conv));
      el.style.opacity = seg(0.52, 0.58) * (1 - seg(0.81 + f * 0.006, 0.84 + f * 0.006));
    });

    // Líneas de flujo: siguen a cada archivo y "corren" con el scroll
    lines.forEach((ln, f) => {
      ln.setAttribute('x2', posArchivos[f].x.toFixed(1));
      ln.setAttribute('y2', posArchivos[f].y.toFixed(1));
      ln.style.strokeDashoffset = (-P * 1400).toFixed(1);
    });
    linesSvg.style.opacity = seg(0.6, 0.66) * (1 - seg(0.75, 0.8));

    // ----- Consulta central (late al absorber los archivos) -----
    const nodeIn = ease(seg(0.6, 0.67));
    const pulso = Math.sin(seg(0.77, 0.87) * Math.PI);
    node.style.transform = T(0, 10, lerp(0.6, 1, nodeIn) * (1 + 0.18 * pulso));
    node.style.opacity = nodeIn * (1 - seg(0.86, 0.9));

    // ----- 4. Insights -----
    insights.forEach((el, q) => {
      const t = ease(seg(0.86 + q * 0.012, 0.95 + q * 0.008));
      // Posición final: en fila (escritorio) o en grilla 2×2 (móvil)
      const fx = compacto ? ((q % 2) - 0.5) * 256 : (q - 1.5) * 272;
      const fy = compacto ? (Math.floor(q / 2) - 0.5) * 196 + 10 : 20;
      el.style.transform = T(lerp(0, fx, t), lerp(10, fy, t), lerp(0.3, 1, t), 0, KI);
      el.style.opacity = seg(0.86 + q * 0.012, 0.9 + q * 0.012);
    });
    // Contadores que suben desde 0
    const cuenta = ease(seg(0.88, 0.98));
    aucEl.textContent = (0.733 * cuenta).toFixed(3).replace('.', ',');
    const tickets = Math.round((70000 * cuenta) / 100) * 100;
    ticketsEl.textContent = '~' + tickets.toLocaleString('es-CL');
    // Barras de los 5 pilares
    const barras = ease(seg(0.9, 0.99));
    pillars.forEach((el, i) => (el.style.height = (4 + 62 * clamp(barras * 1.5 - i * 0.12)).toFixed(1) + 'px'));
    // Notebooks que se encienden en secuencia
    const nb = seg(0.9, 0.99);
    nbLine.style.width = `calc((100% - 16px) * ${nb.toFixed(3)})`;
    nbItems.forEach((el, i) => el.classList.toggle('on', P > 0.9 && nb >= i / 3 - 0.001));

    hint.style.opacity = 1 - seg(0.8, 0.88);
    end.style.opacity = seg(0.96, 0.995);

    // ----- Textos e indicador de etapas -----
    const fase = P < limites[1] ? 0 : P < limites[2] ? 1 : P < limites[3] ? 2 : 3;
    if (fase !== faseActual) {
      faseActual = fase;
      capNum.textContent = fases[fase].num;
      capTitle.textContent = fases[fase].title;
      capText.textContent = fases[fase].text;
      steps.forEach((el, i) => el.classList.toggle('is-current', i === fase));
    }
    stepFills.forEach((el, i) => {
      el.style.width = (clamp((P - limites[i]) / (limites[i + 1] - limites[i])) * 100).toFixed(1) + '%';
    });
  }

  // Pide un nuevo cuadro solo si no hay uno pendiente (máx. 1 cálculo por cuadro)
  const pedirCuadro = () => {
    if (!pendiente) {
      pendiente = true;
      requestAnimationFrame(dibujar);
    }
  };

  window.addEventListener('scroll', pedirCuadro, { passive: true });
  window.addEventListener('resize', () => {
    medir();
    pedirCuadro();
  });

  medir();
  dibujar();
}
