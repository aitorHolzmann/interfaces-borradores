// Escala de grises (ponderación perceptual ITU-R BT.601)
function escalaDeGrises(imageData) {
  var data = imageData.data;

  for (var i = 0; i < data.length; i += 4) {
    var gris = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    data[i]     = gris;
    data[i + 1] = gris;
    data[i + 2] = gris;
  }

  return imageData;
}

// Ajuste de brillo
function brillo(imageData, factor) {
  var data = imageData.data;

  for (var i = 0; i < data.length; i += 4) {
    data[i]     = data[i]     * factor;
    data[i + 1] = data[i + 1] * factor;
    data[i + 2] = data[i + 2] * factor;
  }

  return imageData;
}

// Negativo
function negativo(imageData) {
  var data = imageData.data;

  for (var i = 0; i < data.length; i += 4) {
    data[i]     = 255 - data[i];
    data[i + 1] = 255 - data[i + 1];
    data[i + 2] = 255 - data[i + 2];
  }

  return imageData;
}

// Alterna entre los filtros según el índice de la pieza
function filtroMixto(imageData, fila, columna, indice) {
  var listaFiltros = [
    escalaDeGrises,
    function(d) { return brillo(d, 1.3); },
    negativo
  ];

  var indiceElegido = (typeof indice === 'number') ? (indice % listaFiltros.length) : 0;
  return listaFiltros[indiceElegido](imageData);
}
