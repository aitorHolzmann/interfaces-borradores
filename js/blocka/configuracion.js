/* CONFIGURACION DEL JUEGO BLOCKA — Datos constantes y niveles (Data-Driven)
   Este archivo define el banco de imagenes, el tamano del canvas y la
   configuracion de cada nivel. Para agregar niveles o filtros nuevos,
   solo se modifica este archivo. */

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
 * Cada nivel declara su grilla (filas x columnas) y la funcion de filtro.
 * Las funciones de filtro vienen de filtros.js (cargado antes).
 *
 * Punto OCP: para agregar niveles con grillas mas grandes o filtros nuevos,
 * basta con agregar un objeto a este array.
 */
var NIVELES = [
  { numero: 1, filas: 2, columnas: 2, filtro: escalaDeGrises },
  { numero: 2, filas: 2, columnas: 2, filtro: function(data) { return brillo(data, 1.3); } },
  { numero: 3, filas: 2, columnas: 2, filtro: negativo }
];

/**
 * Devuelve una ruta aleatoria del banco de imagenes.
 */
function imagenAleatoria() {
  var indice = Math.floor(Math.random() * BANCO_IMAGENES.length);
  return BANCO_IMAGENES[indice];
}
