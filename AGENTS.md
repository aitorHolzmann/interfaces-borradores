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
  - Preprocesadores o compiladores con dependencias externas (Sass/SCSS).
  - Tiras de imágenes spritesheet con desplazamiento de `background-position`.
  - Imágenes GIF para loaders o animaciones.
- **Regla de entorno del usuario:** **NO instalar paquetes ni dependencias globales en el host de la máquina**. Todo el código debe ser estático y autocontenido dentro del repositorio.

---

## 3. Resumen de Requerimientos Obligatorios del Entregable 2

*(Para la especificación exhaustiva y rúbrica de evaluación, consultar el skill [`.agents/skills/diseno-interfaces-tudai/SKILL.md`](.agents/skills/diseno-interfaces-tudai/SKILL.md) y [`teoria/Entregable2-Implementacion-Web-HTML5-CSS3-JS.md`](teoria/Entregable2-Implementacion-Web-HTML5-CSS3-JS.md))*.

1. **3 Páginas Conectadas:** `index.html` (Home), `login.html` (Auth dual con validación visual en tiempo real y animación de éxito) y `game.html` (Sala de juego Peg Solitaire con comentarios interactivos).
2. **Animaciones Hover en Botones (Mínimo 3 distintas):** Escala con sombra elevada, barrido de fondo mediante `::before`, y borde luminiscente / cambio de radio. *(El menú hamburguesa no cuenta).*
3. **Pantalla de Carga (5s exactos):** Contador 0% a 100% en `loader.js`, animación geométrica CSS pura (`@keyframes`), y desvanecimiento suave.
4. **Carrusel con Transición Real:** Transiciones fluidas animadas (ej. `hero-transicion` fade/slide), prohibidos saltos bruscos.
5. **Mobile First en la Home:** Media queries progresivas `@media (min-width: ...)`. Base mono-columna en mobile.
6. **Datos Reales y Sin Lorem Ipsum:** Títulos variados con `text-overflow: ellipsis`, portadas reales.

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

---

## 5. Estructura del Proyecto

```text
/
├── index.html                  # Home (Mobile First, con Loader 5s)
├── login.html                  # Login / Registro (validación en tiempo real + animación éxito)
├── game.html                   # Ejecución de Peg Solitaire y comentarios
├── css/
│   ├── variables.css           # Tokens de diseño (:root)
│   ├── base.css                # Reset, estilos base y tipografía heredada
│   ├── components/             # Botones (3 hovers), cards, carruseles, breadcrumbs, formularios...
│   ├── loader.css              # Estilos y @keyframes del loading de 5s
│   ├── login.css               # Panel de autenticación y animación de éxito
│   ├── game.css                # Layout de sala de juego y reglas
│   └── responsive.css          # Media queries mobile first de la Home
├── js/
│   ├── loader.js               # Contador 0% a 100% en 5000ms exactos
│   ├── auth.js                 # Validación de formularios y animación de éxito
│   └── main.js                 # Sidebar, rotación suave del hero y comentarios
├── scripts/
│   └── preview.sh              # Captura visual headless instantánea (Desktop/Mobile)
└── assets/
    ├── icons/                  # Iconos SVG nativos limpios
    └── images/                 # Portadas de juegos y capturas reales
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
