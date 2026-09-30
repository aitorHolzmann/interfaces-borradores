# Apunte de Estudio: Integración de la API Oficial de Videojuegos (v2)

> **Materia:** Diseño de Interfaces / Interfaces de Usuario e Interacción (TUDAI / UNCPBA)  
> **Tema:** Entregable Nº 2 — Requerimiento Opcional 2.5 (Consumo de Datos Reales mediante Fetch API)  
> **API Oficial:** [api-vj-interfaces (GitHub)](https://github.com/jimartinezabadias/api-vj-interfaces) | Endpoint v2: `https://vj.interfaces.jima.com.ar/api/v2`  
> **Objetivo:** Documento pedagógico exhaustivo y guía de defensa oral para la mesa de examen.

---

## 1. Contexto y Requerimiento de la Cátedra

En la consigna del **Entregable 2 (Sección 2.5: Datos Reales y Variabilidad)** se establece:
- Se prohíbe el uso de textos de relleno genéricos (*Lorem Ipsum*).
- Se exige variedad real de portadas gráficas y longitud de títulos para evaluar el comportamiento del layout (`text-overflow: ellipsis`, cards de altura uniforme).
- **Plus opcional para sumar nota:** Consumir datos reales de videojuegos provistos por la API oficial de la cátedra mediante JavaScript nativo (`fetch()`).

### 1.1. Especificación del Endpoint
- **URL Base:** `https://vj.interfaces.jima.com.ar/api/v2`
- **Método:** `GET`
- **CORS:** Habilitado por defecto (`access-control-allow-origin: *`).
- **Autenticación:** Pública (no requiere API keys ni tokens).
- **Contenido devuelto:** Array JSON con ~80 videojuegos reales (título, rating, plataformas, géneros, descripción, `background_image` y `background_image_low_res` recortado a 600x400 px).

---

## 2. Arquitectura de Archivos y Responsabilidades

Para mantener el código ordenado, mantenible y sin sobreingeniería (siguiendo los estándares de 2º año), la integración se distribuye en:

| Archivo | Rol en la Integración |
| :--- | :--- |
| [`js/api.js`](file:///home/esteban/Downloads/interfaces/interfaces-borradores/js/api.js) | **Servicio de Datos:** Funciones asíncronas puras (`fetch()`), sistema de caché con `sessionStorage`, clasificador por categorías y búsqueda por ID. |
| [`index.html`](file:///home/esteban/Downloads/interfaces/interfaces-borradores/index.html) | **Página Home:** Carga `js/api.js` antes de los scripts de interacción y carruseles. |
| [`js/carousel.js`](file:///home/esteban/Downloads/interfaces/interfaces-borradores/js/carousel.js) | **Hidratación de Carruseles:** Renderiza inmediatamente el catálogo local offline (render inicial sin parpadeos) y luego enriquece las cards de forma asíncrona con los 80 juegos de la API. |
| [`game.html`](file:///home/esteban/Downloads/interfaces/interfaces-borradores/game.html) | **Sala de Juego:** Dispone de IDs dinámicos para recibir el título, breadcrumbs y portada del juego seleccionado desde la URL. |
| [`js/main.js`](file:///home/esteban/Downloads/interfaces/interfaces-borradores/js/main.js) | **Carga Dinámica en Game:** Lee el parámetro `?id=...` de la URL mediante `URLSearchParams` y actualiza la pantalla del juego conservando Peg Solitaire por defecto. |

---

## 3. Código Explicado Paso a Paso

### 3.1. Servicio de Petición HTTP y Caché (`js/api.js`)

```javascript
const API_CONFIG = {
  urlBase: 'https://vj.interfaces.jima.com.ar/api/v2',
  cacheKey: 'vj_catalogo_cache_v2',
  cacheTiempoMinutos: 30
};

async function obtenerVideojuegosAPI() {
  // 1. Verificación de caché en sessionStorage:
  // Evita realizar peticiones HTTP innecesarias en cada recarga de página dentro de la misma sesión.
  try {
    const cacheGuardada = sessionStorage.getItem(API_CONFIG.cacheKey);
    if (cacheGuardada) {
      const { datos, timestamp } = JSON.parse(cacheGuardada);
      const minutos = (Date.now() - timestamp) / (1000 * 60);
      if (minutos < API_CONFIG.cacheTiempoMinutos && Array.isArray(datos) && datos.length > 0) {
        return datos;
      }
    }
  } catch (e) {
    console.warn('Error leyendo caché:', e);
  }

  // 2. Petición HTTP nativa con Fetch API:
  try {
    const respuesta = await fetch(API_CONFIG.urlBase, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (!respuesta.ok) {
      throw new Error(`HTTP ${respuesta.status}: ${respuesta.statusText}`);
    }

    const videojuegos = await respuesta.json();

    // 3. Persistencia en caché:
    sessionStorage.setItem(API_CONFIG.cacheKey, JSON.stringify({
      datos: videojuegos,
      timestamp: Date.now()
    }));

    return videojuegos;
  } catch (error) {
    // Si no hay internet o falla el servidor, retorna null activando el fallback local
    console.warn('Fallo al consultar la API de la cátedra:', error);
    return null;
  }
}
```

---

### 3.2. Clasificación Semántica en Categorías (`js/api.js`)

La API devuelve un array plano con 80 juegos. La función `clasificarJuegosEnCategorias(juegosAPI)` los distribuye dinámicamente en los 5 carruseles de nuestra interfaz:

```javascript
function clasificarJuegosEnCategorias(juegosAPI) {
  if (!Array.isArray(juegosAPI) || juegosAPI.length === 0) return null;

  // Helper para consultar los géneros dentro del objeto retornado por la cátedra
  const tieneGenero = (juego, ...generos) => {
    if (!juego.genres) return false;
    return juego.genres.some(g => 
      generos.some(nombre => g.name && g.name.toLowerCase().includes(nombre.toLowerCase()))
    );
  };

  // 1. TOP: Juegos con rating sobresaliente (>= 4.45)
  const juegosTop = juegosAPI
    .filter(j => (j.rating || 0) >= 4.45)
    .slice(0, 8)
    .map(j => ({
      id: j.id,
      titulo: j.name,
      // Se utiliza background_image_low_res (600x400) según directiva de la cátedra
      imagen: j.background_image_low_res || j.background_image,
      enlace: `game.html?id=${j.id}`,
      rating: j.rating,
      premium: false
    }));

  // 2. PREMIUM: Incluye siempre Peg Solitaire en primer puesto (juego mandatorio)
  const juegosPremiumAPI = juegosAPI
    .filter(j => (j.rating || 0) >= 4.30 && (j.rating || 0) < 4.45)
    .slice(0, 7)
    .map(j => ({
      id: j.id,
      titulo: j.name,
      imagen: j.background_image_low_res || j.background_image,
      enlace: 'javascript:void(0);', // Abre el modal de Pase de Batalla
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

  // 3. Categorías por Género: Acción, Aventura y Estrategia
  const juegosAccion = juegosAPI.filter(j => tieneGenero(j, 'Action')).slice(0, 8)...
  const juegosAventura = juegosAPI.filter(j => tieneGenero(j, 'Adventure', 'Indie')).slice(0, 8)...
  const juegosEstrategia = juegosAPI.filter(j => tieneGenero(j, 'Strategy', 'RPG', 'Shooter')).slice(0, 8)...

  return [
    { id: 'top', titulo: 'Top', juegos: juegosTop },
    { id: 'premium', titulo: 'Juegos Premium', juegos: juegosPremium },
    { id: 'accion', titulo: 'Acción', juegos: juegosAccion },
    { id: 'aventura', titulo: 'Aventura', juegos: juegosAventura },
    { id: 'estrategia', titulo: 'Estrategia', juegos: juegosEstrategia }
  ];
}
```

---

### 3.3. Hidratación Asíncrona Progresiva (`js/carousel.js`)

Para asegurar que la plataforma **nunca dependa exclusivamente de una conexión de red** (principio de resiliencia en coloquios):

```javascript
document.addEventListener('DOMContentLoaded', async () => {
  // 1. Render inmediato con catálogo de respaldo local (First Contentful Paint instantáneo)
  renderizarCatalogo('contenedor-categorias', CATALOGO_CATEGORIAS);

  // 2. Consulta asíncrona no bloqueante a la API de la cátedra
  if (typeof obtenerVideojuegosAPI === 'function') {
    try {
      const juegosAPI = await obtenerVideojuegosAPI();
      if (juegosAPI && juegosAPI.length > 0) {
        const catalogoAPI = clasificarJuegosEnCategorias(juegosAPI);
        if (catalogoAPI) {
          // Re-renderizado transparente con datos de la cátedra
          renderizarCatalogo('contenedor-categorias', catalogoAPI);
        }
      }
    } catch (e) {
      console.warn('Uso de catálogo local por desconexión:', e);
    }
  }
});
```

---

### 3.4. Vinculación Dinámica en la Sala de Juego (`game.html` y `js/main.js`)

Cuando el usuario hace clic en una card con enlace `game.html?id=3498`, `js/main.js` captura el parámetro e hidrata la ficha:

```javascript
const paramsUrl = new URLSearchParams(window.location.search);
const juegoIdParam = paramsUrl.get('id');

if (juegoIdParam && typeof obtenerJuegoPorId === 'function') {
  obtenerJuegoPorId(juegoIdParam).then((juego) => {
    if (!juego) return;

    // Actualiza título de pestaña y breadcrumb
    document.title = `${juego.name} — Sala de Juego`;
    document.getElementById('game-breadcrumb-titulo').textContent = juego.name;
    document.getElementById('game-barra-titulo').textContent = juego.name;

    // Actualiza la imagen de fondo con la portada en alta resolución de la API
    const splashPantalla = document.getElementById('game-splash-pantalla');
    const imagenFondo = juego.background_image || juego.background_image_low_res;
    if (splashPantalla && imagenFondo) {
      splashPantalla.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.6)), url('${imagenFondo}')`;
    }
  });
}
```

---

## 4. Banco de Preguntas y Respuestas para el Coloquio (Q&A)

### P1: ¿Por qué usaron `fetch()` nativo y no una librería externa como Axios?
> **Respuesta:** En la cátedra está estrictamente prohibido el uso de librerías o dependencias externas (React, Axios, jQuery). La API nativa `fetch()` forma parte del estándar moderno de ECMAScript, devuelve promesas nativas y se maneja limpiamente con sintaxis `async/await`, sin sobrecargar el bundle de la aplicación.

### P2: ¿Qué pasa si durante la corrección se corta internet o el servidor de la API se cae?
> **Respuesta:** La aplicación cuenta con una estrategia de **Mejora Progresiva (Progressive Enhancement)** y **Fallback Seguro**. Al cargar el DOM, primero se dibuja el catálogo local estático asegurando visualización inmediata. Si la promesa de `obtenerVideojuegosAPI()` falla o retorna `null`, el bloque `try/catch` captura el error y mantiene el catálogo local sin romper la experiencia del usuario ni mostrar errores en pantalla.

### P3: ¿Por qué utilizan la propiedad `background_image_low_res` en las cards de los carruseles?
> **Respuesta:** La cátedra diseñó la versión v2 de la API con miniaturas optimizadas de 600x400 píxeles. Usar la imagen original en alta definición (a menudo de 1920x1080 o superior) provocaría un consumo excesivo de ancho de banda, retrasaría el tiempo de carga del DOM y aumentaría el consumo de memoria en dispositivos móviles. La miniatura de 600x400 encaja con la relación de aspecto de nuestras cards (245x175 px) con excelente nitidez.

### P4: ¿Por qué guardan los datos en `sessionStorage` y no en `localStorage`?
> **Respuesta:** `sessionStorage` persiste los datos únicamente durante la sesión activa de la pestaña del navegador. Esto evita peticiones redundantes cuando el usuario navega entre `index.html` y `game.html`, pero garantiza que si abre una sesión nueva al día siguiente se consulten datos frescos, sin acumular datos obsoletos en el almacenamiento persistente del cliente.

### P5: ¿Cómo resolvieron el requisito de que "Peg Solitaire" sea jugable si la API no lo incluye?
> **Respuesta:** El juego *Peg Solitaire* es el requerimiento central de interacción de la materia. Por ello, dentro de `clasificarJuegosEnCategorias()`, inyectamos manualmente la ficha de Peg Solitaire en el primer lugar de la categoría *Juegos Premium*. De esta forma, siempre está disponible tanto en el carrusel de inicio como en la ruta por defecto de `game.html`.

---

## 5. Fundamentos Teóricos y de UX Aplicados

1. **Heurística de Nielsen #1 (Visibilidad del Estado del Sistema):** La combinación del loader de 5s y el renderizado progresivo asegura que el usuario siempre reciba retroalimentación visual clara sin bloqueos de interfaz.
2. **Heurística de Nielsen #9 (Ayudar a los usuarios a reconocer, diagnosticar y recuperarse de errores):** Ante un fallo de red o caída del servidor externo, la plataforma realiza un fallback transparente y degrada con gracia (*graceful degradation*).
3. **Ley de Miller (Límite cognitivo de 7 ± 2 elementos):** La API provee 80 juegos. En vez de arrojarlos en una grilla interminable que sobrecargue cognitivamente al usuario, los segmentamos en 5 categorías semánticas (Top, Premium, Acción, Aventura, Estrategia) con un máximo de 8 juegos visibles por carrusel interactivo.
4. **Ley de Fitts:** Los botones de acción rápida (*JUGAR* y *COMPRAR*) se posicionan directamente sobre el centro del foco visual de la card mediante hover y con dimensiones táctiles cómodas.

---

## 6. Guion de Defensa Oral (Pitch de 1 Minuto)

> *"Para el Entregable 2 aprovechamos el plus opcional recomendado por la cátedra consumiendo la API oficial de videojuegos v2 a través de `fetch()` y `async/await` nativo, sin ninguna dependencia externa. Diseñamos un servicio desacoplado en `js/api.js` que implementa caché temporal en `sessionStorage` para optimizar el rendimiento. Los 80 juegos recibidos son clasificados dinámicamente por rating y género en los carruseles de la Home, priorizando siempre la miniatura `background_image_low_res` para cuidar el consumo de datos y la velocidad de renderizado. Además, conectamos la sala de juego en `game.html` mediante parámetros de URL para cargar la portada y título de cualquier juego del catálogo, manteniendo una arquitectura resiliente con fallback local en caso de que no haya conexión a internet."*
