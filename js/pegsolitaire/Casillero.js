/**
 * CASILLERO.JS — Entidad Hueco / Receptor y Animación de Hints
 * Materia: Diseño de Interfaces (TUDAI / UNCPBA)
 * Entregable Nº 4 — Patrón MVC (Entidad de Vista/Controlador)
 *
 * Responsabilidad estricta:
 *  1. Representar cada una de las 33 posiciones fijas del tablero inglés.
 *  2. Resolver el Hit-Testing de soltado (drop target) con tolerancia radial ampliada (1.25x)
 *     para asegurar que el soltado de fichas sea cómodo y perdonador según la Ley de Fitts.
 *  3. Dibujar el orificio biselado con gradiente simulando profundidad tridimensional.
 *  4. Ejecutar la animación en tiempo real de los HINTS OBLIGATORIOS (aro pulsante sinusoidal
 *     y flecha indicadora flotante) en los casilleros que sean destino legal del arrastre.
 */

class Casillero {
  /**
   * Crea un casillero fijo en la grilla.
   * @param {number} fila - Fila en la grilla (0 a 6).
   * @param {number} col - Columna en la grilla (0 a 6).
   * @param {number} x - Coordenada X del centro en el Canvas.
   * @param {number} y - Coordenada Y del centro en el Canvas.
   * @param {number} radio - Radio del orificio (por defecto 22px).
   */
  constructor(fila, col, x, y, radio) {
    this.fila = fila;
    this.col = col;
    this.x = x;
    this.y = y;
    this.radio = radio || RADIO_CASILLERO;
  }

  /**
   * Hit-Testing de Soltado (Drop Target):
   * Evalúa si las coordenadas del centro de la ficha soltada cayeron dentro del área
   * de atracción del casillero. Se utiliza un 25% de radio extra de tolerancia para
   * evitar frustración al soltar la pieza ligeramente desplazada.
   * @param {number} px - Coordenada X del centro de la ficha soltada.
   * @param {number} py - Coordenada Y del centro de la ficha soltada.
   * @returns {boolean} True si la ficha cayó dentro del radio de atracción.
   */
  contienePunto(px, py) {
    const dx = this.x - px;
    const dy = this.y - py;
    const radioAtraccion = this.radio * 1.25;
    return Math.sqrt(dx * dx + dy * dy) <= radioAtraccion;
  }

  /**
   * Renderiza el orificio vacío del casillero en el tablero.
   * Utiliza un gradiente radial oscuro simulando profundidad y biselado.
   * @param {CanvasRenderingContext2D} ctx - Contexto gráfico 2D.
   */
  dibujar(ctx) {
    ctx.save();

    // Sombra del orificio hacia el interior del tablero
    const gradienteHueco = ctx.createRadialGradient(
      this.x - 2, this.y - 2, 2,
      this.x, this.y, this.radio
    );
    gradienteHueco.addColorStop(0, '#0B0D0B');
    gradienteHueco.addColorStop(0.7, '#141814');
    gradienteHueco.addColorStop(1, '#242B24');

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radio, 0, Math.PI * 2);
    ctx.fillStyle = gradienteHueco;
    ctx.fill();

    // Borde exterior biselado sutil
    ctx.strokeStyle = 'rgba(130, 142, 59, 0.4)';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    ctx.restore();
  }

  /**
   * Renderiza el HINT ANIMADO OBLIGATORIO de la cátedra:
   * Al seleccionar o arrastrar una ficha válida, los casilleros legales de destino
   * despliegan un aro pulsante con función sinusoidal periódica y una flecha indicadora
   * flotante que oscila verticalmente guiando la acción del usuario.
   * @param {CanvasRenderingContext2D} ctx - Contexto gráfico 2D.
   * @param {number} timestamp - Marca temporal de requestAnimationFrame para sincronizar la oscilación.
   */
  dibujarHintAnimado(ctx, timestamp) {
    const tiempo = timestamp || performance.now();

    ctx.save();

    // 1. Resplandor interno de la cavidad destino
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radio * 0.85, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 170, 0, 0.25)';
    ctx.fill();

    // 2. Aro pulsante sinusoidal periódico
    // Math.sin oscila entre -1 y +1; genera un radio que late suavemente +/- 4px
    const oscilacion = Math.sin(tiempo * 0.006) * 4;
    const radioHint = this.radio + 3 + oscilacion;

    ctx.beginPath();
    ctx.arc(this.x, this.y, Math.max(radioHint, this.radio), 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 170, 0, 0.95)'; // Ámbar táctico de alta visibilidad
    ctx.lineWidth = 3.5;
    ctx.shadowColor = '#FFAA00';
    ctx.shadowBlur = 12;
    ctx.stroke();

    // 3. Flecha indicadora flotante que oscila verticalmente apuntando a la celda
    const desfasajeY = Math.sin(tiempo * 0.008) * 5;
    const flechaPuntaY = this.y - this.radio - 6 + desfasajeY;

    ctx.fillStyle = '#FFAA00';
    ctx.shadowColor = '#FFAA00';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    // Vértice inferior de la flecha
    ctx.moveTo(this.x, flechaPuntaY + 8);
    // Vértice superior izquierdo
    ctx.lineTo(this.x - 7, flechaPuntaY);
    // Vértice superior derecho
    ctx.lineTo(this.x + 7, flechaPuntaY);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }
}

