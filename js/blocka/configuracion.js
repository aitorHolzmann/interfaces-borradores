/* CONFIGURACION DEL JUEGO BLOCKA DATOS CONSTANTES Y NIVELES */

/* TAMANO LOGICO DEL CANVAS EN PIXELES */
var TAMANO_CANVAS = 480;

/* BANCO DE IMAGENES PARA EL PUZZLE */
var BANCO_IMAGENES = [
  'assets/images/puzzles/puzzle-1.jpg',
  'assets/images/puzzles/puzzle-2.jpg',
  'assets/images/puzzles/puzzle-3.jpg',
  'assets/images/puzzles/puzzle-4.jpg',
  'assets/images/puzzles/puzzle-5.jpg',
  'assets/images/puzzles/puzzle-6.jpg'
];

/* CONFIGURACION DE NIVELES */
var NIVELES = [
  {
    numero: 1,
    nombre: 'NIVEL RECLUTA',
    filas: 2,
    columnas: 2,
    piezas: 4,
    filtro: escalaDeGrises,
    nombreFiltro: 'ESCALA DE GRISES',
    tiempoMaximo: 60
  },
  {
    numero: 2,
    nombre: 'NIVEL VETERANO',
    filas: 2,
    columnas: 3,
    piezas: 6,
    filtro: function(data) { return brillo(data, 1.3); },
    nombreFiltro: 'BRILLO',
    tiempoMaximo: 50
  },
  {
    numero: 3,
    nombre: 'NIVEL COMANDANTE',
    filas: 2,
    columnas: 4,
    piezas: 8,
    filtro: negativo,
    nombreFiltro: 'NEGATIVO',
    tiempoMaximo: 45
  },
  {
    numero: 4,
    nombre: 'NIVEL TACTICO',
    filas: 2,
    columnas: 3,
    piezas: 6,
    filtro: filtroMixto,
    nombreFiltro: 'FILTROS MIXTOS POR SUBIMAGEN',
    tiempoMaximo: 40
  },
  {
    numero: 5,
    nombre: 'NIVEL MAESTRO',
    filas: 2,
    columnas: 4,
    piezas: 8,
    filtro: filtroMixto,
    nombreFiltro: 'FILTROS MIXTOS POR SUBIMAGEN',
    tiempoMaximo: 35
  }
];

/* SELECCION ALEATORIA DE IMAGEN DEL BANCO */
function imagenAleatoria() {
  var indice = Math.floor(Math.random() * BANCO_IMAGENES.length);
  return BANCO_IMAGENES[indice];
}
