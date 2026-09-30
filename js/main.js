/* ==========================================================================
   INTERACTIVIDAD GLOBAL — MAIN.JS
   - Control del menú lateral (Sidebar / Hamburguesa)
  - Controles de navegación del carrusel principal 3D
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

  // --- 3. Control del carrusel principal 3D ---
  const carruselPrincipal = document.getElementById('carrusel-principal-3d');
  const contenedorCarruselPrincipal = document.querySelector('.carrusel-principal-contenedor');
  const carruselPrincipalBtnAnt = document.getElementById('carrusel-principal-btn-ant');
  const carruselPrincipalBtnSig = document.getElementById('carrusel-principal-btn-sig');
  let anguloCarruselPrincipal = 0;
  let timerGiroAutomatico = null;
  let timerReanudarAuto = null;
  const prefiereMenosMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)');

  function rotarCarruselManual(direccion) {
    if (!carruselPrincipal) return;

    // Cada cara está separada 120 grados (360 / 3)
    if (direccion === 'sig') {
      anguloCarruselPrincipal -= 120;
    } else {
      anguloCarruselPrincipal += 120;
    }

    carruselPrincipal.style.transform = `rotateY(${anguloCarruselPrincipal}deg)`;
  }

  function pausarGiroAutomatico() {
    clearInterval(timerGiroAutomatico);
    clearTimeout(timerReanudarAuto);
  }

  function iniciarGiroAutomatico() {
    if (!carruselPrincipal || prefiereMenosMovimiento.matches) return;
    if (contenedorCarruselPrincipal.matches(':hover') || contenedorCarruselPrincipal.contains(document.activeElement)) return;

    clearInterval(timerGiroAutomatico);
    timerGiroAutomatico = setInterval(() => rotarCarruselManual('sig'), 4000);
  }

  function manejarGiroManual(direccion) {
    rotarCarruselManual(direccion);
    pausarGiroAutomatico();

    // Dejamos tiempo para inspeccionar la imagen elegida antes de continuar
    timerReanudarAuto = setTimeout(() => {
      iniciarGiroAutomatico();
    }, 8000);
  }

  if (carruselPrincipalBtnSig) {
    carruselPrincipalBtnSig.addEventListener('click', () => manejarGiroManual('sig'));
  }

  if (carruselPrincipalBtnAnt) {
    carruselPrincipalBtnAnt.addEventListener('click', () => manejarGiroManual('ant'));
  }

  if (carruselPrincipal && contenedorCarruselPrincipal) {
    contenedorCarruselPrincipal.addEventListener('mouseenter', pausarGiroAutomatico);
    contenedorCarruselPrincipal.addEventListener('mouseleave', iniciarGiroAutomatico);
    contenedorCarruselPrincipal.addEventListener('focusin', pausarGiroAutomatico);
    contenedorCarruselPrincipal.addEventListener('focusout', () => {
      if (!contenedorCarruselPrincipal.contains(document.activeElement)) iniciarGiroAutomatico();
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        pausarGiroAutomatico();
      } else {
        iniciarGiroAutomatico();
      }
    });

    prefiereMenosMovimiento.addEventListener('change', () => {
      if (prefiereMenosMovimiento.matches) {
        pausarGiroAutomatico();
      } else {
        iniciarGiroAutomatico();
      }
    });

    iniciarGiroAutomatico();
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

  // --- 5. Control del Modal de Compra (Pase de Batalla) ---
  const modalPaseBatalla = document.getElementById('modal-pase-batalla');
  const btnCerrarModal = document.getElementById('btn-cerrar-modal');
  const btnModalComprar = document.getElementById('btn-modal-comprar');

  function abrirModalPaseBatalla() {
    if (!modalPaseBatalla) return;
    modalPaseBatalla.classList.add('activo');
    modalPaseBatalla.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Foco accesible al botón de cierre
    if (btnCerrarModal) {
      btnCerrarModal.focus();
    }
  }

  function cerrarModalPaseBatalla() {
    if (!modalPaseBatalla) return;
    modalPaseBatalla.classList.remove('activo');
    modalPaseBatalla.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    // Si la URL contiene el hash, lo limpiamos sin recargar para anular :target
    if (window.location.hash === '#modal-pase-batalla') {
      history.pushState('', document.title, window.location.pathname + window.location.search);
    }
  }

  // Delegación de eventos para capturar clicks en botones de comprar o cards premium
  document.addEventListener('click', (e) => {
    // Si clickea el botón de comprar de cualquier card
    const btnComprar = e.target.closest('.btn-comprar');
    if (btnComprar) {
      e.preventDefault();
      e.stopPropagation();
      abrirModalPaseBatalla();
      return;
    }

    // Si clickea en cualquier lugar de una card premium
    const cardPremium = e.target.closest('.card-premium') || e.target.closest('#premium .card-juego');
    if (cardPremium) {
      e.preventDefault();
      e.stopPropagation();
      abrirModalPaseBatalla();
      return;
    }

    // Botón de cierre (cruz)
    if (e.target.closest('#btn-cerrar-modal') || e.target.closest('.modal-btn-cerrar')) {
      cerrarModalPaseBatalla();
      return;
    }

    // Clic fuera de la caja (sobre el backdrop oscuro)
    if (e.target === modalPaseBatalla) {
      cerrarModalPaseBatalla();
      return;
    }
  });

  // Cerrar modal al presionar la tecla Escape (heurística de libertad y control)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalPaseBatalla && modalPaseBatalla.classList.contains('activo')) {
      cerrarModalPaseBatalla();
    }
  });

  // Acción de compra dentro del modal (feedback visual en menos de 400ms)
  if (btnModalComprar) {
    btnModalComprar.addEventListener('click', () => {
      const textoOriginal = btnModalComprar.textContent;
      btnModalComprar.textContent = '¡Comprado!';
      btnModalComprar.style.backgroundColor = 'var(--color-exito)';

      setTimeout(() => {
        cerrarModalPaseBatalla();
        btnModalComprar.textContent = textoOriginal;
        btnModalComprar.style.backgroundColor = '';
      }, 1100);
    });
  }

  // --- 6. Carga dinámica de ficha de juego en game.html (Integración API v2) ---
  const paramsUrl = new URLSearchParams(window.location.search);
  const juegoIdParam = paramsUrl.get('id');

  if (juegoIdParam && typeof obtenerJuegoPorId === 'function') {
    obtenerJuegoPorId(juegoIdParam).then((juego) => {
      if (!juego) return;

      // 1. Actualizar título de la página
      document.title = `${juego.name} — Sala de Juego`;

      // 2. Actualizar breadcrumb y barra de ejecución
      const breadcrumbTitulo = document.getElementById('game-breadcrumb-titulo');
      const barraTitulo = document.getElementById('game-barra-titulo');
      if (breadcrumbTitulo) breadcrumbTitulo.textContent = juego.name;
      if (barraTitulo) barraTitulo.textContent = juego.name;

      // 3. Actualizar portada de fondo de la pantalla de juego
      const splashPantalla = document.getElementById('game-splash-pantalla');
      const imagenFondo = juego.background_image || juego.background_image_low_res;
      if (splashPantalla && imagenFondo) {
        splashPantalla.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.6)), url('${imagenFondo}')`;
        splashPantalla.style.backgroundPosition = 'center';
        splashPantalla.style.backgroundSize = 'cover';
      }
    }).catch((err) => {
      console.warn('No se pudo cargar la ficha dinámica del juego:', err);
    });
  }
});


