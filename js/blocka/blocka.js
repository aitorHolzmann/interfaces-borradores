/* CLASE JUEGO BLOCKA — Orquestador principal del videojuego.
   Conecta el DOM de game.html con la logica del canvas 2D nativo.
   
   FASE 1 (Base): Setup de niveles, filtros, timer, victoria y records en localStorage.
   FASE 2 (Extras):
     - Extra 1: Sorteo visual previo de imagen con animacion de thumbnails (ruleta).
     - Extra 2: Configuracion de cantidad de subimagenes (4, 6 u 8 piezas cuadradas).
     - Extra 3: Mecanica de Ayudita (+5s penalizacion, pieza fija y bloqueada con badge).
     - Extra 4: Límite de tiempo maximo, cuenta regresiva y derrota por timeout.
*/

class JuegoBlocka {

  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.tablero = null;
    this.nivelActual = 1;
    this.nivelSeleccionado = 1;
    this.modoContrarreloj = false; // Toggleable desde el menú de inicio
    this.tiempoTranscurrido = 0;
    this.tiempoRestante = 0;
    this.tiempoMaximo = null;
    this.intervalTimer = null;
    this.jugando = false;
    this.sorteando = false;
    this.canvasOriginal = null;
    this.piezaHover = null;
  }

  /**
   * Punto de entrada. Se llama en DOMContentLoaded.
   * Renderiza el menú dinámico de niveles, conecta botones del HUD y carga records.
   */
  iniciar() {
    var self = this;
    window.juego = this; // Exponer en window para depuración y tests

    // Renderizar menú dinámico de inicio con niveles y toggle de contrarreloj
    this.renderizarMenuInicio();

    // Botón Salir en el HUD (Heurística Nielsen #3 Control y Libertad, y #5 Prevención de Errores)
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

    // Botón de Ayudita en el HUD (Extra 3)
    var btnAyuda = document.getElementById('btn-blocka-ayuda');
    if (btnAyuda) {
      btnAyuda.addEventListener('click', function() {
        self.pedirAyudita();
      });
    }

    // Resize ultra minimo y seguro: solo reajusta si estamos en partida activa
    window.addEventListener('resize', function() {
      if (self.jugando) {
        self.ajustarDimensiones();
      }
    });

    // Hooks de pruebas de estado
    if (window.location.hash === '#test-sorteo') {
      this.animarSorteoImagen(function() {});
    } else if (window.location.hash === '#test-partida') {
      this.iniciarPartidaConImagen(1, BANCO_IMAGENES[0], NIVELES[0]);
    } else if (window.location.hash === '#test-nivel2') {
      this.iniciarPartidaConImagen(2, BANCO_IMAGENES[0], NIVELES[1]);
    } else if (window.location.hash === '#test-nivel3') {
      this.iniciarPartidaConImagen(3, BANCO_IMAGENES[0], NIVELES[2]);
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
    }
  }

  /**
   * Renderiza dinámicamente el menú de inicio de Blocka dentro del contenedor splash.
   * Encapsula los niveles cargados desde JS (grilla, filtro, tiempo máximo),
   * soporte de scroll vertical si hay muchos niveles, y toggle de modo Contrarreloj.
   */
  renderizarMenuInicio() {
    var self = this;
    var contenedorMenu = document.getElementById('blocka-splash-menu');
    if (!contenedorMenu) return;

    contenedorMenu.innerHTML = '';

    // Encabezado del menú
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

    // Lista scrolleable de niveles (scroll vertical si son muchos)
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

    // Toggle de Modo Contrarreloj (Tiempo límite)
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

    // Botón Jugar
    actualizarTextoBoton();
    btnJugar.addEventListener('click', function() {
      self.nivelActual = self.nivelSeleccionado;
      self.configurarNivel(self.nivelActual);
    });

    contenedorMenu.appendChild(btnJugar);
  }

  /**
   * Vuelve al menú principal del juego Blocka.
   * Detiene el temporizador, oculta canvas y HUD, y vuelve a mostrar el selector de niveles.
   */
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

  /**
   * Configura e inicia un nivel.
   * Orquesta primero la animación de selección de imagen (Extra 1)
   * y luego procesa la partida con la imagen sorteada.
   */
  configurarNivel(numNivel) {
    var self = this;
    var configNivel = NIVELES[numNivel - 1];

    if (!configNivel) {
      this.mostrarFinDelJuego();
      return;
    }

    // Limpiar estado previo
    this.detenerTimer();
    this.jugando = false;
    this.piezaHover = null;
    this.ocultarOverlayVictoria();
    this.ocultarOverlayDerrota();

    // Sorteo animado de imagen previa (Extra 1)
    this.animarSorteoImagen(function(rutaImagen) {
      self.iniciarPartidaConImagen(numNivel, rutaImagen, configNivel);
    });
  }

  /**
   * Carga la imagen seleccionada por el sorteo, aplica el filtro del nivel,
   * crea el tablero según las filas y columnas encapsuladas en el nivel y arranca el temporizador.
   */
  iniciarPartidaConImagen(numNivel, rutaImagen, configNivel) {
    var self = this;

    // Resetear tiempos
    this.tiempoTranscurrido = 0;
    if (this.modoContrarreloj) {
      this.tiempoMaximo = configNivel.tiempoMaximo;
      this.tiempoRestante = this.tiempoMaximo;
    } else {
      this.tiempoMaximo = null;
      this.tiempoRestante = null;
    }

    // Cargar imagen sorteada
    var img = new Image();
    img.src = rutaImagen;

    img.onload = function() {
      // Asegurar contenedor en modo juego y dimensiones sincronizadas
      var contenedor = document.getElementById('game-splash-pantalla');
      if (contenedor) {
        contenedor.classList.add('en-juego');
      }

      // Crear canvas si aún no existe, o asegurar visibilidad y tamaño
      if (!self.canvas) {
        self.crearCanvas();
      } else {
        self.canvas.style.display = 'block';
        if (contenedor) {
          self.canvas.width = contenedor.clientWidth || 800;
          self.canvas.height = contenedor.clientHeight || 500;
        }
      }

      // Procesar imagen: normalizar tamaño y aplicar filtro del nivel
      var canvasFiltrado = self.procesarImagen(img, configNivel.filtro);

      // Crear tablero con dimensiones dinamicas del canvas
      self.tablero = new Tablero(configNivel.filas, configNivel.columnas, self.canvas.width, self.canvas.height);
      self.tablero.crearPiezas(canvasFiltrado);
      self.tablero.desordenar();

      // Dibujar en el canvas principal
      self.redibujar();

      // Habilitar botón de ayudita en el HUD (Extra 3)
      var btnAyuda = document.getElementById('btn-blocka-ayuda');
      if (btnAyuda) {
        btnAyuda.disabled = false;
      }

      // Actualizar HUD
      self.actualizarHUD(numNivel);
      self.mostrarRecordEnHUD(numNivel);

      // Iniciar timer y marcar como jugando
      self.jugando = true;
      self.iniciarTimer();
    };

    img.onerror = function() {
      console.error('Error al cargar la imagen del puzzle:', rutaImagen);
    };
  }

  /**
   * EXTRA 1: Animación de selección visual de imagen (ruleta de thumbnails).
   * Recorrido animado desacelerado (~1.6 segundos) que frena de forma exacta
   * y sincrónica en la imagen elegida para jugarse.
   */
  animarSorteoImagen(callback) {
    var self = this;
    var contenedor = document.getElementById('game-splash-pantalla');
    if (!contenedor) {
      callback(imagenAleatoria());
      return;
    }

    this.sorteando = true;

    // Ocultar splash o canvas temporalmente
    var hijos = contenedor.children;
    for (var i = 0; i < hijos.length; i++) {
      hijos[i].style.display = 'none';
    }

    // Crear overlay del sorteo
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

    // Seleccionar índice ganador y calcular pasos exactos para sincronicidad 100%
    var indiceGanador = Math.floor(Math.random() * BANCO_IMAGENES.length);
    var vueltas = 2;
    var totalPasos = vueltas * BANCO_IMAGENES.length + indiceGanador;
    var paso = 0;

    function ejecutarPaso() {
      var indiceActual = paso % BANCO_IMAGENES.length;

      for (var k = 0; k < thumbsElements.length; k++) {
        thumbsElements[k].classList.remove('activo');
        thumbsElements[k].classList.remove('ganador');
      }

      if (paso < totalPasos) {
        thumbsElements[indiceActual].classList.add('activo');
        paso++;
        var progreso = paso / totalPasos;
        var delay = 40 + Math.pow(progreso, 2) * 220;
        setTimeout(ejecutarPaso, delay);
      } else {
        // Frenó exactamente en el ganador sorteado
        thumbsElements[indiceGanador].classList.add('ganador');
        subtitulo.textContent = '¡Imagen seleccionada! Preparando tablero...';

        setTimeout(function() {
          overlay.style.opacity = '0';
          setTimeout(function() {
            overlay.remove();
            self.sorteando = false;
            callback(BANCO_IMAGENES[indiceGanador]);
          }, 300);
        }, 500);
      }
    }

    ejecutarPaso();
  }

  /**
   * Procesa la imagen: la normaliza a resolución nítida y aplica el filtro.
   * Guarda copia sin filtro para revelar al ganar.
   */
  procesarImagen(img, filtroFn) {
    var tamanoBase = Math.max(img.naturalWidth || 600, 600);
    var canvasAux = document.createElement('canvas');
    canvasAux.width = tamanoBase;
    canvasAux.height = tamanoBase;
    var ctxAux = canvasAux.getContext('2d');

    // Dibujar imagen normalizada a resolucion base de alta fidelidad
    ctxAux.drawImage(img, 0, 0, tamanoBase, tamanoBase);

    // Guardar copia original para reveal de victoria
    this.canvasOriginal = document.createElement('canvas');
    this.canvasOriginal.width = tamanoBase;
    this.canvasOriginal.height = tamanoBase;
    var ctxOrig = this.canvasOriginal.getContext('2d');
    ctxOrig.drawImage(canvasAux, 0, 0);

    // Aplicar filtro
    var imageData = ctxAux.getImageData(0, 0, tamanoBase, tamanoBase);
    filtroFn(imageData);
    ctxAux.putImageData(imageData, 0, 0);

    return canvasAux;
  }

  /**
   * Crea el elemento <canvas> y lo inserta en el contenedor del splash.
   * Toma el ancho y alto real del contenedor para evitar pixelación o bandas negras.
   */
  crearCanvas() {
    var contenedor = document.getElementById('game-splash-pantalla');

    var hijos = contenedor.children;
    for (var i = 0; i < hijos.length; i++) {
      hijos[i].style.display = 'none';
    }

    contenedor.classList.add('en-juego');

    this.canvas = document.createElement('canvas');
    this.canvas.id = 'canvas-blocka';
    this.canvas.width = contenedor.clientWidth || 800;
    this.canvas.height = contenedor.clientHeight || 500;
    this.ctx = this.canvas.getContext('2d');

    contenedor.appendChild(this.canvas);
    this.conectarEventos();
  }

  /**
   * Conecta los eventos del canvas: click, contextmenu y mousemove.
   */
  conectarEventos() {
    var self = this;

    // Clic izquierdo: rotar antihorario
    this.canvas.addEventListener('click', function(e) {
      if (!self.jugando) return;
      self.manejarClic(e, 'izquierda');
    });

    // Clic derecho: rotar horario
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
    if (!this.jugando || !this.tablero) return;

    var coords = this.obtenerCoordenadasMouse(evento);
    var pieza = this.tablero.obtenerPiezaEn(coords.x, coords.y);

    if (!pieza || pieza.bloqueada) return;

    // Rotar pieza y redibujar
    pieza.rotar(sentido);
    this.redibujar();

    // Actualizar estado del boton de ayuda de forma segura
    var btnAyuda = document.getElementById('btn-blocka-ayuda');
    if (btnAyuda && typeof this.tablero.hayPiezasParaAyuda === 'function') {
      btnAyuda.disabled = !this.tablero.hayPiezasParaAyuda();
    }

    // Verificar si se resolvio el puzzle
    if (this.tablero.verificarVictoria()) {
      this.verificarYMostrarVictoria();
    }
  }

  /**
   * Maneja el movimiento del mouse: cambia cursor y dibuja highlight.
   */
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

  /**
   * Convierte coordenadas del viewport a coordenadas logicas del canvas.
   */
  obtenerCoordenadasMouse(evento) {
    var rect = this.canvas.getBoundingClientRect();
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

    // Highlight naranja sobre la pieza bajo el cursor (si no esta bloqueada)
    if (this.piezaHover && !this.piezaHover.bloqueada && this.jugando) {
      this.ctx.save();
      this.ctx.strokeStyle = 'rgba(255, 107, 0, 0.7)';
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

  /**
   * Ajuste ultra minimo de dimensiones ante resize de ventana o cambio de orientacion.
   * Solo reajusta si estamos en partida activa y las dimensiones cambiaron.
   */
  ajustarDimensiones() {
    if (!this.jugando || !this.canvas || !this.tablero) return;
    var contenedor = document.getElementById('game-splash-pantalla');
    if (!contenedor) return;

    var nuevoAncho = contenedor.clientWidth;
    var nuevoAlto = contenedor.clientHeight;

    if (nuevoAncho > 0 && nuevoAlto > 0 &&
        (this.canvas.width !== nuevoAncho || this.canvas.height !== nuevoAlto)) {
      this.canvas.width = nuevoAncho;
      this.canvas.height = nuevoAlto;
      this.tablero.redimensionar(nuevoAncho, nuevoAlto);
      this.redibujar();
    }
  }

  /* ---- EXTRA 3: MECANICA DE AYUDITA ---- */

  /**
   * Ubica y bloquea correctamente una subimagen no resuelta.
   * Aplica penalizacion de 5 segundos al tiempo.
   */
  pedirAyudita() {
    if (!this.jugando || !this.tablero) return;

    var piezaFijada = this.tablero.fijarPiezaAleatoria();
    if (!piezaFijada) {
      var btnAyuda = document.getElementById('btn-blocka-ayuda');
      if (btnAyuda) btnAyuda.disabled = true;
      return;
    }

    // Penalizacion de 5 segundos
    this.tiempoTranscurrido += 5;

    // Si hay tiempo maximo regresivo, restar 5s al restante
    if (this.tiempoMaximo !== null) {
      this.tiempoRestante = Math.max(0, this.tiempoRestante - 5);
    }

    // Feedback visual en el HUD
    this.mostrarFeedbackPenalizacion();
    this.actualizarTimerDOM();

    // Redibujar inmediatamente para reflejar la pieza resuelta y bloqueada
    this.redibujar();

    // Deshabilitar boton si no quedan piezas por ayudar
    var btnAyudaEl = document.getElementById('btn-blocka-ayuda');
    if (btnAyudaEl && typeof this.tablero.hayPiezasParaAyuda === 'function') {
      btnAyudaEl.disabled = !this.tablero.hayPiezasParaAyuda();
    }

    // Si la penalizacion agota el tiempo restante en niveles con limite (Extra 4)
    if (this.tiempoMaximo !== null && this.tiempoRestante <= 0) {
      this.manejarDerrota();
      return;
    }

    // Verificar si esta ayuda completa el puzzle
    if (this.tablero.verificarVictoria()) {
      this.verificarYMostrarVictoria();
    }
  }

  /**
   * Muestra un flotador visual "+5s" en rojo sobre el timer del HUD.
   */
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

  /* ---- EXTRA 4: TIMER Y LIMITES DE TIEMPO ---- */

  /**
   * Inicia el temporizador.
   */
  iniciarTimer() {
    var self = this;
    this.detenerTimer();
    this.actualizarTimerDOM();

    this.intervalTimer = setInterval(function() {
      self.tiempoTranscurrido++;

      if (self.tiempoMaximo !== null) {
        self.tiempoRestante--;
        self.actualizarTimerDOM();

        // Si se acaba el tiempo, derrota
        if (self.tiempoRestante <= 0) {
          self.manejarDerrota();
        }
      } else {
        self.actualizarTimerDOM();
      }
    }, 1000);
  }

  /**
   * Detiene el temporizador y limpia clases de urgencia.
   */
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

  /**
   * Actualiza el display del timer en el DOM.
   */
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

  /* ---- VICTORIA ---- */

  /**
   * Maneja la victoria: detiene timer, revela imagen original,
   * guarda record y muestra overlay de victoria.
   */
  verificarYMostrarVictoria() {
    this.jugando = false;
    this.detenerTimer();
    this.piezaHover = null;
    this.canvas.style.cursor = 'default';

    // Deshabilitar boton de ayuda
    var btnAyuda = document.getElementById('btn-blocka-ayuda');
    if (btnAyuda) btnAyuda.disabled = true;

    // Guardar record
    this.guardarRecord(this.nivelActual);

    // Revelar imagen original sin filtro en el area del puzzle
    if (this.canvasOriginal && this.tablero) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.fillStyle = '#101310';
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

    // Mostrar overlay de victoria
    this.mostrarOverlayVictoria();
  }

  /**
   * Crea y muestra el overlay de victoria con botones de navegacion.
   */
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

    // Boton siguiente nivel
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

    // Boton volver al menu del juego
    var btnMenu = document.createElement('button');
    btnMenu.className = 'blocka-btn-victoria blocka-btn-menu';
    btnMenu.textContent = 'Volver al Menú';
    btnMenu.addEventListener('click', function() {
      self.volverAlMenu();
    });
    overlay.appendChild(btnMenu);

    contenedor.appendChild(overlay);
  }

  /**
   * Oculta/remueve el overlay de victoria.
   */
  ocultarOverlayVictoria() {
    var overlay = document.getElementById('blocka-overlay-victoria');
    if (overlay) overlay.remove();
  }

  /* ---- EXTRA 4: ESTADO DE DERROTA POR TIMEOUT ---- */

  /**
   * Maneja el fin de tiempo: detiene el juego y muestra pantalla de Game Over.
   */
  manejarDerrota() {
    this.jugando = false;
    this.detenerTimer();
    this.piezaHover = null;
    this.canvas.style.cursor = 'default';

    var btnAyuda = document.getElementById('btn-blocka-ayuda');
    if (btnAyuda) btnAyuda.disabled = true;

    // Oscurecer ligeramente el canvas
    this.ctx.save();
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.restore();

    this.mostrarOverlayDerrota();
  }

  /**
   * Despliega el overlay de Game Over con opcion de reintentar.
   */
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

  /**
   * Oculta el overlay de derrota.
   */
  ocultarOverlayDerrota() {
    var overlay = document.getElementById('blocka-overlay-derrota');
    if (overlay) overlay.remove();
  }

  /**
   * Pantalla de fin de juego (tras completar todos los niveles).
   */
  mostrarFinDelJuego() {
    var self = this;
    this.jugando = false;
    this.detenerTimer();

    if (this.canvasOriginal && this.tablero) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.fillStyle = '#101310';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(
        this.canvasOriginal,
        0, 0, this.canvasOriginal.width, this.canvasOriginal.height,
        this.tablero.offsetX, this.tablero.offsetY, this.tablero.anchoTotal, this.tablero.altoTotal
      );
    }

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

  /* ---- HUD ---- */

  /**
   * Muestra y actualiza el HUD en la barra de ejecucion.
   */
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

  /* ---- RECORDS (localStorage) ---- */

  /**
   * Guarda el record en localStorage si es mejor que el existente.
   */
  guardarRecord(nivel) {
    var clave = 'blocka-record-nivel-' + nivel;
    var recordPrevio = localStorage.getItem(clave);

    if (recordPrevio === null || this.tiempoTranscurrido < parseInt(recordPrevio, 10)) {
      localStorage.setItem(clave, this.tiempoTranscurrido);
    }

    this.mostrarRecordEnHUD(nivel);
  }

  /**
   * Carga el record de un nivel desde localStorage.
   */
  cargarRecord(nivel) {
    var clave = 'blocka-record-nivel-' + nivel;
    var valor = localStorage.getItem(clave);
    return valor !== null ? parseInt(valor, 10) : null;
  }
}

/* ---- INICIALIZACION ---- */
document.addEventListener('DOMContentLoaded', function() {
  var juego = new JuegoBlocka();
  juego.iniciar();
});
