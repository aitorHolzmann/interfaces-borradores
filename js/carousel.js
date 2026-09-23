/* ==========================================================================
   CARRUSELES INFINITOS Y CATÁLOGO DE JUEGOS — CAROUSEL.JS
   - Renderizado dinámico de categorías y cards desde datos estructurados (DRY)
   - Lógica de carrusel infinito mediante rotación circular de nodos en el DOM
   - Animación de deformación por inercia física (skewX) al deslizar (Tema 2)
   - Soporte para navegación con flechas tácticas y swipe táctil / drag de mouse
   ========================================================================== */

// --- 1. Catálogo de Datos de Categorías y Juegos Reales ---
const CATALOGO_CATEGORIAS = [
  {
    id: 'top',
    titulo: 'Top',
    juegos: [
      {
        titulo: 'Breach Point',
        imagen: 'assets/images/game_action_1.jpg',
        enlace: 'game.html',
        premium: false
      },
      {
        titulo: 'Street Battle',
        imagen: 'assets/images/game_action_2.jpg',
        enlace: 'game.html',
        premium: false
      },
      {
        titulo: 'Elite Marksman',
        imagen: 'assets/images/game_sniper_1.jpg',
        enlace: 'game.html',
        premium: false
      },
      {
        titulo: 'Firebase Combat',
        imagen: 'assets/images/game_combat_1.jpg',
        enlace: 'game.html',
        premium: false
      },
      {
        titulo: 'Desert Recon Patrol',
        imagen: 'assets/images/game_military_1.jpg',
        enlace: 'game.html',
        premium: false
      },
      {
        titulo: 'Geopolitical Struggle & Global Intelligence',
        imagen: 'assets/images/game_military_2.jpg',
        enlace: 'game.html',
        premium: false
      }
    ]
  },
  {
    id: 'premium',
    titulo: 'Juegos Premium',
    juegos: [
      {
        titulo: 'Armada Tactical',
        imagen: 'assets/images/game_space_2.jpg',
        enlace: 'game.html',
        premium: true
      },
      {
        titulo: 'Peg Solitaire',
        imagen: 'assets/images/peg_solitaire_hero.jpg',
        enlace: 'game.html',
        premium: true
      },
      {
        titulo: 'Iron Fist Armored Tank',
        imagen: 'assets/images/game_tank_1.jpg',
        enlace: 'game.html',
        premium: true
      },
      {
        titulo: 'Velocity Extreme Racing',
        imagen: 'assets/images/game_racing_1.jpg',
        enlace: 'game.html',
        premium: true
      },
      {
        titulo: 'Starfleet Tactical Battlefleet Command',
        imagen: 'assets/images/game_space_1.jpg',
        enlace: 'game.html',
        premium: true
      },
      {
        titulo: 'Cybernetic Warfare 2099',
        imagen: 'assets/images/game_cyber_1.jpg',
        enlace: 'game.html',
        premium: true
      }
    ]
  },
  {
    id: 'accion',
    titulo: 'Acción',
    juegos: [
      {
        titulo: 'Frontline Assault',
        imagen: 'assets/images/game_action_2.jpg',
        enlace: 'game.html',
        premium: false
      },
      {
        titulo: 'Urban Warfare Operations',
        imagen: 'assets/images/game_combat_1.jpg',
        enlace: 'game.html',
        premium: false
      },
      {
        titulo: 'Special Operations Blackout',
        imagen: 'assets/images/game_military_1.jpg',
        enlace: 'game.html',
        premium: false
      },
      {
        titulo: 'Sector 4 Drone Recon',
        imagen: 'assets/images/game_scifi_1.jpg',
        enlace: 'game.html',
        premium: false
      },
      {
        titulo: 'Air Superiority Dogfight',
        imagen: 'assets/images/game_flight_1.jpg',
        enlace: 'game.html',
        premium: false
      },
      {
        titulo: 'Cyber Strike Infiltration',
        imagen: 'assets/images/game_scifi_2.jpg',
        enlace: 'game.html',
        premium: false
      }
    ]
  },
  {
    id: 'estrategia',
    titulo: 'Estrategia',
    juegos: [
      {
        titulo: 'Galactic Warfare Hegemony',
        imagen: 'assets/images/game_strategy_1.jpg',
        enlace: 'game.html',
        premium: false
      },
      {
        titulo: 'Naval Special Operations Command',
        imagen: 'assets/images/game_strategy_2.jpg',
        enlace: 'game.html',
        premium: false
      },
      {
        titulo: 'Armor Tactics Division',
        imagen: 'assets/images/game_tank_1.jpg',
        enlace: 'game.html',
        premium: false
      },
      {
        titulo: 'Siege Commander Alpha',
        imagen: 'assets/images/game_scifi_2.jpg',
        enlace: 'game.html',
        premium: false
      },
      {
        titulo: 'Orbital Defense Network',
        imagen: 'assets/images/game_space_2.jpg',
        enlace: 'game.html',
        premium: false
      },
      {
        titulo: 'Total Resistance Front',
        imagen: 'assets/images/game_military_2.jpg',
        enlace: 'game.html',
        premium: false
      }
    ]
  }
];

// --- 2. Clase CarruselInfinito ---
class CarruselInfinito {
  constructor(contenedor) {
    this.contenedor = contenedor;
    this.pista = contenedor.querySelector('.carrusel-pista');
    this.btnAnt = contenedor.querySelector('.carrusel-flecha.izquierda');
    this.btnSig = contenedor.querySelector('.carrusel-flecha.derecha');

    this.enAnimacion = false;
    this.duracionMs = 380;
    this.timerSeguridad = null;

    // Variables para soporte de arrastre / swipe
    this.inicioX = 0;
    this.distanciaArrastre = 0;
    this.estaArrastrando = false;

    this.iniciarEventos();
  }

  // Obtiene el paso exacto de desplazamiento según el ancho de la primera card y el gap
  obtenerPaso() {
    const primeraCard = this.pista.querySelector('.card-juego');
    if (!primeraCard) return 265;
    const estiloPista = window.getComputedStyle(this.pista);
    const gap = parseFloat(estiloPista.gap) || 20;
    return primeraCard.offsetWidth + gap;
  }

  // Desplazamiento hacia la derecha (Siguiente) con deformación inercial skewX(-4deg)
  avanzar() {
    if (this.enAnimacion || this.pista.children.length <= 1) return;
    this.enAnimacion = true;

    const paso = this.obtenerPaso();

    // 1. Aplicar clase de deformación por inercia hacia adelante
    this.pista.classList.add('deslizando-sig');
    this.pista.style.transition = `transform ${this.duracionMs}ms cubic-bezier(0.25, 1, 0.5, 1)`;
    this.pista.style.transform = `translateX(-${paso}px)`;

    // 2. Al finalizar la transición, rotar nodo en el DOM y resetear posición
    const finalizarAvance = () => {
      clearTimeout(this.timerSeguridad);
      this.pista.removeEventListener('transitionend', onEnd);

      this.pista.style.transition = 'none';
      // Mover el primer elemento al final de la pista
      this.pista.appendChild(this.pista.firstElementChild);
      this.pista.style.transform = 'translateX(0)';
      this.pista.classList.remove('deslizando-sig');

      // Forzar reflujo para limpiar estilos antes de la próxima animación
      void this.pista.offsetWidth;
      this.pista.style.transition = '';
      this.enAnimacion = false;
    };

    const onEnd = (e) => {
      if (e.target === this.pista && e.propertyName === 'transform') {
        finalizarAvance();
      }
    };

    this.pista.addEventListener('transitionend', onEnd);
    this.timerSeguridad = setTimeout(finalizarAvance, this.duracionMs + 60);
  }

  // Desplazamiento hacia la izquierda (Anterior) con deformación inercial skewX(4deg)
  retroceder() {
    if (this.enAnimacion || this.pista.children.length <= 1) return;
    this.enAnimacion = true;

    const paso = this.obtenerPaso();

    // 1. Mover el último elemento al inicio inmediatamente sin transición
    this.pista.style.transition = 'none';
    this.pista.insertBefore(this.pista.lastElementChild, this.pista.firstElementChild);
    this.pista.style.transform = `translateX(-${paso}px)`;
    this.pista.classList.add('deslizando-ant');

    // Forzar reflujo del navegador
    void this.pista.offsetWidth;

    // 2. Animar hacia la posición neutra (translateX(0))
    this.pista.style.transition = `transform ${this.duracionMs}ms cubic-bezier(0.25, 1, 0.5, 1)`;
    this.pista.style.transform = 'translateX(0)';

    const finalizarRetroceso = () => {
      clearTimeout(this.timerSeguridad);
      this.pista.removeEventListener('transitionend', onEnd);

      this.pista.classList.remove('deslizando-ant');
      this.pista.style.transition = '';
      this.pista.style.transform = '';
      this.enAnimacion = false;
    };

    const onEnd = (e) => {
      if (e.target === this.pista && e.propertyName === 'transform') {
        finalizarRetroceso();
      }
    };

    this.pista.addEventListener('transitionend', onEnd);
    this.timerSeguridad = setTimeout(finalizarRetroceso, this.duracionMs + 60);
  }

  // Asociación de listeners para botones y gestos táctiles
  iniciarEventos() {
    if (this.btnSig) {
      this.btnSig.addEventListener('click', () => this.avanzar());
    }

    if (this.btnAnt) {
      this.btnAnt.addEventListener('click', () => this.retroceder());
    }

    // Soporte táctil / mouse swipe
    this.pista.addEventListener('pointerdown', (e) => {
      this.inicioX = e.clientX;
      this.estaArrastrando = true;
      this.distanciaArrastre = 0;
    });

    window.addEventListener('pointermove', (e) => {
      if (!this.estaArrastrando) return;
      this.distanciaArrastre = e.clientX - this.inicioX;
    });

    window.addEventListener('pointerup', () => {
      if (!this.estaArrastrando) return;
      this.estaArrastrando = false;

      // Umbral de 45px para activar el avance o retroceso
      if (this.distanciaArrastre < -45) {
        this.avanzar();
      } else if (this.distanciaArrastre > 45) {
        this.retroceder();
      }
      this.distanciaArrastre = 0;
    });
  }
}

// --- 3. Renderizador del Catálogo Dinámico en index.html ---
function renderizarCatalogo(contenedorId = 'contenedor-categorias') {
  const contenedorPrincipal = document.getElementById(contenedorId);
  if (!contenedorPrincipal) return;

  contenedorPrincipal.innerHTML = '';

  CATALOGO_CATEGORIAS.forEach((categoria) => {
    // 1. Crear sección semántica de la categoría
    const seccion = document.createElement('section');
    seccion.className = 'seccion-categoria';
    seccion.id = categoria.id;
    seccion.setAttribute('aria-label', `Categoría ${categoria.titulo}`);

    // 2. Cabecera con título píldora
    const header = document.createElement('div');
    header.className = 'categoria-header';
    header.innerHTML = `<h2 class="categoria-titulo">${categoria.titulo}</h2>`;
    seccion.appendChild(header);

    // 3. Contenedor del carrusel con flechas de navegación y viewport
    const carruselContenedor = document.createElement('div');
    carruselContenedor.className = 'carrusel-contenedor';

    // Flecha Izquierda
    const btnAnt = document.createElement('button');
    btnAnt.className = 'carrusel-flecha izquierda';
    btnAnt.setAttribute('aria-label', `Juegos anteriores de ${categoria.titulo}`);
    btnAnt.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <polyline points="15 18 9 12 15 6"></polyline>
      </svg>
    `;

    // Viewport y Pista
    const viewport = document.createElement('div');
    viewport.className = 'carrusel-viewport';

    const pista = document.createElement('div');
    pista.className = 'carrusel-pista';

    // Renderizar cada card de juego
    categoria.juegos.forEach((juego) => {
      const card = document.createElement('a');
      card.href = juego.enlace;
      card.className = 'card-juego';
      card.setAttribute('title', `Jugar a ${juego.titulo}`);

      // Si es premium, añadir badge circular de diamante azul
      let badgeHtml = '';
      if (juego.premium) {
        badgeHtml = `<img src="assets/icons/badge-premium.svg" alt="Premium" class="badge-premium-icon">`;
      }

      card.innerHTML = `
        ${badgeHtml}
        <img src="${juego.imagen}" alt="${juego.titulo}" class="card-img" loading="lazy">
        <span class="card-titulo">${juego.titulo}</span>
      `;

      pista.appendChild(card);
    });

    viewport.appendChild(pista);

    // Flecha Derecha
    const btnSig = document.createElement('button');
    btnSig.className = 'carrusel-flecha derecha';
    btnSig.setAttribute('aria-label', `Siguientes juegos de ${categoria.titulo}`);
    btnSig.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <polyline points="9 18 15 12 9 6"></polyline>
      </svg>
    `;

    carruselContenedor.appendChild(btnAnt);
    carruselContenedor.appendChild(viewport);
    carruselContenedor.appendChild(btnSig);

    seccion.appendChild(carruselContenedor);
    contenedorPrincipal.appendChild(seccion);

    // 4. Instanciar la lógica de carrusel infinito para esta categoría
    new CarruselInfinito(carruselContenedor);
  });
}

// Inicializar el catálogo una vez cargado el DOM
document.addEventListener('DOMContentLoaded', () => {
  renderizarCatalogo('contenedor-categorias');
});
