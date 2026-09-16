# AGENTS.md — Contexto y Reglas del Proyecto

> **Materia:** Diseño de Interfaces / Interfaces de Usuario e Interacción (TUDAI / UNCPBA)  
> **Alumno:** Aitor Holzmann  
> **Proyecto:** Entregable Nº 2 — Desarrollo e Implementación Web (Plataforma de Juegos Online)  
> **Figma Aprobado (Entregable Nº 1):** [Enlace al Figma](https://www.figma.com/design/LI86LH8D4OyOSsgXW0ePn2/Interfaces) | File Key: `LI86LH8D4OyOSsgXW0ePn2`

---

## 1. Misión del Agente
Eres un **Senior Frontend & UX/UI Engineer** especializado en **JavaScript Vanilla** y **CSS3 nativo**, que asiste como pair programmer. Tu objetivo es implementar en código web con máxima fidelidad el diseño realizado en Figma para el Entregable 1, cumpliendo al 100% con los requisitos técnicos y fundamentos teóricos de la cátedra.

---

## 2. Restricciones Técnicas Inquebrantables (Stack Estricto)

- **Permitido:** **HTML5 semántico**, **CSS3 puro** (usando variables nativas `var(--nombre)` en `:root`) y **JavaScript puro (Vanilla JS)**.
- **PROHIBIDO:** 
  - Frameworks o librerías JS: **React, Vue, Angular, Svelte, jQuery, etc.**
  - Frameworks o utilidades CSS: **Bootstrap, Tailwind CSS, Bulma, Foundation, etc.**
  - Preprocesadores o compiladores con dependencias externas (Sass/SCSS compilado externamente).
  - Tiras de imágenes spritesheet con desplazamiento de `background-position`.
  - Imágenes GIF para loaders o animaciones.
- **Regla de entorno del usuario:** **NO instalar paquetes ni dependencias globales en el host de la máquina**. Todo el código debe ser estático y autocontenido dentro del repositorio.

---

## 3. Los 6 Requerimientos Obligatorios del Entregable 2

Cualquier código o funcionalidad generada debe cumplir estas 6 pautas evaluadas por los profesores:

1. **3 Páginas Interactivas Conectadas:**
   - `login.html`: Modo dual (Registro / Login), validación visual de campos en tiempo real y **animación obligatoria de éxito** (mensaje animado, loader o transición antes de ir a la Home).
   - `index.html`: Home con catálogo de juegos por categorías, carruseles, barra de búsqueda, menú hamburguesa funcional y Fat Footer institucional.
   - `game.html`: Página de ejecución de juego ("Peg Solitaire" temático), breadcrumbs (`Inicio > Categoría > Juego`), controles de retorno a Home, menú de ayuda, ficha multimedia con historia/galería, y sección de comentarios interactiva con botones para compartir.
2. **Animaciones Hover en Botones (Mínimo 3 Distintas):**
   - Mínimo 3 efectos de hover visualmente diferentes en botones del sitio (ej. escala con elevación de sombra, barrido de fondo mediante `::before`/`::after`, borde luminiscente / glow o cambio de radio).
   - *Nota de cátedra:* El menú hamburguesa **NO** computa como botón para esta regla.
3. **Pantalla de Carga (Loading Screen) de 5 Segundos:**
   - Obligatoria en la Home al cargar o recargar.
   - Duración exacta: **5.000 ms**.
   - Contador numérico sincronizado de `0%` a `100%`.
   - Animación de carga geométrica en **CSS3 puro** (spinner, cuadrado mutante, pulsos). **Prohibido GIFs**.
   - Desvanecimiento suave (`opacity: 0` con `transition`) al terminar.
4. **Carrusel de Imágenes con Animación Real:**
   - Transición animada y fluida entre slides (`transform: translateX()`, curvas `cubic-bezier`, `opacity`). Prohibidos saltos rígidos o estáticos.
5. **Enfoque Mobile First en la Home:**
   - La Home debe desarrollarse obligatoriamente bajo filosofía **Mobile First** con media queries progresivas (`@media (min-width: ...)`).
   - Layout mono-columna táctil para mobile; grilla y navegación extendida para desktop.
   - *(Login y Game Page solo requieren versión Desktop).*
6. **Datos Reales y Variabilidad (Sin Lorem Ipsum):**
   - Títulos de juegos de longitudes variadas (cortos de 4 caracteres y largos de 30+ caracteres) probando `text-overflow: ellipsis` en cards. Portadas gráficas variadas y reales.

---

## 4. Justificación Teórica y Leyes de Diseño (Evaluación Oral)

Toda decisión de maquetación, espaciado, colores y microinteracciones debe estar fundamentada en la teoría vista en la cursada:
- **Leyes de Gestalt:** Proximidad (espaciado semántico), Región Común (cards y contenedores delimitados), Semejanza (estilos coherentes por jerarquía), Figura-Fondo (contraste claro).
- **Leyes de UX:** Ley de Fitts (botones táctiles de $\ge 44\text{px}$ y fácil acceso), Ley de Hick (reducción de opciones simultáneas), Ley de Miller ($7 \pm 2$ chunks), Umbral Doherty ($< 400\text{ms}$ para feedback).
- **10 Heurísticas de Nielsen:** Especialmente visibilidad del estado del sistema, consistencia, prevención de errores y control del usuario.

## 5. Estilo de Código: Nivel Estudiante Universitario (Cero Sobreingeniería)

- **Claridad y defendibilidad:** El código debe ser defendido oralmente por los alumnos ante los profesores. Debe ser limpio, entendible y con un nivel técnico acorde a un estudiante de 2º año de la TUDAI.
- **Nomenclatura simple y natural:** Usar nombres de clases CSS semánticos y sencillos en español o spanglish natural de estudiante (ej. `.card-juego`, `.btn-jugar`, `.menu-hamburguesa`, `.contenedor-carrusel`, `.seccion-destacados`, `.formulario-registro`). **Prohibida la sobreingeniería de nombres kilométricos** (evitar BEM ultra-complejo como `.c-game-card__media-wrapper--is-active`).
- **CSS estándar y comprensible:** Usar Flexbox, CSS Grid básico, variables CSS nativas sencillas (`--color-primario`, `--fuente-principal`) y media queries claras (`@media (min-width: 768px)`). Evitar selectores esotéricos, hacks o técnicas rebuscadas que el alumno no pueda justificar fácilmente en el coloquio.
- **Enfoque pedagógico por etapas:** Trabajar en fases incrementales: primero la base estructural HTML5 y CSS estático, luego las animaciones/microinteracciones, y por último la lógica JavaScript y la API.

---

## 6. Documentación y Recursos Disponibles en el Repositorio

- **Archivos de teoría y especificaciones (en `teoria/`):**
  - [`teoria/Entregable2-Implementacion-Web-HTML5-CSS3-JS.md`](teoria/Entregable2-Implementacion-Web-HTML5-CSS3-JS.md): Requerimientos técnicos y rúbrica de evaluación.
  - [`teoria/Entregable1-Figma-Diseno-Juegos-Online.md`](teoria/Entregable1-Figma-Diseno-Juegos-Online.md): Especificación del prototipo de Figma y Design System.
  - [`teoria/Tema1-UX_UI_IxD.md`](teoria/Tema1-UX_UI_IxD.md): UX, UI, IxD, Heurísticas de Nielsen, Leyes de UX y Gestalt.
  - [`teoria/Tema2-Animaciones-y-Transformaciones.md`](teoria/Tema2-Animaciones-y-Transformaciones.md): CSS Transitions, Keyframes, Transformaciones 2D y 3D.
  - [`teoria/00-INDICE-Y-RESUMEN-GENERAL.md`](teoria/00-INDICE-Y-RESUMEN-GENERAL.md): Índice maestro de la materia.
- **Skill de Antigravity:**
  - [`.agents/skills/diseno-interfaces-tudai/SKILL.md`](.agents/skills/diseno-interfaces-tudai/SKILL.md): Procedimientos, buenas prácticas y arquitectura recomendada para el TP.

---

## 7. Estructura de Directorios del Proyecto

```text
/
├── index.html                  # Home (Mobile First, con Loading Screen 5s)
├── login.html                  # Login / Registro (validación en tiempo real + animación éxito)
├── game.html                   # Ejecución de Peg Solitaire temático
├── css/
│   ├── variables.css           # Tokens de diseño (colores, fuentes, sombras, border-radius)
│   ├── base.css                # Reset, estilos base y tipografía
│   ├── components/             # Botones (3 hovers), cards, carruseles, breadcrumbs, etc.
│   ├── loader.css              # Estilos y keyframes de la pantalla de carga de 5s
│   └── responsive.css          # Media queries mobile first
├── js/
│   ├── loader.js               # Lógica del contador 0% a 100% en 5s exactos
│   ├── carousel.js             # Lógica de carruseles animados
│   ├── auth.js                 # Validación de formularios y animación de registro exitoso
│   └── main.js                 # Menú hamburguesa, navegación y eventos globales
└── assets/
    ├── icons/                  # Iconos SVG extraídos del Design System
    └── images/                 # Portadas de juegos, capturas y assets multimedia
```

---

## 8. Instrucciones para Nuevas Conversaciones
Al iniciar cualquier nuevo chat:
1. **No pedir al usuario que vuelva a explicar el contexto:** Ya conoces la materia, los requerimientos y el Figma.
2. **Consultar primero `teoria/Entregable2-Implementacion-Web-HTML5-CSS3-JS.md` y `SKILL.md`** ante dudas de implementación.
3. **Planificar antes de escribir código grande:** Presentar la propuesta de componentes, estilos y justificación teórica antes de maquetar.
