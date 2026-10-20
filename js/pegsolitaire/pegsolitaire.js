/**
 * PEGSOLITAIRE.JS — Controlador y Orquestador del Videojuego Peg Solitaire
 * Materia: Diseño de Interfaces (TUDAI / UNCPBA)
 * Entregable Nº 4 — Patrón MVC (Capa de Controlador)
 *
 * Responsabilidad estricta:
 *  1. Instanciar y orquestar el Modelo (SolitaireModel) y la Vista (TableroView).
 *  2. Gestionar la interacción de mouse con Drag & Drop continuo en Canvas (mousedown, mousemove, mouseup).
 *  3. Activar los HINTS ANIMADOS en tiempo real al arrastrar una pieza.
 *  4. Ejecutar el bucle de animación con requestAnimationFrame para 60fps constantes.
 *  5. Controlar el cronómetro regresivo de 03:00 con derrota automática por tiempo agotado.
 *  6. Gestionar el selector de skins temáticos (Medallas, Granadas, Insignias).
 *  7. Manejar modales accesibles de Victoria y Derrota con persistencia de estado.
 *  8. Exponer hooks de testeo por URL Hash (#test-partida, #test-victoria, #test-derrota, #test-hints).
 */

class JuegoPegSolitaire {
  constructor() {
    this.canvas = document.getElementById('canvas-pegsolitaire');
    if (!this.canvas) {
      console.warn('Canvas #canvas-pegsolitaire no encontrado aún.');
      return;
    }

    // Instancias de Modelo y Vista (Patrón MVC)
    this.modelo = new SolitaireModel();
    this.vista = new TableroView(this.canvas);

    // Colecciones de entidades visuales
    this.fichas = [];
    this.fichasComidas = [];

    // Estado del Drag and Drop
    this.fichaArrastrada = null;
    this.dragOffset = { x: 0, y: 0 };
    this.hintsActivos = [];

    // Control de tiempo y estado
    this.tiempoRestante = TIEMPO_LIMITE_SEGUNDOS;
    this.timerInterval = null;
    this.jugando = false;
    this.tiempoInicioPartida = 0;

    // Gestión de skins
    this.skinActual = 'medalla';
    this.imagenesSkins = {};

    // Animación continua
    this.animacionFrameId = null;

    // Referencias a elementos del DOM
    this.splashPantalla = document.getElementById('game-splash-pantalla');
    this.hudElement = document.getElementById('solitaire-hud');
    this.timerElement = document.getElementById('solitaire-timer');
    this.fichasElement = document.getElementById('solitaire-fichas-restantes');
    this.modalFin = document.getElementById('modal-fin-partida');
    this.btnIniciar = document.getElementById('btn-iniciar-partida');
    this.btnReiniciar = document.getElementById('btn-solitaire-reiniciar');
    this.btnSalir = document.getElementById('btn-solitaire-salir');
    this.btnModalJugarNuevo = document.getElementById('btn-modal-reintentar');

    // Inicializar precarga y eventos
    this.precargarSkins(() => {
      this.enlazarEventos();
      this.comprobarHooksURL();
    });
  }

  /**
   * Precarga en memoria las imágenes de los tres skins temáticos.
   * Evita parpadeos o demoras visuales al cambiar de apariencia durante la partida.
   * @param {Function} callback - Función a ejecutar al completar la carga.
   */
  precargarSkins(callback) {
    const keys = Object.keys(SKINS_FICHAS);
    let cargadas = 0;

    keys.forEach(key => {
      const img = new Image();
      img.src = SKINS_FICHAS[key].src;
      img.onload = () => {
        cargadas++;
        if (cargadas === keys.length && typeof callback === 'function') {
          callback();
        }
      };
      img.onerror = () => {
        cargadas++;
        if (cargadas === keys.length && typeof callback === 'function') {
          callback();
        }
      };
      this.imagenesSkins[key] = img;
    });
  }

  /**
   * Vincula los escuchadores de eventos del mouse y los botones de la interfaz.
   */
  enlazarEventos() {
    // 1. Eventos de Mouse sobre el Canvas nativo
    this.canvas.addEventListener('mousedown', (e) => this.manejarMouseDown(e));
    window.addEventListener('mousemove', (e) => this.manejarMouseMove(e));
    window.addEventListener('mouseup', (e) => this.manejarMouseUp(e));

    // 2. Botón Iniciar del Splash
    if (this.btnIniciar) {
      this.btnIniciar.addEventListener('click', () => this.comenzarPartida());
    }

    // 3. Botón Reiniciar del HUD
    if (this.btnReiniciar) {
      this.btnReiniciar.addEventListener('click', () => this.reiniciar());
    }

    // 4. Botón Salir al menú principal
    if (this.btnSalir) {
      this.btnSalir.addEventListener('click', () => this.salirAlMenu());
    }

    // 5. Botón de acción en el modal de fin de partida
    if (this.btnModalJugarNuevo) {
      this.btnModalJugarNuevo.addEventListener('click', () => {
        this.cerrarModal();
        this.comenzarPartida();
      });
    }

    // 6. Botones selectores de skin en el HUD
    const botonesSkin = document.querySelectorAll('.solitaire-btn-skin');
    botonesSkin.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget;
        const skinId = target.getAttribute('data-skin');
        if (skinId) {
          this.cambiarSkin(skinId);
        }
      });
    });

    // 7. Botón Pantalla Completa nativo
    const btnFullscreen = document.getElementById('btn-fullscreen');
    if (btnFullscreen) {
      btnFullscreen.addEventListener('click', () => this.toggleFullscreen());
    }
  }

  /**
   * Convierte coordenadas de evento de pantalla (clientX, clientY)
   * a coordenadas relativas internas del Canvas considerando posibles escalados CSS.
   * @param {MouseEvent} e - Evento de ratón.
   * @returns {{x: number, y: number}} Coordenadas exactas en el Canvas.
   */
  obtenerCoordenadasCanvas(e) {
    const rect = this.canvas.getBoundingClientRect();
    const escalaX = this.canvas.width / rect.width;
    const escalaY = this.canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * escalaX,
      y: (e.clientY - rect.top) * escalaY
    };
  }

  /**
   * Da inicio formal a una partida:
   *  - Inicializa el modelo y genera las 32 fichas visuales.
   *  - Muestra el HUD y oculta la pantalla de bienvenida.
   *  - Inicia el temporizador de 180s y el bucle de renderizado.
   */
  comenzarPartida() {
    this.cerrarModal();
    this.modelo.reiniciar();
    this.fichasComidas = [];
    this.generarFichasVisuales();

    this.jugando = true;
    this.tiempoInicioPartida = Date.now();
    this.iniciarTimer();

    // Actualizar estados visuales de la interfaz
    if (this.splashPantalla) {
      this.splashPantalla.classList.add('en-juego');
    }
    if (this.hudElement) {
      this.hudElement.style.display = 'flex';
    }

    this.actualizarHUD();

    // Iniciar el loop de animación continua
    if (!this.animacionFrameId) {
      this.loopAnimacion(performance.now());
    }
  }

  /**
   * Crea las instancias de la clase Ficha correspondientes a las casillas ocupadas en el modelo.
   */
  generarFichasVisuales() {
    this.fichas = [];
    let idAuto = 1;
    const imgSkin = this.imagenesSkins[this.skinActual];

    for (let f = 0; f < TAMANO_GRILLA; f++) {
      for (let c = 0; c < TAMANO_GRILLA; c++) {
        if (this.modelo.obtenerEstado(f, c) === ESTADO.FICHA) {
          const casillero = this.vista.obtenerCasillero(f, c);
          if (casillero) {
            this.fichas.push(new Ficha(
              idAuto++,
              f,
              c,
              casillero.x,
              casillero.y,
              RADIO_FICHA,
              imgSkin
            ));
          }
        }
      }
    }
  }

  /**
   * Administra la cuenta regresiva desde 180 segundos.
   * Decrementa cada segundo y finaliza la partida al llegar a 00:00.
   */
  iniciarTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    this.tiempoRestante = TIEMPO_LIMITE_SEGUNDOS;
    this.actualizarVisualTimer();

    this.timerInterval = setInterval(() => {
      this.tiempoRestante--;
      this.actualizarVisualTimer();

      if (this.tiempoRestante <= 0) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
        this.manejarDerrota('¡Se agotó el tiempo límite de la misión táctica!');
      }
    }, 1000);
  }

  /**
   * Da formato MM:SS al cronómetro en el HUD (ej: 03:00, 02:45).
   */
  actualizarVisualTimer() {
    if (!this.timerElement) return;
    const minutos = Math.floor(this.tiempoRestante / 60);
    const segundos = this.tiempoRestante % 60;
    const textoMinutos = minutos < 10 ? '0' + minutos : minutos;
    const textoSegundos = segundos < 10 ? '0' + segundos : segundos;
    this.timerElement.textContent = `${textoMinutos}:${textoSegundos}`;

    // Alerta visual de advertencia táctica en los últimos 30 segundos
    if (this.tiempoRestante <= 30) {
      this.timerElement.classList.add('alerta-tiempo');
    } else {
      this.timerElement.classList.remove('alerta-tiempo');
    }
  }

  /**
   * Actualiza el contador de fichas en el HUD superior.
   */
  actualizarHUD() {
    if (this.fichasElement) {
      this.fichasElement.textContent = `${this.modelo.fichasRestantes} Fichas`;
    }
  }

  /**
   * Manejador de evento MOUSEDOWN:
   * Realiza el Hit-Testing radial para seleccionar una ficha e inicializar su arrastre,
   * calculando inmediatamente los movimientos legales y activando los HINTS ANIMADOS.
   * @param {MouseEvent} e - Evento de clic.
   */
  manejarMouseDown(e) {
    if (!this.jugando) return;
    if (e.button !== 0) return; // Solo clic primario izquierdo

    const { x, y } = this.obtenerCoordenadasCanvas(e);

    // Iterar en reversa para agarrar primero las fichas dibujadas en la parte superior
    for (let i = this.fichas.length - 1; i >= 0; i--) {
      const ficha = this.fichas[i];
      if (ficha.isPointInside(x, y)) {
        this.fichaArrastrada = ficha;
        ficha.isDragging = true;
        this.dragOffset = {
          x: x - ficha.x,
          y: y - ficha.y
        };

        // Consultar movimientos legales al Modelo desacoplado
        const movimientosLegales = this.modelo.obtenerMovimientosValidos(ficha.fila, ficha.col);

        // Mapear los destinos a objetos Casillero para renderizar los HINTS ANIMADOS
        this.hintsActivos = movimientosLegales.map(m => {
          return this.vista.obtenerCasillero(m.destFila, m.destCol);
        }).filter(Boolean);

        // Cambiar cursor a agarrando
        this.canvas.style.cursor = 'grabbing';
        break;
      }
    }
  }

  /**
   * Manejador de evento MOUSEMOVE:
   * Desplaza la ficha arrastrada en tiempo real sincronizándola con el puntero.
   * @param {MouseEvent} e - Evento de movimiento.
   */
  manejarMouseMove(e) {
    if (!this.jugando || !this.fichaArrastrada) return;

    const { x, y } = this.obtenerCoordenadasCanvas(e);
    this.fichaArrastrada.setPosicion(x - this.dragOffset.x, y - this.dragOffset.y);
  }

  /**
   * Manejador de evento MOUSEUP:
   * Evalúa el destino de soltado. Si cae en un casillero legal con hint activo,
   * consolida la jugada, elimina la ficha intermedia y comprueba victoria/derrota.
   * Si cae fuera de los casilleros legales, activa el retorno elástico obligatorio.
   * @param {MouseEvent} e - Evento de liberación.
   */
  manejarMouseUp(e) {
    if (!this.jugando || !this.fichaArrastrada) return;

    const ficha = this.fichaArrastrada;
    this.canvas.style.cursor = 'default';

    // Evaluar si el centro de la ficha soltada cayó dentro de alguno de los casilleros válidos con hint
    let casilleroDestino = null;
    for (let i = 0; i < this.hintsActivos.length; i++) {
      const cas = this.hintsActivos[i];
      if (cas.contienePunto(ficha.x, ficha.y)) {
        casilleroDestino = cas;
        break;
      }
    }

    if (casilleroDestino) {
      // 1. Ejecutar movimiento en el Modelo lógico
      const resultado = this.modelo.ejecutarMovimiento(
        ficha.fila,
        ficha.col,
        casilleroDestino.fila,
        casilleroDestino.col
      );

      if (resultado.exito) {
        // 2. Localizar y remover visualmente la ficha intermedia comida
        const idxComida = this.fichas.findIndex(f => {
          return f.fila === resultado.saltadaFila && f.col === resultado.saltadaCol;
        });

        if (idxComida !== -1) {
          const fichaComida = this.fichas.splice(idxComida, 1)[0];
          this.fichasComidas.push(fichaComida);
        }

        // 3. Fijar permanentemente la ficha en su nueva posición
        ficha.fijarEnCasillero(
          casilleroDestino.fila,
          casilleroDestino.col,
          casilleroDestino.x,
          casilleroDestino.y
        );

        // 4. Actualizar HUD y evaluar condiciones de fin de partida
        this.actualizarHUD();
        this.verificarFinDeJuego();
      } else {
        // Salto no admitido: retorno obligatorio
        ficha.restaurarPosicion();
      }
    } else {
      // Soltado en el vacío o fuera de rango legal: retorno obligatorio
      ficha.restaurarPosicion();
    }

    // Limpiar estado de arrastre y apagar los hints
    ficha.isDragging = false;
    this.fichaArrastrada = null;
    this.hintsActivos = [];
  }

  /**
   * Bucle de animación continuo a 60fps con requestAnimationFrame.
   * Garantiza que las oscilaciones sinusoidales de los aros y flechas de hints
   * se muevan con absoluta fluidez sin caídas de cuadros.
   * @param {number} timestamp - Marca temporal del navegador.
   */
  loopAnimacion(timestamp) {
    this.vista.dibujar(
      this.fichas,
      this.fichaArrastrada,
      this.hintsActivos,
      this.fichasComidas,
      timestamp
    );

    this.animacionFrameId = requestAnimationFrame((t) => this.loopAnimacion(t));
  }

  /**
   * Comprueba tras cada salto legal si la partida ha llegado a su fin:
   *  - Victoria: Queda exactamente 1 ficha.
   *  - Derrota: Quedan > 1 fichas pero ya no hay saltos ortogonales posibles.
   */
  verificarFinDeJuego() {
    if (this.modelo.esVictoria()) {
      if (this.timerInterval) clearInterval(this.timerInterval);
      this.manejarVictoria();
    } else if (!this.modelo.hayMovimientosPosibles()) {
      if (this.timerInterval) clearInterval(this.timerInterval);
      this.manejarDerrota('¡No quedan más movimientos posibles en el tablero!');
    }
  }

  /**
   * Despliega el modal de victoria con estadísticas de tiempo y bajas conseguidas.
   */
  manejarVictoria() {
    this.jugando = false;
    const segundosEmpleados = Math.max(1, Math.round((Date.now() - this.tiempoInicioPartida) / 1000));
    const min = Math.floor(segundosEmpleados / 60);
    const seg = segundosEmpleados % 60;
    const textoTiempo = `${min < 10 ? '0' + min : min}:${seg < 10 ? '0' + seg : seg}`;

    this.mostrarModal({
      tipo: 'victoria',
      titulo: '¡VICTORIA TÁCTICA!',
      mensaje: '¡Excelente maniobra, Comandante! Has despejado el sector militar dejando exactamente una sola ficha en pie.',
      tiempo: textoTiempo,
      fichasRestantes: '1 Ficha',
      btnTexto: 'Jugar de Nuevo'
    });
  }

  /**
   * Despliega el modal de derrota táctica detallando el motivo del fallo.
   * @param {string} motivo - Razón del Game Over (tiempo agotado o sin movimientos).
   */
  manejarDerrota(motivo) {
    this.jugando = false;
    this.mostrarModal({
      tipo: 'derrota',
      titulo: 'MISIÓN INTERRUMPIDA',
      mensaje: motivo,
      tiempo: this.timerElement ? this.timerElement.textContent : '--:--',
      fichasRestantes: `${this.modelo.fichasRestantes} Fichas`,
      btnTexto: 'Reintentar Misión'
    });
  }

  /**
   * Construye y exhibe el modal accesible de fin de partida.
   * @param {Object} datos - Parámetros del modal (tipo, titulo, mensaje, tiempo, etc.).
   */
  mostrarModal(datos) {
    if (!this.modalFin) return;

    const tituloEl = document.getElementById('modal-fin-titulo');
    const mensajeEl = document.getElementById('modal-fin-mensaje');
    const tiempoEl = document.getElementById('modal-fin-tiempo');
    const fichasEl = document.getElementById('modal-fin-fichas');
    const btnEl = document.getElementById('btn-modal-reintentar');
    const iconoEl = document.getElementById('modal-fin-icono');

    if (iconoEl) iconoEl.textContent = datos.tipo === 'victoria' ? '🎖️' : '⚠️';
    if (tituloEl) tituloEl.textContent = datos.titulo;
    if (mensajeEl) mensajeEl.textContent = datos.mensaje;
    if (tiempoEl) tiempoEl.textContent = datos.tiempo;
    if (fichasEl) fichasEl.textContent = datos.fichasRestantes;
    if (btnEl) btnEl.textContent = datos.btnTexto;

    this.modalFin.classList.remove('modal-victoria', 'modal-derrota');
    this.modalFin.classList.add(datos.tipo === 'victoria' ? 'modal-victoria' : 'modal-derrota');
    this.modalFin.style.display = 'flex';
  }

  /**
   * Cierra el modal de fin de partida.
   */
  cerrarModal() {
    if (this.modalFin) {
      this.modalFin.style.display = 'none';
    }
  }

  /**
   * Cambia el skin visual de las fichas en tiempo real.
   * @param {string} skinId - Clave del skin ('medalla', 'granada', 'insignia').
   */
  cambiarSkin(skinId) {
    if (!SKINS_FICHAS[skinId]) return;
    this.skinActual = skinId;
    const nuevaImagen = this.imagenesSkins[skinId];

    // Actualizar imagen en todas las fichas activas
    this.fichas.forEach(f => f.setImagen(nuevaImagen));
    // Actualizar imagen en las fichas del panel de bajas
    this.fichasComidas.forEach(f => f.setImagen(nuevaImagen));

    // Reflejar botón activo en la interfaz
    const botonesSkin = document.querySelectorAll('.solitaire-btn-skin');
    botonesSkin.forEach(btn => {
      if (btn.getAttribute('data-skin') === skinId) {
        btn.classList.add('activo');
      } else {
        btn.classList.remove('activo');
      }
    });
  }

  /**
   * Reinicia la partida desde cero con el botón del HUD.
   */
  reiniciar() {
    this.comenzarPartida();
  }

  /**
   * Sale del juego y vuelve a la pantalla inicial de bienvenida.
   */
  salirAlMenu() {
    this.jugando = false;
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.cerrarModal();

    if (this.splashPantalla) {
      this.splashPantalla.classList.remove('en-juego');
    }
    if (this.hudElement) {
      this.hudElement.style.display = 'none';
    }
  }

  /**
   * Alterna el modo de pantalla completa sobre el área de juego.
   */
  toggleFullscreen() {
    const areaJuego = document.querySelector('.area-ejecucion-juego');
    if (!areaJuego) return;

    if (!document.fullscreenElement) {
      if (areaJuego.requestFullscreen) {
        areaJuego.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  /**
   * HOOKS DE TESTEO AUTOMÁTICO POR URL HASH (#test-...):
   * Permiten verificar el comportamiento del juego instantáneamente sin necesidad
   * de completar la partida manualmente:
   *  - #test-partida: Inicia inmediatamente el juego saltando la pantalla de splash.
   *  - #test-victoria: Configura el tablero con 2 fichas y salta a victoria automática.
   *  - #test-derrota: Dispara inmediatamente el modal de derrota por falta de movimientos.
   *  - #test-hints: Selecciona automáticamente la ficha en (3, 1) y activa los hints animados.
   */
  comprobarHooksURL() {
    const hash = window.location.hash;
    if (!hash) return;

    if (hash === '#test-partida') {
      this.comenzarPartida();
    } else if (hash === '#test-salto') {
      this.comenzarPartida();
      const fichaTest = this.fichas.find(f => f.fila === 3 && f.col === 1);
      const destinoTest = this.vista.obtenerCasillero(3, 3);
      if (fichaTest && destinoTest) {
        const res = this.modelo.ejecutarMovimiento(3, 1, 3, 3);
        if (res.exito) {
          const idxComida = this.fichas.findIndex(f => f.fila === res.saltadaFila && f.col === res.saltadaCol);
          if (idxComida !== -1) {
            this.fichasComidas.push(this.fichas.splice(idxComida, 1)[0]);
          }
          fichaTest.fijarEnCasillero(3, 3, destinoTest.x, destinoTest.y);
          this.actualizarHUD();
        }
      }
    } else if (hash === '#test-skin-granada') {
      this.comenzarPartida();
      this.cambiarSkin('granada');
    } else if (hash === '#test-skin-insignia') {
      this.comenzarPartida();
      this.cambiarSkin('insignia');
    } else if (hash === '#test-victoria') {
      this.comenzarPartida();
      // Configurar estado final listo para ganar
      this.fichas = [this.fichas[0]];
      this.fichas[0].fijarEnCasillero(3, 3, 400, 250);
      this.modelo.fichasRestantes = 1;
      this.verificarFinDeJuego();
    } else if (hash === '#test-derrota') {
      this.comenzarPartida();
      this.manejarDerrota('¡No quedan más movimientos posibles en el tablero!');
    } else if (hash === '#test-hints') {
      this.comenzarPartida();
      // Localizar ficha en (3, 1) que tiene salto legal inicial hacia (3, 3)
      const fichaTest = this.fichas.find(f => f.fila === 3 && f.col === 1);
      if (fichaTest) {
        this.fichaArrastrada = fichaTest;
        fichaTest.isDragging = true;
        const movs = this.modelo.obtenerMovimientosValidos(fichaTest.fila, fichaTest.col);
        this.hintsActivos = movs.map(m => this.vista.obtenerCasillero(m.destFila, m.destCol)).filter(Boolean);
      }
    }
  }
}

// Inicialización automática cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.juegoPegSolitaire = new JuegoPegSolitaire();
});
