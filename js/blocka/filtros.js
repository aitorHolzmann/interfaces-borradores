/* FILTROS DE IMAGEN — Funciones puras de transformacion de pixeles
   Cada funcion recibe un ImageData, modifica su data[] in-place y lo retorna.
   El canal Alpha (data[i+3]) nunca se toca. */

/**
 * Escala de grises con ponderacion perceptual ITU-R BT.601.
 * Formula: gris = 0.299*R + 0.587*G + 0.114*B
 */
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

/**
 * Ajuste de brillo multiplicativo.
 * factor > 1 aclara, factor < 1 oscurece.
 * Uint8ClampedArray clampea automaticamente a [0, 255].
 */
function brillo(imageData, factor) {
  var data = imageData.data;

  for (var i = 0; i < data.length; i += 4) {
    data[i]     = data[i]     * factor;
    data[i + 1] = data[i + 1] * factor;
    data[i + 2] = data[i + 2] * factor;
  }

  return imageData;
}

/**
 * Negativo / inversion cromatica.
 * Formula: canal = 255 - canal
 */
function negativo(imageData) {
  var data = imageData.data;

  for (var i = 0; i < data.length; i += 4) {
    data[i]     = 255 - data[i];
    data[i + 1] = 255 - data[i + 1];
    data[i + 2] = 255 - data[i + 2];
  }

  return imageData;
}
