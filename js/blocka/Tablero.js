/* CLASE TABLERO — Grilla de piezas del puzzle.
   Gestiona la creacion de subimágenes, el desorden (scramble),
   el dibujo completo, el hit-testing y la verificacion de victoria. */

class Tablero {

  /**
   * @param {Number} filas     Cantidad de filas de la grilla
   * @param {Number} columnas  Cantidad de columnas de la grilla
   */
  constructor(filas, columnas) {
    this.filas = filas;
    this.columnas = columnas;
    this.anchoCelda = TAMANO_CANVAS / columnas;
    this.altoCelda = TAMANO_CANVAS / filas;
    this.piezas = [];
  }

  /**
   * Recorta la imagen filtrada en subimágenes y crea una Pieza por cada celda.
   * Usa drawImage con 9 argumentos para extraer cada region.
   *
   * @param {HTMLCanvasElement} canvasFiltrado  Canvas con la imagen filtrada completa
   */
  crearPiezas(canvasFiltrado) {
    this.piezas = [];

    for (var f = 0; f < this.filas; f++) {
      for (var c = 0; c < this.columnas; c++) {
        // Crear mini-canvas para esta subimagen
        var miniCanvas = document.createElement('canvas');
        miniCanvas.width = this.anchoCelda;
        miniCanvas.height = this.altoCelda;
        var miniCtx = miniCanvas.getContext('2d');

        // Coordenadas de recorte en la imagen filtrada
        var sx = c * this.anchoCelda;
        var sy = f * this.altoCelda;

        // Recortar la subimagen del canvas filtrado al mini-canvas
        miniCtx.drawImage(
          canvasFiltrado,
          sx, sy, this.anchoCelda, this.altoCelda,
          0, 0, this.anchoCelda, this.altoCelda
        );

        // Posicion de la pieza en el canvas principal
        var x = c * this.anchoCelda;
        var y = f * this.altoCelda;

        var pieza = new Pieza(f, c, x, y, this.anchoCelda, this.altoCelda, miniCanvas);
        this.piezas.push(pieza);
      }
    }
  }

  /**
   * Asigna angulos aleatorios a las piezas.
   * Garantiza que al menos 2 piezas tengan angulo distinto de 0
   * (el puzzle nunca empieza resuelto).
   */
  desordenar() {
    var angulos = [0, 90, 180, 270];

    // Asignar angulo aleatorio a cada pieza
    for (var i = 0; i < this.piezas.length; i++) {
      this.piezas[i].angulo = angulos[Math.floor(Math.random() * 4)];
    }

    // Contar cuantas tienen angulo distinto de 0
    var noResueltas = 0;
    for (var i = 0; i < this.piezas.length; i++) {
      if (this.piezas[i].angulo !== 0) {
        noResueltas++;
      }
    }

    // Si son menos de 2, forzar rotacion en piezas al azar
    if (noResueltas < 2) {
      var angulosForzados = [90, 180, 270];
      var indicesDisponibles = [];

      // Recolectar indices de piezas que estan en 0 grados
      for (var i = 0; i < this.piezas.length; i++) {
        if (this.piezas[i].angulo === 0) {
          indicesDisponibles.push(i);
        }
      }

      // Forzar al menos 2 piezas con angulo != 0
      var faltantes = 2 - noResueltas;
      for (var j = 0; j < faltantes && indicesDisponibles.length > 0; j++) {
        var idxAleatorio = Math.floor(Math.random() * indicesDisponibles.length);
        var idxPieza = indicesDisponibles.splice(idxAleatorio, 1)[0];
        this.piezas[idxPieza].angulo = angulosForzados[Math.floor(Math.random() * 3)];
      }
    }
  }

  /**
   * Dibuja todas las piezas y la grilla divisoria en el canvas.
   */
  dibujar(ctx) {
    ctx.clearRect(0, 0, TAMANO_CANVAS, TAMANO_CANVAS);

    // Dibujar cada pieza
    for (var i = 0; i < this.piezas.length; i++) {
      this.piezas[i].dibujar(ctx);
    }

    // Dibujar lineas de la grilla encima
    this.dibujarGrilla(ctx);
  }

  /**
   * Dibuja las lineas divisorias de la grilla sobre las piezas.
   */
  dibujarGrilla(ctx) {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 2;

    // Lineas verticales
    for (var c = 1; c < this.columnas; c++) {
      var x = c * this.anchoCelda;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, TAMANO_CANVAS);
      ctx.stroke();
    }

    // Lineas horizontales
    for (var f = 1; f < this.filas; f++) {
      var y = f * this.altoCelda;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(TAMANO_CANVAS, y);
      ctx.stroke();
    }
  }

  /**
   * Retorna la pieza que contiene el punto (mx, my), o null si ninguna.
   * Hit-testing por iteracion simple.
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
   * Retorna true si TODAS las piezas estan en su orientacion correcta.
   */
  verificarVictoria() {
    for (var i = 0; i < this.piezas.length; i++) {
      if (!this.piezas[i].estaResuelta()) {
        return false;
      }
    }
    return true;
  }
}
