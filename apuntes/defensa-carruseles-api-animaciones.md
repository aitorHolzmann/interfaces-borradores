# Apunte breve para la defensa: carruseles, API y animaciones

## Contexto y requerimiento

La Home presenta un carrusel principal 3D de Peg Solitaire y carruseles horizontales por categoría. Se busca que el movimiento sea visible y suave, que la navegación responda a flechas y gestos, y que la interfaz no quede vacía si la API no está disponible. La implementación usa HTML5, CSS3 y JavaScript Vanilla, sin frameworks.

## Arquitectura de archivos

| Archivo | Responsabilidad |
|---|---|
| [index.html](../index.html) | Estructura del carrusel principal, contenedor del catálogo y orden de carga de scripts. |
| [carousel.js](../js/carousel.js) | Datos locales de respaldo, renderizado de categorías y desplazamiento horizontal finito. |
| [api.js](../js/api.js) | Consulta a la API, caché de sesión y adaptación/clasificación de su respuesta. |
| [carrusel.css](../css/components/carrusel.css) | Escena 3D, transición del carrusel principal y estructura visual de los carruseles horizontales. |
| [cards.css](../css/components/cards.css) | Aspecto y estados hover/focus de las tarjetas. |
| [botones.css](../css/components/botones.css) | Efectos reutilizables para botones, como escala, barrido y glow. |
| [main.js](../js/main.js) | Giro automático y manual del carrusel principal 3D. |
| [auth.js](../js/auth.js) y [login.css](../css/login.css) | Creación del mensaje de éxito y su transición de entrada sin `@keyframes`. |

## Flujo de datos y API

**¿Es un JSON?** Hay dos cosas distintas:

- `CATALOGO_CATEGORIAS`, en `carousel.js`, es un arreglo de objetos JavaScript escrito a mano: sirve como catálogo local de respaldo.
- La API responde datos serializados en JSON. `api.js` los convierte a objetos con `respuesta.json()` y los adapta a las categorías que necesita el renderizador. No hay un archivo JSON local que contenga todo el catálogo.

Flujo resumido:

1. `index.html` carga `api.js` antes que `carousel.js`, de modo que estén definidas las funciones de API al inicializar el catálogo.
2. Al ocurrir `DOMContentLoaded`, `carousel.js` renderiza inmediatamente `CATALOGO_CATEGORIAS`. Así hay contenido aunque la red tarde o no funcione.
3. `obtenerVideojuegosAPI()` revisa `sessionStorage`. Si no encuentra una caché válida de menos de 30 minutos, hace un `fetch()` a la API y comprueba que la respuesta HTTP y los datos sean válidos.
4. `clasificarJuegosEnCategorias()` transforma los juegos recibidos: filtra por rating o género, elige imagen, título y enlace, y arma categorías. También agrega Peg Solitaire a Premium.
5. Si hay datos válidos, `renderizarCatalogo()` vuelve a dibujar las categorías con la respuesta remota. Si falla la consulta, permanece el catálogo local.

**Rol de la API:** proveer un catálogo externo y actualizado; no dibuja la interfaz por sí sola. La página es responsable de adaptar sus datos y presentarlos. La caché reduce consultas repetidas; el respaldo local conserva disponibilidad.

## Animaciones y funcionamiento de los carruseles

### Carrusel principal 3D

Hay tres tarjetas colocadas a $0°$, $120°$ y $240°$. El contenedor aporta `perspective`; `transform-style: preserve-3d` conserva la profundidad; `translateZ()` separa las caras del eje. JavaScript avanza una vista cada cuatro segundos. Las flechas también permiten cambiar de vista manualmente. Se pausa cuando el usuario apunta o enfoca el carrusel, y se reanuda después de la interacción. CSS interpola la rotación con `transition` durante 1,1 segundos; no se usa `@keyframes`.

```js
// El índice recorre las tres vistas y vuelve al principio al completar la vuelta.
indiceCarruselPrincipal = (indiceCarruselPrincipal + direccion + 3) % 3;
anguloCarruselPrincipal -= direccion * 120;

// Cada vista está separada 120 grados; CSS anima el cambio de rotación.
carruselPrincipal.style.transform = `rotateY(${anguloCarruselPrincipal}deg)`;
```

### Carruseles de categorías: movimiento finito

Cada categoría crea una instancia de `CarruselCategoria`, que guarda la pista, su ventana visible, las dos flechas y la posición actual. El recorrido es finito: las tarjetas no se reordenan ni reaparecen al llegar al final y las flechas se deshabilitan en los extremos. Se navega con flechas, sin gesto swipe. Se conserva el efecto `skewX` de las tarjetas durante el movimiento.

Flujo de un clic:

1. La flecha llama a `mover(1)` para avanzar o `mover(-1)` para retroceder.
2. `obtenerPaso()` mide el ancho de una tarjeta y le suma el `gap` CSS.
3. JavaScript calcula el nuevo desplazamiento y lo limita entre cero y `pista.scrollWidth - viewport.clientWidth`.
4. Se asigna `translateX(-desplazamiento)` a la pista. La propiedad CSS `transition` anima el cambio durante 380 ms.
5. `actualizarEstado()` deshabilita la flecha anterior en el inicio y la siguiente al final. Al cambiar el tamaño de la ventana, recalcula el límite.
6. Mientras la pista se mueve, JavaScript agrega `deslizando-sig` o `deslizando-ant`; CSS inclina las tarjetas en el sentido del movimiento. Al terminar la transición de la pista, se quita la clase y las tarjetas regresan a su forma normal.

```js
const paso = this.obtenerPaso();
const maximo = Math.max(0, this.pista.scrollWidth - this.viewport.clientWidth);
this.desplazamiento = Math.max(0, Math.min(this.desplazamiento + paso * direccion, maximo));
this.pista.style.transform = `translateX(-${this.desplazamiento}px)`;
```

### Cómo invertir la dirección

- **Carrusel 3D:** se puede invertir el signo delante del índice en `rotateY()`. El índice sigue limitado a las tres vistas.
- **Carrusel horizontal:** `direccion` vale `1` para avanzar y `-1` para retroceder. Se multiplica por el ancho de tarjeta más el espacio; el límite mantiene la pista dentro de sus extremos.
- **Inclinación de las tarjetas:** `skewX(-8deg)` acompaña el avance y `skewX(8deg)` el retroceso.
- **Velocidad:** se ajusta la duración de la transición; menos tiempo se percibe más rápido. La curva `cubic-bezier` cambia la aceleración y desaceleración, no el sentido.

## Animaciones de botones

Las transiciones describen estados de reposo y hover; el navegador interpola color, escala, sombra o borde cuando el usuario entra o sale del botón. Algunos ejemplos implementados son:

- `.btn-auth-submit` aumenta ligeramente de escala y sombra: efecto de elevación.
- `.btn-card-accion` cambia el fondo, el borde y el glow al pasar el cursor.
- `.carrusel-flecha` aumenta de escala y resalta el fondo y el borde.
- `.btn-efecto-barrido` tiene un pseudo-elemento `::before` que se desplaza de izquierda a derecha.
- `.btn-efecto-glow` cambia radio y resplandor; también se comparte con botones de `.barra-ejecucion`.

**Detalle útil para la defensa:** las clases genéricas `.btn-efecto-barrido` y `.btn-efecto-glow` están definidas en CSS, pero no se encontraron aplicadas por nombre en el HTML/JS. El efecto glow sí se comparte con `.barra-ejecucion button`; no conviene afirmar que el barrido se ve en una pantalla sin antes asignar la clase a un botón.

## Código explicado paso a paso

1. `renderizarCatalogo()` recibe categorías y crea elementos del DOM; por cada categoría genera una pista horizontal y tarjetas a partir de sus juegos.
2. `new CarruselCategoria(carruselContenedor)` conecta las flechas de esa fila.
3. `mover()` calcula el paso, agrega la clase de dirección, aplica la traslación con transición y limita la posición.
4. Cuando termina la transición de la pista, quita la clase de dirección y `actualizarEstado()` deja cada flecha en el estado correcto.
5. En el carrusel 3D, `setInterval()` solicita una vista cada cuatro segundos; JavaScript cambia la rotación y CSS interpola el movimiento.
6. En los botones, la pseudoclase `:hover` cambia el estado visual y `transition` hace fluido el cambio.

## Preguntas posibles de examen (Q&A)

**¿Cómo harías que el carrusel avance al lado contrario?**  
En el 3D uso `direccion` de $1$ o $-1$ para cambiar el índice y sumar/restar $120°$. En el horizontal `direccion` también vale `1` para avanzar y `-1` para retroceder; el límite evita que la pista salga del viewport. El `skewX` cambia de signo para acompañar el sentido.

**¿Qué impide que la pista se salga de sus límites?**  
JavaScript limita el desplazamiento entre cero y el ancho total de la pista menos el ancho visible del viewport. Además, deshabilita la flecha correspondiente al llegar al inicio o al final.

**¿Qué diferencia hay entre `transition` y `@keyframes`?**  
`transition` interpola cuando cambia un estado, como el ángulo al hacer clic. `@keyframes` define una secuencia autónoma de estados. Este carrusel usa `transition` porque el giro depende de una acción/temporizador y se quiere controlar desde JavaScript.

**¿Qué cambia `cubic-bezier`?**  
La distribución de velocidad durante la transición: puede comenzar o terminar más suavemente. No cambia el destino ni la dirección.

**¿Por qué no se dibuja primero esperando a la API?**  
Para mostrar contenido local enseguida y mantener un fallback si hay demora, error o falta de conexión. La API enriquece/reemplaza ese catálogo cuando responde correctamente.

**¿La caché es permanente?**  
No; es `sessionStorage`, asociada a la sesión de esa pestaña, con una vigencia comprobada de 30 minutos.

**¿Cómo aparece el mensaje de éxito de login sin `@keyframes`?**  
JavaScript crea el mensaje con la clase `.mensaje-exito`, cuyo estado inicial tiene opacidad cero y una escala apenas menor. En el siguiente frame añade `.visible`; CSS interpola opacidad y escala mediante `transition`. El resultado es una entrada breve de dos estados, no una secuencia de keyframes.

## Fundamentos UX que puedo mencionar

- **Visibilidad del estado (Nielsen):** flechas, hover y movimiento muestran que la acción fue recibida.
- **Control y libertad (Nielsen):** las flechas permiten avanzar y retroceder; al llegar a un extremo se deshabilita la acción imposible.
- **Ley de Fitts:** botones visibles y de tamaño suficiente facilitan la interacción, especialmente en pantallas táctiles.
- **Continuidad (Gestalt):** el desplazamiento y la perspectiva ayudan a anticipar la dirección y relación de las imágenes.
- **Accesibilidad:** `:focus-visible` permite descubrir acciones con teclado; el texto de las flechas indica su función y `disabled` comunica los límites.

## Pitch de defensa oral

> “Los carruseles se alimentan con datos estructurados: primero mostramos un catálogo local y luego consultamos la API; si la consulta falla, el respaldo permite que la Home siga funcionando. Las categorías tienen pistas horizontales finitas: las flechas desplazan una tarjeta con `translateX`, CSS anima el movimiento durante 380 milisegundos y las tarjetas reciben un `skewX` según la dirección. Al llegar al extremo se deshabilita la flecha correspondiente y no se reciclan elementos. El carrusel principal 3D gira automáticamente cada cuatro segundos, con pausa mientras se interactúa, y también tiene controles manuales. JavaScript define el nuevo estado y CSS interpola la rotación con una transición de 1,1 segundos.”
