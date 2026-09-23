document.addEventListener('DOMContentLoaded', () => {
    const pantallaCarga = document.getElementById('pantalla-carga');
    const textoPorcentaje = document.getElementById('loader-porcentaje');
    const logoColor = document.getElementById('loader-logo-color');
    
    // Si no existen los elementos, no hacemos nada
    if (!pantallaCarga || !textoPorcentaje) return;

    const duracion = 5000; // 5 segundos en milisegundos
    let inicio = null;

    function animarCarga(timestamp) {
        if (!inicio) {
            inicio = timestamp;
        }

        // Tiempo transcurrido desde el inicio de la animación
        const progreso = timestamp - inicio;
        
        // Calcular el porcentaje de 0 a 100
        let porcentaje = Math.min((progreso / duracion) * 100, 100);
        
        // Actualizar el texto numérico en pantalla
        textoPorcentaje.textContent = Math.floor(porcentaje) + '%';
        
        // Revelar el logo de abajo hacia arriba en sincronía con el %
        if (logoColor) {
            logoColor.style.clipPath = `inset(${100 - porcentaje}% 0 0 0)`;
        }
        
        if (progreso < duracion) {
            // Si no llegamos a 5 segundos, pedimos el siguiente frame
            requestAnimationFrame(animarCarga);
        } else {
            // Al terminar los 5 segundos, ocultamos el loader
            pantallaCarga.classList.add('loader-oculto');
        }
    }
    
    // Iniciar la animación
    requestAnimationFrame(animarCarga);
});
