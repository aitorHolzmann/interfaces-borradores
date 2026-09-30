/* CARRUSELES DE CATEGORIAS: RENDERIZADO DESDE DATOS Y DESPLAZAMIENTO HORIZONTAL FINITO */

// CATALOGO DE RESPALDO LOCAL PARA RENDERIZAR INMEDIATAMENTE Y SOPORTAR OFFLINE
const CATALOGO_CATEGORIAS = [
  {
    id: 'top',
    titulo: 'Top',
    juegos: [
      {
        titulo: 'Breach Point',
        imagen: 'assets/images/imagenes_de_cards/Gemini_Generated_Image_gs6pprgs6pprgs6p%2010.png',
        enlace: 'game.html',
        premium: false
      },
      {
        titulo: 'Street Battle',
        imagen: 'assets/images/imagenes_de_cards/Gemini_Generated_Image_gs6pprgs6pprgs6p%2012.png',
        enlace: 'game.html',
        premium: false
      },
      {
        titulo: 'Elite Marksman',
        imagen: 'assets/images/imagenes_de_cards/Gemini_Generated_Image_gs6pprgs6pprgs6p%2013.png',
        enlace: 'game.html',
        premium: false
      },
      {
        titulo: 'Firebase Combat',
        imagen: 'assets/images/imagenes_de_cards/Gemini_Generated_Image_gs6pprgs6pprgs6p%2014.png',
        enlace: 'game.html',
        premium: false
      },
      {
        titulo: 'Desert Recon Patrol',
        imagen: 'assets/images/imagenes_de_cards/Gemini_Generated_Image_gs6pprgs6pprgs6p%207.png',
        enlace: 'game.html',
        premium: false
      },
      {
        titulo: 'Geopolitical Struggle & Global Intelligence',
        imagen: 'assets/images/imagenes_de_cards/Gemini_Generated_Image_gs6pprgs6pprgs6p%209.png',
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
        imagen: 'assets/images/imagenes_de_cards/Gemini_Generated_Image_gs6pprgs6pprgs6p(1)%206.png',
        enlace: 'game.html',
        premium: true
      },
      {
        titulo: 'Peg Solitaire',
        imagen: 'assets/images/imagenes_de_cards/Gemini_Generated_Image_gs6pprgs6pprgs6p(1)%205.png',
        enlace: 'game.html',
        premium: true
      },
      {
        titulo: 'Iron Fist Armored Tank',
        imagen: 'assets/images/imagenes_de_cards/Gemini_Generated_Image_gs6pprgs6pprgs6p(1)%204.png',
        enlace: 'game.html',
        premium: true
      },
      {
        titulo: 'Velocity Extreme Racing',
        imagen: 'assets/images/imagenes_de_cards/Gemini_Generated_Image_gs6pprgs6pprgs6p(1)%203.png',
        enlace: 'game.html',
        premium: true
      },
      {
        titulo: 'Starfleet Tactical Battlefleet Command',
        imagen: 'assets/images/imagenes_de_cards/Gemini_Generated_Image_gs6pprgs6pprgs6p(1)%207.png',
        enlace: 'game.html',
        premium: true
      },
      {
        titulo: 'Cybernetic Warfare 2099',
        imagen: 'assets/images/imagenes_de_cards/Gemini_Generated_Image_gs6pprgs6pprgs6p(1)%208.png',
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
        imagen: 'assets/images/imagenes_de_cards/Gemini_Generated_Image_gs6pprgs6pprgs6p(2)%203.png',
        enlace: 'game.html',
        premium: false
      },
      {
        titulo: 'Urban Warfare Operations',
        imagen: 'assets/images/imagenes_de_cards/Gemini_Generated_Image_gs6pprgs6pprgs6p(2)%204.png',
        enlace: 'game.html',
        premium: false
      },
      {
        titulo: 'Special Operations Blackout',
        imagen: 'assets/images/imagenes_de_cards/Gemini_Generated_Image_gs6pprgs6pprgs6p(2)%205.png',
        enlace: 'game.html',
        premium: false
      },
      {
        titulo: 'Sector 4 Drone Recon',
        imagen: 'assets/images/imagenes_de_cards/Gemini_Generated_Image_gs6pprgs6pprgs6p(2)%206.png',
        enlace: 'game.html',
        premium: false
      },
      {
        titulo: 'Air Superiority Dogfight',
        imagen: 'assets/images/imagenes_de_cards/Gemini_Generated_Image_gs6pprgs6pprgs6p(2)%208.png',
        enlace: 'game.html',
        premium: false
      },
      {
        titulo: 'Cyber Strike Infiltration',
        imagen: 'assets/images/imagenes_de_cards/Gemini_Generated_Image_gs6pprgs6pprgs6p(2)%209.png',
        enlace: 'game.html',
        premium: false
      }
    ]
  },
  {
    id: 'aventura',
    titulo: 'Aventura',
    juegos: [
      {
        titulo: 'Lost Horizon Expedition',
        imagen: 'assets/images/imagenes_de_cards/Gemini_Generated_Image_q9zukcq9zukcq9zu%2010.png',
        enlace: 'game.html',
        premium: false
      },
      {
        titulo: 'Mystic Valley Quest',
        imagen: 'assets/images/imagenes_de_cards/Gemini_Generated_Image_q9zukcq9zukcq9zu%203.png',
        enlace: 'game.html',
        premium: false
      },
      {
        titulo: 'Jungle Relic Hunters',
        imagen: 'assets/images/imagenes_de_cards/Gemini_Generated_Image_q9zukcq9zukcq9zu%205.png',
        enlace: 'game.html',
        premium: false
      },
      {
        titulo: 'The Last Starfarer',
        imagen: 'assets/images/imagenes_de_cards/Gemini_Generated_Image_q9zukcq9zukcq9zu%206.png',
        enlace: 'game.html',
        premium: false
      },
      {
        titulo: 'Forgotten Kingdoms',
        imagen: 'assets/images/imagenes_de_cards/Gemini_Generated_Image_q9zukcq9zukcq9zu%208.png',
        enlace: 'game.html',
        premium: false
      },
      {
        titulo: 'Beyond the Ancient Gate',
        imagen: 'assets/images/imagenes_de_cards/Gemini_Generated_Image_q9zukcq9zukcq9zu%209.png',
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
        imagen: 'assets/images/imagenes_de_cards/Gemini_Generated_Image_q9zukcq9zukcq9zu(1)%202.png',
        enlace: 'game.html',
        premium: false
      },
      {
        titulo: 'Naval Special Operations Command',
        imagen: 'assets/images/imagenes_de_cards/Gemini_Generated_Image_q9zukcq9zukcq9zu(1)%204.png',
        enlace: 'game.html',
        premium: false
      },
      {
        titulo: 'Armor Tactics Division',
        imagen: 'assets/images/imagenes_de_cards/Gemini_Generated_Image_q9zukcq9zukcq9zu(1)%205.png',
        enlace: 'game.html',
        premium: false
      },
      {
        titulo: 'Siege Commander Alpha',
        imagen: 'assets/images/imagenes_de_cards/Gemini_Generated_Image_q9zukcq9zukcq9zu(1)%206.png',
        enlace: 'game.html',
        premium: false
      },
      {
        titulo: 'Orbital Defense Network',
        imagen: 'assets/images/imagenes_de_cards/Gemini_Generated_Image_q9zukcq9zukcq9zu(1)%207.png',
        enlace: 'game.html',
        premium: false
      },
      {
        titulo: 'Total Resistance Front',
        imagen: 'assets/images/imagenes_de_cards/Gemini_Generated_Image_q9zukcq9zukcq9zu(1)%208.png',
        enlace: 'game.html',
        premium: false
      }
    ]
  }
];

// CARRUSEL FINITO: AVANZA UNA TARJETA Y SE DETIENE EN LOS EXTREMOS
class CarruselCategoria {
  constructor(contenedor) {
    this.contenedor = contenedor;
    this.pista = contenedor.querySelector('.carrusel-pista');
    this.viewport = contenedor.querySelector('.carrusel-viewport');
    this.btnAnt = contenedor.querySelector('.carrusel-flecha.izquierda');
    this.btnSig = contenedor.querySelector('.carrusel-flecha.derecha');
    this.desplazamiento = 0;

    this.btnSig.addEventListener('click', () => this.mover(1));
    this.btnAnt.addEventListener('click', () => this.mover(-1));
    window.addEventListener('resize', () => this.actualizarEstado());
    this.actualizarEstado();
  }

  // CALCULA EL ANCHO DE UNA TARJETA MAS EL ESPACIO ENTRE TARJETAS
  obtenerPaso() {
    const primeraCard = this.pista.querySelector('.card-juego');
    if (!primeraCard) return 0;
    const estiloPista = window.getComputedStyle(this.pista);
    const gap = parseFloat(estiloPista.gap) || 20;
    return primeraCard.offsetWidth + gap;
  }

  // ACTUALIZA LOS LIMITES Y DESHABILITA LA FLECHA CUANDO LLEGA A UN EXTREMO
  actualizarEstado() {
    const maximo = Math.max(0, this.pista.scrollWidth - this.viewport.clientWidth);
    this.desplazamiento = Math.min(this.desplazamiento, maximo);
    this.pista.style.transform = `translateX(-${this.desplazamiento}px)`;
    this.btnAnt.disabled = this.desplazamiento === 0;
    this.btnSig.disabled = this.desplazamiento >= maximo;
  }

  // MUEVE LA PISTA UNA TARJETA Y LIMITA EL RESULTADO ENTRE EL PRINCIPIO Y EL FINAL
  mover(direccion) {
    const paso = this.obtenerPaso();
    const maximo = Math.max(0, this.pista.scrollWidth - this.viewport.clientWidth);
    this.desplazamiento = Math.max(0, Math.min(this.desplazamiento + paso * direccion, maximo));
    this.actualizarEstado();
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

    // CONECTAR LAS FLECHAS CON EL DESPLAZAMIENTO FINITO DE ESTA CATEGORIA
    new CarruselCategoria(carruselContenedor);
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


