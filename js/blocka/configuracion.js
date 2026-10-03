/* CONFIGURACION DEL JUEGO BLOCKA — Datos constantes y niveles (Data-Driven)
   Define el banco de imagenes, tamano del canvas y los niveles del juego.
   Cada nivel encapsula su propia cantidad de piezas (filas x columnas),
   su filtro de imagen y su tiempo maximo en caso de jugar en Modo Contrarreloj. */

/** Tamano logico del canvas en pixeles (cuadrado) */
var TAMANO_CANVAS = 480;

/** Banco de imagenes cuadradas para el puzzle (minimo 6) */
var BANCO_IMAGENES = [
  'assets/images/puzzles/puzzle-1.jpg',
  'assets/images/puzzles/puzzle-2.jpg',
  'assets/images/puzzles/puzzle-3.jpg',
  'assets/images/puzzles/puzzle-4.jpg',
  'assets/images/puzzles/puzzle-5.jpg',
  'assets/images/puzzles/puzzle-6.jpg'
];

/**
 * Configuracion de niveles.
 * Cada nivel encapsula su propia dificultad:
 * - filas y columnas (la celda siempre se calcula cuadrada)
 * - piezas totales
 * - filtro de imagen aplicado
 * - tiempo maximo sugerido para el Modo Contrarreloj
 */
var NIVELES = [
  {
    numero: 1,
    nombre: 'Nivel 1 — Recluta',
    filas: 2,
    columnas: 2,
    piezas: 4,
    filtro: escalaDeGrises,
    nombreFiltro: 'Escala de Grises',
    tiempoMaximo: 60
  },
  {
    numero: 2,
    nombre: 'Nivel 2 — Veterano',
    filas: 2,
    columnas: 3,
    piezas: 6,
    filtro: function(data) { return brillo(data, 1.3); },
    nombreFiltro: 'Brillo (+30%)',
    tiempoMaximo: 50
  },
  {
    numero: 3,
    nombre: 'Nivel 3 — Comandante',
    filas: 2,
    columnas: 4,
    piezas: 8,
    filtro: negativo,
    nombreFiltro: 'Negativo Cromático',
    tiempoMaximo: 45
  },
  {
    numero: 4,
    nombre: 'Nivel 4 — Táctico',
    filas: 2,
    columnas: 3,
    piezas: 6,
    filtro: negativo,
    nombreFiltro: 'Negativo Cromático',
    tiempoMaximo: 35
  },
  {
    numero: 5,
    nombre: 'Nivel 5 — Maestro',
    filas: 2,
    columnas: 4,
    piezas: 8,
    filtro: escalaDeGrises,
    nombreFiltro: 'Escala de Grises',
    tiempoMaximo: 30
  }
];

/**
 * Devuelve una ruta aleatoria del banco de imagenes.
 */
function imagenAleatoria() {
  var indice = Math.floor(Math.random() * BANCO_IMAGENES.length);
  return BANCO_IMAGENES[indice];
}
