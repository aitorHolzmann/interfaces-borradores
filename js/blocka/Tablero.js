/* CLASE TABLERO GRILLA DE PIEZAS DEL PUZZLE */

class Tablero {

  constructor(filas, columnas, anchoCanvas, altoCanvas) {
    this.filas = filas;
    this.columnas = columnas;
    this.anchoCanvas = anchoCanvas || (typeof TAMANO_CANVAS !== 'undefined' ? TAMANO_CANVAS : 480);
    this.altoCanvas = altoCanvas || (typeof TAMANO_CANVAS !== 'undefined' ? TAMANO_CANVAS : 480);

    /* DIMENSION DE CELDA ESTRICTAMENTE CUADRADA PARA SIMETRIA EN GIROS */
    var padding = 20;
    var maxCeldaX = Math.floor((this.anchoCanvas - padding * 2) / columnas);
    var maxCeldaY = Math.floor((this.altoCanvas - padding * 2) / filas);
    this.tamanoCelda = Math.max(20, Math.min(maxCeldaX, maxCeldaY));
    this.anchoCelda = this.tamanoCelda;
    this.altoCelda = this.tamanoCelda;

    this.anchoTotal = this.columnas * this.tamanoCelda;
    this.altoTotal = this.filas * this.tamanoCelda;

    /* OFFSET PARA CENTRAR LA GRILLA DENTRO DEL CANVAS */
    this.offsetX = Math.floor((this.anchoCanvas - this.anchoTotal) / 2);
    this.offsetY = Math.floor((this.altoCanvas - this.altoTotal) / 2);

    this.piezas = [];
  }

  /* REAJUSTE DE DIMENSIONES DEL TABLERO ANTE CAMBIO DE VENTANA */
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

  /* RECORTA SUBIMAGENES Y APLICA FILTROS POR SUBIMAGEN MEDIANTE IMAGEDATA */
  crearPiezas(canvasBase, filtroConfig) {
    this.piezas = [];

    var ratioGrilla = this.columnas / this.filas;
    var imgW = canvasBase.width;
    var imgH = canvasBase.height;
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
    var indicePieza = 0;

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

        /* DIBUJAR RECORTE BASE EN MINI CANVAS */
        miniCtx.drawImage(
          canvasBase,
          sx, sy, sw, sh,
          0, 0, this.tamanoCelda, this.tamanoCelda
        );

        /* PROCESAMIENTO DE PIXELES CON IMAGEDATA SEGUN FILTRO */
        if (typeof filtroConfig === 'function') {
          var imgData = miniCtx.getImageData(0, 0, this.tamanoCelda, this.tamanoCelda);
          filtroConfig(imgData, f, c, indicePieza);
          miniCtx.putImageData(imgData, 0, 0);
        }

        var x = this.offsetX + c * this.tamanoCelda;
        var y = this.offsetY + f * this.tamanoCelda;

        var pieza = new Pieza(f, c, x, y, this.tamanoCelda, this.tamanoCelda, miniCanvas);
        this.piezas.push(pieza);
        indicePieza++;
      }
    }
  }

  /* ASIGNA ANGULOS ALEATORIOS INICIALES */
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

  /* DIBUJA TODAS LAS PIEZAS Y LA GRILLA */
  dibujar(ctx) {
    ctx.clearRect(0, 0, this.anchoCanvas, this.altoCanvas);

    /* FONDO DE TAPETE OSCURO */
    ctx.fillStyle = '#101310';
    ctx.fillRect(0, 0, this.anchoCanvas, this.altoCanvas);

    /* FONDO DEL AREA DE JUEGO */
    ctx.fillStyle = '#171c17';
    ctx.fillRect(this.offsetX, this.offsetY, this.anchoTotal, this.altoTotal);

    /* DIBUJAR CADA PIEZA */
    for (var i = 0; i < this.piezas.length; i++) {
      this.piezas[i].dibujar(ctx);
    }

    /* GRILLA DIVISORIA */
    this.dibujarGrilla(ctx);
  }

  /* DIBUJA LINEAS DIVISORIAS */
  dibujarGrilla(ctx) {
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;

    /* MARCO EXTERIOR */
    ctx.strokeRect(this.offsetX, this.offsetY, this.anchoTotal, this.altoTotal);

    /* LINEAS VERTICALES */
    for (var c = 1; c < this.columnas; c++) {
      var x = this.offsetX + c * this.tamanoCelda;
      ctx.beginPath();
      ctx.moveTo(x, this.offsetY);
      ctx.lineTo(x, this.offsetY + this.altoTotal);
      ctx.stroke();
    }

    /* LINEAS HORIZONTALES */
    for (var f = 1; f < this.filas; f++) {
      var y = this.offsetY + f * this.tamanoCelda;
      ctx.beginPath();
      ctx.moveTo(this.offsetX, y);
      ctx.lineTo(this.offsetX + this.anchoTotal, y);
      ctx.stroke();
    }

    ctx.restore();
  }

  /* BUSQUEDA DE PIEZA BAJO EL CURSOR CON HIT TESTING */
  obtenerPiezaEn(mx, my) {
    for (var i = 0; i < this.piezas.length; i++) {
      if (this.piezas[i].contienePunto(mx, my)) {
        return this.piezas[i];
      }
    }
    return null;
  }

  /* VERIFICA SI TODAS LAS PIEZAS ESTAN EN ORIENTACION CERO */
  verificarVictoria() {
    for (var i = 0; i < this.piezas.length; i++) {
      if (!this.piezas[i].estaResuelta()) {
        return false;
      }
    }
    return true;
  }

  /* MECANICA DE AYUDITA SEGUN EXTRA TRES */
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

  /* COMPRUEBA DISPONIBILIDAD DE PIEZAS PARA AYUDA */
  hayPiezasParaAyuda() {
    for (var i = 0; i < this.piezas.length; i++) {
      if (!this.piezas[i].estaResuelta() && !this.piezas[i].bloqueada) {
        return true;
      }
    }
    return false;
  }
}
