---
name: diseno-interfaces-tudai
description: >-
  Use this skill when designing, reviewing, or coding web interfaces, HTML5/CSS3 layouts,
  microinteractions, and JavaScript for the 'Diseño de Interfaces' course (TUDAI / UNCPBA).
  Enforces course-specific constraints (Vanilla JS, pure CSS3, strict framework prohibition),
  ensures compliance with Entregable 2 requirements (5s CSS loader, 3 button hover effects,
  animated carousels, mobile-first home, real data), and applies theoretical design laws
  (Gestalt, Fitts, Hick, Nielsen heuristics, cognitive models).
---

# Skill: Diseño de Interfaces y Desarrollo Web (TUDAI / UNCPBA)

Esta skill define los estándares técnicos, restricciones obligatorias y fundamentos teóricos de diseño para el desarrollo de proyectos web en la materia **Diseño de Interfaces** de la TUDAI (UNCPBA).

---

## 1. Restricciones Técnicas Obligatorias (Stack Estricto)

> [!WARNING]
> **Prohibición Total de Frameworks y Librerías:**
> - **Prohibido:** React, Angular, Vue, Svelte, jQuery, etc.
> - **Prohibido:** Bootstrap, Tailwind CSS, Bulma, Foundation, Sass/SCSS compilado externamente (usar CSS3 nativo con variables `:root`).
> - **Obligatorio:** **HTML5 semántico**, **CSS3 puro** y **JavaScript Vanilla**.
> - **Prohibido Spritesheets:** No utilizar tiras de imágenes con desplazamiento de `background-position`.
> - **Prohibido GIFs para Loaders:** Todo loader o spinner debe resolverse con CSS3 puro (`@keyframes`, `transform`, `border`, `opacity`).

---

## 2. Requerimientos de Entregable Nº 2 (Implementación Web)

Al maquetar y codear la plataforma de juegos online, deben cumplirse rigurosamente los 6 requerimientos mandatorios:

### 2.1. Las 3 Páginas Interactivas
1. **Página 1: Login / Registro:**
   - Alternancia fluida entre modo Registro y modo Login.
   - Validación visual de campos en tiempo real (inputs con feedback visual).
   - **Animación obligatoria ante registro exitoso:** Mensaje de éxito animado, spinner de confirmación o transición visual antes de redirigir a la Home.
2. **Página 2: Home (Portal de Juegos):**
   - Catálogo clasificado por categorías temáticas mediante carruseles horizontales.
   - Navegación hacia la página de ejecución al clickear la card de "Peg Solitaire".
   - Fat Footer institucional completo.
3. **Página 3: Ejecución de Juego (Peg Solitaire Temático):**
   - Contenedor interactivo destacado para el juego.
   - Migas de pan (*Breadcrumbs*) funcionales (`Inicio > Categoría > Peg Solitaire`).
   - Botón visible para regresar a la Home en todo momento.
   - Ficha multimedia con historia y galería.
   - Módulo de comentarios con formulario interactivo y botones para compartir.

### 2.2. Animaciones Hover en Botones (Mínimo 3 Distintas)
Implementar al menos **3 animaciones de `hover` con efectos visuales netamente diferentes** en botones del sitio:
- *Efecto 1:* Expansión de escala suave (`transform: scale(1.08)`) con elevación de sombra (`box-shadow`).
- *Efecto 2:* Barrido/desplazamiento de fondo mediante gradiente o pseudo-elementos (`::before` / `::after` con `transition: transform`).
- *Efecto 3:* Borde animado luminiscente (*glow*), cambio de radio de borde (`border-radius`) o efecto de brillo dinámico.
> [!IMPORTANT]
> El menú hamburguesa **NO computa** como uno de los botones para este requisito.

### 2.3. Loading Simulado de 5 Segundos (Home)
- Al cargar o recargar la Home, debe mostrarse una pantalla de carga (*Loading Screen*) durante **5 segundos exactos**.
- **Requisitos:**
  1. Contador numérico porcentual animado de `0%` a `100%` sincronizado con los 5.000 ms.
  2. Animación geométrica en CSS3 puro (spinner circular, cuadrado mutante, pulsos o barras).
  3. Desvanecimiento suave al finalizar (`opacity: 0` con `transition`) para revelar la página.

### 2.4. Carrusel / Galería de Imágenes con Animación Real
- Las transiciones del carrusel deben poseer **animación real** (deslizamiento suave con `transform: translateX()`, curvas Bezier, o desvanecimiento con opacidad).
- Prohibido el cambio brusco o estático sin transición.

### 2.5. Datos Reales y Variabilidad (Sin Lorem Ipsum)
- Títulos reales de longitudes variadas (cortos de 4 caracteres y extensos de 30+ caracteres) para probar `text-overflow: ellipsis` y adaptabilidad de las cards.
- Cada card debe tener portada gráfica propia y diferente.

### 2.6. Enfoque Mobile First en la Home
- La Home debe maquetarse bajo filosofía **Mobile First** (media queries `@media (min-width: ...)`):
  - **Mobile:** Menú hamburguesa desplegable, layout monocolumna, carruseles compactos.
  - **Desktop:** Grilla expandida, navegación completa visible.
- *(Login y Peg Solitaire se diseñan para Desktop).*

---

## 3. Principios y Leyes de Diseño Aplicados (Justificación Teórica)

Cada decisión de maquetación y estilos debe respetar y justificar los conceptos teóricos de la materia:

### Leyes de Gestalt (Organización Visual)
- **Proximidad:** Elementos relacionados (label + input, título + metadato de card) deben estar físicamente más cerca entre sí que de elementos ajenos.
- **Región Común:** Delimitar cards, modales y formularios con fondos diferenciados o bordes sutiles para reforzar la pertenencia al mismo grupo.
- **Similitud:** Botones con la misma jerarquía funcional deben compartir forma, padding y estilo visual.
- **Figura-Fondo:** Contraste nítido entre el plano de interacción (elementos activos) y el fondo de soporte.

### Leyes Motoras y Cognitivas
- **Ley de Fitts:** Botones primarios (CTA, "Jugar Ahora", "Registrarse") deben tener un área de clic generosa (mínimo $44 \times 44\text{ px}$ en mobile) y ubicación accesible.
- **Ley de Hick:** Evitar sobrecargar al usuario de opciones simultáneas; organizar juegos por categorías claras y formularios en pasos o bloques lógicos.
- **Ley de Miller:** Agrupar información en fragmentos (*chunks*) de no más de $7 \pm 2$ elementos.
- **Umbral Doherty:** Las microinteracciones y feedback de UI deben responder en menos de **400 ms** para mantener la atención fluida.

### Heurísticas de Nielsen Obligatorias
1. **Visibilidad del estado del sistema:** Feedback inmediato en hover, clic, estados de carga y confirmación de envío.
2. **Prevención de errores:** Deshabilitar botón de submit o mostrar mensajes de ayuda mientras los campos requeridos no sean válidos.
3. **Consistencia y estándares:** El logo siempre conduce a la Home; iconografía estándar para cerrar modales, perfil y búsqueda.
4. **Control y libertad del usuario:** Salidas de emergencia claras (cerrar menús, cancelar formularios, volver de la pantalla de juego).

---

## 4. Estructura de Código Recomendada para el Proyecto

```text
/
├── index.html                  # Home (Mobile First + Desktop, con pantalla de carga de 5s)
├── login.html                  # Página de Login / Registro con validaciones y animación de éxito
├── game.html                   # Página de ejecución de juego (Peg Solitaire temático)
├── css/
│   ├── variables.css           # Paleta de colores, tipografías, sombras y radios (:root)
│   ├── base.css                # Reset, tipografía global y estilos base
│   ├── components/             # Botones (3 hovers), cards, carrusel, breadcrumbs, modal
│   ├── loader.css              # Estilos y @keyframes del loading de 5s
│   └── responsive.css          # Breakpoints y adaptabilidad mobile first
├── js/
│   ├── loader.js               # Contador de 0% a 100% en 5s exactos
│   ├── carousel.js             # Lógica del carrusel con transiciones fluidas
│   ├── auth.js                 # Validación de formularios y animación de éxito
│   └── main.js                 # Menú hamburguesa y eventos generales
└── assets/
    ├── icons/                  # Iconos SVG nativos
    └── images/                 # Portadas de juegos y capturas
```

---

## 5. Referencias Teóricas Completas

Para profundizar en el contenido teórico detallado de la materia, consultar los documentos en `teoria/`:
- [Tema 1: UX, UI, IxD, Heurísticas y Gestalt](../../../teoria/Tema1-UX_UI_IxD.md)
- [Tema 2: Animaciones CSS, Transiciones y Transformaciones](../../../teoria/Tema2-Animaciones-y-Transformaciones.md)
- [Tema 3: Color y Canvas](../../../teoria/Tema3-Color-y-Canvas-ImageData.md)
- [Tema 4: Eventos y Canvas POO](../../../teoria/Tema4-Eventos-y-Canvas-POO.md)
- [Requisitos Entregable 1 (Figma)](../../../teoria/Entregable1-Figma-Diseno-Juegos-Online.md)
- [Requisitos Entregable 2 (Implementación Web)](../../../teoria/Entregable2-Implementacion-Web-HTML5-CSS3-JS.md)

