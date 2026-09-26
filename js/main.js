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

  const sidebarLinks = document.querySelectorAll('#sidebar a, .sidebar a');
  sidebarLinks.forEach((link) => {
    link.addEventListener('click', () => {
      cerrarSidebar();
    });
  });

  // --- 2. Control del Menú Desplegable de Perfil / Usuario ---
  const btnPerfil = document.getElementById('btn-perfil');
  const menuPerfil = document.getElementById('menu-perfil');

  function toggleMenuPerfil(e) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (!menuPerfil || !btnPerfil) return;

    const estaAbierto = menuPerfil.classList.contains('abierto');
    if (estaAbierto) {
      cerrarMenuPerfil();
    } else {
      abrirMenuPerfil();
    }
  }

  function abrirMenuPerfil() {
    if (!menuPerfil || !btnPerfil) return;
    menuPerfil.classList.add('abierto');
    btnPerfil.classList.add('activo');
    btnPerfil.setAttribute('aria-expanded', 'true');
  }

  function cerrarMenuPerfil() {
    if (!menuPerfil || !btnPerfil) return;
    menuPerfil.classList.remove('abierto');
    btnPerfil.classList.remove('activo');
    btnPerfil.setAttribute('aria-expanded', 'false');
  }

  if (btnPerfil) {
    btnPerfil.addEventListener('click', toggleMenuPerfil);
  }

  // Cerrar al clickear fuera del menú
  document.addEventListener('click', (e) => {
    if (menuPerfil && menuPerfil.classList.contains('abierto')) {
      if (!menuPerfil.contains(e.target) && !btnPerfil.contains(e.target)) {
        cerrarMenuPerfil();
      }
    }
  });

  // Cerrar al presionar la tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuPerfil && menuPerfil.classList.contains('abierto')) {
      cerrarMenuPerfil();
      btnPerfil.focus();
    }
  });

  // Opciones de demo: Editar Perfil y Biblioteca cierran el dropdown
  const menuPerfilEnlaces = document.querySelectorAll('.menu-desplegable-perfil a:not(:last-child)');
  menuPerfilEnlaces.forEach((enlace) => {
    enlace.addEventListener('click', (e) => {
      e.preventDefault();
      cerrarMenuPerfil();
    });
  });

  // --- 3. Rotación de Juegos en el Tríptico del Hero ---
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
    },
    {
      nombre: 'Cyber Strike',
      fotoIzq: 'assets/images/game_combat_1.jpg',
      fotoCentro: 'assets/images/game_scifi_2.jpg',
      fotoDer: 'assets/images/game_solitaire_1.jpg',
      enlace: 'game.html'
    },
    {
      nombre: 'Medieval Quest',
      fotoIzq: 'assets/images/peg_solitaire_hero.jpg',
      fotoCentro: 'assets/images/game_flight_1.jpg',
      fotoDer: 'assets/images/game_racing_1.jpg',
      enlace: 'game.html'
    }
  ];

  let heroIndex = 0;
  const heroBtnAnt = document.getElementById('hero-btn-ant');
  const heroBtnSig = document.getElementById('hero-btn-sig');
  const heroTriptico = document.querySelector('.hero-triptico');
  const heroNombre = document.querySelector('.hero-triptico h3');
  const heroFotoCentral = document.querySelector('.hero-triptico > a');
  const heroFotoCentralImg = document.querySelector('.hero-triptico > a > img');
  const heroFotoIzqImg = document.querySelector('.hero-triptico > div:first-child img');
  const heroFotoDerImg = document.querySelector('.hero-triptico > div:last-child img');

  function actualizarHero(index) {
    const juego = heroJuegos[index];
    if (!juego) return;

    if (heroTriptico) {
      heroTriptico.classList.add('hero-transicion');
      
      setTimeout(() => {
        if (heroNombre) heroNombre.textContent = juego.nombre;
        if (heroFotoCentral) heroFotoCentral.href = juego.enlace;
        if (heroFotoCentralImg) heroFotoCentralImg.src = juego.fotoCentro;
        if (heroFotoIzqImg) heroFotoIzqImg.src = juego.fotoIzq;
        if (heroFotoDerImg) heroFotoDerImg.src = juego.fotoDer;
        
        heroTriptico.classList.remove('hero-transicion');
      }, 400);
    } else {
      if (heroNombre) heroNombre.textContent = juego.nombre;
      if (heroFotoCentral) heroFotoCentral.href = juego.enlace;
      if (heroFotoCentralImg) heroFotoCentralImg.src = juego.fotoCentro;
      if (heroFotoIzqImg) heroFotoIzqImg.src = juego.fotoIzq;
      if (heroFotoDerImg) heroFotoDerImg.src = juego.fotoDer;
    }
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

  // --- 4. Interacción de Comentarios en Sala de Juego ---
  const formNuevoComentario = document.getElementById('form-nuevo-comentario');
  const inputComentario = document.getElementById('input-comentario');
  const listaComentarios = document.getElementById('lista-comentarios');

  function publicarComentario() {
    if (!inputComentario || !listaComentarios) return;
    const texto = inputComentario.value.trim();
    if (!texto) return;

    const hoy = new Date();
    const dia = String(hoy.getDate()).padStart(2, '0');
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const anio = hoy.getFullYear();
    const horas = String(hoy.getHours()).padStart(2, '0');
    const mins = String(hoy.getMinutes()).padStart(2, '0');
    const fechaHora = `${dia}/${mes}/${anio} ${horas}:${mins}`;

    const nuevoItem = document.createElement('article');
    nuevoItem.className = 'comentario-item';
    nuevoItem.innerHTML = `
      <div>
        <img src="assets/icons/icon-profile.svg" alt="Esteban">
      </div>
      <div>
        <header>
          <strong>Esteban</strong>
          <time>${fechaHora}</time>
        </header>
        <p>${texto.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
      </div>
    `;

    listaComentarios.prepend(nuevoItem);
    inputComentario.value = '';
  }

  if (formNuevoComentario) {
    formNuevoComentario.addEventListener('submit', (e) => {
      e.preventDefault();
      publicarComentario();
    });

    const btnEnviar = formNuevoComentario.querySelector('button');
    if (btnEnviar) {
      btnEnviar.addEventListener('click', publicarComentario);
    }
  }
});

