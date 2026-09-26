document.addEventListener('DOMContentLoaded', () => {
    const pantallaCarga = document.getElementById('pantalla-carga');
    const textoPorcentaje = document.getElementById('loader-porcentaje');
    const logoColor = document.getElementById('loader-logo-color');
    const logoContenedor = document.querySelector('.loader-logo-contenedor');
    
    // Si no existen los elementos en la página, salimos
    if (!pantallaCarga || !textoPorcentaje) return;

    let progreso = 0;
    const duracionMs = 5000;    // 5 segundos exactos en milisegundos
    const intervaloMs = 50;     // Cada cuánto se actualiza (50ms = 20 veces por segundo)
    const incremento = 100 / (duracionMs / intervaloMs); // 100 / 100 = 1% por cada tick

    const timer = setInterval(() => {
        progreso += incremento;

        if (progreso >= 100) {
            progreso = 100;
            clearInterval(timer); // Frenamos el temporizador al llegar a 100%
            pantallaCarga.classList.add('loader-oculto'); // Ocultamos el loader
            if (logoContenedor) logoContenedor.classList.remove('pulsando');
        }

        // Actualizamos el número porcentual en pantalla
        textoPorcentaje.textContent = Math.round(progreso) + '%';

        // Llenamos el logo proporcionalmente de abajo hacia arriba
        if (logoColor) {
            logoColor.style.clipPath = `inset(${100 - progreso}% 0 0 0)`;
        }

        // Pulsación continua mediante transform: alternamos la clase cada 10% (500ms)
        if (logoContenedor && progreso < 100) {
            logoContenedor.classList.toggle('pulsando', Math.floor(progreso / 10) % 2 === 1);
        }
    }, intervaloMs);
});
