# Plan de Implementación — Entregable Nº 2: Plataforma de Juegos Online

> **Temática:** Militar / Star Wars (Clone Wars)  
> **Figma aprobado:** `LI86LH8D4OyOSsgXW0ePn2`  
> **Stack:** HTML5 + CSS3 puro + JavaScript Vanilla  

---

## Contexto del Diseño (extraído del Figma)

La plataforma es un portal de juegos online con estética militar/bélica inspirada en Star Wars (Clone Wars). Colores oscuros con verdes militares y acentos naranjas. Tipografía monoespaciada `JetBrains Mono` para todo el sitio.

### Design System — Tokens Clave

**Paleta de colores:**

| Token CSS | HEX | Uso |
|---|---|---|
| `--color-primario` | `#4B5320` | Verde militar base |
| `--color-primario-claro` | `#828E3B` | Títulos de categorías, highlights activos |
| `--color-primario-claro2` | `#66702D` | Bordes de inputs (focus), labels |
| `--color-primario-oscuro` | `#3B4119` | Fondo del footer |
| `--color-primario-oscuro2` | `#2D3213` | Fondo más oscuro (copyright footer) |
| `--color-acento` | `#FF6B00` | Links activos, subrayados nav, bordes top |
| `--color-acento-claro` | `#FF8833` | Fondo botones primarios (default) |
| `--color-acento-hover` | `#C45200` | Fondo botones primarios (hover) |
| `--color-acento-borde` | `#8F3C00` | Borde de botones |
| `--color-premium` | `#E5B80B` | Badges premium, botón "Comprar" |
| `--color-fondo` | `#2A302A` | Fondo general de página, cards, nav |
| `--color-superficie` | `#424B42` | Items del sidebar, relleno nav |
| `--color-superficie-oscura` | `#141714` | Fondo más profundo |
| `--color-claro` | `#EAEAEA` | Cards claras, botón Google |
| `--color-blanco` | `#FFFFFF` | Texto principal |
| `--color-error` | `#E53935` | Bordes de input con error |
| `--color-facebook` | `#1877F2` | Botón Facebook |

**Tipografía:** `JetBrains Mono` (Google Fonts — monoespaciada)

| Nivel | Peso | Tamaño | Uso |
|---|---|---|---|
| H1 | 400 | 64px | Títulos hero |
| H2 | 400 | 48px | Títulos de categoría, carrusel |
| H3 | 400 | 24px | Texto de botones, breadcrumbs |
| H3 Bold | 700 | 24px | Encabezados de sección ("CÓMO JUGAR?", "GALERÍA") |
| Body | 400 | 16px | Texto general, descripciones |
| Small | 400 | 14px | Links footer, labels sidebar, comentarios |

> [!NOTE]
> Fuentes secundarias `Poppins` (labels del form de login) e `Inter` (swatches del DS) se usan solo en zonas puntuales del auth.

**Border-radius:**

| Valor | Uso |
|---|---|
| `5px` | Panel de login/registro |
| `8px` | Inputs, botones CTA |
| `16px` | Tags de categoría |
| `25px` | Imágenes de cards, esquinas superiores del footer |
| `24px` | Imagen central del carrusel hero |

**Sombras y efectos:**
- Panel login: `box-shadow: 0 0 20px 10px rgba(255,255,255,0.15)`
- Cards hover sutil: `box-shadow: 0 0 20px 10px rgba(255,255,255,0.05)`

**Gradientes:**
- Panel login: `linear-gradient(134deg, #4B5320, rgba(0,0,0,0.4))`
- Tags categoría: `linear-gradient(90deg, rgba(42,48,42,0.4), rgba(130,142,59,0.4) 50%, rgba(42,48,42,0.4))`
- Overlay juego: `radial-gradient(circle, rgba(75,83,32,0.7), rgba(42,48,42,0.7))`

---

## Estructura de Archivos

```
/
├── index.html              ← Home (Mobile First + Loading 5s)
├── login.html              ← Login / Registro (solo Desktop)
├── game.html               ← Peg Solitaire (solo Desktop)
├── css/
│   ├── variables.css       ← Tokens del Design System (:root)
│   ├── base.css            ← Reset, tipografía, estilos globales
│   ├── components/
│   │   ├── botones.css     ← Los 3 hovers distintos
│   │   ├── cards.css       ← Cards de juego (overlay hover + ellipsis)
│   │   ├── carrusel.css    ← Carrusel hero y de categorías
│   │   ├── formularios.css ← Inputs, labels, validación visual
│   │   ├── navegacion.css  ← Navbar, sidebar, hamburguesa
│   │   ├── breadcrumbs.css ← Migas de pan
│   │   ├── comentarios.css ← Sección de comentarios
│   │   └── footer.css      ← Fat Footer
│   ├── loader.css          ← Pantalla de carga 5s (keyframes CSS)
│   ├── login.css           ← Estilos específicos de login/registro
│   ├── game.css            ← Estilos específicos de la página de juego
│   └── responsive.css      ← Media queries mobile first (solo Home)
├── js/
│   ├── loader.js           ← Contador 0%→100% en 5s
│   ├── carousel.js         ← Navegación del carrusel con translateX
│   ├── auth.js             ← Validación formularios + animación éxito
│   └── main.js             ← Menú hamburguesa, eventos globales
└── assets/
    ├── icons/              ← SVGs (lupa, hamburguesa, play, share, etc.)
    └── images/             ← Logo, fondos, portadas de juegos
```

---

## Etapa 1 — Estructura y Maquetación Estática

> **Objetivo:** Base sólida visual sin ninguna animación. Todas las páginas completas y estáticas, con datos reales.

### Paso 1.1 — Carpetas, tokens y reset

**Archivos:** `css/variables.css`, `css/base.css`

- Crear la estructura completa de carpetas (`css/`, `css/components/`, `js/`, `assets/icons/`, `assets/images/`).
- En `variables.css`: definir todos los tokens del Design System en `:root` (colores, fuentes, radios, sombras, gradientes).
- En `base.css`: reset CSS básico (`* { margin: 0; padding: 0; box-sizing: border-box; }`), `@import url()` de Google Fonts (`JetBrains Mono`, `Poppins`), estilos globales de `body`, `a`, headings.

**Justificación teórica:**
- *Consistencia y estándares (Nielsen H4):* Las variables CSS garantizan que todos los colores y fuentes sean iguales en las 3 páginas.
- *Ley de Similitud (Gestalt):* Misma tipografía y paleta en todo el sitio → el usuario percibe unidad.

### Paso 1.2 — Login (`login.html` + `css/login.css`)

**Estructura HTML:**
- Fondo a pantalla completa con la imagen `fondo_login.jpg` / `fondo_signin.jpg`.
- Panel central con `linear-gradient` + `box-shadow` glow.
- **Dos formularios** en el mismo HTML (`<form id="form-login">` y `<form id="form-registro">`), uno visible y otro `display: none`. Toggle con JS mínimo en Etapa 3.
- Form Login: inputs de email + contraseña, link "¿Olvidaste contraseña?", botón "Iniciar Sesión", separador "O continuar con", botones Facebook/Google, link "¿No tienes cuenta? Registrate".
- Form Registro: inputs de nombre, apellido, edad, email, usuario, contraseña, repetir contraseña, checkbox términos, recaptcha visual (no funcional), botón "Registrarse", link "¿Tienes cuenta? Inicia sesión".

**CSS:** Layout con Flexbox centrado (`justify-content: center; align-items: center; min-height: 100vh`). Panel de ~415×475px con el gradiente del Figma.

**Justificación teórica:**
- *Región Común (Gestalt):* El panel con fondo diferenciado y glow agrupa visualmente todo el formulario como una unidad.
- *Prevención de errores (Nielsen H5):* Inputs con `type="email"`, `type="password"`, `required`, `minlength` nativos.
- *Ley de Fitts:* Botones primarios de al menos 44px de alto, anchos completos dentro del panel.

### Paso 1.3 — Home (`index.html` + componentes CSS) — Mobile First

**Estructura HTML5 semántica:**
```html
<body>
  <!-- Loader (vacío por ahora, se activa en Etapa 2) -->
  <div id="pantalla-carga" class="loader-oculto">...</div>
  
  <header class="nav-principal">...</header>
  <nav class="sidebar" id="sidebar">...</nav>  <!-- sidebar desktop -->
  
  <main class="contenido-principal">
    <section class="seccion-hero"><!-- Carrusel hero --></section>
    <section class="seccion-categoria" data-categoria="top">...</section>
    <section class="seccion-categoria" data-categoria="premium">...</section>
    <section class="seccion-categoria" data-categoria="accion">...</section>
    <section class="seccion-categoria" data-categoria="aventura">...</section>
    <section class="seccion-categoria" data-categoria="deportes">...</section>
    <section class="seccion-categoria" data-categoria="estrategia">...</section>
  </main>
  
  <footer class="footer-principal">...</footer>
</body>
```

**Componentes CSS a crear (sin animaciones):**
- `navegacion.css` → Navbar (1440×81, grid 3 columnas: logo+hamburguesa | buscador | perfil). Borde superior naranja de 1px.
- `cards.css` → Card de juego (250×197 imagen con `border-radius: 25px`, título debajo con `text-stroke: 2px black`). Longitudes variadas de títulos con `text-overflow: ellipsis`.
- `carrusel.css` → Contenedor con `overflow: hidden` y flechas de navegación. Sin transiciones aún.
- `footer.css` → Fat Footer con grid de 4 columnas (logo+desc, Sobre nosotros, Categorías, Contacto+redes), fondo `#3B4119`, borde superior naranja, `border-radius: 25px 25px 0 0`.

**Mobile First (`responsive.css`):**
- **Base (mobile):** Layout monocolumna, cards apiladas, navbar simplificada con hamburguesa visible, sidebar oculto, carruseles de scroll horizontal táctil.
- **`@media (min-width: 768px)` (tablet):** Grid de 2 columnas para cards, footer 2 columnas.
- **`@media (min-width: 1024px)` (desktop):** Sidebar visible, grid 3-4 columnas para cards, navbar completa, footer 4 columnas, ancho máximo 1440px.

**Datos reales variados (Req. 6):**
- Títulos cortos: "Valor", "CQC", "Apex", "WWII Ace"
- Títulos largos: "Geopolitical Struggle & Global Intelligence", "Naval Special Operations Command"
- 6 categorías con ~8 cards cada una, portadas de juegos diferentes.

**Justificación teórica:**
- *Ley de Proximidad (Gestalt):* Cards de una misma categoría agrupadas físicamente con poco `gap`, separadas de la siguiente categoría con `margin-bottom` grande.
- *Ley de Miller (7±2):* Cada categoría muestra ~8 cards, dentro del rango cognitivo. El sidebar tiene ~9 items (al límite pero justificable porque son categorías fijas y el usuario no elige, navega).
- *Ley de Hick:* Organizar juegos en categorías claras reduce las opciones simultáneas vs. un listado plano.
- *Mobile First (Req. 6):* Filosofía de diseño desde lo mínimo indispensable, creciendo progresivamente. Las media queries usan `min-width` para ir de mobile → desktop.
- *Ley de Jakob:* El layout sigue convenciones de portales como Poki/1001juegos (logo arriba izquierda → home, buscador central, perfil derecha).

### Paso 1.4 — Página de Juego (`game.html` + `css/game.css`)

**Estructura HTML:**
1. **Navbar** (misma que la Home, componente reutilizado).
2. **Breadcrumbs:** `Inicio > Premium > Peg Solitaire` con links funcionales.
3. **Área de ejecución:** Contenedor 1190×480 con overlay de gradiente radial y botón "Jugar" centrado. Barra inferior con título, logo, iconos de compartir/pantalla completa.
4. **Sección "Cómo Jugar?":** Grid de 2 columnas. Izquierda: 5 bloques de texto (Objetivo, Estrategia, Movimiento, Captura, Fin del juego). Derecha: galería 2×2 de imágenes.
5. **Sección Comentarios:** Input con avatar + campo de texto + botón enviar. Lista de comentarios estáticos (avatar + usuario + texto).
6. **Mini carrusel** de juegos relacionados.
7. **Footer** (mismo componente).

**CSS:** Grid principal de 1 columna, `padding: 40px 80px`, gap entre secciones. La sección About usa grid de 2 columnas.

**Justificación teórica:**
- *Visibilidad del estado del sistema (Nielsen H1):* Breadcrumbs muestran al usuario exactamente dónde está en la jerarquía.
- *Control y libertad del usuario (Nielsen H3):* Botón visible de regreso a Home + breadcrumbs = múltiples salidas de emergencia.
- *Reconocimiento antes que recuerdo (Nielsen H6):* Las instrucciones del juego están visibles en la misma página, no en un modal oculto.
- *Región Común (Gestalt):* Cada sección (juego, instrucciones, galería, comentarios) tiene su propio contenedor visual delimitado.

### Paso 1.5 — Assets: Iconos SVG e Imágenes

- Extraer del Figma los iconos SVG necesarios: hamburguesa (☰), lupa (🔍), play (▶), flecha izquierda/derecha, compartir, pantalla completa, enviar, cerrar, ojo (mostrar contraseña), perfil, etc.
- Buscar/preparar ~15-20 portadas de juegos militares variadas (distintos tamaños y colores) para las cards.
- Optimizar las imágenes existentes (`fondo_login.jpg`, `fondo_signin.jpg`, `logo.png`).

---

## Etapa 2 — Animaciones CSS y Microinteracciones

> **Objetivo:** Agregar vida al sitio con las animaciones obligatorias. Todo en CSS3 puro + JS mínimo para el loader.

### Paso 2.1 — Las 3 Animaciones de Hover en Botones (Req. 2)

**Archivo:** `css/components/botones.css`

| # | Efecto | Clase CSS | Dónde se usa | Técnica |
|---|---|---|---|---|
| 1 | **Escala + elevación de sombra** | `.btn-primario` | "Iniciar Sesión", "Registrarse", "Jugar" | `transform: scale(1.08)` + `box-shadow` más intenso en `:hover`. `transition: transform 0.25s ease, box-shadow 0.25s ease` |
| 2 | **Barrido de fondo con ::before** | `.btn-comprar` | Botón "Comprar" (premium) | Pseudo-elemento `::before` con `width: 0% → 100%` en hover, fondo dorado que barre de izquierda a derecha. `transition: width 0.4s ease` |
| 3 | **Borde luminiscente (glow)** | `.btn-compartir` | Botones de compartir en redes (game.html) | `box-shadow: 0 0 0px transparent → 0 0 15px var(--color-acento)` + leve cambio de `border-color`. `transition: box-shadow 0.3s ease, border-color 0.3s ease` |

**Justificación teórica:**
- *Visibilidad del estado del sistema (Nielsen H1):* El hover da feedback visual inmediato de que el elemento es interactivo.
- *Umbral Doherty (<400ms):* Todas las transiciones duran 250-400ms, dentro del rango de respuesta fluida.
- *Efecto Von Restorff (UX):* El botón "Comprar" tiene un efecto visualmente distinto (barrido dorado) que lo hace memorable frente a los demás.

### Paso 2.2 — Pantalla de Carga de 5 Segundos (Req. 3)

**Archivos:** `css/loader.css` + `js/loader.js`

**HTML (ya preparado en Etapa 1):**
```html
<div id="pantalla-carga" class="pantalla-carga">
  <div class="loader-contenido">
    <div class="loader-spinner"></div>  <!-- Animación geométrica CSS -->
    <p id="loader-porcentaje" class="loader-porcentaje">0%</p>
  </div>
</div>
```

**CSS (`loader.css`):**
- Pantalla a `100vw × 100vh`, `position: fixed`, `z-index: 9999`, fondo `--color-fondo`.
- Spinner geométrico: cuadrado que rota y muta sus border-radius usando `@keyframes` puro (sin GIFs). Algo como:

```css
@keyframes mutar-forma {
  0%   { transform: rotate(0deg);   border-radius: 0; }
  25%  { transform: rotate(90deg);  border-radius: 50% 0 50% 0; }
  50%  { transform: rotate(180deg); border-radius: 50%; }
  75%  { transform: rotate(270deg); border-radius: 0 50% 0 50%; }
  100% { transform: rotate(360deg); border-radius: 0; }
}
```

- Clase `.loader-oculto`: `opacity: 0; pointer-events: none; transition: opacity 0.6s ease`.

**JS (`loader.js`):**
```javascript
let progreso = 0;
const duracion = 5000;
const intervalo = 50;
const incremento = 100 / (duracion / intervalo);

const timer = setInterval(() => {
  progreso += incremento;
  if (progreso >= 100) {
    progreso = 100;
    clearInterval(timer);
    document.getElementById('pantalla-carga').classList.add('loader-oculto');
  }
  document.getElementById('loader-porcentaje').textContent = Math.round(progreso) + '%';
}, intervalo);
```

**Justificación teórica:**
- *Visibilidad del estado del sistema (Nielsen H1):* El contador numérico y el spinner comunican explícitamente que el sistema está "cargando".
- *Efecto Goal-Gradient (UX):* El porcentaje creciente motiva al usuario a esperar porque ve progreso tangible.
- *Umbral Doherty:* Aunque son 5s (forzado por la cátedra), el feedback constante (50ms de intervalo) evita la sensación de congelamiento.

### Paso 2.3 — Carrusel con Animación Real (Req. 4)

**Archivos:** `css/components/carrusel.css` + `js/carousel.js`

**Técnica:** Contenedor con `overflow: hidden`, pista interna (`div.carrusel-pista`) con `display: flex` y `transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)`. JS modifica `translateX()` al clickear las flechas.

```css
.carrusel-pista {
  display: flex;
  transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
```

```javascript
// Esquema conceptual
let slideActual = 0;
function moverCarrusel(direccion) {
  slideActual += direccion;
  const desplazamiento = slideActual * anchoSlide;
  pista.style.transform = `translateX(-${desplazamiento}px)`;
}
```

- **Carrusel Hero:** 3 imágenes grandes con flechas laterales. Imagen central a `opacity: 1`, laterales a `opacity: 0.5` con `border-radius: 18px`.
- **Carruseles de categoría:** Scroll horizontal con flechas. Transición suave entre grupos de cards.

**Justificación teórica:**
- *Continuidad (Gestalt):* El deslizamiento horizontal sugiere que hay más contenido en esa dirección, invitando a explorar.
- *Control del usuario (Nielsen H3):* Flechas visibles para avanzar/retroceder dan control explícito.

### Paso 2.4 — Animación de Éxito en Login/Registro (Req. 1)

**Archivo:** `css/login.css` (keyframes) + `js/auth.js` (trigger)

Al "registrarse exitosamente", mostrar un mensaje animado de confirmación:
- Overlay con checkmark animado (círculo que se dibuja + tick con `stroke-dashoffset`).
- Texto "¡Registro exitoso, soldado!" con `opacity: 0 → 1` y leve `translateY`.
- Después de ~2s, transición suave a `index.html`.

**Justificación teórica:**
- *Regla Pico-Final (UX):* La experiencia del registro termina con un momento positivo memorable (la animación de éxito), mejorando la percepción global del proceso.
- *Visibilidad del estado (Nielsen H1):* El usuario confirma visualmente que su acción tuvo resultado.

---

## Etapa 3 — JavaScript e Interactividad Dinámica

> **Objetivo:** Lógica funcional con JS Vanilla. Validaciones, menú, interacciones de la página de juego.

### Paso 3.1 — Menú Hamburguesa Mobile

**Archivo:** `js/main.js`

- Botón hamburguesa (`☰` ↔ `✕`) que alterna la clase `.sidebar-abierto` en el sidebar.
- `sidebar` en mobile empieza con `transform: translateX(-100%)` → se desliza con `transition: transform 0.3s ease`.
- Overlay semitransparente detrás que cierra el menú al hacer click.

**Justificación teórica:**
- *Control y libertad (Nielsen H3):* El usuario puede abrir y cerrar el menú a voluntad, con dos formas de cerrarlo (botón X y click en overlay).
- *Ley de Fitts:* El botón hamburguesa está en la esquina superior izquierda, zona de fácil acceso con el pulgar.

### Paso 3.2 — Validación Visual de Formularios en Tiempo Real

**Archivo:** `js/auth.js`

- Validar con eventos `input` y `blur`:
  - Email: formato válido (regex simple).
  - Contraseña: mínimo 8 caracteres.
  - Repetir contraseña: coincidencia.
  - Campos obligatorios: no vacíos.
  - Edad: número positivo.
- Feedback visual: borde del input cambia a `--color-error` (#E53935) + mensaje de error debajo. Si válido: borde `--color-primario-claro2` (#66702D).
- Botón de submit deshabilitado (`opacity: 0.5; pointer-events: none`) hasta que todo sea válido.
- Toggle de visibilidad de contraseña (icono ojo).
- Alternancia Login ↔ Registro: toggle de `display: none/flex` entre los dos forms.

**Justificación teórica:**
- *Prevención de errores (Nielsen H5):* Validación mientras se escribe, antes de enviar.
- *Ayudar a recuperarse de errores (Nielsen H9):* Mensajes claros en español ("La contraseña debe tener al menos 8 caracteres"), no códigos de error.
- *Ley de Postel (UX):* Aceptar el email con o sin espacios (trim), ser flexible en la entrada.

### Paso 3.3 — Interactividad de la Página de Juego

**Archivo:** `js/main.js`

- **Comentarios:** Formulario que al enviar agrega un nuevo comentario al DOM (sin persistencia, solo visual). El input se limpia después.
- **Galería:** Lightbox simple con overlay al clickear una imagen de la galería → imagen a pantalla completa con botón cerrar.
- **Botones de compartir:** `onclick` que abre URLs de compartir (`window.open` a Twitter/Facebook con URL del juego).

**Justificación teórica:**
- *Visibilidad del estado (Nielsen H1):* El comentario aparece inmediatamente en la lista tras enviarlo.
- *Reconocimiento antes que recuerdo (Nielsen H6):* Los botones de compartir muestran iconos reconocibles de cada red social.

### Paso 3.4 (Opcional) — Consumo de API de la Cátedra

**Archivo:** `js/main.js` (o `js/api.js`)

- `fetch()` al repo de la cátedra (`api-vj-interfaces`) para cargar juegos reales.
- Reemplazar datos hardcoded por datos dinámicos.
- Manejo de errores con fallback a datos estáticos si la API falla.

> [!IMPORTANT]
> Este paso es **opcional** y suma puntos extra. No es bloqueante para la entrega.

---

## Open Questions

> [!IMPORTANT]
> **1. Imágenes de portadas de juegos:**  
> Las ~48 cards del Home necesitan portadas variadas. ¿Tenés imágenes de portadas preparadas o las buscamos/generamos? El Figma tiene imágenes de juegos militares genéricos. Podemos usar imágenes libres de derechos de sitios como Unsplash/Pexels con temática bélica, o generarlas con IA.

> [!IMPORTANT]
> **2. Iconos SVG:**  
> ¿Querés que extraiga los iconos directamente del Figma via la API, o preferís usar un set de iconos SVG simple (tipo los que ya vimos en clase) dibujados inline en el HTML?

> [!IMPORTANT]
> **3. Fondo de la página de juego (game.html):**  
> ¿Usamos el mismo fondo `fondo_login.jpg` o uno diferente? En el Figma el fondo de la Home y el Game es el color sólido `#2A302A`.

> [!IMPORTANT]
> **4. El Peg Solitaire en sí:**  
> ¿El tablero del juego se implementa ahora como parte de este entregable (Canvas + JS), o es solo el contenedor visual con el botón "Jugar" como placeholder? El enunciado dice "contenedor interactivo preparado para la implementación técnica posterior".

---

## Verificación

### Checklist de los 6 Requerimientos

| # | Requerimiento | Dónde se cumple | Etapa |
|---|---|---|---|
| 1 | 3 páginas interactivas conectadas | `login.html` → `index.html` → `game.html` | 1 + 3 |
| 2 | 3 hovers distintos en botones | `.btn-primario` (escala), `.btn-comprar` (barrido), `.btn-compartir` (glow) | 2 |
| 3 | Loading 5s con contador y CSS puro | `#pantalla-carga` con `loader.js` + `loader.css` | 2 |
| 4 | Carrusel con animación real | `translateX()` + `cubic-bezier` en `.carrusel-pista` | 2 |
| 5 | Home Mobile First | `responsive.css` con `@media (min-width: ...)` | 1 |
| 6 | Datos reales variados | Títulos cortos/largos, portadas distintas, sin Lorem Ipsum | 1 |

### Verificación Manual
- Abrir cada página en el navegador y verificar visualmente contra el Figma.
- Probar responsive redimensionando el viewport (mobile → tablet → desktop).
- Verificar las 3 animaciones de hover en distintos botones.
- Recargar la Home y verificar el loader de 5s exactos.
- Navegar el carrusel y verificar transiciones suaves.
- Completar el flujo Login → Home → Game y verificar la animación de éxito.

### Deploy
- Push a rama `gh-pages` en GitHub para visualización directa.
