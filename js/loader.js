document.addEventListener('DOMContentLoaded', () => {
    const pantallaCarga = document.getElementById('pantalla-carga');
    const textoPorcentaje = document.getElementById('loader-porcentaje');
    const logoColor = document.getElementById('loader-logo-color');
    const logoContenedor = document.querySelector('.loader-logo') || document.querySelector('.loader-logo-contenedor');
    
    // SI NO EXISTEN LOS ELEMENTOS EN LA PAGINA SALIMOS
    if (!pantallaCarga || !textoPorcentaje) return;

    let progreso = 0;
    const duracionMs = 5000;    // SEGUNDOS EXACTOS EN MILISEGUNDOS
    const intervaloMs = 50;     // CADA CUANTO SE ACTUALIZA MS VECES POR SEGUNDO
    const incremento = 100 / (duracionMs / intervaloMs); // POR CADA TICK

    const timer = setInterval(() => {
        progreso += incremento;

        if (progreso >= 100) {
            progreso = 100;
            clearInterval(timer); // FRENAMOS EL TEMPORIZADOR AL LLEGAR A
            pantallaCarga.classList.add('loader-oculto'); // OCULTAMOS EL LOADER
            if (logoContenedor) logoContenedor.classList.remove('pulsando');
        }

        // ACTUALIZAMOS EL NUMERO PORCENTUAL EN PANTALLA
        textoPorcentaje.textContent = Math.round(progreso) + '%';

        // LLENAMOS EL LOGO PROPORCIONALMENTE DE ABAJO HACIA ARRIBA
        if (logoColor) {
            logoColor.style.clipPath = `inset(${100 - progreso}% 0 0 0)`;
        }

        // PULSACION CONTINUA MEDIANTE TRANSFORM ALTERNAMOS LA CLASE CADA MS
        if (logoContenedor && progreso < 100) {
            logoContenedor.classList.toggle('pulsando', Math.floor(progreso / 10) % 2 === 1);
        }
    }, intervaloMs);
});
