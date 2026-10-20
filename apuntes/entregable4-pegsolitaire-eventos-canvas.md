# Apunte de Estudio: PEG SOLITAIRE — Videojuego en Canvas 2D con MVC y Drag & Drop

> **Materia:** Diseño de Interfaces / Interfaces de Usuario e Interacción (TUDAI / UNCPBA)  
> **Alumno:** Aitor Holzmann  
> **Tema:** Entregable Nº 4 — Implementación Completa de Peg Solitaire (Canvas 2D nativo, Patrón MVC, Drag & Drop interactivo, Hit-Testing Radial, Hints Animados obligatorios, Selector de Skins y Temporizador)  
> **Fecha:** Octubre 2026  

---

## 1. Contexto y Requerimientos de Cátedra

El Entregable Nº 4 consiste en desarrollar el clásico juego de tablero **Peg Solitaire** (Solitario Inglés de 33 casillas) integrado en la plataforma web de la materia, cumpliendo con restricciones técnicas estrictas: **HTML5 semántico**, **CSS3 puro**, **JavaScript Vanilla** y **Canvas 2D nativo** (`CanvasRenderingContext2D`), con **prohibición total de librerías externas o motores de juegos** (Phaser, Pixi.js, etc.).

### 1.1. Requerimientos Obligatorios de la Cátedra
1. **Tablero con imagen temática de fondo:** Textura táctica militar de alta fidelidad que enmarca la grilla clásica de 33 casilleros.
2. **Fichas con imágenes temáticas (Cero colores planos):** Fichas renderizadas mediante `ctx.drawImage` a partir de recursos gráficos circulares (`assets/images/pegsolitaire/`). Prohibido usar círculos con colores sólidos planos para representar las piezas.
3. **Mecánica Drag and Drop nativa en Canvas:**
   - Selección de fichas mediante `mousedown`, arrastre fluido continuo con `mousemove` y caída/soltado mediante `mouseup`.
   - **Hints animados obligatorios:** Al seleccionar o arrastrar una ficha, se deben iluminar y animar en tiempo real los casilleros legales de destino (aro pulsante con función sinusoidal periódica y flecha indicadora flotante oscilante).
4. **Lógica matemática de Peg Solitaire:**
   - Salto ortogonal estricto de exactamente 2 casillas (arriba, abajo, izquierda, derecha; prohibidas diagonales).
   - Debe existir una ficha intermedia adyacente que es comida y eliminada del tablero.
   - La casilla destino debe ser válida y estar vacía.
5. **Detección automática de fin de partida:**
   - Se evalúa tras cada movimiento legal.
   - **Victoria:** Queda exactamente 1 sola ficha en el tablero (idealmente en la casilla central 3,3).
   - **Derrota / Game Over:** No quedan más saltos posibles en todo el tablero y hay más de 1 ficha, o se agota el tiempo límite.
6. **Mecánica de retorno ante soltado inválido:** Si la ficha se suelta en una posición no permitida o en el vacío, retorna instantáneamente a su coordenada original sin alterar el estado del juego.
7. **Temporizador con límite y botón de reinicio:** Cuenta regresiva desde 03:00 (180 segundos) con alerta visual de advertencia y botón visible para reiniciar la partida en cualquier momento.
8. **Selector de Skins (Tipos de Fichas):** Posibilidad de alternar en tiempo real entre al menos 3 diseños visuales temáticos (Medallas Militares, Granadas Tácticas, Insignias de Rango).
9. **Integración web estricta:** Canvas Full HD nativo sin scroll (`800x500 px`) alojado en `pegsolitaire.html`, con sección informativa, controles con mouse, comentarios y migas de pan funcionales.
10. **Comentarios pedagógicos para coloquio:** Todos los métodos comentados en español explicando qué hacen y por qué.

---

## 2. Arquitectura de Archivos y Patrón MVC

El desarrollo se estructuró bajo el patrón de diseño **Modelo-Vista-Controlador (MVC)** para garantizar un desacoplamiento absoluto entre la lógica matemática del juego, el renderizado gráfico en el Canvas y la captura de eventos del mouse.

```text
/
├── pegsolitaire.html                   # Sala de juego: Canvas 800x500, HUD, modal y scripts
├── css/
│   ├── variables.css                   # Tokens de diseño (:root, colores militares, radios)
│   └── game.css                        # Estilos de HUD, selector de skins, modal de fin y canvas
├── js/
│   ├── api.js                          # Utilidades y simulación de API
│   ├── main.js                         # Eventos globales y comentarios interactivos
│   └── pegsolitaire/                   # Módulo autocontenido MVC
│       ├── configuracion.js            # Constantes, grilla 7x7, skins, tiempos y estados
│       ├── SolitaireModel.js           # MODELO: Lógica matemática 7x7 pura (sin DOM ni Canvas)
│       ├── Ficha.js                    # ENTIDAD: Coordenadas, imagen, arrastre y hit-testing de agarre
│       ├── Casillero.js                # ENTIDAD: Coordenadas fijas, hit-testing de caída y hints animados
│       ├── TableroView.js              # VISTA: Renderizado por capas (fondo, ranuras, hints, fichas, bajas)
│       └── pegsolitaire.js             # CONTROLADOR: Eventos mouse, loop rAF, timer, HUD, modal y tests
└── assets/
    └── images/
        └── pegsolitaire/               # Banco de recursos gráficos temáticos
            ├── tablero-bg.png          # Textura/fondo del tablero circular (500x500)
            ├── ficha-medalla.png       # Skin 1: Medalla militar dorada (100x100)
            ├── ficha-granada.png       # Skin 2: Granada táctica (100x100)
            └── ficha-insignia.png      # Skin 3: Insignia de rango táctico (100x100)
```

### Tabla de Responsabilidades

| Componente MVC | Archivo | Responsabilidad Concreta |
|---|---|---|
| **Configuración** | `configuracion.js` | Dimensiones del canvas ($800 \times 500$), offsets ($183, 33$), paso de celda ($62\text{px}$), radios ($24\text{px}, 22\text{px}$), matriz `TABLERO_INICIAL` y catálogo `SKINS_FICHAS`. |
| **Modelo** | `SolitaireModel.js` | Matriz lógica bidimensional de $7 \times 7$, validación ortogonal de saltos, conteo de piezas, detección de movimientos posibles y evaluación de victoria. |
| **Entidad Ficha** | `Ficha.js` | Almacena coordenadas $(x, y)$, anclaje original, estado `isDragging`, recorte circular con `ctx.clip()` y Hit-Testing radial euclidiano de agarre. |
| **Entidad Casillero** | `Casillero.js` | Almacena posición fija, Hit-Testing radial de soltado con tolerancia de 1.25x (Ley de Fitts) y animación de Hints (aro sinusoidal y flecha flotante). |
| **Vista** | `TableroView.js` | Gestor de capas en Canvas 2D: fondo, textura circular `tablero-bg.png`, 33 casilleros, hints, fichas estáticas, ficha arrastrada en Z-Index superior, panel de bajas y telemetría. |
| **Controlador** | `pegsolitaire.js` | Orquesta Modelo y Vista: conversión de coordenadas de mouse con `getBoundingClientRect`, bucle continuo a 60fps con `requestAnimationFrame`, temporizador de 03:00, selector de skins, modales y hooks de testeo por URL. |

---

## 3. Código Explicado Paso a Paso

### 3.1. Modelo Matemático Puro (`SolitaireModel.js`)

El modelo representa el tablero mediante una matriz de números enteros:
- `-1`: Casilla bloqueada (esquinas inactivas fuera de la cruz inglesa).
- `0`: Casilla vacía (hueco receptor).
- `1`: Casilla ocupada por una ficha activa.

#### Cálculo de Movimientos Válidos
```javascript
obtenerMovimientosValidos(fila, col) {
  // Si la celda no posee una ficha activa, no tiene saltos posibles
  if (this.obtenerEstado(fila, col) !== ESTADO.FICHA) {
    return [];
  }

  const movimientos = [];
  // 4 direcciones ortogonales cardinales a distancia 2: [deltaFila, deltaCol]
  const direcciones = [
    [-2, 0], // Salto Arriba
    [2, 0],  // Salto Abajo
    [0, -2], // Salto Izquierda
    [0, 2]   // Salto Derecha
  ];

  for (let i = 0; i < direcciones.length; i++) {
    const df = direcciones[i][0];
    const dc = direcciones[i][1];

    const destF = fila + df;
    const destC = col + dc;
    const midF = fila + (df / 2);
    const midC = col + (dc / 2);

    // 1. Destino debe ser casilla válida y estar vacía (0)
    const destinoValido = this.esCasilleroValido(destF, destC) && this.matriz[destF][destC] === ESTADO.VACIO;
    // 2. Casilla intermedia debe tener una ficha activa (1) para comer
    const intermediaValida = this.esCasilleroValido(midF, midC) && this.matriz[midF][midC] === ESTADO.FICHA;

    if (destinoValido && intermediaValida) {
      movimientos.push({
        destFila: destF,
        destCol: destC,
        saltadaFila: midF,
        saltadaCol: midC
      });
    }
  }

  return movimientos;
}
```

---

### 3.2. Hit-Testing Radial y Máscara Circular (`Ficha.js`)

Basado en la **Filmina 10 del Tema 4 de la cátedra**, la detección de clic sobre una entidad circular no se realiza con cajas rectangulares (AABB), sino mediante el **cálculo de distancia euclidiana entre dos puntos**:

$$\text{Distancia} = \sqrt{(x_{ficha} - x_{mouse})^2 + (y_{ficha} - y_{mouse})^2} \le \text{Radio}$$

```javascript
isPointInside(px, py) {
  const dx = this.x - px;
  const dy = this.y - py;
  return Math.sqrt(dx * dx + dy * dy) <= this.radio;
}
```

#### Recorte Circular de la Imagen Temática (`ctx.clip()`)
Para cumplir la exigencia de cero colores planos y asegurar que la imagen de la ficha sea perfectamente circular:
```javascript
dibujar(ctx) {
  ctx.save();

  // Elevación visual cuando se arrastra la pieza
  if (this.isDragging) {
    ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
    ctx.shadowBlur = 14;
    ctx.shadowOffsetY = 8;
  }

  // Definición del trazado circular
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.radio, 0, Math.PI * 2);
  ctx.closePath();

  ctx.save();
  ctx.clip(); // Restringe todo dibujado subsiguiente al círculo

  // Renderizado de la imagen temática sobre el área recortada
  if (this.imagen && this.imagen.complete) {
    ctx.drawImage(
      this.imagen,
      this.x - this.radio,
      this.y - this.radio,
      this.radio * 2,
      this.radio * 2
    );
  }
  ctx.restore(); // Restaura el contexto eliminando el clip

  // Biselado metálico perimetral decorativo
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.radio, 0, Math.PI * 2);
  ctx.strokeStyle = this.isDragging ? '#FF6B00' : '#828E3B';
  ctx.lineWidth = this.isDragging ? 2.5 : 1.5;
  ctx.stroke();

  ctx.restore();
}
```

---

### 3.3. Hints Animados en Tiempo Real (`Casillero.js`)

La consigna exige que mientras una ficha sea arrastrada, se indique explícitamente y con **animación** los posibles lugares válidos de soltado.

Se implementan dos capas de feedback visual guiadas por una función periódica $\sin(\text{timestamp})$:
1. **Aro pulsante sinusoidal:** El radio del círculo oscila dinámicamente $+/- 4\text{px}$ a una frecuencia angular de $0.006\text{ rad/ms}$.
2. **Flecha indicadora flotante:** Triángulo equilátero ámbar que flota verticalmente $+/- 5\text{px}$ a $0.008\text{ rad/ms}$, apuntando hacia el centro del hueco receptor.

```javascript
dibujarHintAnimado(ctx, timestamp) {
  const tiempo = timestamp || performance.now();

  ctx.save();

  // 1. Resplandor interno de la cavidad destino
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.radio * 0.85, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 170, 0, 0.25)';
  ctx.fill();

  // 2. Aro pulsante periódico sinusoidal
  const oscilacion = Math.sin(tiempo * 0.006) * 4;
  const radioHint = this.radio + 3 + oscilacion;

  ctx.beginPath();
  ctx.arc(this.x, this.y, Math.max(radioHint, this.radio), 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255, 170, 0, 0.95)'; // Ámbar táctico de alta visibilidad
  ctx.lineWidth = 3.5;
  ctx.shadowColor = '#FFAA00';
  ctx.shadowBlur = 12;
  ctx.stroke();

  // 3. Flecha flotante oscilante
  const desfasajeY = Math.sin(tiempo * 0.008) * 5;
  const flechaPuntaY = this.y - this.radio - 6 + desfasajeY;

  ctx.fillStyle = '#FFAA00';
  ctx.shadowColor = '#FFAA00';
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.moveTo(this.x, flechaPuntaY + 8);  // Vértice inferior
  ctx.lineTo(this.x - 7, flechaPuntaY);     // Vértice superior izquierdo
  ctx.lineTo(this.x + 7, flechaPuntaY);     // Vértice superior derecho
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}
```

---

### 3.4. Gestor de Capas y Resolución de Canvas (`TableroView.js`)

#### Por qué el Canvas es de $800 \times 500\text{ px}$ y Celdas Cuadradas
El contenedor CSS `#game-splash-pantalla canvas` posee dimensiones fijas de $800 \times 500\text{ px}$. Si se hubiese definido un lienzo de $600 \times 600$, el CSS lo comprimiría verticalmente forzando una relación de aspecto $16:10$, transformando los círculos en elipses y **rompiendo el cálculo de distancia euclidiana**.

Para solucionarlo:
- El canvas nativo mide exactamente $800 \times 500\text{ px}$.
- La grilla simétrica de $7 \times 7$ utiliza pasos estrictamente cuadrados: $\text{pasoX} = \text{pasoY} = 62\text{ px}$.
- Se centra con `offsetX = 183px` y `offsetY = 33px` ($434 \times 434\text{ px}$ de tablero).
- Las franjas laterales de $183\text{ px}$ se utilizan para el **panel de bajas militares** (izquierda) y la **telemetría táctica** (derecha).

#### Orden de Dibujado por Capas (Z-Index en Canvas)
En HTML Canvas no existe la propiedad CSS `z-index`. La profundidad se define exclusivamente por el **orden cronológico de ejecución**: lo último que se dibuja tapa a lo anterior.
1. **Capa 0:** Limpieza del lienzo (`ctx.clearRect`) y fondo oscuro con viñeta.
2. **Capa 1:** Textura circular del tablero militar (`tablero-bg.png`).
3. **Capa 2:** Los 33 casilleros / orificios biselados fijos.
4. **Capa 3:** Hints animados activos si hay una pieza arrastrada.
5. **Capa 4:** Fichas estáticas activas.
6. **Capa 5:** Ficha arrastrada (se dibuja al final para flotar por encima de todas las demás piezas).
7. **Capa 6:** Panel lateral de bajas militares (fichas comidas apiladas estéticamente).
8. **Capa 7:** Telemetría táctica lateral derecha.

---

### 3.5. Controlador, Drag & Drop y Conversión de Mouse (`pegsolitaire.js`)

#### Conversión de Coordenadas con Escalado
Cuando el canvas se adapta a la ventana, las coordenadas `(clientX, clientY)` de la pantalla no coinciden con los píxeles internos del lienzo:
```javascript
obtenerCoordenadasCanvas(e) {
  const rect = this.canvas.getBoundingClientRect();
  const escalaX = this.canvas.width / rect.width;
  const escalaY = this.canvas.height / rect.height;
  return {
    x: (e.clientX - rect.left) * escalaX,
    y: (e.clientY - rect.top) * escalaY
  };
}
```

#### Máquina de Estados del Mouse
- **`mousedown`:**
  - Convierte coordenadas.
  - Ejecuta hit-testing radial en reversa sobre las fichas (`isPointInside`).
  - Si encuentra una ficha:
    - Calcula el offset relativo entre el cursor y el centro de la ficha: `dragOffset = { x: mx - ficha.x, y: my - ficha.y }`.
    - Consulta movimientos legales al Modelo: `modelo.obtenerMovimientosValidos(fila, col)`.
    - Activa los Casilleros receptores en `hintsActivos`.
    - Setea `ficha.isDragging = true`.
- **`mousemove`:**
  - Si hay ficha en arrastre: actualiza su posición `ficha.setPosicion(mx - dragOffset.x, my - dragOffset.y)`.
- **`mouseup`:**
  - Evalúa si el centro de la ficha soltada cayó dentro de alguno de los casilleros válidos con hint (`casillero.contienePunto(ficha.x, ficha.y)`).
  - **Si es destino legal:**
    - El Modelo ejecuta el salto: `modelo.ejecutarMovimiento(origen, destino)`.
    - Se busca la ficha intermedia en el array visual y se transfiere a `fichasComidas`.
    - La ficha se ancla en el nuevo casillero: `ficha.fijarEnCasillero(...)`.
    - Se actualiza el HUD y se comprueba fin de partida (`verificarFinDeJuego()`).
  - **Si NO es destino legal:**
    - Retorno elástico obligatorio: `ficha.restaurarPosicion()`.
  - Se apagan los hints y se resetea `fichaArrastrada = null`.

---

## 4. Banco de Preguntas de Examen (Q&A de Coloquio)

### P1: ¿Por qué separar el Hit-Testing de agarre (`mousedown`) del Hit-Testing de soltado (`mouseup`)?
**Respuesta:**  
Porque cumplen propósitos de interacción completamente diferentes:
1. **Agarre (`mousedown`):** Debe ser estricto y preciso. Lo resuelve la clase `Ficha` con su radio exacto ($24\text{ px}$). Si el usuario hace clic a $26\text{ px}$, no debe activarse para evitar seleccionar una pieza por accidente.
2. **Soltado (`mouseup`):** Debe ser tolerante y perdonador. Lo resuelve la clase `Casillero` con un radio de atracción ampliado al $125\%$ ($27.5\text{ px}$). De acuerdo con la **Ley de Fitts**, esto previene la frustración del usuario al soltar una pieza que cayó apenas desplazada del centro exacto del hueco.

### P2: ¿Cómo se resuelve el Z-Index en Canvas 2D nativo?
**Respuesta:**  
En Canvas 2D no existe la propiedad CSS `z-index`. La profundidad se define por el **orden secuencial de dibujo** en cada cuadro (`TableroView.dibujar`):
- Primero se limpia y se dibuja el fondo y los casilleros.
- Luego se dibujan las fichas estáticas.
- **La ficha en arrastre (`fichaArrastrada`) se dibuja deliberadamente al final de la capa de piezas**. De este modo, sus píxeles siempre se superponen por encima de las demás fichas y huecos del tablero mientras vuela por el lienzo.

### P3: ¿Por qué se utiliza `requestAnimationFrame` en lugar de `setInterval`?
**Respuesta:**  
`requestAnimationFrame` sincroniza el repintado directamente con la tasa de refresco del monitor (habitualmente $60\text{Hz}$ / $16.6\text{ ms}$ por cuadro). A diferencia de `setInterval`:
- Se pausa automáticamente si la pestaña pasa a segundo plano, ahorrando CPU y batería.
- Previene el efecto de *tearing* (desgarro de pantalla) y saltos bruscos (*jank*), garantizando que las funciones sinusoidales de los hints animados latan con total fluidez.

### P4: ¿Por qué la mecánica de retorno elástico ante soltado inválido es crucial para el diseño de interacción?
**Respuesta:**  
Cumple con la **Heurística Nº 5 de Nielsen (Prevención de Errores)** y la **Heurística Nº 3 (Control y Libertad del Usuario)**:
Si el usuario suelta la ficha en una casilla no permitida o en el medio de dos posiciones, el sistema cancela la acción y devuelve la ficha a sus coordenadas originales `(originalX, originalY)`. Esto evita estados corruptos o pérdidas accidentales de fichas sin penalizar injustamente al jugador.

### P5: ¿Cómo se maneja la persistencia y cambio de skins en tiempo real?
**Respuesta:**  
Las imágenes de las 3 skins (Medallas, Granadas e Insignias) se **precargan al iniciar el controlador** mediante instancias de `Image()`. Cuando el usuario pulsa un botón en el HUD, el método `cambiarSkin(skinId)` actualiza la referencia `ficha.setImagen(...)` de todas las fichas vivas y de las bajas en memoria instantáneamente, sin tener que esperar solicitudes de red ni reconstruir el arreglo de piezas.

---

## 5. Fundamentos Teóricos Aplicados

### 5.1. Leyes de Gestalt
- **Región Común:** El tablero circular militar delimita el campo de juego principal. Los paneles laterales (Bajas a la izquierda y Misión a la derecha) están encerrados en tarjetas oscuras con bordes luminiscentes propios, separando la interacción activa del contexto informativo.
- **Similitud:** Todas las fichas activas comparten el mismo diámetro, borde metálico y skin temático seleccionado, identificándolas inequívocamente como piezas aliadas.
- **Proximidad:** En el HUD inferior, los controles de navegación (`← Salir`) se agrupan a la izquierda, los indicadores de estado (`Fichas` y `Timer`) al centro, y los accesos secundarios (`Guardar`, `Compartir`, `Fullscreen`) a la derecha.
- **Figura-Fondo:** El contraste nítido entre el fondo oscuro (`#141714`) y el aro pulsante ámbar brillante (`#FFAA00`) hace que los casilleros legales resalten de inmediato sobre el tablero.

### 5.2. Leyes Motoras y Cognitivas
- **Ley de Fitts:** El tiempo para alcanzar un objetivo depende de la distancia y el tamaño del blanco ($T = a + b \log_2(2D/W)$). Se aplicó aumentando el área de atracción de los casilleros receptores en un $25\%$ durante el soltado, facilitando el aterrizaje de las piezas.
- **Ley de Hick:** El tiempo de decisión aumenta con el número de alternativas. El juego presenta únicamente 3 skins temáticos bien diferenciados y los hints animados reducen las alternativas cognitivas a solo los $1$ o $2$ casilleros legales posibles para la pieza seleccionada.
- **Ley de Miller:** Agrupación en fragmentos (*chunks*). La telemetría lateral organiza la información en bloques de no más de 4 líneas (Objetivo, Zona Óptima, Fichas en Juego y Reglas breves).
- **Umbral de Doherty:** El arrastre en tiempo real responde a menos de $16\text{ ms}$ por cuadro ($60\text{ fps}$), eliminando cualquier percepción de latencia en el Drag & Drop.

### 5.3. Heurísticas de Nielsen
1. **Visibilidad del estado del sistema:** El temporizador avisa visualmente en rojo cuando restan 30 segundos; el contador de fichas restantes y el panel lateral de bajas se actualizan inmediatamente tras cada captura.
2. **Prevención de errores:** Solo se permite soltar en casilleros que tengan activo el hint animado; soltar en cualquier otro sitio restaura la ficha a su posición de origen.
3. **Control y libertad del usuario:** Botón de reinicio inmediato en el HUD y botón de salida para volver a la Home en todo momento.
4. **Consistencia y estándares:** Integración armónica con la estética militar Clone Wars y tokens definidos en `variables.css`.

---

## 6. Pitch / Guion de Defensa Oral (1 Minuto de Examen)

> *"Buenas tardes, profesores. Para este Entregable 4 implementamos el videojuego clásico **Peg Solitaire** integrando una arquitectura **MVC estricta en JavaScript Vanilla** sobre **Canvas 2D nativo**, sin depender de ninguna librería externa.*  
>  
> *El **Modelo** gestiona la matriz lógica de $7 \times 7$ con sus 33 casillas, validando con precisión matemática los saltos ortogonales de 2 posiciones y la eliminación de la ficha intermedia.  
> La **Vista** organiza el renderizado en un lienzo nativo de $800 \times 500\text{ px}$ con celdas cuadradas para evitar distorsiones elípticas, resolviendo la profundidad Z-Index mediante un ciclo por capas donde la ficha arrastrada siempre flota por encima de los huecos y piezas estáticas.  
>  
> *En la interacción con el mouse, separamos rigurosamente el **Hit-Testing radial euclidiano de agarre** —calculado con la distancia exacta del radio en la ficha— del **Hit-Testing de soltado** en el casillero, al cual le aplicamos un $25\%$ de tolerancia en base a la **Ley de Fitts**.  
> Finalmente, cumplimos la consigna obligatoria de **Hints Animados** mediante aros pulsantes y flechas flotantes impulsadas por funciones sinusoidales periódicas sincronizadas a 60 cuadros por segundo con `requestAnimationFrame`, complementado con selector de skins en tiempo real, cronómetro regresivo de 3 minutos y panel lateral de bajas militares."*

