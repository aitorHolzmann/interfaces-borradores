# Índice Maestro y Compendio de Interfaces de Usuario e Interacción (TUDAI / UNCPBA)

> **Cátedra:** Interfaces de Usuario e Interacción (TUDAI / FCE / UNCPBA)  
> **Uso:** Índice de navegación, especificaciones de proyectos y *cheatsheet* de alta densidad para Inteligencias Artificiales y desarrolladores.

---

## Estructura de la Documentación

```
markdown_teoria/
├── 00-INDICE-Y-RESUMEN-GENERAL.md                  # Este archivo (Guía de consulta rápida global)
├── TEORIA_COMPLETA_ALL_IN_ONE.md                   # Compendio unificado de teoría para prompts
│
├── [Módulos Teóricos]
│   ├── Tema1-UX_UI_IxD.md                          # UX, UI, IxD, Heurísticas, Leyes, Gestalt, Atomic Design
│   ├── Tema2-Animaciones-y-Transformaciones.md     # Animaciones CSS3, Transiciones y Álgebra Matricial 2D/3D
│   ├── Tema3-Color-y-Canvas-ImageData.md           # Teoría del Color, Canvas 2D, Memoria de Píxeles ImageData
│   └── Tema4-Eventos-y-Canvas-POO.md               # Eventos DOM, Drag & Drop HTML5 y Arquitectura POO Canvas
│
├── [Ejercicios Entregables / Proyectos Prácticos]
│   ├── Entregable1-Figma-Diseno-Juegos-Online.md   # TPE 1: Prototipo Figma, Design System, Bitácora de IA
│   └── Entregable2-Implementacion-Web-HTML5-CSS3-JS.md # TPE 2: Implementación Vanilla JS, Animaciones, Mobile First
│
└── images/                                         # Diagramas, esquemas matriciales y referencias visuales
```

---

## Tabla Resumen de Módulos Teóricos

| Módulo / Tema | Conceptos Nucleares | Algoritmos / Reglas Críticas | Archivo de Referencia |
| :--- | :--- | :--- | :--- |
| **Tema 1: UX / UI / IxD** | <ul><li>Diferencia UX/UI/IxD/IA</li><li>10 Heurísticas de Nielsen</li><li>Modelos cognitivos (Broadbent, Kahneman S1/S2)</li><li>Principios de Gestalt</li><li>21 Leyes de UX (Fitts, Hick, Miller...)</li><li>Atomic Design</li></ul> | <ul><li>Ley de Fitts: $T = a + b \log_2(2D/W)$</li><li>Ley de Hick: $T = b \log_2(n + 1)$</li><li>Capacidad de Miller: $7 \pm 2$ chunks</li><li>Umbral Doherty: $< 400\text{ ms}$</li><li>Jerarquía visual: peso + contraste + whitespace</li></ul> | [Tema1-UX_UI_IxD.md](Tema1-UX_UI_IxD.md) |
| **Tema 2: Animaciones & Transformaciones** | <ul><li>Feedback visual en UX</li><li>Animaciones procedurales vs keyframe vs físicas</li><li>Diferencias `transition` vs `@keyframes`</li><li>Transformaciones 2D (`translate`, `rotate`, `scale`, `skew`)</li><li>Transformaciones 3D</li></ul> | <ul><li>Matriz Afín 2D: $\begin{bmatrix} a & c & e \\ b & d & f \\ 0 & 0 & 1 \end{bmatrix}$</li><li>Escala: $\text{matrix}(s_x, 0, 0, s_y, 0, 0)$</li><li>Traslación: $\text{matrix}(1, 0, 0, 1, t_x, t_y)$</li><li>Rotación: $\text{matrix}(\cos\theta, \sin\theta, -\sin\theta, \cos\theta, 0, 0)$</li></ul> | [Tema2-Animaciones-y-Transformaciones.md](Tema2-Animaciones-y-Transformaciones.md) |
| **Tema 3: Color, Canvas & ImageData** | <ul><li>Síntesis Aditiva (RGB) vs Sustractiva (CMYK)</li><li>Espacios de color (RGB, HSL, HEX)</li><li>HTML5 `<canvas>` y `CanvasRenderingContext2D`</li><li>Estructura de `ImageData` (`Uint8ClampedArray`)</li><li>Seguridad CORS y Canvas Tainted</li></ul> | <ul><li>Indexación 1D: $\text{index} = (y \times W + x) \times 4$</li><li>Componentes: $R, G, B, A$</li><li>Inversión: $255 - C$</li><li>Gris Perceptual: $0.299R + 0.587G + 0.114B$</li><li>Carga asíncrona: `img.onload` obligatoria</li></ul> | [Tema3-Color-y-Canvas-ImageData.md](Tema3-Color-y-Canvas-ImageData.md) |
| **Tema 4: Eventos, Drag & Drop y POO Canvas** | <ul><li>Paradigma Event-Driven en DOM</li><li>Selectores y `addEventListener`</li><li>API Drag and Drop (eventos de origen y destino)</li><li>Arquitectura POO (`Figure`, `Rect`, `Circle`)</li><li>Coordenadas de mouse precisas</li><li>Máquina de estados de interacción en Canvas</li></ul> | <ul><li>Drag & Drop: `dragover` exige `e.preventDefault()`</li><li>Hit-Test Rectángulo: Bounding box ($x \in [x_0, x_0+w]$, $y \in [y_0, y_0+h]$)</li><li>Hit-Test Círculo: $\sqrt{\Delta x^2 + \Delta y^2} \le r$</li><li>Z-Index en Canvas: Búsqueda inversa en array de figuras</li></ul> | [Tema4-Eventos-y-Canvas-POO.md](Tema4-Eventos-y-Canvas-POO.md) |

---

## Tabla Resumen de Ejercicios Entregables (TPE)

| Ejercicio Práctico | Alcance y Tecnologías | Requisitos Clave Obligatorios | Archivo de Referencia |
| :--- | :--- | :--- | :--- |
| **Entregable Nº 1: Figma** | <ul><li>Diseño de plataforma de Juegos Online</li><li>Figma (Desktop)</li><li>Prototipo interactivo en alta</li></ul> | <ul><li>Design System (paleta con 3 luces/sombras, cards, carruseles, botones con hovers)</li><li>Bitácora de IA mandatoria (comparativa antes/después y validación de leyes UX)</li><li>3 Páginas: Registro/Login, Home, Peg Solitaire temático con multimedia y breadcrumbs</li><li>Defensa oral de modelo de negocio y teoría</li></ul> | [Entregable1-Figma-Diseno-Juegos-Online.md](Entregable1-Figma-Diseno-Juegos-Online.md) |
| **Entregable Nº 2: Implementación Web** | <ul><li>Desarrollo web interactivo</li><li>HTML5, CSS3, JavaScript Vanilla</li><li>Prohibidos frameworks (React, Bootstrap...)</li></ul> | <ul><li>Interacción en las 3 páginas maquetadas en alta</li><li>Mínimo 3 animaciones `hover` distintas en botones (sin contar menú hamburguesa)</li><li>Loading simulado de 5s en Home (sin GIFs, con `%` y animación CSS)</li><li>Carrusel/galería con animaciones de transición reales</li><li>Home con diseño Mobile First (Mobile + Desktop)</li><li>Datos reales sin Lorem Ipsum</li></ul> | [Entregable2-Implementacion-Web-HTML5-CSS3-JS.md](Entregable2-Implementacion-Web-HTML5-CSS3-JS.md) |

---

## Modos de Uso para Modelos de Lenguaje (IA)

1. **Consulta Temática Específica:** Cargar el archivo individual correspondiente (`Tema1.md`, `Tema2.md`, etc.). Insume entre **2.000 y 4.500 tokens**.
2. **Contexto Completo de Teoría:** Utilizar [TEORIA_COMPLETA_ALL_IN_ONE.md](TEORIA_COMPLETA_ALL_IN_ONE.md) (~**13.600 tokens**).
3. **Desarrollo o Asistencia para los TPEs:** Cargar `Entregable1-Figma...md` o `Entregable2-Implementacion...md` junto con los temas de teoría pertinentes para tener los requerimientos y la justificación teórica alineados al 100%.
