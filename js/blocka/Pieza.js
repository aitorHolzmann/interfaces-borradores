/* CLASE PIEZA — Subimagen individual del puzzle con posicion y rotacion.
   Inspirada en la jerarquia Figure > Rect del Tema 4 de catedra.
   Cada pieza almacena su subimagen en un mini-canvas propio para poder
   dibujarla con drawImage() dentro de save/translate/rotate/restore. */

class Pieza {

  /**
   * @param {Number} fila      Fila en la grilla (0-indexed)
   * @param {Number} columna   Columna en la grilla (0-indexed)
   * @param {Number} x         Posicion X en el canvas principal (px)
   * @param {Number} y         Posicion Y en el canvas principal (px)
   * @param {Number} ancho     Ancho de la celda (px)
   * @param {Number} alto      Alto de la celda (px)
   * @param {HTMLCanvasElement} imagen  Mini-canvas con la subimagen recortada
   */
  constructor(fila, columna, x, y, ancho, alto, imagen) {
    this.fila = fila;
    this.columna = columna;
    this.x = x;
    this.y = y;
    this.ancho = ancho;
    this.alto = alto;
    this.imagen = imagen;
    this.angulo = 0;
    this.bloqueada = false;
  }

  /**
   * Dibuja la pieza en el canvas con su rotacion actual.
   * Usa save/translate/rotate/drawImage/restore para rotar sobre el centro.
   */
  dibujar(ctx) {
    var centroX = this.x + this.ancho / 2;
    var centroY = this.y + this.alto / 2;

    ctx.save();
    ctx.translate(centroX, centroY);
    ctx.rotate(this.angulo * Math.PI / 180);
    ctx.drawImage(this.imagen, -this.ancho / 2, -this.alto / 2, this.ancho, this.alto);
    ctx.restore();
  }

  /**
   * Rota la pieza 90 grados en el sentido indicado.
   * 'izquierda' = antihorario (-90), 'derecha' = horario (+90).
   * El angulo siempre queda en [0, 90, 180, 270].
   */
  rotar(sentido) {
    if (this.bloqueada) return;

    if (sentido === 'izquierda') {
      this.angulo = (this.angulo + 270) % 360;
    } else {
      this.angulo = (this.angulo + 90) % 360;
    }
  }

  /**
   * Retorna true si la pieza esta en su orientacion correcta (0 grados).
   */
  estaResuelta() {
    return this.angulo === 0;
  }

  /**
   * Hit-test AABB: retorna true si el punto (mx, my) cae dentro de la pieza.
   */
  contienePunto(mx, my) {
    return mx >= this.x && mx <= this.x + this.ancho &&
           my >= this.y && my <= this.y + this.alto;
  }
}
