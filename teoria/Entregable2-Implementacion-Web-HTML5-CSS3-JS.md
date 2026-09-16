# Ejercicio Entregable Nº 2: Desarrollo e Implementación Web (HTML5, CSS3, JS Vanilla)

> **Materia:** Interfaces de Usuario e Interacción (TUDAI / UNCPBA)  
> **Fuente original:** `Ejercicio Entregable Nº2 - Implementacion Figma .pdf` (2 páginas)  
> **Objetivo:** Especificación técnica completa, estructurada y optimizada para modelos de lenguaje (IA) sobre los requisitos de maquetación, animaciones CSS, lógica JavaScript vanilla y diseño responsivo.

---

## 1. Alcance y Tecnologías Obligatorias

El objetivo es maquetar y desarrollar en alta fidelidad la interfaz interactiva de la plataforma de juegos online diseñada en el Entregable Nº 1.

### Stack Tecnológico Estricto
- **Lenguajes:** HTML5, CSS3 y JavaScript puro (**Vanilla JS**).
- > [!WARNING]
  > **Prohibición de Frameworks:** Queda estrictamente desaconsejado y penalizado el uso de:
  > - Frameworks o librerías de JavaScript: **React, Angular, Vue, Svelte, jQuery, etc.**
  > - Frameworks o utilidades de CSS: **Bootstrap, Tailwind CSS, Bulma, Foundation, etc.**
- **Backend:** No se requiere resolución de backend; toda la persistencia o simulación de flujos es estática o simulada en el frontend.

---

## 2. Los 6 Requerimientos Técnicos Mandatorios

### 2.1. Interacción Completa en las 3 Páginas
1. **Home:** Navegación fluida por juegos destacados, filtrado visual y transición a la página de ejecución de "Peg Solitaire".
2. **Login / Registro:** Validación visual de campos e **implementación de animaciones en caso de registro correcto** (ej. mensaje de éxito con transición, loader de confirmación, redirección animada).
3. **Página de Ejecución de Juego:** Contenedor interactivo, visualización de breadcrumbs, formulario de comentarios activo y botones para compartir.

### 2.2. Animaciones Hover en Botones (Mínimo 3 Distintas)
- Se deben implementar al menos **3 animaciones de `hover` con efectos visualmente diferentes** en botones del sitio.
- > [!IMPORTANT]
  > El menú hamburguesa **NO se considera un botón** para cumplir este requisito.
- **Modelos válidos (vistos en Tema 2 - Diapositiva 14):**
  - *Efecto 1:* Expansión de escala suave (`transform: scale(1.08)`) con elevación de sombra (`box-shadow`).
  - *Efecto 2:* Desplazamiento o barrido de fondo mediante gradiente o pseudo-elementos (`::before` / `::after` con `transition: transform`).
  - *Efecto 3:* Borde animado luminiscente (*glow*) o cambio de forma con `border-radius`.

### 2.3. Loading Simulado de 5 Segundos (Obligatorio en la Home)
- Al ingresar o recargar la página Home, debe dispararse siempre una pantalla de carga (*Loading Screen*) durante **5 segundos exactos**.
- > [!CAUTION]
  > **Prohibición Estricta:** El loading **NO puede ser una imagen GIF**.
- **Requisitos del Loader:**
  1. Debe mostrar un **contador numérico de avance porcentual (`0%` a `100%`)** sincronizado con los 5 segundos.
  2. Debe incluir una **animación de carga implementada en CSS3 puro** (figuras geométricas como spinner circular, cuadrado mutante o barras de progreso animadas).
  3. Al finalizar los 5 segundos, la pantalla de carga debe desvanecerse (`opacity: 0` con `transition`) para revelar la Home.

```javascript
// Esquema conceptual del Loading Simulado
let progreso = 0;
const duracionMs = 5000;
const intervaloMs = 50;
const incremento = 100 / (duracionMs / intervaloMs);

const timer = setInterval(() => {
  progreso += incremento;
  if (progreso >= 100) {
    progreso = 100;
    clearInterval(timer);
    document.getElementById('loader-screen').classList.add('ocultar');
  }
  document.getElementById('loader-porcentaje').textContent = `${Math.round(progreso)}%`;
}, intervaloMs);
```

### 2.4. Galería / Carrusel de Imágenes con Animación Real
- Debe implementarse al menos un carrusel o galería animada (por ejemplo, en la ficha multimedia del juego "Peg Solitaire").
- **Requisito dinámico:** No basta con que los elementos se desplacen rígidamente; la transición entre imágenes debe poseer **animación real** (desvanecimiento con opacidad, deslizamiento con curvas Bezier o transformaciones 3D sutiles).

### 2.5. Datos Reales y Variabilidad (Sin Lorem Ipsum)
- **Títulos Reales y Variados:** Títulos de juegos de diferente longitud (cortos de 4 caracteres y largos de 30+ caracteres) para comprobar cómo responde la interfaz y el manejo de textos largos (`text-overflow: ellipsis`, multilínea, altura fija de cards).
- **Imágenes Reales y Diferentes:** Cada juego debe tener su propia portada gráfica con variedad cromática.
- **Plus Opcional de Cátedra:** Consumir datos reales de la API provista por la cátedra mediante `fetch()`:
  - Repositorio de la API: `https://github.com/jimartinezabadias/api-vj-interfaces`

### 2.6. Enfoque Mobile First en la Home
- La página **Home** debe desarrollarse bajo la filosofía **Mobile First** con diseño completamente responsivo:
  - Versión **Mobile** (pantallas estrechas, menú hamburguesa funcional, carruseles optimizados para touch/swipe).
  - Versión **Desktop** (pantallas amplias, grilla expandida, navegación completa).
- *Nota:* Las otras 2 páginas (Login y Peg Solitaire) solo requieren maquetación Desktop.

---

## 3. Restricciones Técnicas y Aclaraciones de la Cátedra

| Elemento | Estado | Justificación / Regla |
| :--- | :--- | :--- |
| **Animaciones `@keyframes`** | **Permitidas** | Uso de porcentajes (`0%`, `50%`, `100%`) y subpropiedades CSS. |
| **Animaciones Spritesheet** | **Prohibidas** | No se permite el uso de tiras de imágenes con desplazamiento de `background-position`. |
| **Menú Hamburguesa** | **Excluido de Hovers** | No computa dentro de las 3 animaciones de botón exigidas. |
| **Carrusel Estático** | **No Válido** | Requiere transiciones animadas perceptibles entre slides. |
| **Correcciones del TPE 1** | **Mandatorio** | Toda observación realizada por los ayudantes en la entrega de Figma debe estar corregida en la versión web. |

---

## 4. Criterios de Evaluación y Condiciones de Entrega

### Criterios de Calificación
1. **Completitud y Fidelidad:** Grado de correspondencia entre el prototipo de Figma aprobado y la maqueta HTML/CSS final.
2. **Calidad de Animaciones:** Fluidez, respeto por las curvas de aceleración (`easing`) y ausencia de saltos bruscos en el DOM.
3. **Justificación Teórica:** Capacidad de sustentar los patrones implementados frente a la teoría vista en la cursada.
4. **Nota Conceptual y Defensa Oral.**

### Canal de Entrega
- **Plataforma:** Repositorio en **GitHub**.
- **Despliegue:** Rama **`gh-pages`** activa para visualización directa en el navegador web.

