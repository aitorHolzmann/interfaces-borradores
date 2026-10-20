/**
 * CONFIGURACION.JS — Parámetros Globales y Constantes de Peg Solitaire
 * Materia: Diseño de Interfaces (TUDAI / UNCPBA)
 * Entregable Nº 4 — Videojuego Peg Solitaire con Canvas 2D y MVC
 *
 * Este archivo centraliza todas las constantes del juego: dimensiones del canvas,
 * espaciado y radios de la grilla, matriz inicial del tablero inglés de 33 casillas,
 * estados posibles de cada celda y configuración del banco de skins temáticos.
 */

// Dimensiones fijas del lienzo Canvas (diseñado para encajar en Full HD sin scroll)
const CANVAS_ANCHO = 800;
const CANVAS_ALTO = 500;

// Grilla simétrica clásica de 7x7 celdas
const TAMANO_GRILLA = 7;

// Distancia exacta entre centros de casilleros adyacentes (estrictamente cuadrada)
const PASO_CELDA = 62;

// Radio de detección y dibujo de las entidades
const RADIO_FICHA = 24;
const RADIO_CASILLERO = 22;

// Desplazamientos para centrar el tablero de 434x434 px en el lienzo de 800x500 px
// Las franjas laterales de 183 px se aprovechan para el panel de bajas y HUD
const OFFSET_X = Math.floor((CANVAS_ANCHO - (TAMANO_GRILLA * PASO_CELDA)) / 2); // 183px
const OFFSET_Y = Math.floor((CANVAS_ALTO - (TAMANO_GRILLA * PASO_CELDA)) / 2);  // 33px

// Estados numéricos de cada celda en la matriz lógica
const ESTADO = {
  BLOQUEADO: -1, // Esquinas fuera de la cruz inglesa (inactivas)
  VACIO: 0,      // Casillero hueco disponible para recibir un salto legal
  FICHA: 1       // Casillero ocupado por una ficha activa en juego
};

// Matriz inicial del tablero inglés clásico (33 casilleros jugables, centro vacío en 3,3)
const TABLERO_INICIAL = [
  [-1, -1,  1,  1,  1, -1, -1],
  [-1, -1,  1,  1,  1, -1, -1],
  [ 1,  1,  1,  1,  1,  1,  1],
  [ 1,  1,  1,  0,  1,  1,  1], // Centro inicial vacío
  [ 1,  1,  1,  1,  1,  1,  1],
  [-1, -1,  1,  1,  1, -1, -1],
  [-1, -1,  1,  1,  1, -1, -1]
];

// Tiempo máximo de cuenta regresiva en segundos (3 minutos)
const TIEMPO_LIMITE_SEGUNDOS = 180;

// Catálogo de skins temáticos disponibles para las fichas
const SKINS_FICHAS = {
  medalla: {
    id: 'medalla',
    nombre: 'Medallas Militares',
    src: 'assets/images/pegsolitaire/ficha-medalla.png'
  },
  granada: {
    id: 'granada',
    nombre: 'Granadas Tácticas',
    src: 'assets/images/pegsolitaire/ficha-granada.png'
  },
  insignia: {
    id: 'insignia',
    nombre: 'Insignias de Rango',
    src: 'assets/images/pegsolitaire/ficha-insignia.png'
  }
};

