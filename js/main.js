/* ==========================================================================
   INTERACTIVIDAD GLOBAL — MAIN.JS
   - Control del menú lateral (Sidebar / Hamburguesa)
   - Controles de navegación en el tríptico del Hero
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
      document.body.style.overflow = 'hidden';
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

  const sidebarLinks = document.querySelectorAll('.sidebar-item a');
  sidebarLinks.forEach((link) => {
    link.addEventListener('click', () => {
      cerrarSidebar();
    });
  });

  // --- 2. Rotación de Juegos en el Tríptico del Hero ---
  const heroJuegos = [
    {
      nombre: 'Peg Solitaire',
      fotoIzq: 'assets/images/game_solitaire_1.jpg',
      fotoCentro: 'assets/images/peg_solitaire_hero.jpg',
      fotoDer: 'assets/images/game_scifi_2.jpg',
      enlace: 'game.html'
    },
    {
      nombre: 'Velocity',
      fotoIzq: 'assets/images/game_flight_1.jpg',
      fotoCentro: 'assets/images/game_racing_1.jpg',
      fotoDer: 'assets/images/game_combat_1.jpg',
      enlace: 'game.html'
    }
  ];

  let heroIndex = 0;
  const heroBtnAnt = document.getElementById('hero-btn-ant');
  const heroBtnSig = document.getElementById('hero-btn-sig');
  const heroNombre = document.querySelector('.hero-juego-nombre');
  const heroFotoCentral = document.querySelector('.hero-foto-central');
  const heroFotoCentralImg = document.querySelector('.hero-foto-central img');
  const heroFotoIzqImg = document.querySelector('.hero-foto-lateral:first-child img');
  const heroFotoDerImg = document.querySelector('.hero-foto-lateral:last-child img');

  function actualizarHero(index) {
    const juego = heroJuegos[index];
    if (!juego) return;

    if (heroNombre) heroNombre.textContent = juego.nombre;
    if (heroFotoCentral) heroFotoCentral.href = juego.enlace;
    if (heroFotoCentralImg) heroFotoCentralImg.src = juego.fotoCentro;
    if (heroFotoIzqImg) heroFotoIzqImg.src = juego.fotoIzq;
    if (heroFotoDerImg) heroFotoDerImg.src = juego.fotoDer;
  }

  if (heroBtnAnt) {
    heroBtnAnt.addEventListener('click', () => {
      heroIndex = (heroIndex - 1 + heroJuegos.length) % heroJuegos.length;
      actualizarHero(heroIndex);
    });
  }

  if (heroBtnSig) {
    heroBtnSig.addEventListener('click', () => {
      heroIndex = (heroIndex + 1) % heroJuegos.length;
      actualizarHero(heroIndex);
    });
  }

  // --- 3. Publicación interactiva de comentario (Ficha de Juego) ---
  const formNuevoComentario = document.getElementById('form-nuevo-comentario');
  const inputComentario = document.getElementById('input-comentario');
  const listaComentarios = document.getElementById('lista-comentarios');

  if (formNuevoComentario && inputComentario && listaComentarios) {
    formNuevoComentario.addEventListener('submit', (e) => {
      e.preventDefault();
      const texto = inputComentario.value.trim();
      if (!texto) return;

      const nuevoArticulo = document.createElement('article');
      nuevoArticulo.className = 'comentario-fila-item';
      nuevoArticulo.innerHTML = `
        <div class="comentario-item-avatar">
          <img src="assets/icons/icon-profile.svg" alt="Esteban">
        </div>
        <div class="comentario-item-contenido">
          <span class="comentario-item-usuario">Esteban</span>
          <p class="comentario-item-texto">${texto}</p>
        </div>
      `;

      listaComentarios.insertBefore(nuevoArticulo, listaComentarios.firstChild);
      inputComentario.value = '';
    });
  }
});
