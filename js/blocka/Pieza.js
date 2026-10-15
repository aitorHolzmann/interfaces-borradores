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

  // Dibuja la pieza rotada sobre su centro
  dibujar(ctx) {
    var centroX = this.x + this.ancho / 2;
    var centroY = this.y + this.alto / 2;

    ctx.save();
    ctx.translate(centroX, centroY);
    ctx.rotate(this.angulo * Math.PI / 180);
    ctx.drawImage(this.imagen, -this.ancho / 2, -this.alto / 2, this.ancho, this.alto);
    ctx.restore();

    // Indicador de pieza bloqueada por ayudita
    if (this.bloqueada) {
      var colorExito = typeof COLOR_CANVAS_BLOQUEADA !== 'undefined' ? COLOR_CANVAS_BLOQUEADA : '#4CAF50';
      var colorTexto = typeof COLOR_CANVAS_AREA !== 'undefined' ? COLOR_CANVAS_AREA : '#0A0D0A';

      ctx.save();
      ctx.strokeStyle = colorExito;
      ctx.lineWidth = 3;
      ctx.strokeRect(this.x + 2, this.y + 2, this.ancho - 4, this.alto - 4);

      var radioBadge = 11;
      var badgeX = this.x + this.ancho - radioBadge - 5;
      var badgeY = this.y + radioBadge + 5;

      ctx.beginPath();
      ctx.arc(badgeX, badgeY, radioBadge, 0, Math.PI * 2);
      ctx.fillStyle = colorExito;
      ctx.fill();
      ctx.closePath();

      ctx.fillStyle = colorTexto;
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('OK', badgeX, badgeY);
      ctx.restore();
    }
  }

  // Rota 90 grados según el sentido
  rotar(sentido) {
    if (this.bloqueada) return;

    if (sentido === 'izquierda') {
      this.angulo = (this.angulo + 270) % 360;
    } else {
      this.angulo = (this.angulo + 90) % 360;
    }
  }

  estaResuelta() {
    return this.angulo === 0;
  }

  // Hit test para saber si el clic cayó sobre esta pieza
  contienePunto(mx, my) {
    return mx >= this.x && mx <= this.x + this.ancho &&
           my >= this.y && my <= this.y + this.alto;
  }
}
