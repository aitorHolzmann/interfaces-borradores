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

