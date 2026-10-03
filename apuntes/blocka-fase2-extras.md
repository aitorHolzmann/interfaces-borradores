# Apunte de Estudio: BLOCKA — Fase 2 (Puntos Extras)

> **Materia:** Diseño de Interfaces / Interfaces de Usuario e Interacción (TUDAI / UNCPBA)  
> **Alumno:** Aitor Holzmann  
> **Tema:** Implementación de los 4 Puntos Extras del Videojuego BLOCKA (Canvas 2D + Vanilla JS + CSS3 Nativo)  
> **Fecha:** Octubre 2026

---

## 1. Contexto y Requerimientos de Cátedra

Para la promoción del Entregable Nº 3 (y obtener la máxima calificación), la consigna de cátedra establece cuatro requerimientos adicionales optativos (*Puntos Extras*):

1. **Selección visual de imagen (Animación de Thumbnails):** Previo a iniciar el nivel, se exhiben las imágenes del banco (thumbnails) y, mediante una animación, se destaca con cuál de ellas se jugará el nivel.
2. **Configuración de cantidad de subimágenes (4, 6 u 8 piezas):** Permitir al usuario configurar si la Blocka se divide en 4, 6 u 8 partes.
3. **Mecánica de "Ayudita":** El usuario puede pedir ayuda para que el sistema ubique y fije correctamente una subimagen no resuelta, sumando una penalización de 5 segundos al temporizador. La subimagen debe quedar visualmente identificable y bloqueada para giros.
4. **Tiempo máximo / Derrota por Timeout:** En niveles avanzados, incorporar un temporizador de tiempo límite. Si el usuario no resuelve el puzzle en ese tiempo, pierde el nivel (desplegando opción de reintentar).

### Restricciones Técnicas Inquebrantables
- **Vanilla JavaScript Puro (ES6):** Cero frameworks ni utilidades (sin React, Vue, jQuery ni bundlers).
- **CSS3 Puro:** Tokens nativos mediante variables `var(--nombre)` de `:root`, orden en 3 partes, flexbox gobernado desde el padre (prohibido `align-self`/`justify-self`).
- **Canvas 2D Nativo:** Manipulación matemática de pixeles, hit-testing geométrico AABB y transformaciones con `save()`, `translate()`, `rotate()`, `drawImage()` y `restore()`.

---

## 2. Arquitectura de Archivos

| Archivo | Tipo | Responsabilidad en la Fase 2 |
|---|---|---|
| [`game.html`](file:///home/facha/Documents/FACU/interfaces-borradores/game.html) | HTML5 | Selector de piezas (4, 6, 8) en el splash, botón `💡 Ayudita (+5s)` en el HUD y reglas actualizadas. |
| [`css/game.css`](file:///home/facha/Documents/FACU/interfaces-borradores/css/game.css) | CSS3 | Estilos de ruleta de thumbnails, selector de piezas, feedback flotante `+5s`, overlays de sorteo/derrota y adaptación responsive. |
| [`js/blocka/configuracion.js`](file:///home/facha/Documents/FACU/interfaces-borradores/js/blocka/configuracion.js) | JS Data | Objeto `CONFIG_PIEZAS` (4, 6, 8) y atributo `tiempoMaximo` en `NIVELES` (Nivel 1: libre, Nivel 2: 60s, Nivel 3: 45s). |
| [`js/blocka/filtros.js`](file:///home/facha/Documents/FACU/interfaces-borradores/js/blocka/filtros.js) | JS Filtros | Funciones puras de transformación matemática (`escalaDeGrises`, `brillo`, `negativo`). |
| [`js/blocka/Pieza.js`](file:///home/facha/Documents/FACU/interfaces-borradores/js/blocka/Pieza.js) | JS Clase | Estado `bloqueada`, bloqueo de rotación e indicador gráfico en Canvas (marco verde esmeralda y badge circular con `✓`). |
| [`js/blocka/Tablero.js`](file:///home/facha/Documents/FACU/interfaces-borradores/js/blocka/Tablero.js) | JS Clase | Grilla dinámica ($F \times C$), scramble seguro y método `fijarPiezaAleatoria()` para la ayudita. |
| [`js/blocka/blocka.js`](file:///home/facha/Documents/FACU/interfaces-borradores/js/blocka/blocka.js) | JS Orquestador | Orquesta el sorteo animado previo, aplica configuración de piezas, gestiona el botón de ayudita, timer regresivo y pantalla de Game Over. |

---

## 3. Código Explicado Paso a Paso

### 3.1. Extra 1 — Animación Previa de Selección de Imagen (Ruleta Desacelerada)

En lugar de cargar bruscamente el juego, `animarSorteoImagen(callback)` inyecta una grilla con los 6 thumbnails del banco y ejecuta un ciclo de focos que desacelera de manera cuadrática:

```javascript
// js/blocka/blocka.js
animarSorteoImagen(callback) {
  var self = this;
  var contenedor = document.getElementById('game-splash-pantalla');
  
  // 1. Predecir el índice ganador de antemano
  var indiceGanador = Math.floor(Math.random() * BANCO_IMAGENES.length);
  
  // 2. Calcular pasos para asegurar que la ruleta frene EXACTAMENTE en el ganador
  var pasosBase = 18; // 3 vueltas completas de 6 imágenes
  var pasosFaltantes = (indiceGanador - (pasosBase % BANCO_IMAGENES.length) + BANCO_IMAGENES.length) % BANCO_IMAGENES.length;
  var totalPasos = pasosBase + pasosFaltantes;
  var paso = 0;
  var indiceActual = 0;

  function ejecutarPaso() {
    // Quitar foco anterior y encender el actual
    for (var k = 0; k < thumbsElements.length; k++) {
      thumbsElements[k].classList.remove('activo');
    }
    thumbsElements[indiceActual].classList.add('activo');
    paso++;

    if (paso < totalPasos) {
      indiceActual = (indiceActual + 1) % BANCO_IMAGENES.length;
      // Curva de desaceleración: arranca en 45ms y llega hasta ~325ms
      var progreso = paso / totalPasos;
      var delay = 45 + Math.pow(progreso, 2.2) * 280;
      setTimeout(ejecutarPaso, delay);
    } else {
      // Frenó en el ganador: aplicar estilo visual destacado y pausar para asimilación
      thumbsElements[indiceActual].classList.remove('activo');
      thumbsElements[indiceActual].classList.add('ganador');
      subtitulo.textContent = '¡Imagen seleccionada! Preparando tablero...';

      setTimeout(function() {
        overlay.style.opacity = '0';
        setTimeout(function() {
          overlay.remove();
          callback(BANCO_IMAGENES[indiceGanador]); // Iniciar juego con la imagen sorteada
        }, 350);
      }, 700);
    }
  }

  ejecutarPaso();
}
```

### 3.2. Extra 2 — Configuración de Subimágenes (4, 6 u 8 Piezas)

En `configuracion.js` se parametrizan las opciones mediante un objeto data-driven:

```javascript
// js/blocka/configuracion.js
var CONFIG_PIEZAS = {
  4: { filas: 2, columnas: 2 }, // 4 celdas cuadradas de 240x240 px
  6: { filas: 2, columnas: 3 }, // 6 celdas rectangulares de 160x240 px
  8: { filas: 2, columnas: 4 }  // 8 celdas rectangulares de 120x240 px
};
```

La clase `Tablero` calcula dinámicamente las dimensiones garantizando que **todas las celdas sean estrictamente cuadradas** (`anchoCelda === altoCelda`), eliminando el problema de solapamiento en rotaciones de 90°:
```javascript
// js/blocka/Tablero.js
this.tamanoCelda = Math.floor(Math.min(TAMANO_CANVAS / columnas, TAMANO_CANVAS / filas));
this.anchoCelda = this.tamanoCelda;
this.altoCelda = this.tamanoCelda;
this.anchoTotal = this.columnas * this.tamanoCelda;
this.altoTotal = this.filas * this.tamanoCelda;
this.offsetX = Math.floor((TAMANO_CANVAS - this.anchoTotal) / 2);
this.offsetY = Math.floor((TAMANO_CANVAS - this.altoTotal) / 2);
```
Y el hit-testing (`contienePunto`) se evalúa contra las coordenadas fijas del casillero cuadrado en el lienzo:
$$mx \in [x, x + tamanoCelda] \quad \land \quad my \in [y, y + tamanoCelda]$$

### 3.3. Extra 3 — Mecánica de "Ayudita" (+5s y Bloqueo en Canvas)

Cuando el jugador pulsa `💡 Ayudita`:

```javascript
// js/blocka/blocka.js
pedirAyudita() {
  if (!this.jugando || !this.tablero) return;

  // 1. Buscar una pieza desordenada y fijarla
  var piezaFijada = this.tablero.fijarPiezaAleatoria();
  if (!piezaFijada) return;

  // 2. Aplicar penalización de +5 segundos
  this.tiempoTranscurrido += 5;
  if (this.tiempoMaximo !== null) {
    this.tiempoRestante = Math.max(0, this.tiempoRestante - 5);
  }

  // 3. Feedback visual interactivo en el DOM (+5s flotante)
  this.mostrarFeedbackPenalizacion();
  this.actualizarTimerDOM();

  // 4. Redibujar inmediatamente el canvas
  this.redibujar();

  // 5. Verificar derrota por tiempo o victoria si completó el tablero
  if (this.tiempoMaximo !== null && this.tiempoRestante <= 0) {
    this.manejarDerrota();
  } else if (this.tablero.verificarVictoria()) {
    this.verificarYMostrarVictoria();
  }
}
```

En `Pieza.dibujar(ctx)`, se traza la insignia gráfica de la pieza fijada mediante Canvas 2D nativo:

```javascript
// js/blocka/Pieza.js
if (this.bloqueada) {
  ctx.save();
  // 1. Marco perimetral verde
  ctx.strokeStyle = '#4CAF50';
  ctx.lineWidth = 3;
  ctx.strokeRect(this.x + 2, this.y + 2, this.ancho - 4, this.alto - 4);

  // 2. Badge circular distintivo en la esquina superior derecha
  var badgeX = this.x + this.ancho - 14;
  var badgeY = this.y + 14;
  ctx.fillStyle = '#4CAF50';
  ctx.beginPath();
  ctx.arc(badgeX, badgeY, 9, 0, Math.PI * 2);
  ctx.fill();

  // 3. Tilde de verificación
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('✓', badgeX, badgeY);
  ctx.restore();
}
```

### 3.4. Extra 4 — Tiempo Máximo y Derrota por Timeout

En `blocka.js`, el temporizador conmuta entre modo libre (Nivel 1) y cuenta regresiva (Niveles 2 y 3):

```javascript
// js/blocka/blocka.js
iniciarTimer() {
  var self = this;
  this.detenerTimer();

  this.intervalTimer = setInterval(function() {
    self.tiempoTranscurrido++;

    if (self.tiempoMaximo !== null) {
      self.tiempoRestante--;
      self.actualizarTimerDOM();

      // Si el reloj llega a 0, se dispara la derrota
      if (self.tiempoRestante <= 0) {
        self.manejarDerrota();
      }
    } else {
      self.actualizarTimerDOM();
    }
  }, 1000);
}
```

---

## 4. Banco de Preguntas de Examen (Q&A de Coloquio Oral)

### P1: ¿Por qué la ruleta de selección de imagen no se hizo con CSS `@keyframes` o librerías?
> **Respuesta defendible:**  
> Porque la ruleta requiere detenerse exactamente sobre un índice aleatorio generado en tiempo de ejecución. Una animación CSS pura tiene duración y fin estáticos fijados en la hoja de estilos. Resolverlo con `setTimeout` recursivo en JavaScript permite controlar el cálculo matemático de pasos exactos ($N_{\text{base}} + \Delta_{\text{faltante}}$) y aplicar una curva de desaceleración gradual ($\Delta t = 45 + p^{2.2} \times 280\text{ ms}$) que produce un efecto físico natural de inercia (*ease-out*) sin dependencias externas.

### P2: ¿Qué sucede matemáticamente cuando una pieza rectangular (ej. 160×240 en 6 piezas) rota 90°? ¿Cómo se gestiona el solapamiento?
> **Respuesta defendible:**  
> Al rotar $90^\circ$, la subimagen gira alrededor de su centro geométrico `(x + ancho/2, y + alto/2)`. Visualmente, sus dimensiones aparentes se invierten temporalmente a $240 \times 160$, lo que genera un leve solapamiento con las celdas contiguas.  
> Esto es intencional y simula el desorden de un rompecabezas real. Para garantizar una usabilidad sólida:
> 1. El **hit-testing** se calcula sobre el casillero fijo de la grilla ($mx \in [x, x + ancho]$), de modo que el usuario siempre clica el slot correspondiente.
> 2. La cuadrícula (`dibujarGrilla`) se dibuja siempre al final, manteniendo visibles las divisiones del tablero.
> 3. Al llevar la pieza al ángulo correcto ($0^\circ$), encaja de forma subpíxel sin ningún desborde.

### P3: ¿Por qué cada pieza almacena su recorte en un elemento `<canvas>` auxiliar y no en un `ImageData` directo?
> **Respuesta defendible:**  
> Porque el método `putImageData()` de la API Canvas 2D **ignora deliberadamente la matriz de transformación del contexto** (`translate`, `rotate`, `scale`). Si quisiéramos rotar un `ImageData` directamente, tendríamos que recalcular manualmente trigonometría pixel por pixel.  
> Al guardar el recorte en un mini-canvas auxiliar, podemos usar `drawImage(miniCanvas, -w/2, -h/2)`, el cual sí respeta `ctx.rotate()` y aprovecha la aceleración por hardware del motor gráfico del navegador.

### P4: ¿Por qué no se usó `localStorage` para guardar partidas perdidas?
> **Respuesta defendible:**  
> Siguiendo el principio de integridad de datos y las reglas del juego, un récord de tiempo solo es válido si el objetivo fue completado con éxito. Si el jugador pierde por tiempo límite, no hay victoria que homologar; el sistema solo ofrece "Reintentar Nivel" para estimular el ciclo de revancha (*feedback loop positivo*).

---

## 5. Fundamentos Teóricos de Diseño y UX

- **Heurística de Nielsen Nº 1 (Visibilidad del estado del sistema):**
  - La ruleta anticipa exactamente qué imagen se jugará antes de empezar, sincronizada al 100% con la imagen cargada.
  - La pieza fijada por "Ayudita" muestra marco verde y badge con tilde `✓`.
  - El temporizador muestra la cuenta regresiva explícita (`⏳ 28s / 50s`) y titila en rojo (`.tiempo-urgente`) en los últimos 10 segundos sólo si el Modo Contrarreloj está activo.
  - El flotador `+5s` en rojo explica inmediatamente al usuario por qué el reloj se incrementó tras pedir ayuda.
- **Heurística de Nielsen Nº 3 (Control y libertad del usuario):**
  - Botón "← Salir" en el HUD que permite abandonar una partida en cualquier momento.
  - Los botones "Volver al Menú" en pantallas de victoria y derrota retornan al menú inicial del propio juego (splash interactivo), sin expulsar al usuario fuera de la página.
- **Heurística de Nielsen Nº 5 (Prevención de errores) & Ley de Fitts:**
  - Separación espacial en el HUD: el botón "← Salir" se ubica en el extremo izquierdo y "💡 Ayudita" en el extremo derecho, intercalando los badges informativos de nivel, timer y récord. Esto previene clics accidentales no deseados.
  - Jerarquía visual diferenciada: "💡 Ayudita" es una acción principal con costo visible, mientras que "← Salir" es un botón secundario discreto.
  - Diálogo de confirmación preventivo si el jugador intenta salir con una partida en curso.
- **Ley de Hick y Carga Dinámica:**
  - Los niveles encapsulan su propia dificultad (grilla de piezas, filtro y tiempo límite). El menú los renderiza dinámicamente desde JS con una lista scrolleable clara y un switch opcional para activar o no el "Modo Contrarreloj".
- **Ley de la Buena Continuidad y Cierre (Gestalt):**
  - El cerebro del jugador reconoce los fragmentos rotados de la imagen e intenta mentalmente "cerrar" la figura antes de girar cada pieza.

---

## 6. Guion de Defensa Oral (Pitch de 1 minuto)

> *"Buenas tardes, profesores. En esta versión perfeccionamos los aspectos de arquitectura y experiencia de usuario del juego Blocka:*
> 
> *Primero, la **selección de imagen por ruleta** desacelera y frena de manera estrictamente sincronizada con la imagen que entra al puzzle mediante cálculo modular determínistico.*  
> *Segundo, la **lógica de piezas y grillas está encapsulada en cada nivel**, cargándose dinámicamente en el menú de inicio mediante tarjetas scrolleables que informan dimensiones, filtro, tiempo y récord.*  
> *Tercero, desacoplamos el **Modo Contrarreloj**: es un switch opcional en el menú. Si se activa, cada nivel ejecuta su propio tiempo máximo con derrota por timeout; si no, se juega relajado por tiempo transcurrido.*  
> *Y cuarto, aplicamos las **Heurísticas de Nielsen Nº 3 y Nº 5**: agregamos un botón de salida en el HUD ubicado al extremo opuesto de la Ayudita para evitar toques accidentales por Ley de Fitts, con confirmación de abandono, y los botones de volver al menú regresan al selector interno del juego sin recargar ni salir de la página.*  
> 
> *Todo el código es modular, 100% JavaScript Vanilla y CSS3 puro con variables nativas."*
