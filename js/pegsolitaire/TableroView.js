/**
 * TABLEROVIEW.JS — Vista y Gestor de Renderizado por Capas del Canvas
 * Materia: Diseño de Interfaces (TUDAI / UNCPBA)
 * Entregable Nº 4 — Patrón MVC (Capa de Vista)
 *
 * Responsabilidad estricta:
 *  1. Administrar el ciclo de repintado continuo de 60fps en el elemento Canvas.
 *  2. Construir la colección fija de los 33 casilleros del tablero inglés clásico.
 *  3. Orquestar el dibujo jerárquico por capas (Layers) para garantizar el orden Z-Index:
 *     - Capa 0: Fondo general oscuro y texturado militar.
 *     - Capa 1: Base circular del tablero táctico con imagen temática (tablero-bg.png).
 *     - Capa 2: Los 33 casilleros / huecos biselados fijos.
 *     - Capa 3: Hints animados obligatorios (aros pulsantes y flechas indicadoras).
 *     - Capa 4: Fichas estáticas activas en el tablero.
 *     - Capa 5: Ficha arrastrada (Z-Index superior para flotar libremente sobre el resto).
 *     - Capa 6: Panel lateral de bajas militares (fichas comidas apiladas estéticamente).
 *     - Capa 7: Telemetría táctica lateral derecha (objetivo y estado de la misión).
 */

class TableroView {
  /**
   * Inicializa la vista con el canvas y su contexto gráfico 2D.
   * @param {HTMLCanvasElement} canvas - Elemento canvas nativo de 800x500.
   */
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    // Cargar la textura temática del fondo del tablero
    this.fondoTablero = new Image();
    this.fondoTablero.src = 'assets/images/pegsolitaire/tablero-bg.png';
    this.fondoCargado = false;
    this.fondoTablero.onload = () => {
      this.fondoCargado = true;
    };

    // Colección de los 33 casilleros físicos
    this.casilleros = [];
    this.crearCasilleros();
  }

  /**
   * Genera los 33 objetos Casillero calculando sus coordenadas (x, y) en el Canvas
   * a partir de la matriz lógica 7x7 y los offsets de centrado.
   */
  crearCasilleros() {
    this.casilleros = [];

    for (let fila = 0; fila < TAMANO_GRILLA; fila++) {
      for (let col = 0; col < TAMANO_GRILLA; col++) {
        // Solo instanciar casilleros jugables de la cruz inglesa
        if (TABLERO_INICIAL[fila][col] !== ESTADO.BLOQUEADO) {
          // Centro X = OFFSET_X + col * PASO_CELDA + medio paso
          const centroX = OFFSET_X + col * PASO_CELDA + Math.floor(PASO_CELDA / 2);
          // Centro Y = OFFSET_Y + fila * PASO_CELDA + medio paso
          const centroY = OFFSET_Y + fila * PASO_CELDA + Math.floor(PASO_CELDA / 2);

          this.casilleros.push(new Casillero(fila, col, centroX, centroY, RADIO_CASILLERO));
        }
      }
    }
  }

  /**
   * Retorna el objeto Casillero correspondiente a una coordenada de grilla (fila, col).
   * @param {number} fila - Fila en la matriz.
   * @param {number} col - Columna en la matriz.
   * @returns {Casillero|undefined} Casillero encontrado.
   */
  obtenerCasillero(fila, col) {
    return this.casilleros.find(c => c.fila === fila && c.col === col);
  }

  /**
   * Busca si las coordenadas (px, py) de soltado caen en el área de algún casillero.
   * @param {number} px - Coordenada X.
   * @param {number} py - Coordenada Y.
   * @returns {Casillero|null} Casillero receptor o null si no cayó en ninguno.
   */
  obtenerCasilleroEn(px, py) {
    for (let i = 0; i < this.casilleros.length; i++) {
      if (this.casilleros[i].contienePunto(px, py)) {
        return this.casilleros[i];
      }
    }
    return null;
  }

  /**
   * Ciclo principal de renderizado por capas invocado en cada frame del bucle.
   * @param {Array<Ficha>} fichas - Colección de fichas activas en juego.
   * @param {Ficha|null} fichaArrastrada - Ficha que el usuario está moviendo con el mouse.
   * @param {Array<Casillero>} hintsActivos - Casilleros válidos donde es legal soltar la ficha.
   * @param {Array<Ficha>} fichasComidas - Fichas eliminadas durante la partida.
   * @param {number} timestamp - Marca de tiempo para animaciones fluidas a 60fps.
   */
  dibujar(fichas, fichaArrastrada, hintsActivos, fichasComidas, timestamp) {
    const ctx = this.ctx;

    // CAPA 0: Limpieza total del canvas y fondo base táctico
    ctx.clearRect(0, 0, CANVAS_ANCHO, CANVAS_ALTO);
    this.dibujarFondoAtmospheric(ctx);

    // CAPA 1: Base circular del tablero militar centrado
    this.dibujarBaseTablero(ctx);

    // CAPA 2: Orificios / Casilleros fijos del tablero
    for (let i = 0; i < this.casilleros.length; i++) {
      this.casilleros[i].dibujar(ctx);
    }

    // CAPA 3: HINTS ANIMADOS OBLIGATORIOS (resaltados si hay ficha seleccionada/arrastrada)
    if (hintsActivos && hintsActivos.length > 0) {
      for (let i = 0; i < hintsActivos.length; i++) {
        hintsActivos[i].dibujarHintAnimado(ctx, timestamp);
      }
    }

    // CAPA 4: Fichas estáticas (todas excepto la que está en arrastre)
    for (let i = 0; i < fichas.length; i++) {
      const f = fichas[i];
      if (f !== fichaArrastrada) {
        f.dibujar(ctx);
      }
    }

    // CAPA 5: Ficha arrastrada (se dibuja última con Z-Index superior para flotar)
    if (fichaArrastrada) {
      fichaArrastrada.dibujar(ctx);
    }

    // CAPA 6: Panel lateral izquierdo de bajas militares
    this.dibujarPanelBajas(ctx, fichasComidas);

    // CAPA 7: Telemetría táctica lateral derecha
    this.dibujarTelemetriaLateral(ctx, fichas.length);
  }

  /**
   * Dibuja el fondo general de la sala con viñeta oscura y líneas de corte militar.
   * @param {CanvasRenderingContext2D} ctx - Contexto gráfico 2D.
   */
  dibujarFondoAtmospheric(ctx) {
    // Fondo base oscuro
    ctx.fillStyle = '#141714';
    ctx.fillRect(0, 0, CANVAS_ANCHO, CANVAS_ALTO);

    // Gradiente sutil para profundidad en las esquinas
    const grad = ctx.createRadialGradient(
      CANVAS_ANCHO / 2, CANVAS_ALTO / 2, 100,
      CANVAS_ANCHO / 2, CANVAS_ALTO / 2, 450
    );
    grad.addColorStop(0, 'rgba(45, 50, 19, 0.25)');
    grad.addColorStop(0.7, 'rgba(20, 23, 20, 0.7)');
    grad.addColorStop(1, '#0A0D0A');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CANVAS_ANCHO, CANVAS_ALTO);

    // Delimitador vertical sutil entre los paneles laterales y el tablero central
    ctx.save();
    ctx.strokeStyle = 'rgba(130, 142, 59, 0.15)';
    ctx.lineWidth = 1;
    ctx.strokeRect(10, 10, CANVAS_ANCHO - 20, CANVAS_ALTO - 20);
    ctx.restore();
  }

  /**
   * Dibuja el tablero temático circular centrado exactamente en el lienzo.
   * @param {CanvasRenderingContext2D} ctx - Contexto gráfico 2D.
   */
  dibujarBaseTablero(ctx) {
    const centroX = CANVAS_ANCHO / 2; // 400px
    const centroY = CANVAS_ALTO / 2;  // 250px
    const tamano = 472; // Diámetro del tablero

    if (this.fondoCargado && this.fondoTablero.complete && this.fondoTablero.naturalWidth > 0) {
      ctx.drawImage(
        this.fondoTablero,
        centroX - (tamano / 2),
        centroY - (tamano / 2),
        tamano,
        tamano
      );
    } else {
      // Fallback estético si la imagen de fondo tardase en responder
      ctx.save();
      ctx.beginPath();
      ctx.arc(centroX, centroY, 230, 0, Math.PI * 2);
      ctx.fillStyle = '#262D24';
      ctx.strokeStyle = '#4B5320';
      ctx.lineWidth = 4;
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
  }

  /**
   * Renderiza el cementerio militar de piezas capturadas en el panel lateral izquierdo.
   * Proporciona feedback visual inmediato del progreso táctico del jugador.
   * @param {CanvasRenderingContext2D} ctx - Contexto 2D.
   * @param {Array<Ficha>} fichasComidas - Colección de fichas eliminadas.
   */
  dibujarPanelBajas(ctx, fichasComidas) {
    ctx.save();

    // Caja contenedora de bajas
    const panelX = 22;
    const panelY = 30;
    const panelAncho = 140;
    const panelAlto = 440;

    ctx.fillStyle = 'rgba(14, 17, 14, 0.75)';
    ctx.strokeStyle = 'rgba(130, 142, 59, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(panelX, panelY, panelAncho, panelAlto, 8);
    ctx.fill();
    ctx.stroke();

    // Encabezado del panel
    ctx.font = 'bold 11px "JetBrains Mono", monospace';
    ctx.fillStyle = '#FF6B00';
    ctx.textAlign = 'center';
    ctx.fillText('BAJAS TÁCTICAS', panelX + (panelAncho / 2), panelY + 22);

    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillStyle = '#C2C8C2';
    const totalComidas = fichasComidas ? fichasComidas.length : 0;
    ctx.fillText(`${totalComidas} / 31 ELIMINADAS`, panelX + (panelAncho / 2), panelY + 38);

    // Línea separadora
    ctx.strokeStyle = 'rgba(255, 107, 0, 0.3)';
    ctx.beginPath();
    ctx.moveTo(panelX + 15, panelY + 46);
    ctx.lineTo(panelX + panelAncho - 15, panelY + 46);
    ctx.stroke();

    // Miniaturas de fichas eliminadas apiladas en grilla de 3 columnas
    if (fichasComidas && fichasComidas.length > 0) {
      const miniRadio = 10;
      const inicioX = panelX + 28;
      const inicioY = panelY + 68;
      const pasoX = 42;
      const pasoY = 34;
      const maxPorColumna = 11;

      for (let i = 0; i < fichasComidas.length; i++) {
        const col = i % 3;
        const fila = Math.floor(i / 3);
        const mx = inicioX + col * pasoX;
        const my = inicioY + fila * pasoY;

        if (fila < maxPorColumna) {
          const ficha = fichasComidas[i];
          ctx.save();
          ctx.beginPath();
          ctx.arc(mx, my, miniRadio, 0, Math.PI * 2);
          ctx.clip();

          if (ficha.imagen && ficha.imagen.complete && ficha.imagen.naturalWidth > 0) {
            ctx.drawImage(ficha.imagen, mx - miniRadio, my - miniRadio, miniRadio * 2, miniRadio * 2);
          } else {
            ctx.fillStyle = '#66702D';
            ctx.fill();
          }
          ctx.restore();

          // Anillo oscurecido con opacidad para denotar pieza eliminada
          ctx.beginPath();
          ctx.arc(mx, my, miniRadio, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(229, 57, 53, 0.7)'; // Rojo sutil de eliminación
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      }
    }

    ctx.restore();
  }

  /**
   * Renderiza el panel de telemetría e instrucciones rápidas en el lateral derecho.
   * Equilibra estéticamente la composición del Canvas de 800x500 px.
   * @param {CanvasRenderingContext2D} ctx - Contexto 2D.
   * @param {number} fichasEnJuego - Cantidad actual de fichas en tablero.
   */
  dibujarTelemetriaLateral(ctx, fichasEnJuego) {
    ctx.save();

    const panelX = CANVAS_ANCHO - 162;
    const panelY = 30;
    const panelAncho = 140;
    const panelAlto = 440;

    // Caja contenedora
    ctx.fillStyle = 'rgba(14, 17, 14, 0.75)';
    ctx.strokeStyle = 'rgba(130, 142, 59, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(panelX, panelY, panelAncho, panelAlto, 8);
    ctx.fill();
    ctx.stroke();

    // Encabezado
    ctx.font = 'bold 11px "JetBrains Mono", monospace';
    ctx.fillStyle = '#FF6B00';
    ctx.textAlign = 'center';
    ctx.fillText('MISIÓN CENTRAL', panelX + (panelAncho / 2), panelY + 22);

    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillStyle = '#828E3B';
    ctx.fillText('SECTOR CLONE WARS', panelX + (panelAncho / 2), panelY + 38);

    ctx.strokeStyle = 'rgba(255, 107, 0, 0.3)';
    ctx.beginPath();
    ctx.moveTo(panelX + 15, panelY + 46);
    ctx.lineTo(panelX + panelAncho - 15, panelY + 46);
    ctx.stroke();

    // Datos del objetivo táctico
    ctx.textAlign = 'left';
    ctx.fillStyle = '#C2C8C2';
    ctx.font = '9px "JetBrains Mono", monospace';

    const textoBaseY = panelY + 70;
    ctx.fillText('OBJETIVO:', panelX + 16, textoBaseY);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 10px "JetBrains Mono", monospace';
    ctx.fillText('1 FICHA SOLA', panelX + 16, textoBaseY + 16);

    ctx.fillStyle = '#C2C8C2';
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.fillText('ZONA ÓPTIMA:', panelX + 16, textoBaseY + 42);
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 10px "JetBrains Mono", monospace';
    ctx.fillText('CENTRO (3, 3)', panelX + 16, textoBaseY + 58);

    ctx.fillStyle = '#C2C8C2';
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.fillText('EN JUEGO:', panelX + 16, textoBaseY + 84);
    ctx.fillStyle = '#FF6B00';
    ctx.font = 'bold 14px "JetBrains Mono", monospace';
    ctx.fillText(`${fichasEnJuego} FICHAS`, panelX + 16, textoBaseY + 104);

    // Recordatorio de reglas
    ctx.strokeStyle = 'rgba(130, 142, 59, 0.2)';
    ctx.beginPath();
    ctx.moveTo(panelX + 15, textoBaseY + 120);
    ctx.lineTo(panelX + panelAncho - 15, textoBaseY + 120);
    ctx.stroke();

    ctx.fillStyle = '#828E3B';
    ctx.font = 'bold 9px "JetBrains Mono", monospace';
    ctx.fillText('OPERATORIA:', panelX + 16, textoBaseY + 138);

    ctx.fillStyle = '#C2C8C2';
    ctx.font = '8px "JetBrains Mono", monospace';
    ctx.fillText('• Arrastrá ficha', panelX + 16, textoBaseY + 154);
    ctx.fillText('• Seguí flecha ámbar', panelX + 16, textoBaseY + 168);
    ctx.fillText('• Saltá sobre adyacente', panelX + 16, textoBaseY + 182);
    ctx.fillText('• Caé en hueco vacío', panelX + 16, textoBaseY + 196);
    ctx.fillText('• Cero diagonales', panelX + 16, textoBaseY + 210);

    ctx.restore();
  }
}

