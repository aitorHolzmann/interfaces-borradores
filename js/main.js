/* ==========================================================================
   INTERACTIVIDAD GLOBAL — MAIN.JS
   - Control del menú lateral (Sidebar / Hamburguesa)
   - Controles de desplazamiento horizontal en carruseles
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Control del Sidebar Móvil y Desktop ---
  const btnToggleSidebar = document.getElementById('btn-toggle-sidebar');
  const btnCerrarSidebar = document.getElementById('btn-cerrar-sidebar');
  const sidebar = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebar-overlay');

  function abrirSidebar() {
    if (sidebar && sidebarOverlay) {
      sidebar.classList.add('abierto');
      sidebarOverlay.classList.add('activo');
      document.body.style.overflow = 'hidden'; // Evitar scroll de fondo
    }
  }

  function cerrarSidebar() {
    if (sidebar && sidebarOverlay) {
      sidebar.classList.remove('abierto');
      sidebarOverlay.classList.remove('activo');
      document.body.style.overflow = '';
    }
  }

  if (btnToggleSidebar) {
    btnToggleSidebar.addEventListener('click', abrirSidebar);
  }

  if (btnCerrarSidebar) {
    btnCerrarSidebar.addEventListener('click', cerrarSidebar);
  }

  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', cerrarSidebar);
  }

  // Cerrar sidebar al clickear un enlace interno
  const sidebarLinks = document.querySelectorAll('.sidebar-item a');
  sidebarLinks.forEach((link) => {
    link.addEventListener('click', () => {
      cerrarSidebar();
    });
  });

  // --- 2. Controles de Desplazamiento Horizontal de Carruseles ---
  const botonesCarruselNav = document.querySelectorAll('.btn-carrusel-nav');
  botonesCarruselNav.forEach((boton) => {
    boton.addEventListener('click', () => {
      const targetId = boton.getAttribute('data-target');
      const carrusel = document.getElementById(targetId);
      if (!carrusel) return;

      const cardWidth = 260; // Ancho promedio de card + gap
      const esSiguiente = boton.classList.contains('btn-sig');
      const desplazamiento = esSiguiente ? cardWidth * 2 : -cardWidth * 2;

      carrusel.scrollBy({
        left: desplazamiento,
        behavior: 'smooth'
      });
    });
  });

  // --- 3. Guardar en Favoritos (Feedback Visual) ---
  const botonesGuardar = document.querySelectorAll('.btn-guardar-card');
  botonesGuardar.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const img = btn.querySelector('img');
      const esGuardado = btn.classList.toggle('activo');
      
      if (esGuardado) {
        btn.style.backgroundColor = 'var(--color-acento)';
        if (img) img.src = 'assets/icons/icon-saved.svg';
      } else {
        btn.style.backgroundColor = '';
        if (img) img.src = 'assets/icons/icon-save.svg';
      }
    });
  });
});

