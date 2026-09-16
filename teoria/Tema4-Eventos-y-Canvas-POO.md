# Tema 4: Eventos DOM, HTML5 Drag & Drop y Programación Orientada a Objetos en Canvas

> **Materia:** Interfaces de Usuario e Interacción (TUDAI / UNCPBA)  
> **Fuentes originales:** `Tema4-Eventos.pdf` (12 págs), `Tema4-ParteA.pdf` (17 págs) y `Tema4-ParteB.pdf` (11 págs)  
> **Objetivo:** Documento técnico exhaustivo y de mínima huella de tokens para IA, unificando el modelo de eventos, selectores, la API Drag and Drop y la arquitectura POO con Hit-Testing para interacción gráfica en Canvas.

---

## 1. Paradigma Conducido por Eventos (*Event-Driven*)

![Clasificación de Eventos](images/tema4_clasificacion_eventos.png)

A diferencia del paradigma secuencial tradicional (donde el flujo de ejecución es predecible y unívoco paso a paso), las interfaces de usuario modernas funcionan bajo el **paradigma reactivo o guiado por eventos**:
- El programa permanece a la espera de acciones del usuario o del sistema (*Event Listeners*).
- El orden y la ocurrencia de los *code-paths* están determinados por la naturaleza impredecible de la interacción humana.

### Clasificación de Eventos en el DOM
1. **Eventos del Mouse:** `click`, `dblclick`, `mousedown`, `mouseup`, `mousemove`, `mouseenter`, `mouseleave`, `mouseover`, `mouseout`.
2. **Eventos de Teclado:** `keydown`, `keyup`, `keypress` (información accesible en `event.key` y `event.code`).
3. **Eventos de Página / Ventana:** `DOMContentLoaded` (DOM listo), `load` (recursos e imágenes cargados), `resize`, `scroll`, `unload`.
4. **Eventos de Formulario:** `submit`, `input` (en tiempo real), `change` (al perder foco), `focus`, `blur`.

### Formas de Manejo de Eventos en JavaScript

```javascript
// 1. Inadecuada / Antigua: Inline en HTML (mezcla estructura con lógica)
// <button onclick="handleClick()">Click</button>

// 2. Propiedad del elemento DOM (sobrescribe listeners previos; solo admite uno)
const btn = document.querySelector('#miBoton');
btn.onclick = function(e) { /*...*/ };

// 3. Recomendada / Estándar: addEventListener (admite múltiples manejadores desacoplados)
btn.addEventListener('click', (event) => {
  console.log('Evento click capturado:', event.target);
});

// Manejo masivo con querySelectorAll
document.querySelectorAll('.item-lista').forEach(item => {
  item.addEventListener('mouseenter', (e) => {
    e.target.classList.add('resaltado');
  });
});
```

---

## 2. API HTML5 Drag and Drop

![Flujo Drag and Drop](images/tema4_drag_and_drop_flow.png)

Permite arrastrar y soltar elementos del DOM mediante un protocolo de eventos nativo.

### 2.1. Preparación del Elemento de Origen (*Source*)
Para que un elemento pueda ser arrastrado, debe configurarse el atributo HTML `draggable="true"`.

**Eventos disparados en el elemento origen:**
- `ondragstart`: Se dispara cuando el usuario comienza a arrastrar. Aquí se configuran los datos a transferir mediante el objeto `dataTransfer`.
- `ondrag`: Se ejecuta de forma continua mientras el elemento está en movimiento.
- `ondragend`: Se ejecuta cuando la acción de arrastre finaliza (sea exitosa o cancelada).

### 2.2. Preparación del Contenedor de Destino (*Target*)
**Eventos disparados en el contenedor receptor:**
- `ondragenter`: El elemento arrastrado ingresa en los límites visuales del destino.
- `ondragover`: El elemento se mueve sobre el destino.  
  > [!IMPORTANT]
  > **Requisito mandatorio:** Es obligatorio invocar `event.preventDefault()` en el manejador de `dragover`. Por defecto, los navegadores no permiten soltar elementos; `preventDefault()` habilita la zona de caída.
- `ondragleave`: El elemento abandona los límites del destino.
- `ondrop`: El usuario suelta el elemento sobre el contenedor.

### 2.3. Código Completo de Referencia
```html
<!-- Elemento arrastrable -->
<div id="item-arrastrable" draggable="true">Arrastrame</div>

<!-- Zona de caída -->
<div id="zona-destino">Soltar aquí</div>
```

```javascript
const item = document.getElementById('item-arrastrable');
const dropzone = document.getElementById('zona-destino');

// Origen
item.addEventListener('dragstart', (event) => {
  // Configurar tipo y valor transferido (usualmente el ID del elemento)
  event.dataTransfer.setData('text/plain', event.target.id);
});

// Destino
dropzone.addEventListener('dragover', (event) => {
  // Previene el comportamiento por defecto para habilitar el drop
  event.preventDefault();
});

dropzone.addEventListener('drop', (event) => {
  // Previene que el navegador abra el elemento como enlace/archivo
  event.preventDefault();
  
  // Recuperar el ID del elemento arrastrado
  const idElemento = event.dataTransfer.getData('text/plain');
  const elementoArrastrado = document.getElementById(idElemento);
  
  // Anexar el elemento dentro del nuevo contenedor
  event.target.appendChild(elementoArrastrado);
});
```

---

## 3. Arquitectura Orientada a Objetos (POO) en Canvas 2D

Para gestionar escenas interactivas complejas con múltiples figuras, se implementa una jerarquía de clases que encapsula estado (posición, dimensiones, estilo) y comportamiento (dibujo, hit-testing).

```
          ┌───────────────────────────┐
          │       class Figure        │
          │  posX, posY, fill, ctx    │
          │  draw(), isPointInside()  │
          └─────────────┬─────────────┘
                        │
            ┌───────────┴───────────┐
            ▼                       ▼
┌───────────────────────┐ ┌───────────────────────┐
│      class Rect       │ │     class Circle      │
│  width, height        │ │  radius               │
│  draw(), isPoint...   │ │  draw(), isPoint...   │
└───────────────────────┘ └───────────────────────┘
```

### 3.1. Clase Base: `Figure`
```javascript
class Figure {
  constructor(posX, posY, fill, context) {
    this.posX = posX;
    this.posY = posY;
    this.fill = fill;
    this.context = context;
    this.isHighlighted = false;
  }

  setFill(fill) { this.fill = fill; }
  getFill() { return this.fill; }
  setPosition(x, y) { this.posX = x; this.posY = y; }
  getPosition() { return { x: this.posX, y: this.posY }; }
  setHighlighted(state) { this.isHighlighted = state; }

  draw() {
    this.context.fillStyle = this.fill;
    // Las subclases implementan el trazado específico
  }

  isPointInside(x, y) {
    return false; // Implementado por subclases
  }
}
```

### 3.2. Subclase: `Rect` (Rectángulo)
```javascript
class Rect extends Figure {
  constructor(posX, posY, width, height, fill, context) {
    super(posX, posY, fill, context);
    this.width = width;
    this.height = height;
  }

  draw() {
    super.draw();
    this.context.fillRect(this.posX, this.posY, this.width, this.height);
    
    if (this.isHighlighted) {
      this.context.strokeStyle = '#FF0000';
      this.context.lineWidth = 3;
      this.context.strokeRect(this.posX, this.posY, this.width, this.height);
    }
  }

  // Hit-Testing de Caja Delimitadora (Bounding Box)
  isPointInside(x, y) {
    return (
      x >= this.posX &&
      x <= this.posX + this.width &&
      y >= this.posY &&
      y <= this.posY + this.height
    );
  }
}
```

### 3.3. Subclase: `Circle` (Círculo)
![Hit Test Distancia](images/tema4_hittest_distancia_circulo.png)

```javascript
class Circle extends Figure {
  constructor(posX, posY, radius, fill, context) {
    super(posX, posY, fill, context);
    this.radius = radius;
  }

  draw() {
    this.context.fillStyle = this.fill;
    this.context.beginPath();
    this.context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2);
    this.context.fill();
    this.context.closePath();

    if (this.isHighlighted) {
      this.context.strokeStyle = '#FFD700';
      this.context.lineWidth = 4;
      this.context.beginPath();
      this.context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2);
      this.context.stroke();
      this.context.closePath();
    }
  }

  // Hit-Testing Radial por Distancia Euclidiana
  isPointInside(x, y) {
    const dx = this.posX - x;
    const dy = this.posY - y;
    // d = sqrt(dx^2 + dy^2) <= radio
    return Math.sqrt(dx * dx + dy * dy) <= this.radius;
  }
}
```

---

## 4. Coordenadas del Cursor y Bucle de Renderizado en Canvas

### Cálculo Preciso de Coordenadas de Mouse
Las propiedades globales del mouse (`clientX`, `pageX`, `screenX`) no coinciden con el origen $(0,0)$ del canvas si la página tiene scroll o márgenes. El cálculo moderno y seguro es:

```javascript
function getCanvasMousePos(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: Math.round(event.clientX - rect.left),
    y: Math.round(event.clientY - rect.top)
  };
}
```
*(Nota histórica: En el material se menciona `event.layerX` y `event.offsetX`, los cuales pueden presentar diferencias de compatibilidad en browsers antiguos o ante transformaciones CSS).*

---

## 5. Máquina de Estados para Drag & Drop Interactivo en Canvas

En Canvas, los elementos dibujados no son nodos individuales del DOM; son solo píxeles. Por lo tanto, para arrastrar figuras se debe implementar una **máquina de estados** que gestione:
1. Selección de figura (*Hit-Testing* inverso para respetar Z-index).
2. Arrastre activo en movimiento.
3. Liberación y redibujado completo de la escena.

```javascript
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let figures = [];
let selectedFigure = null;
let isDragging = false;
let dragOffset = { x: 0, y: 0 };

// Función de redibujado global
function redraw() {
  // Limpiar lienzo
  ctx.fillStyle = '#FAFAFA';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Dibujar todas las figuras en orden
  for (let i = 0; i < figures.length; i++) {
    figures[i].draw();
  }
}

// Búsqueda de figura con Hit-Testing en orden inverso (de arriba hacia abajo)
function findClickedFigure(x, y) {
  for (let i = figures.length - 1; i >= 0; i--) {
    if (figures[i].isPointInside(x, y)) {
      return figures[i];
    }
  }
  return null;
}

// 1. MOUSE DOWN: Captura de la figura
canvas.addEventListener('mousedown', (e) => {
  const pos = getCanvasMousePos(canvas, e);
  const clicked = findClickedFigure(pos.x, pos.y);

  if (clicked !== null) {
    isDragging = true;
    selectedFigure = clicked;
    selectedFigure.setHighlighted(true);

    // Calcular offset relativo al punto de agarre para evitar que la figura salte
    const figPos = selectedFigure.getPosition();
    dragOffset.x = pos.x - figPos.x;
    dragOffset.y = pos.y - figPos.y;

    redraw();
  }
});

// 2. MOUSE MOVE: Actualización de coordenadas durante el arrastre
canvas.addEventListener('mousemove', (e) => {
  if (isDragging && selectedFigure !== null) {
    const pos = getCanvasMousePos(canvas, e);
    
    // Asignar nueva posición respetando el offset de agarre inicial
    selectedFigure.setPosition(pos.x - dragOffset.x, pos.y - dragOffset.y);
    
    redraw();
  }
});

// 3. MOUSE UP / MOUSE LEAVE: Liberación de la figura
function endDrag() {
  if (isDragging && selectedFigure !== null) {
    selectedFigure.setHighlighted(false);
    selectedFigure = null;
    isDragging = false;
    redraw();
  }
}

canvas.addEventListener('mouseup', endDrag);
canvas.addEventListener('mouseleave', endDrag);
```

