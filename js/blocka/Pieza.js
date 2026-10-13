/* CLASE PIEZA SUBIMAGEN INDIVIDUAL DEL PUZZLE CON POSICION Y ROTACION */

class Pieza {

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

      /* BADGE CIRCULAR DE PIEZA RESUELTA EN ESQUINA SUPERIOR DERECHA */
      var radioBadge = 11;
      var badgeX = this.x + this.ancho - radioBadge - 5;
      var badgeY = this.y + radioBadge + 5;

      ctx.beginPath();
      ctx.arc(badgeX, badgeY, radioBadge, 0, Math.PI * 2);
      ctx.fillStyle = '#00E676';
      ctx.fill();
      ctx.closePath();

      /* TEXTO DE CONFIRMACION DENTRO DEL BADGE */
      ctx.fillStyle = '#0A0C0A';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('OK', badgeX, badgeY);
      ctx.restore();
    }
  }

  /* ROTACION EN SENTIDO INDICADO */
  rotar(sentido) {
    if (this.bloqueada) return;

    if (sentido === 'izquierda') {
      this.angulo = (this.angulo + 270) % 360;
    } else {
      this.angulo = (this.angulo + 90) % 360;
    }
  }

  /* COMPROBACION DE ORIENTACION CORRECTA */
  estaResuelta() {
    return this.angulo === 0;
  }

  /* HIT TESTING GEOMETRICO DE CAJA DELIMITADORA SEGUN TEMA */
  contienePunto(mx, my) {
    return mx >= this.x && mx <= this.x + this.ancho &&
           my >= this.y && my <= this.y + this.alto;
  }
}
