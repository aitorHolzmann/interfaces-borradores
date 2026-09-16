# Tema 3: Teoría del Color, Canvas 2D y Manipulación de Píxeles (ImageData)

> **Materia:** Interfaces de Usuario e Interacción (TUDAI / UNCPBA)  
> **Fuente original:** `Tema3.pdf` (39 diapositivas)  
> **Objetivo:** Documento de referencia técnica y algorítmica para IA, condensando la teoría física del color, la API Canvas 2D de HTML5 y el acceso a bajo nivel de píxeles.

---

## 1. Teoría Física del Color

- **Naturaleza del Color:** El color es luz; radiación electromagnética visible viajando en el espacio con longitudes de onda entre los $380\text{ nm}$ y $750\text{ nm}$.
- **Percepción:** Es un fenómeno psicofísico subjetivo; la retina humana contiene fotorreceptores (conos) sensibles a longitudes de onda cortas (azul), medias (verde) y largas (rojo).

### Síntesis Aditiva vs. Síntesis Sustractiva
![Síntesis de Color](images/tema3_sintesis_color_aditiva_sustractiva.png)

| Característica | Síntesis Aditiva | Síntesis Sustractiva |
| :--- | :--- | :--- |
| **Medio** | Emisores directos de luz (pantallas, monitores, proyectores). | Medios impresos, tintas, pigmentos, pinturas. |
| **Colores Primarios** | **R**ed (Rojo), **G**reen (Verde), **B**lue (Azul). | **C**yan (Cian), **M**agenta (Magenta), **Y**ellow (Amarillo) + Blac**K** (Negro). |
| **Principio físico** | Suma de longitudes de onda lumínicas. | Absorción / sustracción de longitudes de onda reflejadas. |
| **Mezcla total** | $R + G + B = \text{Blanco}$ (`#FFFFFF`). | $C + M + Y = \text{Negro}$ / Marrón oscuro (requiere $K$ para negro puro). |
| **Ausencia total** | Oscuridad total (Negro). | Color del soporte base (normalmente papel Blanco). |

---

## 2. Sistemas de Representación del Color en la Web

1. **RGB / RGBA:**
   - `rgb(red, green, blue)`: Valores enteros entre $0$ y $255$.
   - `rgba(r, g, b, a)`: Añade el canal *Alpha* (opacidad) como número decimal entre $0.0$ (totalmente transparente) y $1.0$ (completamente opaco).
2. **Hexadecimal (`#RRGGBB` / `#RRGGBBAA`):**
   - Base 16 ($0-9, A-F$). Cada par de caracteres representa un canal de 8 bits ($16^2 = 256$ intensidades).
   - Ejemplos: `#FF0000` (Rojo puro), `#00FF00` (Verde), `#0000FF` (Azul), `#00000080` (Negro con 50% de opacidad).
3. **HSL / HSLA:**
   - `H` (*Hue* / Tono): Ángulo en el círculo cromático ($0^\circ$ a $360^\circ$: $0^\circ = \text{rojo}$, $120^\circ = \text{verde}$, $240^\circ = \text{azul}$).
   - `S` (*Saturation* / Saturación): $0\%$ (escala de grises pura) a $100\%$ (color vivo).
   - `L` (*Lightness* / Luminosidad): $0\%$ (negro puro), $50\%$ (tono balanceado), $100\%$ (blanco puro).
   - `A` (*Alpha*): Opacidad de $0.0$ a $1.0$.
4. **Otros espacios:** CMYK (impresión), HSV/HSB (herramientas de diseño), YUV (codificación de video).

---

## 3. HTML5 `<canvas>` y la API `CanvasRenderingContext2D`

![Coordenadas Canvas](images/tema3_canvas_coordenadas.png)

- **Elemento `<canvas>`:** Superficie de mapa de bits definida en HTML mediante `<canvas id="miCanvas" width="800" height="600"></canvas>`.
- **Contexto (`CanvasRenderingContext2D`):** Objeto que provee las funciones y estado de renderizado 2D (`const ctx = canvas.getContext('2d')`).
- **Sistema de Coordenadas:**
  - El origen $(0, 0)$ reside en la **esquina superior izquierda**.
  - El eje $X$ crece hacia la **derecha**.
  - El eje $Y$ crece hacia **abajo**.

### Métodos Principales de Dibujo
```javascript
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// 1. Rectángulos directos
ctx.fillStyle = '#FF0000';
ctx.fillRect(10, 10, 100, 50);   // Rectángulo relleno

ctx.strokeStyle = '#000000';
ctx.lineWidth = 2;
ctx.strokeRect(10, 10, 100, 50); // Borde de rectángulo

ctx.clearRect(20, 20, 30, 20);   // Borra píxeles a transparente

// 2. Trazado de Caminos (Paths) y Círculos
ctx.beginPath();
// arc(x, y, radio, anguloInicial, anguloFinal, antihorario)
ctx.arc(200, 150, 50, 0, Math.PI * 2); 
ctx.fillStyle = 'blue';
ctx.fill();
ctx.closePath();

// 3. Gradientes lineales
const gradient = ctx.createLinearGradient(0, 0, 200, 0);
gradient.addColorStop(0, 'red');
gradient.addColorStop(1, 'yellow');
ctx.fillStyle = gradient;
ctx.fillRect(0, 250, 200, 50);

// 4. Patrones de imagen
const pattern = ctx.createPattern(imgElement, 'repeat');
ctx.fillStyle = pattern;
```

---

## 4. Estructura de Memoria de `ImageData`

![Matriz de Píxeles e ImageData](images/tema3_imagen_digital_matriz_pixels.png)

Una imagen digital es conceptualmente una matriz 2D de píxeles ($ancho \times alto$). Sin embargo, la interfaz `ImageData` almacena los píxeles en memoria como un **arreglo lineal unidimensional continuo (`Uint8ClampedArray`)** donde cada píxel ocupa **4 bytes consecutivos** correspondientes al formato RGBA:

```
Índice de memoria:
[ R0, G0, B0, A0,   R1, G1, B1, A1,   R2, G2, B2, A2, ... ]
  └──── Pixel 0 ────┘  └──── Pixel 1 ────┘  └──── Pixel 2 ────┘
```

### Propiedades y Métodos de `ImageData`
- `ctx.createImageData(width, height)`: Crea un buffer en blanco (inicializado en negro transparente `[0,0,0,0]`).
- `ctx.getImageData(sx, sy, sw, sh)`: Extrae una copia de los datos de píxeles de una región del canvas.
- `ctx.putImageData(imageData, dx, dy)`: Vuelca el buffer de píxeles modificado de regreso sobre el canvas.
- `imageData.width` / `imageData.height`: Dimensiones en píxeles.
- `imageData.data`: Objeto `Uint8ClampedArray` de longitud $ancho \times alto \times 4$. Los valores se limitan automáticamente (*clamped*) entre $0$ y $255$.

### Fórmula de Indexación Bidimensional a Unidimensional
Para acceder al píxel ubicado en la coordenada $(x, y)$ dentro de un área de ancho $W$:

$$\text{index} = (y \times W + x) \times 4$$

- Canal Rojo ($R$): `imageData.data[index]`
- Canal Verde ($G$): `imageData.data[index + 1]`
- Canal Azul ($B$): `imageData.data[index + 2]`
- Canal Alpha ($A$): `imageData.data[index + 3]`

---

## 5. Algoritmos de Procesamiento y Filtros de Imagen

### 5.1. Bucle Estándar de Recorrido de Píxeles
```javascript
function aplicarFiltro(ctx, width, height) {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const totalBytes = data.length;

  for (let i = 0; i < totalBytes; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    // Modificar canales aquí...
  }

  // Devolver los píxeles procesados al canvas
  ctx.putImageData(imageData, 0, 0);
}
```

### 5.2. Filtro de Inversión (Negativo)
Invierte la luminosidad de cada canal restando el valor original a $255$:
$$R' = 255 - R, \quad G' = 255 - G, \quad B' = 255 - B$$

```javascript
data[i]     = 255 - r;
data[i + 1] = 255 - g;
data[i + 2] = 255 - b;
```

### 5.3. Filtro de Brillo
Suma o resta una constante $C$ a los tres canales:
$$R' = \min(R + C, 255), \quad G' = \min(G + C, 255), \quad B' = \min(B + C, 255)$$
*(El tipo `Uint8ClampedArray` restringe automáticamente el desbordamiento menor a 0 o mayor a 255).*

```javascript
const brillo = 40;
data[i]     = r + brillo;
data[i + 1] = g + brillo;
data[i + 2] = b + brillo;
```

### 5.4. Filtro de Escala de Grises
Existen dos variantes teóricas:
1. **Promedio Aritmético Simple:**
   $$G_{simple} = \frac{R + G + B}{3}$$
2. **Ponderación Perceptual Luminosa (Recomendada / ITU-R BT.601):**
   $$G_{perceptual} = 0.299 \times R + 0.587 \times G + 0.114 \times B$$
   *Fundamento:* El ojo humano posee mayor concentración de conos sensibles al espectro verde ($58.7\%$), moderada al rojo ($29.9\%$) y muy baja al azul ($11.4\%$).

```javascript
const gris = 0.299 * r + 0.587 * g + 0.114 * b;
data[i]     = gris;
data[i + 1] = gris;
data[i + 2] = gris;
```

---

## 6. Carga Asíncrona de Imágenes y Restricciones de Seguridad

### Carga Asíncrona Correcta
Las imágenes no están disponibles de inmediato al instanciarlas en JS. Debe esperarse obligatoriamente al evento `onload`:

```javascript
const img = new Image();
img.src = 'mi-imagen.jpg';

img.onload = () => {
  // Ahora que la imagen cargó en memoria, se dibuja en el canvas
  ctx.drawImage(img, 0, 0);
  
  // Ahora es seguro acceder a los píxeles:
  const imgData = ctx.getImageData(0, 0, img.width, img.height);
};
```

### Seguridad del Navegador: "Canvas Tainted" (CORS)
- Por políticas de seguridad de origen cruzado (*Same-Origin Policy*), navegadores como Google Chrome **bloquean llamadas a `getImageData()`** si la imagen proviene de otro dominio o si la página se abre mediante el protocolo directo `file:///` local.
- Si se intenta leer píxeles de un canvas con imagen de origen no verificado, el navegador marca el canvas como "contaminado" (*tainted*) y arroja una excepción de seguridad:
  `DOMException: Failed to execute 'getImageData' on 'CanvasRenderingContext2D': The canvas has been tainted by cross-origin data.`
- **Solución:**
  1. Ejecutar el proyecto siempre sobre un servidor HTTP local (ej. `python3 -m http.server` o extensión Live Server).
  2. Habilitar cabeceras CORS en imágenes externas mediante `img.crossOrigin = "Anonymous";`.

