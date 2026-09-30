/* ==========================================================================
   SERVICIO DE INTEGRACIÓN API — VIDEOJUEGOS CÁTEDRA (v2)
   Materia: Interfaces de Usuario e Interacción (TUDAI / UNCPBA)
   API Oficial: https://github.com/jimartinezabadias/api-vj-interfaces
   Endpoint v2: https://vj.interfaces.jima.com.ar/api/v2
   ========================================================================== */

const API_CONFIG = {
  urlBase: 'https://vj.interfaces.jima.com.ar/api/v2',
  cacheKey: 'vj_catalogo_cache_v2',
  cacheTiempoMinutos: 30
};

/**
 * Obtiene el listado completo de videojuegos desde la API oficial de la cátedra.
 * Implementa caché en sessionStorage para optimizar rendimiento y reducir peticiones de red.
 * Si falla la conexión o no hay internet, retorna null para activar el fallback local.
 * 
 * @returns {Promise<Array|null>} Array de 80 videojuegos o null en caso de error.
 */
async function obtenerVideojuegosAPI() {
  // 1. Intentar leer desde la caché de sesión
  try {
    const cacheGuardada = sessionStorage.getItem(API_CONFIG.cacheKey);
    if (cacheGuardada) {
      const { datos, timestamp } = JSON.parse(cacheGuardada);
      const minutosTranscurridos = (Date.now() - timestamp) / (1000 * 60);
      if (minutosTranscurridos < API_CONFIG.cacheTiempoMinutos && Array.isArray(datos) && datos.length > 0) {
        return datos;
      }
    }
  } catch (errorCache) {
    console.warn('No se pudo acceder a sessionStorage:', errorCache);
  }

  // 2. Realizar la petición HTTP asíncrona mediante Fetch API nativa
  try {
    const respuesta = await fetch(API_CONFIG.urlBase, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!respuesta.ok) {
      throw new Error(`Error HTTP: ${respuesta.status} ${respuesta.statusText}`);
    }

    const videojuegos = await respuesta.json();

    if (!Array.isArray(videojuegos) || videojuegos.length === 0) {
      throw new Error('La respuesta de la API no contiene un array válido de juegos.');
    }

    // 3. Guardar en caché para futuras navegaciones
    try {
      sessionStorage.setItem(API_CONFIG.cacheKey, JSON.stringify({
        datos: videojuegos,
        timestamp: Date.now()
      }));
    } catch (e) {
      // Ignorar quota exceeded si la caché está llena
    }

    return videojuegos;
  } catch (error) {
    console.warn('API de la cátedra no disponible o sin conexión. Se usarán datos de respaldo locales.', error);
    return null;
  }
}

/**
 * Transforma y clasifica los videojuegos devueltos por la API en la estructura
 * de categorías que utiliza nuestra plataforma (Top, Premium, Acción, Aventura, Estrategia).
 * 
 * @param {Array} juegosAPI - Listado crudo devuelto por la API v2.
 * @returns {Array} Listado categorizado compatible con renderizarCatalogo().
 */
function clasificarJuegosEnCategorias(juegosAPI) {
  if (!Array.isArray(juegosAPI) || juegosAPI.length === 0) {
    return null;
  }

  // Helper para verificar géneros del juego
  const tieneGenero = (juego, ...generosBuscados) => {
    if (!juego.genres || !Array.isArray(juego.genres)) return false;
    return juego.genres.some(g => 
      generosBuscados.some(gb => g.name && g.name.toLowerCase().includes(gb.toLowerCase()))
    );
  };

  // 1. Categoría TOP: Juegos con mayor rating (rating >= 4.45)
  const juegosTop = juegosAPI
    .filter(j => (j.rating || 0) >= 4.45)
    .slice(0, 8)
    .map(j => ({
      id: j.id,
      titulo: j.name,
      // Se utiliza background_image_low_res (600x400) según recomendación oficial de la cátedra para vistas previas
      imagen: j.background_image_low_res || j.background_image,
      enlace: `game.html?id=${j.id}`,
      rating: j.rating,
      premium: false
    }));

  // 2. Categoría PREMIUM: Clasificación alta (4.3 <= rating < 4.45)
  // Aseguramos que Peg Solitaire siempre esté primero como juego jugable de la entrega
  const juegosPremiumAPI = juegosAPI
    .filter(j => (j.rating || 0) >= 4.30 && (j.rating || 0) < 4.45)
    .slice(0, 7)
    .map(j => ({
      id: j.id,
      titulo: j.name,
      imagen: j.background_image_low_res || j.background_image,
      enlace: 'javascript:void(0);',
      rating: j.rating,
      premium: true
    }));

  const juegosPremium = [
    {
      id: 'peg-solitaire',
      titulo: 'Peg Solitaire',
      imagen: 'assets/images/peg_solitaire_hero.jpg',
      enlace: 'javascript:void(0);',
      rating: 4.9,
      premium: true
    },
    ...juegosPremiumAPI
  ];

  // 3. Categoría ACCIÓN: Juegos del género Action
  const juegosAccion = juegosAPI
    .filter(j => tieneGenero(j, 'Action'))
    .slice(0, 8)
    .map(j => ({
      id: j.id,
      titulo: j.name,
      imagen: j.background_image_low_res || j.background_image,
      enlace: `game.html?id=${j.id}`,
      rating: j.rating,
      premium: false
    }));

  // 4. Categoría AVENTURA: Juegos del género Adventure o Indie
  const juegosAventura = juegosAPI
    .filter(j => tieneGenero(j, 'Adventure', 'Indie'))
    .slice(0, 8)
    .map(j => ({
      id: j.id,
      titulo: j.name,
      imagen: j.background_image_low_res || j.background_image,
      enlace: `game.html?id=${j.id}`,
      rating: j.rating,
      premium: false
    }));

  // 5. Categoría ESTRATEGIA: Juegos del género Strategy, RPG o Shooter
  const juegosEstrategia = juegosAPI
    .filter(j => tieneGenero(j, 'Strategy', 'RPG', 'Shooter'))
    .slice(0, 8)
    .map(j => ({
      id: j.id,
      titulo: j.name,
      imagen: j.background_image_low_res || j.background_image,
      enlace: `game.html?id=${j.id}`,
      rating: j.rating,
      premium: false
    }));

  return [
    { id: 'top', titulo: 'Top', juegos: juegosTop },
    { id: 'premium', titulo: 'Juegos Premium', juegos: juegosPremium },
    { id: 'accion', titulo: 'Acción', juegos: juegosAccion },
    { id: 'aventura', titulo: 'Aventura', juegos: juegosAventura },
    { id: 'estrategia', titulo: 'Estrategia', juegos: juegosEstrategia }
  ];
}

/**
 * Busca un videojuego por su ID en los datos de la API.
 * Útil para cargar la ficha interactiva en game.html.
 * 
 * @param {string|number} id - Identificador del juego.
 * @returns {Promise<Object|null>}
 */
async function obtenerJuegoPorId(id) {
  if (!id || id === 'peg-solitaire') return null;

  const juegos = await obtenerVideojuegosAPI();
  if (!juegos) return null;

  const numericId = parseInt(id, 10);
  return juegos.find(j => j.id === numericId) || null;
}
