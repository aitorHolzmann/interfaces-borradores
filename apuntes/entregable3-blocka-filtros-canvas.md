# Apunte de Estudio: BLOCKA — Juego de Rompecabezas y Filtros en Canvas 2D

> **Materia:** Diseño de Interfaces / Interfaces de Usuario e Interacción (TUDAI / UNCPBA)  
> **Alumno:** Aitor Holzmann  
> **Tema:** Entregable Nº 3 — Implementación Completa de Blocka, Filtros Matemáticos con ImageData y Puntos Extras  
> **Fecha:** Octubre 2026  

---

## 1. Contexto y Requerimientos de Cátedra

El Entregable Nº 3 requiere desarrollar sobre la plataforma web existente un videojuego 2D interactivo utilizando **HTML5 Canvas**, **JavaScript Vanilla** y **CSS3 nativo**, aplicando procesamiento matemático de imágenes a nivel de píxeles y buenas prácticas de interacción usuario-máquina.

### 1.1. Requerimientos Base (Consigna Oficial)
1. **Mecánica Central del Juego:**
   - La imagen seleccionada se divide en subimágenes cuadradas (por defecto una grilla de $2 \times 2$ o configurable).
   - Cada subimagen inicia con una orientación angular aleatoria ($0^\circ, 90^\circ, 180^\circ, 270^\circ$). Al menos dos piezas deben comenzar desordenadas.
   - **Interacción del usuario:**
     - **Clic izquierdo:** Rota la subimagen $90^\circ$ en sentido **antihorario**.
     - **Clic derecho:** Rota la subimagen $90^\circ$ en sentido **horario** (cancelando el menú contextual nativo mediante `e.preventDefault()`).
2. **Filtros Matemáticos sobre ImageData:**
   - Durante la configuración del juego, la imagen se procesa píxel por píxel manipulando el arreglo unidimensional `Uint8ClampedArray` (`data` de 4 canales: R, G, B, A).
   - **Escala de Grises:** Ponderación perceptual ITU-R BT.601 ($Y = 0.299R + 0.587G + 0.114B$).
   - **Brillo:** Multiplicación porcentual por un factor constante ($C' = C \times 1.3$).
   - **Negativo:** Inversión cromática ($C' = 255 - C$).
   - **Filtros Mixtos:** Posibilidad de aplicar diferentes filtros a cada subimagen del tablero de forma independiente.
3. **Revelación de Imagen Original:**
   - Al resolver la última pieza, el juego detiene el tiempo y **revela la imagen original completa a todo color (RGB sin filtro)** sobre el área del rompecabezas.
4. **Temporizador y Persistencia de Récords:**
   - Medición de tiempo transcurrido en segundos.
   - Almacenamiento persistente del mejor tiempo por nivel mediante `localStorage`.

### 1.2. Puntos Extras Implementados (Promoción Máxima)
1. **Extra 1 — Ruleta de Thumbnails:** Animación previa desacelerada con ciclo de focos sobre el banco de imágenes que frena exactamente en la imagen sorteada.
2. **Extra 2 — Configuración de Subimágenes (4, 6 y 8 Piezas):** Cada nivel encapsula su propia cantidad de subimágenes y dimensiones de grilla (Nivel 1 con 4 piezas, Nivel 2 con 6 piezas, Nivel 3 con 8 piezas).
3. **Extra 3 — Mecánica de "Ayudita":** Resuelve y bloquea una pieza desordenada, sumando una penalización de 5 segundos. La pieza queda destacada en el Canvas con un marco verde esmeralda y un badge circular distintivo "OK".
4. **Extra 4 — Modo Contrarreloj y Derrota por Timeout:** Posibilidad de activar tiempo límite por nivel con cuenta regresiva en el HUD (`⏳`), alerta visual urgente en los últimos 10 segundos y pantalla de Game Over con opción de reintentar.

---

## 2. Arquitectura de Archivos

| Archivo | Rol y Responsabilidad |
|---|---|
| [`blocka.html`](file:///home/facha/Documents/FACU/interfaces/interfaces-borradores/blocka.html) | Estructura semántica, viewport de Canvas dentro del splash, controles del HUD, instrucciones y galería con capturas reales de Blocka. |
| [`css/game.css`](file:///home/facha/Documents/FACU/interfaces/interfaces-borradores/css/game.css) | Estilos del splash menu, HUD interactivo, animaciones de sorteo, overlays de victoria y derrota, y reglas responsive mobile-first. |
| [`js/blocka/configuracion.js`](file:///home/facha/Documents/FACU/interfaces/interfaces-borradores/js/blocka/configuracion.js) | Constantes del juego, banco de imágenes y arreglo `NIVELES` data-driven con definición de piezas (4, 6 y 8), grilla, filtros y tiempos límites. |
| [`js/blocka/filtros.js`](file:///home/facha/Documents/FACU/interfaces/interfaces-borradores/js/blocka/filtros.js) | Funciones puras de procesamiento de píxeles: `escalaDeGrises`, `brillo`, `negativo` y `filtroMixto`. |
| [`js/blocka/Pieza.js`](file:///home/facha/Documents/FACU/interfaces/interfaces-borradores/js/blocka/Pieza.js) | Clase individual para cada subimagen: posición $(x, y)$, ángulo, rotación matricial con `save()`, `translate()`, `rotate()` y `restore()`, hit-test geométrico AABB y dibujo del badge de ayudita. |
| [`js/blocka/Tablero.js`](file:///home/facha/Documents/FACU/interfaces/interfaces-borradores/js/blocka/Tablero.js) | Gestión de la grilla de celdas cuadradas, recorte de subimágenes en mini-canvas individuales, aplicación de filtros por subimagen, verificación de victoria y fijación de piezas para la ayudita. |
| [`js/blocka/blocka.js`](file:///home/facha/Documents/FACU/interfaces/interfaces-borradores/js/blocka/blocka.js) | Orquestador principal (`JuegoBlocka`): controla ciclo de vida, eventos del mouse, animación de ruleta, inicialización según el nivel, temporizador, persistencia en `localStorage` y overlays. |

---

## 3. Código Explicado Paso a Paso

### 3.1. Procesamiento de Píxeles con ImageData (`js/blocka/filtros.js`)

En la cátedra se enfatiza la manipulación del array unidimensional `Uint8ClampedArray` obtenido a través de `ctx.getImageData()`. Cada píxel ocupa 4 posiciones consecutivas: `[R, G, B, A]`.

```javascript
/* ESCALA DE GRISES CON PONDERACION PERCEPTUAL ITU SEGUN TEMA */
function escalaDeGrises(imageData) {
  var data = imageData.data;
  for (var i = 0; i < data.length; i += 4) {
    var gris = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    data[i]     = gris;
    data[i + 1] = gris;
    data[i + 2] = gris;
  }
  return imageData;
}

/* FILTRO MIXTO POR SUBIMAGEN SEGUN CONSIGNA */
function filtroMixto(imageData, fila, columna, indice) {
  var listaFiltros = [
    escalaDeGrises,
    function(d) { return brillo(d, 1.3); },
    negativo
  ];
  var indiceElegido = (typeof indice === 'number') ? (indice % listaFiltros.length) : 0;
  return listaFiltros[indiceElegido](imageData);
}
```

### 3.2. Transformaciones Matriciales y Rotación de Subimágenes (`js/blocka/Pieza.js`)

Para rotar una subimagen alrededor de su centro sin deformar el lienzo global, se traslada el origen al centro de la pieza, se rota el sistema de coordenadas y se dibuja centrada en el origen local:

```javascript
/* DIBUJO DE LA PIEZA CON ROTACION MATRICIAL SEGUN TEMA */
dibujar(ctx) {
  var centroX = this.x + this.ancho / 2;
  var centroY = this.y + this.alto / 2;

  ctx.save();
  ctx.translate(centroX, centroY);
  ctx.rotate(this.angulo * Math.PI / 180);
  ctx.drawImage(this.imagen, -this.ancho / 2, -this.alto / 2, this.ancho, this.alto);
  ctx.restore();

  /* INDICADOR VISUAL DE PIEZA FIJA BLOQUEADA POR AYUDITA SEGUN EXTRA */
  if (this.bloqueada) {
    ctx.save();
    ctx.strokeStyle = '#00E676';
    ctx.lineWidth = 3;
    ctx.strokeRect(this.x + 2, this.y + 2, this.ancho - 4, this.alto - 4);

    var radioBadge = 11;
    var badgeX = this.x + this.ancho - radioBadge - 5;
    var badgeY = this.y + radioBadge + 5;

    ctx.beginPath();
    ctx.arc(badgeX, badgeY, radioBadge, 0, Math.PI * 2);
    ctx.fillStyle = '#00E676';
    ctx.fill();
    ctx.closePath();

    ctx.fillStyle = '#0A0C0A';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('OK', badgeX, badgeY);
    ctx.restore();
  }
}
```

### 3.3. Detección de Clic y Hit-Testing Geométrico AABB

El método `contienePunto(mx, my)` comprueba matemáticamente si las coordenadas del ratón caen dentro del área rectangular de la pieza:

$$\text{contienePunto}(mx, my) \iff (x \le mx \le x + \text{ancho}) \land (y \le my \le y + \text{alto})$$

```javascript
/* CALCULA COORDENADAS DEL MOUSE EN EL CANVAS */
obtenerCoordenadasMouse(evento) {
  var rect = this.canvas.getBoundingClientRect();
  var escalaX = this.canvas.width / rect.width;
  var escalaY = this.canvas.height / rect.height;

  return {
    x: (evento.clientX - rect.left) * escalaX,
    y: (evento.clientY - rect.top) * escalaY
  };
}
```

---

## 4. Banco de Preguntas de Examen (Q&A de Coloquio Oral)

### P1: ¿Por qué cada pieza almacena su recorte en un elemento `<canvas>` individual y no en un `ImageData` directo?
> **Respuesta defendible:**  
> Porque la función `putImageData()` de la API 2D de Canvas es una copia de memoria pura que **ignora deliberadamente la matriz de transformación** (`translate`, `rotate`, `scale`). Si quisiéramos rotar un `ImageData` directamente, tendríamos que recalcular manualmente ecuaciones trigonométricas para cada píxel con alto costo computacional. Al almacenar el recorte filtrado en un mini-canvas auxiliar, podemos usar `drawImage(miniCanvas, -w/2, -h/2)`, el cual sí respeta `ctx.rotate()` y se beneficia de la aceleración por GPU del navegador.

### P2: ¿Por qué la fórmula de escala de grises usa los coeficientes 0.299, 0.587 y 0.114 en lugar de un promedio simple $(R+G+B)/3$?
> **Respuesta defendible:**  
> Porque el ojo humano no percibe todos los colores del espectro con la misma sensibilidad. Los conos de la retina humana son notablemente más sensibles a la luz verde (~59%) que a la roja (~30%) y a la azul (~11%). La norma internacional ITU-R BT.601 replica esta sensibilidad fisiológica (luminancia perceptual $Y$), generando una escala de grises con contraste natural y realista que no pierde detalle en zonas verdes o amarillas.

### P3: ¿Cómo se asegura que las subimágenes no se deformen ni desborden el tablero al rotar 90°?
> **Respuesta defendible:**  
> Se garantiza mediante dos decisiones geométricas en `Tablero.js`:  
> 1. Todas las celdas se calculan estrictamente **cuadradas** (`tamanoCelda = Math.min(maxCeldaX, maxCeldaY)`). Al ser $L \times L$, cualquier rotación de $90^\circ, 180^\circ$ o $270^\circ$ ocupa exactamente el mismo espacio físico y no desborda sobre casilleros vecinos.  
> 2. El recorte de la imagen original calcula el aspecto de la grilla ($C/F$) y realiza un recorte proporcional centrado (*cover fit*), evitando estiramientos anamórficos.

### P4: ¿Por qué se utilizó `e.preventDefault()` en el evento `contextmenu`?
> **Respuesta defendible:**  
> Porque en los navegadores el clic derecho despliega de forma predeterminada el menú contextual del sistema. Para utilizar el clic derecho como mecánica de juego (rotación horaria), es mandatorio interceptar `contextmenu` y cancelar su comportamiento por defecto con `e.preventDefault()`.

---

## 5. Fundamentos Teóricos de Diseño y UX

- **Heurística de Nielsen Nº 1 (Visibilidad del estado del sistema):**  
  El temporizador refleja constantemente el progreso en segundos. En el Modo Contrarreloj muestra tiempo restante sobre tiempo total (`⏳ 35s / 50s`) y activa una alerta visual roja intermitente en los últimos 10 segundos. La pieza fijada por la Ayudita queda marcada con borde esmeralda y badge "OK".
- **Heurística de Nielsen Nº 3 (Control y libertad del usuario):**  
  El usuario dispone del botón "← Salir" para retornar al menú de selección en cualquier momento, y de los botones "Volver al Menú" tras una victoria o derrota, sin recargar la página.
- **Heurística de Nielsen Nº 5 (Prevención de errores) y Ley de Fitts:**  
  Los botones "← Salir" y "💡 Ayudita" están espacialmente separados en los extremos del HUD para impedir toques accidentales. Salir requiere confirmación cuando una partida está en curso.
- **Ley de Hick:**  
  La selección de dificultad en el menú agrupa claramente cada nivel con su configuración fija (cantidad de piezas, dimensiones y filtro) en tarjetas scrolleables, reduciendo la carga cognitiva y evitando opciones redundantes.
- **Leyes de la Gestalt (Cierre y Buena Continuidad):**  
  El usuario percibe visualmente los fragmentos desorientados de la imagen e intenta mentalmente "cerrar" la continuidad espacial de la fotografía para inferir los giros correctos.

---

## 6. Pitch / Guion de Defensa Oral (1 minuto)

> *"Buenas tardes, profesores. Para el Entregable Nº 3 implementamos el videojuego de rompecabezas Blocka cumpliendo al 100% las restricciones técnicas: JavaScript Vanilla puro, CSS3 nativo y HTML5 Canvas 2D sin ninguna librería externa.*
> 
> *A nivel gráfico, manipulamos directamente el arreglo `Uint8ClampedArray` de `ImageData` para aplicar filtros matemáticos a nivel de píxel: Escala de Grises con ponderación perceptual ITU-R BT.601, Brillo porcentual, Negativo cromático y un algoritmo de Filtros Mixtos que alterna transformaciones en cada subimagen.*
> 
> *Para las rotaciones, encapsulamos cada recorte en un mini-canvas auxiliar y aplicamos transformaciones matriciales con `translate()` y `rotate()`, preservando una grilla estrictamente cuadrada que previene solapamientos. Al resolver la última pieza, el sistema revela instantáneamente la imagen original completa en RGB sin filtros.*
> 
> *Además, completamos los cuatro puntos extras de la cátedra: la ruleta de thumbnails desacelerada sincrónica, la configuración de subimágenes en 4, 6 u 8 piezas, la mecánica de Ayudita con penalización de 5 segundos y badge visual en Canvas, y el Modo Contrarreloj con cuenta regresiva y pantalla de Game Over con revancha.*
> 
> *Todo el diseño respeta las heurísticas de Nielsen y las leyes de Fitts y Gestalt vistas en la teoría."*

