class JuegoBlocka {

  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.tablero = null;
    this.nivelActual = 1;
    this.nivelSeleccionado = 1;
    this.modoContrarreloj = false;
    this.tiempoTranscurrido = 0;
    this.tiempoRestante = 0;
    this.tiempoMaximo = null;
    this.intervalTimer = null;
    this.jugando = false;
    this.sorteando = false;
    this.canvasOriginal = null;
    this.piezaHover = null;
  }

  iniciar() {
    var self = this;
    window.juego = this;

    this.renderizarMenuInicio();

    var btnSalir = document.getElementById('btn-blocka-salir');
    if (btnSalir) {
      btnSalir.addEventListener('click', function() {
        if (self.jugando) {
          if (confirm('¿Deseas salir al menú del juego? Se perderá el progreso actual de esta partida.')) {
            self.volverAlMenu();
          }
        } else {
          self.volverAlMenu();
        }
      });
    }

    var btnAyuda = document.getElementById('btn-blocka-ayuda');
    if (btnAyuda) {
      btnAyuda.addEventListener('click', function() {
        self.pedirAyudita();
      });
    }

    // Hooks para testeo visual y previews
    if (window.location.hash === '#test-sorteo') {
      this.animarSorteoImagen(function() {});
    } else if (window.location.hash === '#test-partida') {
      this.iniciarPartidaConImagen(1, BANCO_IMAGENES[0], NIVELES[0]);
    } else if (window.location.hash === '#test-nivel2') {
      this.iniciarPartidaConImagen(2, BANCO_IMAGENES[0], NIVELES[1]);
    } else if (window.location.hash === '#test-nivel3') {
      this.iniciarPartidaConImagen(3, BANCO_IMAGENES[0], NIVELES[2]);
    } else if (window.location.hash === '#test-nivel4') {
      this.iniciarPartidaConImagen(4, BANCO_IMAGENES[0], NIVELES[3]);
    } else if (window.location.hash === '#test-ayudita') {
      this.iniciarPartidaConImagen(1, BANCO_IMAGENES[0], NIVELES[0]);
      setTimeout(function() {
        self.pedirAyudita();
      }, 500);
    } else if (window.location.hash === '#test-derrota') {
      this.modoContrarreloj = true;
      this.iniciarPartidaConImagen(2, BANCO_IMAGENES[0], NIVELES[1]);
      setTimeout(function() {
        self.manejarDerrota();
      }, 500);
    } else if (window.location.hash === '#test-victoria') {
      this.iniciarPartidaConImagen(1, BANCO_IMAGENES[0], NIVELES[0]);
      setTimeout(function() {
        self.verificarYMostrarVictoria();
      }, 500);
    } else if (window.location.hash === '#test-final') {
      this.iniciarPartidaConImagen(5, BANCO_IMAGENES[0], NIVELES[4]);
      setTimeout(function() {
        self.verificarYMostrarVictoria();
      }, 500);
    }
  }

  renderizarMenuInicio() {
    var self = this;
    var contenedorMenu = document.getElementById('blocka-splash-menu');
    if (!contenedorMenu) return;

    contenedorMenu.innerHTML = '';

    var header = document.createElement('div');
    header.className = 'blocka-menu-header';

    var titulo = document.createElement('h2');
    titulo.className = 'blocka-menu-titulo';
    titulo.textContent = 'BLOCKA';
    header.appendChild(titulo);

    var subtitulo = document.createElement('p');
    subtitulo.className = 'blocka-menu-subtitulo';
    subtitulo.textContent = 'Seleccioná un nivel para comenzar el desafío:';
    header.appendChild(subtitulo);

    contenedorMenu.appendChild(header);

    var listaNiveles = document.createElement('div');
    listaNiveles.className = 'blocka-lista-niveles';
    listaNiveles.setAttribute('role', 'radiogroup');
    listaNiveles.setAttribute('aria-label', 'Lista de niveles disponibles');

    var btnJugar = document.createElement('button');
    btnJugar.id = 'btn-iniciar-partida';
    btnJugar.className = 'btn-jugar-blocka';

    function actualizarTextoBoton() {
      btnJugar.textContent = 'JUGAR NIVEL ' + self.nivelSeleccionado;
    }

    for (var i = 0; i < NIVELES.length; i++) {
      (function(nivel) {
        var card = document.createElement('div');
        card.className = 'blocka-nivel-card' + (nivel.numero === self.nivelSeleccionado ? ' seleccionado' : '');
        card.setAttribute('role', 'radio');
        card.setAttribute('aria-checked', nivel.numero === self.nivelSeleccionado ? 'true' : 'false');
        card.setAttribute('tabindex', '0');
        card.setAttribute('data-nivel', nivel.numero);

        var record = self.cargarRecord(nivel.numero);
        var recordTexto = record !== null ? '🏆 ' + record + 's' : 'Sin récord';

        var infoDiv = document.createElement('div');
        infoDiv.className = 'blocka-card-info';

        var nombreSpan = document.createElement('span');
        nombreSpan.className = 'blocka-card-nombre';
        nombreSpan.textContent = nivel.nombre;
        infoDiv.appendChild(nombreSpan);

        var detallesSpan = document.createElement('span');
        detallesSpan.className = 'blocka-card-detalles';
        detallesSpan.textContent = nivel.piezas + ' piezas (' + nivel.filas + '×' + nivel.columnas + ') • ' + nivel.nombreFiltro;
        infoDiv.appendChild(detallesSpan);

        var metaDiv = document.createElement('div');
        metaDiv.className = 'blocka-card-meta';

        var tiempoSpan = document.createElement('span');
        tiempoSpan.className = 'blocka-card-tiempo';
        tiempoSpan.textContent = '⏱️ ' + nivel.tiempoMaximo + 's';
        metaDiv.appendChild(tiempoSpan);

        var recordSpan = document.createElement('span');
        recordSpan.className = 'blocka-card-record';
        recordSpan.textContent = recordTexto;
        metaDiv.appendChild(recordSpan);

        card.appendChild(infoDiv);
        card.appendChild(metaDiv);

        function seleccionarEsteNivel() {
          self.nivelSeleccionado = nivel.numero;
          var todas = listaNiveles.querySelectorAll('.blocka-nivel-card');
          for (var k = 0; k < todas.length; k++) {
            todas[k].classList.remove('seleccionado');
            todas[k].setAttribute('aria-checked', 'false');
          }
          card.classList.add('seleccionado');
          card.setAttribute('aria-checked', 'true');
          actualizarTextoBoton();
        }

        card.addEventListener('click', seleccionarEsteNivel);
        card.addEventListener('keydown', function(e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            seleccionarEsteNivel();
          }
        });

        listaNiveles.appendChild(card);
      })(NIVELES[i]);
    }

    contenedorMenu.appendChild(listaNiveles);

    var toggleLabel = document.createElement('label');
    toggleLabel.className = 'blocka-toggle-timer';
    toggleLabel.title = 'Si se activa, deberás resolver el puzzle antes del tiempo límite del nivel.';

    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = 'blocka-checkbox-timer';
    checkbox.checked = self.modoContrarreloj;
    checkbox.addEventListener('change', function() {
      self.modoContrarreloj = checkbox.checked;
    });

    var textoToggle = document.createElement('span');
    textoToggle.className = 'blocka-toggle-texto';
    textoToggle.textContent = '⏱️ Activar Modo Contrarreloj';

    toggleLabel.appendChild(checkbox);
    toggleLabel.appendChild(textoToggle);
    contenedorMenu.appendChild(toggleLabel);

    actualizarTextoBoton();
    btnJugar.addEventListener('click', function() {
      self.nivelActual = self.nivelSeleccionado;
      self.configurarNivel(self.nivelActual);
    });

    contenedorMenu.appendChild(btnJugar);
  }

  volverAlMenu() {
    this.detenerTimer();
    this.jugando = false;
    this.sorteando = false;
    this.piezaHover = null;

    this.ocultarOverlayVictoria();
    this.ocultarOverlayDerrota();

    var sorteoOverlay = document.getElementById('blocka-sorteo-overlay');
    if (sorteoOverlay) sorteoOverlay.remove();

    if (this.canvas) {
      this.canvas.style.display = 'none';
    }

    var hud = document.getElementById('blocka-hud');
    if (hud) {
      hud.style.display = 'none';
    }

    var recordEl = document.getElementById('blocka-record');
    if (recordEl) {
      recordEl.style.display = 'none';
    }

    var tituloEl = document.getElementById('game-barra-titulo');
    if (tituloEl) {
      tituloEl.style.display = '';
    }

    var splash = document.getElementById('game-splash-pantalla');
    if (splash) {
      splash.classList.remove('en-juego');
      splash.style.display = 'flex';
      var hijos = splash.children;
      for (var i = 0; i < hijos.length; i++) {
        if (hijos[i].id !== 'canvas-blocka') {
          hijos[i].style.display = '';
        }
      }
    }

    var menuContenedor = document.getElementById('blocka-splash-menu');
    if (menuContenedor) {
      menuContenedor.style.display = 'flex';
    }

    this.renderizarMenuInicio();
  }

  /* CONFIGURA E INICIA UN NIVEL */
  configurarNivel(numNivel) {
    var self = this;
    this.nivelActual = numNivel;
    var configNivel = NIVELES[numNivel - 1];

    if (!configNivel) {
      this.mostrarFinDelJuego();
      return;
    }

    this.detenerTimer();
    this.jugando = false;
    this.piezaHover = null;
    this.ocultarOverlayVictoria();
    this.ocultarOverlayDerrota();

    this.animarSorteoImagen(function(rutaImagen) {
      self.iniciarPartidaConImagen(numNivel, rutaImagen, configNivel);
    });
  }

  iniciarPartidaConImagen(numNivel, rutaImagen, configNivel) {
    var self = this;
    this.nivelActual = numNivel;

    this.tiempoTranscurrido = 0;
    if (this.modoContrarreloj) {
      this.tiempoMaximo = configNivel.tiempoMaximo;
      this.tiempoRestante = this.tiempoMaximo;
    } else {
      this.tiempoMaximo = null;
      this.tiempoRestante = null;
    }

    var img = new Image();
    img.src = rutaImagen;

    img.onload = function() {
      var contenedor = document.getElementById('game-splash-pantalla');
      if (contenedor) {
        contenedor.classList.add('en-juego');
        var hijos = contenedor.children;
        for (var i = 0; i < hijos.length; i++) {
          if (hijos[i].id !== 'canvas-blocka') {
            hijos[i].style.display = 'none';
          }
        }
      }

      if (!self.canvas) {
        self.crearCanvas();
      } else {
        self.canvas.style.display = 'block';
      }

      self.procesarImagen(img);

      self.tablero = new Tablero(configNivel.filas, configNivel.columnas, self.canvas.width, self.canvas.height);
      self.tablero.crearPiezas(self.canvasOriginal, configNivel.filtro);
      self.tablero.desordenar();

      self.redibujar();

      var btnAyuda = document.getElementById('btn-blocka-ayuda');
      if (btnAyuda) {
        btnAyuda.disabled = false;
      }

      self.actualizarHUD(numNivel);
      self.mostrarRecordEnHUD(numNivel);

      self.jugando = true;
      self.iniciarTimer();
    };

    img.onerror = function() {
      console.error('Error al cargar la imagen del puzzle:', rutaImagen);
    };
  }

  // Sorteo animado de imagen con desaceleración cuadrática
  animarSorteoImagen(callback) {
    var self = this;
    var contenedor = document.getElementById('game-splash-pantalla');
    if (!contenedor) {
      callback(imagenAleatoria());
      return;
    }

    this.sorteando = true;

    var hijos = contenedor.children;
    for (var i = 0; i < hijos.length; i++) {
      hijos[i].style.display = 'none';
    }

    var overlay = document.createElement('div');
    overlay.id = 'blocka-sorteo-overlay';
    overlay.className = 'blocka-sorteo-overlay';

    var titulo = document.createElement('h3');
    titulo.className = 'blocka-sorteo-titulo';
    titulo.textContent = 'SELECCIONANDO IMAGEN...';
    overlay.appendChild(titulo);

    var grilla = document.createElement('div');
    grilla.className = 'blocka-sorteo-grilla';

    var thumbsElements = [];
    for (var j = 0; j < BANCO_IMAGENES.length; j++) {
      var item = document.createElement('div');
      item.className = 'blocka-thumb';
      var miniImg = document.createElement('img');
      miniImg.src = BANCO_IMAGENES[j];
      miniImg.alt = 'Thumbnail ' + (j + 1);
      item.appendChild(miniImg);
      grilla.appendChild(item);
      thumbsElements.push(item);
    }
    overlay.appendChild(grilla);

    var subtitulo = document.createElement('p');
    subtitulo.className = 'blocka-sorteo-subtitulo';
    subtitulo.textContent = 'Sorteando desafío de Blocka';
    overlay.appendChild(subtitulo);

    contenedor.appendChild(overlay);

    var indiceGanador = Math.floor(Math.random() * BANCO_IMAGENES.length);
    var vueltas = 2;
    var totalPasos = vueltas * BANCO_IMAGENES.length + indiceGanador;
    var paso = 0;

    function ejecutarPaso() {
      var indiceActual = paso % BANCO_IMAGENES.length;

      for (var k = 0; k < thumbsElements.length; k++) {
        thumbsElements[k].classList.remove('activo');
      }
      thumbsElements[indiceActual].classList.add('activo');

      paso++;

      if (paso <= totalPasos) {
        var progreso = paso / totalPasos;
        var retardo = 60 + Math.floor(Math.pow(progreso, 2) * 240);
        setTimeout(ejecutarPaso, retardo);
      } else {
        thumbsElements[indiceGanador].classList.add('ganador');
        setTimeout(function() {
          overlay.remove();
          self.sorteando = false;
          setTimeout(function() {
            callback(BANCO_IMAGENES[indiceGanador]);
          }, 300);
        }, 500);
      }
    }

    ejecutarPaso();
  }

  procesarImagen(img) {
    var tamanoBase = Math.max(img.naturalWidth || 600, 600);
    this.canvasOriginal = document.createElement('canvas');
    this.canvasOriginal.width = tamanoBase;
    this.canvasOriginal.height = tamanoBase;
    var ctxOrig = this.canvasOriginal.getContext('2d');
    ctxOrig.drawImage(img, 0, 0, tamanoBase, tamanoBase);
    return this.canvasOriginal;
  }

  crearCanvas() {
    var contenedor = document.getElementById('game-splash-pantalla');

    var hijos = contenedor.children;
    for (var i = 0; i < hijos.length; i++) {
      hijos[i].style.display = 'none';
    }

    contenedor.classList.add('en-juego');

    this.canvas = document.createElement('canvas');
    this.canvas.id = 'canvas-blocka';
    this.canvas.width = typeof CANVAS_ANCHO !== 'undefined' ? CANVAS_ANCHO : 800;
    this.canvas.height = typeof CANVAS_ALTO !== 'undefined' ? CANVAS_ALTO : 500;
    this.ctx = this.canvas.getContext('2d');

    contenedor.appendChild(this.canvas);
    this.conectarEventos();
  }

  conectarEventos() {
    var self = this;

    // Clic izquierdo: rotación antihoraria
    this.canvas.addEventListener('click', function(e) {
      if (!self.jugando) return;
      self.manejarClic(e, 'izquierda');
    });

    // Clic derecho: rotación horaria
    this.canvas.addEventListener('contextmenu', function(e) {
      e.preventDefault();
      if (!self.jugando) return;
      self.manejarClic(e, 'derecha');
    });

    this.canvas.addEventListener('mousemove', function(e) {
      if (!self.jugando) return;
      self.manejarMovimiento(e);
    });
  }

  manejarClic(evento, sentido) {
    if (!this.jugando || !this.tablero) return;

    var coords = this.obtenerCoordenadasMouse(evento);
    var pieza = this.tablero.obtenerPiezaEn(coords.x, coords.y);

    if (!pieza || pieza.bloqueada) return;

    pieza.rotar(sentido);
    this.redibujar();

    var btnAyuda = document.getElementById('btn-blocka-ayuda');
    if (btnAyuda && typeof this.tablero.hayPiezasParaAyuda === 'function') {
      btnAyuda.disabled = !this.tablero.hayPiezasParaAyuda();
    }

    if (this.tablero.verificarVictoria()) {
      this.verificarYMostrarVictoria();
    }
  }

  manejarMovimiento(evento) {
    if (!this.jugando || !this.tablero) return;

    var coords = this.obtenerCoordenadasMouse(evento);
    var pieza = this.tablero.obtenerPiezaEn(coords.x, coords.y);

    if (pieza !== this.piezaHover) {
      this.piezaHover = pieza;

      if (!pieza) {
        this.canvas.style.cursor = 'default';
      } else if (pieza.bloqueada) {
        this.canvas.style.cursor = 'not-allowed';
      } else {
        this.canvas.style.cursor = 'pointer';
      }

      this.redibujar();
    }
  }

  // Ajusta las coordenadas del mouse a la escala real del canvas
  obtenerCoordenadasMouse(evento) {
    var rect = this.canvas.getBoundingClientRect();
    var escalaX = this.canvas.width / rect.width;
    var escalaY = this.canvas.height / rect.height;

    return {
      x: (evento.clientX - rect.left) * escalaX,
      y: (evento.clientY - rect.top) * escalaY
    };
  }

  redibujar() {
    if (!this.tablero) return;

    this.tablero.dibujar(this.ctx);

    if (this.piezaHover && !this.piezaHover.bloqueada && this.jugando) {
      this.ctx.save();
      this.ctx.strokeStyle = typeof COLOR_CANVAS_HOVER !== 'undefined' ? COLOR_CANVAS_HOVER : 'rgba(255, 107, 0, 0.7)';
      this.ctx.lineWidth = 3;
      this.ctx.strokeRect(
        this.piezaHover.x + 1,
        this.piezaHover.y + 1,
        this.piezaHover.ancho - 2,
        this.piezaHover.alto - 2
      );
      this.ctx.restore();
    }
  }

  // Resuelve y bloquea una pieza al azar aplicando penalización de 5s
  pedirAyudita() {
    if (!this.jugando || !this.tablero) return;

    var piezaFijada = this.tablero.fijarPiezaAleatoria();
    if (!piezaFijada) {
      var btnAyuda = document.getElementById('btn-blocka-ayuda');
      if (btnAyuda) btnAyuda.disabled = true;
      return;
    }

    this.tiempoTranscurrido += 5;

    if (this.tiempoMaximo !== null) {
      this.tiempoRestante = Math.max(0, this.tiempoRestante - 5);
    }

    this.mostrarFeedbackPenalizacion();
    this.actualizarTimerDOM();

    this.redibujar();

    var btnAyudaEl = document.getElementById('btn-blocka-ayuda');
    if (btnAyudaEl && typeof this.tablero.hayPiezasParaAyuda === 'function') {
      btnAyudaEl.disabled = !this.tablero.hayPiezasParaAyuda();
    }

    if (this.tiempoMaximo !== null && this.tiempoRestante <= 0) {
      this.manejarDerrota();
      return;
    }

    if (this.tablero.verificarVictoria()) {
      this.verificarYMostrarVictoria();
    }
  }

  mostrarFeedbackPenalizacion() {
    var wrapper = document.querySelector('.blocka-timer-wrapper');
    if (!wrapper) return;

    var flotador = document.createElement('span');
    flotador.className = 'blocka-penalizacion-flotante';
    flotador.textContent = '+5s';
    wrapper.appendChild(flotador);

    setTimeout(function() {
      flotador.remove();
    }, 850);
  }

  iniciarTimer() {
    var self = this;
    this.detenerTimer();
    this.actualizarTimerDOM();

    this.intervalTimer = setInterval(function() {
      self.tiempoTranscurrido++;

      if (self.tiempoMaximo !== null) {
        self.tiempoRestante--;
        self.actualizarTimerDOM();

        if (self.tiempoRestante <= 0) {
          self.manejarDerrota();
        }
      } else {
        self.actualizarTimerDOM();
      }
    }, 1000);
  }

  detenerTimer() {
    if (this.intervalTimer) {
      clearInterval(this.intervalTimer);
      this.intervalTimer = null;
    }

    var timerEl = document.getElementById('blocka-timer');
    if (timerEl) {
      timerEl.classList.remove('tiempo-urgente');
    }
  }

  actualizarTimerDOM() {
    var timerEl = document.getElementById('blocka-timer');
    if (!timerEl) return;

    if (this.tiempoMaximo !== null) {
      timerEl.textContent = '⏳ ' + this.tiempoRestante + 's / ' + this.tiempoMaximo + 's';

      if (this.tiempoRestante <= 10) {
        timerEl.classList.add('tiempo-urgente');
      } else {
        timerEl.classList.remove('tiempo-urgente');
      }
    } else {
      timerEl.textContent = this.tiempoTranscurrido + 's';
      timerEl.classList.remove('tiempo-urgente');
    }
  }

  /* DIBUJA LA IMAGEN ORIGINAL SIN FILTROS NI GRILLA EN EL AREA DEL TABLERO */
  revelarImagenOriginal() {
    if (!this.canvasOriginal || !this.tablero) return;

    var colorFondo = typeof COLOR_CANVAS_FONDO !== 'undefined' ? COLOR_CANVAS_FONDO : '#141714';
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = colorFondo;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    var ratioGrilla = this.tablero.columnas / this.tablero.filas;
    var imgW = this.canvasOriginal.width;
    var imgH = this.canvasOriginal.height;
    var rw, rh, rx, ry;

    if (ratioGrilla >= 1) {
      rw = imgW;
      rh = Math.floor(imgW / ratioGrilla);
      rx = 0;
      ry = Math.floor((imgH - rh) / 2);
    } else {
      rh = imgH;
      rw = Math.floor(imgH * ratioGrilla);
      rx = Math.floor((imgW - rw) / 2);
      ry = 0;
    }

    this.ctx.drawImage(
      this.canvasOriginal,
      rx, ry, rw, rh,
      this.tablero.offsetX, this.tablero.offsetY, this.tablero.anchoTotal, this.tablero.altoTotal
    );
  }

  verificarYMostrarVictoria() {
    this.jugando = false;
    this.detenerTimer();
    this.piezaHover = null;
    this.canvas.style.cursor = 'default';

    var btnAyuda = document.getElementById('btn-blocka-ayuda');
    if (btnAyuda) btnAyuda.disabled = true;

    this.guardarRecord(this.nivelActual);
    this.revelarImagenOriginal();

    if (this.nivelActual >= NIVELES.length) {
      this.mostrarFinDelJuego();
    } else {
      this.mostrarOverlayVictoria();
    }
  }

  mostrarOverlayVictoria() {
    var self = this;
    var contenedor = document.getElementById('game-splash-pantalla');

    this.ocultarOverlayVictoria();

    var overlay = document.createElement('div');
    overlay.id = 'blocka-overlay-victoria';
    overlay.className = 'blocka-overlay-victoria';

    var mensaje = document.createElement('span');
    mensaje.className = 'blocka-victoria-texto';
    mensaje.textContent = '¡Nivel ' + this.nivelActual + ' completado! — ' + this.tiempoTranscurrido + 's';
    overlay.appendChild(mensaje);

    if (this.nivelActual < NIVELES.length) {
      var btnSiguiente = document.createElement('button');
      btnSiguiente.className = 'blocka-btn-victoria';
      btnSiguiente.textContent = 'Siguiente Nivel';
      btnSiguiente.addEventListener('click', function() {
        self.nivelActual++;
        self.nivelSeleccionado = self.nivelActual;
        self.configurarNivel(self.nivelActual);
      });
      overlay.appendChild(btnSiguiente);
    }

    var btnMenu = document.createElement('button');
    btnMenu.className = 'blocka-btn-victoria blocka-btn-menu';
    btnMenu.textContent = 'Volver al Menú';
    btnMenu.addEventListener('click', function() {
      self.volverAlMenu();
    });
    overlay.appendChild(btnMenu);

    contenedor.appendChild(overlay);
  }

  ocultarOverlayVictoria() {
    var overlay = document.getElementById('blocka-overlay-victoria');
    if (overlay) overlay.remove();
  }

  manejarDerrota() {
    this.jugando = false;
    this.detenerTimer();
    this.piezaHover = null;
    this.canvas.style.cursor = 'default';

    var btnAyuda = document.getElementById('btn-blocka-ayuda');
    if (btnAyuda) btnAyuda.disabled = true;

    this.ctx.save();
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.restore();

    this.mostrarOverlayDerrota();
  }

  mostrarOverlayDerrota() {
    var self = this;
    var contenedor = document.getElementById('game-splash-pantalla');

    this.ocultarOverlayDerrota();

    var overlay = document.createElement('div');
    overlay.id = 'blocka-overlay-derrota';
    overlay.className = 'blocka-overlay-derrota';

    var titulo = document.createElement('h3');
    titulo.className = 'blocka-derrota-titulo';
    titulo.textContent = '¡TIEMPO AGOTADO!';
    overlay.appendChild(titulo);

    var texto = document.createElement('p');
    texto.className = 'blocka-derrota-texto';
    texto.textContent = 'No lograste armar la Blocka a tiempo en el Nivel ' + this.nivelActual + '.';
    overlay.appendChild(texto);

    var grupoBotones = document.createElement('div');
    grupoBotones.className = 'blocka-derrota-botones';

    var btnReintentar = document.createElement('button');
    btnReintentar.className = 'blocka-btn-victoria';
    btnReintentar.textContent = 'Reintentar Nivel';
    btnReintentar.addEventListener('click', function() {
      self.ocultarOverlayDerrota();
      self.configurarNivel(self.nivelActual);
    });
    grupoBotones.appendChild(btnReintentar);

    var btnMenu = document.createElement('button');
    btnMenu.className = 'blocka-btn-victoria blocka-btn-menu';
    btnMenu.textContent = 'Volver al Menú';
    btnMenu.addEventListener('click', function() {
      self.volverAlMenu();
    });
    grupoBotones.appendChild(btnMenu);

    overlay.appendChild(grupoBotones);
    contenedor.appendChild(overlay);
  }

  ocultarOverlayDerrota() {
    var overlay = document.getElementById('blocka-overlay-derrota');
    if (overlay) overlay.remove();
  }

  mostrarFinDelJuego() {
    var self = this;
    this.jugando = false;
    this.detenerTimer();

    this.revelarImagenOriginal();

    this.ocultarOverlayVictoria();
    this.ocultarOverlayDerrota();

    var contenedor = document.getElementById('game-splash-pantalla');
    var overlay = document.createElement('div');
    overlay.id = 'blocka-overlay-victoria';
    overlay.className = 'blocka-overlay-victoria';

    var mensaje = document.createElement('span');
    mensaje.className = 'blocka-victoria-texto';
    mensaje.textContent = '¡Completaste todos los niveles de Blocka!';
    overlay.appendChild(mensaje);

    var btnReiniciar = document.createElement('button');
    btnReiniciar.className = 'blocka-btn-victoria';
    btnReiniciar.textContent = 'Jugar de Nuevo';
    btnReiniciar.addEventListener('click', function() {
      self.nivelActual = 1;
      self.nivelSeleccionado = 1;
      self.configurarNivel(1);
    });
    overlay.appendChild(btnReiniciar);

    var btnMenu = document.createElement('button');
    btnMenu.className = 'blocka-btn-victoria blocka-btn-menu';
    btnMenu.textContent = 'Volver al Menú';
    btnMenu.addEventListener('click', function() {
      self.volverAlMenu();
    });
    overlay.appendChild(btnMenu);

    contenedor.appendChild(overlay);
  }

  actualizarHUD(numNivel) {
    var hud = document.getElementById('blocka-hud');
    var nivelEl = document.getElementById('blocka-nivel');
    var tituloEl = document.getElementById('game-barra-titulo');
    var recordEl = document.getElementById('blocka-record');

    if (hud) hud.style.display = 'flex';
    if (recordEl) recordEl.style.display = 'inline-block';
    if (tituloEl) tituloEl.style.display = 'none';
    if (nivelEl) nivelEl.textContent = 'Nivel ' + numNivel;

    this.actualizarTimerDOM();
  }

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

  guardarRecord(nivel) {
    var clave = 'blocka-record-nivel-' + nivel;
    var recordPrevio = localStorage.getItem(clave);

    if (recordPrevio === null || this.tiempoTranscurrido < parseInt(recordPrevio, 10)) {
      localStorage.setItem(clave, this.tiempoTranscurrido);
    }

    this.mostrarRecordEnHUD(nivel);
  }

  cargarRecord(nivel) {
    var clave = 'blocka-record-nivel-' + nivel;
    var valor = localStorage.getItem(clave);
    return valor !== null ? parseInt(valor, 10) : null;
  }
}

document.addEventListener('DOMContentLoaded', function() {
  var juego = new JuegoBlocka();
  juego.iniciar();
});
