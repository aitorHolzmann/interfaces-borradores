/* CLASE JUEGO BLOCKA — Orquestador principal.
   Conecta el DOM de game.html con la logica del canvas.
   Gestiona: setup de niveles, procesamiento de imagenes con filtros,
   timer, eventos de mouse, victoria, records en localStorage. */

class JuegoBlocka {

  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.tablero = null;
    this.nivelActual = 1;
    this.tiempoTranscurrido = 0;
    this.intervalTimer = null;
    this.jugando = false;
    this.canvasOriginal = null;
    this.piezaHover = null;
  }

  /**
   * Punto de entrada. Se llama en DOMContentLoaded.
   * Conecta el boton "Jugar" y carga records previos.
   */
  iniciar() {
    var self = this;
    var btnJugar = document.getElementById('btn-iniciar-partida');

    if (!btnJugar) return;

    // Mostrar record previo del nivel 1 si existe
    this.mostrarRecordEnHUD(1);

    btnJugar.addEventListener('click', function() {
      self.nivelActual = 1;
      self.configurarNivel(self.nivelActual);
    });
  }

  /**
   * Configura y arranca un nivel:
   * 1) Selecciona imagen aleatoria
   * 2) Carga la imagen
   * 3) Procesa con el filtro del nivel
   * 4) Crea tablero, desordena, dibuja
   * 5) Inicia timer
   */
  configurarNivel(numNivel) {
    var self = this;
    var configNivel = NIVELES[numNivel - 1];

    if (!configNivel) {
      this.mostrarFinDelJuego();
      return;
    }

    // Resetear estado
    this.detenerTimer();
    this.tiempoTranscurrido = 0;
    this.jugando = false;
    this.piezaHover = null;

    // Cargar imagen aleatoria
    var img = new Image();
    img.src = imagenAleatoria();

    img.onload = function() {
      // Crear canvas si no existe
      if (!self.canvas) {
        self.crearCanvas();
      }

      // Procesar imagen: normalizar y aplicar filtro
      var canvasFiltrado = self.procesarImagen(img, configNivel.filtro);

      // Crear tablero con las piezas recortadas
      self.tablero = new Tablero(configNivel.filas, configNivel.columnas);
      self.tablero.crearPiezas(canvasFiltrado);
      self.tablero.desordenar();

      // Dibujar el puzzle
      self.redibujar();

      // Actualizar HUD
      self.actualizarHUD(numNivel);
      self.mostrarRecordEnHUD(numNivel);

      // Ocultar overlay de victoria si existe
      self.ocultarOverlayVictoria();

      // Iniciar timer y marcar como jugando
      self.jugando = true;
      self.iniciarTimer();
    };
  }

  /**
   * Procesa la imagen: la normaliza al tamano del canvas y aplica el filtro.
   * Tambien guarda una copia sin filtro para revelar al ganar.
   *
   * @param {HTMLImageElement} img       Imagen cargada
   * @param {Function}         filtroFn  Funcion de filtro (ImageData -> ImageData)
   * @returns {HTMLCanvasElement} Canvas con la imagen filtrada
   */
  procesarImagen(img, filtroFn) {
    // Canvas auxiliar para normalizar la imagen al tamano del juego
    var canvasAux = document.createElement('canvas');
    canvasAux.width = TAMANO_CANVAS;
    canvasAux.height = TAMANO_CANVAS;
    var ctxAux = canvasAux.getContext('2d');

    // Dibujar imagen normalizada al tamano del canvas
    ctxAux.drawImage(img, 0, 0, TAMANO_CANVAS, TAMANO_CANVAS);

    // Guardar copia original (sin filtro) para el reveal de victoria
    this.canvasOriginal = document.createElement('canvas');
    this.canvasOriginal.width = TAMANO_CANVAS;
    this.canvasOriginal.height = TAMANO_CANVAS;
    var ctxOrig = this.canvasOriginal.getContext('2d');
    ctxOrig.drawImage(canvasAux, 0, 0);

    // Aplicar filtro sobre el canvas auxiliar
    var imageData = ctxAux.getImageData(0, 0, TAMANO_CANVAS, TAMANO_CANVAS);
    filtroFn(imageData);
    ctxAux.putImageData(imageData, 0, 0);

    return canvasAux;
  }

  /**
   * Crea el elemento <canvas> y lo inserta en el contenedor del splash.
   * Oculta el splash original y conecta los eventos del canvas.
   */
  crearCanvas() {
    var contenedor = document.getElementById('game-splash-pantalla');

    // Ocultar el contenido original del splash (boton Jugar)
    var hijos = contenedor.children;
    for (var i = 0; i < hijos.length; i++) {
      hijos[i].style.display = 'none';
    }

    // Crear y configurar el canvas
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'canvas-blocka';
    this.canvas.width = TAMANO_CANVAS;
    this.canvas.height = TAMANO_CANVAS;
    this.ctx = this.canvas.getContext('2d');

    contenedor.appendChild(this.canvas);

    // Conectar eventos del canvas
    this.conectarEventos();
  }

  /**
   * Conecta los 3 eventos del canvas: click, contextmenu y mousemove.
   */
  conectarEventos() {
    var self = this;

    // Clic izquierdo: rotar antihorario
    this.canvas.addEventListener('click', function(e) {
      if (!self.jugando) return;
      self.manejarClic(e, 'izquierda');
    });

    // Clic derecho: rotar horario (prevenir menu contextual)
    this.canvas.addEventListener('contextmenu', function(e) {
      e.preventDefault();
      if (!self.jugando) return;
      self.manejarClic(e, 'derecha');
    });

    // Movimiento: feedback de cursor y highlight
    this.canvas.addEventListener('mousemove', function(e) {
      if (!self.jugando) return;
      self.manejarMovimiento(e);
    });
  }

  /**
   * Maneja un clic sobre el canvas: detecta la pieza, la rota y verifica victoria.
   */
  manejarClic(evento, sentido) {
    var coords = this.obtenerCoordenadasMouse(evento);
    var pieza = this.tablero.obtenerPiezaEn(coords.x, coords.y);

    if (!pieza || pieza.bloqueada) return;

    pieza.rotar(sentido);
    this.redibujar();

    // Verificar si se resolvio el puzzle
    if (this.tablero.verificarVictoria()) {
      this.verificarYMostrarVictoria();
    }
  }

  /**
   * Maneja el movimiento del mouse: cambia cursor y dibuja highlight.
   */
  manejarMovimiento(evento) {
    var coords = this.obtenerCoordenadasMouse(evento);
    var pieza = this.tablero.obtenerPiezaEn(coords.x, coords.y);

    // Solo redibujar si cambio la pieza bajo el cursor
    if (pieza !== this.piezaHover) {
      this.piezaHover = pieza;
      this.canvas.style.cursor = pieza ? 'pointer' : 'default';
      this.redibujar();
    }
  }

  /**
   * Convierte las coordenadas del evento del mouse a coordenadas del canvas.
   * Tiene en cuenta que el canvas se escala con CSS (width 100%).
   */
  obtenerCoordenadasMouse(evento) {
    var rect = this.canvas.getBoundingClientRect();

    // Factor de escala: el canvas logico (TAMANO_CANVAS) puede estar
    // renderizado a un tamano diferente en pantalla por el CSS
    var escalaX = this.canvas.width / rect.width;
    var escalaY = this.canvas.height / rect.height;

    return {
      x: (evento.clientX - rect.left) * escalaX,
      y: (evento.clientY - rect.top) * escalaY
    };
  }

  /**
   * Redibuja el tablero y el highlight de la pieza hover.
   */
  redibujar() {
    if (!this.tablero) return;

    this.tablero.dibujar(this.ctx);

    // Dibujar highlight sobre la pieza bajo el cursor
    if (this.piezaHover && this.jugando) {
      this.ctx.strokeStyle = 'rgba(255, 107, 0, 0.5)';
      this.ctx.lineWidth = 3;
      this.ctx.strokeRect(
        this.piezaHover.x + 1,
        this.piezaHover.y + 1,
        this.piezaHover.ancho - 2,
        this.piezaHover.alto - 2
      );
    }
  }

  /* ---- TIMER ---- */

  /**
   * Inicia el temporizador que cuenta segundos transcurridos.
   */
  iniciarTimer() {
    var self = this;
    this.tiempoTranscurrido = 0;
    this.actualizarTimerDOM();

    this.intervalTimer = setInterval(function() {
      self.tiempoTranscurrido++;
      self.actualizarTimerDOM();
    }, 1000);
  }

  /**
   * Detiene el temporizador.
   */
  detenerTimer() {
    if (this.intervalTimer) {
      clearInterval(this.intervalTimer);
      this.intervalTimer = null;
    }
  }

  /**
   * Actualiza el display del timer en el DOM.
   */
  actualizarTimerDOM() {
    var timerEl = document.getElementById('blocka-timer');
    if (timerEl) {
      timerEl.textContent = this.tiempoTranscurrido + 's';
    }
  }

  /* ---- VICTORIA ---- */

  /**
   * Maneja la victoria: detiene timer, revela imagen original,
   * guarda record y muestra controles post-victoria.
   */
  verificarYMostrarVictoria() {
    this.jugando = false;
    this.detenerTimer();
    this.piezaHover = null;
    this.canvas.style.cursor = 'default';

    // Guardar record
    this.guardarRecord(this.nivelActual);

    // Revelar imagen original sin filtro
    this.ctx.clearRect(0, 0, TAMANO_CANVAS, TAMANO_CANVAS);
    this.ctx.drawImage(this.canvasOriginal, 0, 0);

    // Mostrar overlay de victoria con botones
    this.mostrarOverlayVictoria();
  }

  /**
   * Crea y muestra el overlay de victoria con botones.
   */
  mostrarOverlayVictoria() {
    var self = this;
    var contenedor = document.getElementById('game-splash-pantalla');

    // Remover overlay anterior si existe
    this.ocultarOverlayVictoria();

    var overlay = document.createElement('div');
    overlay.id = 'blocka-overlay-victoria';
    overlay.className = 'blocka-overlay-victoria';

    // Mensaje de victoria con tiempo
    var mensaje = document.createElement('span');
    mensaje.className = 'blocka-victoria-texto';
    mensaje.textContent = '¡Nivel ' + this.nivelActual + ' completado! — ' + this.tiempoTranscurrido + 's';
    overlay.appendChild(mensaje);

    // Boton siguiente nivel (si hay mas niveles)
    if (this.nivelActual < NIVELES.length) {
      var btnSiguiente = document.createElement('button');
      btnSiguiente.className = 'blocka-btn-victoria';
      btnSiguiente.textContent = 'Siguiente Nivel';
      btnSiguiente.addEventListener('click', function() {
        self.nivelActual++;
        self.configurarNivel(self.nivelActual);
      });
      overlay.appendChild(btnSiguiente);
    }

    // Boton volver al menu
    var btnMenu = document.createElement('button');
    btnMenu.className = 'blocka-btn-victoria blocka-btn-menu';
    btnMenu.textContent = 'Volver al Menú';
    btnMenu.addEventListener('click', function() {
      window.location.href = 'index.html';
    });
    overlay.appendChild(btnMenu);

    contenedor.appendChild(overlay);
  }

  /**
   * Oculta/remueve el overlay de victoria.
   */
  ocultarOverlayVictoria() {
    var overlay = document.getElementById('blocka-overlay-victoria');
    if (overlay) {
      overlay.remove();
    }
  }

  /**
   * Muestra pantalla final cuando se completaron todos los niveles.
   */
  mostrarFinDelJuego() {
    var self = this;
    this.jugando = false;
    this.detenerTimer();

    // Dibujar imagen original si existe
    if (this.canvasOriginal) {
      this.ctx.clearRect(0, 0, TAMANO_CANVAS, TAMANO_CANVAS);
      this.ctx.drawImage(this.canvasOriginal, 0, 0);
    }

    this.ocultarOverlayVictoria();

    var contenedor = document.getElementById('game-splash-pantalla');
    var overlay = document.createElement('div');
    overlay.id = 'blocka-overlay-victoria';
    overlay.className = 'blocka-overlay-victoria';

    var mensaje = document.createElement('span');
    mensaje.className = 'blocka-victoria-texto';
    mensaje.textContent = '¡Completaste todos los niveles!';
    overlay.appendChild(mensaje);

    // Boton reiniciar desde nivel 1
    var btnReiniciar = document.createElement('button');
    btnReiniciar.className = 'blocka-btn-victoria';
    btnReiniciar.textContent = 'Jugar de Nuevo';
    btnReiniciar.addEventListener('click', function() {
      self.nivelActual = 1;
      self.configurarNivel(1);
    });
    overlay.appendChild(btnReiniciar);

    var btnMenu = document.createElement('button');
    btnMenu.className = 'blocka-btn-victoria blocka-btn-menu';
    btnMenu.textContent = 'Volver al Menú';
    btnMenu.addEventListener('click', function() {
      window.location.href = 'index.html';
    });
    overlay.appendChild(btnMenu);

    contenedor.appendChild(overlay);
  }

  /* ---- HUD ---- */

  /**
   * Muestra y actualiza el HUD en la barra de ejecucion.
   */
  actualizarHUD(numNivel) {
    var hud = document.getElementById('blocka-hud');
    var nivelEl = document.getElementById('blocka-nivel');
    var timerEl = document.getElementById('blocka-timer');

    if (hud) {
      hud.style.display = 'flex';
    }
    if (nivelEl) {
      nivelEl.textContent = 'Nivel ' + numNivel;
    }
    if (timerEl) {
      timerEl.textContent = '0s';
    }
  }

  /**
   * Muestra el record del nivel en el HUD.
   */
  mostrarRecordEnHUD(numNivel) {
    var recordEl = document.getElementById('blocka-record');
    if (!recordEl) return;

    var record = this.cargarRecord(numNivel);
    if (record !== null) {
      recordEl.textContent = 'Récord: ' + record + 's';
    } else {
      recordEl.textContent = 'Récord: --';
    }
  }

  /* ---- RECORDS ---- */

  /**
   * Guarda el record en localStorage si es mejor que el existente.
   */
  guardarRecord(nivel) {
    var clave = 'blocka-record-nivel-' + nivel;
    var recordPrevio = localStorage.getItem(clave);

    if (recordPrevio === null || this.tiempoTranscurrido < parseInt(recordPrevio)) {
      localStorage.setItem(clave, this.tiempoTranscurrido);
    }

    this.mostrarRecordEnHUD(nivel);
  }

  /**
   * Carga el record de un nivel desde localStorage.
   * @returns {Number|null}
   */
  cargarRecord(nivel) {
    var clave = 'blocka-record-nivel-' + nivel;
    var valor = localStorage.getItem(clave);
    return valor !== null ? parseInt(valor) : null;
  }
}

/* ---- INICIALIZACION ---- */
document.addEventListener('DOMContentLoaded', function() {
  var juego = new JuegoBlocka();
  juego.iniciar();
});
