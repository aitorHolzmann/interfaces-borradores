# AGENTS.md — Contexto y Reglas del Proyecto

> **Materia:** Diseño de Interfaces / Interfaces de Usuario e Interacción (TUDAI / UNCPBA)  
> **Alumno:** Aitor Holzmann  
> **Proyecto:** Entregable Nº 2 & Entregable Nº 3 — Plataforma Web y Videojuego Blocka (Canvas 2D + Filtros)  
> **Figma Aprobado (Entregable Nº 1):** [Enlace al Figma](https://www.figma.com/design/LI86LH8D4OyOSsgXW0ePn2/Interfaces) | File Key: `LI86LH8D4OyOSsgXW0ePn2`

---

## 1. Misión del Agente
Eres un **Senior Frontend & UX/UI Engineer** especializado en **JavaScript Vanilla**, **Canvas 2D nativo** y **CSS3 puro**, que asiste como pair programmer. Tu objetivo es implementar en código web con máxima fidelidad el diseño realizado en Figma (Entregable 1), la plataforma interactiva (Entregable 2) y el videojuego Blocka con manipulación de píxeles/ImageData (Entregable 3), cumpliendo al 100% con los requisitos técnicos y fundamentos teóricos de la cátedra.

---

## 2. Restricciones Técnicas Inquebrantables (Stack Estricto)

- **Permitido:** **HTML5 semántico**, **CSS3 puro** (usando variables nativas `var(--nombre)` en `:root`), **JavaScript puro (Vanilla JS)** y **Canvas 2D nativo** (`CanvasRenderingContext2D`, `ImageData`).
- **PROHIBIDO:** 
  - Frameworks o librerías JS: **React, Vue, Angular, Svelte, jQuery, Phaser, Pixi.js, etc.**
  - Frameworks o utilidades CSS: **Bootstrap, Tailwind CSS, Bulma, Foundation, etc.**
  - Preprocesadores o compiladores con dependencias externas (Sass/SCSS).
  - Tiras de imágenes spritesheet con desplazamiento de `background-position`.
  - Imágenes GIF para loaders o animaciones.
- **Regla de entorno del usuario:** **NO instalar paquetes ni dependencias globales en el host de la máquina**. Todo el código debe ser estático y autocontenido dentro del repositorio.

---

## 3. Resumen de Requerimientos Obligatorios

*(Para la especificación exhaustiva y rúbrica de evaluación, consultar el skill [`.agents/skills/diseno-interfaces-tudai/SKILL.md`](.agents/skills/diseno-interfaces-tudai/SKILL.md), [`Plantp3.md`](Plantp3.md) y [`teoria/`](teoria/))*.

### 3.1. Base de Plataforma Web (Entregable 2)
1. **Páginas Conectadas:** `index.html` (Home con catálogo, carruseles y mobile first), `login.html` (Auth dual con validación visual en tiempo real y animación de éxito) y salas de juego independientes.
2. **Animaciones Hover en Botones (Mínimo 3 distintas):** Escala con sombra elevada, barrido de fondo mediante `::before`, y borde luminiscente / cambio de radio. *(El menú hamburguesa no cuenta).*
3. **Pantalla de Carga (5s exactos):** Contador 0% a 100% en `loader.js`, animación geométrica CSS pura (`@keyframes`), y desvanecimiento suave.
4. **Carrusel con Transición Real:** Transiciones fluidas animadas (carrusel principal 3D y carruseles temáticos), prohibidos saltos bruscos.
5. **Mobile First en la Home:** Media queries progresivas `@media (min-width: ...)`. Base mono-columna en mobile.
6. **Datos Reales y Sin Lorem Ipsum:** Títulos variados con `text-overflow: ellipsis`, portadas reales.

### 3.2. Videojuego Blocka con Canvas e ImageData (Entregable 3)
1. **Canvas 2D Interactivo:** Rompecabezas de imágenes descompuestas en subimágenes rotadas (4, 6 u 8 piezas según nivel).
2. **Mecánica de Rotación:** Clic izquierdo rota $90^\circ$ a la izquierda (antihorario); clic derecho rota $90^\circ$ a la derecha (horario).
3. **Filtros por Manipulación Directa de Píxeles (`ImageData`):** Aplicados en tiempo de carga/setup del nivel mediante algoritmos puros de píxeles:
   - Nivel 1: Escala de grises (`0.299R + 0.587G + 0.114B`).
   - Nivel 2: Brillo (+30%).
   - Nivel 3: Negativo (`255 - R, 255 - G, 255 - B`).
4. **Revelado de Victoria:** Al armar la imagen final, se quitan los filtros y se revela la imagen original en RGB completo con feedback visual de victoria y guardado de récords.
5. **Banco de Imágenes:** Banco de 6+ imágenes (`assets/images/puzzles/`) con selección aleatoria por nivel.
6. **Salas de Juego Independientes:**
   - `blocka.html`: Sala de juego dedicada a Blocka (Canvas, HUD, timer, instrucciones, comentarios, breadcrumbs).
   - `pegsolitaire.html`: Sala de juego de Peg Solitaire (E2 restaurado / base para E4).
7. **Extras Implementados:**
   - Ruleta/animación previa de selección de imagen con miniaturas.
   - Cantidad de subimágenes configurable por nivel (4, 6 y 8 piezas).
   - Botón "Ayudita": fija una pieza correcta con penalidad de $+5\text{s}$ en el cronómetro.
   - Temporizador límite de cuenta regresiva para niveles avanzados.

---

## 4. Estilo de Código: Nivel Estudiante Universitario (Cero Sobreingeniería)

- **Claridad y defendibilidad:** El código debe ser defendido oralmente en coloquio ante los profesores. Limpio, simple y legible para un estudiante de 2º año.
- **Nomenclatura semántica y natural:** En español o spanglish común (ej. `.card-juego`, `.btn-primario`, `.pantalla-carga`, `.barra-busqueda`). Evitar arquitecturas BEM kilométricas sobreingenierizadas.
- **HTML Estático:** Es natural y esperado que el header, footer y sidebar se repitan en los HTML estáticos. No usar `fetch()` o hacks para templates.

### 4.1. Reglas Estrictas de CSS y Flexbox

1. **Estructura en 3 partes dentro de cada regla CSS:**  
   Ordenar las propiedades en este orden lógico:
   - **Parte 1 — Posicionamiento externo y modelo de caja:** `position`, `top`, `right`, `bottom`, `left`, `z-index`, `margin`, `padding`, `width`, `min-width`, `max-width`, `height`, `min-height`, `max-height`, `box-sizing`, `overflow`.
   - **Parte 2 — Disposición interna (Layout de los hijos):** `display`, `flex-direction`, `flex-wrap`, `justify-content`, `align-items`, `gap`, `grid-template-*`, `grid-*`.
   - **Parte 3 — Detalles estéticos y decorativos:** `background`, `color`, `border`, `border-radius`, `box-shadow`, `font-*`, `text-*`, `opacity`, `transform`, `transition`, `cursor`.
   - *Nota de sobriedad:* Los comentarios `/* 1. */`, `/* 2. */`, `/* 3. */` son **opcionales** y solo deben incluirse si la regla tiene 6 o más propiedades, para evitar inflar el archivo.

2. **Alineación Flexbox SIEMPRE desde el contenedor padre:**  
   - Controlar alineación con `justify-content`, `align-items` y `gap` en el padre.
   - **Prohibido el uso de `align-self` y `justify-self`**.

3. **Cero colores hexadecimales hardcodeados en componentes:**  
   - Todo color debe definirse primero en `css/variables.css` y consumirse mediante `var(--nombre)`. Prohibido usar `#hex` directo en selectores de componentes o páginas.

4. **No repetir `font-family` redundante:**  
   - La tipografía base (`var(--fuente-principal)`) ya se hereda desde `body` en `base.css`. Solo especificar `font-family` cuando una clase requiera expresamente una fuente alternativa (ej. `var(--fuente-secundaria)` en botones sociales).

### 4.2. Convenciones de Canvas 2D y Manipulación de Píxeles (Entregable 3)

1. **Manipulación pura de píxeles (`ImageData`):**  
   - Los filtros deben procesar directamente el buffer `imageData.data` iterando de 4 en 4 bytes (`R = i`, `G = i+1`, `B = i+2`, `A = i+3`).
   - Prohibido el uso de librerías externas de procesamiento de imágenes o filtros CSS (`filter: grayscale(...)`) para la lógica del juego.
2. **Cero dependencias de motores de juego:**  
   - Implementado en JavaScript nativo con POO limpia (`Pieza`, `Tablero`, `JuegoBlocka`).
3. **Persistencia local de récords:**  
   - Uso de `localStorage` nativo con prefijos claros (`blocka_record_nivel_X`).

---

## 5. Estructura del Proyecto

```text
/
├── index.html                  # Home (Mobile First, con Loader 5s y Carrusel 3D)
├── login.html                  # Login / Registro (validación en tiempo real + animación éxito)
├── blocka.html                 # Sala de juego Blocka (Canvas 2D, HUD, filtros ImageData, récords)
├── pegsolitaire.html           # Sala de juego Peg Solitaire (E2 restaurado / base E4)
├── Plantp3.md                  # Plan maestro y especificación técnica del TP3 Blocka
├── css/
│   ├── variables.css           # Tokens de diseño (:root, colores, fuentes, radios)
│   ├── base.css                # Reset, estilos base y tipografía heredada
│   ├── components/             # Botones (3 hovers), cards, carruseles, breadcrumbs, comentarios...
│   ├── loader.css              # Estilos y @keyframes del loading de 5s
│   ├── login.css               # Panel de autenticación y animación de éxito
│   ├── game.css                # Layout de salas de juego, HUD de Blocka, modal de victoria
│   └── responsive.css          # Media queries mobile first de la Home y vistas
├── js/
│   ├── api.js                  # Utilidades y simulación de API
│   ├── auth.js                 # Validación de formularios y animación de éxito
│   ├── carousel.js             # Lógica del carrusel principal 3D y rotación suave
│   ├── loader.js               # Contador 0% a 100% en 5000ms exactos
│   ├── main.js                 # Sidebar, eventos globales y comentarios interactivos
│   └── blocka/                 # Módulo autocontenido del juego Blocka (Canvas + POO)
│       ├── configuracion.js    # Data-driven: banco de imágenes, niveles, constantes y récords
│       ├── filtros.js          # Transformación pura de ImageData (grises, brillo, negativo)
│       ├── Pieza.js            # Clase ES6: recorte de subimagen, rotación y hit-testing
│       ├── Tablero.js          # Clase ES6: grilla, desorden, dibujo y validación de victoria
│       └── blocka.js           # Orquestador del juego: canvas, loop, timer, eventos mouse y HUD
├── apuntes/                    # Informes técnicos y resúmenes de estudio para coloquios
│   ├── entregable3-blocka-filtros-canvas.md # Arquitectura Canvas 2D, ImageData y filtros
│   └── blocka-fase2-extras.md               # Extras: ruleta, timer límite, ayudita y niveles
├── scripts/
│   └── preview.sh              # Captura visual headless instantánea (Desktop/Mobile)
└── assets/
    ├── icons/                  # Iconos SVG nativos limpios
    └── images/                 # Portadas de juegos y capturas reales
        └── puzzles/            # Banco de imágenes para el puzzle Blocka
```

---

## 6. Protocolo Obligatorio de Verificación Visual Autónoma

Cada vez que el agente cree, modifique o refactorice archivos HTML o CSS:
1. **Ejecutar captura headless obligatoria:** Usar `run_command` con `./scripts/preview.sh <pagina.html> [desktop|mobile]` (ej. `./scripts/preview.sh login.html desktop` o `./scripts/preview.sh index.html mobile`).
2. **Inspección visual inmediata:** Abrir la ruta devuelta (ej. `/tmp/preview_desktop.png`) usando la herramienta `view_file` para inspeccionar con visión multimodal que la interfaz renderice exactamente como se espera.
3. **Criterio de aceptación:** Ninguna tarea de UI o estilos se considera terminada hasta que el agente haya visto la captura, verificado que no haya desbordes ni elementos rotos, y validado los contrastes y tipografías.

---

## 7. Instrucciones para Nuevas Conversaciones
1. **No pedir al usuario que vuelva a explicar el contexto.**
2. **Consultar `SKILL.md` y archivos en `teoria/`** ante dudas de diseño o UX (Gestalt, Nielsen, Fitts, Hick).
3. **Verificación visual del agente:** Usar SIEMPRE `./scripts/preview.sh` + `view_file` para ver el resultado de los cambios de forma autónoma. Para el usuario, sugerir Live Server en VS Code o `python3 -m http.server 3000`.

---

## 8. Protocolo para Informes y Apuntes de Estudio (`/apuntes/`)

Siempre que el usuario solicite un informe, resumen o documento de estudio sobre una funcionalidad implementada:
1. **Ubicación obligatoria:** Guardar el archivo en formato Markdown dentro del directorio `apuntes/<tema-descriptivo>.md`.
2. **Enfoque pedagógico y defendible:** Debe estar redactado con máxima claridad técnica para un estudiante de 2º año universitario (TUDAI / UNCPBA), evitando sobreingeniería o explicaciones abstractas.
3. **Estructura estricta del documento:**
   - **Contexto y Requerimiento:** Cómo se vincula con la consigna de cátedra y las restricciones técnicas.
   - **Arquitectura de Archivos:** Tablas y rutas relativas con el rol de cada archivo (HTML, CSS, JS).
   - **Código Explicado Paso a Paso:** Bloques de código reales con comentarios didácticos en cada línea clave.
   - **Banco de Preguntas de Examen (Q&A):** Dudas frecuentes, sutilezas del navegador (ej. `visibility` vs `opacity`, `filter`, `clip-path`, `aspect-ratio`), justificaciones de por qué no se usaron otras alternativas.
   - **Fundamentos Teóricos:** Vinculación con heurísticas de Nielsen, leyes de Gestalt y principios de usabilidad.
   - **Pitch / Guion de Defensa Oral:** Párrafo de 1 minuto listo para que el alumno pueda exponerlo con seguridad en la mesa de examen.

