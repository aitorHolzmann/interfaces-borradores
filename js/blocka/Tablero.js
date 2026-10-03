/* CLASE TABLERO — Grilla de piezas del puzzle.
   Gestiona la creacion de subimagenes cuadradas, el desorden (scramble),
   el dibujo completo, el hit-testing, la verificacion de victoria
   y la mecanica de Ayudita. */

class Tablero {

  /**
   * @param {Number} filas        Cantidad de filas de la grilla
   * @param {Number} columnas     Cantidad de columnas de la grilla
   * @param {Number} [anchoCanvas] Ancho total del canvas en px
   * @param {Number} [altoCanvas]  Alto total del canvas en px
   */
  constructor(filas, columnas, anchoCanvas, altoCanvas) {
    this.filas = filas;
    this.columnas = columnas;
    this.anchoCanvas = anchoCanvas || (typeof TAMANO_CANVAS !== 'undefined' ? TAMANO_CANVAS : 480);
    this.altoCanvas = altoCanvas || (typeof TAMANO_CANVAS !== 'undefined' ? TAMANO_CANVAS : 480);

    // Dimension de celda ESTRICTAMENTE CUADRADA para garantizar
    // simetria perfecta en rotaciones de 90 grados sin invadir celdas vecinas.
    // Deja 20px de margen interior respecto a los bordes del canvas.
    var padding = 20;
    var maxCeldaX = Math.floor((this.anchoCanvas - padding * 2) / columnas);
    var maxCeldaY = Math.floor((this.altoCanvas - padding * 2) / filas);
    this.tamanoCelda = Math.max(20, Math.min(maxCeldaX, maxCeldaY));
    this.anchoCelda = this.tamanoCelda;
    this.altoCelda = this.tamanoCelda;

    this.anchoTotal = this.columnas * this.tamanoCelda;
    this.altoTotal = this.filas * this.tamanoCelda;

    // Offset para centrar la grilla dentro del canvas
    this.offsetX = Math.floor((this.anchoCanvas - this.anchoTotal) / 2);
    this.offsetY = Math.floor((this.altoCanvas - this.altoTotal) / 2);

    this.piezas = [];
  }

  /**
   * Reajuste rapido de dimensiones del tablero ante un cambio de tamano de ventana.
   * Actualiza el tamano de celdas y posiciones de piezas conservando su estado y angulo.
   */
  redimensionar(anchoCanvas, altoCanvas) {
    this.anchoCanvas = anchoCanvas;
    this.altoCanvas = altoCanvas;

    var padding = 20;
    var maxCeldaX = Math.floor((this.anchoCanvas - padding * 2) / this.columnas);
    var maxCeldaY = Math.floor((this.altoCanvas - padding * 2) / this.filas);
    this.tamanoCelda = Math.max(20, Math.min(maxCeldaX, maxCeldaY));
    this.anchoCelda = this.tamanoCelda;
    this.altoCelda = this.tamanoCelda;

    this.anchoTotal = this.columnas * this.tamanoCelda;
    this.altoTotal = this.filas * this.tamanoCelda;

    this.offsetX = Math.floor((this.anchoCanvas - this.anchoTotal) / 2);
    this.offsetY = Math.floor((this.altoCanvas - this.altoTotal) / 2);

    for (var i = 0; i < this.piezas.length; i++) {
      var p = this.piezas[i];
      p.x = this.offsetX + p.columna * this.tamanoCelda;
      p.y = this.offsetY + p.fila * this.tamanoCelda;
      p.ancho = this.tamanoCelda;
      p.alto = this.tamanoCelda;
    }
  }

  /**
   * Recorta la imagen filtrada en subimagenes cuadradas proporcionales y crea una Pieza por celda.
   *
   * @param {HTMLCanvasElement} canvasFiltrado  Canvas con la imagen filtrada completa
   */
  crearPiezas(canvasFiltrado) {
    this.piezas = [];

    var ratioGrilla = this.columnas / this.filas;
    var imgW = canvasFiltrado.width;
    var imgH = canvasFiltrado.height;
    var recorteW, recorteH, recorteX, recorteY;

    if (ratioGrilla >= 1) {
      recorteW = imgW;
      recorteH = Math.floor(imgW / ratioGrilla);
      recorteX = 0;
      recorteY = Math.floor((imgH - recorteH) / 2);
    } else {
      recorteH = imgH;
      recorteW = Math.floor(imgH * ratioGrilla);
      recorteX = Math.floor((imgW - recorteW) / 2);
      recorteY = 0;
    }

    var pasoImgX = recorteW / this.columnas;
    var pasoImgY = recorteH / this.filas;

    for (var f = 0; f < this.filas; f++) {
      for (var c = 0; c < this.columnas; c++) {
        var miniCanvas = document.createElement('canvas');
        miniCanvas.width = this.tamanoCelda;
        miniCanvas.height = this.tamanoCelda;
        var miniCtx = miniCanvas.getContext('2d');

        var sx = Math.floor(recorteX + c * pasoImgX);
        var sy = Math.floor(recorteY + f * pasoImgY);
        var sw = Math.floor(pasoImgX);
        var sh = Math.floor(pasoImgY);

        // Recortar subimagen cuadrada
        miniCtx.drawImage(
          canvasFiltrado,
          sx, sy, sw, sh,
          0, 0, this.tamanoCelda, this.tamanoCelda
        );

        // Posicion en el canvas principal
        var x = this.offsetX + c * this.tamanoCelda;
        var y = this.offsetY + f * this.tamanoCelda;

        var pieza = new Pieza(f, c, x, y, this.tamanoCelda, this.tamanoCelda, miniCanvas);
        this.piezas.push(pieza);
      }
    }
  }

  /**
   * Asigna angulos aleatorios de [0, 90, 180, 270] asegurando
   * que al menos 2 piezas comiencen desordenadas.
   */
  desordenar() {
    var angulos = [0, 90, 180, 270];

    for (var i = 0; i < this.piezas.length; i++) {
      this.piezas[i].angulo = angulos[Math.floor(Math.random() * 4)];
    }

    var noResueltas = 0;
    var indicesResueltas = [];

    for (var i = 0; i < this.piezas.length; i++) {
      if (this.piezas[i].angulo !== 0) {
        noResueltas++;
      } else {
        indicesResueltas.push(i);
      }
    }

    if (noResueltas < 2) {
      var angulosForzados = [90, 180, 270];
      var faltantes = 2 - noResueltas;

      for (var j = 0; j < faltantes && indicesResueltas.length > 0; j++) {
        var idxAleatorio = Math.floor(Math.random() * indicesResueltas.length);
        var idxPieza = indicesResueltas.splice(idxAleatorio, 1)[0];
        this.piezas[idxPieza].angulo = angulosForzados[Math.floor(Math.random() * 3)];
      }
    }
  }

  /**
   * Dibuja todas las piezas y la grilla divisoria en el canvas.
   */
  dibujar(ctx) {
    ctx.clearRect(0, 0, this.anchoCanvas, this.altoCanvas);

    // Fondo tapete oscuro elegante para toda la superficie del canvas
    ctx.fillStyle = '#101310';
    ctx.fillRect(0, 0, this.anchoCanvas, this.altoCanvas);

    // Fondo para el area del tablero de piezas
    ctx.fillStyle = '#171c17';
    ctx.fillRect(this.offsetX, this.offsetY, this.anchoTotal, this.altoTotal);

    // Dibujar cada pieza
    for (var i = 0; i < this.piezas.length; i++) {
      this.piezas[i].dibujar(ctx);
    }

    // Dibujar grilla divisoria encima
    this.dibujarGrilla(ctx);
  }

  /**
   * Dibuja las lineas divisorias de la grilla sobre las piezas.
   */
  dibujarGrilla(ctx) {
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;

    // Marco exterior del tablero
    ctx.strokeRect(this.offsetX, this.offsetY, this.anchoTotal, this.altoTotal);

    // Lineas verticales internas
    for (var c = 1; c < this.columnas; c++) {
      var x = this.offsetX + c * this.tamanoCelda;
      ctx.beginPath();
      ctx.moveTo(x, this.offsetY);
      ctx.lineTo(x, this.offsetY + this.altoTotal);
      ctx.stroke();
    }

    // Lineas horizontales internas
    for (var f = 1; f < this.filas; f++) {
      var y = this.offsetY + f * this.tamanoCelda;
      ctx.beginPath();
      ctx.moveTo(this.offsetX, y);
      ctx.lineTo(this.offsetX + this.anchoTotal, y);
      ctx.stroke();
    }

    ctx.restore();
  }

  /**
   * Retorna la pieza que contiene el punto (mx, my), o null si ninguna.
   */
  obtenerPiezaEn(mx, my) {
    for (var i = 0; i < this.piezas.length; i++) {
      if (this.piezas[i].contienePunto(mx, my)) {
        return this.piezas[i];
      }
    }
    return null;
  }

  /**
   * Retorna true si TODAS las piezas estan en su orientacion correcta (angulo === 0).
   */
  verificarVictoria() {
    for (var i = 0; i < this.piezas.length; i++) {
      if (!this.piezas[i].estaResuelta()) {
        return false;
      }
    }
    return true;
  }

  /**
   * Mecanica de Ayudita (Extra 3):
   * Ubica y bloquea correctamente una pieza no resuelta al azar.
   * Retorna la pieza fijada, o null si ya todas estan resueltas/bloqueadas.
   */
  fijarPiezaAleatoria() {
    var candidatas = [];
    for (var i = 0; i < this.piezas.length; i++) {
      if (!this.piezas[i].estaResuelta() && !this.piezas[i].bloqueada) {
        candidatas.push(this.piezas[i]);
      }
    }

    if (candidatas.length === 0) return null;

    var indice = Math.floor(Math.random() * candidatas.length);
    var elegida = candidatas[indice];
    elegida.angulo = 0;
    elegida.bloqueada = true;

    return elegida;
  }

  /**
   * Retorna true si todavia existen piezas sin resolver que puedan recibir ayuda.
   */
  hayPiezasParaAyuda() {
    for (var i = 0; i < this.piezas.length; i++) {
      if (!this.piezas[i].estaResuelta() && !this.piezas[i].bloqueada) {
        return true;
      }
    }
    return false;
  }
}
