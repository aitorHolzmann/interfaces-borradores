/* INTEGRACION DE API URL DE REPOSITORIO HTTPS GITHUB COM JIMARTINEZABADIAS API VJ INTERFACES ENDPOINT HTTPS VJ INTERFACES JIMA COM AR API V */

const API_CONFIG = {
  urlBase: 'https://vj.interfaces.jima.com.ar/api/v2',
  cacheKey: 'vj_catalogo_cache_v2',
  cacheTiempoMinutos: 30
};
/* OBTIENE EL LISTADO COMPLETO DE VIDEOJUEGOS DESDE LA API OFICIAL DE LA CATEDRA IMPLEMENTA CACHE EN SESSIONSTORAGE PARA OPTIMIZAR RENDIMIENTO Y REDUCIR PETICIONES DE RED SI FALLA LA CONEXION O NO HAY INTERNET RETORNA NULL PARA ACTIVAR EL FALLBACK LOCAL RETURNS PROMISE ARRAY NULL ARRAY DE VIDEOJUEGOS O NULL EN CASO DE ERROR */
async function obtenerVideojuegosAPI() {
  // INTENTAR LEER DESDE LA CACHE DE SESION
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

  // REALIZAR LA PETICION HTTP ASINCRONA MEDIANTE FETCH API NATIVA
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

    // GUARDAR EN CACHE PARA FUTURAS NAVEGACIONES
    try {
      sessionStorage.setItem(API_CONFIG.cacheKey, JSON.stringify({
        datos: videojuegos,
        timestamp: Date.now()
      }));
    } catch (e) {
      // IGNORAR QUOTA EXCEEDED SI LA CACHE ESTA LLENA
    }

    return videojuegos;
  } catch (error) {
    console.warn('API de la cátedra no disponible o sin conexión. Se usarán datos de respaldo locales.', error);
    return null;
  }
}

/* TRANSFORMA Y CLASIFICA LOS VIDEOJUEGOS DEVUELTOS POR LA API EN LA ESTRUCTURA DE CATEGORIAS QUE UTILIZA NUESTRA PLATAFORMA TOP PREMIUM ACCION AVENTURA ESTRATEGIA PARAM ARRAY JUEGOSAPI LISTADO CRUDO DEVUELTO POR LA API V RETURNS ARRAY LISTADO CATEGORIZADO COMPATIBLE CON RENDERIZARCATALOGO */
function clasificarJuegosEnCategorias(juegosAPI) {
  if (!Array.isArray(juegosAPI) || juegosAPI.length === 0) {
    return null;
  }

  // HELPER PARA VERIFICAR GENEROS DEL JUEGO
  const tieneGenero = (juego, ...generosBuscados) => {
    if (!juego.genres || !Array.isArray(juego.genres)) return false;
    return juego.genres.some(g => 
      generosBuscados.some(gb => g.name && g.name.toLowerCase().includes(gb.toLowerCase()))
    );
  };

  // CATEGORIA TOP JUEGOS CON MAYOR RATING RATING
  const juegosTop = juegosAPI
    .filter(j => (j.rating || 0) >= 4.45)
    .slice(0, 8)
    .map(j => ({
      id: j.id,
      titulo: j.name,
      // SE UTILIZA BACKGROUND IMAGE LOW RES X SEGUN RECOMENDACION OFICIAL DE LA CATEDRA PARA VISTAS PREVIAS
      imagen: j.background_image_low_res || j.background_image,
      enlace: 'game.html',
      rating: j.rating,
      premium: false
    }));

  // CATEGORIA PREMIUM CLASIFICACION ALTA RATING
  // ASEGURAMOS QUE PEG SOLITAIRE ESTE PRIMERO 
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
      imagen: 'assets/images/imagenes_de_cards/Gemini_Generated_Image_gs6pprgs6pprgs6p(1)%205.png',
      enlace: 'javascript:void(0);',
      rating: 4.9,
      premium: true
    },
    ...juegosPremiumAPI
  ];

  // CATEGORIA ACCION JUEGOS DEL GENERO ACTION
  const juegosAccion = juegosAPI
    .filter(j => tieneGenero(j, 'Action'))
    .slice(0, 8)
    .map(j => ({
      id: j.id,
      titulo: j.name,
      imagen: j.background_image_low_res || j.background_image,
      enlace: 'game.html',
      rating: j.rating,
      premium: false
    }));

  // CATEGORIA AVENTURA JUEGOS DEL GENERO ADVENTURE O INDIE
  const juegosAventura = juegosAPI
    .filter(j => tieneGenero(j, 'Adventure', 'Indie'))
    .slice(0, 8)
    .map(j => ({
      id: j.id,
      titulo: j.name,
      imagen: j.background_image_low_res || j.background_image,
      enlace: 'game.html',
      rating: j.rating,
      premium: false
    }));

  // CATEGORIA ESTRATEGIA JUEGOS DEL GENERO STRATEGY RPG O SHOOTER
  const juegosEstrategia = juegosAPI
    .filter(j => tieneGenero(j, 'Strategy', 'RPG', 'Shooter'))
    .slice(0, 8)
    .map(j => ({
      id: j.id,
      titulo: j.name,
      imagen: j.background_image_low_res || j.background_image,
      enlace: 'game.html',
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

/* BUSCA UN VIDEOJUEGO POR SU ID EN LOS DATOS DE LA API UTIL PARA CARGAR LA FICHA INTERACTIVA EN GAME HTML PARAM STRING NUMBER ID IDENTIFICADOR DEL JUEGO RETURNS PROMISE OBJECT NULL */
async function obtenerJuegoPorId(id) {
  if (!id || id === 'peg-solitaire') return null;

  const juegos = await obtenerVideojuegosAPI();
  if (!juegos) return null;

  const numericId = parseInt(id, 10);
  return juegos.find(j => j.id === numericId) || null;
}
