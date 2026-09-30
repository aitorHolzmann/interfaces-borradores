/* CARRUSELES INFINITOS Y CATALOGO DE JUEGOS CAROUSEL JS RENDERIZADO DINAMICO DE CATEGORIAS Y CARDS DESDE DATOS ESTRUCTURADOS DRY LOGICA DE CARRUSEL INFINITO MEDIANTE ROTACION CIRCULAR DE NODOS EN EL DOM ANIMACION DE DEFORMACION POR INERCIA FISICA SKEWX AL DESLIZAR TEMA SOPORTE PARA NAVEGACION CON FLECHAS TACTICAS Y SWIPE TACTIL DRAG DE MOUSE */

// CATALOGO DE RESPALDO LOCAL PARA RENDERIZAR INMEDIATAMENTE Y SOPORTAR OFFLINE
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

// CLASE CARRUSELINFINITO
class CarruselInfinito {
  constructor(contenedor) {
    this.contenedor = contenedor;
    this.pista = contenedor.querySelector('.carrusel-pista');
    this.btnAnt = contenedor.querySelector('.carrusel-flecha.izquierda');
    this.btnSig = contenedor.querySelector('.carrusel-flecha.derecha');

    this.enAnimacion = false;
    this.duracionMs = 380;
    this.timerSeguridad = null;

    // VARIABLES PARA SOPORTE DE ARRASTRE SWIPE
    this.inicioX = 0;
    this.distanciaArrastre = 0;
    this.estaArrastrando = false;

    this.iniciarEventos();
  }

  // OBTIENE EL PASO EXACTO DE DESPLAZAMIENTO SEGUN EL ANCHO DE LA PRIMERA CARD Y EL GAP
  obtenerPaso() {
    const primeraCard = this.pista.querySelector('.card-juego');
    if (!primeraCard) return 265;
    const estiloPista = window.getComputedStyle(this.pista);
    const gap = parseFloat(estiloPista.gap) || 20;
    return primeraCard.offsetWidth + gap;
  }

  // DESPLAZAMIENTO HACIA LA DERECHA SIGUIENTE CON DEFORMACION INERCIAL SKEWX DEG
  avanzar() {
    if (this.enAnimacion || this.pista.children.length <= 1) return;
    this.enAnimacion = true;

    const paso = this.obtenerPaso();

    // APLICAR CLASE DE DEFORMACION POR INERCIA HACIA ADELANTE
    this.pista.classList.add('deslizando-sig');
    this.pista.style.transition = `transform ${this.duracionMs}ms cubic-bezier(0.25, 1, 0.5, 1)`;
    this.pista.style.transform = `translateX(-${paso}px)`;

    // AL FINALIZAR LA TRANSICION ROTAR NODO EN EL DOM Y RESETEAR POSICION
    const finalizarAvance = () => {
      clearTimeout(this.timerSeguridad);
      this.pista.removeEventListener('transitionend', onEnd);

      this.pista.style.transition = 'none';
      // MOVER EL PRIMER ELEMENTO AL FINAL DE LA PISTA
      this.pista.appendChild(this.pista.firstElementChild);
      this.pista.style.transform = 'translateX(0)';
      this.pista.classList.remove('deslizando-sig');

      // FORZAR REFLUJO PARA LIMPIAR ESTILOS ANTES DE LA PROXIMA ANIMACION
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

  // DESPLAZAMIENTO HACIA LA IZQUIERDA ANTERIOR CON DEFORMACION INERCIAL SKEWX DEG
  retroceder() {
    if (this.enAnimacion || this.pista.children.length <= 1) return;
    this.enAnimacion = true;

    const paso = this.obtenerPaso();

    // MOVER EL ULTIMO ELEMENTO AL INICIO INMEDIATAMENTE SIN TRANSICION
    this.pista.style.transition = 'none';
    this.pista.insertBefore(this.pista.lastElementChild, this.pista.firstElementChild);
    this.pista.style.transform = `translateX(-${paso}px)`;
    this.pista.classList.add('deslizando-ant');

    // FORZAR REFLUJO DEL NAVEGADOR
    void this.pista.offsetWidth;

    // ANIMAR HACIA LA POSICION NEUTRA TRANSLATEX
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

  // ASOCIACION DE LISTENERS PARA BOTONES Y GESTOS TACTILES
  iniciarEventos() {
    if (this.btnSig) {
      this.btnSig.addEventListener('click', () => this.avanzar());
    }

    if (this.btnAnt) {
      this.btnAnt.addEventListener('click', () => this.retroceder());
    }

    // SOPORTE TACTIL MOUSE SWIPE
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

      // UMBRAL DE PX PARA ACTIVAR EL AVANCE O RETROCESO
      if (this.distanciaArrastre < -45) {
        this.avanzar();
      } else if (this.distanciaArrastre > 45) {
        this.retroceder();
      }
      this.distanciaArrastre = 0;
    });
  }
}

// RENDERIZADOR DEL CATALOGO DINAMICO EN INDEX HTML
function renderizarCatalogo(contenedorId = 'contenedor-categorias', catalogo = CATALOGO_CATEGORIAS) {
  const contenedorPrincipal = document.getElementById(contenedorId);
  if (!contenedorPrincipal) return;

  contenedorPrincipal.innerHTML = '';

  catalogo.forEach((categoria) => {
    // CREAR SECCION SEMANTICA DE LA CATEGORIA
    const seccion = document.createElement('section');
    seccion.className = 'seccion-categoria';
    seccion.id = categoria.id;
    seccion.setAttribute('aria-label', `Categoría ${categoria.titulo}`);

    // CABECERA CON TITULO PILDORA
    const header = document.createElement('div');
    header.className = 'categoria-header';
    header.innerHTML = `<h2 class="categoria-titulo">${categoria.titulo}</h2>`;
    seccion.appendChild(header);

    // CONTENEDOR DEL CARRUSEL CON FLECHAS DE NAVEGACION Y VIEWPORT
    const carruselContenedor = document.createElement('div');
    carruselContenedor.className = 'carrusel-contenedor';

    // FLECHA IZQUIERDA
    const btnAnt = document.createElement('button');
    btnAnt.className = 'carrusel-flecha izquierda';
    btnAnt.setAttribute('aria-label', `Juegos anteriores de ${categoria.titulo}`);
    btnAnt.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <polyline points="15 18 9 12 15 6"></polyline>
      </svg>
    `;

    // VIEWPORT Y PISTA
    const viewport = document.createElement('div');
    viewport.className = 'carrusel-viewport';

    const pista = document.createElement('div');
    pista.className = 'carrusel-pista';

    // RENDERIZAR CADA CARD DE JUEGO
    categoria.juegos.forEach((juego) => {
      // EN CATEGORIAS PREMIUM MOSTRAMOS COMPRAR EN EL RESTO JUGAR
      const esPremium = categoria.id === 'premium' || juego.premium;
      const textoBoton = esPremium ? 'COMPRAR' : 'JUGAR';
      const claseBoton = esPremium ? 'btn-card-accion btn-comprar' : 'btn-card-accion btn-jugar';

      const card = document.createElement('a');
      if (esPremium) {
        card.href = 'javascript:void(0);';
        card.className = 'card-juego card-premium';
        card.setAttribute('role', 'button');
        card.setAttribute('aria-haspopup', 'dialog');
        card.setAttribute('title', `Comprar Pase de Batalla para ${juego.titulo}`);
      } else {
        card.href = juego.enlace;
        card.className = 'card-juego';
        card.setAttribute('title', `Jugar a ${juego.titulo}`);
      }

      // SI ES PREMIUM ANADIR BADGE CIRCULAR DE DIAMANTE AZUL O CORONA
      let badgeHtml = '';
      if (juego.premium) {
        badgeHtml = `<img src="assets/icons/badge-premium.svg" alt="Premium" class="badge-premium-icon">`;
      }

      card.innerHTML = `
        ${badgeHtml}
        <img src="${juego.imagen}" alt="${juego.titulo}" class="card-img" loading="lazy">
        <span class="${claseBoton}">${textoBoton}</span>
        <span class="card-titulo">${juego.titulo}</span>
      `;

      pista.appendChild(card);
    });

    viewport.appendChild(pista);

    // FLECHA DERECHA
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

    // INSTANCIAR LA LOGICA DE CARRUSEL INFINITO PARA ESTA CATEGORIA
    new CarruselInfinito(carruselContenedor);
  });
}

// INICIALIZACION RENDER INMEDIATO OFFLINE HIDRATACION DINAMICA DESDE LA API
// LAS FUNCIONES DE PETICION HTTP Y FORMATEO OBTENERVIDEOJUEGOSAPI CLASIFICARJUEGOSENCATEGORIAS
// SE ENCUENTRAN MODULARIZADAS EN JS API JS CUMPLIENDO CON LA SEPARACION DE RESPONSABILIDADES
document.addEventListener('DOMContentLoaded', async () => {
  // RENDER INMEDIATO CON CATALOGO DE RESPALDO LOCAL FIRST CONTENTFUL PAINT INSTANTANEO Y SOPORTE OFFLINE
  renderizarCatalogo('contenedor-categorias', CATALOGO_CATEGORIAS);

  // CONSULTA ASINCRONA A LA API OFICIAL DE LA CATEDRA
  if (typeof obtenerVideojuegosAPI === 'function' && typeof clasificarJuegosEnCategorias === 'function') {
    try {
      const juegosAPI = await obtenerVideojuegosAPI();
      if (juegosAPI && juegosAPI.length > 0) {
        const catalogoAPI = clasificarJuegosEnCategorias(juegosAPI);
        if (catalogoAPI && catalogoAPI.length > 0) {
          renderizarCatalogo('contenedor-categorias', catalogoAPI);
          console.log(`Catálogo enriquecido exitosamente con ${juegosAPI.length} juegos reales desde la API de la cátedra (v2).`);
        }
      }
    } catch (errorAPI) {
      console.warn('Utilizando datos locales de fallback por fallo en API:', errorAPI);
    }
  }
});


