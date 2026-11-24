// src/scripts/reveal.js
// Dos efectos livianos que se usan en todas las páginas:
//  1. Hace aparecer suavemente los elementos con clase "reveal" cuando entran
//     en pantalla (usa IntersectionObserver, que no consume recursos al hacer scroll).
//  2. Actualiza la barra de progreso del header según cuánto se ha bajado.

// ---------- 1. Aparición de secciones ----------
const elementos = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entradas) => {
      for (const entrada of entradas) {
        if (entrada.isIntersecting) {
          entrada.target.classList.add('is-visible');
          observer.unobserve(entrada.target); // solo se anima una vez
        }
      }
    },
    { rootMargin: '0px 0px -10% 0px' } // se activa un poco antes del borde inferior
  );
  elementos.forEach((el) => observer.observe(el));
} else {
  // Navegadores muy antiguos: se muestra todo sin animación
  elementos.forEach((el) => el.classList.add('is-visible'));
}

// ---------- 2. Barra de progreso de lectura ----------
const barra = document.querySelector('[data-progress]');
let pendiente = false; // evita recalcular más de una vez por cuadro

function actualizarProgreso() {
  pendiente = false;
  const total = document.documentElement.scrollHeight - window.innerHeight;
  const avance = total > 0 ? window.scrollY / total : 0;
  if (barra) barra.style.width = (avance * 100).toFixed(2) + '%';
}

window.addEventListener(
  'scroll',
  () => {
    if (!pendiente) {
      pendiente = true;
      requestAnimationFrame(actualizarProgreso);
    }
  },
  { passive: true } // indica al navegador que no bloquearemos el scroll
);
actualizarProgreso();
