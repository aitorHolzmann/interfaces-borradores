# Compendio Completo de Teoría: Interfaces de Usuario e Interacción (TUDAI / UNCPBA)

> **Documento Consolidado All-In-One para Modelos de Lenguaje (IA)**  
> **Contenido:** Material íntegro de los 7 PDFs de la cátedra, estructurado en Markdown de máxima densidad semántica, con fórmulas matemáticas, algoritmos, arquitectura de software y referencias a diagramas.

## Índice General

1. [Tema 1: UX, UI, IxD, Arquitectura de Información y Principios de Diseño](#tema-1-ux-ui-ixd-arquitectura-de-información-y-principios-de-diseño)
   - 1. Definiciones Fundamentales
   - 2. Análisis Heurístico: Las 10 Heurísticas de Nielsen & Molich
   - 3. Modelos Cognitivos y de Percepción Humana
   - 4. Principios de la Gestalt en Diseño Visual
   - 5. Las 21 Leyes de UX (Jon Yablonski)
   - 6. Patrones de Diseño, Jerarquía Visual e Identidad
   - 7. Atomic Design (Brad Frost)
   - 8. Ciclo del Proceso de Diseño y Entregables
2. [Tema 2: Animaciones y Transformaciones en CSS3 y JavaScript](#tema-2-animaciones-y-transformaciones-en-css3-y-javascript)
   - 1. Rol de las Animaciones en la Experiencia de Usuario (UX)
   - 2. Clasificación de las Animaciones
   - 3. Transiciones vs. Animaciones en CSS
   - 4. Sintaxis y Propiedades de CSS Transitions
   - 5. Sintaxis y Propiedades de CSS Animations
   - 6. Transformaciones CSS 2D (`transform`)
   - 7. Modelo Matemático Matricial 2D: `matrix(a, b, c, d, e, f)`
   - 8. Transformaciones en el Espacio 3D y Prefijos
3. [Tema 3: Teoría del Color, Canvas 2D y Manipulación de Píxeles (ImageData)](#tema-3-teoría-del-color-canvas-2d-y-manipulación-de-píxeles-imagedata)
   - 1. Teoría Física del Color
   - 2. Sistemas de Representación del Color en la Web
   - 3. HTML5 `<canvas>` y la API `CanvasRenderingContext2D`
   - 4. Estructura de Memoria de `ImageData`
   - 5. Algoritmos de Procesamiento y Filtros de Imagen
   - 6. Carga Asíncrona de Imágenes y Restricciones de Seguridad
4. [Tema 4: Eventos DOM, HTML5 Drag & Drop y Programación Orientada a Objetos en Canvas](#tema-4-eventos-dom-html5-drag--drop-y-programación-orientada-a-objetos-en-canvas)
   - 1. Paradigma Conducido por Eventos (*Event-Driven*)
   - 2. API HTML5 Drag and Drop
   - 3. Arquitectura Orientada a Objetos (POO) en Canvas 2D
   - 4. Coordenadas del Cursor y Bucle de Renderizado en Canvas
   - 5. Máquina de Estados para Drag & Drop Interactivo en Canvas

---

# Tema 1: UX, UI, IxD, Arquitectura de Información y Principios de Diseño

> **Materia:** Interfaces de Usuario e Interacción (TUDAI / UNCPBA)  
> **Fuente original:** `Tema1 - UX UI IxD.pptx-1.pdf` (205 diapositivas)  
> **Objetivo de este documento:** Proveer una referencia estructurada, densa y de mínimo consumo de tokens para modelos de lenguaje (IA), preservando el 100% de los conceptos teóricos, heurísticas, leyes cognitivas y patrones de diseño.

---

## 1. Definiciones Fundamentales

| Término | Nombre Completo | Definición y Enfoque Teórico |
| :--- | :--- | :--- |
| **UX** | *User Experience* (Experiencia de Usuario) | Percepción, emociones, respuestas fisiológicas y psicológicas de un usuario al interactuar con un producto, sistema o servicio. Se orienta a cómo se *siente* el usuario y su satisfacción global (fidelización, recomendación, retorno). |
| **UI** | *User Interface* (Diseño de Interfaces) | El conjunto de elementos visuales, controles gráficos y puntos de contacto mediante los cuales el usuario interactúa con el sistema (botones, paleta de colores, tipografía, iconografía, espaciado). Es el vehículo visual a través del cual se experimenta la UX. |
| **IxD** | *Interaction Design* (Diseño de Interacción) | Disciplina enfocada en definir la estructura y el comportamiento de sistemas interactivos en el tiempo. Analiza las 5 dimensiones: Palabras (1D), Representaciones visuales (2D), Objetos físicos/espacio (3D), Tiempo (4D) y Comportamiento/Mecanismos de acción-reacción (5D). |
| **IA** | *Information Architecture* (Arquitectura de Información) | **No confundir con Inteligencia Artificial.** Es la práctica de organizar, estructurar, clasificar y etiquetar los contenidos y datos de un sistema para que los usuarios encuentren la información deseada de forma intuitiva y eficiente. |
| **Usabilidad** | *Usability* (ISO 9241-11) | Grado en que un producto puede ser utilizado por usuarios específicos para conseguir objetivos definidos con **eficacia** (completar la tarea), **eficiencia** (recursos y tiempo invertidos) y **satisfacción** en un contexto de uso determinado. |

---

## 2. Análisis Heurístico: Las 10 Heurísticas de Nielsen & Molich

El análisis heurístico es un método de inspección donde expertos evalúan una interfaz frente a principios reconocidos de usabilidad.

1. **Visibilidad del estado del sistema:**
   - La interfaz debe mantener informado al usuario sobre lo que está ocurriendo en tiempo real mediante feedback visual apropiado y en tiempo razonable (loaders, barras de progreso, cambios de color en estados activos).
2. **Coincidencia entre el sistema y el mundo real:**
   - El sistema debe utilizar el lenguaje, conceptos, metáforas y convenciones familiares para el usuario, no terminología técnica interna o jerga de base de datos.
3. **Control y libertad del usuario:**
   - Los usuarios cometen errores frecuentemente. El sistema debe proveer "salidas de emergencia" claras: deshacer (*undo*), rehacer (*redo*), cancelar operaciones y volver al estado anterior sin fricción.
4. **Consistencia y estándares:**
   - No confundir al usuario usando palabras, iconos o situaciones diferentes para la misma acción. Respetar convenciones de la plataforma (ej. logo arriba a la izquierda vuelve al inicio, botones primarios a la derecha en modales).
5. **Prevención de errores:**
   - Es mejor un diseño que prevenga el error antes de que ocurra que un buen mensaje de error posterior. Validar formularios en tiempo real (mientras se escribe o antes de clickear "Enviar"), desactivar opciones incompatibles y solicitar confirmación para acciones destructivas.
6. **Reconocimiento antes que recuerdo:**
   - Minimizar la carga de memoria de trabajo del usuario. Las opciones, acciones y elementos visibles deben ser evidentes; el usuario no debe recordar información de una pantalla previa para usar la actual.
7. **Flexibilidad y eficiencia de uso:**
   - Diseñar para novatos y expertos a la vez. Ofrecer aceleradores, atajos de teclado (*shortcuts*), personalización de vistas o accesos rápidos para usuarios recurrentes sin abrumar al principiante.
8. **Diseño estético y minimalista:**
   - Las interfaces no deben contener información irrelevante o raramente necesaria. Cada dato o elemento adicional compite directamente con la información relevante y disminuye su visibilidad relativa.
9. **Ayudar a reconocer, diagnosticar y recuperarse de errores:**
   - Los mensajes de error deben expresarse en lenguaje llano (sin códigos de error tipo `Error 0x8004`), describir con precisión el problema y sugerir constructivamente una solución para corregirlo.
10. **Ayuda y documentación:**
    - Aunque el sistema debe ser usable sin manual, la ayuda debe ser fácilmente accesible, orientada a las tareas concretas del usuario, listar pasos específicos y no ser excesivamente extensa.

---

## 3. Modelos Cognitivos y de Percepción Humana

### 3.1. Modelo de Atención de Broadbent (Filtro Selectivo)
![Modelo de Broadbent](images/tema1_modelo_broadbent.png)
- **Concepto:** La mente humana tiene un cuello de botella atencional.
- **Mecanismo:** Los estímulos sensoriales ingresan a un buffer sensorial efímero. Un **filtro selectivo** descarta la mayoría de los estímulos irrelevantes y sólo permite el paso de una porción mínima hacia la memoria de trabajo y el procesamiento semántico.
- **Implicancia en UI:** Si una pantalla tiene sobrecarga visual, el filtro del usuario descartará elementos clave. La interfaz debe dirigir la atención deliberadamente hacia el objetivo principal.

### 3.2. Sistema 1 y Sistema 2 (Daniel Kahneman)
- **Sistema 1 (Automático, Rápido, Inconsciente):** Opera sin esfuerzo consciente, utiliza heurísticas, atajos mentales y reconocimiento de patrones. Es donde los usuarios operan el 95% del tiempo al navegar interfaces.
- **Sistema 2 (Analítico, Lento, Consciente):** Requiere esfuerzo mental deliberado y agota energía. Se activa ante errores, formularios complejos o inconsistencias de la interfaz.
- **Regla de oro de UI:** Mantener la interacción en el **Sistema 1**. Cualquier sorpresa, falla o diseño confuso fuerza al usuario al Sistema 2, provocando fatiga y abandono.

### 3.3. Ceguera a los Banners (*Banner Blindness*)
- Los usuarios aprenden a ignorar activamente cualquier elemento que parezca un banner publicitario (por forma, ubicación en laterales, o contraste exagerado), incluso si contiene contenido importante del propio sistema.

---

## 4. Principios de la Gestalt en Diseño Visual

![Principios Gestalt](images/tema1_gestalt_principios.png)

La psicología de la Gestalt explica cómo el cerebro humano organiza visualmente formas aisladas en grupos comprensibles y coherentes:

1. **Principio de Birkhoff (Pregnancia / Simplicidad):** Una forma es más pregnante cuanto mayor es su regularidad, simetría, simplicidad y cohesión. El ojo busca siempre la interpretación más sencilla.
2. **Ley de Región Común:** Elementos delimitados dentro de un mismo espacio o contenedor (ej. dentro de una card con borde o fondo diferenciado) son percibidos como un grupo unificado.
3. **Ley de Frente y Fondo (Figura-Fondo):** La percepción humana separa naturalmente el plano del objeto principal (frente) del plano de soporte (fondo). Requiere suficiente contraste.
4. **Ley de Similitud:** Elementos que comparten características visuales (mismo color, forma, tamaño u orientación) se interpretan como parte de un mismo grupo o con la misma función.
5. **Ley de Continuidad:** Los elementos ordenados en líneas o curvas inducen al ojo a seguir el recorrido visual de forma fluida.
6. **Ley de Proximidad:** Objetos físicamente cercanos entre sí se perciben como relacionados o pertenecientes al mismo grupo lógico.
7. **Ley de Cierre (*Closure*):** Si una figura no está completamente cerrada, el cerebro tiende a rellenar mentalmente los espacios faltantes para percibir una forma reconocible.
8. **Ley de Conectividad Uniforme:** Elementos unidos por líneas explícitas se perciben con una relación más fuerte que elementos con similar color o forma pero sin conectar.

---

## 5. Las 21 Leyes de UX (Jon Yablonski)

```
[21 Leyes de UX]
 ├── Percepción y Decisión: Estética, Hick, Miller, Occam, Pareto
 ├── Tiempo y Rendimiento: Doherty, Fitts, Parkinson
 ├── Expectativas: Jakob, Postel, Tesler
 ├── Agrupamiento y Gestalt: Región Común, Proximidad, Similitud, Prägnanz, Conectividad
 └── Memoria y Psicología: Goal-Gradient, Pico-Final, Posición Serial, Von Restorff, Zeigarnik
```

1. **Efecto de Usabilidad Estética:** Los usuarios perciben diseños estéticamente atractivos como diseños intrínsecamente más usables y son más tolerantes ante fallas menores.
2. **Umbral Doherty:** La productividad del usuario se maximiza cuando el sistema responde en menos de **400 ms**; si supera ese umbral, la atención se dispersa.
3. **Ley de Fitts:** El tiempo para alcanzar un objetivo depende de la distancia hacia él y de su tamaño ($T = a + b \log_2(2D/W)$). Botones de acción clave deben ser amplios y cercanos al cursor/dedo.
4. **Efecto Goal-Gradient:** La motivación y velocidad para completar una tarea aumentan a medida que el usuario se percibe más cerca de la meta (efectivo en wizards con barras de progreso).
5. **Ley de Hick:** El tiempo para tomar una decisión crece logarítmicamente con la cantidad y complejidad de las opciones ($T = b \log_2(n + 1)$). Menos opciones = decisión más rápida.
6. **Ley de Jakob:** Los usuarios pasan la mayor parte de su tiempo en otros sitios; esperan que tu interfaz funcione igual a las que ya dominan.
7. **Ley de la Región Común:** El confinamiento dentro de límites visuales (bordes, fondos) genera percepción inmediata de pertenencia compartida.
8. **Ley de Proximidad:** La distancia física reducida entre elementos comunica relación semántica directa.
9. **Ley de Prägnanz:** El cerebro procesa formas ambiguas o complejas reduciéndolas a la interpretación más simple posible.
10. **Ley de Similitud:** Elementos idénticos en color/forma comunican identidad funcional.
11. **Ley de Conectividad Uniforme:** Un trazo o conector visual es la forma más poderosa de comunicar vínculo entre entidades.
12. **Ley de Miller:** La memoria de trabajo retiene en promedio $7 \pm 2$ fragmentos de información (*chunks*). Obliga a seccionar datos extensos en bloques pequeños.
13. **La Navaja de Occam:** Entre hipótesis o soluciones equivalentes, la más simple con menor cantidad de supuestos o elementos es la correcta.
14. **Principio de Pareto (Regla 80/20):** El 80% de los resultados o del uso real proviene del 20% de las funcionalidades o causas. Diseñar optimizando ese 20% crítico.
15. **Ley de Parkinson:** El tiempo invertido en una tarea se expande hasta consumir todo el tiempo disponible fijado para ella.
16. **Regla del Pico-Final (*Peak-End Rule*):** La evaluación retrospectiva de una experiencia depende del momento más intenso (positivo o negativo) y del desenlace final, no del promedio acumulado.
17. **Ley de Postel (Principio de Robustez):** *"Sé liberal en lo que aceptas y conservador en lo que envías."* Aceptar entradas de usuario en diversos formatos (limpiando espacios, formatos de fecha, etc.) mientras la salida de la interfaz es estricta.
18. **Efecto de Posición Serial:** Se retienen con mayor facilidad el primer elemento (*efecto primacía*) y el último (*efecto recencia*) de una lista; los del medio se olvidan rápidamente.
19. **Ley de Tesler (Conservación de la Complejidad):** En cualquier sistema existe una cuota fija de complejidad no reducible; si el sistema no la asume mediante automatización, se traslada forzosamente al usuario.
20. **Efecto Von Restorff (Aislamiento):** Ante múltiples elementos similares, el elemento que contrasta o difiere visualmente es el más recordado (clave para llamadas a la acción / CTA).
21. **Efecto Zeigarnik:** Las tareas incompletas o interrumpidas generan tensión cognitiva y se recuerdan con mayor intensidad que las concluidas.

---

## 6. Patrones de Diseño, Jerarquía Visual e Identidad

### 6.1. Patrones Estructurales de UI
- **Breadcrumbs (Migas de Pan):** Jerarquía de navegación secundaria (`Inicio > Categoría > Producto`), reduce clicks y ubica espacialmente al usuario.
- **Fat Footer:** Pie de página amplio con mapa de sitio, enlaces legales, soporte, redes y newsletter; sirve como red de rescate cuando el usuario hace scroll completo sin encontrar lo deseado.
- **Dashboards:** Pantallas de monitoreo compuestas por widgets/cards modulares, métricas de alto nivel en la parte superior y gráficos detallados debajo.
- **Diseño Responsive:** Reorganización fluida y adaptativa de layouts según el viewport (Desktop multi-columna, Tablet 2 columnas, Mobile mono-columna con menú hamburguesa).

### 6.2. Variables de Identidad Visual
- **Tipografía:**
  - *Serif:* Tradición, elegancia, prestigio, formalidad (ideal para lectura de texto largo impreso o marcas clásicas).
  - *Sans-Serif:* Claridad, modernidad, neutralidad y alta legibilidad en pantallas digitales.
  - *Rounded:* Informalidad, cercanía, tono lúdico o amigable.
- **Psicología del Color:**
  - *Azul:* Seguridad, confianza, solidez, neutralidad corporativa.
  - *Dorado / Amarillo cálido:* Lujo, exclusividad, sofisticación.
  - *Rosa / Magenta:* Diversión, creatividad, vitalidad.
- **Border Radius:**
  - `0px` (Esquinas vivas): Rigor, técnica, sobriedad, arquitectura formal.
  - `4px - 8px`: Estándar moderno, neutro y balanceado.
  - `16px+ / Pill (50%)`: Enfoque móvil, amistoso, dinámico, accesible.

### 6.3. Jerarquía Visual Efectiva
> **Regla crítica:** La jerarquía NO se resuelve únicamente alterando el tamaño tipográfico (`font-size`).

Para jerarquizar sin sobrecargar:
1. **Peso tipográfico (*Font Weight*):** Combinar `bold` (títulos) con `regular` (cuerpo).
2. **Contraste de color / Opacidad:** Utilizar negro o texto oscuro para el título principal y tonos atenuados (ej. `#555555` o `opacity: 0.7`) para metadatos o texto secundario.
   > *Advertencia:* Jamás usar texto gris claro sobre fondos claros de color; arruina la accesibilidad (WCAG).
3. **Espaciado en Blanco (*Whitespace*):** El espacio vacío alrededor de un componente aumenta automáticamente su peso visual percibido.

---

## 7. Atomic Design (Brad Frost)

![Atomic Design](images/tema1_atomic_design.png)

Metodología de diseño modular para construir sistemas de diseño escalables:
1. **Átomos:** Componentes indivisibles de la interfaz (etiquetas HTML, inputs, botones, paleta cromática, tokens de espaciado).
2. **Moléculas:** Grupos de átomos que funcionan juntos como una unidad funcional simple (ej. Form Label + Input text + Botón "Buscar").
3. **Organismos:** Estructuras complejas compuestas de moléculas y átomos (ej. Navbar completo, Card de producto con imagen, precio y botón de compra).
4. **Templates:** Disposición estructural de organismos en un layout de página sin contenido real (esqueleto con datos dummy).
5. **Páginas:** Instancias concretas del template pobladas con datos reales finales (donde se valida la efectividad del diseño).

---

## 8. Ciclo del Proceso de Diseño y Entregables

```
[Sketch] ──> [Wireframe] ──> [Mockup] ──> [Prototipo en Alta]
(Boceto)     (Baja fidelidad) (Visual)    (Interactivo navegable)
```

1. **Sketch (Boceto):** Dibujo rápido a mano alzada para explorar conceptos rápidamente con costo cero.
2. **Wireframe (Baja fidelidad):** Guía estructural y funcional en escala de grises. Define layout, arquitectura de información y disposición de elementos sin diseño visual final.
3. **Mockup (Media/Alta fidelidad estática):** Representación visual definitiva con tipografía, colores, iconografía e imágenes finales, pero sin interacción dinámica.
4. **Prototipo en Alta Fidelidad:** Modelo interactivo y navegable (usualmente en herramientas como **Figma**) que simula la experiencia real con transiciones, clicks, microinteracciones y validación con usuarios finales.


---

# Tema 2: Animaciones y Transformaciones en CSS3 y JavaScript

> **Materia:** Interfaces de Usuario e Interacción (TUDAI / UNCPBA)  
> **Fuentes originales:** `Tema2-Animaciones.pdf` (19 diapositivas) y `Tema2-Transformaciones.pdf` (14 diapositivas)  
> **Objetivo:** Guía técnica compacta y de mínima huella de tokens para IA, abarcando conceptos de UX, sintaxis CSS, comparación técnica y fundamentos matemáticos matriciales.

---

## 1. Rol de las Animaciones en la Experiencia de Usuario (UX)

Las animaciones en interfaces no son meramente estéticas; deben tener un **propósito funcional**:
1. **Feedback Visual:** Informan al usuario del resultado de una operación (ej. vibración ante credenciales inválidas, botón que cambia a spinner).
2. **Visibilidad del Estado del Sistema:** Comunican qué está sucediendo en segundo plano (loaders, barras de carga) para evitar que el usuario suponga que la aplicación se congeló.
3. **Guía y Orientación Espacial:** Ayudan al usuario a comprender de dónde provino un elemento y hacia dónde fue (menús laterales deslizantes, modales que emergen desde el botón presionado).
4. **Narrativa / Storytelling:** Enriquecen el recorrido del usuario otorgando dinamismo y naturalidad.

> [!WARNING]
> **Riesgo de sobreuso:** Una animación mal implementada, lenta (> 500 ms) o puramente ornamental pasa de ser vistosa a molesta, distractora y frustrante.

---

## 2. Clasificación de las Animaciones

| Tipo | Definición | Ejemplo de Aplicación |
| :--- | :--- | :--- |
| **Procedurales** | La posición, rotación u orientación de los elementos se calcula dinámicamente mediante código evaluando una función matemática en cada ciclo de ejecución. | Segundero de un reloj con trigonometría; rebote de una pelota mediante ecuaciones cinemáticas. |
| **Por Keyframes** | Basadas en fotogramas clave donde se definen estados intermedios y el motor gráfico interpola los valores restantes. | `@keyframes` en CSS, transiciones de opacidad, transformaciones de escala. |
| **Basadas en Spritesheets** | Cuadros de animación secuenciales integrados en una sola imagen fija, desplazando la propiedad `background-position`. | Animación de personajes en 2D, iconos interactivos complejos. |
| **Basadas en Física** | Modelan leyes del mundo real como gravedad, fricción, velocidad terminal o campos vectoriales de fuerzas. | Simuladores de fluidos, interacción táctil con rebote elástico (*rubber-banding*). |

---

## 3. Transiciones vs. Animaciones en CSS

![Transiciones vs Animaciones](images/tema2_animacion_vs_transicion.png)

| Criterio | Transiciones (`transition`) | Animaciones (`animation`) |
| :--- | :--- | :--- |
| **Disparador (*Trigger*)** | Requieren un cambio explícito de estado (pseudo-clases `:hover`, `:focus`, `:active` o agregado dinámico de clases JS). | Se ejecutan automáticamente al cargar o al asociar la regla, sin necesidad de interacción previa. |
| **Estados** | Solo interpolan entre dos estados: inicial y final (`A -> B`). | Soportan múltiples estados intermedios mediante porcentajes (`0%`, `25%`, `100%`). |
| **Repetición** | Se ejecutan una sola vez por evento de cambio de estado. | Permiten repeticiones finitas o infinitas (`animation-iteration-count: infinite`). |
| **Control de Dirección** | Solo van de ida y vuelta según el estado activo. | Permiten ciclos alternados (`alternate`, `alternate-reverse`). |
| **Casos de uso** | Microinteracciones, cambios de color en botones, expansión de cards. | Spinners de carga continuos, banners animados, efectos complejos autónomos. |

---

## 4. Sintaxis y Propiedades de CSS Transitions

```css
/* Shorthand */
transition: [propiedad] [duración] [función-de-tiempo] [retardo];

/* Ejemplo */
.boton {
  background-color: #007bff;
  transition: background-color 0.3s ease-in-out 0.1s, transform 0.2s ease;
}
.boton:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}
```

### Funciones de Tiempo (*Timing Functions / Easing*)
- `linear`: Velocidad constante de inicio a fin.
- `ease`: Comienza suave, acelera y desacelera al final (comportamiento por defecto).
- `ease-in`: Comienza lento y acelera gradualmente.
- `ease-out`: Comienza rápido y desacelera suavemente al final (ideal para entradas de UI).
- `ease-in-out`: Aceleración inicial y desaceleración final suave.
- `cubic-bezier(x1, y1, x2, y2)`: Curva Bezier personalizada para rebotes o aceleraciones no estándar.

---

## 5. Sintaxis y Propiedades de CSS Animations

```css
/* Definición de Keyframes */
@keyframes pulso {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.15);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Aplicación del shorthand */
.elemento-animado {
  animation: pulso 1.5s ease-in-out 0s infinite alternate;
}
```

### Propiedades Desglosadas
- `animation-name`: Identificador del bloque `@keyframes`.
- `animation-duration`: Duración del ciclo completo (ej. `2s`, `400ms`).
- `animation-timing-function`: Curva de aceleración.
- `animation-delay`: Tiempo de espera antes de comenzar.
- `animation-iteration-count`: Número de repeticiones (ej. `3` o `infinite`).
- `animation-direction`: `normal`, `reverse`, `alternate`, `alternate-reverse`.
- `animation-fill-mode`: Controla los estilos antes y después de ejecutar la animación:
  - `none`: Vuelve al estado base sin aplicar estilos de keyframe fuera del tiempo activo.
  - `forwards`: Conserva los estilos del último keyframe (`100%`) al finalizar.
  - `backwards`: Aplica los estilos del primer keyframe (`0%`) durante el delay inicial.
  - `both`: Aplica `forwards` y `backwards`.
- `animation-play-state`: `running` o `paused` (útil para alternar mediante JavaScript).

---

## 6. Transformaciones CSS 2D (`transform`)

![CSS Translate](images/tema2_css_translate.png)

Las transformaciones modifican el espacio de coordenadas visual del elemento sin alterar el flujo del documento (*layout reflow*), haciéndolas altamente performantes vía GPU.

### Funciones Básicas 2D
1. **Traslación:**
   - `transform: translate(x, y);`
   - `transform: translateX(200px);`
   - `transform: translateY(100px);`
2. **Rotación:**
   - `transform: rotate(45deg);` (valores en grados `deg`, radianes `rad`, o vueltas `turn`).
3. **Escala:**
   - `transform: scale(x, y);` o `transform: scale(factor);` (ej. `scale(2)` duplica el tamaño, `scale(0.5)` reduce a la mitad).
4. **Inclinación / Deformación (*Skew*):**
   - `transform: skew(x-angle, y-angle);`
   - `transform: skewX(25deg);`
   - `transform: skewY(25deg);`

---

## 7. Modelo Matemático Matricial 2D: `matrix(a, b, c, d, e, f)`

![Transform Matrix](images/tema2_transform_matrix.png)

Cualquier combinación de transformaciones 2D se expresa internamente como una matriz afín de $3 \times 3$:

$$\begin{bmatrix} x' \\ y' \\ 1 \end{bmatrix} = \begin{bmatrix} a & c & e \\ b & d & f \\ 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} x \\ y \\ 1 \end{bmatrix}$$

Donde los parámetros en CSS son: `transform: matrix(a, b, c, d, e, f);`
- $a$: Escala horizontal ($s_x$).
- $b$: Inclinación horizontal ($skew_y$).
- $c$: Inclinación vertical ($skew_x$).
- $d$: Escala vertical ($s_y$).
- $e$: Desplazamiento horizontal ($t_x$ o traslación en X).
- $f$: Desplazamiento vertical ($t_y$ o traslación en Y).

### Equivalencias Matriciales Directas
1. **Identidad (Sin cambios):**
   $$\text{matrix}(1, 0, 0, 1, 0, 0)$$
2. **Escala ($s_x, s_y$):**
   $$\begin{bmatrix} s_x & 0 & 0 \\ 0 & s_y & 0 \\ 0 & 0 & 1 \end{bmatrix} \implies \text{matrix}(s_x, 0, 0, s_y, 0, 0)$$
3. **Traslación ($t_x, t_y$):**
   $$\begin{bmatrix} 1 & 0 & t_x \\ 0 & 1 & t_y \\ 0 & 0 & 1 \end{bmatrix} \implies \text{matrix}(1, 0, 0, 1, t_x, t_y)$$
4. **Rotación por ángulo $\theta$:**
   $$\begin{bmatrix} \cos\theta & -\sin\theta & 0 \\ \sin\theta & \cos\theta & 0 \\ 0 & 0 & 1 \end{bmatrix} \implies \text{matrix}(\cos\theta, \sin\theta, -\sin\theta, \cos\theta, 0, 0)$$
5. **Espejado Horizontal (*Flip Horizontal*):**
   $$\begin{bmatrix} -1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix} \implies \text{matrix}(-1, 0, 0, 1, 0, 0)$$
6. **Espejado Vertical (*Flip Vertical*):**
   $$\begin{bmatrix} 1 & 0 & 0 \\ 0 & -1 & 0 \\ 0 & 0 & 1 \end{bmatrix} \implies \text{matrix}(1, 0, 0, -1, 0, 0)$$
7. **Espejado en ambos ejes (Inversión 180°):**
   $$\begin{bmatrix} -1 & 0 & 0 \\ 0 & -1 & 0 \\ 0 & 0 & 1 \end{bmatrix} \implies \text{matrix}(-1, 0, 0, -1, 0, 0)$$

---

## 8. Transformaciones en el Espacio 3D y Prefijos

### Funciones 3D
- `rotate3d(x, y, z, angle)`, `rotateX(deg)`, `rotateY(deg)`, `rotateZ(deg)`.
- `translate3d(x, y, z)`, `translateZ(px)`.
- `scale3d(sx, sy, sz)`.
- `matrix3d(...)`: Matriz de proyección afín $4 \times 4$ (16 argumentos).
- **Entorno 3D:** Requiere definir `perspective: 800px;` en el contenedor padre y `transform-style: preserve-3d;` para mantener la profundidad de los hijos.

### Soporte de Navegadores Histórico (Vendor Prefixes)
```css
.caja {
  -webkit-transform: rotate(45deg); /* Chrome, Safari anterior */
  -moz-transform: rotate(45deg);    /* Firefox anterior */
  -ms-transform: rotate(45deg);     /* IE9 */
  -o-transform: rotate(45deg);      /* Opera anterior */
  transform: rotate(45deg);         /* Estándar actual */
}
```


---

# Tema 3: Teoría del Color, Canvas 2D y Manipulación de Píxeles (ImageData)

> **Materia:** Interfaces de Usuario e Interacción (TUDAI / UNCPBA)  
> **Fuente original:** `Tema3.pdf` (39 diapositivas)  
> **Objetivo:** Documento de referencia técnica y algorítmica para IA, condensando la teoría física del color, la API Canvas 2D de HTML5 y el acceso a bajo nivel de píxeles.

---

## 1. Teoría Física del Color

- **Naturaleza del Color:** El color es luz; radiación electromagnética visible viajando en el espacio con longitudes de onda entre los $380\text{ nm}$ y $750\text{ nm}$.
- **Percepción:** Es un fenómeno psicofísico subjetivo; la retina humana contiene fotorreceptores (conos) sensibles a longitudes de onda cortas (azul), medias (verde) y largas (rojo).

### Síntesis Aditiva vs. Síntesis Sustractiva
![Síntesis de Color](images/tema3_sintesis_color_aditiva_sustractiva.png)

| Característica | Síntesis Aditiva | Síntesis Sustractiva |
| :--- | :--- | :--- |
| **Medio** | Emisores directos de luz (pantallas, monitores, proyectores). | Medios impresos, tintas, pigmentos, pinturas. |
| **Colores Primarios** | **R**ed (Rojo), **G**reen (Verde), **B**lue (Azul). | **C**yan (Cian), **M**agenta (Magenta), **Y**ellow (Amarillo) + Blac**K** (Negro). |
| **Principio físico** | Suma de longitudes de onda lumínicas. | Absorción / sustracción de longitudes de onda reflejadas. |
| **Mezcla total** | $R + G + B = \text{Blanco}$ (`#FFFFFF`). | $C + M + Y = \text{Negro}$ / Marrón oscuro (requiere $K$ para negro puro). |
| **Ausencia total** | Oscuridad total (Negro). | Color del soporte base (normalmente papel Blanco). |

---

## 2. Sistemas de Representación del Color en la Web

1. **RGB / RGBA:**
   - `rgb(red, green, blue)`: Valores enteros entre $0$ y $255$.
   - `rgba(r, g, b, a)`: Añade el canal *Alpha* (opacidad) como número decimal entre $0.0$ (totalmente transparente) y $1.0$ (completamente opaco).
2. **Hexadecimal (`#RRGGBB` / `#RRGGBBAA`):**
   - Base 16 ($0-9, A-F$). Cada par de caracteres representa un canal de 8 bits ($16^2 = 256$ intensidades).
   - Ejemplos: `#FF0000` (Rojo puro), `#00FF00` (Verde), `#0000FF` (Azul), `#00000080` (Negro con 50% de opacidad).
3. **HSL / HSLA:**
   - `H` (*Hue* / Tono): Ángulo en el círculo cromático ($0^\circ$ a $360^\circ$: $0^\circ = \text{rojo}$, $120^\circ = \text{verde}$, $240^\circ = \text{azul}$).
   - `S` (*Saturation* / Saturación): $0\%$ (escala de grises pura) a $100\%$ (color vivo).
   - `L` (*Lightness* / Luminosidad): $0\%$ (negro puro), $50\%$ (tono balanceado), $100\%$ (blanco puro).
   - `A` (*Alpha*): Opacidad de $0.0$ a $1.0$.
4. **Otros espacios:** CMYK (impresión), HSV/HSB (herramientas de diseño), YUV (codificación de video).

---

## 3. HTML5 `<canvas>` y la API `CanvasRenderingContext2D`

![Coordenadas Canvas](images/tema3_canvas_coordenadas.png)

- **Elemento `<canvas>`:** Superficie de mapa de bits definida en HTML mediante `<canvas id="miCanvas" width="800" height="600"></canvas>`.
- **Contexto (`CanvasRenderingContext2D`):** Objeto que provee las funciones y estado de renderizado 2D (`const ctx = canvas.getContext('2d')`).
- **Sistema de Coordenadas:**
  - El origen $(0, 0)$ reside en la **esquina superior izquierda**.
  - El eje $X$ crece hacia la **derecha**.
  - El eje $Y$ crece hacia **abajo**.

### Métodos Principales de Dibujo
```javascript
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// 1. Rectángulos directos
ctx.fillStyle = '#FF0000';
ctx.fillRect(10, 10, 100, 50);   // Rectángulo relleno

ctx.strokeStyle = '#000000';
ctx.lineWidth = 2;
ctx.strokeRect(10, 10, 100, 50); // Borde de rectángulo

ctx.clearRect(20, 20, 30, 20);   // Borra píxeles a transparente

// 2. Trazado de Caminos (Paths) y Círculos
ctx.beginPath();
// arc(x, y, radio, anguloInicial, anguloFinal, antihorario)
ctx.arc(200, 150, 50, 0, Math.PI * 2); 
ctx.fillStyle = 'blue';
ctx.fill();
ctx.closePath();

// 3. Gradientes lineales
const gradient = ctx.createLinearGradient(0, 0, 200, 0);
gradient.addColorStop(0, 'red');
gradient.addColorStop(1, 'yellow');
ctx.fillStyle = gradient;
ctx.fillRect(0, 250, 200, 50);

// 4. Patrones de imagen
const pattern = ctx.createPattern(imgElement, 'repeat');
ctx.fillStyle = pattern;
```

---

## 4. Estructura de Memoria de `ImageData`

![Matriz de Píxeles e ImageData](images/tema3_imagen_digital_matriz_pixels.png)

Una imagen digital es conceptualmente una matriz 2D de píxeles ($ancho \times alto$). Sin embargo, la interfaz `ImageData` almacena los píxeles en memoria como un **arreglo lineal unidimensional continuo (`Uint8ClampedArray`)** donde cada píxel ocupa **4 bytes consecutivos** correspondientes al formato RGBA:

```
Índice de memoria:
[ R0, G0, B0, A0,   R1, G1, B1, A1,   R2, G2, B2, A2, ... ]
  └──── Pixel 0 ────┘  └──── Pixel 1 ────┘  └──── Pixel 2 ────┘
```

### Propiedades y Métodos de `ImageData`
- `ctx.createImageData(width, height)`: Crea un buffer en blanco (inicializado en negro transparente `[0,0,0,0]`).
- `ctx.getImageData(sx, sy, sw, sh)`: Extrae una copia de los datos de píxeles de una región del canvas.
- `ctx.putImageData(imageData, dx, dy)`: Vuelca el buffer de píxeles modificado de regreso sobre el canvas.
- `imageData.width` / `imageData.height`: Dimensiones en píxeles.
- `imageData.data`: Objeto `Uint8ClampedArray` de longitud $ancho \times alto \times 4$. Los valores se limitan automáticamente (*clamped*) entre $0$ y $255$.

### Fórmula de Indexación Bidimensional a Unidimensional
Para acceder al píxel ubicado en la coordenada $(x, y)$ dentro de un área de ancho $W$:

$$\text{index} = (y \times W + x) \times 4$$

- Canal Rojo ($R$): `imageData.data[index]`
- Canal Verde ($G$): `imageData.data[index + 1]`
- Canal Azul ($B$): `imageData.data[index + 2]`
- Canal Alpha ($A$): `imageData.data[index + 3]`

---

## 5. Algoritmos de Procesamiento y Filtros de Imagen

### 5.1. Bucle Estándar de Recorrido de Píxeles
```javascript
function aplicarFiltro(ctx, width, height) {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const totalBytes = data.length;

  for (let i = 0; i < totalBytes; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    // Modificar canales aquí...
  }

  // Devolver los píxeles procesados al canvas
  ctx.putImageData(imageData, 0, 0);
}
```

### 5.2. Filtro de Inversión (Negativo)
Invierte la luminosidad de cada canal restando el valor original a $255$:
$$R' = 255 - R, \quad G' = 255 - G, \quad B' = 255 - B$$

```javascript
data[i]     = 255 - r;
data[i + 1] = 255 - g;
data[i + 2] = 255 - b;
```

### 5.3. Filtro de Brillo
Suma o resta una constante $C$ a los tres canales:
$$R' = \min(R + C, 255), \quad G' = \min(G + C, 255), \quad B' = \min(B + C, 255)$$
*(El tipo `Uint8ClampedArray` restringe automáticamente el desbordamiento menor a 0 o mayor a 255).*

```javascript
const brillo = 40;
data[i]     = r + brillo;
data[i + 1] = g + brillo;
data[i + 2] = b + brillo;
```

### 5.4. Filtro de Escala de Grises
Existen dos variantes teóricas:
1. **Promedio Aritmético Simple:**
   $$G_{simple} = \frac{R + G + B}{3}$$
2. **Ponderación Perceptual Luminosa (Recomendada / ITU-R BT.601):**
   $$G_{perceptual} = 0.299 \times R + 0.587 \times G + 0.114 \times B$$
   *Fundamento:* El ojo humano posee mayor concentración de conos sensibles al espectro verde ($58.7\%$), moderada al rojo ($29.9\%$) y muy baja al azul ($11.4\%$).

```javascript
const gris = 0.299 * r + 0.587 * g + 0.114 * b;
data[i]     = gris;
data[i + 1] = gris;
data[i + 2] = gris;
```

---

## 6. Carga Asíncrona de Imágenes y Restricciones de Seguridad

### Carga Asíncrona Correcta
Las imágenes no están disponibles de inmediato al instanciarlas en JS. Debe esperarse obligatoriamente al evento `onload`:

```javascript
const img = new Image();
img.src = 'mi-imagen.jpg';

img.onload = () => {
  // Ahora que la imagen cargó en memoria, se dibuja en el canvas
  ctx.drawImage(img, 0, 0);
  
  // Ahora es seguro acceder a los píxeles:
  const imgData = ctx.getImageData(0, 0, img.width, img.height);
};
```

### Seguridad del Navegador: "Canvas Tainted" (CORS)
- Por políticas de seguridad de origen cruzado (*Same-Origin Policy*), navegadores como Google Chrome **bloquean llamadas a `getImageData()`** si la imagen proviene de otro dominio o si la página se abre mediante el protocolo directo `file:///` local.
- Si se intenta leer píxeles de un canvas con imagen de origen no verificado, el navegador marca el canvas como "contaminado" (*tainted*) y arroja una excepción de seguridad:
  `DOMException: Failed to execute 'getImageData' on 'CanvasRenderingContext2D': The canvas has been tainted by cross-origin data.`
- **Solución:**
  1. Ejecutar el proyecto siempre sobre un servidor HTTP local (ej. `python3 -m http.server` o extensión Live Server).
  2. Habilitar cabeceras CORS en imágenes externas mediante `img.crossOrigin = "Anonymous";`.


---

# Tema 4: Eventos DOM, HTML5 Drag & Drop y Programación Orientada a Objetos en Canvas

> **Materia:** Interfaces de Usuario e Interacción (TUDAI / UNCPBA)  
> **Fuentes originales:** `Tema4-Eventos.pdf` (12 págs), `Tema4-ParteA.pdf` (17 págs) y `Tema4-ParteB.pdf` (11 págs)  
> **Objetivo:** Documento técnico exhaustivo y de mínima huella de tokens para IA, unificando el modelo de eventos, selectores, la API Drag and Drop y la arquitectura POO con Hit-Testing para interacción gráfica en Canvas.

---

## 1. Paradigma Conducido por Eventos (*Event-Driven*)

![Clasificación de Eventos](images/tema4_clasificacion_eventos.png)

A diferencia del paradigma secuencial tradicional (donde el flujo de ejecución es predecible y unívoco paso a paso), las interfaces de usuario modernas funcionan bajo el **paradigma reactivo o guiado por eventos**:
- El programa permanece a la espera de acciones del usuario o del sistema (*Event Listeners*).
- El orden y la ocurrencia de los *code-paths* están determinados por la naturaleza impredecible de la interacción humana.

### Clasificación de Eventos en el DOM
1. **Eventos del Mouse:** `click`, `dblclick`, `mousedown`, `mouseup`, `mousemove`, `mouseenter`, `mouseleave`, `mouseover`, `mouseout`.
2. **Eventos de Teclado:** `keydown`, `keyup`, `keypress` (información accesible en `event.key` y `event.code`).
3. **Eventos de Página / Ventana:** `DOMContentLoaded` (DOM listo), `load` (recursos e imágenes cargados), `resize`, `scroll`, `unload`.
4. **Eventos de Formulario:** `submit`, `input` (en tiempo real), `change` (al perder foco), `focus`, `blur`.

### Formas de Manejo de Eventos en JavaScript

```javascript
// 1. Inadecuada / Antigua: Inline en HTML (mezcla estructura con lógica)
// <button onclick="handleClick()">Click</button>

// 2. Propiedad del elemento DOM (sobrescribe listeners previos; solo admite uno)
const btn = document.querySelector('#miBoton');
btn.onclick = function(e) { /*...*/ };

// 3. Recomendada / Estándar: addEventListener (admite múltiples manejadores desacoplados)
btn.addEventListener('click', (event) => {
  console.log('Evento click capturado:', event.target);
});

// Manejo masivo con querySelectorAll
document.querySelectorAll('.item-lista').forEach(item => {
  item.addEventListener('mouseenter', (e) => {
    e.target.classList.add('resaltado');
  });
});
```

---

## 2. API HTML5 Drag and Drop

![Flujo Drag and Drop](images/tema4_drag_and_drop_flow.png)

Permite arrastrar y soltar elementos del DOM mediante un protocolo de eventos nativo.

### 2.1. Preparación del Elemento de Origen (*Source*)
Para que un elemento pueda ser arrastrado, debe configurarse el atributo HTML `draggable="true"`.

**Eventos disparados en el elemento origen:**
- `ondragstart`: Se dispara cuando el usuario comienza a arrastrar. Aquí se configuran los datos a transferir mediante el objeto `dataTransfer`.
- `ondrag`: Se ejecuta de forma continua mientras el elemento está en movimiento.
- `ondragend`: Se ejecuta cuando la acción de arrastre finaliza (sea exitosa o cancelada).

### 2.2. Preparación del Contenedor de Destino (*Target*)
**Eventos disparados en el contenedor receptor:**
- `ondragenter`: El elemento arrastrado ingresa en los límites visuales del destino.
- `ondragover`: El elemento se mueve sobre el destino.  
  > [!IMPORTANT]
  > **Requisito mandatorio:** Es obligatorio invocar `event.preventDefault()` en el manejador de `dragover`. Por defecto, los navegadores no permiten soltar elementos; `preventDefault()` habilita la zona de caída.
- `ondragleave`: El elemento abandona los límites del destino.
- `ondrop`: El usuario suelta el elemento sobre el contenedor.

### 2.3. Código Completo de Referencia
```html
<!-- Elemento arrastrable -->
<div id="item-arrastrable" draggable="true">Arrastrame</div>

<!-- Zona de caída -->
<div id="zona-destino">Soltar aquí</div>
```

```javascript
const item = document.getElementById('item-arrastrable');
const dropzone = document.getElementById('zona-destino');

// Origen
item.addEventListener('dragstart', (event) => {
  // Configurar tipo y valor transferido (usualmente el ID del elemento)
  event.dataTransfer.setData('text/plain', event.target.id);
});

// Destino
dropzone.addEventListener('dragover', (event) => {
  // Previene el comportamiento por defecto para habilitar el drop
  event.preventDefault();
});

dropzone.addEventListener('drop', (event) => {
  // Previene que el navegador abra el elemento como enlace/archivo
  event.preventDefault();
  
  // Recuperar el ID del elemento arrastrado
  const idElemento = event.dataTransfer.getData('text/plain');
  const elementoArrastrado = document.getElementById(idElemento);
  
  // Anexar el elemento dentro del nuevo contenedor
  event.target.appendChild(elementoArrastrado);
});
```

---

## 3. Arquitectura Orientada a Objetos (POO) en Canvas 2D

Para gestionar escenas interactivas complejas con múltiples figuras, se implementa una jerarquía de clases que encapsula estado (posición, dimensiones, estilo) y comportamiento (dibujo, hit-testing).

```
          ┌───────────────────────────┐
          │       class Figure        │
          │  posX, posY, fill, ctx    │
          │  draw(), isPointInside()  │
          └─────────────┬─────────────┘
                        │
            ┌───────────┴───────────┐
            ▼                       ▼
┌───────────────────────┐ ┌───────────────────────┐
│      class Rect       │ │     class Circle      │
│  width, height        │ │  radius               │
│  draw(), isPoint...   │ │  draw(), isPoint...   │
└───────────────────────┘ └───────────────────────┘
```

### 3.1. Clase Base: `Figure`
```javascript
class Figure {
  constructor(posX, posY, fill, context) {
    this.posX = posX;
    this.posY = posY;
    this.fill = fill;
    this.context = context;
    this.isHighlighted = false;
  }

  setFill(fill) { this.fill = fill; }
  getFill() { return this.fill; }
  setPosition(x, y) { this.posX = x; this.posY = y; }
  getPosition() { return { x: this.posX, y: this.posY }; }
  setHighlighted(state) { this.isHighlighted = state; }

  draw() {
    this.context.fillStyle = this.fill;
    // Las subclases implementan el trazado específico
  }

  isPointInside(x, y) {
    return false; // Implementado por subclases
  }
}
```

### 3.2. Subclase: `Rect` (Rectángulo)
```javascript
class Rect extends Figure {
  constructor(posX, posY, width, height, fill, context) {
    super(posX, posY, fill, context);
    this.width = width;
    this.height = height;
  }

  draw() {
    super.draw();
    this.context.fillRect(this.posX, this.posY, this.width, this.height);
    
    if (this.isHighlighted) {
      this.context.strokeStyle = '#FF0000';
      this.context.lineWidth = 3;
      this.context.strokeRect(this.posX, this.posY, this.width, this.height);
    }
  }

  // Hit-Testing de Caja Delimitadora (Bounding Box)
  isPointInside(x, y) {
    return (
      x >= this.posX &&
      x <= this.posX + this.width &&
      y >= this.posY &&
      y <= this.posY + this.height
    );
  }
}
```

### 3.3. Subclase: `Circle` (Círculo)
![Hit Test Distancia](images/tema4_hittest_distancia_circulo.png)

```javascript
class Circle extends Figure {
  constructor(posX, posY, radius, fill, context) {
    super(posX, posY, fill, context);
    this.radius = radius;
  }

  draw() {
    this.context.fillStyle = this.fill;
    this.context.beginPath();
    this.context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2);
    this.context.fill();
    this.context.closePath();

    if (this.isHighlighted) {
      this.context.strokeStyle = '#FFD700';
      this.context.lineWidth = 4;
      this.context.beginPath();
      this.context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2);
      this.context.stroke();
      this.context.closePath();
    }
  }

  // Hit-Testing Radial por Distancia Euclidiana
  isPointInside(x, y) {
    const dx = this.posX - x;
    const dy = this.posY - y;
    // d = sqrt(dx^2 + dy^2) <= radio
    return Math.sqrt(dx * dx + dy * dy) <= this.radius;
  }
}
```

---

## 4. Coordenadas del Cursor y Bucle de Renderizado en Canvas

### Cálculo Preciso de Coordenadas de Mouse
Las propiedades globales del mouse (`clientX`, `pageX`, `screenX`) no coinciden con el origen $(0,0)$ del canvas si la página tiene scroll o márgenes. El cálculo moderno y seguro es:

```javascript
function getCanvasMousePos(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: Math.round(event.clientX - rect.left),
    y: Math.round(event.clientY - rect.top)
  };
}
```
*(Nota histórica: En el material se menciona `event.layerX` y `event.offsetX`, los cuales pueden presentar diferencias de compatibilidad en browsers antiguos o ante transformaciones CSS).*

---

## 5. Máquina de Estados para Drag & Drop Interactivo en Canvas

En Canvas, los elementos dibujados no son nodos individuales del DOM; son solo píxeles. Por lo tanto, para arrastrar figuras se debe implementar una **máquina de estados** que gestione:
1. Selección de figura (*Hit-Testing* inverso para respetar Z-index).
2. Arrastre activo en movimiento.
3. Liberación y redibujado completo de la escena.

```javascript
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let figures = [];
let selectedFigure = null;
let isDragging = false;
let dragOffset = { x: 0, y: 0 };

// Función de redibujado global
function redraw() {
  // Limpiar lienzo
  ctx.fillStyle = '#FAFAFA';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Dibujar todas las figuras en orden
  for (let i = 0; i < figures.length; i++) {
    figures[i].draw();
  }
}

// Búsqueda de figura con Hit-Testing en orden inverso (de arriba hacia abajo)
function findClickedFigure(x, y) {
  for (let i = figures.length - 1; i >= 0; i--) {
    if (figures[i].isPointInside(x, y)) {
      return figures[i];
    }
  }
  return null;
}

// 1. MOUSE DOWN: Captura de la figura
canvas.addEventListener('mousedown', (e) => {
  const pos = getCanvasMousePos(canvas, e);
  const clicked = findClickedFigure(pos.x, pos.y);

  if (clicked !== null) {
    isDragging = true;
    selectedFigure = clicked;
    selectedFigure.setHighlighted(true);

    // Calcular offset relativo al punto de agarre para evitar que la figura salte
    const figPos = selectedFigure.getPosition();
    dragOffset.x = pos.x - figPos.x;
    dragOffset.y = pos.y - figPos.y;

    redraw();
  }
});

// 2. MOUSE MOVE: Actualización de coordenadas durante el arrastre
canvas.addEventListener('mousemove', (e) => {
  if (isDragging && selectedFigure !== null) {
    const pos = getCanvasMousePos(canvas, e);
    
    // Asignar nueva posición respetando el offset de agarre inicial
    selectedFigure.setPosition(pos.x - dragOffset.x, pos.y - dragOffset.y);
    
    redraw();
  }
});

// 3. MOUSE UP / MOUSE LEAVE: Liberación de la figura
function endDrag() {
  if (isDragging && selectedFigure !== null) {
    selectedFigure.setHighlighted(false);
    selectedFigure = null;
    isDragging = false;
    redraw();
  }
}

canvas.addEventListener('mouseup', endDrag);
canvas.addEventListener('mouseleave', endDrag);
```


---

