/**
 * FICHA.JS — Entidad Gráfica y Mecánica de Arrastre de la Ficha
 * Materia: Diseño de Interfaces (TUDAI / UNCPBA)
 * Entregable Nº 4 — Patrón MVC (Entidad de Vista/Controlador)
 *
 * Responsabilidad estricta:
 *  1. Mantener las coordenadas espaciales continuas (x, y) en el Canvas.
 *  2. Gestionar la posición lógica de grilla (fila, col) y su anclaje original para retornos inválidos.
 *  3. Ejecutar Hit-Testing radial euclidiano según los fundamentos teóricos de la cátedra (Tema 4, Filmina 10).
 *  4. Renderizar la ficha con imágenes temáticas (cero colores planos) recortada circularmente con ctx.clip().
 *  5. Proyectar sombras dinámicas y elevación cuando la pieza está siendo arrastrada (isDragging).
 */

class Ficha {
  /**
   * Crea una instancia de ficha vinculada a una posición de casillero.
   * @param {number} id - Identificador único de la ficha.
   * @param {number} fila - Fila en la grilla lógica (0 a 6).
   * @param {number} col - Columna en la grilla lógica (0 a 6).
   * @param {number} x - Coordenada X del centro en el Canvas.
   * @param {number} y - Coordenada Y del centro en el Canvas.
   * @param {number} radio - Radio de detección y dibujado (por defecto 24px).
   * @param {HTMLImageElement} imagen - Objeto imagen cargado con el skin temático.
   */
  constructor(id, fila, col, x, y, radio, imagen) {
    this.id = id;
    this.fila = fila;
    this.col = col;

    // Coordenadas actuales (mutan libremente durante el drag)
    this.x = x;
    this.y = y;

    // Coordenadas originales de anclaje (para restaurar posición ante soltado inválido)
    this.originalX = x;
    this.originalY = y;

    this.radio = radio || RADIO_FICHA;
    this.imagen = imagen;
    this.isDragging = false;
  }

  /**
   * Hit-Testing Radial (Fórmula matemática de distancia euclidiana de la cátedra):
   * Comprueba si el cursor del mouse (px, py) se encuentra dentro de la circunferencia de la ficha.
   * @param {number} px - Coordenada X del cursor relativa al Canvas.
   * @param {number} py - Coordenada Y del cursor relativa al Canvas.
   * @returns {boolean} True si el punto cae dentro del radio de la ficha.
   */
  isPointInside(px, py) {
    const dx = this.x - px;
    const dy = this.y - py;
    return Math.sqrt(dx * dx + dy * dy) <= this.radio;
  }

  /**
   * Actualiza la posición de la ficha mientras es arrastrada por el puntero.
   * @param {number} x - Nueva coordenada X.
   * @param {number} y - Nueva coordenada Y.
   */
  setPosicion(x, y) {
    this.x = x;
    this.y = y;
  }

  /**
   * Fija la ficha en una nueva celda de destino legal tras un salto exitoso,
   * actualizando sus coordenadas permanentes y de retorno.
   * @param {number} fila - Nueva fila en la matriz.
   * @param {number} col - Nueva columna en la matriz.
   * @param {number} x - Nuevo centro X en el Canvas.
   * @param {number} y - Nuevo centro Y en el Canvas.
   */
  fijarEnCasillero(fila, col, x, y) {
    this.fila = fila;
    this.col = col;
    this.x = x;
    this.y = y;
    this.originalX = x;
    this.originalY = y;
    this.isDragging = false;
  }

  /**
   * Mecánica de retorno obligatorio:
   * Si la ficha se suelta en un lugar inválido, retorna instantáneamente
   * a su coordenada original sin alterar el estado del juego.
   */
  restaurarPosicion() {
    this.x = this.originalX;
    this.y = this.originalY;
    this.isDragging = false;
  }

  /**
   * Actualiza la imagen temática de la ficha (cambio de skin en tiempo real).
   * @param {HTMLImageElement} nuevaImagen - Nueva textura temática cargada.
   */
  setImagen(nuevaImagen) {
    this.imagen = nuevaImagen;
  }

  /**
   * Dibuja la ficha en el contexto 2D del Canvas.
   * Utiliza ctx.clip() para que la imagen temática encaje perfectamente en un círculo
   * y dibuja un bisel metálico decorativo. Si está en arrastre, proyecta sombra profunda.
   * @param {CanvasRenderingContext2D} ctx - Contexto gráfico 2D.
   */
  dibujar(ctx) {
    ctx.save();

    // Efecto de elevación cuando la ficha está siendo arrastrada por el usuario
    if (this.isDragging) {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
      ctx.shadowBlur = 14;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 8;
    }

    // Recorte circular para la imagen de la ficha
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radio, 0, Math.PI * 2);
    ctx.closePath();

    if (this.isDragging) {
      // Dibujar fondo sutil para la sombra en arrastre
      ctx.fillStyle = 'rgba(20, 23, 20, 0.9)';
      ctx.fill();
    }

    ctx.save();
    ctx.clip(); // Aplicar máscara circular

    if (this.imagen && this.imagen.complete && this.imagen.naturalWidth > 0) {
      // Dibujar imagen temática cubriendo el diámetro completo de la ficha
      ctx.drawImage(
        this.imagen,
        this.x - this.radio,
        this.y - this.radio,
        this.radio * 2,
        this.radio * 2
      );
    } else {
      // Fallback estético militar con gradiente radial si la imagen estuviera cargando
      const grad = ctx.createRadialGradient(
        this.x - 5, this.y - 5, 2,
        this.x, this.y, this.radio
      );
      grad.addColorStop(0, '#828E3B');
      grad.addColorStop(0.7, '#4B5320');
      grad.addColorStop(1, '#2D3213');
      ctx.fillStyle = grad;
      ctx.fill();
    }
    ctx.restore(); // Quitar máscara de clip

    // Borde metálico exterior / biselado táctico
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radio, 0, Math.PI * 2);
    ctx.strokeStyle = this.isDragging ? '#FF6B00' : '#828E3B';
    ctx.lineWidth = this.isDragging ? 2.5 : 1.5;
    ctx.stroke();

    ctx.restore();
  }
}

