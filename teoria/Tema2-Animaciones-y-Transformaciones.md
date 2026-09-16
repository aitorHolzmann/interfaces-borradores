# Tema 2: Animaciones y Transformaciones en CSS3 y JavaScript

> **Materia:** Interfaces de Usuario e Interacción (TUDAI / UNCPBA)  
> **Fuentes originales:** `Tema2-Animaciones.pdf` (19 diapositivas) y `Tema2-Transformaciones.pdf` (14 diapositivas)  
> **Objetivo:** Guía técnica compacta y de mínima huella de tokens para IA, abarcando conceptos de UX, sintaxis CSS, comparación técnica y fundamentos matemáticos matriciales.

---

## 1. Rol de las Animaciones en la Experiencia de Usuario (UX)

Las animaciones en interfaces no son meramente estéticas; deben tener un **propósito funcional**:
1. **Feedback Visual:** Informan al usuario del resultado de una operación (ej. vibración ante credenciales inválidas, botón que cambia a spinner).
2. **Visibilidad del Estado del Sistema:** Comunican qué está sucediendo en segundo plano (loaders, barras de carga) para evitar que el usuario suponga que la aplicación se congeló.
3. **Guía y Orientación Espacial:** Ayudan al usuario a comprender de dónde provino un elemento y hacia dónde fue (menús laterales deslizantes, modales que emergen desde el botón presionado).
4. **Narrativa / Storytelling:** Enriquecen el recorrido del usuario otorgando dinamismo y naturalidad.

> [!WARNING]
> **Riesgo de sobreuso:** Una animación mal implementada, lenta (> 500 ms) o puramente ornamental pasa de ser vistosa a molesta, distractora y frustrante.

---

## 2. Clasificación de las Animaciones

| Tipo | Definición | Ejemplo de Aplicación |
| :--- | :--- | :--- |
| **Procedurales** | La posición, rotación u orientación de los elementos se calcula dinámicamente mediante código evaluando una función matemática en cada ciclo de ejecución. | Segundero de un reloj con trigonometría; rebote de una pelota mediante ecuaciones cinemáticas. |
| **Por Keyframes** | Basadas en fotogramas clave donde se definen estados intermedios y el motor gráfico interpola los valores restantes. | `@keyframes` en CSS, transiciones de opacidad, transformaciones de escala. |
| **Basadas en Spritesheets** | Cuadros de animación secuenciales integrados en una sola imagen fija, desplazando la propiedad `background-position`. | Animación de personajes en 2D, iconos interactivos complejos. |
| **Basadas en Física** | Modelan leyes del mundo real como gravedad, fricción, velocidad terminal o campos vectoriales de fuerzas. | Simuladores de fluidos, interacción táctil con rebote elástico (*rubber-banding*). |

---

## 3. Transiciones vs. Animaciones en CSS

![Transiciones vs Animaciones](images/tema2_animacion_vs_transicion.png)

| Criterio | Transiciones (`transition`) | Animaciones (`animation`) |
| :--- | :--- | :--- |
| **Disparador (*Trigger*)** | Requieren un cambio explícito de estado (pseudo-clases `:hover`, `:focus`, `:active` o agregado dinámico de clases JS). | Se ejecutan automáticamente al cargar o al asociar la regla, sin necesidad de interacción previa. |
| **Estados** | Solo interpolan entre dos estados: inicial y final (`A -> B`). | Soportan múltiples estados intermedios mediante porcentajes (`0%`, `25%`, `100%`). |
| **Repetición** | Se ejecutan una sola vez por evento de cambio de estado. | Permiten repeticiones finitas o infinitas (`animation-iteration-count: infinite`). |
| **Control de Dirección** | Solo van de ida y vuelta según el estado activo. | Permiten ciclos alternados (`alternate`, `alternate-reverse`). |
| **Casos de uso** | Microinteracciones, cambios de color en botones, expansión de cards. | Spinners de carga continuos, banners animados, efectos complejos autónomos. |

---

## 4. Sintaxis y Propiedades de CSS Transitions

```css
/* Shorthand */
transition: [propiedad] [duración] [función-de-tiempo] [retardo];

/* Ejemplo */
.boton {
  background-color: #007bff;
  transition: background-color 0.3s ease-in-out 0.1s, transform 0.2s ease;
}
.boton:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}
```

### Funciones de Tiempo (*Timing Functions / Easing*)
- `linear`: Velocidad constante de inicio a fin.
- `ease`: Comienza suave, acelera y desacelera al final (comportamiento por defecto).
- `ease-in`: Comienza lento y acelera gradualmente.
- `ease-out`: Comienza rápido y desacelera suavemente al final (ideal para entradas de UI).
- `ease-in-out`: Aceleración inicial y desaceleración final suave.
- `cubic-bezier(x1, y1, x2, y2)`: Curva Bezier personalizada para rebotes o aceleraciones no estándar.

---

## 5. Sintaxis y Propiedades de CSS Animations

```css
/* Definición de Keyframes */
@keyframes pulso {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.15);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Aplicación del shorthand */
.elemento-animado {
  animation: pulso 1.5s ease-in-out 0s infinite alternate;
}
```

### Propiedades Desglosadas
- `animation-name`: Identificador del bloque `@keyframes`.
- `animation-duration`: Duración del ciclo completo (ej. `2s`, `400ms`).
- `animation-timing-function`: Curva de aceleración.
- `animation-delay`: Tiempo de espera antes de comenzar.
- `animation-iteration-count`: Número de repeticiones (ej. `3` o `infinite`).
- `animation-direction`: `normal`, `reverse`, `alternate`, `alternate-reverse`.
- `animation-fill-mode`: Controla los estilos antes y después de ejecutar la animación:
  - `none`: Vuelve al estado base sin aplicar estilos de keyframe fuera del tiempo activo.
  - `forwards`: Conserva los estilos del último keyframe (`100%`) al finalizar.
  - `backwards`: Aplica los estilos del primer keyframe (`0%`) durante el delay inicial.
  - `both`: Aplica `forwards` y `backwards`.
- `animation-play-state`: `running` o `paused` (útil para alternar mediante JavaScript).

---

## 6. Transformaciones CSS 2D (`transform`)

![CSS Translate](images/tema2_css_translate.png)

Las transformaciones modifican el espacio de coordenadas visual del elemento sin alterar el flujo del documento (*layout reflow*), haciéndolas altamente performantes vía GPU.

### Funciones Básicas 2D
1. **Traslación:**
   - `transform: translate(x, y);`
   - `transform: translateX(200px);`
   - `transform: translateY(100px);`
2. **Rotación:**
   - `transform: rotate(45deg);` (valores en grados `deg`, radianes `rad`, o vueltas `turn`).
3. **Escala:**
   - `transform: scale(x, y);` o `transform: scale(factor);` (ej. `scale(2)` duplica el tamaño, `scale(0.5)` reduce a la mitad).
4. **Inclinación / Deformación (*Skew*):**
   - `transform: skew(x-angle, y-angle);`
   - `transform: skewX(25deg);`
   - `transform: skewY(25deg);`

---

## 7. Modelo Matemático Matricial 2D: `matrix(a, b, c, d, e, f)`

![Transform Matrix](images/tema2_transform_matrix.png)

Cualquier combinación de transformaciones 2D se expresa internamente como una matriz afín de $3 \times 3$:

$$\begin{bmatrix} x' \\ y' \\ 1 \end{bmatrix} = \begin{bmatrix} a & c & e \\ b & d & f \\ 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} x \\ y \\ 1 \end{bmatrix}$$

Donde los parámetros en CSS son: `transform: matrix(a, b, c, d, e, f);`
- $a$: Escala horizontal ($s_x$).
- $b$: Inclinación horizontal ($skew_y$).
- $c$: Inclinación vertical ($skew_x$).
- $d$: Escala vertical ($s_y$).
- $e$: Desplazamiento horizontal ($t_x$ o traslación en X).
- $f$: Desplazamiento vertical ($t_y$ o traslación en Y).

### Equivalencias Matriciales Directas
1. **Identidad (Sin cambios):**
   $$\text{matrix}(1, 0, 0, 1, 0, 0)$$
2. **Escala ($s_x, s_y$):**
   $$\begin{bmatrix} s_x & 0 & 0 \\ 0 & s_y & 0 \\ 0 & 0 & 1 \end{bmatrix} \implies \text{matrix}(s_x, 0, 0, s_y, 0, 0)$$
3. **Traslación ($t_x, t_y$):**
   $$\begin{bmatrix} 1 & 0 & t_x \\ 0 & 1 & t_y \\ 0 & 0 & 1 \end{bmatrix} \implies \text{matrix}(1, 0, 0, 1, t_x, t_y)$$
4. **Rotación por ángulo $\theta$:**
   $$\begin{bmatrix} \cos\theta & -\sin\theta & 0 \\ \sin\theta & \cos\theta & 0 \\ 0 & 0 & 1 \end{bmatrix} \implies \text{matrix}(\cos\theta, \sin\theta, -\sin\theta, \cos\theta, 0, 0)$$
5. **Espejado Horizontal (*Flip Horizontal*):**
   $$\begin{bmatrix} -1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix} \implies \text{matrix}(-1, 0, 0, 1, 0, 0)$$
6. **Espejado Vertical (*Flip Vertical*):**
   $$\begin{bmatrix} 1 & 0 & 0 \\ 0 & -1 & 0 \\ 0 & 0 & 1 \end{bmatrix} \implies \text{matrix}(1, 0, 0, -1, 0, 0)$$
7. **Espejado en ambos ejes (Inversión 180°):**
   $$\begin{bmatrix} -1 & 0 & 0 \\ 0 & -1 & 0 \\ 0 & 0 & 1 \end{bmatrix} \implies \text{matrix}(-1, 0, 0, -1, 0, 0)$$

---

## 8. Transformaciones en el Espacio 3D y Prefijos

### Funciones 3D
- `rotate3d(x, y, z, angle)`, `rotateX(deg)`, `rotateY(deg)`, `rotateZ(deg)`.
- `translate3d(x, y, z)`, `translateZ(px)`.
- `scale3d(sx, sy, sz)`.
- `matrix3d(...)`: Matriz de proyección afín $4 \times 4$ (16 argumentos).
- **Entorno 3D:** Requiere definir `perspective: 800px;` en el contenedor padre y `transform-style: preserve-3d;` para mantener la profundidad de los hijos.

### Soporte de Navegadores Histórico (Vendor Prefixes)
```css
.caja {
  -webkit-transform: rotate(45deg); /* Chrome, Safari anterior */
  -moz-transform: rotate(45deg);    /* Firefox anterior */
  -ms-transform: rotate(45deg);     /* IE9 */
  -o-transform: rotate(45deg);      /* Opera anterior */
  transform: rotate(45deg);         /* Estándar actual */
}
```

