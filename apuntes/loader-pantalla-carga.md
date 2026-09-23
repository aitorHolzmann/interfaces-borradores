# Apunte de Estudio: Pantalla de Carga (Loader 5s)

> **Materia:** Diseño de Interfaces / Interfaces de Usuario e Interacción (TUDAI / UNCPBA)  
> **Tema:** Entregable Nº 2 — Requerimiento Mandatorio 2.3 (Loading Simulado de 5 Segundos)  
> **Objetivo:** Documento de estudio exhaustivo y guía de defensa para coloquio oral.

---

## 1. Contexto y Requerimiento de la Cátedra

Según la consigna oficial del Entregable 2:
1. **Duración:** Al ingresar o recargar la Home, debe dispararse una pantalla de carga durante **5 segundos exactos**.
2. **Prohibición estricta:** **NO se permite el uso de imágenes GIF** ni animaciones por spritesheet con `background-position`.
3. **Contador porcentual:** Debe mostrar un avance numérico de **`0%` a `100%`** sincronizado con el tiempo.
4. **Animación en CSS3 puro:** La carga visual debe resolverse mediante técnicas nativas de CSS3.
5. **Desvanecimiento suave:** Al completarse los 5 segundos, la pantalla debe desvanecerse mediante transiciones de opacidad para revelar la Home sin saltos bruscos.

---

## 2. Arquitectura de Archivos y Responsabilidades

El componente respeta la separación de intereses del desarrollo web estático:

| Archivo | Rol en el Componente |
| :--- | :--- |
| [`index.html`](file:///home/facha/Documents/FACU/interfaces/interfaces-borradores/index.html#L25-L34) | **Estructura semántica:** Contenedor overlay fijo, doble capa de imágenes para el logo, porcentaje y texto de estado. |
| [`css/loader.css`](file:///home/facha/Documents/FACU/interfaces/interfaces-borradores/css/loader.css) | **Presentación y animación:** Posicionamiento sobre la ventana, recorte geométrico con `clip-path`, efectos visuales con `filter` y transición de salida. |
| [`js/loader.js`](file:///home/facha/Documents/FACU/interfaces/interfaces-borradores/js/loader.js) | **Orquestación temporal:** Temporizador de 5000 ms, cálculo del progreso porcentual e inyección de estilos en tiempo real. |

---

## 3. Código Fuente Explicado

### 3.1. Estructura HTML (`index.html`)

```html
<div id="pantalla-carga" class="pantalla-carga">
  <div class="loader-contenido">
    <!-- Contenedor con aspect-ratio para evitar deformaciones -->
    <div class="loader-logo-contenedor">
      <!-- Capa 1: Fondo guía (silueta atenuada en escala de grises) -->
      <img src="assets/logo.png" alt="Silueta Logo" class="loader-logo-silueta">
      <!-- Capa 2: Frente activo que se va destapando de abajo hacia arriba -->
      <img src="assets/logo.png" alt="Logo Cargando" class="loader-logo-color" id="loader-logo-color">
    </div>
    <!-- Contador numérico sincronizado -->
    <p id="loader-porcentaje" class="loader-porcentaje">0%</p>
    <!-- Feedback de contexto táctico -->
    <span class="loader-subtexto">Estableciendo enlace táctico con el servidor...</span>
  </div>
</div>
```

---

### 3.2. Estilos y Técnicas de CSS3 (`css/loader.css`)

```css
/* 1. Capa fija que cubre toda la ventana */
.pantalla-carga {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-fondo);
  opacity: 1;
  visibility: visible;
  transition: opacity 1s ease, visibility 1s ease;
}

/* 2. Clase de salida activada por JavaScript al terminar los 5s */
.pantalla-carga.loader-oculto {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}

/* 3. Contenedor escalable con Aspect-Ratio nativo */
.loader-logo-contenedor {
  position: relative;
  width: 220px;
  aspect-ratio: 587 / 425; /* Dimensiones reales de assets/logo.png */
}

/* 4. Regla compartida (Principio DRY): Superposición perfecta */
.loader-logo-contenedor img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  object-fit: contain;
}

/* 5. Silueta oscura de fondo */
.loader-logo-silueta {
  opacity: 0.1;
  filter: grayscale(1);
}

/* 6. Logo que se revela progresivamente */
.loader-logo-color {
  clip-path: inset(100% 0 0 0); /* 100% tapado desde arriba inicialmente */
  filter: drop-shadow(0 0 12px rgba(255, 107, 0, 0.4));
  transition: clip-path 0.05s linear;
}
```

---

### 3.3. Lógica de Sincronización JS (`js/loader.js`)

```javascript
document.addEventListener('DOMContentLoaded', () => {
    const pantallaCarga = document.getElementById('pantalla-carga');
    const textoPorcentaje = document.getElementById('loader-porcentaje');
    const logoColor = document.getElementById('loader-logo-color');
    
    if (!pantallaCarga || !textoPorcentaje) return;

    let progreso = 0;
    const duracionMs = 5000;    // 5 segundos exactos
    const intervaloMs = 50;     // Ticks cada 50ms (20 ejecuciones por segundo)
    const incremento = 100 / (duracionMs / intervaloMs); // 100 / 100 = 1% por tick

    const timer = setInterval(() => {
        progreso += incremento;

        if (progreso >= 100) {
            progreso = 100;
            clearInterval(timer); // Liberar memoria destruyendo el timer
            pantallaCarga.classList.add('loader-oculto'); // Disparar transición CSS
        }

        // 1. Actualizar el valor porcentual numérico
        textoPorcentaje.textContent = Math.round(progreso) + '%';

        // 2. Revelar el logo de abajo hacia arriba en tiempo real
        if (logoColor) {
            logoColor.style.clipPath = `inset(${100 - progreso}% 0 0 0)`;
        }
    }, intervaloMs);
});
```

---

## 4. Preguntas Frecuentes y Conceptos Clave de Examen

### P1. ¿Por qué usamos `opacity` + `visibility` y NO usamos simplemente `display: none`?
* **`display` no es interpolable (no se puede animar):** Es un valor binario. Si pones `display: none`, el elemento desaparece en el milisegundo 0 sin ningún efecto visual. La transición de `opacity` queda anulada.
* **`opacity: 0` solo lo hace invisible, pero sigue existiendo físicamente:** Un elemento con `opacity: 0` y `position: fixed` a pantalla completa actúa como una **"pared de vidrio invisible"**: bloquea todos los clicks, scrolls y enlaces de la página que está debajo.
* **`visibility: hidden` remueve los eventos y el foco:** Quita el elemento del árbol de accesibilidad y del flujo de interacción, permitiendo hacer click libremente en la Home una vez finalizada la carga.

### P2. ¿Por qué `visibility` está incluido dentro de `transition`?
`visibility` posee un comportamiento de transición especial en la especificación de CSS:
* Al transicionar hacia `hidden`, el navegador **mantiene el elemento con `visibility: visible` durante todo el tiempo de la transición (1s)** para que el desvanecimiento de la opacidad se pueda apreciar.
* Recién cuando la opacidad llega a 0, conmuta instantáneamente a `hidden`.
* Si no estuviera en `transition`, el elemento pasaría a `hidden` en el instante 0, cortando el efecto en seco.

### P3. ¿Cómo funciona `filter` y qué diferencia hay entre `box-shadow` y `drop-shadow`?
* **En la silueta (`grayscale(1)` con `opacity: 0.1`):** Convierte el logo a blanco y negro y lo atenúa. Permite **reutilizar el mismo asset gráfico (`assets/logo.png`)**, evitando descargar dos imágenes distintas y ahorrando peticiones HTTP.
* **En el logo activo (`drop-shadow`):** A diferencia de `box-shadow` (que arroja una sombra sobre la caja rectangular del elemento de 220×160), `drop-shadow()` analiza el canal alfa de la imagen transparente y proyecta el resplandor naranja contorneando las curvas y letras del isotipo.

### P4. ¿Cómo funciona la función `clip-path: inset(...)`?
`clip-path` define un área visible. La función `inset(top right bottom left)` recorta hacia adentro siguiendo el orden de las agujas del reloj:
* `inset(100% 0 0 0)`: Recorta el 100% desde arriba hacia abajo. El logo a color está completamente oculto.
* `inset(50% 0 0 0)`: Recorta el 50% superior. La mitad inferior es visible.
* `inset(0% 0 0 0)`: No recorta nada. El logo se visualiza en su totalidad.
* **Fórmula en JS:** `inset(${100 - progreso}% 0 0 0)`.

### P5. ¿Por qué usamos `aspect-ratio: 587 / 425` en lugar de `height: 160px` fijo?
* **Mantenibilidad y escalabilidad:** Al declarar la relación de aspecto nativa del archivo (`587 / 425`), solo necesitamos modificar la propiedad `width` (por ejemplo en mobile o en desktop) y el navegador calcula la altura exacta automáticamente.
* **Cero distorsión:** Elimina el riesgo de estirar o aplastar el isotipo por errores de cálculo manual.

### P6. ¿Por qué usamos `setInterval` en lugar de `requestAnimationFrame`?
* **Alineación con la cátedra:** Es la solución formal explicada en la teoría del Entregable 2.
* **Simplicidad matemática y defensa clara:**
  $$\text{Pasos} = \frac{\text{Duración}}{\text{Intervalo}} = \frac{5000\text{ ms}}{50\text{ ms}} = 100\text{ pasos}$$
  $$\text{Incremento por paso} = \frac{100\%}{100} = 1\%$$
  Cada 50 ms se suma un 1%, garantizando una progresión lineal, intuitiva y fácil de justificar en el pizarrón.

---

## 5. Fundamentos Teóricos de UX / UI Aplicados

1. **1ª Heurística de Nielsen — Visibilidad del estado del sistema:**
   Un sistema nunca debe dejar al usuario en la incertidumbre. El contador numérico (`0%` a `100%`) y la barra de llenado visual comunican de forma continua que la aplicación está procesando y cuánto tiempo falta para acceder.
2. **Ley de Gestalt — Figura y Fondo:**
   La silueta en escala de grises actúa como fondo estático (recipiente cognitivo), mientras que el logo naranja que emerge conforma la "figura" dinámica que atrae la atención perceptual.
3. **Principio DRY (*Don't Repeat Yourself*):**
   Unificación de estilos compartidos en `.loader-logo-contenedor img` para evitar código redundante.

---

## 6. Guion Resumido para la Defensa Oral (Pitch de 1 minuto)

> *"Para la pantalla de carga de 5 segundos de la Home, evitamos el uso de GIFs o librerías externas cumpliendo las pautas de la cátedra mediante CSS3 puro y JavaScript Vanilla.*
> 
> *El componente utiliza una técnica de doble capa: una silueta en escala de grises atenuada con `filter: grayscale()` y `opacity` que sirve de guía visual, y sobre ella el logo original con resplandor `drop-shadow` que se va revelando de abajo hacia arriba mediante `clip-path: inset()`.*
> 
> *En JavaScript orquestamos los 5.000 ms con un `setInterval` de 50 ms que incrementa un 1% por tick en 100 pasos exactos. Al alcanzar el 100%, se destruye el temporizador con `clearInterval` y se aplica la clase `.loader-oculto`. Esta clase combina `opacity: 0`, `visibility: hidden` dentro de la transición para desvanecer suavemente la pantalla y liberar los eventos del mouse sin saltos bruscos."*

