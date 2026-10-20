/**
 * SOLITAIREMODEL.JS — Modelo Matemático y Lógica de Reglas de Peg Solitaire
 * Materia: Diseño de Interfaces (TUDAI / UNCPBA)
 * Entregable Nº 4 — Patrón MVC (Capa de Modelo)
 *
 * Responsabilidad estricta: Administrar la grilla lógica de 7x7 casillas,
 * verificar movimientos legales de salto ortogonal de 2 casillas, actualizar
 * el estado de la matriz, decrementar las fichas restantes y detectar automáticamente
 * condiciones de victoria o fin de partida.
 *
 * NOTA DE ARQUITECTURA: Este archivo no interactúa con el DOM ni con Canvas;
 * es código de negocio puro, desacoplado y 100% testeable.
 */

class SolitaireModel {
  /**
   * Inicializa el modelo creando una copia profunda del tablero inicial
   * y estableciendo el contador inicial de fichas activas en 32.
   */
  constructor() {
    this.matriz = [];
    this.fichasRestantes = 0;
    this.reiniciar();
  }

  /**
   * Restaura la matriz de juego a su estado original (33 casillas, centro vacío)
   * y reinicia el contador de piezas en 32.
   */
  reiniciar() {
    // Clonación profunda de la matriz bidimensional para evitar mutar la constante global
    this.matriz = TABLERO_INICIAL.map(fila => [...fila]);
    this.fichasRestantes = 32;
  }

  /**
   * Determina si una coordenada (fila, col) cae dentro de los límites de la matriz
   * y corresponde a uno de los 33 casilleros jugables de la cruz inglesa.
   * @param {number} fila - Índice de fila (0 a 6).
   * @param {number} col - Índice de columna (0 a 6).
   * @returns {boolean} True si es una casilla válida del tablero.
   */
  esCasilleroValido(fila, col) {
    if (fila < 0 || fila >= TAMANO_GRILLA || col < 0 || col >= TAMANO_GRILLA) {
      return false;
    }
    return this.matriz[fila][col] !== ESTADO.BLOQUEADO;
  }

  /**
   * Retorna el estado numérico actual de un casillero (-1: Bloqueado, 0: Vacío, 1: Ficha).
   * @param {number} fila - Índice de fila.
   * @param {number} col - Índice de columna.
   * @returns {number} Valor del estado o -1 si está fuera de rango.
   */
  obtenerEstado(fila, col) {
    if (!this.esCasilleroValido(fila, col)) {
      return ESTADO.BLOQUEADO;
    }
    return this.matriz[fila][col];
  }

  /**
   * Calcula todos los movimientos legales posibles para una ficha ubicada en (fila, col).
   * Un salto es legal si:
   *  1. La casilla de origen contiene una ficha activa (1).
   *  2. La casilla destino está a exactamente 2 casillas de distancia ortogonal (arriba, abajo, izquierda, derecha).
   *  3. La casilla destino es válida y está vacía (0).
   *  4. La casilla intermedia adyacente contiene una ficha (1) para comer.
   * @param {number} fila - Fila de la ficha seleccionada.
   * @param {number} col - Columna de la ficha seleccionada.
   * @returns {Array<Object>} Lista de saltos válidos: [{ destFila, destCol, saltadaFila, saltadaCol }]
   */
  obtenerMovimientosValidos(fila, col) {
    // Si la casilla no tiene ficha activa, no tiene movimientos posibles
    if (this.obtenerEstado(fila, col) !== ESTADO.FICHA) {
      return [];
    }

    const movimientos = [];
    // Desplazamientos ortogonales posibles de 2 casilleros: [deltaFila, deltaCol]
    const direcciones = [
      [-2, 0], // Salto hacia Arriba
      [2, 0],  // Salto hacia Abajo
      [0, -2], // Salto hacia la Izquierda
      [0, 2]   // Salto hacia la Derecha
    ];

    for (let i = 0; i < direcciones.length; i++) {
      const df = direcciones[i][0];
      const dc = direcciones[i][1];

      const destF = fila + df;
      const destC = col + dc;
      const midF = fila + (df / 2);
      const midC = col + (dc / 2);

      // 1. Destino debe ser casilla válida y estar vacía
      const destinoValido = this.esCasilleroValido(destF, destC) && this.matriz[destF][destC] === ESTADO.VACIO;
      // 2. Casilla intermedia debe ser válida y tener una ficha para ser eliminada
      const intermediaValida = this.esCasilleroValido(midF, midC) && this.matriz[midF][midC] === ESTADO.FICHA;

      if (destinoValido && intermediaValida) {
        movimientos.push({
          destFila: destF,
          destCol: destC,
          saltadaFila: midF,
          saltadaCol: midC
        });
      }
    }

    return movimientos;
  }

  /**
   * Verifica si un movimiento específico desde (f1, c1) hacia (f2, c2) es legal.
   * @param {number} f1 - Fila de origen.
   * @param {number} c1 - Columna de origen.
   * @param {number} f2 - Fila de destino.
   * @param {number} c2 - Columna de destino.
   * @returns {boolean} True si el salto cumple con todas las reglas de Peg Solitaire.
   */
  esMovimientoValido(f1, c1, f2, c2) {
    const validos = this.obtenerMovimientosValidos(f1, c1);
    return validos.some(m => m.destFila === f2 && m.destCol === c2);
  }

  /**
   * Ejecuta un salto ortogonal actualizando la matriz interna y el conteo de fichas.
   * Vacía el origen, vacía la casilla intermedia saltada y ocupa el destino.
   * @param {number} f1 - Fila origen.
   * @param {number} c1 - Columna origen.
   * @param {number} f2 - Fila destino.
   * @param {number} c2 - Columna destino.
   * @returns {Object} Resultado con flag de éxito y coordenadas de la ficha eliminada.
   */
  ejecutarMovimiento(f1, c1, f2, c2) {
    if (!this.esMovimientoValido(f1, c1, f2, c2)) {
      return { exito: false };
    }

    const midF = (f1 + f2) / 2;
    const midC = (c1 + c2) / 2;

    // Actualizar estados en la matriz
    this.matriz[f1][c1] = ESTADO.VACIO;       // La ficha salta de aquí
    this.matriz[midF][midC] = ESTADO.VACIO;   // La ficha intermedia es comida
    this.matriz[f2][c2] = ESTADO.FICHA;       // La ficha aterriza aquí

    this.fichasRestantes--;

    return {
      exito: true,
      saltadaFila: midF,
      saltadaCol: midC
    };
  }

  /**
   * Evalúa si existe al menos un movimiento legal en todo el tablero.
   * Se invoca obligatoriamente tras cada jugada para comprobar fin de partida.
   * @returns {boolean} True si todavía se pueden realizar saltos.
   */
  hayMovimientosPosibles() {
    for (let f = 0; f < TAMANO_GRILLA; f++) {
      for (let c = 0; c < TAMANO_GRILLA; c++) {
        if (this.matriz[f][c] === ESTADO.FICHA) {
          const movs = this.obtenerMovimientosValidos(f, c);
          if (movs.length > 0) {
            return true; // Se encontró al menos un salto válido
          }
        }
      }
    }
    return false; // No hay más saltos en ningún lugar del tablero
  }

  /**
   * Determina si la partida concluyó en victoria (exactamente 1 ficha restante).
   * @returns {boolean} True si se alcanzó la condición máxima de victoria.
   */
  esVictoria() {
    return this.fichasRestantes === 1;
  }

  /**
   * Configura manualmente una matriz personalizada (útil para pruebas unitarias y hooks de URL).
   * @param {Array<Array<number>>} nuevaMatriz - Estructura de tablero personalizada.
   */
  configurarTableroPersonalizado(nuevaMatriz) {
    this.matriz = nuevaMatriz.map(fila => [...fila]);
    let conteo = 0;
    for (let f = 0; f < TAMANO_GRILLA; f++) {
      for (let c = 0; c < TAMANO_GRILLA; c++) {
        if (this.matriz[f][c] === ESTADO.FICHA) {
          conteo++;
        }
      }
    }
    this.fichasRestantes = conteo;
  }
}

